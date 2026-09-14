// regions 内容:单语直接 re-export。
import { enErasData } from './en'
import type { Era } from './en'
import { eraComparison } from './comparison'

export type { Era, ErasData } from './en'

export const getRegionsData = () => enErasData
export const getAllRegions = (): Era[] => enErasData.eras
export const getRegion = (slug: string): Era | undefined => enErasData.eras.find((r) => r.slug === slug)
export { eraComparison }
