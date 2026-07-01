param(
  [string]$Title,
  [int]$TimeoutSeconds = 10
)

if ([string]::IsNullOrWhiteSpace($Title)) {
  $Title = -join ([char[]]@(
    0x4e13, 0x5c5e, 0x7279, 0x6743, 0xff0c,
    0x4ec5, 0x9650, 0x672c, 0x5e97, 0x4e70,
    0x5bb6, 0x3002
  ))
}

$typeName = "CasWindowTitleSetter"
if (-not ([System.Management.Automation.PSTypeName]$typeName).Type) {
  Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public static class CasWindowTitleSetter {
  [DllImport("user32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
  public static extern bool SetWindowText(IntPtr hWnd, string lpString);
}
"@
}

$deadline = (Get-Date).AddSeconds([Math]::Max(1, $TimeoutSeconds))
$changed = $false

do {
  $targets = @(Get-Process -Name "_Codex_AccountSwitch_internal", "Codex_AccountSwitch" -ErrorAction SilentlyContinue)
  foreach ($target in $targets) {
    if ($target.MainWindowHandle -and $target.MainWindowHandle -ne [IntPtr]::Zero) {
      [void][CasWindowTitleSetter]::SetWindowText($target.MainWindowHandle, $Title)
      $changed = $true
    }
  }
  Start-Sleep -Milliseconds 500
} while ((Get-Date) -lt $deadline)

if ($changed) { exit 0 }
exit 1
