import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { heroStats, heroCtas } from '@/data/homepage'
import { localePath, heroImageVariant, heroHeaderAvif } from '@/lib/site'
import { siteConfig } from '@/config/site.config'

// sizes 单一事实源:img 与 layout 的手工 preload imageSizes 必须逐字符一致,
// 否则 preload 与实际请求变体不匹配会双下载/落空。
export const HERO_SIZES = '(min-width: 1152px) 1120px, calc(100vw - 32px)'

const heroSrc = siteConfig.heroImage
const heroSrcset = `${heroImageVariant(768)} 768w, ${heroSrc} 1730w`
const heroAvifSrcset = `${heroHeaderAvif(768)} 768w, ${heroHeaderAvif(1730)} 1730w`

export async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Home' })
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-lg">
      {/* Background image + layered atmospheric overlays */}
      <div className="relative aspect-[1730/909] w-full overflow-hidden">
        <picture>
          <source type="image/avif" srcSet={heroAvifSrcset} sizes={HERO_SIZES} />
          {/* 静态导出站无 image loader；hero 需手工 srcset/sizes + fetchPriority 精控 LCP。
              img 兜底全属性保留;img 在 picture 内不触发 no-img-element,无需 eslint-disable(--max-warnings 0 会把死指令标红) */}
          <img
            src={heroSrc}
            srcSet={heroSrcset}
            sizes={HERO_SIZES}
            alt={`${siteConfig.game.name} game characters`}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        {/* 多层叠加:底色渐变 + 余烬暖光 + 顶部暗角 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-[var(--color-accent)]/8" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-background)/_80%)]" />
      </div>

      {/* Content overlay */}
      <div className="relative -mt-20 px-6 pb-12 text-center">
        <div className="mx-auto max-w-3xl">
          {/* Badge with shimmer */}
          <div className="animate-fade-up mb-5 inline-block rounded-full shimmer-badge px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] shadow-sm ring-1 ring-[var(--color-primary)]/20">
            {t('heroBadge')}
          </div>

          {/* Main title with display font */}
          <h1 className="animate-fade-up animate-fade-up-delay-1 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ textShadow: '0 2px 20px color-mix(in oklch, var(--primary) 15%, transparent)' }}>
            {t('title')}
          </h1>

          {/* Description */}
          <p className="animate-fade-up animate-fade-up-delay-2 mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--color-muted-foreground)] sm:text-lg">
            {t('heroDescription')}
          </p>

          {/* Stats chips */}
          <div className="animate-fade-up animate-fade-up-delay-3 mt-7 flex flex-wrap justify-center gap-2">
            {heroStats.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)]/80 bg-[var(--color-card)]/90 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-sm">
                <span>{s.emoji}</span>{t(`stats.${s.id}`)}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="animate-fade-up animate-fade-up-delay-3 mt-8 flex flex-wrap justify-center gap-3">
            {heroCtas.map((cta) => (
              <Link
                key={cta.href}
                href={localePath(locale, cta.href)}
                className={
                  cta.variant === 'primary'
                    ? 'rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-md shadow-[var(--color-primary)]/20 transition-all duration-200 hover:shadow-lg hover:shadow-[var(--color-primary)]/30 hover:brightness-110 active:scale-[0.97]'
                    : 'rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]/80 px-6 py-2.5 text-sm font-semibold shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:shadow-md hover:bg-[var(--color-card)] active:scale-[0.97]'
                }
              >
                {t(cta.labelKey)} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
