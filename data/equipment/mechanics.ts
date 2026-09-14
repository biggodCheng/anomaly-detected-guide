// Mechanics topic data — ANOMAL (economy 域裁剪为游戏机制说明页)。
// 放在 equipment 目录下(Agent B 所有权),作为 /mechanics 页的 topic 数据源。
import type { TopicData } from '../types'

/** /mechanics hub — 核心玩法循环 */
export const mechanicsHub: TopicData = {
  sections: [
    {
      heading: 'Quick Answer: What Is ANOMAL?',
      body: 'ANOMAL is a single-player time-travel puzzle game. There is no combat, no timer, no fail state. The entire game is one loop repeated across four eras: observe a frozen 3D diorama, collect physical / temporal / supernatural clues, cross-reference those clues against the other eras, and reconstruct the timeline. The anomaly is the single event that ties all four cases together — recognising it is the final puzzle.',
      table: {
        headers: ['Mechanic', 'What It Does', 'Where You Use It'],
        rows: [
          ['Observation', 'Zoom, rotate, pan the frozen diorama', 'Every era — the first step of every case'],
          ['Clue Collection', 'Mark physical / temporal / supernatural objects', 'Every era — three clues per case, twelve total'],
          ['Cross-Reference', 'Match a clue in one era to its counterpart in another', 'Cross-era panel — unlocks the anomaly thread'],
          ['Timeline Reconstruction', 'Order eight events across four eras', 'Per case — the solution screen'],
          ['Anomaly Recognition', 'Identify the single event behind all four cases', 'Endgame — after all four cases close'],
        ],
      },
      tip: 'There is no fail state and no timer. Take your time on every diorama — the puzzle is purely analytical, and the solution always emerges from contradictions between what you see and what should be possible.',
    },
    {
      heading: 'The Three Clue Types',
      body: 'Every clue in ANOMAL is sorted into one of three categories. Learning to read the category is half the puzzle.',
      items: [
        'Physical — what the scene actually is. A burnt compass, an intact helmet, a sealed suit. These never lie, but they rarely tell the whole story.',
        'Temporal — where the timeline lies. A logbook dated after the body was discovered, a chronometer frozen at a future second. These are the puzzle\'s load-bearing elements — every case turns on at least one.',
        'Supernatural — what should not exist. Water from a phantom stream, residue with no spectroscopic match, offerings that stay fresh in a sealed temple. These point at the anomaly itself.',
      ],
    },
    {
    heading: 'Cross-Referencing: The Core Skill',
    body: 'No case solves itself in isolation. Each case has three clues, and at least one clue points at a different era. The Frozen Flame\'s compass metallurgy matches the Orbital Station\'s chronometer; the Conquistador\'s helmet water shares an isotope ratio with the Buried Temple\'s offering residue. Build a table as you go — the anomaly reveals itself only when all four cases are solved and the cross-era matches line up.',
    tip: 'Start with the impossible dates. A logbook entry written after the body is discovered, murals depicting modern events in an ancient temple — these are ordering clues, not errors.',
  },
  ],
}

/** /mechanics/observation — 观察机制 */
export const mechanicsObservation: TopicData = {
  sections: [
    {
      heading: 'How to Read a Frozen Diorama',
      body: 'Each era begins as a frozen 3D diorama — a scene paused mid-moment. You can zoom, rotate, and pan, but nothing moves. Your first pass should be a slow orbit: note every object, every surface, every inconsistency. The puzzle is in the adjectives — "undisturbed snow" next to "scorch marks", "sealed station" next to "void residue". Those contradictions are where the solution lives.',
      items: [
        'Do a full 360° orbit before marking any clue — you will miss things if you zoom in early.',
        'Read every description panel; the contradictions are in the text as much as the image.',
        'Physical clues are always the most visible object in the scene; start there.',
        'Temporal clues are dates, sequences, or causal impossibilities — re-read for the mismatch.',
        'Supernatural clues are substances or events that should not exist — check every surface.',
      ],
    },
  ],
}

/** /mechanics/reconstruction — 时间线重建机制 */
export const mechanicsReconstruction: TopicData = {
  sections: [
    {
      heading: 'Timeline Reconstruction: How It Works',
      body: 'Once you have collected the three clues for a case, the reconstruction screen unlocks. You are shown eight events — two per era — and must drag them into the correct chronological order. The game does not tell you which event belongs to which era; that is part of the puzzle. The correct order is the one where every temporal contradiction resolves.',
      items: [
        'Anchor the events that cannot be relative — the temple seal is the oldest, the chronometer freeze is the youngest.',
        'Find the event that another event must precede — the rift opens before the conquistador steps through.',
        'Treat impossible dates as ordering clues, not errors.',
        'If an event seems to violate cause-and-effect, the timeline is lying — re-order until the contradiction dissolves.',
      ],
      tip: 'The perfect-order achievement (all eight on the first attempt) is a skill check. Anchor oldest and youngest first, then fill the middle six from there.',
    },
  ],
}
