@echo off
echo ========================================
echo   Ticketing System - Quick Start
echo ========================================
echo.
echo Starting Backend and Frontend...
echo.
echo Backend will run on: http://localhost:8080
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop
echo.

start "Backend" cmd /k "cd /d %~dp0Backend && mvnw.cmd spring-boot:run"
timeout /t 5 /nobreak >nul
start "Frontend" cmd /k "cd /d %~dp0Frontend && npm run dev"

echo.
echo Both servers are starting...
echo Check the opened windows for status.
echo.
pause



