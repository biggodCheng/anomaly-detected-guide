// sitemap 生成逻辑守护:不产出 HTML、不跑构建,直接调用生成函数断言
// URL 全集与结构。sitemap.ts 是静态导出里少数带运行逻辑的路由文件,
// localePath 规则或注册表改动导致的漏收/错向在这里先红。
import { describe, it, expect } from 'vitest'
import sitemap from './sitemap'
import { routing } from '@/i18n/routing'
import { guideSlugs } from '@/data/guides'
import { contentDomains } from '@/data/content-registry'
import { sitemapStaticPaths } from '@/config/navigation.config'
import { siteConfig } from '@/config/site.config'
import { localePath } from '@/lib/site'

const entries = sitemap()

const expectedPaths = [
  ...new Set([
    ...sitemapStaticPaths(),
    ...guideSlugs.map((s) => `/guides/${s}`),
    ...contentDomains.flatMap((d) => d.slugs().map((s) => `${d.pathPrefix}/${s}`)),
  ]),
]
const expectedUrls = new Set(
  expectedPaths.flatMap((p) => routing.locales.map((l) => `${siteConfig.url}${localePath(l, p)}`)),
)

describe('app/sitemap', () => {
  it('覆盖全部路由 × 全部语言,无多无漏无重复', () => {
    expect(new Set(entries.map((e) => e.url))).toEqual(expectedUrls)
    expect(entries.length).toBe(expectedUrls.size)
  })

  it('默认语言 URL 无语言前缀(与 localePath/promote 规则一致)', () => {
    const def = routing.defaultLocale
    for (const p of expectedPaths) {
      const u = `${siteConfig.url}${localePath(def, p)}`
      expect(entries.some((e) => e.url === u), `缺默认语言条目 ${u}`).toBe(true)
      // 首页 '/' 之外,默认语言 URL 不应含 /<def> 段(出现即说明前缀规则反转)
      if (p !== '/') {
        const path = new URL(u).pathname
        expect(path.startsWith(`/${def}`), `${u} 带了默认语言前缀`).toBe(false)
      }
    }
  })

  it('每条 alternate hreflang 指向该页对应语言的 URL(缺语言/copy-paste 错向在此红)', () => {
    // 只断言 truthiness 抓不住错向:相邻行抄错 localePath 参数(所有 alternate
    // 指向默认语言)时单语言下输出相同、多语言下 hreflang 全错。逐语言等值断言。
    const byUrl = new Map(entries.map((e) => [e.url, e]))
    for (const p of expectedPaths) {
      for (const l of routing.locales) {
        const u = `${siteConfig.url}${localePath(l, p)}`
        const langs = byUrl.get(u)?.alternates?.languages as Record<string, string> | undefined
        expect(langs, `缺条目 ${u}`).toBeDefined()
        for (const l2 of routing.locales) {
          expect(langs?.[l2], `${u} 的 ${l2} alternate 错向`).toBe(`${siteConfig.url}${localePath(l2, p)}`)
        }
        expect(langs?.['x-default'], `${u} 的 x-default 错向`).toBe(
          `${siteConfig.url}${localePath(routing.defaultLocale, p)}`,
        )
      }
    }
  })

  it('根路径 priority 1,其余 0.7(按原始 path 判,多语言下不误判 /<loc> 前缀条目)', () => {
    const byUrl = new Map(entries.map((e) => [e.url, e]))
    for (const p of expectedPaths) {
      for (const l of routing.locales) {
        const e = byUrl.get(`${siteConfig.url}${localePath(l, p)}`)
        expect(e?.priority, `${l} ${p}`).toBe(p === '/' ? 1 : 0.7)
      }
    }
  })
})
