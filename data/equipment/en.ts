// Clues data — ANOMAL (clues 域, equipment 目录)。
// 12 clues, 3 per case/era, evenly spread across physical / temporal / supernatural.
// foundIn ∈ EraSlug, relatedCases ⊆ CaseSlug — 与 data/codex、data/regions 的主键闭合。
import type { TopicData } from '../types'
import type { EraSlug, CaseSlug } from '../regions/types'

export type ClueType = 'physical' | 'temporal' | 'supernatural'

export type Clue = {
  slug: string
  name: string
  type: ClueType
  description: string
  foundIn: EraSlug
  relatedCases: CaseSlug[]
}

/** /clues hub —— 线索总览与分类方法 */
export const cluesHub: TopicData = {
  sections: [
    {
      heading: 'Quick Answer: What Each Clue Type Means',
      body: 'ANOMAL sorts every clue into one of three categories. Physical clues are things you can point at in the diorama — a burnt compass, an intact helmet, a stone thumb on a throne. Temporal clues are contradictions in time — a logbook dated after the discovery, a chronometer frozen at a future second, murals showing events from your own lifetime. Supernatural clues are things that should not exist at all — water from a phantom stream, residue that is neither frost nor condensation, offerings that stay fresh in a sealed temple. The solution to every case emerges from the overlap of all three.',
      table: {
        headers: ['Type', 'What It Proves', 'Example'],
        rows: [
          ['Physical', 'The state of the scene — what the body and objects actually are', 'A charred compass with its hands stopped'],
          ['Temporal', 'The timeline is lying — dates, sequences, or cause-and-effect do not line up', 'A logbook entry dated three days after the body was found'],
          ['Supernatural', 'The event broke a rule of reality — no physical cause exists', 'Helmet water that matches no watershed on any map'],
        ],
      },
      tip: 'Read every clue description twice. The contradictions are in the adjectives — "undisturbed snow" next to "scorch marks", "sealed station" next to "void residue". Those are the puzzle.',
    },
    {
      heading: 'How Clues Cross-Reference Between Cases',
      body: 'No case solves itself in isolation. Each case has three clues, and at least one clue points at a different era. The Frozen Flame\'s charred compass matches the metallurgy of the Orbital Station\'s chronometer; the Conquistador\'s helmet water shares its chemical signature with the residue on the Buried Temple\'s offerings. Build a table as you go — the anomaly reveals itself only when all four cases are solved and the cross-era matches line up.',
    },
  ],
}

/** 12 条线索 — 每 era/case 三条(physical / temporal / supernatural 各一) */
export const allClues: Clue[] = [
  // ---- Frozen Heights (case: frozen-flame) ----
  {
    slug: 'frozen-heights-1',
    name: 'Charred Compass',
    type: 'physical',
    description:
      'A brass compass found in the mountaineer\'s pocket. The casing is blackened, the glass melted, but the needle is frozen pointing due north — and the hands of the tiny secondary dial are stopped at a time that does not exist on any 24-hour cycle.',
    foundIn: 'frozen-heights',
    relatedCases: ['frozen-flame'],
  },
  {
    slug: 'frozen-heights-2',
    name: 'Station Logbook — Future Entry',
    type: 'temporal',
    description:
      'The Soviet research station\'s logbook is intact except for the final entry. The handwriting matches the station crew\'s, but the date is written three days after the mountaineer\'s body was discovered. The entry reads: "Subject arrived as predicted. Combustion was the intended outcome."',
    foundIn: 'frozen-heights',
    relatedCases: ['frozen-flame'],
  },
  {
    slug: 'frozen-heights-3',
    name: 'Undisturbed Scorch Marks',
    type: 'supernatural',
    description:
      'The snow around the body is scorched in a perfect radial pattern — yet the snow itself is undisturbed. No footprints, no drag marks, no melted depression under the body. The fire came from inside the victim, or from inside the moment he occupied, not from any source in the scene.',
    foundIn: 'frozen-heights',
    relatedCases: ['frozen-flame'],
  },

  // ---- Emerald Canopy (case: jungle-conquistador) ----
  {
    slug: 'emerald-canopy-1',
    name: 'Intact Armor, No Breach',
    type: 'physical',
    description:
      'The conquistador\'s 16th-century steel armor is sealed and unbreeched. There is no puncture, no crack, no corrosion that could have let water or blade through. The body inside shows no wound — death came from within the sealed suit, not from any external strike.',
    foundIn: 'emerald-canopy',
    relatedCases: ['jungle-conquistador'],
  },
  {
    slug: 'emerald-canopy-2',
    name: 'Helmet Water — Unknown Watershed',
    type: 'temporal',
    description:
      'The conquistador\'s helmet holds fresh water. Chemical analysis matches no known river, lake, or aquifer within five hundred kilometers — and the isotope ratio suggests the water is centuries older than the conquistador era itself. It is residue from a stream that existed before the jungle did.',
    foundIn: 'emerald-canopy',
    relatedCases: ['jungle-conquistador'],
  },
  {
    slug: 'emerald-canopy-3',
    name: 'Tree Carvings — Pre-Conquistador Symbols',
    type: 'supernatural',
    description:
      'The ancient trees surrounding the body bear carved symbols that match the conquistador\'s own heraldry — yet dendrochronology dates the carvings to centuries before the conquistador era. The trees were marked before he was born, with marks only he would recognise.',
    foundIn: 'emerald-canopy',
    relatedCases: ['jungle-conquistador'],
  },

  // ---- Orbital Station (case: void-drifter) ----
  {
    slug: 'orbital-station-1',
    name: 'Suit Integrity — One Hundred Percent',
    type: 'physical',
    description:
      'The astronaut\'s suit passes every pressure test. Seams, visor, O-rings, tank valves — all nominal. There is no breach, no micro-puncture, no failed seal. By every instrument the suit kept the astronaut alive until the moment they drifted. The suit did not fail; something bypassed it entirely.',
    foundIn: 'orbital-station',
    relatedCases: ['void-drifter'],
  },
  {
    slug: 'orbital-station-2',
    name: 'Chronometer — Future Timestamp',
    type: 'temporal',
    description:
      'The station\'s master chronometer is frozen at a timestamp thirty-seven years in the future. It is not a malfunction — the mechanism is internally consistent, the battery is full, and the display is not corrupted. The chronometer stopped because it tried to record a moment that has not yet been written.',
    foundIn: 'orbital-station',
    relatedCases: ['void-drifter'],
  },
  {
    slug: 'orbital-station-3',
    name: 'Viewport Residue — Not Frost, Not Condensation',
    type: 'supernatural',
    description:
      'The observation deck viewport is coated with a thin residue on the interior face. Spectroscopy returns no match: not water, not outgassing, not thermal deposit. It behaves like a substance that has lost the memory of what it was. It is what remains after something from outside the timeline briefly touched the glass.',
    foundIn: 'orbital-station',
    relatedCases: ['void-drifter'],
  },

  // ---- Buried Temple (case: stone-oracle) ----
  {
    slug: 'buried-temple-1',
    name: 'Petrified Figure — Unknown Stone Grain',
    type: 'physical',
    description:
      'The figure on the throne is solid stone from the inside out — yet the grain matches no known limestone, basalt, or marble. Petrologists who have examined samples call it "geologically orphaned": the stone has no provenance on Earth. The figure was not carved; it was transformed.',
    foundIn: 'buried-temple',
    relatedCases: ['stone-oracle'],
  },
  {
    slug: 'buried-temple-2',
    name: 'Fresh Offerings in a Sealed Temple',
    type: 'supernatural',
    description:
      'The throne is ringed with fruit and flowers that are fresh — not dried, not fossilised, not preserved. The temple has been sealed for millennia by a collapsed entrance that was only reopened by your expedition. Nothing living has entered since the seal was set. The offerings are left by the temple itself, which exists outside normal time.',
    foundIn: 'buried-temple',
    relatedCases: ['stone-oracle'],
  },
  {
    slug: 'buried-temple-3',
    name: 'Murals — Depicting Your Timeline',
    type: 'temporal',
    description:
      'The temple walls bear murals that depict events from the player\'s own lifetime — a launch, a collapse, a funeral, a discovery. The pigments are ancient; the style is pre-literate. Yet the scenes are recognisably modern. The murals are not prophecy but record: each Oracle\'s lifetime is inscribed the moment they sit upon the throne.',
    foundIn: 'buried-temple',
    relatedCases: ['stone-oracle'],
  },
]

/** 按 type 分组的速查(hub 页渲染) */
export const cluesByType: TopicData = {
  sections: [
    {
      heading: 'Physical Clues — What the Scene Actually Is',
      body: 'Physical clues are the observable state of the diorama. They never lie, but they rarely tell the whole story. Collect these first — they anchor the other two categories.',
      items: [
        'Charred Compass (Frozen Heights) — stopped at an impossible time',
        'Intact Armor (Emerald Canopy) — no breach, death came from within',
        'Suit Integrity 100% (Orbital Station) — no physical failure, something bypassed the suit',
        'Petrified Figure (Buried Temple) — stone grain matches no known geology',
      ],
    },
    {
      heading: 'Temporal Clues — Where the Timeline Lies',
      body: 'Temporal clues are contradictions in sequence, date, or cause-and-effect. These are the puzzle\'s load-bearing elements — every case turns on at least one.',
      items: [
        'Logbook Future Entry (Frozen Heights) — dated three days after the body was found',
        'Helmet Water / Unknown Watershed (Emerald Canopy) — water older than the era it sits in',
        'Chronometer Future Timestamp (Orbital Station) — frozen at a time that has not happened',
        'Murals of Your Timeline (Buried Temple) — ancient paintings of modern events',
      ],
    },
    {
      heading: 'Supernatural Clues — What Should Not Exist',
      body: 'Supernatural clues are events or substances that break a rule of reality. They point at the anomaly itself — the thing that ties all four cases together across time.',
      items: [
        'Undisturbed Scorch Marks (Frozen Heights) — fire with no source, snow with no imprint',
        'Pre-Conquistador Tree Carvings (Emerald Canopy) — symbols carved before their author was born',
        'Viewport Residue (Orbital Station) — a substance that has lost the memory of what it was',
        'Fresh Offerings (Buried Temple) — fruit and flowers left by a temple that exists outside time',
      ],
      tip: 'The cross-era matches live here: the compass metallurgy matches the chronometer; the helmet water\'s isotope ratio matches the temple offering residue. The anomaly reveals itself in the overlap.',
    },
  ],
}
