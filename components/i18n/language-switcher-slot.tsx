'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { routing } from '@/i18n/routing'

// 语言切换器的按需外壳:单语站(routing.locales.length <= 1)永不下载
// @base-ui 依赖链(dropdown-menu 等 ~200KB raw,PSI 报告实测全列 unused)。
// 🔴 仅靠渲染层条件(routing.locales.length > 1 && <X/>)挡不住静态 import
// 的 eager chunk;必须 dynamic ssr:false + 挂载期再判多语。
const LanguageSwitcher = dynamic(
  () => import('./language-switcher').then((m) => ({ default: m.LanguageSwitcher })),
  { ssr: false },
)

export function LanguageSwitcherSlot() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (routing.locales.length > 1) setShow(true)
  }, [])
  if (!show) return null
  return <LanguageSwitcher />
}
