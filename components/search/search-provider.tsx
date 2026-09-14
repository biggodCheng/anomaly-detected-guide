'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSearchShortcut } from './use-search-shortcut'

// dialog UI(base-ui + 查询逻辑)首次打开才下载;pagefind bundle(~375KB js+wasm+索引)
// 本就只在打开时加载。已知权衡:关闭即条件卸载,base-ui 的退出动画不播——
// 换取 dialog chunk 不进首屏 JS。loading 占位是纯视觉骨架(不带 dialog role:
// 此时无焦点管理,不宣告空 modal);Escape 由 provider 兜底,chunk 加载期也可关。
const SearchDialog = dynamic(
  () => import('./search-dialog').then((m) => ({ default: m.SearchDialog })),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[20vh] backdrop-blur-sm">
        <div className="w-full max-w-lg animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-lg">
          <div className="h-9 w-full rounded-lg bg-[var(--color-muted)]" />
          <div className="mt-4 space-y-2.5">
            <div className="h-4 w-3/4 rounded bg-[var(--color-muted)]" />
            <div className="h-4 w-1/2 rounded bg-[var(--color-muted)]" />
          </div>
        </div>
      </div>
    ),
  },
)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  // 打开对话框前的焦点元素:Base UI 的 finalFocus 在关闭时回归它——
  // dialog 无 DialogTrigger(trigger 走 CustomEvent),不传则关闭后焦点落到 BODY
  const lastActiveRef = useRef<HTMLElement | null>(null)
  const openSearch = () => {
    lastActiveRef.current = document.activeElement as HTMLElement | null
    setOpen(true)
  }
  useSearchShortcut(openSearch)

  useEffect(() => {
    window.addEventListener('open-search', openSearch)
    return () => window.removeEventListener('open-search', openSearch)
  }, [])

  // Escape 兜底:dynamic chunk 尚在加载时占位骨架自身不处理键盘,慢网误触 ⌘K
  // 后应能立即关掉。真实 dialog 挂载后其内部 Escape 处理与之幂等(均 setOpen(false))。
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {children}
      {open && <SearchDialog open={open} onOpenChange={setOpen} finalFocus={lastActiveRef} />}
    </>
  )
}
