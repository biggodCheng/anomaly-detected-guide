import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesFor } from '@/lib/alternates'
import { buildOpenGraph, buildTwitterCard, clampDescription } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'About' })
  const title = t('metaTitle')
  // p1 同时是正文首段；metadata 侧收紧到 SERP 摘要位
  const description = clampDescription(t('p1'), 160)
  return {
    alternates: alternatesFor(locale, '/about'),
    title,
    description,
    openGraph: buildOpenGraph({ locale, path: '/about', title, description }),
    twitter: buildTwitterCard({ title, description }),
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'About' })
  return (
    <main id="main-content" data-pagefind-body className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight">{t('title')}</h1>
      <p className="mt-4 leading-7 text-[var(--color-foreground)]/90">{t('p1')}</p>
      <p className="mt-4 leading-7 text-[var(--color-foreground)]/90">{t('p2')}</p>
      <p className="mt-4 leading-7 text-[var(--color-foreground)]/90">{t('p3')}</p>
      <h2 className="mt-10 text-xl font-bold">{t('contactHeading')}</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--color-muted-foreground)]">
        {t.rich('p4', {
          email: (chunks) => (
            <a href={`mailto:${t('email')}`} className="font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary)]/80 hover:underline">
              {chunks}
            </a>
          ),
        })}
      </p>
    </main>
  )
}
