import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { getAllGuides, type Guide } from '@/data/guides'
import { CATEGORY_ORDER, CATEGORY_KEYS, MORE_GUIDES } from '@/data/guides/taxonomy'
import { type Locale } from '@/i18n/routing'
import { alternatesFor } from '@/lib/alternates'
import { buildOpenGraph, buildTwitterCard } from '@/lib/seo'
import { localePath } from '@/lib/site'
import { Breadcrumb } from '@/components/seo/breadcrumb'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Guides' })
  const title = t('index.title')
  const description = t('index.metaDescription')
  return {
    alternates: alternatesFor(locale, '/guides'),
    title,
    description,
    openGraph: buildOpenGraph({ locale, path: '/guides', title, description }),
    twitter: buildTwitterCard({ title, description }),
  }
}

export default async function GuidesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Guides' })
  const all = getAllGuides(locale as Locale)
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb locale={locale} parents={[]} leaf={t('index.title')} path="/guides" />
      <h1 className="font-display text-3xl font-bold tracking-tight">{t('index.title')}</h1>
      <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">{t('index.subtitle')}</p>

      <div className="mt-10 space-y-10">
        {CATEGORY_ORDER.map((cat) => {
          const guidesInCat = all.filter((g: Guide) => g.category === cat)
          if (guidesInCat.length === 0) return null
          return (
            <section key={cat}>
              <h2 className="mb-4 text-xl font-bold text-[var(--color-primary)]">{t(`categories.${CATEGORY_KEYS[cat]}`)}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {guidesInCat.map((g) => (
                  <Link key={g.slug} href={localePath(locale, `/guides/${g.slug}`)} className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{g.icon}</span>
                      <span className="font-semibold transition-colors group-hover:text-[var(--color-primary)]">{g.title}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">{g.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-[var(--color-primary)]">{t('moreGuides.title')}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {MORE_GUIDES.map((c) => (
            <Link key={c.key} href={localePath(locale, `/${c.path}`)} className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md">
              <div className="font-semibold transition-colors group-hover:text-[var(--color-primary)]">{t(`moreGuides.cards.${c.key}.title`)}</div>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">{t(`moreGuides.cards.${c.key}.desc`)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
