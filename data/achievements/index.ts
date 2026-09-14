// achievements 域 re-export。
import { enAchievements, achievementsGuide } from './en'

export type { Achievement, AchievementCategory } from './en'
export { ACHIEVEMENT_CATEGORIES } from './en'

export const getAllAchievements = () => enAchievements
export const getAchievement = (id: string) => enAchievements.find((a) => a.id === id)
export const getAchievementsByCategory = (cat: string) =>
  enAchievements.filter((a) => a.category === cat)

export { achievementsGuide }
