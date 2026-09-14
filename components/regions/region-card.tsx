import Link from 'next/link'
import { localePath } from '@/lib/site'
import { regionEntryPath } from '@/lib/domain-slugs'
import type { Era } from '@/data/regions'

export function RegionCard({ locale, region }: { locale: string; region: Era }) {
  return (
    <Link
      href={localePath(locale, regionEntryPath(region.slug))}
      className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
          Era {region.order}
        </span>
        <span className="text-xs text-[var(--color-muted-foreground)]">{region.timePeriod}</span>
      </div>
      <h3 className="font-semibold group-hover:text-[var(--color-primary)]">{region.name}</h3>
      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{region.description.slice(0, 100)}...</p>
    </Link>
  )
}
