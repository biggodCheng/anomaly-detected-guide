import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CodexTable } from '@/components/codex/codex-table'
import { GuideSection } from '@/components/guides/guide-section'
import { Breadcrumb } from '@/components/seo/breadcrumb'
import { casesGuide, casesNotes, getAllCodex } from '@/data/codex'
import { getAllRegions } from '@/data/regions'
import { siteConfig } from '@/config/site.config'
import { codexPath } from '@/lib/domain-slugs'

export async function CodexHub({ locale }: { locale: string }) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Codex' })
  // server 投影:筛选表只需最小字段
  // eraName 用数据域真实名称
  const eras = getAllRegions().map((r) => ({ slug: r.slug, name: r.name }))
  const entries = getAllCodex().map((entry) => ({
    slug: entry.slug,
    name: entry.name,
    era: entry.era,
    eraName: eras.find((r) => r.slug === entry.era)?.name ?? entry.era,
    description: entry.description,
  }))
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb locale={locale} parents={[]} leaf={t('index.title')} path={codexPath()} />
      <h1 className="font-display text-3xl font-bold tracking-tight">🔍 {t('index.title')}</h1>
      <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">{t('index.intro')}</p>

      <div className="mt-8 overflow-hidden rounded-xl border border-[var(--color-border)] shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element -- 静态导出站无 image loader，宽高已显式声明 */}
        <img
          src={siteConfig.codexHeader}
          alt={`${siteConfig.game.name} - All Cases by Era Guide`}
          width={1200}
          height={400}
          loading="lazy"
          decoding="async"
          className="w-full object-cover"
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold">{t('index.tableTitle')}</h2>
        <CodexTable entries={entries} eras={eras} />
      </section>

      {[...casesGuide, ...casesNotes].map((s, i) => (
        <GuideSection key={i} section={s} />
      ))}
    </div>
  )
}
