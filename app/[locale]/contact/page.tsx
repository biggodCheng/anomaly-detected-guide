import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesFor } from '@/lib/alternates'
import { buildOpenGraph, buildTwitterCard } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Contact' })
  const title = t('metaTitle')
  const description = t('metaDescription')
  return {
    alternates: alternatesFor(locale, '/contact'),
    title,
    description,
    openGraph: buildOpenGraph({ locale, path: '/contact', title, description }),
    twitter: buildTwitterCard({ title, description }),
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Contact' })
  return (
    <main id="main-content" data-pagefind-body className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight">{t('title')}</h1>
      <p className="mt-4 leading-7 text-[var(--color-foreground)]/90">{t('p1')}</p>

      <h2 className="mt-10 text-xl font-bold">{t('emailHeading')}</h2>
      <a
        href={`mailto:${t('email')}`}
        className="mt-4 inline-flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-6 py-4 font-semibold shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md"
      >
        <span className="text-xl">✉️</span>
        <span className="text-[var(--color-primary)]">{t('email')}</span>
      </a>

      <h2 className="mt-10 text-xl font-bold">{t('correctionsHeading')}</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--color-muted-foreground)]">{t('corrections')}</p>
    </main>
  )
}
