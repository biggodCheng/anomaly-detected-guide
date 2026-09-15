'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { NavTree } from './sidebar-nav'
import { type Locale } from '@/i18n/routing'
import { siteNameFor } from '@/lib/site'

/**
 * 移动/平板导航抽屉(<1024px 显示汉堡;≥1024px 桌面侧栏在场) —— 侧栏的等价窄屏入口。
 * 🔴 不用 @base-ui/dialog:它是全站 eager 的 @base-ui 消费方之一,会把共享 chunk
 * (~74KB,含 dialog/input/themes)拖进首屏 JS(PSI mobile 报告"未使用的
 * JavaScript 130KiB"实测主因,2026-09-15)。自管 Esc/焦点循环/滚动锁定的轻量实现;
 * NavTree 与桌面侧栏共用。
 */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const t = useTranslations('Header')
  const locale = useLocale() as Locale
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    queueMicrotask(() =>
      panelRef.current?.querySelector<HTMLElement>('[data-close]')?.focus(),
    )
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-[var(--color-foreground)]/70 transition-colors hover:bg-[var(--color-muted)] lg:hidden"
        aria-label={t('menu')}
        aria-haspopup="dialog"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      {mounted && open &&
        createPortal(
          <div role="dialog" aria-modal="true" aria-label={t('menu')} ref={panelRef}>
            <div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="fixed top-0 right-0 z-50 flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-background)] p-5 shadow-2xl outline-none">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-primary)]">
                  {siteNameFor(locale)}
                </span>
                <button
                  type="button"
                  data-close
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-[var(--color-foreground)]/70 transition-colors hover:bg-[var(--color-muted)]"
                  aria-label={t('menuClose')}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="text-sm">
                <NavTree onNavigate={() => setOpen(false)} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
