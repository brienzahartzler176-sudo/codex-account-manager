@echo off
setlocal
cd /d "%~dp0"
if "%~1"=="" (
  echo 请把 Codex 的 auth.json 文件拖到这个脚本上，或用命令行传入文件路径。
  echo 示例：导入Codex-auth-json到CAS.cmd "C:\Users\%USERNAME%\.codex\auth.json"
  pause
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0..\Sync-Current-Codex-To-CAS.ps1" -AuthPath "%~1" -NoUsage -ClearAbnormal
echo.
echo 已尝试导入：%~1
pause
