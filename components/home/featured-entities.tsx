import { getCodexEntry } from '@/data/codex'
import { featuredEntities } from '@/data/homepage'
import Link from 'next/link'
import { localePath } from '@/lib/site'
import { codexEntryPath } from '@/lib/domain-slugs'

export function FeaturedEntities({ locale }: { locale: string }) {
  const cases = featuredEntities.cases.map((pick) => {
    const entry = getCodexEntry(pick.slug)
    if (!entry) return null
    return { ...entry, emoji: pick.emoji }
  }).filter(Boolean)

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-2xl font-bold">Featured Cases</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cases.map((c) => c && (
          <Link
            key={c.slug}
            href={localePath(locale, codexEntryPath(c.slug))}
            className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="mb-2 text-2xl">{c.emoji}</div>
            <h3 className="font-semibold group-hover:text-[var(--color-primary)]">{c.name}</h3>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{c.description.slice(0, 80)}...</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
