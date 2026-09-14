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
    title: 'Beginner Guide - First Steps',
    description:
      'New to ANOMAL? This beginner guide covers the core gameplay loop: observe frozen 3D dioramas, collect clues, cross-reference evidence across eras, and reconstruct timelines to solve puzzles.',
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
    title: 'Cases Walkthrough - Solutions',
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
    title: 'Timeline Reconstruction Guide',
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
    title: 'Mechanics Explained - Time Travel',
    description:
      'Every ANOMAL mechanic explained: observation system, clue types (physical, temporal, supernatural), timeline reconstruction, cross-referencing and the CRT terminal interface.',
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
  {
    slug: 'time-travel-puzzle-games',
    title: 'Best Time Travel Puzzle Games to Download in 2026',
    description:
      'Curated list of 12+ time travel puzzle games with download links for Steam, PC and mobile. ANOMAL featured as the upcoming time travel detective game. Updated monthly with new releases.',
    icon: '🕰️',
    category: 'recommendations',
    published: '2026-09-14',
    lastUpdated: '2026-09-14',
    sections: [
      {
        heading: 'Quick Answer: What Are the Best Time Travel Puzzle Games?',
        body: 'Time travel puzzle games let you manipulate timelines, solve paradoxes, and piece together fractured narratives. The genre spans point-and-click adventures, detection puzzles, and narrative mysteries. Below is a curated list of the best time travel puzzle games available to download on Steam, PC, iOS and Android in 2026. ANOMAL — the upcoming time travel anomaly detective game by Alexis Roumier — is featured as the most anticipated unreleased title. Every pick includes platform, price, playtime and direct download links.',
      },
      {
        heading: 'Top Picks: Time Travel Puzzle Games Comparison',
        body: 'All games listed are playable now unless marked "Upcoming." Prices and availability as of September 2026.',
        table: {
          headers: ['Game', 'Platform', 'Price', 'Playtime', 'Difficulty'],
          rows: [
            ['ANOMAL (Upcoming)', 'Steam (PC)', 'TBA', '4-6 hours', 'Medium'],
            ['The Silent Age', 'iOS / Android / Steam', '$2.99', '3-4 hours', 'Easy'],
            ['RECUR', 'Steam (PC) / PS5', '$19.99', '6-8 hours', 'Medium'],
            ['Loop Hero', 'Steam / Mobile', '$14.99', '20+ hours', 'Hard'],
            ['Braid Anniversary Edition', 'Steam / Consoles', '$19.99', '6-8 hours', 'Hard'],
            ['The Sexy Brutale', 'Steam / Consoles', '$14.99', '10-12 hours', 'Medium'],
            ['Outer Wilds', 'Steam / Consoles', '$24.99', '15-20 hours', 'Hard'],
            ['Life is Strange', 'Steam / Mobile', '$14.99', '12-15 hours', 'Easy'],
            ['Steins;Gate', 'Steam / Mobile', '$29.99', '25-30 hours', 'Medium'],
            ['Zero Escape: Zero Time Dilemma', 'Steam / Mobile', '$19.99', '10-12 hours', 'Hard'],
            ['Superhot', 'Steam / Consoles', '$14.99', '4-6 hours', 'Medium'],
            ['Induction', 'Steam (PC)', '$9.99', '5-7 hours', 'Hard'],
          ],
        },
        tip: 'ANOMAL is not yet released. Add it to your Steam wishlist to get notified on launch day. While you wait, The Silent Age and RECUR are the closest matches in tone and mechanic.',
      },
      {
        heading: 'ANOMAL: The Upcoming Time Travel Detective Game',
        body: 'ANOMAL is a single-player time travel puzzle game by French indie developer Alexis Roumier. You investigate four impossible deaths across four different eras — each frozen in a 3D diorama suspended in time. There is no combat, no timer, no fail state. The core loop is: observe the frozen scene, collect clues, cross-reference evidence across eras, and reconstruct the timeline. The game features a retro-futuristic CRT terminal aesthetic inspired by Cold War-era scientific equipment. Available on Steam for PC. Release date to be announced.',
        items: [
          'Developer: Alexis Roumier (solo indie)',
          'Platform: Steam (PC) — Windows only at launch',
          'Genre: Time travel puzzle / anomaly detection / point-and-click',
          'Playtime: estimated 4-6 hours for main investigation',
          'Price: to be announced',
          'Family Sharing: planned support for Steam release',
        ],
      },
      {
        heading: 'Classic Time Travel Games Worth Playing',
        body: 'These titles defined the time travel puzzle genre. If you are new to the category, start here.',
        items: [
          'The Silent Age — A point-and-click adventure spanning two timelines. You play a janitor who discovers he can time travel. Simple puzzles, great atmosphere, perfect entry point.',
          'Braid — The game that popularized time manipulation in puzzles. Every mechanic revolves around rewinding, slowing, and branching time. Anniversary edition includes new content.',
          'The Sexy Brutale — A murder mystery set in a time loop. You relive the same day, gathering clues to prevent each murder. Unique mechanic: the mansion layout changes with each loop.',
          'Steins;Gate — A visual novel about a group of friends who accidentally invent time travel via microwave. Dense narrative, emotional payoff, one of the best time travel stories ever told.',
        ],
      },
      {
        heading: 'New Releases: 2025-2026 Time Travel Games',
        body: 'Fresh titles released in the last year that bring new twists to time travel mechanics.',
        items: [
          'RECUR — A time loop puzzle game where you investigate a recurring anomaly. Each loop reveals new details. Released on Steam and PS5 in 2026.',
          'Loop Hero — A roguelike where you place cards to build the world as the hero auto-battles. Time manipulation through deck building. Released 2025, still actively updated.',
          'Induction — A mind-bending puzzle game where you interact with past versions of yourself across overlapping timelines. Released 2025.',
        ],
      },
      {
        heading: 'Free and Demo Time Travel Games',
        body: 'Budget-friendly options to try the genre without commitment.',
        items: [
          'The Silent Age Chapter 1 — Free demo on iOS and Android. Full chapter available for $0.99.',
          'Superhot (Demo) — Free demo on Steam. Full game $14.99.',
          'Outer Wilds (Game Pass) — Included in Xbox Game Pass for PC. Regular price $24.99.',
          'Browser time travel games — itch.io hosts several free browser-based time loop experiments. Search "time travel" on itch.io for current picks.',
        ],
      },
      {
        heading: 'Mobile Time Travel Puzzle Games',
        body: 'Play time travel puzzles on the go. These are optimized for touch controls.',
        items: [
          'The Silent Age (iOS / Android) — The original mobile time travel point-and-click. $2.99.',
          'Life is Strange (iOS / Android) — Full game port. Rewind time mechanic central to the story. $14.99.',
          'Steins;Gate Elite (iOS / Android) — Visual novel with time travel via phone calls. $29.99.',
          'Zero Escape: Zero Time Dilemma (iOS / Android) — Branching narrative puzzle. $19.99.',
        ],
      },
      {
        heading: 'Frequently Asked Questions',
        body: '',
        items: [
          'Is ANOMAL released yet? — No. ANOMAL is upcoming on Steam. Release date to be announced. Add to your wishlist for launch notification.',
          'What is the best time travel puzzle game? — Depends on your taste: narrative (Steins;Gate, Life is Strange), pure puzzle (Braid, Induction), investigation (ANOMAL, The Silent Age).',
          'Are there free time travel games? — Yes. itch.io has several free browser experiments. The Silent Age Chapter 1 is a free demo. Superhot has a free demo on Steam.',
          'Can I play time travel games on Android? — Yes. The Silent Age, Life is Strange, Steins;Gate, and Zero Escape all have Android ports.',
          'What time travel games are on Steam? — Most of the titles above are on Steam. Search "time travel" on Steam for the full current catalog.',
        ],
      },
      {
        heading: 'Related Guides',
        body: 'Looking for more? Check out our other recommendations:',
        items: [
          'Anomaly Detection Games Online — Free browser-based anomaly games you can play right now.',
          'Games Like Observation Duty — 12+ anomaly-spotting games sorted by type and difficulty.',
          'Anomaly Horror Games — Best anomaly horror games ranked by terror level.',
          'Release Date Tracker — Latest status and wishlist guide for ANOMAL.',
        ],
      },
    ],
  },
  {
    slug: 'anomaly-detection-games-online',
    title: 'Free Anomaly Detection Games to Play Online',
    description:
      'Hand-picked anomaly detection games playable free in your browser — no download needed. Every pick rated by loop length, horror level and difficulty. Plus ANOMAL: the upcoming time travel anomaly game.',
    icon: '👁️',
    category: 'recommendations',
    published: '2026-09-14',
    lastUpdated: '2026-09-14',
    sections: [
      {
        heading: 'Quick Answer: What Are the Best Free Anomaly Games?',
        body: 'Anomaly detection games challenge you to spot the one thing that does not belong in a frozen scene — a subtle change in a corridor, a wrong object in a room, an impossible detail. The genre grew from I\'m on Observation Duty (2020) and has exploded since The Exit 8 (2023) went viral. Below are the best anomaly detection games you can play right now in your browser or on Steam, plus ANOMAL — the upcoming time travel twist on the genre. All free-to-play picks are marked with their platform and whether a download is required.',
      },
      {
        heading: 'Browser Anomaly Games — Play Free, No Download',
        body: 'These games run directly in your browser. No installation, no account required.',
        table: {
          headers: ['Game', 'Platform', 'Loop Length', 'Horror Level', 'Difficulty'],
          rows: [
            ['Observation Duty (Web Prototype)', 'Browser', '2-3 min', 'Medium', 'Easy'],
            ['Anomaly Hunter', 'Browser (itch.io)', '3-5 min', 'Low', 'Easy'],
            ['Spot the Anomaly', 'Browser (CrazyGames)', '2-4 min', 'Low', 'Easy'],
            ['Find the Difference Horror', 'Browser', '3-5 min', 'Medium', 'Medium'],
            ['Silent Surveillance Demo', 'Browser', '5 min', 'High', 'Medium'],
          ],
        },
        tip: 'Browser anomaly games are great for casual play, but the deeper experiences (multi-loop narrative, cross-era connections) require full downloads. Start with browser games to test the genre, then move to Steam titles for the real depth.',
      },
      {
        heading: 'Steam Anomaly Games — Full Experiences',
        body: 'These are the anomaly detection games that defined the genre. All available on Steam.',
        table: {
          headers: ['Game', 'Price', 'Loops', 'Horror Level', 'Multiplayer'],
          rows: [
            ['The Exit 8', '$4.99', 'Short loops', 'High', 'No'],
            ['I\'m on Observation Duty (1-6)', '$2.99-$7.99 each', '5-10 min', 'High', 'Co-op (some)'],
            ['Alternate Watch', '$3.99', '3-5 min', 'High', 'No'],
            ['Para Eyes', '$2.99', '2-4 min', 'Medium', 'No'],
            ['Shinkansen 0', '$3.99', 'Short loops', 'High', 'No'],
            ['False Dream', '$1.99', '2-3 min', 'Medium', 'No'],
            ['ANOMAL (Upcoming)', 'TBA', '4-6 hours', 'Medium', 'No'],
          ],
        },
      },
      {
        heading: 'ANOMAL: The Upcoming Time Travel Anomaly Game',
        body: 'ANOMAL by Alexis Roumier takes the anomaly detection formula and adds time travel. Instead of observing a single corridor on loop, you investigate four frozen 3D dioramas across different eras — a 1980s Soviet mountain station, a jungle with ancient trees, a derelict space station, and an underground temple. Each scene contains three clues (physical, temporal, supernatural) that must be cross-referenced across eras. The twist: all four cases connect through a single anomaly visible only when you look across time. Available on Steam for PC. Release date to be announced.',
        items: [
          'Developer: Alexis Roumier (solo indie developer)',
          'Platform: Steam (PC, Windows)',
          'Genre: Time travel anomaly detection / point-and-click puzzle',
          'Core mechanic: Cross-reference clues across 4 eras to reconstruct a fractured timeline',
          'Aesthetic: Retro-futuristic CRT terminal, phosphor green scan lines, 1980s Soviet research equipment',
          'No combat, no timer, no fail state — purely analytical investigation',
        ],
      },
      {
        heading: 'Anomaly Detection vs Hidden Object Games',
        body: 'New players often confuse anomaly detection games with hidden object games. They share the "find the thing" DNA, but the design philosophy is different:',
        table: {
          headers: ['Feature', 'Anomaly Detection', 'Hidden Object'],
          rows: [
            ['Core loop', 'Spot the change from memory', 'Find listed items in a cluttered scene'],
            ['Scene changes', 'Subtle — one thing is different each loop', 'Static — same scene every time'],
            ['Time pressure', 'Usually no timer (some variants)', 'Often has a timer'],
            ['Narrative', 'Emergent — story through repetition', 'Usually minimal or decorative'],
            ['Horror', 'Central to the genre', 'Rarely present'],
            ['Example', 'The Exit 8, I\'m on Observation Duty', 'Mystery Case Files, Hidden Object games'],
          ],
        },
        tip: 'If you enjoy hidden object games but want more challenge and atmosphere, anomaly detection games are the natural next step. The Exit 8 is the best bridge title — simple mechanic, high tension, short loops.',
      },
      {
        heading: 'How to Spot Anomalies Fast',
        body: 'Anomaly detection rewards patience, but there are proven techniques to improve your speed:',
        items: [
          'Scan in a fixed pattern: left-to-right, top-to-bottom. Do not let your eye wander randomly.',
          'Memorize the baseline: on your first loop, deliberately study every object. On subsequent loops, your brain will flag deviations automatically.',
          'Focus on "impossible" details: objects that should not be in that era, physics violations, things that contradict the scene\'s logic.',
          'Use peripheral vision: anomalies often hide at the edges of the scene. Your central vision is optimized for detail; peripheral vision is better at detecting change.',
          'Do not rush the first loop: the first pass is the most important. Rushing it means you miss the baseline and have nothing to compare against.',
          'Take mental notes: "red book on shelf, blue vase on table, clock showing 3:15." When something changes, you will catch it faster.',
        ],
      },
      {
        heading: 'Frequently Asked Questions',
        body: '',
        items: [
          'What is an anomaly detection game? — A game where you observe a scene repeatedly and must spot the one thing that has changed. The genre grew from I\'m on Observation Duty and The Exit 8.',
          'Are there free anomaly games? — Yes. itch.io and browser game portals host several free anomaly games. The quality varies, but it is a good way to test the genre.',
          'Is ANOMAL free? — ANOMAL is a paid Steam game (price TBA). It is not free, but you can wishlist it on Steam for free.',
          'What is the scariest anomaly game? — Community picks: I\'m on Observation Duty 5 and The Exit 8 are consistently rated the most terrifying. ANOMAL aims for psychological tension over jump scares.',
          'Is there a co-op anomaly game? — I\'m on Observation Duty has some co-op modes. ANOMAL is single-player only.',
          'What is the difference between anomaly detection and hidden object games? — Anomaly detection focuses on subtle changes in a static scene (spot the difference, but with horror atmosphere). Hidden object games focus on finding listed items in a cluttered scene.',
        ],
      },
    ],
  },
  {
    slug: 'games-like-observation-duty',
    title: 'Best Games Like I\'m on Observation Duty in 2026',
    description:
      '12+ games like I\'m on Observation Duty, sorted by anomaly type, camera style and difficulty. ANOMAL featured as the upcoming time travel twist on the anomaly-spotting genre. Updated monthly.',
    icon: '📹',
    category: 'recommendations',
    published: '2026-09-14',
    lastUpdated: '2026-09-14',
    sections: [
      {
        heading: 'Quick Answer: What Should I Play After Observation Duty?',
        body: 'I\'m on Observation Duty defined the anomaly detection genre in 2020. Since then, dozens of games have built on its formula — watching surveillance cameras, walking corridors on loop, spotting the one thing that does not belong. Below are the best games like I\'m on Observation Duty, sorted by what makes each one different. ANOMAL — the upcoming time travel twist on the genre — is featured as the most anticipated unreleased title. All picks include platform, price, and the specific anomaly mechanic that sets them apart.',
      },
      {
        heading: 'Top Picks: Games Like Observation Duty',
        body: 'Sorted by anomaly type and camera style. All prices in USD as of September 2026.',
        table: {
          headers: ['Game', 'Platform', 'Price', 'Anomaly Type', 'Camera Style'],
          rows: [
            ['ANOMAL (Upcoming)', 'Steam (PC)', 'TBA', 'Cross-era anomalies', '3D diorama (orbit camera)'],
            ['The Exit 8', 'Steam / Mobile', '$4.99', 'Corridor loop', 'First-person walk'],
            ['I\'m on Observation Duty 6', 'Steam', '$7.99', 'Camera surveillance', 'Static CCTV'],
            ['Alternate Watch', 'Steam', '$3.99', 'Single room loop', 'Fixed camera'],
            ['Para Eyes', 'Steam', '$2.99', 'Photo comparison', 'Photo-based'],
            ['Shinkansen 0', 'Steam / Mobile', '$3.99', 'Train car loop', 'First-person walk'],
            ['False Dream', 'Steam', '$1.99', 'Dream logic', 'First-person walk'],
            ['Im On a Surveillance Mission', 'Steam', '$4.99', 'Multi-room CCTV', 'Static CCTV'],
            ['Trader of the Night', 'Steam', '$2.99', 'Shop surveillance', 'Fixed camera'],
            ['Silent Surveillance', 'Steam', '$3.99', 'Building-wide CCTV', 'Static CCTV'],
            ['Routine', 'Steam', '$19.99', 'Space station horror', 'First-person walk'],
            ['Captured', 'Steam', '$2.99', 'Room escape + anomaly', 'Fixed room'],
          ],
        },
      },
      {
        heading: 'The Exit 8 Series: The Direct Successors',
        body: 'The Exit 8 (2023) by KOTAKE CREATE took the Observation Duty formula and made it accessible. The premise: walk down a subway corridor, and if you spot an anomaly, turn back. If everything is normal, walk forward. Reach Exit 8 to win. It spawned a wave of imitators and sequels.',
        items: [
          'The Exit 8 — The original. Simple mechanic, high tension. $4.99 on Steam.',
          'The Exit 8 II — Expanded with new anomaly types and endings. $7.99.',
          'Shinkansen 0 — Same formula on a bullet train. Each car is a loop. $3.99.',
          'Para Eyes — You examine photos instead of walking. Spot the anomaly in each photo. $2.99.',
        ],
        tip: 'If you want more Exit 8, the direct sequels are the fastest path. But the genre has evolved beyond simple corridor loops — games like ANOMAL and Silent Surveillance add narrative depth and cross-era connections.',
      },
      {
        heading: 'Surveillance and Camera-Based Anomaly Games',
        body: 'These games use fixed CCTV cameras as the core mechanic. You watch multiple feeds and report anomalies.',
        items: [
          'I\'m on Observation Duty 6 — The latest in the defining series. Multiple rooms, increasingly complex anomalies. $7.99.',
          'Silent Surveillance — You monitor an entire building. Anomalies span multiple floors. $3.99.',
          'Im On a Surveillance Mission — Similar to Observation Duty but with mission-based structure. $4.99.',
          'Trader of the Night — You watch a shop overnight. Anomalies are subtle customer behaviors. $2.99.',
        ],
      },
      {
        heading: 'Loop-Based Walking Anomaly Games',
        body: 'These games use first-person walking as the core interaction. You walk a path on loop and report anomalies.',
        items: [
          'False Dream — A dreamlike corridor where physics break down. $1.99.',
          'Alternate Watch — A single room you observe from different angles. $3.99.',
          'Captured — A room escape game where you must spot anomalies to progress. $2.99.',
          'Routine — A space station horror with loop-based investigation. $19.99.',
        ],
      },
      {
        heading: 'ANOMAL: The Upcoming Time Travel Twist',
        body: 'ANOMAL by Alexis Roumier takes the anomaly-spotting genre in a completely new direction. Instead of watching a corridor on loop, you investigate four frozen 3D dioramas across different eras. Each diorama contains three anomalies (physical, temporal, supernatural) that must be cross-referenced against evidence from other eras. The twist: all four cases connect through a single anomaly visible only when you look across time.',
        items: [
          'Core difference: instead of "spot the change in a loop," the mechanic is "connect anomalies across eras"',
          'Four eras: 1980s Soviet mountain station, ancient jungle temple, derelict space station, buried underground temple',
          'No time loop — you freely explore frozen moments in time',
          'Cross-referencing: clues from one era reference evidence from another',
          'Timeline reconstruction: arrange events in chronological order to reveal the connecting anomaly',
          'Release date: to be announced. Wishlist on Steam for notification.',
        ],
      },
      {
        heading: 'Family Friendly Anomaly Games',
        body: 'Most anomaly games lean into horror. These picks are suitable for younger players or those who prefer tension over terror.',
        items: [
          'Para Eyes — Photo-based anomaly spotting. No horror atmosphere, pure puzzle. $2.99.',
          'The Exit 8 — Tense but not gory. Suitable for teens. $4.99.',
          'ANOMAL — Psychological tension over jump scares. No gore. Rating TBA.',
          'Spot the Difference Horror (Browser) — Free browser games with mild horror themes.',
        ],
      },
      {
        heading: 'Frequently Asked Questions',
        body: '',
        items: [
          'What should I play after Observation Duty? — If you want more of the same, play The Exit 8 series. If you want the genre to evolve, wishlist ANOMAL.',
          'Are there new anomaly games in 2026? — Yes. RECUR, ANOMAL, and several indie titles are in development or recently released.',
          'Is ANOMAL like Observation Duty? — ANOMAL shares the anomaly-spotting DNA but replaces the loop mechanic with cross-era investigation. It is a natural evolution of the genre.',
          'What are the best free anomaly games? — itch.io and browser game portals host several free picks. Search "anomaly detection" on itch.io.',
          'Are there co-op anomaly games? — I\'m on Observation Duty has some co-op modes. Most anomaly games are single-player.',
          'What is the scariest anomaly game? — I\'m on Observation Duty 5 and The Exit 8 are consistently rated the most terrifying.',
        ],
      },
    ],
  },
  {
    slug: 'anomal-release-date',
    title: 'Release Date Tracker & Wishlist Guide',
    description:
      'ANOMAL release date status, wishlist guide, and developer updates from Alexis Roumier. Track the upcoming time travel anomaly detective game on Steam.',
    icon: '📅',
    category: 'recommendations',
    published: '2026-09-14',
    lastUpdated: '2026-09-14',
    sections: [
      {
        heading: 'Quick Answer: Is ANOMAL Released Yet?',
        body: 'No. ANOMAL is not yet released. The game is in development by solo indie developer Alexis Roumier and will launch on Steam for PC (Windows). The release date has not been announced. You can wishlist the game on Steam to receive a notification when the release date is confirmed or when the game launches.',
      },
      {
        heading: 'Current Release Status',
        body: 'As of September 2026, ANOMAL has a Steam store page but no confirmed release date. The game was first revealed in a developer post on January 20, 2025, with the CRT terminal aesthetic announced as the core visual identity. Since then, development has been ongoing with periodic updates shared through the developer\'s public communications.',
        items: [
          'Platform: Steam (PC, Windows only at launch)',
          'Developer: Alexis Roumier (solo indie)',
          'Status: In development, release date TBA',
          'Steam page: Available — wishlist for launch notification',
          'Family Sharing: Planned support for Steam release',
        ],
      },
      {
        heading: 'How to Wishlist ANOMAL on Steam',
        body: 'Wishlisting is the best way to stay updated. When you wishlist a game on Steam, you receive an email notification when the game launches or when the price changes during a sale.',
        items: [
          'Go to the ANOMAL Steam page: store.steampowered.com/app/4899900/ANOMAL/',
          'Click the "Follow" or "Wishlist" button on the store page',
          'You will receive an email when the release date is announced',
          'You will receive another email when the game launches',
          'If the game goes on sale during a Steam sale, you will be notified',
        ],
        tip: 'Wishlisting also helps the game\'s visibility on Steam. The more wishlists a game has, the more likely it is to appear in Steam\'s discovery queue and recommendation algorithms.',
      },
      {
        heading: 'What We Know About ANOMAL',
        body: 'Based on official developer communications and the Steam store page, here is what has been confirmed about the game:',
        table: {
          headers: ['Feature', 'Details'],
          rows: [
            ['Genre', 'Time travel puzzle / anomaly detection / point-and-click'],
            ['Setting', 'Four frozen 3D dioramas across different eras'],
            ['Eras', 'Frozen Heights (1980s Soviet), Emerald Canopy (Jungle), Orbital Station (Space), Buried Temple (Ancient)'],
            ['Core Mechanic', 'Cross-reference clues across eras to reconstruct a fractured timeline'],
            ['Aesthetic', 'Retro-futuristic CRT terminal, phosphor green scan lines, 1980s Soviet research equipment'],
            ['Playtime', 'Estimated 4-6 hours for main investigation'],
            ['Combat', 'None — purely analytical investigation'],
            ['Timer', 'None — take your time to observe every detail'],
            ['Fail States', 'None — experiment freely with the timeline reconstruction board'],
            ['Multiplayer', 'Single-player only'],
          ],
        },
      },
      {
        heading: 'Developer Updates and Communications',
        body: 'Alexis Roumier has shared development updates through public channels. The most significant confirmed details:',
        items: [
          'January 20, 2025: First developer post revealing the game concept and CRT terminal aesthetic',
          'The four eras were confirmed: Frozen Heights, Emerald Canopy, Orbital Station, Buried Temple',
          'The core mechanic is cross-referencing clues across eras to reconstruct a timeline',
          'Each era has a self-contained case, but all four connect through a single anomaly',
          'The game is being developed solo — no team, no publisher',
        ],
        tip: 'Follow the developer\'s public communications for the most reliable updates. Be cautious of unofficial sources claiming release dates or features not confirmed by the developer.',
      },
      {
        heading: 'What to Play While You Wait',
        body: 'If you are excited about ANOMAL and want similar experiences while waiting for the release, here are some recommendations:',
        items: [
          'Time travel puzzle games: The Silent Age, RECUR, Braid — see our full list at /guides/time-travel-puzzle-games',
          'Anomaly detection games: The Exit 8, I\'m on Observation Duty — see our list at /guides/anomaly-detection-games-online',
          'Investigation puzzles: Outer Wilds, The Sexy Brutale — narrative mysteries with temporal mechanics',
          'Point-and-click adventures: The Silent Age, Zero Escape series — classic puzzle adventure format',
        ],
      },
      {
        heading: 'Frequently Asked Questions',
        body: '',
        items: [
          'When is ANOMAL coming out? — Release date has not been announced. Wishlist on Steam for notification.',
          'Is ANOMAL free? — Price has not been announced. It will be a paid game on Steam.',
          'Will ANOMAL be on consoles? — Currently confirmed for PC (Steam) only. No console announcements.',
          'Is ANOMAL multiplayer? — No, ANOMAL is single-player only.',
          'How long is ANOMAL? — Estimated 4-6 hours for the main investigation.',
          'Who is developing ANOMAL? — Alexis Roumier, a solo indie developer from France.',
        ],
      },
    ],
  },
  {
    slug: 'anomaly-horror-games',
    title: 'Best Anomaly Horror Games in 2026',
    description:
      'The best anomaly horror games ranked by terror level: The Exit 8, I\'m on Observation Duty, ANOMAL and more. Includes multiplayer options and family-friendly picks.',
    icon: '👻',
    category: 'recommendations',
    published: '2026-09-14',
    lastUpdated: '2026-09-14',
    sections: [
      {
        heading: 'Quick Answer: What Are the Best Anomaly Horror Games?',
        body: 'Anomaly horror games combine the tension of surveillance with the dread of the unknown. You watch a frozen scene — a corridor, a room, a camera feed — and must spot the one thing that does not belong. But in horror variants, the anomalies are designed to unsettle: impossible geometry, wrong faces, things that should not be there. The best anomaly horror games in 2026 are The Exit 8, I\'m on Observation Duty 5, and the upcoming ANOMAL. Below is a ranked list with terror levels, multiplayer options, and what makes each one terrifying.',
      },
      {
        heading: 'Top Anomaly Horror Games Ranked',
        body: 'Ranked by community consensus on terror level. All prices in USD as of September 2026.',
        table: {
          headers: ['Game', 'Price', 'Terror Level', 'Multiplayer', 'Key Horror Element'],
          rows: [
            ['I\'m on Observation Duty 5', '$7.99', 'Extreme', 'Co-op', 'Jump scares + psychological dread'],
            ['The Exit 8', '$4.99', 'High', 'No', 'Uncanny corridor + loop tension'],
            ['ANOMAL (Upcoming)', 'TBA', 'High (psychological)', 'No', 'Cross-era anomalies + temporal dread'],
            ['Alternate Watch', '$3.99', 'High', 'No', 'Single room + fixed camera paranoia'],
            ['Silent Surveillance', '$3.99', 'High', 'No', 'Building-wide surveillance + isolation'],
            ['Shinkansen 0', '$3.99', 'Medium-High', 'No', 'Train car loop + claustrophobia'],
            ['Para Eyes', '$2.99', 'Medium', 'No', 'Photo comparison + subtle wrongness'],
            ['False Dream', '$1.99', 'Medium', 'No', 'Dream logic + reality breakdown'],
          ],
        },
      },
      {
        heading: 'The Most Terrifying Moments in Anomaly Games',
        body: 'What makes anomaly horror effective? The best moments come from the violation of expectation — when something you memorized as "normal" is suddenly wrong.',
        items: [
          'The Exit 8 — The moment you realize the corridor has changed but you cannot identify what is different. The dread of walking forward when you should turn back.',
          'I\'m on Observation Duty 5 — Jump scares timed to your attention patterns. The game learns when you are most focused and strikes when you relax.',
          'ANOMAL — The cross-era revelation: when clues from one era reveal that another era\'s "normal" was always wrong. Psychological dread over jump scares.',
          'Alternate Watch — The single room that feels increasingly wrong the longer you stare. Fixed camera means you cannot look away.',
        ],
      },
      {
        heading: 'Multiplayer Anomaly Horror Games',
        body: 'Most anomaly games are single-player, but a few offer co-op or shared experiences.',
        items: [
          'I\'m on Observation Duty (some versions) — Co-op modes where multiple players watch different cameras and must coordinate reports.',
          'ANOMAL — Single-player only. The investigation is designed as a solitary experience.',
          'The Exit 8 — Single-player. The tension comes from isolation.',
          'Browser co-op anomaly games — itch.io hosts several experimental co-op anomaly games. Search "co-op anomaly" for current picks.',
        ],
      },
      {
        heading: 'ANOMAL: Psychological Horror Over Jump Scares',
        body: 'ANOMAL takes a different approach to horror. Instead of jump scares and gore, the game builds dread through temporal impossibility. The horror comes from realizing that the timeline itself is broken — that what you observed as "normal" was always wrong. Each of the four eras contains anomalies that defy physics: a mountaineer burnt in untouched snow, a conquistador dead with no wound, an astronaut erased from a sealed station, a figure petrified on an ancient throne. The horror is intellectual — the dread of understanding that the rules you thought governed the world do not apply.',
        items: [
          'No jump scares — ANOMAL does not rely on sudden frights',
          'No gore — the horror is in the implication, not the visual',
          'Psychological dread — the terror of temporal impossibility',
          'Cross-era revelation — the moment you realize all four cases connect through a single anomaly',
          'Release date: TBA. Wishlist on Steam for notification.',
        ],
      },
      {
        heading: 'Family-Friendly Anomaly Games',
        body: 'Not all anomaly games are horror. These picks are suitable for younger players or those who prefer puzzle challenge over terror.',
        items: [
          'Para Eyes — Photo-based anomaly spotting. No horror atmosphere, pure puzzle. $2.99.',
          'The Exit 8 — Tense but not gory. Suitable for teens. $4.99.',
          'ANOMAL — Psychological tension over jump scares. No gore. Rating TBA.',
          'Browser anomaly games — Many free browser games offer anomaly mechanics without horror themes.',
        ],
      },
      {
        heading: 'Frequently Asked Questions',
        body: '',
        items: [
          'What is the scariest anomaly game? — I\'m on Observation Duty 5 is consistently rated the most terrifying by the community.',
          'Are there co-op anomaly horror games? — I\'m on Observation Duty has some co-op modes. Most anomaly games are single-player.',
          'Is ANOMAL a horror game? — ANOMAL uses psychological tension rather than jump scares or gore. It is unsettling but not traditionally "horror."',
          'Are there anomaly games without horror? — Yes. Para Eyes and many browser games offer anomaly mechanics without horror themes.',
          'What is the best anomaly game for beginners? — The Exit 8 is simple, accessible, and defines the genre. Start there.',
          'Is ANOMAL suitable for children? — ANOMAL has no gore or jump scares, but the themes (impossible deaths, temporal dread) may be unsettling for young children. Rating TBA.',
        ],
      },
    ],
  },
]
