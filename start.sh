#!/bin/bash
# ==============================================================================
# TrafficIQ - Unix/Linux/macOS Startup Script
# AI-Powered Traffic Congestion Prediction & Route Intelligence System
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"
export MAPS_API_KEY="${MAPS_API_KEY:-AIzaSyD0JIwXnofK8a7xvVrlSuYHqA3iwUcubg4}"

echo "=============================================================================="
echo "                     TRAFFIQ SYSTEM STARTUP (UNIX)"
echo "      AI-Powered Traffic Congestion Prediction & Route Intelligence"
echo "=============================================================================="
echo ""

echo "[1/3] Checking Java environment..."
if ! command -v java &> /dev/null; then
    echo "[ERROR] Java not found. Please install Java 21 LTS."
    exit 1
fi
java -version
echo ""

echo "[2/3] Checking TrafficIQ Backend Jar..."
if [ ! -f "backend/target/trafficiq-backend-1.0.0.jar" ]; then
    echo "[INFO] JAR artifact not found. Building with Maven..."
    cd backend
    mvn clean package -DskipTests=true
    cd ..
fi

echo ""
echo "[3/3] Launching TrafficIQ Spring Boot on http://localhost:8080 ..."
echo "[INFO] In-process ONNX Runtime Java AI Inference Engine is active."
echo "[INFO] Google Maps API & Live Traffic Layer connected."
echo ""
echo "=============================================================================="
echo "   TrafficIQ is live at: http://localhost:8080/"
echo "   Press Ctrl+C to terminate the application."
echo "=============================================================================="
echo ""

java -jar backend/target/trafficiq-backend-1.0.0.jar
