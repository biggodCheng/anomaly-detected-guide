// 导航树健康检查 + nav↔路由双向覆盖。
// 覆盖测试是本模板的核心守护:新增页面忘了进导航/sitemap、或导航指向
// 不存在的页面,都在这里红 —— 不用等部署后人工发现。
import { describe, expect, it } from 'vitest'
import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  NAV_SECTIONS,
  footerNav,
  headerNav,
  sidebarNav,
  sitemapStaticPaths,
} from './navigation.config'
import enMessages from '../messages/en.json'
import { codexSlug, milestoneSlug, regionSlug, equipmentSlug, achievementSlug, economySlug, multiplayerSlug } from '@/lib/domain-slugs'

// --- 从 app/[locale] 遍历出真实路由(剥离 route group 与 [动态段]) ---
// 域可配置化后,[domain] 目录代表 codex/milestones/regions/equipment 四个域
// 测试需要读取 generateStaticParams 获取实际域名列表
function collectRoutes(dir: string, prefix: string, out: { path: string; dynamic: boolean }[]) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (!statSync(full).isDirectory()) continue
    if (name.startsWith('(')) {
      collectRoutes(full, prefix, out) // route group:不计入路径
      continue
    }
    const dynamic = name.startsWith('[')
    // 特殊处理 [domain] 目录:读取 generateStaticParams 获取实际域名列表
    if (name === '[domain]') {
      const pagePath = join(full, 'page.tsx')
      if (exists(pagePath)) {
        // 读取 generateStaticParams 获取实际域名列表
        const domains = [codexSlug(), milestoneSlug(), regionSlug(), equipmentSlug(), achievementSlug(), economySlug(), multiplayerSlug()]
        for (const domain of domains) {
          const domainPrefix = `${prefix}/${domain}`
          // 检查 domain 根页面
          out.push({ path: domainPrefix, dynamic: false })
          // 递归扫描 domain 下的子目录，但只处理 [slug] 动态路由
          // 静态子页面（armor/potions 等）属于特定域，不在此处生成
          for (const subName of readdirSync(full)) {
            const subFull = join(full, subName)
            if (!statSync(subFull).isDirectory()) continue
            if (subName === '[slug]') {
              // [slug] 是动态路由，不生成静态路径
              continue
            }
            // 其他静态子目录（region-comparison/armor 等）需要检查属于哪个域
            const subPagePath = join(subFull, 'page.tsx')
            if (exists(subPagePath)) {
              const subSrc = readFileSync(subPagePath, 'utf8')
              // 检查 generateStaticParams 中的域名
              if (subSrc.includes('equipmentSlug()') && domain === equipmentSlug()) {
                out.push({ path: `${domainPrefix}/${subName}`, dynamic: false })
              } else if (subSrc.includes('regionSlug()') && domain === regionSlug()) {
                out.push({ path: `${domainPrefix}/${subName}`, dynamic: false })
              } else if (subSrc.includes('economySlug()') && domain === economySlug()) {
                out.push({ path: `${domainPrefix}/${subName}`, dynamic: false })
              } else if (subSrc.includes('multiplayerSlug()') && domain === multiplayerSlug()) {
                out.push({ path: `${domainPrefix}/${subName}`, dynamic: false })
              }
            }
          }
        }
      }
      continue
    }
    const seg = dynamic ? name.replace(/^\[|\]$/g, '').replace('...', '') : name
    const next = prefix === '' ? `/${seg}` : `${prefix}/${seg}`
    if (exists(join(full, 'page.tsx')) || exists(join(full, 'page.ts'))) {
      out.push({ path: next, dynamic })
    }
    collectRoutes(full, next, out)
  }
}
function exists(p: string) {
  try {
    return statSync(p).isFile()
  } catch {
    return false
  }
}

const allItems = NAV_SECTIONS.flatMap((s) => s.items)

describe('config/navigation.config 结构', () => {
  it('href 全局唯一', () => {
    const hrefs = allItems.map((it) => it.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('每个 footer 条目都声明了 footerColumn', () => {
    for (const it of allItems) {
      if (it.surfaces.includes('footer')) expect(it.footerColumn, it.href).toBeDefined()
    }
  })

  it('header/footer/sidebar/sitemap 选择器不互相泄漏', () => {
    expect(headerNav().length).toBe(allItems.filter((i) => i.surfaces.includes('header')).length)
    const footer = footerNav()
    const footerCount = Object.values(footer).reduce((n, arr) => n + arr.length, 0)
    expect(footerCount).toBe(allItems.filter((i) => i.surfaces.includes('footer')).length)
    expect(sidebarNav().every((s) => s.items.length > 0)).toBe(true)
    // 反失明锚点:every/镜像断言对空数组恒真 —— sidebar 条目被一致清空时
    // 侧栏静默塌空,只有非空计数在此红。
    expect(sidebarNav().length, 'sidebar 整树塌空(两份清单一致清空,镜像守护不红)').toBeGreaterThan(0)
    expect(sitemapStaticPaths()[0]).toBe('/')
  })

  it('每个出现于 header/footer/sidebar 的 labelKey 在 messages/en.json 的对应 namespace 里存在', () => {
    const navKeys = new Set(Object.keys((enMessages as { Nav: Record<string, unknown> }).Nav))
    const footerKeys = new Set(Object.keys((enMessages as { Footer: { links: Record<string, unknown> } }).Footer.links))
    const sidebarKeys = new Set(Object.keys((enMessages as { Sidebar: { links: Record<string, unknown> } }).Sidebar.links))
    for (const it of allItems) {
      if (it.surfaces.includes('header')) expect(navKeys, `Nav.${it.labelKeyBySurface?.header ?? it.labelKey} (${it.href})`).toContain(it.labelKeyBySurface?.header ?? it.labelKey)
      if (it.surfaces.includes('footer')) expect(footerKeys, `Footer.links.${it.labelKeyBySurface?.footer ?? it.labelKey} (${it.href})`).toContain(it.labelKeyBySurface?.footer ?? it.labelKey)
      if (it.surfaces.includes('sidebar')) expect(sidebarKeys, `Sidebar.links.${it.labelKeyBySurface?.sidebar ?? it.labelKey} (${it.href})`).toContain(it.labelKeyBySurface?.sidebar ?? it.labelKey)
    }
  })

  it('Sidebar.sections 文案 key 与 sidebarNav() 分节 id 互为镜像(动态 key 漏文案时渲染 id 明文)', () => {
    // sections.<id> 是动态查找:导航新增分节而 en.json 没写文案,页面直接
    // 渲染 key 明文且无报错;反向则是文案残留死键。两侧都在此拦截。
    const sections = (enMessages as { Sidebar: { sections: Record<string, unknown> } }).Sidebar.sections
    const ids = sidebarNav().map((s) => s.id)
    for (const id of ids) {
      expect(sections[id], `Sidebar.sections.${id} 缺分节文案`).toBeTruthy()
    }
    expect(Object.keys(sections).sort(), 'Sidebar.sections 死 key(导航已无此分节)').toEqual([...new Set(ids)].sort())
  })
})

describe('nav ↔ 路由双向覆盖', () => {
  const routes: { path: string; dynamic: boolean }[] = []
  const localeDir = join(__dirname, '..', 'app', '[locale]')
  if (exists(join(localeDir, 'page.tsx'))) routes.push({ path: '/', dynamic: false }) // [locale] 根页面
  collectRoutes(localeDir, '', routes)
  const staticRoutes = new Set(routes.filter((r) => !r.dynamic).map((r) => r.path))
  // 动态路由(如 /guides/[slug])按前缀覆盖子路径:/guides/<任何 slug> 都算有真实页面
  const dynamicPrefixes = routes.filter((r) => r.dynamic).map((r) => r.path.slice(0, r.path.lastIndexOf('/')))
  const navPaths = new Set(sitemapStaticPaths())

  it('导航树的每个 href 都有真实页面(防死链;动态路由前缀也算真实页面)', () => {
    const dead = [...navPaths].filter(
      (p) => !staticRoutes.has(p) && !dynamicPrefixes.some((pre) => p.startsWith(`${pre}/`)),
    )
    expect(dead.join('\n')).toBe('')
  })

  it('每个静态页面都在 sitemap 清单里(防静默掉出 sitemap)', () => {
    for (const r of staticRoutes) {
      expect(navPaths, r).toContain(r)
    }
  })
})
