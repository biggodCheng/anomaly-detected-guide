// codex 内容:单语直接 re-export。
import { enCasesData, casesGuide, casesNotes } from './en'
import type { CaseEntry } from './en'

export type { CaseEntry, CasesData } from './en'

export const getAllCodex = (): CaseEntry[] => enCasesData.entries
export const getDetailedCodex = (): CaseEntry[] => enCasesData.entries // all cases have full data
export const getCodexEntry = (slug: string): CaseEntry | undefined =>
  enCasesData.entries.find((entry) => entry.slug === slug)
export { casesGuide, casesNotes }
