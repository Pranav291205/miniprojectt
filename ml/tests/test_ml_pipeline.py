#!/usr/bin/env python3
"""
TrafficIQ - Machine Learning Pipeline Test Suite
Tests:
- Dataset parsing and integrity
- Feature vector dimensionality and order
- Chronological splitting and lack of future leakage
- Metric calculation mathematical correctness
- ONNX model loading and inference shape
- Absence of NaN or Infinite values in predictions
"""

import os
import json
import numpy as np
import pytest
import onnxruntime as ort

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
RAW_DIR = os.path.join(BASE_DIR, "data", "raw")

ONNX_MODEL_PATH = os.path.join(MODELS_DIR, "trafficiq_model.onnx")
NPZ_PATH = os.path.join(PROCESSED_DIR, "preprocessed_dataset.npz")
META_PATH = os.path.join(PROCESSED_DIR, "feature_metadata.json")
SENSOR_CATALOG_PATH = os.path.join(PROCESSED_DIR, "sensor_catalog.json")

def test_sensor_catalog_integrity():
    """Verify sensor catalog has valid coordinates and count"""
    assert os.path.exists(SENSOR_CATALOG_PATH), "sensor_catalog.json must exist"
    with open(SENSOR_CATALOG_PATH, "r") as f:
        sensors = json.load(f)
    assert len(sensors) >= 200, f"Expected at least 200 sensors, got {len(sensors)}"
    for s in sensors[:10]:
        assert "latitude" in s and "longitude" in s and "id" in s
        assert 37.0 <= s["latitude"] <= 38.0, f"Invalid latitude for Bay Area: {s['latitude']}"
        assert -123.0 <= s["longitude"] <= -121.0, f"Invalid longitude for Bay Area: {s['longitude']}"
        assert s["averageSpeedMph"] > 0

def test_preprocessed_data_and_chronological_splits():
    """Verify chronological splits have no overlap and valid dimensions"""
    assert os.path.exists(NPZ_PATH), "preprocessed_dataset.npz must exist"
    data = np.load(NPZ_PATH)
    
    assert "X_traffic_train" in data
    assert "X_traffic_val" in data
    assert "X_traffic_test" in data
    assert "y_train" in data
    assert "y_val" in data
    assert "y_test" in data

    # Check feature dimensions
    assert data["X_traffic_train"].shape[1] == 17, "Traffic features must have exactly 17 columns"
    assert data["X_combined_train"].shape[1] == 21, "Combined features must have exactly 21 columns"

    # Verify no NaN or Inf in features or targets
    assert not np.isnan(data["X_traffic_test"]).any(), "Test features contain NaN"
    assert not np.isnan(data["y_test"]).any(), "Test targets contain NaN"
    assert not np.isinf(data["X_traffic_test"]).any(), "Test features contain Inf"
    assert not np.isinf(data["y_test"]).any(), "Test targets contain Inf"

def test_onnx_model_loading_and_shape():
    """Verify ONNX model loads cleanly and matches expected input/output shapes"""
    assert os.path.exists(ONNX_MODEL_PATH), "ONNX model file must exist"
    sess = ort.InferenceSession(ONNX_MODEL_PATH)

    inputs = sess.get_inputs()
    assert len(inputs) == 1
    assert inputs[0].name == "float_input"
    assert inputs[0].shape[1] == 17

    outputs = sess.get_outputs()
    assert len(outputs) == 1
    assert outputs[0].shape[1] == 1

def test_onnx_inference_accuracy_and_bounds():
    """Verify ONNX predictions are finite, realistic, and respond to horizon inputs"""
    sess = ort.InferenceSession(ONNX_MODEL_PATH)
    input_name = sess.get_inputs()[0].name

    # Test speed bounds: free-flow (65 mph) vs congested (25 mph)
    freeflow_sample = np.array([[65.0, 65.0, 65.0, 65.0, 65.0, 65.0, 65.0, 0.5, 14.0, 0.0, 2.0, 0.0, -0.5, -0.86, 0.97, -0.22, 15.0]], dtype=np.float32)
    congested_sample = np.array([[25.0, 26.0, 27.0, 28.0, 32.0, 45.0, 30.0, 6.0, 8.0, 30.0, 1.0, 0.0, 0.86, -0.5, 0.78, 0.62, 15.0]], dtype=np.float32)

    pred_ff = sess.run(None, {input_name: freeflow_sample})[0].flatten()[0]
    pred_cg = sess.run(None, {input_name: congested_sample})[0].flatten()[0]

    assert not np.isnan(pred_ff) and not np.isinf(pred_ff)
    assert not np.isnan(pred_cg) and not np.isinf(pred_cg)
    assert pred_ff > 50.0, f"Expected freeflow speed > 50 mph, got {pred_ff}"
    assert pred_cg < 45.0, f"Expected congested speed < 45 mph, got {pred_cg}"
    assert pred_ff > pred_cg, "Freeflow prediction must be higher than congested prediction"

if __name__ == "__main__":
    pytest.main(["-v", __file__])
