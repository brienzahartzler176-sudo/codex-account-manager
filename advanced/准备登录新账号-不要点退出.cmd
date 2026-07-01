@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
echo.
echo CAS 安全登录新账号
echo.
echo 这个脚本会关闭 Codex，把当前本地 auth.json 放到 CAS 保险箱，然后重新打开 Codex。
echo 它不会在 Codex 里点击“退出登录”。
echo.
echo 继续前，请先停下正在跑的 Codex 任务。
echo.
pause
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0..\Prepare-Codex-New-Login.ps1" -LaunchCodex
echo.
echo 如果 Codex 已经打开，请在 Codex 官方登录流程里登录新账号。
echo 登录完成后，重新打开 CAS 即可自动导入最新 auth.json。
echo.
pause
