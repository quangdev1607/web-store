# Web Store Development Script
# Run both Frontend and Backend simultaneously

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Running Web Store (Frontend + Backend)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$FrontendPath = Join-Path $PSScriptRoot "frontend"
$BackendPath = Join-Path $PSScriptRoot "backend"

# Check and install frontend dependencies if needed
Write-Host "[1/2] Checking Frontend dependencies..." -ForegroundColor Yellow
if (-not (Test-Path (Join-Path $FrontendPath "node_modules"))) {
    Write-Host "  Installing dependencies..." -ForegroundColor Gray
    Push-Location $FrontendPath
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: npm install failed!" -ForegroundColor Red
        Pop-Location
        pause
        exit 1
    }
    Pop-Location
    Write-Host "  Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "  Dependencies already installed" -ForegroundColor Green
}

Write-Host "Starting Frontend (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendPath'; npm run dev" -WindowStyle Normal

# Start Backend
Write-Host "[2/2] Starting Backend (.NET API)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendPath'; dotnet run" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Both services are starting!" -ForegroundColor Green
Write-Host "  - Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "  - Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
