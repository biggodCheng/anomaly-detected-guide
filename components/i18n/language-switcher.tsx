'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { routing, localeMeta, type Locale } from '@/i18n/routing'
import { localePath, stripLocalePrefix } from '@/lib/site'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuPopup,
  DropdownMenuLinkItem,
} from '@/components/ui/dropdown-menu'

function localizedPathname(pathname: string, target: Locale): string {
  return localePath(target, stripLocalePrefix(pathname))
}

/** 语言下拉 —— 菜单项由 routing.locales 派生,新增语言零改动(仅补 localeMeta/messages)。
 *  client 岛:pathname 由 usePathname 自取,使 Header 外壳可整体 server 化。 */
export function LanguageSwitcher() {
  const current = useLocale() as Locale
  const pathname = usePathname() ?? '/'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-sm text-[var(--color-muted-foreground)] shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]"
        aria-label={localeMeta[current].name}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{localeMeta[current].name}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuPopup>
          {routing.locales.map((l) => {
            const isCurrent = l === current
            return (
              <DropdownMenuLinkItem
                key={l}
                href={localizedPathname(pathname, l)}
                aria-current={isCurrent ? 'true' : undefined}
                className={isCurrent ? 'font-medium text-[var(--color-primary)]' : undefined}
              >
                <Check className={`h-4 w-4 ${isCurrent ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
                {localeMeta[l].name}
              </DropdownMenuLinkItem>
            )
          })}
        </DropdownMenuPopup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
