import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { routing, CLIENT_NAMESPACES } from '../i18n/routing'
import { NAV_SECTIONS } from '../config/navigation.config'
import { codexSlug, milestoneSlug, regionSlug, equipmentSlug, achievementSlug, economySlug, multiplayerSlug } from '../lib/domain-slugs'
import en from './en.json'

function flatKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null
      ? flatKeys(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`]
  )
}

// routing.locales 是语言唯一清单:新语言进入 locales 而缺少 messages 文件时,
// 此处 readFileSync 抛错 => 测试红,强制补齐翻译。
const load = (locale: string) =>
  JSON.parse(readFileSync(resolve(process.cwd(), 'messages', `${locale}.json`), 'utf8'))

describe('messages', () => {
  it('every routing locale has a messages file structurally identical to en', () => {
    for (const locale of routing.locales) {
      expect(flatKeys(load(locale)), `messages/${locale}.json`).toEqual(flatKeys(en))
    }
  })

  // Home.intro / Home.explore 是 meta 层 SEO 长文案(首页不渲染,供搜索引擎),
  // 不属于渲染层消费 —— 它们由本测试的词数断言"消费",故死 key 守护不扫它们。
  it('home intro+explore meets SEO word count (>=600 en words)', () => {
    const { intro, explore } = en.Home
    const text = [intro.p1, intro.p2, intro.p3, explore.p1, explore.p2].join(' ')
    const words = text.split(/\s+/).filter(Boolean)
    expect(words.length).toBeGreaterThanOrEqual(600)
  })

  const getPath = (obj: Record<string, unknown>, path: string): unknown =>
    path.split('.').reduce<unknown>(
      (acc, k) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined),
      obj,
    )

  // SEO meta 守护:en/zh 同时漏写 metaDescription 时 parity 不红、build 仍绿,
  // 页面会渲染 key 路径文本充当 description —— 在此拦截。
  // key 集从导航树动态推导(一级路由段 → 命名空间):裁剪域(删导航+删数据)时
  // 要求自动消失、不震荡;en.json 残留整块则由死 key 守护接管。
  // 形态自适应:嵌套 Guides.index.metaTitle(与 H1 共用)或平铺 Faq.metaTitle。
  const navSegments = [...new Set(
    NAV_SECTIONS.flatMap((s) => s.items).map((it) => it.href.split('/')[1]),
  )].filter(Boolean)
  // 派生域 URL 段与消息 namespace 已解耦(monsters 段 → Codex 命名空间):
  // 段名机械大写推导不出正确 namespace,在此显式映射;其余段仍按约定推导。
  const NS_BY_SEGMENT: Record<string, string> = {
    [codexSlug()]: 'Codex',
    [milestoneSlug()]: 'Milestones',
    [regionSlug()]: 'Regions',
    [equipmentSlug()]: 'Equipment',
    [achievementSlug()]: 'Achievements',
    [economySlug()]: 'Economy',
    [multiplayerSlug()]: 'Multiplayer',
  }
  const CORE_SEO_KEYS = [
    'Home.siteDescription',
    ...navSegments.flatMap((seg) => {
      const ns = NS_BY_SEGMENT[seg] ?? seg[0].toUpperCase() + seg.slice(1)
      const nested = typeof getPath(en as Record<string, unknown>, `${ns}.index`) === 'object'
      const base = nested ? `${ns}.index` : ns
      return [`${base}.metaTitle`, `${base}.metaDescription`]
    }),
  ]

  // meta 守护递归化:嵌套子页(如 Fish.index)的 metaTitle 与顶层同等对待
  const metaNodes = (
    obj: Record<string, unknown>,
    prefix = '',
  ): { path: string; node: Record<string, unknown> }[] =>
    Object.entries(obj).flatMap(([k, v]) => {
      if (typeof v !== 'object' || v === null) return []
      const rec = metaNodes(v as Record<string, unknown>, `${prefix}${k}.`)
      return 'metaTitle' in (v as Record<string, unknown>)
        ? [{ path: `${prefix}${k}`, node: v as Record<string, unknown> }, ...rec]
        : rec
    })

  // 任意层级的 metaDescription 值清单(PRD §20 unique metadata 守护用)
  const metaDescriptionEntries = (
    obj: Record<string, unknown>,
    prefix = '',
  ): { path: string; value: string }[] =>
    Object.entries(obj).flatMap(([k, v]) =>
      typeof v === 'object' && v !== null
        ? metaDescriptionEntries(v as Record<string, unknown>, `${prefix}${k}.`)
        : k === 'metaDescription' && typeof v === 'string'
          ? [{ path: `${prefix}${k}`, value: v }]
          : [],
    )

  it('every node with metaTitle (any depth, incl. .index subpages) also has a non-empty metaDescription (per locale)', () => {
    for (const locale of routing.locales) {
      const m = locale === 'en' ? (en as Record<string, unknown>) : load(locale)
      for (const { path, node } of metaNodes(m)) {
        expect(node.metaDescription, `${locale}.${path}.metaDescription`).toBeTruthy()
      }
    }
  })

  it('metaDescription values are unique across the site (PRD §20 unique metadata)', () => {
    for (const locale of routing.locales) {
      const m = locale === 'en' ? (en as Record<string, unknown>) : load(locale)
      const seen = new Map<string, string>()
      for (const { path, value } of metaDescriptionEntries(m)) {
        expect(seen.has(value), `${locale}.${path} duplicates ${seen.get(value) ?? ''}`).toBe(false)
        seen.set(value, path)
      }
    }
  })

  it('core page namespaces all carry SEO title + description (per locale)', () => {
    for (const locale of routing.locales) {
      const m = locale === 'en' ? (en as Record<string, unknown>) : load(locale)
      for (const key of CORE_SEO_KEYS) {
        expect(getPath(m, key), `${locale}.${key}`).toBeTruthy()
      }
    }
  })

  // ---------- 死 key 守护(顶层命名空间粒度) ----------
  // 递归收集 app/components/config/lib 生产代码(排除 *.test.*)里的引号字符串
  // 字面量;en.json 某顶层命名空间若既无 'Ns' 字面量(useTranslations('Ns'))
  // 也无 'Ns.x' 前缀字面量(namespace: 'Ns.index')出现 => 整块无人引用,红。
  // 消费形态覆盖:useTranslations/getTranslations 调用、<Comp namespace="Ns">
  // prop —— 均为引号字面量,天然被收集;数据文件的 labelKey/titleKey 等后缀
  // key 由其渲染组件的命名空间字面量覆盖。叶子级 t(`x.${id}`) 动态形态不做
  // 静态追踪(成本过高),命名空间级已能防"整块残留"(换站清债 T18)。
  const SOURCE_DIRS = ['app', 'components', 'config', 'lib']

  function collectQuotedLiterals(dir: string, out: Set<string>): void {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) collectQuotedLiterals(full, out)
      else if (/\.(ts|tsx)$/.test(name) && !name.includes('.test.')) {
        for (const m of readFileSync(full, 'utf8').matchAll(/['"]([\w][\w.-]*)['"]/g)) {
          out.add(m[1])
        }
      }
    }
  }

  it('every top-level message namespace is referenced by production code', () => {
    const literals = new Set<string>()
    for (const d of SOURCE_DIRS) collectQuotedLiterals(resolve(process.cwd(), d), literals)
    const orphan = Object.keys(en).filter(
      (ns) => !literals.has(ns) && ![...literals].some((l) => l.startsWith(`${ns}.`)),
    )
    expect(orphan, 'en.json 中的死命名空间(grep 零消费即可删)').toEqual([])
  })

  // ---------- 叶子级缺 key 守护(字面量引用方向) ----------
  // 上面的死 key 守护只到顶层命名空间粒度:命名空间存在但叶子缺失时它绿、
  // build 也绿(build 不校验 key),next-intl 生产模式把 key 路径原样渲染上线
  // (The Blood Of Dawnwalker 换皮曾丢 38 个字面量 key 上线:首页 Home.qMoney、
  // monsters/bosses 表格列头)。此处反方向拦截:代码里字面量 t('x') 引用的
  // 完整路径必须存在于 en.json。动态形态(t(var)/模板串/namespace prop 透传)
  // 与死 key 守护取舍对称,不做静态追踪。
  it('every literal key referenced via t()/t.raw()/t.rich()/t.has() exists in en.json', () => {
    const varNs = new Map<string, string>()
    const callRe =
      /\b(\w+)\.(?:raw|rich|has)\(\s*(['"])([\w.-]+)\2|\b(\w+)\(\s*(['"])([\w.-]+)\5/g
    const missing: string[] = []
    const scanKeys = (dir: string): void => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name)
        if (statSync(full).isDirectory()) { scanKeys(full); continue }
        if (!/\.(ts|tsx)$/.test(name) || name.includes('.test.')) continue
        const src = readFileSync(full, 'utf8')
        varNs.clear()
        // 翻译函数绑定 → namespace 前缀(await get 与同步 use 两种形态)
        for (const m of src.matchAll(
          /const\s+(\w+)\s*=\s*(?:await\s+)?(?:use|get)Translations\(\s*(['"])([^'"]*)\2/g,
        ))
          varNs.set(m[1], m[3])
        if (!varNs.size) continue
        for (const m of src.matchAll(callRe)) {
          const v = m[1] ?? m[4]
          const key = m[3] ?? m[6]
          const ns = varNs.get(v)
          if (ns === undefined) continue
          const full2 = ns ? `${ns}.${key}` : key
          if (getPath(en as Record<string, unknown>, full2) === undefined)
            missing.push(`${relative(process.cwd(), full)}: ${full2}`)
        }
      }
    }
    for (const d of SOURCE_DIRS) scanKeys(resolve(process.cwd(), d))
    expect(
      missing,
      '代码字面量引用但 en.json 缺失的 key(生产模式渲染裸 key 路径,dev 不易察觉)',
    ).toEqual([])
  })

  // ---------- client messages 白名单守护 ----------
  // layout 的 NextIntlClientProvider 只注入 CLIENT_NAMESPACES(单一事实源:
  // i18n/routing.ts,layout 与本测试共用)。任何 'use client' 组件 useTranslations
  // 了白名单外的 namespace => 该翻译不会进 client bundle,运行时渲染 key 路径
  // 明文 —— 在此提前拦截为编译期失败。
  it('every useTranslations namespace in client components is on the CLIENT_NAMESPACES allowlist', () => {
    const allowlist = new Set<string>(CLIENT_NAMESPACES)
    const used = new Map<string, string[]>() // ns -> 消费文件

    // 递归遍历 app/ + components/(任意深度),跳过测试文件。
    // 'use client' 指令允许单/双引号(components/ui/* 惯用双引号),允许前面有注释行。
    const scan = (dir: string): void => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name)
        if (statSync(full).isDirectory()) { scan(full); continue }
        if (!/\.(ts|tsx)$/.test(name) || name.includes('.test.')) continue
        const src = readFileSync(full, 'utf8')
        if (!/(^|\n)\s*['"]use client['"]/.test(src.slice(0, 500))) continue
        for (const m of src.matchAll(/useTranslations\(\s*(['"])([^'"]+)\1/g)) {
          const rel = relative(process.cwd(), full)
          used.set(m[2], [...(used.get(m[2]) ?? []), rel])
        }
      }
    }
    for (const d of ['app', 'components']) scan(resolve(process.cwd(), d))

    // useTranslations('Fish.index') 等点路径形式的顶层 ns 是首段;注入按顶层粒度
    const offAllowlist = [...used.entries()].filter(([ns]) => !allowlist.has(ns.split('.')[0]))
    expect(
      offAllowlist.map(([ns, files]) => `${ns} (${files.join(', ')})`),
      '这些 client 组件的 namespace 不在白名单里,client 拿不到翻译——请把 ns 加进 CLIENT_NAMESPACES(i18n/routing.ts)或把组件 server 化',
    ).toEqual([])
  })
})
