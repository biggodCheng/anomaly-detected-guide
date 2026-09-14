// 站点配置健康检查 —— 换游戏时改坏 config 在这里先红,不用等 build。
import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { routing } from '@/i18n/routing'
import { siteConfig } from './site.config'
import { heroAvif, heroHeaderAvif, heroImageVariant } from '@/lib/site'

describe('config/site.config', () => {
  it('url 是合法 https 域名且无尾斜杠', () => {
    expect(siteConfig.url).toMatch(/^https:\/\/[^\s/]+$/)
  })

  it('siteName 覆盖 routing 的全部语言', () => {
    for (const locale of routing.locales) {
      expect(siteConfig.siteName[locale], `siteName.${locale}`).toBeTruthy()
    }
  })

  it('defaultLocale 与 i18n/routing 一致(postbuild 脚本读 JSON,漂移会静默错向)', () => {
    expect(siteConfig.defaultLocale).toBe(routing.defaultLocale)
  })

  it('ogImage 文件存在于 public/', () => {
    const p = resolve(__dirname, '..', 'public', siteConfig.ogImage.path.replace(/^\//, ''))
    expect(existsSync(p), p).toBe(true)
  })

  it('favicon.ico 只存在于 public/(浏览器/爬虫默认请求 /favicon.ico,404 页直接引用)', () => {
    expect(existsSync(resolve(__dirname, '..', 'public', 'favicon.ico'))).toBe(true)
    // app/favicon.ico 是 Next metadata 文件约定,优先级高于 public/ 版:两者并存时
    // 生产导出被 app 版遮蔽、dev 下 /favicon.ico 直接 500 —— 模板曾因此把上一款
    // 游戏的图标发上线(见审计报告 #9)。放 app/ 即红。
    expect(existsSync(resolve(__dirname, '..', 'app', 'favicon.ico')), 'favicon 放 app/ 会压制 public/ 版并致 dev 500').toBe(false)
  })

  it('favicon 全套 6 件存在且尺寸正确(generate-favicons.mjs 产物契约,漏生成在部署后才被用户看到)', () => {
    // PNG 宽高手撕 IHDR(偏移 16/20 的 big-endian uint32),免加载 sharp 保持同步
    const pngSize = (buf: Buffer) => ({ w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) })
    const expected: Array<[string, number | null]> = [
      ['favicon-16x16.png', 16],
      ['favicon-32x32.png', 32],
      ['apple-touch-icon.png', 180],
      ['android-chrome-192x192.png', 192],
      ['android-chrome-512x512.png', 512],
    ]
    for (const [name, size] of expected) {
      const p = resolve(__dirname, '..', 'public', name)
      expect(existsSync(p), `${name} 缺失 —— 跑 node scripts/generate-favicons.mjs 重新生成全套`).toBe(true)
      const { w, h } = pngSize(readFileSync(p))
      expect([w, h], `${name} 应为 ${size}×${size}`).toEqual([size, size])
    }
    // favicon.ico:魔数(reserved=0, type=1)+ 至少 2 个目录尺寸(16/32/48)
    const ico = readFileSync(resolve(__dirname, '..', 'public', 'favicon.ico'))
    expect(ico.readUInt16LE(2), 'favicon.ico 头部 type 应为 1(icon)').toBe(1)
    expect(ico.readUInt16LE(4), 'favicon.ico 应含 ≥2 个尺寸(多尺寸容器)').toBeGreaterThanOrEqual(2)
  })

  it('heroImage 文件存在于 public/', () => {
    const heroPath = siteConfig.heroImage
    expect(heroPath, 'heroImage must be defined in siteConfig').toBeTruthy()
    const p = resolve(__dirname, '..', 'public', heroPath.replace(/^\//, ''))
    expect(existsSync(p), p).toBe(true)
  })

  it('codexHeader 域头图文件存在于 public/ 且文件名含 siteId(immutable 缓存的换站失效机制)', () => {
    expect(siteConfig.codexHeader, 'codexHeader must be defined in siteConfig').toBeTruthy()
    // 文件名带 siteId 与 hero 同语义:换站时文件名必变,vercel.json 一年 immutable 自动失效
    expect(siteConfig.codexHeader).toContain(`-${siteConfig.siteId}-`)
    const p = resolve(__dirname, '..', 'public', siteConfig.codexHeader.replace(/^\//, ''))
    expect(existsSync(p), p).toBe(true)
  })

  it('domains 七个域 slug 均为合法 URL 段且两两不同(路由/导航/sitemap 的唯一来源,坏值全站遭殃)', () => {
    const { codex, milestones, regions, equipment, achievements, economy, multiplayer } = siteConfig.domains
    const entries = [
      ['codex', codex.slug],
      ['milestones', milestones.slug],
      ['regions', regions.slug],
      ['equipment', equipment.slug],
      ['achievements', achievements.slug],
      ['economy', economy.slug],
      ['multiplayer', multiplayer.slug],
    ] as const
    for (const [name, slug] of entries) {
      expect(slug, `domains.${name}.slug 须为小写字母/数字/连字符的非空段`).toMatch(/^[a-z0-9-]+$/)
    }
    // 同 slug 会让 [domain] 路由产出重复静态路径并污染导航/sitemap/llms.txt
    const slugs = entries.map(([, s]) => s)
    expect(new Set(slugs).size, '七个域的 slug 必须两两不同').toBe(7)
  })

  it('ogImage 文件名含 siteId(og 图同样受 /images/* 一年 immutable 缓存,换站必须失效)', () => {
    // 与 hero/codexHeader 同语义:OG 图被社交爬虫高频拉取且缓存激进,换站必须失效
    expect(siteConfig.ogImage.path, `ogImage.path 必须含 siteId('${siteConfig.siteId}')以保证换站时 URL 必变`).toContain(siteConfig.siteId)
    const p = resolve(__dirname, '..', 'public', siteConfig.ogImage.path.replace(/^\//, ''))
    expect(existsSync(p), p).toBe(true)
  })

  it('hero 全部变体文件存在且文件名含 siteId(immutable 缓存的换站失效机制)', () => {
    // hero 资产带 siteId:换站时文件名必变,vercel.json 的一年 immutable 缓存
    // 随之失效 —— 文件名不带 siteId 时此断言红,提醒同步重命名资产。
    expect(siteConfig.heroImage).toContain(`-${siteConfig.siteId}-`)
    const p768 = resolve(__dirname, '..', 'public', heroImageVariant(768).replace(/^\//, ''))
    expect(existsSync(p768), p768).toBe(true)
    for (const w of [768, 1200]) {
      const p = resolve(__dirname, '..', 'public', heroAvif(w).replace(/^\//, ''))
      expect(existsSync(p), p).toBe(true)
    }
    // 首页 hero(真 LCP)的 avif 档位,源是 heroImage webp(与上面 ogImage 阶梯是两张不同的图)
    for (const w of [768, 1730]) {
      const p = resolve(__dirname, '..', 'public', heroHeaderAvif(w).replace(/^\//, ''))
      expect(existsSync(p), `${p} 缺失 —— 跑 npm run hero:avif 生成`).toBe(true)
    }
  })

  it('siteId 用作 localStorage 命名空间,必须是短 slug', () => {
    expect(siteConfig.siteId).toMatch(/^[a-z0-9-]{2,12}$/)
  })

  it('theme 色值为 6 位小写 hex', () => {
    for (const [name, v] of Object.entries(siteConfig.theme)) {
      expect(v, `theme.${name}`).toMatch(/^#[0-9a-f]{6}$/)
    }
  })

  it('theme 三主色与 globals.css :root 一致(换站漏改配色在此红)', () => {
    const css = readFileSync(resolve(__dirname, '..', 'app', 'globals.css'), 'utf8')
    for (const [name, expected] of Object.entries(siteConfig.theme)) {
      const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))
      expect(m?.[1]?.toLowerCase(), `globals.css --${name}`).toBe(expected.toLowerCase())
    }
  })

  it('globals.css .dark block defines the three brand hues as valid hex (light-adjusted set)', () => {
    const css = readFileSync(resolve(__dirname, '..', 'app', 'globals.css'), 'utf8')
    const dark = css.match(/\.dark\s*{([^}]*)}/)?.[1] ?? ''
    for (const key of ['--primary', '--secondary', '--accent']) {
      const m = dark.match(new RegExp(`${key}:\\s*(#[0-9a-fA-F]{6})`))?.[1]
      expect(m, `globals.css .dark ${key} 必须是 6 位 hex(具体值由各站自选,与 :root 同色相亮变体)`).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })

  it('schemaType 是合法的 Schema.org 类型（JSON-LD 结构化数据）', () => {
    const validTypes = ['VideoGame', 'SoftwareApplication', 'WebApplication', 'Product', 'Article', 'Organization']
    expect(validTypes).toContain(siteConfig.schemaType)
  })

  it('brandTokens 非空且覆盖当前游戏身份（check-swap 扫描基准）', () => {
    // 换站改 game.name/siteId 漏改 brandTokens 时,check-swap 扫的全是旧词,
    // "三绿"静默失焦 —— 在此强制 token 集跟随当前身份。
    expect(siteConfig.brandTokens.length).toBeGreaterThan(0)
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '')
    const tokens = siteConfig.brandTokens.map(norm)
    const nameKey = norm(siteConfig.game.name)
    if (nameKey) {
      expect(tokens, 'game.name 的规范化形式必须在 brandTokens 里').toContain(nameKey)
    } else {
      // 纯非 ASCII 游戏名(如中文)norm 后为空串:空串与被抹空的中文 token 相等,
      // 上面的断言恒真 —— 退回原文精确匹配。
      expect(siteConfig.brandTokens, '非 ASCII 游戏名必须原文出现在 brandTokens').toContain(siteConfig.game.name)
    }
    expect(tokens, 'siteId 必须在 brandTokens 里').toContain(siteConfig.siteId)
  })
})
