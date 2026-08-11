# DT:FC Cycle 3 — Shakespeare Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the DT:FC Shakespeare section per spec §4.3 — landing rebuild, 9 sub-routes, three new content collections (`scripts`, `askShakespeare`, `colloquial`), the site's first audio embed, colloquial side-by-side layout using MDX-with-components, Ask Shakespeare archive with a stubbed submission form, and Honoring Our Guides.

**Architecture:** Three Astro content collections (Zod-validated) house scripts, Q&A columns, and colloquial pairings. Nine sub-routes under `/shakespeare/` share a `ShakespeareLayout` with a persistent sub-nav. Six new components under `src/components/shakespeare/` plus one reusable `AudioEmbed` under `src/components/media/`. Colloquial pairings use MDX with the `<SideBySide>`/`<Original>`/`<Colloquial>` component pattern (delegates pair-grouping to a testable `pairChildren` helper). Seed content pulled from client's Google Drive via MCP at implementation time; placeholder-stub fallback if unavailable.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@theme` tokens), TypeScript strict, Zod (via `astro:content`), MDX for script / colloquial / Q&A bodies, native `<audio>` element (no Preact islands), Vitest for unit tests, Playwright for e2e smoke test.

## Global Constraints

- **Branch:** all work happens on `cycle-3-shakespeare`. Merge to `main` at cycle end uses `git merge --no-ff`.
- **Package manager:** `pnpm` only. Commands: `pnpm dev`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm check:concepts`, `pnpm check:prohibited`.
- **Node module type:** `"type": "module"` — new scripts and configs use ESM.
- **No hex codes in components** — colors come from tokens in `src/styles/tokens.css` (defined palette: clay, teal, mustard, ivory, ink).
- **Vocabulary:** "Players" (never "actors"), "Facilitator" (never "leader"), "Players Resource Center" (full name), "Children's Theatre" (curly apostrophe). Warm, playful, encouraging voice; exclamation-friendly.
- **Prohibited landing/site copy:** "Great Change", "traditional work and ways", "THIS (crazy) time", `RESILIENCEl` (typo), wrong-apostrophe "Childrens' Theatre". Enforced by `scripts/check-prohibited-text.mjs` — runs in prebuild.
- **`<Concept id="…" />` references** must resolve to a known concept slug via the `check-concept-refs.mjs` guard.
- **CLIENT REVIEW markers:** any drafted prose not verbatim from Drive source docs gets `{/* CLIENT REVIEW: reason */}` in `.astro` or `<!-- CLIENT REVIEW: reason -->` in `.mdx` above the drafted block.
- **Sample-content flag:** any content that isn't real client-authored copy gets `sample: true` in its frontmatter. Templates render a chip showing "Sample — pending final import" when set.
- **Commit granularity:** one commit per task (each task's final step). Commit messages authored `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` via HEREDOC.
- **Section identity:** every `/shakespeare/*` page uses `<ShakespeareLayout>` (Task 9) which passes `section="shakespeare"` to the base primary nav so the primary "Shakespeare" nav item is marked current.
- **File naming for audio:** ASCII-only, kebab-case. Source Drive file `Midʻsummah-Pidgin-Paka.mp4` becomes `midsummah-pidgin-paka.mp4` at `/public/audio/`.

---

## File Map

**Create:**
- `src/lib/shakespeare-nav.ts`
- `src/lib/pair-children.ts`
- `src/components/media/AudioEmbed.astro`
- `src/components/shakespeare/SideBySideText.astro`
- `src/components/shakespeare/Original.astro`
- `src/components/shakespeare/Colloquial.astro`
- `src/components/shakespeare/AskShakespeareForm.astro`
- `src/components/shakespeare/AskShakespeareCard.astro`
- `src/components/shakespeare/ScriptCard.astro`
- `src/components/shakespeare/ScriptDetail.astro`
- `src/components/shakespeare/LibraryIndex.astro`
- `src/layouts/ShakespeareLayout.astro`
- `src/content/scripts/*.mdx` (initially placeholders, augmented by Drive import if available)
- `src/content/ask-shakespeare/*.mdx` (same)
- `src/content/colloquial/*.mdx` (same)
- `public/audio/` (directory; Pidgin Midsummer file lands here from Drive import if available)
- `src/pages/shakespeare/alternatives.astro`
- `src/pages/shakespeare/scenes.astro`
- `src/pages/shakespeare/themes.astro`
- `src/pages/shakespeare/cuttings.astro`
- `src/pages/shakespeare/soliloquies.astro`
- `src/pages/shakespeare/childrens-shakespeare.astro`
- `src/pages/shakespeare/honoring-our-guides.astro`
- `src/pages/shakespeare/colloquial/index.astro`
- `src/pages/shakespeare/colloquial/[slug].astro`
- `src/pages/shakespeare/ask-shakespeare/index.astro`
- `src/pages/shakespeare/ask-shakespeare/[slug].astro`
- `src/pages/shakespeare/scripts/[slug].astro`
- `tests/unit/shakespeare.test.ts`
- `tests/unit/pair-children.test.ts`
- `docs/superpowers/plans/2026-08-11-dtfc-cycle3-shakespeare.md` (this file)

**Modify:**
- `src/content.config.ts` — register three new collections.
- `src/pages/shakespeare/index.astro` — rewrite landing.
- `tests/e2e/smoke.spec.ts` — extend for Shakespeare routes.
- `CLAUDE.md` — collections, components, audio placement, sub-nav, TODO(esp) marker.

**Auto-memory updates (end of cycle):** `project_dtfc_cycles.md`, `project_dtfc_followups.md`, `MEMORY.md` (only if new memory files are created — none planned).

---

## Special Task: Drive Import Coordination

**Task 2 (Drive MCP import) requires the client's Google Drive folder link.** Before dispatching Task 2's implementer, the controller must ask the human partner:

> "Do you have the Google Drive folder link for the Shakespeare source content (script libraries, Ask Shakespeare columns 1–5, Pidgin Midsummer audio)? Paste it and I'll pull the real content. Otherwise I'll skip the import and Cycle 3 ships with the placeholder stubs from Task 1 — real content lands in a follow-up cycle."

If the user provides the link, Task 2 proceeds with the link substituted into its steps. If not, Task 2 is skipped (mark as deferred in the ledger, add a follow-up note, proceed to Task 3). All downstream tasks must work with either real content or placeholders — the templates render whatever entries exist and show the empty-state text where a library has zero entries.

---

## Task 1: Register content collections + placeholder seed content

**Files:**
- Modify: `src/content.config.ts` (add `scripts`, `askShakespeare`, `colloquial` collections)
- Create: `src/content/scripts/sample-soliloquy-hamlet.mdx`
- Create: `src/content/scripts/sample-scene-macbeth.mdx`
- Create: `src/content/scripts/sample-theme-battle-of-the-sexes.mdx`
- Create: `src/content/scripts/sample-cutting-romeo-juliet.mdx`
- Create: `src/content/scripts/sample-childrens-shakespeare-midsummer.mdx`
- Create: `src/content/ask-shakespeare/sample-column-one.mdx`
- Create: `src/content/colloquial/sample-pidgin-midsummer.mdx`
- Create: `tests/unit/shakespeare.test.ts` (schema validation + collection-uniqueness tests)

**Interfaces produced:**
- Zod schemas for all three collections exported implicitly by Astro's `getCollection`.
- Collection entries with the following frontmatter shapes are guaranteed present:
  - `scripts`: fields `title, library, play, theme?, authors[], copyright?, minutes?, characters[], doubling?, stagingNotes?, sourceDoc?, sample`. `library` is one of `soliloquies | scenes | themes | cuttings | childrens-shakespeare`. `theme` required when `library === 'themes'`.
  - `askShakespeare`: fields `columnNumber, title, publishedIn, asker, excerpt, sample`.
  - `colloquial`: fields `title, subtitle?, translator, audio?, audioCaption?, sourcePlay, sample`.

**Why placeholder-first:** Task 2 may not run (see "Special Task: Drive Import Coordination"). Task 1 guarantees at least one entry per library and per collection so downstream template tests have data to render.

- [ ] **Step 1: Write failing test at `tests/unit/shakespeare.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('scripts collection', () => {
  it('has at least one entry per library', async () => {
    const entries = await getCollection('scripts');
    const libraries = new Set(entries.map((e) => e.data.library));
    for (const lib of ['soliloquies', 'scenes', 'themes', 'cuttings', 'childrens-shakespeare'] as const) {
      expect(libraries.has(lib), `no scripts entry has library="${lib}"`).toBe(true);
    }
  });

  it('every themes entry has a theme field', async () => {
    const entries = await getCollection('scripts');
    for (const e of entries.filter((e) => e.data.library === 'themes')) {
      expect(e.data.theme, `themes entry ${e.id} missing theme`).toBeTruthy();
    }
  });

  it('every entry with minutes has a positive integer value', async () => {
    const entries = await getCollection('scripts');
    for (const e of entries) {
      if (e.data.minutes !== undefined) {
        expect(e.data.minutes).toBeGreaterThan(0);
        expect(Number.isInteger(e.data.minutes)).toBe(true);
      }
    }
  });
});

describe('askShakespeare collection', () => {
  it('has at least one entry', async () => {
    const entries = await getCollection('askShakespeare');
    expect(entries.length).toBeGreaterThan(0);
  });

  it('columnNumber values are unique across the collection', async () => {
    const entries = await getCollection('askShakespeare');
    const numbers = entries.map((e) => e.data.columnNumber);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('every excerpt is ≤ 200 characters', async () => {
    const entries = await getCollection('askShakespeare');
    for (const e of entries) {
      expect(e.data.excerpt.length).toBeLessThanOrEqual(200);
    }
  });
});

describe('colloquial collection', () => {
  it('has at least one entry', async () => {
    const entries = await getCollection('colloquial');
    expect(entries.length).toBeGreaterThan(0);
  });

  it('every entry with audio set has the file present under public/audio/', async () => {
    const { existsSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const audioDir = fileURLToPath(new URL('../../public/audio/', import.meta.url));
    const entries = await getCollection('colloquial');
    for (const e of entries) {
      if (e.data.audio) {
        // Convention: `audio` is a bare filename (see Task 1 schema comment).
        expect(
          existsSync(audioDir + e.data.audio),
          `${e.data.audio} referenced by ${e.id} not found in public/audio/`,
        ).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

Run:
```bash
pnpm test tests/unit/shakespeare.test.ts
```

Expected: FAIL — `getCollection('scripts' | 'askShakespeare' | 'colloquial')` doesn't resolve because the collections aren't registered yet.

- [ ] **Step 3: Modify `src/content.config.ts` to register the three new collections**

Replace the entire file with:

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { COMPETENCIES, COHESIONS, STRUCTURES } from '@/lib/types';

const games = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/games' }),
  schema: z.object({
    name: z.string(),
    competency: z.enum(COMPETENCIES),
    subset: z.string().optional(),
    structure: z.enum(STRUCTURES),
    cohesion: z.enum(COHESIONS),
    intent: z.string(),
    source: z.string().optional(),
    sample: z.boolean().default(false),
  }),
});

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/concepts' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    shortDefinition: z.string().max(240),
    icon: z.string().default('placeholder'),
    related: z.array(z.string()).default([]),
  }),
});

const SCRIPT_LIBRARIES = [
  'soliloquies',
  'scenes',
  'themes',
  'cuttings',
  'childrens-shakespeare',
] as const;

const scripts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/scripts' }),
  schema: z
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
    })
    .refine((s) => s.library !== 'themes' || !!s.theme, {
      message: "scripts entries with library === 'themes' must set a `theme`",
      path: ['theme'],
    }),
});

const askShakespeare = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ask-shakespeare' }),
  schema: z.object({
    columnNumber: z.number().int().positive(),
    title: z.string(),
    publishedIn: z.string(),
    asker: z.string().default('Reader'),
    excerpt: z.string().max(200),
    sample: z.boolean().default(false),
  }),
});

const colloquial = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/colloquial' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    translator: z.string(),
    /**
     * Bare filename only — e.g. "midsummah-pidgin-paka.mp4".
     * The AudioEmbed component prepends `/audio/`, and the Vitest
     * existence test looks for `public/audio/${audio}`.
     */
    audio: z.string().optional(),
    audioCaption: z.string().optional(),
    sourcePlay: z.string(),
    sample: z.boolean().default(false),
  }),
});

export const collections = { games, concepts, scripts, askShakespeare, colloquial };
```

- [ ] **Step 4: Create placeholder seed files**

Create `src/content/scripts/sample-soliloquy-hamlet.mdx`:

```mdx
---
title: 'To be, or not to be — soliloquy'
library: soliloquies
play: Hamlet
authors: []
minutes: 3
sample: true
---

## Production Notes

A single Player, bare stage. The famous soliloquy from Act III, scene i.
Sample entry — replace with real content from the Drive import.

## Script

To be, or not to be — that is the question…

## Facilitator Notes

Debrief prompts pending real content.
```

Create `src/content/scripts/sample-scene-macbeth.mdx`:

```mdx
---
title: 'Macbeth and Banquo meet the Witches'
library: scenes
play: Macbeth
authors: []
minutes: 6
characters:
  - { name: Macbeth }
  - { name: Banquo }
  - { name: First Witch }
  - { name: Second Witch }
  - { name: Third Witch }
sample: true
---

## Production Notes

Sample entry — replace with real content from the Drive import.

## Script

Placeholder script text.

## Facilitator Notes

Debrief prompts pending real content.
```

Create `src/content/scripts/sample-theme-battle-of-the-sexes.mdx`:

```mdx
---
title: 'Battle of the Sexes — sample montage'
library: themes
theme: 'Battle of the Sexes'
play: 'Various'
authors: []
minutes: 12
sample: true
---

## Production Notes

Sample entry — replace with real content from the Drive import.

## Script

Placeholder script text.

## Facilitator Notes

Debrief prompts pending real content.
```

Create `src/content/scripts/sample-cutting-romeo-juliet.mdx`:

```mdx
---
title: 'Romeo & Juliet — 40-minute cutting'
library: cuttings
play: 'Romeo and Juliet'
authors: []
minutes: 40
sample: true
---

## Production Notes

Sample entry — replace with real content from the Drive import.

## Script

Placeholder script text.

## Facilitator Notes

Debrief prompts pending real content.
```

Create `src/content/scripts/sample-childrens-shakespeare-midsummer.mdx`:

```mdx
---
title: 'A Midsummer Night''s Dream — sample for young players'
library: childrens-shakespeare
play: 'A Midsummer Night''s Dream'
authors: []
minutes: 20
sample: true
---

## Production Notes

Sample entry — replace with real content from the Drive import.

## Script

Placeholder script text.

## Facilitator Notes

Debrief prompts pending real content.
```

Create `src/content/ask-shakespeare/sample-column-one.mdx`:

```mdx
---
columnNumber: 1
title: 'Did you write the plays?'
publishedIn: '2024–25 newsletter'
asker: Reader
excerpt: 'Placeholder Q&A entry — real column arrives with the Drive import.'
sample: true
---

## The Question

Placeholder question text.

## Shakespeare Answers

Placeholder answer text.
```

Create `src/content/colloquial/sample-pidgin-midsummer.mdx`:

```mdx
---
title: "One Uddah Mid'summah"
subtitle: "Hawaiian Pidgin adaptation of A Midsummer Night's Dream"
translator: 'Jackie Pualani Johnson'
sourcePlay: "A Midsummer Night's Dream"
sample: true
---

## Act I, Scene i

<SideBySide>
  <Original>Now, fair Hippolyta, our nuptial hour</Original>
  <Colloquial>Eh, sweet Hippolyta, our wedding day</Colloquial>
</SideBySide>

_Sample entry — real Pidgin adaptation and audio file arrive with the Drive import._
```

- [ ] **Step 5: Run tests to verify they pass**

Run:
```bash
pnpm test tests/unit/shakespeare.test.ts
```

Expected: all tests pass (5 scripts entries covering all libraries, 1 ask-shakespeare, 1 colloquial with no audio — the colloquial-audio-existence test is a no-op for entries without `audio`).

- [ ] **Step 6: Run `pnpm check` and `pnpm build`**

Run:
```bash
pnpm check && pnpm build
```

Expected: 0 errors from check; build completes; `check:concepts` and `check:prohibited` both print `✓`. Content-collection schema validation is triggered during build.

- [ ] **Step 7: Commit**

```bash
git add src/content.config.ts src/content/scripts/ src/content/ask-shakespeare/ src/content/colloquial/ tests/unit/shakespeare.test.ts
git commit -m "$(cat <<'EOF'
feat(shakespeare): register scripts/askShakespeare/colloquial collections + placeholder seeds

Three new Zod-validated content collections seeded with one placeholder
per script library plus one ask-shakespeare column and one colloquial
pairing. Placeholders are flagged sample: true so templates render a
"pending final import" chip. Task 2 (Drive MCP import) may replace or
augment these; if that task is skipped, Cycle 3 still ships with the
structure intact.

Vitest suite exercises: at-least-one-entry-per-library invariant,
themes-requires-theme refine, columnNumber uniqueness, and audio-file
existence for any colloquial entry that references an audio file.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Drive MCP seed content import (conditional)

**Prerequisite:** the controller must ask the human partner for the Google Drive folder link before dispatching this task's implementer. If no link, skip this task entirely; log `Task 2: skipped (no Drive link) — real content deferred to a later import cycle` in the ledger and note in `project_dtfc_followups.md` at cycle end. Proceed to Task 3 with Task 1's placeholders in place.

**If the link is provided, this task runs with the link substituted into Step 2 below.**

**Files:**
- Replace / add: `src/content/scripts/*.mdx` (real cutting, scene, theme, soliloquy, children's-shakespeare entries pulled from Drive; keep sample-* files only if a library has no real content)
- Replace / add: `src/content/ask-shakespeare/*.mdx` (the 5 columns from 2024–25 newsletters per spec §4.3 item 6)
- Replace / add: `src/content/colloquial/*.mdx` (Pidgin Midsummer real content + Romeo & Juliet rap per spec §4.3 item 5)
- Create: `public/audio/midsummah-pidgin-paka.mp4` (source file `Midʻsummah-Pidgin-Paka.mp4` normalized to ASCII-only kebab-case)

**Interfaces produced:**
- Same collection interfaces as Task 1, populated with real content (`sample: false` for imported entries).
- Audio file present at the exact path referenced by the colloquial entry's `audio` frontmatter.

- [ ] **Step 1: Confirm the Drive folder link is available**

The controller has provided the Drive folder URL. If not, this task should not have been dispatched — reply `BLOCKED — no Drive folder link provided; controller should skip Task 2 per its dispatch contract`.

- [ ] **Step 2: Use the Google Drive MCP tools to enumerate the Shakespeare source folder**

The Drive MCP is available via `mcp__claude_ai_Google_Drive__*` tools. Enumerate the folder recursively to identify:
- Script docs (grouped by library subfolder if the client's structure mirrors Drive; otherwise infer from doc titles)
- Ask Shakespeare Q&A columns (5 expected per spec)
- Colloquial docs: "One Uddah Mid'summah" (Hawaiian Pidgin) + Romeo & Juliet rap
- The audio file `Midʻsummah-Pidgin-Paka.mp4`

Report the enumerated tree back briefly in your report so the controller can spot-check.

- [ ] **Step 3: Download the audio file, normalize the filename, save under `/public/audio/`**

Use `mcp__claude_ai_Google_Drive__download_file_content` (or the appropriate download tool for binary content) to fetch the mp4. Save as `/public/audio/midsummah-pidgin-paka.mp4` (ASCII-only kebab-case; the `ʻ` in the source name would break URL routing). Confirm the file exists and has non-zero size:

```bash
ls -la public/audio/
```

- [ ] **Step 4: Convert each Drive doc into MDX with the correct frontmatter shape**

For each Drive doc, use `mcp__claude_ai_Google_Drive__read_file_content` to pull the text, then write an MDX file to the appropriate collection directory. Filename slug = kebab-case of the Drive doc title. Frontmatter fields per Task 1's schema.

**Strip editorial comments** during conversion — the spec §6 explicitly notes source docs contain many editorial markers (`DESIRAE:`, `LOLA:`, `CHERIE NOTE:`, burgundy edits, `Pua Thoughts… for reference only`). Anything marked "for reference only" or "TO DO" is NOT publishable copy — omit those blocks. Preserve the actual copy verbatim.

**Body structure per collection:**
- `scripts`: three H2s (`## Production Notes`, `## Script`, `## Facilitator Notes`). If a source doc lacks a section, still create the H2 with a one-line placeholder note.
- `askShakespeare`: two H2s (`## The Question`, `## Shakespeare Answers`) — the source columns are typically formatted this way in the newsletters.
- `colloquial`: use the `<SideBySide><Original>…</Original><Colloquial>…</Colloquial></SideBySide>` pattern with H2s per act/scene. Each `<Original>` and each `<Colloquial>` should be one line of the original/adapted text so pairs are meaningful. For the Pidgin Midsummer entry, set the `audio` frontmatter to the BARE filename (e.g. `audio: midsummah-pidgin-paka.mp4` — no leading `/`, no `/audio/` prefix; the layout prepends both automatically).

For each real entry, set `sample: false`. Any placeholder from Task 1 whose library now has real content should be DELETED (do not keep sample stubs alongside real content in the same library).

- [ ] **Step 5: Run the shakespeare test suite**

Run:
```bash
pnpm test tests/unit/shakespeare.test.ts
```

Expected: all tests pass with real content. If a test fails, investigate frontmatter drift.

- [ ] **Step 6: Run `pnpm build` — expect clean**

Run:
```bash
pnpm build
```

Expected: 0 errors. Both prebuild guardrails (`check:concepts`, `check:prohibited`) pass. If `check:prohibited` flags anything, the source doc contained one of the forbidden phrases — remove that section (it was likely reference-only anyway).

- [ ] **Step 7: Commit**

```bash
git add src/content/scripts/ src/content/ask-shakespeare/ src/content/colloquial/ public/audio/
git commit -m "$(cat <<'EOF'
feat(shakespeare): import seed content from client Drive folder

Real content for scripts (soliloquies/scenes/themes/cuttings/childrens),
Ask Shakespeare columns 1–5, colloquial pairings (Pidgin Midsummer +
Romeo & Juliet rap), and the Pidgin Midsummer audio file (renamed to
midsummah-pidgin-paka.mp4 for URL safety).

Editorial markers (DESIRAE:, LOLA:, CHERIE NOTE:, "for reference only"
blocks) stripped per spec §6. Any Task 1 placeholder now covered by real
content was removed.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: `pairChildren` helper + tests

**Files:**
- Create: `src/lib/pair-children.ts`
- Create: `tests/unit/pair-children.test.ts`

**Interfaces produced:**
- `export function pairChildren<T>(items: T[]): T[][]` — groups consecutive items into pairs. `[a, b, c, d]` → `[[a, b], [c, d]]`. Odd count: trailing single wraps as `[[a, b], [c]]`. Empty input: `[]`.

Why extract to `src/lib/`: keeps the pairing logic testable in Vitest without needing an Astro renderer. Task 4's `SideBySideText.astro` calls `pairChildren` at render time.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/pair-children.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { pairChildren } from '@/lib/pair-children';

describe('pairChildren', () => {
  it('groups a four-item array into two pairs', () => {
    expect(pairChildren(['a', 'b', 'c', 'd'])).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('handles a single pair', () => {
    expect(pairChildren(['x', 'y'])).toEqual([['x', 'y']]);
  });

  it('handles an odd count with a trailing single', () => {
    expect(pairChildren(['a', 'b', 'c'])).toEqual([['a', 'b'], ['c']]);
  });

  it('handles a single trailing element only', () => {
    expect(pairChildren(['solo'])).toEqual([['solo']]);
  });

  it('returns an empty array for empty input', () => {
    expect(pairChildren([])).toEqual([]);
  });

  it('works with objects', () => {
    const items = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }];
    expect(pairChildren(items)).toEqual([
      [{ n: 1 }, { n: 2 }],
      [{ n: 3 }, { n: 4 }],
    ]);
  });
});
```

- [ ] **Step 2: Run the test — confirm it fails**

Run:
```bash
pnpm test tests/unit/pair-children.test.ts
```

Expected: FAIL — `@/lib/pair-children` module not found.

- [ ] **Step 3: Create `src/lib/pair-children.ts`**

```typescript
/**
 * Groups consecutive items into pairs. Trailing single item survives as a
 * one-element array. Used by SideBySideText to pair Original/Colloquial
 * children for the side-by-side layout.
 */
export function pairChildren<T>(items: T[]): T[][] {
  const pairs: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }
  return pairs;
}
```

- [ ] **Step 4: Run the test — confirm it passes**

Run:
```bash
pnpm test tests/unit/pair-children.test.ts
```

Expected: all 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/pair-children.ts tests/unit/pair-children.test.ts
git commit -m "$(cat <<'EOF'
feat(shakespeare): add pairChildren helper for side-by-side layout

Simple pair-grouping helper that will be consumed by SideBySideText
(Task 4). Extracted to src/lib/ so the pairing logic is Vitest-testable
in isolation from Astro's rendering.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: SideBySideText + Original + Colloquial components

**Files:**
- Create: `src/components/shakespeare/SideBySideText.astro`
- Create: `src/components/shakespeare/Original.astro`
- Create: `src/components/shakespeare/Colloquial.astro`

**Interfaces produced:**
- `<SideBySideText>` renders a `<dl class="grid gap-x-8 gap-y-4 md:grid-cols-2">` wrapper. Consumer places `<Original>` and `<Colloquial>` children inside; the layout preserves pairing in DOM order.
- `<Original>` renders `<dt class="font-display italic">` (the original Shakespeare line — serif, italic).
- `<Colloquial>` renders `<dd class="text-ink-700">` (the vernacular translation).

**Note on the pairing helper:** because Astro doesn't expose child-node introspection in a way that makes runtime `pairChildren()` calls ergonomic (unlike React), the semantic pairing is achieved by consumers alternating `<Original>` / `<Colloquial>` inside `<SideBySideText>`, and the CSS grid + DL pattern preserves the pairing visually and for screen readers. `pairChildren` remains available for any future use case that needs to group programmatically (e.g., a Preact island).

- [ ] **Step 1: Create `src/components/shakespeare/Original.astro`**

```astro
---
// Renders one Shakespeare-original line inside a <SideBySide> wrapper.
// Uses <dt> so the definition-list semantic pairing with <dd> (Colloquial) survives.
---
<dt class="font-display text-ink-900 text-base italic leading-relaxed md:text-lg">
  <slot />
</dt>
```

- [ ] **Step 2: Create `src/components/shakespeare/Colloquial.astro`**

```astro
---
// Renders one colloquial-adaptation line inside a <SideBySide> wrapper.
// Paired semantically with the preceding <Original> via the DL structure.
---
<dd class="text-ink-700 text-base leading-relaxed md:text-lg">
  <slot />
</dd>
```

- [ ] **Step 3: Create `src/components/shakespeare/SideBySideText.astro`**

```astro
---
// Wraps a sequence of alternating <Original> and <Colloquial> children in a
// definition list rendered as a two-column grid on desktop and stacked on
// mobile. Screen readers get the DL pairing regardless of viewport.
---
<dl class="grid gap-x-8 gap-y-3 md:grid-cols-2">
  <slot />
</dl>
```

- [ ] **Step 4: Verify type-check passes**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/shakespeare/SideBySideText.astro src/components/shakespeare/Original.astro src/components/shakespeare/Colloquial.astro
git commit -m "$(cat <<'EOF'
feat(shakespeare): add SideBySideText + Original + Colloquial components

Definition-list based side-by-side layout for colloquial pairings.
<dt>/<dd> semantic pairing survives the two-column CSS grid on desktop
and the stacked view on mobile — screen readers announce paired
original/colloquial in DOM order.

Original uses font-display italic (serif) to signal Shakespeare's own
words; Colloquial uses the body font for the vernacular gloss.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: AudioEmbed component

**Files:**
- Create: `src/components/media/AudioEmbed.astro`

**Interfaces produced:**
- `<AudioEmbed src="/audio/foo.mp4" type="audio/mp4" caption?="..." downloadable?={true} />` — renders a `<figure>` with native `<audio controls preload="metadata">`, optional `<figcaption>`, and (when `downloadable` is true) a download link.

Props:
- `src: string` — required, path under `/audio/`.
- `type?: string` — MIME type, defaults to `'audio/mp4'`.
- `caption?: string` — optional caption text.
- `downloadable?: boolean` — defaults `true`.

- [ ] **Step 1: Create `src/components/media/AudioEmbed.astro`**

```astro
---
interface Props {
  src: string;
  type?: string;
  caption?: string;
  downloadable?: boolean;
}
const { src, type = 'audio/mp4', caption, downloadable = true } = Astro.props;
---

<figure class="my-6">
  <audio controls preload="metadata" class="w-full">
    <source src={src} type={type} />
    Your browser does not support the audio element.
    <a href={src}>Download the audio file</a>.
  </audio>
  {
    (caption || downloadable) && (
      <figcaption class="text-ink-500 mt-2 text-sm">
        {caption}
        {caption && downloadable && ' · '}
        {downloadable && (
          <a href={src} download class="hover:text-clay-500 no-underline">
            Download →
          </a>
        )}
      </figcaption>
    )
  }
</figure>
```

- [ ] **Step 2: Verify type-check passes**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/media/AudioEmbed.astro
git commit -m "$(cat <<'EOF'
feat(media): add AudioEmbed with native controls + optional download link

Native <audio controls> wrapped in a <figure> with an optional caption
and download link. No autoplay; browser controls give the best keyboard
and screen-reader story. Reusable — first consumer is the colloquial
pairing detail page (Pidgin Midsummer audio).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: AskShakespeareForm + AskShakespeareCard components

**Files:**
- Create: `src/components/shakespeare/AskShakespeareForm.astro`
- Create: `src/components/shakespeare/AskShakespeareCard.astro`

**Interfaces produced:**
- `<AskShakespeareForm />` — renders a `<form>` with fields `name?` (text), `email?` (email), `question` (textarea, required). Inline `onsubmit` calls a `TODO(esp)` placeholder that `console.log`s the payload.
- `<AskShakespeareCard entry={entry} />` — archive list card. Renders column-number badge, title (linked to `/shakespeare/ask-shakespeare/[slug]/`), and excerpt.

**Note on the form submission handler:** matches the `NewsletterTile` pattern from Cycle 2. Cycle 6 replaces the placeholder with real ESP/forms wiring.

- [ ] **Step 1: Create `src/components/shakespeare/AskShakespeareForm.astro`**

```astro
---
// Ask Shakespeare submission form. Submit is stubbed to a placeholder
// handler (console.log with a TODO(esp) marker) matching the newsletter
// signup pattern. Cycle 6 wires this to the chosen form provider.
// TODO(esp): wire to real provider when the client picks one; see CLAUDE.md.
---

<form
  class="border-teal-600/25 bg-teal-600/5 rounded-[var(--radius-card)] border p-6"
  data-ask-shakespeare
  onsubmit="event.preventDefault(); console.log('[TODO(esp)] ask-shakespeare submit', Object.fromEntries(new FormData(event.target)));"
>
  <h2 class="font-display text-ink-900 text-xl">Submit a question</h2>
  <p class="text-ink-500 mt-1 text-sm">
    Ask "Shakespeare" a question about a line, a character, a choice, or your own moment of stage fright.
  </p>

  <div class="mt-4 grid gap-4 md:grid-cols-2">
    <label class="flex flex-col gap-1">
      <span class="text-ink-700 text-sm font-medium">Your name (optional)</span>
      <input
        type="text"
        name="name"
        autocomplete="name"
        class="border-ink-500/30 focus:border-teal-600 focus:ring-teal-600 rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
      />
    </label>
    <label class="flex flex-col gap-1">
      <span class="text-ink-700 text-sm font-medium">Email (optional)</span>
      <input
        type="email"
        name="email"
        autocomplete="email"
        class="border-ink-500/30 focus:border-teal-600 focus:ring-teal-600 rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
      />
    </label>
  </div>

  <label class="mt-4 flex flex-col gap-1">
    <span class="text-ink-700 text-sm font-medium">Your question</span>
    <textarea
      name="question"
      required
      rows="4"
      class="border-ink-500/30 focus:border-teal-600 focus:ring-teal-600 rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
    ></textarea>
  </label>

  <button
    type="submit"
    class="bg-clay-500 hover:bg-clay-700 text-ivory-50 focus-visible:ring-clay-500 mt-4 rounded px-4 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2"
  >
    Send to Shakespeare
  </button>
</form>
```

- [ ] **Step 2: Create `src/components/shakespeare/AskShakespeareCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'askShakespeare'>;
}
const { entry } = Astro.props;
const slug = entry.id.replace(/\.mdx?$/, '');
const href = `/shakespeare/ask-shakespeare/${slug}/`;
---

<article class="border-ivory-200 bg-ivory-50 hover:border-clay-500/60 rounded-[var(--radius-card)] border p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
  <div class="flex items-baseline gap-3">
    <span class="text-mustard-600 text-xs font-semibold tracking-widest uppercase">
      #{entry.data.columnNumber}
    </span>
    <span class="text-ink-500 text-xs">{entry.data.publishedIn}</span>
    {entry.data.sample && <span class="text-ink-500 text-xs italic">· sample</span>}
  </div>
  <h3 class="font-display text-ink-900 mt-2 text-xl">
    <a href={href} class="hover:text-clay-500 no-underline">
      {entry.data.title}
    </a>
  </h3>
  <p class="text-ink-700 mt-2 text-sm">{entry.data.excerpt}</p>
</article>
```

- [ ] **Step 3: Verify type-check passes**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/shakespeare/AskShakespeareForm.astro src/components/shakespeare/AskShakespeareCard.astro
git commit -m "$(cat <<'EOF'
feat(shakespeare): add AskShakespeareForm + AskShakespeareCard

Form matches the NewsletterTile TODO(esp) placeholder pattern —
submission is stubbed to console.log; Cycle 6 replaces the handler with
real form-provider wiring. Card is a simple archive-list tile with
column-number badge, published-in label, title link, and excerpt.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: ScriptCard + ScriptDetail components

**Files:**
- Create: `src/components/shakespeare/ScriptCard.astro`
- Create: `src/components/shakespeare/ScriptDetail.astro`

**Interfaces produced:**
- `<ScriptCard entry={entry} />` — library-index card: title (linked), play + minutes + character count metadata, optional theme chip.
- `<ScriptDetail entry={entry} />` — script detail page template: header (title, chips, characters, copyright), MDX body slot, print button, sample chip if `sample: true`. Takes both `entry` prop AND a slot for the rendered MDX Content component.

**Library display labels:**
```typescript
const LIBRARY_LABELS = {
  soliloquies: 'Soliloquies & Solo Speeches',
  scenes: 'Scenes',
  themes: 'Scenes Around a Theme',
  cuttings: 'Cuttings',
  'childrens-shakespeare': "Children's Shakespeare",
};
```

- [ ] **Step 1: Create `src/components/shakespeare/ScriptCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import Chip from '@/components/ui/Chip.astro';

interface Props {
  entry: CollectionEntry<'scripts'>;
}
const { entry } = Astro.props;
const slug = entry.id.replace(/\.mdx?$/, '');
const href = `/shakespeare/scripts/${slug}/`;
const characterCount = entry.data.characters.length;
---

<article class="border-ivory-200 bg-ivory-50 hover:border-clay-500/60 rounded-[var(--radius-card)] border p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
  <h3 class="font-display text-ink-900 text-xl">
    <a href={href} class="hover:text-clay-500 no-underline">
      {entry.data.title}
    </a>
  </h3>
  <p class="text-ink-500 mt-1 text-sm">From: {entry.data.play}</p>
  <div class="mt-3 flex flex-wrap items-center gap-2">
    {entry.data.minutes && <Chip tone="teal">{entry.data.minutes} min</Chip>}
    {characterCount > 0 && <Chip tone="mustard">{characterCount} character{characterCount === 1 ? '' : 's'}</Chip>}
    {entry.data.theme && <Chip tone="clay">{entry.data.theme}</Chip>}
    {entry.data.sample && <Chip tone="neutral">Sample — pending final import</Chip>}
  </div>
</article>
```

- [ ] **Step 2: Create `src/components/shakespeare/ScriptDetail.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import Chip from '@/components/ui/Chip.astro';

interface Props {
  entry: CollectionEntry<'scripts'>;
}
const { entry } = Astro.props;
const g = entry.data;

const LIBRARY_LABELS: Record<typeof g.library, string> = {
  soliloquies: 'Soliloquies & Solo Speeches',
  scenes: 'Scenes',
  themes: 'Scenes Around a Theme',
  cuttings: 'Cuttings',
  'childrens-shakespeare': "Children's Shakespeare",
};
const libraryHref = `/shakespeare/${g.library}/`;
---

<article class="mx-auto max-w-3xl">
  <p class="text-ink-500 text-sm">
    <a href="/shakespeare/">Shakespeare</a> ·
    <a href={libraryHref}>{LIBRARY_LABELS[g.library]}</a>
  </p>

  <div class="mt-4 flex flex-wrap items-center gap-2">
    <Chip tone="clay">{LIBRARY_LABELS[g.library]}</Chip>
    <Chip tone="teal">{g.play}</Chip>
    {g.minutes && <Chip tone="mustard">{g.minutes} min</Chip>}
    {g.theme && <Chip tone="clay">{g.theme}</Chip>}
    {g.sample && <Chip tone="neutral">Sample — pending final import</Chip>}
  </div>

  <h1 class="mt-3">{g.title}</h1>

  {
    g.authors.length > 0 && (
      <p class="text-ink-500 mt-2 text-sm">Adapters: {g.authors.join(', ')}</p>
    )
  }
  {g.copyright && <p class="text-ink-500 mt-1 text-sm">{g.copyright}</p>}

  {
    g.characters.length > 0 && (
      <section class="mt-6">
        <h2 class="text-lg">Characters</h2>
        <ul class="text-ink-700 mt-2 list-disc pl-6 text-sm">
          {g.characters.map((c) => (
            <li>
              <strong>{c.name}</strong>
              {c.description && <span> — {c.description}</span>}
            </li>
          ))}
        </ul>
      </section>
    )
  }

  {g.doubling && <p class="text-ink-700 mt-4 text-sm"><strong>Doubling:</strong> {g.doubling}</p>}
  {g.stagingNotes && <p class="text-ink-700 mt-2 text-sm"><strong>Staging:</strong> {g.stagingNotes}</p>}

  <div class="mt-4" data-print-hide>
    <button
      type="button"
      onclick="window.print()"
      class="border-ink-900 rounded border px-3 py-1.5 text-sm"
    >
      Print this script
    </button>
  </div>

  <div class="prose prose-neutral mt-8 max-w-none">
    <slot />
  </div>
</article>
```

- [ ] **Step 3: Verify type-check passes**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/shakespeare/ScriptCard.astro src/components/shakespeare/ScriptDetail.astro
git commit -m "$(cat <<'EOF'
feat(shakespeare): add ScriptCard + ScriptDetail templates

ScriptCard is a library-index tile with title link, play, minutes and
character-count chips, plus theme chip when the entry belongs to the
themes library and sample chip when sample: true.

ScriptDetail is the shared per-script template: header with library and
play chips, characters list, doubling/staging notes, print-this-script
button (respects the print stylesheet's [data-print-hide]), and the MDX
Content slot. All five library detail pages route through the same
template via /shakespeare/scripts/[slug]/.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: LibraryIndex shared template

**Files:**
- Create: `src/components/shakespeare/LibraryIndex.astro`

**Interfaces produced:**
- `<LibraryIndex library="scenes" title="Scenes" intro="..." />` — filters `getCollection('scripts')` by `library === props.library` and renders a grid of `ScriptCard`s. Shows an empty-state message if zero entries. Consumed by five library-index pages.

**Note:** the themes page has an additional chip-filter UI (Task 13) so it uses `LibraryIndex` PLUS its own chip-filter markup layered on top. The four other library pages just use `LibraryIndex` directly.

- [ ] **Step 1: Create `src/components/shakespeare/LibraryIndex.astro`**

```astro
---
import { getCollection } from 'astro:content';
import ScriptCard from './ScriptCard.astro';

interface Props {
  library: 'soliloquies' | 'scenes' | 'themes' | 'cuttings' | 'childrens-shakespeare';
  title: string;
  intro: string;
}
const { library, title, intro } = Astro.props;

const entries = (await getCollection('scripts'))
  .filter((e) => e.data.library === library)
  .sort((a, b) => a.data.title.localeCompare(b.data.title));
---

<section>
  <header class="max-w-2xl">
    <h2 class="font-display text-2xl">{title}</h2>
    <p class="text-ink-700 mt-2 text-sm leading-relaxed">{intro}</p>
    <p class="text-ink-500 mt-2 text-sm">
      <a href="/shakespeare/alternatives/">See how this library fits into Creating Fearless Shakespeare Scripts →</a>
    </p>
  </header>

  {
    entries.length === 0 ? (
      <p class="text-ink-500 mt-8 italic">
        This library is being populated — check back soon.
      </p>
    ) : (
      <ul class="mt-8 grid list-none gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <li>
            <ScriptCard entry={entry} />
          </li>
        ))}
      </ul>
    )
  }
</section>
```

- [ ] **Step 2: Verify type-check passes**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/shakespeare/LibraryIndex.astro
git commit -m "$(cat <<'EOF'
feat(shakespeare): add LibraryIndex shared template for library index pages

Takes library, title, intro props; filters the scripts collection by
library and renders a responsive grid of ScriptCards sorted
alphabetically. Renders an empty-state message when the library has zero
entries, so libraries that Task 2's Drive import didn't populate still
render coherently.

Also includes a "See how this fits into Creating Fearless Shakespeare
Scripts →" link back to /shakespeare/alternatives/.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Sub-nav data + ShakespeareLayout

**Files:**
- Create: `src/lib/shakespeare-nav.ts`
- Create: `src/layouts/ShakespeareLayout.astro`

**Interfaces produced:**
- `SHAKESPEARE_NAV: ShakespeareNavItem[]` — 9-item array of `{ key, label, href }` covering all `/shakespeare/*` sub-routes.
- `<ShakespeareLayout title description subPage?>` — wraps `SectionLayout` with a persistent sub-nav row rendered directly below the section h1. Passes `section="shakespeare"` through. The `subPage` prop (a `SHAKESPEARE_NAV[i].key` string) marks the current item.

- [ ] **Step 1: Create `src/lib/shakespeare-nav.ts`**

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

- [ ] **Step 2: Create `src/layouts/ShakespeareLayout.astro`**

```astro
---
import SectionLayout from './SectionLayout.astro';
import { SHAKESPEARE_NAV } from '@/lib/shakespeare-nav';

interface Props {
  title: string;
  description?: string;
  eyebrow?: string;
  subPage?: string;
}
const { title, description, eyebrow, subPage } = Astro.props;
---

<SectionLayout title={title} description={description} section="shakespeare" eyebrow={eyebrow}>
  <nav aria-label="Shakespeare section" class="border-ivory-200 mb-8 border-b pb-3">
    <ul class="flex flex-wrap gap-x-5 gap-y-2">
      {
        SHAKESPEARE_NAV.map((item) => (
          <li>
            <a
              href={item.href}
              class={`text-ink-700 hover:text-clay-500 inline-block py-1 text-sm no-underline ${
                subPage === item.key ? 'border-clay-500 text-ink-900 border-b-2 font-medium' : ''
              }`}
              aria-current={subPage === item.key ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))
      }
    </ul>
  </nav>

  <slot />
</SectionLayout>
```

- [ ] **Step 3: Verify type-check passes**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/shakespeare-nav.ts src/layouts/ShakespeareLayout.astro
git commit -m "$(cat <<'EOF'
feat(shakespeare): add SHAKESPEARE_NAV data + ShakespeareLayout wrapper

Nine sub-nav items backed by src/lib/shakespeare-nav.ts drive the
persistent sub-nav on every /shakespeare/* page. ShakespeareLayout wraps
the base SectionLayout, injecting the sub-nav below the section h1 and
before the page's slot content. The subPage prop marks the current item
with border-b-2 and aria-current="page".

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Landing page rewrite

**Files:**
- Modify: `src/pages/shakespeare/index.astro` (rewrite of Cycle 2 landing)

**What changes vs Cycle 2:**
- Wrap in `ShakespeareLayout` (which shows the sub-nav) — but do NOT mark any `subPage` since this is the landing itself.
- Keep `<ReflectivePrompt sectionKey="shakespeare" />`.
- Keep the three `<section id="…">` anchors from Cycle 2 (`#four-hundred-forty`, `#daniel-yang`, `#ask-shakespeare`) so `IDEA_TWO_ANSWERS` in `src/data/landing.ts` still resolves.
- Rewrite each of those three sections to be shorter and end with an outbound cross-link to the destination this cycle builds.
- Add the "Leave the Language as Shakespeare's Own" callout (spec §4.3 item 7).
- Add a directory grid of sub-sections.

- [ ] **Step 1: Rewrite `src/pages/shakespeare/index.astro`**

Replace the entire file contents with:

```astro
---
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
import ReflectivePrompt from '@/components/section/ReflectivePrompt.astro';

const directoryCards = [
  {
    label: 'Alternatives',
    href: '/shakespeare/alternatives/',
    description: 'Four fearless alternatives to staging a full play — the keystone essay.',
  },
  {
    label: 'Script Libraries',
    href: '/shakespeare/scenes/',
    description: 'Scenes, Themes, Cuttings, Soliloquies, and Children’s Shakespeare.',
  },
  {
    label: 'Colloquial',
    href: '/shakespeare/colloquial/',
    description: 'Side-by-side original and vernacular adaptations, with audio where available.',
  },
  {
    label: 'Ask Shakespeare',
    href: '/shakespeare/ask-shakespeare/',
    description: 'A Q&A column archive, plus a form for your own question.',
  },
  {
    label: 'Honoring Our Guides',
    href: '/shakespeare/honoring-our-guides/',
    description: 'CSF, CU, Daniel S.P. Yang, Joe Craft, Amanda Giguere.',
  },
];
---

<ShakespeareLayout
  title="Shakespeare"
  eyebrow="K through Adult"
  description="Scenes, monologues, themed montages, and 40-minute cuttings — for Players of any age, in Shakespeare’s own language."
>
  <ReflectivePrompt sectionKey="shakespeare" />

  {/* CLIENT REVIEW: "Leave the Language as Shakespeare's Own" callout drafted from spec §4.3 item 7. */}
  <aside class="border-clay-500/25 bg-clay-500/5 mt-8 rounded-[var(--radius-card)] border-l-4 p-5">
    <h2 class="font-display text-ink-900 text-xl">Leave the Language as Shakespeare&rsquo;s Own.</h2>
    <p class="text-ink-700 mt-2 max-w-prose text-base leading-relaxed">
      When Players of any age step into Shakespeare&rsquo;s words as written, they train ear, breath, and
      imagination together. DT:FC does not paraphrase or &ldquo;translate&rdquo; the original in performance
      &mdash; the language itself does the teaching. (For readers who want a bridge into the words,
      see our <a href="/shakespeare/colloquial/" class="hover:text-clay-500">Colloquial pairings</a>
      alongside the originals.)
    </p>
  </aside>

  <div class="mt-10 max-w-2xl space-y-6">
    {/* CLIENT REVIEW: Cycle 3 rewrites — each teaser now links to the destination built this cycle. */}
    <section id="four-hundred-forty">
      <h2>440+ years, and still on stage</h2>
      <p>
        Shakespeare left roughly 37 plays; every one of them is still being performed somewhere in
        the world, more than four centuries after they were written. The Alternatives essay lays out
        how DT:FC works with that living body of scripts.
        <a href="/shakespeare/alternatives/" class="hover:text-clay-500">Read Creating Fearless Shakespeare Scripts &rarr;</a>
      </p>
    </section>

    <section id="daniel-yang">
      <h2>Translating Shakespeare into Chinese</h2>
      <p>
        Daniel S.P. Yang has spent decades translating Shakespeare’s plays into Chinese. See our
        full acknowledgements of the guides whose work made DT:FC’s Shakespeare section possible.
        <a href="/shakespeare/honoring-our-guides/" class="hover:text-clay-500">See Honoring Our Guides &rarr;</a>
      </p>
    </section>

    <section id="ask-shakespeare">
      <h2>Ask Shakespeare</h2>
      <p>
        Players and audiences send questions to &ldquo;Shakespeare&rdquo; &mdash; about lines,
        characters, choices, or a moment of stage fright &mdash; and we publish the answers.
        <a href="/shakespeare/ask-shakespeare/" class="hover:text-clay-500">Browse the archive or submit a question &rarr;</a>
      </p>
    </section>
  </div>

  <section class="mt-14">
    <h2 class="font-display text-2xl">Explore the section</h2>
    <ul class="mt-6 grid list-none gap-4 md:grid-cols-2 lg:grid-cols-3">
      {
        directoryCards.map((card) => (
          <li>
            <a
              href={card.href}
              class="border-ivory-200 bg-ivory-50 hover:border-clay-500/60 block h-full rounded-[var(--radius-card)] border p-5 no-underline transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <h3 class="font-display text-ink-900 text-xl">{card.label}</h3>
              <p class="text-ink-700 mt-1 text-sm">{card.description}</p>
            </a>
          </li>
        ))
      }
    </ul>
  </section>
</ShakespeareLayout>
```

- [ ] **Step 2: Verify build passes**

Run:
```bash
pnpm build
```

Expected: succeeds. `check:prohibited` catches nothing. The `#four-hundred-forty`, `#daniel-yang`, `#ask-shakespeare` anchors remain present so `IDEA_TWO_ANSWERS` (in `src/data/landing.ts`) resolves.

- [ ] **Step 3: Verify the landing test in the smoke suite still passes**

Run:
```bash
pnpm test:e2e
```

Expected: the existing smoke test passes. The Shakespeare landing rewrite doesn't remove any previously-tested elements.

- [ ] **Step 4: Commit**

```bash
git add src/pages/shakespeare/index.astro
git commit -m "$(cat <<'EOF'
feat(shakespeare): rewrite landing with Leave-the-Language callout + cross-links

Landing now wraps in ShakespeareLayout (sub-nav renders). Adds the
"Leave the Language as Shakespeare's Own" callout per spec §4.3 item 7,
rewrites the three Cycle-2 teaser paragraphs to end with cross-links to
the destinations built this cycle (alternatives, honoring-our-guides,
ask-shakespeare), and adds a directory grid of sub-sections.

The three <section id="…"> anchors from Cycle 2 are preserved so
IDEA_TWO_ANSWERS in src/data/landing.ts continues to resolve.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Alternatives essay page

**Files:**
- Create: `src/pages/shakespeare/alternatives.astro`

**Content:** "Creating Fearless Shakespeare Scripts" essay. If Task 2 imported the source Drive doc `Creating Fearless Shakespeare Scripts / Using Shakespeare in the Schools`, the imported prose belongs here; otherwise use the drafted content below (flagged `CLIENT REVIEW`).

- [ ] **Step 1: Create `src/pages/shakespeare/alternatives.astro`**

```astro
---
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
---

<ShakespeareLayout
  title="Creating Fearless Shakespeare Scripts"
  subPage="alternatives"
  eyebrow="Alternatives to a full play"
  description="Four proven alternatives to staging a full Shakespeare play &mdash; the organizing logic behind DT:FC’s Shakespeare libraries."
>
  <div class="max-w-2xl space-y-8">
    {/* CLIENT REVIEW: introductory paragraph drafted; replace with imported content from Drive doc "Creating Fearless Shakespeare Scripts / Using Shakespeare in the Schools" when available. */}
    <p class="text-ink-700 text-lg leading-relaxed">
      Staging a full Shakespeare play with Players of any age is a large undertaking. DT:FC’s
      Shakespeare section is organized around four alternatives that are just as fearless and far
      more approachable: <strong>Scenes</strong>, <strong>Scenes Around a Theme</strong>,
      <strong>Cuttings</strong>, and <strong>New Plays with a Shakespeare Foundation</strong>.
    </p>

    <section>
      <h2>Scenes</h2>
      <p>
        Individual scenes drawn from across the canon. In CU’s &ldquo;Will Power&rdquo; model,
        different schools each learn one scene and assemble in spring for a shared performance.
        Ideal for classrooms that want depth on a short arc.
      </p>
      <p class="mt-2">
        <a href="/shakespeare/scenes/" class="hover:text-clay-500">Browse the Scenes library &rarr;</a>
      </p>
    </section>

    <section>
      <h2>Scenes Around a Theme</h2>
      <p>
        Themed montages that gather scenes across plays around a single question or figure. Themes
        we’ve worked with: Battle of the Sexes, Ruler and the Ruled, Rogues and Villains, Fools and
        Fooling, Magic and the Supernatural, The Generation Gap, Falstaff, Bullies.
      </p>
      <p class="mt-2">
        <a href="/shakespeare/themes/" class="hover:text-clay-500">Browse the Themes library &rarr;</a>
      </p>
    </section>

    <section>
      <h2>Cuttings</h2>
      <p>
        Full plays cut down to 40 minutes (or 20 for schools with tighter blocks) while keeping the
        story intact. Proven cuttings include Romeo &amp; Juliet, Lear, and A Midsummer Night’s
        Dream.
      </p>
      <p class="mt-2">
        <a href="/shakespeare/cuttings/" class="hover:text-clay-500">Browse the Cuttings library &rarr;</a>
      </p>
    </section>

    <section>
      <h2>New Plays with a Shakespeare Foundation</h2>
      <p>
        Original scripts written in a Shakespearean idiom or riffing on Shakespearean source
        material. Two examples: <em>The Ballad of Three Finger Dick</em> by Chuck Wilcox, and
        <em>Shakespeare’s Sister</em> by Marta Barnard. See the Cuttings library for now &mdash; a
        dedicated New Plays library is a possible follow-up.
      </p>
    </section>

    <p class="text-ink-500 border-ivory-200 mt-8 border-t pt-4 text-sm">
      Every alternative in this list is compatible with the pedagogical stance from the section
      landing: leave the language as Shakespeare’s own.
    </p>
  </div>
</ShakespeareLayout>
```

- [ ] **Step 2: Verify build**

Run:
```bash
pnpm build
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/pages/shakespeare/alternatives.astro
git commit -m "$(cat <<'EOF'
feat(shakespeare): add Alternatives essay page

Presents Creating Fearless Shakespeare Scripts with H2s for the four
alternatives (Scenes, Scenes Around a Theme, Cuttings, New Plays with a
Shakespeare Foundation). Each links to its library. New Plays is noted
as a possible follow-up library since the spec doesn't call it out
separately. Drafted copy flagged CLIENT REVIEW; if Task 2 imported the
source Drive doc, that content should replace the drafted paragraphs.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Four simple library pages (scenes, cuttings, soliloquies, childrens-shakespeare)

**Files:**
- Create: `src/pages/shakespeare/scenes.astro`
- Create: `src/pages/shakespeare/cuttings.astro`
- Create: `src/pages/shakespeare/soliloquies.astro`
- Create: `src/pages/shakespeare/childrens-shakespeare.astro`

All four pages use the same shape: `ShakespeareLayout` + `LibraryIndex`. The `childrens-shakespeare.astro` page adds a small cross-link callout to `/childrens-theatre/`.

- [ ] **Step 1: Create `src/pages/shakespeare/scenes.astro`**

```astro
---
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
import LibraryIndex from '@/components/shakespeare/LibraryIndex.astro';
---

<ShakespeareLayout
  title="Scenes"
  subPage="scenes"
  eyebrow="Script library"
  description="Individual scenes from across the canon &mdash; ideal for classroom projects."
>
  <LibraryIndex
    library="scenes"
    title="Scenes library"
    intro="Individual scenes drawn from across Shakespeare’s plays. Great for classroom groups working on one arc in depth."
  />
</ShakespeareLayout>
```

- [ ] **Step 2: Create `src/pages/shakespeare/cuttings.astro`**

```astro
---
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
import LibraryIndex from '@/components/shakespeare/LibraryIndex.astro';
---

<ShakespeareLayout
  title="Cuttings"
  subPage="cuttings"
  eyebrow="Script library"
  description="Full plays cut to 40 minutes (or 20) with the story intact."
>
  <LibraryIndex
    library="cuttings"
    title="Cuttings library"
    intro="Full-play cuttings that fit inside a class period or an evening — story intact. Proven cuttings so far: Romeo &amp; Juliet, Lear, A Midsummer Night’s Dream."
  />
</ShakespeareLayout>
```

- [ ] **Step 3: Create `src/pages/shakespeare/soliloquies.astro`**

```astro
---
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
import LibraryIndex from '@/components/shakespeare/LibraryIndex.astro';
---

<ShakespeareLayout
  title="Soliloquies & Solo Speeches"
  subPage="soliloquies"
  eyebrow="Script library"
  description="Single-Player speeches for audition preparation and individual work."
>
  <LibraryIndex
    library="soliloquies"
    title="Soliloquies &amp; Solo Speeches library"
    intro="Individual speeches from across the canon — for audition preparation, solo work, or focused study on a single voice."
  />
</ShakespeareLayout>
```

- [ ] **Step 4: Create `src/pages/shakespeare/childrens-shakespeare.astro`**

```astro
---
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
import LibraryIndex from '@/components/shakespeare/LibraryIndex.astro';
---

<ShakespeareLayout
  title="Children's Shakespeare"
  subPage="childrens-shakespeare"
  eyebrow="Script library"
  description="Shakespeare adaptations chosen and shaped for young Players."
>
  <LibraryIndex
    library="childrens-shakespeare"
    title="Children’s Shakespeare library"
    intro="Shakespeare adaptations chosen and shaped for young Players — short, punchy, imagination-forward."
  />

  <aside class="border-teal-600/25 bg-teal-600/5 mt-10 max-w-2xl rounded-[var(--radius-card)] border-l-4 p-4 md:p-5">
    <p class="text-ink-700 text-sm">
      For the full context of how DT:FC approaches Shakespeare with children, see our
      <a href="/childrens-theatre/" class="hover:text-clay-500">Children’s Theatre section</a>.
    </p>
  </aside>
</ShakespeareLayout>
```

- [ ] **Step 5: Verify build passes for all four routes**

Run:
```bash
pnpm build
```

Expected: `/shakespeare/scenes/`, `/shakespeare/cuttings/`, `/shakespeare/soliloquies/`, `/shakespeare/childrens-shakespeare/` all appear in the build output.

- [ ] **Step 6: Commit**

```bash
git add src/pages/shakespeare/scenes.astro src/pages/shakespeare/cuttings.astro src/pages/shakespeare/soliloquies.astro src/pages/shakespeare/childrens-shakespeare.astro
git commit -m "$(cat <<'EOF'
feat(shakespeare): add four simple library index pages

Scenes, Cuttings, Soliloquies, and Children's Shakespeare each render
via LibraryIndex filtered by their library key. Children's Shakespeare
adds a small cross-link callout to /childrens-theatre/ (currently a
stub — Cycle 4 rebuild makes the link bidirectional).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Themes page with chip filter

**Files:**
- Create: `src/pages/shakespeare/themes.astro`

**Behavior:** shows the 8 canonical themes from spec §4.3 as clickable chips above the library grid. Clicking a chip filters to that theme via URL query param (`?theme=falstaff`). URL-serialized filter state matches the Cycle 1 game-finder pattern; deep-linkable and browser-back/forward-safe. No Preact island — inline `<script>` handles chip toggling and reads/writes `history.replaceState`.

- [ ] **Step 1: Create `src/pages/shakespeare/themes.astro`**

```astro
---
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
import { getCollection } from 'astro:content';
import ScriptCard from '@/components/shakespeare/ScriptCard.astro';
import Chip from '@/components/ui/Chip.astro';

const themes = [
  'Battle of the Sexes',
  'Ruler and the Ruled',
  'Rogues and Villains',
  'Fools and Fooling',
  'Magic and the Supernatural',
  'The Generation Gap',
  'Falstaff',
  'Bullies',
];
const themeSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const entries = (await getCollection('scripts'))
  .filter((e) => e.data.library === 'themes')
  .sort((a, b) => a.data.title.localeCompare(b.data.title));
---

<ShakespeareLayout
  title="Scenes Around a Theme"
  subPage="themes"
  eyebrow="Script library"
  description="Themed montages that gather scenes across plays around a single question or figure."
>
  <section class="max-w-2xl">
    <h2 class="font-display text-2xl">Themed montages</h2>
    <p class="text-ink-700 mt-2 text-sm leading-relaxed">
      Scenes gathered from across the canon around a single question or figure. Filter by theme
      below — chips are deep-linkable.
    </p>
  </section>

  <div class="mt-6 flex flex-wrap gap-2" data-theme-chips>
    <button
      type="button"
      data-theme=""
      class="inline-flex items-center rounded-[var(--radius-chip)] px-3 py-0.5 text-xs font-medium bg-ivory-200 text-ink-700 aria-[pressed=true]:bg-clay-500 aria-[pressed=true]:text-ivory-50"
      aria-pressed="true"
    >
      All
    </button>
    {
      themes.map((theme) => (
        <button
          type="button"
          data-theme={themeSlug(theme)}
          data-theme-label={theme}
          class="inline-flex items-center rounded-[var(--radius-chip)] px-3 py-0.5 text-xs font-medium bg-mustard-200 text-ink-700 aria-[pressed=true]:bg-clay-500 aria-[pressed=true]:text-ivory-50"
          aria-pressed="false"
        >
          {theme}
        </button>
      ))
    }
  </div>

  {
    entries.length === 0 ? (
      <p class="text-ink-500 mt-8 italic">This library is being populated — check back soon.</p>
    ) : (
      <ul class="mt-8 grid list-none gap-4 md:grid-cols-2 lg:grid-cols-3" data-theme-grid>
        {entries.map((entry) => (
          <li data-entry-theme={entry.data.theme ? themeSlug(entry.data.theme) : ''}>
            <ScriptCard entry={entry} />
          </li>
        ))}
      </ul>
    )
  }
</ShakespeareLayout>

<script is:inline>
  (function initThemeFilter() {
    const chipContainer = document.querySelector('[data-theme-chips]');
    const grid = document.querySelector('[data-theme-grid]');
    if (!chipContainer || !grid) return;
    const chips = Array.from(chipContainer.querySelectorAll('button[data-theme]'));
    const items = Array.from(grid.querySelectorAll('li[data-entry-theme]'));

    const applyFilter = (selected) => {
      chips.forEach((c) => {
        c.setAttribute('aria-pressed', c.getAttribute('data-theme') === selected ? 'true' : 'false');
      });
      items.forEach((li) => {
        const t = li.getAttribute('data-entry-theme') || '';
        li.hidden = selected !== '' && t !== selected;
      });
    };

    const initial = new URLSearchParams(window.location.search).get('theme') || '';
    applyFilter(initial);

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const theme = chip.getAttribute('data-theme') || '';
        applyFilter(theme);
        const url = new URL(window.location.href);
        if (theme) url.searchParams.set('theme', theme);
        else url.searchParams.delete('theme');
        history.replaceState(null, '', url.toString());
      });
    });
  })();
</script>
```

- [ ] **Step 2: Verify build**

Run:
```bash
pnpm build
```

Expected: clean. `/shakespeare/themes/` in output.

- [ ] **Step 3: Commit**

```bash
git add src/pages/shakespeare/themes.astro
git commit -m "$(cat <<'EOF'
feat(shakespeare): add Themes library page with chip-based filter

Renders the 8 canonical themes from spec §4.3 as clickable chips above
the entries grid. Chips toggle URL query param (?theme=falstaff) via
history.replaceState; deep-linkable and browser back/forward-safe. Uses
inline <script> and the `hidden` attribute to hide non-matching cards —
no Preact island needed for this simple filter.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Honoring Our Guides page

**Files:**
- Create: `src/pages/shakespeare/honoring-our-guides.astro`

If Task 2 imported the source Drive doc "2 Honoring our Guides (Shakespeare)", the imported prose belongs here; otherwise use the drafted content below (flagged CLIENT REVIEW).

- [ ] **Step 1: Create `src/pages/shakespeare/honoring-our-guides.astro`**

```astro
---
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
---

<ShakespeareLayout
  title="Honoring Our Guides"
  subPage="honoring-our-guides"
  eyebrow="Shakespeare"
  description="Acknowledging the teachers, translators, and institutions whose work shapes DT:FC’s Shakespeare section."
>
  <div class="max-w-2xl space-y-8">
    {/* CLIENT REVIEW: drafted acknowledgements below; replace with content from Drive doc "2 Honoring our Guides (Shakespeare)" when Task 2 has run. */}
    <section>
      <h2>Colorado Shakespeare Festival</h2>
      <p>
        Long-standing partner in performance and pedagogy. CSF’s residencies and outreach shaped
        the way DT:FC brings Shakespeare into schools.
      </p>
    </section>

    <section>
      <h2>The University of Colorado</h2>
      <p>
        CU’s Theatre Department is the birthplace of the Colorado Caravan and the &ldquo;Will
        Power&rdquo; model for scene-based Shakespeare in schools.
      </p>
    </section>

    <section>
      <h2>Daniel S.P. Yang</h2>
      <p>
        Daniel S.P. Yang has spent decades translating Shakespeare’s plays into Chinese, opening
        new audiences on new continents and modeling how Shakespeare’s language keeps finding
        new life across cultures.
      </p>
    </section>

    <section>
      <h2>Joe Craft &amp; the Denver Public Schools Shakespeare Festival</h2>
      <p>
        Joe Craft’s work with Denver Public Schools has brought Shakespeare to thousands of young
        Players over decades. The DPS Shakespeare Festival is a model for how a school district can
        make the language its own.
      </p>
    </section>

    <section>
      <h2>Amanda Giguere</h2>
      <p>
        Educator and scholar whose work on Shakespeare in education continues to inform DT:FC’s
        approach.
      </p>
    </section>
  </div>
</ShakespeareLayout>
```

- [ ] **Step 2: Verify build**

Run:
```bash
pnpm build
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/pages/shakespeare/honoring-our-guides.astro
git commit -m "$(cat <<'EOF'
feat(shakespeare): add Honoring Our Guides page

Section-by-section acknowledgements of Colorado Shakespeare Festival,
University of Colorado, Daniel S.P. Yang, Joe Craft / Denver Public
Schools Shakespeare Festival, and Amanda Giguere. Drafted copy flagged
CLIENT REVIEW; if Task 2 imported the source Drive doc, replace the
drafts with that content.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Colloquial pages (index + slug)

**Files:**
- Create: `src/pages/shakespeare/colloquial/index.astro`
- Create: `src/pages/shakespeare/colloquial/[slug].astro`

- [ ] **Step 1: Create `src/pages/shakespeare/colloquial/index.astro`**

```astro
---
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
import { getCollection } from 'astro:content';

const entries = (await getCollection('colloquial')).sort((a, b) =>
  a.data.title.localeCompare(b.data.title),
);
---

<ShakespeareLayout
  title="Colloquial Shakespeare"
  subPage="colloquial"
  eyebrow="Shakespeare"
  description="Side-by-side original and vernacular adaptations — with audio where available."
>
  <div class="max-w-2xl">
    <p class="text-ink-700 text-base leading-relaxed">
      Each pairing places Shakespeare’s original language beside a colloquial version so readers can
      bridge from the vernacular into the original words. These are reading aids, not performance
      scripts — the section landing’s pedagogical stance holds: performance leaves the language
      as Shakespeare’s own.
    </p>
  </div>

  {
    entries.length === 0 ? (
      <p class="text-ink-500 mt-8 italic">No pairings available yet — check back soon.</p>
    ) : (
      <ul class="mt-8 grid list-none gap-4 md:grid-cols-2">
        {entries.map((entry) => {
          const slug = entry.id.replace(/\.mdx?$/, '');
          const href = `/shakespeare/colloquial/${slug}/`;
          return (
            <li>
              <article class="border-ivory-200 bg-ivory-50 hover:border-clay-500/60 h-full rounded-[var(--radius-card)] border p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                <h3 class="font-display text-ink-900 text-xl">
                  <a href={href} class="hover:text-clay-500 no-underline">
                    {entry.data.title}
                  </a>
                </h3>
                {entry.data.subtitle && (
                  <p class="text-ink-500 mt-1 text-sm">{entry.data.subtitle}</p>
                )}
                <p class="text-ink-700 mt-2 text-sm">
                  Translator: <strong>{entry.data.translator}</strong>
                  {entry.data.audio && <span class="ml-2">· audio available</span>}
                </p>
                {entry.data.sample && (
                  <p class="text-ink-500 mt-2 text-xs italic">Sample — pending final import</p>
                )}
              </article>
            </li>
          );
        })}
      </ul>
    )
  }
</ShakespeareLayout>
```

- [ ] **Step 2: Create `src/pages/shakespeare/colloquial/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
import SideBySideText from '@/components/shakespeare/SideBySideText.astro';
import Original from '@/components/shakespeare/Original.astro';
import Colloquial from '@/components/shakespeare/Colloquial.astro';
import AudioEmbed from '@/components/media/AudioEmbed.astro';

export async function getStaticPaths() {
  const entries = await getCollection('colloquial');
  return entries.map((entry) => ({
    params: { slug: entry.id.replace(/\.mdx?$/, '') },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<ShakespeareLayout
  title={entry.data.title}
  subPage="colloquial"
  eyebrow={entry.data.subtitle}
  description={`Colloquial pairing translated by ${entry.data.translator}.`}
>
  <div class="max-w-3xl">
    <p class="text-ink-500 text-sm">
      <a href="/shakespeare/colloquial/">All colloquial pairings</a>
    </p>

    <p class="text-ink-700 mt-4 text-base">
      Source play: <strong>{entry.data.sourcePlay}</strong>
      · Translator: <strong>{entry.data.translator}</strong>
      {entry.data.sample && <span class="text-ink-500 ml-2 italic">· sample — pending final import</span>}
    </p>

    {entry.data.audio && (
      <AudioEmbed src={`/audio/${entry.data.audio}`} caption={entry.data.audioCaption} />
    )}

    <div class="prose prose-neutral mt-6 max-w-none">
      <Content components={{ SideBySide: SideBySideText, Original, Colloquial }} />
    </div>
  </div>
</ShakespeareLayout>
```

- [ ] **Step 3: Verify build**

Run:
```bash
pnpm build
```

Expected: clean; `/shakespeare/colloquial/` and one `/shakespeare/colloquial/<slug>/` in output.

- [ ] **Step 4: Commit**

```bash
git add src/pages/shakespeare/colloquial/
git commit -m "$(cat <<'EOF'
feat(shakespeare): add colloquial pairing index + detail pages

Index lists all colloquial entries with translator + audio-available
badge; detail page renders <SideBySide>/<Original>/<Colloquial> from
MDX with an optional AudioEmbed above the paired text.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: Ask Shakespeare pages (index + slug)

**Files:**
- Create: `src/pages/shakespeare/ask-shakespeare/index.astro`
- Create: `src/pages/shakespeare/ask-shakespeare/[slug].astro`

- [ ] **Step 1: Create `src/pages/shakespeare/ask-shakespeare/index.astro`**

```astro
---
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
import { getCollection } from 'astro:content';
import AskShakespeareCard from '@/components/shakespeare/AskShakespeareCard.astro';
import AskShakespeareForm from '@/components/shakespeare/AskShakespeareForm.astro';

const entries = (await getCollection('askShakespeare')).sort(
  (a, b) => b.data.columnNumber - a.data.columnNumber,
);
---

<ShakespeareLayout
  title="Ask Shakespeare"
  subPage="ask-shakespeare"
  eyebrow="Q&amp;A archive"
  description="Shakespeare, in first person, responds to reader questions from our newsletters. Have your own? Submit below."
>
  <section class="max-w-2xl">
    <h2 class="font-display text-2xl">The archive</h2>
    <p class="text-ink-700 mt-2 text-sm leading-relaxed">
      Every column pairs a reader question with Shakespeare’s first-person response, drawn from
      DT:FC newsletters.
    </p>
  </section>

  {
    entries.length === 0 ? (
      <p class="text-ink-500 mt-8 italic">No columns published yet.</p>
    ) : (
      <ul class="mt-8 grid list-none gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <li>
            <AskShakespeareCard entry={entry} />
          </li>
        ))}
      </ul>
    )
  }

  <section class="mt-14 max-w-2xl">
    <AskShakespeareForm />
  </section>
</ShakespeareLayout>
```

- [ ] **Step 2: Create `src/pages/shakespeare/ask-shakespeare/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('askShakespeare');
  return entries.map((entry) => ({
    params: { slug: entry.id.replace(/\.mdx?$/, '') },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<ShakespeareLayout
  title={entry.data.title}
  subPage="ask-shakespeare"
  eyebrow={`Ask Shakespeare #${entry.data.columnNumber}`}
  description={entry.data.excerpt}
>
  <div class="max-w-2xl">
    <p class="text-ink-500 text-sm">
      <a href="/shakespeare/ask-shakespeare/">All columns</a>
      · {entry.data.publishedIn}
      {entry.data.asker !== 'Reader' && <span> · from {entry.data.asker}</span>}
      {entry.data.sample && <span class="ml-1 italic">· sample — pending final import</span>}
    </p>

    <div class="prose prose-neutral mt-6 max-w-none">
      <Content />
    </div>
  </div>
</ShakespeareLayout>
```

- [ ] **Step 3: Verify build**

Run:
```bash
pnpm build
```

Expected: clean; `/shakespeare/ask-shakespeare/` and one `/shakespeare/ask-shakespeare/<slug>/` in output.

- [ ] **Step 4: Commit**

```bash
git add src/pages/shakespeare/ask-shakespeare/
git commit -m "$(cat <<'EOF'
feat(shakespeare): add Ask Shakespeare archive + column detail pages

Archive lists columns sorted by column number descending (most recent
first) plus the AskShakespeareForm below the list. Detail page renders
the MDX body verbatim with a compact eyebrow line ("Ask Shakespeare
#N"). Both routes derive from the askShakespeare collection.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: Script detail dynamic route

**Files:**
- Create: `src/pages/shakespeare/scripts/[slug].astro`

**Note:** all five libraries share this one dynamic route. `ScriptDetail` (Task 7) handles the template; this page just wires `getStaticPaths` + Content rendering.

- [ ] **Step 1: Create `src/pages/shakespeare/scripts/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
import ScriptDetail from '@/components/shakespeare/ScriptDetail.astro';

export async function getStaticPaths() {
  const entries = await getCollection('scripts');
  return entries.map((entry) => ({
    params: { slug: entry.id.replace(/\.mdx?$/, '') },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<ShakespeareLayout
  title={entry.data.title}
  subPage={entry.data.library}
  eyebrow={`${entry.data.play}`}
  description={entry.data.title}
>
  <ScriptDetail entry={entry}>
    <Content />
  </ScriptDetail>
</ShakespeareLayout>
```

- [ ] **Step 2: Verify build**

Run:
```bash
pnpm build
```

Expected: clean; one page per `scripts` collection entry appears in the output at `/shakespeare/scripts/<slug>/`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/shakespeare/scripts/
git commit -m "$(cat <<'EOF'
feat(shakespeare): add /shakespeare/scripts/[slug]/ dynamic route

Single dynamic route for all five script libraries — the entry's library
field drives the sub-nav highlight via subPage. Renders ScriptDetail
with the MDX Content component slotted into the prose region.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 18: Extend Playwright smoke test

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Read the current smoke test**

Run:
```bash
cat tests/e2e/smoke.spec.ts
```

Note the current end of the test (after the RESILIENCE / Legacy reflective-prompt assertions).

- [ ] **Step 2: Add Shakespeare assertions**

Insert a new block after the Legacy reflective-prompt block and before the "No unexpected console errors" section. Use the following code:

```typescript
  // Shakespeare section — landing, sub-nav, one library, one script, colloquial, ask
  await page.goto('/shakespeare/');
  await expect(page.getByRole('heading', { level: 1, name: 'Shakespeare' })).toBeVisible();
  const subNav = page.getByRole('navigation', { name: 'Shakespeare section' });
  await expect(subNav).toBeVisible();
  await expect(subNav.getByRole('link', { name: 'Alternatives' })).toBeVisible();

  // Follow a directory-grid link into the Scenes library
  await page.getByRole('link', { name: 'Script Libraries' }).click();
  await expect(page).toHaveURL(/\/shakespeare\/scenes\/?/);
  await expect(page.getByRole('heading', { level: 2, name: /Scenes library/i })).toBeVisible();

  // Follow into an individual script (any card that exists — the first one)
  const firstScriptLink = page.locator('article a').first();
  await firstScriptLink.click();
  await expect(page).toHaveURL(/\/shakespeare\/scripts\/[^/]+\/?/);
  await expect(page.getByRole('button', { name: /Print this script/i })).toBeVisible();

  // Colloquial index → detail
  await page.goto('/shakespeare/colloquial/');
  await expect(page.getByRole('heading', { level: 1, name: 'Colloquial Shakespeare' })).toBeVisible();
  const firstColloquial = page.locator('article a').first();
  await firstColloquial.click();
  await expect(page).toHaveURL(/\/shakespeare\/colloquial\/[^/]+\/?/);

  // Ask Shakespeare index has the form
  await page.goto('/shakespeare/ask-shakespeare/');
  await expect(page.getByRole('heading', { level: 1, name: 'Ask Shakespeare' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /Your question/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Send to Shakespeare/i })).toBeVisible();
```

- [ ] **Step 3: Run the smoke test**

Run:
```bash
pnpm test:e2e
```

Expected: PASS. If the "First script link" assertion fails, the seed content may not have populated any library — check `src/content/scripts/` has entries.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "$(cat <<'EOF'
test(e2e): extend smoke test for Shakespeare section

Adds assertions for the /shakespeare/ landing (h1, sub-nav visible),
navigation into a library index, into an individual script (print
button present), colloquial index → detail, and Ask Shakespeare index
with form fields visible.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 19: Update CLAUDE.md + auto-memory + follow-ups

**Files:**
- Modify: `CLAUDE.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_followups.md`

- [ ] **Step 1: Update `CLAUDE.md`**

Additions:

Under **Stack**, append:
```
- MDX-with-components pattern is used for Colloquial pairings — `<SideBySide>` / `<Original>` / `<Colloquial>` (see `src/components/shakespeare/`).
```

Under **Key conventions**, add three new paragraphs:

```markdown
**Shakespeare content collections.** Three collections live under `src/content/`:
- `scripts/` — one file per script, `library` frontmatter is one of
  `soliloquies | scenes | themes | cuttings | childrens-shakespeare`. `theme` is
  required when `library === 'themes'`. Body H2s: `## Production Notes`,
  `## Script`, `## Facilitator Notes`.
- `ask-shakespeare/` — one file per Q&A column, unique `columnNumber`, body
  H2s: `## The Question`, `## Shakespeare Answers`.
- `colloquial/` — one file per side-by-side pairing, body uses
  `<SideBySide><Original>…</Original><Colloquial>…</Colloquial></SideBySide>`.

**Audio files** live at `/public/audio/` with ASCII-only kebab-case filenames
(e.g. `midsummah-pidgin-paka.mp4`).

**Shakespeare sub-nav** (`src/lib/shakespeare-nav.ts`) drives the persistent
sub-nav rendered by `src/layouts/ShakespeareLayout.astro` on every
`/shakespeare/*` page. Add a new sub-page → append to `SHAKESPEARE_NAV` and
create the route.
```

Under **Adding a script**, add:
```markdown
**Adding a Shakespeare script.** Drop `src/content/scripts/<slug>.mdx` with
`library` set to one of the five values. Themes entries must also set `theme`.
Body sections `## Production Notes` / `## Script` / `## Facilitator Notes`.
```

Under **Adding a game** (existing), add nearby:
```markdown
**Adding an Ask Shakespeare column.** Drop `src/content/ask-shakespeare/<slug>.mdx`
with a unique `columnNumber` and an `excerpt` ≤ 200 chars. Body sections
`## The Question` / `## Shakespeare Answers`.

**Adding a Colloquial pairing.** Drop `src/content/colloquial/<slug>.mdx`. If
audio is provided, place the file at `/public/audio/<filename>.mp4` and set
`audio: <filename>.mp4` in frontmatter (bare filename — the AudioEmbed
component and the Vitest existence test both prepend `/audio/`). Body uses
`<SideBySide>` blocks with alternating `<Original>` / `<Colloquial>` children.
```

Under **Deferred / TODO markers**, add:
```markdown
- `TODO(esp)` in `src/components/shakespeare/AskShakespeareForm.astro` — inherits the same ESP TODO as `NewsletterTile` and the footer signup.
```

- [ ] **Step 2: Update `project_dtfc_cycles.md`**

Read the current file at `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md`. Add a Cycle 3 entry after the Cycle 2 line, in the same style:

```markdown
Cycle 3 shipped 2026-08-11 (Shakespeare section: 9 sub-routes, three new content collections — `scripts`, `askShakespeare`, `colloquial` — the site's first audio embed, colloquial side-by-side layout, Ask Shakespeare archive with a TODO(esp)-stubbed submission form, and Honoring Our Guides).
```

Update the roadmap list to move Cycle 3 out of "remaining" and re-number the survivors:
- Cycle 4 — Children's Theatre (script pages, print emphasis, Wayfarer's Journey SVG)
- Cycle 5 — Legacy (founders, essays, interactive Timeline)
- Cycle 6 — Community + forms + newsletter ESP wiring (also wires Ask Shakespeare form)
- Cycle 7 — Cross-site search (Pagefind) + analytics + launch checklist
- Cycle N — Web 2.0 items (deferred per source spec §5)

- [ ] **Step 3: Append to `project_dtfc_followups.md`**

Add a new block at the bottom of the file:

```markdown
**Cycle 3 (2026-08-11) added follow-ups:**
- Ask Shakespeare submission form still stubs to `TODO(esp)` — Cycle 6 wires it to the chosen form provider. Destination email is a client-decision blocker for Cycle 6.
- "New Plays with a Shakespeare Foundation" library is a possible additional `scripts.library` enum value — Alternatives page currently mentions Three Finger Dick and Shakespeare's Sister in prose but no dedicated library exists.
- Colloquial licensing / copyright per-pairing — currently only `translator` is captured; a formal copyright line may be required (client decision).
- Audio caption for Pidgin Midsummer — drafted "Read aloud by Paka Johnson" needs client confirmation.
- Children's Shakespeare cross-link to `/childrens-theatre/` becomes bidirectional in Cycle 4.
- If Task 2 (Drive import) was skipped, Cycle 3 shipped with placeholder stubs — schedule the real import as an immediate follow-up.
- Any CLIENT REVIEW markers in the shipped `/shakespeare/*` pages (landing "Leave the Language" callout, Alternatives essay intro, Honoring Our Guides — plus any drafted paragraphs the Drive import didn't replace) need Lola/Laurie review.
```

- [ ] **Step 4: Commit CLAUDE.md**

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs: update CLAUDE.md for Cycle 3 Shakespeare section

Documents the three new content collections (scripts, askShakespeare,
colloquial), the audio-files convention (/public/audio/, ASCII-only
kebab-case), the SHAKESPEARE_NAV sub-nav + ShakespeareLayout wrapper,
the MDX-with-components pattern for colloquial pairings, and the
AskShakespeareForm TODO(esp) marker.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Memory files live outside the repo — no git for them.

---

## Final Verification (not a separate commit — the executing session runs these)

After Task 19, before offering to merge to `main`, run:

- `pnpm check` — 0 errors.
- `pnpm build` — succeeds; `check:concepts` and `check:prohibited` both print `✓`. 31+ pages built (adds ~13 new routes above Cycle 2's count).
- `pnpm test` — all Vitest suites green (existing + `shakespeare.test.ts` + `pair-children.test.ts`).
- `pnpm test:e2e` — Playwright smoke test green.
- Manual pass in `pnpm dev`:
  - `/shakespeare/` — landing renders with sub-nav, Leave-the-Language callout, three teaser sections with cross-links, directory grid.
  - `/shakespeare/scenes/` (and other library pages) — sub-nav marks current, cards render or empty-state shows.
  - `/shakespeare/scripts/<any slug>/` — script detail with chips + print button.
  - `/shakespeare/themes/?theme=falstaff` — chip filter selects on load; toggling updates URL; back button restores previous filter.
  - `/shakespeare/colloquial/<pidgin slug>/` — audio player renders and plays; side-by-side text pairs correctly.
  - `/shakespeare/ask-shakespeare/` — cards render; form present; submitting logs to console.

When all clean, offer the user the merge:
```bash
git checkout main && git merge --no-ff cycle-3-shakespeare -m "Merge cycle-3-shakespeare (Shakespeare section deep-build per spec §4.3)"
```

---
