// pillar→spoke：指南（支柱页）到专题深页（spoke）的进阶链接。
// 只放 spoke 专题卡(cases/eras/clues/timeline 等)——指南互链
// 由详情页尾部 "Other Guides" 网格承担,这里不重复。
// keyed by guide slug;新指南不在此登记则不渲染该区块(静默降级,不报错)。
import { codexPath, equipmentPath, milestonePath, regionPath } from '@/lib/domain-slugs'

export type DeepDive = { href: string; icon: string; en: string }

export const DEEP_DIVES: Record<string, DeepDive[]> = {
  'beginner-guide': [
    { href: codexPath(), icon: '🔍', en: 'All Four Cases' },
    { href: regionPath(), icon: '🌍', en: 'All Four Eras' },
    { href: '/mechanics', icon: '⚙️', en: 'Game Mechanics' },
  ],
  'cases-walkthrough': [
    { href: equipmentPath(), icon: '🧩', en: 'All Clues' },
    { href: milestonePath(), icon: '⏳', en: 'Timeline Overview' },
    { href: regionPath(), icon: '🌍', en: 'All Four Eras' },
  ],
  'timeline-reconstruction': [
    { href: regionPath(), icon: '🌍', en: 'All Four Eras' },
    { href: codexPath(), icon: '🔍', en: 'All Four Cases' },
    { href: equipmentPath(), icon: '🧩', en: 'All Clues' },
  ],
  'mechanics-explained': [
    { href: '/guides/beginner-guide', icon: '🌱', en: 'Beginner Guide' },
    { href: codexPath(), icon: '🔍', en: 'All Four Cases' },
    { href: milestonePath(), icon: '⏳', en: 'Timeline Overview' },
  ],
  'time-travel-puzzle-games': [
    { href: '/game/steam', icon: '🎮', en: 'Wishlist on Steam' },
    { href: '/mechanics', icon: '⚙️', en: 'Game Mechanics' },
    { href: '/guides/anomal-release-date', icon: '📅', en: 'Release Tracker' },
  ],
  'anomaly-detection-games-online': [
    { href: '/mechanics', icon: '⚙️', en: 'Anomaly Detection Tips' },
    { href: codexPath(), icon: '🔍', en: 'All Four Cases' },
    { href: '/guides/games-like-observation-duty', icon: '📹', en: 'Similar Games' },
  ],
  'games-like-observation-duty': [
    { href: codexPath(), icon: '🔍', en: 'All Four Cases' },
    { href: '/mechanics', icon: '⚙️', en: 'Game Mechanics' },
    { href: '/guides/anomaly-detection-games-online', icon: '👁️', en: 'Online Games' },
  ],
  'anomal-release-date': [
    { href: '/game/steam', icon: '🎮', en: 'Steam Wishlist' },
    { href: '/game', icon: '🎯', en: 'Game Overview' },
    { href: '/guides/time-travel-puzzle-games', icon: '🕰️', en: 'Time Travel Games' },
  ],
  'anomaly-horror-games': [
    { href: codexPath(), icon: '🔍', en: 'All Four Cases' },
    { href: '/mechanics', icon: '⚙️', en: 'Game Mechanics' },
    { href: '/guides/anomaly-detection-games-online', icon: '👁️', en: 'Online Games' },
  ],
}
