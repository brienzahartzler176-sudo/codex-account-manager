@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
echo.
echo CAS 官方登录新账号
echo.
echo 这个脚本会保存当前登录，完整关闭 Codex，再启动官方 codex login。
echo 登录失败时会自动恢复原账号。
echo.
echo 继续前，请先停下正在跑的 Codex 任务。
echo.
pause
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0..\Prepare-Codex-New-Login.ps1" -LaunchCodex
echo.
if errorlevel 1 (
  echo 登录失败，原账号已尽量恢复，请查看上面的错误提示。
) else (
  echo 登录完成，新账号已经自动导入 CAS。
)
echo.
pause
