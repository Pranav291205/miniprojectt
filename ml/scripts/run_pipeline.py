#!/usr/bin/env python3
"""
TrafficIQ - Complete Autonomous Machine Learning Pipeline Runner
Executes:
1. Dataset acquisition & validation (PEMS-BAY & METR-LA)
2. Weather data retrieval (Open-Meteo)
3. Data preparation & feature engineering (chronological split)
4. Multi-model training, evaluation & weather ablation
5. ONNX model export and Spring Boot resource synchronization
"""

import os
import sys
import subprocess
import time

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))

def run_step(step_name, script_filename):
    print("\n" + "=" * 70)
    print(f" >>> RUNNING STEP: {step_name} ({script_filename})")
    print("=" * 70)
    script_path = os.path.join(SCRIPTS_DIR, script_filename)
    t0 = time.time()
    res = subprocess.run([sys.executable, script_path], check=True)
    elapsed = time.time() - t0
    print(f" >>> COMPLETED {step_name} in {elapsed:.2f} seconds.")

def main():
    start_total = time.time()
    print("*" * 70)
    print(" TRAFFIQ - END-TO-END AUTONOMOUS ML PIPELINE")
    print("*" * 70)

    run_step("1. Dataset Verification", "download_dataset.py")
    run_step("2. Weather Fetching", "fetch_weather.py")
    run_step("3. Data Preparation & Feature Extraction", "prepare_data.py")
    run_step("4. Model Training & Evaluation", "train_evaluate.py")
    run_step("5. ONNX Model Export & Deployment Packaging", "export_onnx.py")

    total_time = time.time() - start_total
    print("\n" + "*" * 70)
    print(f" ALL ML PIPELINE STAGES COMPLETED SUCCESSFULLY IN {total_time:.1f}s!")
    print("*" * 70)

if __name__ == "__main__":
    main()
