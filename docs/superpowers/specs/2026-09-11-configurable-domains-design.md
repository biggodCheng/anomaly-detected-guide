# 设计：模板域可配置化（codex/milestones）+ scarlet-skips 语义迁移

- 日期：2026-09-11
- 状态：已批准（用户确认三个方向性决策后定稿）
- 影响仓库：game-guide-template（根治）、scarlet-skips-guide（首个迁移实践）

## 1. 问题

模板假设游戏有 monsters/bosses 概念。换皮到无此概念的游戏（如 Scarlet Skips：升级卡/结局）时，域被硬扭：

- URL 语义错位：`/monsters/score-multiplier`（升级卡页）、`/bosses/first-hundred`（100m 结局页）
- 锚文本错位：llms.txt 里 "Upgrade Cards (10)" 链向 `/monsters`、"Endings (7)" 链向 `/bosses`；导航、面包屑同病
- 字段名语义脱节：升级卡数据的 `weakness`=效果摘要、`weapon`=叠加性；结局数据的 `summonItem`=触发条件——靠数据文件顶部注释续命
- 遗留无用字段：`coOpTips`（合作提示）——单机游戏用不上

**时机**：站上线 1 天，Google 仅收录首页，39 个内页均未收录——现在换 URL 几乎零 SEO 成本（旧 URL 可能已从 sitemap 进入抓取队列，用 301 兜底）。

## 2. 目标 / 非目标

**目标**

1. 模板两个实体域的 URL 段、导航标签、i18n、schema、sitemap、llms.txt 全部由 `site.config` 驱动
2. 内部命名全面中性化（目录/组件/字段/i18n key），换皮不再需要语义映射注释
3. scarlet-skips-guide 迁移到 `/upgrades` `/endings`，旧 URL 301
4. 智能体（game-guide-builder）换皮流程文档同步更新

**非目标**

- 其余 6 个域（guides/regions/equipment/achievements/game/faq）不动——在 scarlet-skips 语义匹配
- 不做通用 N-collection 框架（各域页面形状本就不同，强行统一是过度设计）
- 其余 8 个 gamesweb 站不迁移（本设计即迁移指南，逐站执行）
- 模板示例内容不重写（默认值仍是 monsters/bosses 假设游戏）

## 3. 决策记录

| # | 决策 | 备选与否决理由 |
|---|------|--------------|
| D1 | 模板根治 + 当前站迁移（双仓同批） | 只修站点→下个站重做一遍；只改模板→错过零成本换 URL 窗口 |
| D2 | 域名可配置（保留两套页面形状），非通用 collection 框架 | regions/equipment/guides 各有专属页面形状，通用化要么丢功能要么过度设计 |
| D3 | 数据字段名随域名一起中性化 | 保留旧字段名则语义错位延续到未来 8 个站，与根治目标矛盾 |

## 4. 命名映射（模板与站点统一执行）

| 层 | 现状 | 新名（中性） | 说明 |
|---|------|------------|------|
| 域 1 目录 | `data/monsters/`、`components/monsters/` | `codex` | 实体图鉴域：列表页 + 属性表 + 详情攻略 |
| 域 1 字段 | `region` / `weakness` / `weapon` / `detail.huntGuide` | `zone` / `effect` / `stackable` / `detail.sections` | |
| 域 1 路由 | `app/[locale]/(main)/monsters/` | 并入 `[domain]` 动态段 | URL 由 config 决定 |
| 域 2 目录 | `data/bosses/`、`components/bosses/` | `milestones` | 里程碑挑战域：列表页 + 解锁条件 + 攻略 |
| 域 2 字段 | `region` / `summonItem` / `itemSource` / `coOpTips` | `zone` / `trigger` / `triggerHow`（`coOpTips` 删除） | 单机游戏无合作提示 |
| i18n key | `Monsters` / `MonsterDetail` / `Bosses` / `BossDetail` | `Codex` / `CodexDetail` / `Milestones` / `MilestoneDetail` | 标签值按站配置 |

## 5. 模板侧架构

### 5.1 配置

```ts
// config/site.config.ts 新增
domains: {
  codex:      { slug: 'monsters' },   // 默认值：有怪物/boss 的游戏不改
  milestones: { slug: 'bosses' },
}
```

### 5.2 路由

- `app/[locale]/(main)/monsters/{page.tsx,[slug]/page.tsx}` 与 `bosses/` 两套 → 合并为 `[domain]/page.tsx` + `[domain]/[slug]/page.tsx`
- `generateStaticParams` 枚举 config 两个域的 slug × 各自数据 slug；`dynamicParams = false`（非法域/非法 slug 404）
- 静态段（guides/regions/equipment/…）优先级天然高于动态段，无冲突
- 页面内部按 domain 分派到 codex/milestones 各自的渲染组件（页面形状不同，保持两套组件，仅路由统一）

### 5.3 派生面（全部改为从 config 读 pathPrefix）

sitemap、content-registry（pathPrefix）、llms.txt 生成、导航/侧边栏、首页 coreTopics、面包屑、schema、内链数据。

### 5.4 兼容性

模板默认值不变：build 产出 `/monsters/*` `/bosses/*`，模板自身测试与产物 URL 不变。

## 6. 站点侧迁移（scarlet-skips-guide）

1. 同步模板全部改动（目录改名、字段中性化、动态路由、config、i18n key）
2. `domains: { codex: { slug: 'upgrades' }, milestones: { slug: 'endings' } }`
3. 数据文件按新字段名改写（纯重命名，内容不动），删 `coOpTips`
4. `public/_redirects` 加两行：`/monsters/* /upgrades/:splat 301`、`/bosses/* /endings/:splat 301`（CF Pages 原生支持；sitemap 已提交 Google，旧 URL 可能已进抓取队列）
5. 部署后 GSC API 重新提交 sitemap（URL 全量变更）

新 URL：`/upgrades/score-multiplier`、`/endings/first-hundred`——与页面内容、锚文本、llms.txt 完全一致。

## 7. 智能体文档更新（game-guide-builder SKILL.md）

- 换皮流程新增"域名配置"步骤：新站第一步按游戏实际概念定 codex/milestones 的 slug 与标签
- 字段中性名说明表
- 迁移场景（存量站）：301 + GSC sitemap 重提步骤

## 8. 验收标准

**模板**：build 产出 `/monsters/*` `/bosses/*`（默认值）；全量测试绿。

**站点**：
- `/upgrades/*` `/endings/*` 全 200；`/monsters/*` `/bosses/*` 全 301
- 产物 grep 零 `monsters|bosses` 残留（并入 check:leaks 守卫）
- 全量测试绿；llms.txt / sitemap 全新 URL
- 线上 CF Pages 部署后逐项 curl 验证 + GSC sitemap 重提成功

## 9. 风险与缓解

| 风险 | 缓解 |
|------|------|
| `[domain]` 动态段误捕获其他路径 | `dynamicParams = false` + generateStaticParams 全枚举；测试覆盖非法域 404 |
| 字段重命名漏改引用 | 引用面已量化（3 页面 + 1 组件 + 数据 + 测试）；TS 编译期兜底 |
| Google 已抓旧 URL 造成重复收录 | 301 兜底 + sitemap 全量新 URL + GSC 重提 |
| 两仓并发操作冲突 | 每仓独立提交；推送前 fetch 检查远端（本会话已两次遇到并发提交） |
