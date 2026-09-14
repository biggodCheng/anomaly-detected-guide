// Guides data — ANOMAL (unreleased time-travel puzzle game by Alexis Roumier)。
// 每篇首节必须是 Quick Answer(guides.test 守护)。
import type { ContentSection } from '../types'

/** 分类名只是数据;顺序与文案 key 见 data/guides/taxonomy.ts */
export type GuideCategory = string

export type GuideSection = ContentSection

export type Guide = {
  slug: string
  title: string
  description: string
  icon: string
  category: GuideCategory
  published: string
  lastUpdated: string
  sections: GuideSection[]
}

export const enGuides: Guide[] = [
  {
    slug: 'beginner-guide',
    title: 'Beginner Guide - First Steps & Core Mechanics',
    description:
      'New to ANOMAL? This beginner guide explains the core gameplay loop: how to observe frozen 3D dioramas, collect clues, cross-reference evidence across eras, and reconstruct timelines to solve four impossible death puzzles.',
    icon: '🌱',
    category: 'gettingStarted',
    published: '2026-09-01',
    lastUpdated: '2026-09-14',
    sections: [
      {
        heading: 'Quick Answer: What Is ANOMAL and How Does It Play?',
        body: 'ANOMAL is a time-travel puzzle game by French indie developer Alexis Roumier. You investigate four impossible deaths across four different eras — a mountaineer burnt in untouched snow, a conquistador dead with no wound, an astronaut erased in a sealed station, and a figure petrified on an ancient throne. There is no combat, no timer, no fail state. The core loop is: observe the frozen 3D diorama → collect physical and temporal clues → cross-reference evidence across eras → reconstruct the timeline. Each case is self-contained, but all four connect through a single anomaly. The game was first revealed in a developer post on January 20, 2025, with the CRT terminal aesthetic announced as the core visual identity.',
      },
      {
        heading: 'The Four Eras and Their Cases',
        body: 'ANOMAL presents four self-contained eras, each with one impossible death to solve:',
        table: {
          headers: ['Era', 'Case', 'Setting', 'Impossible Detail'],
          rows: [
            ['Frozen Heights', 'The Frozen Flame', '1980s Soviet mountain station', 'Mountaineer burnt to cinder in undisturbed snow'],
            ['Emerald Canopy', "The Conquistador's Grave", 'Jungle with ancient trees', 'Conquistador dead in armor with no wound, helmet full of phantom water'],
            ['Orbital Station', 'The Void Drifter', 'Derelict space station', 'Astronaut erased from a sealed station with perfect life support'],
            ['Buried Temple', 'The Stone Oracle', 'Ancient underground temple', 'Figure petrified on a throne with a calm expression'],
          ],
        },
      },
      {
        heading: 'How Clues Work',
        body: 'Each case has three clues to discover. Clues fall into three types: physical (tangible objects you can examine), temporal (anomalies in the timeline itself), and supernatural (elements that defy known physics). Examine every clue carefully — the solution always emerges from contradictions between what you observe and what should be physically possible. Cross-reference clues from one case against evidence from other eras; the anomaly connecting all four cases becomes visible only when you look across time.',
        tip: 'Read every clue description twice. The key detail is often buried in what seems like flavor text — a date that does not add up, a material that should not exist in that era, or a physical impossibility hidden in plain sight.',
      },
      {
        heading: 'Controls and Interface',
        body: 'ANOMAL uses point-and-click interaction with full mouse control. Click to move, click on objects to examine them, and use the clue panel to organize your findings. The interface is designed around the retro-futuristic CRT terminal aesthetic — phosphor green scan lines, glitch effects, and 1980s terminal UI. The timeline reconstruction board is your main tool: drag events into chronological order to test your theory before presenting your solution.',
        items: [
          'Left-click to interact with objects and examine clues',
          'Use the clue panel (default: Tab) to review collected evidence',
          'The timeline board lets you drag and drop events to reconstruct chronology',
          'Cross-reference mode highlights connections between clues from different eras',
          'No fail states — take your time to observe every detail in the diorama',
        ],
      },
      {
        heading: 'Tips for First-Time Players',
        body: 'Start with any case that interests you — the four cases can be solved in any order, though the anomaly connecting them becomes clearer as you complete more. Examine every object in the 3D diorama before moving on; the frozen scenes contain more detail than a first glance reveals. When stuck, try cross-referencing a clue from one era against the timeline of another. The solution is always logical — if something seems supernatural, look for the temporal explanation.',
        tip: 'The game has no hints system by design. If you are truly stuck, step away from the diorama for a few minutes and come back. The frozen 3D scenes reward patience — details emerge on second and third inspection.',
      },
    ],
  },
  {
    slug: 'cases-walkthrough',
    title: 'Cases Walkthrough - All Four Impossible Deaths',
    description:
      'Complete walkthrough for all four cases in ANOMAL: The Frozen Flame, The Conquistador\'s Grave, The Void Drifter, and The Stone Oracle. Each case solution with step-by-step clue analysis.',
    icon: '🔍',
    category: 'walkthroughs',
    published: '2026-09-01',
    lastUpdated: '2026-09-14',
    sections: [
      {
        heading: 'Quick Answer: How Do I Solve Each Case?',
        body: 'Each case in ANOMAL follows the same loop: examine the frozen 3D diorama, collect all three clues (physical, temporal, supernatural), then cross-reference against other eras. The solution is always a temporal paradox — what seems impossible has a logical explanation rooted in time displacement. Solve each case individually first, then look for the thread connecting all four through the anomaly.',
      },
      {
        heading: 'Case 1: The Frozen Flame (Frozen Heights)',
        body: 'A mountaineer is found burnt to cinder in pristine snow. No fire source, no footprints, undisturbed snow. The three clues are: a charred compass with stopped hands, a station logbook dated three days after the discovery, and scorch marks radiating outward in undisturbed snow.',
        items: [
          'Examine the body: charred but the snow beneath is untouched — the fire came from inside the timeline',
          'Read the station logbook: the last entry is dated three days in the future — temporal fold evidence',
          'Study the scorch marks: they radiate outward, not inward — rapid forward time-displacement, not fire',
          'Solution: the mountaineer was caught in a temporal fold. A future version of himself from a timeline where the Soviet experiment succeeded. His body aged decades in seconds while the snow stayed frozen.',
        ],
      },
      {
        heading: 'Case 2: The Conquistador\'s Grave (Emerald Canopy)',
        body: 'A 16th-century conquistador lies dead beneath the jungle canopy, armor intact, helmet full of water from a stream that does not exist within fifty kilometers.',
        items: [
          'Examine the armor: no breach — death came from within, not from an external force',
          'Test the helmet water: matches no known watershed — it is a temporal echo, residue from a closing rift',
          'Decode the tree carvings: they predate the conquistador era by centuries — the jungle was already ancient when he arrived',
          'Solution: the conquistador stepped through a time-rift and arrived centuries before his own birth. He died of dehydration. The freshwater was residue from the rift closing.',
        ],
      },
      {
        heading: 'Case 3: The Void Drifter (Orbital Station)',
        body: 'An astronaut floats in a derelict station\'s observation deck, suit pressurized, oxygen full, visor intact. Life support was perfect. Yet the astronaut drifted into the void through something that left no physical trace.',
        items: [
          'Check suit integrity: 100% — no breach, no puncture, nothing physical entered or exited',
          'Read the chronometer: frozen at a future timestamp — a time that has not happened yet',
          'Examine viewport residue: not frost, not condensation — residue from contact with the heat-death of the universe',
          'Solution: the station passed through a temporal membrane. The "void" is the heat-death of the universe, reaching through for a fraction of a second. The astronaut was erased by contact with an endpoint that does not yet exist.',
        ],
      },
      {
        heading: 'Case 4: The Stone Oracle (Buried Temple)',
        body: 'Deep inside a buried temple, a figure sits on a stone throne — turned to solid rock from the inside out. The expression is perfectly calm. Offerings of fresh fruit and flowers surround the throne, all untouched.',
        items: [
          'Examine the petrified figure: stone grain matches no known geology — this is not natural petrification',
          'Check the offerings: fresh in a temple sealed for millennia — the temple exists outside normal time',
          'Study the murals: they depict events from the visitor\'s own lifetime — not prophecy but record',
          'Solution: the figure is the temple\'s previous visitor, the one who solved the puzzle before you. The throne petrifies whoever sits upon it, transforming them into the next Oracle. The murals are each Oracle\'s lifetime, inscribed the moment they sit.',
        ],
      },
    ],
  },
  {
    slug: 'timeline-reconstruction',
    title: 'Timeline Reconstruction - Connecting the Four Eras',
    description:
      'How to reconstruct the timeline in ANOMAL: connect events across the Frozen Heights, Emerald Canopy, Orbital Station, and Buried Temple eras to uncover the anomaly that ties all four cases together.',
    icon: '⏳',
    category: 'investigation',
    published: '2026-09-01',
    lastUpdated: '2026-09-14',
    sections: [
      {
        heading: 'Quick Answer: How Does the Timeline Work?',
        body: 'ANOMAL\'s four eras are not independent — they share a single timeline fractured by the anomaly. The timeline reconstruction board lets you drag events from each era into chronological order. The correct order reveals connections between cases that are invisible when you examine each era in isolation. Start by solving each case individually, then use the board to test how the four temporal events relate to each other.',
      },
      {
        heading: 'The Four Eras in Chronological Context',
        body: 'The four eras span vastly different time periods, but the anomaly connects them outside normal chronology:',
        table: {
          headers: ['Era', 'Time Period', 'Key Event', 'Temporal Nature'],
          rows: [
            ['Buried Temple', 'Ancient (pre-history)', 'The Oracle sits on the throne', 'Temple exists outside time; offerings remain fresh across millennia'],
            ['Emerald Canopy', '16th century displaced', 'Conquistador arrives centuries before his birth', 'Time-rift displacement; the rift residue is the phantom water'],
            ['Frozen Heights', '1980s Soviet era', 'Soviet experiment creates a temporal fold', 'Forward time-displacement; the logbook is dated after the discovery'],
            ['Orbital Station', 'Far future', 'Station passes through a temporal membrane', 'Contact with heat-death; chronometer frozen at a time not yet written'],
          ],
        },
      },
      {
        heading: 'Cross-Referencing Clues Across Eras',
        body: 'The key to timeline reconstruction is finding clues that reference other eras. The Soviet station\'s experiment (Frozen Heights) is the same phenomenon that created the time-rift in the jungle (Emerald Canopy). The temple (Buried Temple) records all four events in its murals because it exists outside normal time. The orbital station (Orbital Station) passes through the endpoint that all four eras converge toward.',
        tip: 'When you find a clue that seems to reference a different era, mark it for cross-reference. The timeline board highlights these connections automatically once you place two related events adjacent to each other.',
      },
      {
        heading: 'The Anomaly That Connects All Four',
        body: 'Without spoiling the final revelation: the anomaly is a single temporal event visible from four different perspectives. Each case shows you one facet — combustion, displacement, erasure, petrification — but they are all the same phenomenon observed at different points in the timeline. The reconstruction board is where you prove this by placing all four events in their true order. When the timeline clicks into place, the anomaly reveals itself.',
      },
    ],
  },
  {
    slug: 'mechanics-explained',
    title: 'Mechanics Explained - Time Travel & Observation',
    description:
      'Every game mechanic in ANOMAL explained: the observation system, clue types (physical, temporal, supernatural), timeline reconstruction, cross-referencing, and the CRT terminal interface.',
    icon: '⚙️',
    category: 'mechanics',
    published: '2026-09-01',
    lastUpdated: '2026-09-14',
    sections: [
      {
        heading: 'Quick Answer: What Are the Core Mechanics?',
        body: 'ANOMAL has four core mechanics: observation (examine frozen 3D dioramas from every angle), clue collection (gather physical, temporal, and supernatural evidence), cross-referencing (connect clues across eras to find contradictions), and timeline reconstruction (arrange events in chronological order on the timeline board). There is no combat, no timer, no inventory management, and no fail state. The game is purely analytical — every puzzle has a logical solution rooted in temporal physics.',
      },
      {
        heading: 'Observation: The Frozen 3D Dioramas',
        body: 'Each era presents a frozen 3D diorama — a moment in time captured and suspended. You can orbit the camera freely around the diorama, zoom in on details, and click on objects to examine them. The dioramas contain more detail than a single inspection reveals: a second or third look often surfaces clues you missed initially. The frozen aesthetic is intentional — time itself has stopped in these scenes, and your job is to understand why.',
        items: [
          'Orbit camera: drag to rotate around the diorama freely',
          'Zoom: scroll wheel or pinch to examine fine details',
          'Click objects: examine any visible object for clues',
          'Layer inspection: dioramas reveal new details on repeated inspection',
          'No time limit: observe at your own pace — the scene is frozen',
        ],
      },
      {
        heading: 'Clue Types: Physical, Temporal, Supernatural',
        body: 'Every clue in ANOMAL falls into one of three categories:',
        table: {
          headers: ['Type', 'Description', 'Example'],
          rows: [
            ['Physical', 'Tangible objects that can be examined directly', 'A charred compass with stopped hands'],
            ['Temporal', 'Anomalies in the timeline itself — dates that do not add up, echoes from other eras', 'A logbook entry dated after the discovery'],
            ['Supernatural', 'Elements that defy known physics within the game\'s universe', 'Fresh offerings in a sealed millennia-old temple'],
          ],
        },
      },
      {
        heading: 'Cross-Referencing and Timeline Reconstruction',
        body: 'The cross-reference mode is ANOMAL\'s signature mechanic. When you select two clues from different eras that share a temporal connection, the game highlights the contradiction or link between them. The timeline reconstruction board takes this further: drag events from each era onto a single chronological axis. When the order is correct, connections between cases become visible. When it is wrong, the board shows you which events conflict. There is no penalty for incorrect arrangements — experiment freely until the timeline clicks into place.',
        tip: 'If you are stuck on the timeline board, try placing the Buried Temple events first. The temple exists outside normal time, so its events serve as anchor points for the other three eras.',
      },
      {
        heading: 'The CRT Terminal Interface',
        body: 'ANOMAL\'s UI is designed as a retro-futuristic CRT terminal from the 1980s. Phosphor green text, scan line effects, and subtle glitch animations create the atmosphere of a Soviet-era research terminal. This is not just aesthetic — the interface reinforces the game\'s themes of temporal investigation and Cold War-era scientific experimentation. All menus, the clue panel, and the timeline board use this visual language consistently.',
      },
    ],
  },
]
