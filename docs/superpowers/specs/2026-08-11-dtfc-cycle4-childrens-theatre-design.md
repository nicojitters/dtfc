# DT:FC Website — Cycle 4 Design: Children's Theatre Section

**Date:** 2026-08-11
**Source specs:**
- `/Users/cnote/Downloads/dtfc-website-spec.md` §4.4 (Children's Theatre section brief)
- `docs/superpowers/specs/2026-08-11-dtfc-cycle3-shakespeare-design.md` (predecessor cycle — established `scripts` collection, `LibraryIndex`, `ScriptCard`, `ScriptDetail`, sub-nav pattern)
- `docs/superpowers/specs/2026-08-10-dtfc-cycle2-landing-design.md` (Cycle 2 landing seeded the current `#imagination` + `#every-person` anchors on the Children's Theatre stub)

**Cycle scope:** Deep-build the Children's Theatre section — all 7 sub-features from spec §4.4: landing rebuild, "Why These Plays Work" manifesto, Honoring Our Guides, 4 how-to guides (including the Wayfarer's Journey Wheel SVG), two script libraries (`childrens-plays`, `teaching-modules`), and a Shakespeare-for-Children cross-link wrapper page. Extends the existing `scripts` content collection (from Cycle 3) with new libraries and optional Children's-Theatre-scoped frontmatter fields. Introduces the site's first content imagery (children's drawings) with a captioned figure component. Refactors `ScriptCard` / `ScriptDetail` from `src/components/shakespeare/` to `src/components/scripts/` so they can serve both sections cleanly.

**Branch:** `cycle-4-childrens-theatre`

---

## 1. Position in the Multi-Cycle Plan

Per the re-sequencing recorded in `project_dtfc_cycles.md` memory (updated at Cycle 3 close), Cycle 4 is Children's Theatre. Subsequent cycles unchanged: Cycle 5 Legacy, Cycle 6 Community + forms + ESP wiring, Cycle 7 cross-site search + analytics + launch checklist.

Cycle 4 makes good on the Cycle 3 cross-link `/shakespeare/childrens-shakespeare/ → /childrens-theatre/` (which currently lands on a Cycle 2 stub). It also folds in the deferred `pairChildren` cleanup from the Cycle 3 final review — delete the unused helper + tests rather than propagate the orphan.

---

## 2. Cycle 4 Scope

### 2.1 Ships in Cycle 4

- **Landing rebuild** (`src/pages/childrens-theatre/index.astro`): wraps in `ChildrensLayout` (new — see §5), keeps the ReflectivePrompt, rewrites the two Cycle 2 sections into shorter intros with outbound cross-links, preserves both `<section id="…">` anchors, adds "Plays — Theatre Teaching Units — Storytelling" tagline, adds a directory grid of sub-section cards.
- **9 new routes** (5 top-level + 4 how-to guides):
  - `/childrens-theatre/why-these-plays-work/` — manifesto page
  - `/childrens-theatre/honoring-our-guides/` — CT-scoped acknowledgements
  - `/childrens-theatre/plays/` — library index (`childrens-plays`) with `series` chip filter
  - `/childrens-theatre/teaching-modules/` — library index (`teaching-modules`)
  - `/childrens-theatre/shakespeare-for-children/` — cross-link wrapper filtering `library === 'childrens-shakespeare'`
  - `/childrens-theatre/how-to/create-a-script/` — How to Create a DT:FC Children's Script
  - `/childrens-theatre/how-to/golden-goose/` — Facilitating Children Writing a Play
  - `/childrens-theatre/how-to/key-elements/` — Myth / Archetype / Minimalist Language / Repetition
  - `/childrens-theatre/how-to/archetype-of-one-story/` — with the Wayfarer's Journey Wheel SVG
- **Dynamic route:** `/childrens-theatre/scripts/[slug]/` — individual script detail; filters to entries whose `library ∈ {childrens-plays, teaching-modules}`.
- **`scripts` schema extension** (`src/lib/content-schemas.ts`): add `library` enum values `childrens-plays` and `teaching-modules`; add optional frontmatter fields `sourceMaterials?`, `authorIntentions?`, `whatToWatch?`, `imagery?` (array of `{src, alt, credit?}`), `aiPrompt?` (for The Treasure Inside), `series?` (chip-filter grouping). Every new field optional so Cycle 3 Shakespeare entries continue to parse unchanged.
- **New Astro components** under `src/components/childrens/`:
  - `WayfarersJourneyWheel.astro` — procedural SVG, 8 evenly-spaced labeled stations on a circle with clockwise arrow flow, accessibility markup (SVG `<title>` + `<desc>`, textual `<figcaption>` fallback listing all stations).
  - `HowToGuide.astro` — shared layout wrapper for the 4 how-to pages (breadcrumb, secondary tab-row of the 4 guides, print button, `.prose` container, MDX slot).
  - `PlayImagery.astro` — captioned figure (`<figure>` with `<img alt loading="lazy">` and `<figcaption>` combining credit + optional caption).
  - `ChildrensLayout.astro` (under `src/layouts/`) — analog of Cycle 3's `ShakespeareLayout` wrapping `SectionLayout` with a persistent sub-nav.
- **Component refactor:** move `ScriptCard.astro` and `ScriptDetail.astro` from `src/components/shakespeare/` to `src/components/scripts/`. Update the two Cycle 3 import sites (`/shakespeare/scripts/[slug].astro`, Cycle 3's `LibraryIndex.astro`). Also move `LibraryIndex.astro` to `src/components/scripts/` for the same reason.
- **`ScriptDetail` extension:** conditionally render 5 new optional sections (source materials, author intentions, what to watch, imagery gallery via `PlayImagery`, aiPrompt block). Existing Shakespeare rendering unchanged.
- **`ScriptCard` extension:** shows a `series` chip when `entry.data.series` is set.
- **`scriptHref(entry)` helper** (`src/lib/script-href.ts`): computes the canonical URL for a script entry based on its `library` — Shakespeare libraries → `/shakespeare/scripts/[slug]/`, Children's-Theatre libraries → `/childrens-theatre/scripts/[slug]/`. Unit-tested. `ScriptCard` (and any other consumer) imports it.
- **`CHILDRENS_NAV` data** (`src/lib/childrens-nav.ts`): 6 sub-nav items driving `ChildrensLayout`.
- **Seed content** pulled from client's Drive folder at implementation time via Google Drive MCP (same pattern as Cycles 1 + 3). Fallback: placeholder stubs flagged `sample: true` for libraries not populated by the import.
- **Static imagery**: children's drawings placed under `public/images/childrens-theatre/<slug>/<filename>` as pulled from Drive. Referenced from script entries' `imagery[i].src` as `/images/childrens-theatre/<slug>/<file>`.
- **Cross-link maintenance:** the Cycle 3 `/shakespeare/childrens-shakespeare/` page already links to `/childrens-theatre/`; verify + confirm during Cycle 4 (no code change expected).
- **`pairChildren` cleanup:** delete `src/lib/pair-children.ts` and `tests/unit/pair-children.test.ts`. `SideBySideText` already works via CSS grid auto-flow without the helper. Fold in as a small task in this cycle.
- **Testing:** Vitest suite extended to cover the new libraries + optional fields, `scriptHref` helper (all library-values → correct URL), presence of imagery entries under `public/images/childrens-theatre/` when referenced. Playwright smoke test extended: landing, one how-to guide (Archetype of One Story with wheel), one library index, one script detail.
- **CLAUDE.md + memory** updates at cycle end.

### 2.2 Explicitly deferred

- **On-demand PDF generation** beyond the print stylesheet — Cycle 5+ or later.
- **Cross-site search (Pagefind)** — Cycle 7.
- **Video / narrated pop-ups** — later per source spec §5.
- **Bulk import of remaining plays** beyond the initial Drive pull — subsequent content-import cycle.
- **Ian's dragon and other imagery** — imported if present in Drive; if scans aren't available, the imagery gallery renders 0 entries and is silently skipped per entry (`{imagery.length > 0 && …}`). Follow-up captures the pending scans.
- **Designer-polished Wayfarer's Journey Wheel** — Cycle 4 ships the procedural version. If Desirae later produces a hand-designed SVG, drop-in replacement.

### 2.3 Deployment

Still local-dev only, matching prior cycles.

---

## 3. Landing Page Rewrite

The Cycle 2 landing has ReflectivePrompt + two answer sections (`#imagination`, `#every-person`) with drafted paragraphs flagged CLIENT REVIEW. Cycle 4 preserves the anchors so `IDEA_TWO_ANSWERS` in `src/data/landing.ts` continues to resolve, rewrites the paragraph bodies to be shorter, and adds outbound cross-links to Cycle 4 destinations:

- **Keep** `<ReflectivePrompt sectionKey="childrens-theatre" />`.
- **Rewrite** the two teaser sections:
  - `#imagination` — one shortened paragraph ending with "Read Why These Plays Work →" linking to `/childrens-theatre/why-these-plays-work/`.
  - `#every-person` — one shortened paragraph ending with "Browse the plays →" linking to `/childrens-theatre/plays/`.
- **Preserve** both `<section id="…">` anchors verbatim.
- **Add** "Plays — Theatre Teaching Units — Storytelling" as the eyebrow.
- **Add** a directory grid of 6 sub-section cards (Why These Plays Work, Plays, Teaching Modules, Shakespeare for Children, How-To Guides, Honoring Our Guides). Each card: label + one-line description + link.

Reading order on mobile: eyebrow → h1 → ReflectivePrompt → two teaser sections → directory grid.

---

## 4. Content Model Extension

### 4.1 `scripts` schema — additions only

Modify `src/lib/content-schemas.ts`:

```typescript
export const SCRIPT_LIBRARIES = [
  // Existing Shakespeare libraries (unchanged)
  'soliloquies',
  'scenes',
  'themes',
  'cuttings',
  'childrens-shakespeare',
  // NEW — Children's Theatre libraries
  'childrens-plays',
  'teaching-modules',
] as const;

export const scriptsSchema = z
  .object({
    title: z.string(),
    library: z.enum(SCRIPT_LIBRARIES),
    play: z.string(),
    theme: z.string().optional(),
    authors: z.array(z.string()).default([]),
    copyright: z.string().optional(),
    minutes: z.number().int().positive().optional(),
    characters: z
      .array(
        z.object({
          name: z.string(),
          description: z.string().optional(),
        }),
      )
      .default([]),
    doubling: z.string().optional(),
    stagingNotes: z.string().optional(),
    sourceDoc: z.string().optional(),
    sample: z.boolean().default(false),
    // NEW optional fields (Children's-Theatre-scoped; Shakespeare entries leave undefined)
    sourceMaterials: z.string().optional(),
    authorIntentions: z.string().optional(),
    whatToWatch: z.string().optional(),
    imagery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          credit: z.string().optional(),
        }),
      )
      .default([]),
    aiPrompt: z.string().optional(),
    series: z.string().optional(),
  })
  .refine((s) => s.library !== 'themes' || !!s.theme, {
    message: "scripts entries with library === 'themes' must set a `theme`",
    path: ['theme'],
  });
```

All new fields are optional. All existing Shakespeare entries continue to parse unchanged. Vitest updated:
- New test: parses valid `childrens-plays` entry with all new optional fields set.
- New test: parses valid `teaching-modules` entry.
- New test: `imagery` array items require both `src` and `alt` (accessibility).
- Backward-compat: at least one existing Shakespeare fixture continues to parse without any of the new fields set.

### 4.2 `scriptHref` helper

New file `src/lib/script-href.ts`:

```typescript
import type { CollectionEntry } from 'astro:content';

const CHILDRENS_LIBRARIES = new Set(['childrens-plays', 'teaching-modules']);

/**
 * Canonical URL for a script entry. Detail pages live under the section
 * that owns the library:
 *   Shakespeare libraries → /shakespeare/scripts/<slug>/
 *   Children's Theatre libraries → /childrens-theatre/scripts/<slug>/
 *
 * The 'childrens-shakespeare' library stays under /shakespeare/ because
 * Cycle 3 built its detail pages there; the Children's Theatre section
 * cross-links to those URLs via /childrens-theatre/shakespeare-for-children/.
 */
export function scriptHref(entry: CollectionEntry<'scripts'>): string {
  const slug = entry.id.replace(/\.mdx?$/, '');
  if (CHILDRENS_LIBRARIES.has(entry.data.library)) {
    return `/childrens-theatre/scripts/${slug}/`;
  }
  return `/shakespeare/scripts/${slug}/`;
}
```

Unit tests cover: each Shakespeare library → `/shakespeare/scripts/…`, each Children's Theatre library → `/childrens-theatre/scripts/…`, slug strip handles `.mdx` and `.md`.

### 4.3 Static imagery convention

Children's-drawings and other section imagery live under `public/images/childrens-theatre/<slug>/<filename>`, parallel to Cycle 3's `/public/audio/` convention.

Referenced from a script's frontmatter:

```yaml
imagery:
  - src: /images/childrens-theatre/one-seed-child/ian-dragon.jpg
    alt: A dragon drawn in crayon by 7-year-old Ian, curled around a small pot with a seed inside
    credit: Ian, age 7
```

Filenames are ASCII kebab-case. Same discipline as `/public/audio/`.

Vitest test (new): for every scripts entry with `imagery[i].src` set, `fs.existsSync('public' + src)` is true.

---

## 5. Component Architecture

### 5.1 Refactor — move script components to `src/components/scripts/`

Cycle 3 placed `ScriptCard`, `ScriptDetail`, `LibraryIndex` under `src/components/shakespeare/`. Cycle 4 makes them cross-sectional — move to `src/components/scripts/`:

```
src/components/scripts/
  ScriptCard.astro     # was src/components/shakespeare/ScriptCard.astro
  ScriptDetail.astro   # was src/components/shakespeare/ScriptDetail.astro
  LibraryIndex.astro   # was src/components/shakespeare/LibraryIndex.astro
```

Import sites to update (Cycle 3 files):
- `src/pages/shakespeare/scripts/[slug].astro` — imports `ScriptDetail`
- `src/pages/shakespeare/scenes.astro`, `cuttings.astro`, `soliloquies.astro`, `childrens-shakespeare.astro`, `themes.astro` — all import `LibraryIndex`
- Any file that imported `ScriptCard` directly (LibraryIndex only, via same-dir import — becomes `import ScriptCard from './ScriptCard.astro'` and works after co-relocation)

### 5.2 New components

| Component | Path | Responsibility | Consumes |
|---|---|---|---|
| `WayfarersJourneyWheel.astro` | `src/components/childrens/WayfarersJourneyWheel.astro` | Inline SVG with 8 evenly-spaced labeled stations on a circle (12 o'clock start, 45° intervals, clockwise). Curved arrows between stations. Center label "The Wayfarer's Journey." `<title>` + `<desc>` in SVG; `<figcaption>` beneath lists all stations in order for screen readers + print. ~120 lines hand-authored SVG. Design tokens only (no hex). | none (station data inline) |
| `HowToGuide.astro` | `src/components/childrens/HowToGuide.astro` | Shared layout for the 4 how-to pages: breadcrumb ("Children's Theatre › How-To › <name>"), secondary tab-row of all 4 how-to guides (marks current), print-this-guide button (uses existing `data-print-hide` pattern), `.prose` container, MDX-body slot. | props: `title`, `currentGuide`, slot |
| `PlayImagery.astro` | `src/components/childrens/PlayImagery.astro` | `<figure>` with `<img src alt loading="lazy">` and `<figcaption>` combining credit + optional caption. Consumed by `ScriptDetail` when the entry has an `imagery` array. | props: `src`, `alt`, `credit?` |
| `ChildrensLayout.astro` | `src/layouts/ChildrensLayout.astro` | Wraps `SectionLayout` with the Children's-Theatre sub-nav row (6 items). Same structural pattern as `ShakespeareLayout` from Cycle 3. | props: `title`, `description?`, `eyebrow?`, `subPage?`, slot |

### 5.3 Modified components

**`ScriptCard.astro`** (post-move to `src/components/scripts/`):
- Import `scriptHref` from `@/lib/script-href` and use it instead of the hardcoded `/shakespeare/scripts/` URL.
- Conditionally render a `Chip tone="teal"` for `entry.data.series` when set (grouping badge).

**`ScriptDetail.astro`** (post-move):
- Header section unchanged (title, chips, characters, doubling, staging, print button).
- After MDX body, add conditional sections in this order:
  1. `sourceMaterials` — H2 "Source Materials" + paragraph. Renders only if set.
  2. `authorIntentions` — H2 "Author's Intentions" + paragraph. Renders only if set.
  3. `whatToWatch` — H2 "What to Watch" + paragraph. Renders only if set.
  4. `imagery` gallery — H2 "Imagery" + responsive grid of `<PlayImagery>` figures. Renders only if array has ≥1 entry.
  5. `aiPrompt` — H2 "The Prompt Used" + rendered inside a `<pre class="…">` block for preservation of formatting. Explanatory paragraph above ("This play was co-written with Claude AI. Below is the prompt used, as a model for teachers wanting to try the same approach."). Renders only if set.

### 5.4 Sub-nav data

`src/lib/childrens-nav.ts`:

```typescript
export interface ChildrensNavItem {
  key: string;
  label: string;
  href: string;
}

export const CHILDRENS_NAV: ChildrensNavItem[] = [
  { key: 'why-these-plays-work', label: 'Why These Plays Work', href: '/childrens-theatre/why-these-plays-work/' },
  { key: 'plays', label: 'Plays', href: '/childrens-theatre/plays/' },
  { key: 'teaching-modules', label: 'Teaching Modules', href: '/childrens-theatre/teaching-modules/' },
  { key: 'shakespeare-for-children', label: 'Shakespeare for Children', href: '/childrens-theatre/shakespeare-for-children/' },
  { key: 'how-to', label: 'How-To Guides', href: '/childrens-theatre/how-to/create-a-script/' },
  { key: 'honoring-our-guides', label: 'Honoring Our Guides', href: '/childrens-theatre/honoring-our-guides/' },
];
```

`ChildrensLayout` reads a `subPage?: string` prop and marks the matching item current. The 4 how-to guides all set `subPage="how-to"` — the guide-level secondary tab-row inside `HowToGuide.astro` disambiguates which specific guide.

### 5.5 `pairChildren` cleanup

Fold into Cycle 4 as a small task:
- Delete `src/lib/pair-children.ts`.
- Delete `tests/unit/pair-children.test.ts`.
- Verify `src/components/shakespeare/SideBySideText.astro` doesn't reference it (it doesn't; the helper was written but never imported).
- Run `pnpm test` — expect count drops by 6.
- Commit as its own small commit before the main Cycle 4 work begins, or as part of a housekeeping task.

---

## 6. Route Layout

```
src/pages/childrens-theatre/
├── index.astro                          # landing rebuild
├── why-these-plays-work.astro           # manifesto page
├── honoring-our-guides.astro
├── plays.astro                          # library index (childrens-plays) with series chip filter
├── teaching-modules.astro               # library index (teaching-modules)
├── shakespeare-for-children.astro       # cross-link wrapper filtering library === 'childrens-shakespeare'
├── how-to/
│   ├── create-a-script.astro
│   ├── golden-goose.astro
│   ├── key-elements.astro
│   └── archetype-of-one-story.astro     # embeds <WayfarersJourneyWheel />
└── scripts/
    └── [slug].astro                     # detail dynamic route (childrens-plays + teaching-modules)
```

**Cross-section detail pages:** `childrens-shakespeare` scripts continue to resolve at `/shakespeare/scripts/[slug]/` (unchanged from Cycle 3). The `/childrens-theatre/shakespeare-for-children/` page filters those entries and links out to the Shakespeare-scoped URLs (via `scriptHref`).

---

## 7. File Additions and Modifications

```
docs/superpowers/specs/
  2026-08-11-dtfc-cycle4-childrens-theatre-design.md    # this file

src/lib/
  childrens-nav.ts                                       # new
  script-href.ts                                         # new
  content-schemas.ts                                     # modified (extend library enum + fields)

src/layouts/
  ChildrensLayout.astro                                  # new

src/components/scripts/                                  # new directory (post-refactor)
  ScriptCard.astro                                       # moved from shakespeare/, extended for series + scriptHref
  ScriptDetail.astro                                     # moved from shakespeare/, extended with 5 new sections
  LibraryIndex.astro                                     # moved from shakespeare/

src/components/childrens/                                # new directory
  WayfarersJourneyWheel.astro
  HowToGuide.astro
  PlayImagery.astro

src/pages/childrens-theatre/                             # existing dir; landing rewritten, everything else new
  index.astro                                            # rewritten
  why-these-plays-work.astro                             # new
  honoring-our-guides.astro                              # new
  plays.astro                                            # new
  teaching-modules.astro                                 # new
  shakespeare-for-children.astro                         # new
  how-to/                                                # new directory
    create-a-script.astro
    golden-goose.astro
    key-elements.astro
    archetype-of-one-story.astro
  scripts/                                               # new directory
    [slug].astro

src/pages/shakespeare/                                   # import updates only (post-move)
  scripts/[slug].astro                                   # update import path for ScriptDetail
  scenes.astro                                           # update import path for LibraryIndex
  cuttings.astro                                         # update import path for LibraryIndex
  soliloquies.astro                                      # update import path for LibraryIndex
  childrens-shakespeare.astro                            # update import path for LibraryIndex
  themes.astro                                           # update import path for ScriptCard

src/content/scripts/                                     # augmented by Drive import (Task 2)
public/images/childrens-theatre/                         # new directory (populated by Drive import)

tests/unit/
  shakespeare.test.ts                                    # extended: new libraries, optional-field integrity, imagery-file existence
  script-href.test.ts                                    # new
  pair-children.test.ts                                  # DELETED as part of pairChildren cleanup

src/lib/
  pair-children.ts                                       # DELETED as part of pairChildren cleanup

tests/e2e/
  smoke.spec.ts                                          # extended for Children's Theatre routes

CLAUDE.md                                                # modified
```

---

## 8. Landing-Page Idea Two Answer Consistency

`src/data/landing.ts` currently maps two Children's Theatre Idea Two questions to `/childrens-theatre/#imagination` and `/childrens-theatre/#every-person`. Cycle 4's landing rewrite preserves both anchors. No `landing.ts` changes needed; the anchors continue to resolve.

---

## 9. Wayfarer's Journey Wheel — SVG specification

### Station data

```
Position 1 (12 o'clock): Home
Position 2 (1:30):       Call
Position 3 (3 o'clock):  Gate In
Position 4 (4:30):       Road of Trials
Position 5 (6 o'clock):  Nigredo
Position 6 (7:30):       Road of Trials II
Position 7 (9 o'clock):  Gate Out
Position 8 (10:30):      Return
(→ arrow closes back to Home)
```

### SVG structure

- `<svg viewBox="0 0 400 400" role="img" aria-labelledby="wjw-title wjw-desc">`
- `<title id="wjw-title">The Wayfarer's Journey</title>`
- `<desc id="wjw-desc">Eight stations arranged clockwise on a circle: Home, Call, Gate In, Road of Trials, Nigredo, Road of Trials II, Gate Out, Return — closing back to Home.</desc>`
- Center circle stroke (clay tone, thin)
- 8 station labels (`<text>`), positioned via `cos/sin` at radius 150 from center (200, 200)
- 8 curved arrows (`<path>` with marker-end="url(#arrow)") between successive stations
- Center label "The Wayfarer's Journey" (`<text>` at 200,200) using `font-display` at 14px
- `<defs>` block with an arrow marker

### Accessibility fallback

Beneath the SVG, a `<figcaption>` renders:

> The eight stations of the Wayfarer's Journey, in clockwise order: **Home**, Call, Gate In, Road of Trials, Nigredo, Road of Trials II, Gate Out, Return — returning to Home.

Screen readers announce the SVG via `<title>`/`<desc>`; users who skip the graphic still get the full station sequence in the caption. Print stylesheet renders both.

### Colors and typography

- Circle stroke: `stroke: var(--color-clay-500)` at 1px.
- Station labels: `fill: var(--color-ink-900)`, `font-family: var(--font-body)`, 12px.
- Arrows: `stroke: var(--color-clay-500)`, `fill: none`.
- Center label: `fill: var(--color-ink-900)`, `font-family: var(--font-display)`, 14px italic.

No hex codes in the component — all colors are CSS variables from `src/styles/tokens.css`.

---

## 10. Print Stylesheet

`ScriptDetail`'s existing print button + `data-print-hide` markers from Cycle 3 already handle Children's Theatre scripts. New considerations for Cycle 4:

- **Imagery gallery in print**: default `grid-template-columns` may render 2-3 columns, which prints tight. Add `@media print { .imagery-grid { grid-template-columns: 1fr; } }` to `src/styles/print.css` so imagery prints one-per-page-width for legibility.
- **Wayfarer's Journey Wheel in print**: the SVG scales cleanly; verify the `<figcaption>` prints beneath (already inside the `<figure>`, so it does).
- **How-to guides in print**: `HowToGuide.astro` includes a print button using the same `data-print-hide` pattern. Secondary tab-row also gets `data-print-hide`.

Small `print.css` addition; no larger changes.

---

## 11. Testing

**Vitest — `tests/unit/shakespeare.test.ts` extended** (rename to `scripts.test.ts` at some point — deferred; the file already covers all script libraries):

- New: parses valid `childrens-plays` entry with all new optional fields set.
- New: parses valid `teaching-modules` entry.
- New: `imagery` array requires `src` and `alt`; `credit` optional.
- New: at least one entry per new library (`childrens-plays`, `teaching-modules`) — placeholder or real from T2.
- Backward-compat: existing Shakespeare fixture entries still parse (spot check).
- Extended `IDEA_TWO_ANSWERS` cross-references still hold (Cycle 2/3 invariants).

**Vitest — new `tests/unit/script-href.test.ts`:**

- Every Shakespeare library returns `/shakespeare/scripts/<slug>/`.
- Every Children's Theatre library returns `/childrens-theatre/scripts/<slug>/`.
- `.mdx` and `.md` filename extensions both stripped correctly.
- (Runtime-only; helper is pure and doesn't touch `getCollection`.)

**Vitest — imagery-file existence check** (added to `tests/unit/shakespeare.test.ts`):
- For every real script entry with `imagery[i].src` set, `fs.existsSync('public' + src)` is true.
- Same discipline as the Cycle 3 `colloquial.audio` file-existence test.

**Vitest — deletion:** remove `tests/unit/pair-children.test.ts` as part of the pairChildren cleanup.

**Playwright — `tests/e2e/smoke.spec.ts` extended:**

- Navigate to `/childrens-theatre/` — h1 "Children's Theatre" visible; ReflectivePrompt visible; directory grid renders.
- Sub-nav visible with "Plays" and "How-To Guides" links.
- Follow "Plays" → `/childrens-theatre/plays/` — h2 or h1 for the library visible; `ScriptCard`s render (or empty-state text).
- Follow first script card → `/childrens-theatre/scripts/[slug]/` — print button visible.
- Navigate to `/childrens-theatre/how-to/archetype-of-one-story/` — the `<svg role="img">` for the Wheel is present; `<figcaption>` lists at least one station name.

Regression: existing Cycle 1-3 assertions continue to pass.

---

## 12. Open Client Questions (bundled with prior open items)

1. **Series naming** — "Aesop's Fables" and "Conquering the Sun (Hawai'i)" confirmed as `series` values (kept verbatim as displayed on chips + cards)?
2. **The Treasure Inside AI prompt** — is the prompt included in the Drive doc, or does the client need to send it separately? The `aiPrompt` frontmatter only renders when set.
3. **Ian's dragon and other children's-drawings imagery** — attached in Drive as image files, or do they need scanning? If not available at import time, imagery arrays remain empty and the gallery section is silently skipped per entry.
4. **Fred Rogers acknowledgement** — specific quote/anecdote the client wants included, or general acknowledgment paragraph?
5. **"600 silent kids" and "six million audience" claims** — attribution/provenance line needed on the manifesto page, or presented as company assertions without external citation?
6. **On-demand PDF downloads** — spec §4.4 item 5 says "each script is a content page + printable/downloadable PDF." Cycle 4 ships the print stylesheet + browser print button; on-demand PDF generation is deferred to a later cycle. Confirm the scope is acceptable.
7. **Editorial burgundy comments** — spec explicitly names Cherie's inline comments on the "Why These Plays Work" source doc; import will strip them per the Cycle 3 discipline. Confirm nothing important should be preserved.

These questions bundle with the still-open Cycle 2 and Cycle 3 open items (Community wording confirmation, Ask Shakespeare destination email, "new plays" library decision, audio caption confirmation, etc.).

---

## 13. Memory + CLAUDE.md Updates (End of Cycle)

**Auto-memory:**

- `project_dtfc_cycles.md`: Cycle 4 ship date; roadmap remains Cycle 5 Legacy → Cycle 6 Community + forms + ESP → Cycle 7 search + analytics + launch.
- `project_dtfc_followups.md`: append the Cycle 4 follow-up block:
  - Any remaining CLIENT REVIEW markers on drafted paragraphs (Why These Plays Work, Honoring Our Guides, how-to guides where Drive import didn't provide the full text)
  - Ian's dragon and other imagery still pending (if not landed in Task 2)
  - The Treasure Inside AI prompt (if not in Drive)
  - Designer-polished Wayfarer's Journey Wheel replacement (nice-to-have)
  - PDF-generation deferral

**CLAUDE.md:**

- Under Stack, mention children's plays extend the shared `scripts` collection.
- Under Key conventions, add:
  - Two new `library` enum values (`childrens-plays`, `teaching-modules`); optional fields (`sourceMaterials`, `authorIntentions`, `whatToWatch`, `imagery`, `aiPrompt`, `series`).
  - Imagery files live at `/public/images/childrens-theatre/<slug>/` with ASCII kebab-case filenames.
  - Sub-nav library `src/lib/childrens-nav.ts` drives `ChildrensLayout` on every `/childrens-theatre/*` page.
  - `scriptHref` helper (`src/lib/script-href.ts`) is the canonical way to compute a script's detail URL — always use it, never hardcode `/shakespeare/scripts/…`.
- Under Adding a children's play: drop `src/content/scripts/<slug>.mdx` with `library` set to `childrens-plays` (or `teaching-modules`). Body sections `## Production Notes` / `## Script` / `## Facilitator Notes` (same convention as Shakespeare scripts). Optional frontmatter: `series` for grouping under Aesop's Fables / Conquering the Sun / etc.; `sourceMaterials`, `authorIntentions`, `whatToWatch` for facilitator-facing metadata; `imagery` array for children's drawings.
- Under Deferred / TODO markers, add: `pairChildren removed in Cycle 4 — SideBySideText composition relies on CSS grid auto-flow`.

---

## 14. Success Criteria (verifiable)

Cycle 4 is complete when:

1. `pnpm build` succeeds; `check:concepts` + `check:prohibited` both print `✓`. 60+ pages built (~10 new above Cycle 3's 52).
2. All 9 sub-routes render (5 top-level + 4 how-to guides); `/childrens-theatre/scripts/[slug]/` renders one page per Children's-Theatre-library entry.
3. Landing page displays the rewritten teasers with outbound cross-links; both `#imagination` and `#every-person` anchors resolve.
4. Sub-nav appears on every `/childrens-theatre/*` page marking the current sub-page.
5. Wayfarer's Journey Wheel renders on the Archetype of One Story guide with all 8 stations visible, SVG `<title>`+`<desc>` present, `<figcaption>` lists the stations, prints cleanly.
6. `ScriptDetail` renders the 5 new optional sections when set; Cycle 3 Shakespeare detail pages unchanged in the browser (regression check).
7. `series` chip filter works on `/childrens-theatre/plays/` with URL serialization (mirrors Cycle 3 themes-page pattern).
8. `scriptHref` helper unit tests pass; every callsite that constructs a script URL routes through it.
9. `/childrens-theatre/shakespeare-for-children/` renders Cycle 3 childrens-shakespeare entries with links back to `/shakespeare/scripts/[slug]/`.
10. `pairChildren` helper + tests removed; total Vitest count decreases by 6.
11. Full Vitest suite passes (including new `script-href.test.ts` and the extended schema tests).
12. Playwright smoke test extended and passing.
13. Basic AA audit clean on landing, one how-to guide (with wheel), one script detail.
14. Memory index and CLAUDE.md updated as specified in §13.

---

## 15. Handoff

After the user approves this design, the next step is to invoke `superpowers:writing-plans` to produce a step-by-step implementation plan. Implementation happens on `cycle-4-childrens-theatre`; merge to `main` uses `--no-ff` per convention. The plan will include an early task for the Google Drive MCP import with an explicit fallback path if the folder isn't accessible.
