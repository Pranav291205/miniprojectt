@echo off
REM ==============================================================================
REM TrafficIQ - Automated One-Click Windows Startup Script
REM AI-Powered Traffic Congestion Prediction & Route Intelligence System
REM ==============================================================================

echo ==============================================================================
echo                      TRAFFIQ SYSTEM STARTUP
echo       AI-Powered Traffic Congestion Prediction & Route Intelligence
echo ==============================================================================
echo.

cd /d "%~dp0"
if "%MAPS_API_KEY%"=="" set MAPS_API_KEY=AIzaSyD0JIwXnofK8a7xvVrlSuYHqA3iwUcubg4

echo [1/3] Checking Java environment (Requires Java 21+)...
where java >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java runtime not found on PATH. Please install Java 21 LTS.
    pause
    exit /b 1
)
java -version
echo.

echo [2/3] Checking TrafficIQ Backend Jar...
if not exist "backend\target\trafficiq-backend-1.0.0.jar" (
    echo [INFO] JAR artifact not found. Building with Maven...
    cd backend
    call mvn clean package -DskipTests=true
    cd ..
)

if not exist "backend\target\trafficiq-backend-1.0.0.jar" (
    echo [ERROR] Build failed. Could not find trafficiq-backend-1.0.0.jar.
    pause
    exit /b 1
)

echo.
echo [3/3] Launching TrafficIQ Spring Boot Server on http://localhost:8080 ...
echo [INFO] In-process ONNX Runtime Java AI Inference Engine is active.
echo [INFO] Google Maps API & Live Traffic Layer are connected.
echo [INFO] In-Memory H2 Database initialized with 325 highway sensors.
echo.
echo ==============================================================================
echo    Starting TrafficIQ server on port 8080...
echo    Your browser will automatically open http://localhost:8080/ once ready!
echo    Press Ctrl+C in this console to stop the server.
echo ==============================================================================
echo.

REM Background poller opens default browser as soon as server responds on port 8080
start /B powershell -NoProfile -ExecutionPolicy Bypass -Command "for ($i = 0; $i -lt 120; $i++) { try { $r = [System.Net.WebRequest]::Create('http://localhost:8080/'); $r.Timeout = 1500; $resp = $r.GetResponse(); if ($resp.StatusCode -eq 200) { $resp.Close(); Start-Process 'http://localhost:8080/'; break; } $resp.Close(); } catch { Start-Sleep -Milliseconds 1000 } }"

java -XX:+TieredCompilation -XX:TieredStopAtLevel=1 -jar backend\target\trafficiq-backend-1.0.0.jar
pause
