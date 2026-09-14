import { describe, it, expect } from 'vitest'
import { getFaqData } from './faq'

describe('faq data — flat {q, a}[] of core questions', () => {
  it('has 12-16 entries, each with non-empty q and a (answer-first)', () => {
    const items = getFaqData()
    expect(items.length).toBeGreaterThanOrEqual(12)
    expect(items.length).toBeLessThanOrEqual(16)
    for (const item of items) {
      expect(item.q.trim()).toBeTruthy()
      expect(item.a.trim()).toBeTruthy()
      expect(item.a.trim().length).toBeGreaterThan(40)
    }
  })
})
