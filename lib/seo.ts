import type { Metadata } from 'next'
import { localeMeta } from '@/i18n/routing'
import { siteConfig } from '@/config/site.config'
import { absoluteUrl, siteNameFor } from '@/lib/site'

export { siteNameFor }

/**
 * 子页完整 openGraph 对象。Next.js 的 openGraph 是整对象替换（非深合并），
 * 子页必须一次性给全 type/locale/url/siteName/images，否则丢 og:image 等字段
 * （这正是此前 128 页 OG 锁死首页默认值的根因）。
 */
export function buildOpenGraph({
  locale,
  path,
  title,
  description,
  image = siteConfig.ogImage.path,
  type = 'website',
}: {
  locale: string
  path: string
  title: string
  description: string
  image?: string
  /** og:type 与 JSON-LD 语义对齐:输出 Article JSON-LD 的内容页传 'article',
   *  hub/工具页保持默认 website —— 丢 article 语义会让社交分享失去发布时间等富摘要。 */
  type?: 'website' | 'article'
}): NonNullable<Metadata['openGraph']> {
  return {
    type,
    locale: localeMeta[locale as keyof typeof localeMeta]?.og,
    url: absoluteUrl(locale, path),
    siteName: siteNameFor(locale),
    title,
    description,
    images: [{ url: image, width: siteConfig.ogImage.width, height: siteConfig.ogImage.height, alt: siteConfig.ogImage.alt }],
  }
}

export function buildTwitterCard({
  title,
  description,
  image = siteConfig.ogImage.path,
}: {
  title: string
  description: string
  image?: string
}): NonNullable<Metadata['twitter']> {
  return {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
  }
}

/**
 * SERP 摘要位约 160 英文字符（中文约 80 字）。bio/description 同时是页面
 * 正文，只在 metadata 拼接处收紧：优先截到最后一个完整句，句子放不下则
 * 按词边界 + 省略号（词边界也没有时硬截）。
 */
export function clampDescription(text: string, limit: number): string {
  if (text.length <= limit) return text
  const head = text.slice(0, limit)
  const sentenceEnd = Math.max(head.lastIndexOf('. '), head.lastIndexOf('。'))
  if (sentenceEnd > limit * 0.4) return text.slice(0, sentenceEnd + 1)
  const wordEnd = head.lastIndexOf(' ')
  return wordEnd > limit * 0.4 ? head.slice(0, wordEnd) + '…' : head.trimEnd() + '…'
}
