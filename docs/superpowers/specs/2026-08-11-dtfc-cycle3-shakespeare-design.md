# DT:FC Website — Cycle 3 Design: Shakespeare Section

**Date:** 2026-08-11
**Source specs:**
- `/Users/cnote/Downloads/dtfc-website-spec.md` §4.3 (Shakespeare section brief)
- `docs/superpowers/specs/2026-08-10-dtfc-website-cycle1-design.md` (predecessor scaffolding)
- `docs/superpowers/specs/2026-08-10-dtfc-cycle2-landing-design.md` (predecessor landing rebuild — currently seeds the Shakespeare landing page with a reflective prompt + three teaser paragraphs pointing at destinations built this cycle)

**Cycle scope:** Deep-build the Shakespeare section — all 7 sub-features from spec §4.3: landing rebuild, alternatives essay, five script libraries with detail template, colloquial side-by-side with audio embed, Ask Shakespeare archive with stubbed submission form, and Honoring Our Guides. Introduce three new content collections (`scripts`, `askShakespeare`, `colloquial`) and the site's first audio embed. Seed content pulled from client's Google Drive at implementation time; if the folder is not accessible, ship placeholder stubs flagged `sample: true`.

**Branch:** `cycle-3-shakespeare`

---

## 1. Position in the Multi-Cycle Plan

Per the Cycle 2 re-sequencing (recorded in `project_dtfc_cycles.md` memory), Cycle 3 is Shakespeare (was Cycle 2 before the vision-fidelity landing rebuild displaced it). Subsequent cycles: 4 Children's Theatre, 5 Legacy, 6 Community + forms + ESP wiring, 7 cross-site search + analytics + launch checklist.

Cycle 3 is the first depth-build cycle since Cycle 1 shipped Theatre Games. Landing (Cycle 2) surfaced the promise; Cycle 3 makes good on the Idea Two answer paragraphs' three cross-links (§3 details below) by giving them real destinations.

---

## 2. Cycle 3 Scope

### 2.1 Ships in Cycle 3

- **Rewritten `src/pages/shakespeare/index.astro`:** promotes the Cycle 2 teaser page into a full landing. Keeps the ReflectivePrompt. Converts the three teaser paragraphs into cross-links to their real destinations. Adds the "Leave the Language as Shakespeare's Own" callout (spec §4.3 item 7). Adds a directory grid of the sub-sections.
- **Nine new routes** matching the spec §6 route map:
  - `/shakespeare/alternatives/` — Creating Fearless Shakespeare Scripts essay + 4-alternatives framing
  - `/shakespeare/scenes/` — Scenes library index
  - `/shakespeare/themes/` — Scenes Around a Theme library index (8 themes as filter chips)
  - `/shakespeare/cuttings/` — Cuttings library index
  - `/shakespeare/soliloquies/` — Soliloquies & Solo Speeches library index
  - `/shakespeare/childrens-shakespeare/` — Children's Shakespeare library index + cross-link to Children's Theatre section
  - `/shakespeare/colloquial/` — index of side-by-side pairings
  - `/shakespeare/ask-shakespeare/` — archive of 5 columns + stubbed submission form
  - `/shakespeare/honoring-our-guides/` — CSF, CU, Daniel S.P. Yang, Joe Craft / Denver Public Schools Shakespeare Festival, Amanda Giguere
- **Dynamic routes:**
  - `/shakespeare/scripts/[slug]/` — individual script detail template (all libraries share one template)
  - `/shakespeare/colloquial/[slug]/` — individual side-by-side pairing
  - `/shakespeare/ask-shakespeare/[slug]/` — individual Q&A column
- **Three new content collections** in `src/content.config.ts`: `scripts`, `askShakespeare`, `colloquial`.
- **Seven new components:**
  - `SideBySideText.astro` — reusable `<dl>` wrapper for the colloquial layout with `<Original>` / `<Colloquial>` sub-components; two-column grid on desktop, stacked on mobile.
  - `AudioEmbed.astro` — native `<audio controls>` with source, optional caption, and download link.
  - `AskShakespeareForm.astro` — form UI with `TODO(esp)` stubbed submit handler.
  - `AskShakespeareCard.astro` — archive-list card.
  - `ScriptCard.astro` — library-index card.
  - `ScriptDetail.astro` — script detail page template with print button.
  - `LibraryIndex.astro` — shared template for the 5 library pages.
- **New layout:** `ShakespeareLayout.astro` — wraps `SectionLayout` with a persistent sub-nav on every `/shakespeare/*` page.
- **Seed content** pulled from the client's Google Drive folder at implementation time via the Google Drive MCP server. Fallback: if the folder isn't accessible, ship 1–2 placeholder stubs per library flagged `sample: true` and note the deferred bulk import.
- **First audio file** on the site: `Midʻsummah-Pidgin-Paka.mp4` from Drive, renamed to `midsummah-pidgin-paka.mp4` (URL-safe) and placed at `/public/audio/`.
- **Tests:** new Vitest suite `tests/unit/shakespeare.test.ts` (collection schemas + `SideBySideText` pairing helper); Playwright smoke test extended to visit `/shakespeare/`, one library page, one script detail, `/shakespeare/colloquial/[slug]/` (with audio), `/shakespeare/ask-shakespeare/`.
- **CLAUDE.md + memory updates** at end of cycle.

### 2.2 Explicitly deferred

- **Real Ask Shakespeare submission wiring** — Cycle 6 (forms + ESP choice). This cycle stubs to `console.log` with a `TODO(esp)` marker matching the existing `NewsletterTile` pattern.
- **Children's Theatre section rebuild** — Cycle 4. Cross-links from `/shakespeare/childrens-shakespeare/` land on the current stub page; bidirectional Shakespeare cross-links land in Cycle 4.
- **Global site search (Pagefind) that indexes scripts** — Cycle 7.
- **Per-script PDF downloads beyond the print stylesheet** — later.
- **Video-format alternatives to audio embed** — later per spec §5.
- **Bulk import of remaining scripts beyond the seed pull** — a subsequent content-import cycle handles depth once Drive is fully migrated.
- **A separate `new-plays` script library** — spec §4.3 mentions Three Finger Dick and Shakespeare's Sister but does not name a dedicated library; Cycle 3 references them in the Alternatives essay and defers the library decision to the client (see §12).

### 2.3 Deployment

Still local-dev only, matching Cycle 1 baseline. Cycle 3 doesn't gate on hosting selection.

---

## 3. Landing Page Rewrite

The Cycle 2 landing had ReflectivePrompt plus three teaser paragraphs (`#four-hundred-forty`, `#daniel-yang`, `#ask-shakespeare`) that were flagged CLIENT REVIEW because their destinations didn't exist yet. Cycle 3 restructures the page so those teasers point to real content:

- **Keep** the `<ReflectivePrompt sectionKey="shakespeare" />`.
- **Rewrite** the three existing sections into shorter intros with outbound cross-links:
  - `#four-hundred-forty` — 1 paragraph on the enduring performance of Shakespeare's plays, ending with a link to `/shakespeare/alternatives/` ("Read Creating Fearless Shakespeare Scripts →").
  - `#daniel-yang` — 1 paragraph on Daniel S.P. Yang's Chinese translations, ending with a link to `/shakespeare/honoring-our-guides/` ("See Honoring Our Guides →").
  - `#ask-shakespeare` — 1 paragraph on the Ask Shakespeare column, ending with a link to `/shakespeare/ask-shakespeare/` ("Browse the archive or submit a question →").
- **Preserve** the three `<section id="…">` anchors so external links or the Cycle 2 landing box's Idea Two answer promise (via `IDEA_TWO_ANSWERS` in `src/data/landing.ts`) continue to resolve.
- **Add** the "Leave the Language as Shakespeare's Own" callout (spec §4.3 item 7). Drafted copy:

  > **Leave the Language as Shakespeare's Own.**
  >
  > When actors of any age step into Shakespeare's words as written, they train ear, breath, and imagination together. DT:FC does not paraphrase or "translate" the original in performance — the language itself does the teaching. (For readers who want a bridge into the words, see our [Colloquial pairings](/shakespeare/colloquial/) alongside the originals.)

  Flagged `{/* CLIENT REVIEW */}` per project convention.

- **Add** a directory of sub-sections rendered as a small card grid (Alternatives, Script Libraries [collapsed], Colloquial, Ask Shakespeare, Honoring Our Guides). Each card: label + one-line description + link.

Reading order on mobile: eyebrow → h1 → ReflectivePrompt → callout → three teaser sections → directory grid.

---

## 4. Content Model

### 4.1 `scripts` collection

One file per script under `src/content/scripts/`. MDX body for inline formatting (stage directions, scene headings, character labels).

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const scripts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/scripts' }),
  schema: z
    .object({
      title: z.string(),
      library: z.enum([
        'soliloquies',
        'scenes',
        'themes',
        'cuttings',
        'childrens-shakespeare',
      ]),
      play: z.string(), // canonical source play, e.g. "Romeo and Juliet"
      theme: z.string().optional(), // required when library === 'themes'
      authors: z.array(z.string()).default([]), // adapters / cutters
      copyright: z.string().optional(), // e.g. "© 2022 Chuck and Lola Wilcox"
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
      sourceDoc: z.string().optional(), // pointer back to Drive doc used for import
      sample: z.boolean().default(false),
    })
    .refine((s) => s.library !== 'themes' || !!s.theme, {
      message: "scripts entries with library === 'themes' must set a `theme`",
      path: ['theme'],
    }),
});
```

Body MDX uses three conventional H2s the detail template renders as anchored sections:

```mdx
## Production Notes

…what to watch, author's intentions, staging cues…

## Script

…the actual script text, scene by scene…

## Facilitator Notes

…debrief prompts, teaching angle…
```

### 4.2 `askShakespeare` collection

One file per Q&A column under `src/content/ask-shakespeare/`.

```typescript
const askShakespeare = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ask-shakespeare' }),
  schema: z.object({
    columnNumber: z.number().int().positive(),
    title: z.string(), // e.g. "Did you write the plays?"
    publishedIn: z.string(), // e.g. "2024–25 newsletter"
    asker: z.string().default('Reader'),
    excerpt: z.string().max(200),
    sample: z.boolean().default(false),
  }),
});
```

Body MDX carries the full Q&A with two H2s (Question / Shakespeare Answers):

```mdx
## The Question

…reader's question, verbatim from newsletter…

## Shakespeare Answers

…first-person response in Shakespeare's voice…
```

### 4.3 `colloquial` collection

One file per side-by-side pairing under `src/content/colloquial/`.

```typescript
const colloquial = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/colloquial' }),
  schema: z.object({
    title: z.string(), // e.g. "One Uddah Mid'summah"
    subtitle: z.string().optional(), // e.g. "Hawaiian Pidgin adaptation of A Midsummer Night's Dream"
    translator: z.string(),
    audio: z.string().optional(), // path under /public/audio/ (URL-safe filename)
    audioCaption: z.string().optional(),
    sourcePlay: z.string(),
    sample: z.boolean().default(false),
  }),
});
```

Body MDX uses the `<SideBySide>` / `<Original>` / `<Colloquial>` components (imported via `<Content components={{ SideBySide, Original, Colloquial }} />` in the layout — same pattern as `<Concept>` from Cycle 1):

```mdx
## Act I, Scene i

<SideBySide>
  <Original>Now, fair Hippolyta, our nuptial hour</Original>
  <Colloquial>Eh, sweet Hippolyta, our wedding day</Colloquial>

  <Original>Draws on apace…</Original>
  <Colloquial>Coming up fast…</Colloquial>
</SideBySide>
```

### 4.4 Registration

`src/content.config.ts` registers the three new collections alongside the existing `games` and `concepts`:

```typescript
export const collections = { games, concepts, scripts, askShakespeare, colloquial };
```

---

## 5. Component Architecture

All new Shakespeare-specific components live under `src/components/shakespeare/`. The audio embed lives under `src/components/media/` (more reusable). The new layout goes under `src/layouts/`.

| Component | Path | Responsibility | Consumes |
|---|---|---|---|
| `SideBySideText.astro` | `components/shakespeare/SideBySideText.astro` | Renders `<dl class="grid gap-x-8 gap-y-4 md:grid-cols-2">` wrapping paired `<dt>` / `<dd>` children so the pairing is preserved in DOM order for screen readers while sighted users see two columns on desktop. Internally delegates the pair-grouping to `pairChildren()` in `src/lib/pair-children.ts` (extracted so it's Vitest-testable in isolation). | slot content |
| `Original.astro` | `components/shakespeare/Original.astro` | Renders a `<dt>` with the original-text typography (serif, italic label optional). Used as a child of `<SideBySide>`. | slot content |
| `Colloquial.astro` | `components/shakespeare/Colloquial.astro` | Renders a `<dd>` with the colloquial-text typography. Used as a child of `<SideBySide>`. | slot content |
| `AudioEmbed.astro` | `components/media/AudioEmbed.astro` | Native `<audio controls preload="metadata">` with `<source>`, optional `<figcaption>`, optional "Download →" link. Props: `src` (required), `type?` (defaults to `audio/mp4`), `caption?`, `downloadable?` (defaults `true`). | props only |
| `AskShakespeareForm.astro` | `components/shakespeare/AskShakespeareForm.astro` | `<form>` with fields `name?`, `email?`, `question` (required textarea). Inline `onsubmit` calls a `TODO(esp)` placeholder that `console.log`s the payload. Matches the `NewsletterTile` pattern. | none |
| `AskShakespeareCard.astro` | `components/shakespeare/AskShakespeareCard.astro` | Archive card: column-number badge + title + excerpt + link. | one collection entry |
| `ScriptCard.astro` | `components/shakespeare/ScriptCard.astro` | Library-index card: title + play + minutes badge + character count + link. | one scripts entry |
| `ScriptDetail.astro` | `components/shakespeare/ScriptDetail.astro` | Detail-page template: header (title, chips, characters, copyright), MDX body slot, print button, sample-content badge if `sample: true`. | one scripts entry + slot |
| `LibraryIndex.astro` | `components/shakespeare/LibraryIndex.astro` | Shared template for the 5 library pages. Takes `library` prop; filters `getCollection('scripts')`; renders `ScriptCard`s. Themes variant adds a theme filter chip list. | `library` prop |
| `ShakespeareLayout.astro` | `layouts/ShakespeareLayout.astro` | Wraps `SectionLayout` with a persistent sub-nav (9 items) below the section h1. Data-driven from `src/lib/shakespeare-nav.ts`. | slot content |

**Sub-nav data (`src/lib/shakespeare-nav.ts`):**

```typescript
export interface ShakespeareNavItem {
  key: string;
  label: string;
  href: string;
}

export const SHAKESPEARE_NAV: ShakespeareNavItem[] = [
  { key: 'alternatives', label: 'Alternatives', href: '/shakespeare/alternatives/' },
  { key: 'scenes', label: 'Scenes', href: '/shakespeare/scenes/' },
  { key: 'themes', label: 'Themes', href: '/shakespeare/themes/' },
  { key: 'cuttings', label: 'Cuttings', href: '/shakespeare/cuttings/' },
  { key: 'soliloquies', label: 'Soliloquies', href: '/shakespeare/soliloquies/' },
  {
    key: 'childrens-shakespeare',
    label: "Children's",
    href: '/shakespeare/childrens-shakespeare/',
  },
  { key: 'colloquial', label: 'Colloquial', href: '/shakespeare/colloquial/' },
  { key: 'ask-shakespeare', label: 'Ask Shakespeare', href: '/shakespeare/ask-shakespeare/' },
  {
    key: 'honoring-our-guides',
    label: 'Honoring Our Guides',
    href: '/shakespeare/honoring-our-guides/',
  },
];
```

`ShakespeareLayout` reads a `subPage?: string` prop, matches it against `SHAKESPEARE_NAV[i].key`, and applies a `border-b-2 border-clay-500` (or equivalent token) to the active item — same pattern as the primary `Nav.astro`.

---

## 6. Route Layout

```
src/pages/shakespeare/
├── index.astro                          # section landing (rebuild of Cycle 2 version)
├── alternatives.astro                   # Creating Fearless Shakespeare Scripts essay
├── scenes.astro                         # library index (library='scenes')
├── themes.astro                         # library index (library='themes') + theme filter chips
├── cuttings.astro                       # library index (library='cuttings')
├── soliloquies.astro                    # library index (library='soliloquies')
├── childrens-shakespeare.astro          # library index + Children's Theatre cross-link
├── colloquial/
│   ├── index.astro                      # list of pairings
│   └── [slug].astro                     # individual side-by-side pairing
├── ask-shakespeare/
│   ├── index.astro                      # archive of columns + submission form
│   └── [slug].astro                     # individual Q&A column
├── honoring-our-guides.astro
└── scripts/
    └── [slug].astro                     # individual script (all libraries share one template)
```

Libraries are flat routes (`/shakespeare/scenes/`) rather than nested (`/shakespeare/scripts/scenes/`) so URLs match the spec's route map and each library page has room for its own intro. Individual scripts always live at `/shakespeare/scripts/[slug]/` — one canonical URL per script — with the library shown as a chip in the header. This means library-page cards link to the canonical script URL, not to a library-scoped one.

---

## 7. File Additions and Modifications

```
docs/superpowers/specs/
  2026-08-11-dtfc-cycle3-shakespeare-design.md    # this file

src/components/shakespeare/                       # new directory
  SideBySideText.astro
  Original.astro
  Colloquial.astro
  AskShakespeareForm.astro
  AskShakespeareCard.astro
  ScriptCard.astro
  ScriptDetail.astro
  LibraryIndex.astro

src/components/media/                             # new directory
  AudioEmbed.astro

src/layouts/
  ShakespeareLayout.astro                         # new

src/lib/
  shakespeare-nav.ts                              # new
  pair-children.ts                                # new (pairChildren helper extracted from SideBySideText for testability)

src/content.config.ts                             # modified: register scripts, askShakespeare, colloquial

src/content/scripts/                              # new — seed with Drive import at implementation time
src/content/ask-shakespeare/                      # new — seed with Drive import at implementation time
src/content/colloquial/                           # new — seed with Drive import at implementation time (Pidgin Midsummer + Romeo & Juliet rap)

public/audio/                                     # new directory
  midsummah-pidgin-paka.mp4                       # renamed from source Drive file (URL-safe)

src/pages/shakespeare/                            # existing dir; landing rewritten, everything else new
  index.astro                                     # rewritten
  alternatives.astro                              # new
  scenes.astro                                    # new
  themes.astro                                    # new
  cuttings.astro                                  # new
  soliloquies.astro                               # new
  childrens-shakespeare.astro                     # new
  colloquial/index.astro                          # new
  colloquial/[slug].astro                         # new
  ask-shakespeare/index.astro                     # new
  ask-shakespeare/[slug].astro                    # new
  honoring-our-guides.astro                       # new
  scripts/[slug].astro                            # new

tests/unit/
  shakespeare.test.ts                             # new

tests/e2e/
  smoke.spec.ts                                   # extended

CLAUDE.md                                         # modified
```

---

## 8. Landing-Page Idea Two Answer Consistency

The Cycle 2 landing (`src/pages/index.astro` → LandingGrid → SECTION_TILES) surfaces three Idea Two questions for Shakespeare via the hybrid rotation:

- "How many of Shakespeare's plays are performed now — 440+ years later?" → resolved by the rewritten `#four-hundred-forty` section, whose "Read more" link now goes to the Alternatives essay.
- "Who is translating Shakespeare's plays into Chinese?" → resolved by the rewritten `#daniel-yang` section, linking to Honoring Our Guides.
- "Do you have a question to Ask Shakespeare?" → resolved by the rewritten `#ask-shakespeare` section, linking to the archive + form.

`IDEA_TWO_ANSWERS` in `src/data/landing.ts` currently maps question #10 to `/shakespeare/#ask-shakespeare`. No landing.ts changes needed; the anchor still resolves and now leads to a paragraph that itself links onward. Same for #8 and #9. This is a strengthening of the promise, not a schema change.

---

## 9. Print Stylesheet

`ScriptDetail.astro` uses the existing `src/styles/print.css` from Cycle 1. Print output:

- Drops the primary nav, Shakespeare sub-nav, chips, shadows.
- Uses serif body at 11pt / 1.4 line-height.
- Retains script H2s (Production Notes / Script / Facilitator Notes).
- Prints a footer line with the script's title + source play + copyright line if present.

No changes to `print.css` required; existing rules apply to any content inside `<article class="printable">` (or equivalent — verify against Cycle 1 game-detail implementation during implementation).

---

## 10. Audio Embed Discipline

- File placement: `/public/audio/` (new top-level dir).
- Filename normalization: source Drive file `Midʻsummah-Pidgin-Paka.mp4` renamed to `midsummah-pidgin-paka.mp4` before commit. The ʻokina (U+02BB) breaks browser URL handling on some agents; ASCII-only filename is safer.
- Component API:
  ```astro
  <AudioEmbed
    src="/audio/midsummah-pidgin-paka.mp4"
    type="audio/mp4"
    caption="Read aloud by Paka Johnson"
    downloadable={true}
  />
  ```
- Renders:
  ```html
  <figure class="my-6">
    <audio controls preload="metadata">
      <source src="/audio/midsummah-pidgin-paka.mp4" type="audio/mp4" />
      Your browser does not support the audio element.
      <a href="/audio/midsummah-pidgin-paka.mp4">Download the audio file</a>.
    </audio>
    <figcaption class="text-ink-500 mt-2 text-sm">
      Read aloud by Paka Johnson.
      <a href="/audio/midsummah-pidgin-paka.mp4" download>Download →</a>
    </figcaption>
  </figure>
  ```
- No autoplay. No custom controls in v1 — native browser controls give the best keyboard + screen-reader story. Custom-styled player is a follow-up if desired.

---

## 11. Testing

**Vitest — `tests/unit/shakespeare.test.ts`:**

- `scripts` schema: parses valid entries; rejects `library: 'themes'` without a `theme` (per the refine); rejects `minutes: 0` or negative; rejects invalid `library` value. Fixture-driven — the test defines a few in-memory objects and calls the exported Zod schema's `.parse()`.
- `askShakespeare` schema: parses valid entries; asserts every real entry's `columnNumber` is unique across the collection. This iterates the on-disk collection by reading files under `src/content/ask-shakespeare/`, parsing frontmatter, and checking uniqueness.
- `colloquial` schema + audio-file existence: parses valid entries; for every on-disk entry with `audio` set, `fs.existsSync('public/' + audio)` returns true. This is a Vitest-side filesystem check, not a Zod refine (Zod runs in the browser bundle where `fs` isn't available).
- `pairChildren(nodes)` helper (extracted from `SideBySideText.astro` into `src/lib/pair-children.ts` for testability): given an array like `['orig', 'coll', 'orig', 'coll']`, returns `[['orig', 'coll'], ['orig', 'coll']]`; handles odd count (returns the trailing unpaired element as `['orig']` in the last slot).

**Playwright — `tests/e2e/smoke.spec.ts` extended:**

- Navigate to `/shakespeare/` — asserts h1 + ReflectivePrompt + "Leave the Language" callout + directory grid.
- Follow a directory-grid link to `/shakespeare/scenes/` — asserts a `<ul>` of `ScriptCard`s.
- Follow a `ScriptCard` link to `/shakespeare/scripts/[slug]/` — asserts script header + print button + at least one H2 in body.
- Navigate to `/shakespeare/colloquial/[slug]/` — asserts `<audio>` element with `src` matching `/audio/*.mp4`, and at least one paired `<dt>` + `<dd>`.
- Navigate to `/shakespeare/ask-shakespeare/` — asserts card list + `<form>` with a `question` textarea.

**Regression:** existing Cycle 1 + Cycle 2 assertions continue to pass. Sub-nav does not interfere with `getByRole('link', { name: 'Theatre Games' })` etc.

---

## 12. Open Client Questions (to bundle with the Cycle 2 open list)

1. **"Leave the Language as Shakespeare's Own" callout wording** — draft in §3 above. Confirmation needed on the tone and the parenthetical cross-link to Colloquial pairings.
2. **Ask Shakespeare submission destination email** — required before Cycle 6 wires the form for real. This cycle stubs to `console.log`.
3. **New Plays library** — spec §4.3 names Three Finger Dick (Chuck Wilcox) and Shakespeare's Sister (Marta Barnard) among the four alternatives, but does not designate a separate library. Cycle 3 mentions them in the Alternatives essay only. Should a `new-plays` library be added (schema enum extension + one library page)?
4. **Audio caption for the Pidgin Midsummer file** — spec calls out the mp4 but not the caption line. Draft above: "Read aloud by Paka Johnson." Confirmation needed.
5. **Ask Shakespeare column publication dates** — spec references "2024–25 newsletters" but the individual issue dates aren't listed. Best-effort during Drive import.
6. **Copyright / licensing on Colloquial pairings** — the Pidgin Midsummer text is presumably Jackie Pualani Johnson's work; Cycle 3 records `translator` in frontmatter but does not gate on a formal license line. Confirmation needed on whether a per-pairing copyright is required.

These questions are drafted for bundling into the same email as Cycle 2's still-open items (naming, Community wording, reflective softening, ninth grid cell, PRC question count).

---

## 13. Memory + CLAUDE.md Updates (End of Cycle)

**Auto-memory:**

- `project_dtfc_cycles.md`: Cycle 3 ship date; roadmap remains Cycle 4 Children's Theatre → Cycle 5 Legacy → Cycle 6 Community + forms + ESP → Cycle 7 search + analytics + launch.
- `project_dtfc_followups.md`: append the Cycle 3 follow-up block (Ask Shakespeare form wiring belongs to Cycle 6 ESP; Children's Shakespeare bidirectional cross-link lands in Cycle 4; "new plays" library open question; Colloquial licensing).

**CLAUDE.md:**

- Under Stack, add MDX-with-components pattern is used for Colloquial (`<SideBySide>` / `<Original>` / `<Colloquial>`).
- Under Key conventions, add: three new content collections (`scripts`, `askShakespeare`, `colloquial`), each with its own frontmatter schema in `src/content.config.ts`; audio files live at `/public/audio/` with ASCII-only filenames.
- Under Adding a script: drop `src/content/scripts/<slug>.mdx` with `library` set to one of the five values (`soliloquies | scenes | themes | cuttings | childrens-shakespeare`); `themes` entries must also set `theme`. Body uses `## Production Notes`, `## Script`, `## Facilitator Notes`.
- Under Adding an Ask Shakespeare column: drop `src/content/ask-shakespeare/<slug>.mdx` with a unique `columnNumber` and an `excerpt` ≤ 200 chars. Body uses `## The Question` and `## Shakespeare Answers`.
- Under Adding a Colloquial pairing: drop `src/content/colloquial/<slug>.mdx`; if audio is provided, place file at `/public/audio/<slug>.mp4` and set `audio` frontmatter. Body uses `<SideBySide>` blocks.
- Under repo structure, mention new `src/components/shakespeare/` and `src/components/media/` directories, `src/layouts/ShakespeareLayout.astro`, and `public/audio/`.
- Under Deferred / TODO markers, add `TODO(esp) in src/components/shakespeare/AskShakespeareForm.astro — inherits the same ESP TODO as NewsletterTile and footer signup`.

---

## 14. Success Criteria (verifiable)

Cycle 3 is complete when:

1. `pnpm build` succeeds; both prebuild guardrails (`check:concepts`, `check:prohibited`) still pass.
2. All 9 sub-routes render; dynamic detail routes render one page per entry in each collection (however many entries the Drive import lands, with a minimum of 1 per library — placeholder stub if needed). Empty-state text renders on library index pages that have zero entries.
3. Landing page displays: h1, ReflectivePrompt, "Leave the Language" callout, three rewritten teaser sections (with outbound links), directory grid. The three `#…` anchors from Cycle 2 continue to resolve.
4. Sub-nav appears on every `/shakespeare/*` page with the current page marked.
5. Colloquial pairing page displays paired text as a `<dl>` (screen-reader friendly), two-column desktop / stacked mobile; audio embed renders with native controls and includes a download link.
6. Ask Shakespeare archive lists every seeded column (spec calls out 5 available in Drive; final count is whatever the import lands); each column's individual page renders; submission form present with `TODO(esp)` marker.
7. Script detail page prints cleanly (nav / sub-nav / chips dropped; serif 11pt body).
8. Vitest suite covers the three new schemas + `SideBySideText` helper; all passing.
9. Playwright smoke test extended to visit all key routes above and passing.
10. Basic AA audit clean on landing, one library index, one script detail, and colloquial pairing page.
11. Memory index and CLAUDE.md updated as specified in §13.

---

## 15. Handoff

After the user approves this design, the next step is to invoke the `superpowers:writing-plans` skill to produce a step-by-step implementation plan against this spec. Implementation happens on the `cycle-3-shakespeare` branch; merge to `main` uses `--no-ff` per the branching convention. The plan will include an early task for the Google Drive MCP import with an explicit fallback path if the folder isn't accessible.
