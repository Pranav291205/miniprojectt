#!/usr/bin/env python3
"""
TrafficIQ - Automated Dataset Acquisition Script
Downloads and validates PEMS-BAY (primary) and METR-LA (secondary) traffic benchmarks.
Also downloads sensor coordinate metadata for map plotting.
"""

import os
import sys
import json
import urllib.request
import pandas as pd

RAW_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "raw")
os.makedirs(RAW_DIR, exist_ok=True)

DATASET_CONFIG = {
    "pems-bay": {
        "file": "pems-bay.h5",
        "url": "https://drive.google.com/uc?id=1wD-mHlqAb2mtHOe_68fZvDh1LpDegMMq",
        "expected_min_mb": 100,
        "region": "California Bay Area (PEMS District 4)",
        "source": "Li et al., DCRNN (ICLR 2018) / Caltrans PeMS"
    },
    "metr-la": {
        "file": "metr-la.h5",
        "url": "https://drive.google.com/uc?id=172sI_6G_8j8pnb8p4jH9f_e_7QY6v72e",
        "expected_min_mb": 40,
        "region": "Los Angeles County Highway Network",
        "source": "Li et al., DCRNN (ICLR 2018) / Los Angeles DOT"
    }
}

SENSOR_METADATA_URLS = {
    "graph_sensor_locations_bay.csv": "https://raw.githubusercontent.com/liyaguang/DCRNN/master/data/sensor_graph/graph_sensor_locations_bay.csv",
    "graph_sensor_locations.csv": "https://raw.githubusercontent.com/liyaguang/DCRNN/master/data/sensor_graph/graph_sensor_locations.csv"
}

def download_sensor_metadata():
    print(">>> Checking / Downloading sensor metadata...")
    for filename, url in SENSOR_METADATA_URLS.items():
        dest = os.path.join(RAW_DIR, filename)
        if os.path.exists(dest) and os.path.getsize(dest) > 1000:
            print(f"  [OK] Cached: {filename} ({os.path.getsize(dest)} bytes)")
            continue
        try:
            print(f"  Downloading {filename} from {url}...")
            req = urllib.request.Request(url, headers={"User-Agent": "TrafficIQ/1.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                content = resp.read()
                with open(dest, "wb") as f:
                    f.write(content)
            print(f"  [SUCCESS] Downloaded {filename} ({len(content)} bytes)")
        except Exception as e:
            print(f"  [WARN] Failed to download {filename}: {e}")

def verify_datasets():
    print("\n>>> Verifying Traffic Benchmark Datasets...")
    quality_report = {}

    for key, info in DATASET_CONFIG.items():
        filepath = os.path.join(RAW_DIR, info["file"])
        if not os.path.exists(filepath):
            print(f"  [MISSING] {info['file']} not found in {RAW_DIR}")
            print(f"  Attempting gdown download...")
            try:
                import gdown
                gdown.download(info["url"], filepath, quiet=False)
            except Exception as e:
                print(f"  [ERROR] Download failed: {e}")
                continue

        size_mb = os.path.getsize(filepath) / (1024 * 1024)
        print(f"  Found {info['file']}: {size_mb:.2f} MB")

        try:
            df = pd.read_hdf(filepath)
            sensors = len(df.columns)
            timesteps = len(df)
            start_date = str(df.index.min())
            end_date = str(df.index.max())
            missing_rate = float(df.isna().mean().mean())
            mean_speed = float(df.mean().mean())
            min_speed = float(df.min().min())
            max_speed = float(df.max().max())

            report = {
                "file": info["file"],
                "dataset_name": key.upper(),
                "region": info["region"],
                "source": info["source"],
                "file_size_mb": round(size_mb, 2),
                "total_timesteps": timesteps,
                "sensor_count": sensors,
                "sampling_interval": "5 minutes",
                "date_range": {"start": start_date, "end": end_date},
                "speed_unit": "miles per hour (mph)",
                "data_integrity": {
                    "missing_value_ratio": missing_rate,
                    "min_speed": min_speed,
                    "max_speed": max_speed,
                    "mean_speed": round(mean_speed, 2)
                },
                "status": "VALIDATED"
            }
            quality_report[key] = report
            print(f"  [OK] {key.upper()}: {timesteps} steps, {sensors} sensors, {start_date} to {end_date}")
            print(f"       Speed range: [{min_speed}, {max_speed}] mph, Mean: {mean_speed:.2f} mph")
        except Exception as e:
            print(f"  [ERROR] Reading {info['file']}: {e}")

    report_path = os.path.join(RAW_DIR, "data_quality_report.json")
    with open(report_path, "w") as f:
        json.dump(quality_report, f, indent=2)
    print(f"\n>>> Data quality report saved to: {report_path}")
    return quality_report

if __name__ == "__main__":
    download_sensor_metadata()
    verify_datasets()
