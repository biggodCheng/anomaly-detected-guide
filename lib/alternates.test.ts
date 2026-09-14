import { describe, expect, it } from 'vitest'
import { alternatesFor } from '@/lib/alternates'

describe('alternatesFor', () => {
  it('generates a self-referencing canonical without a locale prefix', () => {
    expect(alternatesFor('en', '/guides/beginner-guide')?.canonical).toBe('/guides/beginner-guide')
  })

  it('handles the homepage path without trailing slash', () => {
    expect(alternatesFor('en', '')?.canonical).toBe('/')
    expect(alternatesFor('en', '')?.languages).toEqual({
      en: '/',
      'x-default': '/',
    })
  })

  it('emits hreflang only for configured locales plus x-default, all unprefixed', () => {
    expect(alternatesFor('en', '/bosses/ashen-warden')?.languages).toEqual({
      en: '/bosses/ashen-warden',
      'x-default': '/bosses/ashen-warden',
    })
  })
})
