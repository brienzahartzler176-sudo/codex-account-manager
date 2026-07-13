param(
  [switch]$LaunchCodex,
  [switch]$CheckOnly
)

$ErrorActionPreference = "Stop"

$toolRoot = $PSScriptRoot
$dataRoot = Join-Path $toolRoot "data"
$stashRoot = Join-Path $dataRoot "manual-login-stash"
$statusPath = Join-Path $dataRoot "login-status.json"
$loginLockPath = Join-Path $dataRoot "login-operation.lock"
$lastHashPath = Join-Path $dataRoot "cas-auth-last-hash.txt"
$syncScript = Join-Path $toolRoot "Sync-Current-Codex-To-CAS.ps1"
$authPath = Join-Path $HOME ".codex\auth.json"
$codexAppId = "shell:AppsFolder\OpenAI.Codex_2p2nqsd0c76g0!App"
$operationId = [guid]::NewGuid().ToString("N")
$startedAt = [DateTimeOffset]::UtcNow.ToString("o")
$failureCode = "login_failed"
$originalAuthRemoved = $false
$stashPath = ""

New-Item -ItemType Directory -Force -Path $dataRoot | Out-Null
New-Item -ItemType Directory -Force -Path $stashRoot | Out-Null

function Write-Step {
  param([string]$Text)
  Write-Host ("[CAS] {0}" -f $Text)
}

function Write-LoginStatus {
  param(
    [Parameter(Mandatory = $true)][string]$Stage,
    [string]$ErrorCode = ""
  )
  $payload = [ordered]@{
    schema = 1
    operationId = $operationId
    stage = $Stage
    startedAt = $startedAt
    updatedAt = [DateTimeOffset]::UtcNow.ToString("o")
    errorCode = $ErrorCode
  }
  $json = $payload | ConvertTo-Json -Depth 4
  $tmpPath = "{0}.{1}.tmp" -f $statusPath, $PID
  [IO.File]::WriteAllText($tmpPath, $json, [Text.UTF8Encoding]::new($false))
  if (Test-Path -LiteralPath $statusPath) {
    Move-Item -LiteralPath $tmpPath -Destination $statusPath -Force
  } else {
    [IO.File]::Move($tmpPath, $statusPath)
  }
}

function Resolve-CodexCli {
  $candidates = @()
  foreach ($command in @(Get-Command codex.exe -All -ErrorAction SilentlyContinue)) {
    if (-not [string]::IsNullOrWhiteSpace([string]$command.Path)) {
      $candidates += [string]$command.Path
    }
  }
  $package = Get-AppxPackage -Name "OpenAI.Codex" -ErrorAction SilentlyContinue | Sort-Object Version -Descending | Select-Object -First 1
  if ($package -and -not [string]::IsNullOrWhiteSpace([string]$package.InstallLocation)) {
    $candidates += (Join-Path $package.InstallLocation "app\resources\codex.exe")
  }

  foreach ($candidate in @($candidates | Select-Object -Unique)) {
    if (Test-Path -LiteralPath $candidate -PathType Leaf) { return [IO.Path]::GetFullPath($candidate) }
  }
  throw "codex_cli_missing"
}

function Get-CodexPackageRoots {
  $roots = @()
  foreach ($package in @(Get-AppxPackage -Name "OpenAI.Codex" -ErrorAction SilentlyContinue)) {
    if (-not [string]::IsNullOrWhiteSpace([string]$package.InstallLocation)) {
      $roots += [IO.Path]::GetFullPath([string]$package.InstallLocation).TrimEnd("\") + "\"
    }
  }
  $localRoot = Join-Path $env:LOCALAPPDATA "Programs\OpenAI\Codex"
  if (Test-Path -LiteralPath $localRoot) {
    $roots += [IO.Path]::GetFullPath($localRoot).TrimEnd("\") + "\"
  }
  return @($roots | Select-Object -Unique)
}

function Get-CodexPackageProcesses {
  $roots = @(Get-CodexPackageRoots)
  $names = @("ChatGPT.exe", "Codex.exe", "codex.exe", "codex-code-mode-host.exe")
  return @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
    $processName = [string]$_.Name
    $processPath = [string]$_.ExecutablePath
    if ($names -notcontains $processName -or [string]::IsNullOrWhiteSpace($processPath)) { return $false }
    foreach ($root in $roots) {
      if ($processPath.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) { return $true }
    }
    return $false
  })
}

function Stop-CodexProcesses {
  Write-LoginStatus -Stage "closing"
  $snapshot = @(Get-CodexPackageProcesses)
  foreach ($item in $snapshot) {
    try {
      $process = Get-Process -Id ([int]$item.ProcessId) -ErrorAction Stop
      try {
        if (-not $process.HasExited -and $process.MainWindowHandle -ne 0) {
          Write-Step ("closing Codex window pid={0}" -f $process.Id)
          [void]$process.CloseMainWindow()
        }
      } finally {
        $process.Dispose()
      }
    } catch {}
  }

  $deadline = [DateTime]::UtcNow.AddSeconds(4)
  do {
    Start-Sleep -Milliseconds 200
    $remaining = @(Get-CodexPackageProcesses)
  } while ($remaining.Count -gt 0 -and [DateTime]::UtcNow -lt $deadline)

  foreach ($item in @(Get-CodexPackageProcesses)) {
    try {
      Write-Step ("stopping Codex process pid={0}" -f $item.ProcessId)
      Stop-Process -Id ([int]$item.ProcessId) -Force -ErrorAction Stop
    } catch {}
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

function Test-UsableAuthFile {
  if (-not (Test-Path -LiteralPath $authPath -PathType Leaf)) { return $false }
  try {
    $auth = Get-Content -LiteralPath $authPath -Raw -Encoding UTF8 | ConvertFrom-Json
    $hasAccessToken = -not [string]::IsNullOrWhiteSpace([string]$auth.tokens.access_token)
    $hasIdentity = -not [string]::IsNullOrWhiteSpace([string]$auth.tokens.id_token) -or
      -not [string]::IsNullOrWhiteSpace([string]$auth.email)
    return ($hasAccessToken -and $hasIdentity)
  } catch {
    return $false
  }
}

function Restore-OriginalAuth {
  if (-not $originalAuthRemoved -or [string]::IsNullOrWhiteSpace($stashPath) -or -not (Test-Path -LiteralPath $stashPath)) {
    return $false
  }
  if (Test-Path -LiteralPath $authPath) {
    $failedPath = Join-Path $stashRoot ("failed-login-auth-{0}.json" -f (Get-Date -Format "yyyyMMdd-HHmmss"))
    Move-Item -LiteralPath $authPath -Destination $failedPath -Force
  }
  Copy-Item -LiteralPath $stashPath -Destination $authPath -Force
  return $true
}

function Complete-LoginOperation {
  param([switch]$RecordCurrentHash)
  if ($RecordCurrentHash -and (Test-Path -LiteralPath $authPath)) {
    try {
      (Get-FileHash -LiteralPath $authPath -Algorithm SHA256).Hash | Set-Content -LiteralPath $lastHashPath -Encoding ASCII
    } catch {}
  }
  Remove-Item -LiteralPath $loginLockPath -Force -ErrorAction SilentlyContinue
}

Write-LoginStatus -Stage "preparing"

try {
  $codexCli = Resolve-CodexCli
  if ($CheckOnly) {
    Write-Step ("Codex CLI: {0}" -f $codexCli)
    Write-Step ("Codex package processes: {0}" -f @(Get-CodexPackageProcesses).Count)
    Write-LoginStatus -Stage "ready"
    exit 0
  }

  [IO.File]::WriteAllText($loginLockPath, $operationId, [Text.Encoding]::ASCII)

  if (Test-Path -LiteralPath $authPath) {
    if (Test-Path -LiteralPath $syncScript) {
      Write-Step "saving the current Codex login in CAS"
      & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $syncScript -NoUsage | Out-Null
      if ($LASTEXITCODE -ne 0) {
        $failureCode = "current_login_backup_failed"
        throw "current_login_backup_failed"
      }
    }
  }

  Stop-CodexProcesses

  if (Test-Path -LiteralPath $authPath) {
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $stashPath = Join-Path $stashRoot ("codex-login-stash-{0}.json" -f $stamp)
    Copy-Item -LiteralPath $authPath -Destination $stashPath -Force
    Remove-Item -LiteralPath $authPath -Force
    $originalAuthRemoved = $true
    Write-Step "current login protected; starting official Codex login"
  }

  Write-LoginStatus -Stage "signing_in"
  Write-Step "Complete the official Codex login in the browser."
  & $codexCli login
  if ($LASTEXITCODE -ne 0) {
    $failureCode = "codex_login_failed"
    throw "codex_login_failed"
  }
  if (-not (Test-UsableAuthFile)) {
    $failureCode = "auth_not_created"
    throw "auth_not_created"
  }

  Write-LoginStatus -Stage "syncing"
  if (-not (Test-Path -LiteralPath $syncScript)) {
    $failureCode = "sync_script_missing"
    throw "sync_script_missing"
  }
  & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $syncScript | Out-Null
  if ($LASTEXITCODE -ne 0) {
    $failureCode = "account_sync_failed"
    throw "account_sync_failed"
  }

  if ($LaunchCodex) {
    Write-LoginStatus -Stage "launching"
    Start-CodexApp
  }
  Complete-LoginOperation -RecordCurrentHash
  Write-LoginStatus -Stage "ready"
  Write-Step "login completed and account synced to CAS"
  exit 0
} catch {
  $exceptionCode = ([string]$_.Exception.Message).Trim()
  if ($failureCode -eq "login_failed" -and $exceptionCode -match "^[a-z0-9_-]{1,64}$") {
    $failureCode = $exceptionCode
  }
  $restored = $false
  try { $restored = Restore-OriginalAuth } catch {}
  if ($LaunchCodex) {
    try { Start-CodexApp } catch {}
  }
  if ($restored) {
    Complete-LoginOperation -RecordCurrentHash
    Write-LoginStatus -Stage "restored" -ErrorCode $failureCode
    Write-Step ("login failed; the original login was restored ({0})" -f $failureCode)
  } else {
    Complete-LoginOperation
    Write-LoginStatus -Stage "failed" -ErrorCode $failureCode
    Write-Step ("login failed ({0})" -f $failureCode)
  }
  exit 1
}
