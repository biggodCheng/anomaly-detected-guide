// guides 内容 registry:未注册语言回退 en(UI 必须全译,内容渐进翻译)。
import type { Locale } from '@/i18n/routing'
import { createLocaleRegistry } from '@/lib/locale-registry'
import { enGuides, type Guide } from './en'

export type { Guide, GuideSection, GuideCategory } from './en'

const registry = createLocaleRegistry<Guide>(enGuides)

export const getAllGuides = (locale: Locale = 'en'): Guide[] => registry.all(locale)
export const getGuide = (locale: Locale, slug: string): Guide | undefined =>
  registry.all(locale).find((g) => g.slug === slug)
export const guideSlugs = enGuides.map((g) => g.slug)
