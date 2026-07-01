$ErrorActionPreference = "Stop"

$toolRoot = $PSScriptRoot
$dataRoot = Join-Path $toolRoot "data"
$indexPath = Join-Path $dataRoot "backups\index.json"
$backupRoot = Join-Path $dataRoot "backups"
$firstAddedCachePath = Join-Path $dataRoot "first-added-cache.json"
$quotaResetCountCachePath = Join-Path $dataRoot "quota-reset-count-cache.json"
$accountNotesPath = Join-Path $dataRoot "account-notes.json"
$accountNotesBackupRoot = Join-Path $dataRoot "account-notes-backups"
$pidPath = Join-Path $dataRoot "cas-metadata-server.pid"
$logPath = Join-Path $dataRoot "cas-metadata-server.log"
$port = 17842

New-Item -ItemType Directory -Force -Path $dataRoot | Out-Null
[string]$PID | Set-Content -LiteralPath $pidPath -Encoding ASCII

function Write-MetaLog {
  param([string]$Message)
  try {
    Add-Content -LiteralPath $logPath -Value ("{0} {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss.fff"), $Message) -Encoding UTF8
  } catch {}
}

function Read-JsonObject {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return [pscustomobject]@{} }
  try { return [IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8) | ConvertFrom-Json } catch { return [pscustomobject]@{} }
}

function Set-JsonProp {
  param($Object, [string]$Name, $Value)
  $prop = $Object.PSObject.Properties[$Name]
  if ($prop) { $prop.Value = $Value } else { $Object | Add-Member -NotePropertyName $Name -NotePropertyValue $Value }
}

function Write-JsonObject {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)]$Object
  )
  $json = $Object | ConvertTo-Json -Depth 16
  $tmpPath = "{0}.tmp" -f $Path
  [IO.File]::WriteAllText($tmpPath, $json, [Text.Encoding]::UTF8)
  Move-Item -LiteralPath $tmpPath -Destination $Path -Force
}

function Get-AccountNotesCountFromText {
  param([string]$Text)
  if ([string]::IsNullOrWhiteSpace($Text)) { return 0 }
  try {
    $raw = $Text | ConvertFrom-Json
    if ($raw -is [array]) { return @($raw).Count }
    return @(Get-JsonArray $raw.notes).Count
  } catch {
    return 0
  }
}

function Get-AccountNotesExistingCount {
  if (-not (Test-Path -LiteralPath $accountNotesPath)) { return 0 }
  try {
    return Get-AccountNotesCountFromText ([IO.File]::ReadAllText($accountNotesPath, [Text.Encoding]::UTF8))
  } catch {
    return 0
  }
}

function Backup-AccountNotesFile {
  param([string]$Reason = "save")
  if (-not (Test-Path -LiteralPath $accountNotesPath)) { return $false }

  try {
    New-Item -ItemType Directory -Force -Path $accountNotesBackupRoot | Out-Null
    $safeReason = ([string]$Reason).Trim().ToLowerInvariant() -replace "[^a-z0-9_-]", "-"
    if ([string]::IsNullOrWhiteSpace($safeReason)) { $safeReason = "save" }
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss-fff"
    $backupPath = Join-Path $accountNotesBackupRoot ("account-notes-{0}-{1}.json" -f $stamp, $safeReason)
    Copy-Item -LiteralPath $accountNotesPath -Destination $backupPath -Force

    try {
      $hash = (Get-FileHash -LiteralPath $backupPath -Algorithm SHA256).Hash
      [IO.File]::WriteAllText(("{0}.sha256" -f $backupPath), $hash, [Text.Encoding]::ASCII)
    } catch {}

    Write-MetaLog ("account notes backup created: {0}" -f (Split-Path -Leaf $backupPath))
    return $true
  } catch {
    Write-MetaLog ("account notes backup failed: {0}" -f $_.Exception.Message)
    return $false
  }
}

function Get-AccountEmailKey {
  param($Account)
  $email = ([string]$Account.email).Trim().ToLowerInvariant()
  if (-not [string]::IsNullOrWhiteSpace($email)) { return $email }
  return ([string]$Account.name).Trim().ToLowerInvariant()
}

function Test-AccountIsCurrent {
  param($Account, $Current)
  $accountName = ([string]$Account.name).Trim().ToLowerInvariant()
  $accountEmail = ([string]$Account.email).Trim().ToLowerInvariant()
  $currentName = ([string]$Current.name).Trim().ToLowerInvariant()
  $currentEmail = ([string]$Current.email).Trim().ToLowerInvariant()

  if ([string]::IsNullOrWhiteSpace($accountName) -and [string]::IsNullOrWhiteSpace($accountEmail)) { return $false }
  return (
    (-not [string]::IsNullOrWhiteSpace($currentName) -and ($accountName -eq $currentName -or $accountEmail -eq $currentName)) -or
    (-not [string]::IsNullOrWhiteSpace($currentEmail) -and ($accountName -eq $currentEmail -or $accountEmail -eq $currentEmail))
  )
}

function Build-FirstAddedPayload {
  $accounts = [pscustomobject]@{}
  $index = Read-JsonObject $indexPath
  foreach ($account in @($index.accounts)) {
    $key = Get-AccountEmailKey $account
    $value = ([string]$account.firstAddedAt).Trim()
    if (-not [string]::IsNullOrWhiteSpace($key) -and -not [string]::IsNullOrWhiteSpace($value)) {
      Set-JsonProp $accounts $key ([pscustomobject]@{ firstAddedAt = $value })
    }
  }

  $cache = Read-JsonObject $firstAddedCachePath
  foreach ($prop in @($cache.PSObject.Properties)) {
    $key = ([string]$prop.Name).Trim().ToLowerInvariant()
    $raw = $prop.Value
    $value = if ($raw -is [string]) { $raw } else { [string]$raw.firstAddedAt }
    if (-not [string]::IsNullOrWhiteSpace($key) -and -not [string]::IsNullOrWhiteSpace($value)) {
      Set-JsonProp $accounts $key ([pscustomobject]@{ firstAddedAt = $value.Trim() })
    }
  }

  return [pscustomobject]@{
    ok = $true
    updatedAt = (Get-Date -Format "yyyy/MM/dd HH:mm:ss")
    accounts = $accounts
  }
}

function Build-QuotaResetPayload {
  $accounts = [pscustomobject]@{}
  $index = Read-JsonObject $indexPath
  foreach ($account in @($index.accounts)) {
    $key = Get-AccountEmailKey $account
    $count = $account.quotaResetAvailableCount
    $n = 0
    if (-not [string]::IsNullOrWhiteSpace($key) -and $null -ne $count -and [int]::TryParse([string]$count, [ref]$n)) {
      Set-JsonProp $accounts $key ([pscustomobject]@{ availableCount = $n })
    }
  }

  $cache = Read-JsonObject $quotaResetCountCachePath
  foreach ($prop in @($cache.PSObject.Properties)) {
    $key = ([string]$prop.Name).Trim().ToLowerInvariant()
    $raw = $prop.Value
    $count = $raw
    if ($null -ne $raw -and ($raw.PSObject.Properties.Name -contains "availableCount")) {
      $count = $raw.availableCount
    }
    $n = 0
    if (-not [string]::IsNullOrWhiteSpace($key) -and $null -ne $count -and [int]::TryParse([string]$count, [ref]$n)) {
      Set-JsonProp $accounts $key ([pscustomobject]@{
        availableCount = [Math]::Max(0, $n)
        updatedAt = ([string]$raw.updatedAt).Trim()
      })
    }
  }

  return [pscustomobject]@{
    ok = $true
    updatedAt = (Get-Date -Format "yyyy/MM/dd HH:mm:ss")
    accounts = $accounts
  }
}

function Get-AccountAuthPath {
  param($Account)
  $rel = ([string]$Account.path).Trim()
  if ([string]::IsNullOrWhiteSpace($rel)) { return "" }

  $relPath = $rel.Replace("/", [IO.Path]::DirectorySeparatorChar)
  $candidate = [IO.Path]::GetFullPath((Join-Path $dataRoot $relPath))
  $allowedRoot = [IO.Path]::GetFullPath($backupRoot)
  if (-not $candidate.StartsWith($allowedRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw "auth_path_outside_backups"
  }
  return $candidate
}

function Get-QuotaResetCountFromAuth {
  param([Parameter(Mandatory = $true)][string]$AuthPath)
  if (-not (Test-Path -LiteralPath $AuthPath)) { throw "auth_missing" }

  $auth = Read-JsonObject $AuthPath
  $accessToken = [string]$auth.tokens.access_token
  if ([string]::IsNullOrWhiteSpace($accessToken)) { throw "access_token_missing" }

  $headers = @{
    Authorization = "Bearer $accessToken"
    "User-Agent" = "codex-cli/1.0.0"
  }
  if (-not [string]::IsNullOrWhiteSpace([string]$auth.tokens.account_id)) {
    $headers["chatgpt-account-id"] = [string]$auth.tokens.account_id
  }

  $response = Invoke-WebRequest -Uri "https://chatgpt.com/backend-api/wham/usage" -Headers $headers -Method GET -TimeoutSec 20
  $payload = $response.Content | ConvertFrom-Json
  $count = 0
  if ($null -ne $payload.rate_limit_reset_credits -and $null -ne $payload.rate_limit_reset_credits.available_count) {
    if ([int]::TryParse([string]$payload.rate_limit_reset_credits.available_count, [ref]$count)) {
      return [Math]::Max(0, $count)
    }
  }
  return 0
}

function Test-AccountMatchesRequest {
  param($Account, [string]$Name, [string]$Group)
  if ([string]::IsNullOrWhiteSpace($Name)) { return $true }

  $needle = $Name.Trim().ToLowerInvariant()
  $accountName = ([string]$Account.name).Trim().ToLowerInvariant()
  $accountEmail = ([string]$Account.email).Trim().ToLowerInvariant()
  $accountGroup = ([string]$Account.group).Trim().ToLowerInvariant()
  $requestedGroup = $Group.Trim().ToLowerInvariant()

  if (-not [string]::IsNullOrWhiteSpace($requestedGroup) -and $accountGroup -ne $requestedGroup) {
    return $false
  }
  return ($accountName -eq $needle -or $accountEmail -eq $needle)
}

function Refresh-QuotaResetCountsPayload {
  param([string]$Body)

  $targetName = ""
  $targetGroup = ""
  if (-not [string]::IsNullOrWhiteSpace($Body)) {
    try {
      $request = $Body | ConvertFrom-Json
      $targetName = ([string]$request.account).Trim()
      $targetGroup = ([string]$request.group).Trim()
    } catch {
      throw "invalid_refresh_request"
    }
  }

  $index = Read-JsonObject $indexPath
  $matched = @($index.accounts | Where-Object { Test-AccountMatchesRequest -Account $_ -Name $targetName -Group $targetGroup })
  if ($matched.Count -eq 0) {
    return [pscustomobject]@{
      ok = $false
      error = "account_not_found"
      updatedAt = (Get-Date -Format "yyyy/MM/dd HH:mm:ss")
      accounts = [pscustomobject]@{}
      results = @()
    }
  }

  $accountsPayload = [pscustomobject]@{}
  $quotaResetCache = Read-JsonObject $quotaResetCountCachePath
  $results = @()
  $successCount = 0
  foreach ($account in $matched) {
    $key = Get-AccountEmailKey $account
    try {
      $authPath = Get-AccountAuthPath -Account $account
      $count = Get-QuotaResetCountFromAuth -AuthPath $authPath
      Set-JsonProp $account "quotaResetAvailableCount" ([int]$count)
      Set-JsonProp $accountsPayload $key ([pscustomobject]@{ availableCount = [int]$count })
      Set-JsonProp $quotaResetCache $key ([pscustomobject]@{
        availableCount = [int]$count
        updatedAt = (Get-Date -Format "yyyy/MM/dd HH:mm:ss")
      })
      $results += [pscustomobject]@{ ok = $true; account = $key; availableCount = [int]$count }
      $successCount += 1
    } catch {
      Write-MetaLog ("quota reset count refresh failed for {0}: {1}" -f $key, $_.Exception.Message)
      $results += [pscustomobject]@{ ok = $false; account = $key; error = $_.Exception.Message }
    }
  }

  if ($successCount -gt 0) {
    Write-JsonObject -Path $indexPath -Object $index
    Write-JsonObject -Path $quotaResetCountCachePath -Object $quotaResetCache
  }

  return [pscustomobject]@{
    ok = ($successCount -gt 0)
    updatedAt = (Get-Date -Format "yyyy/MM/dd HH:mm:ss")
    count = $successCount
    accounts = $accountsPayload
    results = $results
  }
}

function Build-AccountsPayload {
  $index = Read-JsonObject $indexPath
  $accounts = @()
  foreach ($account in @($index.accounts)) {
    if ($null -ne $account) {
      Set-JsonProp $account "isCurrent" (Test-AccountIsCurrent -Account $account -Current $index.current)
      $accounts += $account
    }
  }

  return [pscustomobject]@{
    ok = $true
    updatedAt = (Get-Date -Format "yyyy/MM/dd HH:mm:ss")
    current = $index.current
    accounts = $accounts
  }
}

function Get-JsonArray {
  param($Value)
  if ($null -eq $Value) { return @() }
  if ($Value -is [array]) { return @($Value) }
  return @($Value)
}

function Build-AccountNotesPayload {
  $notes = @()
  $updatedAt = ""
  if (Test-Path -LiteralPath $accountNotesPath) {
    try {
      $rawText = [IO.File]::ReadAllText($accountNotesPath, [Text.Encoding]::UTF8)
      if (-not [string]::IsNullOrWhiteSpace($rawText)) {
        $raw = $rawText | ConvertFrom-Json
        if ($raw -is [array]) {
          $notes = @($raw)
        } else {
          $notes = Get-JsonArray $raw.notes
          $updatedAt = ([string]$raw.updatedAt).Trim()
        }
      }
    } catch {
      Write-MetaLog ("account notes read failed: {0}" -f $_.Exception.Message)
      $notes = @()
    }
  }

  return [pscustomobject]@{
    ok = $true
    exists = (Test-Path -LiteralPath $accountNotesPath)
    updatedAt = if ([string]::IsNullOrWhiteSpace($updatedAt)) { (Get-Date -Format "yyyy/MM/dd HH:mm:ss") } else { $updatedAt }
    notes = $notes
  }
}

function Save-AccountNotesPayload {
  param([string]$Body)
  $notes = @()
  $allowEmpty = $false
  try {
    if (-not [string]::IsNullOrWhiteSpace($Body)) {
      $raw = $Body | ConvertFrom-Json
      if ($raw -is [array]) {
        $notes = @($raw)
      } else {
        $notes = Get-JsonArray $raw.notes
        $allowEmpty = ($raw.PSObject.Properties.Name -contains "allowEmpty") -and (
          $raw.allowEmpty -eq $true -or
          ([string]$raw.allowEmpty).Trim().ToLowerInvariant() -eq "true" -or
          ([string]$raw.allowEmpty).Trim() -eq "1"
        )
      }
    }
  } catch {
    throw "invalid_notes_json"
  }

  $existingCount = Get-AccountNotesExistingCount
  if ($existingCount -gt 0 -and @($notes).Count -eq 0 -and -not $allowEmpty) {
    Backup-AccountNotesFile -Reason "rejected-empty" | Out-Null
    Write-MetaLog ("account notes empty overwrite rejected: existing={0}" -f $existingCount)
    return [pscustomobject]@{
      ok = $false
      error = "empty_notes_rejected"
      existingCount = $existingCount
      count = 0
    }
  }

  $payload = [pscustomobject]@{
    schema = 1
    updatedAt = (Get-Date -Format "yyyy/MM/dd HH:mm:ss")
    notes = $notes
  }
  $json = $payload | ConvertTo-Json -Depth 12
  $tmpPath = "{0}.tmp" -f $accountNotesPath
  Backup-AccountNotesFile -Reason "before-save" | Out-Null
  [IO.File]::WriteAllText($tmpPath, $json, [Text.Encoding]::UTF8)
  Move-Item -LiteralPath $tmpPath -Destination $accountNotesPath -Force

  return [pscustomobject]@{
    ok = $true
    updatedAt = $payload.updatedAt
    count = @($notes).Count
  }
}

function Send-Response {
  param(
    [Net.Sockets.NetworkStream]$Stream,
    [int]$Status,
    [string]$Body,
    [string]$ContentType = "application/json; charset=utf-8"
  )
  $statusText = if ($Status -eq 200) { "OK" } elseif ($Status -eq 204) { "No Content" } else { "Not Found" }
  $bodyBytes = [Text.Encoding]::UTF8.GetBytes($Body)
  $headers = @(
    "HTTP/1.1 $Status $statusText",
    "Content-Type: $ContentType",
    "Content-Length: $($bodyBytes.Length)",
    "Access-Control-Allow-Origin: *",
    "Access-Control-Allow-Methods: GET, POST, OPTIONS",
    "Access-Control-Allow-Headers: Content-Type",
    "Cache-Control: no-store",
    "Connection: close",
    "",
    ""
  ) -join "`r`n"
  $headerBytes = [Text.Encoding]::ASCII.GetBytes($headers)
  $Stream.Write($headerBytes, 0, $headerBytes.Length)
  if ($bodyBytes.Length -gt 0) { $Stream.Write($bodyBytes, 0, $bodyBytes.Length) }
}

Backup-AccountNotesFile -Reason "startup" | Out-Null

$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $port)
$listener.Start()
Write-MetaLog "metadata server listening on 127.0.0.1:$port"

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $buffer = New-Object byte[] 4096
      $read = $stream.Read($buffer, 0, $buffer.Length)
      $request = [Text.Encoding]::ASCII.GetString($buffer, 0, [Math]::Max(0, $read))
      $headerEnd = $request.IndexOf("`r`n`r`n")
      $headersText = if ($headerEnd -ge 0) { $request.Substring(0, $headerEnd) } else { $request }
      $contentLength = 0
      foreach ($line in ($headersText -split "`r?`n")) {
        if ($line -match "^\s*Content-Length\s*:\s*(\d+)\s*$") {
          [void][int]::TryParse($Matches[1], [ref]$contentLength)
        }
      }
      $bodyBytes = New-Object byte[] 0
      $bodyStart = if ($headerEnd -ge 0) { $headerEnd + 4 } else { $read }
      $receivedBodyBytes = [Math]::Max(0, $read - $bodyStart)
      if ($receivedBodyBytes -gt 0) {
        $bodyBytes = New-Object byte[] $receivedBodyBytes
        [Array]::Copy($buffer, $bodyStart, $bodyBytes, 0, $receivedBodyBytes)
      }
      while ($bodyBytes.Length -lt $contentLength) {
        $remaining = $contentLength - $bodyBytes.Length
        $chunk = New-Object byte[] ([Math]::Min(8192, $remaining))
        $chunkRead = $stream.Read($chunk, 0, $chunk.Length)
        if ($chunkRead -le 0) { break }
        $next = New-Object byte[] ($bodyBytes.Length + $chunkRead)
        if ($bodyBytes.Length -gt 0) { [Array]::Copy($bodyBytes, 0, $next, 0, $bodyBytes.Length) }
        [Array]::Copy($chunk, 0, $next, $bodyBytes.Length, $chunkRead)
        $bodyBytes = $next
      }
      $body = if ($contentLength -gt 0 -and $bodyBytes.Length -gt 0) {
        [Text.Encoding]::UTF8.GetString($bodyBytes, 0, [Math]::Min($contentLength, $bodyBytes.Length))
      } else {
        ""
      }
      $firstLine = ($request -split "`r?`n" | Select-Object -First 1)
      $parts = $firstLine -split " "
      $method = if ($parts.Count -ge 1) { $parts[0] } else { "" }
      $path = if ($parts.Count -ge 2) { ($parts[1] -split "\?")[0] } else { "/" }

      if ($method -eq "OPTIONS") {
        Send-Response -Stream $stream -Status 204 -Body ""
      } elseif ($method -eq "GET" -and $path -eq "/first-added-times") {
        Send-Response -Stream $stream -Status 200 -Body ((Build-FirstAddedPayload) | ConvertTo-Json -Depth 8)
      } elseif ($method -eq "GET" -and $path -eq "/quota-reset-counts") {
        Send-Response -Stream $stream -Status 200 -Body ((Build-QuotaResetPayload) | ConvertTo-Json -Depth 8)
      } elseif ($method -eq "POST" -and $path -eq "/quota-reset-counts/refresh") {
        Send-Response -Stream $stream -Status 200 -Body ((Refresh-QuotaResetCountsPayload -Body $body) | ConvertTo-Json -Depth 12)
      } elseif ($method -eq "GET" -and $path -eq "/accounts") {
        Send-Response -Stream $stream -Status 200 -Body ((Build-AccountsPayload) | ConvertTo-Json -Depth 12)
      } elseif ($method -eq "GET" -and $path -eq "/account-notes") {
        Send-Response -Stream $stream -Status 200 -Body ((Build-AccountNotesPayload) | ConvertTo-Json -Depth 12)
      } elseif ($method -eq "POST" -and $path -eq "/account-notes") {
        Send-Response -Stream $stream -Status 200 -Body ((Save-AccountNotesPayload -Body $body) | ConvertTo-Json -Depth 12)
      } else {
        Send-Response -Stream $stream -Status 404 -Body (@{ ok = $false; error = "not_found" } | ConvertTo-Json)
      }
    } catch {
      Write-MetaLog ("request failed: {0}" -f $_.Exception.Message)
    } finally {
      try { $client.Close() } catch {}
    }
  }
} finally {
  try { $listener.Stop() } catch {}
  try { Remove-Item -LiteralPath $pidPath -Force -ErrorAction SilentlyContinue } catch {}
}
