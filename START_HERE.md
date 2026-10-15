# 🚀 START HERE — Running TrafficIQ

Welcome to **TrafficIQ** (*AI-Powered Traffic Congestion Prediction & Route Intelligence System*).  
This application has been built, trained, tested, and packaged for college evaluation.

---

## ⚡ Quickest Way to Run (1-Click)

### On Windows:
Double-click:
```cmd
start.bat
```
*That's it!*  
The script verifies Java 21, starts the Spring Boot backend server with the in-process ONNX AI model and embedded H2 database, and automatically opens your browser to:
👉 **[http://localhost:8080/](http://localhost:8080/)**

### On Linux / macOS:
Open a terminal in the project directory and run:
```bash
chmod +x start.sh
./start.sh
```

---

## 🧭 Live Demo Tour

Once the application opens in your browser at `http://localhost:8080/`:

1. **Dashboard Overview (Default Page):**
   - View high-level KPIs: **325 Highway Sensors**, **Average Network Speed**, **Congestion Status**, and **ONNX AI Status**.
   - See the **24-Hour Diurnal Speed Trend chart** and **Congestion Distribution donut chart**.
   - Inspect the **Silicon Valley Highway Corridors table** and click **"Predict"** on any sensor.

2. **Interactive Traffic Map (Tab 2):**
   - Explore the California Bay Area highway grid (US-101, I-880, I-280, SR-85, SR-237).
   - Use the **Map Style** dropdown to toggle between:
     - 🚦 **Google Live Traffic** (using your Google Maps API key)
     - 🌙 **Tactical Dark Mode**
     - 🛰️ **Google Satellite Hybrid**
     - 🗺️ **Google Roadmap**
   - Click on any of the **325 sensor markers** to view live speed telemetry in the right drawer.
   - Click **"Run 15-Min AI Forecast"** in the drawer to see real-time in-process prediction in ~1 ms!

3. **AI Forecaster Studio (Tab 3):**
   - Select any highway sensor from the dropdown.
   - Choose a forecast horizon: **15 Minutes**, **30 Minutes**, or **60 Minutes**.
   - Adjust observed speed if you want to simulate custom congestion scenarios.
   - Click **"Compute AI Congestion Forecast"** to execute the trained ONNX model and view predicted speed, congestion class, and persistence baseline comparison.

4. **Route Intelligence Planner (Tab 4):**
   - Select origin and destination points (e.g. *Downtown San Jose* to *Mountain View Tech Corridor*).
   - Click **"Calculate Traffic-Aware Route"**.
   - View driving distance, estimated duration, congestion delay, corridor segment breakdown, and route line on the map.

5. **Model Analytics & Empirical Benchmarks (Tab 5):**
   - Review the evaluation table comparing our champion **HistGradientBoosting** model (MAE 2.33 mph, RMSE 5.05 mph, R² 0.8166) against the Persistence Baseline (MAE 2.60 mph) — a **10.38% improvement**.
   - View the **Actual vs Predicted Ground Truth curve** on held-out test data.
   - Read the **Weather Ablation Experiment report** analyzing Open-Meteo historical weather impact.

6. **Active Incidents & Alerts (Tab 6):**
   - Filter active incidents by severity (Low, Medium, High, Severe).
   - Click **"+ Report Demo Incident"** to register a simulated incident that immediately persists to the database.

7. **System Status & Settings (Tab 7):**
   - Check runtime health: Spring Boot 3.3.4, Java 21 LTS, in-process ONNX Runtime Java, database mode, and Google Maps API status.

---

## 🛠️ Optional: Retraining the ML Model from Scratch

To retrain the machine learning model offline on the real PEMS-BAY dataset:
```cmd
train_model.bat
```
or via Python:
```bash
python ml/scripts/run_pipeline.py
```
This runs dataset verification, weather downloading, chronological train/test splitting, training of all 5 candidate models, evaluation, and automatic ONNX model export into the Spring Boot backend!

---

## 🗄️ Database Profiles

- **Default (Zero Setup):** Runs on H2 in-memory mode (`SPRING_PROFILES_ACTIVE=h2`). Nothing to install or configure!
- **Persistent MySQL:** Set `SPRING_PROFILES_ACTIVE=mysql` in `.env` or run:
  ```bash
  java -Dspring.profiles.active=mysql -jar backend/target/trafficiq-backend-1.0.0.jar
  ```
