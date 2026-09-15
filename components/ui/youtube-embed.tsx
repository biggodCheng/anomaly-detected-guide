'use client'

/**
 * YouTube 点击式 facade(privacy-enhanced youtube-nocookie.com)。
 * 🔴 不做即时 iframe:YouTube base.js + 衍生脚本数百 KB + 多个长任务,
 * 拖 LCP 渲染延迟与 TBT(PSI mobile 报告实测主因)。
 * 首屏只出本地懒加载缩略图;pointerenter 预连接,点击才注入 autoplay iframe。
 * CSP 依赖 vercel.json 的 frame-src + img-src(i.ytimg.com 兜底缩略图)。
 */
import { useState } from 'react'

interface YouTubeEmbedProps {
  videoId: string
  title: string
  /** 本地 poster(推荐,如 /images/trailer-<siteId>.jpg):默认 i.ytimg 走 Google CDN,
   *  不可达地区 poster 永远空白,且外部请求会拖累加载——传本地路径零外部依赖。 */
  poster?: string
}

export function YouTubeEmbed({ videoId, title, poster }: YouTubeEmbedProps) {
  const [active, setActive] = useState(false)
  const [warm, setWarm] = useState(false)

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] shadow-lg">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <>
            {warm && (
              // React 19 自动提升到 <head>;仅在用户指针意图出现后建立连接
              <>
                <link rel="preconnect" href="https://www.youtube-nocookie.com" />
                <link rel="preconnect" href="https://i.ytimg.com" />
              </>
            )}
            <button
              type="button"
              onPointerEnter={() => setWarm(true)}
              onFocus={() => setWarm(true)}
              onClick={() => setActive(true)}
              aria-label={`Play video: ${title}`}
              className="group absolute inset-0 h-full w-full cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- 静态导出站无 image loader,懒加载缩略图走本地 poster(CSP img-src 'self' 放行) */}
              <img
                src={poster ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt=""
                width={960}
                height={540}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/25" />
              <span className="absolute left-1/2 top-1/2 flex h-14 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-[#ff0000] shadow-xl transition-transform group-hover:scale-105" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-white"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
