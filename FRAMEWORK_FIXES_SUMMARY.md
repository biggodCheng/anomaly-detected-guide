# Framework Layer Fixes Summary

## Completed Fixes

### 1. Deleted Old Domain Pages
- ✅ Removed armor/page.tsx
- ✅ Removed potions/page.tsx
- ✅ Removed potions-comparison/page.tsx
- ✅ Removed weapons/page.tsx
- ✅ Removed weapons-comparison/page.tsx
- ✅ Removed trading/page.tsx
- ✅ Removed money/page.tsx
- ✅ Removed co-op/page.tsx

### 2. Updated Components to Match New Data Structures

#### codex-detail.tsx
- ✅ Rewrote to use new CaseEntry structure (slug, name, era, description, objectives, clues, solution)
- ✅ Removed references to old fields (zone, effect, stackable, detail, lastUpdated, published)

#### region-detail.tsx
- ✅ Rewrote to use new Era structure (slug, order, name, timePeriod, description, environment, cases, overview)
- ✅ Removed references to old fields (unlockCondition, codexSlugs, milestoneSlugs, preparation, items, quests, lastUpdated)

### 3. Fixed Test File Imports

#### content-dates.test.ts
- ✅ Updated imports to use getAllCodex, getTimelineEvents, getAllRegions
- ✅ Removed date collection for codex/milestones/regions (timeless puzzle content)

#### internal-links.test.ts
- ✅ Updated imports to remove getMilestone
- ✅ Updated closure test to check region.cases instead of region.codexSlugs
- ✅ Updated featuredEntities test to check codex entries exist (no detail field)

#### llms-txt.test.ts
- ✅ Updated imports to use getTimelineEvents and getAllRegions
- ✅ Updated entity count line to use "cases", "timeline events", "eras" instead of "monsters", "bosses", "regions"

### 4. Fixed Page Files

#### [slug]/page.tsx
- ✅ Removed milestone detail route (timeline events don't have individual pages)
- ✅ Updated imports to remove getAllMilestones and milestoneSlug

#### domain/page.tsx
- ✅ Updated imports to use mechanicsHub from equipment and guideHub from milestones
- ✅ Updated domain routing to use correct data sources

#### region-comparison/page.tsx
- ✅ Updated to use eraComparison instead of regionComparison
- ✅ Updated hubKey to "eras"

#### codex-hub.tsx
- ✅ Updated to use new CaseEntry structure
- ✅ Updated to use casesGuide and casesNotes instead of codexGuide and codexNotes
- ✅ Updated table to show era instead of zone/effect/stackable

#### codex-table.tsx
- ✅ Updated CodexRow type to use era/eraName/description instead of zone/zoneName/effect/stackable
- ✅ Simplified filtering to only filter by era
- ✅ Updated table columns to show Name, Era, Description

## Remaining Issues

### Type Errors in Breadcrumb/TopicPage Components
The Breadcrumb component's `parents` prop expects specific hub keys ("cases" | "timeline" | "eras" | "clues" | "achievements" | "mechanics" | "guide") but several components are passing old values like "codex", "regions", "milestones", "game", "guides".

**Files needing fixes:**
- components/codex/codex-detail.tsx: Change parents={['codex']} to parents={['cases']}
- components/regions/region-detail.tsx: Change parents={['regions']} to parents={['eras']}
- components/milestones/milestone-detail.tsx: Change parents={['milestones']} to parents={['timeline']}
- app/[locale]/(main)/game/*/page.tsx: Change hubKey="game" to hubKey="mechanics" or remove
- app/[locale]/(main)/guides/[slug]/page.tsx: Change hubKey="guides" to hubKey="guide"

### Missing Component Updates
- components/home/featured-entities.tsx: Update to use featuredEntities.cases instead of codex/milestones
- components/home/latest-updates.tsx: Remove or rewrite (no date fields in new structure)
- components/milestones/*: All milestone components need rewrite for TimelineEvent structure
- components/regions/region-card.tsx: Update to use Era type instead of Region
- components/regions/regions-hub.tsx: Update to use eras instead of regions
- data/content-registry.ts: Update to remove getAllMilestones reference

### Missing localePath Import
- components/regions/region-detail.tsx: Missing import for localePath

## Data Structure Mapping

### Old → New

**Codex Domain (Monsters → Cases):**
- Old: { slug, name, zone, effect, stackable, detail: { published, lastUpdated, sections } }
- New: { slug, name, era, description, objectives, clues, solution }

**Regions Domain (Regions → Eras):**
- Old: { slug, order, name, unlockCondition, codexSlugs, milestoneSlugs, preparation, items, quests, published, lastUpdated, overview }
- New: { slug, order, name, timePeriod, description, environment, cases, overview }

**Milestones Domain (Bosses → Timeline Events):**
- Old: { slug, name, region, published, lastUpdated, sections }
- New: { order, era, event, description, relatedCase }

**Equipment Domain (Equipment → Clues):**
- Old: Armor/Potions/Weapons items
- New: Clues with { slug, name, type, description, foundIn, relatedCases }

**Economy/Multiplayer Domains:**
- Mapped to mechanics and guide topic pages
- Use mechanicsHub and guideHub data sources
