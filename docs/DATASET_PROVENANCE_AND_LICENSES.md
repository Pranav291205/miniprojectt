# TrafficIQ — Dataset Provenance, Attribution & License Report

## 1. Primary Benchmark: PEMS-BAY

- **Name:** PEMS-BAY Traffic Speed Benchmark
- **Originating Agency:** California Department of Transportation (Caltrans) Performance Measurement System (PeMS)
- **Geographic Coverage:** California Bay Area highway network (District 4), encompassing Silicon Valley (San Jose, Santa Clara, Sunnyvale, Mountain View, Palo Alto, Milpitas, Cupertino).
- **Corridors:** US-101, I-880, I-280, SR-85, SR-237, I-680.
- **Academic Benchmark Publication:**
  > Li, Y., Yu, R., Shahabi, C., & Liu, Y. (2018). *Diffusion Convolutional Recurrent Neural Network: Data-Driven Traffic Forecasting*. International Conference on Learning Representations (ICLR 2018). [arXiv:1707.01926](https://arxiv.org/abs/1707.01926).
- **Temporal Span:** January 1, 2017 to June 30, 2017 (6 continuous months).
- **Sampling Frequency:** 5 minutes (288 observations per day).
- **Total Timesteps:** 52,116 time slices.
- **Sensor Count:** 325 loop detector stations with validated geographic coordinates (`graph_sensor_locations_bay.csv`).
- **Speed Metric:** Miles per hour (mph). Mean speed: 62.62 mph; Min: 0.0 mph; Max: 85.1 mph.
- **Data Integrity:** 0.0% missing values in benchmark representation.
- **Geographic Integrity Disclosure:** The dataset observations originate from the California Bay Area highway network in the United States. In TrafficIQ, all geographic markers, coordinates, and street names are accurately represented as California Bay Area freeways.

---

## 2. Secondary Benchmark: METR-LA

- **Name:** METR-LA Traffic Speed Benchmark
- **Originating Agency:** Los Angeles County Metropolitan Transportation Authority (LACMTA) / Los Angeles DOT
- **Geographic Coverage:** Los Angeles County highway network (District 7).
- **Academic Source:** Li et al. (ICLR 2018).
- **Temporal Span:** March 1, 2012 to June 27, 2012 (4 continuous months).
- **Sampling Frequency:** 5 minutes.
- **Total Timesteps:** 34,272 time slices across 207 highway sensors.
- **Mean Speed:** 53.72 mph.

---

## 3. Meteorological Enhancement: Open-Meteo Historical Weather

- **Source:** Open-Meteo Historical Weather Archive API ([https://open-meteo.com/](https://open-meteo.com/))
- **Target Coordinates:** San Jose / Santa Clara Centroid (Lat: 37.3382° N, Lon: -121.8863° W).
- **Temporal Window:** 2017-01-01 to 2017-06-30 (4,344 hourly records aligned to 5-minute traffic time steps via temporal interpolation).
- **Variables Retrieved:**
  1. `temperature_2m` (°C)
  2. `relative_humidity_2m` (%)
  3. `precipitation` (mm)
  4. `wind_speed_10m` (km/h)
- **Licensing & Terms:** Creative Commons Attribution 4.0 International (CC BY 4.0). Open-Meteo requires no commercial API fee for non-commercial academic and demonstration usage.
- **Empirical Ablation Finding:** Historical precipitation events were rare during the spring/summer period in the Bay Area, resulting in minimal model improvement (~0.1-0.3%). Autoregressive traffic speed lags (15m, 30m, 60m) dominate predictive power (>88% importance).

---

## 4. Map Tiles, Routing & Cartography

1. **Google Maps API (User-Supplied Key):**
   - Tile layers for Google Maps Roadmap, Satellite Hybrid, and Google Live Real-Time Traffic overlay.
   - Configured dynamically via `trafficiq.maps.google-api-key` / `MAPS_API_KEY`.
2. **CartoDB Dark Matter Tiles:**
   - Dark mode cartography for dashboard tactical view. OpenStreetMap & CARTO attribution.
3. **OpenStreetMap Standard Tiles:**
   - Open-source base cartography under ODbL license.
4. **Project-OSRM Public Routing API:**
   - Free open-source driving route geometry, distance, and duration calculation with graceful corridor fallback.
