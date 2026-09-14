// Achievements data — ANOMAL。
// 单人有解谜,无 combat / build。成就围绕 observation, cross-reference, timeline reconstruction。
import type { ContentSection } from '../types'

export const ACHIEVEMENT_CATEGORIES = [
  'observation',
  'reconstruction',
  'completion',
] as const

export type AchievementCategory = (typeof ACHIEVEMENT_CATEGORIES)[number]

export type Achievement = {
  id: string
  name: string
  description: string
  guide: string
  category: AchievementCategory
}

export const enAchievements: Achievement[] = [
  // --- observation ---
  {
    id: 'first-observation',
    name: 'First Observation',
    description: 'Complete your first diorama inspection — zoom, rotate, and mark at least one clue.',
    guide: 'Unmissable — the tutorial diorama (Frozen Heights) forces a full inspection before you can proceed.',
    category: 'observation',
  },
  {
    id: 'all-physical',
    name: 'Physical Evidence',
    description: 'Collect every physical clue across all four eras.',
    guide: 'Four physical clues total, one per era. They are the easiest category — always the most visible object in the scene.',
    category: 'observation',
  },
  {
    id: 'all-temporal',
    name: 'Temporal Contradiction',
    description: 'Collect every temporal clue across all four eras.',
    guide: 'Four temporal clues — each is a dated object or a sequence impossibility. Read the descriptions twice; the contradiction is in the adjectives.',
    category: 'observation',
  },
  {
    id: 'all-supernatural',
    name: 'Beyond Explanation',
    description: 'Collect every supernatural clue across all four eras.',
    guide: 'Four supernatural clues — substances or events with no physical cause. These are the hardest to spot; check every surface and every offering.',
    category: 'observation',
  },

  // --- reconstruction ---
  {
    id: 'first-case',
    name: 'First Case Closed',
    description: 'Reconstruct the timeline for any one case.',
    guide: 'Solve any of the four cases — Frozen Flame is the intended first.',
    category: 'reconstruction',
  },
  {
    id: 'perfect-order',
    name: 'Perfect Order',
    description: 'Place all eight timeline events in the correct order on the first attempt, with no corrections.',
    guide: 'The final reconstruction screen accepts drag-and-drop ordering. Anchor the seal (oldest) and the chronometer freeze (youngest) first, then fill the middle six.',
    category: 'reconstruction',
  },
  {
    id: 'cross-era-link',
    name: 'Cross-Era Link',
    description: 'Identify a cross-era clue match — connect a clue from one era to its counterpart in another.',
    guide: 'The compass metallurgy matches the chronometer; the helmet water matches the offering residue. The game flags the link the moment you place both clues in the cross-reference panel.',
    category: 'reconstruction',
  },

  // --- completion ---
  {
    id: 'all-cases',
    name: 'All Cases Closed',
    description: 'Reconstruct the timeline for all four cases.',
    guide: 'Solve Frozen Flame, Jungle Conquistador, Void Drifter, and Stone Oracle — in any order.',
    category: 'completion',
  },
  {
    id: 'anomaly-resolved',
    name: 'The Anomaly Resolved',
    description: 'Recognise the thread that ties all four cases together.',
    guide: 'After all four cases close, the anomaly prompt appears. It is not a puzzle with a solution box — it is the realisation that the four solutions describe one event seen from four eras.',
    category: 'completion',
  },
  {
    id: 'no-hints',
    name: 'No Hints Used',
    description: 'Complete the entire game without opening the hint system once.',
    guide: 'The hint button lives in the cross-reference panel. Do not press it. The game remembers even if you reload.',
    category: 'completion',
  },
]

/** /achievements hub 正文 —— 按类分组的解锁指南 */
export const achievementsGuide: ContentSection[] = [
  {
    heading: 'Observation Achievements',
    body: 'These reward thorough diorama inspection. Every era hides three clues (one physical, one temporal, one supernatural); collecting all twelve unlocks three of the four observation achievements.',
    items: [
      'First Observation — unmissable in the tutorial.',
      'Physical Evidence — four clues, one per era, always the most visible object.',
      'Temporal Contradiction — four clues, each is a date or sequence impossibility.',
      'Beyond Explanation — four clues, each is a substance or event with no physical cause.',
    ],
  },
  {
    heading: 'Reconstruction Achievements',
    body: 'These reward correct timeline work. Two of them are skill checks (perfect order, cross-era link); the third is the basic "solve one case" gate.',
    items: [
      'First Case Closed — solve any case; Frozen Flame is the intended first.',
      'Perfect Order — place all eight events correctly on the first attempt; anchor the oldest and youngest first.',
      'Cross-Era Link — match a clue from one era to its counterpart in another; the game flags it when both land in the cross-reference panel.',
    ],
  },
  {
    heading: 'Completion Achievements',
    body: 'These reward finishing the game in full — and, for the strictest players, finishing it without help.',
    items: [
      'All Cases Closed — solve all four cases in any order.',
      'The Anomaly Resolved — recognise that the four solutions describe one event seen from four eras.',
      'No Hints Used — complete the game without opening the hint system even once.',
    ],
    tip: 'The tracker stores checkmarks in this browser only. No account needed.',
  },
]
