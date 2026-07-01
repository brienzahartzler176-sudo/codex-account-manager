# Codex Account Manager

A local-first Windows helper for managing Codex login backups, manual account switching, account notes, and manually refreshed usage information.

This project is intended for personal local use. It does not provide accounts, subscriptions, credits, proxies, reverse proxies, automation pools, or any bypass of official limits.

## What is included

- Web UI source under webui/
- Local PowerShell helper scripts
- Empty data/.gitkeep placeholder
- codex-shim/CodeShim.cs source

## What is not included

- Real user data
- auth.json files
- Account backups
- Account notes
- Logs, pid files, caches, WebView2 runtime data
- Windows binary release files such as .exe, .dll, or .zip

## Safety model

The tool is designed around visible manual operations: import, switch, refresh, and edit notes. It does not silently rotate accounts in the background.

## Disclaimer

This project is not affiliated with OpenAI. Codex and OpenAI product behavior may change over time, so usage and login helpers may need updates.

## License

MIT