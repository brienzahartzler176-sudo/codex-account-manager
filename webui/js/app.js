(function () {
  "use strict";

  const DEFAULT_I18N = {
    "app.brand": "codex 账号管理器",
    "tab.accounts": "账号管理",
    "tab.notes": "账号备注",
    "tab.help": "软件使用说明",
    "tab.settings": "设置",
    "toolbar.add_current": "添加账号",
    "toolbar.login_running": "等待登录...",
    "search.placeholder": "搜索账号（支持账号名称/邮箱）",
    "group.all": "全部",
    "group.free": "Free",
    "group.plus": "Plus",
    "group.team": "Team",
    "group.pro": "Pro",
    "table.account": "账号",
    "table.quota": "模型配额",
    "table.recent": "时间记录",
    "table.action": "操作",
    "settings.title": "轻量设置",
    "settings.subtitle": "只保留日常使用需要的基础选项。",
    "settings.language_label": "语言",
    "settings.theme_label": "主题",
    "settings.theme_auto": "自动",
    "settings.theme_light": "浅色",
    "settings.theme_dark": "深色",
    "settings.theme_hint": "自动模式会跟随 Windows 主题。",
    "settings.close_behavior_label": "关闭按钮行为",
    "settings.close_behavior_hint": "选择点击窗口右上角关闭按钮时，是进入后台托盘还是直接退出。",
    "settings.close_behavior_tray": "进入后台",
    "settings.close_behavior_exit": "直接关闭",
    "settings.tab_visibility_section": "页面显示",
    "settings.tab_visibility_hint": "只控制轻量版保留的页面；设置页始终显示。",
    "settings.tab_visibility_badge": "必选",
    "settings.tab_visibility_locked": "始终显示",
    "settings.tab_visibility_showing": "显示中",
    "settings.tab_visibility_hidden": "已隐藏",
    "summary.total_accounts": "总账号数",
    "summary.current_account": "当前账号",
    "summary.avg_5h": "平均额度",
    "summary.avg_7d": "平均次额度",
    "summary.window_average": "平均 {window}",
    "summary.low_accounts": "低额度",
    "summary.current_empty": "暂无当前账号",
    "dialog.add_account.title": "添加 Codex 新账号",
    "dialog.add_account.new_login_desc": "CAS 会保存当前登录，完整关闭 Codex，再启动官方 codex login。登录成功后会自动导入账号并重新打开 Codex。",
    "dialog.add_account.new_login_btn": "开始添加新账号",
    "dialog.add_account.guidance_title": "新增账号提醒",
    "dialog.add_account.guidance_neutral": "当前 CAS 管理 {count} 个账号。CAS 不看浏览器登录了谁，只导入 Codex 最后写出的 auth.json。",
    "dialog.add_account.guidance_four": "当前 CAS 管理 4 个账号，再新增就是第 5 个。建议只手动切换，不要并发跑任务，也不要自动轮换。",
    "dialog.add_account.guidance_many": "当前 CAS 管理 {count} 个账号，账号较多。建议降低登录、切换和刷新频率。",
    "dialog.prepare_new_login.title": "确认准备登录新账号",
    "dialog.prepare_new_login.message": "下一步会保存当前 auth.json、完整关闭 Codex，再启动官方 codex login。登录失败时会自动恢复原账号。",
    "dialog.prepare_new_login.auth_note": "当前 CAS 已管理 {count} 个账号。CAS 只识别当前用户目录下的 .codex/auth.json，不识别浏览器账号。",
    "dialog.prepare_new_login.oauth_note": "如果默认浏览器还是旧账号，请先切换 Windows 默认浏览器或浏览器 Profile。OAuth 链接不要发给别人，也不要多个浏览器反复打开。",
    "dialog.prepare_new_login.frequency_note": "刚才已经准备过一次登录。先确认 Codex 是否已经进入新账号登录流程，再重复操作。",
    "dialog.relogin.title": "重新登录 Codex 账号",
    "dialog.relogin.message": "账号 {name} 的认证已失效。下一步会启动官方 codex login；登录同一个邮箱后，CAS 会自动替换旧凭证，失败则恢复原账号。",
    "dialog.rename.title": "重命名账号",
    "dialog.rename.name_label": "新账号名",
    "dialog.rename.name_placeholder": "请输入新账号名",
    "dialog.common.cancel": "取消",
    "dialog.common.confirm": "确认",
    "dialog.confirm.title": "请确认",
    "dialog.confirm.default_message": "确认执行此操作吗？",
    "dialog.delete.title": "删除账号",
    "dialog.delete.message": "确认删除账号备份 {name} 吗？",
    "confirm.switch_restart_ide": "确认切换到 {name}？切换后会自动重启 Codex。",
    "accounts.empty": "暂无账号备份",
    "tag.current": "当前",
    "tag.abnormal": "异常",
    "tag.group_personal": "个人",
    "tag.group_business": "企业",
    "tag.plan_free": "Free",
    "tag.plan_plus": "Plus",
    "tag.plan_team": "Team",
    "tag.plan_pro": "Pro",
    "tag.plan_unknown": "未知类型",
    "quota.gpt": "Codex",
    "quota.placeholder": "暂无配额数据",
    "quota.no_window": "官方暂未返回额度窗口",
    "quota.account_auth_expired": "账号认证失效了，重新登录后再试",
    "quota.account_refresh_failed": "额度刷新失败，稍后手动刷新这一行",
    "quota.account_abnormal": "账号状态异常，重新登录后再试",
    "quota.reset": "重置 {r5}/{r7}",
    "quota.reset_free": "重置 {r7}",
    "quota.reset_title": "5H 重置倒计时 {r5}\n7D 重置倒计时 {r7}",
    "quota.reset_free_title": "7D 重置倒计时 {r7}",
    "quota.remaining_5h": "5H",
    "quota.remaining_7d": "7D",
    "quota.reset_dynamic": "{window} 重置倒计时 {time}",
    "quota.remaining_value": "剩余 {value}",
    "quota.recovery_label": "额度恢复",
    "quota.recovery_unknown": "官方未返回",
    "quota.reset_count_label": "重置次数",
    "quota.reset_count_value": "{count} 次",
    "quota.reset_count_unknown": "未查询",
    "quota.checked_just_now": "刚刚查询",
    "quota.checked_minutes_ago": "{minutes} 分钟前查询",
    "quota.checked_hours_ago": "{hours} 小时前查询",
    "quota.checked_on": "{date} 查询",
    "time.sync_label": "最近同步",
    "time.first_added_label": "首次入库",
    "time.managed_label": "已管理",
    "time.plan_estimate_label": "订阅估算",
    "action.switch_title": "切换到此账号",
    "action.switch": "切换",
    "action.relogin_title": "重新登录并更新此账号凭证",
    "action.relogin": "重新登录",
    "action.rename_title": "重命名账号",
    "action.rename": "重命名",
    "action.refresh_title": "刷新配额",
    "action.refresh": "刷新",
    "action.delete_title": "删除账号",
    "action.delete": "删除",
    "pagination.prev": "上一页",
    "pagination.next": "下一页",
    "pagination.info": "第 {page} / {pages} 页，每页 {size} 个",
    "count.format": "共 {total} 个账号",
    "count.empty": "共 0 个账号",
    "quick.theme_title": "切换主题",
    "quick.language_title": "切换语言",
    "status_code.invalid_name": "保存失败：账号名无效",
    "status_code.name_too_long": "账号名最长 64 个字符",
    "status_code.auth_missing": "保存失败：当前账号文件不存在",
    "status_code.duplicate_name": "名称重复，请修改后重试",
    "status_code.create_dir_failed": "保存失败：无法创建备份目录",
    "status_code.write_failed": "操作失败：无法写入文件",
    "status_code.not_found": "操作失败：未找到目标",
    "status_code.userprofile_missing": "操作失败：未找到用户目录",
    "status_code.restart_failed": "重启 Codex 失败，请手动完全退出后再打开",
    "status_code.config_saved": "设置已保存",
    "status_code.backup_saved": "账号备份已保存",
    "status_code.switch_success": "切换成功，正在重启 Codex",
    "switch_progress.title": "正在切换 Codex 账号",
    "switch_progress.target": "正在切换到 {name}",
    "switch_progress.expected": "通常需要 4–8 秒，Codex 会自动重新打开。",
    "switch_progress.slow": "Codex 启动比平时慢，仍在继续，请不要重复点击。",
    "switch_progress.preparing": "正在准备目标账号…",
    "switch_progress.closing": "正在关闭旧 Codex…",
    "switch_progress.cleanup": "正在清理旧后台…",
    "switch_progress.launching": "正在重新打开 Codex…",
    "switch_progress.waiting": "正在等待 Codex 窗口…",
    "switch_progress.ready": "切换完成，Codex 已重新打开",
    "switch_progress.failed_launch": "未能重新打开 Codex",
    "switch_progress.failed_timeout": "等待 Codex 窗口超时",
    "switch_progress.failed_status": "无法读取切换状态",
    "switch_progress.failed_hint": "账号状态已切换；重新打开只会启动 Codex，不会再次切换账号。",
    "switch_progress.elapsed": "已用时 {seconds} 秒",
    "switch_progress.retry": "重新打开 Codex",
    "switch_progress.close": "关闭提示",
    "switch_progress.retry_sent": "已重新发送打开请求",
    "status_code.delete_success": "删除成功",
    "status_code.import_success": "导入成功",
    "status_code.export_success": "导出成功",
    "status_code.quota_refreshed": "额度已刷新",
    "status_code.quota_refresh_running": "额度刷新正在进行中，请稍候…",
    "status_code.quota_refresh_failed": "额度刷新失败",
    "status_code.quota_refresh_progress": "正在刷新额度... {progress}",
    "status_code.account_quota_refreshed": "账号额度已刷新",
    "status_code.account_abnormal_marked": "账号认证已失效，已标记为异常，请重新登录",
    "status_code.account_renamed": "账号已重命名",
    "status_code.account_renamed_and_refreshed": "账号已重命名并刷新额度",
    "status_code.prepare_new_login_opened": "已开始准备登录新账号",
    "status.prepare_new_login_opened": "已开始准备登录新账号",
    "status.login_browser": "请在浏览器完成官方 Codex 登录",
    "status.login_syncing": "登录完成，正在导入账号",
    "status.login_success": "账号已登录并导入",
    "status.login_restored": "登录失败，已恢复原账号",
    "status.login_failed": "登录失败：{reason}",
    "status.usage_refresh_success": "额度已刷新",
    "status.usage_refresh_failed": "额度刷新失败，请稍后再试",
    "status.usage_auth_expired": "账号认证已失效，请重新登录",
    "status_code.import_cancelled": "导入已取消",
    "status_code.export_cancelled": "导出已取消",
    "status_code.unknown_action": "未知操作",
    "progress.count": "{current}/{total}个",
    "toolbar.add_running": "正在准备...",
    "notes.saved": "账号备注已保存",
    "notes.deleted": "账号备注已删除",
    "notes.save_failed": "保存失败：本地存储不可用",
    "notes.file_save_failed": "保存失败：账号备注文件不可写",
    "notes.file_empty_rejected": "已保护账号备注：本次空备注写入被拦截",
    "notes.add": "新增备注",
    "notes.batch_import": "批量导入",
    "notes.batch_import_close": "收起导入",
    "notes.batch_title": "批量导入备注",
    "notes.batch_label": "邮箱 + 备注",
    "notes.batch_placeholder": "邮箱：one@example.com\n备注：登录线索、手机号、密钥提示\n\n邮箱：two@example.com\n备注：第二个账号的备注",
    "notes.batch_submit": "导入备注",
    "notes.batch_empty": "没有识别到邮箱，请按“邮箱：xxx@example.com”填写。",
    "notes.batch_done": "导入完成：新增 {added} 张，更新 {updated} 张",
    "notes.pin_top": "置顶",
    "notes.pinned": "账号备注已置顶",
    "notes.status_label": "账号备注状态",
    "notes.status_plus": "Plus",
    "notes.status_timeout": "超时",
    "notes.status_unavailable": "不具备",
    "notes.tag_add": "添加标签",
    "notes.tag_edit": "编辑",
    "notes.tag_label": "账号备注标签",
    "notes.tag_text_label": "标签文字",
    "notes.tag_text_placeholder": "比如 Plus、主号、备用、无手机",
    "notes.tag_text_color": "文字颜色",
    "notes.tag_bg_color": "背景颜色",
    "notes.tag_preview": "预览",
    "notes.tag_save": "保存标签",
    "notes.tag_delete": "删除标签",
    "notes.tag_empty": "请先填写标签文字",
    "notes.collapse": "收起",
    "notes.back_accounts": "返回账号管理",
    "notes.edit": "编辑",
    "notes.delete": "删除",
    "notes.save": "保存",
    "notes.cancel": "取消",
    "notes.editor_new": "新增备注",
    "notes.editor_edit": "编辑备注",
    "notes.email_label": "邮箱",
    "notes.email_placeholder": "xxx@example.com",
    "notes.note_label": "备注",
    "notes.note_placeholder": "登录线索、手机号、密钥提示等",
    "notes.empty": "还没有账号备注，点“新增备注”添加。",
    "notes.search_placeholder": "搜索邮箱或备注...",
    "notes.search_clear": "清空",
    "notes.search_empty": "没有找到匹配的备注。",
    "notes.preview_no_note": "（没有备注）",
    "notes.updated_at": "更新于 {time}",
    "notes.page_info": "第 {page}/{pages} 页，共 {total} 张备注",
    "notes.page_prev": "上一页",
    "notes.page_next": "下一页",
    "notes.status_default": "账号备注保存在 CAS data/account-notes.json，并自动备份到 data/account-notes-backups。",
    "notes.status_saved": "已保存：{time}。账号备注已自动备份到 data/account-notes-backups。",
    "notes.email_required": "请先填写有效邮箱",
    "notes.delete_title": "删除账号备注",
    "notes.delete_message": "确认删除这个邮箱的备注吗？",
    "help.title": "软件使用说明",
    "help.add.title": "新增账号怎么走",
    "help.add.text": "先点“添加账号”，再点“开始添加新账号”。CAS 会保存当前登录并启动官方 codex login；你在浏览器完成登录后，新账号会自动导入。",
    "help.switch.title": "切换账号",
    "help.switch.text": "在账号列表里找到要用的邮箱，点右侧“切换”。确认后 CAS 会把本机 Codex 登录状态换成这个账号，并重启 Codex。切换前先停下正在跑的任务。",
    "help.logout.title": "不要在 Codex 里退出账号",
    "help.logout.text": "已经交给 CAS 管的账号，不要在 Codex 设置里点退出。退出可能让旧凭证失效，CAS 再切回来就会异常。新增账号用 CAS 的“准备登录新账号”。如果默认浏览器已登录旧账号，请先切换浏览器默认配置或退出旧账号。",
    "help.safety.title": "安全边界",
    "help.safety.text": "CAS 只做个人本地管理：手动导入、手动切换、手动刷新单个账号。不做反代、不改代理、不自动轮换、不低额度自动换号，也不并发多号跑同一批任务。",
    "help.quota.title": "查看额度",
    "help.quota.text": "模型配额会按官方当前返回的时间窗口动态显示，不再固定写死 5H / 7D。它只显示上次手动刷新的结果。",
    "help.refresh.title": "刷新额度",
    "help.refresh.text": "想看某个号的最新额度，只点那一行的“刷新”。不要连续频繁刷，也不要多个号一起刷。",
    "help.notes.title": "账号备注",
    "help.notes.text": "点“账号备注”会进入单独的备注页面。每个邮箱一张本地备注卡，可以放登录线索、手机号、密钥提示，不参与登录、切换或刷新。",
    "help.delete.title": "删除账号",
    "help.delete.text": "不用的账号可以点“删除”，删除前会再问你一次，防止误删。",
    "help.update.title": "获取更新",
    "help.update.text": "新版本会发布到 GitHub。下载最新版后退出软件，覆盖解压到原目录，并保留 data 文件夹。下载地址：",
    "help.update.url": "https://github.com/brienzahartzler176-sudo/codex-account-manager/releases",
    "help.support.title": "制作与售后",
    "help.support.text": "本工具由本店提供，制作与售后入口：",
    "help.support.url": "https://pay.ldxp.cn/shop/340",
    "footer.update_link": "GitHub 更新",
    "footer.shop_link": "本店入口",
    "ide.codex": "Codex"
  };

  const dom = {
    brandTitle: document.getElementById("brandTitle"),
    tabBtnAccounts: document.getElementById("tabBtnAccounts"),
    tabBtnNotes: document.getElementById("tabBtnNotes"),
    tabBtnHelp: document.getElementById("tabBtnHelp"),
    tabBtnSettings: document.getElementById("tabBtnSettings"),
    toolbarActions: document.querySelector(".toolbar-actions"),
    toolbarQuick: document.getElementById("toolbarQuick"),
    quickThemeBtn: document.getElementById("quickThemeBtn"),
    quickLangBtn: document.getElementById("quickLangBtn"),
    quickLangMenu: document.getElementById("quickLangMenu"),
    addAccountBtn: document.getElementById("addAccountBtn"),
    accountNotesBtn: document.getElementById("accountNotesBtn"),
    searchInput: document.getElementById("searchInput"),
    groupAllBtn: document.getElementById("groupAllBtn"),
    groupFreeBtn: document.getElementById("groupFreeBtn"),
    groupPlusBtn: document.getElementById("groupPlusBtn"),
    groupTeamBtn: document.getElementById("groupTeamBtn"),
    groupProBtn: document.getElementById("groupProBtn"),
    accountNotesPanel: document.getElementById("accountNotesPanel"),
    accountNotesEditorHost: document.getElementById("accountNotesEditorHost"),
    accountNotesList: document.getElementById("accountNotesList"),
    accountNotesAddBtn: document.getElementById("accountNotesAddBtn"),
    accountNotesBatchImportBtn: document.getElementById("accountNotesBatchImportBtn"),
    accountNotesCollapseBtn: document.getElementById("accountNotesCollapseBtn"),
    accountNotesSearchInput: document.getElementById("accountNotesSearchInput"),
    accountNotesClearSearchBtn: document.getElementById("accountNotesClearSearchBtn"),
    accountNotesStatus: document.getElementById("accountNotesStatus"),
    accountsSectionTitle: document.getElementById("accountsSectionTitle"),
    thAccount: document.getElementById("thAccount"),
    thQuota: document.getElementById("thQuota"),
    thRecent: document.getElementById("thRecent"),
    thAction: document.getElementById("thAction"),
    accountsBody: document.getElementById("accountsBody"),
    accountsPagination: document.getElementById("accountsPagination"),
    accountsPrevPageBtn: document.getElementById("accountsPrevPageBtn"),
    accountsNextPageBtn: document.getElementById("accountsNextPageBtn"),
    accountsPageInfo: document.getElementById("accountsPageInfo"),
    helpTitle: document.getElementById("helpTitle"),
    helpStepAddTitle: document.getElementById("helpStepAddTitle"),
    helpStepAddText: document.getElementById("helpStepAddText"),
    helpStepSwitchTitle: document.getElementById("helpStepSwitchTitle"),
    helpStepSwitchText: document.getElementById("helpStepSwitchText"),
    helpStepLogoutTitle: document.getElementById("helpStepLogoutTitle"),
    helpStepLogoutText: document.getElementById("helpStepLogoutText"),
    helpStepSafetyTitle: document.getElementById("helpStepSafetyTitle"),
    helpStepSafetyText: document.getElementById("helpStepSafetyText"),
    helpStepQuotaTitle: document.getElementById("helpStepQuotaTitle"),
    helpStepQuotaText: document.getElementById("helpStepQuotaText"),
    helpStepRefreshTitle: document.getElementById("helpStepRefreshTitle"),
    helpStepRefreshText: document.getElementById("helpStepRefreshText"),
    helpStepNotesTitle: document.getElementById("helpStepNotesTitle"),
    helpStepNotesText: document.getElementById("helpStepNotesText"),
    helpStepDeleteTitle: document.getElementById("helpStepDeleteTitle"),
    helpStepDeleteText: document.getElementById("helpStepDeleteText"),
    helpStepUpdateTitle: document.getElementById("helpStepUpdateTitle"),
    helpStepUpdateText: document.getElementById("helpStepUpdateText"),
    helpStepUpdateLink: document.getElementById("helpStepUpdateLink"),
    helpStepSupportTitle: document.getElementById("helpStepSupportTitle"),
    helpStepSupportText: document.getElementById("helpStepSupportText"),
    helpStepSupportLink: document.getElementById("helpStepSupportLink"),
    summaryTotalLabel: document.getElementById("summaryTotalLabel"),
    summaryCurrentLabel: document.getElementById("summaryCurrentLabel"),
    summaryAvg5Label: document.getElementById("summaryAvg5Label"),
    summaryAvg7Label: document.getElementById("summaryAvg7Label"),
    summaryLowLabel: document.getElementById("summaryLowLabel"),
    summaryTotalValue: document.getElementById("summaryTotalValue"),
    summaryCurrentValue: document.getElementById("summaryCurrentValue"),
    summaryAvg5Value: document.getElementById("summaryAvg5Value"),
    summaryAvg7Value: document.getElementById("summaryAvg7Value"),
    summaryLowValue: document.getElementById("summaryLowValue"),
    countText: document.getElementById("countText"),
    footerUpdateLink: document.getElementById("footerUpdateLink"),
    footerShopLink: document.getElementById("footerShopLink"),
    logEl: document.getElementById("log"),
    settingsTitle: document.getElementById("settingsTitle"),
    settingsSub: document.getElementById("settingsSub"),
    settingsLanguageLabel: document.getElementById("settingsLanguageLabel"),
    languageOptions: document.getElementById("languageOptions"),
    settingsThemeLabel: document.getElementById("settingsThemeLabel"),
    settingsThemeHint: document.getElementById("settingsThemeHint"),
    themeAutoBtn: document.getElementById("themeAutoBtn"),
    themeLightBtn: document.getElementById("themeLightBtn"),
    themeDarkBtn: document.getElementById("themeDarkBtn"),
    settingsCloseBehaviorLabel: document.getElementById("settingsCloseBehaviorLabel"),
    settingsCloseBehaviorHint: document.getElementById("settingsCloseBehaviorHint"),
    closeBehaviorTrayBtn: document.getElementById("closeBehaviorTrayBtn"),
    closeBehaviorExitBtn: document.getElementById("closeBehaviorExitBtn"),
    settingsTabVisibilitySectionTitle: document.getElementById("settingsTabVisibilitySectionTitle"),
    settingsTabVisibilitySectionHint: document.getElementById("settingsTabVisibilitySectionHint"),
    settingsTabVisibilityList: document.getElementById("settingsTabVisibilityList"),
    confirmModal: document.getElementById("confirmModal"),
    confirmTitle: document.getElementById("confirmTitle"),
    confirmMessage: document.getElementById("confirmMessage"),
    confirmCancelBtn: document.getElementById("confirmCancelBtn"),
    confirmOkBtn: document.getElementById("confirmOkBtn"),
    renameModal: document.getElementById("renameModal"),
    renameTitle: document.getElementById("renameTitle"),
    renameNameLabel: document.getElementById("renameNameLabel"),
    renameNameInput: document.getElementById("renameNameInput"),
    renameCancelBtn: document.getElementById("renameCancelBtn"),
    renameConfirmBtn: document.getElementById("renameConfirmBtn"),
    addAccountModal: document.getElementById("addAccountModal"),
    addAccountTitle: document.getElementById("addAccountTitle"),
    addAccountGuidance: document.getElementById("addAccountGuidance"),
    addAccountGuidanceTitle: document.getElementById("addAccountGuidanceTitle"),
    addAccountGuidanceText: document.getElementById("addAccountGuidanceText"),
    addPaneNewLoginDesc: document.getElementById("addPaneNewLoginDesc"),
    addAccountPrepareNewBtn: document.getElementById("addAccountPrepareNewBtn"),
    addAccountCancelBtn: document.getElementById("addAccountCancelBtn"),
    switchProgressOverlay: document.getElementById("switchProgressOverlay"),
    switchProgressSpinner: document.getElementById("switchProgressSpinner"),
    switchProgressTitle: document.getElementById("switchProgressTitle"),
    switchProgressTarget: document.getElementById("switchProgressTarget"),
    switchProgressStage: document.getElementById("switchProgressStage"),
    switchProgressHint: document.getElementById("switchProgressHint"),
    switchProgressBar: document.getElementById("switchProgressBar"),
    switchProgressSteps: document.getElementById("switchProgressSteps"),
    switchProgressElapsed: document.getElementById("switchProgressElapsed"),
    switchProgressActions: document.getElementById("switchProgressActions"),
    switchProgressCloseBtn: document.getElementById("switchProgressCloseBtn"),
    switchProgressRetryBtn: document.getElementById("switchProgressRetryBtn"),
    toastWrap: document.getElementById("toastWrap")
  };

  const TOP_LEVEL_TABS = [
    { key: "accounts", icon: "01", button: dom.tabBtnAccounts, panelId: "tab-accounts", hideable: false },
    { key: "notes", icon: "02", button: dom.tabBtnNotes, panelId: "tab-notes", hideable: false },
    { key: "help", icon: "03", button: dom.tabBtnHelp, panelId: "tab-help", hideable: true },
    { key: "settings", icon: "04", button: dom.tabBtnSettings, panelId: "tab-settings", hideable: false }
  ];

  const ACCOUNTS_PAGE_SIZE = 20;
  const ACCOUNT_NOTES_PAGE_SIZE = 10;
  const ACCOUNT_NOTES_V1_STORAGE_KEY = "cas_account_notes_v1";
  const ACCOUNT_NOTES_STORAGE_KEY = "cas_account_notes_v2";
  const ACCOUNT_NOTES_OPEN_KEY = "cas_account_notes_open_v1";
  const ACCOUNT_NOTE_TAG_STYLE_KEY = "cas_account_note_tag_style_v1";
  const ADD_ACCOUNT_WATCH_INTERVAL_MS = 1000;
  const ADD_ACCOUNT_WATCH_TIMEOUT_MS = 5 * 60 * 1000;
  const SWITCH_STATUS_POLL_MS = 250;
  const SWITCH_SLOW_MS = 8000;
  const SWITCH_TIMEOUT_MS = 25000;
  const SWITCH_READY_HIDE_MS = 1200;
  const DEFAULT_ACCOUNT_NOTE_TAG_STYLE = {
    textColor: "#1d4ed8",
    bgColor: "#eff6ff"
  };
  const LEGACY_ACCOUNT_NOTE_TAG_STYLES = {
    plus: { textColor: "#1d4ed8", bgColor: "#eff6ff" },
    timeout: { textColor: "#a16207", bgColor: "#fef9c3" },
    unavailable: { textColor: "#475569", bgColor: "#f1f5f9" }
  };
  const ACCOUNT_NOTE_STATUSES = ["plus", "timeout", "unavailable"];
  const ACCOUNT_NOTE_STATUS_LABEL_KEYS = {
    plus: "notes.status_plus",
    timeout: "notes.status_timeout",
    unavailable: "notes.status_unavailable"
  };
  const LOCAL_METADATA_BASE_URL = "http://127.0.0.1:17842";
  const PREPARE_NEW_LOGIN_INTENTS_KEY = "cas_prepare_new_login_intents_v1";
  const PREPARE_NEW_LOGIN_WINDOW_MS = 30 * 60 * 1000;
  const LOGIN_STATUS_POLL_MS = 800;
  const LOGIN_STATUS_TIMEOUT_MS = 10 * 60 * 1000;

  const state = {
    appVersion: "v1.0.0",
    debug: new URLSearchParams(location.search).get("debug") === "1",
    accounts: [],
    filteredAccounts: [],
    currentAccountRef: { name: "", email: "", group: "" },
    groupFilter: "all",
    currentTab: "accounts",
    currentLanguage: "zh-CN",
    currentIdeExe: "Code.exe",
    closeWindowBehavior: "tray",
    themeMode: readCachedThemeMode(),
    tabVisibility: getDefaultTabVisibility(),
    languageIndex: [{ code: "zh-CN", name: "简体中文", file: "zh-CN.json" }],
    i18n: { ...DEFAULT_I18N },
    confirmAction: null,
    renameTargetName: "",
    renameTargetGroup: "personal",
    refreshMode: "",
    refreshTargetKey: "",
    refreshProgressCurrent: 0,
    refreshProgressTotal: 0,
    accountsPage: 0,
    importMode: "",
    accountNotesOpen: false,
    accountNotes: [],
    accountNotesPage: 0,
    accountNotesEditingId: "",
    accountNoteTagEditorId: "",
    accountNotesDraft: null,
    accountNotesSearch: "",
    accountNotesBatchImportOpen: false,
    accountNotesBatchText: "",
    accountNotesSavedAt: 0,
    accountNotesFileExists: false,
    accountNotesFileSavePending: null,
    configLoaded: false,
    saveConfigTimer: null,
    quickLangMenuOpen: false,
    firstAddedAtCache: new Map(),
    firstAddedAtCacheLoading: false,
    quotaResetCountCache: new Map(),
    quotaResetCountCacheLoading: false,
    accountsIndexLoading: false,
    accountsIndexSignature: "",
    addAccountWatchTimer: 0,
    addAccountWatchDeadline: 0,
    addAccountWatchBaselineKeys: "",
    addAccountWatchBaselineCurrent: "",
    refreshTargetAccount: null,
    switchProgressActive: false,
    switchProgressStage: "idle",
    switchTargetName: "",
    switchStartedAt: 0,
    switchRequestStartedAt: 0,
    switchPollTimer: 0,
    switchElapsedTimer: 0,
    switchReadyHideTimer: 0,
    switchErrorCode: "",
    switchOperationId: "",
    switchStatusSeen: false,
    loginProgressActive: false,
    loginProgressStage: "idle",
    loginStartedAt: 0,
    loginStatusTimer: 0,
    loginStatusOperationId: "",
    loginLastToastStage: ""
  };

  const mediaDark = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function log(msg) {
    if (!state.debug || !dom.logEl) return;
    dom.logEl.textContent = `[${new Date().toLocaleTimeString()}] ${msg}\n` + dom.logEl.textContent;
  }

  function installHttpWebViewBridge() {
    if (window.chrome && window.chrome.webview) return;
    const host = String(window.location.hostname || "").toLowerCase();
    const isLocalHost = ["127.0.0.1", "localhost", "::1"].includes(host);
    if (!isLocalHost || !window.fetch) return;

    const listeners = new Set();
    window.chrome = window.chrome || {};
    window.chrome.webview = {
      postMessage(message) {
        fetch("/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message || {})
        })
          .then((response) => response.json())
          .then((payload) => {
            const messages = Array.isArray(payload?.messages)
              ? payload.messages
              : (payload && typeof payload === "object" && payload.type ? [payload] : []);
            messages.forEach((msg) => {
              listeners.forEach((listener) => listener({ data: msg }));
            });
          })
          .catch((error) => {
            log(`http bridge failed: ${error?.message || error}`);
          });
      },
      addEventListener(type, listener) {
        if (type === "message" && typeof listener === "function") listeners.add(listener);
      },
      removeEventListener(type, listener) {
        if (type === "message") listeners.delete(listener);
      }
    };
    window.CAS_HTTP_BRIDGE = true;
  }

  installHttpWebViewBridge();

  function post(action, payload = {}) {
    if (window.chrome && window.chrome.webview) {
      window.chrome.webview.postMessage({ action, ...payload });
      log(`command sent: ${action}`);
    } else {
      log(`not running in WebView2: ${action}`);
    }
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#39;");
  }

  function actionIcon(name) {
    const icons = {
      switch: '<path d="M7 7h10l-3-3m3 3-3 3M17 17H7l3-3m-3 3 3 3"/>',
      rename: '<path d="m4 16-.8 4 4-.8L18.6 7.8a2 2 0 0 0 0-2.8L17 3.4a2 2 0 0 0-2.8 0L4 13.6Z"/><path d="m13.5 4.5 3 3"/>',
      refresh: '<path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M6.1 9A7 7 0 0 1 18 6.7L20 12"/><path d="M17.9 15A7 7 0 0 1 6 17.3L4 12"/>',
      delete: '<path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 14h10l1-14"/><path d="M9 7V4h6v3"/>'
    };
    return `<span class="action-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false">${icons[name] || ""}</svg></span>`;
  }

  function t(key, vars = {}) {
    let text = state.i18n[key] ?? DEFAULT_I18N[key] ?? key;
    Object.keys(vars).forEach((k) => {
      text = String(text).replaceAll(`{${k}}`, String(vars[k]));
    });
    return String(text);
  }

  function showToast(message, level = "info") {
    if (!dom.toastWrap) return;
    const el = document.createElement("div");
    el.className = `toast ${level}`;
    el.textContent = String(message || "");
    dom.toastWrap.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(-6px)";
    }, 2600);
    setTimeout(() => el.remove(), 3000);
  }

  const SWITCH_STAGE_UI = {
    preparing: { step: 0, progress: 8, textKey: "switch_progress.preparing" },
    closing: { step: 1, progress: 28, textKey: "switch_progress.closing" },
    cleanup: { step: 1, progress: 44, textKey: "switch_progress.cleanup" },
    launching: { step: 2, progress: 64, textKey: "switch_progress.launching" },
    waiting: { step: 2, progress: 84, textKey: "switch_progress.waiting" },
    ready: { step: 3, progress: 100, textKey: "switch_progress.ready" },
    failed: { step: 2, progress: 92, textKey: "switch_progress.failed_launch" }
  };

  function getSwitchElapsedMs() {
    if (!state.switchStartedAt) return 0;
    return Math.max(0, Date.now() - state.switchStartedAt);
  }

  function clearSwitchProgressTimers() {
    if (state.switchPollTimer) window.clearTimeout(state.switchPollTimer);
    if (state.switchElapsedTimer) window.clearInterval(state.switchElapsedTimer);
    if (state.switchReadyHideTimer) window.clearTimeout(state.switchReadyHideTimer);
    state.switchPollTimer = 0;
    state.switchElapsedTimer = 0;
    state.switchReadyHideTimer = 0;
  }

  function getSwitchFailureText() {
    if (state.switchErrorCode === "window_timeout") return t("switch_progress.failed_timeout");
    if (state.switchErrorCode === "status_unavailable") return t("switch_progress.failed_status");
    return t("switch_progress.failed_launch");
  }

  function renderSwitchProgress() {
    if (!dom.switchProgressOverlay) return;
    const active = !!state.switchProgressActive;
    const stage = SWITCH_STAGE_UI[state.switchProgressStage] ? state.switchProgressStage : "preparing";
    const meta = SWITCH_STAGE_UI[stage];
    const isReady = stage === "ready";
    const isFailed = stage === "failed";
    const elapsedMs = getSwitchElapsedMs();

    dom.switchProgressOverlay.classList.toggle("show", active);
    dom.switchProgressOverlay.classList.toggle("is-ready", isReady);
    dom.switchProgressOverlay.classList.toggle("is-failed", isFailed);
    dom.switchProgressOverlay.setAttribute("aria-hidden", active ? "false" : "true");
    if (!active) return;

    if (dom.switchProgressTitle) dom.switchProgressTitle.textContent = t("switch_progress.title");
    if (dom.switchProgressTarget) {
      dom.switchProgressTarget.textContent = t("switch_progress.target", { name: state.switchTargetName });
    }
    if (dom.switchProgressStage) {
      dom.switchProgressStage.textContent = isFailed ? getSwitchFailureText() : t(meta.textKey);
    }
    if (dom.switchProgressHint) {
      if (isFailed) {
        dom.switchProgressHint.textContent = t("switch_progress.failed_hint");
      } else if (isReady) {
        dom.switchProgressHint.textContent = "";
      } else if (elapsedMs >= SWITCH_SLOW_MS) {
        dom.switchProgressHint.textContent = t("switch_progress.slow");
      } else {
        dom.switchProgressHint.textContent = t("switch_progress.expected");
      }
    }
    if (dom.switchProgressBar) dom.switchProgressBar.style.width = `${meta.progress}%`;
    if (dom.switchProgressElapsed) {
      dom.switchProgressElapsed.textContent = t("switch_progress.elapsed", {
        seconds: (elapsedMs / 1000).toFixed(1)
      });
    }
    dom.switchProgressSteps?.querySelectorAll("[data-switch-step]").forEach((item) => {
      const step = Number(item.getAttribute("data-switch-step"));
      item.classList.toggle("done", isReady ? step <= meta.step : step < meta.step);
      item.classList.toggle("active", !isReady && !isFailed && step === meta.step);
    });
    if (dom.switchProgressActions) dom.switchProgressActions.hidden = !isFailed;
    if (dom.switchProgressCloseBtn) dom.switchProgressCloseBtn.textContent = t("switch_progress.close");
    if (dom.switchProgressRetryBtn) dom.switchProgressRetryBtn.textContent = t("switch_progress.retry");
  }

  function finishSwitchProgress() {
    clearSwitchProgressTimers();
    state.switchProgressActive = false;
    state.switchProgressStage = "idle";
    state.switchTargetName = "";
    state.switchStartedAt = 0;
    state.switchRequestStartedAt = 0;
    state.switchErrorCode = "";
    state.switchOperationId = "";
    state.switchStatusSeen = false;
    renderSwitchProgress();
    renderAccounts();
  }

  function setSwitchProgressStage(stage, errorCode = "") {
    if (!state.switchProgressActive || !SWITCH_STAGE_UI[stage]) return;
    state.switchProgressStage = stage;
    state.switchErrorCode = String(errorCode || "").trim().toLowerCase();
    renderSwitchProgress();

    if (stage === "ready") {
      if (state.switchPollTimer) window.clearTimeout(state.switchPollTimer);
      state.switchPollTimer = 0;
      if (!state.switchReadyHideTimer) {
        state.switchReadyHideTimer = window.setTimeout(finishSwitchProgress, SWITCH_READY_HIDE_MS);
      }
    } else if (stage === "failed") {
      if (state.switchPollTimer) window.clearTimeout(state.switchPollTimer);
      state.switchPollTimer = 0;
    }
  }

  function scheduleSwitchStatusPoll(delay = SWITCH_STATUS_POLL_MS) {
    if (!state.switchProgressActive || ["ready", "failed"].includes(state.switchProgressStage)) return;
    if (state.switchPollTimer) window.clearTimeout(state.switchPollTimer);
    state.switchPollTimer = window.setTimeout(pollSwitchStatus, delay);
  }

  async function pollSwitchStatus() {
    state.switchPollTimer = 0;
    if (!state.switchProgressActive || ["ready", "failed"].includes(state.switchProgressStage)) return;

    try {
      const response = await fetch(`${LOCAL_METADATA_BASE_URL}/switch-status`, {
        method: "GET",
        cache: "no-store"
      });
      const payload = await response.json();
      if (!response.ok || payload?.ok === false) throw new Error(payload?.error || `HTTP ${response.status}`);

      const stage = String(payload?.stage || "idle").trim().toLowerCase();
      const updatedAt = Date.parse(String(payload?.updatedAt || ""));
      const belongsToCurrentSwitch = Number.isFinite(updatedAt)
        && updatedAt >= state.switchRequestStartedAt;
      if (stage !== "idle" && SWITCH_STAGE_UI[stage] && belongsToCurrentSwitch) {
        state.switchStatusSeen = true;
        state.switchOperationId = String(payload?.operationId || "");
        setSwitchProgressStage(stage, payload?.errorCode || "");
      }
    } catch (error) {
      log(`switch status failed: ${error?.message || error}`);
    }

    if (!state.switchProgressActive || ["ready", "failed"].includes(state.switchProgressStage)) return;
    if (getSwitchElapsedMs() >= SWITCH_TIMEOUT_MS) {
      setSwitchProgressStage("failed", state.switchStatusSeen ? "window_timeout" : "status_unavailable");
      return;
    }
    scheduleSwitchStatusPoll();
  }

  function beginAccountSwitch(name, group) {
    if (state.switchProgressActive) return;
    const now = Date.now();
    state.switchProgressActive = true;
    state.switchProgressStage = "preparing";
    state.switchTargetName = String(name || "");
    state.switchStartedAt = now;
    state.switchRequestStartedAt = now;
    state.switchErrorCode = "";
    state.switchOperationId = "";
    state.switchStatusSeen = false;
    renderSwitchProgress();
    renderAccounts();
    state.switchElapsedTimer = window.setInterval(renderSwitchProgress, 100);
    scheduleSwitchStatusPoll(0);

    window.setTimeout(() => {
      post("switch_account", {
        account: name,
        group,
        language: state.currentLanguage,
        ideExe: state.currentIdeExe
      });
    }, 0);
  }

  async function retryCodexLaunch() {
    if (!state.switchProgressActive || state.switchProgressStage !== "failed") return;
    if (dom.switchProgressRetryBtn) dom.switchProgressRetryBtn.disabled = true;
    const now = Date.now();
    try {
      const response = await fetch(`${LOCAL_METADATA_BASE_URL}/launch-codex`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: "{}"
      });
      const payload = await response.json();
      if (!response.ok || payload?.ok === false) throw new Error(payload?.error || `HTTP ${response.status}`);

      state.switchStartedAt = now;
      state.switchRequestStartedAt = now;
      state.switchErrorCode = "";
      state.switchStatusSeen = false;
      setSwitchProgressStage("waiting");
      showToast(t("switch_progress.retry_sent"), "info");
      scheduleSwitchStatusPoll(0);
    } catch (error) {
      log(`Codex relaunch failed: ${error?.message || error}`);
      setSwitchProgressStage("failed", "launch_failed");
    } finally {
      if (dom.switchProgressRetryBtn) dom.switchProgressRetryBtn.disabled = false;
    }
  }

  function isUsefulAccountNotesText(text) {
    return String(text || "").trim().length > 0;
  }

  function getSeedAccountNotesText() {
    return String(window.CAS_ACCOUNT_NOTES_SEED || "").trim();
  }

  function createAccountNoteId() {
    return `note_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function normalizeAccountNoteEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  function isValidAccountNoteEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
  }

  function normalizeAccountNoteStatus(value) {
    const status = String(value || "").trim().toLowerCase();
    return ACCOUNT_NOTE_STATUSES.includes(status) ? status : "";
  }

  function normalizeAccountNoteStatusLabels(value) {
    const source = value && typeof value === "object" ? value : {};
    const labels = {};
    ACCOUNT_NOTE_STATUSES.forEach((status) => {
      const label = String(source[status] || "").trim();
      if (label) labels[status] = label;
    });
    return labels;
  }

  function getAccountNoteStatusLabel(note, status) {
    const normalizedStatus = normalizeAccountNoteStatus(status);
    if (!normalizedStatus) return "";
    const labels = normalizeAccountNoteStatusLabels(note?.statusLabels);
    return labels[normalizedStatus] || t(ACCOUNT_NOTE_STATUS_LABEL_KEYS[normalizedStatus]);
  }

  function normalizeAccountNoteColor(value, fallback) {
    const color = String(value || "").trim();
    if (/^#[0-9a-f]{6}$/i.test(color)) return color.toLowerCase();
    if (/^#[0-9a-f]{3}$/i.test(color)) {
      return `#${color.slice(1).split("").map((part) => part + part).join("")}`.toLowerCase();
    }
    return fallback;
  }

  function normalizeAccountNoteTag(value) {
    const source = value && typeof value === "object" ? value : {};
    const text = String(source.text || "").trim();
    if (!text) return null;
    return {
      text,
      textColor: normalizeAccountNoteColor(source.textColor, DEFAULT_ACCOUNT_NOTE_TAG_STYLE.textColor),
      bgColor: normalizeAccountNoteColor(source.bgColor, DEFAULT_ACCOUNT_NOTE_TAG_STYLE.bgColor)
    };
  }

  function readAccountNoteTagStyle() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ACCOUNT_NOTE_TAG_STYLE_KEY) || "{}");
      return {
        textColor: normalizeAccountNoteColor(parsed?.textColor, DEFAULT_ACCOUNT_NOTE_TAG_STYLE.textColor),
        bgColor: normalizeAccountNoteColor(parsed?.bgColor, DEFAULT_ACCOUNT_NOTE_TAG_STYLE.bgColor)
      };
    } catch (_) {
      return { ...DEFAULT_ACCOUNT_NOTE_TAG_STYLE };
    }
  }

  function writeAccountNoteTagStyle(style) {
    try {
      localStorage.setItem(ACCOUNT_NOTE_TAG_STYLE_KEY, JSON.stringify({
        textColor: normalizeAccountNoteColor(style?.textColor, DEFAULT_ACCOUNT_NOTE_TAG_STYLE.textColor),
        bgColor: normalizeAccountNoteColor(style?.bgColor, DEFAULT_ACCOUNT_NOTE_TAG_STYLE.bgColor)
      }));
    } catch (_) {
    }
  }

  function getAccountNoteTag(note) {
    const customTag = normalizeAccountNoteTag(note?.tag);
    if (customTag) return customTag;

    const legacyStatus = normalizeAccountNoteStatus(note?.status);
    if (!legacyStatus) return null;
    const legacyStyle = LEGACY_ACCOUNT_NOTE_TAG_STYLES[legacyStatus] || DEFAULT_ACCOUNT_NOTE_TAG_STYLE;
    return {
      text: getAccountNoteStatusLabel(note, legacyStatus),
      textColor: legacyStyle.textColor,
      bgColor: legacyStyle.bgColor
    };
  }

  function cleanAccountNoteBody(text) {
    const cleaned = String(text || "")
      .replace(/^[\s:：\-\|,，;；]+/, "")
      .replace(/^\s*(?:备注|note)\s*[：:]\s*/i, "")
      .trim();
    return cleaned;
  }

  function parseAccountNotesBlocks(text) {
    const source = String(text || "");
    const emailRe = /(?:(?:邮箱|email)\s*[：:]\s*)?([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;
    const matches = [];
    let match;
    while ((match = emailRe.exec(source))) {
      const email = normalizeAccountNoteEmail(match[1]);
      const emailOffset = match[0].lastIndexOf(match[1]);
      matches.push({
        email,
        start: match.index,
        end: match.index + emailOffset + match[1].length
      });
    }

    const byEmail = new Map();
    matches.forEach((item, index) => {
      const nextStart = matches[index + 1]?.start ?? source.length;
      const note = cleanAccountNoteBody(source.slice(item.end, nextStart));
      if (!isValidAccountNoteEmail(item.email)) return;
      byEmail.set(item.email, {
        id: createAccountNoteId(),
        email: item.email,
        note,
        tag: null,
        status: "",
        statusLabels: {},
        updatedAt: Date.now()
      });
    });
    return [...byEmail.values()];
  }

  function normalizeAccountNoteRecord(raw) {
    const email = normalizeAccountNoteEmail(raw?.email);
    if (!isValidAccountNoteEmail(email)) return null;
    return {
      id: String(raw?.id || createAccountNoteId()),
      email,
      note: String(raw?.note || ""),
      tag: normalizeAccountNoteTag(raw?.tag),
      status: normalizeAccountNoteStatus(raw?.status),
      statusLabels: normalizeAccountNoteStatusLabels(raw?.statusLabels),
      updatedAt: Number(raw?.updatedAt || Date.now())
    };
  }

  function normalizeAccountNotesList(notes) {
    const normalized = (Array.isArray(notes) ? notes : [])
      .map(normalizeAccountNoteRecord)
      .filter(Boolean);
    const byEmail = new Map();
    normalized.forEach((item) => byEmail.set(item.email, item));
    return [...byEmail.values()];
  }

  function readAccountNotesV2() {
    try {
      const raw = localStorage.getItem(ACCOUNT_NOTES_STORAGE_KEY) || "[]";
      const parsed = JSON.parse(raw);
      return normalizeAccountNotesList(parsed);
    } catch (_) {
      return [];
    }
  }

  function writeAccountNotesLocalStorage(notes) {
    try {
      localStorage.setItem(ACCOUNT_NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (_) {
    }
  }

  async function readAccountNotesFile() {
    try {
      const response = await fetch(`${LOCAL_METADATA_BASE_URL}/account-notes`, { cache: "no-store" });
      if (!response.ok) return { exists: false, notes: [] };
      const payload = await response.json();
      const notes = normalizeAccountNotesList(payload?.notes);
      return { exists: !!payload?.exists, notes };
    } catch (_) {
      return { exists: false, notes: [] };
    }
  }

  async function saveAccountNotesToFile(notes, options = {}) {
    const normalized = normalizeAccountNotesList(notes);
    const response = await fetch(`${LOCAL_METADATA_BASE_URL}/account-notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes: normalized,
        allowEmpty: options.allowEmpty === true
      })
    });
    if (!response.ok) throw new Error(`status ${response.status}`);
    const payload = await response.json();
    if (!payload?.ok) {
      const error = new Error(payload?.error || "not ok");
      error.code = payload?.error || "";
      throw error;
    }
    state.accountNotesFileExists = true;
    return payload;
  }

  function queueAccountNotesFileSave(notes, options = {}) {
    const normalized = normalizeAccountNotesList(notes);
    const pending = saveAccountNotesToFile(normalized, options)
      .catch((error) => {
        log(`account notes file save failed: ${error?.message || error}`);
        showToast(error?.code === "empty_notes_rejected"
          ? t("notes.file_empty_rejected")
          : t("notes.file_save_failed"), "error");
      })
      .finally(() => {
        if (state.accountNotesFileSavePending === pending) {
          state.accountNotesFileSavePending = null;
        }
      });
    state.accountNotesFileSavePending = pending;
    return pending;
  }

  function writeAccountNotesV2(notes, options = {}) {
    const normalized = normalizeAccountNotesList(notes);
    writeAccountNotesLocalStorage(normalized);
    state.accountNotes = normalized;
    state.accountNotesSavedAt = Date.now();
    queueAccountNotesFileSave(normalized, options);
    return normalized;
  }

  async function loadAccountNotes() {
    if (!dom.accountNotesList) return;
    let notes = [];
    let fileExists = false;
    try {
      state.accountNotesOpen = localStorage.getItem(ACCOUNT_NOTES_OPEN_KEY) === "1";
    } catch (_) {
      state.accountNotesOpen = false;
    }

    const fileState = await readAccountNotesFile();
    fileExists = !!fileState.exists;
    state.accountNotesFileExists = fileExists;
    if (fileState.notes.length) {
      notes = fileState.notes;
      writeAccountNotesLocalStorage(notes);
    }

    if (!notes.length && !fileExists) {
      notes = readAccountNotesV2();
      if (notes.length) {
        queueAccountNotesFileSave(notes);
      }
    }

    if (!notes.length && !fileExists) {
      const legacyText = (() => {
        try {
          return localStorage.getItem(ACCOUNT_NOTES_V1_STORAGE_KEY) || "";
        } catch (_) {
          return "";
        }
      })() || getSeedAccountNotesText();

      if (isUsefulAccountNotesText(legacyText)) {
        notes = parseAccountNotesBlocks(legacyText);
        if (notes.length) {
          try {
            writeAccountNotesV2(notes);
          } catch (_) {
            state.accountNotes = notes;
          }
        }
      }
    }

    state.accountNotes = notes;
    renderAccountNotesPanel();
    renderAccountNotesStatus();
  }

  function renderAccountNotesPanel() {
    if (!dom.accountNotesPanel) return;
    dom.accountNotesPanel.classList.toggle("is-open", !!state.accountNotesOpen);
    if (dom.accountNotesBtn) {
      const label = "账号备注";
      dom.accountNotesBtn.innerHTML = `<span class="btn-icon">▤</span><span>${escapeHtml(label)}</span>`;
    }
    if (dom.accountNotesBatchImportBtn) {
      dom.accountNotesBatchImportBtn.textContent = state.accountNotesBatchImportOpen
        ? t("notes.batch_import_close")
        : t("notes.batch_import");
    }
    if (dom.accountNotesCollapseBtn) {
      dom.accountNotesCollapseBtn.textContent = state.currentTab === "notes"
        ? t("notes.back_accounts")
        : t("notes.collapse");
    }
    if (dom.accountNotesSearchInput && dom.accountNotesSearchInput.value !== state.accountNotesSearch) {
      dom.accountNotesSearchInput.value = state.accountNotesSearch || "";
    }
    if (dom.accountNotesClearSearchBtn) {
      dom.accountNotesClearSearchBtn.textContent = t("notes.search_clear");
      dom.accountNotesClearSearchBtn.disabled = !getAccountNotesSearchQuery();
    }
    renderAccountNotesEditorHost();
    renderAccountNotesList();
  }

  function renderAccountNoteEditor(note) {
    const isNew = note.id === "__new__";
    const card = document.createElement("article");
    card.className = "account-note-card editing";

    const title = document.createElement("div");
    title.className = "account-note-editor-title";
    title.textContent = t(isNew ? "notes.editor_new" : "notes.editor_edit");

    const emailLabel = document.createElement("label");
    emailLabel.className = "account-note-field";
    emailLabel.textContent = t("notes.email_label");
    const emailInput = document.createElement("input");
    emailInput.className = "account-note-input";
    emailInput.type = "email";
    emailInput.placeholder = t("notes.email_placeholder");
    emailInput.value = note.email || "";
    emailInput.addEventListener("input", () => {
      state.accountNotesDraft = {
        ...(state.accountNotesDraft || note),
        email: emailInput.value,
        note: noteInput.value
      };
    });
    emailLabel.appendChild(emailInput);

    const noteLabel = document.createElement("label");
    noteLabel.className = "account-note-field";
    noteLabel.textContent = t("notes.note_label");
    const noteInput = document.createElement("textarea");
    noteInput.className = "account-note-textarea";
    noteInput.placeholder = t("notes.note_placeholder");
    noteInput.value = note.note || "";
    noteInput.addEventListener("input", () => {
      state.accountNotesDraft = {
        ...(state.accountNotesDraft || note),
        email: emailInput.value,
        note: noteInput.value
      };
    });
    noteLabel.appendChild(noteInput);

    const actions = document.createElement("div");
    actions.className = "account-note-actions";
    const saveBtn = document.createElement("button");
    saveBtn.className = "mini primary";
    saveBtn.type = "button";
    saveBtn.textContent = t("notes.save");
    saveBtn.addEventListener("click", () => {
      saveAccountNoteDraft(note.id, emailInput.value, noteInput.value);
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "mini";
    cancelBtn.type = "button";
    cancelBtn.textContent = t("notes.cancel");
    cancelBtn.addEventListener("click", () => {
      state.accountNotesEditingId = "";
      if (state.accountNoteTagEditorId === note.id) state.accountNoteTagEditorId = "";
      state.accountNotesDraft = null;
      renderAccountNotesPanel();
    });

    actions.append(saveBtn, cancelBtn);
    card.append(title, emailLabel, noteLabel, actions);
    setTimeout(() => {
      if (isNew || !emailInput.value) emailInput.focus();
      else noteInput.focus();
    }, 20);
    return card;
  }

  function renderAccountNoteTagEntry(note) {
    const tag = getAccountNoteTag(note);
    const row = document.createElement("div");
    row.className = "account-note-tag-entry";
    row.setAttribute("aria-label", t("notes.tag_label"));

    if (tag) {
      const chip = document.createElement("span");
      chip.className = "account-note-tag-chip";
      chip.textContent = tag.text;
      chip.style.color = tag.textColor;
      chip.style.backgroundColor = tag.bgColor;
      chip.style.borderColor = tag.textColor;
      row.appendChild(chip);
    }

    const editBtn = document.createElement("button");
    editBtn.className = tag ? "account-note-tag-edit" : "account-note-tag-add";
    editBtn.type = "button";
    editBtn.textContent = tag ? t("notes.tag_edit") : t("notes.tag_add");
    editBtn.addEventListener("click", () => {
      state.accountNoteTagEditorId = state.accountNoteTagEditorId === note.id ? "" : note.id;
      renderAccountNotesList();
    });
    row.appendChild(editBtn);

    return row;
  }

  function renderAccountNoteTagEditor(note) {
    const currentTag = getAccountNoteTag(note);
    const preferredStyle = currentTag || readAccountNoteTagStyle();
    const panel = document.createElement("div");
    panel.className = "account-note-tag-panel";
    panel.setAttribute("aria-label", t("notes.tag_label"));

    const textField = document.createElement("label");
    textField.className = "account-note-tag-field";
    textField.textContent = t("notes.tag_text_label");
    const textInput = document.createElement("input");
    textInput.className = "account-note-tag-text-input";
    textInput.type = "text";
    textInput.maxLength = 24;
    textInput.placeholder = t("notes.tag_text_placeholder");
    textInput.value = currentTag?.text || "";
    textField.appendChild(textInput);

    const colorRow = document.createElement("div");
    colorRow.className = "account-note-tag-color-row";

    const textColorField = document.createElement("label");
    textColorField.className = "account-note-tag-color-field";
    textColorField.textContent = t("notes.tag_text_color");
    const textColorInput = document.createElement("input");
    textColorInput.className = "account-note-tag-color-input";
    textColorInput.type = "color";
    textColorInput.value = normalizeAccountNoteColor(preferredStyle.textColor, DEFAULT_ACCOUNT_NOTE_TAG_STYLE.textColor);
    textColorField.appendChild(textColorInput);

    const bgColorField = document.createElement("label");
    bgColorField.className = "account-note-tag-color-field";
    bgColorField.textContent = t("notes.tag_bg_color");
    const bgColorInput = document.createElement("input");
    bgColorInput.className = "account-note-tag-color-input";
    bgColorInput.type = "color";
    bgColorInput.value = normalizeAccountNoteColor(preferredStyle.bgColor, DEFAULT_ACCOUNT_NOTE_TAG_STYLE.bgColor);
    bgColorField.appendChild(bgColorInput);

    const previewWrap = document.createElement("div");
    previewWrap.className = "account-note-tag-preview-wrap";
    const previewLabel = document.createElement("span");
    previewLabel.textContent = t("notes.tag_preview");
    const preview = document.createElement("span");
    preview.className = "account-note-tag-preview";
    previewWrap.append(previewLabel, preview);

    function updatePreview() {
      preview.textContent = String(textInput.value || "").trim() || t("notes.tag_add");
      preview.style.color = normalizeAccountNoteColor(textColorInput.value, DEFAULT_ACCOUNT_NOTE_TAG_STYLE.textColor);
      preview.style.backgroundColor = normalizeAccountNoteColor(bgColorInput.value, DEFAULT_ACCOUNT_NOTE_TAG_STYLE.bgColor);
      preview.style.borderColor = preview.style.color;
    }

    [textInput, textColorInput, bgColorInput].forEach((input) => {
      input.addEventListener("input", updatePreview);
    });
    updatePreview();

    colorRow.append(textColorField, bgColorField, previewWrap);
    panel.append(textField, colorRow);

    const actions = document.createElement("div");
    actions.className = "account-note-tag-panel-actions";

    const saveBtn = document.createElement("button");
    saveBtn.className = "mini primary";
    saveBtn.type = "button";
    saveBtn.textContent = t("notes.tag_save");
    saveBtn.addEventListener("click", () => {
      saveAccountNoteTag(note.id, textInput.value, textColorInput.value, bgColorInput.value, textInput);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "mini danger";
    deleteBtn.type = "button";
    deleteBtn.textContent = t("notes.tag_delete");
    deleteBtn.disabled = !currentTag;
    deleteBtn.addEventListener("click", () => {
      deleteAccountNoteTag(note.id);
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "mini";
    cancelBtn.type = "button";
    cancelBtn.textContent = t("notes.cancel");
    cancelBtn.addEventListener("click", () => {
      state.accountNoteTagEditorId = "";
      renderAccountNotesList();
    });
    actions.append(saveBtn, deleteBtn, cancelBtn);
    panel.appendChild(actions);

    setTimeout(() => textInput.focus(), 20);
    return panel;
  }

  function renderAccountNoteCard(note, absoluteIndex = 0) {
    const card = document.createElement("article");
    card.className = "account-note-card";
    const isTagEditing = state.accountNoteTagEditorId === note.id;
    card.classList.toggle("tag-editing", isTagEditing);

    const head = document.createElement("div");
    head.className = "account-note-card-head";
    const headMain = document.createElement("div");
    headMain.className = "account-note-card-head-main";
    const email = document.createElement("div");
    email.className = "account-note-card-email";
    email.textContent = note.email;
    const meta = document.createElement("div");
    meta.className = "account-note-card-meta";
    meta.textContent = t("notes.updated_at", {
      time: Number(note.updatedAt || 0) > 0 ? new Date(note.updatedAt).toLocaleString() : "-"
    });
    const tagEntry = renderAccountNoteTagEntry(note);
    headMain.append(email, tagEntry, meta);

    const body = document.createElement("div");
    body.className = "account-note-card-body";
    body.style.maxHeight = "190px";
    body.style.overflowY = "auto";
    body.style.overflowX = "hidden";
    body.style.flex = "0 1 auto";
    body.style.minHeight = "0";
    body.textContent = String(note.note || "").trim() || t("notes.preview_no_note");

    const actions = document.createElement("div");
    actions.className = "account-note-actions";
    actions.style.flex = "0 0 auto";

    const pinBtn = document.createElement("button");
    pinBtn.className = "mini";
    pinBtn.type = "button";
    pinBtn.textContent = t("notes.pin_top");
    pinBtn.disabled = absoluteIndex <= 0;
    pinBtn.addEventListener("click", () => {
      pinAccountNote(note.id);
    });

    const editBtn = document.createElement("button");
    editBtn.className = "mini";
    editBtn.type = "button";
    editBtn.textContent = t("notes.edit");
    editBtn.addEventListener("click", () => {
      state.accountNotesEditingId = note.id;
      state.accountNotesDraft = { ...note };
      renderAccountNotesPanel();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "mini danger";
    deleteBtn.type = "button";
    deleteBtn.textContent = t("notes.delete");
    deleteBtn.addEventListener("click", () => {
      openConfirm({
        title: t("notes.delete_title"),
        message: t("notes.delete_message"),
        onConfirm: () => deleteAccountNote(note.id)
      });
    });

    actions.append(pinBtn, editBtn, deleteBtn);
    head.append(headMain, actions);
    card.append(head);
    if (isTagEditing) {
      card.appendChild(renderAccountNoteTagEditor(note));
    }
    card.appendChild(body);
    return card;
  }

  function renderAccountNotesBatchImporter() {
    const card = document.createElement("section");
    card.className = "account-notes-batch-card";

    const title = document.createElement("div");
    title.className = "account-notes-batch-title";
    title.textContent = t("notes.batch_title");

    const field = document.createElement("label");
    field.className = "account-note-field";
    field.textContent = t("notes.batch_label");

    const textarea = document.createElement("textarea");
    textarea.className = "account-note-textarea account-note-batch-textarea";
    textarea.placeholder = t("notes.batch_placeholder");
    textarea.value = state.accountNotesBatchText || "";
    textarea.addEventListener("input", () => {
      state.accountNotesBatchText = textarea.value;
    });
    field.appendChild(textarea);

    const actions = document.createElement("div");
    actions.className = "account-note-actions";

    const importBtn = document.createElement("button");
    importBtn.className = "mini primary";
    importBtn.type = "button";
    importBtn.textContent = t("notes.batch_submit");
    importBtn.addEventListener("click", () => importAccountNotesBatch(textarea.value, textarea));

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "mini";
    cancelBtn.type = "button";
    cancelBtn.textContent = t("notes.cancel");
    cancelBtn.addEventListener("click", () => {
      state.accountNotesBatchImportOpen = false;
      state.accountNotesBatchText = "";
      renderAccountNotesPanel();
    });

    actions.append(importBtn, cancelBtn);
    card.append(title, field, actions);
    setTimeout(() => textarea.focus(), 20);
    return card;
  }

  function getAccountNotesSearchQuery() {
    return String(state.accountNotesSearch || "").trim().toLowerCase();
  }

  function accountNoteMatchesSearch(note, query) {
    if (!query) return true;
    const email = String(note?.email || "").toLowerCase();
    const body = String(note?.note || "").toLowerCase();
    const tag = getAccountNoteTag(note);
    const tagText = String(tag?.text || "").toLowerCase();
    const status = normalizeAccountNoteStatus(note?.status);
    const legacyStatusLabel = status ? getAccountNoteStatusLabel(note, status).toLowerCase() : "";
    return email.includes(query)
      || body.includes(query)
      || tagText.includes(query)
      || status.includes(query)
      || legacyStatusLabel.includes(query);
  }

  function getFilteredAccountNotes() {
    const query = getAccountNotesSearchQuery();
    if (!query) return state.accountNotes;
    return state.accountNotes.filter((note) => accountNoteMatchesSearch(note, query));
  }

  function getAccountNotesPageCount() {
    return Math.max(1, Math.ceil(getFilteredAccountNotes().length / ACCOUNT_NOTES_PAGE_SIZE));
  }

  function clampAccountNotesPage() {
    const pages = getAccountNotesPageCount();
    state.accountNotesPage = Math.min(Math.max(0, Math.trunc(Number(state.accountNotesPage) || 0)), pages - 1);
    return pages;
  }

  function ensureEditedAccountNotePage() {
    if (!state.accountNotesEditingId || state.accountNotesEditingId === "__new__") return;
    const index = getFilteredAccountNotes().findIndex((note) => note.id === state.accountNotesEditingId);
    if (index >= 0) state.accountNotesPage = Math.floor(index / ACCOUNT_NOTES_PAGE_SIZE);
  }

  function renderAccountNotesPager(total, pages) {
    const pager = document.createElement("div");
    pager.className = "account-notes-pager";

    const info = document.createElement("div");
    info.className = "account-notes-pager-info";
    info.textContent = t("notes.page_info", {
      page: state.accountNotesPage + 1,
      pages,
      total
    });

    const actions = document.createElement("div");
    actions.className = "account-notes-pager-actions";

    const prevBtn = document.createElement("button");
    prevBtn.className = "mini";
    prevBtn.type = "button";
    prevBtn.textContent = t("notes.page_prev");
    prevBtn.disabled = state.accountNotesPage <= 0;
    prevBtn.addEventListener("click", () => {
      state.accountNotesPage -= 1;
      renderAccountNotesList();
    });

    const nextBtn = document.createElement("button");
    nextBtn.className = "mini";
    nextBtn.type = "button";
    nextBtn.textContent = t("notes.page_next");
    nextBtn.disabled = state.accountNotesPage >= pages - 1;
    nextBtn.addEventListener("click", () => {
      state.accountNotesPage += 1;
      renderAccountNotesList();
    });

    actions.append(prevBtn, nextBtn);
    pager.append(info, actions);
    return pager;
  }

  function renderAccountNotesList() {
    if (!dom.accountNotesList) return;
    dom.accountNotesList.innerHTML = "";
    dom.accountNotesList.classList.toggle("has-tag-editor", !!state.accountNoteTagEditorId);
    ensureEditedAccountNotePage();
    const pages = clampAccountNotesPage();
    const filteredNotes = getFilteredAccountNotes();
    const hasSearch = !!getAccountNotesSearchQuery();
    if (dom.accountNotesClearSearchBtn) {
      dom.accountNotesClearSearchBtn.disabled = !hasSearch;
    }

    if (state.accountNotesBatchImportOpen) {
      dom.accountNotesList.appendChild(renderAccountNotesBatchImporter());
    }

    if (!state.accountNotes.length) {
      const empty = document.createElement("div");
      empty.className = "account-notes-empty";
      empty.textContent = t("notes.empty");
      dom.accountNotesList.appendChild(empty);
      return;
    }

    if (!filteredNotes.length) {
      const empty = document.createElement("div");
      empty.className = "account-notes-empty";
      empty.textContent = t("notes.search_empty");
      dom.accountNotesList.appendChild(empty);
      return;
    }

    const pageStart = state.accountNotesPage * ACCOUNT_NOTES_PAGE_SIZE;
    const visibleNotes = filteredNotes.slice(pageStart, pageStart + ACCOUNT_NOTES_PAGE_SIZE);

    visibleNotes.forEach((note) => {
      const absoluteIndex = state.accountNotes.findIndex((item) => item.id === note.id);
      dom.accountNotesList.appendChild(renderAccountNoteCard(note, absoluteIndex));
    });

    if (filteredNotes.length > ACCOUNT_NOTES_PAGE_SIZE) {
      dom.accountNotesList.appendChild(renderAccountNotesPager(filteredNotes.length, pages));
    }
  }

  function renderAccountNotesEditorHost() {
    if (!dom.accountNotesEditorHost) return;
    dom.accountNotesEditorHost.innerHTML = "";

    const editingId = state.accountNotesEditingId;
    if (!editingId) {
      dom.accountNotesEditorHost.hidden = true;
      return;
    }

    const note = editingId === "__new__"
      ? (state.accountNotesDraft || { id: "__new__", email: "", note: "", updatedAt: Date.now() })
      : (state.accountNotesDraft || state.accountNotes.find((item) => item.id === editingId));

    if (!note) {
      dom.accountNotesEditorHost.hidden = true;
      return;
    }

    dom.accountNotesEditorHost.hidden = false;
    dom.accountNotesEditorHost.appendChild(renderAccountNoteEditor(note));
  }

  function saveAccountNoteDraft(id, emailValue, noteValue) {
    const email = normalizeAccountNoteEmail(emailValue);
    if (!isValidAccountNoteEmail(email)) {
      showToast(t("notes.email_required"), "error");
      return;
    }

    const note = String(noteValue || "");
    const updatedAt = Date.now();
    const isNew = id === "__new__";
    const currentId = isNew ? createAccountNoteId() : id;
    const currentIndex = state.accountNotes.findIndex((item) => item.id === currentId);
    const duplicateIndex = state.accountNotes.findIndex((item) => item.email === email && item.id !== currentId);
    const next = [...state.accountNotes];

    if (duplicateIndex >= 0) {
      next[duplicateIndex] = { ...next[duplicateIndex], email, note, updatedAt };
      if (currentIndex >= 0) next.splice(currentIndex, 1);
    } else {
      const preservedStatus = currentIndex >= 0 ? normalizeAccountNoteStatus(next[currentIndex]?.status) : "";
      const preservedStatusLabels = currentIndex >= 0 ? normalizeAccountNoteStatusLabels(next[currentIndex]?.statusLabels) : {};
      const preservedTag = currentIndex >= 0 ? normalizeAccountNoteTag(next[currentIndex]?.tag) : null;
      const updated = {
        id: currentId,
        email,
        note,
        tag: preservedTag,
        status: preservedStatus,
        statusLabels: preservedStatusLabels,
        updatedAt
      };
      if (currentIndex >= 0) next[currentIndex] = updated;
      else next.push(updated);
    }

    try {
      writeAccountNotesV2(next);
      clampAccountNotesPage();
      state.accountNotesEditingId = "";
      state.accountNotesDraft = null;
      renderAccountNotesEditorHost();
      renderAccountNotesList();
      renderAccountNotesStatus();
      showToast(t("notes.saved"), "success");
    } catch (_) {
      showToast(t("notes.save_failed"), "error");
    }
  }

  function importAccountNotesBatch(text, focusTarget) {
    const parsed = parseAccountNotesBlocks(text);
    if (!parsed.length) {
      showToast(t("notes.batch_empty"), "error");
      if (focusTarget && typeof focusTarget.focus === "function") focusTarget.focus();
      return;
    }

    const now = Date.now();
    const byEmail = new Map(state.accountNotes.map((item) => [item.email, item]));
    let added = 0;
    let updated = 0;

    parsed.forEach((item, index) => {
      const existing = byEmail.get(item.email);
      const importedNote = String(item.note || "");
      if (existing) {
        if (importedNote.trim()) {
          byEmail.set(item.email, {
            ...existing,
            note: importedNote,
            updatedAt: now + index
          });
          updated += 1;
        }
      } else {
        byEmail.set(item.email, {
          id: createAccountNoteId(),
          email: item.email,
          note: importedNote,
          tag: null,
          status: "",
          statusLabels: {},
          updatedAt: now + index
        });
        added += 1;
      }
    });

    try {
      writeAccountNotesV2([...byEmail.values()]);
      state.accountNotesPage = 0;
      state.accountNotesEditingId = "";
      state.accountNoteTagEditorId = "";
      state.accountNotesDraft = null;
      state.accountNotesBatchImportOpen = false;
      state.accountNotesBatchText = "";
      renderAccountNotesPanel();
      renderAccountNotesStatus();
      showToast(t("notes.batch_done", { added, updated }), "success");
    } catch (_) {
      showToast(t("notes.save_failed"), "error");
    }
  }

  function saveAccountNoteTag(id, textValue, textColorValue, bgColorValue, focusTarget) {
    const index = state.accountNotes.findIndex((item) => item.id === id);
    if (index < 0) return;

    const text = String(textValue || "").trim();
    if (!text) {
      showToast(t("notes.tag_empty"), "error");
      if (focusTarget && typeof focusTarget.focus === "function") focusTarget.focus();
      return;
    }

    const tag = {
      text,
      textColor: normalizeAccountNoteColor(textColorValue, DEFAULT_ACCOUNT_NOTE_TAG_STYLE.textColor),
      bgColor: normalizeAccountNoteColor(bgColorValue, DEFAULT_ACCOUNT_NOTE_TAG_STYLE.bgColor)
    };

    const next = [...state.accountNotes];
    next[index] = {
      ...next[index],
      tag,
      status: "",
      statusLabels: {},
      updatedAt: Date.now()
    };

    try {
      writeAccountNoteTagStyle(tag);
      writeAccountNotesV2(next);
      state.accountNoteTagEditorId = "";
      renderAccountNotesList();
      renderAccountNotesStatus();
      showToast(t("notes.saved"), "success");
    } catch (_) {
      showToast(t("notes.save_failed"), "error");
    }
  }

  function deleteAccountNoteTag(id) {
    const index = state.accountNotes.findIndex((item) => item.id === id);
    if (index < 0) return;

    const next = [...state.accountNotes];
    next[index] = {
      ...next[index],
      tag: null,
      status: "",
      statusLabels: {},
      updatedAt: Date.now()
    };

    try {
      writeAccountNotesV2(next);
      state.accountNoteTagEditorId = "";
      renderAccountNotesList();
      renderAccountNotesStatus();
      showToast(t("notes.saved"), "success");
    } catch (_) {
      showToast(t("notes.save_failed"), "error");
    }
  }

  function pinAccountNote(id) {
    const index = state.accountNotes.findIndex((item) => item.id === id);
    if (index <= 0) return;

    const next = [...state.accountNotes];
    const [target] = next.splice(index, 1);
    next.unshift(target);

    try {
      writeAccountNotesV2(next);
      state.accountNotesPage = 0;
      state.accountNotesEditingId = "";
      state.accountNotesDraft = null;
      renderAccountNotesList();
      renderAccountNotesStatus();
      showToast(t("notes.pinned"), "success");
    } catch (_) {
      showToast(t("notes.save_failed"), "error");
    }
  }

  function deleteAccountNote(id) {
    try {
      const next = state.accountNotes.filter((item) => item.id !== id);
      writeAccountNotesV2(next, { allowEmpty: next.length === 0 });
      clampAccountNotesPage();
      if (state.accountNotesEditingId === id) {
        state.accountNotesEditingId = "";
        state.accountNotesDraft = null;
      }
      if (state.accountNoteTagEditorId === id) state.accountNoteTagEditorId = "";
      renderAccountNotesEditorHost();
      renderAccountNotesList();
      renderAccountNotesStatus();
      showToast(t("notes.deleted"), "success");
    } catch (_) {
      showToast(t("notes.save_failed"), "error");
    }
  }

  function renderAccountNotesStatus() {
    if (!dom.accountNotesStatus) return;
    const savedAt = Number(state.accountNotesSavedAt || 0);
    dom.accountNotesStatus.textContent = savedAt > 0
      ? t("notes.status_saved", { time: new Date(savedAt).toLocaleString() })
      : t("notes.status_default");
  }

  function setAccountNotesOpen(open) {
    state.accountNotesOpen = !!open;
    if (!state.accountNotesOpen) {
      state.accountNotesEditingId = "";
      state.accountNoteTagEditorId = "";
      state.accountNotesDraft = null;
      state.accountNotesBatchImportOpen = false;
      state.accountNotesBatchText = "";
    }
    try {
      localStorage.setItem(ACCOUNT_NOTES_OPEN_KEY, state.accountNotesOpen ? "1" : "0");
    } catch (_) {
    }
    renderAccountNotesPanel();
  }

  function addAccountNote() {
    state.accountNotesOpen = true;
    state.accountNotesBatchImportOpen = false;
    state.accountNoteTagEditorId = "";
    state.accountNotesEditingId = "__new__";
    state.accountNotesDraft = { id: "__new__", email: "", note: "", updatedAt: Date.now() };
    renderAccountNotesPanel();
  }

  function toggleAccountNotesBatchImport() {
    state.accountNotesOpen = true;
    state.accountNotesBatchImportOpen = !state.accountNotesBatchImportOpen;
    state.accountNotesEditingId = "";
    state.accountNoteTagEditorId = "";
    state.accountNotesDraft = null;
    if (!state.accountNotesBatchImportOpen) state.accountNotesBatchText = "";
    renderAccountNotesPanel();
  }

  function normalizeThemeMode(mode) {
    const v = String(mode || "").toLowerCase();
    return v === "light" || v === "dark" || v === "auto" ? v : "auto";
  }

  function readCachedThemeMode() {
    try {
      return normalizeThemeMode(localStorage.getItem("cas_theme") || "auto");
    } catch (_) {
      return "auto";
    }
  }

  function resolveEffectiveTheme() {
    if (state.themeMode === "dark") return "dark";
    if (state.themeMode === "light") return "light";
    return mediaDark && mediaDark.matches ? "dark" : "light";
  }

  function applyTheme() {
    const eff = resolveEffectiveTheme();
    document.documentElement.setAttribute("data-theme", eff);
    document.documentElement.style.colorScheme = eff;
    renderQuickSwitchers();
  }

  function getDefaultTabVisibility() {
    return TOP_LEVEL_TABS.reduce((acc, tab) => {
      acc[tab.key] = true;
      return acc;
    }, {});
  }

  function normalizeTabVisibility(value) {
    const normalized = getDefaultTabVisibility();
    const source = value && typeof value === "object" ? value : {};
    TOP_LEVEL_TABS.forEach((tab) => {
      if (!tab.hideable) {
        normalized[tab.key] = true;
        return;
      }
      if (Object.prototype.hasOwnProperty.call(source, tab.key)) {
        normalized[tab.key] = !(source[tab.key] === false || source[tab.key] === "false");
      }
    });
    normalized.settings = true;
    return normalized;
  }

  function isTabVisible(tabKey) {
    const key = String(tabKey || "");
    if (!TOP_LEVEL_TABS.some((tab) => tab.key === key)) return false;
    return normalizeTabVisibility(state.tabVisibility)[key] !== false;
  }

  function getFirstVisibleTab() {
    return TOP_LEVEL_TABS.find((tab) => isTabVisible(tab.key))?.key || "settings";
  }

  function renderTopLevelTabs() {
    const visibility = normalizeTabVisibility(state.tabVisibility);
    TOP_LEVEL_TABS.forEach((tab) => {
      if (!tab.button) return;
      tab.button.textContent = t(`tab.${tab.key}`);
      tab.button.hidden = visibility[tab.key] === false;
      tab.button.classList.toggle("active", state.currentTab === tab.key);
    });
  }

  function switchTab(tab) {
    const requested = String(tab || state.currentTab || "accounts");
    const nextTab = isTabVisible(requested) ? requested : getFirstVisibleTab();
    state.currentTab = nextTab;
    if (nextTab === "notes") {
      state.accountNotesOpen = true;
      try {
        localStorage.setItem(ACCOUNT_NOTES_OPEN_KEY, "1");
      } catch (_) {
      }
    }
    TOP_LEVEL_TABS.forEach((item) => {
      if (item.button) item.button.classList.toggle("active", item.key === nextTab);
      const panel = document.getElementById(item.panelId);
      if (panel) panel.classList.toggle("active", item.key === nextTab);
    });
    renderTopLevelTabs();
    renderAccountNotesPanel();
    renderToolbarActionsForTab(nextTab);
    if (dom.countText) dom.countText.hidden = nextTab !== "accounts";
    if (nextTab === "accounts") {
      requestAccountsList(true);
    }
  }

  function renderToolbarActionsForTab(tab) {
    const showOnAccounts = tab === "accounts";
    dom.addAccountBtn?.classList.toggle("is-hidden", !showOnAccounts);
    dom.accountNotesBtn?.classList.toggle("is-hidden", !showOnAccounts);

    const anyVisible = [
      dom.addAccountBtn,
      dom.accountNotesBtn
    ].some((el) => el && !el.classList.contains("is-hidden"));
    dom.toolbarActions?.classList.toggle("is-hidden", !anyVisible);
    document.body.classList.toggle("has-floating-toolbar-actions", anyVisible);
  }

  function ensureTabVisibilitySettingsRendered() {
    if (!dom.settingsTabVisibilityList || dom.settingsTabVisibilityList.childElementCount > 0) return;
    dom.settingsTabVisibilityList.classList.add("tab-visibility-grid");
    TOP_LEVEL_TABS.forEach((tab) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tab-visibility-card";
      button.setAttribute("data-tab-visibility-card", tab.key);
      button.innerHTML = `
        ${tab.hideable ? "" : `<span class="tab-visibility-badge">${escapeHtml(t("settings.tab_visibility_badge"))}</span>`}
        <div class="tab-visibility-icon" data-tab-visibility-icon="${tab.key}">${tab.icon}</div>
        <div class="tab-visibility-name" data-tab-visibility-name="${tab.key}"></div>
        <div class="tab-visibility-state" data-tab-visibility-state="${tab.key}"></div>
      `;
      dom.settingsTabVisibilityList.appendChild(button);
    });
  }

  function renderTabVisibilitySettings() {
    if (!dom.settingsTabVisibilityList) return;
    ensureTabVisibilitySettingsRendered();
    TOP_LEVEL_TABS.forEach((tab) => {
      const button = dom.settingsTabVisibilityList.querySelector(`[data-tab-visibility-card="${tab.key}"]`);
      if (!button) return;
      const enabled = isTabVisible(tab.key);
      const locked = !tab.hideable;
      button.classList.toggle("active", enabled);
      button.classList.toggle("locked", locked);
      button.setAttribute("aria-pressed", enabled ? "true" : "false");
      button.disabled = locked;
      const nameEl = button.querySelector(`[data-tab-visibility-name="${tab.key}"]`);
      const stateEl = button.querySelector(`[data-tab-visibility-state="${tab.key}"]`);
      if (nameEl) nameEl.textContent = t(`tab.${tab.key}`);
      if (stateEl) {
        stateEl.textContent = locked
          ? t("settings.tab_visibility_locked")
          : (enabled ? t("settings.tab_visibility_showing") : t("settings.tab_visibility_hidden"));
      }
    });
  }

  function renderQuickSwitchers() {
    if (dom.quickThemeBtn) {
      const mode = normalizeThemeMode(state.themeMode || "auto");
      dom.quickThemeBtn.textContent = mode === "auto" ? "A" : (mode === "dark" ? "☾" : "☼");
      dom.quickThemeBtn.title = t("quick.theme_title");
    }
    if (dom.quickLangBtn) {
      const raw = String(state.currentLanguage || "zh-CN").trim();
      dom.quickLangBtn.textContent = raw.split("-")[0].toUpperCase() || "ZH";
      dom.quickLangBtn.title = t("quick.language_title");
    }
    renderQuickLangMenu();
  }

  function renderQuickLangMenu() {
    if (!dom.quickLangMenu) return;
    const langs = Array.isArray(state.languageIndex) ? state.languageIndex : [];
    const current = String(state.currentLanguage || "").toLowerCase();
    dom.quickLangMenu.innerHTML = langs.map((lang) => {
      const code = String(lang?.code || "");
      const name = String(lang?.name || code);
      const isActive = code.toLowerCase() === current;
      return `
        <button class="quick-menu-item ${isActive ? "active" : ""}" data-quick-lang="${escapeHtml(code)}">
          <span class="quick-menu-code">${escapeHtml(code.replace(/-.*/, "").toUpperCase())}</span>
          <span class="quick-menu-name">${escapeHtml(name)}</span>
          <span class="quick-menu-dot">${isActive ? "•" : ""}</span>
        </button>
      `;
    }).join("");
  }

  function closeQuickLangMenu() {
    state.quickLangMenuOpen = false;
    dom.quickLangMenu?.classList.remove("show");
    dom.quickLangBtn?.classList.remove("active");
  }

  function applyLanguageByCode(code) {
    const nextCode = String(code || "").trim();
    if (!nextCode) return;
    state.currentLanguage = nextCode;
    renderSettingsOptions();
    requestLanguagePack(nextCode);
    queueSaveConfig();
    renderQuickSwitchers();
  }

  function renderLanguageOptions() {
    if (!dom.languageOptions) return;
    dom.languageOptions.innerHTML = "";
    for (const lang of state.languageIndex) {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.setAttribute("data-lang-option", lang.code);
      btn.textContent = lang.name || lang.code;
      btn.addEventListener("click", () => applyLanguageByCode(lang.code));
      dom.languageOptions.appendChild(btn);
    }
    renderSettingsOptions();
  }

  function renderSettingsOptions() {
    state.tabVisibility = normalizeTabVisibility(state.tabVisibility);
    renderTopLevelTabs();
    renderTabVisibilitySettings();
    document.querySelectorAll("[data-lang-option]").forEach((x) => {
      x.classList.toggle("active", x.getAttribute("data-lang-option") === state.currentLanguage);
    });
    document.querySelectorAll("[data-close-behavior-option]").forEach((x) => {
      x.classList.toggle("active", x.getAttribute("data-close-behavior-option") === state.closeWindowBehavior);
    });
    document.querySelectorAll("[data-theme-option]").forEach((x) => {
      x.classList.toggle("active", x.getAttribute("data-theme-option") === state.themeMode);
    });
  }

  function applyI18n() {
    document.title = t("app.brand");
    dom.brandTitle.textContent = t("app.brand");
    renderTopLevelTabs();
    renderPrimaryActionButtons();
    renderAccountNotesPanel();
    if (dom.accountNotesAddBtn) dom.accountNotesAddBtn.textContent = t("notes.add");
    if (dom.accountNotesBatchImportBtn) {
      dom.accountNotesBatchImportBtn.textContent = state.accountNotesBatchImportOpen
        ? t("notes.batch_import_close")
        : t("notes.batch_import");
    }
    if (dom.accountNotesCollapseBtn) {
      dom.accountNotesCollapseBtn.textContent = state.currentTab === "notes"
        ? t("notes.back_accounts")
        : t("notes.collapse");
    }
    if (dom.accountsSectionTitle) dom.accountsSectionTitle.textContent = t("tab.accounts");
    if (dom.searchInput) dom.searchInput.placeholder = t("search.placeholder");
    if (dom.accountNotesSearchInput) dom.accountNotesSearchInput.placeholder = t("notes.search_placeholder");
    if (dom.accountNotesClearSearchBtn) dom.accountNotesClearSearchBtn.textContent = t("notes.search_clear");
    if (dom.groupAllBtn) dom.groupAllBtn.textContent = t("group.all");
    if (dom.groupFreeBtn) dom.groupFreeBtn.textContent = t("group.free");
    if (dom.groupPlusBtn) dom.groupPlusBtn.textContent = t("group.plus");
    if (dom.groupTeamBtn) dom.groupTeamBtn.textContent = t("group.team");
    if (dom.groupProBtn) dom.groupProBtn.textContent = t("group.pro");
    if (dom.thAccount) dom.thAccount.textContent = t("table.account");
    if (dom.thQuota) dom.thQuota.textContent = t("table.quota");
    if (dom.thRecent) dom.thRecent.textContent = t("table.recent");
    if (dom.thAction) dom.thAction.textContent = t("table.action");
    if (dom.settingsTitle) dom.settingsTitle.textContent = t("settings.title");
    if (dom.settingsSub) dom.settingsSub.textContent = t("settings.subtitle");
    if (dom.settingsLanguageLabel) dom.settingsLanguageLabel.textContent = t("settings.language_label");
    if (dom.settingsThemeLabel) dom.settingsThemeLabel.textContent = t("settings.theme_label");
    if (dom.settingsThemeHint) dom.settingsThemeHint.textContent = t("settings.theme_hint");
    if (dom.themeAutoBtn) dom.themeAutoBtn.textContent = t("settings.theme_auto");
    if (dom.themeLightBtn) dom.themeLightBtn.textContent = t("settings.theme_light");
    if (dom.themeDarkBtn) dom.themeDarkBtn.textContent = t("settings.theme_dark");
    if (dom.settingsCloseBehaviorLabel) dom.settingsCloseBehaviorLabel.textContent = t("settings.close_behavior_label");
    if (dom.settingsCloseBehaviorHint) dom.settingsCloseBehaviorHint.textContent = t("settings.close_behavior_hint");
    if (dom.closeBehaviorTrayBtn) dom.closeBehaviorTrayBtn.textContent = t("settings.close_behavior_tray");
    if (dom.closeBehaviorExitBtn) dom.closeBehaviorExitBtn.textContent = t("settings.close_behavior_exit");
    if (dom.settingsTabVisibilitySectionTitle) dom.settingsTabVisibilitySectionTitle.textContent = t("settings.tab_visibility_section");
    if (dom.settingsTabVisibilitySectionHint) dom.settingsTabVisibilitySectionHint.textContent = t("settings.tab_visibility_hint");
    if (dom.summaryTotalLabel) dom.summaryTotalLabel.textContent = t("summary.total_accounts");
    if (dom.summaryCurrentLabel) dom.summaryCurrentLabel.textContent = t("summary.current_account");
    if (dom.summaryAvg5Label) dom.summaryAvg5Label.textContent = t("summary.avg_5h");
    if (dom.summaryAvg7Label) dom.summaryAvg7Label.textContent = t("summary.avg_7d");
    if (dom.summaryLowLabel) dom.summaryLowLabel.textContent = t("summary.low_accounts");
    if (dom.accountsPrevPageBtn) dom.accountsPrevPageBtn.textContent = t("pagination.prev");
    if (dom.accountsNextPageBtn) dom.accountsNextPageBtn.textContent = t("pagination.next");
    if (dom.helpTitle) dom.helpTitle.textContent = t("help.title");
    if (dom.helpStepAddTitle) dom.helpStepAddTitle.textContent = t("help.add.title");
    if (dom.helpStepAddText) dom.helpStepAddText.textContent = t("help.add.text");
    if (dom.helpStepSwitchTitle) dom.helpStepSwitchTitle.textContent = t("help.switch.title");
    if (dom.helpStepSwitchText) dom.helpStepSwitchText.textContent = t("help.switch.text");
    if (dom.helpStepLogoutTitle) dom.helpStepLogoutTitle.textContent = t("help.logout.title");
    if (dom.helpStepLogoutText) dom.helpStepLogoutText.textContent = t("help.logout.text");
    if (dom.helpStepSafetyTitle) dom.helpStepSafetyTitle.textContent = t("help.safety.title");
    if (dom.helpStepSafetyText) dom.helpStepSafetyText.textContent = t("help.safety.text");
    if (dom.helpStepQuotaTitle) dom.helpStepQuotaTitle.textContent = t("help.quota.title");
    if (dom.helpStepQuotaText) dom.helpStepQuotaText.textContent = t("help.quota.text");
    if (dom.helpStepRefreshTitle) dom.helpStepRefreshTitle.textContent = t("help.refresh.title");
    if (dom.helpStepRefreshText) dom.helpStepRefreshText.textContent = t("help.refresh.text");
    if (dom.helpStepNotesTitle) dom.helpStepNotesTitle.textContent = t("help.notes.title");
    if (dom.helpStepNotesText) dom.helpStepNotesText.textContent = t("help.notes.text");
    if (dom.helpStepDeleteTitle) dom.helpStepDeleteTitle.textContent = t("help.delete.title");
    if (dom.helpStepDeleteText) dom.helpStepDeleteText.textContent = t("help.delete.text");
    if (dom.helpStepUpdateTitle) dom.helpStepUpdateTitle.textContent = t("help.update.title");
    if (dom.helpStepUpdateText) {
      const updateUrl = t("help.update.url");
      dom.helpStepUpdateText.textContent = `${t("help.update.text")} `;
      if (dom.helpStepUpdateLink) {
        dom.helpStepUpdateLink.href = updateUrl;
        dom.helpStepUpdateLink.textContent = updateUrl;
        dom.helpStepUpdateText.appendChild(dom.helpStepUpdateLink);
      }
    }
    if (dom.helpStepSupportTitle) dom.helpStepSupportTitle.textContent = t("help.support.title");
    if (dom.helpStepSupportText) {
      const supportUrl = t("help.support.url");
      dom.helpStepSupportText.textContent = `${t("help.support.text")} `;
      if (dom.helpStepSupportLink) {
        dom.helpStepSupportLink.href = supportUrl;
        dom.helpStepSupportLink.textContent = supportUrl;
        dom.helpStepSupportText.appendChild(dom.helpStepSupportLink);
      }
    }
    if (dom.footerUpdateLink) {
      dom.footerUpdateLink.href = t("help.update.url");
      dom.footerUpdateLink.textContent = t("footer.update_link");
    }
    if (dom.footerShopLink) {
      dom.footerShopLink.href = t("help.support.url");
      dom.footerShopLink.textContent = t("footer.shop_link");
    }
    if (dom.confirmTitle) dom.confirmTitle.textContent = t("dialog.confirm.title");
    if (dom.confirmMessage) dom.confirmMessage.textContent = t("dialog.confirm.default_message");
    if (dom.confirmCancelBtn) dom.confirmCancelBtn.textContent = t("dialog.common.cancel");
    if (dom.confirmOkBtn) dom.confirmOkBtn.textContent = t("dialog.common.confirm");
    if (dom.renameTitle) dom.renameTitle.textContent = t("dialog.rename.title");
    if (dom.renameNameLabel) dom.renameNameLabel.textContent = t("dialog.rename.name_label");
    if (dom.renameNameInput) dom.renameNameInput.placeholder = t("dialog.rename.name_placeholder");
    if (dom.renameCancelBtn) dom.renameCancelBtn.textContent = t("dialog.common.cancel");
    if (dom.renameConfirmBtn) dom.renameConfirmBtn.textContent = t("dialog.common.confirm");
    if (dom.addAccountTitle) dom.addAccountTitle.textContent = t("dialog.add_account.title");
    if (dom.addPaneNewLoginDesc) dom.addPaneNewLoginDesc.textContent = t("dialog.add_account.new_login_desc");
    if (dom.addAccountPrepareNewBtn) dom.addAccountPrepareNewBtn.textContent = t("dialog.add_account.new_login_btn");
    if (dom.addAccountCancelBtn) dom.addAccountCancelBtn.textContent = t("dialog.common.cancel");
    renderAddAccountGuidance();
    renderSettingsOptions();
    renderAccountSummary();
    renderAccounts();
    renderSwitchProgress();
    applyCountText();
    renderQuickSwitchers();
  }

  function normalizeGroupValue(group) {
    const value = String(group || "").toLowerCase();
    if (["personal", "business", "free", "plus", "team", "pro"].includes(value)) return value;
    return "personal";
  }

  function detectPlanTypeKeyword(planType) {
    const value = String(planType || "").toLowerCase();
    if (value.includes("plus")) return "plus";
    if (value.includes("team")) return "team";
    if (value.includes("pro")) return "pro";
    if (value.includes("free")) return "free";
    return "";
  }

  function normalizePlanType(planType) {
    return detectPlanTypeKeyword(planType);
  }

  function formatPlanTypeLabel(planType) {
    const normalized = normalizePlanType(planType);
    if (normalized === "free") return t("tag.plan_free");
    if (normalized === "plus") return t("tag.plan_plus");
    if (normalized === "team") return t("tag.plan_team");
    if (normalized === "pro") return t("tag.plan_pro");
    const raw = String(planType || "");
    return raw ? `${t("tag.plan_unknown")}: ${raw}` : "";
  }

  function formatGroupLabel(group) {
    const normalized = normalizeGroupValue(group);
    if (normalized === "personal") return t("tag.group_personal");
    if (normalized === "business") return t("tag.group_business");
    if (["free", "plus", "team", "pro"].includes(normalized)) return formatPlanTypeLabel(normalized);
    return t("tag.group_personal");
  }

  function toPercentNumber(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) return null;
    return Math.min(100, n);
  }

  function formatPercentValue(v) {
    const n = toPercentNumber(v);
    if (n === null) return "-";
    if (n > 0 && n < 0.1) return "<0.1%";
    return `${(Math.round(n * 10) / 10).toFixed(1).replace(/\.0$/, "")}%`;
  }

  function formatDurationFromSeconds(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) return "-";
    if (n < 60) return "即将恢复";
    const totalMinutes = Math.max(1, Math.ceil(n / 60));
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) return `${days} 天${hours > 0 ? ` ${hours} 小时` : ""}后`;
    if (hours > 0) return `${hours} 小时${minutes > 0 ? ` ${minutes} 分钟` : ""}后`;
    return `${minutes} 分钟后`;
  }

  function parseCasTimestamp(value) {
    const raw = String(value || "").trim();
    if (!raw) return null;
    let d = new Date(raw);
    if (isNaN(d.getTime())) {
      const normalized = raw.replace(/[/\\]/g, "-").replace(/\.(\d{3})/, "$1");
      d = new Date(normalized);
    }
    if (isNaN(d.getTime())) return null;
    return d;
  }

  function toNonNegativeInteger(value) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return null;
    return Math.trunc(n);
  }

  function formatCasDateShort(value) {
    const date = parseCasTimestamp(value);
    if (!date) return "";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}/${month}/${day}`;
  }

  function formatDaysSince(value) {
    const date = parseCasTimestamp(value);
    if (!date) return "";
    const diff = Date.now() - date.getTime();
    if (!Number.isFinite(diff) || diff < 0) return "0 天";
    return `${Math.floor(diff / 86400000)} 天`;
  }

  function formatPlusRemainingDays(value, planType) {
    const date = parseCasTimestamp(value);
    if (!date || normalizePlanType(planType) !== "plus") return "";
    const estimatedEndsAt = new Date(date.getTime());
    estimatedEndsAt.setDate(estimatedEndsAt.getDate() + 30);
    const remainingMs = estimatedEndsAt.getTime() - Date.now();
    if (remainingMs >= 0) {
      return `Plus 约剩 ${Math.ceil(remainingMs / 86400000)} 天`;
    }
    return `Plus 约超 ${Math.max(1, Math.floor(Math.abs(remainingMs) / 86400000))} 天`;
  }

  function formatResetAvailableCount(value) {
    const n = toNonNegativeInteger(value);
    if (n === null) return t("quota.reset_count_unknown");
    return t("quota.reset_count_value", { count: n });
  }

  function formatQueryFreshness(value) {
    const date = parseCasTimestamp(value);
    if (!date) return t("quota.reset_count_unknown");
    const diff = Math.max(0, Date.now() - date.getTime());
    if (diff < 2 * 60 * 1000) return t("quota.checked_just_now");
    if (diff < 60 * 60 * 1000) {
      return t("quota.checked_minutes_ago", { minutes: Math.max(2, Math.floor(diff / 60000)) });
    }
    if (diff < 24 * 60 * 60 * 1000) {
      return t("quota.checked_hours_ago", { hours: Math.max(1, Math.floor(diff / 3600000)) });
    }
    return t("quota.checked_on", { date: formatCasDateShort(value) || "-" });
  }

  function isQueryFresh(value) {
    const date = parseCasTimestamp(value);
    if (!date) return false;
    const diff = Date.now() - date.getTime();
    return diff >= 0 && diff < 60 * 60 * 1000;
  }

  function getQuotaResetCacheKey(item) {
    return getAccountEmail(item).toLowerCase();
  }

  function getCachedFirstAddedAt(item) {
    const cached = state.firstAddedAtCache.get(getQuotaResetCacheKey(item));
    return String(cached?.firstAddedAt || "").trim();
  }

  function getCachedQuotaResetAvailableCount(item) {
    const cached = state.quotaResetCountCache.get(getQuotaResetCacheKey(item));
    return toNonNegativeInteger(cached?.availableCount);
  }

  function getCachedQuotaResetUpdatedAt(item) {
    const cached = state.quotaResetCountCache.get(getQuotaResetCacheKey(item));
    return String(cached?.updatedAt || "").trim();
  }

  function refreshFirstAddedAtCache(options = {}) {
    const render = options.render !== false;
    if (state.firstAddedAtCacheLoading || !window.fetch) return Promise.resolve(false);
    state.firstAddedAtCacheLoading = true;
    return fetch(`${LOCAL_METADATA_BASE_URL}/first-added-times`, { method: "GET", cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || payload?.ok === false) throw new Error(payload?.error || `HTTP ${response.status}`);
        const nextCache = new Map();
        for (const [key, value] of Object.entries(payload?.accounts || {})) {
          const firstAddedAt = String(value?.firstAddedAt || "").trim();
          if (firstAddedAt && parseCasTimestamp(firstAddedAt)) {
            nextCache.set(String(key).trim().toLowerCase(), { firstAddedAt });
          }
        }
        state.firstAddedAtCache = nextCache;
        if (render) {
          state.accounts = normalizeAccountList(state.accounts);
          applySearch();
        }
        return true;
      })
      .catch((error) => {
        log(`first added cache unavailable: ${error?.message || error}`);
        return false;
      })
      .finally(() => { state.firstAddedAtCacheLoading = false; });
  }

  function refreshQuotaResetCountCache(options = {}) {
    const render = options.render !== false;
    if (state.quotaResetCountCacheLoading || !window.fetch) return Promise.resolve(false);
    state.quotaResetCountCacheLoading = true;
    return fetch(`${LOCAL_METADATA_BASE_URL}/quota-reset-counts`, { method: "GET", cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || payload?.ok === false) throw new Error(payload?.error || `HTTP ${response.status}`);
        const nextCache = new Map();
        for (const [key, value] of Object.entries(payload?.accounts || {})) {
          const availableCount = toNonNegativeInteger(value?.availableCount);
          if (availableCount !== null) {
            nextCache.set(String(key).trim().toLowerCase(), {
              availableCount,
              updatedAt: String(value?.updatedAt || "").trim()
            });
          }
        }
        state.quotaResetCountCache = nextCache;
        if (render) {
          state.accounts = normalizeAccountList(state.accounts);
          applySearch();
        }
        return true;
      })
      .catch((error) => {
        log(`quota reset count cache unavailable: ${error?.message || error}`);
        return false;
      })
      .finally(() => { state.quotaResetCountCacheLoading = false; });
  }

  function refreshAccountDerivedCaches(options = {}) {
    return Promise.all([
      refreshFirstAddedAtCache(options),
      refreshQuotaResetCountCache(options)
    ]).then((results) => results.some(Boolean));
  }

  async function refreshAccountsFromLocalIndex(options = {}) {
    if (state.accountsIndexLoading || !window.fetch) return Promise.resolve(false);
    state.accountsIndexLoading = true;
    const preloadDerived = options.preloadDerived !== false;
    const derivedPromise = preloadDerived
      ? refreshAccountDerivedCaches({ render: false })
      : Promise.resolve(false);
    try {
      const response = await fetch(`${LOCAL_METADATA_BASE_URL}/accounts`, { method: "GET", cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || payload?.ok === false) throw new Error(payload?.error || `HTTP ${response.status}`);
      if (!Array.isArray(payload?.accounts)) return false;
      const derivedChanged = await derivedPromise;
      state.currentAccountRef = normalizeCurrentAccountRef(payload.current);
      const nextAccounts = normalizeAccountList(payload.accounts);
      const nextSignature = getAccountListSignature(nextAccounts);
      if (nextSignature === getAccountListSignature(state.accounts)) {
        state.accountsIndexSignature = nextSignature;
        if (derivedChanged) {
          state.accounts = normalizeAccountList(state.accounts);
          applySearch();
        }
        return true;
      }
      state.accountsIndexSignature = nextSignature;
      state.accounts = nextAccounts;
      applySearch();
      if (!preloadDerived) refreshAccountDerivedCaches();
      log(`index: accounts loaded (${state.accounts.length})`);
      return true;
    } catch (error) {
      log(`index accounts unavailable: ${error?.message || error}`);
      return false;
    } finally {
      state.accountsIndexLoading = false;
    }
  }

  function getQuotaLevelClass(value) {
    const n = toPercentNumber(value);
    if (n === null) return "empty";
    if (n <= 20) return "low";
    if (n <= 50) return "mid";
    return "high";
  }

  function formatQuotaWindowLabel(windowSeconds, fallback = "额度") {
    const seconds = Number(windowSeconds);
    if (!Number.isFinite(seconds) || seconds <= 0) return fallback;
    const hours = seconds / 3600;
    const days = seconds / 86400;
    if (Math.abs(days - Math.round(days)) < 0.01 && days >= 1) return `${Math.round(days)}D`;
    if (Math.abs(hours - Math.round(hours)) < 0.01 && hours >= 1) return `${Math.round(hours)}H`;
    if (hours >= 1) return `${Math.round(hours * 10) / 10}H`;
    return `${Math.max(1, Math.round(seconds / 60))}M`;
  }

  function normalizeQuotaWindow(raw, fallbackLabel = "额度") {
    if (!raw || typeof raw !== "object") return null;
    const remainingPercent = toPercentNumber(raw.remainingPercent);
    const windowSeconds = Number(raw.windowSeconds);
    const resetAfterSeconds = Number(raw.resetAfterSeconds);
    const resetAt = Number(raw.resetAt);
    if (remainingPercent === null && (!Number.isFinite(windowSeconds) || windowSeconds <= 0)) return null;
    return {
      slot: String(raw.slot || ""),
      label: formatQuotaWindowLabel(windowSeconds, fallbackLabel),
      windowSeconds: Number.isFinite(windowSeconds) && windowSeconds > 0 ? Math.trunc(windowSeconds) : -1,
      remainingPercent,
      resetAfterSeconds: Number.isFinite(resetAfterSeconds) && resetAfterSeconds >= 0 ? Math.trunc(resetAfterSeconds) : -1,
      resetAt: Number.isFinite(resetAt) && resetAt >= 0 ? Math.trunc(resetAt) : -1
    };
  }

  function getQuotaWindows(item) {
    const dynamic = (Array.isArray(item?.quotaWindows) ? item.quotaWindows : [])
      .map((window) => normalizeQuotaWindow(window))
      .filter(Boolean);
    if (dynamic.length) {
      return dynamic.sort((a, b) => {
        if (a.windowSeconds < 0) return 1;
        if (b.windowSeconds < 0) return -1;
        return a.windowSeconds - b.windowSeconds;
      });
    }

    const legacy = [];
    const q5 = toPercentNumber(item?.quota5hRemainingPercent);
    const r5 = Number(item?.quota5hResetAfterSeconds);
    const configured5 = Number(item?.quota5hWindowSeconds);
    if (q5 !== null) {
      const inferred5 = Number.isFinite(configured5) && configured5 > 0
        ? configured5
        : (Number.isFinite(r5) && r5 > 86400 ? 604800 : 18000);
      legacy.push(normalizeQuotaWindow({
        slot: "legacy-primary",
        windowSeconds: inferred5,
        remainingPercent: q5,
        resetAfterSeconds: r5,
        resetAt: item?.quota5hResetAt
      }, "主额度"));
    }

    const q7 = toPercentNumber(item?.quota7dRemainingPercent);
    if (q7 !== null) {
      const configured7 = Number(item?.quota7dWindowSeconds);
      legacy.push(normalizeQuotaWindow({
        slot: "legacy-secondary",
        windowSeconds: Number.isFinite(configured7) && configured7 > 0 ? configured7 : 604800,
        remainingPercent: q7,
        resetAfterSeconds: item?.quota7dResetAfterSeconds,
        resetAt: item?.quota7dResetAt
      }, "周额度"));
    }

    const byWindow = new Map();
    legacy.filter(Boolean).forEach((window) => byWindow.set(String(window.windowSeconds), window));
    return [...byWindow.values()].sort((a, b) => a.windowSeconds - b.windowSeconds);
  }

  function formatQuotaWindowDisplayLabel(window) {
    const seconds = Number(window?.windowSeconds);
    if (Number.isFinite(seconds) && seconds > 0) {
      const days = seconds / 86400;
      const hours = seconds / 3600;
      if (days >= 1 && Math.abs(days - Math.round(days)) < 0.01) return `${Math.round(days)} 天额度`;
      if (hours >= 1 && Math.abs(hours - Math.round(hours)) < 0.01) return `${Math.round(hours)} 小时额度`;
    }
    const fallback = String(window?.label || "额度").trim();
    return fallback.includes("额度") ? fallback : `${fallback} 额度`;
  }

  function renderQuotaWindow(window) {
    const label = formatQuotaWindowDisplayLabel(window);
    const value = window?.remainingPercent;
    const n = toPercentNumber(value);
    const width = n === null ? 0 : Math.max(0, Math.min(100, n));
    const text = formatPercentValue(value);
    const recoveryText = Number.isFinite(window?.resetAfterSeconds) && window.resetAfterSeconds >= 0
      ? formatDurationFromSeconds(window.resetAfterSeconds)
      : t("quota.recovery_unknown");
    return `
      <div class="quota-window ${escapeHtml(getQuotaLevelClass(value))}">
        <div class="quota-window-head">
          <span class="quota-window-label">${escapeHtml(label)}</span>
          <span class="quota-window-value">${escapeHtml(t("quota.remaining_value", { value: text }))}</span>
        </div>
        <div class="quota-bar-track" title="${escapeHtml(`${label} ${text}`)}">
          <div class="quota-bar-fill" style="width: ${width}%"></div>
        </div>
        <div class="quota-window-foot">
          <span>${escapeHtml(t("quota.recovery_label"))}</span>
          <strong>${escapeHtml(recoveryText)}</strong>
        </div>
      </div>
    `;
  }

  function getAccountQuotaSummary(accounts = state.accounts) {
    const list = Array.isArray(accounts) ? accounts : [];
    const usable = list.filter((x) => x && x.usageOk);
    const windowGroups = new Map();
    usable.forEach((account) => {
      getQuotaWindows(account).forEach((window) => {
        if (window.remainingPercent === null) return;
        const key = window.windowSeconds > 0 ? String(window.windowSeconds) : window.label;
        if (!windowGroups.has(key)) windowGroups.set(key, { label: window.label, windowSeconds: window.windowSeconds, values: [] });
        windowGroups.get(key).values.push(window.remainingPercent);
      });
    });
    const windowAverages = [...windowGroups.values()]
      .sort((a, b) => (a.windowSeconds < 0 ? Number.MAX_SAFE_INTEGER : a.windowSeconds) - (b.windowSeconds < 0 ? Number.MAX_SAFE_INTEGER : b.windowSeconds))
      .slice(0, 2)
      .map((entry) => ({
        label: entry.label,
        average: entry.values.reduce((sum, value) => sum + value, 0) / entry.values.length
      }));
    const lowAccounts = usable
      .map((x) => {
        const values = getQuotaWindows(x).map((window) => window.remainingPercent).filter((value) => value !== null);
        return { name: getAccountEmail(x), lowValue: values.length ? Math.min(...values) : null };
      })
      .filter((x) => x.lowValue !== null && x.lowValue < 20)
      .sort((a, b) => a.lowValue - b.lowValue);
    const current = list.find((x) => x && x.isCurrent);

    return {
      total: list.length,
      currentName: current ? (getAccountEmail(current) || String(current.name || "")) : "",
      windows: windowAverages,
      lowCount: lowAccounts.length
    };
  }

  function renderAccountSummary() {
    const summary = getAccountQuotaSummary();
    if (dom.summaryTotalValue) dom.summaryTotalValue.textContent = String(summary.total);
    if (dom.summaryCurrentValue) {
      const currentText = summary.currentName || t("summary.current_empty");
      dom.summaryCurrentValue.textContent = currentText;
      dom.summaryCurrentValue.title = currentText;
    }
    const summaryWindows = [
      { label: dom.summaryAvg5Label, value: dom.summaryAvg5Value, metric: summary.windows[0] },
      { label: dom.summaryAvg7Label, value: dom.summaryAvg7Value, metric: summary.windows[1] }
    ];
    summaryWindows.forEach(({ label, value, metric }) => {
      const item = label?.closest(".summary-item");
      item?.classList.toggle("is-hidden", !metric);
      if (label && metric) label.textContent = t("summary.window_average", { window: metric.label });
      if (value) value.textContent = formatPercentValue(metric?.average);
    });
    if (dom.summaryLowValue) {
      dom.summaryLowValue.textContent = String(summary.lowCount);
      dom.summaryLowValue.classList.toggle("is-warning", summary.lowCount > 0);
    }
  }

  function getAccountEmail(item) {
    return String(item?.email || item?.name || "").trim();
  }

  function makeAccountKey(name, group) {
    return `${String(group || "personal").toLowerCase()}::${String(name || "")}`;
  }

  function getAccountDedupeKey(item) {
    const email = String(item?.email || "").trim().toLowerCase();
    if (email && email.includes("@")) return `email:${email}`;
    const name = String(item?.name || "").trim().toLowerCase();
    return name ? `name:${name}` : "";
  }

  function isPlaceholderAccount(item) {
    const name = String(item?.name || "").trim().toLowerCase();
    const email = String(item?.email || "").trim();
    return name === "current_account" && !email;
  }

  function isAccountMarkedAbnormal(item) {
    return item?.abnormal === true || item?.abnormal === "true";
  }

  function getAccountIssueText(item) {
    const reason = String(item?.abnormalReason || item?.usageError || "").trim().toLowerCase();
    if (reason.includes("token") || reason.includes("unauthorized") || reason.includes("invalid")) {
      return t("quota.account_auth_expired");
    }
    if (reason.includes("refresh")) {
      return t("quota.account_refresh_failed");
    }
    return t("quota.account_abnormal");
  }

  function scoreAccountForMerge(item) {
    if (!item) return -1;
    const email = String(item.email || "").trim().toLowerCase();
    const name = String(item.name || "").trim().toLowerCase();
    const usableQuota = item.usageOk && !isAccountMarkedAbnormal(item);
    return (item.isCurrent ? 16 : 0)
      + (usableQuota ? 8 : 0)
      + (email ? 4 : 0)
      + (email && name === email ? 2 : 0)
      + (item.lastUsed || item.updatedAt ? 1 : 0);
  }

  function mergeDuplicateAccounts(a, b) {
    const winner = scoreAccountForMerge(b) > scoreAccountForMerge(a) ? { ...b } : { ...a };
    const records = [a, b].filter(Boolean);
    const canonical = records.find((x) => {
      const email = String(x.email || "").trim().toLowerCase();
      const name = String(x.name || "").trim().toLowerCase();
      return email && name === email;
    });

    if (canonical?.name && winner.email) winner.name = canonical.name;
    winner.isCurrent = records.some((x) => x.isCurrent);
    winner.abnormal = records.some((x) => isAccountMarkedAbnormal(x));
    winner.usageOk = records.some((x) => x.usageOk && !isAccountMarkedAbnormal(x));

    const quotaSource = records.find((x) => x.usageOk && !isAccountMarkedAbnormal(x) && x.quota)
      || records.find((x) => !isAccountMarkedAbnormal(x) && x.quota);
    if (quotaSource?.quota) winner.quota = quotaSource.quota;
    return winner;
  }

  function normalizeCurrentAccountRef(current) {
    const name = String(current?.name || current?.account || "").trim().toLowerCase();
    const email = String(current?.email || "").trim().toLowerCase();
    const group = String(current?.group || "").trim().toLowerCase();
    return {
      name,
      email,
      group: group ? normalizeGroupValue(group) : ""
    };
  }

  function accountMatchesCurrentRef(item, current = state.currentAccountRef) {
    const ref = normalizeCurrentAccountRef(current);
    if (!ref.name && !ref.email) return false;
    const name = String(item?.name || "").trim().toLowerCase();
    const email = getAccountEmail(item).toLowerCase();
    return [ref.name, ref.email].filter(Boolean).some((value) => value === name || value === email);
  }

  function normalizeAccountList(accounts) {
    const map = new Map();
    for (const raw of Array.isArray(accounts) ? accounts : []) {
      if (!raw || isPlaceholderAccount(raw)) continue;
      const item = {
        ...raw,
        group: normalizeGroupValue(raw.group),
        planType: String(raw.planType || ""),
        usageError: String(raw.usageError || ""),
        email: String(raw.email || "").trim(),
        isCurrent: raw.isCurrent === true || raw.isCurrent === "true",
        usageOk: (raw.usageOk === true || raw.usageOk === "true") && !isAccountMarkedAbnormal(raw),
        abnormal: raw.abnormal === true || raw.abnormal === "true",
        abnormalReason: String(raw.abnormalReason || "")
      };
      const key = getAccountDedupeKey(item);
      if (!key) continue;
      map.set(key, map.has(key) ? mergeDuplicateAccounts(map.get(key), item) : item);
    }
    const values = Array.from(map.values());
    const currentMatches = values.map((item) => accountMatchesCurrentRef(item));
    const hasCurrentRefMatch = currentMatches.some(Boolean);
    let markedCurrent = false;
    return values.map((item, index) => {
      const shouldBeCurrent = hasCurrentRefMatch ? currentMatches[index] : !!item.isCurrent;
      if (shouldBeCurrent && !markedCurrent) {
        markedCurrent = true;
        return { ...item, isCurrent: true };
      }
      return item.isCurrent ? { ...item, isCurrent: false } : item;
    });
  }

  function getAccountListSignature(accounts) {
    return (Array.isArray(accounts) ? accounts : [])
      .map((item) => [
        getAccountDedupeKey(item),
        item.group,
        item.planType,
        item.email,
        item.name,
        item.updatedAt,
        item.firstAddedAt,
        item.isCurrent ? "1" : "0",
        item.usageOk ? "1" : "0",
        item.abnormal ? "1" : "0",
        JSON.stringify(Array.isArray(item.quotaWindows) ? item.quotaWindows : []),
        item.quota5hRemainingPercent,
        item.quota7dRemainingPercent,
        item.quotaResetAvailableCount,
        item.quotaResetCountUpdatedAt
      ].map((value) => String(value ?? "").trim()).join("|"))
      .join("\n");
  }

  function setRefreshBusy(mode = "", accountKey = "") {
    state.refreshMode = mode;
    state.refreshTargetKey = accountKey || "";
    if (!mode) {
      state.refreshProgressCurrent = 0;
      state.refreshProgressTotal = 0;
    }
    renderPrimaryActionButtons();
    renderAccounts();
  }

  function getProgressVars(current, total) {
    const currentNum = Math.max(0, Math.trunc(Number(current)));
    const totalNum = Math.max(0, Math.trunc(Number(total)));
    if (!Number.isFinite(currentNum) || !Number.isFinite(totalNum) || currentNum <= 0 || totalNum <= 0) {
      return null;
    }
    return {
      current: String(currentNum),
      total: String(totalNum),
      progress: t("progress.count", { current: String(currentNum), total: String(totalNum) })
    };
  }

  function renderPrimaryActionButtons() {
    if (!dom.addAccountBtn) return;
    dom.addAccountBtn.disabled = state.switchProgressActive || state.loginProgressActive;
    const labelKey = state.loginProgressActive ? "toolbar.login_running" : "toolbar.add_current";
    dom.addAccountBtn.innerHTML = `<span class="btn-icon">＋</span><span>${escapeHtml(t(labelKey))}</span>`;
  }

  function getAccountsTotalPages() {
    const total = Array.isArray(state.filteredAccounts) ? state.filteredAccounts.length : 0;
    return Math.max(1, Math.ceil(total / ACCOUNTS_PAGE_SIZE));
  }

  function clampAccountsPage() {
    const pages = getAccountsTotalPages();
    const page = Math.trunc(Number(state.accountsPage) || 0);
    state.accountsPage = Math.min(Math.max(0, page), pages - 1);
    return state.accountsPage;
  }

  function getCurrentAccountsPageItems() {
    const page = clampAccountsPage();
    const start = page * ACCOUNTS_PAGE_SIZE;
    return state.filteredAccounts.slice(start, start + ACCOUNTS_PAGE_SIZE);
  }

  function renderAccountsPagination() {
    const total = state.filteredAccounts.length;
    const pages = getAccountsTotalPages();
    const page = clampAccountsPage();
    const hasMultiplePages = total > ACCOUNTS_PAGE_SIZE;
    if (dom.accountsPagination) {
      dom.accountsPagination.classList.toggle("is-compact", !hasMultiplePages);
    }
    if (dom.accountsPrevPageBtn) {
      dom.accountsPrevPageBtn.textContent = t("pagination.prev");
      dom.accountsPrevPageBtn.disabled = page <= 0;
    }
    if (dom.accountsNextPageBtn) {
      dom.accountsNextPageBtn.textContent = t("pagination.next");
      dom.accountsNextPageBtn.disabled = page >= pages - 1;
    }
    if (dom.accountsPageInfo) {
      dom.accountsPageInfo.textContent = t("pagination.info", {
        page: page + 1,
        pages,
        size: ACCOUNTS_PAGE_SIZE
      });
    }
  }

  function renderAccounts() {
    if (!dom.accountsBody) return;
    renderPrimaryActionButtons();
    renderAccountSummary();
    renderAccountsPagination();
    applyCountText();

    if (!state.filteredAccounts.length) {
      dom.accountsBody.innerHTML = `<tr><td colspan="4" class="table-empty-cell">${escapeHtml(t("accounts.empty"))}</td></tr>`;
      return;
    }

    dom.accountsBody.innerHTML = getCurrentAccountsPageItems().map((item) => {
      const accountKey = makeAccountKey(item.name, item.group);
      const isThisRefreshing = state.refreshMode === "account" && state.refreshTargetKey === accountKey;
      const disableAccountMutation = !!state.importMode || state.switchProgressActive || state.loginProgressActive;
      const disableRefreshAction = state.refreshMode === "all" || isThisRefreshing || disableAccountMutation;
      const disableSwitchAction = !!state.importMode || !!state.refreshMode || state.switchProgressActive || state.loginProgressActive;
      const normalizedPlanType = normalizePlanType(item.planType);
      const normalizedGroup = normalizeGroupValue(item.group);
      const planLabel = formatPlanTypeLabel(item.planType);
      const planClass = normalizedPlanType || "unknown";
      const showGroupTag = item.abnormal
        || normalizedGroup === "personal"
        || normalizedGroup === "business"
        || !normalizedPlanType
        || normalizedGroup !== normalizedPlanType;
      const groupTagLabel = item.abnormal ? t("tag.abnormal") : formatGroupLabel(normalizedGroup);
      const groupTagClass = item.abnormal ? "abnormal" : `group ${normalizedGroup}`;
      const email = getAccountEmail(item);
      const name = String(item.name || "").trim();
      const alias = name && email && name !== email ? `<span class="account-alias">昵称：${escapeHtml(name)}</span>` : "";
      const accountInitial = "C";
      const quotaWindows = getQuotaWindows(item);
      const itemResetCount = toNonNegativeInteger(item.quotaResetAvailableCount);
      const cachedResetCount = getCachedQuotaResetAvailableCount(item);
      const effectiveResetCount = itemResetCount ?? cachedResetCount ?? null;
      const resetCountText = formatResetAvailableCount(effectiveResetCount);
      const resetCountKnown = effectiveResetCount !== null;
      const resetCountUpdatedAt = String(item.quotaResetCountUpdatedAt || getCachedQuotaResetUpdatedAt(item) || "").trim();
      const resetCountFresh = isQueryFresh(resetCountUpdatedAt);
      const resetCountHtml = `
        <div class="quota-reset-row${resetCountFresh ? "" : " stale"}" title="显示官方上次查询结果；点击本行刷新可重新查询">
          <span class="quota-meta-label">${escapeHtml(t("quota.reset_count_label"))}</span>
          <strong class="quota-reset-count${resetCountKnown ? "" : " unknown"}">${escapeHtml(resetCountText)}</strong>
          <span class="quota-reset-updated">${escapeHtml(formatQueryFreshness(resetCountUpdatedAt))}</span>
        </div>`;
      const effectiveFirstAddedAt = String(item.firstAddedAt || getCachedFirstAddedAt(item) || "").trim();
      const firstAddedDate = formatCasDateShort(effectiveFirstAddedAt);
      const managedDays = formatDaysSince(effectiveFirstAddedAt);
      const firstAddedTitle = firstAddedDate
        ? `首次进入 CAS：${effectiveFirstAddedAt}。Plus 剩余天数按首次进入 CAS + 30 天估算，不等同于官方订阅到期日。`
        : "";
      const plusEstimate = formatPlusRemainingDays(effectiveFirstAddedAt, item.planType || item.group);
      const primaryAction = item.abnormal ? "reauth" : "switch";
      const primaryActionTitle = item.abnormal ? t("action.relogin_title") : t("action.switch_title");
      const primaryActionLabel = item.abnormal ? t("action.relogin") : t("action.switch");
      const primaryActionDisabled = state.switchProgressActive || (item.abnormal ? false : disableSwitchAction);
      const quotaBody = item.usageOk && !item.abnormal
        ? `
          ${quotaWindows.length
            ? `<div class="quota-windows">${quotaWindows.map((window) => renderQuotaWindow(window)).join("")}</div>`
            : `<div class="quota-placeholder">${escapeHtml(t("quota.no_window"))}</div>`}
          ${resetCountHtml}
        `
        : `<div class="quota-placeholder">${escapeHtml(item.abnormal ? getAccountIssueText(item) : (String(item.usageError || "").trim() || t("quota.placeholder")))}</div>`;

      return `
        <tr>
          <td>
            <div class="account-cell" title="${escapeHtml(email || name)}">
              <span class="account-avatar ${item.abnormal ? "danger" : (item.isCurrent ? "current" : "")}">${escapeHtml(accountInitial)}</span>
              <span class="account-main">
                <span class="account-name">${escapeHtml(email || name || "-")}</span>
                ${alias}
                <span class="account-tags">
                  ${item.isCurrent ? `<span class="tag current">${escapeHtml(t("tag.current"))}</span>` : ""}
                  ${showGroupTag ? `<span class="tag ${escapeHtml(groupTagClass)}" title="${escapeHtml(item.abnormalReason || formatGroupLabel(normalizedGroup))}">${escapeHtml(groupTagLabel)}</span>` : ""}
                  ${planLabel ? `<span class="tag plan ${escapeHtml(planClass)}">${escapeHtml(planLabel)}</span>` : ""}
                </span>
              </span>
            </div>
          </td>
          <td>
            <div class="quota-box">
              ${quotaBody}
            </div>
          </td>
          <td>
            <div class="time-records">
              <div class="time-record-row primary"><span class="time-record-label">${escapeHtml(t("time.sync_label"))}</span><span class="time-record-value">${escapeHtml(item.updatedAt || "-")}</span></div>
              <div class="time-record-row"><span class="time-record-label">${escapeHtml(t("time.first_added_label"))}</span><span class="time-record-value">${escapeHtml(firstAddedDate || "-")}</span></div>
              <div class="time-record-row"><span class="time-record-label">${escapeHtml(t("time.managed_label"))}</span><span class="time-record-value">${escapeHtml(managedDays || "-")}</span></div>
              ${plusEstimate ? `<div class="time-record-row estimate" title="${escapeHtml(firstAddedTitle)}"><span class="time-record-label">${escapeHtml(t("time.plan_estimate_label"))}</span><span class="time-record-value">${escapeHtml(plusEstimate)}</span></div>` : ""}
            </div>
          </td>
          <td class="actions-col">
            <div class="actions">
              <button class="btn-action ${item.abnormal ? "reauth" : "switch"}" data-action="${escapeHtml(primaryAction)}" data-name="${escapeHtml(item.name)}" data-group="${escapeHtml(item.group || "personal")}" title="${escapeHtml(primaryActionTitle)}" aria-label="${escapeHtml(primaryActionTitle)}" ${primaryActionDisabled ? "disabled" : ""}>${actionIcon("switch")}<span class="btn-action-label">${escapeHtml(primaryActionLabel)}</span></button>
              <button class="btn-action rename" data-action="rename" data-name="${escapeHtml(item.name)}" data-group="${escapeHtml(item.group || "personal")}" title="${escapeHtml(t("action.rename_title"))}" aria-label="${escapeHtml(t("action.rename_title"))}" ${disableAccountMutation ? "disabled" : ""}>${actionIcon("rename")}<span class="btn-action-label">${escapeHtml(t("action.rename"))}</span></button>
              <button class="btn-action refresh ${isThisRefreshing ? "loading" : ""}" data-action="refresh" data-name="${escapeHtml(item.name)}" data-group="${escapeHtml(item.group || "personal")}" title="${escapeHtml(t("action.refresh_title"))}" aria-label="${escapeHtml(t("action.refresh_title"))}" ${disableRefreshAction ? "disabled" : ""}>${actionIcon("refresh")}<span class="btn-action-label">${escapeHtml(t("action.refresh"))}</span></button>
              <button class="btn-action delete" data-action="delete" data-name="${escapeHtml(item.name)}" data-group="${escapeHtml(item.group || "personal")}" title="${escapeHtml(t("action.delete_title"))}" aria-label="${escapeHtml(t("action.delete_title"))}" ${disableAccountMutation ? "disabled" : ""}>${actionIcon("delete")}<span class="btn-action-label">${escapeHtml(t("action.delete"))}</span></button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function applyCountText() {
    if (!dom.countText) return;
    const total = state.filteredAccounts.length;
    if (total <= 0) {
      dom.countText.textContent = t("count.empty");
      return;
    }
    const page = clampAccountsPage();
    const start = page * ACCOUNTS_PAGE_SIZE + 1;
    const end = Math.min(total, start + ACCOUNTS_PAGE_SIZE - 1);
    dom.countText.textContent = t("count.format", { start, end, total });
  }

  function applySearch() {
    const q = String(dom.searchInput?.value || "").trim().toLowerCase();
    let list = [...state.accounts];
    if (state.groupFilter !== "all") {
      list = list.filter((x) => normalizePlanType(x.planType) === state.groupFilter);
    }
    state.filteredAccounts = !q
      ? list
      : list.filter((x) => [x.name, x.email].map((v) => String(v || "").toLowerCase()).join(" ").includes(q));
    state.accountsPage = 0;
    renderAccounts();
  }

  function requestAccountsList(force = false) {
    const localLoad = refreshAccountsFromLocalIndex();
    if (force) {
      window.setTimeout(() => post("list_accounts", { force: true }), 150);
      window.setTimeout(() => refreshAccountsFromLocalIndex(), 700);
    }
    return localLoad;
  }

  function refreshQuotaResetCounts(target = null) {
    if (!window.fetch) return Promise.resolve(false);
    const body = target?.account
      ? { account: target.account, group: target.group || "" }
      : {};
    return fetch(`${LOCAL_METADATA_BASE_URL}/quota-reset-counts/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(body)
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || payload?.ok === false) {
          throw new Error(payload?.error || `HTTP ${response.status}`);
        }
        return true;
      })
      .catch((error) => {
        log(`quota reset count refresh unavailable: ${error?.message || error}`);
        return false;
      });
  }

  async function refreshAccountUsage(target) {
    if (!target?.account || !window.fetch) return false;
    try {
      const response = await fetch(`${LOCAL_METADATA_BASE_URL}/account-usage/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: target.account, group: target.group || "" })
      });
      const payload = await response.json();
      await requestAccountsList(true);
      await refreshQuotaResetCountCache({ render: false });
      if (!response.ok || payload?.ok === false) {
        if (payload?.error === "auth_expired") {
          showToast(t("status.usage_auth_expired"), "warning");
        } else {
          showToast(t("status.usage_refresh_failed"), "error");
        }
        return false;
      }
      showToast(t("status.usage_refresh_success"), "success");
      return true;
    } catch (error) {
      log(`account usage refresh unavailable: ${error?.message || error}`);
      showToast(t("status.usage_refresh_failed"), "error");
      return false;
    } finally {
      setRefreshBusy("", "");
      state.refreshTargetAccount = null;
      requestAccountsList();
    }
  }

  function requestLanguagePack(code) {
    post("get_language_pack", { code: code || state.currentLanguage || "zh-CN" });
  }

  function getManagedAccountCount() {
    return Array.isArray(state.accounts) ? state.accounts.length : 0;
  }

  function getAddAccountGuidanceKey(count = getManagedAccountCount()) {
    if (count >= 5) return "dialog.add_account.guidance_many";
    if (count === 4) return "dialog.add_account.guidance_four";
    return "dialog.add_account.guidance_neutral";
  }

  function renderAddAccountGuidance() {
    const count = getManagedAccountCount();
    if (dom.addAccountGuidanceTitle) dom.addAccountGuidanceTitle.textContent = t("dialog.add_account.guidance_title");
    if (dom.addAccountGuidanceText) dom.addAccountGuidanceText.textContent = t(getAddAccountGuidanceKey(count), { count });
    if (dom.addAccountGuidance) dom.addAccountGuidance.classList.toggle("is-warning", count >= 4);
  }

  function readPrepareNewLoginIntents(now = Date.now()) {
    try {
      const parsed = JSON.parse(localStorage.getItem(PREPARE_NEW_LOGIN_INTENTS_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0 && now - value < PREPARE_NEW_LOGIN_WINDOW_MS);
    } catch (_) {
      return [];
    }
  }

  function recordPrepareNewLoginIntent() {
    const now = Date.now();
    const recent = readPrepareNewLoginIntents(now);
    recent.push(now);
    try {
      localStorage.setItem(PREPARE_NEW_LOGIN_INTENTS_KEY, JSON.stringify(recent));
    } catch (_) {
    }
    return recent.length;
  }

  function getAccountIdentitySignature(accounts = state.accounts) {
    return (Array.isArray(accounts) ? accounts : [])
      .map((item) => getAccountDedupeKey(item))
      .filter(Boolean)
      .sort()
      .join("\n");
  }

  function getCurrentAccountRefSignature(current = state.currentAccountRef) {
    const ref = normalizeCurrentAccountRef(current);
    return `${ref.email || ref.name}|${ref.group}`;
  }

  function stopAddAccountWatch() {
    if (state.addAccountWatchTimer) {
      window.clearInterval(state.addAccountWatchTimer);
      state.addAccountWatchTimer = 0;
    }
    state.addAccountWatchDeadline = 0;
    state.addAccountWatchBaselineKeys = "";
    state.addAccountWatchBaselineCurrent = "";
  }

  function stopLoginStatusWatch() {
    if (state.loginStatusTimer) {
      window.clearInterval(state.loginStatusTimer);
      state.loginStatusTimer = 0;
    }
  }

  function getLoginErrorReason(errorCode) {
    const reasons = {
      login_failed: "登录流程出错",
      codex_cli_missing: "未找到 Codex CLI",
      codex_login_failed: "官方登录未完成",
      auth_not_created: "登录后未生成 auth.json",
      sync_script_missing: "账号同步脚本缺失",
      account_sync_failed: "账号导入失败",
      current_login_backup_failed: "当前账号备份失败",
      protocol_not_started: "登录入口没有启动",
      login_timeout: "等待登录超时"
    };
    return reasons[String(errorCode || "")] || String(errorCode || "未知错误");
  }

  function finishLoginStatus(success, options = {}) {
    stopLoginStatusWatch();
    state.loginProgressActive = false;
    state.loginProgressStage = success ? "ready" : String(options.stage || "failed");
    renderPrimaryActionButtons();
    renderAccounts();
    if (success) {
      stopAddAccountWatch();
      try { localStorage.removeItem(PREPARE_NEW_LOGIN_INTENTS_KEY); } catch (_) {}
      requestAccountsList(true);
      showToast(t("status.login_success"), "success");
      return;
    }
    const errorCode = String(options.errorCode || "login_failed");
    if (options.stage === "restored") {
      showToast(t("status.login_restored"), "warning");
    } else {
      showToast(t("status.login_failed", { reason: getLoginErrorReason(errorCode) }), "error");
    }
  }

  async function pollLoginStatus() {
    if (!state.loginProgressActive || !window.fetch) return;
    if (Date.now() - state.loginStartedAt > LOGIN_STATUS_TIMEOUT_MS) {
      finishLoginStatus(false, { errorCode: "login_timeout" });
      return;
    }
    try {
      const response = await fetch(`${LOCAL_METADATA_BASE_URL}/login-status`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || payload?.ok === false || payload?.stage === "idle") return;
      const startedAt = Date.parse(String(payload.startedAt || ""));
      if (!Number.isFinite(startedAt) || startedAt < state.loginStartedAt - 3000) return;

      const operationId = String(payload.operationId || "");
      if (state.loginStatusOperationId && operationId && state.loginStatusOperationId !== operationId) return;
      if (operationId) state.loginStatusOperationId = operationId;
      const stage = String(payload.stage || "idle");
      state.loginProgressStage = stage;
      renderPrimaryActionButtons();
      if (stage !== state.loginLastToastStage) {
        state.loginLastToastStage = stage;
        if (stage === "signing_in") showToast(t("status.login_browser"), "info");
        if (stage === "syncing") showToast(t("status.login_syncing"), "info");
      }
      if (stage === "ready") {
        finishLoginStatus(true);
      } else if (stage === "restored" || stage === "failed") {
        finishLoginStatus(false, { stage, errorCode: payload.errorCode });
      }
    } catch (error) {
      log(`login status unavailable: ${error?.message || error}`);
    }
  }

  function startLoginStatusWatch() {
    stopLoginStatusWatch();
    state.loginProgressActive = true;
    state.loginProgressStage = "preparing";
    state.loginStartedAt = Date.now();
    state.loginStatusOperationId = "";
    state.loginLastToastStage = "";
    renderPrimaryActionButtons();
    renderAccounts();
    state.loginStatusTimer = window.setInterval(pollLoginStatus, LOGIN_STATUS_POLL_MS);
    window.setTimeout(pollLoginStatus, 350);
  }

  function startAddAccountWatch() {
    stopAddAccountWatch();
    state.addAccountWatchDeadline = Date.now() + ADD_ACCOUNT_WATCH_TIMEOUT_MS;
    state.addAccountWatchBaselineKeys = getAccountIdentitySignature();
    state.addAccountWatchBaselineCurrent = getCurrentAccountRefSignature();

    const checkForAddedAccount = async () => {
      if (Date.now() >= state.addAccountWatchDeadline) {
        stopAddAccountWatch();
        return;
      }
      await refreshAccountsFromLocalIndex({ preloadDerived: false });
      const accountKeysChanged = getAccountIdentitySignature() !== state.addAccountWatchBaselineKeys;
      const currentChanged = getCurrentAccountRefSignature() !== state.addAccountWatchBaselineCurrent;
      if (accountKeysChanged || currentChanged) {
        stopAddAccountWatch();
        switchTab("accounts");
      }
    };

    state.addAccountWatchTimer = window.setInterval(checkForAddedAccount, ADD_ACCOUNT_WATCH_INTERVAL_MS);
    window.setTimeout(checkForAddedAccount, 250);
  }

  function buildPrepareNewLoginMessage(intentCount = 1) {
    const parts = [
      t("dialog.prepare_new_login.message"),
      t("dialog.prepare_new_login.auth_note", { count: getManagedAccountCount() }),
      t("dialog.prepare_new_login.oauth_note")
    ];
    if (intentCount >= 2) {
      parts.push(t("dialog.prepare_new_login.frequency_note"));
    }
    return parts.join("\n\n");
  }

  function openConfirm(options) {
    dom.confirmTitle.textContent = options?.title || t("dialog.confirm.title");
    dom.confirmMessage.textContent = options?.message || t("dialog.confirm.default_message");
    state.confirmAction = typeof options?.onConfirm === "function" ? options.onConfirm : null;
    dom.confirmModal.classList.add("show");
  }

  function closeConfirm() {
    dom.confirmModal.classList.remove("show");
    state.confirmAction = null;
  }

  function openAddAccountModal() {
    renderAddAccountGuidance();
    dom.addAccountModal.classList.add("show");
    window.setTimeout(() => dom.addAccountPrepareNewBtn?.focus(), 20);
  }

  function closeAddAccountModal() {
    dom.addAccountModal.classList.remove("show");
  }

  function openPrepareNewLoginProtocol() {
    try {
      startAddAccountWatch();
      startLoginStatusWatch();
      if (window.CAS_HTTP_BRIDGE) {
        post("prepare_new_login");
      } else {
        window.location.href = "cas-new-login:";
      }
      showToast(t("status.prepare_new_login_opened"), "info");
    } catch (_) {
      finishLoginStatus(false, { errorCode: "protocol_not_started" });
    }
  }

  function openReloginConfirmation(name) {
    setRefreshBusy("", "");
    openConfirm({
      title: t("dialog.relogin.title"),
      message: t("dialog.relogin.message", { name }),
      onConfirm: openPrepareNewLoginProtocol
    });
  }

  function getIdeDisplayName() {
    return t("ide.codex");
  }

  function buildConfigPayload() {
    return {
      language: state.currentLanguage,
      ideExe: "Code.exe",
      tabVisibility: normalizeTabVisibility(state.tabVisibility),
      closeWindowBehavior: state.closeWindowBehavior,
      theme: state.themeMode
    };
  }

  function saveConfigNow() {
    if (!state.configLoaded) return;
    try {
      localStorage.setItem("cas_theme", state.themeMode || "auto");
    } catch (_) {
    }
    post("set_config", buildConfigPayload());
  }

  function queueSaveConfig() {
    if (state.saveConfigTimer) clearTimeout(state.saveConfigTimer);
    state.saveConfigTimer = setTimeout(() => {
      saveConfigNow();
      state.saveConfigTimer = null;
    }, 250);
  }

  function flushPendingConfigWrite() {
    if (state.saveConfigTimer) {
      clearTimeout(state.saveConfigTimer);
      state.saveConfigTimer = null;
      saveConfigNow();
    }
  }

  function mapStatusMessage(msg) {
    const code = String(msg?.code || "");
    if (!code) return String(msg?.message || "");
    const key = `status_code.${code}`;
    if (state.i18n[key] || DEFAULT_I18N[key]) {
      if (code === "restart_failed" || code === "switch_success") {
        return t(key, { ide: getIdeDisplayName(state.currentIdeExe) });
      }
      if (code === "quota_refresh_progress") {
        const vars = getProgressVars(msg?.current, msg?.total);
        return vars ? t(key, vars) : t(key);
      }
      return t(key);
    }
    return String(msg?.message || code);
  }

  function bindEvents() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.getAttribute("data-tab") || "accounts"));
    });

    dom.searchInput?.addEventListener("input", applySearch);
    dom.accountsPrevPageBtn?.addEventListener("click", () => {
      state.accountsPage = Math.max(0, state.accountsPage - 1);
      renderAccounts();
    });
    dom.accountsNextPageBtn?.addEventListener("click", () => {
      state.accountsPage = Math.min(getAccountsTotalPages() - 1, state.accountsPage + 1);
      renderAccounts();
    });
    dom.accountNotesBtn?.addEventListener("click", () => switchTab("notes"));
    dom.accountNotesAddBtn?.addEventListener("click", addAccountNote);
    dom.accountNotesBatchImportBtn?.addEventListener("click", toggleAccountNotesBatchImport);
    dom.accountNotesCollapseBtn?.addEventListener("click", () => {
      if (state.currentTab === "notes") switchTab("accounts");
      else setAccountNotesOpen(false);
    });
    dom.accountNotesSearchInput?.addEventListener("input", () => {
      state.accountNotesSearch = dom.accountNotesSearchInput.value || "";
      state.accountNotesPage = 0;
      renderAccountNotesList();
    });
    dom.addAccountBtn?.addEventListener("click", openAddAccountModal);
    dom.accountNotesClearSearchBtn?.addEventListener("click", () => {
      state.accountNotesSearch = "";
      if (dom.accountNotesSearchInput) dom.accountNotesSearchInput.value = "";
      state.accountNotesPage = 0;
      renderAccountNotesList();
    });
    dom.addAccountCancelBtn?.addEventListener("click", closeAddAccountModal);
    dom.switchProgressCloseBtn?.addEventListener("click", () => {
      if (state.switchProgressStage === "failed") finishSwitchProgress();
    });
    dom.switchProgressRetryBtn?.addEventListener("click", retryCodexLaunch);
    dom.addAccountModal?.addEventListener("click", (e) => {
      if (e.target === dom.addAccountModal) closeAddAccountModal();
    });
    dom.addAccountPrepareNewBtn?.addEventListener("click", () => {
      const intentCount = recordPrepareNewLoginIntent();
      closeAddAccountModal();
      openConfirm({
        title: t("dialog.prepare_new_login.title"),
        message: buildPrepareNewLoginMessage(intentCount),
        onConfirm: openPrepareNewLoginProtocol
      });
    });

    document.querySelectorAll("[data-group-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.groupFilter = btn.getAttribute("data-group-filter") || "all";
        document.querySelectorAll("[data-group-filter]").forEach((x) => x.classList.remove("active"));
        btn.classList.add("active");
        applySearch();
      });
    });

    dom.accountsBody?.addEventListener("click", (e) => {
      const target = e.target.closest("button[data-action]");
      if (!target || target.disabled) return;
      const action = target.getAttribute("data-action");
      const name = target.getAttribute("data-name");
      const group = target.getAttribute("data-group") || "personal";
      if (!name) return;

      if (action === "switch") {
        const ide = getIdeDisplayName(state.currentIdeExe);
        openConfirm({
          title: t("dialog.confirm.title"),
          message: t("confirm.switch_restart_ide", { name, ide }),
          onConfirm: () => beginAccountSwitch(name, group)
        });
      } else if (action === "reauth") {
        openReloginConfirmation(name);
      } else if (action === "rename") {
        state.renameTargetName = name;
        state.renameTargetGroup = group;
        dom.renameNameInput.value = name;
        dom.renameModal.classList.add("show");
        setTimeout(() => {
          dom.renameNameInput.focus();
          dom.renameNameInput.select();
        }, 10);
      } else if (action === "refresh") {
        if (state.refreshMode) return;
        state.refreshTargetAccount = { account: name, group };
        setRefreshBusy("account", makeAccountKey(name, group));
        refreshAccountUsage(state.refreshTargetAccount);
      } else if (action === "delete") {
        openConfirm({
          title: t("dialog.delete.title"),
          message: t("dialog.delete.message", { name }),
          onConfirm: () => post("delete_account", { account: name, group })
        });
      }
    });

    dom.renameCancelBtn?.addEventListener("click", () => {
      dom.renameModal.classList.remove("show");
      state.renameTargetName = "";
      state.renameTargetGroup = "personal";
    });
    dom.renameModal?.addEventListener("click", (e) => {
      if (e.target === dom.renameModal) {
        dom.renameModal.classList.remove("show");
        state.renameTargetName = "";
        state.renameTargetGroup = "personal";
      }
    });
    dom.renameConfirmBtn?.addEventListener("click", () => {
      const newName = String(dom.renameNameInput.value || "").trim();
      if (!newName) {
        dom.renameNameInput.focus();
        return;
      }
      if (newName.length > 64) {
        showToast(t("status_code.name_too_long"), "warning");
        return;
      }
      if (!state.renameTargetName) {
        dom.renameModal.classList.remove("show");
        return;
      }
      post("rename_account", {
        account: state.renameTargetName,
        group: state.renameTargetGroup || "personal",
        newName
      });
      dom.renameModal.classList.remove("show");
      state.renameTargetName = "";
      state.renameTargetGroup = "personal";
    });

    dom.confirmCancelBtn?.addEventListener("click", closeConfirm);
    dom.confirmModal?.addEventListener("click", (e) => {
      if (e.target === dom.confirmModal) closeConfirm();
    });
    dom.confirmOkBtn?.addEventListener("click", () => {
      const fn = state.confirmAction;
      closeConfirm();
      if (fn) fn();
    });

    document.querySelectorAll("[data-theme-option]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.themeMode = normalizeThemeMode(btn.getAttribute("data-theme-option"));
        renderSettingsOptions();
        applyTheme();
        queueSaveConfig();
      });
    });

    document.querySelectorAll("[data-close-behavior-option]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = String(btn.getAttribute("data-close-behavior-option") || "tray").toLowerCase();
        state.closeWindowBehavior = value === "exit" ? "exit" : "tray";
        renderSettingsOptions();
        queueSaveConfig();
      });
    });

    dom.settingsTabVisibilityList?.addEventListener("click", (e) => {
      const target = e.target instanceof HTMLElement
        ? e.target.closest("[data-tab-visibility-card]")
        : null;
      if (!(target instanceof HTMLButtonElement)) return;
      const key = String(target.getAttribute("data-tab-visibility-card") || "");
      const tab = TOP_LEVEL_TABS.find((item) => item.key === key);
      if (!key || !tab || !tab.hideable) return;
      state.tabVisibility = normalizeTabVisibility({
        ...state.tabVisibility,
        [key]: !isTabVisible(key)
      });
      renderSettingsOptions();
      if (!isTabVisible(state.currentTab)) switchTab(state.currentTab || "accounts");
      else renderToolbarActionsForTab(state.currentTab);
      queueSaveConfig();
    });

    dom.quickLangBtn?.addEventListener("click", () => {
      state.quickLangMenuOpen = !state.quickLangMenuOpen;
      dom.quickLangMenu?.classList.toggle("show", state.quickLangMenuOpen);
      dom.quickLangBtn.classList.toggle("active", state.quickLangMenuOpen);
    });
    dom.quickThemeBtn?.addEventListener("click", () => {
      const current = normalizeThemeMode(state.themeMode || "auto");
      state.themeMode = current === "auto" ? "light" : (current === "light" ? "dark" : "auto");
      renderSettingsOptions();
      applyTheme();
      queueSaveConfig();
    });
    dom.quickLangMenu?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-quick-lang]");
      if (!btn) return;
      applyLanguageByCode(btn.getAttribute("data-quick-lang") || "zh-CN");
      closeQuickLangMenu();
    });
    document.addEventListener("click", (e) => {
      if (dom.toolbarQuick && !dom.toolbarQuick.contains(e.target)) closeQuickLangMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeQuickLangMenu();
        closeConfirm();
        closeAddAccountModal();
      }
    });
  }

  function bindWebViewMessages() {
    if (!(window.chrome && window.chrome.webview)) return;

    window.chrome.webview.addEventListener("message", (event) => {
      const msg = event.data;
      if (msg && typeof msg === "object" && msg.type === "accounts_list") {
        if (!state.accountsIndexSignature) {
          if (msg.current) state.currentAccountRef = normalizeCurrentAccountRef(msg.current);
          state.accounts = normalizeAccountList(msg.accounts);
          applySearch();
          refreshAccountDerivedCaches();
        }
        refreshAccountsFromLocalIndex();
        log(`host: accounts loaded (${state.accounts.length})`);
        return;
      }

      if (msg && typeof msg === "object" && msg.type === "debug_log") {
        log(`host.${msg.scope || "host"}: ${msg.message || ""}`);
        return;
      }

      if (msg && typeof msg === "object" && msg.type === "app_info") {
        state.appVersion = msg.version || state.appVersion;
        state.debug = state.debug || msg.debug === true || msg.debug === "true";
        if (dom.logEl) dom.logEl.style.display = state.debug ? "block" : "none";
        return;
      }

      if (msg && typeof msg === "object" && msg.type === "config") {
        state.currentLanguage = msg.language || state.currentLanguage || "zh-CN";
        if (typeof msg.languageIndex === "number" && state.languageIndex[msg.languageIndex]) {
          state.currentLanguage = state.languageIndex[msg.languageIndex].code;
        }
        state.currentIdeExe = "Code.exe";
        state.closeWindowBehavior = String(msg.closeWindowBehavior || "tray").toLowerCase() === "exit" ? "exit" : "tray";
        state.themeMode = normalizeThemeMode(msg.theme || state.themeMode || "auto");
        state.tabVisibility = normalizeTabVisibility(msg.tabVisibility);
        try {
          localStorage.setItem("cas_theme", state.themeMode || "auto");
        } catch (_) {
        }
        if (document.documentElement.getAttribute("data-theme") !== resolveEffectiveTheme()) applyTheme();
        state.configLoaded = true;
        requestLanguagePack(state.currentLanguage);
        renderSettingsOptions();
        switchTab(state.currentTab || "accounts");
        return;
      }

      if (msg && typeof msg === "object" && msg.type === "language_index") {
        const langs = Array.isArray(msg.languages) ? msg.languages : [];
        if (langs.length > 0) {
          state.languageIndex = langs;
          renderLanguageOptions();
        }
        return;
      }

      if (msg && typeof msg === "object" && msg.type === "language_pack") {
        if (msg.ok && msg.strings && typeof msg.strings === "object") {
          state.i18n = { ...DEFAULT_I18N, ...msg.strings };
        } else {
          state.i18n = { ...DEFAULT_I18N };
        }
        applyI18n();
        return;
      }

      if (msg && typeof msg === "object" && msg.type === "status") {
        const statusCode = String(msg.code || "");
        if (state.switchProgressActive && statusCode === "restart_failed") {
          setSwitchProgressStage("failed", "launch_failed");
        } else if (state.switchProgressActive && msg.level === "error") {
          setSwitchProgressStage("failed", "switch_failed");
        }
        if (statusCode === "quota_refresh_progress") {
          if (!state.refreshMode) setRefreshBusy("all");
          state.refreshProgressCurrent = Math.max(0, Math.trunc(Number(msg.current) || 0));
          state.refreshProgressTotal = Math.max(0, Math.trunc(Number(msg.total) || 0));
          renderPrimaryActionButtons();
          renderAccounts();
          return;
        }

        if ([
          "quota_refreshed",
          "account_quota_refreshed",
          "quota_refresh_failed",
          "account_abnormal_marked",
          "quota_refresh_running"
        ].includes(statusCode)) {
          setRefreshBusy("", "");
          state.refreshTargetAccount = null;
          requestAccountsList(true);
        }

        if ([
          "backup_saved",
          "auth_json_imported",
          "import_success",
          "import_cancelled"
        ].includes(statusCode) || msg.level === "error") {
          state.importMode = "";
          renderPrimaryActionButtons();
          renderAccounts();
          requestAccountsList(true);
        }

        if ([
          "switch_success",
          "delete_success",
          "account_renamed",
          "account_renamed_and_refreshed"
        ].includes(statusCode)) {
          requestAccountsList(true);
          switchTab("accounts");
        }

        if (!(msg.silent === true || msg.silent === "true")) {
          showToast(mapStatusMessage(msg), msg.level || "info");
        }
        return;
      }

      const text = typeof msg === "string" ? msg : JSON.stringify(msg);
      log(`host: ${text}`);
    });
  }

  function bootstrap() {
    applyI18n();
    loadAccountNotes();
    renderLanguageOptions();
    bindEvents();
    bindWebViewMessages();
    window.addEventListener("beforeunload", flushPendingConfigWrite);
    window.addEventListener("pagehide", flushPendingConfigWrite);
    if (mediaDark) {
      const onSystemThemeChange = () => {
        if (state.themeMode === "auto") applyTheme();
      };
      if (typeof mediaDark.addEventListener === "function") {
        mediaDark.addEventListener("change", onSystemThemeChange);
      } else if (typeof mediaDark.addListener === "function") {
        mediaDark.addListener(onSystemThemeChange);
      }
    }
    applyTheme();
    if (dom.logEl) dom.logEl.style.display = state.debug ? "block" : "none";

    post("get_app_info");
    post("get_config");
    post("get_languages", { code: "zh-CN" });
    requestAccountsList(true);
  }

  bootstrap();
})();
