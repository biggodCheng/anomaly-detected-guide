// 内容域注册表 —— sitemap 与全站内链校验的动态发现源。
// 新增/删除内容域时只需改这个数组，sitemap 自动跟随。
// ANOMAL: cases / eras / clues 三个实体域 (timeline events 无独立页面)。
import { getDetailedCodex } from './codex'
import { getAllRegions } from './regions'
import { getAllClues } from './equipment'
import { codexPath, regionPath, equipmentPath } from '@/lib/domain-slugs'

export type ContentDomain = {
  /** URL 路径前缀（如 '/cases'） */
  pathPrefix: string
  /** 返回该域所有实体的 slug 列表 */
  slugs: () => string[]
}

/** 所有动态内容域 —— sitemap 遍历此数组生成实体页 URL */
export const contentDomains: ContentDomain[] = [
  { pathPrefix: codexPath(), slugs: () => getDetailedCodex().map((e) => e.slug) },
  { pathPrefix: regionPath(), slugs: () => getAllRegions().map((r) => r.slug) },
  // ANOMAL: clues 无独立详情页（仅作为案件调查中的线索列表），不生成 sitemap URL
]
