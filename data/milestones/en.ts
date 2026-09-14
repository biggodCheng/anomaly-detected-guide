// Timeline data — ANOMAL (milestones 域)。
// Timeline reconstruction is the core mechanic: 4 eras × 2 events = 8 events total.
// order = canonical chronological position across all four eras.
import type { ContentSection } from '../types'
import type { EraSlug, CaseSlug } from '../regions/types'

export type TimelineEvent = {
  order: number
  era: EraSlug
  event: string
  description: string
  relatedCase: CaseSlug
}

export type TimelineData = {
  events: TimelineEvent[]
  reconstructionGuide: ContentSection[]
  crossEraThread: ContentSection[]
}

export const timelineEvents: TimelineEvent[] = [
  {
    order: 1,
    era: 'buried-temple',
    event: 'The Temple Is Sealed',
    description:
      'The buried temple\'s entrance collapses, setting a seal that holds for millennia. Inside, the throne waits empty. Fresh offerings begin to appear — left by the temple itself, which now exists outside normal time.',
    relatedCase: 'stone-oracle',
  },
  {
    order: 2,
    era: 'emerald-canopy',
    event: 'The Time-Rift Opens in the Jungle',
    description:
      'A temporal tear forms beneath the jungle canopy. Ancient trees are marked with symbols that will not belong to any civilisation for centuries. The rift will later pull a conquistador through — he arrives before his own birth and dies of dehydration in an era that cannot sustain him.',
    relatedCase: 'jungle-conquistador',
  },
  {
    order: 3,
    era: 'frozen-heights',
    event: 'The Soviet Station Begins Its Experiment',
    description:
      'A 1980s Soviet research station on the Frozen Heights ridge activates a temporal displacement device. The experiment is intended to observe a future timeline; instead it creates a fold that reaches forward and pulls a future version of a mountaineer into the present. The mountaineer combusts — aged decades in seconds — in an undisturbed snowfield.',
    relatedCase: 'frozen-flame',
  },
  {
    order: 4,
    era: 'emerald-canopy',
    event: 'The Conquistador Steps Through',
    description:
      'The conquistador, on expedition in his own era, walks through the rift and emerges in the jungle centuries before he was born. The freshwater in his helmet is temporal residue from the rift\'s closing. His armor is never breached — nothing physical kills him; the jungle simply claims an out-of-time traveller.',
    relatedCase: 'jungle-conquistador',
  },
  {
    order: 5,
    era: 'buried-temple',
    event: 'The Previous Visitor Sits on the Throne',
    description:
      'A detective — the temple\'s previous visitor — solves the puzzle that you are only now attempting, and sits upon the throne. The throne petrifies them from the inside out, transforming them into the Stone Oracle. The murals on the walls inscribe their lifetime as they sit.',
    relatedCase: 'stone-oracle',
  },
  {
    order: 6,
    era: 'orbital-station',
    event: 'The Station Crosses the Temporal Membrane',
    description:
      'An orbital station passes through a boundary between the present and a future where the sun has died. For a fraction of a second the heat-death of the universe reaches inside the sealed observation deck. An astronaut is erased — not suffocated, not decompressed, but unwritten by contact with an endpoint that does not yet exist.',
    relatedCase: 'void-drifter',
  },
  {
    order: 7,
    era: 'frozen-heights',
    event: 'The Logbook Entry Is Written',
    description:
      'Three days after the mountaineer\'s body is discovered, the Soviet station\'s logbook records its final entry: "Subject arrived as predicted. Combustion was the intended outcome." The date is impossible — written after the event it describes, by hands that should no longer exist.',
    relatedCase: 'frozen-flame',
  },
  {
    order: 8,
    era: 'orbital-station',
    event: 'The Chronometer Freezes',
    description:
      'The station\'s master chronometer locks at a timestamp thirty-seven years in the future. It is not broken — it stopped because it tried to record a moment that has not been written. The station drifts on, carrying with it the residue of a void that briefly touched its glass.',
    relatedCase: 'void-drifter',
  },
]

/** /timeline hub 正文第一部分 —— 时间线重建方法论 */
export const reconstructionGuide: ContentSection[] = [
  {
    heading: 'How Timeline Reconstruction Works',
    body: 'ANOMAL does not tell you the order of events. You observe four frozen 3D dioramas — one per era — collect physical, temporal, and supernatural clues from each, and reconstruct a single chronological sequence that spans all four eras. The correct order is the one where every temporal contradiction resolves: the logbook entry comes after the combustion, the murals come after the Oracle sits, the rift opens before the conquistador steps through.',
    tip: 'Start by placing the events you can anchor absolutely — the temple seal is the oldest event in the game, the chronometer freeze is the youngest. The middle six slots fall into place once the anchors are locked.',
  },
  {
    heading: 'Reading Temporal Contradictions',
    body: 'Every era contains at least one clue that is dated wrong, sequenced wrong, or causally impossible. These are the puzzle\'s load-bearing elements. A logbook entry written after the body is discovered means the station exists outside the timeline you are reconstructing. Murals that depict modern events in an ancient temple mean the temple does not experience time the way the other three eras do.',
    items: [
      'Anchor events that cannot be relative (the seal, the chronometer freeze).',
      'Find the event that another event must precede (the rift before the conquistador).',
      'Treat "impossible dates" as ordering clues, not errors.',
    ],
  },
]

/** /timeline hub 正文第二部分 —— 跨时代线索链 */
export const crossEraThread: ContentSection[] = [
  {
    heading: 'The Thread That Connects All Four Cases',
    body: 'The anomaly is not four separate events. It is one event — a single temporal membrane rupture — that rippled across four eras and left a different scar in each. The Frozen Flame\'s compass metallurgy matches the Orbital Station\'s chronometer; the Conquistador\'s helmet water shares an isotope ratio with the Buried Temple\'s offering residue; the Oracle\'s murals depict the very timeline the other three cases damaged. Solving each case individually is step one. Step two is recognising that the four solutions are the same event, seen from four points in time.',
    tip: 'The anomaly is the game\'s final puzzle. It is not on any page, not in any clue — it is the shape that remains when all four cases are solved and the cross-era matches line up.',
  },
]
