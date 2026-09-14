import type { TimelineEvent } from '@/data/milestones'
import { getRegion } from '@/data/regions'

export function MilestoneCard({ event }: { event: TimelineEvent }) {
  const era = getRegion(event.era)
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
          Order {event.order}
        </span>
        {era && <span className="text-xs text-[var(--color-muted-foreground)]">{era.name}</span>}
      </div>
      <h3 className="font-semibold">{event.event}</h3>
      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{event.description.slice(0, 100)}...</p>
    </div>
  )
}
