Option Explicit

Dim shell, fso, root, watcher, ps, cmd
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

root = fso.GetParentFolderName(WScript.ScriptFullName)
watcher = fso.BuildPath(root, "Start-CAS-Auth-Watcher.ps1")
ps = shell.ExpandEnvironmentStrings("%SystemRoot%") & "\System32\WindowsPowerShell\v1.0\powershell.exe"

cmd = """" & ps & """" & " -NoLogo -NoProfile -ExecutionPolicy Bypass -File " & """" & watcher & """"
shell.Run cmd, 0, False
