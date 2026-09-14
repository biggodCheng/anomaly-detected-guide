// 收集清单进度存储 — Key 用 config 的 siteId 命名空间(值为 fom_checklist_v1,与 PRD §4.3 一致)。
// 值 = 已勾选条目 id 的 JSON 数组(id 为 data/achievements 的 kebab-case slug,跨语言/增量稳定)。
// 纯函数 + SSR 安全:只有显式调用才触 localStorage(next build 预渲染阶段 import 无副作用)。
import { siteConfig } from '@/config/site.config'

export const CHECKLIST_STORAGE_KEY = `${siteConfig.siteId}_checklist_v1`

export function loadChecklist(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(CHECKLIST_STORAGE_KEY)
    if (!raw) return new Set()
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((x): x is string => typeof x === 'string'))
  } catch {
    return new Set() // 损坏 JSON / 隐私模式读取异常 → 空集,页面照常可用
  }
}

export function saveChecklist(collected: Set<string>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify([...collected]))
  } catch {
    // 写入失败(隐私模式等)静默:进度仅在当前会话内有效
  }
}

export function toggleChecklist(collected: Set<string>, id: string): Set<string> {
  const next = new Set(collected)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

export function resetChecklist(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(CHECKLIST_STORAGE_KEY)
  } catch {
    // ignore
  }
}
