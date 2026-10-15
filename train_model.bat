@echo off
REM ==============================================================================
REM TrafficIQ - Reproducible Autonomous ML Training Pipeline Script
REM Executes offline training, multi-horizon evaluation, ablation, and ONNX export
REM ==============================================================================

echo ==============================================================================
echo                TRAFFIQ - MACHINE LEARNING PIPELINE RUNNER
echo ==============================================================================
echo.

cd /d "%~dp0"

echo [1/2] Checking Python environment...
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found on PATH. Please install Python 3.10+ and pip.
    pause
    exit /b 1
)
python --version
echo.

echo [2/2] Running Complete Pipeline (Data Verification, Weather Fetch, Train, Evaluate, ONNX Export)...
python ml\scripts\run_pipeline.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ML Pipeline failed. Please check error output above.
    pause
    exit /b 1
)

echo.
echo ==============================================================================
echo    ML Pipeline Completed Successfully!
echo    Artifacts exported:
echo      - ml\models\trafficiq_model.onnx
echo      - ml\models\evaluation_report.json
echo      - ml\models\actual_vs_predicted.png
echo      - backend\src\main\resources\model\trafficiq_model.onnx
echo ==============================================================================
pause
