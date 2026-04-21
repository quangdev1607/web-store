@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Running Web Store (Frontend + Backend)
echo ========================================
echo.

REM Check and install frontend dependencies if needed
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo Installing Frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
)

echo ========================================
echo   Running Web Store (Frontend + Backend)
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:5000
echo ========================================
echo.
echo Press Ctrl+C to stop all services
echo.

start "WebStore" cmd /k "npm run dev"
echo   Both services are starting!
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:5000
echo ========================================
