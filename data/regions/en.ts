// Regions data — ANOMAL eras (eras 域)。
// 4 eras, each containing one case. cases[] references CaseSlug from types.ts.
import type { ContentSection, TopicData } from '../types'
import type { EraSlug, CaseSlug } from './types'

export type Era = {
  slug: EraSlug
  order: number
  name: string
  timePeriod: string
  description: string
  environment: string
  cases: CaseSlug[]
  overview: ContentSection[]
}

export type ErasData = TopicData & {
  eras: Era[]
}

export const enErasData: ErasData = {
  eras: [
    {
      slug: 'frozen-heights',
      order: 1,
      name: 'Frozen Heights',
      timePeriod: '1980s — Snowy Mountains',
      description:
        'A desolate mountain range blanketed in eternal snow, where a Soviet research station conducted experiments it should not have. The air is thin, the wind never stops, and the snow holds secrets that predate the station by millennia. Somewhere beneath the ice, a temporal wound is still bleeding.',
      environment:
        'Perpetual snowstorm, visibility under 50 meters. Abandoned Soviet buildings half-buried in drifts. The CRT terminal aesthetic is strongest here — phosphor-green instrument panels glow through frosted windows, and scan lines flicker across frozen monitors. The diorama rotates slowly, revealing footprints that appear and vanish.',
      cases: ['frozen-flame'],
      overview: [
        {
          heading: 'The First Anomaly',
          body: 'The Frozen Heights is where ANOMAL begins — the most grounded of the four eras, and the one that teaches the core loop. You arrive at the Soviet station, observe the frozen diorama of the mountaineer\'s death, and collect your first set of clues. The case is solvable with careful observation alone, but cross-referencing with later eras reveals deeper layers.',
        },
        {
          heading: 'What to Look For',
          body: 'Pay attention to the station logbook — the dates do not align with what you would expect. The snow itself is a clue: undisturbed where it should be trampled, scorched where nothing should burn. The CRT monitors throughout the station display data from timelines that have not happened yet.',
        },
      ],
    },
    {
      slug: 'emerald-canopy',
      order: 2,
      name: 'Emerald Canopy',
      timePeriod: '16th — Conquistador',
      description:
        'A suffocatingly dense jungle where time moves differently beneath the canopy. The air is thick with humidity and the sound of insects — except where it isn\'t. Pockets of absolute silence dot the landscape, places where the jungle holds its breath. A conquistador\'s expedition vanished here centuries ago. Their armor is still warm.',
      environment:
        'Dense tropical jungle, oppressive heat, visibility limited by vines and fog. Ancient trees with bark carved with symbols that predate any known civilization. Pockets of temporal distortion manifest as zones of perfect silence — no insects, no wind, no sound at all. Water flows uphill in places. The CRT terminal aesthetic appears as corroded instruments embedded in tree trunks, still displaying readings.',
      cases: ['jungle-conquistador'],
      overview: [
        {
          heading: 'The Silent Zones',
          body: 'The defining feature of the Emerald Canopy is the silence pockets — areas where sound simply does not exist. These are temporal eddies, places where different timelines brush against each other. The conquistador died in one of these zones. His armor is intact because nothing in this era could breach it; what killed him was the era itself.',
        },
        {
          heading: 'What to Look For',
          body: 'The tree carvings are the key — they depict events that should not be visible from this time period. The water in the conquistador\'s helmet is a temporal residue, a ghost of a stream that exists in a different century. Follow the silence; it leads to the rift.',
        },
      ],
    },
    {
      slug: 'orbital-station',
      order: 3,
      name: 'Orbital Station',
      timePeriod: 'Future — Post-Human Era',
      description:
        'A derelict space station in high orbit, abandoned by a civilization that evolved beyond the need for bodies. The corridors are dark except for the glow of CRT monitors displaying data in a language that has not been invented yet. Outside the viewports, the stars are wrong — they show a sky from a time when the universe is much older and much colder.',
      environment:
        'Zero-gravity corridors, emergency lighting in phosphor green, CRT terminals displaying future timestamps. The station rotates slowly, and through the viewports you can see stars that have not yet been born — or have already died. The silence here is different from the jungle\'s: it is the silence of a place that has been empty for longer than humanity has existed. The astronaut\'s diorama floats in the observation deck, suit perfect, visor clear, occupant gone.',
      cases: ['void-drifter'],
      overview: [
        {
          heading: 'The Station That Should Not Exist',
          body: 'The Orbital Station is the most alien of the four eras. It was built by humans — or what humans become — and abandoned for reasons the logs do not explain. The astronaut did not die in the conventional sense; they were removed from the timeline by contact with something that exists at the end of time. The station\'s instruments cannot measure what happened because the event has not occurred yet.',
        },
        {
          heading: 'What to Look For',
          body: 'The viewport residue is not frost or condensation — analyze it carefully. The chronometer is frozen at a timestamp from the future; compare it to the station log entries. The astronaut\'s suit telemetry shows perfect life support until the exact moment of disappearance. Nothing failed; everything was taken.',
        },
      ],
    },
    {
      slug: 'buried-temple',
      order: 4,
      name: 'Buried Temple',
      timePeriod: 'Ancient — Pre-History',
      description:
        'A temple buried beneath millennia of stone, its walls covered in murals that depict events from every era — including yours. At its center sits a figure on a throne, turned to solid rock, wearing an expression of perfect understanding. Offerings of fruit and flowers surround the throne, all impossibly fresh. This is where time begins — and where the anomaly ends.',
      environment:
        'Underground chambers lit by phosphorescent moss and the faint glow of ancient CRT-like instruments embedded in stone. The murals cover every surface, depicting events from all four eras in chronological order — or perhaps not chronological at all. The air is still, warm, and carries the scent of fresh flowers despite being sealed for millennia. The petrified figure sits at the center, calm and waiting. This is the final diorama, and it recontextualizes everything.',
      cases: ['stone-oracle'],
      overview: [
        {
          heading: 'Where Time Converges',
          body: 'The Buried Temple is the oldest and the newest — it exists outside the normal flow of time. The murals on its walls depict all four cases, all four eras, in a sequence that only makes sense once you have solved each individual puzzle. The petrified figure on the throne is not a victim; it is a predecessor. The temple creates Oracles, and the Oracle before you was once a detective — solving the same puzzle you are solving now.',
        },
        {
          heading: 'What to Look For',
          body: 'The offerings are always fresh because the temple exists outside of time. The murals change depending on which cases you have already solved — they are a record, not a prophecy. The petrified figure\'s expression is the key: they understood what was happening, and they chose to sit. The question the temple asks is whether you will do the same.',
        },
      ],
    },
  ],
  sections: [
    {
      heading: 'Four Eras, One Anomaly',
      body: 'ANOMAL spans four distinct time periods — from the ancient Buried Temple to the post-human Orbital Station — but all four cases are connected by a single temporal anomaly. Each era teaches a different aspect of the core mechanic: the Frozen Heights introduces observation, the Emerald Canopy introduces cross-referencing, the Orbital Station introduces timeline reconstruction, and the Buried Temple brings it all together.',
      tip: 'Solve the cases in order. Each era builds on the logic of the previous one, and the final case requires understanding all three preceding puzzles.',
    },
  ],
}
