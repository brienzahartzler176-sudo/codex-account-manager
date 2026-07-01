param(
  [switch]$LaunchCodex
)

$ErrorActionPreference = "Stop"

$toolRoot = $PSScriptRoot
$dataRoot = Join-Path $toolRoot "data"
$stashRoot = Join-Path $dataRoot "manual-login-stash"
$syncScript = Join-Path $toolRoot "Sync-Current-Codex-To-CAS.ps1"
$authPath = Join-Path $HOME ".codex\auth.json"
$codexAppId = "shell:AppsFolder\OpenAI.Codex_2p2nqsd0c76g0!App"

New-Item -ItemType Directory -Force -Path $dataRoot | Out-Null
New-Item -ItemType Directory -Force -Path $stashRoot | Out-Null

function Write-Step {
  param([string]$Text)
  Write-Host ("[CAS] {0}" -f $Text)
}

function Stop-CodexProcesses {
  foreach ($name in @("Codex", "codex")) {
    foreach ($proc in @(Get-Process -Name $name -ErrorAction SilentlyContinue)) {
      try {
        if (-not $proc.HasExited -and $proc.MainWindowHandle -ne 0) {
          Write-Step ("closing Codex pid={0}" -f $proc.Id)
          $null = $proc.CloseMainWindow()
          if ($proc.WaitForExit(3000)) { continue }
        }
        if (-not $proc.HasExited) {
          Write-Step ("stopping Codex pid={0}" -f $proc.Id)
          Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
      } catch {
      } finally {
        $proc.Dispose()
      }
    }
  }
  Start-Sleep -Milliseconds 800
}

function Start-CodexApp {
  try {
    Start-Process -FilePath "explorer.exe" -ArgumentList $codexAppId | Out-Null
  } catch {
    Start-Process -FilePath "cmd.exe" -ArgumentList ("/c start """" ""{0}""" -f $codexAppId) -WindowStyle Hidden | Out-Null
  }
}

if (Test-Path -LiteralPath $authPath) {
  if (Test-Path -LiteralPath $syncScript) {
    Write-Step "backing up current Codex login to CAS without refreshing quota"
    & powershell -NoProfile -ExecutionPolicy Bypass -File $syncScript -Quiet -NoUsage | Out-Null
  }

  Stop-CodexProcesses

  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $stashPath = Join-Path $stashRoot ("codex-login-stash-{0}.json" -f $stamp)
  Move-Item -LiteralPath $authPath -Destination $stashPath -Force
  Write-Step ("moved local auth.json to {0}" -f $stashPath)
  Write-Step "Codex will ask you to log in again, but the old account was not logged out through the official UI."
} else {
  Write-Step "no current auth.json found; Codex should already ask for login."
}

if ($LaunchCodex) {
  Write-Step "opening Codex"
  Start-CodexApp
}

Write-Step "after logging in the new account, reopen CAS or wait for the watcher to sync auth.json automatically."
