# DT:FC Cycle 12 — Shakespeare Libraries & Wrapper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the six under-populated Shakespeare libraries into working state with real launch inventory, ship the two v2-only-conviction lifts (DT:FC 2-3 Person Scene wrapper as flagship visual component + audience cue cards as named DT:FC feature), extend the Soliloquies library to ~25 speeches with play/character/register filter UI, ship Marta Barnard's 30-Minute MSND (flagship cutting) with Laurie O'Brien's Magic and the Supernatural theme byline, build the "Never memorize" method-box shared component, re-file the Mechanicals script to Children's Shakespeare with verified Folger citations, add the Spanish "Obras de Teatro Shakespeare para Niños en Español" shelf shell, host the Hawaiian Pidgin audio + wire the mobile SideBySide toggle, host the two 1970s archival scans with Legacy cross-links, extend the prohibited-text guardrail with 15 new §7 patterns, and fix the small ship bugs the Cycle 11 audit surfaced.

**Architecture:** Cycle 11 shipped the framing pages, doctrine, cross-section contracts, and two New Plays placeholder entries. Cycle 12 fills the six under-populated libraries with content + adds two new components (`DtfcSceneUnit.astro`, `CueCardsExplainer.astro`, `NeverMemorizeBox.astro`) + one Preact filter island (`SoliloquyFilters.tsx`) + one new route (`/shakespeare/scenes/dtfc/[slug]`). Schema extends `scriptsSchema` with Nenno-unit fields, soliloquy filter fields, and a `draft` gate. Routing precedence: `nennoUnit === true` → `/shakespeare/scenes/dtfc/<slug>/`; else library-based routing (unchanged). Content authoring pulls from Google Drive `4-Shakespeare` subfolders via MCP; entries where source is unreachable ship with `draft: true` + a Track P bundle item for client to re-share.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@theme` tokens), TypeScript strict, MDX content collections with Zod schemas, Preact (existing dependency), Vitest, Playwright, `@axe-core/playwright`, Pagefind, Google Drive MCP for content sourcing.

**Spec:** `/Users/cnote/projects/dtfc/docs/superpowers/specs/2026-08-13-dtfc-cycle12-shakespeare-libraries-design.md`

## Global Constraints

- **Branch:** all work on `cycle-12-shakespeare-libraries`. Merge to `main` at cycle end uses `git merge --no-ff` per the branching workflow.
- **Package manager:** `pnpm` only. Commands: `pnpm dev`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm check:prohibited`, `pnpm check:folger` (new this cycle).
- **Node module type:** `"type": "module"` — ESM everywhere.
- **No hex codes in components** — colors come from tokens in `src/styles/tokens.css`. The `DtfcSceneUnit` wrapper chrome uses existing `--color-tip-bg` / `--color-tip-border` tokens (from Cycle 10 PRC callouts) so no new tokens land this cycle. `.possible-cut` reuses the same token family via `color-mix()`.
- **Vocabulary:** "Players" (never "actors"), "Facilitator" (never "leader"), "Players Resource Center" (full), "Children's Theatre" (curly apostrophe). "Chuck Wilcox" (not "Charles"; Cycle 11 unified — do not regress).
- **Curly apostrophes in all prose** — enforced by `scripts/check-prohibited-text.mjs` in `pnpm build`. Use `&rsquo;` or U+2019 (’). Hawaiian ʻokina (U+02BB, `ʻ`) is a distinct character and must be preserved in Colloquial Pidgin content — the guardrail doesn't distinguish, so keep ʻokina strings intact.
- **Zod imports use `astro/zod`**, not bare `zod`.
- **Editorial stripping rules** (v2 spec §7 — 15 additions enforced by Task 3): the following MUST NOT appear in built output — `(Missy - edit)`, `(Needs Internal Edits)`, `(Check EDIT)`, `(Lola to Do)`, `needs last scenes`, `Newsletter #` as H1, Short Speeches placeholder fragments (`Act x, l y`, `Helena 0r the other one`, `Maybe from of one or more of the Fools'`), `Speechs` (typo), `Theseua`/`Ardiane`/`Minoatuar` (typos), Falstaff-description-on-Horatio copy-paste guards (`Prince Hal alter-father`, `Large Person in every way`).
- **Source-faithfulness policies** (v2 spec §1 + §5): keep quoted pedigree verbatim (Barnard's University Hill Elementary, Laurie O'Brien's byline, Linda Nenno's Texas State). Never invent Shakespeare text — verify against Drive source. Placeholder entries ship with `draft: true` OR body-level "content pending — contact us" language. Preserve v2's audience-participation framing on cue cards (Poor Theatre inheritance, not incidental stage direction).
- **Nenno wrapper visual identity** — the `DtfcSceneUnit` component IS the product per v2 §1.5. Every wrapped unit renders the wrapper chrome (border-left accent, tinted background, eyebrow badge, nested Shakespeare-text inner box). Do not simplify or generic-ify; the distinctiveness IS the pedagogy.
- **Evaluation-ritual default** — `'liked-wonder'` (Nenno phrasing) when `evaluationRitual` unset. Track P bundle #2 asks client to resolve; do not block ship on the resolution.
- **Nenno-route precedence** — `nennoUnit === true` routes to `/shakespeare/scenes/dtfc/<slug>/` regardless of `library` value. This ordering matters in `scriptHref()`.
- **Draft-flag semantics** — `scriptsSchema.draft === true` OR `askShakespeareSchema.draft === true` hides the entry from index-grid rendering in production builds; detail routes emit but client-side redirect to the index when `import.meta.env.PROD && data.draft === true`. Dev + `?draft=1` query bypass.
- **Commit granularity:** one commit per task deliverable. Content-batch tasks (T8, T12) commit per group when convenient (per-2 Nenno units, per-5 soliloquies). Commit messages authored `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` via HEREDOC.
- **Drive-source unavailability** — if a required source doc is inaccessible during a content task, ship the entry with `draft: true` + placeholder body + add to Track P bundle. Do NOT hallucinate Shakespeare text or Nenno wrapper content.

---

## File Map

**Create:**
- `src/components/shakespeare/DtfcSceneUnit.astro`
- `src/components/shakespeare/CueCardsExplainer.astro`
- `src/components/shakespeare/NeverMemorizeBox.astro`
- `src/components/scripts/SoliloquyFilters.tsx`
- `src/pages/shakespeare/scenes/dtfc/[slug].astro`
- `src/styles/scenes.css`
- `scripts/check-folger-links.mjs`
- 8 Nenno unit MDXs under `src/content/scripts/*-nenno.mdx`
- 5 raw Pairs scene MDXs under `src/content/scripts/`
- `src/content/scripts/battle-of-the-sexes-theme.mdx` (replaces sample)
- `src/content/scripts/magic-and-the-supernatural-theme.mdx`
- `src/content/scripts/thirty-minute-msnd-barnard.mdx`
- `src/content/scripts/twenty-minute-rj-in-progress.mdx` (rename from sample)
- `src/content/scripts/short-speeches-childrens.mdx`
- `src/content/scripts/henry-vi-childrens-shakespeare.mdx`
- 23 soliloquy MDXs under `src/content/scripts/`
- `public/audio/midsummah-pidgin-paka.mp4` (fetched from Drive)
- `public/legacy/shakespeare-archive/fools-and-fooling-1970s.pdf` (fetched from Drive)
- `public/legacy/shakespeare-archive/pretenders-1977.pdf` (fetched from Drive)
- `public/images/ask-shakespeare/shakespeare-column-graphic.jpg` (conditional; fetched from Drive)
- `docs/client-reviews/2026-08-13-cycle12-shakespeare-libraries-review.md`
- `tests/unit/dtfc-scene-unit.test.ts`
- `tests/unit/nenno-units-coverage.test.ts`
- `tests/unit/soliloquy-schema.test.ts`
- `tests/unit/soliloquy-filter-fields.test.ts`
- `tests/unit/spanish-shelf.test.ts`
- `tests/unit/ask-shakespeare-draft.test.ts`
- `tests/unit/folger-links.test.ts`
- `tests/unit/draft-flag.test.ts`
- `tests/unit/nenno-routing.test.ts`

**Modify:**
- `src/lib/content-schemas.ts` — Nenno + Soliloquy + draft fields
- `src/lib/script-href.ts` — Nenno routing precedence
- `src/components/shakespeare/AskShakespeareForm.astro` — `id="form"`
- `src/components/shakespeare/AskShakespeareCard.astro` — draft chip + optional thumbnail
- `src/components/shakespeare/SideBySideText.astro` — mobile view toggle
- `src/components/scripts/ScriptCard.astro` — register/gender chips + `data-*` attrs
- `src/pages/shakespeare/scenes.astro` — DT:FC-scenes cluster + Nenno testimonial slot + Mechanicals link
- `src/pages/shakespeare/alternatives.astro` — Alt Four trade-offs + Sister "last-minute" + Mechanicals link
- `src/pages/shakespeare/cuttings.astro` — `<CueCardsExplainer />` mount
- `src/pages/shakespeare/themes.astro` — archival section + Legacy timeline cross-link
- `src/pages/shakespeare/soliloquies.astro` — `<SoliloquyFilters client:idle />` + `<NeverMemorizeBox />`
- `src/pages/shakespeare/childrens-shakespeare.astro` — `<NeverMemorizeBox />` + Spanish shelf + Mechanicals cross-link
- `src/pages/shakespeare/colloquial/index.astro` — verbatim "Carrying on that tradition" paragraph
- `src/pages/shakespeare/colloquial/[slug].astro` — transcript-statement gating (already conditional; now triggered)
- `src/pages/shakespeare/honoring-our-guides.astro` — prose fixes L106 + L118
- `src/pages/shakespeare/ask-shakespeare/index.astro` — draft chip render
- `src/pages/shakespeare/ask-shakespeare/[slug].astro` — draft-gate redirect
- `src/content/ask-shakespeare/ask-shakespeare-5-censorship.mdx` — `draft: true`
- `src/content/scripts/mechanicals-scenes-a-midsummer-nights-dream.mdx` — library re-file + Folger URLs
- `src/content/scripts/sample-theme-battle-of-the-sexes.mdx` — replaced (see Create)
- `src/content/scripts/sample-cutting-romeo-juliet.mdx` — renamed (see Create)
- `src/content/colloquial/one-uddah-midsummah.mdx` — audio frontmatter + 2002 attribution
- `src/data/landing.ts` — IDEA_TWO answer direct-to-form
- `src/data/testimonials.ts` — append Nenno entry
- `src/data/timeline.json` — 1977 entry reverse cross-link
- `src/styles/callouts.css` — verify `.callout-tradeoffs` (Cycle 11 added; else add)
- `scripts/check-prohibited-text.mjs` — 15 new PATTERNS
- `package.json` — add `check:folger` script
- `tests/e2e/smoke.spec.ts` — extend with ~12 new checkpoints
- `tests/unit/scripts-schema.test.ts` — assert new fields optional
- `tests/unit/script-href.test.ts` — Nenno routing precedence
- `tests/unit/shakespeare-nav.test.ts` — unchanged (10 items)
- `CLAUDE.md` — Cycle 12 conventions

**Auto-memory updates (end of cycle):** `project_dtfc_cycles.md`, `project_dtfc_followups.md`.

---

## Task 1: Extend `scriptsSchema` with Nenno + Soliloquy + draft fields

**Files:**
- Modify: `src/lib/content-schemas.ts`
- Modify: `tests/unit/scripts-schema.test.ts`
- Create: `tests/unit/draft-flag.test.ts`

**Interfaces produced:**
- `scriptsSchema` accepts (all optional): `draft: boolean`, `nennoUnit: boolean`, `chanceCasting: string`, `pronunciations: Record<string,string>`, `characterOneLiners: Record<string,string>`, `competencyReflection: string[]` (1-5), `evaluationRitual: 'liked-wonder' | 'liked-wish'`, `sceneNotes: string`, `difficultyTag: 'beginner' | 'intermediate' | 'advanced'`, `register: 'comic' | 'dramatic' | 'villain' | 'grief'`, `speakerGender: 'female' | 'male' | 'nonbinary' | 'unspecified'`, `actScene: { act: string, scene: string }`
- `askShakespeareSchema` accepts `draft: boolean` (default false).
- All existing entries validate unchanged (fields are optional).

**Interfaces consumed:** none (schema is a leaf).

- [ ] **Step 1: Write the failing test at `tests/unit/draft-flag.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { scriptsSchema } from '@/lib/content-schemas';

describe('scriptsSchema Cycle 12 additions', () => {
  it('accepts all new Nenno fields on a valid entry', () => {
    const parsed = scriptsSchema.parse({
      title: 'Test Scene',
      library: 'scenes',
      nennoUnit: true,
      chanceCasting: 'Draw from a hat.',
      pronunciations: { Juliet: 'Ju-lee-et' },
      characterOneLiners: { Juliet: 'Young, quick, determined.' },
      competencyReflection: ['What did you notice?', 'What surprised you?'],
      evaluationRitual: 'liked-wonder',
      sceneNotes: 'Splits well into two halves.',
      difficultyTag: 'intermediate',
    });
    expect(parsed.nennoUnit).toBe(true);
    expect(parsed.evaluationRitual).toBe('liked-wonder');
  });

  it('accepts soliloquy filter fields', () => {
    const parsed = scriptsSchema.parse({
      title: 'Test Soliloquy',
      library: 'soliloquies',
      register: 'grief',
      speakerGender: 'female',
      actScene: { act: 'IV', scene: 'iii' },
    });
    expect(parsed.register).toBe('grief');
    expect(parsed.actScene?.act).toBe('IV');
  });

  it('accepts draft flag with default false', () => {
    const parsed = scriptsSchema.parse({
      title: 'Test',
      library: 'scenes',
    });
    expect(parsed.draft).toBe(false);
  });

  it('rejects invalid register enum', () => {
    expect(() =>
      scriptsSchema.parse({
        title: 'Test',
        library: 'soliloquies',
        register: 'joyful', // not in enum
      }),
    ).toThrow();
  });

  it('rejects competencyReflection > 5 items', () => {
    expect(() =>
      scriptsSchema.parse({
        title: 'Test',
        library: 'scenes',
        competencyReflection: ['a', 'b', 'c', 'd', 'e', 'f'], // 6 items
      }),
    ).toThrow();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test tests/unit/draft-flag.test.ts
```

Expected: FAIL — fields don't exist on `scriptsSchema` yet.

- [ ] **Step 3: Extend `scriptsSchema` in `src/lib/content-schemas.ts`**

Find the existing `scriptsSchema` export. Add the new fields immediately after the last existing optional field (before the closing `})`). Match this shape:

```typescript
export const scriptsSchema = z.object({
  // ...existing fields unchanged...
  // ---- Cycle 12 additions ----
  draft: z.boolean().optional().default(false),
  nennoUnit: z.boolean().optional(),
  chanceCasting: z.string().optional(),
  pronunciations: z.record(z.string(), z.string()).optional(),
  characterOneLiners: z.record(z.string(), z.string()).optional(),
  competencyReflection: z.array(z.string()).min(1).max(5).optional(),
  evaluationRitual: z.enum(['liked-wonder', 'liked-wish']).optional(),
  sceneNotes: z.string().optional(),
  difficultyTag: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  register: z.enum(['comic', 'dramatic', 'villain', 'grief']).optional(),
  speakerGender: z.enum(['female', 'male', 'nonbinary', 'unspecified']).optional(),
  actScene: z.object({ act: z.string(), scene: z.string() }).optional(),
});
```

Also find `askShakespeareSchema` in the same file and add:

```typescript
export const askShakespeareSchema = z.object({
  // ...existing fields unchanged...
  draft: z.boolean().optional().default(false),
});
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pnpm test tests/unit/draft-flag.test.ts
```

Expected: 5 tests pass.

- [ ] **Step 5: Extend `tests/unit/scripts-schema.test.ts` to assert existing entries pass unchanged**

Append this describe block to the file:

```typescript
describe('existing entries survive Cycle 12 schema extension', () => {
  it('validates all shipped scripts entries', async () => {
    const entries = await getCollection('scripts');
    // getCollection would have thrown at import if any entry failed schema.
    expect(entries.length).toBeGreaterThan(10);
  });
});
```

- [ ] **Step 6: Run full test suite + typecheck**

```bash
pnpm check && pnpm test
```

Expected: 0 errors; existing 14 script entries validate unchanged.

- [ ] **Step 7: Commit**

```bash
git add src/lib/content-schemas.ts tests/unit/draft-flag.test.ts tests/unit/scripts-schema.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-12): extend scriptsSchema with Nenno + soliloquy filter + draft fields

All 12 additions are optional so existing entries validate unchanged.
Adds nennoUnit, chanceCasting, pronunciations, characterOneLiners,
competencyReflection (min 1 max 5), evaluationRitual enum, sceneNotes,
difficultyTag enum, register enum, speakerGender enum, structured actScene,
and a shared draft flag on both scripts and ask-shakespeare schemas.

Per v2 spec §3.1.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Route `nennoUnit` entries to `/shakespeare/scenes/dtfc/<slug>/`

**Files:**
- Modify: `src/lib/script-href.ts`
- Create: `tests/unit/nenno-routing.test.ts`

**Interfaces produced:**
- `scriptHref(entry)` returns `/shakespeare/scenes/dtfc/<slug>/` when `entry.data.nennoUnit === true`, regardless of `library` value.
- Non-Nenno entries route unchanged (Children's libraries → `/childrens-theatre/scripts/…`; all others → `/shakespeare/scripts/…`).

**Interfaces consumed:**
- `scriptsSchema.nennoUnit` (from Task 1).

- [ ] **Step 1: Write the failing test at `tests/unit/nenno-routing.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { scriptHref } from '@/lib/script-href';

const mk = (slug: string, data: Record<string, unknown>) =>
  ({ id: `${slug}.mdx`, slug, data } as never);

describe('scriptHref — Nenno precedence (Cycle 12)', () => {
  it('routes nennoUnit:true entries to /shakespeare/scenes/dtfc/<slug>/', () => {
    const entry = mk('nurse-juliet-rj-nenno', {
      library: 'scenes',
      nennoUnit: true,
    });
    expect(scriptHref(entry)).toBe('/shakespeare/scenes/dtfc/nurse-juliet-rj-nenno/');
  });

  it('nennoUnit precedence beats childrens-shakespeare library', () => {
    const entry = mk('special-nenno', {
      library: 'childrens-shakespeare',
      nennoUnit: true,
    });
    expect(scriptHref(entry)).toBe('/shakespeare/scenes/dtfc/special-nenno/');
  });

  it('non-Nenno scenes entries still route to /shakespeare/scripts/', () => {
    const entry = mk('fairy-robin-msnd', { library: 'scenes' });
    expect(scriptHref(entry)).toBe('/shakespeare/scripts/fairy-robin-msnd/');
  });

  it('Children’s Theatre libraries still route to /childrens-theatre/scripts/', () => {
    const entry = mk('the-treasure-inside', { library: 'childrens-plays' });
    expect(scriptHref(entry)).toBe('/childrens-theatre/scripts/the-treasure-inside/');
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test tests/unit/nenno-routing.test.ts
```

Expected: FAIL — Nenno precedence not implemented.

- [ ] **Step 3: Modify `src/lib/script-href.ts`**

Add the Nenno check at the top of the function body, before any library-based branching:

```typescript
export function scriptHref(entry: CollectionEntry<'scripts'>): string {
  if (entry.data.nennoUnit) {
    return `/shakespeare/scenes/dtfc/${entry.slug}/`;
  }
  // ...existing library-based routing unchanged...
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pnpm test tests/unit/nenno-routing.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 5: Run full suite**

```bash
pnpm check && pnpm test
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/script-href.ts tests/unit/nenno-routing.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-12): route nennoUnit entries to /shakespeare/scenes/dtfc/<slug>/

Nenno wrapper is a distinct visual + URL space per v2 spec §1.5 and §3.2.
Precedence: nennoUnit check runs before library-based routing so a Nenno
unit filed under any library still lands on the dedicated route.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Extend prohibited-text guardrail with 15 new v2 §7 patterns

**Files:**
- Modify: `scripts/check-prohibited-text.mjs`

**Interfaces produced:**
- `pnpm check:prohibited` fails on any built or source occurrence of the 15 new patterns.
- Passes on all current source content (verified before commit).

**Rationale:** Cycle 11 audit showed source content is clean today only because Drive imports haven't landed. Ship the guardrail BEFORE the imports so regressions can't sneak in.

- [ ] **Step 1: Verify current state — dry-run on shipped content**

```bash
pnpm check:prohibited
```

Expected: PASS (existing 7 patterns from Cycle 11 clean).

- [ ] **Step 2: Extend `PATTERNS` in `scripts/check-prohibited-text.mjs`**

Locate the `PATTERNS` array (added by Cycle 11 around lines 154-190). Append the 15 new entries below the existing block. Each pattern is a `{ pattern, description, hint? }` object matching the existing shape:

```javascript
// ---- Cycle 12 additions (v2 spec §7) ----
{
  pattern: /\(Missy - edit\)/,
  description: 'Title working note "(Missy - edit)"',
  hint: 'Strip assignment notes from titles; tickets go in bundle instead.',
},
{
  pattern: /\(Needs Internal Edits\)/,
  description: 'Title working note "(Needs Internal Edits)"',
  hint: 'Move to a client-review bundle item; do not ship in title.',
},
{
  pattern: /\(Check EDIT\)/,
  description: 'Title working note "(Check EDIT)"',
  hint: 'Strip working note; if content needs review, ticket it.',
},
{
  pattern: /\(Lola to Do\)/,
  description: 'Title working note "(Lola to Do)"',
  hint: 'Task tracker note — remove from title.',
},
{
  pattern: /needs last scenes/i,
  description: 'Cutting incompleteness signal in title',
  hint: 'Rename file + add honest chip in body ("final scenes in preparation").',
},
{
  pattern: /^# Newsletter #/m,
  description: 'Ask Shakespeare column raw "Newsletter #N" H1 header',
  hint: 'Move provenance to frontmatter (publishedIn field); use publication date.',
},
{
  pattern: /Act x, l y/,
  description: 'Short Speeches placeholder fragment "Act x, l y"',
  hint: 'Replace with real act/line reference before ship.',
},
{
  pattern: /Helena 0r the other one/i,
  description: 'Short Speeches placeholder fragment (typo + uncertainty)',
  hint: 'Complete the entry with the intended character; drop the fragment.',
},
{
  pattern: /Maybe from of one or more of the Fools/,
  description: 'Short Speeches placeholder fragment',
  hint: 'Author the entry with a specific Fool speech; drop the fragment.',
},
{
  pattern: /\bSpeechs\b/,
  description: 'Typo: "Speechs" should be "Speeches"',
  hint: 'Correct spelling.',
},
{
  pattern: /Theseua/i,
  description: 'Typo: "Theseua" should be "Theseus"',
  hint: 'Correct spelling.',
},
{
  pattern: /Ardiane/i,
  description: 'Typo: "Ardiane" should be "Ariadne"',
  hint: 'Correct spelling.',
},
{
  pattern: /Minoatuar/i,
  description: 'Typo: "Minoatuar" should be "Minotaur"',
  hint: 'Correct spelling.',
},
{
  pattern: /Prince Hal alter-father/,
  description: 'Falstaff description mistakenly applied to Horatio (v2 §5.3 copy-paste bug)',
  hint: 'Horatio is "Prince Hamlet’s closest friend and confidant from Wittenberg." Do not paste Falstaff’s description.',
},
{
  pattern: /Large Person in every way/,
  description: 'Falstaff description mistakenly applied to Horatio (v2 §5.3 copy-paste bug)',
  hint: 'Second half of the copy-paste bug; verify Horatio has correct description.',
},
```

- [ ] **Step 3: Dry-run to verify no false positives on shipped content**

```bash
pnpm check:prohibited
```

Expected: PASS. If it fails, inspect the failing occurrence — if it's a legitimate string that should be preserved (e.g., a legit newsletter title matching `Newsletter #`), refine the regex (add word boundaries, H1-only anchors, negative lookahead) and re-run.

- [ ] **Step 4: Verify build still passes end-to-end**

```bash
pnpm build
```

Expected: build succeeds; `check:prohibited` runs during build.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-prohibited-text.mjs
git commit -m "$(cat <<'EOF'
feat(cycle-12): add 15 v2 spec §7 patterns to check-prohibited-text

Cycle 11 covered 7 of ~22 §7 items. Cycle 12 adds the remainder before
library-content imports land so future imports can't regress. Patterns
cover title working notes (Missy/Needs Internal Edits/Check EDIT/Lola
to Do/needs last scenes), Ask Shakespeare raw H1 headers, Short Speeches
placeholder fragments, mechanical typos (Speechs/Theseua/Ardiane/
Minoatuar), and defense-in-depth on the Horatio/Falstaff copy-paste bug.

Verified clean against current source. Per v2 spec §7 + Cycle 11 audit
lesson (guardrail-before-import).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Build `DtfcSceneUnit` component + `/shakespeare/scenes/dtfc/[slug]` route

**Files:**
- Create: `src/components/shakespeare/DtfcSceneUnit.astro`
- Create: `src/pages/shakespeare/scenes/dtfc/[slug].astro`
- Create: `src/styles/scenes.css`
- Modify: `src/styles/tokens.css` — `@import` the new `scenes.css`
- Create: `tests/unit/dtfc-scene-unit.test.ts`

**Interfaces produced:**
- Component `<DtfcSceneUnit entry={CollectionEntry<'scripts'>}>` with a default slot for MDX body.
- Route `/shakespeare/scenes/dtfc/<slug>/` generated statically for every entry with `nennoUnit === true`.
- CSS classes `.dtfc-scene-wrapper`, `.dtfc-scene-eyebrow`, `.dtfc-scene-inner`, `.dtfc-scene-text` available site-wide.

**Interfaces consumed:**
- `scriptsSchema` Nenno fields (Task 1).
- `scriptHref()` Nenno precedence (Task 2).

- [ ] **Step 1: Create the styles file `src/styles/scenes.css`**

```css
/* DT:FC 2-3 Person Scene wrapper — v2 spec §3.4 */
.dtfc-scene-wrapper {
  position: relative;
  padding: 2rem 1.5rem 2rem 2rem;
  margin: 2rem 0;
  background: var(--color-tip-bg);
  border-left: 4px solid var(--color-tip-border);
  border-radius: 0.375rem;
}

.dtfc-scene-eyebrow {
  display: inline-block;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-tip-border);
  margin-bottom: 0.75rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid currentColor;
  border-radius: 0.25rem;
}

.dtfc-scene-wrapper h3 {
  font-family: var(--font-display, serif);
  font-size: 1.125rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px dashed color-mix(in oklab, var(--color-tip-border) 40%, transparent);
}

.dtfc-scene-inner {
  padding: 1.25rem;
  margin: 1rem 0;
  background: var(--color-canvas, white);
  border: 1px solid color-mix(in oklab, var(--color-tip-border) 30%, transparent);
  border-radius: 0.25rem;
}

.dtfc-scene-text {
  font-family: var(--font-serif, Georgia, serif);
  line-height: 1.7;
}

.dtfc-scene-text p {
  margin-bottom: 0.75rem;
}

/* v2 §5.2 possible-cuts styling — yellow-highlighted spans in scene MDX */
.possible-cut {
  background: color-mix(in oklab, var(--color-tip-bg) 60%, transparent);
  border-bottom: 1px dashed var(--color-tip-border);
  padding: 0 0.15em;
}

.scenes-possible-cut-legend {
  font-size: 0.875rem;
  color: var(--color-ivory-700, #666);
  font-style: italic;
  margin-bottom: 1rem;
}
```

- [ ] **Step 2: Import the new stylesheet in `src/styles/tokens.css`**

Find the block of existing `@import` statements (Cycle 10 imports `callouts.css`). Add:

```css
@import './scenes.css';
```

- [ ] **Step 3: Create `src/components/shakespeare/DtfcSceneUnit.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'scripts'>;
}

const { entry } = Astro.props;
const d = entry.data;
const ritual = d.evaluationRitual ?? 'liked-wonder';
const ritualText =
  ritual === 'liked-wish'
    ? 'One thing I wish…'
    : 'One thing I wonder…';
---
<article class="dtfc-scene-wrapper" data-nenno-slug={entry.slug}>
  <span class="dtfc-scene-eyebrow">DT:FC 2-3 Person Scene</span>

  <header>
    <h2 class="text-2xl font-display mb-1">{d.title}</h2>
    {d.play && <p class="text-ivory-700 text-sm">{d.play}</p>}
    {d.difficultyTag && (
      <span class="inline-block mt-2 px-2 py-0.5 text-xs rounded bg-canvas border border-ivory-300">
        {d.difficultyTag}
      </span>
    )}
  </header>

  {d.chanceCasting && (
    <>
      <h3>How to cast this scene</h3>
      <p>{d.chanceCasting}</p>
    </>
  )}

  {d.pronunciations && Object.keys(d.pronunciations).length > 0 && (
    <>
      <h3>Say it right</h3>
      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        {Object.entries(d.pronunciations).map(([name, sound]) => (
          <>
            <dt class="font-medium">{name}</dt>
            <dd>{sound}</dd>
          </>
        ))}
      </dl>
    </>
  )}

  {d.characterOneLiners && Object.keys(d.characterOneLiners).length > 0 && (
    <>
      <h3>Who’s who</h3>
      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        {Object.entries(d.characterOneLiners).map(([name, key]) => (
          <>
            <dt class="font-medium">{name}</dt>
            <dd>{key}</dd>
          </>
        ))}
      </dl>
    </>
  )}

  <h3>The scene</h3>
  <div class="dtfc-scene-inner">
    <div class="dtfc-scene-text">
      <slot />
    </div>
  </div>

  {d.sceneNotes && (
    <>
      <h3>Facilitator notes</h3>
      <p>{d.sceneNotes}</p>
    </>
  )}

  {d.competencyReflection && d.competencyReflection.length > 0 && (
    <>
      <h3>Reflect together</h3>
      <ol class="list-decimal ml-6 space-y-1">
        {d.competencyReflection.map((q) => (
          <li>{q}</li>
        ))}
      </ol>
    </>
  )}

  <h3>Wrap up</h3>
  <p>Now let’s share:</p>
  <p class="pl-4 italic">
    Two things I liked…<br />
    {ritualText}
  </p>
</article>
```

- [ ] **Step 4: Create `src/pages/shakespeare/scenes/dtfc/[slug].astro`**

```astro
---
import { getCollection, type CollectionEntry } from 'astro:content';
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
import DtfcSceneUnit from '@/components/shakespeare/DtfcSceneUnit.astro';

export async function getStaticPaths() {
  const entries = await getCollection('scripts', ({ data }) =>
    Boolean(data.nennoUnit) && !data.draft,
  );
  return entries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

interface Props { entry: CollectionEntry<'scripts'> }
const { entry } = Astro.props;
const { Content } = await entry.render();
---
<ShakespeareLayout
  title={`${entry.data.title} — DT:FC 2-3 Person Scene`}
  description={`A DT:FC-wrapped scene from ${entry.data.play ?? 'Shakespeare'}`}
  subPage="scenes"
>
  <div class="prose prose-cream max-w-3xl mx-auto py-8">
    <nav class="text-sm mb-4">
      <a href="/shakespeare/scenes/">← Back to Scenes</a>
    </nav>

    <DtfcSceneUnit entry={entry}>
      <Content />
    </DtfcSceneUnit>
  </div>
</ShakespeareLayout>
```

- [ ] **Step 5: Write the test at `tests/unit/dtfc-scene-unit.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('DtfcSceneUnit — schema completeness (Cycle 12)', () => {
  it('every nennoUnit entry has required wrapper fields', async () => {
    const entries = await getCollection('scripts', ({ data }) =>
      Boolean(data.nennoUnit),
    );
    for (const e of entries) {
      expect(e.data.chanceCasting, `${e.slug}: chanceCasting`).toBeTruthy();
      expect(e.data.characterOneLiners, `${e.slug}: characterOneLiners`).toBeTruthy();
      expect(
        e.data.competencyReflection?.length,
        `${e.slug}: competencyReflection non-empty`,
      ).toBeGreaterThan(0);
    }
  });

  it('Hamlet/Horatio entry (if present) does NOT reuse Falstaff description', async () => {
    const entries = await getCollection('scripts');
    const horatio = entries.find((e) => e.slug === 'hamlet-horatio-nenno');
    if (!horatio) return; // authored in Task 8; skip if not yet present
    const bodyText = horatio.body ?? '';
    const oneLinerText = JSON.stringify(horatio.data.characterOneLiners ?? {});
    expect(bodyText).not.toContain('Prince Hal alter-father');
    expect(oneLinerText).not.toContain('Prince Hal alter-father');
    expect(bodyText).not.toContain('Large Person in every way');
    expect(oneLinerText).not.toContain('Large Person in every way');
  });
});
```

- [ ] **Step 6: Verify test file syntax + build**

```bash
pnpm check && pnpm build
```

Expected: 0 type errors; build succeeds; no Nenno entries yet so the coverage assertion passes vacuously.

- [ ] **Step 7: Manual smoke — dev server + placeholder Nenno unit**

Temporarily author a minimal Nenno unit at `src/content/scripts/_temp-nenno-smoke.mdx`:

```mdx
---
title: 'Smoke Test Scene'
library: 'scenes'
nennoUnit: true
sample: true
chanceCasting: 'Draw from a hat.'
pronunciations:
  Foo: 'Foo-oh'
characterOneLiners:
  Foo: 'Test character.'
competencyReflection:
  - 'Did it work?'
---

Test scene body — just one line.
```

Run `pnpm dev`, navigate to `http://localhost:4321/shakespeare/scenes/dtfc/_temp-nenno-smoke/`, verify:
- Wrapper renders with eyebrow "DT:FC 2-3 Person Scene"
- All 6 named sections render (How to cast / Say it right / Who's who / The scene / Reflect together / Wrap up)
- Body text sits inside the nested `.dtfc-scene-inner` box
- Evaluation ritual reads "One thing I wonder…"

Delete the temp file: `rm src/content/scripts/_temp-nenno-smoke.mdx`.

- [ ] **Step 8: Verify full suite**

```bash
pnpm check && pnpm test && pnpm build
```

Expected: 0 errors.

- [ ] **Step 9: Commit**

```bash
git add src/components/shakespeare/DtfcSceneUnit.astro \
        src/pages/shakespeare/scenes/dtfc/[slug].astro \
        src/styles/scenes.css \
        src/styles/tokens.css \
        tests/unit/dtfc-scene-unit.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-12): DtfcSceneUnit component + /scenes/dtfc/[slug] route

Wrapper chrome per v2 spec §1.5 + §3.4: eyebrow badge, tinted background
using PRC callout tokens, nested inner box for Shakespeare text.
Renders 7 named sections when the corresponding Nenno fields are set
(cast/pronunciations/one-liners/scene/facilitator-notes/reflection/ritual).
Route filters scripts collection on nennoUnit:true and draft:false;
detail page uses ShakespeareLayout with subPage:'scenes'.

Coverage test asserts required fields on every Nenno entry + guards
against the Falstaff-description-on-Horatio copy-paste bug (v2 §5.3).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Build `CueCardsExplainer` component + mount on Cuttings

**Files:**
- Create: `src/components/shakespeare/CueCardsExplainer.astro`
- Modify: `src/pages/shakespeare/cuttings.astro`
- Modify: `src/content/scripts/mechanicals-scenes-a-midsummer-nights-dream.mdx` (body only, cross-link)

**Interfaces produced:**
- Component `<CueCardsExplainer />` renders the audience-cue-card feature explainer.
- CSS: reuses existing PRC tip-callout tokens; no new styles.

**Interfaces consumed:** none.

- [ ] **Step 1: Create `src/components/shakespeare/CueCardsExplainer.astro`**

```astro
---
const cards = [
  { text: 'TA-DAAA!', note: 'Triumphant flourish' },
  { text: 'WIND NOISE', note: 'Mood-setting; hush → whoosh' },
  { text: 'HEE-HAW', note: 'Comic donkey; peak Bottom' },
  { text: 'WILD APPLAUSE', note: 'Closing beat' },
  { text: 'BOO! HISS!', note: 'Villains enter' },
  { text: 'MOB NOISE', note: 'Crowd scenes' },
  { text: 'OH NO!', note: 'Reversals + gasps' },
];
---
<section id="cue-cards" class="my-10">
  <p class="text-xs uppercase tracking-wider text-clay-600 mb-1">A DT:FC signature</p>
  <h2 class="text-3xl font-display mb-4">Audience Cue Cards</h2>
  <p class="mb-6 max-w-2xl">
    In a DT:FC cutting, the audience is a co-performer. Cue cards flash to
    prompt reactions &mdash; the room becomes the crowd of Verona, the mob in
    Rome, the forest in Athens. Practice the cues aloud together before the
    show starts.
  </p>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
    {cards.map((c) => (
      <div class="p-3 border border-clay-300 rounded bg-canvas text-center">
        <p class="font-display text-lg leading-tight">{c.text}</p>
        <p class="text-xs text-ivory-700 mt-1">{c.note}</p>
      </div>
    ))}
  </div>

  <p class="max-w-2xl text-sm text-ivory-800">
    Audience participation is Poor-Theatre inheritance, not incidental stage
    direction. The tradition traces through Grotowski and the Colorado
    Caravan; DT:FC cuttings carry it forward with practiced cues that turn
    watchers into the third character on stage.
  </p>
</section>
```

- [ ] **Step 2: Mount on `src/pages/shakespeare/cuttings.astro`**

Find the block where the TMAI 40-minute credentials callout renders (Cycle 11 added it, around lines 29-32). Insert an import at the top:

```astro
import CueCardsExplainer from '@/components/shakespeare/CueCardsExplainer.astro';
```

Then insert the component between the TMAI credentials callout and the library grid render:

```astro
<!-- ...existing TMAI credentials callout... -->

<CueCardsExplainer />

<!-- ...existing library grid render... -->
```

- [ ] **Step 3: Update Mechanicals script to reference the explainer (body edit only)**

Open `src/content/scripts/mechanicals-scenes-a-midsummer-nights-dream.mdx`. Find the incidental cue-card sentence in Production Notes (around line 26 per Cycle 11 audit). Replace with:

```mdx
See the [audience cue-card explainer on the Cuttings page](/shakespeare/cuttings/#cue-cards) for the DT:FC pattern.
```

Do NOT change frontmatter in this task; the library re-file happens in Task 14.

- [ ] **Step 4: Manual smoke**

```bash
pnpm dev
```

Navigate to `http://localhost:4321/shakespeare/cuttings/`. Verify:
- Section eyebrow reads "A DT:FC signature"
- Heading "Audience Cue Cards"
- 7 named cards render in grid
- Explainer sits above the library grid
- Anchor `#cue-cards` scrolls to the section

- [ ] **Step 5: Run tests**

```bash
pnpm check && pnpm test && pnpm build
```

Expected: 0 errors; guardrail passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/shakespeare/CueCardsExplainer.astro \
        src/pages/shakespeare/cuttings.astro \
        src/content/scripts/mechanicals-scenes-a-midsummer-nights-dream.mdx
git commit -m "$(cat <<'EOF'
feat(cycle-12): CueCardsExplainer + mount on Cuttings landing

Audience cue cards as named DT:FC feature per v2 spec §1.6.
7 named cards (TA-DAAA! / WIND NOISE / HEE-HAW / WILD APPLAUSE / BOO! HISS! /
MOB NOISE / OH NO!) with Poor-Theatre framing paragraph. Mounted above the
Cuttings library grid at #cue-cards anchor. Mechanicals script rewrites
its incidental cue-card note to reference the shared explainer.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Build `NeverMemorizeBox` component + mount on Soliloquies + Children's

**Files:**
- Create: `src/components/shakespeare/NeverMemorizeBox.astro`
- Modify: `src/pages/shakespeare/soliloquies.astro`
- Modify: `src/pages/shakespeare/childrens-shakespeare.astro`

**Interfaces produced:**
- Component `<NeverMemorizeBox />` renders the DT:FC "Never memorize" method explainer.

**Interfaces consumed:** none.

- [ ] **Step 1: Create `src/components/shakespeare/NeverMemorizeBox.astro`**

```astro
---
// v2 spec §1.2 + §4 table + §5.1 — shared doctrine box mounted on
// Soliloquies + Children's Shakespeare libraries.
---
<aside class="callout-tip my-10 p-6 max-w-3xl">
  <p class="text-xs uppercase tracking-wider mb-1">DT:FC Method</p>
  <h2 class="text-2xl font-display mb-3">Never Think or Say the Word &ldquo;Memorize&rdquo;</h2>
  <p class="mb-4">
    Shakespeare wrote inside an oral tradition. His actors learned parts by
    ear, like learning a song.
  </p>
  <ol class="list-decimal ml-6 space-y-2 mb-6">
    <li>Read aloud, together, many times.</li>
    <li>Choose favorite lines first.</li>
    <li>Speak the rhythm before the words.</li>
    <li>Try different voices and stances.</li>
    <li>Perform for a friend before the mirror.</li>
  </ol>
  <blockquote class="border-l-4 pl-4 italic">
    Read the plays aloud, even if by yourself. <strong>Be fearless.</strong>
    Experiment. Shakespeare did.
  </blockquote>
</aside>
```

- [ ] **Step 2: Mount on `src/pages/shakespeare/soliloquies.astro`**

Add import at top:

```astro
import NeverMemorizeBox from '@/components/shakespeare/NeverMemorizeBox.astro';
```

Insert `<NeverMemorizeBox />` below the `<LibraryIndex>` render and above the CLIENT REVIEW blurb comment.

- [ ] **Step 3: Mount on `src/pages/shakespeare/childrens-shakespeare.astro`**

Add import at top:

```astro
import NeverMemorizeBox from '@/components/shakespeare/NeverMemorizeBox.astro';
```

Insert `<NeverMemorizeBox />` above the library-grid render (this establishes the section's doctrine before the entries appear).

- [ ] **Step 4: Manual smoke**

```bash
pnpm dev
```

Navigate to both `/shakespeare/soliloquies/` and `/shakespeare/childrens-shakespeare/`. Verify the box renders in both places with the same content, pull-quote intact, and 5 numbered steps visible.

- [ ] **Step 5: Run tests + guardrail**

```bash
pnpm check && pnpm test && pnpm build
```

- [ ] **Step 6: Commit**

```bash
git add src/components/shakespeare/NeverMemorizeBox.astro \
        src/pages/shakespeare/soliloquies.astro \
        src/pages/shakespeare/childrens-shakespeare.astro
git commit -m "$(cat <<'EOF'
feat(cycle-12): NeverMemorizeBox shared method component

DT:FC "never memorize" doctrine per v2 §1.2. Mounted on both Soliloquies
(below grid) and Children's Shakespeare (above grid) libraries so the
oral-tradition method frames both learning contexts. Reuses .callout-tip
styling from Cycle 10 PRC callouts.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Build `SoliloquyFilters` Preact island + extend `ScriptCard` with register/gender chips

**Files:**
- Create: `src/components/scripts/SoliloquyFilters.tsx`
- Modify: `src/components/scripts/ScriptCard.astro`
- Modify: `src/pages/shakespeare/soliloquies.astro`
- Create: `tests/unit/soliloquy-filter-fields.test.ts`

**Interfaces produced:**
- Preact component `<SoliloquyFilters plays={string[]} />` — mounted `client:idle`; reads URLSearchParams, sets card visibility via CSS attribute selectors, writes URL on toggle.
- `ScriptCard` emits `data-soliloquy-card data-play data-gender data-register` attributes when the entry is `library: 'soliloquies'` AND has those fields.
- Register chip + gender chip render on the card face.

**Interfaces consumed:**
- `scriptsSchema` register/speakerGender/actScene fields (Task 1).

- [ ] **Step 1: Extend `ScriptCard.astro` with chips + data attrs**

Find the existing `ScriptCard.astro`. Inside the outer `<a>` or `<article>` element, add conditional `data-*` attributes:

```astro
---
// ...existing frontmatter...
const isSoliloquy = entry.data.library === 'soliloquies';
const registerColors: Record<string, string> = {
  comic: 'bg-amber-100 text-amber-900',
  dramatic: 'bg-clay-100 text-clay-900',
  villain: 'bg-charcoal-100 text-charcoal-900',
  grief: 'bg-indigo-100 text-indigo-900',
};
---
<a
  href={scriptHref(entry)}
  data-soliloquy-card={isSoliloquy ? '' : undefined}
  data-play={entry.data.play ?? ''}
  data-gender={entry.data.speakerGender ?? ''}
  data-register={entry.data.register ?? ''}
  class="..."
>
  {/* ...existing card face... */}

  {entry.data.register && (
    <span class={`inline-block text-xs px-2 py-0.5 rounded ${registerColors[entry.data.register] ?? ''}`}>
      {entry.data.register}
    </span>
  )}
  {entry.data.speakerGender && entry.data.speakerGender !== 'unspecified' && (
    <span class="inline-block text-xs px-2 py-0.5 rounded bg-canvas border border-ivory-300">
      {entry.data.speakerGender}
    </span>
  )}
</a>
```

Verify `registerColors` uses existing token classes (grep `tokens.css` for `--color-amber-100` etc.); if a color family isn't defined, use the closest existing family or fall back to `bg-ivory-100`.

- [ ] **Step 2: Create `src/components/scripts/SoliloquyFilters.tsx`**

```tsx
/** @jsxImportSource preact */
import { useState, useEffect } from 'preact/hooks';

interface Props { plays: string[] }
interface Filters { plays: string[]; genders: string[]; registers: string[] }

const ALL_GENDERS = ['female', 'male', 'nonbinary'];
const ALL_REGISTERS = ['comic', 'dramatic', 'villain', 'grief'];

function readFromUrl(): Filters {
  if (typeof window === 'undefined') return { plays: [], genders: [], registers: [] };
  const p = new URLSearchParams(window.location.search);
  return {
    plays: p.get('play')?.split(',').filter(Boolean) ?? [],
    genders: p.get('gender')?.split(',').filter(Boolean) ?? [],
    registers: p.get('register')?.split(',').filter(Boolean) ?? [],
  };
}

function writeToUrl(f: Filters) {
  const p = new URLSearchParams();
  if (f.plays.length) p.set('play', f.plays.join(','));
  if (f.genders.length) p.set('gender', f.genders.join(','));
  if (f.registers.length) p.set('register', f.registers.join(','));
  const qs = p.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function SoliloquyFilters({ plays }: Props) {
  const [f, setF] = useState<Filters>(() => readFromUrl());

  useEffect(() => {
    document.querySelectorAll<HTMLElement>('[data-soliloquy-card]').forEach((card) => {
      const p = card.getAttribute('data-play') ?? '';
      const g = card.getAttribute('data-gender') ?? '';
      const r = card.getAttribute('data-register') ?? '';
      const show =
        (f.plays.length === 0 || f.plays.includes(p)) &&
        (f.genders.length === 0 || f.genders.includes(g)) &&
        (f.registers.length === 0 || f.registers.includes(r));
      card.style.display = show ? '' : 'none';
    });
    writeToUrl(f);
  }, [f]);

  return (
    <div class="my-6 p-4 border border-ivory-300 rounded bg-canvas">
      <p class="text-xs uppercase tracking-wider mb-2">Filter soliloquies</p>
      <Strip label="Play" values={plays} selected={f.plays}
        onToggle={(v) => setF({ ...f, plays: toggle(f.plays, v) })} />
      <Strip label="Character gender" values={ALL_GENDERS} selected={f.genders}
        onToggle={(v) => setF({ ...f, genders: toggle(f.genders, v) })} />
      <Strip label="Register" values={ALL_REGISTERS} selected={f.registers}
        onToggle={(v) => setF({ ...f, registers: toggle(f.registers, v) })} />
      {(f.plays.length + f.genders.length + f.registers.length > 0) && (
        <button type="button" class="text-sm underline mt-2"
          onClick={() => setF({ plays: [], genders: [], registers: [] })}>
          Clear all filters
        </button>
      )}
    </div>
  );
}

function Strip({ label, values, selected, onToggle }: {
  label: string; values: string[]; selected: string[]; onToggle: (v: string) => void;
}) {
  return (
    <div class="my-2">
      <span class="text-sm mr-2">{label}:</span>
      {values.map((v) => (
        <button key={v} type="button"
          class={`inline-block text-xs px-2 py-1 mr-1 mb-1 rounded border ${
            selected.includes(v)
              ? 'bg-clay-500 text-canvas border-clay-500'
              : 'bg-canvas border-ivory-300'
          }`}
          onClick={() => onToggle(v)}>
          {v}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Mount on `src/pages/shakespeare/soliloquies.astro`**

Add imports:

```astro
import { getCollection } from 'astro:content';
import SoliloquyFilters from '@/components/scripts/SoliloquyFilters.tsx';
```

Compute the play list at build time in the frontmatter script:

```astro
const soliloquies = await getCollection('scripts', ({ data }) =>
  data.library === 'soliloquies' && !data.draft,
);
const plays = Array.from(
  new Set(soliloquies.map((e) => e.data.play).filter((p): p is string => Boolean(p))),
).sort();
```

Insert the island above `<LibraryIndex>`:

```astro
<SoliloquyFilters client:idle plays={plays} />
<LibraryIndex library="soliloquies" />
```

- [ ] **Step 4: Write coverage test at `tests/unit/soliloquy-filter-fields.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('Soliloquy filter fields (Cycle 12)', () => {
  it('every non-Sonnet soliloquy has register + speakerGender', async () => {
    const entries = await getCollection('scripts', ({ data }) =>
      data.library === 'soliloquies' && !data.draft,
    );
    for (const e of entries) {
      if (e.slug === 'sonnet-116') continue;
      expect(e.data.register, `${e.slug}: register`).toBeTruthy();
      expect(e.data.speakerGender, `${e.slug}: speakerGender`).toBeTruthy();
    }
  });

  it('filter data spans meaningful variety once library is populated', async () => {
    const entries = await getCollection('scripts', ({ data }) =>
      data.library === 'soliloquies' && !data.draft,
    );
    if (entries.length < 10) return;
    const registers = new Set(entries.map((e) => e.data.register).filter(Boolean));
    const genders = new Set(entries.map((e) => e.data.speakerGender).filter(Boolean));
    const plays = new Set(entries.map((e) => e.data.play).filter(Boolean));
    expect(registers.size).toBeGreaterThanOrEqual(3);
    expect(genders.size).toBeGreaterThanOrEqual(2);
    expect(plays.size).toBeGreaterThanOrEqual(5);
  });
});
```

- [ ] **Step 5: Manual smoke**

Run `pnpm dev`. Navigate to `/shakespeare/soliloquies/`. Verify:
- Filter strip visible above the grid
- Toggle a chip → card visibility updates
- URL updates with `?play=…` / `?gender=…` / `?register=…`
- Reload page → filter state restored
- Clear-all button appears when filters active

- [ ] **Step 6: Verify build + tests**

```bash
pnpm check && pnpm test && pnpm build
```

- [ ] **Step 7: Commit**

```bash
git add src/components/scripts/SoliloquyFilters.tsx \
        src/components/scripts/ScriptCard.astro \
        src/pages/shakespeare/soliloquies.astro \
        tests/unit/soliloquy-filter-fields.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-12): SoliloquyFilters Preact island + register/gender chips

Client:idle Preact island with play/gender/register chip strips.
Filters combine AND across strips, OR within. State URL-persisted for
shareable views. Card visibility toggled via CSS attribute selectors on
data-soliloquy-card + data-play + data-gender + data-register attrs
emitted by ScriptCard when the entry is a soliloquy. Chips only render
on cards when the field is set.

Per v2 spec §3.6 + §5.1 (filterable by play, character, register).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Small ship fixes bundle (audit findings from Cycle 11 review)

**Files:**
- Modify: `src/components/shakespeare/AskShakespeareForm.astro`
- Modify: `src/components/shakespeare/AskShakespeareCard.astro`
- Modify: `src/content/ask-shakespeare/ask-shakespeare-5-censorship.mdx`
- Modify: `src/pages/shakespeare/ask-shakespeare/index.astro`
- Modify: `src/pages/shakespeare/ask-shakespeare/[slug].astro`
- Modify: `src/pages/shakespeare/honoring-our-guides.astro`
- Modify: `src/pages/shakespeare/alternatives.astro`
- Modify: `src/data/landing.ts`
- Create: `tests/unit/ask-shakespeare-draft.test.ts`

**Interfaces produced:**
- Ask Shakespeare form has `id="form"` on the `<form>` element (three inbound `#form` anchors resolve).
- Column #5 has `draft: true`; renders "Draft" chip on archive card; detail route redirects to index in production.
- Landing IDEA_TWO answer for "Do you have a question…" resolves direct to `/shakespeare/ask-shakespeare/#form`.
- Honoring page prose fixes applied.
- Alt Four trade-offs callout renders; Sister "last-minute" wording surfaced in essay body.

**Interfaces consumed:**
- `askShakespeareSchema.draft` (Task 1).

- [ ] **Step 1: Add `id="form"` to Ask Shakespeare form**

Open `src/components/shakespeare/AskShakespeareForm.astro`. Find the `<form>` element. Add `id="form"`:

```astro
<form id="form" action={action} method="POST" class="..." data-astro-reload>
```

- [ ] **Step 2: Mark column #5 as draft**

Open `src/content/ask-shakespeare/ask-shakespeare-5-censorship.mdx`. In frontmatter, replace the vague `publishedIn: '2024–25 newsletter'` with:

```yaml
publishedIn: 'unpublished'
draft: true
```

- [ ] **Step 3: Extend AskShakespeareCard with draft chip**

Open `src/components/shakespeare/AskShakespeareCard.astro`. Add a conditional chip render near the top of the card body:

```astro
{entry.data.draft && (
  <span class="inline-block text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 mb-2">
    Draft — not yet published
  </span>
)}
```

- [ ] **Step 4: Add draft-gate redirect on detail route**

Open `src/pages/shakespeare/ask-shakespeare/[slug].astro`. Inside the layout body, add a client-side redirect script for draft entries:

```astro
{entry.data.draft && (
  <script is:inline define:vars={{ isProd: import.meta.env.PROD }}>
    if (isProd && !new URLSearchParams(window.location.search).has('draft')) {
      window.location.replace('/shakespeare/ask-shakespeare/');
    }
  </script>
)}
```

`getStaticPaths()` continues emitting the page (do not filter draft entries) so the redirect script has somewhere to run.

- [ ] **Step 5: Update landing IDEA_TWO answer direct link**

Open `src/data/landing.ts`. Find the IDEA_TWO answer map, the entry with key matching "Do you have a question to Ask Shakespeare?". Change the value from `/shakespeare/#ask-shakespeare` to `/shakespeare/ask-shakespeare/#form`.

- [ ] **Step 6: Honoring page prose fixes**

Open `src/pages/shakespeare/honoring-our-guides.astro`:
- Around line 106 — Amanda Giguere: replace "In recent years Amanda Giguere has for many years been…" with "Amanda Giguere has for many years been…"
- Around line 118 — Joe Craft: replace "third steward of the Shakespeare Library of the Folger Library" with "third steward of the Folger Shakespeare Library"

- [ ] **Step 7: Alt Four trade-offs callout + Sister "last-minute"**

Open `src/pages/shakespeare/alternatives.astro`. In the Alt Four section (around line 173-199 per Cycle 11 audit):

Add a trade-offs callout after the Alt Four intro:

```astro
<div class="callout-tradeoffs my-6 p-4">
  <p class="text-xs uppercase tracking-wider mb-1">Trade-offs to consider</p>
  <p>
    A Shakespeare-inspired new play is Shakespeare-adjacent, not truly
    Shakespeare. When purists ask, we answer: yes, it walks in his footsteps,
    and it invites Players who a whole play might exclude.
  </p>
</div>
```

Rewrite the Shakespeare's Sister anecdote to surface "last-minute":

```
When a Player fell out the day before opening, Marta performed both roles
solo &mdash; the two-woman script became a <strong>last-minute</strong>
one-woman show, and stayed that way for the tour.
```

- [ ] **Step 8: Write draft-flag coverage test at `tests/unit/ask-shakespeare-draft.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('Ask Shakespeare draft flag (Cycle 12)', () => {
  it('column #5 (censorship) is flagged draft', async () => {
    const entries = await getCollection('ask-shakespeare');
    const col5 = entries.find((e) => e.data.columnNumber === 5);
    expect(col5, 'column #5 exists').toBeDefined();
    expect(col5?.data.draft).toBe(true);
    expect(col5?.data.publishedIn).toBe('unpublished');
  });

  it('published columns default to draft:false', async () => {
    const entries = await getCollection('ask-shakespeare');
    for (const e of entries) {
      if (e.data.columnNumber === 5) continue;
      expect(e.data.draft ?? false, `${e.slug} not draft`).toBe(false);
    }
  });
});
```

- [ ] **Step 9: Manual smoke**

Run `pnpm dev`. Verify:
- `/shakespeare/ask-shakespeare/` column #5 card shows "Draft" chip
- Column #5 detail loads in dev (redirect suppressed); `?draft=1` also loads
- Landing "Do you have a question…" tile lands at `/shakespeare/ask-shakespeare/#form` with form scrolled into view
- Three inbound `#form` links from both new-plays MDXs resolve
- Honoring page reads cleanly at lines 106 + 118
- Alt Four shows trade-offs callout + last-minute Sister wording

- [ ] **Step 10: Build + tests**

```bash
pnpm check && pnpm test && pnpm build
```

- [ ] **Step 11: Commit**

```bash
git add src/components/shakespeare/AskShakespeareForm.astro \
        src/components/shakespeare/AskShakespeareCard.astro \
        src/content/ask-shakespeare/ask-shakespeare-5-censorship.mdx \
        src/pages/shakespeare/ask-shakespeare/index.astro \
        src/pages/shakespeare/ask-shakespeare/[slug].astro \
        src/pages/shakespeare/honoring-our-guides.astro \
        src/pages/shakespeare/alternatives.astro \
        src/data/landing.ts \
        tests/unit/ask-shakespeare-draft.test.ts
git commit -m "$(cat <<'EOF'
fix(cycle-12): small ship-bug bundle from Cycle 11 audit

- AskShakespeareForm: add id="form" so three inbound #form anchors resolve
- Column #5 (censorship): mark draft:true + publishedIn: 'unpublished';
  archive card renders "Draft" chip; detail route redirects in production
- Landing IDEA_TWO "Ask Shakespeare?" answer: direct to
  /shakespeare/ask-shakespeare/#form (was two-hop through hub anchor)
- Honoring L106 fix Giguere prose stutter; L118 fix Joe Craft phrasing
- Alt Four: add trade-offs candor callout; surface "last-minute" wording in
  Shakespeare's Sister anecdote

Per v2 spec §7 (Track M) + Cycle 11 audit findings.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Author 8 Nenno wrapped scene units

**Files:**
- Create 8 MDX files under `src/content/scripts/`:
  - `nurse-juliet-rj-nenno.mdx`
  - `hermia-helena-lysander-msnd-nenno.mdx`
  - `olivia-viola-twelfth-night-nenno.mdx`
  - `richard-lady-anne-r3-nenno.mdx`
  - `quickly-falstaff-page-ford-merry-wives-nenno.mdx`
  - `angelo-isabella-lucio-measure-nenno.mdx`
  - `brutus-cassius-jc-nenno.mdx`
  - `hamlet-horatio-nenno.mdx`
- Create: `tests/unit/nenno-units-coverage.test.ts`
- Modify: `src/pages/shakespeare/scenes.astro` — add DT:FC-scenes cluster + Nenno testimonial slot

**Interfaces produced:**
- 8 Nenno unit entries with full wrapper fields populated per Task 1 schema.
- Scenes landing renders a distinct DT:FC-scenes cluster above the raw grid.

**Interfaces consumed:**
- `scriptsSchema` Nenno fields (Task 1); `DtfcSceneUnit` component + route (Task 4); `scriptHref()` Nenno precedence (Task 2).

**Source discipline:** Every Nenno unit body pulls Shakespeare text from a public-domain source (First Folio via Folger or the 1623 baseline). Do NOT paraphrase. Preserve `….` (four-dot ellipsis) cut-marks literally per Drive source convention. Verify Hamlet/Horatio character description is Horatio-correct, NOT Falstaff copy-paste (Task 3 guardrail defends this, Task 4 test verifies).

- [ ] **Step 1: Author `src/content/scripts/nurse-juliet-rj-nenno.mdx`** (template for all 8)

```mdx
---
title: 'The Nurse Tries to Persuade Juliet — R&J III.v'
library: 'scenes'
nennoUnit: true
play: 'Romeo and Juliet'
actScene:
  act: 'III'
  scene: 'v'
authors: []
sample: false
chanceCasting: |
  Draw two names from a hat for the roles. No male/female/physical shape or
  other type casting. Every Player who wants a turn should get one — swap
  after each read-through.
pronunciations:
  Juliet: 'Ju-lee-et'
  Verona: 'Veh-ROH-nah'
characterOneLiners:
  Juliet: 'Young, quick, determined. Just secretly married Romeo.'
  Nurse: 'Older, warm, worried. Raised Juliet from birth; now scrambling for a safe path.'
competencyReflection:
  - 'What does the Nurse want? What does Juliet want?'
  - 'Where does the argument turn — what line changes everything?'
  - 'How does each character use silence?'
  - 'What would you have said if you were the Nurse?'
  - 'What surprised you about Juliet at the end?'
evaluationRitual: 'liked-wonder'
difficultyTag: 'intermediate'
sceneNotes: |
  This scene runs best when Players sit close, then slowly move apart as the
  argument sharpens. Try it with the Nurse standing and Juliet seated first;
  then swap. Notice how the physical arrangement carries the meaning.
---

## The scene

**NURSE.**
Faith, here it is. Romeo is banish&rsquo;d; and all the world to nothing,
That he dares ne&rsquo;er come back to challenge you; ….
I think it best you married with the County.

**JULIET.**
Speak&rsquo;st thou from thy heart?

**NURSE.**
And from my soul too; else beshrew them both.

**JULIET.**
Amen!

**NURSE.**
What?

**JULIET.**
Well, thou hast comforted me marvellous much.
Go in; and tell my lady I am gone,
Having displeas&rsquo;d my father, to Lawrence&rsquo; cell,
To make confession and to be absolv&rsquo;d.

**NURSE.**
Marry, I will; and this is wisely done.

[Exit NURSE.]

**JULIET.**
Ancient damnation! O most wicked fiend!
Is it more sin to wish me thus forsworn,
Or to dispraise my lord with that same tongue
Which she hath prais&rsquo;d him with above compare
So many thousand times? ….
Go, counsellor;
Thou and my bosom henceforth shall be twain.
I&rsquo;ll to the friar to know his remedy.
If all else fail, myself have power to die.

[Exit.]
```

(Full-text length ~60 lines — trim or extend to the natural scene boundary per Drive source. If Drive source is inaccessible, ship the entry with `draft: true` in the frontmatter + body: "Content pending — see Nenno unit source doc." + add to Track P bundle #Nenno-source.)

- [ ] **Step 2: Author the other 7 Nenno units following the same template**

Files with slugs, plays, and unique per-scene notes (all follow the same frontmatter shape as Step 1; adjust `chanceCasting` / `pronunciations` / `characterOneLiners` / `competencyReflection` per scene). The following notes are the per-scene distinctives:

- **`hermia-helena-lysander-msnd-nenno.mdx`** — MSND III.ii; three-character; `difficultyTag: 'beginner'`. `sceneNotes` on physical comedy: "Notice how quickly bodies escalate — try the whole scene with only your hands moving before adding legs."
- **`olivia-viola-twelfth-night-nenno.mdx`** — Twelfth Night I.v; two-character; `difficultyTag: 'intermediate'`. `pronunciations: { Cesario: 'Seh-SAH-ree-oh', Illyria: 'Ih-LEE-ree-uh' }`.
- **`richard-lady-anne-r3-nenno.mdx`** — R3 I.ii; two-character; `difficultyTag: 'advanced'`. `sceneNotes` (verbatim from v2 §5.3): "This scene splits well into two halves — Richard's initial approach and the ring-giving reversal. Consider casting each half separately if you have time."
- **`quickly-falstaff-page-ford-merry-wives-nenno.mdx`** — Merry Wives II.ii; four-character; `difficultyTag: 'intermediate'`. Cross-link body note: "There's also a raw two-person Quickly/Falstaff scene at [Merry Wives II.ii →](/shakespeare/scripts/quickly-falstaff-merry-wives/) without the DT:FC wrapper."
- **`angelo-isabella-lucio-measure-nenno.mdx`** — Measure for Measure II.ii; three-character; `difficultyTag: 'advanced'`.
- **`brutus-cassius-jc-nenno.mdx`** — JC I.ii; two-character; `difficultyTag: 'intermediate'`.
- **`hamlet-horatio-nenno.mdx`** — Hamlet I.ii; two-character; `difficultyTag: 'intermediate'`. **CRITICAL:** Horatio's `characterOneLiners` entry MUST read: `Horatio: 'Prince Hamlet''s closest friend and confidant from Wittenberg. Scholar, loyal, level-headed. Serves as witness and moral anchor throughout.'` — do NOT paste Falstaff's description (per v2 §5.3 copy-paste bug + Task 3 guardrail + Task 4 test).

- [ ] **Step 3: Write coverage test at `tests/unit/nenno-units-coverage.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

const REQUIRED_NENNO_SLUGS = [
  'nurse-juliet-rj-nenno',
  'hermia-helena-lysander-msnd-nenno',
  'olivia-viola-twelfth-night-nenno',
  'richard-lady-anne-r3-nenno',
  'quickly-falstaff-page-ford-merry-wives-nenno',
  'angelo-isabella-lucio-measure-nenno',
  'brutus-cassius-jc-nenno',
  'hamlet-horatio-nenno',
] as const;

describe('Nenno units — coverage (Cycle 12)', () => {
  it('all 8 required Nenno unit MDXs exist', async () => {
    const entries = await getCollection('scripts', ({ data }) => Boolean(data.nennoUnit));
    const slugs = new Set(entries.map((e) => e.slug));
    for (const required of REQUIRED_NENNO_SLUGS) {
      expect(slugs.has(required), `missing ${required}`).toBe(true);
    }
  });

  it('Hamlet/Horatio unit has Horatio-correct description (not Falstaff)', async () => {
    const entries = await getCollection('scripts');
    const horatio = entries.find((e) => e.slug === 'hamlet-horatio-nenno');
    expect(horatio).toBeDefined();
    const oneLiners = JSON.stringify(horatio!.data.characterOneLiners ?? {});
    expect(oneLiners).toContain('Wittenberg');
    expect(oneLiners).not.toContain('Prince Hal alter-father');
    expect(oneLiners).not.toContain('Large Person in every way');
  });
});
```

- [ ] **Step 4: Extend `src/pages/shakespeare/scenes.astro` — DT:FC-scenes cluster + testimonial slot**

Add imports:

```astro
import { getCollection } from 'astro:content';
import ScriptCard from '@/components/scripts/ScriptCard.astro';
import { TESTIMONIALS } from '@/data/testimonials';
```

Compute the cluster + testimonial:

```astro
const dtfcScenes = await getCollection('scripts', ({ data }) =>
  Boolean(data.nennoUnit) && !data.draft,
);
const nennoTestimonial = TESTIMONIALS.find((t) => t.slug === 'linda-nenno');
```

Add markup above the existing library grid render (which shows non-Nenno `library: 'scenes'` entries):

```astro
<section class="my-10">
  <p class="text-xs uppercase tracking-wider mb-1 text-clay-600">
    The wrapper is the product
  </p>
  <h2 class="text-3xl font-display mb-4">DT:FC 2-3 Person Scenes</h2>
  <p class="mb-6 max-w-2xl">
    Every DT:FC scene is wrapped in a pedagogical shell: chance-cast from a
    hat, pronunciation guides, reflection questions, and a shared evaluation
    ritual. The wrapper is the product.
  </p>

  {nennoTestimonial && (
    <figure class="my-6 border-l-4 border-clay-500 pl-4 italic">
      <blockquote>&ldquo;{nennoTestimonial.body}&rdquo;</blockquote>
      <figcaption class="text-sm mt-2 not-italic">
        &mdash; {nennoTestimonial.attribution}, {nennoTestimonial.role}
      </figcaption>
    </figure>
  )}

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {dtfcScenes.map((entry) => <ScriptCard entry={entry} />)}
  </div>
</section>

<hr class="my-10 border-ivory-300" />

<!-- Existing raw scenes grid render follows -->
```

- [ ] **Step 5: Verify build**

```bash
pnpm check && pnpm test && pnpm build
```

Expected: all 8 Nenno unit MDXs validate; `dtfc-scene-unit.test.ts` + `nenno-units-coverage.test.ts` pass; guardrail passes (no Falstaff-description leak). Scenes landing renders the DT:FC cluster.

- [ ] **Step 6: Manual smoke each Nenno detail page**

Navigate to `/shakespeare/scenes/dtfc/<each-slug>/`. Verify wrapper chrome renders on all 8 with correct fields. Spot-check Hamlet/Horatio for the correct Wittenberg description.

- [ ] **Step 7: Commit (per pair of units + landing update as final commit)**

Commit 1 (units 1-2):
```bash
git add src/content/scripts/nurse-juliet-rj-nenno.mdx \
        src/content/scripts/hermia-helena-lysander-msnd-nenno.mdx
git commit -m "$(cat <<'EOF'
content(cycle-12): Nenno units — R&J Nurse/Juliet + MSND Hermia/Helena/Lysander

Two of eight DT:FC 2-3 Person Scene units per v2 spec §5.3.
Wrapper fields populated (chanceCasting, pronunciations, one-liners,
5 reflection questions, wonder-variant evaluation ritual).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Repeat for units 3-4, 5-6, 7-8 (four commits total for 8 units, one per pair). Final commit adds the coverage test + Scenes cluster:

```bash
git add tests/unit/nenno-units-coverage.test.ts \
        src/pages/shakespeare/scenes.astro
git commit -m "$(cat <<'EOF'
feat(cycle-12): DT:FC scenes cluster on Scenes landing + Nenno coverage test

Landing shows a distinct "DT:FC 2-3 Person Scenes" section above the
raw-scenes grid, with the Nenno testimonial pull-quote (from testimonials
data — draft chip until Track P bundle #1 confirms permission).

Coverage test asserts all 8 required Nenno slugs exist and Hamlet/Horatio
has Horatio-correct description.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Author 5 raw Pairs scenes + wire Mechanicals cross-link on Alternatives

**Files:**
- Create: 5 MDX files under `src/content/scripts/`:
  - `fairy-robin-msnd.mdx`
  - `petruchio-kate-taming.mdx`
  - `jaques-orlando-ayli.mdx`
  - `celia-rosalind-ayli.mdx`
  - `quickly-falstaff-merry-wives.mdx`
- Modify: `src/pages/shakespeare/alternatives.astro` — Mechanicals cross-link on string-of-beads bullet

**Interfaces produced:**
- 5 raw pair-scene entries with `library: 'scenes'`, no `nennoUnit` flag; render on Scenes landing raw grid.
- Alt One string-of-beads bullet links to `/shakespeare/scripts/mechanicals-scenes-a-midsummer-nights-dream/`.
- `.possible-cut` styling active in petruchio-kate MDX.

**Interfaces consumed:**
- `scriptsSchema` (Task 1); `.possible-cut` CSS class (Task 4).

- [ ] **Step 1: Author `src/content/scripts/fairy-robin-msnd.mdx`**

```mdx
---
title: 'Fairy and Robin Goodfellow — MSND II.i'
library: 'scenes'
play: 'A Midsummer Night''s Dream'
actScene:
  act: 'II'
  scene: 'i'
authors: []
sample: false
characters:
  - name: 'Fairy'
    description: 'One of Titania''s attendants.'
  - name: 'Robin (Puck)'
    description: 'Oberon''s mischievous servant.'
---

## Production Notes

A two-hander opener — a fairy meets Puck in the wood outside Athens. Try it
with both Players walking in slow circles; the words carry the wildness.

## Script

**FAIRY.**
Over hill, over dale,
Thorough bush, thorough brier,
….

**ROBIN.**
Thou speak&rsquo;st aright;
I am that merry wanderer of the night.
….

(Import full scene from Folger MSND II.i.1–58; preserve four-dot ellipsis.)

## Facilitator Notes

Try it once with Puck grinning, once with Puck brooding. Which reading
serves the play better?
```

- [ ] **Step 2: Author `src/content/scripts/petruchio-kate-taming.mdx`** — with yellow-highlighted optional cuts as `<span class="possible-cut">…</span>`

```mdx
---
title: 'Petruchio and Kate — Taming II.i'
library: 'scenes'
play: 'The Taming of the Shrew'
actScene:
  act: 'II'
  scene: 'i'
authors: []
sample: false
characters:
  - name: 'Petruchio'
    description: 'A visiting suitor determined to marry Katharina.'
  - name: 'Katharina'
    description: 'The elder Minola daughter; sharp-tongued, fierce.'
---

## Production Notes

<p class="scenes-possible-cut-legend">Highlighted spans mark optional cuts.</p>

The wooing scene. Try it with high stakes and no eye contact for the first
run-through.

## Script

**PETRUCHIO.**
Good morrow, Kate; for that&rsquo;s your name, I hear.

**KATHARINA.**
Well have you heard, but something hard of hearing:
They call me Katharine that do talk of me.

**PETRUCHIO.**
You lie, in faith, for you are call&rsquo;d plain Kate,
<span class="possible-cut">And bonny Kate, and sometimes Kate the curst;</span>
But Kate, the prettiest Kate in Christendom, ….

(Continue Taming II.i.174–283; wrap Drive-highlighted optional lines in
`<span class="possible-cut">…</span>` per v2 §5.2 yellow-highlight rule.)

## Facilitator Notes

Cuts are marked in yellow — Players choose whether to include or drop each
one. Compare two performances: one with all cuts, one with none.
```

- [ ] **Step 3: Author remaining 3 Pairs scenes following the same shape**

- **`jaques-orlando-ayli.mdx`** — As You Like It III.ii.256–332. Jaques the melancholy scholar meets Orlando the lovesick woodsman.
- **`celia-rosalind-ayli.mdx`** — AYLI I.iii. Cousins in exile; Celia's loyalty scene.
- **`quickly-falstaff-merry-wives.mdx`** — Merry Wives II.ii. Cross-link body note: "There's also a DT:FC-wrapped version of this scene at [the four-character Nenno unit →](/shakespeare/scenes/dtfc/quickly-falstaff-page-ford-merry-wives-nenno/)."

- [ ] **Step 4: Wire Mechanicals cross-link on Alternatives**

Open `src/pages/shakespeare/alternatives.astro`. In Alt One string-of-beads bullet list (Cycle 11 audit found this at around lines 68-81), locate the Mechanicals variant bullet. Modify:

```astro
<li>
  Midsummer Night's Dream via the Mechanicals arc across acts I.ii → III.i
  → V.i (see the
  <a href="/shakespeare/scripts/mechanicals-scenes-a-midsummer-nights-dream/">
    Mechanicals scenes &rarr;
  </a>)
</li>
```

- [ ] **Step 5: Verify build + tests**

```bash
pnpm check && pnpm test && pnpm build
```

Expected: 5 new entries validate; Scenes landing raw-grid shows all 5 + the existing Mechanicals; `.possible-cut` spans styled correctly.

- [ ] **Step 6: Manual smoke**

Navigate to `/shakespeare/scenes/` and confirm the raw-grid section now has 6 entries (Mechanicals + 5 Pairs). Navigate to the Petruchio/Kate detail — verify yellow-highlighted optional cuts are visually distinct.

- [ ] **Step 7: Commit**

```bash
git add src/content/scripts/fairy-robin-msnd.mdx \
        src/content/scripts/petruchio-kate-taming.mdx \
        src/content/scripts/jaques-orlando-ayli.mdx \
        src/content/scripts/celia-rosalind-ayli.mdx \
        src/content/scripts/quickly-falstaff-merry-wives.mdx \
        src/pages/shakespeare/alternatives.astro
git commit -m "$(cat <<'EOF'
content(cycle-12): 5 raw Pairs scenes + Mechanicals cross-link on Alt One

Per v2 spec §5.2 Pairs subfolder:
- Fairy/Robin (MSND II.i)
- Petruchio/Kate (Taming II.i) with possible-cut span markup
- Jaques/Orlando (AYLI III.ii)
- Celia/Rosalind (AYLI I.iii)
- Quickly/Falstaff (Merry Wives II.ii) with Nenno cross-link

Beatrice/Benedick + Mistresses Page/Ford stubs remain unauthored
(they're content-gap tickets per v2 §5.2). draft flag guards future stubs.

Alt One string-of-beads bullet now links directly to Mechanicals master.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Cuttings content — Marta Barnard 30-Minute MSND + rename R&J placeholder

**Files:**
- Create: `src/content/scripts/thirty-minute-msnd-barnard.mdx`
- Rename + rewrite: `src/content/scripts/sample-cutting-romeo-juliet.mdx` → `src/content/scripts/twenty-minute-rj-in-progress.mdx`

**Interfaces produced:**
- Flagship cutting entry with Barnard byline, University Hill Elementary provenance, cue-card cues inline, 20-character cast list.
- Honest 20-min R&J with "final scenes in preparation" chip.

**Interfaces consumed:**
- `scriptsSchema` (Task 1); `CueCardsExplainer` mount on Cuttings (Task 5).

- [ ] **Step 1: Author `src/content/scripts/thirty-minute-msnd-barnard.mdx`**

```mdx
---
title: 'A 30-Minute Midsummer Night''s Dream'
library: 'cuttings'
play: 'A Midsummer Night''s Dream'
minutes: 30
authors: ['Marta Barnard']
sample: false
characters:
  # 20 characters total per Barnard's cast list
  - name: 'Theseus'
    description: 'Duke of Athens'
  - name: 'Hippolyta'
    description: 'Queen of the Amazons; betrothed to Theseus'
  - name: 'Hermia'
    description: 'Loves Lysander'
  # ...continue for all 20 per Drive source...
stagingNotes: |
  No set. No props. Cue cards for the audience (see the Audience Cue Cards
  explainer on the Cuttings landing). Written for University Hill Elementary.
sourceDoc: 'Barnard 30-Minute MSND (Drive)'
---

## About this cutting

Written by Marta Barnard for University Hill Elementary. 20 characters. No
set, no props. Audience participation via [cue cards](/shakespeare/cuttings/#cue-cards).

## Cast

Twenty Players; one arc from betrothal to bedtime. Doubling optional.

## Script

**[Cue Card: WILD APPLAUSE — welcoming the audience]**

**THESEUS.** Now, fair Hippolyta, our nuptial hour draws on apace ….

**[Cue Card: WIND NOISE — the wood]**

**PUCK.** How now, spirit! Whither wander you?

**FAIRY.** Over hill, over dale ….

**[Cue Card: HEE-HAW — Bottom transformed]**

**BOTTOM.** I see their knavery: this is to make an ass of me ….

**[Cue Card: TA-DAAA! — the wedding]**

(Import full cutting from Drive; preserve cue-card cues inline; use
four-dot ellipsis for cuts. If Drive source is inaccessible, ship the
entry with draft:true + body "Cutting text pending — Marta Barnard's
30-Minute MSND arriving from Drive." + add to Track P bundle.)

## Facilitator Notes

Practice cue cards with the audience before the show begins. Barnard's
introduction, adapted:

> Everyone, some of you get to be the cast, and some of you get to be the
> chorus. When I hold up this card, [CUE CARD], you all say the words on it
> together, as loud as you can. Let's practice.

Then run through all 7 cue cards with the audience before curtain.
```

- [ ] **Step 2: Rename + rewrite R&J placeholder**

Delete + recreate (git handles the rename by content):

```bash
git mv src/content/scripts/sample-cutting-romeo-juliet.mdx \
       src/content/scripts/twenty-minute-rj-in-progress.mdx
```

Then rewrite the file's frontmatter + body:

```mdx
---
title: 'A 20-Minute Romeo and Juliet'
library: 'cuttings'
play: 'Romeo and Juliet'
minutes: 20
authors: []
sample: false
characters:
  - name: 'Romeo'
  - name: 'Juliet'
  - name: 'Nurse'
  - name: 'Friar Laurence'
  # ...remainder from Drive source when available...
stagingNotes: |
  A 20-minute cutting focused on the through-line from meeting to tomb.
  Final scenes are still being cut — see chip below.
sourceDoc: '20 Minute Romeo and Juliet — needs last scenes (Drive)'
---

## About this cutting

<div class="callout-tradeoffs my-6 p-4">
  <p class="text-xs uppercase tracking-wider mb-1">Final scenes in preparation</p>
  <p>
    This cutting ships with acts I&ndash;III complete. The final beats
    (tomb scene, deaths, reconciliation) are being cut for a future update.
    Contact us via <a href="/shakespeare/ask-shakespeare/#form">Ask Shakespeare</a>
    for a preview of the in-progress ending.
  </p>
</div>

## Script

**CHORUS.**
Two households, both alike in dignity ….

(Import acts I–III complete from Drive; use four-dot ellipsis for cuts.)

## Facilitator Notes

The lovers meet, marry, separate. Play to the balcony energy — Players
often want to slow down; keep tempo up.
```

- [ ] **Step 3: Verify build + tests**

```bash
pnpm check && pnpm test && pnpm build
```

Expected: Cuttings library now shows 2 entries (Barnard MSND + 20-min R&J); guardrail catches nothing (`needs last scenes` was in the source title only; file is renamed and body says "final scenes in preparation" — no match).

- [ ] **Step 4: Manual smoke**

Navigate to `/shakespeare/cuttings/`. Verify:
- Both cuttings render as cards
- Cue Cards Explainer sits above the grid (from Task 5)
- Barnard MSND detail page shows cue-card cues in script body
- 20-min R&J detail shows "final scenes in preparation" chip

- [ ] **Step 5: Commit**

```bash
git add src/content/scripts/thirty-minute-msnd-barnard.mdx \
        src/content/scripts/twenty-minute-rj-in-progress.mdx
git commit -m "$(cat <<'EOF'
content(cycle-12): Cuttings inventory — Barnard 30-Min MSND + honest 20-min R&J

Marta Barnard's 30-Minute MSND (University Hill Elementary): flagship
cutting per v2 spec §5.5. 20 characters, no set/props, cue-card cues
inline in script text, facilitator notes with Barnard's cue-card intro.

20-Minute R&J: renamed from sample-cutting-romeo-juliet to
twenty-minute-rj-in-progress; minutes corrected 40→20; honest "final
scenes in preparation" chip; ships with acts I-III per v2 §5.5.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Themes content — Battle of the Sexes provenance + Magic and the Supernatural (Laurie O'Brien byline)

**Files:**
- Create: `src/content/scripts/battle-of-the-sexes-theme.mdx` (replaces sample)
- Create: `src/content/scripts/magic-and-the-supernatural-theme.mdx`
- Delete: `src/content/scripts/sample-theme-battle-of-the-sexes.mdx`
- Modify: `src/pages/shakespeare/themes.astro` — Colorado Caravan lineage prose + Legacy timeline link

**Interfaces produced:**
- Battle of the Sexes ships with provenance intro + scene list; script body held.
- Magic and the Supernatural ships with Laurie O'Brien byline + Legacy cross-link.
- Themes landing acknowledges 1970s Caravan lineage + cross-links `/legacy/timeline/`.

**Interfaces consumed:**
- Existing 8-theme chip filter on `themes.astro` (unchanged).

- [ ] **Step 1: Author `src/content/scripts/battle-of-the-sexes-theme.mdx`**

```mdx
---
title: 'Battle of the Sexes — Theme Cutting'
library: 'themes'
theme: 'Battle of the Sexes'
authors: []
sample: false
sourceDoc: 'Battle of the Sexes (Needs Internal Edits) (Drive)'
stagingNotes: |
  Assembled from scenes across the canon exploring gendered conflict.
  Colorado Caravan origins, later expanded via Title III scenes and a
  through-line built from three Shrew scenes.
---

## About this theme cutting

Originally developed by the Colorado Caravan; expanded under a Title III
grant with additional Shakespeare scenes; reshaped into a through-line
built from three scenes from *The Taming of the Shrew* by later Developmental
Theatre productions. The lineage matters — see [Legacy Timeline](/legacy/timeline/)
for the 1970s repertoire evidence.

## Scenes in this collection

1. Kate and Petruchio, wooing scene (*The Taming of the Shrew*, II.i)
2. Kate and Petruchio, sun-and-moon scene (*Taming*, IV.v)
3. Kate's final speech (*Taming*, V.ii)
4. Beatrice and Benedick, sparring (*Much Ado About Nothing*, I.i)
5. Beatrice and Benedick, "kill Claudio" (*Much Ado*, IV.i)
6. Kate and Bianca (*Taming*, II.i)
7. Rosalind and Orlando, wooing (*As You Like It*, III.ii)
8. Othello's murder scene (*Othello*, V.ii — the orphan-footnote scene from TMAI belongs here)

(Additional scenes per Drive source list.)

## Script

<div class="callout-tradeoffs my-6 p-4">
  <p class="text-xs uppercase tracking-wider mb-1">Script text pending client review</p>
  <p>
    The assembled script text is held pending the client&rsquo;s own
    &ldquo;needs internal edits&rdquo; review. Contact us via
    <a href="/shakespeare/ask-shakespeare/#form">Ask Shakespeare</a> for a
    preview copy in its current form.
  </p>
</div>

## Facilitator Notes

Content pending client edit resolution.
```

- [ ] **Step 2: Delete the sample file**

```bash
git rm src/content/scripts/sample-theme-battle-of-the-sexes.mdx
```

- [ ] **Step 3: Author `src/content/scripts/magic-and-the-supernatural-theme.mdx`**

```mdx
---
title: 'The Magic and the Supernatural — Theme Cutting'
library: 'themes'
theme: 'Magic and the Supernatural'
authors: ["Laurie O'Brien"]
sample: false
sourceDoc: 'The Magic and the Supernatural — Laurie O''Brien (Drive)'
stagingNotes: |
  A complete theme cutting assembled by Laurie O'Brien, drawing on
  Shakespeare's magic-and-fairy plays. Publishable in full.
---

## About this theme cutting

*Assembled by [Laurie O&rsquo;Brien](/legacy/founders/#laurie-obrien) &mdash;
her authorship of this theme cutting partially fills the Workshop Manual gap
in spirit. See [Legacy Founders](/legacy/founders/#laurie-obrien) for her
fuller story.*

The theme moves through fairy, witch, ghost, and prophecy — the moments
when Shakespeare&rsquo;s Elsewhere breaks through. Suitable for staging
without a set; costume and voice do the summoning.

## Scenes in this collection

(List assembled from Drive source. Full scene inventory below the intro.)

## Script

(Import Laurie&rsquo;s complete cutting from Drive; preserve four-dot
ellipsis cuts and any performance notes she embedded.)

## Facilitator Notes

Play the Elsewhere before you play the character. The scene where Puck
addresses the audience works best when the Player looks at *every* face in
the room before speaking. The witches of *Macbeth* work best in a huddle
that never quite forms; their sisterhood is proximity, not embrace.
```

- [ ] **Step 4: Extend `src/pages/shakespeare/themes.astro`**

Above the library grid, add a lineage-acknowledgment paragraph:

```astro
<p class="max-w-2xl mb-6">
  Theme cuttings are a Developmental Theatre inheritance &mdash; the Colorado
  Caravan&rsquo;s 1970s repertoire assembled scenes around themes rather than
  full plays. See <a href="/legacy/timeline/">Legacy Timeline</a> for the
  1977 Pretenders scene list and other evidence of that era&rsquo;s theme
  work.
</p>
```

- [ ] **Step 5: Verify build + tests + guardrail**

```bash
pnpm check && pnpm test && pnpm build
```

Expected: `Battle of the Sexes` chip filter matches the theme string; `themes.astro` shows both entries; Laurie O'Brien byline visible on Magic card; guardrail passes (no `(Needs Internal Edits)` in title — moved to `sourceDoc` frontmatter; no `Lola to Do` — replaced entry doesn't have it).

- [ ] **Step 6: Manual smoke**

Navigate to `/shakespeare/themes/`. Verify:
- Both entries render as cards
- Chip filter (Battle of the Sexes / Magic and the Supernatural) toggles correctly
- Magic card shows Laurie O'Brien byline
- Battle detail page shows provenance + scene list + "script text pending" callout
- Magic detail page shows Laurie cross-link to `/legacy/founders/#laurie-obrien`

- [ ] **Step 7: Commit**

```bash
git add src/content/scripts/battle-of-the-sexes-theme.mdx \
        src/content/scripts/magic-and-the-supernatural-theme.mdx \
        src/pages/shakespeare/themes.astro
git rm src/content/scripts/sample-theme-battle-of-the-sexes.mdx
git commit -m "$(cat <<'EOF'
content(cycle-12): Themes inventory — Battle provenance + Magic (O'Brien byline)

Per v2 spec §5.4:
- Battle of the Sexes: provenance intro (Colorado Caravan / Title III /
  three-Shrew through-line) + scene list; script text held pending client's
  own "Needs Internal Edits" resolution (Track P bundle #6)
- Magic and the Supernatural: complete theme cutting by Laurie O'Brien,
  Legacy founders cross-link, partially fills Workshop Manual gap per v2 §5.4

Themes landing acknowledges 1970s Caravan lineage + cross-links
/legacy/timeline/ (foreshadows Task 15 archival scans).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Soliloquies content — 23 speech MDXs

**Files:**
- Create: 23 MDX files under `src/content/scripts/` (see full list in spec §5 File touch list)
- Create: `tests/unit/soliloquy-schema.test.ts`

**Interfaces produced:**
- 23 soliloquy entries with `library: 'soliloquies'`, `speakerGender`, `register`, structured `actScene`. Sonnet 116 exempts `actScene` + `speakerGender` (poem, not stage speech).
- Henry VI entry (`henry-vi-longer.mdx`) cross-links back to Children's version (`henry-vi-childrens-shakespeare.mdx`, authored in Task 14).
- Sonnet 116 has no Poetry Foundation page furniture.

**Interfaces consumed:**
- `scriptsSchema` register / speakerGender / actScene fields (Task 1); Preact `SoliloquyFilters` island (Task 7).

**Source discipline:** Import from individual Drive docs, NOT the OCR-corrupted "Combined Soliloquies" doc (v2 §5.1). If Drive source inaccessible for an individual entry, ship the entry with `draft: true` + placeholder body + add to Track P bundle.

- [ ] **Step 1: Template — `julia-two-gentlemen.mdx`** (follow this shape for all 23)

```mdx
---
title: 'Julia — Two Gentlemen of Verona IV.iv'
library: 'soliloquies'
play: 'Two Gentlemen of Verona'
actScene:
  act: 'IV'
  scene: 'iv'
speakerGender: 'female'
register: 'dramatic'
sample: false
sourceDoc: 'Individual soliloquy doc (Drive)'
---

## About this speech

Julia, disguised as the boy Sebastian, delivers a page's monologue about
Proteus's letter — she reads her own hand back to herself.

## Speech

**JULIA.**
Alas, poor Proteus, thou hast entertain&rsquo;d
A fox to be the shepherd of thy lambs ….

(Import full speech from individual Drive doc.)

## Notes

For a Player exploring disguise and identity — Julia is two people at once.
Try it once as Julia-as-Sebastian, once as Julia-under-the-mask.
```

- [ ] **Step 2: Author remaining 22 soliloquy MDXs** following the Step 1 template. Full list:

- `mistress-page-merry-wives.mdx` — female / comic
- `titania-msnd.mdx` — female / dramatic (verify body is NOT the OCR-corrupted Combined-doc "To danceJ" version)
- `petruchio-taming.mdx` — male / comic
- `macbeth-macbeth.mdx` — male / dramatic
- `edgar-poor-tom-lear.mdx` — male / grief
- `edmund-lear.mdx` — male / villain
- `clarence-r3.mdx` — male / grief
- `richard-iii-1.mdx` — male / villain (opening "Now is the winter…")
- `richard-iii-2.mdx` — male / villain (V.iii "Cold fearful drops…")
- `richard-gloucester-h6p3.mdx` — male / villain
- `henry-vi-longer.mdx` — male / grief. Body includes cross-link: "See the [shorter version for young players →](/shakespeare/scripts/henry-vi-childrens-shakespeare/)"
- `joan-la-pucelle-h6p1.mdx` — female / dramatic
- `katherine-h8.mdx` — female / grief
- `romeo-rj.mdx` — male / dramatic
- `brutus-jc.mdx` — male / dramatic
- `marullus-jc.mdx` — male / dramatic
- `ophelia-hamlet.mdx` — female / grief
- `claudius-hamlet.mdx` — male / villain
- `ulysses-troilus.mdx` — male / dramatic
- `thersites-troilus.mdx` — male / comic
- `hostess-falstaff-death-h5.mdx` — female / grief
- `sonnet-116.mdx` — `sourceDoc: 'Poetry Foundation → verified against 1609 Quarto'`; `speakerGender` + `actScene` OMITTED (sonnet, not stage speech). Body ships as plain public-domain text with "1609 Quarto" credit line. Do NOT include Poetry Foundation "Play Audio" label or page furniture.

- [ ] **Step 3: Write coverage test at `tests/unit/soliloquy-schema.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

const REQUIRED_SLUGS = [
  'julia-two-gentlemen', 'mistress-page-merry-wives', 'titania-msnd',
  'petruchio-taming', 'macbeth-macbeth', 'edgar-poor-tom-lear',
  'edmund-lear', 'clarence-r3', 'richard-iii-1', 'richard-iii-2',
  'richard-gloucester-h6p3', 'henry-vi-longer', 'joan-la-pucelle-h6p1',
  'katherine-h8', 'romeo-rj', 'brutus-jc', 'marullus-jc',
  'ophelia-hamlet', 'claudius-hamlet', 'ulysses-troilus',
  'thersites-troilus', 'hostess-falstaff-death-h5', 'sonnet-116',
];

describe('Soliloquy library coverage (Cycle 12)', () => {
  it('all 23 required soliloquy MDXs exist', async () => {
    const entries = await getCollection('scripts', ({ data }) =>
      data.library === 'soliloquies',
    );
    const slugs = new Set(entries.map((e) => e.slug));
    for (const s of REQUIRED_SLUGS) {
      expect(slugs.has(s), `missing ${s}`).toBe(true);
    }
  });

  it('Titania entry does NOT contain OCR-corrupted "To danceJ" fragment', async () => {
    const entries = await getCollection('scripts');
    const titania = entries.find((e) => e.slug === 'titania-msnd');
    expect(titania?.body).not.toContain('To danceJ');
  });

  it('Sonnet 116 body does NOT contain Poetry Foundation furniture', async () => {
    const entries = await getCollection('scripts');
    const sonnet = entries.find((e) => e.slug === 'sonnet-116');
    expect(sonnet?.body).not.toContain('Play Audio');
    expect(sonnet?.body).not.toContain('poetryfoundation.org');
  });

  it('Henry VI longer entry cross-links to Children\'s shorter version', async () => {
    const entries = await getCollection('scripts');
    const h6 = entries.find((e) => e.slug === 'henry-vi-longer');
    expect(h6?.body).toContain('/shakespeare/scripts/henry-vi-childrens-shakespeare/');
  });
});
```

- [ ] **Step 4: Verify build + tests**

```bash
pnpm check && pnpm test && pnpm build
```

Expected: all 23 entries validate; existing 2 soliloquies (Juliet, Lady Macbeth) unaffected; total ~25 entries in library; filter island (Task 7) now has meaningful data.

- [ ] **Step 5: Manual smoke**

Navigate to `/shakespeare/soliloquies/`. Verify:
- ~25 cards render
- Filter chips populate with real play names (auto-generated from `data.play`)
- Toggle "female" + "grief" → cards filter to Ophelia + Hostess + Katherine + Juliet + Lady Macbeth
- Register chips visible on card faces
- Sonnet 116 detail page renders as clean poetry with 1609 Quarto credit

- [ ] **Step 6: Commit (batched by 5-6 entries)**

Four commits total for 23 entries + coverage test:

```bash
# Commit 1: 6 entries (Julia through Edgar)
git add src/content/scripts/julia-two-gentlemen.mdx \
        src/content/scripts/mistress-page-merry-wives.mdx \
        src/content/scripts/titania-msnd.mdx \
        src/content/scripts/petruchio-taming.mdx \
        src/content/scripts/macbeth-macbeth.mdx \
        src/content/scripts/edgar-poor-tom-lear.mdx
git commit -m "content(cycle-12): Soliloquies — 6 speeches (Julia through Edgar)

Per v2 spec §5.1 (individual docs, not Combined). Fields include
speakerGender + register + structured actScene for the filter island.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"

# Commit 2: 6 entries (Edmund through Joan) — similar shape
# Commit 3: 6 entries (Katherine through Ophelia) — similar shape
# Commit 4: 5 entries (Claudius through Sonnet) + coverage test
git add src/content/scripts/claudius-hamlet.mdx \
        src/content/scripts/ulysses-troilus.mdx \
        src/content/scripts/thersites-troilus.mdx \
        src/content/scripts/hostess-falstaff-death-h5.mdx \
        src/content/scripts/sonnet-116.mdx \
        tests/unit/soliloquy-schema.test.ts
git commit -m "content(cycle-12): Soliloquies — final 5 speeches + coverage test

Coverage test asserts all 23 required slugs exist, Titania is free of
Combined-doc OCR corruption ('To danceJ'), Sonnet 116 has no Poetry
Foundation furniture, Henry VI longer cross-links to Children's short
version.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 14: Children's Shakespeare — Mechanicals re-file, Short Speeches, Henry VI Children's, Spanish shelf

**Files:**
- Modify: `src/content/scripts/mechanicals-scenes-a-midsummer-nights-dream.mdx` (library re-file + Folger URLs)
- Create: `src/content/scripts/short-speeches-childrens.mdx`
- Create: `src/content/scripts/henry-vi-childrens-shakespeare.mdx`
- Modify: `src/pages/shakespeare/childrens-shakespeare.astro` (Spanish shelf + Mechanicals cross-link)
- Create: `tests/unit/spanish-shelf.test.ts`

**Interfaces produced:**
- Mechanicals now `library: 'childrens-shakespeare'` with 3 Folger URLs (one per scene marker).
- Short Speeches ships with placeholder fragments stripped.
- Henry VI Children's version cross-links back to Soliloquies (Task 13 wired the reverse).
- Spanish shelf renders on Children's Shakespeare page with `lang="es"` + bilingual heading + honest coming-soon.

**Interfaces consumed:**
- `scriptsSchema` (Task 1); `NeverMemorizeBox` mount on Children's (Task 6).

- [ ] **Step 1: Re-file Mechanicals**

Open `src/content/scripts/mechanicals-scenes-a-midsummer-nights-dream.mdx`. Change frontmatter:

```yaml
library: 'childrens-shakespeare'  # was: 'scenes' (Cycle 12 re-file per v2 §5.6)
```

In the body, add inline Folger citation URLs at each scene marker (verify each URL at build time via Task 19 folger-links check):

```mdx
## Scene I.ii — Peter Quince's house

[Folger: MSND I.2](https://www.folger.edu/explore/shakespeares-works/a-midsummer-nights-dream/read/1/2/)

...

## Scene III.i — A part of the wood

[Folger: MSND III.1](https://www.folger.edu/explore/shakespeares-works/a-midsummer-nights-dream/read/3/1/)

...

## Scene V.i — Theseus's palace

[Folger: MSND V.1](https://www.folger.edu/explore/shakespeares-works/a-midsummer-nights-dream/read/5/1/)
```

Verify no `WRONG` link markers OR AI-summary block are in the body per v2 §5.6 (Cycle 11 audit confirmed clean; verify again after edits).

- [ ] **Step 2: Add Mechanicals cross-link on Scenes landing**

Open `src/pages/shakespeare/scenes.astro`. Add note above the raw-scenes grid:

```astro
<p class="text-sm text-ivory-700 mb-4">
  Looking for the Mechanicals arc? It&rsquo;s filed under
  <a href="/shakespeare/childrens-shakespeare/">Children&rsquo;s Shakespeare</a>
  &mdash; the same scenes work as a string-of-beads example and as young
  Players&rsquo; first Shakespeare.
</p>
```

- [ ] **Step 3: Author `src/content/scripts/short-speeches-childrens.mdx`**

```mdx
---
title: 'Short Speeches from the Plays and Sonnets'
library: 'childrens-shakespeare'
authors: []
sample: false
sourceDoc: 'Short Speeches from the Plays and Sonnets (Drive)'
---

## About this collection

A collection of short speeches for young Players — ready to speak, learn
by ear, and try in different voices. Everything on this page is complete;
placeholder fragments from the source doc have been stripped.

## Puck's opening — MSND II.i

**PUCK.**
How now, spirit! Whither wander you?

## Puck's mischief report — MSND II.i

**PUCK.**
Thou speak&rsquo;st aright;
I am that merry wanderer of the night.
I jest to Oberon, and make him smile ….

## Puck's farewell — MSND V.i

**PUCK.**
If we shadows have offended,
Think but this, and all is mended ….

## Bottom's dream — MSND IV.i

**BOTTOM.**
I have had a most rare vision.
I have had a dream, past the wit of man to say what dream it was ….

## Titania to the fairies — MSND II.i

**TITANIA.**
Come, now a roundel and a fairy song ….

## Hamlet to himself — Hamlet II.ii

**HAMLET.**
O, what a rogue and peasant slave am I! ….

## Feste's song — Twelfth Night V.i

**FESTE.**
When that I was and a little tiny boy,
With hey, ho, the wind and the rain ….

<div class="callout-tip my-6 p-4">
  <p class="text-xs uppercase tracking-wider mb-1">TIP</p>
  <p>
    If a speech names a plant you don&rsquo;t know (cowslips, eglantine,
    love-in-idleness), <strong>ask your AI for a picture</strong>. Shakespeare
    wrote for people who could picture these things without being told; the
    picture is half the meaning.
  </p>
</div>

## Facilitator Notes

Never think or say the word memorize. Let Players learn these by ear, like
songs. See [Never Memorize](#) at the top of this page for the full method.
```

- [ ] **Step 4: Author `src/content/scripts/henry-vi-childrens-shakespeare.mdx`**

```mdx
---
title: 'Henry VI on Country Life — Shorter Version'
library: 'childrens-shakespeare'
play: 'Henry VI, Part 3'
actScene:
  act: 'II'
  scene: 'v'
authors: []
sample: false
sourceDoc: 'Individual Henry VI soliloquy doc — Children\'s shorter version (Drive)'
---

## About this speech

A shorter version of Henry VI&rsquo;s longing-for-country-life soliloquy
(3H6 II.v), cut for young Players. The [full-length version →](/shakespeare/scripts/henry-vi-longer/) sits in
the Soliloquies library.

## Speech

**KING HENRY VI.**
O God! methinks it were a happy life,
To be no better than a homely swain ….

(Import shortened version from Drive individual doc.)

## Facilitator Notes

Try it seated, then standing on a chair. What changes?
```

- [ ] **Step 5: Add Spanish shelf on `src/pages/shakespeare/childrens-shakespeare.astro`**

Above the English library grid, insert:

```astro
<section id="spanish" lang="es" class="my-10 p-6 border border-ivory-300 rounded bg-canvas">
  <h2 class="text-3xl font-display mb-2" lang="es">
    Obras de Teatro Shakespeare para Niños en Español
  </h2>
  <p class="subtitle text-sm text-ivory-700 mb-4" lang="en">
    Shakespeare plays for young Spanish speakers
  </p>

  <p lang="es" class="mb-2">
    Estos guiones están en desarrollo. Contáctanos a través de
    <a href="/shakespeare/ask-shakespeare/#form">Ask Shakespeare</a> para
    recibir un aviso cuando estén listos.
  </p>
  <p lang="en" class="text-sm text-ivory-700">
    These scripts are in development. Contact us via
    <a href="/shakespeare/ask-shakespeare/#form">Ask Shakespeare</a> to be
    notified when they&rsquo;re ready.
  </p>
</section>
```

- [ ] **Step 6: Write Spanish shelf coverage test at `tests/unit/spanish-shelf.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const path = fileURLToPath(
  new URL('../../src/pages/shakespeare/childrens-shakespeare.astro', import.meta.url),
);

describe('Children\'s Shakespeare — Spanish shelf (Cycle 12)', () => {
  const source = readFileSync(path, 'utf-8');

  it('renders the bilingual heading with lang="es"', () => {
    expect(source).toContain('lang="es"');
    expect(source).toContain('Obras de Teatro Shakespeare para Niños en Español');
  });

  it('does not contain machine-translated filler', () => {
    // Sanity check: no "Google Translate" attribution or similar.
    expect(source).not.toContain('Google Translate');
  });

  it('links to Ask Shakespeare for notification', () => {
    expect(source).toContain('/shakespeare/ask-shakespeare/#form');
  });
});
```

- [ ] **Step 7: Verify build + tests + guardrail**

```bash
pnpm check && pnpm test && pnpm build
```

Expected: guardrail passes (no `Speechs` typo — title is `Speeches`; no `Act x, l y` fragments — Short Speeches is complete; no `Check EDIT` on Mechanicals — cleaned in Cycle 11); Mechanicals now routes to `/shakespeare/scripts/mechanicals-scenes-a-midsummer-nights-dream/` regardless of library value (script-href still returns `/shakespeare/scripts/…` for `childrens-shakespeare` per Cycle 11 routing).

- [ ] **Step 8: Manual smoke**

Navigate to `/shakespeare/childrens-shakespeare/`. Verify:
- Spanish shelf renders above English grid
- `<h2 lang="es">` correctly identified by devtools
- Mechanicals card renders in English grid
- Short Speeches card renders
- Henry VI Children's card renders
- Never Memorize box (Task 6) sits above everything

Navigate to `/shakespeare/soliloquies/henry-vi-longer/` → cross-link to Children's version works. Navigate to `/shakespeare/childrens-shakespeare/scripts/henry-vi-childrens-shakespeare/` → cross-link back to Soliloquies version works.

- [ ] **Step 9: Commit**

```bash
git add src/content/scripts/mechanicals-scenes-a-midsummer-nights-dream.mdx \
        src/content/scripts/short-speeches-childrens.mdx \
        src/content/scripts/henry-vi-childrens-shakespeare.mdx \
        src/pages/shakespeare/scenes.astro \
        src/pages/shakespeare/childrens-shakespeare.astro \
        tests/unit/spanish-shelf.test.ts
git commit -m "$(cat <<'EOF'
content(cycle-12): Children's Shakespeare — Mechanicals re-file + shelves

Per v2 spec §5.6:
- Mechanicals re-filed from library:scenes to library:childrens-shakespeare
  with 3 Folger URLs (one per act/scene marker — verified by Task 19 check)
- Scenes landing gets an inline note pointing readers to the re-filed
  Mechanicals under Children's Shakespeare
- Short Speeches from Plays and Sonnets: complete entries only (placeholder
  fragments stripped), AI-photo TIP retained per v2 §5.6
- Henry VI Children's shorter version: cross-links to Soliloquies longer
- Spanish shelf ("Obras de Teatro Shakespeare para Niños en Español"):
  bilingual heading with lang="es", honest coming-soon, no MT filler
  per v2 §1.3 + §5.6

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Colloquial — audio file, verbatim landing paragraph, mobile SideBySide toggle

**Files:**
- Create: `public/audio/midsummah-pidgin-paka.mp4` (fetched from Drive via Google Drive MCP)
- Modify: `src/content/colloquial/one-uddah-midsummah.mdx` (frontmatter + 2002 attribution)
- Modify: `src/pages/shakespeare/colloquial/index.astro` (verbatim "Carrying on that tradition")
- Modify: `src/components/shakespeare/SideBySideText.astro` (mobile toggle)
- Modify: `tests/e2e/smoke.spec.ts` (verify audio + toggle)

**Interfaces produced:**
- Audio file hosted at `/audio/midsummah-pidgin-paka.mp4`; `AudioEmbed` (Cycle 11) renders it on the Colloquial detail.
- Transcript-statement paragraph now renders (Cycle 11 wired conditionally on `audio` field).
- Landing intro is verbatim from Drive doc 4.
- Under `md` breakpoint, SideBySide has a toggle (Both / Original / Colloquial).

**Interfaces consumed:**
- `AudioEmbed` component (Cycle 11); `SideBySideText` component (Cycle 3).

- [ ] **Step 1: Fetch audio from Drive**

Use the Google Drive MCP to locate `Midʻsummah-Pidgin-Paka.mp4` in the `4-Shakespeare` folder. Download to `/public/audio/midsummah-pidgin-paka.mp4` (ASCII kebab-case filename per CLAUDE.md audio convention).

Verify:

```bash
ls -la /Users/cnote/projects/dtfc/public/audio/midsummah-pidgin-paka.mp4
```

If Drive source is inaccessible, skip Step 2's audio frontmatter addition + add to Track P bundle (Cycle 11 bundle already carries the Colloquial audio slot).

- [ ] **Step 2: Update `src/content/colloquial/one-uddah-midsummah.mdx` frontmatter**

Add fields:

```yaml
audio: 'midsummah-pidgin-paka.mp4'
audioCaption: 'Jackie Pualani Johnson performs the Paka (Puck) epilogue in Hawaiian Pidgin English (2002).'
```

In the body, add 2002 attribution if not already present. Verify all ʻokina (U+02BB) characters are intact — do NOT let a `sed` or text-transform touch this file.

- [ ] **Step 3: Update `src/pages/shakespeare/colloquial/index.astro` — verbatim intro**

Locate the current paraphrased landing blurb. Replace with the verbatim "Carrying on that tradition" paragraph from Drive doc 4. Fetch the exact text via Google Drive MCP — do NOT paraphrase. Wrap in `<p>` and place above the entries grid.

- [ ] **Step 4: Add mobile toggle to `src/components/shakespeare/SideBySideText.astro`**

Add above the `<dl>` outer element:

```astro
<fieldset class="md:hidden mb-4 border-0 p-0">
  <legend class="text-sm mb-2">View:</legend>
  <label class="inline-block mr-3">
    <input type="radio" name="sbs-view" value="both" checked
      onchange="document.querySelectorAll('.sbs-outer').forEach(el => el.dataset.view='both')" />
    Both
  </label>
  <label class="inline-block mr-3">
    <input type="radio" name="sbs-view" value="original"
      onchange="document.querySelectorAll('.sbs-outer').forEach(el => el.dataset.view='original')" />
    Original
  </label>
  <label class="inline-block">
    <input type="radio" name="sbs-view" value="colloquial"
      onchange="document.querySelectorAll('.sbs-outer').forEach(el => el.dataset.view='colloquial')" />
    Colloquial
  </label>
</fieldset>

<dl class="sbs-outer grid gap-x-8 gap-y-3 md:grid-cols-2" data-view="both">
  <slot />
</dl>
```

Add CSS in `src/styles/scenes.css` (or wherever SideBySide styles live):

```css
@media (max-width: 768px) {
  .sbs-outer[data-view="original"] .colloquial { display: none; }
  .sbs-outer[data-view="colloquial"] .original { display: none; }
  /* "both" is default; no rules needed */
}
```

Verify `<Original>` component root has class `original`; `<Colloquial>` component root has class `colloquial`. If not, add them in the two component files.

- [ ] **Step 5: Verify build + tests + guardrail**

```bash
pnpm check && pnpm test && pnpm build
```

Expected: `colloquial-audio.test.ts` (Cycle 11 coverage) now finds the audio file; ʻokina characters preserved (grep for U+02BB to confirm); build passes.

- [ ] **Step 6: Manual smoke**

Navigate to `/shakespeare/colloquial/one-uddah-midsummah/`. Verify:
- `<audio>` element renders with playable controls
- Transcript-statement paragraph appears below audio
- ʻokina glyph renders correctly in title `One Uddah Midʻsummah`
- Resize to mobile (< 768px) → toggle appears above SideBySide
- Toggle to "Original only" → Colloquial side hides
- Toggle back to "Both" → both sides render

Navigate to `/shakespeare/colloquial/` → verify verbatim "Carrying on that tradition" paragraph renders as landing intro.

- [ ] **Step 7: Commit (2 commits — one for audio + content, one for mobile toggle)**

```bash
# Commit 1: audio + landing content
git add public/audio/midsummah-pidgin-paka.mp4\
        src/content/colloquial/one-uddah-midsummah.mdx \
        src/pages/shakespeare/colloquial/index.astro
git commit -m "$(cat <<'EOF'
content(cycle-12): Colloquial audio + verbatim landing paragraph

Hosts Midʻsummah Pidgin Paka audio locally per v2 spec §3-doc-4 + §5
Track K. Frontmatter adds audio + audioCaption; body preserves 2002
attribution. Colloquial landing renders "Carrying on that tradition"
paragraph verbatim from Drive doc 4 (no more paraphrase).

ʻokina (U+02BB) preserved throughout; do not sed-transform this file.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"

# Commit 2: mobile toggle
git add src/components/shakespeare/SideBySideText.astro \
        src/components/shakespeare/Original.astro \
        src/components/shakespeare/Colloquial.astro \
        src/styles/scenes.css
git commit -m "$(cat <<'EOF'
feat(cycle-12): SideBySideText mobile view toggle

Under md breakpoint, renders a Both/Original/Colloquial radio fieldset.
Selection sets data-view on the outer <dl>; CSS hides the non-selected
side. Preserves the "never interleave lines" rule per v2 §3 doc 4.

Vanilla inline JS — no framework dep, no client hydration needed.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: Archival scans — fools-and-fooling + Pretenders 1977 + Legacy timeline cross-link

**Files:**
- Create: `public/legacy/shakespeare-archive/fools-and-fooling-1970s.pdf` (fetched from Drive)
- Create: `public/legacy/shakespeare-archive/pretenders-1977.pdf` (fetched from Drive)
- Modify: `src/pages/shakespeare/themes.astro` (archival section)
- Modify: `src/data/timeline.json` (1977 entry — verify + add reverse cross-link comment)

**Interfaces produced:**
- Two PDFs hosted at ASCII kebab-case paths under `/public/legacy/shakespeare-archive/`.
- Themes page renders an "Archival theme scripts (1970s)" section below current inventory.
- Pretenders tile cross-links to `/legacy/timeline/#1977`.
- 1977 timeline entry (if present) links back to `/shakespeare/themes/#archival`.

**Interfaces consumed:** none.

- [ ] **Step 1: Fetch PDFs from Drive**

Use Google Drive MCP to locate both files in the `4-Shakespeare/5 Scenes Around a Theme` subfolder. Download to `/public/legacy/shakespeare-archive/`. Verify:

```bash
ls -la /Users/cnote/projects/dtfc/public/legacy/shakespeare-archive/
```

Expected: `fools-and-fooling-1970s.pdf` (~16MB) + `pretenders-1977.pdf` (~21MB). If Drive-inaccessible, add to Track P bundle and ship the archival section with a "PDFs pending client permission — see [Legacy Poor Caravan treatment](/legacy/essays/towards-a-poor-caravan/) for the framing pattern" note.

- [ ] **Step 2: Update `src/pages/shakespeare/themes.astro` — archival section**

Below the current-inventory library grid, insert:

```astro
<section id="archival" class="my-10">
  <p class="text-xs uppercase tracking-wider mb-1 text-clay-600">Archive</p>
  <h2 class="text-3xl font-display mb-4">Archival Theme Scripts (1970s)</h2>
  <p class="max-w-2xl mb-6">
    Two scanned typescripts from the Developmental Theatre archive. These are
    performance documents from the Colorado Caravan era, with visible
    handwritten blocking notes and pencilled cuts. OCR text is unreliable;
    clean transcriptions are a future project. See the
    <a href="/legacy/essays/towards-a-poor-caravan/">Legacy Poor Caravan essay</a>
    for the archival treatment pattern.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <a href="/legacy/shakespeare-archive/fools-and-fooling-1970s.pdf"
       class="p-4 border border-ivory-300 rounded bg-canvas hover:bg-ivory-50">
      <p class="text-xs uppercase tracking-wider mb-1">Scanned typescript</p>
      <h3 class="font-display text-xl mb-2">Fools and Fooling</h3>
      <p class="text-sm">1970s performance typescript. ~16MB PDF.</p>
    </a>

    <a href="/legacy/shakespeare-archive/pretenders-1977.pdf"
       class="p-4 border border-ivory-300 rounded bg-canvas hover:bg-ivory-50">
      <p class="text-xs uppercase tracking-wider mb-1">Scanned typescript</p>
      <h3 class="font-display text-xl mb-2">Pretenders List of Scenes</h3>
      <p class="text-sm mb-2">
        Developmental Theatre Summer, 1977. ~21MB PDF.
      </p>
      <p class="text-sm">
        See also <a href="/legacy/timeline/#1977">Legacy Timeline — Summer 1977 &rarr;</a>
      </p>
    </a>
  </div>
</section>
```

- [ ] **Step 3: Update `src/data/timeline.json` — 1977 entry reverse cross-link**

Locate the 1977 Pretenders / summer entry in `timeline.json`. If it exists, extend its `additionalInfo` field to include: "See the [Pretenders 1977 archival scan on the Shakespeare Themes page](/shakespeare/themes/#archival)." If no 1977 entry exists yet, add one following the schema pattern used by other entries. Verify with `src/lib/timeline.ts` validation.

- [ ] **Step 4: Verify build + tests + guardrail**

```bash
pnpm check && pnpm test && pnpm build
```

- [ ] **Step 5: Manual smoke**

Navigate to `/shakespeare/themes/`. Scroll to the archival section. Click each PDF link → verify file downloads/opens. Navigate to `/legacy/timeline/` → verify the 1977 entry links back to the archival section.

- [ ] **Step 6: Commit**

```bash
git add public/legacy/shakespeare-archive/fools-and-fooling-1970s.pdf \
        public/legacy/shakespeare-archive/pretenders-1977.pdf \
        src/pages/shakespeare/themes.astro \
        src/data/timeline.json
git commit -m "$(cat <<'EOF'
content(cycle-12): archival theme scripts + Legacy timeline cross-link

Two 1970s performance typescripts hosted per v2 spec §5.4:
- fools-and-fooling-1970s.pdf (16MB) — annotated 1970s scan
- pretenders-1977.pdf (21MB) — Developmental Theatre Summer 1977 scan

Themes page renders archival section below current inventory with framing
matching the Legacy Poor Caravan treatment. OCR text explicitly not
published. Pretenders tile cross-links to /legacy/timeline/#1977 and
vice versa.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: Seed Nenno testimonial into `TESTIMONIALS`

**Files:**
- Modify: `src/data/testimonials.ts`

**Interfaces produced:**
- `TESTIMONIALS` array contains Nenno entry with permission-pending chip via `sample: true`.
- Scenes landing (Task 9) renders the entry.

**Interfaces consumed:**
- Scenes landing testimonial slot (Task 9).

- [ ] **Step 1: Append the Nenno entry to `src/data/testimonials.ts`**

```typescript
// ...existing exports...
export const TESTIMONIALS: Testimonial[] = [
  // CLIENT REVIEW: Track P bundle #1 — permission for Linda Nenno's quote
  // is pending. `sample: true` flags the entry as unconfirmed; scenes.astro
  // shows a subtle "Pending permission" chip when sample=true.
  {
    slug: 'linda-nenno',
    attribution: 'Linda Nenno',
    role: 'Texas State University',
    body: 'My students are rocking it.',
    sample: true,
  },
];
```

Verify the Testimonial type accepts these fields (extend if needed).

- [ ] **Step 2: Verify build + tests**

```bash
pnpm check && pnpm test && pnpm build
```

- [ ] **Step 3: Manual smoke**

Navigate to `/shakespeare/scenes/`. Verify the Nenno pull-quote renders above the DT:FC-scenes cluster with the sample-chip visible.

- [ ] **Step 4: Commit**

```bash
git add src/data/testimonials.ts
git commit -m "$(cat <<'EOF'
content(cycle-12): seed Linda Nenno testimonial (permission pending)

Quote from Nenno's field-test feedback letter per v2 spec §5.3 + §6
cross-section contract. Ships with sample:true until Track P bundle #1
confirms explicit permission from Linda Nenno.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 18: Ask Shakespeare column JPG image asset (conditional)

**Files:**
- Create (conditional): `public/images/ask-shakespeare/shakespeare-column-graphic.jpg`
- Modify (conditional): `src/components/shakespeare/AskShakespeareCard.astro`

**Interfaces produced:**
- If asset present: JPG thumbnail renders on Ask Shakespeare cards as visual identity per v2 §5.7.
- If asset absent: card unchanged; asset deferred to Track P bundle.

**Interfaces consumed:** none.

**Note:** This task is conditional on Drive-source accessibility. If the asset is not accessible during implementation, skip to Step 4 (add to bundle).

- [ ] **Step 1: Fetch JPG from Drive**

Use Google Drive MCP to locate the Ask Shakespeare column graphic in the `4-Shakespeare/8 Ask Shakespeare` subfolder. Download to `/public/images/ask-shakespeare/shakespeare-column-graphic.jpg`.

- [ ] **Step 2: Extend AskShakespeareCard with optional thumbnail**

Open `src/components/shakespeare/AskShakespeareCard.astro`. Add at the top of the card body (above title):

```astro
{/* CLIENT REVIEW: image rights pending client confirmation — Track P bundle #5 */}
<img
  src="/images/ask-shakespeare/shakespeare-column-graphic.jpg"
  alt="Ask Shakespeare column graphic"
  class="w-16 h-16 rounded object-cover mb-2"
  loading="lazy"
/>
```

- [ ] **Step 3: Manual smoke**

Navigate to `/shakespeare/ask-shakespeare/`. Verify thumbnail renders on each card.

- [ ] **Step 4: If Drive-inaccessible, add to Track P bundle**

Skip Steps 1-3. In `docs/client-reviews/2026-08-13-cycle12-shakespeare-libraries-review.md` (Task 21), ensure bundle #5 says: "Ask Shakespeare column JPG — Drive-source not accessible during Cycle 12 implementation. Deferred; add when client re-shares."

- [ ] **Step 5: Commit (if Step 1-3 executed)**

```bash
git add public/images/ask-shakespeare/shakespeare-column-graphic.jpg \
        src/components/shakespeare/AskShakespeareCard.astro
git commit -m "$(cat <<'EOF'
content(cycle-12): Ask Shakespeare column JPG thumbnail (rights pending)

Renders the column graphic per v2 spec §5.7 as archive visual identity.
CLIENT REVIEW inline comment records that image rights are pending
client confirmation (Track P bundle #5).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 19: `pnpm check:folger` advisory link-verification script

**Files:**
- Create: `scripts/check-folger-links.mjs`
- Modify: `package.json` (add `check:folger` npm script)
- Create: `tests/unit/folger-links.test.ts` (fixture-based mock check)

**Interfaces produced:**
- `pnpm check:folger` scans `src/content/scripts/*.mdx` for `folger.edu` URLs and fetches each, verifying 200 status + `<h1>` matches claimed act/scene. Advisory only (exit 0).
- Unit test provides fixture-based coverage without real network.

**Interfaces consumed:** none.

- [ ] **Step 1: Create `scripts/check-folger-links.mjs`**

```javascript
#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SCRIPTS_DIR = new URL('../src/content/scripts/', import.meta.url).pathname;
const FOLGER_RE = /https:\/\/www\.folger\.edu\/[^\s)]+/g;

const files = readdirSync(SCRIPTS_DIR).filter((f) => f.endsWith('.mdx'));

let checked = 0;
let failed = 0;
const failures = [];

for (const file of files) {
  const src = readFileSync(join(SCRIPTS_DIR, file), 'utf-8');
  const urls = [...src.matchAll(FOLGER_RE)].map((m) => m[0]);
  for (const url of urls) {
    checked++;
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) {
        failed++;
        failures.push(`${file}: ${url} → HTTP ${res.status}`);
      }
    } catch (e) {
      failed++;
      failures.push(`${file}: ${url} → fetch error: ${e.message}`);
    }
  }
}

console.log(`Checked ${checked} Folger URL(s); ${failed} failure(s).`);
for (const f of failures) console.log(`  ${f}`);
if (failed > 0) {
  console.log(`\nAdvisory only — not blocking build. Update or ticket the URLs.`);
}
process.exit(0);
```

- [ ] **Step 2: Add npm script to `package.json`**

```json
{
  "scripts": {
    "check:folger": "node scripts/check-folger-links.mjs"
  }
}
```

- [ ] **Step 3: Create fixture-based unit test at `tests/unit/folger-links.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('Folger link URL shape (Cycle 12)', () => {
  it('every folger.edu URL in scripts collection uses https + full path', async () => {
    const entries = await getCollection('scripts');
    const folgerRe = /https:\/\/www\.folger\.edu\/[^\s)]+/g;
    for (const e of entries) {
      const body = e.body ?? '';
      const urls = [...body.matchAll(folgerRe)].map((m) => m[0]);
      for (const url of urls) {
        expect(url).toMatch(/^https:\/\/www\.folger\.edu\//);
        expect(url).not.toContain(' ');
      }
    }
  });

  it('Mechanicals script contains 3 Folger URLs (one per scene marker)', async () => {
    const entries = await getCollection('scripts');
    const mech = entries.find((e) => e.slug === 'mechanicals-scenes-a-midsummer-nights-dream');
    expect(mech).toBeDefined();
    const folgerRe = /https:\/\/www\.folger\.edu\/[^\s)]+/g;
    const urls = [...(mech!.body ?? '').matchAll(folgerRe)].map((m) => m[0]);
    expect(urls.length).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 4: Run manual check**

```bash
chmod +x scripts/check-folger-links.mjs
pnpm check:folger
```

Expected: check runs; reports checked count + any failures. Do NOT wire into `pnpm build` — advisory only. If any URLs 404, note in bundle Track P #11 and update the URLs in the Mechanicals MDX manually.

- [ ] **Step 5: Verify build + tests**

```bash
pnpm check && pnpm test && pnpm build
```

- [ ] **Step 6: Commit**

```bash
git add scripts/check-folger-links.mjs \
        package.json \
        tests/unit/folger-links.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-12): pnpm check:folger advisory link-verification script

Scans all scripts collection MDX bodies for https://www.folger.edu/...
URLs and fetches each. Reports 404s + fetch errors. Advisory only —
not wired into pnpm build (Folger occasionally reorganizes URLs).

Unit test provides fixture-based coverage: every Folger URL is HTTPS,
Mechanicals has ≥3 Folger URLs (one per scene marker).

Per v2 spec §5.6 + §6 acceptance criterion.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 20: Playwright smoke test extension + a11y checkpoints

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`

**Interfaces produced:**
- ~12 new checkpoints exercising all Cycle 12 additions.
- 5 new axe-core scans on new pages (Nenno detail, Scenes landing hydrated, Soliloquies with filter toggled, Themes with archival, Children's with Spanish shelf).

**Interfaces consumed:** all Cycle 12 features from Tasks 1-19.

- [ ] **Step 1: Extend `tests/e2e/smoke.spec.ts`** — append these tests inside the existing `test.describe` block:

```typescript
test('Scenes landing: DT:FC cluster + Nenno testimonial', async ({ page }) => {
  await page.goto('/shakespeare/scenes/');
  await expect(page.getByText('DT:FC 2-3 Person Scenes')).toBeVisible();
  await expect(page.getByText('My students are rocking it.')).toBeVisible();
  const nennoCards = page.locator('[data-nenno-slug], a[href*="/scenes/dtfc/"]');
  expect(await nennoCards.count()).toBeGreaterThanOrEqual(8);
  await runAxe(page);
});

test('Nenno detail: wrapper chrome + all sections', async ({ page }) => {
  await page.goto('/shakespeare/scenes/dtfc/nurse-juliet-rj-nenno/');
  await expect(page.getByText('DT:FC 2-3 Person Scene')).toBeVisible();
  for (const heading of ['How to cast', 'Say it right', 'Who’s who', 'The scene', 'Reflect together', 'Wrap up']) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }
  await runAxe(page);
});

test('Nenno Hamlet/Horatio: correct description (no Falstaff)', async ({ page }) => {
  await page.goto('/shakespeare/scenes/dtfc/hamlet-horatio-nenno/');
  const html = await page.content();
  expect(html).not.toContain('Prince Hal alter-father');
  expect(html).not.toContain('Large Person in every way');
  expect(html).toContain('Wittenberg');
});

test('Cuttings: CueCardsExplainer above library grid', async ({ page }) => {
  await page.goto('/shakespeare/cuttings/');
  await expect(page.getByText('Audience Cue Cards')).toBeVisible();
  for (const card of ['TA-DAAA!', 'WIND NOISE', 'HEE-HAW', 'WILD APPLAUSE', 'BOO! HISS!', 'MOB NOISE', 'OH NO!']) {
    await expect(page.getByText(card, { exact: true })).toBeVisible();
  }
});

test('Soliloquies: filter island + NeverMemorizeBox', async ({ page }) => {
  await page.goto('/shakespeare/soliloquies/');
  await expect(page.getByText('Filter soliloquies')).toBeVisible();
  await expect(page.getByText('Never Think or Say the Word')).toBeVisible();
  const cards = page.locator('[data-soliloquy-card]');
  const initialCount = await cards.count();
  expect(initialCount).toBeGreaterThanOrEqual(20);

  // Toggle a filter chip
  await page.getByRole('button', { name: 'grief' }).click();
  await page.waitForTimeout(200);
  const filteredCount = await cards.evaluateAll((els) =>
    els.filter((el) => (el as HTMLElement).style.display !== 'none').length,
  );
  expect(filteredCount).toBeLessThan(initialCount);
  await runAxe(page);
});

test('Children’s Shakespeare: Spanish shelf + NeverMemorizeBox + Mechanicals card', async ({ page }) => {
  await page.goto('/shakespeare/childrens-shakespeare/');
  await expect(page.locator('[lang="es"]').first()).toContainText('Obras de Teatro Shakespeare para Niños en Español');
  await expect(page.getByText('Never Think or Say the Word')).toBeVisible();
  await expect(page.getByText('Mechanicals')).toBeVisible();
  await runAxe(page);
});

test('Themes: archival section + Legacy timeline cross-link', async ({ page }) => {
  await page.goto('/shakespeare/themes/');
  await expect(page.getByText('Archival Theme Scripts (1970s)')).toBeVisible();
  await expect(page.getByRole('link', { name: /Fools and Fooling/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Pretenders/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Magic and the Supernatural/ })).toBeVisible();
  const laurie = page.getByRole('link', { name: /Laurie O’Brien/ });
  await expect(laurie).toBeVisible();
  await runAxe(page);
});

test('Colloquial: audio + transcript + verbatim landing paragraph', async ({ page }) => {
  await page.goto('/shakespeare/colloquial/');
  await expect(page.getByText('Carrying on that tradition')).toBeVisible();

  await page.goto('/shakespeare/colloquial/one-uddah-midsummah/');
  await expect(page.locator('audio')).toHaveAttribute('src', '/audio/midsummah-pidgin-paka.mp4');
  await expect(page.getByText('serves as an accessible transcript')).toBeVisible();

  // Verify ʻokina glyph
  const title = await page.locator('h1').first().textContent();
  expect(title).toContain('Midʻsummah');
});

test('Colloquial mobile toggle: switch to Original only', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/shakespeare/colloquial/one-uddah-midsummah/');
  await page.getByLabel('Original', { exact: true }).check();
  await page.waitForTimeout(100);
  const colloquialSide = page.locator('.colloquial').first();
  await expect(colloquialSide).toBeHidden();
});

test('Ask Shakespeare: column #5 draft chip + form anchor', async ({ page }) => {
  await page.goto('/shakespeare/ask-shakespeare/');
  await expect(page.getByText('Draft — not yet published')).toBeVisible();

  const formLink = await page.evaluate(() => {
    const el = document.querySelector('form#form');
    return el?.id;
  });
  expect(formLink).toBe('form');
});

test('Landing: Ask Shakespeare tile lands direct on #form', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Do you have a question to Ask Shakespeare/ }).click();
  await expect(page).toHaveURL(/\/shakespeare\/ask-shakespeare\/#form$/);
  const inView = await page.locator('form#form').isVisible();
  expect(inView).toBe(true);
});

test('Alternatives: Alt Four trade-offs callout + last-minute Sister wording + Mechanicals link', async ({ page }) => {
  await page.goto('/shakespeare/alternatives/');
  await expect(page.getByText(/Shakespeare-adjacent, not truly Shakespeare/)).toBeVisible();
  await expect(page.getByText(/last-minute/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Mechanicals scenes/ })).toBeVisible();
});
```

Assumes `runAxe(page)` helper already exists per Cycle 11 conventions.

- [ ] **Step 2: Run smoke suite**

```bash
pnpm test:e2e
```

Expected: all new checkpoints pass; existing Cycle 11 checkpoints still pass; axe scans clean on critical/serious (moderate/minor logged as info).

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "$(cat <<'EOF'
test(cycle-12): extend smoke suite with 12 Cycle 12 checkpoints + 5 axe scans

Covers all Cycle 12 additions:
- Scenes DT:FC cluster + Nenno testimonial
- Nenno wrapper chrome + all sections
- Hamlet/Horatio Falstaff-description guard
- Cuttings cue-cards explainer
- Soliloquies filter island + NeverMemorizeBox
- Children's Spanish shelf + NeverMemorizeBox + Mechanicals
- Themes archival section + Laurie byline
- Colloquial audio + transcript + verbatim intro + mobile toggle
- Ask Shakespeare draft chip + form anchor
- Landing direct-to-form
- Alternatives Alt Four trade-offs + last-minute Sister

Axe: fail on critical/serious across 5 new page contexts.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 21: Client-review bundle document

**Files:**
- Create: `docs/client-reviews/2026-08-13-cycle12-shakespeare-libraries-review.md`

**Interfaces produced:** structured Lola/Laurie-facing document with 13 numbered items per spec §2 Track P.

**Interfaces consumed:** none.

- [ ] **Step 1: Write the bundle document**

```markdown
# Cycle 12 Client Review Bundle — Shakespeare Libraries & Wrapper

**Date:** 2026-08-13
**Cycle:** 12 (Shakespeare libraries + Nenno wrapper + cue cards)
**Predecessor bundle:** `2026-08-13-cycle11-shakespeare-review.md` — 10 items; #10 (Vocal Expression PRC entry) carries forward.

Cycle 12 shipped the library-inventory pass plus the DT:FC 2-3 Person Scene
wrapper as a flagship visual component and audience cue cards as a named
DT:FC feature. Below are 13 items where we&rsquo;d appreciate your review or
decision before Cycle 13.

## 1. Nenno testimonial permission

The pull-quote "My students are rocking it." from Linda Nenno&rsquo;s
feedback letter is live on the Scenes landing page but marked
`sample: true` (rendered with a subtle "Pending permission" chip). Can you
confirm Linda gave permission for this phrase to be quoted publicly? Once
confirmed we&rsquo;ll flip the sample flag off.

## 2. Evaluation-ritual canonical phrasing

The DT:FC 2-3 Person Scene wrapper ends with a "Wrap up" ritual:

- **Nenno-doc phrasing:** "Two things I liked… One thing I wonder…"
- **Pairs-doc phrasing:** "Two things I liked… One thing I wish…"

Site-wide default is currently `'liked-wonder'`. Should we standardize to
one? Recommendation: keep "One thing I wonder…" (more forward-looking,
matches Nenno&rsquo;s more-recent usage).

## 3. Shakespeare&rsquo;s Sister anecdote wording

The Alt Four essay now surfaces the "last-minute" detail: "When a Player
fell out the day before opening, Marta performed both roles solo — the
two-woman script became a last-minute one-woman show, and stayed that way
for the tour." Can Marta / Laurie confirm this phrasing is accurate?

## 4. Column #5 (Censorship) publication timing

Column #5 currently ships with `draft: true` + a visible "Draft — not yet
published" chip. The archive card is visible; the detail page redirects to
the archive in production. Should we (a) leave as-is, (b) hide from the
archive entirely until the newsletter publishes it first, or (c) flip
to published on the site now?

## 5. Ask Shakespeare column JPG image rights

[If asset shipped:] The Shakespeare column graphic is now the visual
identity on Ask Shakespeare cards. Can you confirm rights for this image?

[If asset deferred:] The column graphic from the Drive source wasn&rsquo;t
accessible during Cycle 12 implementation. Please re-share when possible.

## 6. Battle of the Sexes script text

The Themes library ships Battle of the Sexes with provenance intro +
scene list; the assembled script text is held pending your "Needs
Internal Edits" resolution. When ready, share the edited script and
we&rsquo;ll publish the body.

## 7. Chuck Wilcox&rsquo;s St. Mary&rsquo;s cuts

The Cuttings page continues Cycle 11&rsquo;s honest "more being prepared"
note re: Chuck&rsquo;s St. Mary&rsquo;s Academy cuts. When any land in
Drive, share the location and we&rsquo;ll add them.

## 8. R&J Rap authorship (carried from Cycle 11 bundle #3)

Still unresolved. Attribution missing in source doc; we need author name
and permission before publishing.

## 9. Peterson / Petersen canonical spelling (carried CLAUDE.md TODO)

`src/content/concepts/language-oral-tradition.mdx` uses "Peterson"; 
`src/data/founders.ts` uses "Petersen". Please pick one; we&rsquo;ll do
a site-wide grep-and-replace pass.

## 10. Spanish shelf scope

The "Obras de Teatro Shakespeare para Niños en Español" shelf ships with
`lang="es"` tagging and an honest coming-soon paragraph. Three scope
options for the future:
- (a) Stay coming-soon indefinitely (differentiator value alone)
- (b) Populate with a small set of publishable Spanish scripts when
  client provides source docs
- (c) Full parity with English Children&rsquo;s Shakespeare library

What&rsquo;s the intended scope?

## 11. Folger link verification results

`pnpm check:folger` (advisory) ran during Cycle 12 implementation.
Results: [insert count of URLs checked + any 404s here at implementation
time]. Please spot-check the Mechanicals Folger URLs at
`/shakespeare/childrens-shakespeare/scripts/mechanicals-scenes-a-midsummer-nights-dream/`.

## 12. 15-min vs 20-min R&J duplicate

Cycle 12 ships only the 20-min R&J (in Cuttings, with "final scenes in
preparation" note). The 15-min R&J filed in Scenes is not authored. Do
you want the 15-min version too? Or is 20-min canonical?

## 13. Vocal Expression PRC entry (carried from Cycle 11 bundle #10)

`src/content/concepts/vocal-expression.mdx` shipped in Cycle 11 as a
`draft:true` placeholder. Please provide source content (or approve the
placeholder as-is) so we can flip the draft flag off.

---

**How to respond:** reply per numbered item; anything not addressed we&rsquo;ll
carry into the Cycle 13 bundle.
```

- [ ] **Step 2: Verify build (docs don't affect build, but sanity check)**

```bash
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add docs/client-reviews/2026-08-13-cycle12-shakespeare-libraries-review.md
git commit -m "$(cat <<'EOF'
docs(cycle-12): client-review bundle — 13 items for Lola / Laurie

Structured review document per v2 spec §2 Track P + Cycle 12 §7 decision log.
Items include: Nenno testimonial permission, evaluation-ritual canonical
phrasing (wish/wonder), Sister anecdote wording, column #5 timing, image
rights, Battle text, St. Mary's cuts, R&J Rap (carried), Peterson/Petersen
(carried), Spanish shelf scope, Folger link results, 15/20-min R&J
duplicate, Vocal Expression PRC (carried).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 22: Update CLAUDE.md with Cycle 12 conventions

**Files:**
- Modify: `CLAUDE.md`

**Interfaces produced:** future writers have conventions for the Cycle 12 additions.

**Interfaces consumed:** none.

- [ ] **Step 1: Append Cycle 12 conventions to `CLAUDE.md`**

Add a new "**Cycle 12 additions**" block under Key conventions:

```markdown
**DT:FC 2-3 Person Scene wrapper (Cycle 12).** Any script with
`nennoUnit: true` in frontmatter renders via `DtfcSceneUnit` at
`/shakespeare/scenes/dtfc/<slug>/`. Wrapper fields (all optional except
where noted): `chanceCasting`, `pronunciations` (Record), `characterOneLiners`
(Record), `competencyReflection` (1-5 items), `evaluationRitual`
('liked-wonder' | 'liked-wish' — default 'liked-wonder' when unset), `sceneNotes`,
`difficultyTag`. Wrapper visual chrome uses PRC callout tokens
(`--color-tip-bg` / `--color-tip-border`). Route precedence: `nennoUnit`
check in `scriptHref()` runs before library-based routing.

**Audience cue cards (Cycle 12).** `<CueCardsExplainer />` renders the
7 named DT:FC cue cards on `/shakespeare/cuttings/#cue-cards`. Do NOT
duplicate the explainer inside individual script MDXs; cross-reference the
anchor instead. Cue-card cues in cuttings render as `[Cue Card: NAME]`
inline in script text.

**"Never memorize" method box (Cycle 12).** `<NeverMemorizeBox />` is a
shared component; mount on Soliloquies (below grid) and Children's
Shakespeare (above grid). Reuses `.callout-tip` styling.

**Soliloquy filter UI (Cycle 12).** `<SoliloquyFilters client:idle>` is a
Preact island; three chip strips (play/gender/register). State
URL-persisted. `ScriptCard` emits `data-soliloquy-card data-play data-gender
data-register` when entry is a soliloquy AND has those fields.

**Draft flag (Cycle 12).** `scriptsSchema.draft` + `askShakespeareSchema.draft`
gate index-grid rendering in production; detail routes emit but
client-side redirect when `import.meta.env.PROD && data.draft === true`.
Dev + `?draft=1` query bypass.

**Spanish shelf pattern (Cycle 12).** Children's Shakespeare page renders
"Obras de Teatro Shakespeare para Niños en Español" section with `lang="es"`
on the section root and per-paragraph `lang` attrs when mixing Spanish +
English. Do NOT machine-translate content; ship honest coming-soon until
client provides real source docs.

**Archival scans pattern (Cycle 12).** PDFs live at
`/public/legacy/shakespeare-archive/<name>.pdf` (ASCII kebab-case).
Presented on `/shakespeare/themes/#archival` with framing matching
`/legacy/essays/towards-a-poor-caravan/`. OCR text never published as text.

**Nenno wrapper `….` cut-marks.** Source authors write literal `….`
(four-dot ellipsis) matching Drive-source convention. `.dtfc-scene-text`
class provides typographic isolation; no CSS transform needed.

**Petruchio/Kate possible-cuts styling.** Yellow-highlighted optional cuts
from Drive-source render as `<span class="possible-cut">…</span>` inline in
MDX. Legend paragraph `<p class="scenes-possible-cut-legend">` sits above
the script.

**`pnpm check:folger` advisory.** Runs `scripts/check-folger-links.mjs`
against every `folger.edu` URL in the scripts collection. Fetches each,
reports 404s. Advisory only — NOT wired into `pnpm build`. Run manually
before merging Shakespeare content that adds new Folger links.
```

Also add a Cycle 12 deferred-marker block to the "Deferred / TODO markers"
section:

```markdown
- **Cycle 12 deferrals** (v2 spec §2 Out-of-scope): Battle of the Sexes
  script text (bundle #6), Chuck's St. Mary's cuts, R&J Rap authorship
  (bundle #8), Peterson/Petersen spelling (bundle #9), Will Power article
  PDF (Cycle 9 T7 carried), Vocal Expression PRC replacement (Cycle 11
  bundle #10 carried), 15/20-min R&J duplicate (bundle #12), real
  Spanish scripts (bundle #10), All the World's a Stage reconstruction.
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs(cycle-12): CLAUDE.md conventions for Nenno wrapper, cue cards, filters, draft flag, Spanish shelf

Records the mechanics + patterns future writers need for Cycle 12
additions: DtfcSceneUnit routing precedence, CueCardsExplainer as the
single source of truth, NeverMemorizeBox mount conventions, Soliloquy
filter island, draft-flag semantics, Spanish shelf lang attr rules,
archival scans hosting, possible-cut styling, check:folger advisory.

Also lists Cycle 12 deferred items so they're visible to future work.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 23: End-of-cycle memory updates

**Files:**
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_followups.md`

**Interfaces produced:** future conversations know Cycle 12 shipped + which follow-ups are open.

**Interfaces consumed:** none.

- [ ] **Step 1: Update `project_dtfc_cycles.md`**

Append a line noting Cycle 12 shipped 2026-08-13 with the scope summary. Keep the file body under 200 lines per auto-memory conventions.

- [ ] **Step 2: Update `project_dtfc_followups.md`**

Add Cycle 12 deferred items (see Task 22 CLAUDE.md list). Consolidate with existing followups where they overlap.

- [ ] **Step 3: No commit** — memory files live outside the repo. No commit needed.

- [ ] **Step 4: Final full-cycle verification**

```bash
pnpm check && pnpm test && pnpm test:e2e && pnpm build
```

Expected: all green.

- [ ] **Step 5: Merge branch to main**

```bash
git checkout main
git merge --no-ff cycle-12-shakespeare-libraries -m "$(cat <<'EOF'
Cycle 12: Shakespeare libraries + Nenno wrapper + cue cards

- DtfcSceneUnit component + /shakespeare/scenes/dtfc/[slug] route
- 8 Nenno wrapped scene units per v2 §5.3
- CueCardsExplainer + Cuttings mount
- NeverMemorizeBox shared component (Soliloquies + Children's)
- SoliloquyFilters Preact island + register/gender chips
- 23 new soliloquy MDXs (25 total in library)
- 5 raw Pairs scenes + Mechanicals cross-link
- Marta Barnard 30-Minute MSND + honest 20-min R&J
- Battle of the Sexes provenance + Magic and the Supernatural (O'Brien byline)
- Mechanicals re-file to Children's Shakespeare + verified Folger URLs
- Short Speeches (fragments stripped) + Henry VI Children's cross-link
- Spanish shelf with lang="es" honest coming-soon
- Colloquial audio hosted + verbatim landing + mobile toggle
- 2 archival scans + Legacy timeline cross-link
- Nenno testimonial seeded
- 15 new §7 prohibited-text patterns
- Small ship-bug bundle from Cycle 11 audit
- pnpm check:folger advisory script

Per spec: docs/superpowers/specs/2026-08-13-dtfc-cycle12-shakespeare-libraries-design.md

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Self-review

Before executing:

1. **Spec coverage** — every §2 in-scope track has a corresponding task or step:
   - Track A (schema) → Task 1
   - Track B (DtfcSceneUnit + route) → Task 4
   - Track C (CueCardsExplainer) → Task 5
   - Track D (SoliloquyFilters) → Task 7
   - Track E (NeverMemorizeBox) → Task 6
   - Track F (raw Pairs) → Task 10
   - Track G (Nenno units) → Task 9
   - Track H (Themes content) → Task 12
   - Track I (Cuttings content) → Task 11
   - Track J (Children's + Spanish) → Task 14
   - Track K (Colloquial) → Task 15
   - Track L (Soliloquies content) → Task 13
   - Track M (small fixes + testimonial + JPG) → Tasks 8, 17, 18
   - Track N (archival scans) → Task 16
   - Track O (guardrail extensions) → Task 3
   - Track P (client review bundle) → Task 21
   - Testing → Task 20 (smoke) + per-task unit tests
   - CLAUDE.md → Task 22
   - Memory updates → Task 23

2. **Placeholder scan** — full-Drive content bodies are marked with "(Import from Drive…)" instructions rather than left blank; frontmatter shapes are complete. Any Drive-inaccessible entries ship with `draft: true` + Track P bundle escalation.

3. **Type consistency** — `nennoUnit`, `chanceCasting`, `pronunciations`, `characterOneLiners`, `competencyReflection`, `evaluationRitual`, `sceneNotes`, `difficultyTag`, `register`, `speakerGender`, `actScene`, `draft` all defined in Task 1 and referenced consistently across Tasks 4, 7, 9, 12, 13. `sample` field on `testimonials.ts` reused for Nenno permission chip in Tasks 9 + 17.

---

