@echo off
setlocal
cd /d "%~dp0"

where powershell.exe >nul 2>nul
if errorlevel 1 (
  echo PowerShell is required to start codex account manager.
  echo Please use Windows 10/11 or enable Windows PowerShell.
  pause
  exit /b 1
)

call "%~dp0start-cas-safe.cmd"
