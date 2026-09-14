import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllAchievements, achievementsGuide } from '@/data/achievements'
import { AchievementTracker } from '@/components/achievements/achievement-tracker'
import { GuideSection } from '@/components/guides/guide-section'
import { Breadcrumb } from '@/components/seo/breadcrumb'
import { achievementPath } from '@/lib/domain-slugs'

export async function AchievementsHub({ locale }: { locale: string }) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Achievements.index' })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumb locale={locale} parents={[]} leaf={t('title')} path={achievementPath()} />
      <h1 className="font-display text-3xl font-bold tracking-tight">🏆 {t('title')}</h1>
      <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">{t('intro')}</p>

      <section className="mt-10">
        <AchievementTracker achievements={getAllAchievements()} />
      </section>

      {achievementsGuide.map((s, i) => (
        <GuideSection key={i} section={s} />
      ))}
    </div>
  )
}
