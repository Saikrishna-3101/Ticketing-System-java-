@echo off
cd /d "%~dp0Backend"
echo Starting Backend...
echo.
call mvnw.cmd spring-boot:run
pause



