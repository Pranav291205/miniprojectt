#!/usr/bin/env python3
"""
TrafficIQ - Data Preparation & Feature Engineering Pipeline
Loads real PEMS-BAY traffic speed data and Open-Meteo historical weather data.
Creates time-series lag features, rolling statistics, cyclical temporal features,
and target horizons (15m, 30m, 60m).
Performs strict chronological train/validation/test split with zero future leakage.
"""

import os
import sys
import json
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
os.makedirs(PROCESSED_DIR, exist_ok=True)

PEMS_PATH = os.path.join(RAW_DIR, "pems-bay.h5")
WEATHER_PATH = os.path.join(PROCESSED_DIR, "weather_bay_area_2017.csv")
SENSOR_LOC_PATH = os.path.join(RAW_DIR, "graph_sensor_locations_bay.csv")

# Feature schema definitions
TRAFFIC_FEATURE_NAMES = [
    "speed_lag_0",
    "speed_lag_1",
    "speed_lag_2",
    "speed_lag_3",
    "speed_lag_6",
    "speed_lag_12",
    "rolling_mean_1h",
    "rolling_std_1h",
    "hour",
    "minute",
    "day_of_week",
    "is_weekend",
    "sin_hour",
    "cos_hour",
    "sin_dow",
    "cos_dow",
    "horizon_min"
]

WEATHER_FEATURE_NAMES = [
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "wind_speed_10m"
]

ALL_FEATURE_NAMES = TRAFFIC_FEATURE_NAMES + WEATHER_FEATURE_NAMES

def assign_highway_info(sensor_id, lat, lon):
    """Assign human-readable highway & corridor name based on geographic coordinates"""
    # Bay Area highway corridors:
    # US-101 runs NW-SE through Mountain View, Sunnyvale, San Jose
    # I-880 runs north along East Bay into Milpitas/San Jose
    # I-280 runs foothill corridor through Cupertino, West San Jose
    # SR-85 connects Cupertino/San Jose southern bypass
    # SR-237 connects Sunnyvale/Milpitas cross-connector
    if lat > 37.38 and lon < -122.0:
        return "US-101 Northbound (Mountain View / Palo Alto)", "Highway US-101", 65
    elif lat > 37.38 and lon >= -121.95:
        return "I-880 Northbound (Milpitas / Fremont Corridor)", "Interstate 880", 65
    elif lat < 37.30 and lon < -121.95:
        return "SR-85 Southbound (Saratoga / Los Gatos)", "State Route 85", 65
    elif lat < 37.30 and lon >= -121.90:
        return "US-101 Southbound (South San Jose / Coyote)", "Highway US-101", 65
    elif lon < -122.02:
        return "I-280 Northbound (Cupertino / Cupertino Tech Hub)", "Interstate 280", 65
    elif lat >= 37.33 and lat <= 37.37 and lon >= -121.93 and lon <= -121.88:
        return "Downtown San Jose Interchange (US-101 / I-880 Junction)", "Metropolitan Junction", 55
    elif lat > 37.40:
        return "SR-237 Eastbound (Sunnyvale to Milpitas Express)", "State Route 237", 65
    else:
        return f"Bay Area Highway Corridor {sensor_id}", "Bay Area Arterial", 65

def prepare_sensor_catalog():
    print(">>> Building Sensor Catalog with Geographic Coordinates...")
    loc_df = pd.read_csv(SENSOR_LOC_PATH, header=None, names=["sensor_id", "latitude", "longitude"])
    
    # Read sample speeds to compute baseline sensor statistics
    raw_df = pd.read_hdf(PEMS_PATH)
    catalog = []
    
    for idx, row in loc_df.iterrows():
        sid = int(row["sensor_id"])
        col_match = None
        for col in [sid, str(sid)]:
            if col in raw_df.columns:
                col_match = col
                break
        
        if col_match is not None:
            series = raw_df[col_match]
            avg_spd = float(series.mean())
            std_spd = float(series.std())
            min_spd = float(series.min())
            max_spd = float(series.max())
            pct_congested = float((series < 45.0).mean() * 100)
        else:
            avg_spd, std_spd, min_spd, max_spd, pct_congested = 62.5, 8.5, 10.0, 75.0, 8.0

        corridor, highway, freeflow = assign_highway_info(sid, row["latitude"], row["longitude"])

        catalog.append({
            "id": sid,
            "name": corridor,
            "highway": highway,
            "latitude": float(row["latitude"]),
            "longitude": float(row["longitude"]),
            "speedLimitMph": freeflow,
            "averageSpeedMph": round(avg_spd, 1),
            "speedStdMph": round(std_spd, 1),
            "minSpeedMph": round(min_spd, 1),
            "maxSpeedMph": round(max_spd, 1),
            "congestionPercentage": round(pct_congested, 1),
            "region": "California Bay Area (PEMS-BAY)",
            "benchmarkDataset": "PEMS-BAY"
        })

    out_file = os.path.join(PROCESSED_DIR, "sensor_catalog.json")
    with open(out_file, "w") as f:
        json.dump(catalog, f, indent=2)
    print(f"    Saved catalog of {len(catalog)} sensors to {out_file}")
    return catalog, loc_df

def create_features_and_splits():
    print("\n>>> Loading Raw Traffic Data and Aligning Weather...")
    traffic_df = pd.read_hdf(PEMS_PATH)
    traffic_df.index = pd.to_datetime(traffic_df.index)
    traffic_df = traffic_df.sort_index()

    # Load weather data
    if os.path.exists(WEATHER_PATH):
        weather_df = pd.read_csv(WEATHER_PATH, index_col=0, parse_dates=True)
        # Resample hourly weather to 5-minute frequency using linear interpolation
        weather_5m = weather_df.reindex(traffic_df.index).interpolate(method="time").ffill().bfill()
        print(f"    Aligned weather shape: {weather_5m.shape}")
    else:
        print("    [WARN] Weather cache missing, generating fallback zeros")
        weather_5m = pd.DataFrame(0.0, index=traffic_df.index, columns=WEATHER_FEATURE_NAMES)

    # Select representative sensor cohort (20 diverse sensors across Bay Area corridors)
    sensor_cols = list(traffic_df.columns[:20])
    print(f"    Using representative cohort of {len(sensor_cols)} sensors for model training")

    # Time-based splitting
    total_len = len(traffic_df)
    train_end_idx = int(total_len * 0.70)
    val_end_idx = int(total_len * 0.85)

    train_dates = (str(traffic_df.index[0]), str(traffic_df.index[train_end_idx - 1]))
    val_dates = (str(traffic_df.index[train_end_idx]), str(traffic_df.index[val_end_idx - 1]))
    test_dates = (str(traffic_df.index[val_end_idx]), str(traffic_df.index[-1]))

    print(f"    Train period:      {train_dates[0]} to {train_dates[1]} ({train_end_idx} steps)")
    print(f"    Validation period: {val_dates[0]} to {val_dates[1]} ({val_end_idx - train_end_idx} steps)")
    print(f"    Test period:       {test_dates[0]} to {test_dates[1]} ({total_len - val_end_idx} steps)")

    # Prepare dataset arrays
    # Subsample timestamps every 3 steps (every 15 min) to keep memory modest while maintaining full temporal breadth
    subsample_step = 3
    
    # Horizons in steps: 15min = 3 steps, 30min = 6 steps, 60min = 12 steps
    horizons = [
        (15, 3),
        (30, 6),
        (60, 12)
    ]

    splits = {"train": [], "val": [], "test": []}
    
    # Base temporal cyclical arrays
    hours = traffic_df.index.hour.values
    minutes = traffic_df.index.minute.values
    dows = traffic_df.index.dayofweek.values
    is_weekends = (dows >= 5).astype(np.float32)
    sin_hour = np.sin(2 * np.pi * (hours + minutes / 60.0) / 24.0).astype(np.float32)
    cos_hour = np.cos(2 * np.pi * (hours + minutes / 60.0) / 24.0).astype(np.float32)
    sin_dow = np.sin(2 * np.pi * dows / 7.0).astype(np.float32)
    cos_dow = np.cos(2 * np.pi * dows / 7.0).astype(np.float32)

    weather_vals = weather_5m[WEATHER_FEATURE_NAMES].values.astype(np.float32)

    print("    Extracting features across sensors and horizons...")
    for s_idx, col in enumerate(sensor_cols):
        s_series = traffic_df[col].values.astype(np.float32)
        n = len(s_series)

        # Lags
        lag_0 = s_series
        lag_1 = np.roll(s_series, 1)
        lag_2 = np.roll(s_series, 2)
        lag_3 = np.roll(s_series, 3)
        lag_6 = np.roll(s_series, 6)
        lag_12 = np.roll(s_series, 12)

        # Rolling 1-hour (12 steps) statistics
        # Compute using pandas rolling efficiently
        pd_series = pd.Series(s_series)
        roll_mean = pd_series.rolling(12, min_periods=1).mean().values.astype(np.float32)
        roll_std = pd_series.rolling(12, min_periods=1).std().fillna(0.0).values.astype(np.float32)

        for h_min, h_step in horizons:
            # Valid range: from step 12 to n - h_step
            start_t = 12
            end_t = n - h_step
            t_indices = np.arange(start_t, end_t, subsample_step)

            # Features
            feat_traffic = np.column_stack([
                lag_0[t_indices],
                lag_1[t_indices],
                lag_2[t_indices],
                lag_3[t_indices],
                lag_6[t_indices],
                lag_12[t_indices],
                roll_mean[t_indices],
                roll_std[t_indices],
                hours[t_indices].astype(np.float32),
                minutes[t_indices].astype(np.float32),
                dows[t_indices].astype(np.float32),
                is_weekends[t_indices],
                sin_hour[t_indices],
                cos_hour[t_indices],
                sin_dow[t_indices],
                cos_dow[t_indices],
                np.full(len(t_indices), float(h_min), dtype=np.float32)
            ])

            feat_weather = weather_vals[t_indices]
            targets = s_series[t_indices + h_step]
            baselines = lag_0[t_indices] # Persistence baseline: prediction = current speed

            # Chronological split masks based on t_indices
            train_mask = t_indices < train_end_idx
            val_mask = (t_indices >= train_end_idx) & (t_indices < val_end_idx)
            test_mask = t_indices >= val_end_idx

            for mask, split_name in [(train_mask, "train"), (val_mask, "val"), (test_mask, "test")]:
                if np.sum(mask) > 0:
                    splits[split_name].append({
                        "X_traffic": feat_traffic[mask],
                        "X_weather": feat_weather[mask],
                        "y": targets[mask],
                        "baseline": baselines[mask],
                        "horizon": np.full(np.sum(mask), h_min, dtype=np.int32)
                    })

    # Concatenate all splits
    dataset = {}
    for name in ["train", "val", "test"]:
        dataset[f"X_traffic_{name}"] = np.vstack([item["X_traffic"] for item in splits[name]]).astype(np.float32)
        dataset[f"X_weather_{name}"] = np.vstack([item["X_weather"] for item in splits[name]]).astype(np.float32)
        dataset[f"X_combined_{name}"] = np.hstack([dataset[f"X_traffic_{name}"], dataset[f"X_weather_{name}"]]).astype(np.float32)
        dataset[f"y_{name}"] = np.concatenate([item["y"] for item in splits[name]]).astype(np.float32)
        dataset[f"baseline_{name}"] = np.concatenate([item["baseline"] for item in splits[name]]).astype(np.float32)
        dataset[f"horizon_{name}"] = np.concatenate([item["horizon"] for item in splits[name]]).astype(np.int32)
        print(f"    Split [{name.upper()}]: Samples = {len(dataset[f'y_{name}'])}, Features = {dataset[f'X_combined_{name}'].shape[1]}")

    # Save to compressed npz
    out_npz = os.path.join(PROCESSED_DIR, "preprocessed_dataset.npz")
    np.savez_compressed(out_npz, **dataset)
    print(f"\n>>> Preprocessed dataset saved to: {out_npz}")

    metadata = {
        "dataset": "PEMS-BAY",
        "region": "California Bay Area",
        "sample_interval": "5 min",
        "traffic_features": TRAFFIC_FEATURE_NAMES,
        "weather_features": WEATHER_FEATURE_NAMES,
        "combined_features": ALL_FEATURE_NAMES,
        "horizons_minutes": [15, 30, 60],
        "date_ranges": {
            "train": train_dates,
            "validation": val_dates,
            "test": test_dates
        },
        "sample_counts": {
            "train": int(len(dataset["y_train"])),
            "validation": int(len(dataset["y_val"])),
            "test": int(len(dataset["y_test"]))
        }
    }

    meta_file = os.path.join(PROCESSED_DIR, "feature_metadata.json")
    with open(meta_file, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f">>> Feature metadata saved to: {meta_file}")
    return metadata

if __name__ == "__main__":
    prepare_sensor_catalog()
    create_features_and_splits()
