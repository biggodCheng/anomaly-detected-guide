# 模板域可配置化（codex/milestones）+ scarlet-skips 语义迁移 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 模板两个实体域（monsters/bosses）改为 site.config 驱动的可配置域名（中性内部名 codex/milestones），scarlet-skips-guide 迁移到 `/upgrades` `/endings` 并对旧 URL 做 301。

**Architecture:** URL 段从 `site.config.json` 的 `domains.{codex,milestones}.slug` 派生（新 `lib/domain-slugs.ts`），路由合并为 `[domain]` 动态段（`dynamicParams=false` 全枚举静态导出），数据/组件/i18n 全面中性化命名，导航/注册表/sitemap/llms.txt 全部读派生路径。模板默认值不变（仍产出 `/monsters` `/bosses`），站点配置覆盖为 `upgrades/endings` + `public/_redirects` 301 + GSC sitemap 重提。

**Tech Stack:** Next.js 15（App Router、静态导出 `out/`）、next-intl、vitest、Cloudflare Pages（Git 集成 + `_redirects`）。

**Spec:** `docs/superpowers/specs/2026-09-11-configurable-domains-design.md`

**两仓约定：** 模板仓 `C:\project\fox\gamesweb\game-guide-template`（git remote origin/master，SSH 推送需代理）；站点仓 `C:\project\fox\gamesweb\scarlet-skips-guide`（同）。推送命令统一：
```bash
GIT_SSH_COMMAND='ssh -o ConnectTimeout=15 -o ProxyCommand="connect -H 127.0.0.1:7897 %h %p"' git push origin master
```
推送前先 `git fetch origin` 检查并发提交（本会话已两次遇到用户在其他会话提交）。

**测试基线：** 模板 `npm run validate`（= typecheck + lint + test:run + check:swap）+ `npm run build`；站点同构。vitest 必须从大写盘符路径运行（`C:/project/...`）。

---

## 命名映射总表（全程唯一参照，所有 task 共用）

### 目录 / 文件

| 现状 | 新名 |
|---|---|
| `data/monsters/` | `data/codex/`（`monsters.test.ts` → `codex.test.ts`） |
| `data/bosses/` | `data/milestones/`（`bosses.test.ts` → `milestones.test.ts`） |
| `components/monsters/monster-table.tsx` | `components/codex/codex-table.tsx` |
| `components/bosses/boss-card.tsx` | `components/milestones/milestone-card.tsx` |
| `app/[locale]/(main)/monsters/`、`bosses/` | 删除，并入 `app/[locale]/(main)/[domain]/` |

### 类型 / 导出 / 组件

| 现状 | 新名 |
|---|---|
| `Monster` / `MonstersData` / `enMonstersData` | `CodexEntry` / `CodexData` / `enCodexData` |
| `Boss` / `BossesData` / `enBossesData` | `Milestone` / `MilestoneData` / `enMilestonesData` |
| `getAllMonsters` / `getDetailedMonsters` / `getMonster` | `getAllCodex` / `getDetailedCodex` / `getCodexEntry` |
| `monsterWeaknessGuide` / `monsterNotes` | `codexGuide` / `codexNotes` |
| `getBossesData` / `getAllBosses` / `getBoss` | `getMilestonesData` / `getAllMilestones` / `getMilestone` |
| `MonsterTable` | `CodexTable`（props `monsters` → `entries`） |
| `BossCard` | `MilestoneCard`（props `boss` → `milestone`） |

### 数据字段

| 域 | 现状 | 新名 | 备注 |
|---|---|---|---|
| codex | `region` | `zone` | 类型 `RegionSlug` 不变 |
| codex | `weakness` | `effect` | |
| codex | `weapon` | `stackable` | |
| codex | `detail.huntGuide` | `detail.sections` | |
| codex | `value` | `value`（不变） | |
| milestones | `region` | `zone` | |
| milestones | `summonItem` | `trigger` | |
| milestones | `itemSource` | `triggerHow` | |
| milestones | `coOpTips` | **删除**（类型 + 页面渲染块 + i18n key） | 单机游戏；站点数据无值，模板示例数据同样删 |
| regions 跨域 | `monsterSlugs` / `bossSlugs` | `codexSlugs` / `milestoneSlugs` | `data/regions/en.ts` + 消费点 |

### i18n key（messages/en.json）

| 现状 | 新名 | 内部子 key 变化 |
|---|---|---|
| `Monsters` | `Codex` | `colWeakness`→`colEffect`、`colWeapon`→`colStackable`；其余不变 |
| `MonsterDetail` | `CodexDetail` | `region`→`zone`、`weakness`→`effect`、`recommendedWeapon`→`stackable`、`lastUpdated` 不变 |
| `Bosses` | `Milestones` | `colSummon`→`colTrigger`；`colRegion`/`colDifficulty`/`difficulty.*`/`allBosses`→`allMilestones` |
| `BossDetail` | `MilestoneDetail` | `summonGuide`→`triggerGuide`、`itemSource`→`triggerHow`、`otherBosses`→`otherMilestones`、`coOpTips` 删；其余不变 |
| `Nav.monsters` / `Nav.bosses` | `Nav.codex` / `Nav.milestones` | |
| `Sidebar.sections.monsters` / `.bosses` | `.codex` / `.milestones` | |
| `Breadcrumbs.monsters` / `.bosses` | `.codex` / `.milestones` | |

**明确不改**：`Home.*`（`coreMonsters`/`qMonsters` 等）与 latest-updates 的 `t('monster')`/`t('boss')` 标签 key —— 纯文案层，值按站配置，key 名改动面积大收益低（取舍记录于 spec 自审）。**例外**：站点迁移时若值仍是 "Monster"/"Boss" 文案，必须改为站点语义文案（见 Task 7）。

---

## Task 1: config + lib 派生层（模板）

**Files:**
- Modify: `config/site.config.json`
- Modify: `config/site.config.ts`
- Create: `lib/domain-slugs.ts`

- [ ] **Step 1.1: site.config.json 加 domains、改 codexHeader**

`config/site.config.json` 中 `"monstersHeader": "/images/monsters-emberquest-header.jpg",` 替换为：

```json
  "codexHeader": "/images/monsters-emberquest-header.jpg",
  "domains": {
    "codex": { "slug": "monsters" },
    "milestones": { "slug": "bosses" }
  },
```

（图片文件名不改——品牌资产，换站时本来就换。）

- [ ] **Step 1.2: site.config.ts 类型同步**

类型 `SiteConfig` 中 `monstersHeader: string` 替换为：

```ts
  /** /codex 域头图路径(public/ 相对)—— 换站时随品牌资产一起改(site.test 守护存在) */
  codexHeader: string
  /**
   * 两个实体域的 URL 段 —— 全站路由/导航/sitemap/llms.txt 的唯一来源。
   * 默认 monsters/bosses(有怪物与 boss 的游戏);无此概念的游戏改成
   * 实际概念(如 upgrades/endings),详见 docs/superpowers/specs/2026-09-11-configurable-domains-design.md
   */
  domains: {
    codex: { slug: string }
    milestones: { slug: string }
  }
```

实现对象 `siteConfig` 无需手动加（`...raw` 展开 JSON）。

- [ ] **Step 1.3: 新建 lib/domain-slugs.ts**

```ts
// 域 slug 派生 —— 全站 URL 段的唯一出口。
// 页面/导航/注册表/sitemap 一律 import 这里的函数,禁止手写 '/monsters' 字面量。
import { siteConfig } from '@/config/site.config'

export const codexSlug = (): string => siteConfig.domains.codex.slug
export const milestoneSlug = (): string => siteConfig.domains.milestones.slug
export const codexPath = (): string => `/${codexSlug()}`
export const milestonePath = (): string => `/${milestoneSlug()}`
export const codexEntryPath = (slug: string): string => `/${codexSlug()}/${slug}`
export const milestoneEntryPath = (slug: string): string => `/${milestoneSlug()}/${slug}`
```

- [ ] **Step 1.4: 消费点与测试同步（此 task 内 codexHeader 改名会红 2 处）**

```bash
grep -rn "monstersHeader" --include="*.ts" --include="*.tsx" app/ components/ config/ lib/
```
预期命中：`config/site.test.ts`（断言）、`app/[locale]/(main)/monsters/page.tsx`（img src）。全部改 `codexHeader`。（monsters/page.tsx 下个 task 会大改，此处只改名保编译。）

- [ ] **Step 1.5: 验证 + commit**

```bash
npx tsc --noEmit && npm run test:run -- site.test
```
预期：0 error、site.test 全绿。

```bash
git add config/site.config.json config/site.config.ts lib/domain-slugs.ts config/site.test.ts "app/[locale]/(main)/monsters/page.tsx"
git commit -m "feat(config): domains 域名配置 + lib/domain-slugs 派生层

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 2: 数据层中性化（模板，重命名风暴主体）

**Files:**
- Rename: `data/monsters/` → `data/codex/`（含测试改名）
- Rename: `data/bosses/` → `data/milestones/`（含测试改名）
- Modify: `data/regions/en.ts`、`data/regions/types.ts`（若有 monsterSlugs 定义）、`data/regions/regions.test.ts`
- Modify: 全部 import 消费点（Step 2.4 清单）

策略：先改类型定义，再让 `tsc` 报出全部引用错，逐文件修——比盲 sed 可靠。

- [ ] **Step 2.1: git mv 目录与测试文件**

```bash
git mv data/monsters data/codex
git mv data/codex/monsters.test.ts data/codex/codex.test.ts
git mv data/bosses data/milestones
git mv data/milestones/bosses.test.ts data/milestones/milestones.test.ts
```

- [ ] **Step 2.2: 改 codex 类型与字段（data/codex/en.ts 头部手改）**

类型定义改为：

```ts
export type CodexEntry = {
  slug: string
  name: string
  zone: RegionSlug
  effect: string
  stackable: string
  value?: string
  detail?: {
    published: string
    lastUpdated: string
    sections: ContentSection[]
  }
}

export type CodexData = TopicData & { entries: CodexEntry[] }

export const enCodexData: CodexData = {
  entries: [ ... ] // 数据数组 key monsters: → entries:
}
```

数据体字段名用 python 整词替换（`data/codex/en.ts`，只替换字段定义行与 `.field` 引用，不碰字符串值 `'region-1'` 等）：

```python
import io, re
p = 'data/codex/en.ts'
s = io.open(p, encoding='utf-8').read()
s = re.sub(r'^(\s*)region:', r'\1zone:', s, flags=re.M)          # 字段定义
s = re.sub(r'^(\s*)weakness:', r'\1effect:', s, flags=re.M)
s = re.sub(r'^(\s*)weapon:', r'\1stackable:', s, flags=re.M)
s = s.replace('huntGuide:', 'sections:')
s = s.replace('monsters:', 'entries:')                            # MonstersData 数组 key
s = s.replace('monsterWeaknessGuide', 'codexGuide').replace('monsterNotes', 'codexNotes')
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
```

尾部注释同步（`weakness ∈ {Fire, Ice}` 等示例说明改为 effect 口径）。

- [ ] **Step 2.3: 改 milestones 类型与字段（data/milestones/en.ts）**

```ts
export type Milestone = {
  slug: string
  name: string
  zone: RegionSlug
  difficulty: 'easy' | 'medium' | 'hard'
  unlockCondition: string
  trigger: string
  triggerHow: string
  published: string
  lastUpdated: string
  mechanics: ContentSection[]
  strategy: ContentSection[]
  rewards?: string[]
}

export type MilestoneData = {
  milestones: Milestone[]          // 数据数组 key bosses: → milestones:
  generalFormula: ContentSection[]
  rosterNote: string
}
```

python 同款替换：`region:`→`zone:`、`summonItem:`→`trigger:`、`itemSource:`→`triggerHow:`、`bosses:`→`milestones:`、`enBossesData`→`enMilestonesData`、`BossesData`→`MilestoneData`。**删除** `coOpTips` 类型行与所有含 `coOpTips` 的示例数据行（`grep -n coOpTips` 应只剩 0 处）。

- [ ] **Step 2.4: index.ts 导出函数改名 + tsc 驱动修消费点**

`data/codex/index.ts` 全文替换为：

```ts
// codex 内容:单语直接 re-export(扩语言时引 createLocaleRegistry)。
import { enCodexData, codexGuide, codexNotes } from './en'
import type { CodexEntry } from './en'

export type { CodexEntry, CodexData } from './en'

export const getAllCodex = (): CodexEntry[] => enCodexData.entries
export const getDetailedCodex = (): CodexEntry[] => enCodexData.entries.filter((e) => e.detail)
export const getCodexEntry = (slug: string): CodexEntry | undefined => enCodexData.entries.find((e) => e.slug === slug)
export { codexGuide, codexNotes }
```

`data/milestones/index.ts` 同理：

```ts
// milestones 内容:单语直接 re-export(扩语言时引 createLocaleRegistry)。
import { enMilestonesData } from './en'
import type { Milestone } from './en'

export type { Milestone, MilestoneData } from './en'

export const getMilestonesData = () => enMilestonesData
export const getAllMilestones = (): Milestone[] => enMilestonesData.milestones
export const getMilestone = (slug: string): Milestone | undefined =>
  enMilestonesData.milestones.find((m) => m.slug === slug)
```

然后：

```bash
npx tsc --noEmit 2>&1 | head -60
```

按报错清单修以下消费点（import 路径 `@/data/monsters`→`@/data/codex`、`@/data/bosses`→`@/data/milestones`，函数/字段按映射表）：

| 文件 | 要点 |
|---|---|
| `components/monsters/monster-table.tsx` | 本 task 只改 import/字段引用保编译；组件改名在 Task 3 |
| `components/home/featured-entities.tsx` | `getMonster`→`getCodexEntry`、`getBoss`→`getMilestone`；`featuredEntities.monsters`/`.bosses` 数据 key 对应 `data/homepage.ts` 同步改 `codex`/`milestones`；对象内 `weakness`/`difficulty` 展示字段随数据 |
| `components/home/latest-updates.tsx` | `getAllBosses`→`getAllMilestones`、`getDetailedMonsters`→`getDetailedCodex`、`b.summonItem` 等字段引用、href 字面量本 task 暂不动（Task 4 config 化） |
| `data/homepage.ts` | `import { getMonster } from './monsters'` → `import { getCodexEntry } from './codex'`；featured picks 结构 key `monsters:`→`codex:`、`bosses:`→`milestones:`；heroStats id `monsters`/`bosses` **保留**（Home.* 文案 key 不改名，见总表） |
| `app/[locale]/(main)/regions/[slug]/page.tsx` | `region.monsterSlugs`→`region.codexSlugs`、`region.bossSlugs`→`region.milestoneSlugs`；`m.weakness`→`m.effect`、`m.weapon`→`m.stackable`；`getBoss`/`getMonster` 改名；本 task 不动 messages namespace 引用（Task 4） |
| `data/regions/en.ts`（+types） | `monsterSlugs:`→`codexSlugs:`、`bossSlugs:`→`milestoneSlugs:` 字段定义与全部值 |
| `data/content-registry.ts` | import 改 `./codex`/`./milestones`，函数改名；pathPrefix 本 task 暂保留字面量（Task 4 改派生） |
| `data/llms-txt.test.ts`、`data/content-dates.test.ts`、`data/internal-links.test.ts`、`lib/alternates.test.ts`、`lib/seo.test.ts`、`lib/site.test.ts`、`lib/date.test.ts` | import 路径 + 函数/字段名按映射表；**URL 断言值不变**（默认 slug 仍是 monsters/bosses） |
| `data/monsters`→codex、`bosses`→milestones 的两个测试文件 | 断言字段名同步（`u.region`→`u.zone` 等），文件内 `Monster` 类型引用改 `CodexEntry` |

- [ ] **Step 2.5: 验证 + commit**

```bash
npx tsc --noEmit && npm run test:run
```
预期：0 error；全部测试绿（URL 类断言因默认 slug 不变而绿）。

```bash
git add -A data/ components/ app/ lib/ messages/ config/
git commit -m "refactor(data): monsters/bosses 域中性化为 codex/milestones(类型/字段/函数)

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 3: 路由合并为 [domain] 动态段（模板）

**Files:**
- Delete: `app/[locale]/(main)/monsters/`、`app/[locale]/(main)/bosses/`
- Create: `app/[locale]/(main)/[domain]/page.tsx`
- Create: `app/[locale]/(main)/[domain]/[slug]/page.tsx`
- Create: `components/codex/codex-hub.tsx`、`components/codex/codex-detail.tsx`（从原 monsters 页面主体搬移）
- Create: `components/milestones/milestones-hub.tsx`、`components/milestones/milestone-detail.tsx`（从原 bosses 页面主体搬移）
- Rename: `components/monsters/monster-table.tsx` → `components/codex/codex-table.tsx`；`components/bosses/boss-card.tsx` → `components/milestones/milestone-card.tsx`

- [ ] **Step 3.1: 组件搬移与改名**

```bash
git mv components/monsters/monster-table.tsx components/codex/codex-table.tsx
git mv components/bosses/boss-card.tsx components/milestones/milestone-card.tsx
rmdir components/monsters components/bosses
```

`codex-table.tsx`：`MonsterTable`→`CodexTable`、props `monsters`→`entries`、内部 `m.weakness`→`m.effect`、`m.weapon`→`m.stackable`、`m.region`→`m.zone`。
`milestone-card.tsx`：`BossCard`→`MilestoneCard`、props `boss`→`milestone`、字段引用同步（`boss.summonItem`→`milestone.trigger` 等）。

- [ ] **Step 3.2: hub 组件化（原 page.tsx 主体 → 组件）**

`components/codex/codex-hub.tsx`（从 `app/[locale]/(main)/monsters/page.tsx` 的 default export 搬移，签名改为接收 locale）：

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CodexTable } from '@/components/codex/codex-table'
import { GuideSection } from '@/components/guides/guide-section'
import { Breadcrumb } from '@/components/seo/breadcrumb'
import { codexGuide, codexNotes, getAllCodex } from '@/data/codex'
import { getAllRegions } from '@/data/regions'
import { siteConfig } from '@/config/site.config'
import { codexPath } from '@/lib/domain-slugs'

export async function CodexHub({ locale }: { locale: string }) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Codex.index' })
  const regions = getAllRegions().map((r) => ({ slug: r.slug, name: r.name }))
  const entries = getAllCodex().map((m) => ({
    slug: m.slug,
    name: m.name,
    zone: m.zone,
    zoneName: regions.find((r) => r.slug === m.zone)?.name ?? m.zone,
    effect: m.effect,
    stackable: m.stackable,
    hasDetail: Boolean(m.detail),
  }))
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb locale={locale} parents={[]} leaf={t('title')} path={codexPath()} />
      <h1 className="font-display text-3xl font-bold tracking-tight">🦇 {t('title')}</h1>
      <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">{t('intro')}</p>

      <div className="mt-8 overflow-hidden rounded-xl border border-[var(--color-border)] shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element -- 静态导出站无 image loader，宽高已显式声明 */}
        <img
          src={siteConfig.codexHeader}
          alt={`${siteConfig.game.name} - ${t('title')}`}
          width={1200}
          height={400}
          loading="lazy"
          decoding="async"
          className="w-full object-cover"
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold">{t('tableTitle')}</h2>
        <CodexTable entries={entries} regions={regions} />
      </section>

      {[...codexGuide, ...codexNotes].map((s, i) => (
        <GuideSection key={i} section={s} />
      ))}
    </div>
  )
}
```

（注意：原文件 namespace `'Monsters'` → `'Codex'`；img alt 原来是硬编码英文，改为 `t('title')` 避免站点语义错位复发。）

`components/milestones/milestones-hub.tsx` 同法从 `bosses/page.tsx` 搬：签名 `({ locale }: { locale: string })`，namespace `'Bosses.index'`→`'Milestones.index'`，`getBossesData()`→`getMilestonesData()`，`data.bosses`→`data.milestones`，`BossCard`→`MilestoneCard`，Breadcrumb path 用 `milestonePath()`，`t('allBosses')`→`t('allMilestones')`。

- [ ] **Step 3.3: 详情组件化**

`components/codex/codex-detail.tsx`（从 `monsters/[slug]/page.tsx` 主体搬）与 `components/milestones/milestone-detail.tsx`（从 `bosses/[slug]/page.tsx` 204 行主体搬），签名 `{ locale: string; slug: string }`。同时导出 metadata 构造：

```tsx
// codex-detail.tsx 尾部
export function codexDetailMetadata(locale: string, slug: string): Promise<Metadata> | Metadata { ... }
```

搬移要点（两文件同规则）：
- namespace `'MonsterDetail'`→`'CodexDetail'`、`'BossDetail'`→`'MilestoneDetail'`、`'Bosses.index'`→`'Milestones.index'`
- 字段引用按映射表（`m.region`→`m.zone`、`boss.summonItem`→`milestone.trigger`、`boss.itemSource`→`milestone.triggerHow`）
- 路径字面量 `/monsters/${slug}`→`codexEntryPath(slug)`、`/bosses/${slug}`→`milestoneEntryPath(slug)`、`/monsters`→`codexPath()`
- i18n 调用 `t('region')`→`t('zone')`、`t('weakness')`→`t('effect')`、`t('recommendedWeapon')`→`t('stackable')`、`t('colSummon')`→`t('colTrigger')`、`t('itemSource')`→`t('triggerHow')`、`t('summonGuide')`→`t('triggerGuide')`、`t('otherBosses')`→`t('otherMilestones')`
- **删除** `boss.coOpTips` 渲染块（`{boss.coOpTips && (...blockquote...)}` 整段）
- codex 详情的 weapon 链接原指向 `/equipment/weapons` —— 保留（模板有此页）；scarlet-skips 侧该链接见 Task 6 站点适配
- milestone 详情的 `unlockCondition`、`difficulty`、`mechanics`/`strategy`/`rewards` 渲染逻辑原样保留

- [ ] **Step 3.4: [domain] 动态路由（两页面文件全文）**

`app/[locale]/(main)/[domain]/page.tsx`：

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { CodexHub } from '@/components/codex/codex-hub'
import { MilestonesHub } from '@/components/milestones/milestones-hub'
import { alternatesFor } from '@/lib/alternates'
import { buildOpenGraph, buildTwitterCard } from '@/lib/seo'
import { codexSlug, milestoneSlug } from '@/lib/domain-slugs'

// 只导出枚举的域;其余一级路径 404(静态段 guides/regions 等优先级天然高于本动态段)
export const dynamicParams = false

export function generateStaticParams() {
  return [{ domain: codexSlug() }, { domain: milestoneSlug() }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; domain: string }>
}): Promise<Metadata> {
  const { locale, domain } = await params
  const ns = domain === codexSlug() ? 'Codex.index' : domain === milestoneSlug() ? 'Milestones.index' : null
  if (!ns) return {}
  const t = await getTranslations({ locale, namespace: ns })
  const title = t('metaTitle')
  const description = t('metaDescription')
  return {
    alternates: alternatesFor(locale, `/${domain}`),
    title,
    description,
    openGraph: buildOpenGraph({ locale, path: `/${domain}`, title, description }),
    twitter: buildTwitterCard({ title, description }),
  }
}

export default async function DomainHubPage({
  params,
}: {
  params: Promise<{ locale: string; domain: string }>
}) {
  const { locale, domain } = await params
  if (domain === codexSlug()) return <CodexHub locale={locale} />
  if (domain === milestoneSlug()) return <MilestonesHub locale={locale} />
  notFound()
}
```

`app/[locale]/(main)/[domain]/[slug]/page.tsx`：

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CodexDetail, codexDetailMetadata } from '@/components/codex/codex-detail'
import { MilestoneDetail, milestoneDetailMetadata } from '@/components/milestones/milestone-detail'
import { getDetailedCodex } from '@/data/codex'
import { getAllMilestones } from '@/data/milestones'
import { codexSlug, milestoneSlug } from '@/lib/domain-slugs'

export const dynamicParams = false

export function generateStaticParams() {
  return [
    ...getDetailedCodex().map((e) => ({ domain: codexSlug(), slug: e.slug })),
    ...getAllMilestones().map((m) => ({ domain: milestoneSlug(), slug: m.slug })),
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; domain: string; slug: string }>
}): Promise<Metadata> {
  const { locale, domain, slug } = await params
  if (domain === codexSlug()) return codexDetailMetadata(locale, slug)
  if (domain === milestoneSlug()) return milestoneDetailMetadata(locale, slug)
  return {}
}

export default async function DomainDetailPage({
  params,
}: {
  params: Promise<{ locale: string; domain: string; slug: string }>
}) {
  const { locale, domain, slug } = await params
  if (domain === codexSlug()) return <CodexDetail locale={locale} slug={slug} />
  if (domain === milestoneSlug()) return <MilestoneDetail locale={locale} slug={slug} />
  notFound()
}
```

- [ ] **Step 3.5: 删除旧路由目录**

```bash
git rm -r "app/[locale]/(main)/monsters" "app/[locale]/(main)/bosses"
```

- [ ] **Step 3.6: 验证 + commit**

```bash
npx tsc --noEmit && npm run test:run && npm run build
```
预期：0 error、测试绿、build 产物 `out/monsters.html`、`out/bosses.html` 与子页全部存在（默认 slug 不变，URL 零变化）：

```bash
ls out/monsters.html out/bosses.html out/monsters/ | head -5
```

```bash
git add -A app/ components/
git commit -m "refactor(routes): monsters/bosses 两套路由合并为 [domain] 动态段(config 驱动)

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 4: 派生面 config 化 + i18n key 改名（模板）

**Files:**
- Modify: `config/navigation.config.ts`
- Modify: `data/content-registry.ts`
- Modify: `app/not-found.tsx`
- Modify: `data/guides/deep-dives.ts`
- Modify: `components/home/latest-updates.tsx`、`components/home/featured-entities.tsx`（href 字面量改派生）
- Modify: `messages/en.json`

- [ ] **Step 4.1: navigation.config.ts**

顶部加 import：`import { codexPath, milestonePath } from '@/lib/domain-slugs'`

`NAV_SECTIONS` 改动（其余 section 不动）：

```ts
  {
    id: 'codex',
    items: [
      { href: codexPath(), labelKey: 'codex', surfaces: ['header', 'footer', 'sidebar'], footerColumn: 'reference' },
    ],
  },
  // ...regions section 原样...
  {
    id: 'milestones',
    items: [
      { href: milestonePath(), labelKey: 'milestones', surfaces: ['header', 'footer', 'sidebar'], footerColumn: 'reference' },
    ],
  },
```

`NAV_HUBS` 改：

```ts
export const NAV_HUBS = {
  guides: '/guides',
  codex: codexPath(),
  regions: '/regions',
  milestones: milestonePath(),
  equipment: '/equipment',
  multiplayer: '/multiplayer',
  economy: '/economy',
  troubleshooting: '/troubleshooting',
  game: '/game',
} as const

export type NavHubKey = keyof typeof NAV_HUBS
```

面包屑消费点（`components/seo/breadcrumb.tsx` 及页面 `parents={['monsters']}`/`parents={['bosses']}`）key 同步改 `'codex'`/`'milestones'`（grep 确认：`grep -rn "parents={\['monsters'\]}\|parents={\['bosses'\]}" app/ components/`）。

- [ ] **Step 4.2: content-registry.ts 派生化**

```ts
import { getDetailedCodex } from './codex'
import { getAllMilestones } from './milestones'
import { getAllRegions } from './regions'
import { codexPath, milestonePath } from '@/lib/domain-slugs'

export const contentDomains: ContentDomain[] = [
  { pathPrefix: codexPath(), slugs: () => getDetailedCodex().map((e) => e.slug) },
  { pathPrefix: milestonePath(), slugs: () => getAllMilestones().map((m) => m.slug) },
  { pathPrefix: '/regions', slugs: () => getAllRegions().map((r) => r.slug) },
]
```

- [ ] **Step 4.3: 消费点 href 派生化**

- `app/not-found.tsx`：`{ href: '/monsters', label: 'All Monsters' }` → `{ href: codexPath(), label: 'All Monsters' }`（文案是模板示例，保留）；`'/bosses'` → `milestonePath()`
- `data/guides/deep-dives.ts`：import 派生函数，`href: '/monsters'` → `href: codexPath()`、`'/monsters/ash-wolf'` → `codexEntryPath('ash-wolf')`、`'/bosses'`/`'/bosses/magma-tyrant'` 同理
- `components/home/latest-updates.tsx`：`href: \`/bosses/${b.slug}\`` → `milestoneEntryPath(b.slug)`、`/monsters/${m.slug}` → `codexEntryPath(m.slug)`
- `components/home/featured-entities.tsx`：`localePath(locale, \`/monsters/${m.slug}\`)` → `localePath(locale, codexEntryPath(m.slug))`、bosses 同理
- `app/[locale]/(main)/regions/[slug]/page.tsx:136`：`href={localePath(locale, \`/monsters/${m.slug}\`)}` → `localePath(locale, codexEntryPath(m.slug))`（Task 3 质量评审发现：internal-links.test 不扫 app/，此前漏网）
- `data/homepage.ts:19,21,30`：coreTopics 的 `href: '/monsters'`→`codexPath()`、`'/bosses'`→`milestonePath()`；popularQuestions 的 `'/monsters'`→`codexPath()`（三处均为 hub 链接，无 entry 链接；同上漏网，数据文件不在 internal-links.test 扫描范围。`as const` 保留——href 消费方只当 string 用）

- [ ] **Step 4.4: messages/en.json key 改名**

按总表执行 4 组改名 + 子 key 变化 + `Nav`/`Sidebar.sections`/`Breadcrumbs` 的 monsters/bosses→codex/milestones。python 脚本（JSON 级操作，别用文本替换）：

```python
import io, json
p = 'messages/en.json'
d = json.load(io.open(p, encoding='utf-8'))
d['Codex'] = d.pop('Monsters')
d['Codex']['index']['colEffect'] = d['Codex']['index'].pop('colWeakness')
d['Codex']['index']['colStackable'] = d['Codex']['index'].pop('colWeapon')
d['CodexDetail'] = {'zone': d['MonsterDetail'].pop('region'),
                    'effect': d['MonsterDetail'].pop('weakness'),
                    'stackable': d['MonsterDetail'].pop('recommendedWeapon'),
                    'lastUpdated': d['MonsterDetail']['lastUpdated']}
del d['MonsterDetail']
d['Milestones'] = d.pop('Bosses')
d['Milestones']['index']['colTrigger'] = d['Milestones']['index'].pop('colSummon')
d['Milestones']['index']['allMilestones'] = d['Milestones']['index'].pop('allBosses')
bd = d.pop('BossDetail')
bd.pop('coOpTips')
bd['triggerHow'] = bd.pop('itemSource')
bd['triggerGuide'] = bd.pop('summonGuide')
bd['otherMilestones'] = bd.pop('otherBosses')
d['MilestoneDetail'] = bd
d['Nav']['codex'] = d['Nav'].pop('monsters')
d['Nav']['milestones'] = d['Nav'].pop('bosses')
d['Sidebar']['sections']['codex'] = d['Sidebar']['sections'].pop('monsters')
d['Sidebar']['sections']['milestones'] = d['Sidebar']['sections'].pop('bosses')
d['Breadcrumbs']['codex'] = d['Breadcrumbs'].pop('monsters')
d['Breadcrumbs']['milestones'] = d['Breadcrumbs'].pop('bosses')
io.open(p, 'w', encoding='utf-8', newline='\n').write(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
```

注意：`Codex.index` 里若有其他 monster 措辞 key（如 `intro` 文案），**值保留**（模板示例文案，Task 5 站点才换语义文案）。

- [ ] **Step 4.5: 验证 + commit**

```bash
npx tsc --noEmit && npm run validate && npm run build
```
预期：全绿（messages.test 的双向 key 守护会抓漏改的 namespace 引用——如有红，按报错补）；build 产物 URL 与 Task 3 相同零变化。

```bash
git add -A
git commit -m "refactor(nav/i18n): 导航/注册表/内链/面包屑读 domain-slugs;i18n 4 组 key 中性化

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 5: 模板收口验证（模板）

- [ ] **Step 5.1: 全链验证**

```bash
npm run validate && npm run build
```
预期：validate 四项全绿；build 后执行：

```bash
ls out/monsters.html out/bosses.html && grep -c "monsters\|bosses" out/sitemap.xml
```
预期：两个 hub 页存在；sitemap 含 monsters/bosses URL（默认值未漂移）。

- [ ] **Step 5.2: 模板仓推送**

```bash
git fetch origin && git status -sb   # 确认无并发提交,若 behind 先 rebase
GIT_SSH_COMMAND='ssh -o ConnectTimeout=15 -o ProxyCommand="connect -H 127.0.0.1:7897 %h %p"' git push origin master
```

---

## Task 6: 站点框架同步 + 数据中性化（scarlet-skips-guide）

站点与模板已分叉（站点无 economy/multiplayer/troubleshooting 域、bosses 数据结构有 `heightRequired`/`description` 额外字段）——**数据文件禁止 cp（会丢真实内容），只 cp 框架文件**。

**Files（站点仓根 `C:\project\fox\gamesweb\scarlet-skips-guide`）:**
- Create: `lib/domain-slugs.ts`（从模板原样 cp）
- Create: `app/[locale]/(main)/[domain]/page.tsx`、`[domain]/[slug]/page.tsx`（从模板原样 cp）
- Create: `components/codex/codex-hub.tsx`、`codex-detail.tsx`、`codex-table.tsx`、`components/milestones/milestones-hub.tsx`、`milestone-detail.tsx`、`milestone-card.tsx`（从模板 cp 后做 Step 6.3 站点适配）
- Rename: `data/monsters/`→`data/codex/`、`data/bosses/`→`data/milestones/`（git mv，en.ts 手术保留内容）
- Delete: `app/[locale]/(main)/monsters/`、`bosses/`

- [ ] **Step 6.1: cp 框架 + git mv 数据目录**

```bash
cd C:/project/fox/gamesweb/scarlet-skips-guide
cp ../game-guide-template/lib/domain-slugs.ts lib/
mkdir -p "app/[locale]/(main)/[domain]/[slug]" components/codex components/milestones
cp "../game-guide-template/app/[locale]/(main)/[domain]/page.tsx" "app/[locale]/(main)/[domain]/page.tsx"
cp "../game-guide-template/app/[locale]/(main)/[domain]/[slug]/page.tsx" "app/[locale]/(main)/[domain]/[slug]/page.tsx"
cp ../game-guide-template/components/codex/*.tsx components/codex/
cp ../game-guide-template/components/milestones/*.tsx components/milestones/
git rm -r "app/[locale]/(main)/monsters" "app/[locale]/(main)/bosses"
rmdir components/monsters components/bosses 2>/dev/null || true
git mv data/monsters data/codex && git mv data/codex/monsters.test.ts data/codex/codex.test.ts
git mv data/bosses data/milestones && git mv data/milestones/bosses.test.ts data/milestones/milestones.test.ts
```

- [ ] **Step 6.2: 数据文件字段改写（保留全部内容值）**

`data/codex/en.ts` python 脚本（模板 Step 2.2 同款 + 站点数据特有 key）：

```python
import io, re
p = 'data/codex/en.ts'
s = io.open(p, encoding='utf-8').read()
s = re.sub(r'^(\s*)region:', r'\1zone:', s, flags=re.M)
s = re.sub(r'^(\s*)weakness:', r'\1effect:', s, flags=re.M)
s = re.sub(r'^(\s*)weapon:', r'\1stackable:', s, flags=re.M)
s = s.replace('huntGuide:', 'sections:')
s = s.replace('upgrades:', 'entries:')        # 站点 MonstersData 数组 key 是 upgrades(见 en.ts 现状)
s = s.replace('UpgradesData', 'CodexData').replace('enUpgradesData', 'enCodexData')
s = re.sub(r'\bUpgrade\b', 'CodexEntry', s)   # 类型 Upgrade → CodexEntry(词边界,避免误伤 Upgrades 复数)
s = s.replace('monsterWeaknessGuide', 'codexGuide').replace('monsterNotes', 'codexNotes')
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
```

⚠️ 站点 `data/monsters/index.ts` 导出名与模板不同（`getAllUpgrades`/`getUpgrade`/`getAllMonsters`——以现状 grep 为准），按映射表终态重写为模板 Step 2.4 的 index.ts 内容（函数名 `getAllCodex`/`getDetailedCodex`/`getCodexEntry`）。

`data/milestones/en.ts` 同款：`region:`→`zone:`、`summonItem:`→`trigger:`、`itemSource:`→`triggerHow:`、`endings:`→`milestones:`、`EndingsData`→`MilestoneData`、`enEndingsData`→`enMilestonesData`、`re.sub(r'\bEnding\b', 'Milestone', s)`（词边界，先换长的 Data/数据名再换单数类型名）；`coOpTips` 行删除（已确认站点无值，仅类型行 24）；保留站点特有字段 `heightRequired`/`description`。`data/milestones/index.ts` 重写为模板同款（`getMilestonesData`/`getAllMilestones`/`getMilestone`）。

- [ ] **Step 6.3: cp 组件的站点适配（语义差异清单）**

模板 cp 来的 6 个组件按站点语义调整：

| 组件 | 适配点 |
|---|---|
| `codex-hub.tsx` | emoji `🦇`→`🔥`（升级卡）；alt 用 `t('title')` 已在模板处理 |
| `codex-detail.tsx` | 模板 weapon 链接 `/equipment/weapons` 站点不存在 → 改纯文本（去 Link）或按站点 equipment 结构链接；title 硬编码 "How to Find & Kill"→ 站点语义（升级卡名 + "Guide"） |
| `milestone-detail.tsx` | title "How to Beat {name}" → 站点语义（"{name} Ending Guide"）；summon 链接 `/equipment/potions` 站点不存在 → 同上处理；相关链接区 `triggerGuide` 文案值在 messages 改 |
| 两个测试文件 | 字段断言按新名（站点测试断言 `u.region`→`u.zone`、`weakness.length`→`effect.length` 等） |

站点原 `data/monsters/index.ts` 里若有 `monsterWeaknessGuide` 重导出（`export const monsterWeaknessGuide = enUpgradesData.sections`）→ 改 `codexGuide`。

- [ ] **Step 6.4: 消费点同步（与模板 Step 2.4 同清单，站点版）**

```bash
npx tsc --noEmit 2>&1 | head -60
```
按报错修：`components/home/featured-entities.tsx`、`latest-updates.tsx`、`data/homepage.ts`、`app/[locale]/(main)/regions/[slug]/page.tsx`、`data/regions/en.ts`（`monsterSlugs`→`codexSlugs`、`bossSlugs`→`milestoneSlugs`）、`data/content-registry.ts`、`data/llms-txt.test.ts`、`data/content-dates.test.ts`、`data/internal-links.test.ts`、`lib/*.test.ts`。站点 `data/content-dates.ts` 的 `topicDates` 无 monsters 路径（grep 确认），预期不动。

- [ ] **Step 6.5: 站点导航/注册表/i18n 同步（模板 Task 4 同款，站点文案）**

执行模板 Step 4.1-4.4 的站点版：`config/navigation.config.ts`（站点 NAV_SECTIONS 结构可能与模板不同——以站点现状为准改 monsters/bosses 两个 section 与 NAV_HUBS）、`data/content-registry.ts`、`app/not-found.tsx`（标签文案改站点语义 "All Upgrades"/"Endings"）、`data/guides/deep-dives.ts`（站点内链文案——升级卡/结局）、`components/home/*` href 派生化、`messages/en.json` python 脚本（模板 Step 4.4 同款）+ **标签值换站点语义**：

| key | 站点值（示例，按站点现有文案风格定稿） |
|---|---|
| `Nav.codex` | `Upgrades` |
| `Nav.milestones` | `Endings` |
| `Sidebar.sections.codex` | `Upgrade Cards` |
| `Sidebar.sections.milestones` | `Endings` |
| `Breadcrumbs.codex`/`.milestones` | `Upgrades`/`Endings` |
| `Codex.index.title` 等 | 站点现有 Monsters.index 的标题文案改为 Upgrade 口径（如 "All Upgrade Cards"） |
| `MilestoneDetail.triggerGuide` | 站点语义链接文案（如 "All Endings & Requirements"，指向适配后的相关链接目标） |

- [ ] **Step 6.6: 站点 config 配 upgrades/endings + 301 + leaks**

`config/site.config.json`：

```json
  "domains": {
    "codex": { "slug": "upgrades" },
    "milestones": { "slug": "endings" }
  },
```
（`monstersHeader`→`codexHeader` 同步改名。）

新建 `public/_redirects`（CF Pages 原生 301）：

```
/monsters/* /upgrades/:splat 301
/bosses/* /endings/:splat 301
```

`scripts/check-internal-leaks.mjs` 的词表（grep `LEAK_PATTERNS\|patterns\|TERMS` 定位）追加 `monsters`、`bosses`（站点语义残留守卫——产物 URL 已无此词，出现即红）。

- [ ] **Step 6.7: llms.txt 手改**

`public/llms.txt` 全部 `/monsters`→`/upgrades`、`/bosses`→`/endings`（sed 或手改；`llms-txt.test.ts` 的 validPaths 守卫会验证对齐）。分组标题已是 "Upgrade Cards"/"Endings"，无需改。

- [ ] **Step 6.8: 验证 + commit**

```bash
npx tsc --noEmit && npm run test:run && npm run build
```
预期：全绿；产物断言：

```bash
ls out/upgrades.html out/endings.html out/upgrades/ out/endings/ | head -8
grep -ril "monsters\|bosses" out/*.html out/upgrades out/endings out/sitemap.xml out/llms.txt || echo "全产物零残留 (clean)"
grep -o "/upgrades/[a-z-]*" out/llms.txt | head -3
```
预期：新 URL 页面齐、sitemap 零旧词、llms.txt 新路径。

```bash
git add -A
git commit -m "feat(domains): 实体域迁移 monsters→upgrades / bosses→endings(config 驱动 + 301)

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 7: 站点部署 + 线上验证 + GSC 重提

- [ ] **Step 7.1: 推送触发 CF Pages 构建**

```bash
git fetch origin && git status -sb
GIT_SSH_COMMAND='ssh -o ConnectTimeout=15 -o ProxyCommand="connect -H 127.0.0.1:7897 %h %p"' git push origin master
```

- [ ] **Step 7.2: 线上逐项验证（构建约 2-3 分钟，sleep 150 后 curl）**

```bash
sleep 150
for u in /upgrades /upgrades/score-multiplier /endings /endings/first-hundred; do
  echo "$u -> $(curl -s --proxy http://127.0.0.1:7897 -o /dev/null -w '%{http_code}' https://scarletskips.fun$u)"
done
for u in /monsters /monsters/score-multiplier /bosses /bosses/first-hundred; do
  echo "$u -> $(curl -s --proxy http://127.0.0.1:7897 -o /dev/null -w '%{http_code} -> %{redirect_url}' https://scarletskips.fun$u)"
done
curl -s --proxy http://127.0.0.1:7897 https://scarletskips.fun/sitemap.xml | grep -c "upgrades\|endings"
```
预期：新 URL 全 200；旧 URL 全 301 且 Location 指向新路径；sitemap 含新 URL、零旧 URL。

- [ ] **Step 7.3: GSC sitemap 重提（凭据在 marketingskills-main/gsc_config）**

```bash
cd C:/project/fox/gamesweb/game-guide-template/.claude/skills/marketingskills-main/gsc_config
bash gsc.sh refresh
# 重提 = PUT sitemap（幂等；内容变化 Google 会重新抓取）
curl -s --proxy http://127.0.0.1:7897 -X PUT \
  -H "Authorization: Bearer $(grep -o 'access_token[^,]*' .env.gsc.access | cut -d'"' -f3)" \
  "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Ascarletskips.fun/sitemaps/https%3A%2F%2Fscarletskips.fun%2Fsitemap.xml" -o /dev/null -w '%{http_code}\n'
```
预期：204。（若 token 结构不同，按 `gsc-inspect.mjs` 现读法取 token。）

---

## Task 8: 智能体文档更新（game-guide-builder SKILL.md，模板仓）

**Files:**
- Modify: `.agent/skills/game-guide-builder/SKILL.md`（当前 v1.6）

- [ ] **Step 8.1: 按设计 §7 更新**

- 域配置步骤：换皮 Phase 早期（数据阶段前）加"按游戏实际概念定 `domains.codex.slug` / `domains.milestones.slug` 与 i18n 标签值"步骤，附 scarlet-skips 案例（upgrades/endings）
- 字段中性名映射表（本计划总表的精简版）
- 迁移场景（存量站改域名）：`public/_redirects` 301 + llms.txt 手改 + GSC sitemap 重提三步
- 全文 grep `monsters`/`bosses`：文档叙述里的旧域引用改为 codex/milestones（默认 slug 示例保留 monsters/bosses 说明）

- [ ] **Step 8.2: 验证 + 提交推送**

```bash
grep -n "monsters\|bosses" .agent/skills/game-guide-builder/SKILL.md | head   # 逐条确认均为"默认值示例"语境
git add .agent/skills/game-guide-builder/SKILL.md
git commit -m "docs(skill): game-guide-builder 域可配置化指引(codex/milestones + 迁移 301 流程)

Co-Authored-By: Claude Code <noreply@anthropic.com>"
GIT_SSH_COMMAND='ssh -o ConnectTimeout=15 -o ProxyCommand="connect -H 127.0.0.1:7897 %h %p"' git push origin master
```

---

## 风险与回退

| 风险 | 检测 | 回退 |
|---|---|---|
| `[domain]` 动态段与静态段冲突 | Task 3.6 / 5.1 build 产物清单 | 恢复 monsters/bosses 两目录（git revert Task 3 commit） |
| 站点数据脚本误伤字符串值 | Task 6.8 build + test：internal-links 守卫死链 | `git diff data/` 逐块复查；值只应出现在 `zone: 'zone-ground'` 等右侧 |
| CF `_redirects` 不生效 | Task 7.2 旧 URL 非 301 | 检查 `out/_redirects` 是否在产物（public/ 直拷）；CF Pages 原生支持无需配置 |
| GSC 重提 401/403 | Task 7.3 非 204 | `bash gsc.sh refresh` 刷新 access token 重试 |
| 并发提交冲突 | 每次推送前 fetch | 无文件重叠直接 rebase；有重叠停下人工合并 |
