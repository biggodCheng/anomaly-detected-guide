import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getFaqData } from '@/data/faq'
import { FAQItem } from '@/components/faq/faq-item'
import { StructuredData } from '@/components/seo/structured-data'
import type { Locale } from '@/i18n/routing'
import { alternatesFor } from '@/lib/alternates'
import { buildOpenGraph, buildTwitterCard } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Faq' })
  const title = t('metaTitle')
  const description = t('metaDescription')
  return {
    alternates: alternatesFor(locale, '/faq'),
    title,
    description,
    openGraph: buildOpenGraph({ locale, path: '/faq', title, description }),
    twitter: buildTwitterCard({ title, description }),
  }
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Faq' })
  const items = getFaqData(locale as Locale)

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-8" data-pagefind-body>
      <StructuredData
        schema={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }}
      />

      <h1 className="font-display text-3xl font-bold tracking-tight">{t('title')}</h1>
      <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">{t('intro')}</p>

      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-6 shadow-sm">
        <div className="divide-y divide-[var(--color-border)]">
          {items.map((item, i) => (
            <FAQItem key={i} item={{ question: item.q, answer: item.a }} />
          ))}
        </div>
      </div>
    </main>
  )
}
