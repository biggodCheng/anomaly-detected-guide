import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { getAllRegions, getRegion } from '@/data/regions'
import { getCodexEntry } from '@/data/codex'
import { GuideSection } from '@/components/guides/guide-section'
import { Breadcrumb } from '@/components/seo/breadcrumb'
import { StructuredData, articleSchema } from '@/components/seo/structured-data'
import { alternatesFor } from '@/lib/alternates'
import { buildOpenGraph, buildTwitterCard, clampDescription } from '@/lib/seo'
import { absoluteUrl, localePath } from '@/lib/site'
import { codexEntryPath, regionEntryPath } from '@/lib/domain-slugs'
import { siteConfig } from '@/config/site.config'

export async function RegionDetail({ locale, slug }: { locale: string; slug: string }) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'RegionDetail' })
  const tCodex = await getTranslations({ locale, namespace: 'Codex.index' })
  const region = getRegion(slug)
  if (!region) notFound()
  const nextRegion = getAllRegions().find((r) => r.order === region.order + 1)

  return (
    <article>
      <Breadcrumb
        locale={locale}
        parents={['eras']}
        leaf={`Era ${region.order}: ${region.name}`}
        path={regionEntryPath(slug)}
      />
      <StructuredData
        schema={articleSchema({
          title: `${siteConfig.game.name} Era ${region.order} - ${region.name}`,
          description: `Era ${region.order} (${region.name}) guide for the ${siteConfig.game.name} game: ${region.timePeriod}. ${region.description.slice(0, 100)}...`,
          url: absoluteUrl(locale, regionEntryPath(slug)),
        })}
      />

      <h1 className="font-display text-3xl font-bold tracking-tight">Era {region.order}: {region.name}</h1>
      <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{region.timePeriod}</p>

      <h2 className="mt-8 text-lg font-bold">{t('overview')}</h2>
      {region.overview.map((s, i) => (
        <GuideSection key={i} section={s} />
      ))}

      <section className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
        <p className="text-sm text-[var(--color-muted-foreground)]">{region.description}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold">{t('environment')}</h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{region.environment}</p>
      </section>

      {region.cases.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-bold">{t('cases')}</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--color-border)] shadow-sm">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">{t('cases')} in {region.name}</caption>
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/60">
                  <th scope="col" className="px-4 py-2.5 text-left font-semibold text-[var(--color-foreground)]">{tCodex('colName')}</th>
                  <th scope="col" className="px-4 py-2.5 text-left font-semibold text-[var(--color-foreground)]">{tCodex('colDescription')}</th>
                </tr>
              </thead>
              <tbody>
                {region.cases.map((caseSlug) => {
                  const c = getCodexEntry(caseSlug)
                  if (!c) return null
                  return (
                    <tr key={caseSlug} className="border-b border-[var(--color-border)]/50 last:border-0 transition-colors hover:bg-[var(--color-muted)]/30">
                      <td className="px-4 py-2.5 font-medium">
                        <Link href={localePath(locale, codexEntryPath(c.slug))} className="text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary)]/80 hover:underline">
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-[var(--color-muted-foreground)]">{c.description.slice(0, 100)}...</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2.5 text-xs text-[var(--color-muted-foreground)]" aria-live="polite">{region.cases.length} {t('cases')}</p>
        </>
      )}

      {nextRegion && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold">{t('next')}</h2>
          <Link
            href={localePath(locale, regionEntryPath(nextRegion.slug))}
            className="group flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <span className="text-lg">🗺️</span>{' '}
            <span className="font-medium transition-colors group-hover:text-[var(--color-primary)]">{t('nextRegion', { order: nextRegion.order, name: nextRegion.name })}</span>
          </Link>
        </section>
      )}
    </article>
  )
}

export function regionDetailGenerateStaticParams() {
  return getAllRegions().map((r) => ({ slug: r.slug }))
}

export async function regionDetailMetadata(locale: string, slug: string) {
  const region = getRegion(slug)
  if (!region) return {}
  const title = `${region.name} - ${region.timePeriod}`
  const description = clampDescription(
    `Era ${region.order} (${region.name}): ${region.timePeriod} in the ${siteConfig.game.name} game. ${region.cases.length} case${region.cases.length === 1 ? '' : 's'}, clues and walkthrough for this historical period.`,
    160
  )
  return {
    alternates: alternatesFor(locale, regionEntryPath(slug)),
    title,
    description,
    openGraph: buildOpenGraph({ locale, path: regionEntryPath(slug), title, description, type: 'article' }),
    twitter: buildTwitterCard({ title, description }),
  }
}
