import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesFor } from '@/lib/alternates'
import { Hero } from '@/components/home/hero'
import { GameTrailer } from '@/components/home/game-trailer'
import dynamic from 'next/dynamic'

// 下方折叠组件 dynamic import:首屏只渲染 Hero + Trailer(above-fold),
// 其余 chunk 延迟加载。每个组件 <1KB 的 loading 骨架(纯视觉,无 role)。
// LCP 不受影响(Hero 是 LCP 候选);TBT 因 JS 水合量减少而改善。
const PopularGuides = dynamic(
  () => import('@/components/home/popular-guides').then((m) => ({ default: m.PopularGuides })),
  { loading: () => <SectionSkeleton />, ssr: true },
)
const CoreTopics = dynamic(
  () => import('@/components/home/core-topics').then((m) => ({ default: m.CoreTopics })),
  { loading: () => <SectionSkeleton />, ssr: true },
)
const PopularQuestions = dynamic(
  () => import('@/components/home/popular-questions').then((m) => ({ default: m.PopularQuestions })),
  { loading: () => <SectionSkeleton />, ssr: true },
)
const FeaturedEntities = dynamic(
  () => import('@/components/home/featured-entities').then((m) => ({ default: m.FeaturedEntities })),
  { loading: () => <SectionSkeleton />, ssr: true },
)
const LatestUpdates = dynamic(
  () => import('@/components/home/latest-updates').then((m) => ({ default: m.LatestUpdates })),
  { loading: () => <SectionSkeleton />, ssr: true },
)
const HomeFaq = dynamic(
  () => import('@/components/home/home-faq').then((m) => ({ default: m.HomeFaq })),
  { loading: () => <SectionSkeleton />, ssr: true },
)

function SectionSkeleton() {
  return (
    <div className="animate-pulse space-y-4 rounded-xl border border-[var(--color-border)]/50 bg-[var(--color-card)]/30 p-6">
      <div className="h-6 w-48 rounded bg-[var(--color-muted)]" />
      <div className="h-4 w-72 rounded bg-[var(--color-muted)]/60" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-[var(--color-muted)]/40" />
        ))}
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Home' })
  // NOTE: only override `description`, `title` and `alternates` here. Setting openGraph/twitter
  // on the page REPLACES (not deep-merges) the layout's object, which would drop og:image,
  // og:type/url/siteName and twitter:card/images. The layout already serves a
  // fully localized (siteDescription) OG/Twitter set for every route.
  return {
    // absolute 绕过 layout 的 title template——首页是全站唯一不想拼品牌后缀的页
    title: { absolute: t('metaTitle') },
    description: t('metaDescription'),
    alternates: alternatesFor(locale, ''),
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <main id="main-content" data-pagefind-body className="mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-14">
        <Hero locale={locale} />
        <GameTrailer locale={locale} />
        <PopularGuides locale={locale} />
        <CoreTopics locale={locale} />
        <PopularQuestions />
        <FeaturedEntities locale={locale} />
        <LatestUpdates />
        <HomeFaq />
      </div>
    </main>
  )
}
