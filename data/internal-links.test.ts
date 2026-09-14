// 全站内链目标存在性守护:扫描 data/ 里硬编码的站内路径字面量,
// 逐一核对它们存在于"静态导航树 ∪ 动态实体 slug 集"。
// app/ 层的内链不在此扫(localePath() 调用与模板串形态各异,误报高):
// 静态入口由 nav↔路由覆盖测试(navigation.config.test.ts)守护。
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { sitemapStaticPaths } from '@/config/navigation.config'
import { getAllCodex, getCodexEntry } from '@/data/codex'
import { getAllRegions } from '@/data/regions'
import { contentDomains } from './content-registry'
import { enGuides } from '@/data/guides/en'
import { featuredEntities } from './homepage'
import { POPULAR } from '@/app/not-found'

const validPaths = new Set([
  ...sitemapStaticPaths(),
  ...enGuides.map((g) => `/guides/${g.slug}`),
  ...contentDomains.flatMap((d) => d.slugs().map((s) => `${d.pathPrefix}/${s}`)),
])

// 收集 data/**/*.ts 里的 href/path 字面量(锚点剥离)。
// 绝对路径直收;根相对形态(taxonomy.ts 的 MORE_GUIDES path 无前导斜杠、
// 渲染层补 '/')值含 '/' 即视为站内路径,补 '/' 归一化入列 —— 拼错 slug 不再豁免。
function collectLiterals(dir: string, out: string[]) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) collectLiterals(full, out)
    else if (name.endsWith('.ts') && !name.endsWith('.test.ts')) {
      const src = readFileSync(full, 'utf8')
      for (const m of src.matchAll(/(?:href|path):\s*`?'([^`'"]+)'/g)) {
        const v = m[1].split('#')[0]
        if (v.startsWith('/')) out.push(v)
        else if (v.includes('/')) out.push(`/${v}`)
      }
    }
  }
}

describe('internal links resolve', () => {
  it('every hardcoded internal path in data/ exists as a page', () => {
    const literals: string[] = []
    collectLiterals(join(__dirname), literals)
    const unique = [...new Set(literals)]
    expect(unique.length).toBeGreaterThan(5) // 守护自身没失明(模板数据量小,阈值低于源站)
    for (const p of unique) {
      expect(validPaths, p).toContain(p)
    }
  })
  it('region cases only reference existing codex entries (closure)', () => {
    const codexSlugs = new Set(getAllCodex().map((m) => m.slug))
    for (const r of getAllRegions()) {
      for (const s of r.cases) expect(codexSlugs.has(s), `${r.slug} → ${s}`).toBe(true)
    }
  })
  it('homepage featuredEntities slugs resolve to real entities', () => {
    // ANOMAL: codex entries (cases) don't have a "detail" field distinction anymore.
    // All cases have full data. Milestones (timeline events) are referenced by order, not slug.
    for (const e of featuredEntities.cases) expect(getCodexEntry(e.slug), `codex/${e.slug}`).toBeDefined()
    // Skip milestone check as they're now timeline events referenced by order, not slugs
  })
  it('404 页 POPULAR 链接全部指向真实页面(app/ 层硬编码,主扫描不覆盖)', () => {
    // 反失明锚点:for-of 对空数组零断言 —— 换皮清内容时留空 POPULAR,
    // 404 页 Popular 区静默变空壳,只有非空计数在此红。
    expect(POPULAR.length, 'POPULAR 清空后守护失明').toBeGreaterThanOrEqual(3)
    for (const l of POPULAR) expect(validPaths, `${l.label} → ${l.href}`).toContain(l.href)
  })
})
