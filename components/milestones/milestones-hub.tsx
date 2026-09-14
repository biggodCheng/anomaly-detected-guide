import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Breadcrumb } from '@/components/seo/breadcrumb'
import { GuideSection } from '@/components/guides/guide-section'
import { MilestoneCard } from './milestone-card'
import { getTimelineEvents, reconstructionGuide, crossEraThread } from '@/data/milestones'
import { milestonePath } from '@/lib/domain-slugs'

export async function MilestonesHub({ locale }: { locale: string }) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Milestones' })
  const events = getTimelineEvents()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb locale={locale} parents={[]} leaf={t('index.title')} path={milestonePath()} />
      <h1 className="font-display text-3xl font-bold tracking-tight">⏳ {t('index.title')}</h1>
      <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">{t('index.intro')}</p>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold">{t('index.timelineTitle')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <MilestoneCard key={event.order} event={event} />
          ))}
        </div>
      </section>

      {reconstructionGuide.map((s, i) => (
        <GuideSection key={i} section={s} />
      ))}

      {crossEraThread.map((s, i) => (
        <GuideSection key={i} section={s} />
      ))}
    </div>
  )
}
