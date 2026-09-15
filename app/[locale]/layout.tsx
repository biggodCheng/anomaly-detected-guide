import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { routing, localeMeta, CLIENT_NAMESPACES, type Locale } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SearchProvider } from '@/components/search/search-provider'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { siteNameFor } from '@/lib/seo'
import { absoluteUrl, heroHeaderAvif, siteConfig, websiteSchema } from '@/lib/site'
import { HERO_SIZES } from '@/components/home/hero'
import '@/app/globals.css'

// 自托管 Inter(latin 可变字重 100-900)—— 与 next/font/google 构建期下载的是
// 同一份 Google 分发文件,视觉零变化;换来 build 零网络依赖(受限网络/无外网
// CI 上 `npm run build` 不再因 Google Fonts 超时而挂)。换字重/新版本时重抓:
// https://fonts.googleapis.com/css2?family=Inter:wght@100..900 的 latin 分片。
const inter = localFont({
  src: '../fonts/inter-latin-var.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
})

// Cinzel —— 罗马碑刻风 display 字体,专用于 h1/h2/hero 等装饰性大标题(奇幻史诗感)。
// 🔴 只声明 700:设计系统 font-display 类一律配 font-bold,next/font 会把声明的
// 全部字重 preload 进关键路径(~90KB),挤占 CSS/hero 的首屏带宽、拖 FCP——
// WARDogs 站 A/B 实测收缩到单字重后 mobile LCP 6.8s→4.2s(2026-09-15)。要用
// 其他字重时按需补声明并重测 LCP。
const cinzel = localFont({
  src: [{ path: '../fonts/cinzel-latin-700.woff2', weight: '700', style: 'normal' }],
  variable: '--font-cinzel',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Home' })
  const siteName = siteNameFor(locale)
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: siteName, template: `%s - ${siteName}` },
    description: t('siteDescription'),
    // NOTE: no `alternates` here — Next.js metadata shallow-merges, so a layout-level
    // alternates is inherited by every child page that doesn't define its own (and the
    // layout has no pathname). Each page calls alternatesFor(locale, path) instead.
    openGraph: {
      type: 'website',
      locale: localeMeta[locale as Locale].og,
      // 默认语言无前缀直达根(promote-default-locale 提升),必须走 absoluteUrl——
      // 手拼 `${url}/${locale}` 会给首页产出指向 404 的 og:url(/en 已被提升移走)
      url: absoluteUrl(locale, '/'),
      siteName,
      title: siteName,
      description: t('siteDescription'),
      images: [
        {
          url: siteConfig.ogImage.path,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
          alt: siteConfig.ogImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: t('siteDescription'),
      images: [siteConfig.ogImage.path],
    },
    icons: {
      icon: [
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
  }
}

// 只注入 CLIENT_NAMESPACES(定义与守护测试见 i18n/routing.ts / messages.test.ts):
// 其余 namespace 全部 server 渲染,注入只是白送 flight 序列化体积(~22KB/页)。
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as never)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Nav' })
  const messages = await getMessages()
  const clientMessages = Object.fromEntries(
    Object.entries(messages).filter(([ns]) => (CLIENT_NAMESPACES as readonly string[]).includes(ns)),
  )

  return (
    <html lang={locale} className={`${inter.variable} ${cinzel.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect:提前 DNS+TCP+TLS 握手,后续请求省 ~150-300ms(RTT 150ms 低速 4G)。
            只连首屏确实会用到的 origin;每多一个 preconnect 占一个 socket 池位(Chrome 6/HTTP1)。
            字体已自托管(next/font local),无需 preconnect Google Fonts。
            YouTube 缩略图已本地化(poster 传入 youtube-embed),i.ytimg 不再出现在
            首屏 —— 播放器连接由 facade 在用户 hover 时按需预热,不占 preconnect 位。 */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Preload LCP 候选:hero 图。用 imagesrcset+imagesizes 让浏览器按视口选正确变体
            (移动端 768w,桌面 1730w);避免只 preload 1730w 导致移动端 preload 失效。
            路径/sizes 全部派生(heroHeaderAvif + hero.tsx 的 HERO_SIZES 单一事实源),
            与 hero.tsx <picture> 的 avif source 逐字符一致 —— preload 才能命中。
            fetchpriority=high 让浏览器优先取它而非 CSS/字体。
            静态导出无 next/image loader,手工 preload 是 LCP <2.5s 的关键。 */}
        <link
          rel="preload"
          as="image"
          href={heroHeaderAvif(1730)}
          imageSrcSet={`${heroHeaderAvif(768)} 768w, ${heroHeaderAvif(1730)} 1730w`}
          imageSizes={HERO_SIZES}
          type="image/avif"
          fetchPriority="high"
        />
        <GoogleAnalytics />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema(locale)).replace(/</g, '\\u003c') }}
        />
        {/* WCAG 2.4.1 skip link:正文前有 ~40 个可聚焦元素,键盘用户第一个 Tab 命中的是它 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--radius-control)] focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          {t('skipToContent')}
        </a>
        <ThemeProvider>
          <NextIntlClientProvider messages={clientMessages}>
            <Header locale={locale} />
            <SearchProvider>{children}</SearchProvider>
            <Footer locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
