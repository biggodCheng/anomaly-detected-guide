import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { LanguageSwitcherSlot } from '@/components/i18n/language-switcher-slot'
import { MobileNav } from '@/components/layout/mobile-nav'
import { SearchTrigger } from '@/components/search/search-trigger'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { routing } from '@/i18n/routing'
import { siteNameFor, localePath } from '@/lib/site'
import { headerNav } from '@/config/navigation.config'

// server 外壳:logo/桌面导航静态输出;4 个交互小岛(MobileNav/SearchTrigger/ThemeToggle/
// LanguageSwitcher)保持 client——后者需要 usePathname,已改为组件内部获取。
export async function Header({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Nav' })
  const tHeader = await getTranslations({ locale, namespace: 'Header' })
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href={localePath(locale, '/')} className="flex items-center gap-2 font-display font-bold tracking-tight transition-opacity hover:opacity-80">
          <span className="text-[var(--color-primary)]">{siteNameFor(locale)}</span>
          <span className="hidden rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)] sm:inline">{tHeader('badge')}</span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm lg:flex">
          {headerNav().map((it) => (
            <Link
              key={it.href}
              href={localePath(locale, it.href)}
              className="rounded-lg px-3 py-1.5 text-[var(--color-muted-foreground)] transition-colors duration-200 hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              {t(it.labelKey)}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <MobileNav />
          <SearchTrigger />
          <ThemeToggle />
          {routing.locales.length > 1 && <LanguageSwitcherSlot />}
        </div>
      </div>
    </header>
  )
}
