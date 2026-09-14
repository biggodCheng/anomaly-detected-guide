import { siteConfig } from '@/config/site.config'
import { absoluteUrl, siteNameFor } from '@/lib/site'

/**
 * HTML-escape JSON for safe embedding inside <script> tags.
 * JSON.stringify doesn't escape </, so a value containing </script> would
 * break out of the script tag and execute as HTML/JS. Escaping / to \/ is
 * valid JSON (RFC 8259 §7) and prevents the HTML parser from recognizing
 * the end-tag sequence. All inputs here are developer-controlled strings,
 * but defense-in-depth matters when a reskin introduces game names/descriptions.
 */
function escapeForScript(obj: object): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c')
}

type ArticleSchemaInput = {
  title: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
  /** 多语言时传当前 locale(站名/about 链接按语言取);单语默认 defaultLocale */
  locale?: string
}

type HowToStep = {
  name: string
  text: string
  itemList?: string[]
}

type VideoGameSchemaInput = {
  /** 页面规范 URL(通常 absoluteUrl(locale, '/game')) */
  url: string
  /** 多语言时传当前 locale;单语默认 defaultLocale */
  locale?: string
  /** 发售日 ISO;缺省回退 siteConfig.game.releaseDate */
  releaseDate?: string
  /**
   * 评分;缺省回退 siteConfig.game.rating,两者皆无则不输出 aggregateRating。
   * Google 要求评分与页面可见内容一致,凭空标/照抄来源不明的评分会被判 spam。
   */
  rating?: { value: number; count: number }
}

type HowToSchemaInput = {
  name: string
  description: string
  url: string
  steps: HowToStep[]
  totalTime?: string
  /** 多语言时传当前 locale(站名/about 链接按语言取);单语默认 defaultLocale */
  locale?: string
}

export function StructuredData({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeForScript(schema) }}
    />
  )
}

export function articleSchema({ title, description, url, datePublished, dateModified, locale }: ArticleSchemaInput) {
  // author/image/publisher 由站点身份统一补全(E-E-A-T 信号),调用方只关心页面级字段
  const lang = locale ?? siteConfig.defaultLocale
  const siteName = siteNameFor(lang)
  const publisher = {
    '@type': 'Organization',
    name: siteName,
    url: absoluteUrl(lang, '/about'),
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    image: [`${siteConfig.url}${siteConfig.ogImage.path}`],
    author: publisher,
    publisher,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

/**
 * /game hub 的游戏实体 schema(评分星标的目标实体)。
 * aggregateRating 只在存在真实评分数据时输出;datePublished 用真实发售日。
 */
export function videoGameSchema({ url, locale, releaseDate, rating }: VideoGameSchemaInput) {
  const date = releaseDate ?? siteConfig.game.releaseDate
  const r = rating ?? siteConfig.game.rating
  const lang = locale ?? siteConfig.defaultLocale
  return {
    '@context': 'https://schema.org',
    '@type': siteConfig.schemaType,
    name: siteConfig.game.name,
    url,
    inLanguage: lang,
    image: [`${siteConfig.url}${siteConfig.ogImage.path}`],
    applicationCategory: 'Game',
    operatingSystem: siteConfig.game.platforms.join(', '),
    author: { '@type': 'Organization', name: siteConfig.game.developer },
    ...(date ? { datePublished: date } : {}),
    ...(r
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: r.value,
            bestRating: 5,
            ratingCount: r.count,
          },
        }
      : {}),
  }
}

export function howToSchema({ name, description, url, steps, totalTime, locale }: HowToSchemaInput) {
  const lang = locale ?? siteConfig.defaultLocale
  const siteName = siteNameFor(lang)
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    url,
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.itemList ? `${step.text}\n\n${step.itemList.map((item, j) => `${j + 1}. ${item}`).join('\n')}` : step.text,
    })),
    author: {
      '@type': 'Organization',
      name: siteName,
      url: absoluteUrl(lang, '/about'),
    },
  }
}

type FaqItem = {
  question: string
  answer: string
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

type ItemListItem = {
  name: string
  description?: string
  url?: string
  position: number
}

export function itemListSchema({ name, description, url, items }: { name: string; description?: string; url?: string; items: ItemListItem[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
    ...(url ? { url } : {}),
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      ...(item.description ? { description: item.description } : {}),
      ...(item.url ? { url: item.url } : {}),
    })),
  }
}
