param(
  [switch]$Quiet,
  [switch]$NoUsage,
  [switch]$ClearAbnormal,
  [switch]$CleanupOnly,
  [switch]$RefreshStoredAccount,
  [string]$AccountName,
  [string]$AccountGroup,
  [string]$AuthPath
)

$ErrorActionPreference = "Stop"

function Write-Info {
  param([string]$Text)
  if (-not $Quiet) { Write-Host $Text }
}

function Write-Utf8NoBomFile {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Text
  )
  [IO.File]::WriteAllText($Path, $Text, [Text.UTF8Encoding]::new($false))
}

function Decode-Base64Url {
  param([Parameter(Mandatory = $true)][string]$Text)
  $s = $Text.Replace("-", "+").Replace("_", "/")
  switch ($s.Length % 4) {
    2 { $s += "==" }
    3 { $s += "=" }
    1 { throw "Invalid base64url length." }
  }
  [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($s))
}

function Get-AuthEmail {
  param([Parameter(Mandatory = $true)][object]$Auth)
  $idToken = [string]$Auth.tokens.id_token
  if (-not [string]::IsNullOrWhiteSpace($idToken) -and $idToken.Split(".").Count -ge 2) {
    $claims = Decode-Base64Url $idToken.Split(".")[1] | ConvertFrom-Json
    if (-not [string]::IsNullOrWhiteSpace([string]$claims.email)) {
      return ([string]$claims.email).Trim().ToLowerInvariant()
    }
    if (-not [string]::IsNullOrWhiteSpace([string]$claims.preferred_username)) {
      return ([string]$claims.preferred_username).Trim().ToLowerInvariant()
    }
  }
  if (-not [string]::IsNullOrWhiteSpace([string]$Auth.email)) {
    return ([string]$Auth.email).Trim().ToLowerInvariant()
  }
  return ""
}

function Get-SafeFileName {
  param([Parameter(Mandatory = $true)][string]$Name)
  $invalid = [IO.Path]::GetInvalidFileNameChars()
  $chars = $Name.ToCharArray() | ForEach-Object {
    if ($invalid -contains $_) { "_" } else { $_ }
  }
  (($chars -join "").Trim()).TrimEnd(".")
}

function Get-PlanGroup {
  param([string]$PlanType, [string]$Fallback = "plus")
  $group = if ([string]::IsNullOrWhiteSpace($PlanType)) { $Fallback } else { $PlanType.ToLowerInvariant() }
  if (@("free", "plus", "team", "pro", "business", "personal") -notcontains $group) {
    return "plus"
  }
  return $group
}

function Get-UsageFromAuth {
  param([Parameter(Mandatory = $true)][object]$Auth)

  $result = [ordered]@{
    ok = $false
    planType = ""
    q5 = -1
    q7 = -1
    r5s = -1
    r7s = -1
    r5 = -1
    r7 = -1
    w5s = -1
    w7s = -1
    windows = @()
    resetAvailableCount = -1
    status = $null
    error = ""
  }

  try {
    if ([string]::IsNullOrWhiteSpace([string]$Auth.tokens.access_token)) {
      throw "access_token missing"
    }
    $headers = @{
      Authorization = "Bearer $($Auth.tokens.access_token)"
      "User-Agent" = "codex-cli/1.0.0"
    }
    if (-not [string]::IsNullOrWhiteSpace([string]$Auth.tokens.account_id)) {
      $headers["chatgpt-account-id"] = [string]$Auth.tokens.account_id
    }

    $response = Invoke-WebRequest -Uri "https://chatgpt.com/backend-api/wham/usage" -Headers $headers -Method GET -TimeoutSec 20
    $result.status = [int]$response.StatusCode
    $payload = $response.Content | ConvertFrom-Json
    $windows = @()
    foreach ($slot in @(
      [pscustomobject]@{ name = "primary"; value = $payload.rate_limit.primary_window },
      [pscustomobject]@{ name = "secondary"; value = $payload.rate_limit.secondary_window }
    )) {
      $window = $slot.value
      if ($null -eq $window) { continue }

      $usedPercent = -1
      $remainingPercent = -1
      $windowSeconds = -1L
      $resetAfterSeconds = -1L
      $resetAt = -1L
      if ($null -ne $window.used_percent) {
        $usedPercent = [Math]::Max(0, [Math]::Min(100, [int][Math]::Round([double]$window.used_percent)))
        $remainingPercent = 100 - $usedPercent
      }
      if ($null -ne $window.limit_window_seconds) { $windowSeconds = [int64]$window.limit_window_seconds }
      if ($null -ne $window.reset_after_seconds) { $resetAfterSeconds = [int64]$window.reset_after_seconds }
      if ($null -ne $window.reset_at) { $resetAt = [int64]$window.reset_at }

      $windows += [pscustomobject][ordered]@{
        slot = [string]$slot.name
        windowSeconds = $windowSeconds
        remainingPercent = $remainingPercent
        resetAfterSeconds = $resetAfterSeconds
        resetAt = $resetAt
      }
    }

    $shortWindow = @($windows | Where-Object { [int64]$_.windowSeconds -gt 0 -and [int64]$_.windowSeconds -le 86400 } | Sort-Object windowSeconds | Select-Object -First 1)
    $longWindow = @($windows | Where-Object { [int64]$_.windowSeconds -gt 86400 } | Sort-Object @{ Expression = { [Math]::Abs([double]$_.windowSeconds - 604800) } } | Select-Object -First 1)
    if ($shortWindow.Count -gt 0) {
      $result.q5 = [int]$shortWindow[0].remainingPercent
      $result.r5s = [int64]$shortWindow[0].resetAfterSeconds
      $result.r5 = [int64]$shortWindow[0].resetAt
      $result.w5s = [int64]$shortWindow[0].windowSeconds
    }
    if ($longWindow.Count -gt 0) {
      $result.q7 = [int]$longWindow[0].remainingPercent
      $result.r7s = [int64]$longWindow[0].resetAfterSeconds
      $result.r7 = [int64]$longWindow[0].resetAt
      $result.w7s = [int64]$longWindow[0].windowSeconds
    }

    $result.ok = $true
    $result.planType = [string]$payload.plan_type
    $result.windows = @($windows)
    if ($null -ne $payload.rate_limit_reset_credits -and $null -ne $payload.rate_limit_reset_credits.available_count) {
      $resetCount = 0
      if ([int]::TryParse([string]$payload.rate_limit_reset_credits.available_count, [ref]$resetCount)) {
        $result.resetAvailableCount = [Math]::Max(0, $resetCount)
      }
    }
  } catch {
    if ($_.Exception.Response) { $result.status = [int]$_.Exception.Response.StatusCode }
    $result.error = $_.Exception.Message
  }

  [pscustomobject]$result
}

function Clear-UsageFields {
  param([Parameter(Mandatory = $true)]$Entry)
  Set-JsonProp $Entry "usageOk" $false
  Set-JsonProp $Entry "quotaWindows" @()
  Set-JsonProp $Entry "quota5hRemainingPercent" -1
  Set-JsonProp $Entry "quota7dRemainingPercent" -1
  Set-JsonProp $Entry "quota5hResetAfterSeconds" -1
  Set-JsonProp $Entry "quota7dResetAfterSeconds" -1
  Set-JsonProp $Entry "quota5hResetAt" -1
  Set-JsonProp $Entry "quota7dResetAt" -1
  Set-JsonProp $Entry "quota5hWindowSeconds" -1
  Set-JsonProp $Entry "quota7dWindowSeconds" -1
  Remove-JsonProp $Entry "quotaResetAvailableCount"
}

function Apply-UsageResultToEntry {
  param(
    [Parameter(Mandatory = $true)]$Entry,
    [Parameter(Mandatory = $true)]$Usage
  )
  Set-JsonProp $Entry "abnormal" $false
  Set-JsonProp $Entry "abnormalReason" ""
  Set-JsonProp $Entry "abnormalAt" ""
  Set-JsonProp $Entry "usageOk" $true
  Set-JsonProp $Entry "usageError" ""
  Set-JsonProp $Entry "planType" ([string]$Usage.planType)
  Set-JsonProp $Entry "quotaWindows" @($Usage.windows)
  Set-JsonProp $Entry "quota5hRemainingPercent" ([int]$Usage.q5)
  Set-JsonProp $Entry "quota7dRemainingPercent" ([int]$Usage.q7)
  Set-JsonProp $Entry "quota5hResetAfterSeconds" ([int64]$Usage.r5s)
  Set-JsonProp $Entry "quota7dResetAfterSeconds" ([int64]$Usage.r7s)
  Set-JsonProp $Entry "quota5hResetAt" ([int64]$Usage.r5)
  Set-JsonProp $Entry "quota7dResetAt" ([int64]$Usage.r7)
  Set-JsonProp $Entry "quota5hWindowSeconds" ([int64]$Usage.w5s)
  Set-JsonProp $Entry "quota7dWindowSeconds" ([int64]$Usage.w7s)
  if ([int]$Usage.resetAvailableCount -ge 0) {
    Set-JsonProp $Entry "quotaResetAvailableCount" ([int]$Usage.resetAvailableCount)
  }
}

function Update-QuotaWindowCache {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Key,
    $Usage
  )
  if ([string]::IsNullOrWhiteSpace($Key)) { return }
  $cache = [pscustomobject]@{}
  if (Test-Path -LiteralPath $Path) {
    try { $cache = Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json } catch { $cache = [pscustomobject]@{} }
  }
  $normalizedKey = $Key.Trim().ToLowerInvariant()
  if ($null -ne $Usage -and $Usage.ok) {
    Set-JsonProp $cache $normalizedKey ([pscustomobject][ordered]@{
      planType = [string]$Usage.planType
      windows = @($Usage.windows)
      resetAvailableCount = [int]$Usage.resetAvailableCount
      updatedAt = (Get-Date -Format "yyyy/MM/dd HH:mm:ss")
    })
  } else {
    Remove-JsonProp $cache $normalizedKey
  }
  Write-Utf8NoBomFile -Path $Path -Text ($cache | ConvertTo-Json -Depth 12)
}

function Set-JsonProp {
  param(
    [Parameter(Mandatory = $true)][object]$Object,
    [Parameter(Mandatory = $true)][string]$Name,
    $Value
  )
  if ($Object.PSObject.Properties.Name -contains $Name) {
    $Object.$Name = $Value
  } else {
    $Object | Add-Member -NotePropertyName $Name -NotePropertyValue $Value
  }
}

function Remove-JsonProp {
  param(
    [Parameter(Mandatory = $true)][object]$Object,
    [Parameter(Mandatory = $true)][string]$Name
  )
  $prop = $Object.PSObject.Properties[$Name]
  if ($prop) { $Object.PSObject.Properties.Remove($Name) }
}

function Get-AccountKey {
  param($Account)
  $email = ([string]$Account.email).Trim().ToLowerInvariant()
  if (-not [string]::IsNullOrWhiteSpace($email) -and $email -like "*@*") {
    return "email:$email"
  }
  $name = ([string]$Account.name).Trim().ToLowerInvariant()
  if ([string]::IsNullOrWhiteSpace($name)) { return "" }
  return "name:$name"
}

function Test-PlaceholderAccount {
  param($Account)
  $name = ([string]$Account.name).Trim().ToLowerInvariant()
  $email = ([string]$Account.email).Trim()
  return ($name -eq "current_account" -and [string]::IsNullOrWhiteSpace($email))
}

function Test-TrueValue {
  param($Value)
  return ($Value -eq $true -or [string]$Value -eq "true")
}

function Test-StaleNoEmailAccount {
  param($Account)
  if ($null -eq $Account) { return $false }

  $email = ([string]$Account.email).Trim()
  if (-not [string]::IsNullOrWhiteSpace($email)) { return $false }

  $q5 = -1
  $q7 = -1
  try {
    if ($Account.PSObject.Properties.Name -contains "quota5hRemainingPercent") { $q5 = [int]$Account.quota5hRemainingPercent }
    if ($Account.PSObject.Properties.Name -contains "quota7dRemainingPercent") { $q7 = [int]$Account.quota7dRemainingPercent }
  } catch {
    $q5 = -1
    $q7 = -1
  }

  $name = ([string]$Account.name).Trim()
  $usageOk = Test-TrueValue $Account.usageOk
  $hasQuota = ($q5 -ge 0 -or $q7 -ge 0)

  return ((-not $usageOk) -and (-not $hasQuota) -and ($name -match '#\d+$'))
}

function Normalize-AbnormalAccountState {
  param($Account)
  if ($null -eq $Account) { return $Account }

  if (Test-TrueValue $Account.abnormal) {
    Set-JsonProp $Account "usageOk" $false
    Set-JsonProp $Account "quota5hRemainingPercent" -1
    Set-JsonProp $Account "quota7dRemainingPercent" -1
    Set-JsonProp $Account "quota5hResetAfterSeconds" -1
    Set-JsonProp $Account "quota7dResetAfterSeconds" -1
    Set-JsonProp $Account "quota5hResetAt" -1
    Set-JsonProp $Account "quota7dResetAt" -1

    $reason = ([string]$Account.abnormalReason).Trim()
    if (-not [string]::IsNullOrWhiteSpace($reason) -and [string]::IsNullOrWhiteSpace([string]$Account.usageError)) {
      Set-JsonProp $Account "usageError" $reason
    }
  }

  return $Account
}

function Normalize-AccountList {
  param([object[]]$Accounts)
  $byKey = [ordered]@{}

  foreach ($account in @($Accounts)) {
    if ($null -eq $account -or (Test-PlaceholderAccount $account) -or (Test-StaleNoEmailAccount $account)) { continue }
    $account = Normalize-AbnormalAccountState $account
    $key = Get-AccountKey $account
    if ([string]::IsNullOrWhiteSpace($key)) { continue }
    if (-not $byKey.Contains($key)) {
      $byKey[$key] = $account
      continue
    }

    $existing = $byKey[$key]
    $existingScore = 0
    if (Test-TrueValue $existing.isCurrent) { $existingScore += 8 }
    if ((Test-TrueValue $existing.usageOk) -and -not (Test-TrueValue $existing.abnormal)) { $existingScore += 4 }
    if (([string]$existing.name).Trim().ToLowerInvariant() -eq ([string]$existing.email).Trim().ToLowerInvariant()) { $existingScore += 2 }

    $score = 0
    if (Test-TrueValue $account.isCurrent) { $score += 8 }
    if ((Test-TrueValue $account.usageOk) -and -not (Test-TrueValue $account.abnormal)) { $score += 4 }
    if (([string]$account.name).Trim().ToLowerInvariant() -eq ([string]$account.email).Trim().ToLowerInvariant()) { $score += 2 }

    if ($score -gt $existingScore) {
      $byKey[$key] = $account
    }
  }

  return @($byKey.Values)
}

function Get-AccountBackupDir {
  param(
    $Account,
    [Parameter(Mandatory = $true)][string]$DataRoot,
    [Parameter(Mandatory = $true)][string]$BackupRoot
  )
  $rel = ([string]$Account.path).Trim()
  if ([string]::IsNullOrWhiteSpace($rel)) {
    $group = ([string]$Account.group).Trim()
    $name = ([string]$Account.name).Trim()
    if ([string]::IsNullOrWhiteSpace($group) -or [string]::IsNullOrWhiteSpace($name)) { return "" }
    return [IO.Path]::GetFullPath((Join-Path $BackupRoot (Join-Path $group $name)))
  }
  $rel = $rel.Replace("/", "\")
  $filePath = if ($rel -match "^backups\\") {
    Join-Path $DataRoot $rel
  } else {
    Join-Path $BackupRoot $rel
  }
  return [IO.Path]::GetFullPath((Split-Path -Parent $filePath))
}

function Repair-AccountEmailFromBackupAuth {
  param(
    $Account,
    [Parameter(Mandatory = $true)][string]$DataRoot,
    [Parameter(Mandatory = $true)][string]$BackupRoot
  )
  if ($null -eq $Account) { return $Account }

  $email = ([string]$Account.email).Trim()
  if (-not [string]::IsNullOrWhiteSpace($email)) { return $Account }

  $dir = Get-AccountBackupDir $Account $DataRoot $BackupRoot
  if ([string]::IsNullOrWhiteSpace($dir)) { return $Account }

  $authPath = Join-Path $dir "auth.json"
  if (-not (Test-Path -LiteralPath $authPath)) { return $Account }

  try {
    $auth = Get-Content -LiteralPath $authPath -Raw | ConvertFrom-Json
    $authEmail = Get-AuthEmail $auth
    if ([string]::IsNullOrWhiteSpace($authEmail)) { return $Account }

    $group = Get-PlanGroup "" ([string]$Account.group)
    $safeName = Get-SafeFileName $authEmail
    if ([string]::IsNullOrWhiteSpace($safeName)) { return $Account }

    $canonicalDir = Join-Path $BackupRoot "$group\$safeName"
    $canonicalAuth = Join-Path $canonicalDir "auth.json"
    if (-not (Test-Path -LiteralPath $canonicalAuth)) {
      New-Item -ItemType Directory -Force -Path $canonicalDir | Out-Null
      Copy-Item -LiteralPath $authPath -Destination $canonicalAuth -Force
    }

    Set-JsonProp $Account "email" $authEmail
    Set-JsonProp $Account "name" $safeName
    Set-JsonProp $Account "group" $group
    Set-JsonProp $Account "path" "backups/$group/$safeName/auth.json"
  } catch {
    return $Account
  }

  return $Account
}

function Normalize-CasIndexFile {
  param(
    [Parameter(Mandatory = $true)][string]$IndexPath,
    [Parameter(Mandatory = $true)][string]$DataRoot,
    [Parameter(Mandatory = $true)][string]$BackupRoot
  )
  if (-not (Test-Path -LiteralPath $IndexPath)) { return }

  $index = Get-Content -LiteralPath $IndexPath -Raw | ConvertFrom-Json
  $original = @($index.accounts)
  $prepared = @($original | ForEach-Object { Repair-AccountEmailFromBackupAuth $_ $DataRoot $BackupRoot })
  $normalized = @(Normalize-AccountList $prepared)

  $firstAddedCachePath = Join-Path $DataRoot "first-added-cache.json"
  $firstAddedCache = [pscustomobject]@{}
  if (Test-Path -LiteralPath $firstAddedCachePath) {
    try { $firstAddedCache = Get-Content -LiteralPath $firstAddedCachePath -Raw | ConvertFrom-Json } catch { $firstAddedCache = [pscustomobject]@{} }
  }
  foreach ($account in $normalized) {
    $cacheKey = ([string]$account.email).Trim().ToLowerInvariant()
    if ([string]::IsNullOrWhiteSpace($cacheKey)) { $cacheKey = ([string]$account.name).Trim().ToLowerInvariant() }
    if ([string]::IsNullOrWhiteSpace($cacheKey)) { continue }

    $firstValue = ([string]$account.firstAddedAt).Trim()
    $firstCached = $firstAddedCache.PSObject.Properties[$cacheKey]
    if ([string]::IsNullOrWhiteSpace($firstValue) -and $firstCached) {
      $rawFirst = $firstCached.Value
      $firstValue = if ($rawFirst -is [string]) { $rawFirst } else { [string]$rawFirst.firstAddedAt }
    }
    if (-not [string]::IsNullOrWhiteSpace($firstValue)) {
      Set-JsonProp $account "firstAddedAt" $firstValue.Trim()
    }

  }

  $currentName = ([string]$index.current.name).Trim()
  $currentEmail = ""
  $currentOriginal = @($prepared | Where-Object { ([string]$_.name).Trim() -eq $currentName } | Select-Object -First 1)
  if ($currentOriginal.Count -gt 0) { $currentEmail = ([string]$currentOriginal[0].email).Trim().ToLowerInvariant() }
  $currentMatch = @($normalized | Where-Object {
    (([string]$_.name).Trim() -eq $currentName) -or
    (([string]$_.email).Trim().ToLowerInvariant() -eq $currentEmail)
  } | Select-Object -First 1)
  if ($currentMatch.Count -gt 0) {
    Set-JsonProp $index "current" ([pscustomobject]@{
      name = [string]$currentMatch[0].name
      group = [string]$currentMatch[0].group
    })
  }

  $currentFlagName = ([string]$index.current.name).Trim()
  $currentFlagEmail = ""
  if ($currentMatch.Count -gt 0) {
    $currentFlagEmail = ([string]$currentMatch[0].email).Trim().ToLowerInvariant()
  }
  foreach ($account in $normalized) {
    $accountName = ([string]$account.name).Trim()
    $accountEmail = ([string]$account.email).Trim().ToLowerInvariant()
    $isCurrent = (
      (-not [string]::IsNullOrWhiteSpace($currentFlagName) -and $accountName -eq $currentFlagName) -or
      (-not [string]::IsNullOrWhiteSpace($currentFlagEmail) -and $accountEmail -eq $currentFlagEmail)
    )
    Set-JsonProp $account "isCurrent" $isCurrent
  }

  $keepDirs = @{}
  foreach ($account in $normalized) {
    $dir = Get-AccountBackupDir $account $DataRoot $BackupRoot
    if (-not [string]::IsNullOrWhiteSpace($dir)) { $keepDirs[$dir.ToLowerInvariant()] = $true }
  }

  $backupRootFull = [IO.Path]::GetFullPath($BackupRoot)
  foreach ($account in $original) {
    $dir = Get-AccountBackupDir $account $DataRoot $BackupRoot
    if ([string]::IsNullOrWhiteSpace($dir)) { continue }
    if ($keepDirs.ContainsKey($dir.ToLowerInvariant())) { continue }
    if (-not $dir.StartsWith($backupRootFull, [StringComparison]::OrdinalIgnoreCase)) { continue }
    if (Test-Path -LiteralPath $dir) {
      Remove-Item -LiteralPath $dir -Recurse -Force
    }
  }

  Set-JsonProp $index "accounts" $normalized
  Write-Utf8NoBomFile -Path $IndexPath -Text ($index | ConvertTo-Json -Depth 8)
}

function Get-StringOrDefault {
  param($Value, [string]$Default)
  $s = [string]$Value
  if ([string]::IsNullOrWhiteSpace($s)) { return $Default }
  return $s
}

function Get-BoolOrDefault {
  param($Value, [bool]$Default)
  if ($null -eq $Value) { return $Default }
  if ($Value -is [bool]) { return $Value }
  $s = [string]$Value
  if ($s -match "^(true|1|yes)$") { return $true }
  if ($s -match "^(false|0|no)$") { return $false }
  return $Default
}

function Save-MinimalConfig {
  param(
    [Parameter(Mandatory = $true)][string]$ConfigPath,
    [string]$LastAccount = "",
    [string]$LastGroup = "",
    [string]$LastAt = ""
  )

  $existing = [pscustomobject]@{}
  if (Test-Path -LiteralPath $ConfigPath) {
    try {
      $existing = Get-Content -LiteralPath $ConfigPath -Raw | ConvertFrom-Json
    } catch {
      $existing = [pscustomobject]@{}
    }
  }

  $tabs = $existing.tabVisibility
  $theme = (Get-StringOrDefault $existing.theme "auto").ToLowerInvariant()
  if (@("auto", "light", "dark") -notcontains $theme) { $theme = "auto" }

  $closeBehavior = (Get-StringOrDefault $existing.closeWindowBehavior "tray").ToLowerInvariant()
  if ($closeBehavior -ne "exit") { $closeBehavior = "tray" }

  $lastAccountValue = Get-StringOrDefault $LastAccount (Get-StringOrDefault $existing.lastSwitchedAccount "")
  $lastGroupValue = Get-StringOrDefault $LastGroup (Get-StringOrDefault $existing.lastSwitchedGroup "")
  $lastAtValue = Get-StringOrDefault $LastAt (Get-StringOrDefault $existing.lastSwitchedAt "")

  $minimal = [ordered]@{
    language = Get-StringOrDefault $existing.language "zh-CN"
    languageIndex = [int]($existing.languageIndex -as [int])
    ideExe = Get-StringOrDefault $existing.ideExe "Code.exe"
    theme = $theme
    tabVisibility = [ordered]@{
      accounts = $true
      help = Get-BoolOrDefault $tabs.help $true
      settings = $true
    }
    closeWindowBehavior = $closeBehavior
  }

  if (-not [string]::IsNullOrWhiteSpace($lastAccountValue)) { $minimal.lastSwitchedAccount = $lastAccountValue }
  if (-not [string]::IsNullOrWhiteSpace($lastGroupValue)) { $minimal.lastSwitchedGroup = $lastGroupValue }
  if (-not [string]::IsNullOrWhiteSpace($lastAtValue)) { $minimal.lastSwitchedAt = $lastAtValue }

  Write-Utf8NoBomFile -Path $ConfigPath -Text ($minimal | ConvertTo-Json -Depth 8)
}

try {
  $toolRoot = $PSScriptRoot
  $dataRoot = Join-Path $toolRoot "data"
  $backupRoot = Join-Path $dataRoot "backups"
  $indexPath = Join-Path $backupRoot "index.json"
  $configPath = Join-Path $dataRoot "config.json"
  $quotaWindowCachePath = Join-Path $dataRoot "quota-window-cache.json"
  $codexAuth = if ([string]::IsNullOrWhiteSpace($AuthPath)) {
    Join-Path $HOME ".codex\auth.json"
  } else {
    [IO.Path]::GetFullPath($AuthPath)
  }

  New-Item -ItemType Directory -Force -Path $dataRoot | Out-Null
  Save-MinimalConfig -ConfigPath $configPath
  Normalize-CasIndexFile -IndexPath $indexPath -DataRoot $dataRoot -BackupRoot $backupRoot

  if ($RefreshStoredAccount) {
    if ([string]::IsNullOrWhiteSpace($AccountName)) {
      Write-Info "Stored account refresh requires AccountName."
      exit 12
    }
    if (-not (Test-Path -LiteralPath $indexPath)) {
      Write-Info "CAS account index is missing."
      exit 12
    }

    $index = Get-Content -LiteralPath $indexPath -Raw | ConvertFrom-Json
    $indexAccounts = Normalize-AccountList @($index.accounts)
    $needle = $AccountName.Trim().ToLowerInvariant()
    $groupNeedle = $AccountGroup.Trim().ToLowerInvariant()
    $target = @($indexAccounts | Where-Object {
      $nameMatch = (([string]$_.name).Trim().ToLowerInvariant() -eq $needle) -or
        (([string]$_.email).Trim().ToLowerInvariant() -eq $needle)
      $groupMatch = [string]::IsNullOrWhiteSpace($groupNeedle) -or (([string]$_.group).Trim().ToLowerInvariant() -eq $groupNeedle)
      $nameMatch -and $groupMatch
    } | Select-Object -First 1)
    if ($target.Count -eq 0) {
      Write-Info "Stored account was not found."
      exit 12
    }

    $relativeAuthPath = ([string]$target[0].path).Trim().Replace("/", [IO.Path]::DirectorySeparatorChar)
    if ([string]::IsNullOrWhiteSpace($relativeAuthPath)) {
      Write-Info "Stored account auth path is missing."
      exit 12
    }
    $storedAuthPath = [IO.Path]::GetFullPath((Join-Path $dataRoot $relativeAuthPath))
    $allowedBackupRoot = [IO.Path]::GetFullPath($backupRoot).TrimEnd("\") + "\"
    if (-not $storedAuthPath.StartsWith($allowedBackupRoot, [StringComparison]::OrdinalIgnoreCase)) {
      Write-Info "Stored account auth path is outside the backup directory."
      exit 12
    }
    if (-not (Test-Path -LiteralPath $storedAuthPath)) {
      Write-Info "Stored account auth file is missing."
      exit 12
    }

    $storedAuth = Get-Content -LiteralPath $storedAuthPath -Raw | ConvertFrom-Json
    $storedUsage = Get-UsageFromAuth $storedAuth
    $storedKey = if (-not [string]::IsNullOrWhiteSpace([string]$target[0].email)) { [string]$target[0].email } else { [string]$target[0].name }
    Set-JsonProp $target[0] "updatedAt" (Get-Date -Format "yyyy/MM/dd HH:mm")
    if ($storedUsage.ok) {
      Apply-UsageResultToEntry -Entry $target[0] -Usage $storedUsage
      Update-QuotaWindowCache -Path $quotaWindowCachePath -Key $storedKey -Usage $storedUsage
    } elseif ([int]$storedUsage.status -eq 401) {
      Set-JsonProp $target[0] "abnormal" $true
      Set-JsonProp $target[0] "abnormalReason" "usage_refresh_failed"
      Set-JsonProp $target[0] "abnormalAt" (Get-Date -Format "yyyy/MM/dd HH:mm")
      Set-JsonProp $target[0] "usageError" "auth_expired"
      Clear-UsageFields -Entry $target[0]
      Update-QuotaWindowCache -Path $quotaWindowCachePath -Key $storedKey -Usage $null
    } else {
      Set-JsonProp $target[0] "usageError" ([string]$storedUsage.error)
    }

    Set-JsonProp $index "accounts" @($indexAccounts)
    Write-Utf8NoBomFile -Path $indexPath -Text ($index | ConvertTo-Json -Depth 12)
    if ($storedUsage.ok) { exit 0 }
    if ([int]$storedUsage.status -eq 401) { exit 10 }
    exit 11
  }

  if ($CleanupOnly) {
    Write-Info "CAS account index cleanup finished."
    exit 0
  }

  if (-not (Test-Path -LiteralPath $codexAuth)) {
    Write-Info "No Codex auth.json found; nothing to sync."
    exit 0
  }

  $auth = Get-Content -LiteralPath $codexAuth -Raw | ConvertFrom-Json
  $email = Get-AuthEmail $auth
  if ([string]::IsNullOrWhiteSpace($email)) {
    Write-Info "Codex auth has no email; nothing to sync."
    exit 0
  }

  $usage = if ($NoUsage) {
    [pscustomobject]@{ ok = $false; planType = ""; q5 = -1; q7 = -1; r5s = -1; r7s = -1; r5 = -1; r7 = -1; w5s = -1; w7s = -1; windows = @(); resetAvailableCount = -1; status = $null; error = "usage_skipped" }
  } else {
    Get-UsageFromAuth $auth
  }

  New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
  if (Test-Path -LiteralPath $indexPath) {
    $index = Get-Content -LiteralPath $indexPath -Raw | ConvertFrom-Json
  } else {
    $index = [pscustomobject]@{
      current = [pscustomobject]@{ name = ""; group = "personal" }
      accounts = @()
    }
  }

  $safeName = Get-SafeFileName $email
  if ([string]::IsNullOrWhiteSpace($safeName)) {
    Write-Info "Cannot build account name from current auth email."
    exit 0
  }

  $indexAccounts = Normalize-AccountList @($index.accounts)
  $canonicalEmail = $email.Trim().ToLowerInvariant()
  $existing = @($indexAccounts | Where-Object {
    ([string]$_.name -eq $safeName) -or (([string]$_.email).Trim().ToLowerInvariant() -eq $canonicalEmail)
  } | Select-Object -First 1)
  $fallbackGroup = if ($existing.Count -gt 0 -and -not [string]::IsNullOrWhiteSpace([string]$existing[0].group)) {
    [string]$existing[0].group
  } else {
    "plus"
  }
  $group = if ($usage.ok) { Get-PlanGroup $usage.planType $fallbackGroup } else { Get-PlanGroup "" $fallbackGroup }
  $accountDir = Join-Path $backupRoot "$group\$safeName"
  New-Item -ItemType Directory -Force -Path $accountDir | Out-Null
  Copy-Item -LiteralPath $codexAuth -Destination (Join-Path $accountDir "auth.json") -Force

  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  if (Test-Path -LiteralPath $indexPath) {
    Copy-Item -LiteralPath $indexPath -Destination ($indexPath + ".bak-before-sync-$stamp") -Force
  }

  $accounts = @($indexAccounts | Where-Object {
    ([string]$_.name -ne $safeName) -and (([string]$_.email).Trim().ToLowerInvariant() -ne $canonicalEmail)
  })
  $entry = if ($existing.Count -gt 0) { $existing[0] } else { [pscustomobject]@{} }
  $nowText = Get-Date -Format "yyyy/MM/dd HH:mm"
  $firstAddedCachePath = Join-Path $dataRoot "first-added-cache.json"
  $firstAddedCache = [pscustomobject]@{}
  if (Test-Path -LiteralPath $firstAddedCachePath) {
    try { $firstAddedCache = Get-Content -LiteralPath $firstAddedCachePath -Raw | ConvertFrom-Json } catch { $firstAddedCache = [pscustomobject]@{} }
  }
  $cachedFirstAddedAt = ""
  if ($firstAddedCache.PSObject.Properties.Name -contains $canonicalEmail) {
    $rawCachedFirst = $firstAddedCache.$canonicalEmail
    $cachedFirstAddedAt = if ($rawCachedFirst -is [string]) { $rawCachedFirst } else { [string]$rawCachedFirst.firstAddedAt }
    $cachedFirstAddedAt = $cachedFirstAddedAt.Trim()
  }
  $firstAddedAt = ""
  if ($existing.Count -gt 0) {
    $firstAddedAt = ([string]$existing[0].firstAddedAt).Trim()
  }
  if ([string]::IsNullOrWhiteSpace($firstAddedAt) -and -not [string]::IsNullOrWhiteSpace($cachedFirstAddedAt)) {
    $firstAddedAt = $cachedFirstAddedAt
  }
  if ([string]::IsNullOrWhiteSpace($firstAddedAt)) {
    try {
      $sourceItem = Get-Item -LiteralPath $codexAuth -ErrorAction Stop
      $firstAddedAt = $sourceItem.LastWriteTime.ToString("yyyy/MM/dd HH:mm")
    } catch {
      $firstAddedAt = $nowText
    }
  }
  Set-JsonProp $entry "name" $safeName
  Set-JsonProp $entry "group" $group
  Set-JsonProp $entry "path" "backups/$group/$safeName/auth.json"
  Set-JsonProp $entry "updatedAt" $nowText
  Set-JsonProp $entry "email" $email
  Set-JsonProp $entry "firstAddedAt" $firstAddedAt

  if ($usage.ok) {
    Apply-UsageResultToEntry -Entry $entry -Usage $usage
    Update-QuotaWindowCache -Path $quotaWindowCachePath -Key $canonicalEmail -Usage $usage
  } elseif (-not $NoUsage -and [int]$usage.status -eq 401) {
    Set-JsonProp $entry "abnormal" $true
    Set-JsonProp $entry "abnormalReason" "usage_refresh_failed"
    Set-JsonProp $entry "abnormalAt" (Get-Date -Format "yyyy/MM/dd HH:mm")
    Set-JsonProp $entry "usageError" "auth_expired"
    Clear-UsageFields -Entry $entry
    Update-QuotaWindowCache -Path $quotaWindowCachePath -Key $canonicalEmail -Usage $null
  } elseif ($NoUsage) {
    if ($ClearAbnormal -or $existing.Count -eq 0) {
      Set-JsonProp $entry "abnormal" $false
      Set-JsonProp $entry "abnormalReason" ""
      Set-JsonProp $entry "abnormalAt" ""
    }
    if ($existing.Count -eq 0) {
      Set-JsonProp $entry "planType" ""
      Clear-UsageFields -Entry $entry
    }
  } elseif ($existing.Count -eq 0) {
    Set-JsonProp $entry "abnormal" $false
    Set-JsonProp $entry "abnormalReason" ""
    Set-JsonProp $entry "abnormalAt" ""
    Set-JsonProp $entry "planType" ""
    Clear-UsageFields -Entry $entry
  }

  Set-JsonProp $index "current" ([pscustomobject]@{ name = $safeName; group = $group })
  Set-JsonProp $index "accounts" (@($entry) + $accounts)
  Write-Utf8NoBomFile -Path $indexPath -Text ($index | ConvertTo-Json -Depth 8)

  Set-JsonProp $firstAddedCache $canonicalEmail ([pscustomobject]@{ firstAddedAt = $firstAddedAt })
  Write-Utf8NoBomFile -Path $firstAddedCachePath -Text ($firstAddedCache | ConvertTo-Json -Depth 8)
  Normalize-CasIndexFile -IndexPath $indexPath -DataRoot $dataRoot -BackupRoot $backupRoot

  Save-MinimalConfig -ConfigPath $configPath -LastAccount $safeName -LastGroup $group -LastAt (Get-Date -Format "yyyy/MM/dd HH:mm")

  if ($usage.ok) {
    $windowSummary = (@($usage.windows) | ForEach-Object { "{0}s={1}%" -f $_.windowSeconds, $_.remainingPercent }) -join ", "
    Write-Info ("Synced current Codex auth to CAS: {0} ({1}) windows: {2}" -f $email, $group, $windowSummary)
  } else {
    Write-Info ("Synced current Codex auth to CAS: {0} ({1}); usage check failed: {2}" -f $email, $group, $usage.error)
  }
} catch {
  if ($Quiet) { exit 0 }
  throw
}
