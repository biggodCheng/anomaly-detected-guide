'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

// (main) 路由组的错误边界:client 岛渲染期抛错时给出恢复路径(reset 重试),
// 而不是落到 Next 默认错误页 —— 此前全站唯一异常出口是 not-found,
// 换皮(数据形态最易出错的场景)期间渲染失败即无解。
export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('Error')
  // 错误必须落 console,否则 React 捕获后无迹可查——排错时靠 digest/stack 定位根因。
  useEffect(() => {
    console.error('[MainError boundary]', error.digest ? `digest=${error.digest}` : '', error)
  }, [error])
  return (
    <div className="flex flex-col items-center gap-5 px-4 py-20 text-center">
      <div className="text-5xl">⚠️</div>
      <h2 className="font-display text-2xl font-bold tracking-tight">{t('title')}</h2>
      <p className="max-w-md text-sm leading-7 text-[var(--color-muted-foreground)]">{t('description')}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-110 active:scale-[0.97]"
      >
        {t('retry')}
      </button>
    </div>
  )
}
