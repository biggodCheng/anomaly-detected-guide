// 指南页的分类与入口卡片 —— ANOMAL 内容数据。
// CATEGORY_KEYS:分类名 → Guides.categories.<key> 文案(messages T5 已预植)。
// MORE_GUIDES.path:站点根相对路径(无前导斜杠;hub 渲染为 `/${path}`)。
import type { GuideCategory } from './en'

export const CATEGORY_ORDER: GuideCategory[] = ['gettingStarted', 'walkthroughs', 'investigation', 'mechanics']

export const CATEGORY_KEYS: Record<GuideCategory, string> = {
  gettingStarted: 'gettingStarted',
  walkthroughs: 'walkthroughs',
  investigation: 'investigation',
  mechanics: 'mechanics',
}

// More Guides 入口卡片:key 对应 Guides.moreGuides.cards.{key}
export const MORE_GUIDES = [
  { key: 'beginner', path: 'guides/beginner-guide' },
  { key: 'cases', path: 'guides/cases-walkthrough' },
  { key: 'timeline', path: 'guides/timeline-reconstruction' },
  { key: 'mechanics', path: 'guides/mechanics-explained' },
] as const
