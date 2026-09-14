import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { GuideSection } from '@/components/guides/guide-section'
import { Breadcrumb } from '@/components/seo/breadcrumb'
import { StructuredData, articleSchema } from '@/components/seo/structured-data'
import type { NavHubKey } from '@/config/navigation.config'
import { alternatesFor } from '@/lib/alternates'
import { buildOpenGraph, buildTwitterCard } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { topicDates, topicDateRow } from '@/data/content-dates'
import type { TopicData } from '@/data/types'

/**
 * topic 页引擎:固定路由的内容页共用(meta + 面包屑 + h1 + sections)。
 * 页面文案(title/intro/meta)取 messages 的 <namespace>.index.*,
 * 正文 sections 来自 data/<域>/en.ts 的素材转化(Quick Answer 前置)。
 */
export async function TopicPage({
  locale,
  path,
  namespace,
  icon,
  data,
  hubKey,
  showBreadcrumb,
}: {
  locale: string
  path: string
  namespace: string
  icon: string
  data: TopicData
  hubKey?: NavHubKey
  /** hub 根页的面包屑(无中间层):替换各页复制粘贴、且绕过翻译层的 breadcrumbSchema */
  showBreadcrumb?: boolean
}) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace })
  const dates = topicDates[path]
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {(hubKey || showBreadcrumb) && (
        <Breadcrumb locale={locale} parents={hubKey ? [hubKey] : []} leaf={t('index.title')} path={path} />
      )}
      {dates ? (
        <StructuredData
          schema={articleSchema({
            title: t('index.title'),
            description: t('index.metaDescription'),
            url: absoluteUrl(locale, path),
            datePublished: dates.published,
            dateModified: dates.modified,
          })}
        />
      ) : null}
      <h1 className="font-display text-3xl font-bold tracking-tight">{icon} {t('index.title')}</h1>
      <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">{t('index.intro')}</p>
      {dates ? <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{topicDateRow(dates)}</p> : null}
      <div className="mt-2">
        {data.sections.map((s, i) => (
          <GuideSection key={i} section={s} />
        ))}
      </div>
    </div>
  )
}

/** topic 页 generateMetadata 的共用实现 */
export async function topicMetadata(
  locale: string,
  path: string,
  namespace: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace })
  const title = t('index.metaTitle')
  const description = t('index.metaDescription')
  return {
    alternates: alternatesFor(locale, path),
    title,
    description,
    openGraph: buildOpenGraph({ locale, path, title, description, type: 'article' }),
    twitter: buildTwitterCard({ title, description }),
  }
}
