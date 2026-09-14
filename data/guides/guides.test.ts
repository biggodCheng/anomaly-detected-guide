import { describe, it, expect } from 'vitest'
import { enGuides } from './en'
import { CATEGORY_ORDER } from './taxonomy'
import { siteConfig } from '@/config/site.config'
import { siteNameFor } from '@/lib/seo'

const SLUGS = ['beginner-guide', 'cases-walkthrough', 'timeline-reconstruction', 'mechanics-explained']

describe('guides data integrity', () => {
  it('has the 4 pillar guides with unique slugs', () => {
    expect(enGuides).toHaveLength(4)
    expect(enGuides.map((g) => g.slug).sort()).toEqual([...SLUGS].sort())
  })
  it('every guide has valid category, dates and 4+ sections', () => {
    for (const g of enGuides) {
      expect(CATEGORY_ORDER, g.slug).toContain(g.category)
      expect(g.published).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(g.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(g.sections.length, g.slug).toBeGreaterThanOrEqual(4)
    }
  })
  it('first section is the Quick Answer (answer-first convention)', () => {
    for (const g of enGuides) {
      expect(g.sections[0].heading.toLowerCase(), g.slug).toContain('quick answer')
    }
  })
  it('titles are brand-free and SERP-short (title template appends the site name)', () => {
    // 布局 title template 是 `%s - ${siteName}`(siteName 自带游戏名)——数据层 title
    // 再写游戏名就是 SERP 双品牌重复;拼接后超 ~60 字符被截断,70 是关键词主体
    // 完整可见的防线。换站时阈值随 siteNameFor 长度自适应。
    for (const g of enGuides) {
      expect(g.title, `${g.slug} 不应含游戏名(模板后缀已带)`).not.toContain(siteConfig.game.name)
      const rendered = g.title.length + ' - '.length + siteNameFor('en').length
      expect(rendered, `${g.slug} 拼接后 ${rendered} 字符,超 SERP 防线`).toBeLessThanOrEqual(70)
    }
  })
})
