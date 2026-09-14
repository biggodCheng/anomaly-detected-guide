// Codex data — ANOMAL cases (cases 域)。
// 4 cases, one per era. Each case is an impossible death puzzle.
// clues[] references clue slugs owned by Agent B (data/equipment).
import type { ContentSection, TopicData } from '../types'
import type { EraSlug, CaseSlug } from '../regions/types'

export type CaseEntry = {
  slug: CaseSlug
  name: string
  era: EraSlug
  description: string
  objectives: string[]
  clues: string[] // clue slugs — Agent B owns the canonical clue data
  solution: string // ⚠️ spoiler — how the impossible death occurred
}

/** TopicData 交叉: hub 正文由 casesGuide / casesNotes 承载 */
export type CasesData = TopicData & { entries: CaseEntry[] }

export const enCasesData: CasesData = {
  entries: [
    {
      slug: 'frozen-flame',
      name: 'The Frozen Flame',
      era: 'frozen-heights',
      description:
        'A mountaineer is found burnt to cinder in the middle of a pristine snowfield. No fire source, no accelerant, no footprints leading away. The snow around the body is undisturbed — yet the victim is charred black. A 1980s Soviet research station sits empty on the ridge above.',
      objectives: [
        'Examine the body and the surrounding snow for burn patterns',
        'Search the abandoned Soviet research station on the ridge',
        'Cross-reference the station logbook with the victim\'s expedition notes',
        'Identify the temporal anomaly that caused the impossible combustion',
      ],
      clues: [
        'frozen-heights-1', // charred compass with stopped hands
        'frozen-heights-2', // station logbook — last entry dated 3 days after discovery
        'frozen-heights-3', // undisturbed snow with scorch marks radiating outward
      ],
      solution:
        'The mountaineer was caught in a temporal fold — a future version of himself from a timeline where the Soviet station\'s experiment succeeded. The combustion was not fire but rapid forward time-displacement: his body aged decades in seconds while the snow beneath him stayed frozen. The undisturbed snow proves no one approached; the fire came from inside the timeline.',
    },
    {
      slug: 'jungle-conquistador',
      name: 'The Conquistador\'s Grave',
      era: 'emerald-canopy',
      description:
        'A 16th-century conquistador lies dead beneath the jungle canopy, armor intact, no visible wound. His helmet is filled with fresh water from a stream that does not exist within fifty kilometers. The jungle around him shows no sign of struggle — only an impossible stillness, as if the animals themselves are holding their breath.',
      objectives: [
        'Examine the conquistador\'s armor and the freshwater in his helmet',
        'Trace the origin of the water — find the phantom stream',
        'Decode the symbols carved into nearby ancient trees',
        'Reconstruct the sequence of events that brought a conquistador to this era',
      ],
      clues: [
        'emerald-canopy-1', // armor with no breach — death came from within
        'emerald-canopy-2', // helmet water matches no known watershed
        'emerald-canopy-3', // tree carvings predating the conquistador era by centuries
      ],
      solution:
        'The conquistador stepped through a time-rift during an expedition and arrived in the jungle centuries before his own birth. He died of dehydration — the freshwater in his helmet was a temporal echo, residue from the rift closing. The armor has no breach because nothing physical killed him; he simply arrived in a period where he could not survive, and the jungle claimed him.',
    },
    {
      slug: 'void-drifter',
      name: 'The Void Drifter',
      era: 'orbital-station',
      description:
        'An astronaut floats in the observation deck of a derelict space station, suit pressurized, oxygen tanks full, helmet visor intact. By every instrument, life support was perfect. Yet the astronaut drifted into the void — not through a hull breach, but through something that left no physical trace. The station\'s chronometer is frozen at a time that has not happened yet.',
      objectives: [
        'Inspect the astronaut\'s suit and life-support telemetry',
        'Access the station\'s corrupted flight logs',
        'Examine the observation deck viewport for anomalous residue',
        'Determine what "the void" is and how it reached inside a sealed station',
      ],
      clues: [
        'orbital-station-1', // suit integrity 100% — no breach, no puncture
        'orbital-station-2', // chronometer frozen at a future timestamp
        'orbital-station-3', // viewport residue — not frost, not condensation, something else
      ],
      solution:
        'The station passed through a temporal membrane — a boundary between the present and a future where the sun has died. The "void" is not empty space but the heat-death of the universe, and it reached through the membrane for a fraction of a second. The astronaut did not suffocate or decompress; they were erased by contact with an endpoint that does not yet exist. The chronometer froze because it tried to record a time that has not been written.',
    },
    {
      slug: 'stone-oracle',
      name: 'The Stone Oracle',
      era: 'buried-temple',
      description:
        'Deep inside a buried temple, a figure sits motionless on a stone throne — turned to solid rock from the inside out. The expression on their face is one of perfect calm. Offerings of fruit and flowers surround the throne, all fresh, all untouched. The temple walls bear murals that depict events from the visitor\'s own lifetime.',
      objectives: [
        'Examine the petrified figure and the offerings on the throne',
        'Study the temple murals — they seem to show modern events',
        'Determine whether the figure was petrified or was always stone',
        'Decipher what the temple demands as a final offering',
      ],
      clues: [
        'buried-temple-1', // petrified figure — stone grain matches no known geology
        'buried-temple-2', // fresh offerings in a temple sealed for millennia
        'buried-temple-3', // murals depicting events from the player\'s own timeline
      ],
      solution:
        'The figure is not a victim — they are the temple\'s previous visitor, the one who solved the puzzle before you. The throne petrifies whoever sits upon it, transforming them into the next Oracle. The murals are not prophecy but record: each Oracle\'s lifetime is inscribed the moment they sit. The fresh offerings are left by the temple itself, which exists outside normal time. To solve the case, you must understand that the Oracle was once a detective — just like you.',
    },
  ],
  sections: [],
}

/** Cases hub 正文第一部分 — 案件概览 */
export const casesGuide: ContentSection[] = [
  {
    heading: 'The Four Impossible Deaths',
    body: 'ANOMAL presents four self-contained death puzzles, one per era. Each case begins with a body in a situation where death should be impossible — burnt in untouched snow, drowned in a desert era, erased in a sealed space station, petrified in a calm pose. Your job is to cross-reference clues across time and reconstruct what the timeline itself is hiding.',
    table: {
      headers: ['Case', 'Era', 'Victim', 'Impossible Detail'],
      rows: [
        ['The Frozen Flame', 'Frozen Heights (1980s)', 'Mountaineer', 'Burnt to cinder in undisturbed snow'],
        ['The Conquistador\'s Grave', 'Emerald Canopy (Conquistador)', 'Conquistador', 'Dead in armor with no wound, helmet full of phantom water'],
        ['The Void Drifter', 'Orbital Station (Future)', 'Astronaut', 'Drifted into void from a sealed station with full life support'],
        ['The Stone Oracle', 'Buried Temple (Ancient)', 'Unknown figure', 'Petrified on a throne with a calm expression'],
      ],
    },
  },
]

/** Cases hub 正文第二部分 — 解谜方法论 */
export const casesNotes: ContentSection[] = [
  {
    heading: 'How to Approach Each Case',
    body: 'Every case in ANOMAL follows the same loop: observe the frozen 3D diorama, collect physical and temporal clues, cross-reference them against other eras, and reconstruct the timeline. There is no combat, no timer, no fail state — the puzzle is purely analytical. Read every clue description carefully; the solution always emerges from contradictions between what you see and what should be possible.',
    tip: 'The anomaly ties all four cases together. Solve each case individually first, then look for the thread that connects them across time.',
  },
]
