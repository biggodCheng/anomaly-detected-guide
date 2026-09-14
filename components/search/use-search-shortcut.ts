'use client'
import { useEffect } from 'react'

export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // e.code 匹配物理键位:俄/希腊等非拉丁布局下 e.key 不是拉丁字母 "k"。
      // 修饰键必须精确:Ctrl+Shift+K 是常见浏览器/用户组合,AltGr 在 Windows 上
      // 报告为 ctrlKey+altKey —— 不排斥会把用户输入(如 AltGr+K 字符)吞掉。
      if (
        (e.metaKey || e.ctrlKey) &&
        !e.shiftKey &&
        !e.altKey &&
        (e.code === 'KeyK' || e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault()
        onOpen()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onOpen])
}
