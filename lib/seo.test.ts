import { describe, expect, it } from 'vitest'
import { buildOpenGraph, buildTwitterCard, clampDescription, siteNameFor } from '@/lib/seo'
import { siteConfig } from '@/config/site.config'

// 期望值从 siteConfig 派生 —— 换游戏改 config 后这些测试继续守护接线正确性;
// 每组保留一处硬编码 fixture 防止退化成同义反复(左右两侧都读 config 就测不出错配)。
describe('siteNameFor', () => {
  it('returns the localized site name used by title template, og:site_name and JSON-LD', () => {
    expect(siteNameFor('en')).toBe(siteConfig.siteName.en)
    // fallback:未知 locale 回退默认语言,而不是静默给错名
    expect(siteNameFor('xx')).toBe(siteConfig.siteName[siteConfig.defaultLocale])
  })
})

describe('buildOpenGraph', () => {
  it('emits a complete og object pointing at the real page URL', () => {
    expect(
      buildOpenGraph({ locale: 'en', path: '/guides/beginner-guide', title: 'Beginner Guide', description: 'desc' })
    ).toEqual({
      type: 'website',
      locale: 'en_US',
      url: `${siteConfig.url}/guides/beginner-guide`,
      siteName: siteConfig.siteName.en,
      title: 'Beginner Guide',
      description: 'desc',
      images: [
        { url: siteConfig.ogImage.path, width: siteConfig.ogImage.width, height: siteConfig.ogImage.height, alt: siteConfig.ogImage.alt },
      ],
    })
  })

  it("passes type: 'article' through for pages emitting Article JSON-LD (og:type follows the schema)", () => {
    const og = buildOpenGraph({ locale: 'en', path: '/monsters/ember-bat', title: 'Ember Bat', description: 'd', type: 'article' })
    expect(og).toMatchObject({ type: 'article' })
  })

  it('accepts a per-page image override, keeping config dims/alt', () => {
    const og = buildOpenGraph({ locale: 'en', path: '/monsters/ember-bat', title: 'Ember Bat', description: 'd', image: '/images/og-custom.jpg' })
    expect(og?.images).toEqual([
      { url: '/images/og-custom.jpg', width: siteConfig.ogImage.width, height: siteConfig.ogImage.height, alt: siteConfig.ogImage.alt },
    ])
  })

  it('wires og:url by joining config.url + locale + path (fixture)', () => {
    const og = buildOpenGraph({ locale: 'en', path: '/equipment/potions', title: 't', description: 'd' })
    expect(String(og?.url)).toMatch(new RegExp(`^${siteConfig.url}/equipment/potions$`))
  })
})

describe('buildTwitterCard', () => {
  it('returns a large-image card with the page title and description', () => {
    expect(buildTwitterCard({ title: 'T', description: 'D' })).toEqual({
      card: 'summary_large_image',
      title: 'T',
      description: 'D',
      images: [siteConfig.ogImage.path],
    })
  })
})

describe('clampDescription', () => {
  it('returns short text unchanged', () => {
    expect(clampDescription('Short text.', 160)).toBe('Short text.')
  })

  it('cuts at the last full sentence when one fits', () => {
    const text = 'One sentence fits here. Second sentence fits too. Third sentence is beyond the limit and must go.'
    expect(clampDescription(text, 50)).toBe('One sentence fits here. Second sentence fits too.')
  })

  it('falls back to a word boundary with ellipsis when no sentence fits', () => {
    const text = 'This single sentence just keeps going and going far beyond the clamp limit for metadata.'
    const out = clampDescription(text, 40)
    expect(out.length).toBeLessThanOrEqual(41) // 40 chars + ellipsis
    expect(out.endsWith('…')).toBe(true)
    expect(out).not.toContain('  ')
  })

  it('honors the Chinese full stop as a sentence boundary', () => {
    const text = '第一句完整保留。第二句也完整。第三句超出 SERP 摘要位长度限制需要被截断掉不能出现在描述里。'
    expect(clampDescription(text, 30)).toBe('第一句完整保留。第二句也完整。')
  })
})
