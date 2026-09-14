// faq 内容:单语直接 re-export(扩语言时引 createLocaleRegistry)。
import type { Locale } from '@/i18n/routing'
import { enFaqData, type FAQItem } from './en'

export type { FAQItem } from './en'

export const getFaqData = (_locale: Locale = 'en'): FAQItem[] => enFaqData
