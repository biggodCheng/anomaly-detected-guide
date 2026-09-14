/** Era 主键 — codex(cases) / regions(eras) / equipment(clues) / milestones(timeline) 四域共用 */
export type EraSlug = 'frozen-heights' | 'emerald-canopy' | 'orbital-station' | 'buried-temple'

/** Case 主键 — regions.eras[].cases 与 codex.cases[].slug 的引用键 */
export type CaseSlug = 'frozen-flame' | 'jungle-conquistador' | 'void-drifter' | 'stone-oracle'
