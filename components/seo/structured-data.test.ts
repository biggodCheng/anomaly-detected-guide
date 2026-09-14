import { describe, expect, it } from 'vitest'
import { videoGameSchema } from './structured-data'
import { siteConfig } from '@/config/site.config'

// videoGameSchema 是 /game hub 评分星标(Review Snippet)的唯一出口。
// 关键守护:aggregateRating 无真实数据绝不输出 —— 凭空标评分违反 Google
// 评论摘要垃圾政策,可能拖累整站富摘要资格。
describe('videoGameSchema', () => {
  it('emits the game entity wired to site config', () => {
    const schema = videoGameSchema({ locale: 'en', url: `${siteConfig.url}/game` })
    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': siteConfig.schemaType,
      name: siteConfig.game.name,
      url: `${siteConfig.url}/game`,
      applicationCategory: 'Game',
      operatingSystem: siteConfig.game.platforms.join(', '),
      author: { '@type': 'Organization', name: siteConfig.game.developer },
    })
    expect(schema.image).toEqual([`${siteConfig.url}${siteConfig.ogImage.path}`])
  })

  it('omits aggregateRating when no real rating exists (default config)', () => {
    const schema = videoGameSchema({ locale: 'en', url: `${siteConfig.url}/game` })
    expect('aggregateRating' in schema).toBe(false)
  })

  it('emits aggregateRating with bestRating 5 when a real rating is provided', () => {
    const schema = videoGameSchema({
      locale: 'en',
      url: `${siteConfig.url}/game`,
      rating: { value: 4.6, count: 1283 },
    })
    expect(schema.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.6,
      bestRating: 5,
      ratingCount: 1283,
    })
  })

  it('falls back to siteConfig.game.releaseDate for datePublished', () => {
    const schema = videoGameSchema({ locale: 'en', url: `${siteConfig.url}/game` })
    expect(schema.datePublished).toBe(siteConfig.game.releaseDate)
  })
})
