import { getTranslations } from 'next-intl/server'
import { YouTubeEmbed } from '@/components/ui/youtube-embed'
import { siteConfig } from '@/config/site.config'

//  换皮时替换 videoId 为当前游戏的官方 trailer ID(SOP Step 4 品牌资源 + 5 验证)。
// poster 按站派生 /images/trailer-<siteId>.jpg(maxresdefault 缩到 960w q70,~40KB,
// 换站时随品牌资产一起生成),零外部依赖。
const TRAILER_VIDEO_ID = 'bOp7W7f7EDw' // 官方 trailer;换站时必改为当前游戏视频ID

export async function GameTrailer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Home' })
  return (
    <section>
      <h2 className="section-title mb-2 text-2xl font-bold tracking-tight">{t('trailerTitle')}</h2>
      <p className="-mt-3 mb-5 text-sm text-[var(--color-muted-foreground)]">{t('trailerSub')}</p>
      <YouTubeEmbed videoId={TRAILER_VIDEO_ID} title={t('trailerTitle')} poster={`/images/trailer-${siteConfig.siteId}.jpg`} />
    </section>
  )
}
