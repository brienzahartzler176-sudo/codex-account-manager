using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading;

internal static class CodeShim
{
    private const string CodexAppId = "shell:AppsFolder\\OpenAI.Codex_2p2nqsd0c76g0!App";
    private const int GracefulShutdownTimeoutMs = 3000;
    private const int ForcedShutdownTimeoutMs = 1500;
    private const int StartupTimeoutMs = 20000;

    private static readonly DateTime OperationStartedAtUtc = DateTime.UtcNow;
    private static readonly string OperationId = Guid.NewGuid().ToString("N");

    private sealed class ProcessSnapshot
    {
        internal readonly List<int> ChatGptPids = new List<int>();
        internal readonly List<int> MainWindowPids = new List<int>();
        internal readonly List<int> CodexPids = new List<int>();

        internal HashSet<int> AllPids()
        {
            var result = new HashSet<int>();
            AddAll(result, ChatGptPids);
            AddAll(result, CodexPids);
            return result;
        }

        private static void AddAll(HashSet<int> target, List<int> source)
        {
            foreach (var pid in source)
            {
                target.Add(pid);
            }
        }
    }

    private static int Main()
    {
        var restart = string.Equals(
            Environment.GetEnvironmentVariable("CAS_SHIM_RESTART_CODEX"),
            "1",
            StringComparison.OrdinalIgnoreCase);
        var snapshot = new ProcessSnapshot();

        try
        {
            Log("shim invoked");
            if (restart)
            {
                Log("restart mode enabled");
                WriteStatus("closing", "");
                snapshot = CaptureProcessSnapshot();
                StopCodexProcesses(snapshot);
                WriteStatus("launching", "");
            }

            string launchError;
            if (!TryLaunchCodex(out launchError))
            {
                if (restart)
                {
                    WriteStatus("failed", launchError);
                }
                return 1;
            }

            if (!restart)
            {
                return 0;
            }

            WriteStatus("waiting", "");
            if (WaitForNewDesktopWindow(snapshot.AllPids(), StartupTimeoutMs))
            {
                Log("new Codex window detected");
                WriteStatus("ready", "");
                return 0;
            }

            Log("new Codex window was not detected before timeout");
            WriteStatus("failed", "window_timeout");
            return 0;
        }
        catch (Exception ex)
        {
            Log("unexpected failure: " + ex.GetType().Name + " " + ex.Message);
            if (restart)
            {
                WriteStatus("failed", "unexpected_error");
            }
            return 1;
        }
    }

    private static ProcessSnapshot CaptureProcessSnapshot()
    {
        var snapshot = new ProcessSnapshot();
        CaptureByName("ChatGPT", snapshot.ChatGptPids, snapshot.MainWindowPids);
        CaptureByName("Codex", snapshot.CodexPids, snapshot.MainWindowPids);
        Log("captured ChatGPT=" + snapshot.ChatGptPids.Count +
            " Codex=" + snapshot.CodexPids.Count +
            " windows=" + snapshot.MainWindowPids.Count);
        return snapshot;
    }

    private static void CaptureByName(string processName, List<int> allPids, List<int> mainWindowPids)
    {
        foreach (var process in Process.GetProcessesByName(processName))
        {
            try
            {
                if (process.HasExited)
                {
                    continue;
                }
                allPids.Add(process.Id);
                if (process.MainWindowHandle != IntPtr.Zero)
                {
                    mainWindowPids.Add(process.Id);
                }
            }
            catch
            {
            }
            finally
            {
                process.Dispose();
            }
        }
    }

    private static void StopCodexProcesses(ProcessSnapshot snapshot)
    {
        RequestDesktopShutdown(snapshot.MainWindowPids);
        if (WaitForCapturedExit(snapshot.MainWindowPids, snapshot.CodexPids, GracefulShutdownTimeoutMs))
        {
            Log("captured Codex processes exited gracefully");
            return;
        }

        Log("graceful shutdown timed out; cleaning captured Codex processes");
        WriteStatus("cleanup", "");
        ForceStopPids(snapshot.MainWindowPids);
        ForceStopPids(snapshot.CodexPids);
        ForceStopPids(snapshot.ChatGptPids);
        WaitForCapturedExit(snapshot.MainWindowPids, snapshot.CodexPids, ForcedShutdownTimeoutMs);
    }

    private static void RequestDesktopShutdown(List<int> pids)
    {
        foreach (var pid in pids)
        {
            Process process = null;
            try
            {
                process = Process.GetProcessById(pid);
                if (!process.HasExited && process.MainWindowHandle != IntPtr.Zero)
                {
                    Log("requesting graceful close for pid=" + pid);
                    process.CloseMainWindow();
                }
            }
            catch (Exception ex)
            {
                Log("graceful close failed for pid=" + pid + ": " + ex.GetType().Name + " " + ex.Message);
            }
            finally
            {
                if (process != null)
                {
                    process.Dispose();
                }
            }
        }
    }

    private static void ForceStopPids(List<int> pids)
    {
        var seen = new HashSet<int>();
        foreach (var pid in pids)
        {
            if (!seen.Add(pid))
            {
                continue;
            }

            Process process = null;
            try
            {
                process = Process.GetProcessById(pid);
                if (!process.HasExited)
                {
                    Log("forcing captured pid=" + pid);
                    process.Kill();
                    process.WaitForExit(1000);
                }
            }
            catch (ArgumentException)
            {
            }
            catch (Exception ex)
            {
                Log("force stop failed for pid=" + pid + ": " + ex.GetType().Name + " " + ex.Message);
            }
            finally
            {
                if (process != null)
                {
                    process.Dispose();
                }
            }
        }
    }

    private static bool WaitForCapturedExit(List<int> mainPids, List<int> backendPids, int timeoutMs)
    {
        var sw = Stopwatch.StartNew();
        while (sw.ElapsedMilliseconds < timeoutMs)
        {
            if (!AnyPidAlive(mainPids) && !AnyPidAlive(backendPids))
            {
                return true;
            }
            Thread.Sleep(100);
        }
        return !AnyPidAlive(mainPids) && !AnyPidAlive(backendPids);
    }

    private static bool AnyPidAlive(List<int> pids)
    {
        foreach (var pid in pids)
        {
            Process process = null;
            try
            {
                process = Process.GetProcessById(pid);
                if (!process.HasExited)
                {
                    return true;
                }
            }
            catch (ArgumentException)
            {
            }
            catch
            {
            }
            finally
            {
                if (process != null)
                {
                    process.Dispose();
                }
            }
        }
        return false;
    }

    private static bool TryLaunchCodex(out string errorCode)
    {
        errorCode = "";
        try
        {
            Log("launching Codex");
            Process.Start(new ProcessStartInfo
            {
                FileName = "explorer.exe",
                Arguments = CodexAppId,
                UseShellExecute = false,
                CreateNoWindow = true
            });
            return true;
        }
        catch (Exception ex)
        {
            Log("primary launch failed: " + ex.GetType().Name + " " + ex.Message);
        }

        try
        {
            Log("using fallback Codex launch");
            Process.Start(new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = "/c start \"\" \"" + CodexAppId + "\"",
                UseShellExecute = false,
                CreateNoWindow = true
            });
            return true;
        }
        catch (Exception ex)
        {
            Log("fallback launch failed: " + ex.GetType().Name + " " + ex.Message);
            errorCode = "launch_failed";
            return false;
        }
    }

    private static bool WaitForNewDesktopWindow(HashSet<int> oldPids, int timeoutMs)
    {
        var sw = Stopwatch.StartNew();
        while (sw.ElapsedMilliseconds < timeoutMs)
        {
            if (HasNewMainWindow("ChatGPT", oldPids) || HasNewMainWindow("Codex", oldPids))
            {
                return true;
            }
            Thread.Sleep(250);
        }
        return false;
    }

    private static bool HasNewMainWindow(string processName, HashSet<int> oldPids)
    {
        foreach (var process in Process.GetProcessesByName(processName))
        {
            try
            {
                if (!oldPids.Contains(process.Id) && !process.HasExited && process.MainWindowHandle != IntPtr.Zero)
                {
                    return true;
                }
            }
            catch
            {
            }
            finally
            {
                process.Dispose();
            }
        }
        return false;
    }

    private static string GetToolRoot()
    {
        var shimDir = Path.GetDirectoryName(typeof(CodeShim).Assembly.Location);
        if (string.IsNullOrEmpty(shimDir))
        {
            shimDir = AppDomain.CurrentDomain.BaseDirectory;
        }
        shimDir = shimDir.TrimEnd(
            Path.DirectorySeparatorChar,
            Path.AltDirectorySeparatorChar);
        var parent = Directory.GetParent(shimDir);
        return parent == null ? shimDir : parent.FullName;
    }

    private static void WriteStatus(string stage, string errorCode)
    {
        string tempPath = null;
        try
        {
            var dataDir = Path.Combine(GetToolRoot(), "data");
            Directory.CreateDirectory(dataDir);
            var statusPath = Path.Combine(dataDir, "switch-status.json");
            tempPath = statusPath + "." + Process.GetCurrentProcess().Id + ".tmp";
            var now = DateTime.UtcNow.ToString("o");
            var json = "{" +
                "\"schema\":1," +
                "\"operationId\":\"" + OperationId + "\"," +
                "\"stage\":\"" + JsonEscape(stage) + "\"," +
                "\"startedAt\":\"" + OperationStartedAtUtc.ToString("o") + "\"," +
                "\"updatedAt\":\"" + now + "\"," +
                "\"errorCode\":\"" + JsonEscape(errorCode) + "\"" +
                "}";

            File.WriteAllText(tempPath, json, new UTF8Encoding(false));
            if (File.Exists(statusPath))
            {
                File.Replace(tempPath, statusPath, null);
            }
            else
            {
                File.Move(tempPath, statusPath);
            }
        }
        catch (Exception ex)
        {
            Log("status write failed: " + ex.GetType().Name + " " + ex.Message);
        }
        finally
        {
            if (!string.IsNullOrEmpty(tempPath) && File.Exists(tempPath))
            {
                try
                {
                    File.Delete(tempPath);
                }
                catch
                {
                }
            }
        }
    }

    private static string JsonEscape(string value)
    {
        return (value ?? "")
            .Replace("\\", "\\\\")
            .Replace("\"", "\\\"")
            .Replace("\r", "\\r")
            .Replace("\n", "\\n");
    }

    private static void Log(string message)
    {
        try
        {
            var dataDir = Path.Combine(GetToolRoot(), "data");
            Directory.CreateDirectory(dataDir);
            var logPath = Path.Combine(dataDir, "codex-shim.log");
            File.AppendAllText(
                logPath,
                DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + " " + message + Environment.NewLine);
        }
        catch
        {
        }
    }
}
