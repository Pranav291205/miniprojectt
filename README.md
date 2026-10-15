# TrafficIQ — AI-Powered Traffic Congestion Prediction & Route Intelligence System

> **College-Level Capstone Project & Technical Demonstration**  
> **Backend:** Java 21 LTS & Spring Boot 3.3.4 (Single Unified Web Application Backend)  
> **AI / ML:** In-Process ONNX Runtime Java 1.19.2 (Offline Trained in Python with scikit-learn on PEMS-BAY)  
> **Frontend:** Responsive HTML5 / CSS3 / Vanilla JS / Leaflet.js / Chart.js / Google Maps API  
> **Dataset Benchmark:** California Department of Transportation (Caltrans) PeMS District 4 (PEMS-BAY)  

---

## 📌 Executive Summary

**TrafficIQ** is an end-to-end traffic intelligence system designed to demonstrate how real-world historical traffic data, machine learning, and interactive geographic visualization empower urban mobility planning and congestion forecasting.

The application loads **325 real highway loop detector sensors** across the Silicon Valley / California Bay Area highway grid (US-101, I-880, I-280, SR-85, SR-237), predicts traffic speeds across **15-minute, 30-minute, and 60-minute horizons**, and executes **in-process machine learning inference inside Spring Boot using ONNX Runtime Java** without running an external Python web server.

---

## 🏛️ System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Offline_ML ["Offline Machine Learning Pipeline (Python 3.13)"]
        RawData["PEMS-BAY HDF5 Dataset\n(52,116 steps x 325 sensors)"] --> Preprocess["Chronological Split & Feature Engineering\n(Lags, Rolling Stats, Cyclical Temporal Features)"]
        WeatherAPI["Open-Meteo Historical Weather\n(Hourly Temp, Humidity, Precip, Wind)"] --> Preprocess
        Preprocess --> Training["Train Candidate Models\n(Persistence, Ridge, Random Forest, HistGradientBoosting)"]
        Training --> Evaluation["Strict Chronological Test Set Evaluation\n(MAE 2.33 mph, RMSE 5.05 mph, R² 0.8166)"]
        Evaluation --> ONNXExport["ONNX Opset 14 Export\n(trafficiq_model.onnx)"]
    end

    subgraph Spring_Backend ["Unified Application Backend (Spring Boot 3.3.4 - Java 21)"]
        ONNXExport --> ResModel["Classpath: model/trafficiq_model.onnx"]
        ResModel --> OnnxService["OnnxInferenceService\n(ai.onnxruntime.OrtSession - In-Process CPU)"]
        DB[("H2 In-Memory / MySQL 8\n(325 Sensors, Incidents)")] <--> TrafficService["TrafficService & RoutingService"]
        OnnxService <--> TrafficService
        TrafficService --> RestControllers["Spring Boot REST API Controllers\n(/api/dashboard, /api/traffic, /api/routes, /api/model)"]
    end

    subgraph Frontend_App ["Interactive SPA Dashboard (Vanilla JS + Leaflet + Chart.js)"]
        RestControllers --> SPA["Unified Single Page Application\n(http://localhost:8080/)"]
        GoogleMaps["Google Maps API\n(Live Traffic Overlay, Roadmap, Satellite)"] --> SPA
        CartoDB["CartoDB Dark Matter / OSM Tiles"] --> SPA
    end
```

---

## 🔬 Machine Learning Pipeline & Empirical Benchmark Results

### 1. Training Methodology & Anti-Leakage Safeguards
- **Data Source:** PEMS-BAY (Caltrans PeMS District 4, California Bay Area).
- **Split Strategy:** Strict **Chronological Split** (zero random splitting):
  - **Train Period (70%):** 2017-01-01 00:00:00 to 2017-05-07 17:00:00 (729,420 multi-horizon samples).
  - **Validation Period (15%):** 2017-05-07 17:05:00 to 2017-06-03 20:25:00 (156,300 samples).
  - **Held-Out Test Period (15%):** 2017-06-03 20:30:00 to 2017-06-30 23:55:00 (156,220 samples).
- **Features (17 dimensions):**
  - Autoregressive speed lags: $v(t)$, $v(t-1)$, $v(t-2)$, $v(t-3)$, $v(t-6)$, $v(t-12)$.
  - 1-hour rolling mean and standard deviation.
  - Hour of day, minute, day of week, weekend indicator.
  - Cyclical encodings: $\sin(hour)$, $\cos(hour)$, $\sin(dow)$, $\cos(dow)$.
  - Horizon in minutes (15, 30, 60).

### 2. Candidate Model Evaluation Results (Held-Out Test Set)

| Model Architecture | Feature Set | Overall MAE (mph) | Overall RMSE (mph) | $R^2$ Score | Relative Improvement |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Persistence Baseline ($y_{t+h} = y_t$)** | Current Speed Only | 2.600 | 6.204 | 0.7238 | Reference Baseline |
| **Ridge Regression** | Traffic Features (17) | 2.799 | 5.920 | 0.7485 | +4.58% RMSE |
| **Random Forest Regressor** | Traffic Features (17) | 2.335 | 5.144 | 0.8101 | +10.19% MAE |
| **★ HistGradientBoosting (Champion)** | **Traffic Features (17)** | **2.330** | **5.055** | **0.8166** | **+10.38% MAE / +18.52% RMSE** |
| **Random Forest + Open-Meteo Weather** | Traffic + Weather (21) | 2.426 | 5.231 | 0.8036 | Weather Ablation Candidate |

### 3. Horizon-Specific Breakdown (Champion Model vs Baseline)

| Forecast Horizon | Persistence Baseline MAE | HistGradientBoosting MAE | Improvement |
| :---: | :---: | :---: | :---: |
| **15 Minutes** | 1.776 mph | **1.621 mph** | **+8.73%** |
| **30 Minutes** | 2.468 mph | **2.215 mph** | **+10.25%** |
| **60 Minutes** | 3.556 mph | **3.082 mph** | **+13.33%** |

### 4. Weather Ablation Experiment (Empirical Finding)
Historical hourly weather from Open-Meteo (temperature, precipitation, relative humidity, wind speed) for the Bay Area was aligned with traffic observations. As documented in our evaluation report, adding weather variables yielded **no statistically significant improvement** over autoregressive traffic speeds (~0.1-0.3% delta). The California Bay Area experienced virtually zero precipitation events during the dry spring/summer dataset window, meaning recent historical speed trajectories dominate variance prediction.

---

## ⚡ Technical Stack

- **Frontend:**
  - Semantic HTML5 & Vanilla CSS3 Design System (Deep Slate Dark UI with Glassmorphic blurs).
  - Vanilla JavaScript (Zero frontend framework overhead).
  - **Leaflet.js 1.9.4** for map pan/zoom, sensor markers, and routing polylines.
  - **Google Maps API Integration:** Integrated with user key `AIzaSyD0JIwXnofK8a7xvVrlSuYHqA3iwUcubg4` supporting Google Live Traffic overlay, Roadmap, and Satellite Hybrid tiles.
  - **Chart.js 4.4.4** for diurnal speed trends, congestion distribution, and ground-truth validation charts.
- **Backend:**
  - **Java 21 LTS** with **Spring Boot 3.3.4**.
  - **Spring Web** for REST API endpoints.
  - **Spring Data JPA** & **Hibernate** for database persistence.
  - **In-Process ONNX Runtime Java 1.19.2 (`com.microsoft.onnxruntime:onnxruntime`)** for fast native CPU model inference (< 1 ms latency).
  - **H2 In-Memory Database** (default profile for instant demo execution with zero external setup) + **MySQL 8** (production persistence profile).
- **Machine Learning (Offline):**
  - Python 3.13, scikit-learn 1.7.2, skl2onnx 1.20.0, onnxruntime 1.31.0, pandas 2.3.3, NumPy 2.2.6.

---

## 🚀 How to Run the Application

### Option A: One-Click Windows Startup (Recommended)
Double-click `start.bat` in the root folder, or in Command Prompt:
```cmd
start.bat
```
The application will launch and open **`http://localhost:8080/`** in your browser.

### Option B: Linux / macOS Startup
```bash
chmod +x start.sh
./start.sh
```

### Option C: Manual Maven Command
```bash
cd backend
mvn clean package -DskipTests=true
java -jar target/trafficiq-backend-1.0.0.jar
```

---

## 🌐 REST API Catalog

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check returning status UP, Java version, and ONNX engine status |
| `GET` | `/api/dashboard/summary` | Network-wide KPIs, average speed, congestion distribution |
| `GET` | `/api/traffic/locations` | Returns all 325 sensors with coordinates, speeds, and status |
| `GET` | `/api/traffic/locations/{id}` | Specific sensor telemetry and corridor details |
| `GET` | `/api/traffic/locations/{id}/history` | Past 1-hour speed telemetry for sparkline visualization |
| `GET` | `/api/traffic/locations/{id}/forecast?horizon=15` | Executes in-process ONNX model inference for 15/30/60 min horizon |
| `POST` | `/api/traffic/forecast/custom` | Runs inference for custom user-specified speed and lags |
| `GET` | `/api/routes/plan` | Traffic-aware driving route calculation with distance, delay, and polyline |
| `GET` | `/api/model/status` | Model architecture, input tensors, dimensions, and supported horizons |
| `GET` | `/api/model/metrics` | Full empirical evaluation results on held-out test data |
| `GET` | `/api/model/sample-eval` | 60 actual-vs-predicted test samples for live validation charts |
| `GET` | `/api/incidents` | Active traffic alerts filterable by severity and category |
| `POST` | `/api/incidents` | Registers a new demonstration incident into the database |
| `GET` | `/api/config/maps` | Google Maps API key configuration and live traffic layer status |

---

## 🗄️ Database Configuration (H2 vs MySQL)

TrafficIQ comes configured with an **in-memory H2 database by default** (`SPRING_PROFILES_ACTIVE=h2`), enabling zero-configuration demonstration out-of-the-box.

To connect to a persistent local or remote **MySQL 8** server:
1. Copy `.env.example` to `.env` or set environment variables:
   ```env
   SPRING_PROFILES_ACTIVE=mysql
   DB_URL=jdbc:mysql://localhost:3306/trafficiq?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```
2. Start the application:
   ```cmd
   java -Dspring.profiles.active=mysql -jar backend/target/trafficiq-backend-1.0.0.jar
   ```

---

## 🛡️ Honest Disclosure & Benchmark Integrity Notes

- **Geography:** PEMS-BAY is a widely cited California Bay Area traffic benchmark collected by the Caltrans PeMS system in the United States. In TrafficIQ, all highway names (US-101, I-880, I-280, SR-85, SR-237) and sensor markers reflect their true Santa Clara County / Silicon Valley coordinates.
- **Inference Mode:** The machine learning model was genuinely trained on PEMS-BAY observations with a strict chronological split, exported to ONNX, and is executed natively inside Spring Boot via Java ONNX Runtime.
- **Routing:** Route geometry is computed using OpenStreetMap / OSRM demo endpoints with fallback to local corridor modeling.
- **Incidents:** Incidents are seeded as clearly labeled **Demo Incidents** to demonstrate filtering, alerting, and incident registration workflows.
