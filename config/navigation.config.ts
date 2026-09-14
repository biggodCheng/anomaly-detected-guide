// 单一导航树 —— header / footer / sidebar / breadcrumb / sitemap 五个消费点
// 的唯一路由来源。改导航只改这里,五处自动同步。
//
// 约定:
// - href 为 locale 相对路径(无尾斜杠);'/' 根路径由 sitemapStaticPaths() 自行补。
// - labelKey 是消息 key(不含 namespace);渲染层按 surface 选 namespace:
//   header → Nav.<key>,footer → Footer.links.<key>,sidebar → Sidebar.links.<key>。
//   同一路径在不同 surface 用不同措辞时(如 /guides 在 sidebar 叫 allGuides)
//   用 labelKeyBySurface 覆盖 —— 消息文件零改动。
// - footerColumn:出现在 footer 时所属列(guides/reference/legal)。
// - sitemap 永远收录全部条目(surfaces: [] 的 sitemap-only 项也收录)。

export type NavSurface = 'header' | 'footer' | 'sidebar'

export type NavItem = {
  href: string
  labelKey: string
  surfaces: NavSurface[]
  labelKeyBySurface?: Partial<Record<NavSurface, string>>
  footerColumn?: 'guides' | 'reference' | 'legal'
}

export type NavSection = {
  /** sidebar 分节标题 → Sidebar.sections.<id> */
  id: string
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'explore',
    items: [
      { href: '/cases', labelKey: 'cases', surfaces: ['header', 'footer', 'sidebar'], footerColumn: 'reference' },
      { href: '/eras', labelKey: 'eras', surfaces: ['header', 'footer', 'sidebar'], footerColumn: 'reference' },
      { href: '/eras/region-comparison', labelKey: 'regionComparison', surfaces: ['sidebar'], footerColumn: 'reference' },
      { href: '/clues', labelKey: 'clues', surfaces: ['header', 'footer', 'sidebar'], footerColumn: 'reference' },
      { href: '/timeline', labelKey: 'timeline', surfaces: ['header', 'footer', 'sidebar'], footerColumn: 'reference' },
    ],
  },
  {
    id: 'guides',
    items: [
      { href: '/guides', labelKey: 'allGuides', surfaces: ['sidebar'], footerColumn: 'guides', labelKeyBySurface: { footer: 'allGuides' } },
      { href: '/guides/beginner-guide', labelKey: 'beginnerGuide', surfaces: ['header', 'footer', 'sidebar'], footerColumn: 'guides' },
      { href: '/mechanics', labelKey: 'mechanics', surfaces: ['footer', 'sidebar'], footerColumn: 'reference' },
      { href: '/guide', labelKey: 'guide', surfaces: ['footer', 'sidebar'], footerColumn: 'guides' },
    ],
  },
  {
    id: 'reference',
    items: [
      { href: '/achievements', labelKey: 'achievements', surfaces: ['footer', 'sidebar'], footerColumn: 'reference' },
      { href: '/faq', labelKey: 'faq', surfaces: ['footer', 'sidebar'], footerColumn: 'guides' },
    ],
  },
  {
    id: 'site',
    items: [
      { href: '/game', labelKey: 'game', surfaces: ['sidebar'] },
      { href: '/game/steam', labelKey: 'steam', surfaces: ['sidebar'] },
      { href: '/game/system-requirements', labelKey: 'systemRequirements', surfaces: ['sidebar'] },
      { href: '/game/controls', labelKey: 'controls', surfaces: ['sidebar'] },
      { href: '/about', labelKey: 'about', surfaces: ['footer'], footerColumn: 'legal' },
      { href: '/contact', labelKey: 'contact', surfaces: ['footer'], footerColumn: 'legal' },
      { href: '/privacy', labelKey: 'privacy', surfaces: ['footer'], footerColumn: 'legal' },
    ],
  },
]

const ALL_ITEMS = NAV_SECTIONS.flatMap((s) => s.items)

/** header 顶栏(顺序即 sections 展开顺序) */
export function headerNav(): { href: string; labelKey: string }[] {
  return ALL_ITEMS
    .filter((it) => it.surfaces.includes('header'))
    .map((it) => ({ href: it.href, labelKey: it.labelKeyBySurface?.header ?? it.labelKey }))
}

/** footer 三列(legal 列渲染在版权条,但数据同源) */
export function footerNav(): Record<'guides' | 'reference' | 'legal', { href: string; labelKey: string }[]> {
  const by: Record<'guides' | 'reference' | 'legal', { href: string; labelKey: string }[]> = {
    guides: [],
    reference: [],
    legal: [],
  }
  for (const it of ALL_ITEMS) {
    if (!it.surfaces.includes('footer')) continue
    const col = it.footerColumn ?? 'guides'
    by[col].push({ href: it.href, labelKey: it.labelKeyBySurface?.footer ?? it.labelKey })
  }
  return by
}

/** sidebar 分节树(过滤掉非 sidebar 条目) */
export function sidebarNav(): NavSection[] {
  return NAV_SECTIONS
    .map((s) => ({ id: s.id, items: s.items.filter((it) => it.surfaces.includes('sidebar')) }))
    .filter((s) => s.items.length > 0)
}

/** sitemap 静态路径清单(根路径 + 全部条目) */
export function sitemapStaticPaths(): string[] {
  return ['/', ...ALL_ITEMS.map((it) => it.href)]
}

/**
 * 面包屑中间层 hub:Breadcrumbs namespace 的文案 key → 站点路径。
 * 显式声明而非从 URL 层级推导 —— URL 会撒谎。
 */
export const NAV_HUBS = {
  cases: '/cases',
  timeline: '/timeline',
  eras: '/eras',
  clues: '/clues',
  achievements: '/achievements',
  mechanics: '/mechanics',
  guide: '/guide',
} as const

export type NavHubKey = keyof typeof NAV_HUBS
