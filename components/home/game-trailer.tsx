import { getTranslations } from 'next-intl/server'
import { YouTubeEmbed } from '@/components/ui/youtube-embed'

//  换皮时替换 videoId 为当前游戏的官方 trailer ID(SOP Step 4 品牌资源 + 5 验证)。
// 占位值来自 The Blood of Dawnwalker reveal trailer(AH1agOznQo8),
// 模板无自有游戏 trailer,重跑 node scripts/generate-favicons.mjs 同批次更新。
const TRAILER_VIDEO_ID = 'AH1agOznQo8'

export async function GameTrailer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Home' })
  return (
    <section>
      <h2 className="section-title mb-2 text-2xl font-bold tracking-tight">{t('trailerTitle')}</h2>
      <p className="-mt-3 mb-5 text-sm text-[var(--color-muted-foreground)]">{t('trailerSub')}</p>
      <YouTubeEmbed videoId={TRAILER_VIDEO_ID} title={t('trailerTitle')} />
    </section>
  )
}
