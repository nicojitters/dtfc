# DT:FC Cycle 4 — Children's Theatre Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the DT:FC Children's Theatre section per source spec §4.4 — landing rebuild, "Why These Plays Work" manifesto, Honoring Our Guides, 4 how-to guides (including the Wayfarer's Journey Wheel SVG), two script libraries (`childrens-plays`, `teaching-modules`), and a Shakespeare-for-Children cross-link wrapper page. Extends the existing `scripts` collection from Cycle 3 with two new library enum values and six optional Children's-Theatre-scoped frontmatter fields. Refactors `ScriptCard` / `ScriptDetail` / `LibraryIndex` from `src/components/shakespeare/` to `src/components/scripts/` so they serve both sections cleanly. Introduces the site's first content imagery.

**Architecture:** Content model is a shared `scripts` collection with a `library` enum discriminating sections; a new `scriptHref` helper routes every entry to its section-owned detail URL. Two script components (`ScriptCard`, `ScriptDetail`) plus one library-index template (`LibraryIndex`) move to `src/components/scripts/` and serve both sections. Children's-Theatre-specific components (`WayfarersJourneyWheel`, `HowToGuide`, `PlayImagery`) live under `src/components/childrens/`. Layout wrapper `ChildrensLayout` mirrors Cycle 3's `ShakespeareLayout`. Seed content pulled from client's Google Drive via MCP at implementation time; placeholder stubs otherwise.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@theme` tokens), TypeScript strict, Zod (via `astro/zod` re-export), MDX for script bodies, native SVG for the Wayfarer's Journey Wheel (no islands), Vitest for unit tests, Playwright for e2e smoke test.

## Global Constraints

- **Branch:** all work happens on `cycle-4-childrens-theatre`. Merge to `main` at cycle end uses `git merge --no-ff`.
- **Package manager:** `pnpm` only. Commands: `pnpm dev`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm check:concepts`, `pnpm check:prohibited`.
- **Node module type:** `"type": "module"` — ESM everywhere.
- **No hex codes in components** — colors come from tokens in `src/styles/tokens.css` (defined palette: clay, teal, mustard, ivory, ink).
- **Vocabulary:** "Players" (never "actors"), "Facilitator" (never "leader"), "Players Resource Center" (full name), "Children's Theatre" (curly apostrophe throughout).
- **CURLY APOSTROPHES IN ALL PROSE** — every possessive and contraction in visible prose uses **U+2019** (`'`), not straight U+0027 (`'`). This includes: frontmatter prose fields (`title`, `description`, `intro`, `subtitle`), body text, prop values on `<Component prop="...">`, JSX prose. JS syntax (imports, `getCollection('...')` calls, object keys) is exempt. **Cycle 3 required 6 apostrophe fix-rounds — do NOT repeat.** Every implementer dispatch prompt in this plan explicitly restates this constraint; every task that writes prose ends with a `grep`-verify step before the commit.
- **Prohibited landing/site copy:** "Great Change", "traditional work and ways", "THIS (crazy) time", `RESILIENCEl` (typo), wrong-apostrophe "Childrens' Theatre". Enforced by `scripts/check-prohibited-text.mjs` in prebuild.
- **`<Concept id="…" />` references** must resolve via `check-concept-refs.mjs`.
- **CLIENT REVIEW markers:** any drafted prose not verbatim from Drive source docs gets `{/* CLIENT REVIEW: reason */}` in `.astro` or `<!-- CLIENT REVIEW: reason -->` in `.mdx` above the drafted block.
- **Sample-content flag:** any content that isn't real client-authored copy gets `sample: true` in its frontmatter. Templates render a "Sample — pending final import" chip.
- **Commit granularity:** one commit per task (each task's final step). HEREDOC message with `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`.
- **Section identity:** every `/childrens-theatre/*` page uses `<ChildrensLayout>` (Task 11) which passes `section="childrens-theatre"` to the base primary nav.
- **File naming for imagery:** ASCII kebab-case. Files land at `/public/images/childrens-theatre/<slug>/<filename>.<ext>`. Frontmatter `imagery[i].src` is the full path starting with `/images/`.
- **Landing-page anchors:** the two Cycle 2 anchors `#imagination` and `#every-person` on `/childrens-theatre/` MUST be preserved (Cycle 2's `IDEA_TWO_ANSWERS` in `src/data/landing.ts` references them).

---

## File Map

**Delete (Task 1):**
- `src/lib/pair-children.ts`
- `tests/unit/pair-children.test.ts`

**Move (Task 2):**
- `src/components/shakespeare/ScriptCard.astro` → `src/components/scripts/ScriptCard.astro`
- `src/components/shakespeare/ScriptDetail.astro` → `src/components/scripts/ScriptDetail.astro`
- `src/components/shakespeare/LibraryIndex.astro` → `src/components/scripts/LibraryIndex.astro`

**Create:**
- `src/lib/childrens-nav.ts`
- `src/lib/script-href.ts`
- `src/components/childrens/WayfarersJourneyWheel.astro`
- `src/components/childrens/HowToGuide.astro`
- `src/components/childrens/PlayImagery.astro`
- `src/layouts/ChildrensLayout.astro`
- `src/content/scripts/*.mdx` (placeholders for `childrens-plays` + `teaching-modules`; augmented by Drive import if available)
- `public/images/childrens-theatre/` (directory; populated by Drive import if available)
- `src/pages/childrens-theatre/why-these-plays-work.astro`
- `src/pages/childrens-theatre/honoring-our-guides.astro`
- `src/pages/childrens-theatre/plays.astro`
- `src/pages/childrens-theatre/teaching-modules.astro`
- `src/pages/childrens-theatre/shakespeare-for-children.astro`
- `src/pages/childrens-theatre/how-to/create-a-script.astro`
- `src/pages/childrens-theatre/how-to/golden-goose.astro`
- `src/pages/childrens-theatre/how-to/key-elements.astro`
- `src/pages/childrens-theatre/how-to/archetype-of-one-story.astro`
- `src/pages/childrens-theatre/scripts/[slug].astro`
- `tests/unit/script-href.test.ts`

**Modify:**
- `src/lib/content-schemas.ts` — extend `SCRIPT_LIBRARIES` and `scriptsSchema`.
- `src/components/scripts/ScriptCard.astro` (post-move) — series chip + `scriptHref` usage.
- `src/components/scripts/ScriptDetail.astro` (post-move) — 5 new optional sections.
- `src/pages/shakespeare/scripts/[slug].astro` — update import path for `ScriptDetail`.
- `src/pages/shakespeare/scenes.astro`, `cuttings.astro`, `soliloquies.astro`, `childrens-shakespeare.astro` — update import paths for `LibraryIndex`.
- `src/pages/shakespeare/themes.astro` — update import path for `ScriptCard`.
- `src/pages/childrens-theatre/index.astro` — full rewrite.
- `src/styles/print.css` — one `@media print` rule for imagery grid single-column.
- `tests/unit/shakespeare.test.ts` — extend for new libraries + optional fields + imagery-file existence.
- `tests/e2e/smoke.spec.ts` — extend for Children's Theatre routes.
- `CLAUDE.md` — schema updates, new components, new dirs, imagery convention, `scriptHref` guidance, `pairChildren` removal note.

**Auto-memory updates (end of cycle):** `project_dtfc_cycles.md`, `project_dtfc_followups.md`.

---

## Special Task: Drive Import Coordination

**Task 4 (Drive MCP import) requires the client's Google Drive folder link.** Before dispatching Task 4's implementer, the controller must ask the human partner:

> "Do you have the Google Drive folder link for the Children's Theatre source content (Water of Life, One Seed Child, The Treasure Inside, Conquering the Sun, Aesop's Fables, Teaching Modules, plus the how-to guides and Why These Plays Work manifesto)? Paste it and I'll pull the real content. Otherwise I'll skip the import and Cycle 4 ships with placeholder stubs — real content lands in a follow-up cycle."

If the user provides the link, Task 4 proceeds with the link substituted. If not, Task 4 is skipped (mark deferred in the ledger, add follow-up note, proceed to Task 5). All downstream tasks work with either real content or placeholders — the templates render whatever entries exist and show empty-state text where a library has zero entries.

---

## Task 1: Delete `pairChildren` helper + tests (housekeeping)

**Files:**
- Delete: `src/lib/pair-children.ts`
- Delete: `tests/unit/pair-children.test.ts`

**Interfaces produced:** none. The helper was written in Cycle 3 but never imported by `src/components/shakespeare/SideBySideText.astro`; the colloquial pairing works via CSS grid auto-flow. Cycle 3's final whole-branch review flagged the orphan for Cycle 4 cleanup.

**Verification:** no source file imports `pair-children`. `SideBySideText.astro` composes children directly and doesn't call `pairChildren`.

- [ ] **Step 1: Confirm no consumers exist**

Run:
```bash
grep -rn "pair-children\|pairChildren" src/ tests/
```

Expected: only `src/lib/pair-children.ts` (the definition) and `tests/unit/pair-children.test.ts` (its tests) show up — no other file references either symbol. If ANYTHING else appears in the output, STOP and report BLOCKED with the file path; the plan assumption is that the helper is unused.

- [ ] **Step 2: Delete both files**

Run:
```bash
rm src/lib/pair-children.ts tests/unit/pair-children.test.ts
```

- [ ] **Step 3: Run the full Vitest suite — expect count to decrease by 6**

Run:
```bash
pnpm test
```

Expected: PASS. Total test count decreases by 6 (was 58 at Cycle 3 close, becomes 52).

- [ ] **Step 4: Run `pnpm build` — expect clean**

Run:
```bash
pnpm build
```

Expected: build succeeds. `check:concepts` and `check:prohibited` both print `✓`. Page count unchanged.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: remove unused pairChildren helper + tests

The helper was written in Cycle 3 to support SideBySideText composition
but never actually imported — the component uses CSS grid auto-flow
directly. Cycle 3's final whole-branch review flagged the orphan for
Cycle 4 cleanup.

Vitest count decreases by 6.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Move `ScriptCard` / `ScriptDetail` / `LibraryIndex` from `shakespeare/` to `scripts/`

**Files:**
- Move: `src/components/shakespeare/ScriptCard.astro` → `src/components/scripts/ScriptCard.astro`
- Move: `src/components/shakespeare/ScriptDetail.astro` → `src/components/scripts/ScriptDetail.astro`
- Move: `src/components/shakespeare/LibraryIndex.astro` → `src/components/scripts/LibraryIndex.astro`
- Modify: `src/pages/shakespeare/scripts/[slug].astro` (update `ScriptDetail` import path)
- Modify: `src/pages/shakespeare/scenes.astro` (update `LibraryIndex` import path)
- Modify: `src/pages/shakespeare/cuttings.astro` (update `LibraryIndex` import path)
- Modify: `src/pages/shakespeare/soliloquies.astro` (update `LibraryIndex` import path)
- Modify: `src/pages/shakespeare/childrens-shakespeare.astro` (update `LibraryIndex` import path)
- Modify: `src/pages/shakespeare/themes.astro` (update `ScriptCard` import path)
- Modify: `src/components/scripts/LibraryIndex.astro` (post-move) — update its internal `ScriptCard` import to same-directory

**Interfaces produced:** identical to Cycle 3, just at new paths. No behavior change.

- [ ] **Step 1: Create the target directory and move the three files**

Run:
```bash
mkdir -p src/components/scripts
git mv src/components/shakespeare/ScriptCard.astro src/components/scripts/ScriptCard.astro
git mv src/components/shakespeare/ScriptDetail.astro src/components/scripts/ScriptDetail.astro
git mv src/components/shakespeare/LibraryIndex.astro src/components/scripts/LibraryIndex.astro
```

- [ ] **Step 2: Update the intra-move import inside `LibraryIndex.astro`**

Read `src/components/scripts/LibraryIndex.astro`. Find the line that imports `ScriptCard` (originally `import ScriptCard from './ScriptCard.astro';`). After the move both files live in the same directory, so the import remains `./ScriptCard.astro` — verify no absolute `@/components/shakespeare/…` reference lingers.

If there's an `@/components/shakespeare/ScriptCard.astro` reference, change to `./ScriptCard.astro`.

- [ ] **Step 3: Update import sites across the Shakespeare pages**

Update each of these files: change every occurrence of `@/components/shakespeare/(ScriptCard|ScriptDetail|LibraryIndex).astro` to `@/components/scripts/$1.astro`.

- `src/pages/shakespeare/scripts/[slug].astro`
- `src/pages/shakespeare/scenes.astro`
- `src/pages/shakespeare/cuttings.astro`
- `src/pages/shakespeare/soliloquies.astro`
- `src/pages/shakespeare/childrens-shakespeare.astro`
- `src/pages/shakespeare/themes.astro`

Use the Edit tool per file — do NOT sed the entire directory (safer to touch specific files).

- [ ] **Step 4: Search for any missed references**

Run:
```bash
grep -rn "components/shakespeare/\(ScriptCard\|ScriptDetail\|LibraryIndex\)" src/
```

Expected: empty output. If anything comes back, update that file with the same rewrite.

- [ ] **Step 5: Run `pnpm check` — expect 0 errors**

Run:
```bash
pnpm check
```

Expected: 0 errors. Any type / import resolution error indicates a missed import path.

- [ ] **Step 6: Run `pnpm build` — expect clean**

Run:
```bash
pnpm build
```

Expected: succeeds; all Shakespeare pages continue to render.

- [ ] **Step 7: Run Playwright smoke test — expect PASS**

Run:
```bash
pnpm test:e2e
```

Expected: PASS. The Shakespeare-page assertions in the smoke test are the regression guard for this move.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
refactor: move script components from shakespeare/ to scripts/

ScriptCard, ScriptDetail, and LibraryIndex now serve both the
Shakespeare section (Cycle 3) and the Children's Theatre section
(Cycle 4 forward). Relocated to src/components/scripts/ so their
directory reflects their cross-sectional scope.

Import sites updated across the 6 Shakespeare pages that consume
them. LibraryIndex's same-directory ScriptCard import is unchanged.
Behavior identical; smoke test verifies no regression.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Extend `scripts` schema + placeholder seed content

**Files:**
- Modify: `src/lib/content-schemas.ts` (extend `SCRIPT_LIBRARIES` and `scriptsSchema`)
- Create: `src/content/scripts/sample-childrens-play-water-of-life.mdx`
- Create: `src/content/scripts/sample-childrens-play-aesop-fox-and-grapes.mdx`
- Create: `src/content/scripts/sample-teaching-module-theseus.mdx`
- Modify: `tests/unit/shakespeare.test.ts` (extend for new libraries, optional fields, imagery-file existence)

**Interfaces produced:**
- `SCRIPT_LIBRARIES` gains two new enum values: `childrens-plays`, `teaching-modules`.
- `scriptsSchema` gains 6 new optional fields: `sourceMaterials`, `authorIntentions`, `whatToWatch`, `imagery` (array with `src`, `alt`, `credit?`), `aiPrompt`, `series`.

- [ ] **Step 1: Write the failing tests — extend `tests/unit/shakespeare.test.ts`**

Read the existing `tests/unit/shakespeare.test.ts` first (see its current shape). Then add these new blocks at the bottom:

```typescript
describe('scripts collection — Cycle 4 extensions', () => {
  it('has at least one entry for each new library', async () => {
    const entries = await getCollection('scripts');
    const libraries = new Set(entries.map((e) => e.data.library));
    for (const lib of ['childrens-plays', 'teaching-modules'] as const) {
      expect(libraries.has(lib), `no scripts entry has library="${lib}"`).toBe(true);
    }
  });

  it("existing Shakespeare entries parse unchanged (regression check)", async () => {
    const entries = await getCollection('scripts');
    const shakespeareLibs = new Set(['soliloquies', 'scenes', 'themes', 'cuttings', 'childrens-shakespeare']);
    const shakespeareEntries = entries.filter((e) => shakespeareLibs.has(e.data.library));
    expect(shakespeareEntries.length).toBeGreaterThan(0);
    for (const e of shakespeareEntries) {
      // If Cycle 3 entries broke, this collection wouldn't have loaded at all
      expect(e.data.title).toBeTruthy();
    }
  });

  it('every imagery entry with src set has a matching file under public/', async () => {
    const { existsSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));
    const entries = await getCollection('scripts');
    for (const e of entries) {
      for (const img of e.data.imagery) {
        // Convention: src starts with "/images/" — strip the leading slash for fs check.
        const rel = img.src.startsWith('/') ? img.src.slice(1) : img.src;
        expect(
          existsSync(publicDir + rel),
          `${img.src} referenced by ${e.id} not found under public/`,
        ).toBe(true);
      }
    }
  });

  it('imagery entries require alt text', async () => {
    const entries = await getCollection('scripts');
    for (const e of entries) {
      for (const img of e.data.imagery) {
        expect(img.alt, `${e.id} imagery entry missing alt text`).toBeTruthy();
      }
    }
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

Run:
```bash
pnpm test tests/unit/shakespeare.test.ts
```

Expected: FAIL — the new libraries don't exist yet in the enum; the placeholder entries with those libraries haven't been created yet.

- [ ] **Step 3: Extend `SCRIPT_LIBRARIES` and `scriptsSchema` in `src/lib/content-schemas.ts`**

Locate `SCRIPT_LIBRARIES` and add the two new values at the end. Locate `scriptsSchema` and add the 6 new optional fields inside the `.object({...})` block, before the `.refine(...)`.

Full replacement for those two blocks:

```typescript
export const SCRIPT_LIBRARIES = [
  'soliloquies',
  'scenes',
  'themes',
  'cuttings',
  'childrens-shakespeare',
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
    // Cycle 4 — Children's-Theatre-scoped optional fields
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

- [ ] **Step 4: Create placeholder seed content — 2 childrens-plays + 1 teaching-module**

Create `src/content/scripts/sample-childrens-play-water-of-life.mdx`:

```mdx
---
title: 'The Water of Life'
library: childrens-plays
play: 'The Water of Life'
authors: []
minutes: 30
characters:
  - { name: The Youngest Son }
  - { name: The Middle Son }
  - { name: The Eldest Son }
  - { name: The King }
  - { name: The Wise Woman }
sample: true
sourceMaterials: 'Grimm Brothers, tale ATU 551 (The Water of Life). Placeholder stub — real script arrives with the Drive import.'
authorIntentions: 'Placeholder note. Real author intent lands with the Drive import.'
whatToWatch: 'Placeholder note. Real facilitator guidance lands with the Drive import.'
imagery: []
---

## Production Notes

Sample entry — replace with real content from the Drive import.

## Script

Placeholder script text.

## Facilitator Notes

Debrief prompts pending real content.
```

Create `src/content/scripts/sample-childrens-play-aesop-fox-and-grapes.mdx`:

```mdx
---
title: 'The Fox and the Grapes'
library: childrens-plays
play: 'Aesop — The Fox and the Grapes'
series: "Aesop's Fables"
authors: []
minutes: 10
characters:
  - { name: The Fox }
  - { name: The Grapes (chorus) }
sample: true
sourceMaterials: 'Aesop, fable of the fox and the sour grapes. Placeholder stub — real script arrives with the Drive import.'
imagery: []
---

## Production Notes

Sample entry — replace with real content from the Drive import.

## Script

Placeholder script text.

## Facilitator Notes

Debrief prompts pending real content.
```

Create `src/content/scripts/sample-teaching-module-theseus.mdx`:

```mdx
---
title: 'Theseus, Ariadne and the Minotaur — teaching module'
library: teaching-modules
play: 'Theseus and the Minotaur'
authors: []
minutes: 45
characters:
  - { name: Theseus }
  - { name: Ariadne }
  - { name: The Minotaur (mask or shadow) }
sample: true
sourceMaterials: 'Greek myth. Placeholder stub — real teaching module arrives with the Drive import.'
whatToWatch: 'Placeholder note. Real classroom framing lands with the Drive import.'
imagery: []
---

## Production Notes

Sample entry — replace with real content from the Drive import.

## Script

Placeholder script text.

## Facilitator Notes

Debrief prompts pending real content.
```

- [ ] **Step 5: Grep-verify curly apostrophes in all new prose**

Run:
```bash
grep -n "'[a-zA-Z]" src/content/scripts/sample-childrens-play-water-of-life.mdx src/content/scripts/sample-childrens-play-aesop-fox-and-grapes.mdx src/content/scripts/sample-teaching-module-theseus.mdx | grep -v "^[^:]*:import\|from '\|getCollection('"
```

Expected: empty output. If any straight apostrophe (U+0027) appears in prose (title, sourceMaterials, authorIntentions, whatToWatch, body paragraphs), replace with curly (U+2019 = `'`) and re-run the grep until it returns empty.

Note: the placeholder frontmatter above uses double-quoted values for strings containing apostrophes (`'Aesop\'s Fables'` written as `"Aesop's Fables"` where `'` is U+2019). YAML accepts either form; double-quoted avoids escaping the apostrophe entirely.

- [ ] **Step 6: Run the tests — expect PASS**

Run:
```bash
pnpm test tests/unit/shakespeare.test.ts
```

Expected: PASS on all new tests. (The imagery-file-existence test is a no-op for these placeholders since none set `imagery` beyond `[]`.)

- [ ] **Step 7: Run `pnpm build` — expect clean**

Run:
```bash
pnpm build
```

Expected: `check:concepts` + `check:prohibited` both print `✓`; build completes; page count includes placeholder entries.

- [ ] **Step 8: Commit**

```bash
git add src/lib/content-schemas.ts src/content/scripts/sample-childrens-play-water-of-life.mdx src/content/scripts/sample-childrens-play-aesop-fox-and-grapes.mdx src/content/scripts/sample-teaching-module-theseus.mdx tests/unit/shakespeare.test.ts
git commit -m "$(cat <<'EOF'
feat(childrens): extend scripts schema for childrens-plays + teaching-modules

SCRIPT_LIBRARIES enum gains two new values. scriptsSchema gains six
new optional fields (sourceMaterials, authorIntentions, whatToWatch,
imagery[], aiPrompt, series). All Cycle 3 Shakespeare entries parse
unchanged (backward-compat regression test added).

Placeholder seeds: one childrens-plays entry (Water of Life), one
childrens-plays series entry (Aesop's Fables — Fox and the Grapes),
one teaching-modules entry (Theseus). All flagged sample: true.
Task 4's Drive import replaces or augments these if the folder is
accessible.

Vitest suite extended with 4 new cases (new-library invariant,
Shakespeare backward-compat, imagery-file existence, imagery alt-text
required).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Drive MCP seed content import (conditional)

**Prerequisite:** the controller must ask the human partner for the Google Drive folder link before dispatching this task's implementer. If no link, skip this task entirely; log `Task 4: skipped (no Drive link) — real content deferred to a later import cycle` in the ledger and note in `project_dtfc_followups.md`. Proceed to Task 5 with Task 3's placeholders in place.

**Files:**
- Replace/add: `src/content/scripts/*.mdx` (real childrens-plays + teaching-modules entries; keep sample-* files only in libraries with no real content)
- Create/populate: `public/images/childrens-theatre/<slug>/*.{png,jpg,webp}` (children's-drawings imagery if Drive holds them)

**Interfaces produced:** same collection interfaces as Task 3, populated with real content (`sample: false` for imported entries).

- [ ] **Step 1: Confirm the Drive folder link is available**

The controller has provided the Drive folder URL. If not, reply `BLOCKED — no Drive folder link provided; controller should skip Task 4 per its dispatch contract`.

- [ ] **Step 2: Enumerate the folder via Google Drive MCP**

The Drive MCP is available as `mcp__claude_ai_Google_Drive__*` tools. Discover schemas via ToolSearch (query: `select:mcp__claude_ai_Google_Drive__search_files,mcp__claude_ai_Google_Drive__read_file_content,mcp__claude_ai_Google_Drive__download_file_content,mcp__claude_ai_Google_Drive__list_recent_files`).

Enumerate the folder recursively. Report the tree structure in your report. Expected content (per spec §4.4):
- Water of Life (full script + production notes)
- One Seed Child (full script — © 1973/2022 Chuck and Lola Wilcox)
- The Treasure Inside (10-minute play + the AI prompt used to co-write it)
- Conquering the Sun (Hawai'i) — subfolder of related plays
- Aesop's Fables — subfolder of related plays
- Teaching Modules — subfolder (Theseus, One Seed Child module, etc.)
- Why These Plays Work: Key Concepts (source doc for the manifesto page)
- Honoring Our Guides (source doc)
- How-To Guides (4 source docs)
- Children's drawings / imagery (Ian's dragon for One Seed Child, etc.)

- [ ] **Step 3: Download any imagery files**

For each image found (`.png`, `.jpg`, `.webp`, etc.), download to `public/images/childrens-theatre/<slug>/<ascii-kebab-filename>`. Filenames must be ASCII kebab-case (rename non-ASCII sources). Ensure the directory exists: `mkdir -p public/images/childrens-theatre/<slug>/`.

- [ ] **Step 4: Convert each script Drive doc to MDX**

For each script doc, read content, convert to MDX, write to `src/content/scripts/<kebab-slug>.mdx`. Slug = kebab-case of the play title.

**Library assignment:**
- Standalone plays (Water of Life, One Seed Child, The Treasure Inside) → `library: childrens-plays` with no `series`
- Plays in Aesop's Fables subfolder → `library: childrens-plays` with `series: "Aesop's Fables"`
- Plays in Conquering the Sun subfolder → `library: childrens-plays` with `series: "Conquering the Sun"`
- Teaching Modules → `library: teaching-modules` (no `series`)

**Frontmatter fields for children's plays:**
- `title, play, authors, copyright, minutes, characters, doubling, stagingNotes, sourceDoc` (same as Shakespeare)
- **Also fill when the Drive doc has these sections:**
  - `sourceMaterials`: myth/tale foundation, e.g., "Grimm Brothers ATU 551"
  - `authorIntentions`: author's note or intent, prose
  - `whatToWatch`: audience/facilitator guidance
  - `imagery`: array with `src` (path under `/images/childrens-theatre/<slug>/`), `alt` (accessibility description), `credit` (e.g., "Ian, age 7")
- **`aiPrompt`**: ONLY for The Treasure Inside if the Drive doc includes the AI prompt. Prose string; can be multi-line via YAML `|` block scalar.
- `sample: false`
- Set the placeholder stubs from Task 3 aside — delete them if a real entry now covers the same library slot.

**Body structure:**
```mdx
## Production Notes
…what to watch, author's intentions…

## Script
…the actual script text, scene by scene…

## Facilitator Notes
…debrief prompts…
```

**Strip editorial markers** — same discipline as Cycle 3 Task 2: remove `DESIRAE:`, `LOLA:`, `CHERIE NOTE:`, `PUA THOUGHTS`, "for reference only", "TO DO", burgundy edits. Spec §4.4 item 3 explicitly names Cherie's inline comments on the "Why These Plays Work" source doc — strip them.

- [ ] **Step 5: Save the "Why These Plays Work" source text for Task 12**

If a "Why These Plays Work: Key Concepts" source doc exists in Drive, save its cleaned text (editorial markers stripped) to a temp location for Task 12 to consume. Suggested location: `.superpowers/sdd/<workspace>/imports/why-these-plays-work.txt`. Task 12's implementer will read this file and adapt it into the manifesto page.

Similarly save the Honoring Our Guides (Children's Theatre version) source text to `.../honoring-our-guides.txt` for Task 13.

And save each how-to guide source text to `.../how-to-create-a-script.txt`, `.../golden-goose.txt`, `.../key-elements.txt`, `.../archetype-of-one-story.txt` for Task 14 / 15.

- [ ] **Step 6: Curly-apostrophe grep verify all new MDX files**

Run:
```bash
grep -rn "'[a-zA-Z]" src/content/scripts/ | grep -v "^[^:]*:import\|from '\|getCollection('" | head -30
```

If any straight apostrophes appear in prose, convert to U+2019. Use double-quoted YAML for frontmatter strings containing apostrophes to avoid escaping.

- [ ] **Step 7: Run the shakespeare test suite (which now covers all script libraries)**

Run:
```bash
pnpm test tests/unit/shakespeare.test.ts
```

Expected: PASS. If the imagery-file-existence test fails, an `imagery[i].src` references a file that wasn't successfully downloaded — fix the path or download the file.

- [ ] **Step 8: Run `pnpm build` — expect clean**

Run:
```bash
pnpm build
```

Expected: succeeds. Both prebuild guardrails pass.

- [ ] **Step 9: Commit**

```bash
git add src/content/scripts/ public/images/childrens-theatre/
git commit -m "$(cat <<'EOF'
feat(childrens): import seed content from client Drive folder

Real content imported for childrens-plays (standalone + series) and
teaching-modules libraries. Any Task 3 placeholder now covered by real
content was removed. Children's-drawing imagery placed under
/public/images/childrens-theatre/<slug>/ (ASCII kebab-case filenames).

Editorial markers (DESIRAE:, LOLA:, CHERIE NOTE:, "for reference only")
stripped per spec §6. Cherie's burgundy comments on the manifesto
source doc stripped per §4.4 item 3.

Source text for the manifesto, Honoring Our Guides, and 4 how-to guides
staged in .superpowers/sdd/*/imports/ for Tasks 12–15 to consume.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

## Task 5: `scriptHref` helper + tests

**Files:**
- Create: `src/lib/script-href.ts`
- Create: `tests/unit/script-href.test.ts`

**Interfaces produced:**
- `export function scriptHref(entry: CollectionEntry<'scripts'>): string` — routes an entry to `/shakespeare/scripts/<slug>/` if `library ∈ Shakespeare set`, `/childrens-theatre/scripts/<slug>/` if `library ∈ Children's Theatre set`. Strips `.mdx?` from slug.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/script-href.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { scriptHref } from '@/lib/script-href';

// Minimal shape matching the parts of CollectionEntry<'scripts'> that scriptHref reads.
type FakeEntry = { id: string; data: { library: string } };
const fake = (id: string, library: string): FakeEntry => ({ id, data: { library } });

describe('scriptHref', () => {
  it('routes Shakespeare libraries under /shakespeare/scripts/', () => {
    for (const lib of ['soliloquies', 'scenes', 'themes', 'cuttings', 'childrens-shakespeare']) {
      // @ts-expect-error — FakeEntry is intentionally minimal
      expect(scriptHref(fake('romeo.mdx', lib))).toBe('/shakespeare/scripts/romeo/');
    }
  });

  it('routes Childrens Theatre libraries under /childrens-theatre/scripts/', () => {
    for (const lib of ['childrens-plays', 'teaching-modules']) {
      // @ts-expect-error — FakeEntry is intentionally minimal
      expect(scriptHref(fake('water-of-life.mdx', lib))).toBe('/childrens-theatre/scripts/water-of-life/');
    }
  });

  it('strips both .mdx and .md filename extensions', () => {
    // @ts-expect-error — FakeEntry is intentionally minimal
    expect(scriptHref(fake('foo.mdx', 'scenes'))).toBe('/shakespeare/scripts/foo/');
    // @ts-expect-error — FakeEntry is intentionally minimal
    expect(scriptHref(fake('bar.md', 'scenes'))).toBe('/shakespeare/scripts/bar/');
  });

  it('leaves ids without an extension untouched (safety)', () => {
    // @ts-expect-error — FakeEntry is intentionally minimal
    expect(scriptHref(fake('foo', 'scenes'))).toBe('/shakespeare/scripts/foo/');
  });
});
```

- [ ] **Step 2: Run the test — expect FAIL**

Run:
```bash
pnpm test tests/unit/script-href.test.ts
```

Expected: FAIL — `@/lib/script-href` module not found.

- [ ] **Step 3: Create `src/lib/script-href.ts`**

```typescript
import type { CollectionEntry } from 'astro:content';

const CHILDRENS_LIBRARIES = new Set(['childrens-plays', 'teaching-modules']);

/**
 * Canonical URL for a script entry. Detail pages live under the section
 * that owns the library:
 *   Shakespeare libraries (soliloquies, scenes, themes, cuttings,
 *   childrens-shakespeare) -> /shakespeare/scripts/<slug>/
 *   Children's Theatre libraries (childrens-plays, teaching-modules)
 *   -> /childrens-theatre/scripts/<slug>/
 *
 * The 'childrens-shakespeare' library stays under /shakespeare/ because
 * Cycle 3 built its detail pages there; the Children's Theatre section
 * cross-links to those URLs via /childrens-theatre/shakespeare-for-children/.
 *
 * Always import this helper — never hardcode script detail URLs.
 */
export function scriptHref(entry: CollectionEntry<'scripts'>): string {
  const slug = entry.id.replace(/\.mdx?$/, '');
  if (CHILDRENS_LIBRARIES.has(entry.data.library)) {
    return `/childrens-theatre/scripts/${slug}/`;
  }
  return `/shakespeare/scripts/${slug}/`;
}
```

- [ ] **Step 4: Run the test — expect PASS**

Run:
```bash
pnpm test tests/unit/script-href.test.ts
```

Expected: all 4 tests pass.

- [ ] **Step 5: Run `pnpm check` — expect 0 errors**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/script-href.ts tests/unit/script-href.test.ts
git commit -m "$(cat <<'EOF'
feat(scripts): add scriptHref canonical URL helper

Owns the routing decision: Shakespeare libraries -> /shakespeare/scripts/,
Children's Theatre libraries -> /childrens-theatre/scripts/. Tests
cover every library value, both filename-extension forms, and no-extension
safety.

Cross-section cross-link semantics: 'childrens-shakespeare' entries stay
under /shakespeare/ (Cycle 3 origin); /childrens-theatre/shakespeare-for-
children/ links out to those URLs via this helper.

Task 6 updates ScriptCard to use scriptHref instead of hardcoded paths.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Extend `ScriptCard` — series chip + `scriptHref`

**Files:**
- Modify: `src/components/scripts/ScriptCard.astro` (was moved in Task 2)

**Interfaces produced:** same `<ScriptCard entry={entry} />` API. Two behavior changes:
1. Card link uses `scriptHref(entry)` instead of hardcoded `/shakespeare/scripts/<slug>/`.
2. Card renders a `Chip tone="teal"` for `entry.data.series` when set.

- [ ] **Step 1: Read the current `src/components/scripts/ScriptCard.astro`**

Familiarize yourself with the existing structure — chips for library / play / minutes / theme, title link, sample chip.

- [ ] **Step 2: Rewrite the file with the two changes**

Replace the file with:

```astro
---
import type { CollectionEntry } from 'astro:content';
import Chip from '@/components/ui/Chip.astro';
import { scriptHref } from '@/lib/script-href';

interface Props {
  entry: CollectionEntry<'scripts'>;
}
const { entry } = Astro.props;
const href = scriptHref(entry);
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
    {entry.data.series && <Chip tone="teal">{entry.data.series}</Chip>}
    {entry.data.sample && <Chip tone="neutral">Sample — pending final import</Chip>}
  </div>
</article>
```

- [ ] **Step 3: Grep-verify curly apostrophes**

Run:
```bash
grep -n "'[a-zA-Z]" src/components/scripts/ScriptCard.astro | grep -v "import\|from '"
```

Expected: empty output.

- [ ] **Step 4: Run `pnpm check` — expect 0 errors**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 5: Run Playwright smoke test — expect PASS**

Run:
```bash
pnpm test:e2e
```

Expected: the existing Cycle 3 assertions (which click into `/shakespeare/scenes/` → first script card → detail) still work — the URL scriptHref returns for a `scenes` entry is identical to the previous hardcoded form.

- [ ] **Step 6: Commit**

```bash
git add src/components/scripts/ScriptCard.astro
git commit -m "$(cat <<'EOF'
feat(scripts): ScriptCard uses scriptHref + renders series chip

Card link source changed from hardcoded /shakespeare/scripts/<slug>/
to scriptHref(entry). Behavior identical for Shakespeare libraries;
Children's Theatre libraries route to /childrens-theatre/scripts/<slug>/
after Task 22 wires the dynamic route.

Series chip renders when entry.data.series is set (e.g. "Aesop's
Fables", "Conquering the Sun") — grouping badge visible in library
index views.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: `PlayImagery` component

**Files:**
- Create: `src/components/childrens/PlayImagery.astro`

**Interfaces produced:**
- `<PlayImagery src={...} alt={...} credit={...} />` — renders `<figure>` with `<img src alt loading="lazy">` and a `<figcaption>` combining credit + optional caption.
- Consumed by `ScriptDetail` in Task 8's imagery gallery section.

- [ ] **Step 1: Create `src/components/childrens/PlayImagery.astro`**

```astro
---
interface Props {
  src: string;
  alt: string;
  credit?: string;
}
const { src, alt, credit } = Astro.props;
---

<figure class="border-ivory-200 rounded-[var(--radius-card)] overflow-hidden border">
  <img src={src} alt={alt} loading="lazy" class="block h-auto w-full" />
  {
    credit && (
      <figcaption class="text-ink-500 border-ivory-200 border-t px-3 py-2 text-xs italic">
        {credit}
      </figcaption>
    )
  }
</figure>
```

- [ ] **Step 2: Run `pnpm check` — expect 0 errors**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/childrens/PlayImagery.astro
git commit -m "$(cat <<'EOF'
feat(childrens): add PlayImagery captioned figure component

<figure> wrapping <img loading="lazy"> with an optional <figcaption>
for the artwork credit line. Consumed by ScriptDetail's imagery
gallery when a script entry has an imagery array with entries.

Handles the DT:FC "children's drawings are a treasured asset"
discipline from spec §4.4 item 7 — every image gets an alt-text
description and a credit line ("Ian, age 7") preserving the child
attribution.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Extend `ScriptDetail` — 5 new conditional sections

**Files:**
- Modify: `src/components/scripts/ScriptDetail.astro` (was moved in Task 2)

**Interfaces produced:** same `<ScriptDetail entry={entry}><Content /></ScriptDetail>` API. Five new conditional sections render after the MDX body when the corresponding frontmatter field is set:
1. Source Materials
2. Author's Intentions
3. What to Watch
4. Imagery gallery (grid of `<PlayImagery>`)
5. The Prompt Used (for AI co-writing, e.g., The Treasure Inside)

- [ ] **Step 1: Read the current `src/components/scripts/ScriptDetail.astro`**

Familiarize with the header/body/print button structure.

- [ ] **Step 2: Rewrite the file with the new conditional sections**

Replace the file with:

```astro
---
import type { CollectionEntry } from 'astro:content';
import Chip from '@/components/ui/Chip.astro';
import PlayImagery from '@/components/childrens/PlayImagery.astro';

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
  'childrens-plays': "Children's Plays",
  'teaching-modules': 'Teaching Modules',
};

const CHILDRENS_LIBRARIES = new Set(['childrens-plays', 'teaching-modules', 'childrens-shakespeare']);
const isChildrens = CHILDRENS_LIBRARIES.has(g.library);
const librarySectionHref = isChildrens
  ? g.library === 'childrens-shakespeare'
    ? '/shakespeare/childrens-shakespeare/'
    : g.library === 'teaching-modules'
      ? '/childrens-theatre/teaching-modules/'
      : '/childrens-theatre/plays/'
  : `/shakespeare/${g.library}/`;
const sectionHomeHref = isChildrens ? '/childrens-theatre/' : '/shakespeare/';
const sectionHomeLabel = isChildrens ? "Children's Theatre" : 'Shakespeare';
---

<article class="mx-auto max-w-3xl">
  <p class="text-ink-500 text-sm">
    <a href={sectionHomeHref}>{sectionHomeLabel}</a> ·
    <a href={librarySectionHref}>{LIBRARY_LABELS[g.library]}</a>
  </p>

  <div class="mt-4 flex flex-wrap items-center gap-2">
    <Chip tone="clay">{LIBRARY_LABELS[g.library]}</Chip>
    <Chip tone="teal">{g.play}</Chip>
    {g.minutes && <Chip tone="mustard">{g.minutes} min</Chip>}
    {g.theme && <Chip tone="clay">{g.theme}</Chip>}
    {g.series && <Chip tone="teal">{g.series}</Chip>}
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

  {
    g.sourceMaterials && (
      <section class="mt-10">
        <h2>Source Materials</h2>
        <p class="text-ink-700 mt-2">{g.sourceMaterials}</p>
      </section>
    )
  }

  {
    g.authorIntentions && (
      <section class="mt-8">
        <h2>Author&rsquo;s Intentions</h2>
        <p class="text-ink-700 mt-2">{g.authorIntentions}</p>
      </section>
    )
  }

  {
    g.whatToWatch && (
      <section class="mt-8">
        <h2>What to Watch</h2>
        <p class="text-ink-700 mt-2">{g.whatToWatch}</p>
      </section>
    )
  }

  {
    g.imagery.length > 0 && (
      <section class="mt-10">
        <h2>Imagery</h2>
        <div class="imagery-grid mt-4 grid gap-4 sm:grid-cols-2">
          {g.imagery.map((img) => (
            <PlayImagery src={img.src} alt={img.alt} credit={img.credit} />
          ))}
        </div>
      </section>
    )
  }

  {
    g.aiPrompt && (
      <section class="mt-10">
        <h2>The Prompt Used</h2>
        <p class="text-ink-700 mt-2">
          This play was co-written with Claude AI. Below is the prompt used, as a model for
          teachers wanting to try the same approach.
        </p>
        <pre class="bg-ivory-100 mt-4 overflow-x-auto rounded-[var(--radius-card)] p-4 text-sm leading-relaxed whitespace-pre-wrap">{g.aiPrompt}</pre>
      </section>
    )
  }
</article>
```

- [ ] **Step 3: Grep-verify curly apostrophes**

Run:
```bash
grep -n "'[a-zA-Z]" src/components/scripts/ScriptDetail.astro | grep -v "import\|from '\|getCollection('\|const \|new Set\|isChildrens\|librarySectionHref\|Astro\.props\|Record<"
```

Expected: no prose straight apostrophes. (Note: the file uses `&rsquo;` HTML entities for `Author's Intentions` and `Children's` in the LIBRARY_LABELS to be safe against JS string-quoting confusion. Both render as U+2019.)

- [ ] **Step 4: Run `pnpm check` — expect 0 errors**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 5: Run `pnpm build` — expect clean**

Run:
```bash
pnpm build
```

Expected: succeeds. Existing Shakespeare script detail pages render (with only the fields they have set — new sections are silently skipped).

- [ ] **Step 6: Run Playwright smoke test — expect PASS**

Run:
```bash
pnpm test:e2e
```

Expected: the existing Cycle 3 assertion for a Shakespeare script's "Print this script" button still succeeds. New sections don't render for Shakespeare entries (their frontmatter doesn't set the new fields).

- [ ] **Step 7: Commit**

```bash
git add src/components/scripts/ScriptDetail.astro
git commit -m "$(cat <<'EOF'
feat(scripts): ScriptDetail renders 5 new conditional sections

Adds after-body sections rendered only when the corresponding
frontmatter field is set on the entry:
- Source Materials
- Author's Intentions
- What to Watch
- Imagery gallery (grid of <PlayImagery>)
- The Prompt Used (aiPrompt, for AI co-writing like The Treasure Inside)

Also adds the two new library labels (Children's Plays, Teaching
Modules) to LIBRARY_LABELS and computes the breadcrumb library link
to route correctly for children's-scoped entries.

Existing Shakespeare entries render unchanged — none set the new
fields, so the new sections are silently skipped.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: `WayfarersJourneyWheel.astro` — 8-station procedural SVG

**Files:**
- Create: `src/components/childrens/WayfarersJourneyWheel.astro`

**Interfaces produced:**
- `<WayfarersJourneyWheel />` — no props. Renders a `<figure>` containing an inline SVG (400×400 viewBox) with 8 evenly-spaced labeled stations around a circle, clockwise arrows connecting successive stations, center label. `<title>` + `<desc>` in the SVG plus a `<figcaption>` beneath list all 8 stations for screen readers + print output.

- [ ] **Step 1: Create `src/components/childrens/WayfarersJourneyWheel.astro`**

```astro
---
/**
 * The Wayfarer's Journey Wheel — 8 stations arranged clockwise on a circle.
 * Referenced in spec §4.4 item 4, embedded on
 * /childrens-theatre/how-to/archetype-of-one-story/.
 *
 * Colors sourced from tokens (var(--color-*)) — no hex.
 * Accessibility: SVG <title> + <desc>; <figcaption> below lists all stations
 * for screen readers and print output.
 */

const STATIONS = [
  'Home',
  'Call',
  'Gate In',
  'Road of Trials',
  'Nigredo',
  'Road of Trials II',
  'Gate Out',
  'Return',
];

const CENTER = 200;
const RADIUS = 140;

// Angles: 12 o'clock start (-90°), 45° increments clockwise
const points = STATIONS.map((label, i) => {
  const angleDeg = -90 + i * 45;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    label,
    x: CENTER + RADIUS * Math.cos(angleRad),
    y: CENTER + RADIUS * Math.sin(angleRad),
    // For label placement offset from the circle
    labelX: CENTER + (RADIUS + 30) * Math.cos(angleRad),
    labelY: CENTER + (RADIUS + 30) * Math.sin(angleRad),
    // Text-anchor: 'middle' at top/bottom, 'start' on right, 'end' on left
    anchor:
      i === 0 || i === 4 ? 'middle' : i > 0 && i < 4 ? 'start' : 'end',
    // Baseline for legibility
    baseline: i === 0 ? 'baseline' : i === 4 ? 'hanging' : 'middle',
  };
});

// Arc paths between consecutive stations (approximate clockwise arcs)
const arcs = points.map((_, i) => {
  const from = points[i];
  const to = points[(i + 1) % points.length];
  // Small arc, clockwise (sweep-flag=1)
  return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} A ${RADIUS} ${RADIUS} 0 0 1 ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
});
---

<figure class="my-8 flex flex-col items-center">
  <svg
    viewBox="0 0 400 400"
    role="img"
    aria-labelledby="wjw-title wjw-desc"
    class="text-clay-500 h-auto w-full max-w-md"
    style="color: var(--color-clay-500);"
  >
    <title id="wjw-title">The Wayfarer&rsquo;s Journey</title>
    <desc id="wjw-desc">
      Eight stations arranged clockwise on a circle: Home, Call, Gate In, Road of Trials,
      Nigredo, Road of Trials II, Gate Out, Return &mdash; closing back to Home.
    </desc>

    <defs>
      <marker
        id="wjw-arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
        fill="currentColor"
      >
        <path d="M 0 0 L 10 5 L 0 10 z"></path>
      </marker>
    </defs>

    {/* Center reference circle (very faint) */}
    <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="currentColor" stroke-opacity="0.15" stroke-width="1"></circle>

    {/* Clockwise arcs with arrowheads */}
    {arcs.map((d) => (
      <path d={d} fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#wjw-arrow)"></path>
    ))}

    {/* Station dots */}
    {points.map((p) => (
      <circle cx={p.x} cy={p.y} r="5" fill="currentColor"></circle>
    ))}

    {/* Station labels */}
    {points.map((p) => (
      <text
        x={p.labelX}
        y={p.labelY}
        text-anchor={p.anchor}
        dominant-baseline={p.baseline}
        fill="var(--color-ink-900)"
        style="font-family: var(--font-body); font-size: 12px;"
      >
        {p.label}
      </text>
    ))}

    {/* Center label */}
    <text
      x={CENTER}
      y={CENTER}
      text-anchor="middle"
      dominant-baseline="middle"
      fill="var(--color-ink-900)"
      style="font-family: var(--font-display); font-size: 14px; font-style: italic;"
    >
      The Wayfarer&rsquo;s Journey
    </text>
  </svg>

  <figcaption class="text-ink-500 mt-4 max-w-md text-center text-sm leading-relaxed">
    The eight stations of the Wayfarer&rsquo;s Journey, in clockwise order:
    <strong>Home</strong>, Call, Gate In, Road of Trials, Nigredo, Road of Trials II,
    Gate Out, Return &mdash; returning to Home.
  </figcaption>
</figure>
```

- [ ] **Step 2: Grep-verify curly apostrophes and no hex codes**

Run:
```bash
grep -n "'[a-zA-Z]" src/components/childrens/WayfarersJourneyWheel.astro | grep -v "import\|from '\|const \|astro\.props\|Array\|Math\|Astro\|Number"
echo '---HEX---'
grep -En "#[0-9a-fA-F]{3,8}" src/components/childrens/WayfarersJourneyWheel.astro
```

Expected: first grep empty (all apostrophes are `&rsquo;` HTML entities or curly U+2019). Second grep empty (no hex codes — all colors are `currentColor` inherited from Tailwind class `text-clay-500` or `var(--color-*)`).

- [ ] **Step 3: Run `pnpm check` — expect 0 errors**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/childrens/WayfarersJourneyWheel.astro
git commit -m "$(cat <<'EOF'
feat(childrens): add WayfarersJourneyWheel procedural SVG

8 evenly-spaced labeled stations (Home, Call, Gate In, Road of Trials,
Nigredo, Road of Trials II, Gate Out, Return) arranged clockwise on a
circle with curved arrows between them. Center label "The Wayfarer's
Journey" in the display serif.

Accessibility: SVG role="img", aria-labelledby with <title> + <desc>;
<figcaption> beneath lists all 8 stations in order for screen readers
and print output.

Colors via currentColor + CSS variable tokens (no hex).

Consumed by Task 15's archetype-of-one-story how-to guide page.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: `HowToGuide.astro` — shared how-to page wrapper

**Files:**
- Create: `src/components/childrens/HowToGuide.astro`

**Interfaces produced:**
- `<HowToGuide title="..." currentGuide="create-a-script | golden-goose | key-elements | archetype-of-one-story">...</HowToGuide>` — renders a breadcrumb, a secondary tab-row of all 4 how-to guides (marking current), a print button (uses existing `data-print-hide`), and a `.prose` container with an MDX slot.

- [ ] **Step 1: Create `src/components/childrens/HowToGuide.astro`**

```astro
---
interface Props {
  title: string;
  currentGuide: 'create-a-script' | 'golden-goose' | 'key-elements' | 'archetype-of-one-story';
}
const { title, currentGuide } = Astro.props;

const GUIDES = [
  { key: 'create-a-script', label: 'Create a Script', href: '/childrens-theatre/how-to/create-a-script/' },
  { key: 'golden-goose', label: 'Golden Goose', href: '/childrens-theatre/how-to/golden-goose/' },
  { key: 'key-elements', label: 'Key Elements', href: '/childrens-theatre/how-to/key-elements/' },
  { key: 'archetype-of-one-story', label: 'Archetype of One Story', href: '/childrens-theatre/how-to/archetype-of-one-story/' },
] as const;
---

<article class="mx-auto max-w-3xl">
  <p class="text-ink-500 text-sm">
    <a href="/childrens-theatre/">Children&rsquo;s Theatre</a> ·
    <span>How-To Guides</span> ·
    <span>{title}</span>
  </p>

  <h1 class="mt-3">{title}</h1>

  <nav aria-label="How-To Guides" class="border-ivory-200 mt-6 border-y py-3" data-print-hide>
    <ul class="flex flex-wrap gap-x-5 gap-y-2">
      {
        GUIDES.map((g) => (
          <li>
            <a
              href={g.href}
              class={`text-ink-700 hover:text-clay-500 inline-block py-1 text-sm no-underline ${
                currentGuide === g.key
                  ? 'border-clay-500 text-ink-900 border-b-2 font-medium'
                  : ''
              }`}
              aria-current={currentGuide === g.key ? 'page' : undefined}
            >
              {g.label}
            </a>
          </li>
        ))
      }
    </ul>
  </nav>

  <div class="mt-6" data-print-hide>
    <button
      type="button"
      onclick="window.print()"
      class="border-ink-900 rounded border px-3 py-1.5 text-sm"
    >
      Print this guide
    </button>
  </div>

  <div class="prose prose-neutral mt-8 max-w-none">
    <slot />
  </div>
</article>
```

- [ ] **Step 2: Grep-verify apostrophes**

Run:
```bash
grep -n "'[a-zA-Z]" src/components/childrens/HowToGuide.astro | grep -v "import\|from '\|const \|Astro\.props\|as const"
```

Expected: empty output (the possessive `Children's` uses `&rsquo;`).

- [ ] **Step 3: Run `pnpm check` — expect 0 errors**

Run:
```bash
pnpm check
```

- [ ] **Step 4: Commit**

```bash
git add src/components/childrens/HowToGuide.astro
git commit -m "$(cat <<'EOF'
feat(childrens): add HowToGuide shared wrapper for the 4 how-to pages

Renders breadcrumb, secondary tab-row of all 4 how-to guides (with
active marking), print button, and .prose container with MDX slot.
The 4 how-to pages (Tasks 14–15) each import this wrapper and pass
currentGuide + title.

Guide list is a local const inside the component — tightly scoped to
this UI element rather than exposed as data because no other consumer
needs it.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: `CHILDRENS_NAV` data + `ChildrensLayout` wrapper

**Files:**
- Create: `src/lib/childrens-nav.ts`
- Create: `src/layouts/ChildrensLayout.astro`

**Interfaces produced:**
- `SHAKESPEARE_NAV`-analog: `CHILDRENS_NAV: ChildrensNavItem[]` — 6 items.
- `<ChildrensLayout title description? eyebrow? subPage?>` — wraps `SectionLayout` with a persistent sub-nav row on every `/childrens-theatre/*` page.

- [ ] **Step 1: Create `src/lib/childrens-nav.ts`**

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

- [ ] **Step 2: Create `src/layouts/ChildrensLayout.astro`**

```astro
---
import SectionLayout from './SectionLayout.astro';
import { CHILDRENS_NAV } from '@/lib/childrens-nav';

interface Props {
  title: string;
  description?: string;
  eyebrow?: string;
  subPage?: string;
}
const { title, description, eyebrow, subPage } = Astro.props;
---

<SectionLayout title={title} description={description} section="childrens-theatre" eyebrow={eyebrow}>
  <nav aria-label="Children&rsquo;s Theatre section" class="border-ivory-200 mb-8 border-b pb-3">
    <ul class="flex flex-wrap gap-x-5 gap-y-2">
      {
        CHILDRENS_NAV.map((item) => (
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

- [ ] **Step 3: Grep-verify curly apostrophes**

Run:
```bash
grep -n "'[a-zA-Z]" src/lib/childrens-nav.ts src/layouts/ChildrensLayout.astro | grep -v "import\|from '\|const \|export \|interface "
```

Expected: empty output.

- [ ] **Step 4: Run `pnpm check` — expect 0 errors**

Run:
```bash
pnpm check
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/childrens-nav.ts src/layouts/ChildrensLayout.astro
git commit -m "$(cat <<'EOF'
feat(childrens): add CHILDRENS_NAV + ChildrensLayout wrapper

Six sub-nav items drive the persistent nav bar on every
/childrens-theatre/* page. Layout wraps SectionLayout, injecting the
sub-nav below the section h1 and before the slot content. The 4
how-to guides all set subPage="how-to" — the secondary tab-row inside
HowToGuide.astro disambiguates.

Structural mirror of Cycle 3's ShakespeareLayout — same aria-current
pattern for accessibility.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Landing page rewrite

**Files:**
- Modify: `src/pages/childrens-theatre/index.astro` (full rewrite)

**Preserved from Cycle 2:** the `<section id="imagination">` and `<section id="every-person">` anchors (`IDEA_TWO_ANSWERS` in `src/data/landing.ts` maps two questions to these).

- [ ] **Step 1: Rewrite `src/pages/childrens-theatre/index.astro`**

Replace the entire file with:

```astro
---
import ChildrensLayout from '@/layouts/ChildrensLayout.astro';
import ReflectivePrompt from '@/components/section/ReflectivePrompt.astro';

const directoryCards = [
  {
    label: 'Why These Plays Work',
    href: '/childrens-theatre/why-these-plays-work/',
    description: 'The section&rsquo;s manifesto: bare stage, oral tradition, seven levels of truth, archetypes.',
  },
  {
    label: 'Plays',
    href: '/childrens-theatre/plays/',
    description: 'Water of Life, One Seed Child, The Treasure Inside, Aesop&rsquo;s Fables, Conquering the Sun.',
  },
  {
    label: 'Teaching Modules',
    href: '/childrens-theatre/teaching-modules/',
    description: 'Plays prepared as full teaching units with framing, discussion, and extensions.',
  },
  {
    label: 'Shakespeare for Children',
    href: '/childrens-theatre/shakespeare-for-children/',
    description: 'Shakespeare adaptations shaped for young Players &mdash; cross-linked with the Shakespeare section.',
  },
  {
    label: 'How-To Guides',
    href: '/childrens-theatre/how-to/create-a-script/',
    description: 'Four guides: creating a script, Golden Goose method, Key Elements, and Archetype of One Story.',
  },
  {
    label: 'Honoring Our Guides',
    href: '/childrens-theatre/honoring-our-guides/',
    description: 'Oral-tradition ancestors, Fred Rogers, the Wilcoxes, teachers, and the children themselves.',
  },
];
---

<ChildrensLayout
  title="Children&rsquo;s Theatre"
  eyebrow="Plays &mdash; Theatre Teaching Units &mdash; Storytelling"
  description="Myth-driven, minimalist plays where every child in the room has a real part to play."
>
  <ReflectivePrompt sectionKey="childrens-theatre" />

  <div class="mt-8 max-w-2xl space-y-6">
    {/* CLIENT REVIEW: Cycle 4 rewrites — each teaser now links to its destination. */}
    <section id="imagination">
      <h2>Imagination provides everything</h2>
      <p>
        Our plays are written for the bare stage: a cloak becomes a castle wall, a chair becomes
        a throne, a broom becomes a horse. Children step into that convention immediately &mdash;
        and once they have, the whole imaginative apparatus of the play becomes theirs, not the
        production designer&rsquo;s.
        <a href="/childrens-theatre/why-these-plays-work/" class="hover:text-clay-500">Read Why These Plays Work &rarr;</a>
      </p>
    </section>

    <section id="every-person">
      <h2>A part for every player</h2>
      <p>
        Each script is written with <strong>versatile casting</strong> &mdash; every role can be
        split, shared, or doubled so no child sits out. Rehearsal isn&rsquo;t a competition for the
        leads; it&rsquo;s an ensemble that grows every Player&rsquo;s confidence at once.
        <a href="/childrens-theatre/plays/" class="hover:text-clay-500">Browse the plays &rarr;</a>
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
              <h3 class="font-display text-ink-900 text-xl" set:html={card.label}></h3>
              <p class="text-ink-700 mt-1 text-sm" set:html={card.description}></p>
            </a>
          </li>
        ))
      }
    </ul>
  </section>
</ChildrensLayout>
```

- [ ] **Step 2: Grep-verify curly apostrophes**

Run:
```bash
grep -n "'[a-zA-Z]" src/pages/childrens-theatre/index.astro | grep -v "import\|from '\|const \|Astro\.props"
```

Expected: empty output. (All possessive apostrophes render as `&rsquo;` HTML entities in this file.)

- [ ] **Step 3: Run `pnpm build` — expect clean**

Run:
```bash
pnpm build
```

Expected: build succeeds. The `#imagination` and `#every-person` anchors still exist for `IDEA_TWO_ANSWERS` resolution.

- [ ] **Step 4: Commit**

```bash
git add src/pages/childrens-theatre/index.astro
git commit -m "$(cat <<'EOF'
feat(childrens): rewrite landing with directory grid + cross-links

Wraps in ChildrensLayout (sub-nav renders). Preserves the two Cycle 2
section anchors (#imagination, #every-person) so IDEA_TWO_ANSWERS in
src/data/landing.ts continues to resolve. Rewrites both teaser
paragraphs shorter, each ending with an outbound cross-link to the
destination built this cycle.

Adds the "Plays — Theatre Teaching Units — Storytelling" eyebrow
(section identity per spec §4.4) and a directory grid of 6 sub-section
cards.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: "Why These Plays Work" manifesto page

**Files:**
- Create: `src/pages/childrens-theatre/why-these-plays-work.astro`

**Content strategy:** if Task 4 imported the source Drive doc "Why These Plays Work: Key Concepts" and staged the cleaned text at `.superpowers/sdd/<workspace>/imports/why-these-plays-work.txt`, adapt that content into the page body. Otherwise use the drafted paragraphs below (all flagged CLIENT REVIEW).

- [ ] **Step 1: Check for imported source text**

Run:
```bash
ls .superpowers/sdd/*/imports/why-these-plays-work.txt 2>/dev/null || echo "NO IMPORT — use drafted content"
```

If a file exists, read it and use its content (editorial markers already stripped by Task 4). If not, use the drafted content below.

- [ ] **Step 2: Create `src/pages/childrens-theatre/why-these-plays-work.astro`**

If real content was imported: adapt it into the H2/paragraph structure below. If not, use this drafted content verbatim:

```astro
---
import ChildrensLayout from '@/layouts/ChildrensLayout.astro';
---

<ChildrensLayout
  title="Why These Plays Work"
  subPage="why-these-plays-work"
  eyebrow="Key Concepts"
  description="The manifesto: why children sit still, why the bare stage matters, and how myth and archetype carry more than any set piece can."
>
  <div class="max-w-2xl space-y-8">
    {/* CLIENT REVIEW: drafted paragraphs below; replace with imported "Why These Plays Work: Key Concepts" content when available. Cherie's burgundy comments have been stripped. */}
    <section>
      <h2>Six hundred silent children</h2>
      <p>
        A DT:FC company can play to a hall of six hundred children and hear a pin drop for the
        whole hour. Not because the children are being told to be quiet &mdash; because the
        material has met them where they are. The plays are built to earn that silence, not to
        demand it.
      </p>
    </section>

    <section>
      <h2>Six million audience members</h2>
      <p>
        Over the arc of the DT:FC lineage &mdash; touring companies, school residencies, sister
        companies on three continents &mdash; the cumulative audience is on the order of six
        million. That reach exists because the plays travel: bare stage, small cast, oral
        language, myth at the center. They fit any room.
      </p>
    </section>

    <section>
      <h2>The bare stage</h2>
      <p>
        No built sets. No elaborate props. A cloak becomes a castle wall, a chair becomes a
        throne, a broom becomes a horse. The convention is that imagination provides everything
        &mdash; and once a child steps into that convention, the whole imaginative apparatus of
        the play belongs to them, not to the production designer.
      </p>
    </section>

    <section>
      <h2>Oral tradition</h2>
      <p>
        These are myth-driven plays. The scripts are shaped for spoken language &mdash; the
        rhythms of oral performance, not the flat cadences of print. Actors of any age find their
        way in through the mouth and the ear before the intellect gets involved.
      </p>
    </section>

    <section>
      <h2>Seven levels of truth</h2>
      <p>
        A DT:FC children&rsquo;s play is legible on multiple levels at once: literal event,
        emotional arc, moral pattern, developmental stage, mythic figure, symbolic action, and
        the sheer joy of the language. Younger audiences track the surface; older audiences and
        adults catch the layers underneath. Nobody feels talked down to.
      </p>
    </section>

    <section>
      <h2>Archetypes</h2>
      <p>
        Universal figures &mdash; the youngest sibling, the wise elder, the trickster, the
        threshold guardian &mdash; carry the plays across cultures and ages. They aren&rsquo;t
        stereotypes; they&rsquo;re archetypes, patterns children recognize without being taught.
        The
        <a href="/childrens-theatre/how-to/archetype-of-one-story/" class="hover:text-clay-500">Archetype of One Story</a>
        guide walks through the eight-station Wayfarer&rsquo;s Journey that most of the plays
        follow.
      </p>
    </section>
  </div>
</ChildrensLayout>
```

- [ ] **Step 3: Grep-verify curly apostrophes**

Run:
```bash
grep -n "'[a-zA-Z]" src/pages/childrens-theatre/why-these-plays-work.astro | grep -v "import\|from '\|const \|Astro\.props"
```

Expected: empty output.

- [ ] **Step 4: Run `pnpm build` — expect clean**

Run:
```bash
pnpm build
```

Expected: `/childrens-theatre/why-these-plays-work/` appears in output.

- [ ] **Step 5: Commit**

```bash
git add src/pages/childrens-theatre/why-these-plays-work.astro
git commit -m "$(cat <<'EOF'
feat(childrens): add Why These Plays Work manifesto page

Six H2 sections covering the six pillars from spec §4.4 item 3: 600
silent kids, 6M audience, bare stage, oral tradition, seven levels of
truth, archetypes. Archetypes section links out to the archetype-of-
one-story how-to guide.

Drafted copy flagged CLIENT REVIEW; if Task 4's Drive import staged
the source doc, adapt that content in place of the drafts. Editorial
burgundy comments stripped per spec discipline.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Honoring Our Guides page

**Files:**
- Create: `src/pages/childrens-theatre/honoring-our-guides.astro`

**Content strategy:** same as Task 13 — use imported text from `.superpowers/sdd/<workspace>/imports/honoring-our-guides.txt` if available; otherwise drafted content below flagged CLIENT REVIEW.

- [ ] **Step 1: Check for imported source text**

Run:
```bash
ls .superpowers/sdd/*/imports/honoring-our-guides.txt 2>/dev/null || echo "NO IMPORT — use drafted content"
```

- [ ] **Step 2: Create `src/pages/childrens-theatre/honoring-our-guides.astro`**

```astro
---
import ChildrensLayout from '@/layouts/ChildrensLayout.astro';
---

<ChildrensLayout
  title="Honoring Our Guides"
  subPage="honoring-our-guides"
  eyebrow="Children&rsquo;s Theatre"
  description="Acknowledging the ancestors, teachers, artists, and children whose work shapes DT:FC&rsquo;s Children&rsquo;s Theatre."
>
  <div class="max-w-2xl space-y-8">
    {/* CLIENT REVIEW: drafted acknowledgements below; replace with imported source content when available. */}
    <section>
      <h2>Oral-tradition ancestors</h2>
      <p>
        Long before the plays were written down, the stories moved from mouth to ear across
        generations. We honor the unnamed storytellers &mdash; the grandmothers, the tribal
        keepers, the traveling singers &mdash; whose work made these myths available to us.
      </p>
    </section>

    <section>
      <h2>Fred Rogers</h2>
      <p>
        Fred Rogers&rsquo; conviction that a child&rsquo;s attention deserves care and slowness
        shapes DT:FC&rsquo;s approach to what we put in front of young audiences. The plays are
        made to meet children where they are, at their pace, without condescension.
      </p>
    </section>

    <section>
      <h2>Chuck and Lola Wilcox</h2>
      <p>
        The Wilcoxes wrote and staged the children&rsquo;s plays that anchor this section &mdash;
        Water of Life, One Seed Child, and the many teaching modules that grew from them.
        Their scripts remain in classroom and touring repertoires decades after their first
        productions.
      </p>
    </section>

    <section>
      <h2>The teachers who first told these stories</h2>
      <p>
        Classroom teachers, drama teachers, and reading specialists carried these plays into
        thousands of school days. Their edits, adaptations, and staging inventions live on inside
        every performance.
      </p>
    </section>

    <section>
      <h2>The children themselves</h2>
      <p>
        The children in every audience and every cast are also our guides. They told the company
        which lines landed, which scenes needed cutting, which characters they wanted to double.
        Every play in the library has been shaped by their honesty.
      </p>
    </section>
  </div>
</ChildrensLayout>
```

- [ ] **Step 3: Grep-verify curly apostrophes**

Run:
```bash
grep -n "'[a-zA-Z]" src/pages/childrens-theatre/honoring-our-guides.astro | grep -v "import\|from '\|const \|Astro\.props"
```

Expected: empty output.

- [ ] **Step 4: Run `pnpm build`, commit**

```bash
pnpm build
git add src/pages/childrens-theatre/honoring-our-guides.astro
git commit -m "$(cat <<'EOF'
feat(childrens): add Honoring Our Guides page

Five H2 sections acknowledging oral-tradition ancestors, Fred Rogers,
Chuck and Lola Wilcox, the teachers, and the children themselves.
Drafted copy flagged CLIENT REVIEW; imported content from the Drive
source doc replaces the drafts when Task 4 has staged it.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Three simple how-to guides (create-a-script, golden-goose, key-elements)

**Files:**
- Create: `src/pages/childrens-theatre/how-to/create-a-script.astro`
- Create: `src/pages/childrens-theatre/how-to/golden-goose.astro`
- Create: `src/pages/childrens-theatre/how-to/key-elements.astro`

**Content strategy:** for each guide, use imported source text from `.superpowers/sdd/<workspace>/imports/<guide-slug>.txt` if available; otherwise the drafted content below.

- [ ] **Step 1: Check for imported source texts**

Run:
```bash
for guide in create-a-script golden-goose key-elements; do
  ls .superpowers/sdd/*/imports/$guide.txt 2>/dev/null && echo "$guide: IMPORTED" || echo "$guide: NO IMPORT — use drafted"
done
```

- [ ] **Step 2: Create `src/pages/childrens-theatre/how-to/create-a-script.astro`**

```astro
---
import HowToGuide from '@/components/childrens/HowToGuide.astro';
---

<HowToGuide title="How to Create a DT:FC Children&rsquo;s Script" currentGuide="create-a-script">
  {/* CLIENT REVIEW: drafted content; adapt from imported Drive doc when Task 4 stages it. */}
  <p>
    A DT:FC children&rsquo;s script starts from a myth or an archetypal tale, not a topical
    concept. The tale carries the shape; the script only has to make the shape playable in the
    room you have.
  </p>

  <h2>1. Pick the source</h2>
  <p>
    Reach for stories that have already survived generations of telling &mdash; folk tales,
    myths, fables, and the tales that Grandmothers reach for when they want a child to lean in.
    If a story has been retold for centuries, it has already passed the test.
  </p>

  <h2>2. Find the eight stations</h2>
  <p>
    Most children&rsquo;s myths follow a Wayfarer&rsquo;s Journey with eight stations
    (Home, Call, Gate In, Road of Trials, Nigredo, Road of Trials II, Gate Out, Return). Mark
    where your story hits each. Some stations may be short lines; some may be full scenes.
    See the <a href="/childrens-theatre/how-to/archetype-of-one-story/">Archetype of One Story</a>
    guide for the full pattern.
  </p>

  <h2>3. Cast with versatility</h2>
  <p>
    Write parts that can be split, shared, or doubled. Every role should be playable by more
    than one performer &mdash; a chorus, a rotation, a Greek-tragedy-style multi-voice. No
    child should have to sit out.
  </p>

  <h2>4. Trust the bare stage</h2>
  <p>
    A cloak, a chair, a broom, a stick. That is your set. Rehearse the play with nothing else,
    and only add a real object when the play refuses to work without it. Nine times out of ten,
    the play would rather have the mime.
  </p>

  <h2>5. Speak it before you write it</h2>
  <p>
    Read every scene aloud &mdash; several times &mdash; before you commit it to paper. If a
    line doesn&rsquo;t sit in a young Player&rsquo;s mouth, cut it.
  </p>
</HowToGuide>
```

- [ ] **Step 3: Create `src/pages/childrens-theatre/how-to/golden-goose.astro`**

```astro
---
import HowToGuide from '@/components/childrens/HowToGuide.astro';
---

<HowToGuide title="Scriptwriting How-To: Facilitating Children Writing a Play (the Golden Goose method)" currentGuide="golden-goose">
  {/* CLIENT REVIEW: drafted content; adapt from imported Drive doc when Task 4 stages it. */}
  <p>
    The Golden Goose method is a scaffolded approach to helping children collaboratively write
    a play. The Facilitator&rsquo;s job is to hold the shape while the children pour in the
    substance.
  </p>

  <h2>The core move</h2>
  <p>
    Sit in a circle. Retell a familiar tale together, one sentence at a time, going around
    the circle. When the tale is over, ask: "What if the goose in this story were golden?
    What if the goose in this story were <em>us</em>?" &mdash; and follow where the children
    take it.
  </p>

  <h2>The Facilitator&rsquo;s discipline</h2>
  <p>
    Take every offer. Even the wildest &mdash; especially the wildest. Note them on a board.
    When the offers slow, look for the shape that has emerged, name the shape back to the
    group, and let them refine.
  </p>

  <h2>The eight stations, again</h2>
  <p>
    The <a href="/childrens-theatre/how-to/archetype-of-one-story/">Wayfarer&rsquo;s Journey</a>
    is a scaffold you can offer once the group is stuck. "So we&rsquo;ve found Home and the
    Call. What happens at the Gate In?" &mdash; and let the children answer.
  </p>

  <h2>When to write it down</h2>
  <p>
    Not until the play works spoken. Draft on paper only after the group can improvise the whole
    arc without notes. Then the writing is a transcription, not a design brief.
  </p>
</HowToGuide>
```

- [ ] **Step 4: Create `src/pages/childrens-theatre/how-to/key-elements.astro`**

```astro
---
import HowToGuide from '@/components/childrens/HowToGuide.astro';
---

<HowToGuide title="Key Elements: Myth, Archetype, Minimalist Language, Repetition" currentGuide="key-elements">
  {/* CLIENT REVIEW: drafted content; adapt from imported Drive doc when Task 4 stages it. */}
  <p>
    Four elements make a DT:FC children&rsquo;s play work. Each one strips something away rather
    than adding &mdash; the play&rsquo;s power lives in what it doesn&rsquo;t include.
  </p>

  <h2>Myth</h2>
  <p>
    Not "a story with a moral," but a shape that predates literacy: the tale of the youngest who
    succeeds where the eldest fails, the tale of the seed that outgrows its keepers, the tale of
    the hero who returns transformed. Myths carry meaning that adults spend lifetimes unpacking
    but children absorb whole.
  </p>

  <h2>Archetype</h2>
  <p>
    Characters that stand for a pattern rather than a personality. The Wise Woman is not a
    biography; she is a function inside the story. Children recognize the function immediately
    because they already know it &mdash; from folk tales, from their own grandmothers, from the
    parts of themselves they haven&rsquo;t named yet.
  </p>

  <h2>Minimalist language</h2>
  <p>
    Short sentences. Concrete nouns. Sparing metaphor. Every word does a job. Adjectives get
    cut. Explanation gets cut. What remains is dense enough to survive being spoken by a
    six-year-old and still land at the back of the hall.
  </p>

  <h2>Repetition</h2>
  <p>
    The tale returns to its own phrases. "And the third time he came to the well&hellip;" The
    ear catches the pattern; the mind knows what&rsquo;s coming; the release when the pattern
    is finally broken is the play&rsquo;s pivot. Repetition is not filler &mdash; it is the
    architecture that makes surprise possible.
  </p>
</HowToGuide>
```

- [ ] **Step 5: Grep-verify curly apostrophes across all 3 files**

Run:
```bash
grep -n "'[a-zA-Z]" src/pages/childrens-theatre/how-to/*.astro | grep -v "import\|from '\|const \|Astro\.props"
```

Expected: empty output.

- [ ] **Step 6: Run `pnpm build` — expect clean**

Run:
```bash
pnpm build
```

Expected: 3 new pages appear in output.

- [ ] **Step 7: Commit**

```bash
git add src/pages/childrens-theatre/how-to/create-a-script.astro src/pages/childrens-theatre/how-to/golden-goose.astro src/pages/childrens-theatre/how-to/key-elements.astro
git commit -m "$(cat <<'EOF'
feat(childrens): add 3 how-to guides (create-a-script, golden-goose, key-elements)

Each wraps in HowToGuide with the correct currentGuide. Drafted copy
flagged CLIENT REVIEW; if Task 4 imported the source Drive docs, those
contents replace the drafts.

The Archetype of One Story guide (with the Wayfarer's Journey Wheel)
lands in Task 16 separately.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: Archetype of One Story guide (with the Wheel)

**Files:**
- Create: `src/pages/childrens-theatre/how-to/archetype-of-one-story.astro`

- [ ] **Step 1: Check for imported source text**

Run:
```bash
ls .superpowers/sdd/*/imports/archetype-of-one-story.txt 2>/dev/null || echo "NO IMPORT — use drafted content"
```

- [ ] **Step 2: Create `src/pages/childrens-theatre/how-to/archetype-of-one-story.astro`**

```astro
---
import HowToGuide from '@/components/childrens/HowToGuide.astro';
import WayfarersJourneyWheel from '@/components/childrens/WayfarersJourneyWheel.astro';
---

<HowToGuide title="Archetype of One Story" currentGuide="archetype-of-one-story">
  {/* CLIENT REVIEW: drafted content; adapt from imported Drive doc when Task 4 stages it. */}
  <p>
    Almost every myth children hear is a variation on one story. The hero starts at Home. A Call
    disturbs the ordinary. A Gate opens; the Road of Trials begins. Something dark happens in
    the middle &mdash; the Nigredo, the burning-down that must occur before transformation. A
    second Road of Trials follows. The Gate closes behind. The hero Returns Home, changed.
  </p>

  <WayfarersJourneyWheel />

  <h2>The eight stations</h2>

  <h3>1. Home</h3>
  <p>
    The ordinary world before the story begins. Establish it in as few strokes as possible so
    the departure carries weight.
  </p>

  <h3>2. Call</h3>
  <p>
    Something arrives &mdash; a messenger, a rumor, a hunger &mdash; that will not let the hero
    stay put. The Call is rarely welcome. Most heroes refuse it at least once.
  </p>

  <h3>3. Gate In</h3>
  <p>
    Crossing the threshold from the ordinary world into the world of the story. The Gate is
    usually guarded: a giant, a river, a wise woman who asks three questions.
  </p>

  <h3>4. Road of Trials</h3>
  <p>
    The first arc of tests, allies, and enemies. The hero learns the shape of the new world.
  </p>

  <h3>5. Nigredo</h3>
  <p>
    The alchemical name for the darkest part &mdash; the death that must happen for
    transformation to be possible. In children&rsquo;s myths, this is often literal darkness:
    the belly of the wolf, the bottom of the well, the sleep from which no one wakes.
  </p>

  <h3>6. Road of Trials II</h3>
  <p>
    After the Nigredo, the hero is different. The tests continue, but the terms have changed;
    the hero is now capable of things they weren&rsquo;t before.
  </p>

  <h3>7. Gate Out</h3>
  <p>
    Crossing back over the threshold, usually with something won &mdash; the Water of Life, the
    stolen fire, the answer to the question.
  </p>

  <h3>8. Return</h3>
  <p>
    Home again, changed. The gift crosses over. The story ends, but the hero&rsquo;s
    transformation persists.
  </p>

  <h2>Using the wheel in your script</h2>
  <p>
    Mark where your source tale hits each station. Some tales visit all eight explicitly; many
    compress two or three into a single scene. That&rsquo;s fine &mdash; the wheel is a shape,
    not a scaffold to follow slavishly.
  </p>
  <p>
    See the
    <a href="/childrens-theatre/how-to/create-a-script/">Create a Script</a>
    guide for how to build a scene out of each station once you&rsquo;ve mapped them.
  </p>
</HowToGuide>
```

- [ ] **Step 3: Grep-verify curly apostrophes**

Run:
```bash
grep -n "'[a-zA-Z]" src/pages/childrens-theatre/how-to/archetype-of-one-story.astro | grep -v "import\|from '\|const \|Astro\.props"
```

Expected: empty output.

- [ ] **Step 4: Run `pnpm build` — expect clean**

Run:
```bash
pnpm build
```

Expected: succeeds. The page renders the Wheel SVG.

- [ ] **Step 5: Commit**

```bash
git add src/pages/childrens-theatre/how-to/archetype-of-one-story.astro
git commit -m "$(cat <<'EOF'
feat(childrens): add Archetype of One Story guide with the Wayfarer's Journey Wheel

Embeds <WayfarersJourneyWheel /> centrally. Prose walks through each
of the 8 stations (Home, Call, Gate In, Road of Trials, Nigredo, Road
of Trials II, Gate Out, Return) with an H3 per station.

Drafted content flagged CLIENT REVIEW; adapt from imported Drive doc
when Task 4 has staged it.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: Plays library index (with series chip filter)

**Files:**
- Create: `src/pages/childrens-theatre/plays.astro`

**Behavior:** shows unique `series` values as clickable chips above the ScriptCard grid. Chips toggle `?series=<slug>` in the URL via `history.replaceState` (mirrors Cycle 3's themes page pattern).

- [ ] **Step 1: Create `src/pages/childrens-theatre/plays.astro`**

```astro
---
import ChildrensLayout from '@/layouts/ChildrensLayout.astro';
import { getCollection } from 'astro:content';
import ScriptCard from '@/components/scripts/ScriptCard.astro';

const entries = (await getCollection('scripts'))
  .filter((e) => e.data.library === 'childrens-plays')
  .sort((a, b) => a.data.title.localeCompare(b.data.title));

// Unique series values found in the collection (drops undefined)
const seriesValues = Array.from(
  new Set(entries.map((e) => e.data.series).filter((s): s is string => !!s)),
).sort();

const seriesSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
---

<ChildrensLayout
  title="Plays"
  subPage="plays"
  eyebrow="Script library"
  description="Water of Life, One Seed Child, The Treasure Inside, Aesop&rsquo;s Fables, Conquering the Sun."
>
  <section class="max-w-2xl">
    <h2 class="font-display text-2xl">Children&rsquo;s plays</h2>
    <p class="text-ink-700 mt-2 text-sm leading-relaxed">
      Standalone plays and series &mdash; bare stage, versatile casting, myth-driven. Filter by
      series below.
    </p>
  </section>

  {
    seriesValues.length > 0 && (
      <div class="mt-6 flex flex-wrap gap-2" data-series-chips>
        <button
          type="button"
          data-series=""
          class="inline-flex items-center rounded-[var(--radius-chip)] bg-ivory-200 text-ink-700 aria-[pressed=true]:bg-clay-500 aria-[pressed=true]:text-ivory-50 px-3 py-0.5 text-xs font-medium"
          aria-pressed="true"
        >
          All
        </button>
        <button
          type="button"
          data-series="standalone"
          class="inline-flex items-center rounded-[var(--radius-chip)] bg-mustard-200 text-ink-700 aria-[pressed=true]:bg-clay-500 aria-[pressed=true]:text-ivory-50 px-3 py-0.5 text-xs font-medium"
          aria-pressed="false"
        >
          Standalone
        </button>
        {seriesValues.map((s) => (
          <button
            type="button"
            data-series={seriesSlug(s)}
            data-series-label={s}
            class="inline-flex items-center rounded-[var(--radius-chip)] bg-mustard-200 text-ink-700 aria-[pressed=true]:bg-clay-500 aria-[pressed=true]:text-ivory-50 px-3 py-0.5 text-xs font-medium"
            aria-pressed="false"
          >
            {s}
          </button>
        ))}
      </div>
    )
  }

  {
    entries.length === 0 ? (
      <p class="text-ink-500 mt-8 italic">This library is being populated &mdash; check back soon.</p>
    ) : (
      <ul class="mt-8 grid list-none gap-4 md:grid-cols-2 lg:grid-cols-3" data-series-grid>
        {entries.map((entry) => (
          <li data-entry-series={entry.data.series ? seriesSlug(entry.data.series) : 'standalone'}>
            <ScriptCard entry={entry} />
          </li>
        ))}
      </ul>
    )
  }
</ChildrensLayout>

<script is:inline>
  (function initSeriesFilter() {
    const chipContainer = document.querySelector('[data-series-chips]');
    const grid = document.querySelector('[data-series-grid]');
    if (!chipContainer || !grid) return;
    const chips = Array.from(chipContainer.querySelectorAll('button[data-series]'));
    const items = Array.from(grid.querySelectorAll('li[data-entry-series]'));

    const applyFilter = (selected) => {
      chips.forEach((c) => {
        c.setAttribute('aria-pressed', c.getAttribute('data-series') === selected ? 'true' : 'false');
      });
      items.forEach((li) => {
        const s = li.getAttribute('data-entry-series') || '';
        li.hidden = selected !== '' && s !== selected;
      });
    };

    const initial = new URLSearchParams(window.location.search).get('series') || '';
    applyFilter(initial);

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const series = chip.getAttribute('data-series') || '';
        applyFilter(series);
        const url = new URL(window.location.href);
        if (series) url.searchParams.set('series', series);
        else url.searchParams.delete('series');
        history.replaceState(null, '', url.toString());
      });
    });
  })();
</script>
```

- [ ] **Step 2: Grep-verify curly apostrophes**

Run:
```bash
grep -n "'[a-zA-Z]" src/pages/childrens-theatre/plays.astro | grep -v "import\|from '\|const \|getCollection('\|seriesSlug\|new Set\|Array\.from\|filter((\|new URLSearchParams\|new URL\|history\|window\|document\|forEach\|Astro\.props"
```

Expected: empty output.

- [ ] **Step 3: Run `pnpm build` — expect clean**

Run:
```bash
pnpm build
```

Expected: `/childrens-theatre/plays/` renders. If series chips: check they render (page has at least one entry with `series` set — Task 3's Aesop's Fables placeholder).

- [ ] **Step 4: Commit**

```bash
git add src/pages/childrens-theatre/plays.astro
git commit -m "$(cat <<'EOF'
feat(childrens): add Plays library index with series chip filter

Renders unique series values found in the collection as clickable chips
above the ScriptCard grid, plus "All" and "Standalone" chips. Chips
toggle URL query param (?series=<slug>) via history.replaceState;
deep-linkable and browser back/forward-safe. Mirrors Cycle 3's themes
page pattern.

Empty-state italic message if the library has zero entries.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 18: Teaching Modules library index

**Files:**
- Create: `src/pages/childrens-theatre/teaching-modules.astro`

- [ ] **Step 1: Create `src/pages/childrens-theatre/teaching-modules.astro`**

```astro
---
import ChildrensLayout from '@/layouts/ChildrensLayout.astro';
import LibraryIndex from '@/components/scripts/LibraryIndex.astro';
---

<ChildrensLayout
  title="Teaching Modules"
  subPage="teaching-modules"
  eyebrow="Script library"
  description="Plays prepared as full teaching units &mdash; with framing activities, discussion prompts, and extensions."
>
  <LibraryIndex
    library="teaching-modules"
    title="Teaching Modules library"
    intro="A teaching module is a play plus everything a Facilitator needs around it &mdash; classroom framing, discussion prompts, extension activities. Use them for a class project, a school residency, or a summer program."
  />
</ChildrensLayout>
```

- [ ] **Step 2: Verify `LibraryIndex` accepts the new library value**

`LibraryIndex.astro` takes `library` as a prop typed as the enum. Since Task 3 added `teaching-modules` to `SCRIPT_LIBRARIES`, the enum now includes it. Check that `LibraryIndex.astro`'s `Props` interface uses the enum type (rather than a hardcoded string-literal-union). If it hardcodes the old five libraries, extend the type:

Read `src/components/scripts/LibraryIndex.astro`. If `Props` declares `library: 'soliloquies' | 'scenes' | 'themes' | 'cuttings' | 'childrens-shakespeare'`, extend it to include `'childrens-plays' | 'teaching-modules'`, OR (better) change the type to reference the schema's inferred enum. If the type already uses the schema enum, no change needed.

If a type update is required, apply it in a small Edit.

- [ ] **Step 3: Grep-verify curly apostrophes and run build**

Run:
```bash
grep -n "'[a-zA-Z]" src/pages/childrens-theatre/teaching-modules.astro | grep -v "import\|from '"
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/childrens-theatre/teaching-modules.astro src/components/scripts/LibraryIndex.astro
git commit -m "$(cat <<'EOF'
feat(childrens): add Teaching Modules library index

Simple LibraryIndex render filtered to library === 'teaching-modules'.
Also extends LibraryIndex Props type to accept the two new library
enum values from Task 3 if it wasn't already using the shared enum.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 19: Shakespeare-for-Children cross-link wrapper page

**Files:**
- Create: `src/pages/childrens-theatre/shakespeare-for-children.astro`

**Semantics:** filters `getCollection('scripts')` to `library === 'childrens-shakespeare'` and renders them with Children's-Theatre context. Individual detail URLs still resolve to `/shakespeare/scripts/[slug]/` (canonical). Uses `scriptHref` for card link URLs, which routes childrens-shakespeare to Shakespeare-scoped URLs.

- [ ] **Step 1: Create `src/pages/childrens-theatre/shakespeare-for-children.astro`**

```astro
---
import ChildrensLayout from '@/layouts/ChildrensLayout.astro';
import { getCollection } from 'astro:content';
import ScriptCard from '@/components/scripts/ScriptCard.astro';

const entries = (await getCollection('scripts'))
  .filter((e) => e.data.library === 'childrens-shakespeare')
  .sort((a, b) => a.data.title.localeCompare(b.data.title));
---

<ChildrensLayout
  title="Shakespeare for Children"
  subPage="shakespeare-for-children"
  eyebrow="Cross-section"
  description="Shakespeare adaptations chosen and shaped for young Players &mdash; the same discipline as the rest of Children&rsquo;s Theatre applied to the canon."
>
  <div class="max-w-2xl">
    <p class="text-ink-700 text-base leading-relaxed">
      DT:FC&rsquo;s children&rsquo;s Shakespeare uses the same conventions as the other plays in
      this section: bare stage, versatile casting, spoken language before written. The adaptations
      themselves live in the Shakespeare section, where each script has full production notes,
      staging, and cutting choices.
    </p>
    <p class="text-ink-500 mt-4 text-sm">
      Prefer to browse from the Shakespeare side?
      <a href="/shakespeare/childrens-shakespeare/" class="hover:text-clay-500">
        Go to the Shakespeare section&rsquo;s Children&rsquo;s library &rarr;
      </a>
    </p>
  </div>

  {
    entries.length === 0 ? (
      <p class="text-ink-500 mt-8 italic">No children&rsquo;s Shakespeare adaptations available yet.</p>
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
</ChildrensLayout>
```

- [ ] **Step 2: Grep-verify curly apostrophes and run build**

Run:
```bash
grep -n "'[a-zA-Z]" src/pages/childrens-theatre/shakespeare-for-children.astro | grep -v "import\|from '\|const \|getCollection('"
pnpm build
```

Expected: `grep` empty; build clean; the childrens-shakespeare Cycle-3 placeholder entry from Task 3 renders as a ScriptCard whose link points at `/shakespeare/scripts/…` (via `scriptHref`).

- [ ] **Step 3: Commit**

```bash
git add src/pages/childrens-theatre/shakespeare-for-children.astro
git commit -m "$(cat <<'EOF'
feat(childrens): add Shakespeare for Children wrapper page

Filters getCollection('scripts') to library === 'childrens-shakespeare'
and renders ScriptCards with Children's-Theatre context (breadcrumb,
sub-nav highlight). Individual detail URLs still resolve to
/shakespeare/scripts/[slug]/ via scriptHref — no URL duplication.

Cross-link back to /shakespeare/childrens-shakespeare/ for users who
prefer browsing from the Shakespeare side.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 20: Script detail dynamic route

**Files:**
- Create: `src/pages/childrens-theatre/scripts/[slug].astro`

**Behavior:** dynamic route for all Children's Theatre script libraries. `getStaticPaths` filters `getCollection('scripts')` to entries whose library is `childrens-plays` or `teaching-modules`. Renders `<ScriptDetail entry={entry}><Content /></ScriptDetail>` inside `<ChildrensLayout>`, marking the correct sub-nav item.

- [ ] **Step 1: Create `src/pages/childrens-theatre/scripts/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import ChildrensLayout from '@/layouts/ChildrensLayout.astro';
import ScriptDetail from '@/components/scripts/ScriptDetail.astro';

const CHILDRENS_LIBRARIES = new Set(['childrens-plays', 'teaching-modules']);

export async function getStaticPaths() {
  const entries = await getCollection('scripts');
  return entries
    .filter((entry) => CHILDRENS_LIBRARIES.has(entry.data.library))
    .map((entry) => ({
      params: { slug: entry.id.replace(/\.mdx?$/, '') },
      props: { entry },
    }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);

// Map library to sub-nav key so the primary sub-nav highlights correctly
const subPage = entry.data.library === 'teaching-modules' ? 'teaching-modules' : 'plays';
---

<ChildrensLayout
  title={entry.data.title}
  subPage={subPage}
  eyebrow={entry.data.play}
  description={entry.data.title}
>
  <ScriptDetail entry={entry}>
    <Content />
  </ScriptDetail>
</ChildrensLayout>
```

Note: the `CHILDRENS_LIBRARIES` constant here duplicates the one in `scriptHref`. Not ideal but acceptable — the two constants exist for different purposes (routing decision vs. static-path filter). If a third consumer emerges, factor to `src/lib/script-libraries.ts`.

- [ ] **Step 2: Run `pnpm build` — expect one page per Children's Theatre script entry**

Run:
```bash
pnpm build
```

Expected: `/childrens-theatre/scripts/sample-childrens-play-water-of-life/`, `/childrens-theatre/scripts/sample-childrens-play-aesop-fox-and-grapes/`, `/childrens-theatre/scripts/sample-teaching-module-theseus/` (or real slug equivalents post-Task-4).

- [ ] **Step 3: Grep-verify apostrophes (minimal file, but check)**

Run:
```bash
grep -n "'[a-zA-Z]" src/pages/childrens-theatre/scripts/\[slug\].astro | grep -v "import\|from '\|const \|new Set\|getCollection('\|Astro\.props"
```

Expected: empty output.

- [ ] **Step 4: Commit**

```bash
git add src/pages/childrens-theatre/scripts/\[slug\].astro
git commit -m "$(cat <<'EOF'
feat(childrens): add /childrens-theatre/scripts/[slug]/ dynamic route

Filters scripts collection to library ∈ {childrens-plays, teaching-
modules}. Wraps in ChildrensLayout marking the correct sub-nav (plays
vs teaching-modules). ScriptDetail renders header + MDX body + the 5
new optional sections (source materials, author intentions, what to
watch, imagery gallery, aiPrompt) conditionally.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 21: Print stylesheet — imagery grid single-column addition

**Files:**
- Modify: `src/styles/print.css`

- [ ] **Step 1: Add the print rule**

Read `src/styles/print.css`. At the bottom (still inside the `@media print` block if there is one, or as a new rule), append:

```css
@media print {
  .imagery-grid {
    grid-template-columns: 1fr !important;
  }
}
```

If `print.css` is already inside an outer `@media print` block for other rules, add the `.imagery-grid` rule inside that same block instead of nesting.

- [ ] **Step 2: Run `pnpm build` — expect clean**

Run:
```bash
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/print.css
git commit -m "$(cat <<'EOF'
style(print): imagery gallery prints as a single column

@media print { .imagery-grid { grid-template-columns: 1fr; } } so
children's-drawings prints one-per-page-width for legibility rather
than 2-column tight.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 22: Extend Playwright smoke test

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Read current smoke test**

Run:
```bash
cat tests/e2e/smoke.spec.ts
```

Note the current final assertions (Shakespeare block, console-error listener at the end).

- [ ] **Step 2: Add Children's Theatre block before the console-error listener section**

Insert:

```typescript
  // Children's Theatre section — landing, sub-nav, how-to guide with wheel, library, script detail
  await page.goto('/childrens-theatre/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText("Children");
  await expect(page.getByRole('navigation', { name: /Children.*Theatre section/i })).toBeVisible();

  // Navigate to Archetype of One Story (via directory grid card, or direct)
  await page.goto('/childrens-theatre/how-to/archetype-of-one-story/');
  await expect(page.getByRole('heading', { level: 1, name: /Archetype of One Story/i })).toBeVisible();
  // Wheel SVG present
  const wheel = page.locator('svg[role="img"][aria-labelledby*="wjw"]');
  await expect(wheel).toBeVisible();
  await expect(wheel.locator('title')).toContainText(/Wayfarer/i);

  // Navigate to Plays library
  await page.goto('/childrens-theatre/plays/');
  await expect(page.getByRole('heading', { level: 2, name: /Children.*plays/i })).toBeVisible();

  // Follow first script card into detail (Task 4 may or may not have populated real content)
  const firstCard = page.locator('article a').first();
  await firstCard.click();
  await expect(page).toHaveURL(/\/childrens-theatre\/scripts\/[^/]+\/?/);
  await expect(page.getByRole('button', { name: /Print this script/i })).toBeVisible();
```

- [ ] **Step 3: Run smoke test**

Run:
```bash
pnpm test:e2e
```

Expected: PASS. If the "First card" click fails because no Children's Theatre script exists yet, check that Task 3's placeholders landed (there should be at least 2 childrens-plays entries).

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "$(cat <<'EOF'
test(e2e): extend smoke test for Children's Theatre section

Adds assertions for the landing (h1 + sub-nav), the Archetype of One
Story how-to guide (with Wheel SVG visible), the Plays library index,
and one script detail with print button.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 23: Update CLAUDE.md + auto-memory + follow-ups

**Files:**
- Modify: `CLAUDE.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_followups.md`

- [ ] **Step 1: Update `CLAUDE.md`**

Read the current file. Under **Stack**, add:
```markdown
- Children's Theatre scripts extend the shared `scripts` collection (Cycle 4) with two additional library enum values and six optional frontmatter fields.
```

Under **Key conventions**, add three paragraphs:

```markdown
**Children's Theatre content.** `scripts` collection library enum now includes `childrens-plays` and `teaching-modules`. Six optional frontmatter fields are Children's-Theatre-scoped: `sourceMaterials`, `authorIntentions`, `whatToWatch`, `imagery` (array of `{src, alt, credit?}`), `aiPrompt` (for AI-cowritten plays like The Treasure Inside), `series` (grouping for chip filter — e.g., "Aesop's Fables", "Conquering the Sun"). Shakespeare entries leave these undefined and render unchanged.

**Imagery files** live at `/public/images/childrens-theatre/<slug>/` with ASCII kebab-case filenames. Frontmatter `imagery[i].src` is the full path starting with `/images/`.

**Children's Theatre sub-nav** (`src/lib/childrens-nav.ts`) drives the persistent sub-nav rendered by `src/layouts/ChildrensLayout.astro` on every `/childrens-theatre/*` page.

**`scriptHref` helper** (`src/lib/script-href.ts`) is the canonical source of truth for a script entry's detail URL — routes Shakespeare libraries to `/shakespeare/scripts/`, Children's Theatre libraries to `/childrens-theatre/scripts/`. Always import; never hardcode.
```

Under **Adding a game** or nearby, add:
```markdown
**Adding a children's play.** Drop `src/content/scripts/<slug>.mdx` with `library` set to `childrens-plays` (or `teaching-modules`). Optional frontmatter: `series` for grouping (Aesop's Fables / Conquering the Sun); `sourceMaterials`, `authorIntentions`, `whatToWatch` for facilitator metadata; `imagery` array for children's drawings (each item needs `src` and `alt`). Body sections `## Production Notes` / `## Script` / `## Facilitator Notes`.
```

Under **Deferred / TODO markers**, add:
```markdown
- `pairChildren` helper removed in Cycle 4 (was unused; SideBySideText composition works via CSS grid auto-flow).
```

Under repo structure, mention new `src/components/scripts/` (post-refactor) and `src/components/childrens/` directories.

- [ ] **Step 2: Update `project_dtfc_cycles.md`**

Read the current file. Add a Cycle 4 line after the Cycle 3 entry:

```markdown
Cycle 4 shipped 2026-08-11 (Children's Theatre section: 9 sub-routes, extended scripts schema with childrens-plays + teaching-modules libraries + 6 optional frontmatter fields, refactored ScriptCard/ScriptDetail/LibraryIndex to src/components/scripts/, Wayfarer's Journey Wheel SVG on the Archetype of One Story how-to guide, first content imagery under /public/images/childrens-theatre/, scriptHref helper as canonical URL source, pairChildren cleanup folded in).
```

Update the roadmap:
- Cycle 5 — Legacy (founders, essays, interactive Timeline)
- Cycle 6 — Community + forms + newsletter ESP wiring (also wires Ask Shakespeare form)
- Cycle 7 — Cross-site search (Pagefind) + analytics + launch checklist
- Cycle N — Web 2.0 items (deferred per source spec §5)

- [ ] **Step 3: Append to `project_dtfc_followups.md`**

Add at the bottom:

```markdown
**Cycle 4 (2026-08-11) added follow-ups:**
- If Task 4 was skipped (no Drive link), the 3 placeholder Children's Theatre scripts remain; schedule Drive import as immediate follow-up.
- CLIENT REVIEW markers across Why These Plays Work, Honoring Our Guides, and 4 how-to guide pages — bundle for Lola/Laurie review.
- The Treasure Inside AI prompt: `aiPrompt` frontmatter field exists; if the Drive doc didn't include the prompt, add it in a small content-only follow-up.
- Ian's dragon and other children's drawings: imagery arrays render only when populated; missing images are silently skipped. Follow-up captures any pending scans.
- Designer-polished Wayfarer's Journey Wheel SVG: current version is procedural. If Desirae produces a hand-designed replacement, drop into src/components/childrens/WayfarersJourneyWheel.astro.
- "600 silent kids" and "six million audience" claims in the manifesto page may need an attribution/provenance line — pending client confirmation.
- On-demand PDF downloads (beyond print stylesheet): spec §4.4 item 5 mentions "printable/downloadable PDF." Print button ships this cycle; PDF generation is deferred.
- Consider adding a curly-apostrophe check to scripts/check-prohibited-text.mjs — Cycle 3 hit 6 apostrophe fix-rounds; Cycle 4 kept per-task grep verification which caught issues at implementer time but still needed one review-driven fix. Automation would prevent recurrence in Cycles 5-7.
```

- [ ] **Step 4: Commit CLAUDE.md only**

Memory files live outside the repo — not committed.

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs: update CLAUDE.md for Cycle 4 Children's Theatre section

Documents the scripts schema extension (childrens-plays + teaching-
modules libraries + 6 optional fields), the imagery file convention
(/public/images/childrens-theatre/<slug>/, ASCII kebab-case), the
CHILDRENS_NAV sub-nav library, the ChildrensLayout wrapper, and the
scriptHref helper as canonical URL source of truth. Adds "Adding a
children's play" instructions. Notes pairChildren removal in Cycle 4.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Final Verification (not a separate commit — the executing session runs these)

After Task 23, before offering to merge to `main`, run:

- `pnpm check` — 0 errors.
- `pnpm build` — succeeds; `check:concepts` and `check:prohibited` both print `✓`. 60+ pages built (was 52 at Cycle 3 close, +9 new routes above, +N script detail pages depending on Task 4 outcomes).
- `pnpm test` — all Vitest suites green (existing + extended `shakespeare.test.ts` + new `script-href.test.ts`; `pair-children.test.ts` removed).
- `pnpm test:e2e` — Playwright smoke test green.
- Manual pass in `pnpm dev`:
  - `/childrens-theatre/` — landing with sub-nav, ReflectivePrompt, directory grid.
  - `/childrens-theatre/why-these-plays-work/` — 6 pillars visible.
  - `/childrens-theatre/plays/?series=aesop-s-fables` — chip filter narrows entries; back-button restores.
  - `/childrens-theatre/how-to/archetype-of-one-story/` — Wayfarer's Journey Wheel visible; caption lists 8 stations.
  - `/childrens-theatre/scripts/<any-slug>/` — detail page with print button; imagery gallery (if entry has imagery); aiPrompt block (if The Treasure Inside was imported).
  - `/childrens-theatre/shakespeare-for-children/` — filters childrens-shakespeare entries; card links go to `/shakespeare/scripts/[slug]/`.
  - Regression: `/shakespeare/*` routes still render (the component refactor smoke check).

When all clean, offer the user the merge:
```bash
git checkout main && git merge --no-ff cycle-4-childrens-theatre -m "Merge cycle-4-childrens-theatre (Children's Theatre section deep-build per spec §4.4)"
```

---
