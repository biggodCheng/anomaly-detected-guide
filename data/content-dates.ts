// topic 页(TopicPage 引擎渲染的路由)的内容日期单一来源。
// guides 域自带 published/lastUpdated 字段,topic 域数据无此字段——集中于此,
// 渲染 Article schema 的 datePublished/dateModified 与页头 "Last updated" 行。
// 维护纪律:改动某域 data/ 内容后,同步把该域各页 modified 更新为提交日。
// ANOMAL:游戏未发布,日期使用发布前的占位日期。
import { formatHumanDate } from '@/lib/date'
import { equipmentPath, economyPath, multiplayerPath } from '@/lib/domain-slugs'

const ANOMAL = { published: '2026-09-01', modified: '2026-09-14' }

// ANOMAL 域 URL 段通过 domain-slugs 配置化
const eqPath = equipmentPath() // /clues
const ecPath = economyPath() // /mechanics
const mpPath = multiplayerPath() // /guide

export const topicDates: Record<string, { published: string; modified: string }> = {
  // Game info pages
  '/game': ANOMAL,
  '/game/controls': ANOMAL,
  '/game/steam': ANOMAL,
  '/game/system-requirements': ANOMAL,
  // Mechanics (economy domain)
  [ecPath]: ANOMAL,
  // Guide (multiplayer domain)
  [mpPath]: ANOMAL,
  // Clues hub (equipment domain)
  [eqPath]: ANOMAL,
  // Eras region comparison
  '/eras/region-comparison': ANOMAL,
}

/** 页头日期行(与 guides 页 Guides.detail.publishedRow 同款式,单语 en 直出) */
export function topicDateRow({ published, modified }: { published: string; modified: string }): string {
  return `Published ${formatHumanDate(published)} · Last updated ${formatHumanDate(modified)}`
}
