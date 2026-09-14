'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { sidebarNav } from '@/config/navigation.config'
import { localePath, stripLocalePrefix } from '@/lib/site'

/** 完整导航树渲染 —— 桌面侧栏与移动抽屉共用(数据/文案/高亮单一来源)。 */
export function NavTree({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations('Sidebar')
  const locale = useLocale()
  const pathname = usePathname()
  return (
    <>
      {sidebarNav().map(({ id, items }) => (
        <div key={id} className="mb-4">
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">{t(`sections.${id}`)}</div>
          <ul className="space-y-0.5">
            {items.map((it) => {
              const href = localePath(locale, it.href)
              // 直接加载静态页时 usePathname() 是带 /<locale> 前缀的构建期路由,
              // 客户端导航后才是无前缀 URL —— 两侧都归一到裸路径再比,高亮才稳定。
              const active = pathname !== null && stripLocalePrefix(pathname) === it.href
              return (
                <li key={it.href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={
                      active
                        ? 'nav-active-indicator block rounded-lg bg-[var(--color-primary-bg)] pl-5 pr-3 py-1.5 font-medium text-[var(--color-primary)]'
                        : 'block rounded-lg px-3 py-1.5 text-[var(--color-muted-foreground)] transition-colors duration-200 hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                    }
                  >
                    {t(`links.${it.labelKeyBySurface?.sidebar ?? it.labelKey}`)}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </>
  )
}

export function SidebarNav() {
  return (
    <nav className="sticky top-20 space-y-2 text-sm">
      <NavTree />
    </nav>
  )
}
