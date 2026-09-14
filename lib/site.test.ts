import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { absoluteUrl, localePath, siteConfig, websiteSchema } from './site'

describe('localePath — 默认语言无前缀的唯一 URL 规则', () => {
  it('默认语言(en): path 原样返回(含根路径与空串归一)', () => {
    expect(localePath('en', '/')).toBe('/')
    expect(localePath('en', '')).toBe('/')
    expect(localePath('en', '/guides')).toBe('/guides')
    expect(localePath('en', '/monsters/ember-bat')).toBe('/monsters/ember-bat')
  })

  it('非默认语言(zh): 加前缀,首页无尾斜杠', () => {
    expect(localePath('zh', '/')).toBe('/zh')
    expect(localePath('zh', '')).toBe('/zh')
    expect(localePath('zh', '/guides')).toBe('/zh/guides')
  })

  it('absoluteUrl 与 localePath 同源', () => {
    expect(absoluteUrl('en', '/guides')).toBe(`${siteConfig.url}/guides`)
    expect(absoluteUrl('zh', '/guides')).toBe(`${siteConfig.url}/zh/guides`)
    expect(absoluteUrl('en', '')).toBe(`${siteConfig.url}/`)
  })
})

// ── 守护:禁止绕过 localePath 直接拼 locale 前缀 ──────────────────────────
// 默认语言无前缀后,手写 `/${locale}/xxx` 会生成 /en/xxx 死链(promote 校验
// 会拦,但在这里红能更早定位到源文件)。
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const WHITELIST = new Set(['lib/site.ts', 'lib/site.test.ts']) // localePath 实现与本守护的字面量

describe('守护:locale 前缀拼接必须走 localePath', () => {
  const hits: string[] = []
  const scan = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const abs = join(dir, name)
      const rel = relative(ROOT, abs).replace(/\\/g, '/')
      if (statSync(abs).isDirectory()) {
        if (!['node_modules', '.next', 'out', '.git'].includes(name)) scan(abs)
      } else if (/\.(tsx?|mjs)$/.test(name) && !WHITELIST.has(rel)) {
        if (readFileSync(abs, 'utf8').includes('`/${locale}')) {
          hits.push(rel)
        }
      }
    }
  }
  scan(join(ROOT, 'app'))
  scan(join(ROOT, 'components'))
  scan(join(ROOT, 'lib'))
  scan(join(ROOT, 'scripts'))

  it('app/components/lib/scripts 中无 `/${locale}` 直接拼接(白名单外)', () => {
    expect(hits, `绕过 localePath 的文件:\n${hits.join('\n')}`).toEqual([])
  })
})

describe('websiteSchema', () => {
  it('websiteSchema 的 about.@type 来自 siteConfig.schemaType', () => {
    const schema = websiteSchema('en')
    expect(schema.about['@type']).toBe(siteConfig.schemaType)
  })
})
