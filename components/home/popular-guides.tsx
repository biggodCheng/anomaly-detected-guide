import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getAllGuides } from '@/data/guides'
import { type Locale } from '@/i18n/routing'
import { localePath } from '@/lib/site'

// SEO-optimized guides to highlight on homepage (in priority order)
const FEATURED_SLUGS = [
  'time-travel-puzzle-games',
  'anomaly-detection-games-online',
  'games-like-observation-duty',
  'anomaly-horror-games',
  'beginner-guide',
]

export async function PopularGuides({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Home' })
  const allGuides = getAllGuides(locale as Locale)
  // Show featured SEO guides first, then remaining guides
  const featured = FEATURED_SLUGS.map((slug) => allGuides.find((g) => g.slug === slug)).filter(Boolean)
  const remaining = allGuides.filter((g) => !FEATURED_SLUGS.includes(g.slug))
  const guides = [...featured, ...remaining]
  return (
    <section>
      <h2 className="section-title mb-6 text-2xl font-bold tracking-tight">{t('popularGuides.title')}</h2>
      <p className="-mt-4 mb-6 text-sm text-[var(--color-muted-foreground)]">{t('popularGuides.subtitle')}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <Link key={g.slug} href={localePath(locale, `/guides/${g.slug}`)} className="card-enhanced ember-glow group block rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
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
}
