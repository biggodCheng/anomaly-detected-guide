// 单语简化 registry:内容数据当前仅 en,locale 参数保留以兼容后续多语扩展。
import type { Locale } from '@/i18n/routing'
import type { TopicData } from '../types'
import { gameHub, gameSteam, gameSystemRequirements, gameControls } from './en'

export type GamePageKey = 'hub' | 'steam' | 'systemRequirements' | 'controls'

const PAGES: Record<GamePageKey, TopicData> = {
  hub: gameHub,
  steam: gameSteam,
  systemRequirements: gameSystemRequirements,
  controls: gameControls,
}

export { gameHub, gameSteam, gameSystemRequirements, gameControls }

export const getGamePage = (_locale: Locale = 'en', key: GamePageKey): TopicData => PAGES[key]
