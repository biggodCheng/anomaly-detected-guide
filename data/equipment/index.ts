// clues (equipment 域) + mechanics topic re-export。
import { cluesHub, allClues, cluesByType } from './en'
import { mechanicsHub, mechanicsObservation, mechanicsReconstruction } from './mechanics'
import type { CaseSlug } from '../regions/types'

export type { Clue, ClueType } from './en'

export const getAllClues = () => allClues
export const getClue = (slug: string) => allClues.find((c) => c.slug === slug)
export const getCluesByEra = (era: string) => allClues.filter((c) => c.foundIn === era)
export const getCluesByCase = (caseSlug: CaseSlug) =>
  allClues.filter((c) => c.relatedCases.includes(caseSlug))

export { cluesHub, cluesByType }
export { mechanicsHub, mechanicsObservation, mechanicsReconstruction }


