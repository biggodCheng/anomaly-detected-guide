import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getCodexEntry } from '@/data/codex'
import { getRegion } from '@/data/regions'
import { Breadcrumb } from '@/components/seo/breadcrumb'
import { StructuredData, articleSchema } from '@/components/seo/structured-data'
import { alternatesFor } from '@/lib/alternates'
import { buildOpenGraph, buildTwitterCard, clampDescription } from '@/lib/seo'
import { absoluteUrl, localePath } from '@/lib/site'
import { codexEntryPath, regionEntryPath } from '@/lib/domain-slugs'

export async function codexDetailMetadata(locale: string, slug: string) {
  const m = getCodexEntry(slug)
  if (!m) return {}
  const t = await getTranslations({ locale, namespace: 'CodexDetail' })
  const title = `${m.name} - ${t('metaTitle')}`
  const description = clampDescription(`${m.name}: ${m.description}`, 155)
  return {
    alternates: alternatesFor(locale, codexEntryPath(slug)),
    title,
    description,
    openGraph: buildOpenGraph({ locale, path: codexEntryPath(slug), title, description, type: 'article' }),
    twitter: buildTwitterCard({ title, description }),
  }
}

export async function CodexDetail({ locale, slug }: { locale: string; slug: string }) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'CodexDetail' })
  const m = getCodexEntry(slug)
  if (!m) notFound()

  const era = getRegion(m.era)

  return (
    <article>
      <Breadcrumb locale={locale} parents={['cases']} leaf={m.name} path={codexEntryPath(slug)} />
      <StructuredData
        schema={articleSchema({
          title: `${m.name} - ${t('metaTitle')}`,
          description: `${m.name}: ${m.description.slice(0, 140)}...`,
          url: absoluteUrl(locale, codexEntryPath(slug)),
        })}
      />

      <h1 className="font-display text-3xl font-bold tracking-tight">{m.name}</h1>

      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
        <p className="text-sm text-[var(--color-muted-foreground)]">{m.description}</p>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-bold">{t('era')}</h2>
        <p className="mt-2 text-sm">
          {era ? (
            <a href={localePath(locale, regionEntryPath(era.slug))} className="font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary)]/80 hover:underline">
              {era.name} ({era.timePeriod})
            </a>
          ) : (
            m.era
          )}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold">{t('objectives')}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {m.objectives.map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold">{t('clues')}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {m.clues.map((clue, i) => (
            <li key={i}>{clue}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
        <h2 className="text-lg font-bold">{t('solution')}</h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{m.solution}</p>
      </section>
    </article>
  )
}
