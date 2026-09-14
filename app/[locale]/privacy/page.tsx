import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesFor } from '@/lib/alternates'
import { buildOpenGraph, buildTwitterCard } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Privacy' })
  const title = t('metaTitle')
  const description = t('p1')
  return {
    alternates: alternatesFor(locale, '/privacy'),
    title,
    description,
    openGraph: buildOpenGraph({ locale, path: '/privacy', title, description }),
    twitter: buildTwitterCard({ title, description }),
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Privacy' })
  const sections = [
    { heading: t('analyticsHeading'), body: t('p2') },
    { heading: t('localHeading'), body: t('p3') },
    { heading: t('hostingHeading'), body: t('p4') },
  ]
  return (
    <main id="main-content" data-pagefind-body className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight">{t('title')}</h1>
      <p className="mt-4 leading-7 text-[var(--color-foreground)]/90">{t('p1')}</p>
      {sections.map((s) => (
        <section key={s.heading} className="mt-8">
          <h2 className="text-xl font-bold">{s.heading}</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-foreground)]/85">{s.body}</p>
        </section>
      ))}
    </main>
  )
}
