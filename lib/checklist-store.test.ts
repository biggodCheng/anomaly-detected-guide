import { describe, it, expect, beforeEach } from 'vitest'
import { siteConfig } from '@/config/site.config'
import {
  CHECKLIST_STORAGE_KEY,
  loadChecklist,
  saveChecklist,
  toggleChecklist,
  resetChecklist,
} from './checklist-store'

describe('checklist-store', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('uses the siteId-derived storage key', () => {
    expect(CHECKLIST_STORAGE_KEY).toBe(`${siteConfig.siteId}_checklist_v1`)
  })

  it('returns an empty set when nothing is stored', () => {
    expect(loadChecklist().size).toBe(0)
  })

  it('round-trips a saved set', () => {
    saveChecklist(new Set(['koi', 'ant']))
    expect(loadChecklist()).toEqual(new Set(['koi', 'ant']))
  })

  it('tolerates corrupt JSON by returning an empty set', () => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, '{not json')
    expect(loadChecklist().size).toBe(0)
  })

  it('tolerates non-array JSON', () => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, '{"a":1}')
    expect(loadChecklist().size).toBe(0)
  })

  it('filters non-string entries on load', () => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(['koi', 42, null]))
    expect(loadChecklist()).toEqual(new Set(['koi']))
  })

  it('toggle is immutable and adds/removes', () => {
    const base = new Set(['koi'])
    const added = toggleChecklist(base, 'ant')
    expect(added).toEqual(new Set(['koi', 'ant']))
    expect(base).toEqual(new Set(['koi'])) // 原 Set 不被改动
    expect(toggleChecklist(added, 'koi')).toEqual(new Set(['ant']))
  })

  it('saveChecklist writes the raw key with the exact name', () => {
    saveChecklist(new Set(['koi']))
    expect(localStorage.getItem(`${siteConfig.siteId}_checklist_v1`)).toBe(JSON.stringify(['koi']))
  })

  it('reset removes the stored value', () => {
    saveChecklist(new Set(['koi']))
    resetChecklist()
    expect(localStorage.getItem(CHECKLIST_STORAGE_KEY)).toBeNull()
    expect(loadChecklist().size).toBe(0)
  })
})
