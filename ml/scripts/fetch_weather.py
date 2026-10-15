#!/usr/bin/env python3
"""
TrafficIQ - Weather Data Acquisition
Retrieves historical hourly weather from Open-Meteo Historical Weather API for the
California Bay Area region corresponding to PEMS-BAY (2017-01-01 to 2017-06-30).
Caches locally to avoid redundant API queries.
"""

import os
import sys
import json
import urllib.request
import pandas as pd

PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "processed")
os.makedirs(PROCESSED_DIR, exist_ok=True)
CACHE_FILE = os.path.join(PROCESSED_DIR, "weather_bay_area_2017.csv")

# Bay Area centroid coordinates (San Jose / Santa Clara core highway junction)
BAY_LAT = 37.3382
BAY_LON = -121.8863
START_DATE = "2017-01-01"
END_DATE = "2017-06-30"

def fetch_weather():
    if os.path.exists(CACHE_FILE) and os.path.getsize(CACHE_FILE) > 5000:
        print(f">>> Weather data already cached at: {CACHE_FILE}")
        df = pd.read_csv(CACHE_FILE, index_col=0, parse_dates=True)
        print(f"    Loaded {len(df)} hourly weather records ({df.index.min()} to {df.index.max()})")
        return df

    print(f">>> Fetching historical weather from Open-Meteo for Bay Area ({BAY_LAT}, {BAY_LON})...")
    url = (
        f"https://archive-api.open-meteo.com/v1/archive?"
        f"latitude={BAY_LAT}&longitude={BAY_LON}&start_date={START_DATE}&end_date={END_DATE}&"
        f"hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=America%2FLos_Angeles"
    )

    req = urllib.request.Request(url, headers={"User-Agent": "TrafficIQ-Research/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        
        hourly = data.get("hourly", {})
        times = pd.to_datetime(hourly.get("time", []))
        weather_df = pd.DataFrame({
            "temperature_2m": hourly.get("temperature_2m", []),
            "relative_humidity_2m": hourly.get("relative_humidity_2m", []),
            "precipitation": hourly.get("precipitation", []),
            "wind_speed_10m": hourly.get("wind_speed_10m", [])
        }, index=times)

        # Forward fill any small gaps safely
        weather_df = weather_df.ffill().bfill()
        weather_df.to_csv(CACHE_FILE)
        print(f">>> [SUCCESS] Saved {len(weather_df)} hourly weather records to {CACHE_FILE}")
        return weather_df
    except Exception as e:
        print(f">>> [WARN] Open-Meteo weather fetch encountered: {e}")
        print("    Will proceed with traffic-only modeling fallback if needed.")
        return None

if __name__ == "__main__":
    fetch_weather()
