// Game data — ANOMAL (unreleased time-travel puzzle game by Alexis Roumier).
import type { TopicData } from '../types'

/** /game hub — 游戏信息总览 */
export const gameHub: TopicData = {
  sections: [
    {
      heading: 'Quick Answer: What Is ANOMAL?',
      body: 'ANOMAL is a time-travel puzzle and detective game by French indie developer Alexis Roumier. The game is not yet released (TBA). You investigate four impossible deaths across four different eras — a mountaineer burnt in untouched snow, a conquistador dead with no wound, an astronaut erased in a sealed station, and a figure petrified on an ancient throne. There is no combat, no timer, and no fail state. The Steam page was first published on March 15, 2025, and the developer has been sharing progress through Steam updates since then.',
      table: {
        headers: ['Fact', 'Detail'],
        rows: [
          ['Developer', 'Alexis Roumier'],
          ['Platform', 'Windows (Steam)'],
          ['Release', 'TBA (not yet released)'],
          ['Price model', 'Premium single purchase (price TBA)'],
          ['Players', 'Single-player only'],
          ['Content', '4 cases / 4 eras / 12 clues / 10 achievements'],
          ['Languages', 'English, French'],
          ['Style', 'CRT terminal aesthetic (phosphor green)'],
        ],
      },
      tip: 'ANOMAL is a solo indie project by a French developer — wishlist the Steam page to get notified on release.',
    },
    {
      heading: 'The Core Loop in One Paragraph',
      body: 'Observe the frozen 3D diorama from every angle, collect physical, temporal, and supernatural clues, cross-reference evidence across the four different eras, and reconstruct the timeline to solve each impossible death. All four cases connect through a single anomaly — the solution always emerges from contradictions between what you see and what should be possible.',
    },
    {
      heading: 'Release Date Status',
      body: 'ANOMAL has not been released yet. The release date is to be announced. The Steam store page is live, and you can wishlist the game to receive a notification when the release date is confirmed or when the game launches. For the latest updates and a detailed wishlist guide, see our dedicated release tracker.',
      tip: 'Wishlist the Steam page now — you will get an email the moment the release date and pricing are announced.',
    },
  ],
}

/** /game/steam — Steam 页信息 */
export const gameSteam: TopicData = {
  sections: [
    {
      heading: 'Quick Answer: Where Do I Get ANOMAL?',
      body: 'ANOMAL is available on Steam for Windows but has not been released yet — the release date is TBA. You can wishlist the game on its Steam page to be notified when it launches. It is a premium single purchase by French indie developer Alexis Roumier with no microtransactions and no in-game store.',
      items: [
        'Platform: Steam (Windows). No console or mobile versions announced.',
        'Release: TBA — wishlist on Steam for launch notification.',
        'Family sharing: supported per standard Steam rules.',
        'Languages: English and French.',
      ],
      tip: 'Wishlist the Steam page now so you get an email the moment the release date and pricing are announced.',
    },
    {
      heading: 'Anomaly Games on Steam',
      body: 'ANOMAL is part of a growing genre of anomaly detection games on Steam. If you enjoy the core mechanic — spotting the one thing that does not belong in a frozen scene — here are other anomaly games currently available on Steam:',
      items: [
        'The Exit 8 — The game that defined the corridor-loop variant. Walk forward if nothing changed, turn back if you spot an anomaly. $4.99.',
        'I\'m on Observation Duty (1-6) — The original surveillance-camera anomaly series. Watch multiple rooms and report what changes. $2.99-$7.99 each.',
        'Alternate Watch — Single-room anomaly detection with a fixed camera. $3.99.',
        'Para Eyes — Photo-based anomaly spotting. Examine photos and find the wrong detail. $2.99.',
        'Shinkansen 0 — Anomaly detection on a bullet train. Each car is a loop. $3.99.',
      ],
      tip: 'For a full list of anomaly games on Steam with current prices and community ratings, see our recommendations guide.',
    },
  ],
}

/** /game/system-requirements — 配置需求 */
export const gameSystemRequirements: TopicData = {
  sections: [
    {
      heading: 'Quick Answer: Can My PC Run ANOMAL?',
      body: 'Official system requirements have not been published yet since ANOMAL is still unreleased. Based on the game\'s stylized CRT terminal aesthetic (phosphor green, scan lines, glitch effects) rather than photorealistic graphics, the requirements are expected to be modest — most gaming laptops from the last several years should handle it comfortably. This page will be updated once the developer publishes the official specs on Steam.',
      tip: 'Check back here or wishlist the Steam page — system requirements are usually posted alongside the release date announcement.',
    },
  ],
}

/** /game/controls — 键位 */
export const gameControls: TopicData = {
  sections: [
    {
      heading: 'Quick Answer: How Do You Play ANOMAL?',
      body: 'ANOMAL is a point-and-observe puzzle game with no combat and no fail state. You navigate frozen 3D dioramas, rotate the camera to inspect them from every angle, click on clues to collect them, and use a menu interface to cross-reference evidence across the four eras. The controls are simple since there are no reflex-based mechanics — the challenge is purely observational and logical.',
      tip: 'Take your time inspecting each diorama — the clues are often small details that only become visible from specific angles or when cross-referenced against another era.',
    },
  ],
}
