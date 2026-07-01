Codex 账号管理器 Windows 版

用法：
1. 双击 Start.bat。
2. 如果 Start.bat 无法启动，就双击 Start-CAS-Windows.cmd。
3. CAS 只管理本机 Codex 的 auth.json，不读取浏览器 Cookie、浏览器敏感信息或浏览器账号。

新增账号：
1. 在 CAS 里点“添加账号”。
2. 点“开始添加新账号”。
3. CAS 会先保护当前 .codex/auth.json，再重新打开 Codex。
4. 在 Codex 弹出的官方登录流程里登录新账号。
5. 登录完成后重新打开 CAS，CAS 会自动导入 Codex 最新写出的 auth.json。

默认浏览器进错账号时：
先切换默认浏览器配置，或在默认浏览器里退出旧账号后再继续登录。当前 Windows 版不再提供无痕窗口入口。

注意：
- 不要在 Codex 设置里点官方“退出登录”来切换已交给 CAS 管理的账号。
- 切换账号前先停下正在跑的 Codex 任务。
- 手动刷新额度会访问 OpenAI usage 接口；不要频繁连续刷新。
- CAS 不做代理、不改代理、不自动轮换账号。
- 账号备注保存在 data\account-notes.json。CAS 启动时和每次保存前都会自动备份到 data\account-notes-backups；清理旧版本时不要删除 data 目录。
- 其它导入/登录辅助脚本已放到 advanced 文件夹，普通使用只双击 Start.bat。
- 制作与售后入口：https://pay.ldxp.cn/shop/340
