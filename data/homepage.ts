// 首页结构数据 — ANOMAL (unreleased puzzle game by Alexis Roumier)。
// 文案见 messages/en.json 的 Home 区块。
import { getCodexEntry } from './codex'
import { codexPath, milestonePath, regionPath, equipmentPath, achievementPath } from '@/lib/domain-slugs'

// Hero 统计 — 4 cases, 4 eras, 12 clues (3 per case), 1 anomaly
export const heroStats = [
  { id: 'cases', emoji: '🔍' },
  { id: 'eras', emoji: '🌍' },
  { id: 'clues', emoji: '🧩' },
  { id: 'anomaly', emoji: '⚡' },
] as const

// Hero 双 CTA(第一个实心 primary,第二个描边);label 走 Home.<labelKey>。
export const heroCtas = [
  { href: '/guides/beginner-guide', labelKey: 'ctaBeginner', variant: 'primary' },
  { href: '/guides', labelKey: 'ctaGuides', variant: 'outline' },
] as const

// 核心主题入口(文案 Home.<titleKey>/<descKey>)。
// ANOMAL 7 域:cases / timeline / eras / clues / achievements / mechanics / guide
export const coreTopics = [
  { href: '/guides/beginner-guide', emoji: '🌱', titleKey: 'coreBeginner', descKey: 'coreBeginnerDesc' },
  { href: codexPath(), emoji: '🔍', titleKey: 'coreCases', descKey: 'coreCasesDesc' },
  { href: regionPath(), emoji: '🌍', titleKey: 'coreEras', descKey: 'coreErasDesc' },
  { href: equipmentPath(), emoji: '🧩', titleKey: 'coreClues', descKey: 'coreCluesDesc' },
  { href: milestonePath(), emoji: '⏳', titleKey: 'coreTimeline', descKey: 'coreTimelineDesc' },
  { href: achievementPath(), emoji: '🏆', titleKey: 'coreAchievements', descKey: 'coreAchievementsDesc' },
] as const

// 玩家高频问题入口(文案 Home.<questionKey>)。
export const popularQuestions = [
  { href: '/guides/beginner-guide', questionKey: 'qStart' },
  { href: codexPath(), questionKey: 'qCases' },
  { href: regionPath(), questionKey: 'qEras' },
  { href: equipmentPath(), questionKey: 'qClues' },
  { href: '/mechanics', questionKey: 'qMechanics' },
] as const

// 首页 Popular Guides 的精选排序(guide slugs,内容层;不存在的 slug 静默跳过)。
export const featuredGuideSlugs = [
  'time-travel-puzzle-games',
  'anomaly-detection-games-online',
  'games-like-observation-duty',
  'anomaly-horror-games',
  'beginner-guide',
] as const

// 首页精选实体卡 — ANOMAL 以 cases 为核心(codex 域 4 个案件)。
// meta 各字段分开存,由组件用 i18n 拼装 —— 避免英文硬编码,扩语言时无法翻译。
// emoji 是首页装饰保留手写。slug 存在性由 internal-links.test 守护。
const casePicks = [
  { slug: 'frozen-flame', emoji: '🔥' },
  { slug: 'jungle-conquistador', emoji: '🌿' },
  { slug: 'void-drifter', emoji: '🚀' },
  { slug: 'stone-oracle', emoji: '🗿' },
] as const

export const featuredEntities = {
  cases: casePicks.map(({ slug, emoji }) => {
    const entry = getCodexEntry(slug)
    if (!entry) throw new Error(`featuredEntities: unknown case slug '${slug}'`)
    return { slug, emoji, era: entry.era }
  }),
}
