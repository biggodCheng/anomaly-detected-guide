import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesFor } from '@/lib/alternates'
import { Hero } from '@/components/home/hero'
import { GameTrailer } from '@/components/home/game-trailer'
import { PopularGuides } from '@/components/home/popular-guides'
import { CoreTopics } from '@/components/home/core-topics'
import { PopularQuestions } from '@/components/home/popular-questions'
import { FeaturedEntities } from '@/components/home/featured-entities'
import { LatestUpdates } from '@/components/home/latest-updates'
import { HomeFaq } from '@/components/home/home-faq'

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
