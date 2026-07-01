$ErrorActionPreference = "Stop"

$toolRoot = $PSScriptRoot
$entry = Join-Path $toolRoot "advanced\Add-New-Codex-Account.cmd"
if (-not (Test-Path -LiteralPath $entry)) {
  throw "Missing entry script: $entry"
}

$protocolRoot = "HKCU:\Software\Classes\cas-new-login"
$commandKey = Join-Path $protocolRoot "shell\open\command"

New-Item -Path $protocolRoot -Force | Out-Null
New-ItemProperty -Path $protocolRoot -Name "(default)" -Value "URL:CAS New Codex Login" -PropertyType String -Force | Out-Null
New-ItemProperty -Path $protocolRoot -Name "URL Protocol" -Value "" -PropertyType String -Force | Out-Null

New-Item -Path $commandKey -Force | Out-Null
$cmd = '"{0}" /d /c ""{1}""' -f (Join-Path $env:SystemRoot "System32\cmd.exe"), $entry
New-ItemProperty -Path $commandKey -Name "(default)" -Value $cmd -PropertyType String -Force | Out-Null

Write-Host "registered cas-new-login protocol"
