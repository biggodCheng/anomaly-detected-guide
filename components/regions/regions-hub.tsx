import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Breadcrumb } from '@/components/seo/breadcrumb'
import { GuideSection } from '@/components/guides/guide-section'
import { RegionCard } from './region-card'
import { getAllRegions, getRegionsData } from '@/data/regions'
import { regionPath } from '@/lib/domain-slugs'

export async function RegionsHub({ locale }: { locale: string }) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Regions' })
  const regions = getAllRegions()
  const data = getRegionsData()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb locale={locale} parents={[]} leaf={t('index.title')} path={regionPath()} />
      <h1 className="font-display text-3xl font-bold tracking-tight">🌍 {t('index.title')}</h1>
      <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">{t('index.intro')}</p>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold">{t('index.erasTitle')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {regions.map((region) => (
            <RegionCard key={region.slug} locale={locale} region={region} />
          ))}
        </div>
      </section>

      {data.sections.map((s, i) => (
        <GuideSection key={i} section={s} />
      ))}
    </div>
  )
}
