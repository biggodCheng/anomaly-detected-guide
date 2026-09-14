import type { GuideSection as Section } from '@/data/guides'

export function GuideSection({ section }: { section: Section }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-[var(--color-primary)]">{section.heading}</h2>
      <div className="mt-3 space-y-3">
        {section.body && <p className="leading-7 text-[var(--color-foreground)]/90">{section.body}</p>}
        {section.items && (
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-7 text-[var(--color-muted-foreground)]">
            {section.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        )}
        {section.table && (
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] shadow-sm">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">{section.heading}</caption>
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/60">
                  {section.table.headers.map((h, i) => (
                    <th scope="col" key={i} className="px-4 py-2.5 text-left font-semibold text-[var(--color-foreground)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-[var(--color-border)]/50 last:border-0 transition-colors hover:bg-[var(--color-muted)]/30">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2.5 text-[var(--color-muted-foreground)]">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {section.tip && (
          <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-4 py-3 text-sm leading-7">
            💡 {section.tip}
          </div>
        )}
      </div>
    </section>
  )
}
