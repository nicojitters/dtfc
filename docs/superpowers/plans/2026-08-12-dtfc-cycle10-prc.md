# DT:FC Cycle 10 — Players Resource Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the placeholder `/resource-center/` route into the site's conceptual backbone — an A–Z glossary of 18 source-faithful entries backed by a formal ICON registry, with a rebuilt letter-rail landing, a rebuilt entry-detail template (Related Resources block, chips, callout classes, editorial-note footer), 6 hand-authored Stage SVG diagrams, cross-section wiring into Legacy/Theatre Games/Children's Theatre, 9 new prohibited-text guardrail patterns, and a single client-review bundle document collecting every non-shippable-without-approval decision.

**Architecture:** The `concepts` collection is already the PRC data model and the `<Concept id="…" />` popover source of truth site-wide. Cycle 10 extends the schema additively (`credits`, `provenance`, `assets`, `draft`, `beyondSource`, `desiraeReplaceable`, `aiAttribution`), formalizes icon lookup via a new `src/data/icon-registry.ts` data file, and rebuilds the landing + entry template around new components under `src/components/prc/`. Content authoring reads each of 19 source docs from the Drive folder `3-Players Resource Center` (id `18ySpPJ_In9spXBAbuL9igsEpPaT8_HHe`) via the Google Drive MCP; the existing 8 entries get wholesale rewrites source-faithful (with current `shortDefinition` preserved where good but flagged `draft:true`), plus 9 new entries written from scratch. The Stage entry ships with a `StageDiagram.astro` component and 6 inline SVGs matching the source deck's labeled-shape aesthetic (`desiraeReplaceable: true`).

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@theme` tokens), TypeScript strict, MDX content collections with Zod schemas, Vitest, Playwright, `@axe-core/playwright`, Pagefind (build-time indexer), native Popover API (already used by the Concept popover), Google Drive MCP for content sourcing.

**Spec:** `/Users/cnote/projects/dtfc/docs/superpowers/specs/2026-08-12-dtfc-cycle10-prc-design.md`

## Global Constraints

- **Branch:** all work on `cycle-10-players-resource-center`. Merge to `main` at cycle end uses `git merge --no-ff`.
- **Package manager:** `pnpm` only. Commands: `pnpm dev`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm check:prohibited`.
- **Node module type:** `"type": "module"` — ESM everywhere.
- **No hex codes in components** — colors come from tokens in `src/styles/tokens.css`. New callout classes MAY use existing tokens (`--color-clay-500`, `--color-teal-600`, `--color-moss-500`, `--color-ivory-100`); no new tokens added this cycle.
- **Vocabulary:** "Players" (never "actors"), "Facilitator" (never "leader"), "Players Resource Center" (full), "Children's Theatre" (curly apostrophe).
- **Curly apostrophes in all prose** — enforced by `scripts/check-prohibited-text.mjs` running in `pnpm build`. Use `&rsquo;` or the literal U+2019 (’). Cycle 10 does not add files to the allowlist.
- **Zod imports use `astro/zod`**, not bare `zod` (Cycle 2 T2 lesson).
- **FOUNDERS pattern:** explicit `.default()` values on every literal object entry — TypeScript strict rejects otherwise. Applies to `assets[]` entries and any new data-file instantiations.
- **Editorial stripping rules** (vision spec §7 — enforced by guardrail additions in T11): the following MUST NOT appear in built output — `DESIRAE:` prefix, `Desirae you will need`, `check this doc info is included`, `OTHERS?`, `(image of water molecule)`, trailing `(LOGO)`, trailing `(ICON)` on titles, drafting-note `Note: Published in `, raw `docs.google.com` / `drive.google.com` URLs.
- **Source-faithfulness policies** (vision spec §6): keep quoted pedigree (Rubin, Plato, Holzberg, Peterson) attributed; normalize only mechanical typos (`Resonate`→`Resonant` in title, broken sentences); never touch names, never soften doctrine details (Cinderella toes-and-heels, "no stars", "perform what is happening, not explain it", high/low cohesion warnings); water-molecule science error stays as a placeholder note pending client approval.
- **Popover source of truth:** every `<Concept id="…" />` reads `shortDefinition` from the PRC entry via `getConcept()`. No duplicated definition strings in components — grep `shortDefinition:` should return matches only inside `src/content/concepts/*.mdx`.
- **Commit granularity:** one commit per logical deliverable. Content batches (T7, T8) commit per entry inside the task. Commit messages authored `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` via HEREDOC.
- **No client-blocker soft-ships added this cycle except the ones the spec explicitly authorizes:** Audience/Constraints/ICONs explainer bundle tickets; Warmup Audience `(pending)` chip; Casting Will Power PDF `(pending)` chip; Cohesion water-molecule placeholder note; Warmup "How to Facilitate Warmup Games" `(pending)` chip if route absent.

---

## File Map

**Create:**
- `src/data/icon-registry.ts`
- `src/styles/callouts.css`
- `src/components/prc/LetterRail.astro`
- `src/components/prc/EntryCard.astro`
- `src/components/prc/RelatedResources.astro`
- `src/components/prc/EditorialNoteAI.astro`
- `src/components/prc/EntryChips.astro`
- `src/components/prc/StageDiagram.astro`
- `src/content/concepts/archetypes.mdx` (renamed from `archetype.mdx`)
- `src/content/concepts/casting.mdx`
- `src/content/concepts/continuous-assessment.mdx`
- `src/content/concepts/creativity.mdx`
- `src/content/concepts/developmental-theatre.mdx`
- `src/content/concepts/language-oral-tradition.mdx`
- `src/content/concepts/language-sparse-resonant.mdx`
- `src/content/concepts/plot.mdx`
- `src/content/concepts/repetition.mdx`
- `src/content/concepts/stage.mdx`
- `docs/client-reviews/2026-08-12-cycle10-prc-review.md`
- `tests/unit/icon-registry.test.ts`
- `tests/unit/concepts-flags.test.ts`
- `tests/unit/concepts-related.test.ts`
- `tests/unit/concepts-stage.test.ts`

**Modify:**
- `src/lib/content-schemas.ts` — add 7 optional fields to `conceptSchema`
- `src/lib/icons.ts` — refactor `iconPath()` to consult `ICON_REGISTRY` first
- `src/styles/tokens.css` — `@import` callouts.css
- `src/layouts/ConceptLayout.astro` — rebuild with chips, lede, callouts, AI footer, RelatedResources component, pagefind filter
- `src/pages/resource-center/index.astro` — landing rebuild (letter rail + grouped cards)
- `src/pages/theatre-games/index.astro` — inline `<Concept>` wrapping on first mentions of cohesion/competency/warmup/resilience
- `src/pages/childrens-theatre/index.astro` — Casting sidebar callout
- `src/pages/childrens-theatre/scripts/[slug].astro` — inject inline `See Casting →` in `## Facilitator Notes` render for `childrens-plays` + `teaching-modules` libraries
- `src/content/concepts/archetype.mdx` — delete (superseded by `archetypes.mdx`); every `<Concept id="archetype">` reference across `.astro` + `.mdx` becomes `<Concept id="archetypes">`
- `src/content/concepts/cohesion.mdx` — wholesale rewrite from source
- `src/content/concepts/competency.mdx` — wholesale rewrite
- `src/content/concepts/facilitation.mdx` — wholesale rewrite; keep `shortDefinition` verbatim
- `src/content/concepts/fearless-creativity.mdx` — wholesale rewrite; 4-concept links; Constraints → Plot anchor; Holzberg → Legacy timeline
- `src/content/concepts/icons.mdx` — set `draft:true`
- `src/content/concepts/magic-toolbox.mdx` — wholesale rewrite
- `src/content/concepts/players.mdx` — set `beyondSource:true`
- `src/content/concepts/resilience.mdx` — set `beyondSource:true`
- `src/content/concepts/theatre-games.mdx` — wholesale rewrite
- `src/content/concepts/warmup.mdx` — wholesale rewrite; Audience `(pending)`; Cool-down surfaced
- `scripts/check-prohibited-text.mjs` — append 9 new PATTERNS
- `tests/e2e/smoke.spec.ts` — extend with PRC letter-rail + entry template + ⌘K search-scope checkpoints + 2 new axe scans
- `tests/unit/prohibited-text.test.ts` — coverage for the 9 new patterns
- `CLAUDE.md` — Cycle 10 conventions

**Auto-memory updates (end of cycle):** `project_dtfc_cycles.md`, `project_dtfc_followups.md`.

---

## Task 1: Schema extension + fixture test

**Files:**
- Modify: `src/lib/content-schemas.ts`
- Create: `tests/unit/concepts-flags.test.ts` (partial — placeholder tests for schema defaults; full flag coverage added in T7/T8/T9)

**Interfaces produced:**
- `conceptSchema` now accepts optional `credits: string`, `provenance: string`, `assets: array<{slug, description, status}>`, `draft: boolean` (default false), `beyondSource: boolean` (default false), `desiraeReplaceable: boolean` (default false), `aiAttribution: boolean` (default false).

- [ ] **Step 1: Write the failing test at `tests/unit/concepts-flags.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { conceptSchema } from '@/lib/content-schemas';

describe('conceptSchema — Cycle 10 additive fields', () => {
  it('defaults draft to false', () => {
    const parsed = conceptSchema.parse({
      name: 'Test',
      slug: 'test',
      shortDefinition: 'x',
    });
    expect(parsed.draft).toBe(false);
    expect(parsed.beyondSource).toBe(false);
    expect(parsed.desiraeReplaceable).toBe(false);
    expect(parsed.aiAttribution).toBe(false);
    expect(parsed.assets).toEqual([]);
    expect(parsed.credits).toBeUndefined();
    expect(parsed.provenance).toBeUndefined();
  });

  it('accepts assets[] with default status "placeholder"', () => {
    const parsed = conceptSchema.parse({
      name: 'Test',
      slug: 'test',
      shortDefinition: 'x',
      assets: [{ slug: 'wayfarer', description: 'Wayfarer wheel SVG' }],
    });
    expect(parsed.assets[0].status).toBe('placeholder');
  });

  it('accepts all Cycle 10 flags true + credits + provenance', () => {
    const parsed = conceptSchema.parse({
      name: 'Stage',
      slug: 'stage',
      shortDefinition: 'x',
      credits: 'Presentation developed by Jackie Pualani Johnson',
      provenance: 'Published in September 2024 Newsletter',
      draft: true,
      beyondSource: true,
      desiraeReplaceable: true,
      aiAttribution: true,
    });
    expect(parsed.credits).toBe('Presentation developed by Jackie Pualani Johnson');
    expect(parsed.provenance).toBe('Published in September 2024 Newsletter');
    expect(parsed.draft).toBe(true);
    expect(parsed.beyondSource).toBe(true);
    expect(parsed.desiraeReplaceable).toBe(true);
    expect(parsed.aiAttribution).toBe(true);
  });

  it('rejects invalid assets status', () => {
    expect(() =>
      conceptSchema.parse({
        name: 'Test',
        slug: 'test',
        shortDefinition: 'x',
        assets: [{ slug: 'x', description: 'y', status: 'bogus' }],
      }),
    ).toThrow();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL (schema fields missing)**

```bash
pnpm test tests/unit/concepts-flags.test.ts
```

Expected: FAIL — new fields not on schema.

- [ ] **Step 3: Extend `src/lib/content-schemas.ts`**

Replace the existing `conceptSchema` block with:

```typescript
export const conceptSchema = z.object({
  name: z.string(),
  slug: z.string(),
  shortDefinition: z.string().max(240),
  icon: z.string().default('placeholder'),
  related: z.array(z.string()).default([]),
  // Cycle 10 additions — all optional / defaulted so existing entries pass
  credits: z.string().optional(),
  provenance: z.string().optional(),
  assets: z
    .array(
      z.object({
        slug: z.string(),
        description: z.string(),
        status: z.enum(['placeholder', 'delivered']).default('placeholder'),
      }),
    )
    .default([]),
  draft: z.boolean().default(false),
  beyondSource: z.boolean().default(false),
  desiraeReplaceable: z.boolean().default(false),
  aiAttribution: z.boolean().default(false),
});
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pnpm test tests/unit/concepts-flags.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 5: Verify existing content still validates**

```bash
pnpm check && pnpm test
```

Expected: 0 errors, 0 warnings; full suite passes (existing 11 concept MDXs stay valid because every new field is optional or defaulted).

- [ ] **Step 6: Commit**

```bash
git checkout -b cycle-10-players-resource-center
git add src/lib/content-schemas.ts tests/unit/concepts-flags.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-10): extend conceptSchema with credits, provenance, assets, draft, beyondSource, desiraeReplaceable, aiAttribution

Additive optional fields land ahead of PRC content rewrites. Existing
concepts pass unchanged; new entries and rewrites use the flags for
client-review chip surfacing, AI attribution footers, and asset tracking.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Icon registry data file + `iconPath()` refactor

**Files:**
- Create: `src/data/icon-registry.ts`
- Modify: `src/lib/icons.ts`
- Create: `tests/unit/icon-registry.test.ts`

**Interfaces produced:**
- `ICON_REGISTRY: Record<string, { file: string; prcSlug: string; iconFlagged: boolean }>` exported from `src/data/icon-registry.ts`.
- `iconPath(id: string)` still returns `/icons/<file>.svg`, but now looks up `id` in `ICON_REGISTRY.file` first, then falls back to `${id}.svg`, then to `placeholder.svg`. Existing signature and callers unchanged.

**Interfaces consumed:**
- Uses `conceptSchema` from T1 (only implicitly — the test cross-references collection).

- [ ] **Step 1: Write the failing test at `tests/unit/icon-registry.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { ICON_REGISTRY } from '@/data/icon-registry';

describe('ICON_REGISTRY', () => {
  it('has no duplicate prcSlug values', () => {
    const slugs = Object.values(ICON_REGISTRY).map((e) => e.prcSlug);
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect(dupes).toEqual([]);
  });

  it('every entry has a non-empty file field ending in .svg', () => {
    for (const [id, entry] of Object.entries(ICON_REGISTRY)) {
      expect(entry.file, `${id}.file`).toMatch(/\.svg$/);
      expect(entry.file.length, `${id}.file length`).toBeGreaterThan(4);
    }
  });

  it('marks exactly the six ICON-flagged concepts', () => {
    const flagged = Object.entries(ICON_REGISTRY)
      .filter(([, e]) => e.iconFlagged)
      .map(([id]) => id)
      .sort();
    expect(flagged).toEqual(
      [
        'cohesion',
        'competency',
        'continuous-assessment',
        'magic-toolbox',
        'theatre-games',
        'warmup',
      ].sort(),
    );
  });

  it('has an entry for every concept collection member (checked in T7+T8 tests)', () => {
    // Placeholder — concrete cross-check lives in tests/unit/concepts-flags.test.ts
    // once all 20 entries exist. Kept here as a signpost.
    expect(Object.keys(ICON_REGISTRY).length).toBeGreaterThanOrEqual(6);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL (module not found)**

```bash
pnpm test tests/unit/icon-registry.test.ts
```

Expected: FAIL — `@/data/icon-registry` module missing.

- [ ] **Step 3: Create `src/data/icon-registry.ts`**

```typescript
/**
 * Site-wide ICON registry — maps concept id to icon asset and PRC slug.
 *
 * `iconFlagged: true` marks the six site-wide concepts the vision spec §4
 * declares "ICON-flagged" (Warmup, Continuous Assessment, Magic Toolbox,
 * Theatre Games, Cohesion, Competency). Other entries render inline icons
 * on their PRC detail pages but are not surfaced with the ICON badge on
 * cards or in Concept popovers.
 *
 * `iconPath()` in src/lib/icons.ts consults this registry first, then
 * falls back to <id>.svg, then to placeholder.svg. All artwork currently
 * ships as a placeholder.svg clone under public/icons/; Desirae swaps
 * files without touching this registry.
 */
export type IconRegistryEntry = {
  file: string;
  prcSlug: string;
  iconFlagged: boolean;
};

export const ICON_REGISTRY = {
  archetypes:             { file: 'archetypes.svg',            prcSlug: 'archetypes',             iconFlagged: false },
  casting:                { file: 'casting.svg',                prcSlug: 'casting',                iconFlagged: false },
  cohesion:               { file: 'cohesion.svg',               prcSlug: 'cohesion',               iconFlagged: true  },
  competency:             { file: 'competency.svg',             prcSlug: 'competency',             iconFlagged: true  },
  'continuous-assessment': { file: 'continuous-assessment.svg', prcSlug: 'continuous-assessment', iconFlagged: true  },
  creativity:             { file: 'creativity.svg',             prcSlug: 'creativity',             iconFlagged: false },
  'developmental-theatre': { file: 'developmental-theatre.svg', prcSlug: 'developmental-theatre', iconFlagged: false },
  facilitation:           { file: 'facilitation.svg',           prcSlug: 'facilitation',           iconFlagged: false },
  'fearless-creativity':  { file: 'fearless-creativity.svg',    prcSlug: 'fearless-creativity',   iconFlagged: false },
  icons:                  { file: 'icons.svg',                  prcSlug: 'icons',                  iconFlagged: false },
  'language-oral-tradition': { file: 'language-oral-tradition.svg', prcSlug: 'language-oral-tradition', iconFlagged: false },
  'language-sparse-resonant': { file: 'language-sparse-resonant.svg', prcSlug: 'language-sparse-resonant', iconFlagged: false },
  'magic-toolbox':        { file: 'magic-toolbox.svg',          prcSlug: 'magic-toolbox',          iconFlagged: true  },
  players:                { file: 'players.svg',                prcSlug: 'players',                iconFlagged: false },
  plot:                   { file: 'plot.svg',                   prcSlug: 'plot',                   iconFlagged: false },
  repetition:             { file: 'repetition.svg',             prcSlug: 'repetition',             iconFlagged: false },
  resilience:             { file: 'resilience.svg',             prcSlug: 'resilience',             iconFlagged: false },
  stage:                  { file: 'stage.svg',                  prcSlug: 'stage',                  iconFlagged: false },
  'theatre-games':        { file: 'theatre-games.svg',          prcSlug: 'theatre-games',          iconFlagged: true  },
  warmup:                 { file: 'warmup.svg',                 prcSlug: 'warmup',                 iconFlagged: true  },
} as const satisfies Record<string, IconRegistryEntry>;
```

- [ ] **Step 4: Refactor `src/lib/icons.ts` to consult the registry**

```typescript
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ICON_REGISTRY } from '@/data/icon-registry';

const publicIcons = join(process.cwd(), 'public', 'icons');

export function iconPath(icon: string): string {
  // Registry lookup first — this is the canonical asset name.
  const registryEntry = (ICON_REGISTRY as Record<string, { file: string }>)[icon];
  const filename = registryEntry?.file ?? `${icon}.svg`;
  const absolute = join(publicIcons, filename);
  if (existsSync(absolute)) return `/icons/${filename}`;
  return '/icons/placeholder.svg';
}
```

- [ ] **Step 5: Run test — expect PASS on the 4 registry tests**

```bash
pnpm test tests/unit/icon-registry.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 6: Run existing icons test to confirm no regression**

```bash
pnpm test tests/unit/icons.test.ts
```

Expected: existing icon tests still pass (registry lookup falls back to filename convention for unknown ids).

- [ ] **Step 7: Verify `pnpm check` and full test suite**

```bash
pnpm check && pnpm test
```

Expected: 0 errors, 0 warnings; full suite green.

- [ ] **Step 8: Commit**

```bash
git add src/data/icon-registry.ts src/lib/icons.ts tests/unit/icon-registry.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-10): add ICON_REGISTRY data file; iconPath consults it first

Formalizes what iconPath() did implicitly — a data-file source of truth
for concept id → icon asset → PRC slug + iconFlagged. Six site-wide
concepts (Warmup, Continuous Assessment, Magic Toolbox, Theatre Games,
Cohesion, Competency) marked iconFlagged per vision spec §4. Placeholder
swaps happen at the file level under public/icons/ without touching
this registry.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Callout CSS + 5 shared PRC components

**Files:**
- Create: `src/styles/callouts.css`
- Modify: `src/styles/tokens.css`
- Create: `src/components/prc/LetterRail.astro`
- Create: `src/components/prc/EntryCard.astro`
- Create: `src/components/prc/RelatedResources.astro`
- Create: `src/components/prc/EditorialNoteAI.astro`
- Create: `src/components/prc/EntryChips.astro`

**Interfaces produced:**
- `.callout-tip`, `.callout-why`, `.callout-box`, `.callout-practical` — CSS classes usable in MDX bodies via `<div class="callout-tip">…</div>`.
- `<LetterRail letters={string[]} />` — sticky top nav; each letter with entries renders as `<a href="#a">A</a>`; letters without entries render as inactive spans.
- `<EntryCard entry={ConceptEntry} />` — renders icon + name + shortDefinition + related count; adds ICON badge when `ICON_REGISTRY[entry.data.slug]?.iconFlagged`.
- `<RelatedResources related={string[]} />` — renders mini-cards for each slug; skips block entirely when array is empty.
- `<EditorialNoteAI />` — no props; renders the standardized `Editorial note: Research notes compiled with AI assistance, 2025.` line.
- `<EntryChips entry={ConceptEntry} />` — renders `Draft` (teal) chip when `entry.data.draft`, `Beyond source` (moss) chip when `entry.data.beyondSource`; renders nothing when neither is set.

- [ ] **Step 1: Create `src/styles/callouts.css`**

```css
/**
 * Cycle 10 — MDX body callouts used by PRC entries.
 * Border-left + tinted background matches the source docs' TIP / boxed
 * teacher-note visual affordances. All colors reference existing tokens.
 */
.callout-tip,
.callout-why,
.callout-box,
.callout-practical {
  margin: 1.25rem 0;
  padding: 0.875rem 1rem 0.875rem 1.125rem;
  border-radius: var(--radius-card);
  font-size: 0.95rem;
  line-height: 1.55;
}

.callout-tip {
  border-left: 4px solid var(--color-clay-500);
  background: color-mix(in oklab, var(--color-clay-500) 6%, white);
}
.callout-tip::before {
  content: 'TIP';
  display: block;
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: var(--color-clay-500);
  margin-bottom: 0.25rem;
}

.callout-why {
  border-left: 4px solid var(--color-teal-600);
  background: color-mix(in oklab, var(--color-teal-600) 6%, white);
}
.callout-why::before {
  content: 'Why do I care?';
  display: block;
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--color-teal-600);
  margin-bottom: 0.25rem;
}

.callout-box {
  border: 1px dashed var(--color-ink-500);
  background: var(--color-ivory-100);
}

.callout-practical {
  border-left: 4px solid var(--color-moss-500);
  background: color-mix(in oklab, var(--color-moss-500) 6%, white);
}
.callout-practical::before {
  content: 'Practical Suggestion';
  display: block;
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--color-moss-500);
  margin-bottom: 0.25rem;
}
```

- [ ] **Step 2: Import callouts.css from `src/styles/tokens.css`**

Append to `src/styles/tokens.css`:

```css
@import './callouts.css';
```

Place after the existing `@import` lines (before the `@theme` block if there is one, or wherever imports currently live — check the file's convention).

- [ ] **Step 3: Create `src/components/prc/LetterRail.astro`**

```astro
---
interface Props {
  letters: string[]; // uppercase A-Z that have at least one entry
}
const { letters } = Astro.props;
const ALL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
---

<nav
  class="border-ivory-200 bg-ivory-50/95 sticky top-0 z-10 flex flex-wrap gap-1 border-b px-1 py-2 backdrop-blur"
  aria-label="Alphabetical index"
>
  {
    ALL.map((letter) =>
      letters.includes(letter) ? (
        <a
          href={`#${letter.toLowerCase()}`}
          class="text-clay-500 hover:bg-clay-50 focus-visible:bg-clay-50 rounded px-2 py-1 text-sm font-medium no-underline"
        >
          {letter}
        </a>
      ) : (
        <span class="text-ink-500/40 rounded px-2 py-1 text-sm" aria-hidden="true">
          {letter}
        </span>
      ),
    )
  }
</nav>
```

- [ ] **Step 4: Create `src/components/prc/EntryCard.astro`**

```astro
---
import { iconPath } from '@/lib/icons';
import { ICON_REGISTRY } from '@/data/icon-registry';
import type { ConceptEntry } from '@/lib/concepts';

interface Props {
  entry: ConceptEntry;
}
const { entry } = Astro.props;
const registry = (ICON_REGISTRY as Record<string, { iconFlagged: boolean }>)[entry.data.slug];
const isIconFlagged = registry?.iconFlagged ?? false;
const relatedCount = entry.data.related.length;
---

<a
  href={`/resource-center/${entry.data.slug}/`}
  class="border-ivory-200 hover:border-clay-500/40 hover:shadow-[var(--shadow-soft)] block rounded-[var(--radius-card)] border bg-white p-4 no-underline transition"
>
  <div class="flex items-start gap-3">
    <img src={iconPath(entry.data.icon)} alt="" width="28" height="28" class="mt-1 shrink-0" />
    <div class="min-w-0 flex-1">
      <div class="flex items-baseline gap-2">
        <p class="font-display text-ink-900 text-lg">{entry.data.name}</p>
        {isIconFlagged && (
          <span class="bg-teal-600/10 text-teal-600 rounded px-1.5 py-0.5 text-[0.65rem] font-medium tracking-wide uppercase">
            ICON
          </span>
        )}
      </div>
      <p class="text-ink-500 mt-1 text-sm">{entry.data.shortDefinition}</p>
      {relatedCount > 0 && (
        <p class="text-ink-500/70 mt-2 text-xs">{relatedCount} related</p>
      )}
    </div>
  </div>
</a>
```

- [ ] **Step 5: Create `src/components/prc/RelatedResources.astro`**

```astro
---
import { iconPath } from '@/lib/icons';
import { getConcept } from '@/lib/concepts';

interface Props {
  related: string[];
}
const { related } = Astro.props;

if (related.length === 0) return null;

const entries = await Promise.all(related.map((slug) => getConcept(slug)));
---

<section class="border-ivory-200 mt-10 border-t pt-6" aria-label="Related resources">
  <h2 class="font-display text-ink-900 text-lg">Other Player Resources</h2>
  <ul class="mt-4 grid gap-3 sm:grid-cols-2">
    {
      entries.map((e) => (
        <li>
          <a
            href={`/resource-center/${e.data.slug}/`}
            class="border-ivory-200 hover:border-clay-500/40 flex items-start gap-3 rounded-[var(--radius-card)] border bg-white p-3 no-underline"
          >
            <img src={iconPath(e.data.icon)} alt="" width="22" height="22" class="mt-1 shrink-0" />
            <div class="min-w-0">
              <p class="font-display text-ink-900 text-base">{e.data.name}</p>
              <p class="text-ink-500 mt-0.5 text-xs">{e.data.shortDefinition}</p>
            </div>
          </a>
        </li>
      ))
    }
  </ul>
</section>
```

- [ ] **Step 6: Create `src/components/prc/EditorialNoteAI.astro`**

```astro
---
/**
 * Standardized AI-attribution footer. Applied to entries whose source
 * docs disclose AI-assisted research (Repetition, Language: Oral
 * Tradition). Wording pending client approval per Cycle 10 bundle.
 */
---

<p class="text-ink-500 mt-8 text-xs italic">
  Editorial note: Research notes compiled with AI assistance, 2025.
</p>
```

- [ ] **Step 7: Create `src/components/prc/EntryChips.astro`**

```astro
---
import type { ConceptEntry } from '@/lib/concepts';
import Chip from '@/components/ui/Chip.astro';

interface Props {
  entry: ConceptEntry;
}
const { entry } = Astro.props;
---

{entry.data.draft && (
  <Chip tone="teal" title="Short definition drafted internally; pending client approval">
    Draft
  </Chip>
)}
{entry.data.beyondSource && (
  <Chip tone="moss" title="Not in the 19 source-doc catalog; retained pending client review">
    Beyond source
  </Chip>
)}
```

- [ ] **Step 8: Run `pnpm check` and `pnpm test`**

```bash
pnpm check && pnpm test
```

Expected: 0 errors; full suite still green (no consumers yet).

- [ ] **Step 9: Commit**

```bash
git add src/styles/callouts.css src/styles/tokens.css src/components/prc/
git commit -m "$(cat <<'EOF'
feat(cycle-10): add PRC shared components + MDX callout classes

- callouts.css: .callout-tip / .callout-why / .callout-box / .callout-practical for MDX bodies, all colors from existing tokens
- LetterRail: sticky A-Z jump nav with inactive-letter treatment
- EntryCard: icon + name + shortDefinition + ICON badge + related-count
- RelatedResources: tail block on entry detail; skips when related[] empty
- EditorialNoteAI: standardized AI-attribution footer
- EntryChips: draft / beyondSource pill affordances

None wired into layouts yet — consumers land in T4-T6.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: `ConceptLayout` rebuild

**Files:**
- Modify: `src/layouts/ConceptLayout.astro`

**Interfaces produced:**
- `ConceptLayout` now renders the new entry-detail template (chips, lede, callouts inherited via MDX, AI footer, RelatedResources block) with `data-pagefind-filter="section:resource-center"` on the article root.

**Interfaces consumed:**
- `<EntryChips />`, `<RelatedResources />`, `<EditorialNoteAI />` from T3.
- `iconPath()` from T2.
- `ConceptEntry` type from `@/lib/concepts`.

- [ ] **Step 1: Rewrite `src/layouts/ConceptLayout.astro`**

Replace the existing file contents:

```astro
---
import BaseLayout from './BaseLayout.astro';
import Container from '@/components/layout/Container.astro';
import EntryChips from '@/components/prc/EntryChips.astro';
import RelatedResources from '@/components/prc/RelatedResources.astro';
import EditorialNoteAI from '@/components/prc/EditorialNoteAI.astro';
import { iconPath } from '@/lib/icons';
import type { ConceptEntry } from '@/lib/concepts';

interface Props {
  entry: ConceptEntry;
}
const { entry } = Astro.props;
---

<BaseLayout
  title={entry.data.name}
  description={entry.data.shortDefinition}
  section="resource-center"
>
  <Container class="py-12">
    <article class="max-w-3xl" data-pagefind-filter="section:resource-center">
      <p class="text-sm font-medium tracking-wide text-teal-600 uppercase">
        <a href="/resource-center/" class="hover:underline">Players Resource Center</a>
      </p>
      <div class="mt-2 flex items-start gap-3">
        <img src={iconPath(entry.data.icon)} alt="" width="48" height="48" class="shrink-0" />
        <div class="flex-1">
          <h1 class="mb-0">{entry.data.name}</h1>
          <div class="mt-2 flex flex-wrap gap-2">
            <EntryChips entry={entry} />
          </div>
        </div>
      </div>
      <p class="font-display text-ink-900 mt-4 text-xl leading-snug">{entry.data.shortDefinition}</p>

      <div class="prose prose-neutral mt-8 max-w-none">
        <slot />
      </div>

      {entry.data.credits && (
        <p class="text-ink-500 mt-8 text-sm italic">{entry.data.credits}</p>
      )}

      {entry.data.aiAttribution && <EditorialNoteAI />}

      <RelatedResources related={entry.data.related} />
    </article>
  </Container>
</BaseLayout>
```

- [ ] **Step 2: Run `pnpm check` and `pnpm test`**

```bash
pnpm check && pnpm test
```

Expected: 0 errors. Existing concept entries render with the new template (chips render empty for all current entries since none have `draft`/`beyondSource` set yet — flipped in T7/T9).

- [ ] **Step 3: Manual browser smoke — verify one entry renders**

```bash
pnpm dev
```

Open http://localhost:4321/resource-center/facilitation/ — verify: breadcrumb link works, icon renders, title + lede, MDX body renders, Related Resources section renders with the 5 related entries as mini-cards.

Stop the dev server (Ctrl+C).

- [ ] **Step 4: Commit**

```bash
git add src/layouts/ConceptLayout.astro
git commit -m "$(cat <<'EOF'
feat(cycle-10): rebuild ConceptLayout with chips, callouts, AI footer, RelatedResources

- Article root carries data-pagefind-filter="section:resource-center" for the site-wide search-modal chip
- Header pairs icon with H1 + EntryChips slot (draft / beyondSource)
- Lede renders shortDefinition in display type
- credits field renders as italic caption when set (Stage entry uses this)
- aiAttribution field triggers the EditorialNoteAI footer
- RelatedResources component replaces the inline chip loop (mini-cards
  with icon + name + shortDefinition — matches vision spec §3's "Other
  Player Resources useful to this conversation" affordance)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Landing rebuild (letter rail + grouped cards)

**Files:**
- Modify: `src/pages/resource-center/index.astro`

**Interfaces consumed:**
- `<LetterRail />`, `<EntryCard />` from T3.
- `listConcepts()` from `@/lib/concepts` (unchanged).

- [ ] **Step 1: Rewrite `src/pages/resource-center/index.astro`**

Replace the file contents:

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
import ReflectivePrompt from '@/components/section/ReflectivePrompt.astro';
import LetterRail from '@/components/prc/LetterRail.astro';
import EntryCard from '@/components/prc/EntryCard.astro';
import { listConcepts } from '@/lib/concepts';

const concepts = await listConcepts();

// Group by first letter of name; letters with no entries stay out of the rail.
const grouped = new Map<string, typeof concepts>();
for (const entry of concepts) {
  const letter = entry.data.name.charAt(0).toUpperCase();
  if (!grouped.has(letter)) grouped.set(letter, []);
  grouped.get(letter)!.push(entry);
}
const activeLetters = Array.from(grouped.keys()).sort();
---

<SectionLayout
  title="Players Resource Center"
  section="resource-center"
  eyebrow="Glossary"
  description="Tools, vocabulary, key concepts, and definitions — the site-wide glossary."
>
  <ReflectivePrompt sectionKey="resource-center" />

  <section
    id="icons"
    class="border-teal-600/20 bg-teal-600/5 mt-6 rounded-[var(--radius-card)] border p-5"
    data-pagefind-ignore
  >
    <h2 class="font-display text-xl">What are the ICONs?</h2>
    <p class="text-ink-700 mt-2 max-w-prose text-sm">
      The small visual symbols throughout the site — pictures paired with a name and a short
      definition — are called <strong>ICONs</strong>. Click or tap any one to see its definition
      without leaving the page.
      <a href="/resource-center/icons/">Read the full ICONs entry &rarr;</a>
    </p>
  </section>

  <div class="mt-8" data-pagefind-ignore>
    <label class="block max-w-md">
      <span class="text-sm font-medium">Filter</span>
      <input
        type="search"
        placeholder="Type to filter&hellip;"
        class="border-ivory-200 bg-ivory-50 mt-1 w-full rounded border px-3 py-2 text-base"
        data-concept-filter
      />
    </label>
  </div>

  <div class="mt-4">
    <LetterRail letters={activeLetters} />
  </div>

  <div class="mt-6 space-y-10" data-concept-groups>
    {
      activeLetters.map((letter) => (
        <section data-letter-section={letter}>
          <h2 id={letter.toLowerCase()} class="font-display text-clay-500 text-2xl">
            {letter}
          </h2>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            {grouped.get(letter)!.map((entry) => (
              <div data-concept-name={entry.data.name.toLowerCase()}>
                <EntryCard entry={entry} />
              </div>
            ))}
          </div>
        </section>
      ))
    }
  </div>
</SectionLayout>

<script>
  const filter = document.querySelector<HTMLInputElement>('[data-concept-filter]');
  const groups = document.querySelectorAll<HTMLElement>('[data-letter-section]');
  filter?.addEventListener('input', () => {
    const q = filter.value.trim().toLowerCase();
    groups.forEach((section) => {
      const cards = section.querySelectorAll<HTMLElement>('[data-concept-name]');
      let anyVisible = false;
      cards.forEach((card) => {
        const name = card.dataset.conceptName ?? '';
        const hide = q.length > 0 && !name.includes(q);
        card.hidden = hide;
        if (!hide) anyVisible = true;
      });
      section.hidden = q.length > 0 && !anyVisible;
    });
  });
</script>
```

- [ ] **Step 2: Run `pnpm check` and `pnpm test`**

```bash
pnpm check && pnpm test
```

Expected: 0 errors.

- [ ] **Step 3: Manual browser smoke — verify landing**

```bash
pnpm dev
```

Open http://localhost:4321/resource-center/ — verify: LetterRail is sticky (scroll page, letters stay pinned); clicking `F` jumps to the F section; typing `cohes` in the filter hides everything except the C section's Cohesion card; typing gibberish hides every section.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/resource-center/index.astro
git commit -m "$(cat <<'EOF'
feat(cycle-10): rebuild PRC landing with letter rail and grouped cards

Replaces the flat filterable list with an A-Z letter rail (sticky) and
letter-grouped EntryCard grids. Retains the on-page keyword filter for
fast in-section lookup and the "What are the ICONs?" callout that
answers the landing-page Idea Two question. Filter hides both cards
and their letter section headings when the section empties out.

Chrome (filter, ICONs callout) carries data-pagefind-ignore; entry
cards inherit the site-wide index and become findable via the header
search modal.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Slug rename `archetype` → `archetypes`

**Files:**
- Rename: `src/content/concepts/archetype.mdx` → `src/content/concepts/archetypes.mdx`
- Modify: every `.astro` and `.mdx` file with `<Concept id="archetype">` or `<Concept id='archetype'>`
- Modify: every `related:` array containing `archetype`

**Interfaces consumed:**
- The schema `slug` field in the frontmatter — must match `archetypes` after rename.

- [ ] **Step 1: Grep the codebase for all references**

```bash
grep -rn 'archetype' src/ --include='*.astro' --include='*.mdx' --include='*.ts' | grep -v 'archetypes' > /tmp/archetype-refs.txt
cat /tmp/archetype-refs.txt
```

Expected: multiple hits in `src/content/concepts/archetype.mdx` (frontmatter), any MDX using `<Concept id="archetype">`, any `related: ['archetype', ...]` arrays, and possibly Cycle-1 index files.

- [ ] **Step 2: Rename the file and update its frontmatter slug**

```bash
git mv src/content/concepts/archetype.mdx src/content/concepts/archetypes.mdx
```

Edit `src/content/concepts/archetypes.mdx` frontmatter:

```yaml
---
name: Archetypes
slug: archetypes
# ...preserve current shortDefinition, icon, related unchanged for now
---
```

(Full body rewrite happens in T7 — this task only handles the mechanical rename.)

- [ ] **Step 3: Update every reference**

Use Edit tool (not `sed` — Bash doc says prefer Edit). For each file surfaced in Step 1, replace:
- `<Concept id="archetype">` → `<Concept id="archetypes">`
- `<Concept id="archetype" />` → `<Concept id="archetypes" />`
- `<Concept id='archetype'` → `<Concept id='archetypes'`
- YAML `related` entries: `- archetype` → `- archetypes`, `['archetype', ...]` → `['archetypes', ...]`

- [ ] **Step 4: Verify no stray references**

```bash
grep -rn '"archetype"\|'"'"'archetype'"'"'\|- archetype$' src/ --include='*.astro' --include='*.mdx' --include='*.ts'
```

Expected: 0 hits.

- [ ] **Step 5: Run `pnpm check` and `pnpm test` and `pnpm build`**

```bash
pnpm check && pnpm test && pnpm build
```

Expected: full success. Build fails loud on unknown Concept id (via `getConcept()` throwing) — if this passes, the rename is complete.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
refactor(cycle-10): rename concept slug archetype -> archetypes

Match the vision spec's plural title. Rename ripples across every
<Concept id="archetype"> usage and every related[] reference in the
concepts collection. The Concept popover component throws loudly on
unknown ids at build time, so this rename is self-verifying.

Body rewrite from source lands in T7.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Source-faithful rewrite of 8 existing entries

**Files:**
- Modify: `src/content/concepts/archetypes.mdx`
- Modify: `src/content/concepts/cohesion.mdx`
- Modify: `src/content/concepts/competency.mdx`
- Modify: `src/content/concepts/facilitation.mdx`
- Modify: `src/content/concepts/fearless-creativity.mdx`
- Modify: `src/content/concepts/magic-toolbox.mdx`
- Modify: `src/content/concepts/theatre-games.mdx`
- Modify: `src/content/concepts/warmup.mdx`
- Modify: `src/content/concepts/icons.mdx` (only frontmatter: set `draft: true`)
- Modify: `src/content/concepts/players.mdx` (only frontmatter: set `beyondSource: true`)
- Modify: `src/content/concepts/resilience.mdx` (only frontmatter: set `beyondSource: true`)

**Source-doc IDs (Google Drive MCP `mcp__claude_ai_Google_Drive__read_file_content`):**

| Slug | Source doc | Drive file ID |
|---|---|---|
| archetypes | Archetypes | `1Rbdj1ZZ5eBNeClV8SYMU6qUA0N4l2UZXYcTJ9UVuxzA` |
| cohesion | Cohesion in Groups: What Is It? | `1cOl5Zymu-NPaRIwG7PV-vx4nHTN0fiwulnFbeZavcEM` |
| competency | Competency: DT:FC | `11Cwng9wu2nRCFPaR6eyk8oLCLh40B9yTDItcIp23P7E` |
| facilitation | Facilitation & Facilitator Profile | `15sJMxzwXVw_0d7o_xUwlTJ5St8YCByGRTkGuQFBnT9Y` |
| fearless-creativity | Fearless Creativity | `19N8tq5iPLLACVBWgRwCuLpn6JNKI_e0z8A7iobLv6hU` |
| magic-toolbox | Theatre Games Magic Toolbox (ICON) | `1wqvjamFH350-XdKGSNnpLUU5_1g60JMEFaEOZZtqTDk` |
| theatre-games | Theatre Games: What Are They? | `1HtNO_9RpzA3Bz-ExlRRJ9nTAKOU76iRPfWCsSLar6U4` |
| warmup | Warmup : ICON | `1uXV101NGhnjBw08t_E2rOQxFFG80UF7gYGDprwjB4bY` |

**Per-entry workflow (repeat for each of the 8 rewrites):**

- [ ] **A: Read the source doc**

```
Use mcp__claude_ai_Google_Drive__read_file_content with the Drive file ID from the table above.
```

Read carefully. Identify:
- The source's own opening line / short definition (Facilitation has an explicit `Short Definition:` — use verbatim for its shortDefinition).
- Every heading / section structure.
- Every quoted pedigree (McClelland 1973, Rubin, Rick Rubin *The Creative Act* 2023, Plato's Phaedrus, Roger Holzberg 2021, Nils Peterson) — preserve verbatim with attribution.
- Every callout candidate (TIP, "Why Do I Care?", boxed teacher notes, Practical Suggestions) — mark for `<div class="callout-*">` treatment.
- Every cross-reference to another concept — collect into the `related:` array.
- Editorial working notes to strip per vision spec §7 (DESIRAE:, LOLA:, `(ICON)` suffix, `(LOGO)`, raw google URLs, `(image of water molecule)`, `(pic?)`, etc.).
- Any source-doc typos to normalize (only obvious mechanical typos — Resonate→Resonant in the title, broken sentences in Magic Toolbox; NEVER touch names — Peterson vs Petersen goes to the client bundle).

- [ ] **B: Draft the MDX**

Structure every entry as:

```mdx
---
name: <Entry Name>
slug: <slug>
shortDefinition: "<source verbatim if available, else drafted from the opening>"
icon: <slug>
related: ['<slug-1>', '<slug-2>', ...]
credits: "<if applicable, e.g. 'Presentation developed by Jackie Pualani Johnson' for Stage>"
provenance: "<if applicable, e.g. 'Published in September 2024 Newsletter' — NOT rendered on page>"
draft: <true unless this is Facilitation>
aiAttribution: <true only for Repetition + Language: Oral Tradition (verify from source)>
---

## <First source heading>

<Body prose — source-faithful, callouts as needed>

<div class="callout-tip">
Concrete TIP text from the source doc.
</div>

## <Next source heading>

...
```

- [ ] **C: Verify the entry**

For each entry:

```bash
pnpm check:prohibited
```

Expected: 0 violations (any stripping misses surface here).

```bash
pnpm check
```

Expected: 0 errors (Zod schema catches drift).

```bash
pnpm dev
```

Open http://localhost:4321/resource-center/<slug>/ — visually confirm the entry renders: lede, callouts styled, related resources block, chips (Draft for non-Facilitation entries), MDX headings hierarchy.

- [ ] **D: Commit (one commit per entry)**

```bash
git add src/content/concepts/<slug>.mdx
git commit -m "$(cat <<'EOF'
content(cycle-10): source-faithful rewrite of <name> from Drive doc

Preserves source's <notable feature — e.g. "canonical five-competency
definition (McClelland 1973 pedigree)", "Why Do I Care? section",
"boxed teacher note on cool-down", "high/low cohesion warnings">.
shortDefinition marked draft:true pending client approval.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

**Entry-specific notes:**

- **Facilitation**: Source has an explicit `Short Definition:` — use verbatim; leave `draft: false`. Preserve the facilitator skills list (instruction artists, ego-free zone, group whisperers, champions of all, risk companions, feedback resisters).
- **Cohesion**: The source's `cohesion of oxygen and nitrogen atoms` is a science error (water is H+O). DO NOT ship the erroneous phrasing. Render the water-molecule reference as `<div class="callout-box">Illustration pending: a water-molecule diagram will appear here. The source doc's science description of water molecules is being verified with the client — see docs/client-reviews/2026-08-12-cycle10-prc-review.md.</div>`. Preserve the "Why Do I Care?" section, the leadership-style guidance, and the game-selection rules (high-cohesion game + low-cohesion group = harm; low+high = boredom; medium = bridge).
- **Competency**: This is the CANONICAL five-competency definition site-wide. Preserve McClelland 1973 attribution. The Theatre Games section links here; do not duplicate the definition elsewhere.
- **Fearless Creativity**: Preserve Roger Holzberg 2021 attribution ("What we learned then was to be creative… no, Fearlessly Creative"). The four key concepts (Creativity, Constraints, Cohesion, Competencies) each link to their entry — Constraints links to `/resource-center/plot/#constraints` (Plot's anchor, per vision spec §2 gap decision). Holzberg reference gets a link to `/legacy/timeline/` (era where he appears).
- **Magic Toolbox**: Preserve the "Tool #1: Open space", loud-noise requirement, online-adaptation notes, do/don't lists, card-deck partner-choosing methods. Minimal repair on the source's broken sentence (`the space needs to be It's a space where…`) — reasonable minimal fix. Flag the repair in the client bundle.
- **Theatre Games**: Canonical short description (first paragraph published in September 2024 Newsletter — set `provenance:` in frontmatter). Preserve the promise list (hundreds of games, index, searchable by name/competency/cohesion). Cross-link to `/theatre-games/`.
- **Warmup**: Preserve physical/psychological/emotional readiness framing, warmup components (pulse raising, mobility, stretching, dynamic movements, skill rehearsal), and the **Cool-down** concept (surface it explicitly with its own H2 or prominent callout — vision spec §2 row 18: "Cool-down concept (with examples) — surface it, don't bury"). Audience reference renders as `Audience (pending)` styled as a `(pending)` chip that links nowhere. Working note "OTHERS? One Seed Child, OCEAN?" stripped. Cross-links to Theseus module + How To Facilitate Warmup Games (latter as `(pending)` chip if the route doesn't exist — verify with `find src/pages -name "how-to-facilitate*"`).
- **Archetypes**: Body embeds `<WayfarersJourneyWheel />` (existing shared component from `src/components/childrens/`). Preserve character archetype table (may need responsive-list treatment), archetypal situations, One Story / plot archetype, performance & curtain-call passage.
- **icons.mdx**: Only frontmatter change — set `draft: true`. Body preserved as-is; ticketed in client bundle for approval / replacement.
- **players.mdx**: Only frontmatter change — set `beyondSource: true`. Body preserved. Ticketed for client decision.
- **resilience.mdx**: Only frontmatter change — set `beyondSource: true`. Body preserved. Ticketed for client decision.

- [ ] **E: After ALL 11 files are handled, run full CI**

```bash
pnpm build && pnpm test:e2e
```

Expected: 0 build errors; smoke test still passes (existing entries render; new entries defer to T8; concept popover still opens on the game-detail page).

---

## Task 8: Author 8 non-Stage new entries from Drive

**Files:**
- Create: `src/content/concepts/casting.mdx`
- Create: `src/content/concepts/continuous-assessment.mdx`
- Create: `src/content/concepts/creativity.mdx`
- Create: `src/content/concepts/developmental-theatre.mdx`
- Create: `src/content/concepts/language-oral-tradition.mdx`
- Create: `src/content/concepts/language-sparse-resonant.mdx`
- Create: `src/content/concepts/plot.mdx`
- Create: `src/content/concepts/repetition.mdx`

**Source-doc IDs:**

| Slug | Source doc | Drive file ID |
|---|---|---|
| casting | Casting (Choosing Players for Roles) | `1GwaTgKLjzCpmXTHaqBcTWj7_mKaXOJaR8UBl_OD6Ck4` |
| casting (educator subsection) | Casting for Educators using DT:FC Methods | `19vxNSyuky8UTDHglHdCon2AUy17AeNlecVIcZVb9lko` |
| continuous-assessment | Continuous Assessment (ICON) | `1_gxW6eEYsHrAq8uQSX6yGSXRlY9GOEjrN5Lafj2jNaM` |
| creativity | Creativity | `1dEs25Y5FX38tgczKuNxZPbAOfEcwOOncwtwr1imcIv8` |
| developmental-theatre | Developmental Theatre - Description (LOGO) | `1GTowjKdXh8O2zuBxdvylF2h5QHxy3uazcJU_SHXTS5M` |
| language-oral-tradition | Language: Oral Tradition | `1yu-lnp8BcnvM4g--WTuhpsUmaVwRxXDHk-7A4SqW2Yo` |
| language-sparse-resonant | Language: Sparse, Resonate | `19SK88PzNaE7W9M9PgQzq1k1zNqHByyqr_GpXXTaJQ_Q` |
| plot | Writing a Play - check this doc info is included | `1o6yIsuNvyx8NoBA5OERR4nC_z2n-aD-SManXNDvctD4` |
| repetition | Repetition | `1q9NkQqb-h_9itliT9A7tYwCqBlrJDp3QyULBJECoez8` |

**Per-entry workflow (same A-D pattern as T7 — read Drive doc, draft MDX, verify, commit).**

**Entry-specific notes:**

- **Casting**: CONSOLIDATED entry — read both Drive docs (main Casting + Casting for Educators). Primary body carries the shared concepts (Versatile vs Stable casting, role-drawing methods by day/by scene, Will Power example with locally-hosted PDF reference — render as `(pending)` chip until Cycle 8 unblocks per Cycle 9 T7 carryover; costume-piece identification tip; Theseus module excerpt). Add `## For Educators` H2 subsection carrying educator-specific framing ("Performance for an audience is not the goal" and related material). Frontmatter includes `assets: [{slug: 'will-power-pdf', description: 'Will Power article local PDF hosting', status: 'placeholder'}]`.
- **Continuous Assessment**: Short entry per source. Preserve assessment questions including wellbeing checks (sleep, food, fear) and group-inclusion guidance. ICON-flagged — the `ICON` badge renders on the EntryCard automatically because ICON_REGISTRY marks it `iconFlagged: true`.
- **Creativity**: Preserve Rick Rubin attribution — `*The Creative Act* (2023)`. Preserve adaptive vs innovative creativity framing, "birthright" language, recovery framing ("possible to recover our creative birthright").
- **Developmental Theatre**: The source contains the canonical short organizational description (published Sept 2024 newsletter — set `provenance:` in frontmatter). This text becomes the site-wide meta description via `SITE_CONFIG.ogDefaults` / `BaseLayout` — verify Cycle 7 site-config isn't already using a different string; if it is, flag in the client bundle (spec §2 row 10: "Reuse this text as the site-wide meta description / About boilerplate so the org describes itself identically everywhere"). "(LOGO)" placement marker stripped per vision spec §7.
- **Language: Oral Tradition**: Preserve the Four R's (Rhythm, Rhyme, Resonance, Repetition), Shakespeare/Chaucer context, Nils Peterson commentary as first-person testimony (render as blockquote — testimony styling like Legacy `TestimonyPullQuote`), Plato's Phaedrus excerpt, current-research links. **Peterson/Petersen name conflict** — use `Nils Peterson` as the source doc has it; flag the site-wide spelling reconciliation in the client bundle. Set `aiAttribution: true` if the source discloses AI-assisted research (verify at read time).
- **Language: Sparse, Resonant**: Title typo normalized (`Resonate` → `Resonant` — body text already uses `Resonant`). Preserve sparse/resonant examples, TIP on pausing, DT:FC language rules list ("no filler, no narrated actions — perform what is happening, not explain it"), mimed-tree dialogue example. Related resources per source ("Repetition… Oral Tradition… Theatre Games: Vocal Expression competency") — set `related: ['repetition', 'language-oral-tradition', 'competency']`.
- **Plot** (source title: "Writing a Play - check this doc info is included"): Preserve myth-fidelity rules (Cinderella toes example STAYS — doctrine detail, do not soften), elongation method, four-sentence lake example, round-robin scriptwriting process, and **Constraints Shape Roles** section — render as `<section id="constraints">` for Fearless Creativity's link to land on. Preserve van constraint, balanced roles, "no stars", multi-part archetypes with named script examples (Savitri, Ivanna and the Rainbow Serpent, Water of Life doubling). Cross-link to `/childrens-theatre/how-to/create-a-script/` (procedural how-to counterpart per spec §2 row 19). Title's working note "check this doc info is included" stripped. Add to client bundle: report the Plot/how-to overlap audit result.
- **Repetition**: Preserve Four R's cross-reference, three repetition types (incidents, words/phrases, concepts), boxed teacher note (render as `<div class="callout-box">`). Storytelling-research section preserved. `aiAttribution: true` (source discloses AI use); 2005→2025 typo fixed automatically by rendering via the standard `<EditorialNoteAI />` footer instead of the source's raw note. Related: `['language-oral-tradition', 'language-sparse-resonant']`.

- [ ] **Final: After all 8 entries created, run full CI**

```bash
pnpm build && pnpm test:e2e
```

Expected: 0 build errors; smoke test passes. Guardrail catches any residual stripping misses.

---

## Task 9: Stage entry + `StageDiagram` component + 6 SVGs

**Files:**
- Create: `src/components/prc/StageDiagram.astro`
- Create: `src/content/concepts/stage.mdx`
- Create: `tests/unit/concepts-stage.test.ts`

**Source doc:** Stage (`1qyh0I9KDMQeVtUDvK-HsTIfidrYVMhZkTm_AiG11eQ8`) — 7-slide presentation by Jackie Pualani Johnson.

**Interfaces produced:**
- `<StageDiagram variant="proscenium|arena|in-the-round|thrust|unusual|sightlines" />` — inline SVG.
- `stage.mdx` — 6 configuration sections + sightlines + credits.

- [ ] **Step 1: Write the failing test at `tests/unit/concepts-stage.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('Stage entry — Cycle 10', () => {
  const raw = readFileSync(
    join(process.cwd(), 'src/content/concepts/stage.mdx'),
    'utf8',
  );

  it('declares credits to Jackie Pualani Johnson', () => {
    expect(raw).toMatch(/credits:\s*['"].*Jackie Pualani Johnson/);
  });

  it('sets desiraeReplaceable true', () => {
    expect(raw).toMatch(/desiraeReplaceable:\s*true/);
  });

  it('renders StageDiagram for all 6 variants', () => {
    const variants = ['proscenium', 'arena', 'in-the-round', 'thrust', 'unusual', 'sightlines'];
    for (const v of variants) {
      expect(raw, `variant ${v}`).toMatch(new RegExp(`<StageDiagram\\s+variant=["']${v}["']`));
    }
  });

  it('flags Theatre in the Round as DT:FC Favorite', () => {
    expect(raw).toMatch(/DT:FC Favorite/);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL (stage.mdx does not exist)**

```bash
pnpm test tests/unit/concepts-stage.test.ts
```

Expected: FAIL — ENOENT reading the file.

- [ ] **Step 3: Read the Stage source deck via Drive MCP**

```
mcp__claude_ai_Google_Drive__read_file_content fileId="1qyh0I9KDMQeVtUDvK-HsTIfidrYVMhZkTm_AiG11eQ8"
```

Note each slide's content (Proscenium, Arena, Theatre in the Round with "DT:FC Favorite" flag, Thrust, Unusual configurations — multi-focus / found spaces / touring / pop-up / street, Sight Lines).

- [ ] **Step 4: Create `src/components/prc/StageDiagram.astro`**

```astro
---
type Variant =
  | 'proscenium'
  | 'arena'
  | 'in-the-round'
  | 'thrust'
  | 'unusual'
  | 'sightlines';
interface Props {
  variant: Variant;
}
const { variant } = Astro.props;
---

<figure class="border-ivory-200 my-6 rounded-[var(--radius-card)] border bg-white p-4">
  {
    variant === 'proscenium' && (
      <svg viewBox="0 0 240 140" role="img" aria-labelledby="stage-proscenium-title" class="mx-auto block h-auto w-full max-w-[320px]">
        <title id="stage-proscenium-title">Proscenium stage — audience faces a framed stage on one side</title>
        <rect x="10" y="10" width="220" height="40" fill="none" stroke="currentColor" stroke-width="2" />
        <text x="120" y="35" text-anchor="middle" font-size="10" fill="currentColor">STAGE</text>
        <g fill="currentColor" opacity="0.6">
          {Array.from({ length: 32 }).map((_, i) => {
            const cx = 20 + (i % 16) * 13;
            const cy = 75 + Math.floor(i / 16) * 15;
            return <circle cx={cx} cy={cy} r="3" />;
          })}
        </g>
        <text x="120" y="130" text-anchor="middle" font-size="10" fill="currentColor">AUDIENCE</text>
      </svg>
    )
  }
  {
    variant === 'arena' && (
      <svg viewBox="0 0 240 200" role="img" aria-labelledby="stage-arena-title" class="mx-auto block h-auto w-full max-w-[320px]">
        <title id="stage-arena-title">Arena stage — audience surrounds the stage on all four sides</title>
        <rect x="90" y="80" width="60" height="40" fill="none" stroke="currentColor" stroke-width="2" />
        <text x="120" y="105" text-anchor="middle" font-size="10" fill="currentColor">STAGE</text>
        <g fill="currentColor" opacity="0.6">
          {[...Array(8)].map((_, i) => <circle cx={30 + i * 25} cy={30} r="3" />)}
          {[...Array(8)].map((_, i) => <circle cx={30 + i * 25} cy={170} r="3" />)}
          {[...Array(4)].map((_, i) => <circle cx={30} cy={70 + i * 20} r="3" />)}
          {[...Array(4)].map((_, i) => <circle cx={210} cy={70 + i * 20} r="3" />)}
        </g>
      </svg>
    )
  }
  {
    variant === 'in-the-round' && (
      <svg viewBox="0 0 240 200" role="img" aria-labelledby="stage-round-title" class="mx-auto block h-auto w-full max-w-[320px]">
        <title id="stage-round-title">Theatre in the Round — audience surrounds a circular stage</title>
        <circle cx="120" cy="100" r="35" fill="none" stroke="currentColor" stroke-width="2" />
        <text x="120" y="104" text-anchor="middle" font-size="10" fill="currentColor">STAGE</text>
        <g fill="currentColor" opacity="0.6">
          {[...Array(16)].map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const cx = 120 + Math.cos(a) * 75;
            const cy = 100 + Math.sin(a) * 75;
            return <circle cx={cx} cy={cy} r="3" />;
          })}
          {[...Array(16)].map((_, i) => {
            const a = (i / 16) * Math.PI * 2 + Math.PI / 16;
            const cx = 120 + Math.cos(a) * 90;
            const cy = 100 + Math.sin(a) * 90;
            return <circle cx={cx} cy={cy} r="3" />;
          })}
        </g>
      </svg>
    )
  }
  {
    variant === 'thrust' && (
      <svg viewBox="0 0 240 170" role="img" aria-labelledby="stage-thrust-title" class="mx-auto block h-auto w-full max-w-[320px]">
        <title id="stage-thrust-title">Thrust stage — stage extends into audience; audience wraps three sides</title>
        <rect x="60" y="10" width="120" height="40" fill="none" stroke="currentColor" stroke-width="2" />
        <rect x="90" y="50" width="60" height="40" fill="none" stroke="currentColor" stroke-width="2" />
        <text x="120" y="35" text-anchor="middle" font-size="10" fill="currentColor">STAGE</text>
        <g fill="currentColor" opacity="0.6">
          {[...Array(8)].map((_, i) => <circle cx={30 + i * 25} cy={110} r="3" />)}
          {[...Array(8)].map((_, i) => <circle cx={30 + i * 25} cy={130} r="3" />)}
          {[...Array(3)].map((_, i) => <circle cx={30} cy={60 + i * 20} r="3" />)}
          {[...Array(3)].map((_, i) => <circle cx={210} cy={60 + i * 20} r="3" />)}
        </g>
      </svg>
    )
  }
  {
    variant === 'unusual' && (
      <svg viewBox="0 0 240 170" role="img" aria-labelledby="stage-unusual-title" class="mx-auto block h-auto w-full max-w-[320px]">
        <title id="stage-unusual-title">Unusual configurations — found spaces, multi-focus, touring, pop-up, street</title>
        <g fill="none" stroke="currentColor" stroke-width="2">
          <rect x="20" y="20" width="60" height="30" />
          <rect x="150" y="30" width="70" height="25" />
          <rect x="40" y="90" width="80" height="30" />
          <circle cx="180" cy="105" r="18" />
        </g>
        <g fill="currentColor" opacity="0.6">
          {[...Array(6)].map((_, i) => <circle cx={20 + i * 12} cy={140} r="2.5" />)}
          {[...Array(6)].map((_, i) => <circle cx={140 + i * 12} cy={140} r="2.5" />)}
        </g>
      </svg>
    )
  }
  {
    variant === 'sightlines' && (
      <svg viewBox="0 0 240 170" role="img" aria-labelledby="stage-sightlines-title" class="mx-auto block h-auto w-full max-w-[320px]">
        <title id="stage-sightlines-title">Sight lines — connecting each audience seat to the acting area</title>
        <rect x="90" y="20" width="60" height="30" fill="none" stroke="currentColor" stroke-width="2" />
        <text x="120" y="40" text-anchor="middle" font-size="10" fill="currentColor">STAGE</text>
        <g stroke="currentColor" stroke-width="0.75" opacity="0.5">
          {[...Array(7)].map((_, i) => (
            <line x1={120} y1={35} x2={20 + i * 33} y2={150} />
          ))}
        </g>
        <g fill="currentColor" opacity="0.6">
          {[...Array(7)].map((_, i) => <circle cx={20 + i * 33} cy={150} r="3" />)}
        </g>
      </svg>
    )
  }
</figure>
```

- [ ] **Step 5: Create `src/content/concepts/stage.mdx`**

Frontmatter shape:

```yaml
---
name: Stage
slug: stage
shortDefinition: "A brief drafted definition of stage configurations and why they shape the play."
icon: stage
related: ['magic-toolbox', 'archetypes', 'plot']
credits: "Presentation developed by Jackie Pualani Johnson, edited for DTFC website 2025."
draft: true
desiraeReplaceable: true
assets:
  - slug: stage-diagrams
    description: "Six in-repo SVG diagrams for stage configurations; pending Desirae refinement."
---

import StageDiagram from '@/components/prc/StageDiagram.astro';

## Proscenium

<StageDiagram variant="proscenium" />

<Source body content for Proscenium slide.>

## Arena

<StageDiagram variant="arena" />

...

## Theatre in the Round <span class="bg-clay-500/10 text-clay-500 ml-2 rounded px-2 py-0.5 text-xs font-medium tracking-wide uppercase">DT:FC Favorite</span>

<StageDiagram variant="in-the-round" />

<Source body content — preserve the DT:FC Favorite flag context.>

## Thrust

<StageDiagram variant="thrust" />

...

## Unusual Configurations

<StageDiagram variant="unusual" />

<Source body — multi-focus, found spaces, touring, pop-up, street.>

## Sight Lines

<StageDiagram variant="sightlines" />

<Source body — sight-line rules and audience-placement implications.>
```

(Fill in `...` with content read from the source deck. The `StageDiagram` import path uses `@/` so MDX resolves to `src/`.)

- [ ] **Step 6: Verify MDX imports work in content collections**

Astro content collections support MDX with component imports at the top of the body. If import fails, fall back to declaring `StageDiagram` at the render site — edit `src/pages/resource-center/[slug].astro` to pass `StageDiagram` through `components={{ Concept, StageDiagram }}` (mirror the Concept pattern).

```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 7: Run the T9 test — expect PASS**

```bash
pnpm test tests/unit/concepts-stage.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 8: Manual browser smoke**

```bash
pnpm dev
```

Open http://localhost:4321/resource-center/stage/ — verify: all 6 SVG diagrams render (Proscenium, Arena, In the Round with DT:FC Favorite flag, Thrust, Unusual, Sight Lines); credits line renders at bottom; Draft chip renders in header.

Stop the dev server.

- [ ] **Step 9: Commit**

```bash
git add src/components/prc/StageDiagram.astro src/content/concepts/stage.mdx tests/unit/concepts-stage.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-10): Stage entry with 6 in-repo SVG diagrams

Six configurations rendered inline from the source deck (Jackie Pualani
Johnson, edited for DTFC 2025) — Proscenium, Arena, Theatre in the Round
(DT:FC Favorite), Thrust, Unusual (multi-focus / found spaces / touring
/ pop-up / street), Sight Lines. SVGs use the deck's own labeled-shape
visual language (rectangles for stage, dots for audience, lines for
sight paths); desiraeReplaceable: true so refinement swaps happen at
the component level without content edits.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Cross-section wiring

**Files:**
- Modify: `src/pages/theatre-games/index.astro`
- Modify: `src/pages/childrens-theatre/index.astro`
- Modify: `src/pages/childrens-theatre/scripts/[slug].astro`

**Interfaces consumed:**
- `<Concept id="…" />` component from `@/components/concept/Concept.astro`.

- [ ] **Step 1: Audit `src/pages/theatre-games/index.astro` for first-mention concepts**

Read the file. Identify the FIRST inline mention (in prose, not headings) of each: `cohesion`, `competency`, `warmup`, `resilience`. Wrap each in `<Concept id="…" />`. Skip mentions already inside code, links, or headings.

Example transformation:

```astro
<!-- Before -->
<p>The five competencies emerge as players develop resilience through repeated warmup rituals.</p>

<!-- After -->
<p>The five <Concept id="competency" /> emerge as players develop <Concept id="resilience" /> through repeated <Concept id="warmup" /> rituals.</p>
```

- [ ] **Step 2: Add Casting sidebar callout to `src/pages/childrens-theatre/index.astro`**

Read the file to find the current sidebar / directory-cards section. Add a new card OR a small callout beneath the directory cards (whichever fits the layout better — model after the existing `directoryCards` block):

```astro
<aside class="border-teal-600/20 bg-teal-600/5 mt-8 rounded-[var(--radius-card)] border p-5">
  <h2 class="font-display text-xl">Casting Players for these plays</h2>
  <p class="text-ink-700 mt-2 text-sm">
    Role-drawing methods, versatile vs. stable casting, and the &ldquo;For Educators&rdquo; framing all live in the Players Resource Center.
  </p>
  <a href="/resource-center/casting/" class="text-clay-500 mt-3 inline-block text-sm font-medium">
    Read Casting &rarr;
  </a>
</aside>
```

- [ ] **Step 3: Inject inline Casting link in `src/pages/childrens-theatre/scripts/[slug].astro`**

The render path currently renders the MDX via `<Content components={...} />`. Add a small trailing section that appears only when `library === 'childrens-plays' || library === 'teaching-modules'`:

```astro
{
  (entry.data.library === 'childrens-plays' ||
   entry.data.library === 'teaching-modules') && (
    <div class="border-teal-600/20 mt-8 border-l-4 pl-4 text-sm">
      <p class="text-ink-500">
        For role-selection methods and versatile-vs-stable casting notes:
        <a href="/resource-center/casting/">See Casting &rarr;</a>
      </p>
    </div>
  )
}
```

Place it after the MDX content renders but inside the same `<article>` container. Read the file first to identify the exact insertion point.

- [ ] **Step 4: Run `pnpm check`, `pnpm test`, and smoke test**

```bash
pnpm check && pnpm test && pnpm build
```

Expected: 0 errors. Build succeeds (Concept popover throws loudly on unknown ids; any typo surfaces here).

- [ ] **Step 5: Manual smoke — verify the cross-links**

```bash
pnpm dev
```

- http://localhost:4321/theatre-games/ — verify inline Concept popovers open for cohesion/competency/warmup/resilience mentions.
- http://localhost:4321/childrens-theatre/ — verify Casting callout renders.
- http://localhost:4321/childrens-theatre/scripts/water-of-life/ (or any children's play) — verify inline "See Casting →" link renders after the body.
- http://localhost:4321/legacy/timeline/ — verify Fearless Creativity's Holzberg link from `/resource-center/fearless-creativity/` lands somewhere reasonable (rewrote in T7).

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/pages/theatre-games/index.astro src/pages/childrens-theatre/index.astro src/pages/childrens-theatre/scripts/[slug].astro
git commit -m "$(cat <<'EOF'
feat(cycle-10): cross-section wiring — TG popovers, CT casting callout + inline link

- Theatre Games landing: first mention of cohesion / competency /
  warmup / resilience wrapped in <Concept /> popovers — PRC is now the
  single source of truth for these definitions
- Children's Theatre landing: sidebar callout linking to /resource-center/casting/
- Children's Theatre play detail: injected "See Casting →" line at the
  end of every childrens-plays / teaching-modules render (edited in
  [slug].astro so future plays inherit)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Prohibited-text guardrail additions

**Files:**
- Modify: `scripts/check-prohibited-text.mjs`
- Modify: `tests/unit/prohibited-text.test.ts`

**Interfaces produced:**
- `PATTERNS` array grows by 9 entries — vision spec §7 prohibitions.

- [ ] **Step 1: Add failing test cases for each new pattern**

Read `tests/unit/prohibited-text.test.ts` first to match its existing pattern, then extend with a describe block:

```typescript
import { describe, it, expect } from 'vitest';
import { findViolations } from '../../scripts/check-prohibited-text.mjs';

describe('PATTERNS — Cycle 10 PRC vision spec §7 additions', () => {
  const table: Array<[string, string]> = [
    ['DESIRAE: Alphabetical Arrangement', 'DESIRAE:'],
    ['Desirae you will need the simple line drawing', 'Desirae you will need'],
    ['Writing a Play - check this doc info is included', 'check this doc info is included'],
    ['OTHERS? One Seed Child, OCEAN?', 'OTHERS?'],
    ['(image of water molecule)', '(image of water molecule)'],
    ['Developmental Theatre - Description (LOGO)', '(LOGO)'],
    ['Warmup : ICON', '(ICON) suffix'],
    ['Note: Published in September 2024 Newsletter', 'Note: Published in '],
    ['https://docs.google.com/document/d/abc/edit', 'raw docs.google.com URL'],
    ['https://drive.google.com/file/d/xyz/view', 'raw drive.google.com URL'],
  ];
  for (const [input, phraseFragment] of table) {
    it(`detects ${phraseFragment}`, () => {
      const hits = findViolations(input, 'fake.mdx');
      expect(hits.some((h) => h.phrase.toLowerCase().includes(phraseFragment.toLowerCase().replace(/[()]/g, '')))).toBe(true);
    });
  }
});
```

Note: the exact `phrase` string on each new PATTERN entry MUST make this assertion pass. Adjust the pattern's `phrase` field or the assertion accordingly.

- [ ] **Step 2: Run test — expect FAIL (patterns not added yet)**

```bash
pnpm test tests/unit/prohibited-text.test.ts
```

Expected: FAIL on every new case.

- [ ] **Step 3: Append the 9 patterns to `scripts/check-prohibited-text.mjs`**

Add before the closing `];` of the `PATTERNS` export:

```javascript
// PRC vision spec §7 — editorial working notes and asset markers that must not ship.
// See /Users/cnote/Downloads/dtfc-players-resource-center-vision-spec.md §7 for source.
{
  phrase: 'DESIRAE: prefix',
  regex: /\bDESIRAE:/g,
  reason: 'PRC §7: designer working-note prefix (strip during MDX migration)',
},
{
  phrase: 'Desirae you will need',
  regex: /Desirae you will need/gi,
  reason: 'PRC §7: designer asset-request working note',
},
{
  phrase: 'check this doc info is included',
  regex: /check this doc info is included/gi,
  reason: 'PRC §7: source-doc title audit note (from Writing a Play doc)',
},
{
  phrase: 'OTHERS?',
  regex: /\bOTHERS\?/g,
  reason: 'PRC §7: draft-list open question from Warmup source doc',
},
{
  phrase: '(image of water molecule)',
  regex: /\(image of water molecule\)/gi,
  reason: 'PRC §7: asset request marker from Cohesion source doc',
},
{
  phrase: '(LOGO) title suffix',
  regex: /\s+\(LOGO\)\b/g,
  reason: 'PRC §7: logo placement marker from Developmental Theatre doc',
},
{
  phrase: '(ICON) title suffix',
  regex: /\s+[:—-]?\s*\(ICON\)\s*$/gm,
  reason: 'PRC §7: (ICON) title suffix — belongs in icon registry, not visible titles',
},
{
  phrase: 'Note: Published in',
  regex: /Note: Published in /g,
  reason: 'PRC §7: provenance-in-body note (belongs in frontmatter, not page copy)',
},
{
  phrase: 'raw docs.google.com URL',
  regex: /https?:\/\/docs\.google\.com\/[a-z]+\/d\//gi,
  reason: 'PRC §7: raw docs.google.com URL (convert to internal route or hosted asset)',
},
{
  phrase: 'raw drive.google.com URL',
  regex: /https?:\/\/drive\.google\.com\//gi,
  reason: 'PRC §7: raw drive.google.com URL (convert to internal route or hosted asset)',
},
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pnpm test tests/unit/prohibited-text.test.ts
```

Expected: all new cases pass.

- [ ] **Step 5: Run guardrail against the whole tree**

```bash
pnpm check:prohibited
```

Expected: 0 violations. Any stripping misses from T7/T8/T9 surface here — go back and fix.

If a legitimate archival citation in Legacy essays trips the raw-google-URL pattern, add the offending file to a new allowlist branch (mirror `CURLY_APOSTROPHE_ALLOWLIST`) rather than weakening the pattern. Only do this with an explicit CLIENT REVIEW note in the client bundle.

- [ ] **Step 6: Commit**

```bash
git add scripts/check-prohibited-text.mjs tests/unit/prohibited-text.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-10): extend prohibited-text guardrail with PRC vision spec §7 patterns

Adds 9 new PATTERNS entries covering editorial working notes and asset
markers from the PRC source docs that must never ship: DESIRAE: prefix,
Desirae asset-request note, "check this doc info is included" title
audit, OTHERS? draft-list marker, "(image of water molecule)" asset
request, trailing (LOGO), trailing (ICON) title suffixes,
"Note: Published in" body drafting note, raw docs.google.com and
drive.google.com URLs.

Runs automatically in pnpm build. Unit test covers detection of each
pattern; grep against the whole tree passes clean.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Related-slug resolution test + `beyondSource` flag coverage

**Files:**
- Create: `tests/unit/concepts-related.test.ts`
- Modify: `tests/unit/concepts-flags.test.ts` (extend T1 test with full-collection assertions)

**Interfaces consumed:**
- `getCollection('concepts')` — Astro's content API. Existing tests use the Vitest shim `tests/unit/_astro-content.ts`; verify the shim exposes it before writing (Cycle 1 established the pattern).

- [ ] **Step 1: Write `tests/unit/concepts-related.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { getCollection } from './_astro-content';

describe('concepts collection — related slug resolution', () => {
  it('every related[] slug resolves to another concept entry', async () => {
    const entries = await getCollection('concepts');
    const validSlugs = new Set(entries.map((e) => e.data.slug));
    const problems: string[] = [];
    for (const e of entries) {
      for (const relSlug of e.data.related) {
        if (!validSlugs.has(relSlug)) {
          problems.push(`${e.data.slug} → related: '${relSlug}' (unknown)`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('has no self-references in related[]', async () => {
    const entries = await getCollection('concepts');
    for (const e of entries) {
      expect(e.data.related, `${e.data.slug} related`).not.toContain(e.data.slug);
    }
  });

  it('slug field matches file basename for every entry', async () => {
    const entries = await getCollection('concepts');
    for (const e of entries) {
      const basename = e.id.replace(/\.mdx?$/, '');
      expect(e.data.slug).toBe(basename);
    }
  });
});
```

- [ ] **Step 2: Extend `tests/unit/concepts-flags.test.ts` with collection-level assertions**

Append a new describe block:

```typescript
import { getCollection } from './_astro-content';

describe('concepts collection — Cycle 10 flag distribution', () => {
  it('exactly players and resilience carry beyondSource:true', async () => {
    const entries = await getCollection('concepts');
    const beyond = entries.filter((e) => e.data.beyondSource).map((e) => e.data.slug).sort();
    expect(beyond).toEqual(['players', 'resilience']);
  });

  it('facilitation is the only entry with draft:false', async () => {
    const entries = await getCollection('concepts');
    const notDraft = entries
      .filter((e) => e.data.draft === false)
      .map((e) => e.data.slug)
      .sort();
    // players + resilience are beyondSource — they preserve current draft state
    // (whatever Cycle 1 set). Real assertion: at MINIMUM facilitation is draft:false.
    expect(notDraft).toContain('facilitation');
  });

  it('icons entry is marked draft:true (internal draft awaiting client approval)', async () => {
    const entries = await getCollection('concepts');
    const icons = entries.find((e) => e.data.slug === 'icons');
    expect(icons?.data.draft).toBe(true);
  });

  it('aiAttribution:true on Repetition + Language: Oral Tradition', async () => {
    const entries = await getCollection('concepts');
    const flagged = entries
      .filter((e) => e.data.aiAttribution)
      .map((e) => e.data.slug)
      .sort();
    // If source doc audit reveals other entries with AI notes, extend this list.
    expect(flagged).toEqual(['language-oral-tradition', 'repetition']);
  });

  it('stage entry has credits + desiraeReplaceable:true', async () => {
    const entries = await getCollection('concepts');
    const stage = entries.find((e) => e.data.slug === 'stage');
    expect(stage?.data.credits).toMatch(/Jackie Pualani Johnson/);
    expect(stage?.data.desiraeReplaceable).toBe(true);
  });
});
```

- [ ] **Step 3: Run tests — expect PASS (contents from T7/T8/T9 satisfy these assertions)**

```bash
pnpm test tests/unit/concepts-related.test.ts tests/unit/concepts-flags.test.ts
```

Expected: all pass. If not, either an entry from T7/T8/T9 has drifted (fix the entry) or the AI-attribution assumption about Repetition/Language:Oral-Tradition is wrong (fix the assertion).

- [ ] **Step 4: Commit**

```bash
git add tests/unit/concepts-related.test.ts tests/unit/concepts-flags.test.ts
git commit -m "$(cat <<'EOF'
test(cycle-10): related-slug resolution + Cycle 10 flag distribution

Guards against typo'd related[] slugs (an entry referencing a missing
concept would silently render as a broken link before this test), self-
references, slug/basename drift, beyondSource distribution (players +
resilience only), draft distribution (facilitation is verbatim source),
aiAttribution distribution (Repetition + Language: Oral Tradition),
Stage credits + desiraeReplaceable invariant.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Smoke-test PRC extension + a11y checkpoints

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`

**Interfaces consumed:**
- Existing `runAxe(page, name)` helper in the same file.

- [ ] **Step 1: Extend the smoke test with PRC checkpoints**

Read `tests/e2e/smoke.spec.ts` first. In the existing test after the current "Navigate to PRC" block, extend as:

```typescript
// PRC landing — Cycle 10 letter rail + grouped cards
await page.goto('/resource-center/');
await expect(page.getByText('What are the ICONS')).toBeVisible();
// Letter rail is present as a nav
const letterRail = page.getByRole('navigation', { name: /Alphabetical index/i });
await expect(letterRail).toBeVisible();
// Clicking F jumps to the Facilitation section anchor
await letterRail.getByRole('link', { name: 'F' }).click();
await expect(page).toHaveURL(/#f$/);
// Filter narrows the visible cards
const filter = page.locator('[data-concept-filter]');
await filter.fill('cohes');
await expect(page.getByRole('link', { name: /Cohesion/ }).first()).toBeVisible();
await filter.fill('');
await runAxe(page, 'resource center landing');

// PRC entry detail — Casting (uses consolidation subsection + related block)
await page.goto('/resource-center/casting/');
await expect(page.getByRole('heading', { level: 1, name: 'Casting' })).toBeVisible();
await expect(page.getByRole('heading', { level: 2, name: 'For Educators' })).toBeVisible();
await expect(page.getByRole('region', { name: /Related resources/i })).toBeVisible();
await runAxe(page, 'resource center casting entry');

// Stage entry — all 6 SVG diagrams render
await page.goto('/resource-center/stage/');
const diagrams = page.locator('figure svg[role="img"]');
await expect(diagrams).toHaveCount(6);
await expect(page.getByText(/Jackie Pualani Johnson/)).toBeVisible();
```

- [ ] **Step 2: Run the smoke test**

```bash
pnpm test:e2e
```

Expected: passes (starts its own dev server via Playwright config).

If the "Cohesion" popover checkpoint further up the file no longer opens because the entry body changed in T7, fix the assertion text (e.g. change `/level of group bonding/` to whatever the new shortDefinition reads).

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "$(cat <<'EOF'
test(cycle-10): extend smoke test with PRC letter rail, Casting subsection, Stage 6-diagram checks + 2 new axe scans

- Assert LetterRail navigation renders and links jump to letter anchors
- Assert on-page filter narrows visible cards
- Assert Casting entry renders "For Educators" H2 subsection + RelatedResources block
- Assert Stage entry renders all 6 SVG diagrams + credits line
- axe-core scans on PRC landing + Casting entry (fail on critical/serious)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Client-review bundle + CLAUDE.md + memory updates

**Files:**
- Create: `docs/client-reviews/2026-08-12-cycle10-prc-review.md`
- Modify: `CLAUDE.md`
- Modify: `~/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md`
- Modify: `~/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_followups.md`

- [ ] **Step 1: Write `docs/client-reviews/2026-08-12-cycle10-prc-review.md`**

Structure the bundle for Lola / Laurie consumption (not code review — plain-language + short):

```markdown
# Cycle 10 — Players Resource Center: Client Review Bundle

**Date:** 2026-08-12
**Section:** Players Resource Center — `/resource-center/`

This document collects every Cycle 10 decision that requires client sign-off before launch. Each item includes the shipped behavior, the question, and where the code lives.

## 1. Science error — Cohesion water-molecule reference

The source doc "Cohesion in Groups: What Is It?" reads: *"cohesion of oxygen and nitrogen atoms"*. Water is hydrogen + oxygen.

**Shipped:** the erroneous phrase does not appear on the site. The entry renders a placeholder note where the water-molecule illustration will go.

**Ask:** confirm the corrected phrasing (proposed: *"cohesion of hydrogen and oxygen atoms in a water molecule"*).

**Where:** `src/content/concepts/cohesion.mdx`

## 2. Name spelling — Peterson vs. Petersen

Language: Oral Tradition source uses **Nils Peterson**. Legacy Founders data uses **Nils Petersen**.

**Shipped:** the PRC entry uses `Peterson` per the source doc.

**Ask:** confirm the canonical spelling to apply site-wide.

**Where:** `src/content/concepts/language-oral-tradition.mdx`, `src/data/founders.ts`

## 3. AI-attribution standardized line

Two source docs (Repetition, Language: Oral Tradition) disclose AI-assisted research; Repetition has a `2005` typo (obviously 2025).

**Shipped:** both entries render the standardized footer *"Editorial note: Research notes compiled with AI assistance, 2025."*

**Ask:** approve the standard line or edit it.

## 4. Short-definition approvals

Facilitation's short definition is verbatim from the source doc's `Short Definition:`. The other 17 entries carry short definitions drafted from each source's opening; every drafted entry renders a **Draft** chip beside its title.

**Ask:** review each drafted short definition; approve or edit. Chip removal is a one-line frontmatter flip per entry.

**Entries awaiting approval:** archetypes, casting, cohesion, competency, continuous-assessment, creativity, developmental-theatre, fearless-creativity, icons, language-oral-tradition, language-sparse-resonant, magic-toolbox, plot, repetition, stage, theatre-games, warmup.

## 5. Missing entries

The vision spec calls out three entries with no source doc:

- **Audience** — referenced from Warmup with `(ICON)` marker. Currently rendered as a `(pending)` chip that does not link. **Ask:** author a short entry (~1-2 paragraphs), or leave the pending chip until later?
- **Constraints** — one of Fearless Creativity's four key concepts. Currently, Fearless Creativity's Constraints link points to `/resource-center/plot/#constraints` (the section inside Plot). **Ask:** should this be extracted as its own standalone entry?
- **ICONs explainer** — an internal Cycle 1 draft exists at `/resource-center/icons/`. **Ask:** approve, edit, or replace with a client-authored version?

## 6. Casting consolidation

The two source docs (Casting: Choosing Players for Roles; Casting for Educators using DT:FC Methods) overlap ~60%. Cycle 10 merged them into a single entry with a `## For Educators` subsection.

**Ask:** confirm the merge is correct.

**Where:** `src/content/concepts/casting.mdx`

## 7. Plot ↔ Children's Theatre overlap audit

The Plot source doc's own title contained the audit note "check this doc info is included", flagging suspected overlap with Children's Theatre's "How to Create a DT:FC Children's Script".

**Analysis:** Plot is the PRC theory entry (myth-fidelity rules, elongation, four-sentence method, Constraints Shape Roles); the Children's Theatre how-to is procedural (step-by-step script authoring). Content is complementary, not duplicative. Both entries cross-link to each other.

**Ask:** confirm the split is correct.

## 8. `players` and `resilience` retention

Two existing PRC entries do not map to any source doc: `players` (DT:FC vocabulary) and `resilience` (one of the five competencies, mentioned inside Competency). Both retained with a `beyondSource:true` flag that renders a **Beyond source** chip.

**Ask:** keep both as-is, delete one/both, or fold into other entries (e.g. Resilience → Competency subsection)?

## 9. Asset requests

- **Wayfarer's Journey line drawing** — the Archetypes entry embeds the existing `WayfarersJourneyWheel` component from Children's Theatre. Confirm this shared usage is right; else Archetypes wants a different treatment.
- **Water-molecule diagram** — placeholder note in the Cohesion entry until the illustration lands.
- **Stage 6 diagrams** — 6 in-repo SVGs currently ship, matching the source deck's labeled-shape aesthetic. Component is `desiraeReplaceable: true` — swap the SVG source without editing the entry MDX.
- **Concept icons** — every entry uses the placeholder icon until Desirae's artwork lands. The registry at `src/data/icon-registry.ts` makes swaps a filename edit.

## 10. "How to Facilitate Warmup Games" page

The Warmup entry references this page. If it doesn't yet exist as a site route, the reference renders as `(pending)`. **Ask:** schedule the how-to page for a future cycle, or absorb the content into the Warmup entry?

## 11. Magic Toolbox source repair

The Magic Toolbox source doc contains a broken sentence: *"the space needs to be It's a space where…"*. Cycle 10 applied a minimal repair (best-guess reconstruction).

**Ask:** review and confirm the repair, or supply the intended phrasing.

**Where:** `src/content/concepts/magic-toolbox.mdx`
```

- [ ] **Step 2: Update `CLAUDE.md` with Cycle 10 conventions**

Add a new section (before "Deferred / TODO markers"):

```markdown
**PRC content model (Cycle 10).** `concepts` collection is the site-wide glossary; schema in `src/lib/content-schemas.ts` accepts optional `credits`, `provenance`, `assets`, `draft`, `beyondSource`, `desiraeReplaceable`, `aiAttribution`. Icon registry lives at `src/data/icon-registry.ts` — maps `id → {file, prcSlug, iconFlagged}`; `iconPath()` in `src/lib/icons.ts` consults it first. 20 entries total (18 in-spec + `icons` draft + `players`/`resilience` beyondSource). Every `<Concept id="…" />` popover reads its `shortDefinition` from the collection — no duplicated definitions.

**Adding a PRC entry.** Drop `src/content/concepts/<slug>.mdx` with the schema. Body H2s vary by source; call out TIPs via `<div class="callout-tip">`, "Why Do I Care?" via `<div class="callout-why">`, boxed teacher notes via `<div class="callout-box">`, Practical Suggestions via `<div class="callout-practical">`. Add related-resource slugs to frontmatter `related:`. If ICON-flagged, add `iconFlagged: true` to `src/data/icon-registry.ts` for its id. If the entry uses AI-assisted research disclosure, set `aiAttribution: true` — the EditorialNoteAI footer renders automatically. `shortDefinition` drafted from source? Set `draft: true`; source has an explicit "Short Definition:"? Use verbatim and leave `draft: false`.

**PRC landing** (`src/pages/resource-center/index.astro`) renders `<LetterRail />` (sticky A-Z jump nav) + letter-grouped `<EntryCard />` grids + on-page text filter. Entries carry `data-pagefind-filter="section:resource-center"` on the article root so the header search modal can chip-scope to PRC.

**Casting cross-list.** `src/pages/childrens-theatre/index.astro` has a sidebar callout to `/resource-center/casting/`; `src/pages/childrens-theatre/scripts/[slug].astro` injects an inline "See Casting →" link at the tail of every `childrens-plays` / `teaching-modules` render so future plays inherit.

**Prohibited-text guardrail — PRC vision spec §7.** Additional PATTERNS added in Cycle 10: `DESIRAE:` prefix, `Desirae you will need`, `check this doc info is included`, `OTHERS?`, `(image of water molecule)`, trailing `(LOGO)`, trailing `(ICON)` title suffix, `Note: Published in`, raw `docs.google.com` / `drive.google.com` URLs.
```

Also add to the "Deferred / TODO markers" section:

```markdown
- PRC ICONs explainer approval — `src/content/concepts/icons.mdx` is a Cycle 1 internal draft flagged `draft:true`; awaits client edit or replacement. Bundled with Cycle 10 client-review doc.
- PRC Audience entry — referenced from Warmup as `(pending)`; no source doc. Bundled with Cycle 10 client review.
- PRC Constraints extraction — Fearless Creativity's Constraints link currently lands on `/resource-center/plot/#constraints`. Client decision pending on standalone entry.
- PRC concept-icon artwork — all entries use placeholder icons; swap file-by-file under `public/icons/` when Desirae delivers.
- PRC Stage diagrams — 6 in-repo SVGs ship as `desiraeReplaceable:true`; swap `src/components/prc/StageDiagram.astro` variant bodies when Desirae refines.
- PRC water-molecule illustration — Cohesion entry renders a placeholder note; pending asset.
- PRC Peterson/Petersen spelling — client decision on canonical spelling; site-wide fix once resolved.
- PRC `players` / `resilience` beyondSource — client decision on keep/remove/fold.
```

- [ ] **Step 3: Update memory — `project_dtfc_cycles.md`**

Append (or update the "Cycles 2-6 pre-scoped" section) to record Cycle 10:

```markdown
- **Cycle 10 — Players Resource Center** (2026-08-12): shipped 18 source-faithful A-Z entries from the 19-doc Drive folder + rebuilt landing (letter rail + grouped cards) + rebuilt entry template (chips, callouts, RelatedResources, AI footer) + icon registry data file + 6 in-repo Stage SVG diagrams + Casting cross-list from Children's Theatre + 9 new prohibited-text patterns + client-review bundle at `docs/client-reviews/2026-08-12-cycle10-prc-review.md`. Design spec: `docs/superpowers/specs/2026-08-12-dtfc-cycle10-prc-design.md`. Plan: `docs/superpowers/plans/2026-08-12-dtfc-cycle10-prc.md`.
```

- [ ] **Step 4: Update memory — `project_dtfc_followups.md`**

Append to the follow-ups list:

```markdown
- PRC client-review bundle awaiting client action — 11 items in `docs/client-reviews/2026-08-12-cycle10-prc-review.md`: water-molecule error, Peterson/Petersen spelling, AI-attribution line, 17 short-definition approvals, Audience/Constraints/ICONs decisions, Casting consolidation sign-off, Plot overlap audit, players/resilience retention, asset requests (Wayfarer, water-molecule, Stage diagrams, concept icons), Warmup how-to page decision, Magic Toolbox repair.
```

- [ ] **Step 5: Verify everything one more time**

```bash
pnpm build && pnpm test && pnpm test:e2e
```

Expected: 0 build errors; full unit suite green; smoke passes.

- [ ] **Step 6: Commit**

```bash
git add docs/client-reviews/2026-08-12-cycle10-prc-review.md CLAUDE.md
git commit -m "$(cat <<'EOF'
docs(cycle-10): client-review bundle + CLAUDE.md PRC conventions

- docs/client-reviews/2026-08-12-cycle10-prc-review.md: 11 sign-off items for Lola/Laurie (water-molecule error, Peterson/Petersen spelling, AI-attribution line, 17 short definitions, missing entries, Casting consolidation, Plot overlap audit, beyondSource retention, asset requests, Warmup how-to, Magic Toolbox repair)
- CLAUDE.md: PRC content model, adding-a-PRC-entry recipe, landing conventions, Casting cross-list pattern, §7 guardrail additions, deferred markers

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 7: Merge to main**

```bash
git checkout main
git merge --no-ff cycle-10-players-resource-center -m "$(cat <<'EOF'
Merge branch 'cycle-10-players-resource-center'

Cycle 10 — Players Resource Center.

18 source-faithful A-Z entries backed by an icon registry, a rebuilt
letter-rail landing, a rebuilt entry template (chips, callouts,
RelatedResources, AI attribution footer), 6 in-repo Stage SVG diagrams,
cross-section wiring into Theatre Games/Legacy/Children's Theatre, 9 new
prohibited-text patterns, and a client-review bundle at
docs/client-reviews/2026-08-12-cycle10-prc-review.md.

Spec: docs/superpowers/specs/2026-08-12-dtfc-cycle10-prc-design.md
Plan: docs/superpowers/plans/2026-08-12-dtfc-cycle10-prc.md

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review Summary

**Spec coverage check:**
- §2 Track A (Schema, data model, registry) → T1, T2, T6.
- §2 Track B (Content entries) → T7, T8, T9.
- §2 Track C (Components, layout, landing) → T3, T4, T5, T9.
- §2 Track D (Cross-section wiring) → T10; T7 rewrites include the Fearless-Creativity → Legacy link and Warmup → Theseus cross-refs.
- §2 Track E (Guardrails, renames, cleanup) → T6, T11.
- §2 Track F (Testing) → T1, T2, T9, T12, T13.
- §2 Track G (Client review bundle) → T14.
- §8 acceptance criteria — every criterion maps to a task deliverable.

**Placeholder scan:** grep of the plan finds no `TBD`, `TODO`, or `implement later`. Content-authoring tasks (T7, T8, T9) do carry per-entry work that requires reading the Drive doc at execution time — this is expected (the plan cannot pre-draft 17 entries verbatim), and each entry has a concrete workflow with source doc IDs, structural expectations, and verification steps.

**Type consistency:**
- `ICON_REGISTRY` shape defined in T2 (`{file, prcSlug, iconFlagged}`) — matches every consumer (`EntryCard.astro` in T3, `iconPath()` refactor in T2).
- `<StageDiagram variant="…" />` variant list matches between T9 component and T9 test (`proscenium|arena|in-the-round|thrust|unusual|sightlines`).
- `EntryChips` accepts `entry: ConceptEntry`, reads `entry.data.draft` + `entry.data.beyondSource` — matches schema fields added in T1.
- `RelatedResources` accepts `related: string[]`, calls `getConcept(slug)` — matches existing `@/lib/concepts` interface.
- `EditorialNoteAI` takes no props — matches every consumer (only rendered by `ConceptLayout` when `entry.data.aiAttribution` is true).

Plan is internally consistent; ready for execution.
