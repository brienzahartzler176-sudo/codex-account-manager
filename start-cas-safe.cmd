@echo off
setlocal
set "CAS_PORTABLE=1"
set "CAS_SHIM_RESTART_CODEX=1"
set "WEBVIEW2_USER_DATA_FOLDER=%~dp0data\webview2"
set "PATH=%~dp0codex-shim;%PATH%"
cd /d "%~dp0"
if not exist "%~dp0data\webview2" mkdir "%~dp0data\webview2" >nul 2>nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Register-CAS-NewLogin-Protocol.ps1" >nul 2>nul
taskkill /IM _Codex_AccountSwitch_internal.exe /F >nul 2>nul
taskkill /IM Codex_AccountSwitch.exe /F >nul 2>nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process | Where-Object { $_.Name -in @('powershell.exe','pwsh.exe') -and $_.CommandLine -like '*Start-CAS-Auth-Watcher.ps1*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }" >nul 2>nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process | Where-Object { $_.Name -in @('powershell.exe','pwsh.exe') -and $_.CommandLine -like '*Start-CAS-Metadata-Server.ps1*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }" >nul 2>nul
del "%~dp0data\cas-auth-watcher.pid" >nul 2>nul
del "%~dp0data\cas-metadata-server.pid" >nul 2>nul
timeout /t 1 /nobreak >nul 2>nul
start "" /MIN powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0Start-CAS-Metadata-Server.ps1" >nul 2>nul
start "" "%~dp0_Codex_AccountSwitch_internal.exe"
start "" /MIN powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0Set-CAS-WindowTitle.ps1" >nul 2>nul
wscript.exe "%~dp0Start-CAS-Auth-Watcher.vbs" >nul 2>nul
