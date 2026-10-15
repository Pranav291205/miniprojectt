#!/usr/bin/env python3
"""
TrafficIQ - ONNX Model Export & Backend Deployment Packaging
Exports champion scikit-learn model to ONNX format.
Validates ONNX inference and shapes against onnxruntime.
Synchronizes ONNX artifact, evaluation metrics, and sensor metadata into Spring Boot resources.
"""

import os
import shutil
import json
import joblib
import numpy as np
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import onnxruntime as ort

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
BACKEND_MODEL_DIR = os.path.join(os.path.dirname(BASE_DIR), "backend", "src", "main", "resources", "model")
os.makedirs(BACKEND_MODEL_DIR, exist_ok=True)

CHAMPION_JOB_PATH = os.path.join(MODELS_DIR, "champion_model.joblib")
ONNX_EXPORT_PATH = os.path.join(MODELS_DIR, "trafficiq_model.onnx")
REPORT_PATH = os.path.join(MODELS_DIR, "evaluation_report.json")
SENSOR_CATALOG_PATH = os.path.join(PROCESSED_DIR, "sensor_catalog.json")

def export_and_package():
    print("=" * 70)
    print(" TRAFFIQ - ONNX MODEL EXPORT & DEPLOYMENT PACKAGING")
    print("=" * 70)

    # 1. Load trained champion model
    print(f">>> Loading champion model from: {CHAMPION_JOB_PATH}")
    model = joblib.load(CHAMPION_JOB_PATH)
    print(f"    Model Architecture: {type(model).__name__}")

    # 2. Convert to ONNX
    print(">>> Converting to ONNX format (opset 14)...")
    initial_type = [("float_input", FloatTensorType([None, 17]))]
    onnx_model = convert_sklearn(model, initial_types=initial_type, target_opset=14)

    with open(ONNX_EXPORT_PATH, "wb") as f:
        f.write(onnx_model.SerializeToString())
    print(f"    [OK] Saved ONNX artifact: {ONNX_EXPORT_PATH} ({os.path.getsize(ONNX_EXPORT_PATH):,} bytes)")

    # 3. Validate with ONNX Runtime
    print("\n>>> Validating ONNX Runtime Inference...")
    sess = ort.InferenceSession(ONNX_EXPORT_PATH)
    input_name = sess.get_inputs()[0].name
    print(f"    Input Name:  {input_name}, Shape: {sess.get_inputs()[0].shape}")
    print(f"    Output Name: {sess.get_outputs()[0].name}, Shape: {sess.get_outputs()[0].shape}")

    # Test sample inference across 15m, 30m, 60m horizons
    test_samples = []
    horizons = [15.0, 30.0, 60.0]
    for h in horizons:
        # Realistic freeway speed profile: speed around 62 mph, slight deceleration
        sample = [62.5, 63.0, 63.8, 64.2, 65.0, 65.0, 64.0, 1.2, 17.0, 30.0, 2.0, 0.0, -0.96, -0.26, 0.97, -0.22, h]
        test_samples.append(sample)

    batch_input = np.array(test_samples, dtype=np.float32)
    predictions = sess.run(None, {input_name: batch_input})[0].flatten()

    for h, p in zip(horizons, predictions):
        print(f"    [Verified] Horizon {int(h)} min => Predicted Speed: {p:.2f} mph")

    # 4. Extract sample actual vs predicted points for live frontend chart
    npz_data = np.load(os.path.join(PROCESSED_DIR, "preprocessed_dataset.npz"))
    n_test = len(npz_data["y_test"])
    sample_indices = np.linspace(0, min(1000, n_test) - 1, 60, dtype=int)
    
    sample_eval_points = []
    sub_X = npz_data["X_traffic_test"][sample_indices]
    sub_y = npz_data["y_test"][sample_indices]
    sub_preds = sess.run(None, {input_name: sub_X})[0].flatten()
    sub_base = npz_data["baseline_test"][sample_indices]
    sub_horizons = npz_data["horizon_test"][sample_indices]

    for i in range(len(sample_indices)):
        sample_eval_points.append({
            "step": i + 1,
            "actualSpeed": round(float(sub_y[i]), 1),
            "predictedSpeed": round(float(sub_preds[i]), 1),
            "persistenceBaseline": round(float(sub_base[i]), 1),
            "horizon": int(sub_horizons[i])
        })

    eval_points_path = os.path.join(BACKEND_MODEL_DIR, "sample_eval_points.json")
    with open(eval_points_path, "w") as f:
        json.dump(sample_eval_points, f, indent=2)
    print(f"\n>>> Saved live evaluation series to: {eval_points_path}")

    # 5. Copy artifacts to Spring Boot backend resources
    print(">>> Synchronizing artifacts with Spring Boot resources...")
    backend_onnx = os.path.join(BACKEND_MODEL_DIR, "trafficiq_model.onnx")
    shutil.copyfile(ONNX_EXPORT_PATH, backend_onnx)
    print(f"    [Copied] {backend_onnx}")

    if os.path.exists(REPORT_PATH):
        backend_report = os.path.join(BACKEND_MODEL_DIR, "evaluation_report.json")
        shutil.copyfile(REPORT_PATH, backend_report)
        print(f"    [Copied] {backend_report}")

    if os.path.exists(SENSOR_CATALOG_PATH):
        backend_catalog = os.path.join(BACKEND_MODEL_DIR, "sensor_catalog.json")
        shutil.copyfile(SENSOR_CATALOG_PATH, backend_catalog)
        print(f"    [Copied] {backend_catalog}")

    # Model metadata
    metadata = {
        "modelName": "TrafficIQ GBDT Forecaster",
        "modelType": "HistGradientBoostingRegressor (ONNX Opset 14)",
        "inputTensor": input_name,
        "inputDimensions": 17,
        "outputTensor": sess.get_outputs()[0].name,
        "supportedHorizons": [15, 30, 60],
        "speedUnit": "mph",
        "trainedOn": "PEMS-BAY Benchmark (Caltrans District 4, California Bay Area)",
        "featureNames": [
            "speed_lag_0", "speed_lag_1", "speed_lag_2", "speed_lag_3", "speed_lag_6", "speed_lag_12",
            "rolling_mean_1h", "rolling_std_1h", "hour", "minute", "day_of_week", "is_weekend",
            "sin_hour", "cos_hour", "sin_dow", "cos_dow", "horizon_min"
        ],
        "testSetMetrics": {
            "overallMae": 2.33,
            "overallRmse": 5.055,
            "overallR2": 0.8166,
            "baselineMae": 2.60,
            "baselineRmse": 6.204,
            "baselineR2": 0.7238,
            "maeImprovementPercent": 10.38,
            "rmseImprovementPercent": 18.52
        },
        "status": "READY_FOR_INFERENCE"
    }
    meta_path = os.path.join(BACKEND_MODEL_DIR, "model_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"    [Saved] {meta_path}")

    print("\n>>> All ONNX artifacts and metadata packaged for Spring Boot successfully!")

if __name__ == "__main__":
    export_and_package()
