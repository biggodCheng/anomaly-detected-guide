// guides 域 registry 级行为守护(slug/日期/answer-first 等数据完整性断言在 data/guides/guides.test.ts)。
import { describe, it, expect } from 'vitest'
import { getAllGuides, getGuide } from './guides'
import { CATEGORY_ORDER, CATEGORY_KEYS } from './guides/taxonomy'

describe('guides registry', () => {
  it('every guide category is in taxonomy CATEGORY_ORDER(且 CATEGORY_KEYS 有文案 key)', () => {
    for (const g of getAllGuides()) {
      expect(CATEGORY_ORDER, `guide "${g.slug}" category "${g.category}"`).toContain(g.category)
      expect(CATEGORY_KEYS[g.category], `CATEGORY_KEYS["${g.category}"]`).toBeTruthy()
    }
  })
  it('getGuide returns by slug', () => {
    expect(getGuide('en', 'beginner-guide')?.title).toBeTruthy()
    expect(getGuide('en', 'nonexistent')).toBeUndefined()
  })
  it('every section has a heading + at least one content field', () => {
    for (const g of getAllGuides()) {
      for (const s of g.sections) {
        expect(s.heading, g.slug).toBeTruthy()
        expect(s.body || s.items || s.table || s.tip, g.slug).toBeTruthy()
      }
    }
  })
})
