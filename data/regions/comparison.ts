// Era comparison data — for /eras/era-comparison page
import type { TopicData } from '../types'

/** /eras/era-comparison — Era Comparison Guide */
export const eraComparison: TopicData = {
  sections: [
    {
      heading: 'Quick Answer: How Do the Four Eras Compare?',
      body: 'ANOMAL\'s four eras form a progressive puzzle arc. The Frozen Heights (1980s) teaches observation with a grounded, realistic case. The Emerald Canopy (Conquistador era) introduces cross-referencing across timelines. The Orbital Station (future) demands full timeline reconstruction. The Buried Temple (ancient) ties all three mechanics together in a meta-puzzle that recontextualizes everything.',
      table: {
        headers: ['Era', 'Time Period', 'Case', 'Core Mechanic', 'Difficulty'],
        rows: [
          ['Frozen Heights', '1980s Snowy Mountains', 'The Frozen Flame', 'Observation', 'Introductory'],
          ['Emerald Canopy', '16th Century Conquistador', 'The Conquistador\'s Grave', 'Cross-referencing', 'Intermediate'],
          ['Orbital Station', 'Future Post-Human', 'The Void Drifter', 'Timeline reconstruction', 'Advanced'],
          ['Buried Temple', 'Ancient Pre-History', 'The Stone Oracle', 'Synthesis', 'Final'],
        ],
      },
      tip: 'Each era builds on the previous one. The Frozen Heights can be solved with observation alone, but later eras require you to carry clues forward and reference them against other time periods.',
    },
    {
      heading: 'Frozen Heights: The Classroom',
      body: 'The 1980s Soviet station is the most familiar setting in ANOMAL — cold, industrial, readable. The CRT terminal aesthetic is at its strongest here: phosphor-green monitors, scan lines, frost on the screens. The case (a mountaineer burnt in undisturbed snow) is solvable through careful observation of the diorama and the station logbook. No cross-era references are required, though they add depth.',
    },
    {
      heading: 'Emerald Canopy: The Cross-Reference',
      body: 'The Conquistador-era jungle introduces the silence pockets — zones where time bleeds between eras. The case (a conquistador dead in intact armor with phantom water in his helmet) cannot be solved by observation alone; you must cross-reference the tree carvings with symbols from the Frozen Heights station. This is where ANOMAL stops being a series of isolated puzzles and becomes a single interconnected mystery.',
    },
    {
      heading: 'Orbital Station: The Reconstruction',
      body: 'The future era is the most alien — a derelict space station where the stars outside the viewports show a sky from the end of the universe. The case (an astronaut erased from a sealed station) demands full timeline reconstruction: you must order events from the station logs, the chronometer, and the viewport residue, then determine which sequence makes the impossible death not just possible but inevitable.',
    },
    {
      heading: 'Buried Temple: The Synthesis',
      body: 'The ancient temple is where all four eras converge. The case (a petrified figure on a throne, surrounded by impossibly fresh offerings) requires understanding everything you have learned in the previous three puzzles. The murals depict all four cases, and their sequence only makes sense once you have solved each one individually. The temple asks a final question: now that you understand the anomaly, what will you do with that understanding?',
    },
  ],
}
