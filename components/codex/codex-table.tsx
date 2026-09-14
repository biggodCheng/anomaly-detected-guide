'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { localePath } from '@/lib/site'
import { codexEntryPath } from '@/lib/domain-slugs'

/** 服务端投影后的最小字段:筛选与表格只消费这几列 */
export type CodexRow = {
  slug: string
  name: string
  era: string
  eraName: string
  description: string
}

/** 全量筛选表:按 era 筛选,所有条目链接到详情页。
 *  数据由 server 投影传入;eras 与数据域同源,显示真实 name */
export function CodexTable({ entries, eras }: {
  entries: CodexRow[]
  eras: { slug: string; name: string }[]
}) {
  const t = useTranslations('Codex.index')
  const locale = useLocale()
  const [era, setEra] = useState('all')

  const rows = useMemo(
    () => entries.filter((entry) => (era === 'all' || entry.era === era)),
    [entries, era]
  )

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          {t('filterEra')}
          <select value={era} onChange={(e) => setEra(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 py-1.5 text-sm shadow-sm transition-colors hover:border-[var(--color-primary)]/30 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
            <option value="all">{t('allEras')}</option>
            {eras.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
          </select>
        </label>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] shadow-sm">
        <table className="w-full text-sm">
          <caption className="sr-only">{t('tableTitle')}</caption>
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/60 text-left">
              <th scope="col" className="px-4 py-2.5 font-semibold">{t('colName')}</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">{t('colEra')}</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">{t('colDescription')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-[var(--color-muted-foreground)]">
                  <div className="text-lg">🔍</div>
                  <p className="mt-1">{t('filterEmpty')}</p>
                </td>
              </tr>
            )}
            {rows.map((entry) => (
              <tr key={entry.slug} className="border-b border-[var(--color-border)]/50 last:border-0 transition-colors hover:bg-[var(--color-muted)]/30">
                <td className="px-4 py-2.5 font-medium">
                  <Link href={localePath(locale, codexEntryPath(entry.slug))} className="text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary)]/80 hover:underline">{entry.name}</Link>
                </td>
                <td className="px-4 py-2.5 text-[var(--color-muted-foreground)]">{entry.eraName}</td>
                <td className="px-4 py-2.5 text-[var(--color-muted-foreground)]">{entry.description.slice(0, 100)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2.5 text-xs text-[var(--color-muted-foreground)]" aria-live="polite">{rows.length} / {entries.length}</p>
    </div>
  )
}
