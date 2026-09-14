# ANOMAL Guide 换皮规格书 (Reskin Spec)

> **站点**: anomalydetected.fun | **游戏**: ANOMAL (Steam App ID: 4899900) | **开发商**: Alexis Roumier  
> **主题**: 磷光绿 CRT 终端美学 (Retro-futuristic 1980s terminal)  
> **状态**: 游戏尚未发布 (TBA)

---

## 1. 站点身份 (Site Identity)

| 字段 | 值 |
|------|-----|
| siteId | `anomalydetected` |
| url | `https://anomalydetected.fun` |
| siteName | `ANOMAL Guide` |
| defaultLocale | `en` |
| schemaType | `VideoGame` |
| brandTokens | `["anomalydetected", "anomal", "alexis roumier", "anomalydetectedguide"]` |
| theme | primary: `#39ff14` (磷光绿), secondary: `#0a0a0a` (深黑), accent: `#ff6600` (故障橙) |

---

## 2. 游戏信息 (Game Info)

| 字段 | 值 |
|------|-----|
| name | ANOMAL |
| developer | Alexis Roumier (法国独立开发者) |
| publisher | Alexis Roumier (自发行) |
| platforms | Windows |
| releaseDate | TBA (尚未发布) |
| languages | English, French |
| features | Single-player, Family Sharing |
| Steam URL | https://store.steampowered.com/app/4899900/ANOMAL/ |

**核心机制**:
- 时间旅行解谜 (Time-travel puzzle)
- 冻结 3D 立体模型观察 (Observe frozen 3D dioramas)
- 线索交叉引用 (Cross-reference clues)
- 时间线重建 (Timeline reconstruction)

**内容**: 4 个时代 (eras), 4 个案件 (cases), 1 个异常 (anomaly)

**视觉风格**: 复古未来主义 CRT 终端美学 (磷光绿、扫描线、故障效果、80s 终端界面)

---

## 3. 页面清单与域映射 (Pages & Domain Mapping)

ANOMAL 是单人解谜游戏，无 economy 和 multiplayer 概念。七个域映射如下：

| 内部 key | URL slug | 游戏概念 | 说明 |
|---------|----------|---------|------|
| codex | `cases` | 4 个案件 | 每个案件是一个独立的死亡谜团 |
| milestones | `timeline` | 时间线 | 重建 4 个时代的事件顺序 |
| regions | `eras` | 4 个时代 | 不同历史时期 (如雪山、丛林、太空等) |
| equipment | `clues` | 线索 | 可收集的线索和道具 |
| achievements | `achievements` | 成就 | 游戏内成就 |
| economy | `mechanics` | 游戏机制 | 裁剪：改为游戏机制说明页 |
| multiplayer | `guide` | 攻略指南 | 裁剪：改为通用攻略指南页 |

**必建页面**:
```
/                          首页
/guides                    攻略 Hub
/guides/beginner-guide     新手攻略 (游戏机制、操作、UI 说明)
/cases                     案件 Hub (codex 域)
/cases/[slug]              案件详情 (4 个案件)
/timeline                  时间线 (milestones 域)
/eras                      时代 Hub (regions 域)
/eras/[slug]               时代详情 (4 个时代)
/clues                     线索 Hub (equipment 域)
/clues/[slug]              线索详情
/achievements              成就
/mechanics                 游戏机制 (economy 域裁剪)
/guide                     攻略指南 (multiplayer 域裁剪)
/faq                       常见问题
/game                      游戏概览
/about /contact /privacy   站点信息
```

---

## 4. 导航树 (Navigation)

### NAV_HUBS (面包屑中间层)

```typescript
{
  cases: { labelKey: 'Nav.cases', href: '/cases' },
  timeline: { labelKey: 'Nav.timeline', href: '/timeline' },
  eras: { labelKey: 'Nav.eras', href: '/eras' },
  clues: { labelKey: 'Nav.clues', href: '/clues' },
  achievements: { labelKey: 'Nav.achievements', href: '/achievements' },
  mechanics: { labelKey: 'Nav.mechanics', href: '/mechanics' },
  guide: { labelKey: 'Nav.guide', href: '/guide' },
}
```

### NAV_SECTIONS (导航分组)

```typescript
[
  {
    titleKey: 'Nav.explore',
    items: [
      { labelKey: 'Nav.cases', href: '/cases', surfaces: ['header', 'footer', 'sidebar'] },
      { labelKey: 'Nav.eras', href: '/eras', surfaces: ['header', 'footer', 'sidebar'] },
      { labelKey: 'Nav.clues', href: '/clues', surfaces: ['header', 'footer', 'sidebar'] },
      { labelKey: 'Nav.timeline', href: '/timeline', surfaces: ['header', 'footer', 'sidebar'] },
    ],
  },
  {
    titleKey: 'Nav.guides',
    items: [
      { labelKey: 'Nav.beginnerGuide', href: '/guides/beginner-guide', surfaces: ['header', 'footer', 'sidebar'] },
      { labelKey: 'Nav.mechanics', href: '/mechanics', surfaces: ['footer', 'sidebar'] },
      { labelKey: 'Nav.guide', href: '/guide', surfaces: ['footer', 'sidebar'] },
    ],
  },
  {
    titleKey: 'Nav.community',
    items: [
      { labelKey: 'Nav.achievements', href: '/achievements', surfaces: ['footer'] },
      { labelKey: 'Nav.faq', href: '/faq', surfaces: ['footer'] },
    ],
  },
]
```

---

## 5. 数据形状 (Data Shape)

### Cases (codex 域)

```typescript
type CaseData = {
  slug: string
  name: string
  era: string // 关联的 era slug
  description: string
  objectives: string[] // 调查目标
  clues: string[] // 关联的 clue slugs
  solution: string // 剧透警告：解决方案
}
```

### Eras (regions 域)

```typescript
type EraData = {
  slug: string
  name: string
  timePeriod: string // 如 "1980s Snowy Mountains"
  description: string
  cases: string[] // 关联的 case slugs
  environment: string // 环境描述
}
```

### Clues (equipment 域)

```typescript
type ClueData = {
  slug: string
  name: string
  type: string // "physical" | "temporal" | "supernatural"
  description: string
  foundIn: string // era slug
  relatedCases: string[] // case slugs
}
```

### Timeline (milestones 域)

```typescript
type TimelineEvent = {
  order: number
  era: string // era slug
  event: string
  description: string
  relatedCase: string // case slug
}
```

---

## 6. Messages 命名空间 (i18n)

```json
{
  "Nav": { /* 导航标签 */ },
  "Footer": { "links": { /* 底部链接 */ } },
  "Sidebar": { "links": { /* 侧边栏链接 */ } },
  "Home": {
    "intro": "≥600 词首页介绍",
    "explore": "≥600 词探索内容",
    "metaDescription": "唯一元描述"
  },
  "Cases": { /* 案件域文案 */ },
  "Eras": { /* 时代域文案 */ },
  "Clues": { /* 线索域文案 */ },
  "Timeline": { /* 时间线文案 */ },
  "Achievements": { /* 成就文案 */ },
  "Mechanics": { /* 游戏机制文案 */ },
  "Guide": { /* 攻略指南文案 */ },
  "Breadcrumbs": { /* 面包屑文案 */ }
}
```

---

## 7. Agent 文件所有权表 (Agent Ownership)

5 个 agent 分工，文件所有权互斥：

| Agent | 负责域 | 文件清单 |
|-------|--------|---------|
| **A (units)** | cases, eras | `data/codex/*.ts`, `data/regions/*.ts`, `data/types.ts` (部分) |
| **B (topic)** | clues, timeline, achievements, mechanics, guide | `data/equipment/*.ts`, `data/milestones/*.ts`, `data/achievements/*.ts`, topic 域数据 |
| **C (content)** | guides, faq, homepage, dates, llms | `data/homepage.ts`, `data/content-dates.ts`, `data/content-registry.ts`, `data/guides/*.ts`, `public/llms.txt` |
| **D (nav+i18n)** | navigation, messages | `config/navigation.config.ts`, `messages/en.json` (全部 namespace) |
| **E (cleanup)** | 裁剪旧域 | 删除 `data/` 下旧游戏域文件，更新 import |

**纪律**:
- 每个 agent 只改所有权清单内文件
- 禁止跑全量测试 (中间态必红)
- 以模板仓库为只读参照
- 跨文件契约靠本 spec 对齐

---

## 8. 跨文件契约 (Cross-File Contracts)

### 消息 key 契约

- `Nav.cases`, `Nav.eras`, `Nav.clues`, `Nav.timeline`, `Nav.achievements`, `Nav.mechanics`, `Nav.guide` 必须在 `messages/en.json` 存在
- `Footer.links.*` 和 `Sidebar.links.*` 同步

### 导出名契约

- `data/codex/index.ts` 导出 `cases` 数组
- `data/regions/index.ts` 导出 `eras` 数组
- `data/equipment/index.ts` 导出 `clues` 数组
- `data/milestones/index.ts` 导出 `timelineEvents` 数组

### 日期契约

- `data/content-dates.ts` 所有日期 ≤ 今天 (2026-09-14)
- 游戏未发布，相关页面日期用占位符或留空

### Featured Entities 契约

- `data/homepage.ts` 的 `featuredEntities` 引用真实存在的 case/era/clue slugs
- `popularQuestions` 引用真实存在的页面路径

---

## 9. 品牌资源清单 (Brand Assets)

| 文件 | 尺寸 | 说明 |
|------|------|------|
| `hero-anomalydetected-header.webp` | 1730×909 | 首页 hero (已创建占位符) |
| `hero-anomalydetected-header-768.webp` | 768×404 | 移动端 hero |
| `og-anomalydetected.jpg` | 1200×630 | OG 封面 |
| `cases-anomalydetected-header.jpg` | 1200×400 | cases 域头图 |
| `favicon.ico` | 16/32/48 | 浏览器 tab (已就位) |
| `favicon-16x16.png` / `favicon-32x32.png` | 16 / 32 | HTML link |
| `apple-touch-icon.png` | 180 | iOS 主屏 |
| `android-chrome-192x192.png` / `android-chrome-512x512.png` | 192 / 512 | PWA manifest |

**实图化**: Phase 10 从 Steam appdetails API 获取官方截图替换纯色占位符。

---

## 10. 竞品分析摘要 (Competitor Insights)

**Anomaly detection 类型游戏市场**:
- **价格带**: $2.99–$8.99 (超低价)
- **游戏时长**: 15–60 分钟 (很短)
- **两个子类型**: Walking loop (Exit 8-style) vs. Camera monitoring (Observation Duty-style)
- **ANOMAL 差异化**: 时间旅行解谜 + 叙事驱动 (非单纯找不同) + 复古 CRT 美学
- **目标受众**: 喜欢叙事解谜、时间旅行、复古美学的玩家

**SEO 机会**:
- "ANOMAL game guide" / "ANOMAL walkthrough" / "ANOMAL puzzle solutions"
- "time travel puzzle games" / "retro terminal aesthetic games"
- "Alexis Roumier ANOMAL" (开发者品牌)

---

## 11. 执行顺序

1. **Phase 1-2**: ✅ 完成 (情报收集 + 站点规划)
2. **Phase 3**: 5-agent 并行换皮 (本 spec 驱动)
3. **Phase 4-5**: SEO 工程化 + 三绿验证
4. **Phase 6-10**: Favicon + AI SEO + 审计 + 品牌图实图化
5. **Phase 11-12**: 部署 + GSC 配置

---

**最后更新**: 2026-09-14  
**维护者**: game-guide-builder skill
