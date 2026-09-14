'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'

/** 快捷键提示跟随平台:Mac 显示 ⌘,其余显示 Ctrl。挂载后检测,避免 SSR/CSR 不一致。 */
export function SearchTrigger() {
  const t = useTranslations('Search')
  const [modKey, setModKey] = useState<string | null>(null)
  useEffect(() => {
    setModKey(/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl')
  }, [])
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
      className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-sm text-[var(--color-muted-foreground)] shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-sm"
      aria-label={t('title')}
    >
      <Search className="h-4 w-4" aria-hidden="true" />
      {modKey && <span className="hidden sm:inline">{modKey} K</span>}
    </button>
  )
}
