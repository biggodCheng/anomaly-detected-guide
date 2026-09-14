'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Lite YouTube Embed — 点击加载占位(首屏零 YouTube 请求)。
 * 原版 iframe 直接嵌入会拉取 ~500KB 的 player JS + CSS + Roboto 字体 +
 * 多轮 API 调用(见 PageSpeed 报告 LCP 9.9s 的主因)。
 * 本方案:首屏只加载一张 i.ytimg.com 缩略图(~12KB) + SVG 播放按钮;
 * 用户点击后替换为真实 iframe(privacy-enhanced youtube-nocookie.com)。
 * CSP:vercel.json 已有 frame-src youtube-nocookie.com + img-src i.ytimg.com。
 */
interface YouTubeEmbedProps {
  videoId: string
  title: string
}

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [activated, setActivated] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const activate = useCallback(() => {
    setActivated(true)
  }, [])

  // 激活后聚焦 iframe(键盘可达)
  useEffect(() => {
    if (activated && iframeRef.current) {
      iframeRef.current.focus()
    }
  }, [activated])

  if (activated) {
    return (
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] shadow-lg">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            tabIndex={0}
          />
        </div>
      </div>
    )
  }

  // 缩略图:YouTube 最高质量 mid-resolution(~480x360, ~12KB),
  // 不用 hqdefault(更模糊)或 maxres(不存在时 404)。
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] shadow-lg">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {/* 缩略图:loading=lazy 因为 trailer 在 hero 下方(非 LCP);
            decoding=async 不阻塞首屏渲染 */}
        <img
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full cursor-pointer object-cover transition-opacity duration-300 hover:opacity-90"
          onClick={activate}
        />
        {/* 播放按钮居中叠加层 */}
        <button
          type="button"
          onClick={activate}
          aria-label={`Play ${title}`}
          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/10 transition-colors hover:bg-black/20"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/90 shadow-lg transition-transform hover:scale-110 sm:h-20 sm:w-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8 text-white sm:h-10 sm:w-10"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}
