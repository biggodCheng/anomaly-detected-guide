import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { localePath } from './site'

/**
 * 逐页 alternates：自指 canonical + 全 locale 互指 hreflang + x-default。
 * 路径规则与 localePath 同源 —— 默认语言无前缀(指根路径),其他语言带前缀。
 *
 * 必须在每个 page 的 generateMetadata 里调用——Next.js metadata 是浅合并，
 * layout 级 alternates 会被所有未覆盖的子页整体继承（layout 也拿不到 pathname），
 * 在 layout 声明曾导致全站子页 canonical 集体指向语言首页。
 */
export function alternatesFor(locale: string, path: string): Metadata['alternates'] {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localePath(l, path)])),
      'x-default': localePath(routing.defaultLocale, path),
    },
  }
}
