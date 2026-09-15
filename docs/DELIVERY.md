# ANOMAL 站交付记录 — 性能优化阶段

**站点**: anomalydetected.fun
**优化日期**: 2026-09-15
**优化基线**: PSI mobile 83 分（LCP 3.8s / TBT 150ms / 未用 JS 130KiB）
**优化后**: **PSI mobile 91 分**（LCP 2.9s / TBT 70ms / 未用 JS 71KiB）

## 优化措施

### P1: 首屏关键路径减负（commit c19b12a）

**问题**: LCP 3.8s 中资源加载仅 260ms，渲染延迟 2,050ms 是瓶颈；FCP 2.0s 被 7 个字体 preload（~140KB）挤占首屏带宽。

**措施**:
- Cinzel 6 字重 → 仅 700：next/font 会 preload 全部声明字重，font preload 7 → 2（inter var + cinzel 700，~63KB）；WARDogs 站同款修复 A/B mobile LCP 6.8 → 4.2s
- YouTube facade poster 本地化（`/images/trailer-<siteId>.jpg`，960w q70 39KB）：消掉 i.ytimg 远程缩略图 24KiB（缓存审计 5 分钟 TTL 项）与 i.ytimg preconnect；播放器连接改由 facade hover 按需预热
- hero preload 路径改 `heroHeaderAvif()` 派生 + `HERO_SIZES` 导出单一事实源，顺带修 check:swap 品牌残留（硬编码 `hero-anomaly-*` 路径）；facade 升级为 template 回流版（poster prop + warm preconnect）

### P2: 首屏 JS 减重（commit 139b23d）

**问题**: 未使用的 JavaScript 130KiB + TBT 150ms + 4 个长主线程任务，主因是 @base-ui 的两个 eager 消费方把共享 chunk 拖进首屏。

**措施**:
- MobileNav 重写为零依赖抽屉（createPortal + 自管 Esc/焦点循环/滚动锁定），模板回流同款；测试从 base-ui pointer 事件序列改为直接 click
- LanguageSwitcherSlot（dynamic ssr:false）：单语站永不下载语言切换器的 @base-ui 依赖链 —— 渲染层条件挡不住静态 import 的 eager chunk
- browserslist 现代目标（chrome/edge/firefox >= 104, safari >= 15.4）：消掉旧版 JavaScript 审计项（报告估 24KiB）

### P3: 门禁修复 + 本地测量对齐（commit 08470c2）

**问题**: 此前 8f64c17 / 9aae17e 提交后 check:swap 已红（未跑 validate 未察觉），品牌残留 6 处。

**措施**:
- `featuredGuideSlugs` 从 popular-guides 组件移入 data/homepage.ts（内容层），连同 preload 派生化与 trailer 注释中性化，清零 core 目录品牌残留
- serve-out.mjs 增加 br/gzip 内容协商：本地 Lighthouse 的传输字节与生产 CDN 压缩对齐，避免本地量测偏悲观

## 构建验证

本地 Lighthouse 12.8.2 mobile 97 分：
- FCP 0.8s / LCP 2.6s / TBT 50ms / CLS 0 / SI 1.0s
- 未用 JS 72KiB（GA gtag 第三方固有）/ 旧版 JS 12KiB（框架固有）
- eager JS 12 chunks 共 574KB raw / 154KB brotli
- @base-ui chunk 已退出 eager 集合

## 生产复核

PSI mobile 91 分（2026-09-15 13:58 创建报告，模拟 Moto G Power，Lighthouse 13.4.1）：
- FCP 2.0s / LCP 2.9s / TBT 70ms / CLS 0 / SI 4.2s
- 渲染阻塞请求：160ms 节省 → 通过
- 未用 JS：130 → 71KiB（-45%）
- 缓存：27 → 4KiB（-85%）
- 长任务：4 → 3

## 剩余空间评估

剩余诊断项均为第三方固有或框架固有成本：
- 未用 JS 71KiB：全部 GA gtag 第三方（`js?id=G-XG2ZVXQVQH` 169KB，未用 72KB），无优化空间
- 旧版 JS 24KiB：Turbopack 对 browserslist 只部分生效（框架 chunk 1778a72f30fa7f9c.js 11.8KB），可接受
- 改进图片传送 33KiB：CF beacon 等小图，非关键路径

无低垂果实。继续优化需改框架层（Turbopack browserslist 完整支持）或第三方策略（GA 延迟加载/SPA 事件），收益递减。

## 运营跟进

- GSC 索引监控：`GSC_SITE=sc-domain:anomalydetected.fun node gsc-inspect.mjs`
- CrUX 字段数据填充 ~28 天后（真实用户 CWV）
- CF Web Analytics 在此期间提供真实用户数据
- 首次周报：`bash scripts/seo-weekly-report.sh` 上线 7 天后

## 教训回流

**check:swap 红门禁未及时发现**：8f64c17 / 9aae17e 提交后 check:swap 已红（preload 路径硬编码品牌词 + popular-guides 内容词），但 commit message 只提测试通过，未跑 validate。模板 SKILL.md 需强化纪律：每次 commit 前必跑 validate，不仅测测试。

**性能回流的同步时机**：wardogs 站 2026-09-15 凌晨完成的 5 项性能回流，anomaly 站今天才同步（anomaly 建于回流之前，独立做过 YouTube facade 和 hero preload 修复但字体/browserslist 未同步）。模板回流的传播依赖新站创建时间，老站需主动巡检。
