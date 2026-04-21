@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Running Web Store (Frontend + Backend)
echo ========================================
echo.

REM Check and install frontend dependencies if needed
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo [1/2] Installing Frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
) else (
    echo [1/2] Frontend dependencies already installed
)

echo Starting Frontend (Vite)...
start "Frontend" cmd /k "npm run dev"

cd /d "%~dp0backend"
echo [2/2] Starting Backend (.NET API)...
start "Backend" cmd /k "dotnet run"

echo.
echo ========================================
echo   Both services are starting!
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:5000
echo ========================================
