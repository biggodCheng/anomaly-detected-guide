import { describe, it, expect } from 'vitest'
import { createLocaleRegistry } from './locale-registry'

describe('createLocaleRegistry', () => {
  const en = [{ id: 'a' }, { id: 'b' }]

  it('returns registered data for a locale', () => {
    const registry = createLocaleRegistry(en)
    expect(registry.all('en')).toBe(en)
    expect(registry.byLocale).toEqual({ en })
  })

  it('falls back to en for an unregistered locale', () => {
    const registry = createLocaleRegistry(en)
    // 单语下 Locale 编译期即 'en';用越界值在运行时验证 ?? en 回退(为未来语言守护契约)
    const all = registry.all as (locale?: string) => typeof en
    expect(all('xx')).toBe(en)
    expect(registry.all()).toBe(en)
  })
})
