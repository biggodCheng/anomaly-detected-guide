import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { footerNav } from '@/config/navigation.config'
import { siteConfig } from '@/config/site.config'
import { localePath } from '@/lib/site'

// server 组件:完全零交互(Link/a + 文案),locale 由 layout 传入。
export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Footer' })
  const columns = footerNav()
  return (
    <footer className="mt-16 border-t border-[var(--color-border)] bg-[var(--color-muted)]/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-display font-bold text-[var(--color-primary)]">{t('brand')}</div>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">{t('tagline')}</p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">{t('columns.guides')}</p>
            <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
              {columns.guides.map((l) => (
                <li key={l.href}>
                  <Link href={localePath(locale, l.href)} className="transition-colors duration-200 hover:text-[var(--color-primary)]">{t(`links.${l.labelKey}`)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">{t('columns.reference')}</p>
            <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
              {columns.reference.map((l) => (
                <li key={l.href}>
                  <Link href={localePath(locale, l.href)} className="transition-colors duration-200 hover:text-[var(--color-primary)]">{t(`links.${l.labelKey}`)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">{t('columns.official')}</p>
            <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
              {siteConfig.links.official && (
                <li><a href={siteConfig.links.official} className="transition-colors duration-200 hover:text-[var(--color-primary)]">{t('links.officialWebsite')}</a></li>
              )}
              {siteConfig.links.wiki && (
                <li><a href={siteConfig.links.wiki} className="transition-colors duration-200 hover:text-[var(--color-primary)]">{t('links.communityWiki')}</a></li>
              )}
              {siteConfig.links.steam && (
                <li><a href={siteConfig.links.steam} className="transition-colors duration-200 hover:text-[var(--color-primary)]">Steam</a></li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-muted-foreground)]">
          <p>{t('copyright1')}</p>
          <p className="mt-1">{t('copyright2')}</p>
          <p className="mt-3 flex gap-4">
            {columns.legal.map((l) => (
              <Link key={l.href} href={localePath(locale, l.href)} className="transition-colors duration-200 hover:text-[var(--color-primary)]">{t(`links.${l.labelKey}`)}</Link>
            ))}
          </p>
        </div>
      </div>
    </footer>
  )
}
