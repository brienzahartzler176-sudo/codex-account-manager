[CmdletBinding()]
param(
  [switch]$Once
)

$ErrorActionPreference = "Stop"

$toolRoot = $PSScriptRoot
$dataRoot = Join-Path $toolRoot "data"
$pidPath = Join-Path $dataRoot "cas-auth-watcher.pid"
$logPath = Join-Path $dataRoot "cas-auth-watcher.log"
$lastHashPath = Join-Path $dataRoot "cas-auth-last-hash.txt"
$loginLockPath = Join-Path $dataRoot "login-operation.lock"
$syncScript = Join-Path $toolRoot "Sync-Current-Codex-To-CAS.ps1"
$authPath = Join-Path $HOME ".codex\auth.json"
$authDirectory = Split-Path -Parent $authPath
$powershellExe = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
$casCheckIntervalSeconds = 5
$cleanupIntervalSeconds = 1800

New-Item -ItemType Directory -Force -Path $dataRoot | Out-Null
New-Item -ItemType Directory -Force -Path $authDirectory | Out-Null

function Write-WatcherLog {
  param([string]$Message)
  try {
    $line = "{0} {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss.fff"), $Message
    Add-Content -LiteralPath $logPath -Value $line -Encoding UTF8
  } catch {}
}

function Test-WatcherProcess {
  param([int]$ProcessId)
  try {
    $proc = Get-CimInstance Win32_Process -Filter ("ProcessId={0}" -f $ProcessId) -ErrorAction Stop
    if (-not $proc) { return $false }
    return (($proc.CommandLine -as [string]) -like "*Start-CAS-Auth-Watcher.ps1*")
  } catch {
    return $false
  }
}

function Get-AuthHash {
  if (-not (Test-Path -LiteralPath $authPath)) { return "" }
  try { return (Get-FileHash -LiteralPath $authPath -Algorithm SHA256).Hash } catch { return "" }
}

function Get-LastSyncedAuthHash {
  if (-not (Test-Path -LiteralPath $lastHashPath)) { return "" }
  try { return (Get-Content -LiteralPath $lastHashPath -Raw).Trim() } catch { return "" }
}

function Set-LastSyncedAuthHash {
  param([string]$Hash)
  if ([string]::IsNullOrWhiteSpace($Hash)) { return }
  try { $Hash | Set-Content -LiteralPath $lastHashPath -Encoding ASCII } catch {}
}

function Test-LoginOperationActive {
  if (-not (Test-Path -LiteralPath $loginLockPath)) { return $false }
  try {
    $ageMinutes = ((Get-Date) - (Get-Item -LiteralPath $loginLockPath).LastWriteTime).TotalMinutes
    if ($ageMinutes -le 20) { return $true }
    Remove-Item -LiteralPath $loginLockPath -Force -ErrorAction SilentlyContinue
    Write-WatcherLog "stale login operation lock removed"
  } catch {
    return $true
  }
  return $false
}

function Test-CasRunning {
  $cas = @(Get-Process -Name "_Codex_AccountSwitch_internal" -ErrorAction SilentlyContinue)
  if ($cas.Count -gt 0) { return $true }
  $cas = @(Get-Process -Name "Codex_AccountSwitch" -ErrorAction SilentlyContinue)
  return ($cas.Count -gt 0)
}

function Invoke-Sync {
  if (-not (Test-Path -LiteralPath $syncScript)) {
    Write-WatcherLog "sync skipped: script missing"
    return $false
  }
  if (Test-LoginOperationActive) {
    Write-WatcherLog "sync deferred: interactive login is active"
    return $false
  }

  try {
    & $powershellExe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $syncScript -Quiet -NoUsage -ClearAbnormal | Out-Null
    Write-WatcherLog ("sync finished: exit={0}" -f $LASTEXITCODE)
    return ($LASTEXITCODE -eq 0)
  } catch {
    Write-WatcherLog ("sync failed: {0}" -f $_.Exception.Message)
    return $false
  }
}

function Invoke-Cleanup {
  if (-not (Test-Path -LiteralPath $syncScript)) {
    Write-WatcherLog "cleanup skipped: script missing"
    return
  }

  try {
    & $powershellExe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $syncScript -Quiet -CleanupOnly | Out-Null
    Write-WatcherLog ("cleanup finished: exit={0}" -f $LASTEXITCODE)
  } catch {
    Write-WatcherLog ("cleanup failed: {0}" -f $_.Exception.Message)
  }
}

try {
  Write-WatcherLog ("starting: pid={0}, once={1}" -f $PID, [bool]$Once)

  if (Test-Path -LiteralPath $pidPath) {
    $oldPid = (Get-Content -LiteralPath $pidPath -Raw).Trim()
    if ($oldPid -match "^\d+$" -and (Test-WatcherProcess -ProcessId ([int]$oldPid))) {
      Write-WatcherLog ("already running: pid={0}" -f $oldPid)
      exit 0
    }
    Remove-Item -LiteralPath $pidPath -Force
    Write-WatcherLog ("stale pid removed: {0}" -f $oldPid)
  }

  if ($Once) {
    Invoke-Sync
    return
  }

  [string]$PID | Set-Content -LiteralPath $pidPath -Encoding ASCII

  $authWatcher = New-Object System.IO.FileSystemWatcher
  $authWatcher.Path = $authDirectory
  $authWatcher.Filter = "auth.json"
  $authWatcher.IncludeSubdirectories = $false
  $authWatcher.NotifyFilter = [System.IO.NotifyFilters]::FileName -bor
    [System.IO.NotifyFilters]::LastWrite -bor
    [System.IO.NotifyFilters]::Size -bor
    [System.IO.NotifyFilters]::CreationTime
  $authWatcher.EnableRaisingEvents = $true

  $lastHash = Get-AuthHash
  $lastSyncedHash = Get-LastSyncedAuthHash
  $lastCleanupAt = Get-Date
  $lastCasCheckAt = Get-Date
  $missingCasTicks = 0
  if ($lastHash -and $lastHash -ne $lastSyncedHash) {
    Write-WatcherLog "startup auth differs from last synced hash: syncing"
    if (Invoke-Sync) {
      Set-LastSyncedAuthHash $lastHash
      Invoke-Cleanup
      $lastCleanupAt = Get-Date
    }
  } else {
    Write-WatcherLog "startup sync skipped: auth unchanged"
  }

  while (-not $Once) {
    $change = $authWatcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 1000)
    if (-not $change.TimedOut) {
      Start-Sleep -Milliseconds 350
      $hash = Get-AuthHash
      if ($hash -and $hash -ne $lastHash) {
        Write-WatcherLog ("auth file event ({0}): syncing current Codex account" -f $change.ChangeType)
        if (Invoke-Sync) {
          $lastHash = $hash
          Set-LastSyncedAuthHash $hash
          Invoke-Cleanup
          $lastCleanupAt = Get-Date
        }
      }
    } else {
      $hash = Get-AuthHash
      if ($hash -and -not (Test-LoginOperationActive)) {
        $persistedHash = Get-LastSyncedAuthHash
        if ($hash -eq $persistedHash -and $hash -ne $lastHash) {
          $lastHash = $hash
        } elseif ($hash -ne $persistedHash) {
          Write-WatcherLog "deferred auth change detected: syncing current Codex account"
          if (Invoke-Sync) {
            $lastHash = $hash
            Set-LastSyncedAuthHash $hash
            Invoke-Cleanup
            $lastCleanupAt = Get-Date
          }
        }
      }
    }

    if (((Get-Date) - $lastCleanupAt).TotalSeconds -ge $cleanupIntervalSeconds) {
      Invoke-Cleanup
      $lastCleanupAt = Get-Date
    }

    if (((Get-Date) - $lastCasCheckAt).TotalSeconds -ge $casCheckIntervalSeconds) {
      $lastCasCheckAt = Get-Date
      if (Test-CasRunning) {
        $missingCasTicks = 0
      } else {
        $missingCasTicks += 1
        if ($missingCasTicks -ge 12) {
          Write-WatcherLog "exiting: CAS not running"
          break
        }
      }
    }
  }
} catch {
  Write-WatcherLog ("fatal: {0}" -f $_.Exception.Message)
  exit 1
} finally {
  try {
    if ($null -ne $authWatcher) {
      $authWatcher.EnableRaisingEvents = $false
      $authWatcher.Dispose()
    }
  } catch {}
  try {
    if (Test-Path -LiteralPath $pidPath -and ((Get-Content -LiteralPath $pidPath -Raw).Trim() -eq [string]$PID)) {
      Remove-Item -LiteralPath $pidPath -Force
      Write-WatcherLog "pid removed"
    }
  } catch {}
}
