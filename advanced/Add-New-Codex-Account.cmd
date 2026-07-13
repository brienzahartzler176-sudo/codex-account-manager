@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0..\Prepare-Codex-New-Login.ps1" -LaunchCodex
if errorlevel 1 (
  echo.
  echo CAS login failed. Your previous login has been restored when possible.
  pause
)
