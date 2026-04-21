@echo off
echo ========================================
echo   Running Web Store (Frontend + Backend)
echo ========================================
echo.

cd /d "%~dp0frontend"
echo [1/2] Starting Frontend (Vite)...
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
