import { getTranslations } from 'next-intl/server'
import { YouTubeEmbed } from '@/components/ui/youtube-embed'

//  换皮时替换 videoId 为当前游戏的官方 trailer ID(SOP Step 4 品牌资源 + 5 验证)。
// 当前值来自 ANOMAL 官方 trailer(bOp7W7f7EDw)。
const TRAILER_VIDEO_ID = 'bOp7W7f7EDw'

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
