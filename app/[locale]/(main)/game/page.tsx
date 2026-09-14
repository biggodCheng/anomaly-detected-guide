import { getTranslations } from 'next-intl/server'
import { gameHub } from '@/data/game'
import { TopicPage, topicMetadata } from '@/components/topic/topic-page'
import { StructuredData, videoGameSchema } from '@/components/seo/structured-data'
import { siteConfig } from '@/config/site.config'
import { absoluteUrl, heroAvif, heroImageVariant } from '@/lib/site'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return topicMetadata(locale, '/game', 'Game')
}

export default async function GameInfoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Game' })
  const rating = siteConfig.game.rating
  return (
    <>
      <TopicPage
        locale={locale}
        path="/game"
        namespace="Game"
        icon="🎮"
        data={gameHub}
        showBreadcrumb
      />

      {/* 游戏实体 JSON-LD(评分星标目标);aggregateRating 仅在真实评分存在时输出 */}
      <StructuredData schema={videoGameSchema({ locale, url: absoluteUrl(locale, '/game') })} />

    <div className="mx-auto mt-10 max-w-4xl px-4">
      {/* 可见评分行:与 JSON-LD 的 aggregateRating 同源同值(Google 要求结构化数据与页面可见内容一致) */}
      {rating && (
        <p className="mb-3 text-center text-sm font-medium" data-testid="game-rating">
          {`${rating.value.toFixed(1)}/5 · ${rating.count.toLocaleString('en-US')} ratings`}
        </p>
      )}
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] shadow-sm">
        <picture>
          <source type="image/avif" srcSet={`${heroAvif(768)} 768w, ${heroAvif(1200)} 1200w`} sizes="(min-width: 896px) 864px, calc(100vw - 32px)" />
          <img
            src={heroImageVariant(768)}
            alt={t('index.gameplayImageAlt')}
            width={768}
            height={404}
            loading="lazy"
            decoding="async"
            className="w-full object-cover"
          />
        </picture>
      </div>
      <p className="mt-3 text-center text-xs text-[var(--color-muted-foreground)]">{t('index.gameplayCaption')}</p>
    </div>
    </>
  )
}
