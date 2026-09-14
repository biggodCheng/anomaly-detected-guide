'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { loadChecklist, saveChecklist, toggleChecklist, resetChecklist } from '@/lib/checklist-store'
import type { Achievement } from '@/data/achievements'

export function AchievementTracker({ achievements }: { achievements: Achievement[] }) {
  const t = useTranslations('Achievements.index')
  const [done, setDone] = useState<Set<string>>(new Set())
  useEffect(() => {
    setDone(loadChecklist()) // SSR/首帧一致(hydration 安全),挂载后才读 localStorage
  }, [])
  const toggle = (id: string) => {
    // 函数式更新:拿最新 state 而非闭包里的旧 done,
    // 快速连点两个 checkbox 时不会因 stale closure 丢一次切换
    setDone((prev) => {
      const next = toggleChecklist(prev, id)
      saveChecklist(next)
      return next
    })
  }
  // 计数只认当前数据集:localStorage 可能残留已下线条目的孤儿 id,
  // 直接用 done.size 会出现 "7/6" 与 >100% 的进度条。
  // 空清单时 0/0 = NaN,进度条宽度会渲染成字面 "NaN%"
  const doneCount = achievements.filter((a) => done.has(a.id)).length
  const pct = achievements.length === 0 ? 0 : Math.round((doneCount / achievements.length) * 100)
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <p className="text-sm font-semibold">{t('progress', { done: doneCount, total: achievements.length })}</p>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--color-muted)]">
          <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <button
          onClick={() => { resetChecklist(); setDone(new Set()) }}
          className="rounded-lg border border-[var(--color-border)] px-2.5 py-1 text-xs shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-sm active:scale-95"
        >
          {t('reset')}
        </button>
      </div>
      <ul className="space-y-2">
        {achievements.map((a) => (
          <li key={a.id}>
            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-[var(--color-card)] p-4 text-sm shadow-sm transition-all duration-200 hover:shadow-md ${done.has(a.id) ? 'border-[var(--color-primary)]/20 opacity-75' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/30'}`}>
              <input
                type="checkbox"
                checked={done.has(a.id)}
                onChange={() => toggle(a.id)}
                className="mt-0.5 size-4 accent-[var(--color-primary)]"
              />
              <span>
                <span className={`font-medium ${done.has(a.id) ? 'line-through opacity-60' : ''}`}>{a.name}</span>
                <span className="ml-2 rounded-full bg-[var(--color-muted)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">{t(`category.${a.category}`)}</span>
                <span className="mt-1.5 block text-xs leading-6 text-[var(--color-muted-foreground)]">{a.description}</span>
                <span className="mt-1 block text-xs">{a.guide}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
