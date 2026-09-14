'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Menu, X } from 'lucide-react'
import { NavTree } from './sidebar-nav'
import { type Locale } from '@/i18n/routing'
import { siteNameFor } from '@/lib/site'

/** 移动/平板导航抽屉(<1024px 显示汉堡;≥1024px 桌面侧栏在场) —— 侧栏的等价窄屏入口。 */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('Header')
  const locale = useLocale() as Locale
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        className="rounded-lg p-2 text-[var(--color-foreground)]/70 transition-colors hover:bg-[var(--color-muted)] lg:hidden"
        aria-label={t('menu')}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <DialogPrimitive.Popup
          className="fixed top-0 right-0 z-50 flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-background)] p-5 shadow-2xl outline-none"
        >
          <div className="mb-5 flex items-center justify-between">
            <DialogPrimitive.Title className="text-sm font-bold text-[var(--color-primary)]">
              {siteNameFor(locale)}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              className="rounded-lg p-2 text-[var(--color-foreground)]/70 transition-colors hover:bg-[var(--color-muted)]"
              aria-label={t('menuClose')}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
          <div className="space-y-4 text-sm">
            <NavTree onNavigate={() => setOpen(false)} />
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
