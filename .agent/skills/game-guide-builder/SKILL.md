---
name: game-guide-builder
description: |
  从单个关键词A出发，自动完成：关键词竞争度深挖 → 游戏信息全网搜集 → SEO落地页规划 →
  使用 game-guide-template 框架换皮建站 → 三绿验证 → favicon 按游戏意象生成 →
  AI 搜索优化审计 → 构建产物逐页基线审计 → 全站 SEO 深度审计 + 按优先级自动修复 →
  品牌图实图化（Steam 官方截图替换纯色占位图，og/hero/域头图 + avif 重生成）→
  Cloudflare Pages 部署（GitHub 私有仓库 Git 集成 + 自定义域名）→
  GSC 收录配置（sc-domain 资源 + DNS TXT 验证 + sitemap 提交 + 收录基线）→
  运营周报（GSC+GA4 一键拉数脚本 + 洞察复盘 skill）。
  串联 16 个技能形成完整流水线（seo-auditor 于 Phase 5 门禁与 Phase 8 深审两阶段复用）。
  触发：用户提供一个游戏关键词，说"建站"、"做攻略站"、"game guide"、"帮我建一个XX游戏站"。
version: 2.3
---

# Game Guide Builder — 关键词→游戏攻略站 全链路智能体

> **输入**：一个关键词 A（游戏名或游戏相关关键词）
> **输出**：一个完整的、通过三绿验证 + AI 搜索优化 + 逐页基线审计 + SEO 深度审计 + 品牌图实图化的游戏攻略站

---

## 技能串联图

```
                    ┌─────────────────────────────────────────────┐
                    │          Phase 1: 情报收集                    │
                    │                                             │
  关键词A ───────→  │  ① site-keyword-research   关键词树深挖      │
                    │  ② keyword-competition-analysis Top词竞争度  │
                    │  ③ youtube-game-scout        YouTube游戏情报  │
                    │  ④ youtube-intel            类目Discovery扫描   │
                    │  ⑤ data-scraper-intent       搜索意图分类     │
                    └──────────────────┬──────────────────────────┘
                                       ↓
                    ┌─────────────────────────────────────────────┐
                    │          Phase 2: 站点规划                    │
                    │                                             │
                    │  ⑥ site-architecture          页面层级规划   │
                    │  ⑦ google-trends-to-pages     关键词→页面映射 │
                    │  ⑧ content-strategy             内容支柱设计  │
                    └──────────────────┬──────────────────────────┘
                                       ↓
                    ┌─────────────────────────────────────────────┐
                    │          Phase 3: 建站（换皮SOP）             │
                    │                                             │
                    │  🔴 强制遵循 docs/换皮SOP.md 替换开发规则     │
                    │                                             │
                    │  Step 0: git init + package.json             │
                    │  Step 1: config/ 配置层                      │
                    │  Step 2: navigation.config.ts 导航树         │
                    │  Step 3: data/ + messages/ 内容层            │
                    │  Step 4: public/ 品牌资源                    │
                    │  ⑨ ui-ux-pro-max（无官方色时用）品牌色生成   │
                    └──────────────────┬──────────────────────────┘
                                       ↓
                    ┌─────────────────────────────────────────────┐
                    │          Phase 4: SEO 工程化                  │
                    │                                             │
                    │  ⑩ nextjs-seo-foundations    元数据标准       │
                    │  ⑪ nextjs-seo-booster        Schema/Sitemap  │
                    └──────────────────┬──────────────────────────┘
                                       ↓
                    ┌─────────────────────────────────────────────┐
                    │          Phase 5: 三绿验证                    │
                    │                                             │
                    │  ⑫ seo-auditor               SEO 审计        │
                    │  ⑬ internal-leak-scan         泄漏扫描        │
                    │  npm run validate            三绿门禁         │
                    │  npm run build               静态导出         │
                    └──────────────────────────┬──────────────────┘
                                       ↓
                    ┌─────────────────────────────────────────────┐
                    │          Phase 6: Favicon 生成与替换          │
                    │                                             │
                    │  ⑭ favicon-icon-generator    图标设计方法论   │
                    │  源图按游戏意象设计(硬要求) + 小尺寸目检       │
                    │  node scripts/generate-favicons.mjs 全套      │
                    │  site.test favicon 守护                       │
                    └──────────────────────────┬──────────────────┘
                                       ↓
                    ┌─────────────────────────────────────────────┐
                    │     Phase 7: AI 搜索优化 + 自动修复           │
                    │                                             │
                    │  ⑮ ai-seo                    AI 可见性审计    │
                    │                                             │
                    │  Step 1: 运行 ai-seo 审计 → 产出报告         │
                    │  Step 2: 按优先级自动处理修复任务             │
                    │    P0 阻断型  → 立即修复 + 重验证             │
                    │    P1 高影响  → 逐项修复 + 验证               │
                    │    P2 中影响  → 批量修复                      │
                    │    P3 建议项  → 记录到交付文档，用户决定       │
                    │  Step 3: 重跑三绿门禁确认无回归               │
                    │                                             │
                    │  技能路径：.claude/skills/marketingskills-main/ │
                    │            skills/ai-seo/                     │
                    └──────────────────────────┬──────────────────┘
                                       ↓
                    ┌─────────────────────────────────────────────┐
                    │     Phase 8: 构建产物逐页基线审计 + 自动修复   │
                    │                                             │
                    │  ⑯ seo-auditor (7deer)        逐页基线审计    │
                    │                                             │
                    │  Step 1: audit_rules.js 扫描 out/ 全部 HTML   │
                    │          → PASS/FAIL + A-F 评分              │
                    │  Step 2: checklist 模板逐项核查               │
                    │          → docs/audits/<PAGE>_AUDIT.md        │
                    │  Step 3: P0→P1 修复排序（只审产物不 grep 源码）│
                    │    P0 四大件 Title/Desc/Canonical/H1         │
                    │         → 立即修复 + 重跑脚本验证             │
                    │    P1 Schema/内链/HTML 大小 → 逐项修复        │
                    │    FAIL > 10 → 熔断只修 P0 重跑一轮           │
                    │  修复后重跑三绿门禁确认无回归                  │
                    │                                             │
                    │  技能路径：.claude/skills/7deer_skills-main/   │
                    │            seo-auditor/                       │
                    └──────────────────────────┬──────────────────┘
                                       ↓
                    ┌─────────────────────────────────────────────┐
                    │     Phase 9: 全站 SEO 深度审计 + 自动修复     │
                    │                                             │
                    │  ⑰ seo-audit                 SEO 深度审计     │
                    │                                             │
                    │  7 步工作流：可收录性 → 技术基础 → On-Page    │
                    │              → 内容质量 → 权威 → 报告        │
                    │  报告优先级 → P0-P3 映射 → 自动处理           │
                    │    Critical fixes → P0 立即修复               │
                    │    High-impact    → P1 逐项修复              │
                    │    Quick wins     → P2 批量修复              │
                    │    Long-term      → P3 记录留用户             │
                    │  修复后重跑三绿门禁确认无回归                  │
                    │                                             │
                    │  技能路径：.claude/skills/marketingskills-main/ │
                    │            skills/seo-audit/                  │
                    └──────────────────┬──────────────────────────┘
                                       ↓
                    ┌─────────────────────────────────────────────┐
                    │     Phase 10: 品牌图实图化                    │
                    │                                             │
                    │  Steam appdetails API 官方 1920×1080 截图    │
                    │  sharp 联络表编号 + 视觉模型初选              │
                    │  🔴 1200×630 候选对比定稿（缩略图判据）        │
                    │  sharp 裁切 og/hero/域头图（文件名不变）      │
                    │  npm run hero:avif 重生成 + site.test 守护   │
                    └──────────────────┬──────────────────────────┘
                                       ↓
                    ┌─────────────────────────────────────────────┐
                    │          Phase 11: 部署                       │
                    │                                             │
                    │  GitHub 私有仓库（仓库名=项目名）              │
                    │  CF Pages Git 集成（API 创建项目）            │
                    │  push master → 自动构建部署                   │
                    │  自定义域名绑定 + HTTPS 验证                  │
                    └──────────────────┬──────────────────────────┘
                                       ↓
                    ┌─────────────────────────────────────────────┐
                    │     Phase 12: GSC 收录配置                    │
                    │                                             │
                    │  Site Verification API 取 DNS TXT           │
                    │  CF API 写 TXT → API 验证（0 人工步）        │
                    │  API 验证 → sc-domain 资源 → 提交 sitemap    │
                    │  收录基线 0/N + 巡检快照                     │
                    └──────────────────┬────────────────────────────┘
                                       ↓
                    ┌─────────────────────────────────────────────┐
                    │     Phase 13: 运营周报（上线后每周）          │
                    │                                             │
                    │  seo-weekly-report.sh 数据管道(GSC+GA4)     │
                    │  seo-report skill 洞察复盘                   │
                    │  (诊断 P0/P1/P2 + 健康度评分 + 下周 OKR)     │
                    └──────────────────────────────────────────────┘
```

---

## 沉淀分工（技能 vs 记忆）

| 内容 | 沉淀位置 | 更新时机 |
|------|---------|---------|
| 坑与解法（可移植 SOP） | 本 SKILL.md 正文 + 失败处理表 | 遇到即写，下站直接受益 |
| 本机凭据 / 账号 / 代理状态 | 项目记忆（memory 目录，不进 git） | 仅凭据、token、机器环境变化时 |

新坑只写技能一侧；记忆文件仅在凭据/账号/环境变化时动。两处出现同一坑时以 SKILL.md 为准（更新更频繁、随仓库走）。

---

## 前置约束

### 🔴 本项目替换开发规则（最高优先级）

本项目的 `docs/换皮SOP.md` 定义了从模板建站的**唯一正确流程**。当任何技能的指令与 SOP 冲突时，**SOP 优先**。

核心规则摘要（详见 `docs/换皮SOP.md` 全文）：

1. **框架层不动**：`app/`、`components/`、`lib/`、`i18n/` 是框架层，换皮只改配置层 + 内容层
2. **配置层必改**：`config/site.config.json`、`config/site.config.ts`、`config/navigation.config.ts`、`app/globals.css`、`app/not-found.tsx`
3. **内容层必改**：`data/` 全部域数据、`messages/en.json`、`data/content-registry.ts`、`data/homepage.ts`、`data/content-dates.ts`
4. **品牌资源必改**：`public/images/` 下 hero/OG/favicon 全部替换
5. **颜色必须同步**：`site.config.json` 的 `theme` 三主色 ↔ `globals.css` 的 `:root` 必须完全一致（site.test 校验）
6. **文件名携带 siteId**：hero 图 `/images/hero-<siteId>-header.webp`（immutable 缓存依赖文件名失效）
7. **三绿门禁**：`npm run validate`（含 typecheck + lint + test:run + check:swap）+ `npm run build` 全部通过
8. **Home.intro + Home.explore ≥ 600 词**（messages.test 守护）
9. **metaDescription 全站唯一**（messages.test 守护）
10. **favicon.ico 只放 public/**：`app/favicon.ico` 必须不存在（site.test 守护）
11. **裸 `npm run test` 是 watch 模式**：门禁必须用 `npm run test:run`
12. **Windows 小写盘符**：vitest 需要大写盘符路径（`C:\project\...` 而非 `c:\project\...`）

### 🔴 审计守护项（来自 docs/模板审计报告.md）

以下问题已被审计确认并修复，换皮时**不得引入**：

- 日期必须 ≤ 今天（content-dates.test 守护）
- title 去双品牌前缀、拼接后 ≤ 70 字符
- og:type 内容页用 'article'、hub 页用 'website'
- region 显示走数据层真实名（不用 replace 合成）
- 散文明文日期也受守护（"Month D, YYYY" ≤ 今天）
- CSP header 已配置（vercel.json + serve-out）
- Inter 字体自托管（零 Google Fonts 依赖）

---

## Phase 1：情报收集

### 1.1 关键词树深挖（site-keyword-research）

**输入**：关键词 A
**动作**：
1. 用 `site-keyword-research` 技能对关键词 A 执行递归关键词树扩展
2. 从 Google 搜索提取 Related Searches + PASF + PAA
3. 持续分叉直到词库收敛（目标 80-100 个唯一词）
4. 分层筛选：核心词 / 中尾词 / 长尾词 / 问题词
5. Top 10 词 SERP 详细分析 → Top 3 定方向

**输出**：
- 完整候选词库（含来源标签 [PASF]/[RS]/[Q]/[AI]）
- 关键词分层矩阵（20 词）
- 10 词 SERP 竞争度报告
- Top 3 关键词定方向 + 操作建议

**验证**：词库 ≥ 50 词，每词标注来源+深度

### 1.2 竞争度分析（keyword-competition-analysis）

**输入**：Phase 1.1 的 Top 3 定方向关键词
**动作**：对每个关键词用 `keyword-competition-analysis` 技能：
1. 浏览器打开 Google SERP
2. 6 维度评分：广告密度 / 前10域名DA / 内容深度 / 精选摘要 / 视频结果 / 域名年龄
3. 总分 6-15：低竞争(6-8) / 中竞争(9-11) / 高竞争(12-15)
4. 提取 People Also Search For 长尾词

**输出**：每个关键词的竞争度报告（4 节结构）

**决策**：
- 低竞争词 → 立即建站覆盖
- 中竞争词 → 差异化切入
- 高竞争词 → 长尾迂回

### 1.3 YouTube 游戏情报（youtube-game-scout / youtube-intel）

**输入**：关键词 A（游戏名）
**动作**：
1. 用 `youtube-game-scout` 搜索 YouTube 获取游戏视频数据
2. 用 `youtube-intel` 的 Discovery 模式扫描游戏类目
3. 提取：游戏类型 / 玩法机制 / 热门话题 / 竞品分析
4. 收集：YouTube 视频描述中的 Related Keywords（创作者的 SEO 目标词）

**输出**：
- 游戏基础信息（类型/开发商/平台/热度）
- 玩家关注的高频话题
- 竞品站点分析
- YouTube 创作者使用的关键词列表

### 1.4 搜索意图分类（data-scraper-intent）

**输入**：Phase 1.1 的全部关键词
**动作**：用 `data-scraper-intent` 的 LLM 分类能力：
1. 将每个关键词分类为：Transactional / Informational / Commercial / Navigational
2. confidence < 0.6 的标记需人工复核

**输出**：每个关键词的意图标签 + 置信度

**路由规则**：
- Transactional → `/codes`、`/calculator` 等工具页
- Informational → `/guides/` 攻略页
- Commercial → `/tier-list`、对比页
- Navigational → `/wiki`、`/game` 等聚合页

---

## Phase 2：站点规划

### 2.1 页面层级规划（site-architecture）

**输入**：Phase 1 的全部情报
**动作**：用 `site-architecture` 技能设计站点结构：

**必建页面**（game-guide-template 标准结构；**七个内容域的 URL 段全部在 Step 1.1 `domains` 配置里按游戏概念定**，括号内为模板默认 slug）：
```
/                          首页
/guides                    攻略 Hub
/guides/beginner-guide     新手攻略
/<codex-slug>              实体图鉴域 codex（默认 monsters；如 upgrades/cards）
/<milestones-slug>         进度节点域 milestones（默认 bosses；如 endings）
/<regions-slug>            区域/地图域 regions（默认 regions；如 zones/worlds）
/<equipment-slug>          装备/道具域 equipment（默认 equipment；如 items/gear）
/<achievements-slug>       成就域 achievements（默认 achievements）
/<economy-slug>            经济域 economy（默认 economy；如 gold/market）
/<multiplayer-slug>        多人域 multiplayer（默认 multiplayer；如 co-op）
/faq                       常见问题
/game                      游戏概览
/about /contact /privacy   站点信息
```

**按游戏类型调整的域映射**（七个域 key 是代码层中性名，slug 与 i18n 标签按游戏概念换；`-` = 游戏没有该概念，按换皮SOP"裁剪清单"裁掉该域）：

| 游戏类型 | codex 域（图鉴/实体） | regions 域 | milestones 域（进度节点） | equipment 域 | achievements 域 | economy 域 | multiplayer 域 |
|---------|------------|-----------|----------|-------------|-------------|-----------|---------------|
| RPG | 怪物/敌人 | 区域/地图 | Boss | 武器/防具 | 成就 | 金币/交易 | 联机/组队 |
| 射击游戏 | 角色/皮肤 | 地图 | - | 武器/配件 | 成就 | - | 模式/排位 |
| 卡牌游戏 | 卡牌组 | 赛季/模式 | 挑战关卡 | 卡组构筑 | 成就 | 市场/货币 | 好友对战 |
| 模拟经营 | 员工/资源 | 建筑/区域 | 里程碑 | 升级/科技 | 成就 | 经济循环 | - |
| 生存游戏 | 生物/威胁 | 生态群系 | 事件Boss | 工具/配方 | 成就 | 资源价值 | 服务器 |
| Roblox | 宠物/角色 | 世界/区域 | Boss | 代码/物品 | 徽章 | 交易系统 | 服务器/联机 |
| 跳跃/休闲（scarlet-skips 案例） | upgrades（升级卡） | zones | endings（结局） | ropes | - | - | - |

> **游戏没有 boss/monster 怎么办**：七个域 key 只是内部命名，不代表语义。scarlet-skips（Scarlet Skips 无 boss 无 monster）配 `domains.codex.slug="upgrades"` + `domains.milestones.slug="endings"`，i18n 标签值写 "Upgrades"/"Endings"——页面形状复用（列表+筛选表+详情），语义完全跟随游戏。其余五域同理：slug 定 URL，数据定内容。

**输出**：
- ASCII 页面层级树
- Mermaid 可视化站点地图
- URL 结构表
- 导航规范（header/footer/sidebar）

### 2.2 关键词→页面映射（google-trends-to-pages）

**输入**：Phase 1 的关键词 + 意图分类
**动作**：用 `google-trends-to-pages` 技能：
1. 过滤 volume < 5 的关键词
2. 按意图选择页面结构：
   - Transactional → 代码页 / 计算器页
   - Informational → 指南页
   - Commercial → 对比页 / Tier List
   - Navigational → 聚合页
3. 生成每个页面的 H2 骨架
4. 注入对应 Schema（FAQPage / HowTo / ItemList）

**输出**：每个目标页面的结构定义（H1/H2/Schema/字数/关键词）

### 2.3 内容支柱设计（content-strategy）

**输入**：Phase 1 + Phase 2.1 + Phase 2.2
**动作**：用 `content-strategy` 技能规划内容支柱：
1. 确定 3-5 个内容支柱（如：新手入门、怪物图鉴、Boss 攻略、装备推荐、区域探索）
2. 每个支柱下的子话题集群
3. 按买家阶段排优先级：Awareness → Consideration → Decision
4. 内链策略：hub-and-spoke 模型

**输出**：内容支柱清单 + 话题集群 + 优先级排序

---

## Phase 3：建站（换皮 SOP 强制执行）

> 🔴 **本阶段必须严格遵循 `docs/换皮SOP.md` 的步骤顺序和规则。**
> 🔴 **不得跳过任何 Step，不得合并步骤。**

### Step 0：项目初始化（🔴 模板目录只读，绝不就地换皮）

**红线**：game-guide-template 是**只读母版**。新站必须 clone 到独立新目录（一站一目录，如 `gamesweb/<站名>/`——mimicparty、scarlet-skips-guide 均此模式）再动手；在模板目录就地换皮会消费掉母版，且 Phase 11 的 origin 会指走模板 remote（dumbways 2026-09 踩过，模板被迫事后重建）。

**开工前置检查**（clone 前在当前目录跑；不过 = 停，先换目录）：

```bash
pwd    # 不在 game-guide-template 模板目录内
```

**clone 后检查**（确认拿到的是中性模板，不是某个已上线的站）：

```bash
git clone <模板路径> <新站目录>
cd <新站目录>
head -3 config/site.config.json   # 应为模板占位品牌 Ember Quest（siteId "emberquest" / url emberquest.guide.example）——出现其他真实游戏名/已上线域名 = clone 错了源，STOP
rm -rf .git && git init           # 脱钩模板 git 历史，新站全新仓库（此刻起应无 origin）
cp -r <模板路径>/.claude .        # 🔴 必拷：.claude 被 .gitignore 忽略，clone 不带过来；Phase 7/8/9/12 的 audit_rules.js / ai-seo / seo-audit / gsc_config 全在这个目录
```

**修改**：
- `package.json` 的 `name` → `<game-slug>-guide`
- `package-lock.json` 的两处 `name` 同步

### Step 1：配置层

#### 1.1 `config/site.config.json`

```json
{
  "siteId": "<≤12字符短slug>",
  "url": "https://<域名>",
  "defaultLocale": "en",
  "siteName": { "en": "<游戏名> Guide" },
  "ogImage": {
    "path": "/images/og-<siteId>.jpg",
    "width": 1200, "height": 630,
    "alt": "<游戏名> Guide - fan-made game guide"
  },
  "heroImage": "/images/hero-<siteId>-header.webp",
  "codexHeader": "/images/<codex-slug>-<siteId>-header.jpg",
  "domains": {
    "codex": { "slug": "<实体域 URL 段，如 monsters/upgrades/cards>" },
    "milestones": { "slug": "<进度域 URL 段，如 bosses/endings>" },
    "regions": { "slug": "<区域域，如 regions/zones/worlds>" },
    "equipment": { "slug": "<装备域，如 equipment/items/gear>" },
    "achievements": { "slug": "<成就域，通常 achievements>" },
    "economy": { "slug": "<经济域，如 economy/gold/market>" },
    "multiplayer": { "slug": "<多人域，如 multiplayer/co-op>" }
  },
  "brandTokens": ["<siteId>", "<游戏名小写>", "<开发商小写>", "<siteId>guide"],
  "theme": { "primary": "#xxx", "secondary": "#xxx", "accent": "#xxx" },
  "gaId": ""
}
```

**域 slug 决策**（URL 段与代码解耦的唯一来源，坏值全站遭殃）：
- 按 Phase 2 的域映射定：游戏有怪/Boss → 默认 `monsters`/`bosses`；没有就用真实概念（scarlet-skips 用 `upgrades`/`endings`）
- **七键必须全写**（保持默认值也要显式存在——`SiteConfig.domains` 类型守护，漏键 typecheck 红）
- slug 限 `^[a-z0-9-]+$` 且七域两两不同（site.test.ts 守护）
- URL 段定了之后，i18n 标签值（`Nav.codex` 等）同步用该概念的人话名称
- 改 slug 不用动代码——七个域共用 `app/[locale]/(main)/[domain]/` 动态路由，路由/导航/sitemap/llms.txt 全部读 `lib/domain-slugs.ts` 派生

**品牌色决策**：
- 如果游戏有官方品牌色 → 用官方色
- 否则 → 用 `ui-ux-pro-max` 技能生成适合游戏类型的配色
- 3 个 hex 必须是 6 位小写

#### 1.2 `config/site.config.ts`

- `links` → 游戏的官方链接/wiki/Steam
- `game` → 游戏名/开发商/平台/官方URL/发售日
- `schemaType` → `VideoGame`（游戏站固定）
- `releaseDate` → 真实发售日（ISO 格式，必须 ≤ 今天）

#### 1.3 `app/globals.css`

- `:root` 的 `--primary`/`--secondary`/`--accent`/`--ring` → 与 site.config.json theme **完全一致**
- `.dark` → 暗色适配色

#### 1.4 `app/not-found.tsx`

- `POPULAR` 六链接 → 新站最核心的六个页面
- `:root` 内联 `--primary` → 新主题色

#### 1.5 验证

```bash
npm run test:run   # site.test.ts 校验配置自洽
```

### Step 2：导航树

编辑 `config/navigation.config.ts`：

**核心纪律**：
- `NAV_SECTIONS` → 按新游戏的内容域定义
- `NAV_HUBS` → 面包屑中间层映射
- 每个 `labelKey` 按条目实际 `surfaces` 在对应 namespace 存在（header→`Nav.`、footer→`Footer.links.`、sidebar→`Sidebar.links.`；配 `labelKeyBySurface` 时按覆盖后的 key 校验，与 `navigation.config.test.ts` 口径一致）
- `href` 无尾斜杠
- `footerColumn` 正确分配

**同步修改 `messages/en.json`**：
- 新增所有导航 labelKey 对应的翻译
- 删除旧游戏的 namespace

**验证**：`navigation.config.test.ts` 双向覆盖校验

### Step 3：内容层

#### 3.1 `data/` 目录

**按 Phase 2 的域映射，替换所有数据文件**：

每个实体域的接口参考 `data/types.ts`：
```typescript
type ContentSection = {
  heading: string
  body?: string
  items?: string[]
  table?: { headers: string[]; rows: string[][] }
  tip?: string
}
```

**数据生成规则**：
- 数据来源：Phase 1 的 YouTube/Trello/Reddit/Wiki 抓取结果
- **不编造数据**：找不到真实数据就留空，不用占位符
- 每个实体必须有 slug/name/description
- 交叉引用必须一致（codex 实体↔区域↔milestones 互引）

**数据域目录与字段是中性名**（与 URL slug 解耦，语义靠数据内容）：

| 内部名 | 数据目录 | 字段中性名（旧名） | 模板默认示例 |
|-------|---------|------------------|-------------|
| codex（实体图鉴） | `data/codex/` | `zone`(region)、`effect`(weakness)、`stackable`(weapon) | monsters |
| milestones（进度节点） | `data/milestones/` | `trigger`(summonItem)、`triggerHow`(itemSource) | bosses |
| regions（区域） | `data/regions/` | 结构化实体字段（见 `data/types.ts`，有 `[domain]/[slug]` 详情页） | regions |
| 其余 topic 域 | `data/equipment/` `data/economy/` `data/multiplayer/` `data/achievements/` 等 | `TopicData.sections`（heading/body/items/table/tip） | 同名 |

- 换皮时按域映射填真实语义数据即可（scarlet-skips：codex 填升级卡、milestones 填结局，字段名不变）
- 守护测试文件顶部直接 import 各域数据模块（`@/data/codex` 等），目录名是中性名不用改

**存量站改域 slug（迁移场景）三步**：
1. `config/site.config.json` 改 `domains.*.slug` → 全站 URL 自动跟随
2. `public/_redirects` 加 301（裸路径在前 splat 在后）：
   ```
   /monsters /upgrades 301
   /monsters/* /upgrades/:splat 301
   ```
3. `public/llms.txt` 手改 URL（守护测试会对齐 sitemap）+ GSC 重提 sitemap（PUT 幂等，204 即成功）

**必改文件清单**：
| 文件 | 改什么 |
|------|--------|
| `data/content-registry.ts` | 注册新内容域 |
| `data/homepage.ts` | heroStats/coreTopics/popularQuestions/featuredEntities |
| `data/content-dates.ts` | 所有页面日期（必须 ≤ 今天） |
| `data/internal-links.test.ts` | 同步 import 路径到新域 |

#### 3.2 `messages/en.json`

**全部重写**，保持 namespace 结构：
- `Nav` / `Footer.links` / `Sidebar.links` → 导航文案
- `Home` → 首页文案（**Home.intro + Home.explore ≥ 600 词**）
- `Breadcrumbs` → 面包屑文案
- 各域 namespace → 页面文案
- **metaDescription 全站唯一**

**SEO 文案规则**（来自 `nextjs-seo-foundations`）：
- title: `"{Primary Keyword} - {Month Year} | {Brand}"` 50-60 字符
- description: 120-160 字符，含核心关键词 + CTA 动词
- 禁止 ALL CAPS

#### 3.3 验证

```bash
npm run test:run   # messages.test + internal-links.test + 各域 test
```

### Step 4：品牌资源（hero / OG / 域头图）

> favicon **不在本步**——源图按游戏意象设计 + 专用脚本全套生成，见 Phase 6。
> 纯色占位图只求过三绿契约（尺寸/格式/文件名），真实游戏画面的实图化在 **Phase 10** 统一执行。

```bash
# Hero 大图（用 ffmpeg 纯色占位或从 YouTube 截取）
ffmpeg -y -f lavfi -i color=c=0x<primary>:s=1730x909 -frames:v 1 public/images/hero-<siteId>-header.webp
ffmpeg -y -f lavfi -i color=c=0x<primary>:s=768x404 -frames:v 1 public/images/hero-<siteId>-header-768.webp

# OG 封面
ffmpeg -y -f lavfi -i color=c=0x<primary>:s=1200x630 -frames:v 1 public/images/og-<siteId>.jpg

# 域头图
ffmpeg -y -f lavfi -i color=c=0x<primary>:s=1200x400 -frames:v 1 public/images/<codex-slug>-<siteId>-header.jpg

# Hero AVIF 双档
npm run hero:avif
```

**清理旧图片**：删除所有旧游戏图片文件。

**🔴 首次提交（必做，Phase 11 部署前置）**：

```bash
git add .
git commit -m "feat: initial game guide site setup"
```

> 没有首个 commit，Phase 5/8/9 的 build 与 Phase 11 的 push 都会失败（`ambiguous argument 'HEAD'`）。

---

## Phase 4：SEO 工程化

### 4.1 元数据标准（nextjs-seo-foundations）

**每个页面必须**：
- 唯一 title（50-60 字符，含动态月份年份）
- 唯一 description（120-160 字符）
- Canonical URL（绝对路径 + 尾部斜杠）
- og:type：内容页 `article`，hub 页 `website`
- og:image 存在且 1200×630

### 4.2 Schema 结构化数据（nextjs-seo-booster）

**Hub 页面**（`/<codex-slug>`、`/<milestones-slug>` 等）：
- `VideoGame` + `FAQ` + `Breadcrumb`

**文章页**（`/guides/[slug]`）：
- `Article` + `FAQ` + `Breadcrumb`

**FAQ 页**：
- `FAQPage`（≥ 5 条 Q&A）

**所有页面**：
- `WebSite` JSON-LD（在 layout.tsx）
- `BreadcrumbList` JSON-LD

### 4.3 Sitemap

`app/sitemap.ts` 从 `content-registry.ts` 动态生成，确保：
- 所有页面 URL 收录
- hreflang 正确（当前单语言只需 en + x-default）
- lastmod 取自 git 历史（`git log -1 -- <path>`，首次 commit 后才生效；换皮后需先 commit 再 build）
- priority：首页 1.0，核心页 0.9，辅助页 0.8

### 4.4 图标系统

favicon 全套（源图设计 → `generate-favicons.mjs` 一键派生 → site.test 守护）独立成 **Phase 6**（建站阶段的收尾，后续 Phase 7/8 为审计优化阶段）。

---

## Phase 5：验证（三绿门禁）

### 5.1 SEO 审计（seo-auditor）

用 `seo-auditor` 技能对构建产物跑审计：

```bash
npm run build                          # 先构建
node scripts/check-internal-leaks.mjs  # 内部泄漏扫描
```

**审计清单**：
- [ ] Title 50-60 字符
- [ ] Description 120-160 字符
- [ ] Canonical 存在 + 尾部斜杠
- [ ] H1 恰好 1 个，含主关键词
- [ ] JSON-LD 无语法错误
- [ ] 内链 3-5 个
- [ ] HTML < 150KB
- [ ] 图片有 alt + width/height
- [ ] LCP < 2.5s

### 5.2 泄漏扫描（internal-leak-scan）

用 `internal-leak-scan` 技能检查：
- 旧游戏品牌词残留
- 内部工作流术语泄漏
- 机器翻译残留
- 工程标记（TODO/FIXME/{{ 未渲染 }}）

```bash
npm run check:swap   # 框架层零品牌残留
npm run check:leaks  # 内部术语泄漏扫描
```

### 5.3 三绿门禁

```bash
npm run validate     # = typecheck + lint + test:run + check:swap
npm run build        # 静态导出成功
```

**三条全绿 = 换皮完成。**

### 5.4 本地验收

```bash
npm run preview      # 本地静态服务 out/
```

逐页验收：桌面/移动、404、搜索、暗色模式。

---

## Phase 6：Favicon 生成与替换

> 🔴 **源图必须从当前游戏的特色与独特内容属性出发设计**——这是硬要求，不是建议。
> 禁止拿上一站图标换色复用；`--color` 纯色仅作没有源图时的临时占位，交付前必须补真源图。

### 6.1 源图设计（favicon-icon-generator）

写 `public/images/favicon-source.svg`（512×512 正方形，脚本唯一输入）。图标设计方法论参考 `favicon-icon-generator` 技能，但设计输入必须来自**当前游戏**。

**设计问题清单**（回答后再动手）：
1. 游戏名的字面/隐喻意象是什么？（The Blood of Dawnwalker → "黎明之血" → 深青夜空 + 琥珀半日 + 血红地平线三元素）
2. 核心机制或世界观最浓缩的视觉母题？（日夜循环 / 吸血鬼 / 余烬 / 赛博……）
3. 站点三主色如何映射"底色 / 主体 / 点缀"？

在 SVG 注释里写清设计依据（游戏意象 → 图形的对应关系），方便下次换皮理解。

**小尺寸可读性法则**（浏览器 tab 实际显示 16-32px，32px 是主要战场）：
- 元素 ≤ 3 个，形状大而简，无细线条、无文字
- 线性元素线宽 ≥ 源图 1/13（≈40/512）：14px 高的横条在 32px 渲染下不足 1px，会被抗锯齿吞掉
- 相邻色明度差要够：Dawnwalker 实测——深红 #991b1b 压琥珀 #d97706 / 深青 #155e75，32px 下血线与半日融成一团，"血"意象消失；换 `.dark` 亮变体 #dc2626 才立住
- 生成后必须目检 `favicon-32x32.png`，不满意改源图重跑（脚本幂等覆盖）

### 6.2 一键生成全套 6 件

```bash
node scripts/generate-favicons.mjs public/images/favicon-source.svg
# 完全没有源图时的临时占位（交付前必须补真源图）：
node scripts/generate-favicons.mjs --color "#<primary>"
```

产物契约（全部入 `public/`，文件名固定**不带 siteId**——`/favicon.ico` 等是浏览器/爬虫默认请求约定，与 `/images/*` 的 siteId 缓存失效机制无关）：

| 文件 | 尺寸 | 用途 |
|------|------|------|
| `favicon.ico` | 16/32/48 多尺寸容器 | 浏览器 tab 默认请求（**只放 public/**，site.test 守护） |
| `favicon-16x16.png` / `favicon-32x32.png` | 16 / 32 | HTML `<link>` |
| `apple-touch-icon.png` | 180 | iOS 主屏 |
| `android-chrome-192x192.png` / `android-chrome-512x512.png` | 192 / 512 | PWA manifest |

### 6.3 验证

```bash
npx vitest run config/site.test.ts   # favicon 全套守护：6 文件存在 + PNG 尺寸 + ICO 头
npm run build                        # 重跑让 out/ 同步新图标
```

交付说明里注明图标设计依据（游戏意象 → 图形）。

---

## Phase 7：AI 搜索优化 + 自动修复

> 🔴 **本阶段在 Phase 5 三绿验证 + Phase 6 Favicon 全部通过后执行。**
> 目标：让站点对 AI 搜索引擎（Google AI Overviews / ChatGPT / Perplexity / Claude / Gemini / Copilot）可发现、可提取、可引用。

### 7.1 调用 ai-seo 技能运行审计

**技能路径**：`.claude/skills/marketingskills-main/skills/ai-seo/`

**输入**：
- 已构建完成的游戏攻略站（`out/` 目录可用）
- Phase 1 的关键词列表（Top 20 查询）
- 站点 URL（本地 preview 或部署域名）

**动作**：按 `ai-seo` 技能的完整工作流执行：

1. **AI 可见性审计**（ai-seo STEP 1）
   - 用 Top 20 关键词在 ChatGPT / Perplexity / Google 测试当前 AI 回答
   - 记录：是否被引用 / 被谁引用 / 引用哪个页面
   - 填充 AI Visibility Audit 表格

2. **内容可提取性检查**（ai-seo Step 3）
   - 逐页检查：定义段 / 自包含答案块 / 统计引用 / 对比表 / FAQ / Schema / 专家归属 / 日期新鲜度
   - 输出 Pass/Fail 清单

3. **AI Bot 访问检查**（ai-seo Step 4）
   - 检查 `out/robots.txt`（源是 `app/robots.ts`，构建产物在 out/）是否允许 GPTBot / ChatGPT-User / PerplexityBot / ClaudeBot / Google-Extended
   - 游戏攻略站应**全部允许**（无商业理由阻止 AI 引用）

4. **三支柱评估**（ai-seo Optimization Strategy）
   - Pillar 1 Structure：内容是否按 Definition Block / Step-by-Step / Comparison Table / FAQ Block 组织
   - Pillar 2 Authority：是否有统计引用(+37%)、专家归属(+25%)、日期新鲜度
   - Pillar 3 Presence：第三方存在感（Wikipedia / Reddit / YouTube 覆盖）

5. **机器可读文件检查**
   - `llms.txt` 是否存在于 `public/`
   - `pricing.md`（如果适用）

6. **输出 AI SEO 审计报告**（结构化 Markdown）

### 7.2 优先级分类与自动处理

审计报告产出后，**不停下等用户确认**，按以下优先级自动处理：

#### 优先级定义

| 优先级 | 名称 | 判定标准 | 处理方式 |
|:------:|------|---------|---------|
| **P0** | 阻断型 | AI bot 被 robots.txt 阻止；Schema JSON-LD 语法错误；canonical 缺失导致无法被索引 | **立即修复 + 重跑三绿门禁** |
| **P1** | 高影响 | 核心页面缺 Definition Block；FAQ 页缺 FAQPage Schema；统计数字无来源引用；内容页无 `last updated` 日期 | **逐项修复 + 对应测试验证** |
| **P2** | 中影响 | 缺 `llms.txt`；H2 标题不匹配查询模式；对比内容未用表格；缺内链 | **批量修复**（一次编辑多个文件） |
| **P3** | 建议项 | 第三方存在感不足（Wikipedia/Reddit）；需用户手动操作的运营动作 | **记录到交付文档**，不自动执行 |

#### 自动处理流程

```
审计报告产出
    ↓
按优先级排序所有 findings
    ↓
┌─ P0 ─────────────────────────────────────────┐
│  1. 逐个修复（robots.txt / Schema / canonical）│
│  2. npm run validate                          │
│  3. npm run build                             │
│  4. 全部通过 → 进入 P1                        │
│  5. 失败 → 回滚该修复，记录失败原因            │
└──────────────────┬────────────────────────────┘
                   ↓
┌─ P1 ─────────────────────────────────────────┐
│  1. 按页面逐个修复                             │
│  2. 每修一个页面 → npm run test:run            │
│  3. 全部通过 → 进入 P2                        │
│  4. 失败 → 回滚该页修复，继续下一个            │
└──────────────────┬────────────────────────────┘
                   ↓
┌─ P2 ─────────────────────────────────────────┐
│  1. 批量创建/修改文件（llms.txt / 表格重构等） │
│  2. 全部改完后 → npm run validate + build      │
│  3. 通过 → 进入交付                            │
│  4. 失败 → 逐项回滚排查                        │
└──────────────────┬────────────────────────────┘
                   ↓
┌─ P3 ─────────────────────────────────────────┐
│  记录到交付文档的"后续运营建议"章节            │
│  不自动执行（需要用户决策/第三方平台操作）      │
└──────────────────────────────────────────────┘
```

### 7.3 游戏攻略站的 AI SEO 专项检查

以下是游戏攻略站场景下 ai-seo 技能的重点检查项（与模板框架的结合点）：

| 检查项 | 模板对应位置 | ai-seo 对应规则 |
|-------|------------|----------------|
| robots.txt 允许所有 AI bot | `out/robots.txt`（源 `app/robots.ts`） | ai-seo Step 4: AI Bot Access |
| FAQPage Schema 完整 | `data/` FAQ 数据 → JSON-LD 组件 | ai-seo Schema Markup: FAQPage |
| Definition Block 格式 | `messages/en.json` 各页 intro 段 | ai-seo Pillar 1: 40-60 词直接答案 |
| 对比表格化 | `data/` 对比数据 → 表格组件 | ai-seo Pillar 1: Tables beat prose |
| 统计数字带来源 | `data/` 各实体 description | ai-seo Pillar 2: Statistics +37% |
| `last updated` 日期 | `data/content-dates.ts` | ai-seo Pillar 2: Freshness signals |
| H2 匹配查询模式 | `messages/en.json` heading 文案 | ai-seo Pillar 1: Headings match queries |
| `llms.txt` 存在 | `public/llms.txt`（新建） | ai-seo: Machine-Readable Files |
| 内链密度 3-5 个/页 | `data/internal-links.test.ts` | ai-seo: Content extractability |
| AI Overviews 测试 | Phase 1 关键词 → 手动测试 | ai-seo: AI Visibility Audit |

### 7.4 llms.txt 生成（游戏攻略站模板）

游戏攻略站应在 `public/llms.txt` 放置站点概览文件：

```markdown
# {Game Name} Guide

> Fan-made comprehensive game guide covering <codex 概念，如 monsters/upgrades>, <milestones 概念，如 bosses/endings>, equipment, regions, and strategies.

## About
- **Game**: {Game Name}
- **Developer**: {Developer}
- **Platform**: {Platforms}
- **Guide Coverage**: Beginner guides, monster database, boss strategies, equipment recommendations, region walkthroughs

## Key Pages
- [Beginner Guide](/guides/beginner-guide): Complete starter walkthrough
- [<codex 域名>](/<codex-slug>): Full <概念> compendium
- [<milestones 域名>](/<milestones-slug>): <概念> guides and tips
- [Equipment Guide](/equipment): Weapon and armor recommendations
- [FAQ](/faq): Common questions answered

## Data Format
All game data is structured with consistent fields: name, description, stats, locations, and cross-references to related entities.
```

### 7.5 验证

```bash
# P0/P1/P2 修复完成后
npm run validate     # 三绿门禁
npm run build        # 静态导出

# 确认 llms.txt 已包含在构建产物中
ls out/llms.txt      # 必须存在

# 确认 robots.txt 允许 AI bot
grep -E "GPTBot|ClaudeBot|PerplexityBot" out/robots.txt  # 不应有 Disallow
```

---

## Phase 8：构建产物逐页基线审计 + 自动修复

> 🔴 **本阶段在 Phase 7 完成后执行。**
> 三方审计分工：**Phase 5.1 `seo-auditor` 是换皮门禁**（同一技能的轻量清单，防换皮引入问题）；**Phase 8 是该技能的完整工作流**（脚本基线扫描 + checklist 逐项核查文档化 + P0/P1 修复闭环，逐页机械检查）；**Phase 9 `seo-audit` 是全站策略深度审计**（可收录性/内容质量/权威等脚本查不了的层面）。三者层层递进，不可互相替代。

### 8.1 基线扫描（audit_rules.js）

**技能路径**：`.claude/skills/7deer_skills-main/seo-auditor/`
> ⚠️ 技能 SKILL.md 内写的脚本路径 `.agent/skills/seo-auditor/...` 是旧位置，实际以本路径为准。

**输入**：`out/` 下全部静态导出 HTML（先 `npm run build` 确保产物最新）

**动作**：对每个页面运行审计脚本（10 项检查：H1 / Meta Description / Canonical / Title / OpenGraph / Twitter Card / JSON-LD / 内链数量 / 标题层级 / 外链 noopener），输出 PASS/FAIL + A-F 评分：

```bash
# 🔴 运行环境两个坑：
#   1) 本项目 package.json "type":"module" —— 技能目录的 audit_rules.js 是 CommonJS，
#      直接 node 跑会 ERR_REQUIRE_ESM；先复制为项目内 .cjs 再跑（或 cd 技能目录跑）
#   2) 分数行是大写 "🏆 SCORE: x/100 ... Grade A" —— 提取用 grep -oE 'SCORE: [0-9]+/100.*Grade [A-F+]'
cp .claude/skills/7deer_skills-main/seo-auditor/resources/audit_rules.js .tmp-audit-rules.cjs

# 逐页扫描（首页 + 全部 hub 页 + 全部内容页）
node .tmp-audit-rules.cjs ./out/index.html
node .tmp-audit-rules.cjs ./out/about.html
node .tmp-audit-rules.cjs ./out/guides/beginner-guide.html
# ...其余页面同模式

# 一次跑全站（记录每页分数）
# 🔴 无尾斜杠扁平布局：out/<path>.html —— out/*/index.html glob 匹配不到子页，必须 find：
for f in $(find out -name '*.html' ! -name '404.html' | sort); do
  node .tmp-audit-rules.cjs "$f"
done
```

**脚本检查 vs 硬标准的口径差异**（以 seo_standards 硬标准为准，脚本只是基线）：
- 脚本 Title 判定 30-70 字符宽进宽出 → 硬标准 **50-60 字符 + 含动态月份 + 每页唯一**
- 脚本 Canonical 只查存在性 → 硬标准 **绝对 URL + 尾斜杠**
- 脚本 Description 舒适区 100-180 → 硬标准 **120-160 字符 + 含核心关键词**

**失败分支**（来自技能工作流，严格执行）：
- `out/` 无 HTML → 先 `npm run build` 重试；仍无 → 记录 "BUILD FAILED" 并 **STOP**，不继续
- 脚本报错 / Node 环境问题 → 回退 Lighthouse SEO 面板手动审计路径（本模板是静态导出，正常不会走到这）
- 单页 HTML 为空文件（`wc -c` 为 0）→ 构建产物异常，**STOP**

### 8.2 Checklist 逐项核查（生成器产出 AUDIT.md + 人工复核异常项）

**逐页文档由模板脚本生成，不要手写、不要每站现写一次性脚本**（dumbways 曾现写 165 行 Python 生成器并返工 3 次，已固化为模板脚本）：

```bash
node scripts/generate-audit-docs.mjs
# 从 out/ 提取每页 title/desc/canonical/H1/schema/内链/大小 → docs/audits/<PAGE>_AUDIT.md
# 退出码非 0 = 存在 ❌ FAIL 项；幂等可重跑（修复后重跑即刷新全部文档）
```

生成器已内置的防坑设计（勿在衍生脚本中回退）：
- **H1 提取 DOTALL + 剥子标签 + 先剥 SSR 注释**：audit_rules.js 的 `[^<]*` 正则匹配不到含 `<span>`/emoji 子标签或 `<!-- -->` 注释的 H1，逐页会报 -10 分假 FAIL；生成器独立提取的 H1 数是复核口径
- **title 页内重复词检查**（audit_rules.js 只对首页查重查不出）：`\b(\w+) \1\b` 捕捉 "Normal Jobs Jobs Guide" 类模板拼接事故，虚词白名单防误报
- **粗体标签静态写死在模板里**，值插值填——不要字符串切分重建模板（会吃掉 `**` 标记）
- 关键词/域名从构建产物与 site.config.json 读取（跨站通用，无硬编码）

**人工复核**（生成器之后）：只看 stdout 汇总表的 fails 列与 `grep -l '❌' docs/audits/*.md`——对非顶层页 BreadcrumbList ❌ 等结构性已知项按 N/A 语义解读（模板历史口径：顶层页无父级面包屑记 ❌，复核时注明即可）；其余 ❌ 进 8.3 修复排序。

**checklist 五大节**（生成器输出结构，源自 resources/checklist_template.md）：
1. **Metadata**：Title（长度/页内重复词/与首页唯一）/Description（长度+关键词）/Canonical/OG/Twitter Card
2. **Structured Data**：BreadcrumbList 全页 + FAQPage（FAQ 及含 FAQ 区块的页面）/ HowTo（攻略步骤页）/ Article（内容页）
3. **Content**：H1 唯一 + 标题层级不跳级 + Quick Answer Box（高流量页）+ 内链 ≥3
4. **Site-Level**：sitemap 收录 + 导航可达 + 无孤儿页
5. **Technical**：SSG 静态渲染 + HTML < 150KB

> 🔴 **CHECKPOINT（技能硬规则）：源码通过 ≠ 产物通过。只对 `npm run build` 的 out/ 产物审计，禁止 grep `.tsx` 源码代替。**

### 8.3 优先级自动处理（P0 → P1）

基线审计只有两级优先级，直接映射统一框架；P2/P3 不在本阶段范围（归 Phase 9）：

| 优先级 | 检查项 | 处理方式 |
|:------:|-------|---------|
| **P0 四大件** | Title（50-60 + 动态月份 + 唯一）/ Meta Description（120-160 + 关键词）/ Canonical（绝对 URL + 尾斜杠）/ H1（恰好 1 个 + 主关键词） | **立即修复 → 重跑 audit_rules.js 验证 P0 全过** |
| **P1** | Schema（FAQPage ≥5 问 / HowTo 3-7 步）/ 内链 3-6 / HTML < 150KB / OG 完整 / 标题层级 | P0 清零后**逐项修复**，每批修复后 `npm run test:run` |

**修复纪律**（来自技能工作流）：
1. 只修 P0 → 重跑脚本确认全过 → 再动 P1，**不跳级**
2. 🛑 **熔断**：单页 FAIL 项 > 10 → 停止逐项修，只修 P0 后重跑一轮再评估
3. 修复只改 `messages/en.json`（文案层）+ `data/`（数据层）+ 页面组件的 metadata 导出，不碰框架层
4. 修复后 `npm run validate` + `npm run build`，重扫确认分数回升且无新 FAIL

### 8.4 验证

```bash
npm run validate && npm run build   # 修复后重建

# 全站重扫，目标：无 ERROR 级（❌）结果，WARN 显著减少
for f in $(find out -name '*.html' ! -name '404.html' | sort); do
  node .tmp-audit-rules.cjs "$f"
done

# AUDIT.md 文档齐备：每页一份，无空 checklist 行
ls docs/audits/*_AUDIT.md
```

---

## Phase 9：全站 SEO 深度审计 + 自动修复

> 🔴 **本阶段在 Phase 8 基线审计完成后执行。**
> 三方审计分工：**Phase 5.1 `seo-auditor` 是换皮门禁**（轻量清单）；**Phase 8 是逐页基线审计**（脚本 + checklist，机械检查产物四大件）；**Phase 9 `seo-audit` 是全站策略深度审计**（7 步工作流逐层排查可收录性/技术/On-Page/内容质量/权威，产出带优先级行动计划的完整报告）。三者层层递进，不可互相替代。

### 9.1 调用 seo-audit 技能运行深度审计

**技能路径**：`.claude/skills/marketingskills-main/skills/seo-audit/`

**审计对象与数据源**（按站点状态二选一）：

| 站点状态 | 审计数据源 | GSC CLI |
|---------|----------|---------|
| **新站**（本流水线常态：刚构建完、未上线/未验证 GSC） | `out/` 静态导出产物 + `npm run preview` 本地服务 | **跳过**——无数据可拉；GSC 验证记入 P3 上线后动作 |
| **已上线站**（二次审计/迭代场景） | 线上 URL + GSC API 真实数据 | 可用 `node .claude/skills/marketingskills-main/tools/clis/google-search-console.js`（需 `GSC_SITE` 覆盖站点属性，本项目默认配置指向其他站） |

**动作**：按 `seo-audit` 技能的 7 步工作流逐层执行（STEP 1 Scope & Context 已由流水线上下文隐式完成，故本文件从 STEP 2 起列示，非跳步；其余**不跳步**——可收录性有问题时 On-Page 优化是白费）：

1. **STEP 2 可收录性 & 索引**（Priority 1）
   - `out/robots.txt`：无意外 Disallow、含 Sitemap 引用
   - `out/sitemap.xml`：存在、只含 canonical 可索引 URL、hreflang 声明正确
   - 索引问题：重要页面 noindex / canonical 方向错误 / 软 404 / 重复内容无 canonical
   - Canonical 一致性：全页面有 canonical、自引用、HTTPS、www/尾斜杠一致
   - 站点架构：核心页距首页 ≤ 3 次点击、无孤儿页（`data/internal-links.test.ts` 已守护一部分）
   - 发现 critical 问题 → 先输出紧急修复建议再继续

2. **STEP 3 技术基础**（Priority 2）
   - Core Web Vitals：LCP < 2.5s / INP < 200ms / CLS < 0.1（preview 起服务后用 PageSpeed Insights 测）
   - 速度因素：图片优化（模板已 WebP/AVIF）、字体加载（Inter 自托管）、缓存头（serve-out/vercel.json）
   - 移动端友好：响应式、tap 目标、无横向滚动
   - HTTPS 全站（部署后验证）、URL 结构小写+连字符
   - **静态导出优势项**：TTFB/JS 执行量天然占优，如实记录不虚报

3. **STEP 4 On-Page 优化**（Priority 3）
   - Title：唯一、主关键词靠前、50-60 字符
   - Description：唯一、含主关键词、CTA
   - H1 恰好 1 个含主关键词，H1→H2→H3 层级合理
   - 关键词在前 100 词、内容满足搜索意图、无关键词蚕食（多页打同一个词）
   - 图片 alt 全覆盖、现代格式、懒加载
   - 内链：描述性锚文本、无死链（`check:swap`/`internal-links.test` 已守护）

4. **STEP 5 内容质量**（Priority 4）
   - E-E-A-T：fan-made 站诚实标注性质、数据有来源、`/about`/`/contact` 透明
   - 内容深度：Home ≥ 600 词（已守护）；各攻略页 vs 竞品深度对比
   - Thin content：无低价值空页（数据缺失的实体页要么充实要么不建）
   - 日期新鲜度：`content-dates.ts` 全部 ≤ 今天（已守护）

5. **STEP 6 权威 & 外链**（Priority 5）
   - 新站外链基本为零 → 如实记录现状，建设动作归入 P3
   - 内链权重分布：核心页（beginner-guide 等）获得足够内链

6. **STEP 7 汇编报告**
   - 按 seo-audit Output Format 输出：Executive Summary + Technical/On-Page/Content Findings + Prioritized Action Plan
   - 每个 finding 带 Issue/Impact/Evidence/Fix/Priority

**Schema 检测注意**（seo-audit 技能明确警告）：`web_fetch`/`curl` 会剥离 `<script>` 标签导致 JSON-LD 误报"无 schema"。本模板是**静态导出**——JSON-LD 直接写在 `out/` HTML 源码里，用 grep 查 `<script type="application/ld+json">` 即可，不受此限制；线上复查时才需要 Rich Results Test。

### 9.2 优先级映射与自动处理

seo-audit 报告的四级行动方案映射到统一 P0-P3 框架，**自动处理流程复用 Phase 7.2 的流程图**（P0 修完重跑三绿门禁 → P1 逐项修+验 → P2 批量修 → P3 记录到交付文档）：

| seo-audit 报告层级 | 映射 | 判定标准（游戏攻略站场景） | 处理方式 |
|------------------|:----:|------------------------|---------|
| **Critical fixes** | **P0** | robots.txt 阻断收录；sitemap 缺失/含死链；重要页 noindex；canonical 指向错误地址；JSON-LD 语法错误 | 立即修复 + `npm run validate` + `npm run build` |
| **High-impact improvements** | **P1** | title/description 超长或缺失；H1 缺失或多个；核心页无内链；图片缺 alt；关键词蚕食 | 逐项修复 + `npm run test:run` |
| **Quick wins** | **P2** | 锚文本全部精确匹配（需自然化）；H2 不匹配查询模式；小图未懒加载 | 批量修复后统一 `validate` + `build` |
| **Long-term recommendations** | **P3** | 外链建设；GSC 验证 + 提交 sitemap；内容刷新计划；竞品深度对标 | 记录到交付文档"后续运营建议"，不自动执行 |

**修复红线**：所有修复只改配置层 + 内容层（Phase 3 前置约束），不碰框架层；改动导致测试红 → 回滚该项、降级到 P3 记录原因，不死磕。

### 9.3 游戏攻略站的 SEO 深度审计专项检查

| 检查项 | 模板对应位置 | seo-audit 对应步骤 |
|-------|------------|------------------|
| robots.txt 无 Disallow 误伤 + Sitemap 引用 | `out/robots.txt` | STEP 2.1 |
| sitemap 全 URL 收录 + hreflang(en + x-default) | `app/sitemap.ts` → `out/sitemap.xml` | STEP 2.2 / International SEO |
| canonical 自引用 + 尾斜杠一致 | `lib/alternates.ts` + 各页 metadata | STEP 2.5 |
| 核心页 ≤ 3 点击可达 | `config/navigation.config.ts` 导航树 | STEP 2.6 |
| LCP < 2.5s（hero 图 AVIF 双档） | `public/images/hero-*` | STEP 3.1 |
| title ≤ 70 字符、去双品牌前缀 | `messages/en.json`（messages.test 守护） | STEP 4.1 |
| H1 唯一含主关键词 | 各页面组件 | STEP 4.3 |
| 关键词蚕食（多页打同一词） | Phase 2.2 关键词→页面映射 | STEP 4.7 |
| 图片 alt + 尺寸 + 现代格式 | 品牌资源 + 组件 | STEP 4.5 |
| JSON-LD 语法 + 与可见内容一致 | 各页 JSON-LD 组件 → grep out/ HTML | STEP 4 / Schema 注意事项 |
| fan-made 性质透明标注（E-E-A-T） | `/about` + `site.config` disclaimer | STEP 5.1 |
| 无 thin 实体页 | `data/` 各域（缺数据就砍页） | STEP 5.3 |

### 9.4 验证

```bash
# P0/P1/P2 修复完成后
npm run validate     # 三绿门禁（typecheck + lint + test:run + check:swap）
npm run build        # 静态导出

# 审计产物抽查（静态导出可直接 grep，无需 web_fetch）
# 🔴 noindex 必须精确匹配 meta 标签：裸 grep 'noindex' 会命中每页 RSC payload 里
#    序列化的 404 组件元数据，得出"全站 noindex"假警报。预期命中仅 404.html：
grep -rl 'name="robots"[^>]*noindex' out/                         # 应只输出 out/404.html
# canonical 逐页断言（-c 单文件计数 ≠ 页面数，须循环）。
# 🔴 本模板是无尾斜杠扁平布局（out/<path>.html，仅首页/404 叫 index/404.html），
#    out/*/index.html 这类 glob 匹配不到任何子页——必须用 find：
for f in $(find out -name '*.html' ! -name '404.html'); do
  [ "$(grep -c 'rel="canonical"' "$f")" = "1" ] || echo "CANONICAL MISSING: $f"
done                                                              # 无输出 = 逐页全过
grep -o '<script type="application/ld+json">' out/index.html | wc -l  # JSON-LD 存在（≥1）
ls out/sitemap.xml out/robots.txt                                  # 两者必须存在
```

---

## Phase 10：品牌图实图化（纯色占位图 → 官方游戏截图）

> 🔴 **本阶段在 Phase 9 深度审计完成后、Phase 11 部署前执行——不给用户部署一个纯色站。**
> 背景：Phase 3 Step 4 的 ffmpeg 纯色占位图只为过三绿契约（尺寸/格式/文件名），视觉是色块。
> 本阶段把 6 件品牌图全部换成官方游戏截图，**文件名与配置零改动**——文件名携带 siteId 的
> immutable 缓存失效契约、site.test 守护、hero:avif 派生链全部不动，只换文件内容。
> 游戏不在 Steam 时改用官方媒体页/新闻稿截图或官方预告片抽帧，流程同构。

### 10.1 截图获取（Steam appdetails API）

商店页 HTML 是 JS 渲染的，抓页面拿不到截图 URL——必须走 appdetails JSON API：

```bash
mkdir .tmp-img && cd .tmp-img
curl -s "https://store.steampowered.com/api/appdetails?appids=<appId>&l=english" -o steam-api.json
# data.<appId>.screenshots[].path_full = 官方 1920×1080 原图直链；编号从 0 起
node -e "const d=JSON.parse(require('fs').readFileSync('steam-api.json','utf8'))['<appId>'].data; d.screenshots.forEach((s,i)=>console.log(i,s.path_full))" \
  | while read i url; do curl -sL -H "User-Agent: Mozilla/5.0" -o "shot-$i.jpg" "$url"; done
```

**Windows 红线**：Git Bash 的 `/tmp` 对 node.exe 是 `C:\tmp`，脚本写 `/tmp` 会 ENOENT——
临时目录一律用项目内相对路径 `.tmp-img/`（完成后删除）。

### 10.2 选图（编号联络表 + 视觉模型评估）

Read 工具读本地图片**不会内联渲染**（上传 CDN 返回 URL 而非显示图片），无法逐张肉眼看——
先用 sharp 拼一张**带编号的联络表**，再交给视觉模型逐格评估：

```bash
cd .tmp-img && node -e "
const sharp = require('sharp');
(async () => {
  const N = <截图数>, W = 480, H = 270, COLS = 2, GAP = 10;
  const thumbs = [];
  for (let i = 0; i < N; i++) {
    const buf = await sharp('shot-' + i + '.jpg').resize(W, H).toBuffer();
    const badge = Buffer.from('<svg width=\"60\" height=\"34\"><rect width=\"60\" height=\"34\" fill=\"black\" opacity=\"0.7\"/><text x=\"30\" y=\"24\" font-size=\"22\" fill=\"white\" text-anchor=\"middle\" font-family=\"sans-serif\">' + i + '</text></svg>');
    thumbs.push(await sharp(buf).composite([{ input: badge, top: 0, left: 0 }]).toBuffer());
  }
  const rows = Math.ceil(N / COLS);
  const composites = thumbs.map((input, i) => ({ input, left: (i % COLS) * (W + GAP), top: Math.floor(i / COLS) * (H + GAP) }));
  await sharp({ create: { width: COLS * W + (COLS - 1) * GAP, height: rows * H + (rows - 1) * GAP, channels: 3, background: 'white' } })
    .composite(composites).jpeg({ quality: 85 }).toFile('contact-sheet.jpg');
})();
"
```

联络表交给视觉模型（Read 联络表 → 拿返回的 CDN URL → 图像分析工具），按**页面语义**选图：

| 用途 | 选图标准 | Scarlet Skips 实例 |
|------|---------|-------------------|
| hero/og 主视觉 | 核心机制最具视觉冲击的画面，一图说清"这是什么游戏"；缩略图尺寸下可辨 | 火焰跳绳场景（跳绳 = 核心玩法，VFX 最亮眼） |
| 域头图（monsters 等） | 机制相关 UI 界面，与页面 alt/主题语义吻合 | 升级卡三选一界面 ↔ "All Upgrade Cards by Zone and Effect Guide" |

### 10.2.5 候选对比定稿（🔴 全量生成前的强制关口）

联络表评估的判据是**全尺寸美学**（哪张截图最好），但 og/hero 的真实消费形态是**缩略图**——两个判据会给出不同答案（dumbways 实证：联络表首选的大锤爆破图，缩略图下因"爆炸左/角色右"双焦点构图 + UI 杂讯被否，全量 6 件白做一轮）。**先只用 1200×630 廉价候选定稿，再全量生成**：

```bash
cd <项目根> && node -e "
const sharp = require('sharp');
(async () => {
  const mk = async (src, tag, out) => {
    const img = await sharp(src).resize(1200, 630, { fit: 'cover', position: 'centre' }).toBuffer();
    const label = Buffer.from('<svg width=\"1200\" height=\"60\"><rect width=\"1200\" height=\"60\" fill=\"black\"/><text x=\"20\" y=\"42\" font-size=\"36\" fill=\"white\" font-family=\"sans-serif\" font-weight=\"bold\">' + tag + '</text></svg>');
    return { img, label, out };
  };
  const cands = [
    await mk('.tmp-img/shot-<联络表首选>.jpg', 'CANDIDATE A (<一句话构图>)', 'og-cand-A.jpg'),
    await mk('.tmp-img/shot-<backup>.jpg',     'CANDIDATE B (<一句话构图>)', 'og-cand-B.jpg'),
  ];
  // 竖排拼对比图（每候选一行：60px 标签条 + 1200x630 图）
  await sharp({ create: { width: 1200, height: 1380, channels: 3, background: '#222' } })
    .composite(cands.flatMap((c, i) => [{ input: c.label, top: i * 690, left: 0 }, { input: c.img, top: i * 690 + 60, left: 0 }]))
    .jpeg({ quality: 88 }).toFile('.tmp-img/og-compare.jpg');
})();
"
```

Read 对比图 → CDN URL → 视觉模型，判据显式写进提问（**按 200px 缩略图评判**）：① 单一焦点链（非分裂构图）② 一图说清"可爱角色协作建造"③ UI/文字杂讯占比小 ④ 小尺寸下对比度可辨。要求**决断性二选一**，并索取构图微调建议（如"裁顶 10% 去掉任务横幅"——微调参数直接带进 10.3 的 extract）。

定稿产物 = 选定截图编号 + 裁切参数。**未过此关口不得进入 10.3**（avif 从 og 派生，og 一换 avif 必须重跑，全量返工代价 6 件）。

### 10.3 生成（sharp 从源截图直出；og 是 avif 母版）

> 🔴 **前置：主视觉已经 10.2.5 候选对比定稿**（含构图微调参数，如裁顶 extract）。

**产物契约**（文件名/存在性由 site.config.json + lib/site.ts + site.test 守护；**像素尺寸无自动守护**——og 1200×630 仅在 site.config 声明且未校验，hero/域头图尺寸声明在组件布局（hero.tsx aspect / codex hub 页 width·height）里，换错尺寸的图测试照样绿，实际像素靠 10.4 的 sharp metadata 复核兜底）：

| 产物 | 尺寸 | 生成参数 | 说明 |
|------|------|---------|------|
| `og-<siteId>.jpg` | 1200×630 | centre cover, jpeg **q92** | avif 派生母版，q92 抑制二次有损累积 |
| `hero-<siteId>-header.webp` | 1730×909 | centre cover, webp q85 | hero 容器 aspect-[1730/909] |
| `hero-<siteId>-header-768.webp` | 768×404 | webp q82 | srcset 移动档 |
| `<codex-slug>-<siteId>-header.jpg` | 1200×400 | jpeg q85 | 域头图宽幅横条 |

**生成顺序红线**：og 先落盘 → `npm run hero:avif`（从 og jpg 派生 avif 双档）→ webp/jpg
变体**从源截图直接生成，不经 og 二次压缩**（只有 avif 走 og 派生链）。sharp 已在
node_modules，无需新装；但 `hero:avif` 脚本经 execFileSync 调 **ffmpeg**（libaom-av1 crf36），
机器须装 ffmpeg（Phase 3 Step 4 已建立该前置），sharp 只负责 og/webp/jpg 四件产物：

```bash
cd <项目根> && node -e "
const sharp = require('sharp');
(async () => {
  const src1 = '.tmp-img/shot-<主视觉编号>.jpg', src2 = '.tmp-img/shot-<域头图编号>.jpg';
  await sharp(src1).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 92 }).toFile('public/images/og-<siteId>.jpg');
  await sharp(src1).resize(1730, 909, { fit: 'cover', position: 'centre' }).webp({ quality: 85 }).toFile('public/images/hero-<siteId>-header.webp');
  await sharp(src1).resize(768, 404,  { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile('public/images/hero-<siteId>-header-768.webp');
  await sharp(src2).resize(1200, 400, { fit: 'cover', position: 'centre' }).jpeg({ quality: 85 }).toFile('public/images/<codex-slug>-<siteId>-header.jpg');
})();
"
npm run hero:avif   # 重新生成 hero-<siteId>-768.avif / hero-<siteId>-1200.avif
```

### 10.4 验证与清理

```bash
npx vitest run config/site.test.ts   # 守护全绿（文件名 siteId/存在性/favicon 尺寸；og/hero/域头图像素靠下方 metadata 复核。本站基线 16/16，跨站用例数可能不同，以当站首跑结果为基线）
npm run build                        # 重建 out/，部署产物同步新图
```

- **尺寸复核**：sharp metadata 逐张确认产物宽高与契约表一致；🔴 avif 两件编码另用 ffprobe 验——sharp 对 ffmpeg 产物报 `format: "heif"`（容器品牌怪癖，宽高仍准），编码必须以 ffprobe 为准：
  ```bash
  for f in public/images/hero-<siteId>-768.avif public/images/hero-<siteId>-1200.avif; do
    echo "$f: $(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$f")"   # 期望 av1
  done
  ```
- **视觉复核**：Read 产物图片拿 CDN URL → 交视觉模型，重点问"主体是否被裁残、文字是否可读、
  缩略图下是否可辨"（1200×400 域头图是横条裁切，最易裁掉关键 UI；复核输出被截断时以联络表
  阶段的完整评估结论为准，重试一次即可，不死磕）
- **换图后复审**（🔴 hero 是 LCP 元素，实图比纯色占位图大一个量级，Phase 9 的 CWV 结论对换图后
  的站不再当然成立）：`npm run preview` 起服务后用 PageSpeed Insights 复测 LCP < 2.5s
  （Phase 9 STEP 3 同口径）；audit_rules.js 全站重扫一轮作回归（文件名/尺寸契约不变，HTML 层
  应仍 PASS）。LCP 超标 → 降 webp quality 重切（源截图还在 `.tmp-img`，故复审必须排在清理之前）；
  Phase 9 深度审计报告中的 CWV 数据注明"占位图阶段测得，实图化后已复测"
- **清理审计**：`rm -rf .tmp-img` 后 `git status` 应只剩 6 张图 M、无其他文件被动
- 交付说明注明图片来源（官方截图 + appId）与选图依据（截图编号 → 页面语义）

**🔴 提交品牌图产物（必做，Phase 11 部署前置）**：

```bash
git add public/images/ docs/audits/
git commit -m "feat: brand images + audit reports"
```

---

## Phase 11：部署（GitHub 私有仓库 + Cloudflare Pages Git 集成）

> 🔴 **本阶段在 Phase 10 品牌图实图化完成后执行；部署成功后进入 Phase 12 GSC 收录配置。**
> 目标：代码入私有 GitHub 仓库（**仓库名 = 项目名**），Cloudflare Pages 以 **Git 集成**方式部署（push master 即自动构建），绑定自定义域名。
> 主路径 = Git 集成；wrangler 直传仅作 Git 集成不可用时的备选。

### 11.0 前置检查

**环境**（本机一次性，已有则跳过）：

```bash
# 1. 代理：本机直连解析不了 api.cloudflare.com / github.com。
#    所有 wrangler / gh / curl / git push 网络命令都要加代理前缀（Clash：127.0.0.1:7897，以实际为准）。
#    先验证代理可用：
curl -s -o /dev/null -w "%{http_code}" -x http://127.0.0.1:7897 https://api.cloudflare.com/client/v4/user/tokens/verify

# 2. Cloudflare 登录（OAuth，浏览器点 Allow）：
HTTPS_PROXY=http://127.0.0.1:7897 HTTP_PROXY=http://127.0.0.1:7897 npx wrangler login

# 3. GitHub 登录：
HTTPS_PROXY=http://127.0.0.1:7897 HTTP_PROXY=http://127.0.0.1:7897 gh auth status   # 未登录则 gh auth login
```

**项目侧**（缺一不可）：

| 检查项 | 要求 |
|-------|------|
| `wrangler.toml` | 不存在则创建：`name` = **项目名（= 仓库名）**；`pages_build_output_dir = "out"`；`compatibility_date` ≤ 今天。name 不一致会导致 Pages 构建报 mismatch |
| `config/site.config.json` | `url` = `https://<正式域名>`（建站时已配，部署阶段只验证不改） |
| git | 已有首个 commit（换皮 Step 0 重 init 过的仓库必须先提交，否则 wrangler 部署报 `ambiguous argument 'HEAD'`） |

### 11.1 主路径：Git 集成部署

**Step 1：创建私有仓库并推送**（🔴 换皮站 origin 已指向模板仓，`--source=.` 会因 remote 冲突失败——先查现状再按分支走）

```bash
git remote -v   # 先看 origin 现状

# 分支 ①：origin 不存在（干净仓）——一步建仓+推送：
gh repo create <项目名> --private --source=. --remote=origin --push

# 分支 ②：origin 已指向模板仓（换皮常态）——单独建仓（不带 --source）→ 改指向 → 推送：
gh repo create <项目名> --private
git remote set-url origin git@github.com:<GitHub用户名>/<项目名>.git
HTTPS_PROXY=http://127.0.0.1:7897 HTTP_PROXY=http://127.0.0.1:7897 git push -u origin master
```

**Step 2：调 Cloudflare API 创建 Git 集成项目**

账号装过 Cloudflare GitHub App（dashboard 连过任意仓库即已装）时，API 创建会自动关联新仓库，无需浏览器操作：

```bash
# 提取 wrangler OAuth token（只在本条命令内引用：不回显、不写文件、不进 git）
# token 约 1h 过期；过期表现为 API 返回 result:null / Authentication error → 先跑任意 wrangler 命令刷新再重新提取
TOKEN=$(sed -n 's/^oauth_token = "\([^"]*\)"/\1/p' "$APPDATA/xdg.config/.wrangler/config/default.toml" | head -1)

# 账号 ID 用 wrangler whoami 现查（不要硬编码）
HTTPS_PROXY=http://127.0.0.1:7897 HTTP_PROXY=http://127.0.0.1:7897 npx wrangler whoami

curl -s -x http://127.0.0.1:7897 -X POST \
  "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/pages/projects" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{
    "name": "<项目名>",
    "production_branch": "master",
    "source": {
      "type": "github",
      "config": {
        "owner": "<GitHub用户名>", "repo_name": "<项目名>", "production_branch": "master",
        "deployments_enabled": true, "production_deployments_enabled": true,
        "preview_deployments_enabled": true, "pr_comments_enabled": true
      }
    },
    "build_config": { "build_command": "npm run build", "destination_dir": "out" },
    "deployment_configs": {
      "production": { "env_vars": { "NODE_VERSION": { "value": "22" } } },
      "preview":    { "env_vars": { "NODE_VERSION": { "value": "22" } } }
    }
  }'
```

成功标志：响应含 `"subdomain": "<项目名>.pages.dev"` 且 `"repo_id"` 已解析（GitHub App 已关联）。

**Step 3：触发首次构建**（API 创建的项目不会自动构建）

```bash
git commit --allow-empty -m "ci: trigger first Cloudflare Pages build"
HTTPS_PROXY=http://127.0.0.1:7897 HTTP_PROXY=http://127.0.0.1:7897 git push
```

**Step 4：轮询构建状态**

```bash
curl -s -x http://127.0.0.1:7897 \
  "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/pages/projects/<项目名>/deployments?per_page=1" \
  -H "Authorization: Bearer $TOKEN"
# 看 latest_stage.status；五个 stage 全 success = 完成：
# queued → initialize → clone_repo → build → deploy
# 首次构建约 2-4 分钟（npm install + next build + pagefind）
```

**Step 5：验证生产域名**

```bash
for p in "/" "/<codex-slug>" "/guides" "/faq" "/llms.txt" "/sitemap.xml"; do
  curl -s -o /dev/null -w "%{http_code} $p\n" -x http://127.0.0.1:7897 "https://<项目名>.pages.dev$p"
done
# 全部 200 + 首页 title 渲染正确（无裸 i18n key）才算通过
```

### 11.2 备选路径：wrangler 直传（仅当 Git 集成不可用）

```bash
# wrangler ≥4.131 的 pages project create 会被委派到 Workers 流程，纯静态项目报 "Missing entry-point"
# → 首次创建必须加 --force 走旧版 Pages API；项目存在后所有后续命令【不再】加 --force
HTTPS_PROXY=http://127.0.0.1:7897 HTTP_PROXY=http://127.0.0.1:7897 \
  npx wrangler pages project create <项目名> --production-branch=master --force

HTTPS_PROXY=http://127.0.0.1:7897 HTTP_PROXY=http://127.0.0.1:7897 \
  npx wrangler pages deploy out/ --project-name=<项目名> --commit-dirty=true
```

缺点：每次更新都要手动重跑 deploy。建站一律走 11.1 主路径。

### 11.3 自定义域名

**Step 1：API 绑定域名**（wrangler OAuth 的 `pages:write` 权限够用）

```bash
curl -s -x http://127.0.0.1:7897 -X POST \
  "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/pages/projects/<项目名>/domains" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name": "<正式域名>"}'
```

**Step 2：DNS 记录——按域名是否托管在 Cloudflare 分支**

wrangler OAuth 无 DNS 写权限，但 `.env.cf` 的 `CF_API_TOKEN`（Edit zone DNS 模板）有——先探测 zone 再选路径：

```bash
# 探测：zone 在本 CF 账号且有 token → 全自动路径（dumbways 实测 apex+www 均 ~90s active）
CFTOKEN=$(sed -n 's/^CF_API_TOKEN=//p' .claude/skills/marketingskills-main/gsc_config/.env.cf | tr -d '"\r')
ZONE_ID=$(curl -s -x http://127.0.0.1:7897 "https://api.cloudflare.com/client/v4/zones?name=<正式域名>" \
  -H "Authorization: Bearer $CFTOKEN" \
  | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>process.stdout.write((JSON.parse(d).result?.[0]?.id)||''))")
if [ -n "$ZONE_ID" ]; then
  # 全自动：API 写 apex CNAME（www 见 Step 2.5），橙云代理
  curl -s -x http://127.0.0.1:7897 -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $CFTOKEN" -H "Content-Type: application/json" \
    -d '{"type":"CNAME","name":"<正式域名>","content":"<项目名>.pages.dev","proxied":true}'
  # success:true 即写入；"record already exists" 类报错视为已存在
else
  # 降级：交给用户（约 1 分钟）——
  # 方式 A（推荐）：dashboard → Workers & Pages → 项目 → Custom domains → 点"激活域名"
  # 方式 B：DNS 手动加 CNAME <域名> → <项目名>.pages.dev，开启代理（橙云）
fi
```

**注意**：删除 Pages 项目会**连带删除**其上的域名绑定——推倒重建项目后必须重新走 11.3。

**Step 2.5：www 子域（可选但推荐）**

只绑 apex 时，`https://www.<域名>` 会返回 **522**（DNS 指向 pages.dev 但 Pages 未绑该主机名，SNI 不匹配）。处理：

```bash
# 1. www 也绑进 Pages 项目（与 Step 1 同一端点，再 POST 一次）：
curl -s -x http://127.0.0.1:7897 -X POST \
  "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/pages/projects/<项目名>/domains" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name": "www.<正式域名>"}'
# 2. DNS 加 www CNAME（同 zone，橙云代理）：www → <项目名>.pages.dev
# 3. 轮询 domains 状态到 active（约 1-3 分钟）
```

- www 与 apex 服务同样内容即可——canonical 全站指向 apex，Google 自动归并信号，**无需做 www→apex 301**
- 🔴 不要尝试用 CF Rulesets API 做 zone 级 301：`.env.cf` 的 Edit-zone-DNS token 无 ruleset 写权限，报 `104005/10405 "Method not allowed for this authentication scheme"`

**Step 3：验证生效**

```bash
# DNS 记录已出现（Answer 里应能看到指向 pages.dev 的记录）：
curl -s "https://cloudflare-dns.com/dns-query?name=<域名>&type=CNAME" -H "accept: application/dns-json"
# HTTPS 可访问：
curl -s -o /dev/null -w "%{http_code}\n" -x http://127.0.0.1:7897 "https://<域名>/"
```

`site.config.json` 的 `url` 本来就是正式域名（sitemap/canonical/og:url 已按它生成），域名生效后**无需改代码重新部署**。

### 11.4 部署后验证清单

- [ ] 生产 URL 关键路由全 200（/ 、代表性实体详情页、主攻略页、/faq、/llms.txt、/sitemap.xml）
- [ ] 首页 `<title>` / meta description 渲染正确（抽查，无裸 i18n key）
- [ ] 线上 HTML 含 JSON-LD（`grep 'application/ld+json'` 抽查）
- [ ] 自定义域名 HTTPS 200
- [ ] 部署报告写入交付文档：仓库地址、生产 URL、自定义域名状态、更新方式（`git push` 即自动部署）

---

## Phase 12：GSC 收录配置（添加资源 + DNS TXT 验证 + sitemap 提交）

> 🔴 **本阶段在 Phase 11 部署完成后执行，前置 = 自定义域名 HTTPS 200**（Google 抓不到 sitemap，提交就白提交）。
> 目标：`sc-domain:<正式域名>` 资源建立、DNS TXT 验证通过、sitemap 提交、收录基线 0/N 落盘。
> 全程 API 自动化 **0 人工步**：DNS TXT 用 CF API 写入（`.env.cf` 的 `CF_API_TOKEN`，Edit zone DNS 权限）；无 token 时仅此步降级为用户手动加 TXT（wrangler OAuth 无 DNS 写权限）。

### 12.0 前置：凭据与工具

**工具位置**：`.claude/skills/marketingskills-main/gsc_config/`

| 文件 | 用途 |
|------|------|
| `.env.gsc` | client_id / client_secret / refresh_token（git-ignored） |
| `.env.cf` | CF_API_TOKEN（Edit zone DNS 模板、All zones、永不过期；写 DNS TXT 用，git-ignored） |
| `gsc-oauth-helper.mjs` | 一键重新授权（token 失效 / scope 不对时跑） |
| `gsc.sh` | API 封装（`refresh` / `sites` / `sitemaps` 查询；curl 走代理） |
| `gsc-inspect.mjs` | 全 URL 收录巡检 + `.gsc-data/` 快照对比 |

**凭据检查**（🔴 readonly token 连 `sitemaps.submit` 都不行——写入必须双 scope）：

```bash
cd .claude/skills/marketingskills-main/gsc_config && bash gsc.sh refresh
ATOKEN=$(grep '^GSC_ACCESS_TOKEN=' .env.gsc.access | head -1 | cut -d= -f2- | tr -d '"\r')
curl -s -x http://127.0.0.1:7897 "https://oauth2.googleapis.com/tokeninfo?access_token=$ATOKEN" \
  | python -c "import json,sys; print(json.load(sys.stdin).get('scope'))"
# 必须同时含 auth/webmasters（读写）和 auth/siteverification，缺 → 重新授权：
node gsc-oauth-helper.mjs   # 打印授权 URL，浏览器打开→允许，自动换 token 写回 .env.gsc
```

- refresh 无法扩权（scope 在授权 consent 时锁死），升级 scope 唯一路径 = 重新授权
- 🔴 OAuth 回调端口必须是 **17890**——该客户端唯一注册端口；报"此应用的请求无效"就是端口不对
- GCP 项目需启用 **Site Verification API**（一次性；未启用时报 SERVICE_DISABLED，错误里带 activationUrl 让用户点开启用）

### 12.1 全自动 API 链

**Step 1：取 DNS TXT 验证串**（🔴 参数在 POST body；query string 传参报 400 "The site '' of type SITE is invalid"）

```bash
curl -s -x http://127.0.0.1:7897 -X POST "https://www.googleapis.com/siteVerification/v1/token" \
  -H "Authorization: Bearer $ATOKEN" -H "Content-Type: application/json" \
  -d '{"verificationMethod":"DNS_TXT","site":{"identifier":"<正式域名>","type":"INET_DOMAIN"}}'
# 成功：{"method":"DNS_TXT","token":"google-site-verification=..."}
```

**Step 2：CF API 写 TXT**（0 人工步；token 在 `.env.cf`）

```bash
CFTOKEN=$(grep '^CF_API_TOKEN=' .env.cf | head -1 | cut -d= -f2- | tr -d '"\r')
ZONE_ID=$(curl -s -x http://127.0.0.1:7897 "https://api.cloudflare.com/client/v4/zones?name=<正式域名>" \
  -H "Authorization: Bearer $CFTOKEN" \
  | python -c "import json,sys; print((json.load(sys.stdin).get('result') or [{}])[0].get('id',''))")
curl -s -x http://127.0.0.1:7897 -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CFTOKEN" -H "Content-Type: application/json" \
  -d '{"type":"TXT","name":"<正式域名>","content":"<Step 1 的 token>","ttl":1}'
# success:true 即写入；重复执行报 "record already exists" 类错误 = 已存在，视为成功
```

**fallback（无 CF_API_TOKEN 时）**：用户手动加——Dashboard → 域名 → DNS → Records → 类型 `TXT`、名称 `@`（根域名）、内容 = Step 1 的 token、TTL Auto。

**Step 3：API 执行验证**（TXT 刚加可能要等 1-2 分钟传播，失败重试）

```bash
# 可先 DoH 确认 TXT 已可查：
curl -s "https://cloudflare-dns.com/dns-query?name=<正式域名>&type=TXT" -H "accept: application/dns-json"

curl -s -x http://127.0.0.1:7897 -X POST \
  "https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=DNS_TXT" \
  -H "Authorization: Bearer $ATOKEN" -H "Content-Type: application/json" \
  -d '{"site":{"identifier":"<正式域名>","type":"INET_DOMAIN"}}'
# 成功：{"id":"dns%3A%2F%2F<域名>","site":{...},"owners":["<账号>"]}
```

**Step 4：添加 GSC 资源 + 提交 sitemap**（均 PUT，成功返回 **204 无 body**，`-w "%{http_code}"` 确认）

```bash
curl -s -x http://127.0.0.1:7897 -X PUT \
  "https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain%3A<正式域名>" \
  -H "Authorization: Bearer $ATOKEN" -H "Content-Length: 0" -w "HTTP %{http_code}\n"

curl -s -x http://127.0.0.1:7897 -X PUT \
  "https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain%3A<正式域名>/sitemaps/https%3A%2F%2F<正式域名>%2Fsitemap.xml" \
  -H "Authorization: Bearer $ATOKEN" -H "Content-Length: 0" -w "HTTP %{http_code}\n"
```

**Step 5：收录基线**（新站 0/N 是正常起点；快照自动落 `.gsc-data/`，供后续对比）

```bash
GSC_SITE=sc-domain:<正式域名> node gsc-inspect.mjs
# 输出 ✅ 已收录 X ❌ 未收录 Y —— 之后随时重跑，盯收录 0 → N
# URL Inspection API 配额 2000 次/天，单次请求单 URL，40 页的站一轮 < 1 分钟

# 单页抽查（不走脚本，POST searchconsole/v1/urlInspection/index:inspect，
# body {"inspectionUrl":"https://<域名>/","siteUrl":"sc-domain:<域名>"}）：
# 🔴 响应字段是 inspectionResult.indexStatusResult（复数 Result）；
# coverageState "URL is unknown to Google" = 新站 day-0 正常基线
```

### 12.2 验证清单

- [ ] `sites.list`（🔴 响应键是 `siteEntry`）出现 `sc-domain:<域名>` 且 `permissionLevel: siteOwner`
- [ ] `sitemaps.list` 中 sitemap path 正确、`lastSubmitted` 有值（`lastDownloaded` 为空 = Google 还没处理，正常）
- [ ] gsc-inspect 基线快照已生成
- [ ] 收录监控命令写入交付文档：`GSC_SITE=sc-domain:<域名> node gsc-inspect.mjs`

---

## Phase 13：运营周报（上线后每周例行）

> 建站流水线到 Phase 12 交付为止；本阶段是**运营期例行动作**，每周跑一次，不阻塞交付。
> 两层分工：脚本管数据（确定性、零 token、可 cron 独立跑），skill 管洞察（诊断/评分/OKR）。

```bash
bash scripts/seo-weekly-report.sh        # 数据管道：GSC+GA4 → docs/seo-report-YYYYMMDD.md
# 然后用 .claude/skills/seo-report skill 读报告，在洞察分界线前追加三节
```

- **站点无关**：域名从 `config/site.config.json` 提取、GA4 property 从 `gsc_config/.env.ga4` 读取，换皮站零改动
- **首次周报**：建议 Phase 12 完成 7 天后跑（GSC 数据有 2-3 天延迟，太早全是空表）
- **GA4 前置**：站点的 `.env.ga4` 需有该站 property 的 refresh token + `GA4_PROPERTY`（授权流程见 `gsc_config/ga4.sh auth-url`）
- 空数据期报告头部自带 ⚠️ 排查指引，skill 对新站只做收录促进诊断、不解读趋势
- 交付时把周报命令写进交付文档

---

## 失败处理

| 阶段 | 失败场景 | 处理 |
|------|---------|------|
| Phase 1 | Google CAPTCHA | 降级到 Bing/DuckDuckGo；标注数据为推算值 |
| Phase 1 | YouTube 无结果 | 游戏可能太小众，缩小搜索范围；用 game name + "gameplay" |
| Phase 2 | 关键词不足以填充站点 | 减少页面数量，先做核心 5-8 页；其余后续迭代 |
| Phase 3 | site.test 红 | 检查 theme↔globals.css 同步；检查 ogImage 文件存在 |
| Phase 3 | navigation.test 红 | 检查 labelKey 在三个命名空间都存在 |
| Phase 3 | messages.test 红 | 检查 Home 词数 ≥ 600；检查 metaDescription 唯一；缺 key 守护红 = 代码字面量引用的 key 在 en.json 缺失（重写 en.json 丢叶子 key，next-intl 生产模式会渲染裸 key 路径上线） |
| Phase 3 | internal-links.test 红 | 检查 data/ 硬编码链接指向真实页面 |
| Phase 3 | typecheck 报导出丢失（TS2724） | 重写 data 文件前先 grep 原文件 `export` 符号清单——vitest 不查类型，test:run 绿 ≠ 没丢导出 |
| Phase 3 | 单机游戏遇到 multiplayer/economy 域 | 路由保留（导航测试要求），内容改诚实回答 "No — single-player only"；全站口径同步（multiplayer/faq/game 表格/messages/llms.txt；milestones 详情已无 coOpTips 字段，域可配置化时删除） |
| Phase 5 | build 失败 | 看 TypeScript 错误；看 ESLint 错误；逐个修复 |
| Phase 5 | check:swap 红 | 框架层有旧品牌词残留；grep 定位并替换 |
| Phase 6 | favicon 守护红（缺文件/尺寸错） | 重跑 `node scripts/generate-favicons.mjs <源图>`（幂等覆盖全套） |
| Phase 6 | 32px 下图标糊成一团 | 元素减到 ≤3；线宽 ≥ 源图 1/13；相邻色拉开明度差（可用 `.dark` 亮变体色）；改源图重跑 |
| Phase 7 | ai-seo 审计发现 P0 问题（robots.txt 阻止 AI bot / Schema 语法错误） | 立即修复 → npm run validate → npm run build → 通过后继续 P1 |
| Phase 7 | P1 修复后 test 红（如 FAQ Schema 改动导致 JSON-LD 测试失败） | 回滚该页修复 → 记录到 P3 手动处理 → 继续下一个 P1 |
| Phase 7 | llms.txt 创建后 build 产物不包含 | 检查 next.config 的 static assets 配置；确认文件在 `public/` 根目录 |
| Phase 7 | AI 可见性测试全部为"未被引用" | 新站正常——需要运营时间积累权威；P3 记录第三方存在感建设建议 |
| Phase 8 | `out/` 无 HTML / 单页产物为空 | 先 `npm run build` 重试；仍无 → 记录 "BUILD FAILED" 并 STOP，回 Phase 5 排查构建 |
| Phase 8 | audit_rules.js 路径不存在 | 技能 SKILL.md 内的 `.agent/skills/seo-auditor/...` 是旧位置；用实际路径 `.claude/skills/7deer_skills-main/seo-auditor/resources/audit_rules.js` |
| Phase 8 | node 跑 audit_rules.js 报 ERR_REQUIRE_ESM | 项目 `package.json` 是 `"type":"module"` 而脚本是 CommonJS：复制为 `.cjs` 再跑（8.1 命令块已含此步），或 cd 技能目录跑 |
| Phase 8 | 跑完全站分数收集为空 | 分数行是大写 `🏆 SCORE: x/100 ... Grade A`——提取必须 `grep -oE 'SCORE: [0-9]+/100.*Grade [A-F+]'`，grep "Score" 匹配不到 |
| Phase 8 | 逐页 H1 检查 FAIL 但肉眼正常 | audit_rules.js 的 H1 正则匹配不到含子标签/SSR 注释的 H1（-10 假 FAIL）；以 `scripts/generate-audit-docs.mjs` 的 DOTALL+剥标签提取为复核口径，勿按脚本分数硬修页面 |
| Phase 8 | 单页 FAIL 项 > 10 | 🛑 熔断：停止逐项修，只修 P0 四大件后重跑一轮再评估（技能 STOP 规则） |
| Phase 8 | 修复后脚本分数没回升/出新 WARN | 对照"脚本检查 vs 硬标准口径差异"表——脚本口径宽（Title 30-70），按硬标准修后可能触发别的项；以 checklist 三态记录为准 |
| Phase 9 | 审计发现 P0（robots.txt 阻断 / sitemap 死链 / 重要页 noindex / canonical 错向） | 立即修复 → `npm run validate` + `build` → 通过后继续 P1；修复碰框架层 → 回滚，P3 记录 |
| Phase 9 | 修复导致测试红（如 canonical 改动破坏 alternates 测试） | 回滚该项 → 降级 P3 记录失败原因 → 继续下一项，不死磕 |
| Phase 9 | GSC CLI 拉数据报凭据失败/站点属性不对 | 新站属正常（未验证 GSC）；跳过 GSC 维度，P3 记录"上线后验证 GSC + 提交 sitemap" |
| Phase 9 | web_fetch 报"无 schema" | 误报——web_fetch 剥离 script 标签；静态导出直接 grep `out/` HTML 源码查 JSON-LD；线上复查用 Rich Results Test |
| Phase 9 | 关键词蚕食（多页打同一词） | 回 Phase 2.2 的关键词→页面映射，一页一词重新分配；改 title/H1 区分意图 |
| Phase 10 | appdetails API 无 screenshots / 游戏不在 Steam | 改用官方媒体页、新闻稿截图或官方预告片抽帧（`ffmpeg -ss <t> -i <官方视频> -frames:v 1 shot.png`）；全都没有则保留占位图，交付文档标注待补 |
| Phase 10 | 视觉模型联络表评估与预期不符 | 换选图维度重问一轮（强调"核心机制可读 / 缩略图下可辨"）；仍定不下来就把候选并列交用户选，不硬拍 |
| Phase 10 | site.test 红（尺寸/文件名） | 对照 10.3 产物契约逐项核对——多为 resize 参数写错或文件名漏 siteId |
| Phase 10 | sharp 校验 avif 报 format "heif"，疑似产物坏了 | ffmpeg 产的 avif 容器被 sharp 报成 "heif" 是品牌怪癖 ≠ 编码错误：宽高以 sharp 为准，编码用 ffprobe 验 av1（10.4 命令） |
| Phase 11 | wrangler/gh/curl 报无法解析 api.cloudflare.com / github.com | 本机直连被墙：所有网络命令加 `HTTPS_PROXY`/`HTTP_PROXY=http://127.0.0.1:7897`（Clash，以实际端口为准）；先 `curl -x` 验证代理可用 |
| Phase 11 | `pages project create` 报 "Missing entry-point to Worker script" | wrangler ≥4.131 委派到 Workers 流程所致：纯静态项目首次创建加 `--force` 走旧版 Pages；项目建好后**后续命令不再加** |
| Phase 11 | deploy 报 "The Pages project ... does not exist" | 先 `wrangler pages project list` 复核 create 是否真的成功（输出被截断会假成功）；不存在则重新 create 并看完整输出 |
| Phase 11 | CF API 返回 `result: null` / Authentication error | wrangler OAuth token 过期（约 1h）：跑任意 wrangler 命令触发刷新，再重新提取 token |
| Phase 11 | Pages 构建报 wrangler.toml name mismatch | `wrangler.toml` 的 `name` 必须与 Pages 项目名（=仓库名）完全一致；改齐后 push 触发重建 |
| Phase 11 | API 建项目后 deployments 为空 | 正常——API 创建不自动构建；推空提交 `git commit --allow-empty` + push 触发首建 |
| Phase 11 | 自定义域名一直 `pending` | API 绑域名不建 DNS 记录（OAuth 也无 DNS 写权限）→ 用户 dashboard 点"激活域名"或手动加 CNAME → `<项目名>.pages.dev`（橙云）；另注意删旧 Pages 项目会连带删域名绑定 |
| Phase 11 | 构建日志报 pagefind / next 版本错误 | 检查 `deployment_configs` 是否设了 `NODE_VERSION=22`（Next 15 要求 Node ≥18.18，pagefind 1.5 要求 ≥18） |
| Phase 11 | API 建项目报 8000046 "invalid git provider. Input \"github\" or \"gitlab\"" | `source.type` 填了 `"git"`——**误导性报错**：它让你去找 provider 字段，实际该字段本身就该直接填 provider 名 `"github"`；不要在 config 里加 `provider` 键（加了没用还是报这个错） |
| Phase 11 | `https://www.<域名>` 返回 522 | Pages 只绑了 apex，SNI 不认 www 主机名 → 按 11.3 Step 2.5 把 www 也绑进项目 + www CNAME；canonical 已指向 apex，无重复内容风险 |
| Phase 11 | zones rulesets API 报 10405 "Method not allowed for this authentication scheme" | `.env.cf` 的 Edit-zone-DNS token 无 ruleset 写权限（做不了 zone 级 301）→ www 场景放弃重定向，改绑 Pages 域靠 canonical 归并 |
| Phase 12 | 403 ACCESS_TOKEN_SCOPE_INSUFFICIENT | token 只有 readonly：`node gsc-oauth-helper.mjs` 重新授权双 scope（refresh 无法扩权） |
| Phase 12 | OAuth 授权页"禁止访问：此应用的请求无效" | redirect_uri 端口未注册：回调端口必须 17890 |
| Phase 12 | Google API 404 "requested URL ... not found on this server" | 对 POST-only 端点发了 GET——方法不匹配报 404，别误判端点不存在，换 POST 重试 |
| Phase 12 | getToken 400 "The site '' of type SITE is invalid" | 参数传成了 query string——getToken 参数必须在 POST JSON body |
| Phase 12 | 403 SERVICE_DISABLED | GCP 项目未启用 Site Verification API：错误里带 activationUrl，用户点开启用，秒级生效后重试 |
| Phase 12 | webResource.insert 报验证失败 | TXT 未传播：先 DoH 查 TXT 是否可查，等 1-2 分钟重试 |
| Phase 12 | CF DNS API 403 / Authentication error | `.env.cf` 缺失或 token 无效：用 Edit zone DNS 模板重建（All zones，一劳永逸）；拿不到 token 该步降级为用户手动加 TXT |
| Phase 12 | PUT sites/ 或 sitemaps/ 返回 `<!DOCTYPE html>` 开头的 HTML（JSON.parse 报 "Unexpected token '<'"） | **HTTP 411 Length Required**——无 body 的 PUT 必须带 `-H "Content-Length: 0"`（见 12.1 Step 4 模板），成功返回 204 无 body |
| Phase 12 | index:inspect 响应里取不到 indexStatus 字段 | 字段名是 `indexStatusResult`（复数 Result，非 `indexStatus`）：`inspectionResult.indexStatusResult.coverageState`；`"URL is unknown to Google"` = 新站 day-0 正常基线，非错误 |
| Phase 12 | oauth2 token 端点换 access token 后 sed 提取为空 | 响应是**多行格式化 JSON**，sed 按行匹配不到——用 node 提取：`... \| node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>process.stdout.write(JSON.parse(d).access_token\|\|''))"` |
| 全局 | Windows 小写盘符 | 用大写盘符路径 `C:\project\...` 跑 vitest |
| 全局 | grep -P 在 Git Bash 报 "supports only unibyte and UTF-8 locales" | locale 怪癖：换 sed/普通 grep，或命令前缀 `LC_ALL=C.UTF-8` |
| 全局 | grep 小写 `fetchpriority` 0 命中 | React SSR 输出是 camelCase `fetchPriority`——按 `fetchPriority` 匹配或加 `-i` |

---

## 执行顺序约束

1. Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9 → Phase 10 → Phase 11 → Phase 12 **严格串行**
2. Phase 5/6/7/8/9/10/11/12 有验证小节；Phase 1-4 以 Phase 5 三绿门禁统一兜底（Phase 1-4 无独立 CHECKPOINT，错误延迟到 Phase 5 才暴露）
3. Phase 3 内部 Step 0 → Step 1 → Step 2 → Step 3 → Step 4 **严格串行**
4. Phase 7 / Phase 9 内部 P0 → P1 → P2 **按优先级串行**，P3 仅记录不执行；Phase 8 内部先 P0 清零再动 P1，**不跳级**
5. Phase 9 审计的 7 步工作流**不跳步**——可收录性有 critical 问题时先修再往下查
6. 每步修改后立即跑对应测试，不累积修改
7. Phase 11 部署前置 = Phase 10 实图化完成（不部署纯色占位站）；Phase 12 前置 = 自定义域名 HTTPS 200（Phase 11.4 验证清单已含 /sitemap.xml 200 检查）

---

## 输出物

完成后交付：

1. **完整的游戏攻略站代码**（通过三绿验证）
2. **关键词研究报告**（Markdown 格式，含竞争度分析）
3. **站点结构文档**（页面层级 + 关键词映射）
4. **SEO 审计报告**（Phase 5.1 门禁清单 + Phase 8 逐页 `docs/audits/*_AUDIT.md`（脚本评分 + checklist 三态记录）+ Phase 9 深度审计：Executive Summary + 分级 Findings + 行动计划）
5. **AI 搜索优化报告**（AI 可见性审计 + 三支柱评估 + 优先级修复清单）
6. **llms.txt 文件**（已部署到 `public/`）
7. **品牌图实图化说明**（截图来源 + appId、联络表选图依据（编号 → 页面语义）、生成参数与产物体积）
8. **后续运营建议**（P3 汇总：第三方存在感建设、GSC 验证 + sitemap 提交、外链建设、监控计划等）
9. **部署报告**（GitHub 私有仓库地址、Pages 生产 URL、自定义域名状态与验证结果、更新方式说明：`git push` master 即自动构建部署）
10. **GSC 配置报告**（资源 `sc-domain:<域名>` + 验证 owner、sitemap 提交时间、收录基线 0/N、收录监控命令 `GSC_SITE=sc-domain:<域名> node gsc-inspect.mjs`）

---

## 不要做什么

- ❌ 不要在模板目录就地换皮 — game-guide-template 是只读母版，新站必须 clone 到独立新目录（Step 0 红线 + 开工前置检查，dumbways 踩过被迫重建模板）
- ❌ 不要编造游戏数据 — 找不到真实数据就留空
- ❌ 不要跳过 site.test 验证 — 配置层改完必须跑测试
- ❌ 不要硬编码旧品牌词 — check:swap 会拦
- ❌ 不要省略 canonical — 权重分散
- ❌ 不要用 `npm run test` 当门禁 — 用 `npm run test:run`
- ❌ 不要在 `app/favicon.ico` 放文件 — 只放 `public/favicon.ico`
- ❌ 不要留未来日期 — 所有日期必须 ≤ 今天
- ❌ 不要忽略 SOP 步骤顺序 — 每步依赖前一步的验证结果
- ❌ 不要一次改太多文件 — 改完一批立即验证，避免错误累积
- ❌ 不要跳过 Schema 验证 — 用 Google Rich Results Test 校验
- ❌ 不要拿上一站 favicon 换色复用 — 源图必须按当前游戏的特色意象重新设计（Phase 6.1 问题清单）
- ❌ 不要在 favicon 里用细线条/小元素 — 32px 下会被抗锯齿吞掉，生成后必须目检 favicon-32x32.png
- ❌ 不要在实图化时改文件名或 site.config —— 6 件品牌图文件名是 siteId 缓存失效契约（site.test 守护），换内容不换名
- ❌ 不要从 og jpg 二次压缩 webp/jpg 变体 —— og 是 q92 有损母版，变体必须从源截图直出；只有 avif 走 og 派生链（`npm run hero:avif`）
- ❌ 不要在 robots.txt 里阻止 AI bot — 游戏攻略站需要被 AI 引用（GPTBot / ClaudeBot / PerplexityBot / Google-Extended 全部 Allow）
- ❌ 不要为 AI 写单独版本内容 — Google 明确禁止 scaled content abuse，写一份好内容同时服务人和 AI
- ❌ 不要在 AI SEO 审计后停下等确认 — P0/P1/P2 按优先级自动处理，只有 P3 留给用户决定
- ❌ 不要忽略 P0 修复 — robots.txt 阻止 AI bot 或 Schema 语法错误会导致整站不可被 AI 索引
- ❌ 不要跳过可收录性直接查 On-Page — 站点无法被爬取/索引时 On-Page 优化是白费（seo-audit 技能工作流顺序）
- ❌ 不要基于 web_fetch/curl 报"无 schema" — 它们剥离 script 标签必误报；静态导出 grep `out/` HTML，线上用 Rich Results Test
- ❌ 不要把 Phase 8/9 修复扩大到框架层 — 只改配置层 + 内容层；改不动的问题降级 P3 记录，不硬改
- ❌ 不要给 thin 实体页补占位数据凑数 — 数据缺失的页面要么砍掉要么留空（seo-audit STEP 5.3 + 本智能体数据诚实原则）
- ❌ 不要 grep `.tsx` 源码代替审计构建产物 — 源码通过 ≠ 产物通过，只对 `out/` HTML 跑脚本和 checklist（7deer seo-auditor 硬规则）
- ❌ 不要在 Phase 8 跳过 P0 直接修 P1 — 先四大件清零并重跑 audit_rules.js 验证，再动 P1
- ❌ 不要在单页 FAIL > 10 时继续逐项修 — 熔断只修 P0 重跑一轮（7deer seo-auditor STOP 规则）
- ❌ 不要删除 checklist 中不适用的条目 — 标 N/A + 原因即可，保留完整审计痕迹
- ❌ 不要在未验证生产 URL 全 200 前宣布部署完成 — 构建绿 ≠ 站点可访问，抽查 title 防裸 i18n key 上线
- ❌ 不要用 `tail`/`head` 截断 create/delete/deploy 等关键部署命令输出 — 截断会掩盖真实错误导致"假成功"（create 失败被吞 → deploy 报项目不存在，白绕一圈）；失败时拿完整输出，或用 `wrangler pages project list` 复核
- ❌ 不要回显、落盘或提交 wrangler OAuth token — 只在单条命令内引用；它有 pages:write 等敏感权限
- ❌ 不要硬编码 Cloudflare 账号 ID / 代理端口进项目文件 — 账号 ID 用 `wrangler whoami` 现查；代理端口以本机实际为准
- ❌ 不要在删除 Pages 项目后忘记重绑自定义域名 — 删项目连带删域名绑定，重建后必须重走 11.3
- ❌ 不要用 wrangler 直传当主部署方式 — 一律 Git 集成（push 即部署）；直传仅作备选且首次 create 记得 `--force`
- ❌ 不要用 readonly 凭据做 GSC 写入 — sites.add / sitemaps.submit / DNS TXT 验证全部 403；动手前 tokeninfo 验 scope，缺了先跑 `gsc-oauth-helper.mjs`
- ❌ 不要把 getToken 参数放 query string、不要用 GET 打 POST-only 端点 — Google 分别报误导性的 400 "The site '' invalid" / 404 "not found on this server"，照 12.1 的命令模板抄最稳
- ❌ 不要把 GSC OAuth 回调端口写成 17890 以外 — 该客户端只注册了 17890，否则授权页报"请求无效"
