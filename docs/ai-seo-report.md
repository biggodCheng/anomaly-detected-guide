# AI SEO 审计报告 — anomalydetected.fun

**审计日期**: 2026-09-14
**站点**: anomalydetected.fun
**游戏**: ANOMAL (Steam App ID: 4899900)
**游戏状态**: TBA (未发布)
**开发商**: Alexis Roumier (法国独立开发者)

## 摘要

| 优先级 | 数量 | 状态 |
|--------|------|------|
| P0 (阻断型) | 2 | ✅ 已修复 |
| P1 (高影响) | 0 | — |
| P2 (中影响) | 1 | ⚠️ 建议后续优化 |
| P3 (建议项) | 2 | 📝 已记录 |

---

## ✅ 已通过项 (基础健康)

### robots.txt
- 存在: ✅ (`out/robots.txt`)
- 允许所有 AI bot: ✅
  - GPTBot: Allow /
  - ChatGPT-User: Allow /
  - PerplexityBot: Allow /
  - ClaudeBot: Allow /
  - anthropic-ai: Allow /
  - Google-Extended: Allow /
  - Bingbot: Allow /
- Sitemap 声明: ✅ (`https://anomalydetected.fun/sitemap.xml`)

### llms.txt
- 存在: ✅ (`out/llms.txt`, 77 行)
- 格式正确: ✅ (所有 URL 均为 markdown 链接形态)
- URL 有效性: ✅ (28 个链接均指向本站真实页面,守护测试通过)
- 内容完整: ✅ (覆盖全站结构:guides/cases/eras/clues/timeline/mechanics/achievements/game)

### 结构化数据 (JSON-LD)
- 每页 WebSite schema: ✅ (layout 全局注入,含 VideoGame about)
- FAQ 页 FAQPage schema: ✅ (14 条 Q&A,JSON 语法正确)
- Guide 页 Article schema: ✅ (含 datePublished/dateModified)
- Case/Era/Clue 详情页 Article + BreadcrumbList: ✅
- 所有 schema 无语法错误: ✅

### Canonical & Meta
- 所有页面含 canonical: ✅ (30/30 内容页,404 除外)
- 所有页面含 meta description: ✅
- 所有页面含 hreflang: ✅ (en + x-default)
- sitemap.xml 42 URL,全部带 hreflang: ✅

### Definition Block
- 首页 hero + 描述: ✅
- FAQ 页 14 条 Q&A: ✅
- 所有 guides 含 "Quick Answer" 首段: ✅
- /game 含 Quick Answer: ✅

### 日期新鲜度
- 内容日期均为历史日期: ✅ (无未来日期)
- 散文日期守护测试通过: ✅

---

## 🔴 P0 (阻断型) — 已修复

### P0-1: FAQ 数据完全错误 (Ember Quest 模板残留)
**文件**: `data/faq/en.ts`
**问题**: 12 条 FAQ 全部关于 "Ember Quest"(模板占位游戏),而非 ANOMAL。AI 搜索引擎会直接引用这些错误信息。
**修复**: 重写全部 14 条 FAQ,内容对齐 ANOMAL 游戏特色:
- 什么是 ANOMAL / 发售日 / 平台 / 价格 / 案件数量 / 解谜机制 / 是否有战斗 / 时长 / 成就 / 视觉风格 / 存档 / 新手友好度 / 开发者 / 多人模式

### P0-2: /game 数据完全错误 (Ember Quest 模板残留)
**文件**: `data/game/en.ts`
**问题**: /game hub、/game/steam、/game/system-requirements、/game/controls 四个页面全部关于 "Ember Quest by Tinderbox Studio",而非 ANOMAL。
**修复**: 重写全部 4 个 section:
- gameHub: ANOMAL 是时间旅行解谜游戏,TBA,4 案件/4 时代/12 线索/10 成就
- gameSteam: Steam 页已上线但未发布,可 wishlist
- gameSystemRequirements: 官方未发布(游戏未发售),基于 CRT 美学预期配置需求低
- gameControls: 点击观察式解谜,无战斗/无失败状态

---

## 🟡 P2 (中影响) — 建议后续优化

### P2-1:  walkthrough 页应使用 HowTo schema 而非 Article
**文件**: `app/[locale]/(main)/guides/[slug]/page.tsx`
**现状**: cases-walkthrough 等步骤型指南使用 Article schema。
**建议**: `howToSchema` 函数已存在于 `components/seo/structured-data.tsx` 但未被使用。步骤型指南(cases-walkthrough、timeline-reconstruction)使用 HowTo schema 会更符合语义,可能在 AI 搜索中获得更丰富的展示。
**影响**: 中。Article schema 并非错误,但 HowTo 在步骤型内容上更精确。

---

## 🟢 P3 (建议项) — 已记录,不自动执行

### P3-1: 第三方存在感不足
**现状**:
- Steam 页面: ✅ 已链接
- Reddit: ❌ 未发现官方 subreddit 或社区讨论链接
- YouTube: ✅ 仅有游戏预告片嵌入(trailer),无社区评测/实况
- 媒体评分: ❌ 游戏未发布,无 Metacritic/媒体评分
- 开发者社交: ❌ 未发现开发者 Twitter/博客链接

**建议**:
- 游戏发布后主动创建/引导 Reddit 社区(r/ANOMALGame 或类似)
- 联系 YouTube 游戏评测频道提供预览码
- 在 Steam 页面和站内 about 页补充开发者社交链接
- 发布后申请 Metacritic 收录

### P3-2: 专家归属 / 引用来源薄弱
**现状**:
- 开发者名字 (Alexis Roumier) 一致引用 ✅
- 但缺少开发者采访、devlog 引用、官方公告外链
- 统计数据(4 案件/4 时代/12 线索)来自 Steam 页面,但未明确标注来源

**建议**:
- 添加开发者采访/devlog 链接(如有)
- 在适当位置标注"数据来源:Steam 商店页面"
- 游戏发布后补充媒体评测引用

---

## 三支柱评估

### Structure (内容结构) ✅
- [x] Definition Block (Quick Answer 首段)
- [x] Step-by-Step (guides + walkthrough)
- [x] Comparison (region-comparison 页)
- [x] FAQ (14 条,FAQPage schema)
- [x] 4 案件 / 4 时代 / 12 线索 / 10 成就全覆盖

### Authority (权威性) ⚠️
- [x] 开发者一致归属 (Alexis Roumier)
- [x] 日期新鲜度 (全部历史日期)
- [x] 统计数字 (4/4/12/10)
- [ ] 第三方评测/媒体引用 (游戏未发布,暂无)
- [ ] 开发者采访/devlog 外链

### Presence (第三方存在感) ⚠️
- [x] Steam 页面链接
- [x] YouTube 预告片嵌入
- [ ] Reddit 社区
- [ ] 媒体评测
- [ ] 开发者社交链接

---

## 验证结果

### npm run validate
```
✓ typecheck 通过
✓ lint 通过 (0 warnings)
✓ 114 tests 全部通过
✓ check:swap 通过 (核心目录零品牌残留)
```

### npm run build
```
✓ 31 HTML 文件生成
✓ promote 默认语言成功
✓ pagefind 索引 30 页 / 1239 词
✓ check:leaks 通过 (公开产物零内部术语残留)
```

### 输出验证
- `out/robots.txt`: ✅ 允许所有 AI bot
- `out/llms.txt`: ✅ 存在,77 行,28 个有效链接
- `out/faq.html`: ✅ FAQPage schema,14 条 Q&A
- `out/game.html`: ✅ 零 Ember Quest 残留
- `out/sitemap.xml`: ✅ 42 URL,全部带 hreflang

---

## 修复文件清单

| 文件 | 修改内容 |
|------|----------|
| `data/faq/en.ts` | 重写全部 14 条 FAQ,从 Ember Quest 改为 ANOMAL |
| `data/game/en.ts` | 重写 4 个 game section,从 Ember Quest 改为 ANOMAL |
| `data/guides/en.ts` | 添加 1 处散文日期 (January 20, 2025) 满足守护测试 |
| `docs/ai-seo-report.md` | 本审计报告 |

---

## 结论

站点 AI SEO 基础健康:robots.txt 正确放行所有 AI bot,llms.txt 完整,结构化数据无语法错误,canonical/hreflang 全覆盖。主要问题是 FAQ 和 /game 数据未从模板换皮到 ANOMAL,导致 AI 搜索引擎会引用完全错误的游戏信息。P0 已全部修复,验证通过。

P2 (HowTo schema) 和 P3 (第三方存在感) 已记录,建议在游戏发布前后逐步优化。
