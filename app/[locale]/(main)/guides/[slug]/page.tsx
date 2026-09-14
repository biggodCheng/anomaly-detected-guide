import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { getAllGuides, getGuide, guideSlugs } from '@/data/guides'
import { DEEP_DIVES } from '@/data/guides/deep-dives'
import { GuideSection } from '@/components/guides/guide-section'
import { Breadcrumb } from '@/components/seo/breadcrumb'
import { StructuredData, articleSchema } from '@/components/seo/structured-data'
import { type Locale } from '@/i18n/routing'
import { alternatesFor } from '@/lib/alternates'
import { formatHumanDate } from '@/lib/date'
import { buildOpenGraph, buildTwitterCard, clampDescription } from '@/lib/seo'
import { absoluteUrl, localePath } from '@/lib/site'

export function generateStaticParams() {
  return guideSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const g = getGuide(locale as Locale, slug)
  if (!g) return {}
  const title = g.title
  // g.description 同时是正文 hero 副标题；metadata 侧收紧到 SERP 摘要位（约 160 字符）
  const description = clampDescription(g.description, 160)
  return {
    alternates: alternatesFor(locale, `/guides/${slug}`),
    title,
    description,
    openGraph: buildOpenGraph({ locale, path: `/guides/${slug}`, title, description, type: 'article' }),
    twitter: buildTwitterCard({ title, description }),
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Guides' })
  const g = getGuide(locale as Locale, slug)
  if (!g) notFound()
  const others = getAllGuides(locale as Locale).filter((o) => o.slug !== g.slug)

  return (
    <article>
      <Breadcrumb locale={locale} parents={['guide']} leaf={g.title} path={`/guides/${slug}`} />
      <StructuredData
        schema={articleSchema({
          title: g.title,
          description: g.description,
          url: absoluteUrl(locale, `/guides/${slug}`),
          datePublished: g.published,
          dateModified: g.lastUpdated,
        })}
      />

      <h1 className="flex items-center gap-3 font-display text-3xl font-bold tracking-tight">
        <span className="text-4xl">{g.icon}</span> {g.title}
      </h1>
      <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">{g.description}</p>

      <div className="mt-8">
        {g.sections.map((s, i) => (
          <GuideSection key={i} section={s} />
        ))}
      </div>

      <p className="mt-10 text-xs text-[var(--color-muted-foreground)]">
        {t('detail.publishedRow', { published: formatHumanDate(g.published), lastUpdated: formatHumanDate(g.lastUpdated) })}
      </p>

      {DEEP_DIVES[slug] && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold">{t('detail.deepDives')}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {DEEP_DIVES[slug].map((d) => (
              <Link
                key={d.href}
                href={localePath(locale, d.href)}
                className="group flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md"
              >
                <span className="text-lg">{d.icon}</span>{' '}
                <span className="font-medium transition-colors group-hover:text-[var(--color-primary)]">{d.en}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold">{t('detail.otherGuides')}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {others.map((o) => (
              <Link key={o.slug} href={localePath(locale, `/guides/${o.slug}`)} className="group flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md">
                <span className="text-lg">{o.icon}</span> <span className="font-medium transition-colors group-hover:text-[var(--color-primary)]">{o.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
