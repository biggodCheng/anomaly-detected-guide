import type { Locale } from '@/i18n/routing'

export function createLocaleRegistry<T>(en: T[], translations: Partial<Record<Locale, T[]>> = {}) {
  const byLocale: Partial<Record<Locale, T[]>> = { en, ...translations }
  return { byLocale, all: (locale: Locale = 'en') => byLocale[locale] ?? en }
}
