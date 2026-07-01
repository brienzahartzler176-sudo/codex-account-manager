using System;
using System.Diagnostics;
using System.IO;
using System.Threading;

internal static class CodeShim
{
    private const string CodexAppId = "shell:AppsFolder\\OpenAI.Codex_2p2nqsd0c76g0!App";

    private static int Main()
    {
        try
        {
            Log("shim invoked");
            if (string.Equals(Environment.GetEnvironmentVariable("CAS_SHIM_RESTART_CODEX"), "1", StringComparison.OrdinalIgnoreCase))
            {
                Log("restart mode enabled");
                StopCodexProcesses();
            }

            Log("launching Codex");
            Process.Start(new ProcessStartInfo
            {
                FileName = "explorer.exe",
                Arguments = CodexAppId,
                UseShellExecute = false,
                CreateNoWindow = true
            });
            return 0;
        }
        catch (Exception ex)
        {
            Log("primary launch failed: " + ex.GetType().Name + " " + ex.Message);
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = "/c start \"\" \"" + CodexAppId + "\"",
                    UseShellExecute = false,
                    CreateNoWindow = true
                });
                return 0;
            }
            catch (Exception fallbackEx)
            {
                Log("fallback launch failed: " + fallbackEx.GetType().Name + " " + fallbackEx.Message);
                return 1;
            }
        }
    }

    private static void StopCodexProcesses()
    {
        StopByName("Codex");
        StopByName("codex");
        WaitForCodexExit(10000);
        Thread.Sleep(1200);
    }

    private static void StopByName(string processName)
    {
        foreach (var process in Process.GetProcessesByName(processName))
        {
            try
            {
                if (!process.HasExited && process.MainWindowHandle != IntPtr.Zero)
                {
                    Log("closing " + processName + " pid=" + process.Id);
                    process.CloseMainWindow();
                    if (process.WaitForExit(3000))
                    {
                        continue;
                    }
                }

                if (!process.HasExited)
                {
                    Log("killing " + processName + " pid=" + process.Id);
                    process.Kill();
                    process.WaitForExit(3000);
                }
            }
            catch (Exception ex)
            {
                Log("stop failed for " + processName + " pid=" + process.Id + ": " + ex.GetType().Name + " " + ex.Message);
                // Best effort only. Starting Codex is more important than failing on a stale helper process.
            }
            finally
            {
                process.Dispose();
            }
        }
    }

    private static void WaitForCodexExit(int timeoutMs)
    {
        var sw = Stopwatch.StartNew();
        while (sw.ElapsedMilliseconds < timeoutMs)
        {
            if (Process.GetProcessesByName("Codex").Length == 0 &&
                Process.GetProcessesByName("codex").Length == 0)
            {
                Log("all Codex processes exited");
                return;
            }
            Thread.Sleep(250);
        }
        Log("timeout waiting for Codex processes to exit");
    }

    private static void Log(string message)
    {
        try
        {
            var dir = AppDomain.CurrentDomain.BaseDirectory;
            var parent = Directory.GetParent(dir);
            var root = parent == null ? dir : parent.FullName;
            var logPath = Path.Combine(root, "data", "codex-shim.log");
            var logDir = Path.GetDirectoryName(logPath);
            if (!string.IsNullOrEmpty(logDir))
            {
                Directory.CreateDirectory(logDir);
            }
            File.AppendAllText(logPath, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + " " + message + Environment.NewLine);
        }
        catch
        {
            // Logging must never block switching.
        }
    }
}
