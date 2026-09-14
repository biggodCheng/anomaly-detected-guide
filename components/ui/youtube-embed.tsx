/**
 * YouTube 嵌入组件(privacy-enhanced youtube-nocookie.com)。
 * CSP 依赖 vercel.json / serve-out.mjs 的 frame-src + img-src(i.ytimg.com 缩略图)。
 */
interface YouTubeEmbedProps {
  videoId: string
  title: string
}

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] shadow-lg">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  )
}
