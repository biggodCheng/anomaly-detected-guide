// Guide topic data — ANOMAL (multiplayer 域裁剪为通用攻略指南页)。
// 放在 milestones 目录下(Agent B 所有权),作为 /guide 页的 topic 数据源。
import type { TopicData } from '../types'

/** /guide hub — 通用攻略方法论 */
export const guideHub: TopicData = {
  sections: [
    {
      heading: 'Quick Answer: How to Beat ANOMAL',
      body: 'ANOMAL has no combat, no timer, and no fail state. The entire game is one analytical loop: observe the frozen diorama, collect three clues (physical / temporal / supernatural), cross-reference against other eras, and reconstruct the timeline. Solve each of the four cases individually, then recognise the thread that ties them together — the anomaly itself. A full playthrough takes about two to four hours depending on how thoroughly you cross-reference.',
      table: {
        headers: ['Phase', 'What You Do', 'Typical Time'],
        rows: [
          ['Observation', 'Slow orbit of each diorama, mark every inconsistency', '15–20 min per era'],
          ['Clue Collection', 'Gather 3 clues per case (physical / temporal / supernatural)', '10–15 min per case'],
          ['Cross-Reference', 'Match clues across eras in the cross-reference panel', '20–30 min total'],
          ['Reconstruction', 'Order 8 events per case on the timeline screen', '10–15 min per case'],
          ['Anomaly Recognition', 'Identify the single event behind all four cases', 'Endgame'],
        ],
      },
      tip: 'The hint button exists but the "No Hints Used" achievement tracks whether you press it. If you want the achievement, do not open the cross-reference panel\'s hint system — even once, even on reload.',
    },
    {
      heading: 'Recommended Case Order',
      body: 'The game does not force a case order, but the design intent is clear: Frozen Flame is the tutorial, Emerald Canopy teaches cross-era matching, Orbital Station introduces supernatural-only clues, and Buried Temple is the capstone that reframes everything. Playing in this order gives you the smoothest difficulty ramp.',
      items: [
        'Frozen Flame (Frozen Heights, 1980s) — tutorial case. Physical combustion in undisturbed snow. Teaches you to read temporal contradictions in the logbook.',
        'Emerald Canopy (Conquistador era) — first cross-era match. The helmet water\'s isotope ratio mirrors the Buried Temple\'s offering residue.',
        'Orbital Station (Future) — supernatural-heavy. The viewport residue has no spectroscopic match; you must trust the negative evidence.',
        'Buried Temple (Ancient) — capstone. The murals depict your own timeline, and the throne petrifies whoever sits on it. Solving this case reframes the anomaly.',
      ],
    },
    {
      heading: 'The Anomaly: The Final Puzzle',
      body: 'The anomaly is not a fifth case. It is the recognition that the four solutions describe one event — a single temporal membrane rupture — seen from four points in time. The compass metallurgy matches the chronometer; the helmet water matches the offering residue; the Oracle\'s murals depict the very timeline the other three cases damaged. Once you see the shape, the anomaly is obvious. Until then, it is just four clever puzzles.',
      tip: 'Do not rush the anomaly prompt. It appears after all four cases close, and it is not a puzzle with a solution box. It is the realisation. Let it land.',
    },
  ],
}

/** /guide/beginner — 新手入门 */
export const guideBeginner: TopicData = {
  sections: [
    {
      heading: 'What You Need to Know Before You Start',
      body: 'ANOMAL is a game about reading contradictions. Every scene is a frozen moment, and every clue is a sentence with a mismatch in it — "undisturbed snow" next to "scorch marks", "sealed station" next to "void residue". Your job is to find the mismatches, sort them into physical / temporal / supernatural, and reconstruct the timeline that makes them all make sense. There is no combat, no timer, no fail state. Take your time.',
      items: [
        'Do a full 360° orbit of every diorama before marking any clue.',
        'Read every description panel — the contradictions are in the text as much as the image.',
        'Physical clues are always the most visible object; start there.',
        'Temporal clues are dates or sequences that do not line up; re-read for the mismatch.',
        'Supernatural clues are substances or events that should not exist; check every surface.',
      ],
    },
    {
      heading: 'Controls and UI',
      body: 'ANOMAL uses mouse-and-keyboard only. The core controls are zoom (scroll wheel), rotate (click and drag), pan (right-click and drag), and mark (click on an object to open its clue panel). The cross-reference panel lives on the right side of the screen; the timeline reconstruction screen unlocks once you have collected all three clues for a case.',
      items: [
        'Zoom — scroll wheel',
        'Rotate — click and drag',
        'Pan — right-click and drag',
        'Mark clue — click on an object',
        'Cross-reference panel — right side of screen',
        'Timeline reconstruction — unlocks after three clues per case',
      ],
    },
  ],
}

/** /guide/cross-reference — 跨时代引用指南 */
export const guideCrossReference: TopicData = {
  sections: [
    {
      heading: 'How to Cross-Reference Between Cases',
      body: 'The cross-reference panel is where the anomaly reveals itself. Place a clue from one era in the left slot, a clue from another era in the right slot, and the panel tells you whether they share a physical or chemical signature. The game flags the match the moment both clues land — you do not need to guess. There are four cross-era matches in the game; finding all four unlocks the anomaly prompt.',
      items: [
        'Frozen Flame\'s charred compass ↔ Orbital Station\'s chronometer (metallurgy match)',
        'Emerald Canopy\'s helmet water ↔ Buried Temple\'s offering residue (isotope ratio match)',
        'The Oracle\'s murals depict the timeline the other three cases damaged',
        'The rift that took the conquistador is the same membrane the orbital station crossed',
      ],
      tip: 'Do not try to cross-reference every pair — only clues that share a physical signature will match. The panel tells you immediately; there is no penalty for trying.',
    },
  ],
}
