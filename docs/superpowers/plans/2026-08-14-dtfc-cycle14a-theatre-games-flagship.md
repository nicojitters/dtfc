# DT:FC Cycle 14a — Theatre Games Flagship Buildout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the Cycle 1 skeleton at `/theatre-games` to the flagship shape the whole site was engineered for — restructure the IA with redirect stubs, ship the interactive Index UI (five-axis facet + structure filter, three-column default, URL-persistent, print-styled game detail), the CompetencyPage layout component with the 7-icon bar and always-on Continuous Assessment block, four root-competency pages fully loaded from real Drive-corpus content (Physical Expression + ENTRY, Vocal Expression 1, Risk Assessment and Management, Resilience), all six facilitation guides (Orientation with print-friendly infographic + wired video slot, How-to-Use-the-Index authored after the Index UI, Warmup with Cool-down surfaced, Rock Solid restructured as reusable structured blocks, plus Honoring Our Guides with intact Spolin attribution and Submit rendering the Web 2.0 template), the parse-extract pipeline (`scripts/extract-theatre-games.mjs`) with a validation report, three cross-section landing-question resolutions, a stripping-registry guardrail extension (10 new PATTERNS + a Silverstein advisory script), and a 14-item client-review bundle capturing every deferred client decision.

**Architecture:** New `TheatreGamesLayout.astro` sub-nav layout mirrors Cycle 12/13's `ShakespeareLayout` / `ChildrensLayout` pattern. Content restructures around `/theatre-games/games/*` (Index + detail), `/theatre-games/competencies/[competency]/[subset?]` (dynamic competency pages fed by a props-driven `CompetencyPage.astro` component), and `/theatre-games/facilitation/*` (six guides). Games remain in the existing `games` content collection with a lightly-extended `gameSchema` (Cycle 14 optionals for `sourceDoc`, `spolinPage`, `variations`, `draft`). The Index is SSR-first (row list emitted for Pagefind + no-JS) with a Preact `GameIndex.tsx` island that hydrates for filter interactivity — replaces the retiring `GameFinder.tsx`. Parse pipeline is a standalone script run manually against `.md` exports in `content-source/theatre-games/` (git-ignored); output writes to `.mdx.new` files beside existing entries (no clobber). PRC concept popovers back the 7-icon bar via a hard-coded `icon-bar-map.ts` — the icon-bar component never invents concept slugs. Two new draft:true concept stubs (Encompassing Diversity, Feedback: No Critique) land so all seven icons resolve. Redirect stubs (meta-refresh, Cycle 13 pattern) preserve inbound links to old URLs.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@theme` tokens), TypeScript strict, MDX content collections with Zod schemas, Preact (existing island for `GameFinder` → to be replaced with `GameIndex`), Vitest, Playwright, `@axe-core/playwright`, Pagefind, Google Drive MCP for content sourcing.

**Spec:** `/Users/cnote/projects/dtfc/docs/superpowers/specs/2026-08-14-dtfc-cycle14a-theatre-games-flagship-design.md`

## Global Constraints

- **Branch:** all work on `cycle-14a-theatre-games-flagship` off `main`. Merge to `main` at cycle end uses `git merge --no-ff` per the branching workflow.
- **Package manager:** `pnpm` only. Commands: `pnpm dev`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm check:prohibited`, `pnpm check:folger` (advisory, from Cycle 12), `pnpm extract:theatre-games` (new this cycle), `pnpm check:silverstein` (new advisory this cycle).
- **Node module type:** `"type": "module"` — ESM everywhere.
- **No hex codes in components** — colors come from tokens in `src/styles/tokens.css`. Cycle 14a introduces no new tokens; the 7-icon bar and CompetencyPage reuse existing `--color-tip-bg` / `--color-tip-border` / cohesion tone tokens. `ContinuousAssessmentBlock` uses `.callout-tip` base + an "assessment" chip label class (styled with existing tone tokens).
- **Vocabulary:** "Players" (never "actors"), "Facilitator" (never "leader"), "Players Resource Center" (full), "Children's Theatre" (curly apostrophe). Story-Making (never "Storytelling") ships as 14a default per spec §7.2 + review bundle item #2 — subset label in `COMPETENCY_SUBSETS`, corpus + subset routes, and all in-repo prose use "Story Making".
- **Curly apostrophes in all prose** — enforced by `scripts/check-prohibited-text.mjs` in `pnpm build`. Use `&rsquo;` or U+2019 (’). No exceptions apply to Theatre Games content (Shakespeare verse allowlist is unrelated).
- **Zod imports use `astro/zod`**, not bare `zod`.
- **Editorial stripping rules** (spec §7 registry — 10 new PATTERNS enforced by Task 21): the following MUST NOT appear in built output — `(Desirae: Your input next)`, `DESIRAE –` (en-dash + space; index-admin note prefix), `TEAM QUESTION`, `Tab 1`, `ANY OTHERS?`, `WEB 2.0?` (title prefix, note trailing `?`), `(Link to Folder)`, `***NOTE: THIS IS NOT APPROPRIATE`, `Building a Firm Foundation` (rejected Rock Solid alt name), plus regex `/^#\d+\s/` for line-anchored `"#N "` title prefixes.
- **Silverstein rule** — zero occurrences of `silverstein` (case-insensitive) in `dist/`. Every Silverstein reference in 14a-migrated content is replaced with a pointer to `/childrens-theatre/warm-up-poems/`. Advisory-only in 14a via `pnpm check:silverstein`; 14b promotes it to a `pnpm build` gate.
- **Source-faithfulness policies** (spec §1 conviction 7 + §5): the Spolin attribution list on Honoring ships verbatim with all 17 page numbers + 1963 copyright + ISBN; per-game source lines carry `source: 'Adapted from Viola Spolin, Improvisation for the Theater, p. N.'` in frontmatter for exactly the games in the Honoring table. Never invent Spolin page numbers.
- **7-icon bar rule** — every competency page + game detail page mounts `<IconBar />`. The 7 icons resolve to PRC concept slugs via `src/components/games/icon-bar-map.ts`. Never hardcode concept slugs directly in `IconBar.astro`.
- **Single-source rule** — the DT:FC-Theatre-Games definition text lives in `src/content/concepts/theatre-games.mdx` (PRC). Orientation and landing page reference it via `<Concept id="theatre-games" />` popovers + verbatim prose imports where the definition is quoted in body copy; DO NOT fork the definition. Competency-page definitions come from the corpus doc for that competency (per spec §5); PRC popovers only supply short-def to inline `<Concept id="…">` refs.
- **Route restructure — redirect stubs required** — old URLs `/theatre-games/finder/`, `/theatre-games/[slug]/`, `/theatre-games/how-to/rock-solid-recommendations/` MUST NOT 404. Each has a meta-refresh stub page (Cycle 13 pattern): `<meta http-equiv="refresh" content="0; url=<new>">` + `<link rel="canonical" href="<new>">` + `<meta name="robots" content="noindex">`. Smoke tests assert redirect behavior.
- **Parse pipeline discipline** — `pnpm extract:theatre-games` reads `content-source/theatre-games/*.md` (git-ignored working folder) and writes `src/content/games/<slug>.mdx.new` if the target exists (never clobbers unless `--force`). Validation report goes to `docs/build-reports/theatre-games-parse-<YYYY-MM-DD>.md`. Never wire the extractor into `pnpm build`.
- **Corpus MCP unavailability** — if Drive MCP returns 4xx on any Cycle-14a corpus doc during T3 fetch, the fallback is a manual Drive export by the human collaborator (Cycle 12 Colloquial-audio pattern). Do NOT hallucinate corpus text.
- **Draft-flag semantics** (Cycle 12 pattern, extended to games) — `gameSchema.draft === true` hides the entry from the Index in production builds; detail routes emit but client-side redirect to the Index when `import.meta.env.PROD && data.draft === true`. Dev + `?draft=1` bypass. No games ship with `draft: true` in 14a; the field is added for future use.
- **Commit granularity:** one commit per task deliverable. Content-batch tasks (T5 corpus MDXs, T10 subset placeholders) may commit per group when convenient. Commit messages authored `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` via HEREDOC. Never `--amend` or `--no-verify`.
- **`pnpm check` + `pnpm test` clean** — every commit maintains 0 errors / 0 warnings (existing hint from Cycle 12 test file is pre-existing and acceptable). Playwright smoke passes at every task boundary that touches routes.

---

## File Map

**Create:**
- `src/lib/theatre-games-nav.ts` — sub-nav array
- `src/layouts/TheatreGamesLayout.astro` — sub-nav layout wrapper
- `src/lib/game-href.ts` — canonical `/theatre-games/games/<slug>/` URL helper
- `src/components/games/IconBar.astro`
- `src/components/games/icon-bar-map.ts`
- `src/components/games/CompetencyPage.astro`
- `src/components/games/ContinuousAssessmentBlock.astro`
- `src/components/games/Epigraph.astro`
- `src/components/games/ReasonsResultsTable.astro`
- `src/components/games/FollowupsList.astro`
- `src/components/games/GameListForCompetency.astro`
- `src/components/games/GameRow.astro`
- `src/components/games/GameIndex.tsx` (Preact island — replaces `GameFinder.tsx`)
- `src/components/games/VideoSlot.astro`
- `src/data/rock-solid-recommendations.ts`
- `src/content/concepts/encompassing-diversity.mdx` (draft:true stub)
- `src/content/concepts/feedback-no-critique.mdx` (draft:true stub)
- `src/content/concepts/warmup.mdx` (draft:true stub, conditional — added only if missing at T2 verification)
- `src/pages/theatre-games/games/index.astro` (Index, SSR + hydrated island)
- `src/pages/theatre-games/games/[slug].astro` (game detail, moved from top-level `[slug].astro`)
- `src/pages/theatre-games/competencies/index.astro` (competencies landing)
- `src/pages/theatre-games/competencies/physical-expression/index.astro`
- `src/pages/theatre-games/competencies/physical-expression/movement.astro` (placeholder)
- `src/pages/theatre-games/competencies/physical-expression/mime.astro` (placeholder)
- `src/pages/theatre-games/competencies/physical-expression/rhythm.astro` (placeholder)
- `src/pages/theatre-games/competencies/vocal-expression/index.astro`
- `src/pages/theatre-games/competencies/vocal-expression/articulation.astro` (placeholder)
- `src/pages/theatre-games/competencies/vocal-expression/finding-a-voice.astro` (placeholder)
- `src/pages/theatre-games/competencies/vocal-expression/story-making.astro` (placeholder)
- `src/pages/theatre-games/competencies/context-awareness/index.astro` (placeholder)
- `src/pages/theatre-games/competencies/context-awareness/observation.astro` (placeholder)
- `src/pages/theatre-games/competencies/context-awareness/connection.astro` (placeholder)
- `src/pages/theatre-games/competencies/risk-assessment/index.astro`
- `src/pages/theatre-games/competencies/resilience/index.astro`
- `src/pages/theatre-games/facilitation/index.astro`
- `src/pages/theatre-games/facilitation/orientation.astro`
- `src/pages/theatre-games/facilitation/how-to-use-the-index.astro`
- `src/pages/theatre-games/facilitation/warmup.astro`
- `src/pages/theatre-games/facilitation/rock-solid.astro`
- `src/pages/theatre-games/honoring-our-guides.astro`
- `src/pages/theatre-games/submit.astro`
- 3 redirect stubs: `src/pages/theatre-games/finder.astro`, `[slug].astro` (kept as stub), `how-to/rock-solid-recommendations.astro` (kept as stub, then `how-to/` deleted after)
- New parsed-corpus game MDXs under `src/content/games/` — count TBD by T5's parse report; expected ~30–80 from 4 root-competency docs
- `scripts/extract-theatre-games.mjs` — parse-extract pipeline
- `scripts/check-silverstein.mjs` — advisory grep script
- `scripts/fetch-theatre-games-corpus.mjs` — Drive MCP fetch orchestrator (small helper; optional if manual export used)
- `content-source/.gitkeep` (dir exists; children ignored)
- `test-fixtures/theatre-games-parse-sample.md` — fixture for extractor unit test
- `docs/build-reports/theatre-games-parse-2026-08-14.md` — first-run validation report
- `docs/adding-a-theatre-game.md` — author README
- `docs/client-reviews/2026-08-14-cycle14a-theatre-games-review.md` — 14-item client bundle
- `tests/unit/extract-theatre-games.test.ts`
- `tests/unit/spolin-attribution.test.ts`
- `tests/unit/competency-subsets.test.ts`
- `tests/unit/theatre-games-concept-refs.test.ts`
- `tests/unit/theatre-games-nav.test.ts`
- `tests/unit/game-href.test.ts`
- `tests/unit/icon-bar-map.test.ts`
- `tests/unit/rock-solid-recommendations.test.ts`

**Modify:**
- `src/lib/content-schemas.ts` — extend `gameSchema` with `sourceDoc`, `spolinPage`, `variations`, `draft`
- `src/lib/types.ts` — correct `COMPETENCY_SUBSETS` for vocal-expression (Story Making) + context-awareness (Observation, Connection)
- `src/lib/games.ts` — `toGameLite` extended if new schema fields needed on the lite record; add optional `sourceDoc` passthrough for the parse-report cross-reference
- `src/lib/gameFilter.ts` — `GameLite` type additions to match
- `src/pages/theatre-games/index.astro` — landing refactor to verbatim doc content
- 10 existing seed game MDXs in `src/content/games/*.mdx` — normalize body H2s to `## Intent / ## Technique / ## Evaluation`
- `scripts/check-prohibited-text.mjs` — add 10 new PATTERNS
- `package.json` — add `extract:theatre-games`, `check:silverstein` scripts
- `.gitignore` — add `content-source/`
- `tests/e2e/smoke.spec.ts` — extend with ~10 new Theatre Games checkpoints + 3 axe scans
- `CLAUDE.md` — Cycle 14a conventions block

**Delete (via git):**
- `src/pages/theatre-games/how-to/` directory (after redirect stub emplaced then removed — see T13)
- `src/components/games/GameFinder.tsx` (after `GameIndex.tsx` passes smoke — T12 end)
- `src/components/games/HowToModal.astro` (after `how-to-use-the-index.astro` ships — T15 end)

**Auto-memory updates (end of cycle):** `project_dtfc_cycles.md`, `project_dtfc_followups.md`.

---

## Task 1: Branch + sub-nav + layout

**Files:**
- Create: `src/lib/theatre-games-nav.ts`
- Create: `src/layouts/TheatreGamesLayout.astro`
- Create: `tests/unit/theatre-games-nav.test.ts`

**Interfaces produced:**
- `THEATRE_GAMES_NAV: readonly { label: string; href: string }[]` — 6 items in spec §2 order.
- `TheatreGamesLayout` — accepts standard `SectionLayout` props (`title`, `section`, `eyebrow`, `description`, `ogImage?`, `canonical?`) and renders the sub-nav strip above the page slot.

**Interfaces consumed:** existing `SectionLayout.astro`, `SITE_CONFIG` from `@/lib/site-config`.

- [ ] **Step 1: Create the branch**

Run:
```bash
git checkout main
git pull --ff-only origin main
git checkout -b cycle-14a-theatre-games-flagship
```

Expected: on new branch.

- [ ] **Step 2: Write the failing test at `tests/unit/theatre-games-nav.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { THEATRE_GAMES_NAV } from '@/lib/theatre-games-nav';

describe('THEATRE_GAMES_NAV', () => {
  it('exports 6 items in spec §2 order', () => {
    const labels = THEATRE_GAMES_NAV.map((i) => i.label);
    expect(labels).toEqual([
      'Overview',
      'Index',
      'Competencies',
      'Facilitation',
      'Honoring Our Guides',
      'Submit',
    ]);
  });

  it('every href starts with /theatre-games/ and ends with /', () => {
    for (const item of THEATRE_GAMES_NAV) {
      expect(item.href).toMatch(/^\/theatre-games\//);
      expect(item.href.endsWith('/')).toBe(true);
    }
  });
});
```

Run: `pnpm test tests/unit/theatre-games-nav.test.ts` — expected FAIL (module missing).

- [ ] **Step 3: Create `src/lib/theatre-games-nav.ts`**

```ts
export interface TheatreGamesNavItem {
  label: string;
  href: string;
}

export const THEATRE_GAMES_NAV: readonly TheatreGamesNavItem[] = [
  { label: 'Overview', href: '/theatre-games/' },
  { label: 'Index', href: '/theatre-games/games/' },
  { label: 'Competencies', href: '/theatre-games/competencies/' },
  { label: 'Facilitation', href: '/theatre-games/facilitation/' },
  { label: 'Honoring Our Guides', href: '/theatre-games/honoring-our-guides/' },
  { label: 'Submit', href: '/theatre-games/submit/' },
] as const;
```

Run: `pnpm test tests/unit/theatre-games-nav.test.ts` — expected PASS.

- [ ] **Step 4: Create `src/layouts/TheatreGamesLayout.astro`**

Model on `src/layouts/ShakespeareLayout.astro` (peek at that file to match exact prop shape + sub-nav aria + active-page styling). Slot pattern:

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
import { THEATRE_GAMES_NAV } from '@/lib/theatre-games-nav';
import type { HTMLAttributes } from 'astro/types';

interface Props {
  title: string;
  eyebrow?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
}

const { title, eyebrow, description, ogImage, canonical } = Astro.props;
const currentPath = Astro.url.pathname;
---

<SectionLayout title={title} section="theatre-games" eyebrow={eyebrow} description={description} ogImage={ogImage} canonical={canonical}>
  <nav aria-label="Theatre Games sub-navigation" class="mb-8 border-b border-ivory-200 pb-2">
    <ul class="flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {THEATRE_GAMES_NAV.map((item) => {
        const isActive =
          item.href === '/theatre-games/'
            ? currentPath === '/theatre-games/' || currentPath === '/theatre-games'
            : currentPath.startsWith(item.href);
        return (
          <li>
            <a
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              class={`no-underline ${isActive ? 'text-clay-700 font-semibold' : 'text-ink-700 hover:text-clay-700'}`}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  </nav>
  <slot />
</SectionLayout>
```

- [ ] **Step 5: Verify + commit**

Run: `pnpm check && pnpm test tests/unit/theatre-games-nav.test.ts` — both PASS.

```bash
git add src/lib/theatre-games-nav.ts src/layouts/TheatreGamesLayout.astro tests/unit/theatre-games-nav.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-14a): sub-nav + TheatreGamesLayout (T1)

New THEATRE_GAMES_NAV array (6 items in spec §2 order) + layout
wrapper matching ShakespeareLayout / ChildrensLayout pattern.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Schema extensions + type corrections + concept stubs

**Files:**
- Modify: `src/lib/content-schemas.ts`
- Modify: `src/lib/types.ts`
- Modify: `src/lib/games.ts` (extend `toGameLite` if `sourceDoc` needed on lite record — verify usage)
- Modify: `src/lib/gameFilter.ts` (extend `GameLite` type)
- Create: `src/content/concepts/encompassing-diversity.mdx`
- Create: `src/content/concepts/feedback-no-critique.mdx`
- Conditional create: `src/content/concepts/warmup.mdx` (only if missing — check first)
- Create: `tests/unit/competency-subsets.test.ts`

**Interfaces produced:**
- `gameSchema` (extended, all new fields optional): `sourceDoc?: string`, `spolinPage?: number` (positive integer), `variations?: boolean` (default false), `draft?: boolean` (default false)
- `COMPETENCY_SUBSETS['vocal-expression']` = `['Expression', 'Articulation', 'Finding a Voice', 'Story Making']`
- `COMPETENCY_SUBSETS['context-awareness']` = `['Observation', 'Connection']`
- Three new concept slugs available for `<Concept id="…">` lookup.

**Interfaces consumed:** existing `COMPETENCIES`, `STRUCTURES`, `COHESIONS` enums in `src/lib/types.ts`.

- [ ] **Step 1: Verify current `warmup` concept status**

Run: `ls src/content/concepts/warmup.mdx 2>&1 | head -1`

- If file exists: skip warmup stub creation below (Step 5 becomes conditional-no-op).
- If missing: proceed with warmup stub in Step 5.

- [ ] **Step 2: Write the failing test at `tests/unit/competency-subsets.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { COMPETENCY_SUBSETS } from '@/lib/types';

describe('COMPETENCY_SUBSETS Cycle 14 corrections', () => {
  it('vocal-expression uses Story Making (not Storytelling)', () => {
    expect(COMPETENCY_SUBSETS['vocal-expression']).toEqual([
      'Expression',
      'Articulation',
      'Finding a Voice',
      'Story Making',
    ]);
  });

  it('context-awareness has Observation + Connection subsets', () => {
    expect(COMPETENCY_SUBSETS['context-awareness']).toEqual(['Observation', 'Connection']);
  });

  it('physical-expression subsets unchanged from Cycle 1', () => {
    expect(COMPETENCY_SUBSETS['physical-expression']).toEqual(['Entry', 'Movement', 'Mime', 'Rhythm']);
  });

  it('risk-assessment + resilience have no subsets', () => {
    expect(COMPETENCY_SUBSETS['risk-assessment']).toEqual([]);
    expect(COMPETENCY_SUBSETS.resilience).toEqual([]);
  });
});
```

Run: `pnpm test tests/unit/competency-subsets.test.ts` — expected FAIL (vocal-expression currently ends in 'Storytelling'; context-awareness currently empty).

- [ ] **Step 3: Edit `src/lib/types.ts`**

Change `COMPETENCY_SUBSETS`:
```ts
export const COMPETENCY_SUBSETS: Record<Competency, string[]> = {
  'physical-expression': ['Entry', 'Movement', 'Mime', 'Rhythm'],
  'vocal-expression': ['Expression', 'Articulation', 'Finding a Voice', 'Story Making'],
  'context-awareness': ['Observation', 'Connection'],
  'risk-assessment': [],
  resilience: [],
};
```

Run: `pnpm test tests/unit/competency-subsets.test.ts` — expected PASS.

- [ ] **Step 4: Extend `gameSchema` in `src/lib/content-schemas.ts`**

Locate the current `gameSchema` block; add the 4 optional fields:

```ts
export const gameSchema = z.object({
  name: z.string(),
  competency: z.enum(COMPETENCIES),
  subset: z.string().optional(),
  structure: z.enum(STRUCTURES),
  cohesion: z.enum(COHESIONS),
  intent: z.string(),
  source: z.string().optional(),
  sample: z.boolean().default(false),
  // Cycle 14 additions
  sourceDoc: z.string().optional(),
  spolinPage: z.number().int().positive().optional(),
  variations: z.boolean().default(false),
  draft: z.boolean().default(false),
});
```

Run: `pnpm check` — expected 0 errors.
Run: `pnpm test` — full suite passes (existing 10 game MDXs validate unchanged; new fields optional).

- [ ] **Step 5: Create concept stubs**

Create `src/content/concepts/encompassing-diversity.mdx`:

```mdx
---
name: 'Encompassing Diversity'
slug: 'encompassing-diversity'
shortDefinition: 'DT:FC adapts across ages (pre-K to senior citizens), abilities, and access modes. Players with impediments are in the rotation, not treated differently; blind Players are supported with sound and touch. Not adapting is not an option.'
icon: 'placeholder'
related: ['facilitation', 'cohesion', 'continuous-assessment']
draft: true
---

## Definition

DT:FC's inclusion is operational, not aspirational. Every game adapts across ages (pre-K to senior citizens), abilities, and access modes. Players with impediments are in the rotation, not treated differently, and are encouraged to be creative with any impediment. For blind Players, adapt with sound and touch. For remote or electronic settings, the same rules apply.

**This is a Cycle 14 draft.** Client review pending.

## Practice

- **Never adapt out** — reframe the game so the impediment is a resource, not an obstacle.
- **Praise is non-judgmental** — "There is no way to fail, so no yes/no or good/bad."
- **Facilitators don&rsquo;t give a pitch** — let the Players find their own reasons.
```

Create `src/content/concepts/feedback-no-critique.mdx`:

```mdx
---
name: 'Feedback: The Virtues of No Critique'
slug: 'feedback-no-critique'
shortDefinition: 'DT:FC feedback names what happened without judging it. There is no way to fail, so no yes/no or good/bad. Praise is adaptive; the facilitator doesn&rsquo;t pitch — the Players find their own reasons.'
icon: 'placeholder'
related: ['facilitation', 'continuous-assessment', 'encompassing-diversity']
draft: true
---

## Definition

Feedback in DT:FC is the practice of naming what happened without judging it. The evaluation questions on every game are designed to open a Player&rsquo;s attention, not to grade them. "There is no way to fail, so no yes/no or good/bad."

**This is a Cycle 14 draft.** Client review pending.

## Practice

- Ask what a Player noticed, not what they liked.
- Reflect back before interpreting.
- Adapt praise to the Player, not the ideal.
- Never pitch. Let the game teach.
```

Conditional (from Step 1) — if `warmup.mdx` missing, create:

```mdx
---
name: 'Warmup'
slug: 'warmup'
shortDefinition: 'The Facilitator&rsquo;s deliberate transition from individual preoccupations to a shared focus. Physical and psychological readiness before the real work begins.'
icon: 'placeholder'
related: ['facilitation', 'cohesion']
draft: true
---

## Definition

Warmup is the Facilitator&rsquo;s deliberate transition from individual preoccupations to a shared focus. Physical readiness (breath, body, voice) and psychological readiness (attention, willingness) both matter. The DT:FC Facilitator Guide to Warmup names the components.

**This is a Cycle 14 draft.** Client review pending; canonical text will migrate from the Warmup guide (see `/theatre-games/facilitation/warmup/`).
```

- [ ] **Step 6: Verify + commit**

Run:
- `pnpm check:concepts` — expected: all `<Concept>` refs still resolve.
- `pnpm test` — expected: full suite PASS.
- `pnpm check` — 0 errors.

```bash
git add src/lib/content-schemas.ts src/lib/types.ts \
        src/content/concepts/encompassing-diversity.mdx \
        src/content/concepts/feedback-no-critique.mdx \
        tests/unit/competency-subsets.test.ts
# Add warmup.mdx to the stage if created in Step 5:
git add src/content/concepts/warmup.mdx 2>/dev/null || true
git commit -m "$(cat <<'EOF'
feat(cycle-14a): extend gameSchema + correct COMPETENCY_SUBSETS + PRC stubs (T2)

- gameSchema: sourceDoc, spolinPage (int positive), variations (bool),
  draft (bool) — all optional; existing entries validate unchanged.
- COMPETENCY_SUBSETS: vocal-expression now ends in 'Story Making'
  (ticketed for client sign-off per bundle item #2); context-awareness
  now carries ['Observation', 'Connection'] per spec §7.3.
- 2 (or 3) new draft:true concept stubs so IconBar can resolve every
  icon: Encompassing Diversity, Feedback: The Virtues of No Critique,
  and Warmup (conditional on prior existence).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Fetch Cycle-14a corpus documents via Drive MCP

**Files:**
- Create: `content-source/theatre-games/physical-expression-entry.md`
- Create: `content-source/theatre-games/vocal-expression-1.md`
- Create: `content-source/theatre-games/risk-assessment.md`
- Create: `content-source/theatre-games/resilience.md`
- Create: `content-source/theatre-games/landing-verbatim.md`
- Create: `content-source/theatre-games/honoring-our-guides.md`
- Create: `content-source/theatre-games/warmup-guide.md`
- Create: `content-source/theatre-games/orientation.md`
- Create: `content-source/theatre-games/rock-solid.md`
- Create: `content-source/theatre-games/submit-template.md`
- Create: `content-source/theatre-games/README.md` — inventory + Drive file IDs
- Modify: `.gitignore` — add `content-source/` (except README.md and dotfiles)

**Interfaces produced:** `.md` exports of 10 Drive docs at `content-source/theatre-games/`, ready for T4 parser input and Tracks F–H content authoring.

**Interfaces consumed:** Drive MCP `mcp__claude_ai_Google_Drive__read_file_content` with file IDs captured in Task 3's README.

**Drive file IDs** (verified 2026-08-14 during Cycle 14a brainstorming):

| Filename target | Drive file ID | Source-title |
|---|---|---|
| `physical-expression-entry.md` | `1s3MnxwscbMYa5kB8YCKHxlNA9hMAw3CEzGar5gGZFzA` | Website TG  Competency Physical Expression + Theatre Games ENTRY |
| `vocal-expression-1.md` | `1-5301yPbR-YhTQ31zFFipXidwvQXXGuQB5H67XXVKaU` | Website TG #2 Vocal Expression 1 + Theatre Games |
| `risk-assessment.md` | `1IbhoYnKks9V_-iVU4oCyLaZnSFpN_NNXugyLLKyZ7WY` | Website TG #4 Risk Assessment and Management + Theatre Games |
| `resilience.md` | `1Ua3IKZq4pwsAIt0vQAdDOyhcOS3-_GgLqGl3Fdf_pFc` | Website TG #5 Resilience |
| `landing-verbatim.md` | `1ChnVc0CmxSCFGCAmh95q9H1pLAudTIRovlHdsCZ7dCI` | DT:FC THEATRE GAMES LANDING PAGE |
| `honoring-our-guides.md` | (search via T3 Step 2) | "Honoring Our Guides" in `6- Theatre Games` root |
| `warmup-guide.md` | (search via T3 Step 2) | "#5 Facilitator Guide to Warmup" in numbered subfolder |
| `orientation.md` | (search via T3 Step 2) | "#1 Orientation" in numbered subfolder |
| `rock-solid.md` | (search via T3 Step 2) | "#6 Rock Solid Recommendations" in numbered subfolder |
| `submit-template.md` | (search via T3 Step 2) | "Template for a Theatre Game" (docx) OR "WEB 2.0 Submission Template" |

- [ ] **Step 1: Update `.gitignore`**

Add lines:
```
# Cycle 14a — Drive corpus working folder (source exports; NOT canonical)
content-source/*
!content-source/**/README.md
!content-source/**/.gitkeep
```

- [ ] **Step 2: Search Drive for the six missing file IDs**

Use the MCP `mcp__claude_ai_Google_Drive__search_files` tool with these queries in sequence (record each returned file ID in the README below):

```
parentId = '1eHxzounMb7b-Q52W6P7yeAfxMHVwjO3y' and title contains 'Honoring'
parentId = '1eHxzounMb7b-Q52W6P7yeAfxMHVwjO3y' and title contains 'Content List'
```

Then locate the numbered-order subfolder (id captured from spec) and search:
```
parentId = '<numbered-order-folder-id>' and (title contains '#1' or title contains 'Orientation')
parentId = '<numbered-order-folder-id>' and (title contains '#3' or title contains 'How')
parentId = '<numbered-order-folder-id>' and (title contains '#5' or title contains 'Warmup' or title contains 'Warm-up')
parentId = '<numbered-order-folder-id>' and (title contains '#6' or title contains 'Rock Solid')
```

If any search returns 0 results, halt and ask the human collaborator for a manual export path.

- [ ] **Step 3: Fetch each document via `mcp__claude_ai_Google_Drive__read_file_content` and write to `content-source/theatre-games/<filename>.md`**

For each row in the table above, call:
```
mcp__claude_ai_Google_Drive__read_file_content(fileId=<id>)
```
Then Write the returned text (preserving structure) to the target `.md` path. Prepend a 3-line YAML block noting the source:

```markdown
---
source_drive_id: <id>
source_title: <title>
fetched: 2026-08-14
---

<body>
```

- [ ] **Step 4: Create `content-source/theatre-games/README.md`**

```markdown
# Theatre Games Corpus Working Folder

**Not canonical.** These `.md` files are Drive exports fetched during Cycle 14a.
Canonical content lives in `src/content/games/*.mdx` (parsed via
`pnpm extract:theatre-games`) and in the per-page `.astro` files under
`src/pages/theatre-games/`.

## Inventory

| File | Drive ID | Consumed by |
|---|---|---|
| physical-expression-entry.md | 1s3MnxwscbMYa5kB8YCKHxlNA9hMAw3CEzGar5gGZFzA | T5 parse; T9 competency page prose |
| vocal-expression-1.md | 1-5301yPbR-YhTQ31zFFipXidwvQXXGuQB5H67XXVKaU | T5 parse; T9 competency page prose |
| risk-assessment.md | 1IbhoYnKks9V_-iVU4oCyLaZnSFpN_NNXugyLLKyZ7WY | T5 parse; T9 competency page prose |
| resilience.md | 1Ua3IKZq4pwsAIt0vQAdDOyhcOS3-_GgLqGl3Fdf_pFc | T5 parse; T9 competency page prose |
| landing-verbatim.md | 1ChnVc0CmxSCFGCAmh95q9H1pLAudTIRovlHdsCZ7dCI | T11 landing refactor |
| honoring-our-guides.md | (fill during T3 Step 2) | T18 Honoring page |
| warmup-guide.md | (fill during T3 Step 2) | T16 Warmup guide |
| orientation.md | (fill during T3 Step 2) | T14 Orientation |
| rock-solid.md | (fill during T3 Step 2) | T17 Rock Solid |
| submit-template.md | (fill during T3 Step 2) | T19 Submit |

## Regeneration

If a Drive doc updates, re-run T3 Step 3 for that ID and re-run
`pnpm extract:theatre-games` for parser-consumed files.
```

- [ ] **Step 5: Verify + commit**

Run: `ls content-source/theatre-games/*.md | wc -l` — expected: `10`.
Run: `git status --short content-source/` — expected: only `README.md` untracked; other `.md` files gitignored.

```bash
git add .gitignore content-source/theatre-games/README.md
git commit -m "$(cat <<'EOF'
chore(cycle-14a): gitignore content-source/ + Drive fetch inventory (T3)

10 Drive-source .md exports staged in content-source/theatre-games/
(git-ignored) for consumption by parse extractor (T4-T5) and content
authoring tasks (T9, T11, T14, T16-T19). README.md documents source
IDs for regeneration.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Parse-extract pipeline + fixture test

**Files:**
- Create: `scripts/extract-theatre-games.mjs`
- Create: `test-fixtures/theatre-games-parse-sample.md`
- Create: `tests/unit/extract-theatre-games.test.ts`
- Modify: `package.json` — add `extract:theatre-games` script

**Interfaces produced:**
- `pnpm extract:theatre-games [--force] [--source <dir>] [--out <dir>] [--report <path>]` command.
- Programmatic export: `parseCorpusDoc(markdown: string, filename: string): { games: ParsedGame[]; warnings: ParseWarning[] }` where `ParsedGame = { slug, name, competency, subset?, structure, cohesion, intent, technique, evaluation, variations?, source?, spolinPage?, sourceDoc }`.

**Interfaces consumed:** Node `node:fs`, `node:path`, `node:process` only — no third-party deps.

- [ ] **Step 1: Add npm script**

Edit `package.json` scripts block:
```json
"extract:theatre-games": "node scripts/extract-theatre-games.mjs",
```

- [ ] **Step 2: Create fixture at `test-fixtures/theatre-games-parse-sample.md`**

```markdown
---
source_drive_id: fixture
source_title: Fixture — Physical Expression MOVEMENT
fetched: 2026-08-14
---

# Physical Expression - MOVEMENT

## Low Cohesion

### Walking Across Ice

**Structure:** Group
**Intent:** Loosen habitual gaits; wake the ankles and hips to intention.

**Technique:**

1. Players stand at one end of the room.
2. Facilitator narrates a walk across ice; Players cross without slipping.
3. Vary surface: mud, sand, gravel.

**Evaluation:**

- What did your body notice?
- Where did the weight go?

Adapted from Viola Spolin, Improvisation for the Theater, p. 132.

### Push Pull

**Structure:** Group
**Intent:** Discover shared weight; find the middle place between resisting and yielding.

**Technique:**

1. Pair off; palms together.
2. On breath, one pushes, one yields.
3. Trade.

**Evaluation:**

- When did you stop feeling the other Player?

## Medium Cohesion

### Wild Horse

**Structure:** Individual
**Intent:** Move at the edge of control.

**Technique:**

1. Move at a walking pace.
2. On signal, double the pace without losing form.
3. Repeat.

**Evaluation:**

- What broke first — form or breath?
```

- [ ] **Step 3: Write the failing test at `tests/unit/extract-theatre-games.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { parseCorpusDoc } from '../../scripts/extract-theatre-games.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE = readFileSync(
  resolve(__dirname, '../../test-fixtures/theatre-games-parse-sample.md'),
  'utf8',
);

describe('parseCorpusDoc', () => {
  const result = parseCorpusDoc(FIXTURE, 'physical-expression-movement.md');

  it('extracts 3 games from the fixture', () => {
    expect(result.games).toHaveLength(3);
  });

  it('normalizes slugs to kebab-case', () => {
    const slugs = result.games.map((g) => g.slug);
    expect(slugs).toContain('walking-across-ice');
    expect(slugs).toContain('push-pull');
    expect(slugs).toContain('wild-horse');
  });

  it('assigns competency + subset from doc title', () => {
    for (const g of result.games) {
      expect(g.competency).toBe('physical-expression');
      expect(g.subset).toBe('Movement');
    }
  });

  it('parses cohesion levels case-insensitively', () => {
    const byName = new Map(result.games.map((g) => [g.name, g]));
    expect(byName.get('Walking Across Ice')?.cohesion).toBe('low');
    expect(byName.get('Push Pull')?.cohesion).toBe('low');
    expect(byName.get('Wild Horse')?.cohesion).toBe('medium');
  });

  it('parses structure Group/Individual → lowercase', () => {
    const byName = new Map(result.games.map((g) => [g.name, g]));
    expect(byName.get('Walking Across Ice')?.structure).toBe('group');
    expect(byName.get('Wild Horse')?.structure).toBe('individual');
  });

  it('extracts intent as single-line string', () => {
    const g = result.games.find((g) => g.slug === 'walking-across-ice');
    expect(g?.intent).toBe('Loosen habitual gaits; wake the ankles and hips to intention.');
  });

  it('detects Spolin attribution + extracts page number', () => {
    const g = result.games.find((g) => g.slug === 'walking-across-ice');
    expect(g?.source).toMatch(/^Adapted from Viola Spolin/);
    expect(g?.spolinPage).toBe(132);
  });

  it('captures sourceDoc for traceability', () => {
    for (const g of result.games) {
      expect(g.sourceDoc).toBe('physical-expression-movement.md');
    }
  });

  it('preserves technique + evaluation as markdown blocks', () => {
    const g = result.games.find((g) => g.slug === 'walking-across-ice');
    expect(g?.technique).toContain('Players stand at one end of the room.');
    expect(g?.evaluation).toContain('What did your body notice?');
  });

  it('warns on missing required fields', () => {
    const bad = `# Physical - Movement\n\n## Low Cohesion\n\n### Bare Game\n\n(no fields)\n`;
    const r = parseCorpusDoc(bad, 'bad.md');
    expect(r.warnings.some((w) => w.slug === 'bare-game' && w.field === 'intent')).toBe(true);
  });
});
```

Run: `pnpm test tests/unit/extract-theatre-games.test.ts` — expected FAIL (module missing).

- [ ] **Step 4: Implement `scripts/extract-theatre-games.mjs`**

```js
#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { resolve, basename, join } from 'node:path';
import process from 'node:process';

const COMPETENCY_MAP = {
  // filename-substring → competency slug + subset label (subset undefined for root docs)
  'physical-expression-entry': { competency: 'physical-expression', subset: 'Entry' },
  'physical-expression-movement': { competency: 'physical-expression', subset: 'Movement' },
  'physical-expression-mime': { competency: 'physical-expression', subset: 'Mime' },
  'physical-expression-rhythm': { competency: 'physical-expression', subset: 'Rhythm' },
  'vocal-expression-1': { competency: 'vocal-expression', subset: undefined },
  'vocal-expression-2': { competency: 'vocal-expression', subset: 'Articulation' },
  'vocal-expression-3': { competency: 'vocal-expression', subset: 'Finding a Voice' },
  'vocal-expression-4': { competency: 'vocal-expression', subset: 'Story Making' },
  'context-awareness-observation': { competency: 'context-awareness', subset: 'Observation' },
  'context-awareness-connection': { competency: 'context-awareness', subset: 'Connection' },
  'risk-assessment': { competency: 'risk-assessment', subset: undefined },
  'resilience': { competency: 'resilience', subset: undefined },
};

function detectCompetency(filename) {
  const base = basename(filename, '.md');
  for (const [key, val] of Object.entries(COMPETENCY_MAP)) {
    if (base.startsWith(key)) return val;
  }
  return { competency: null, subset: undefined };
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&rsquo;/g, '')
    .replace(/[’'"()!?.,]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function stripFrontmatter(text) {
  if (!text.startsWith('---')) return text;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return text;
  return text.slice(end + 4).replace(/^\n+/, '');
}

const COHESION_RE = /^##\s+(low|medium|high)\s*cohesion\b/i;
const GAME_RE = /^###\s+(.+?)\s*$/;
const FIELD_RE = /^\*\*(Structure|Intent|Technique|Evaluation|Variations|Adaptations|Source|Notes):\*\*\s*(.*)$/i;
const SPOLIN_RE = /Adapted\s+from\s+Viola\s+Spolin.*?p\.?\s*(\d+)/i;

export function parseCorpusDoc(markdown, filename) {
  const body = stripFrontmatter(markdown);
  const lines = body.split('\n');
  const { competency, subset } = detectCompetency(filename);

  const games = [];
  const warnings = [];
  let currentCohesion = null;
  let currentGame = null;
  let currentField = null;
  let buffer = [];

  const flushField = () => {
    if (currentGame && currentField) {
      const text = buffer.join('\n').trim();
      currentGame[currentField.toLowerCase()] = text;
      buffer = [];
    }
  };

  const flushGame = () => {
    if (!currentGame) return;
    flushField();
    const g = currentGame;
    // Trailing Spolin line inside technique/evaluation → hoist to source
    const bodyText = [g.technique, g.evaluation, g.notes].filter(Boolean).join('\n');
    const spolinMatch = bodyText.match(SPOLIN_RE);
    if (spolinMatch && !g.source) {
      g.source = spolinMatch[0].trim().replace(/\s+/g, ' ');
      g.spolinPage = Number(spolinMatch[1]);
    } else if (g.source) {
      const m = g.source.match(SPOLIN_RE);
      if (m) g.spolinPage = Number(m[1]);
    }
    // Required-field validation
    for (const req of ['intent', 'structure', 'cohesion']) {
      if (!g[req]) warnings.push({ slug: g.slug, field: req, doc: filename });
    }
    // Structure normalization
    if (g.structure) g.structure = g.structure.toLowerCase().includes('individual') ? 'individual' : 'group';
    // Variations presence flag
    if (g.variations || g.adaptations) g.hasVariations = true;
    games.push(g);
    currentGame = null;
  };

  for (const line of lines) {
    const cohesionMatch = line.match(COHESION_RE);
    if (cohesionMatch) {
      flushGame();
      currentCohesion = cohesionMatch[1].toLowerCase();
      continue;
    }
    const gameMatch = line.match(GAME_RE);
    if (gameMatch) {
      flushGame();
      const name = gameMatch[1].trim();
      currentGame = {
        slug: slugify(name),
        name,
        competency,
        subset,
        cohesion: currentCohesion ?? 'low',
        sourceDoc: basename(filename),
      };
      currentField = null;
      continue;
    }
    const fieldMatch = line.match(FIELD_RE);
    if (fieldMatch && currentGame) {
      flushField();
      currentField = fieldMatch[1];
      buffer = fieldMatch[2] ? [fieldMatch[2]] : [];
      continue;
    }
    if (currentGame && currentField) {
      buffer.push(line);
    }
  }
  flushGame();

  return { games, warnings };
}

function toMdx(g) {
  const fm = [
    '---',
    `name: '${g.name.replace(/'/g, "\\'")}'`,
    `competency: '${g.competency}'`,
    g.subset ? `subset: '${g.subset}'` : null,
    `structure: '${g.structure ?? 'group'}'`,
    `cohesion: '${g.cohesion}'`,
    `intent: '${(g.intent ?? '').replace(/'/g, "\\'")}'`,
    g.source ? `source: '${g.source.replace(/'/g, "\\'")}'` : null,
    g.spolinPage ? `spolinPage: ${g.spolinPage}` : null,
    `sourceDoc: '${g.sourceDoc}'`,
    g.hasVariations ? `variations: true` : null,
    `sample: false`,
    '---',
    '',
    '## Intent',
    '',
    g.intent ?? '_Intent pending — see parse report._',
    '',
    '## Technique',
    '',
    g.technique ?? '_Technique pending — see parse report._',
    '',
    '## Evaluation',
    '',
    g.evaluation ?? '_Evaluation pending — see parse report._',
    '',
  ];
  if (g.hasVariations && (g.variations || g.adaptations)) {
    fm.push('## Variations', '', g.variations ?? g.adaptations, '');
  }
  return fm.filter((l) => l !== null).join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const sourceDir =
    args.includes('--source') ? args[args.indexOf('--source') + 1] : 'content-source/theatre-games';
  const outDir =
    args.includes('--out') ? args[args.indexOf('--out') + 1] : 'src/content/games';
  const reportPath =
    args.includes('--report')
      ? args[args.indexOf('--report') + 1]
      : `docs/build-reports/theatre-games-parse-${new Date().toISOString().slice(0, 10)}.md`;

  if (!existsSync(sourceDir)) {
    console.error(`✗ Source dir missing: ${sourceDir}`);
    process.exit(1);
  }
  mkdirSync('docs/build-reports', { recursive: true });

  const files = readdirSync(sourceDir).filter((f) => f.endsWith('.md') && f !== 'README.md');
  const report = [`# Theatre Games Parse Report`, `**Run:** ${new Date().toISOString()}`, ''];
  const allGames = [];
  const allWarnings = [];

  for (const file of files) {
    const path = join(sourceDir, file);
    const md = readFileSync(path, 'utf8');
    const { games, warnings } = parseCorpusDoc(md, file);
    if (!games.length && !warnings.length) continue; // skip non-corpus docs
    report.push(`## ${file}`, `- Games parsed: ${games.length}`, `- Warnings: ${warnings.length}`, '');
    for (const g of games) {
      allGames.push(g);
      const target = join(outDir, `${g.slug}.mdx`);
      const write = existsSync(target) && !force ? `${target}.new` : target;
      writeFileSync(write, toMdx(g));
      report.push(`  - \`${g.slug}\` → \`${write}\``);
    }
    for (const w of warnings) {
      allWarnings.push(w);
      report.push(`  - ⚠ \`${w.slug}\` missing \`${w.field}\``);
    }
    report.push('');
  }

  const dupes = new Map();
  for (const g of allGames) dupes.set(g.slug, (dupes.get(g.slug) ?? 0) + 1);
  const dupeSlugs = [...dupes.entries()].filter(([, n]) => n > 1);
  if (dupeSlugs.length) {
    report.push('## Duplicate slugs', '');
    for (const [s, n] of dupeSlugs) report.push(`- \`${s}\` × ${n}`);
  }

  report.push('', '## Summary', `- Total games: ${allGames.length}`, `- Total warnings: ${allWarnings.length}`, `- Duplicate slugs: ${dupeSlugs.length}`);
  writeFileSync(reportPath, report.join('\n') + '\n');
  console.log(`✓ Wrote ${allGames.length} games; report at ${reportPath}`);
  if (allWarnings.length) console.log(`⚠ ${allWarnings.length} field-missing warnings — see report`);
  if (dupeSlugs.length) console.log(`⚠ ${dupeSlugs.length} duplicate slugs — see report`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
```

Run: `pnpm test tests/unit/extract-theatre-games.test.ts` — expected PASS (all 10 assertions).

- [ ] **Step 5: Verify + commit**

Run: `pnpm check` — 0 errors.
Run: `pnpm test` — full suite PASS.

```bash
git add scripts/extract-theatre-games.mjs \
        test-fixtures/theatre-games-parse-sample.md \
        tests/unit/extract-theatre-games.test.ts \
        package.json
git commit -m "$(cat <<'EOF'
feat(cycle-14a): parse-extract pipeline for Drive corpus → MDX (T4)

Exports parseCorpusDoc(markdown, filename) → { games, warnings }.
CLI: pnpm extract:theatre-games [--force] [--source] [--out] [--report].
No-clobber default (writes .mdx.new beside existing files); validation
report to docs/build-reports/theatre-games-parse-<date>.md with
per-doc counts, missing-field warnings, and duplicate-slug flags.
Fixture at test-fixtures/theatre-games-parse-sample.md exercises the
10 core parser paths.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Run extractor on 4 corpus docs + hand-clean + commit MDXs

**Files:**
- Create: `src/content/games/*.mdx` — one per parsed game (count from parse report)
- Create: `docs/build-reports/theatre-games-parse-2026-08-14.md`

**Interfaces produced:** parsed-game MDXs available in `getCollection('games')` for T9 (competency GameListForCompetency), T12 (Index), and T18 (Honoring Spolin cross-check).

**Interfaces consumed:** T4's `pnpm extract:theatre-games` command; T3's 4 corpus `.md` exports.

- [ ] **Step 1: Run the parse pipeline**

Run: `pnpm extract:theatre-games`

Expected: `✓ Wrote N games; report at docs/build-reports/theatre-games-parse-2026-08-14.md`.

- [ ] **Step 2: Read the parse report end-to-end**

Run: `cat docs/build-reports/theatre-games-parse-2026-08-14.md`.

For each `⚠` warning: open the source `.mdx` in `src/content/games/` (or `.mdx.new`), locate the missing field, hand-fill from `content-source/theatre-games/<sourceDoc>` at the corresponding heading.

For each duplicate slug: rename one of the conflicting MDX filenames (e.g. add `-vocal` or `-physical` suffix) + update `name` frontmatter if needed. Re-run to confirm no new duplicates.

- [ ] **Step 3: Reconcile `.mdx.new` collisions**

If existing Cycle 1 seed games (10 files) collide with parsed slugs (likely candidates: `walking-across-the-ice`, `jabberwocky`, `puppets-marionettes`, `mirrors`, `outrageous-roll-call`, etc.), for each `<slug>.mdx.new`:
- Open both files side by side.
- If parsed body is richer: keep parsed, delete `.mdx.new` suffix (mv `.new` → replace original).
- If seed body is richer: delete the `.new` file, keep the seed. Ensure frontmatter carries `sourceDoc` for parse-report traceability (hand-add if missing).

Run: `ls src/content/games/*.mdx.new 2>/dev/null` — expected: empty (all reconciled).

- [ ] **Step 4: Hand-verify a Spolin-attributed game**

Pick any game whose parsed `source:` starts with "Adapted from Viola Spolin". Open the source `.md` in `content-source/theatre-games/`, locate the exact Spolin line, and confirm the page number in the MDX frontmatter matches.

- [ ] **Step 5: Verify + commit**

Run: `pnpm check` — 0 errors (all new MDXs validate against gameSchema).
Run: `pnpm test` — full suite PASS (Spolin attribution test from T22 not yet written; scripts-schema tests pass).
Run: `pnpm build` — succeeds; note the new game count.

```bash
git add src/content/games/*.mdx docs/build-reports/theatre-games-parse-2026-08-14.md
git commit -m "$(cat <<'EOF'
feat(cycle-14a): parsed game MDXs from 4 root corpus docs (T5)

pnpm extract:theatre-games run against 4 Drive corpus docs:
Physical Expression + ENTRY, Vocal Expression 1, Risk Assessment
and Management, Resilience. N games written to src/content/games/.
Warnings + duplicate-slug reconciliations documented in the parse
report. Hand-cleaning applied per report before commit.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Normalize the 10 Cycle-1 seed game body H2s

**Files:**
- Modify: 10 existing MDXs under `src/content/games/` — body H2 normalization to `## Intent / ## Technique / ## Evaluation`

**Interfaces produced:** consistent body-H2 pattern across all games (parsed + seed) for T12 game detail render.

**Interfaces consumed:** none.

- [ ] **Step 1: List seed games not touched by T5**

Run: `git diff --name-only HEAD~2..HEAD -- src/content/games/ | sort -u` — records which games T5 wrote or reconciled.

Cross-reference with `ls src/content/games/*.mdx | sort` to find the seed games untouched by T5. These are the T6 targets.

- [ ] **Step 2: For each seed MDX, normalize body H2s**

Open each file. Body sections should be:
- `## Intent` — a paragraph expanding on the frontmatter `intent` field (if present; else just leave one paragraph).
- `## Technique` — replaces the current `## Preparation` + `## Facilitation` content (merge them under Technique with two sub-paragraphs OR use `**Preparation:**` + `**Facilitation:**` inline markers).
- `## Evaluation` — keep as-is if already `## Evaluation`.

Do NOT rewrite the prose. This is a header-rename pass.

- [ ] **Step 3: Verify + commit**

Run: `pnpm check && pnpm test && pnpm build 2>&1 | tail -3` — clean.

```bash
git add src/content/games/
git commit -m "$(cat <<'EOF'
refactor(cycle-14a): normalize seed game body H2s to Intent/Technique/Evaluation (T6)

Cycle 1 seeds used ## Preparation / ## Facilitation / ## Evaluation.
Cycle 14 game detail template expects ## Intent / ## Technique /
## Evaluation for consistency with parsed corpus content. Header
rename only — no prose rewrites.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: `IconBar.astro` + icon-bar-map

**Files:**
- Create: `src/components/games/IconBar.astro`
- Create: `src/components/games/icon-bar-map.ts`
- Create: `tests/unit/icon-bar-map.test.ts`

**Interfaces produced:**
- `ICON_BAR: readonly IconBarEntry[]` — 7 entries in spec §1.5 order.
- `IconBarEntry = { id: string; iconSlug: string; conceptSlug: string; label: string }`.
- `<IconBar />` component — renders 7 clickable buttons, each triggering the `<Concept>` popover pattern via the entry's `conceptSlug`.

**Interfaces consumed:** existing `<Concept />` popover component (`src/components/concept/Concept.astro`), concept collection.

- [ ] **Step 1: Write the failing test at `tests/unit/icon-bar-map.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import { ICON_BAR } from '@/components/games/icon-bar-map';

describe('ICON_BAR', () => {
  it('has 7 entries in spec §1.5 order', () => {
    expect(ICON_BAR.map((e) => e.id)).toEqual([
      'competency',
      'cohesion',
      'continuous-assessment',
      'facilitator-guide',
      'magic-tool-box',
      'warmup',
      'feedback',
    ]);
  });

  it('every conceptSlug resolves to an entry in the concepts collection', async () => {
    const concepts = await getCollection('concepts');
    const slugs = new Set(concepts.map((c) => c.data.slug));
    for (const entry of ICON_BAR) {
      expect(slugs.has(entry.conceptSlug)).toBe(true);
    }
  });
});
```

Run: `pnpm test tests/unit/icon-bar-map.test.ts` — expected FAIL.

- [ ] **Step 2: Create `src/components/games/icon-bar-map.ts`**

```ts
export interface IconBarEntry {
  id: string;
  iconSlug: string;
  conceptSlug: string;
  label: string;
}

export const ICON_BAR: readonly IconBarEntry[] = [
  { id: 'competency',            iconSlug: 'competency',            conceptSlug: 'competency',             label: 'Competency' },
  { id: 'cohesion',              iconSlug: 'cohesion',              conceptSlug: 'cohesion',               label: 'Cohesion' },
  { id: 'continuous-assessment', iconSlug: 'continuous-assessment', conceptSlug: 'continuous-assessment',  label: 'Continuous Assessment' },
  { id: 'facilitator-guide',     iconSlug: 'facilitation',          conceptSlug: 'facilitation',           label: 'Facilitator Guide' },
  { id: 'magic-tool-box',        iconSlug: 'magic-toolbox',         conceptSlug: 'magic-toolbox',          label: 'Magic Tool Box' },
  { id: 'warmup',                iconSlug: 'warmup',                conceptSlug: 'warmup',                 label: 'Warmup' },
  { id: 'feedback',              iconSlug: 'feedback',              conceptSlug: 'feedback-no-critique',   label: 'Feedback / Evaluation' },
] as const;
```

Run: `pnpm test tests/unit/icon-bar-map.test.ts` — expected PASS (all 7 concepts exist after T2).

- [ ] **Step 3: Create `src/components/games/IconBar.astro`**

```astro
---
import Concept from '@/components/concept/Concept.astro';
import { ICON_BAR } from './icon-bar-map';
---

<div class="theatre-games-icon-bar mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Theatre Games facilitation icons">
  {ICON_BAR.map((entry) => (
    <span class="inline-flex items-center gap-1.5 rounded border border-ivory-200 bg-ivory-50 px-2 py-1 text-xs">
      <img
        src={`/icons/${entry.iconSlug}.svg`}
        alt=""
        width="16"
        height="16"
        loading="lazy"
        aria-hidden="true"
      />
      <Concept id={entry.conceptSlug}>{entry.label}</Concept>
    </span>
  ))}
</div>
```

Note: assumes `<Concept id="…">Label</Concept>` accepts a child label as the trigger text; if the existing `<Concept>` API differs, adapt to its actual signature (peek at `src/components/concept/Concept.astro`).

- [ ] **Step 4: Verify + commit**

Run: `pnpm check && pnpm test && pnpm check:concepts && pnpm build 2>&1 | tail -3` — clean.

```bash
git add src/components/games/IconBar.astro \
        src/components/games/icon-bar-map.ts \
        tests/unit/icon-bar-map.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-14a): IconBar + icon-bar-map (T7)

7-icon bar (Competency, Cohesion, Continuous Assessment, Facilitator
Guide, Magic Tool Box, Warmup, Feedback / Evaluation) with PRC
concept-slug resolution centralized in icon-bar-map.ts. Test asserts
all 7 concepts exist in the concepts collection.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: CompetencyPage + sub-parts

**Files:**
- Create: `src/components/games/CompetencyPage.astro`
- Create: `src/components/games/ContinuousAssessmentBlock.astro`
- Create: `src/components/games/Epigraph.astro`
- Create: `src/components/games/ReasonsResultsTable.astro`
- Create: `src/components/games/FollowupsList.astro`
- Create: `src/components/games/GameListForCompetency.astro`
- Create: `src/components/games/GameRow.astro`

**Interfaces produced:**
- `<CompetencyPage {competency, subset?, definition, intent, reasonsResults, who, preparation, followups, epigraph?} />` — full front-matter renderer.
- `<ContinuousAssessmentBlock />` — always-on wellbeing-check block; no props.
- `<Epigraph attribution body />` — styled blockquote.
- `<ReasonsResultsTable rows={{reason, result}[]} />` — responsive 2-column.
- `<FollowupsList items={string[]} />` — bulleted list.
- `<GameListForCompetency competency={Competency} subset?={string} />` — SSR filtered game list.
- `<GameRow game={GameLite} />` — presentational row used by SSR list + Index SSR view.

**Interfaces consumed:** T7's `<IconBar />`, existing `loadGamesLite()` from `@/lib/games`.

- [ ] **Step 1: Create `src/components/games/ContinuousAssessmentBlock.astro`**

```astro
<aside class="callout-tip mt-8" aria-label="Continuous Assessment">
  <p class="callout-eyebrow text-xs uppercase tracking-widest text-clay-700">Continuous Assessment</p>
  <p class="mt-2 text-sm">
    Every session, the Facilitator watches for wellbeing signals: <strong>sleep</strong>,
    <strong>food</strong>, <strong>dehydration</strong>, <strong>exhaustion</strong>,
    <strong>shyness</strong> vs. <strong>attention-seeking</strong>. Adapt the game to
    the human in front of you, not the human in the plan.
  </p>
</aside>
```

- [ ] **Step 2: Create `src/components/games/Epigraph.astro`**

```astro
---
interface Props {
  attribution: string;
  body: string;
}
const { attribution, body } = Astro.props;
---

<figure class="my-6 border-l-4 border-clay-500/60 pl-4">
  <blockquote class="font-serif text-lg italic">{body}</blockquote>
  <figcaption class="mt-2 text-sm text-ink-700">&mdash; {attribution}</figcaption>
</figure>
```

- [ ] **Step 3: Create `src/components/games/ReasonsResultsTable.astro`**

```astro
---
interface Props {
  rows: Array<{ reason: string; result: string }>;
}
const { rows } = Astro.props;
---

<div class="my-6 overflow-x-auto">
  <table class="w-full border-collapse text-sm">
    <thead>
      <tr class="border-b border-ivory-200">
        <th scope="col" class="pb-2 text-left font-display text-base">Reasons</th>
        <th scope="col" class="pb-2 text-left font-display text-base">Results</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr class="border-b border-ivory-200/60 last:border-b-0">
          <td class="py-2 pr-4 align-top">{row.reason}</td>
          <td class="py-2 align-top">{row.result}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

- [ ] **Step 4: Create `src/components/games/FollowupsList.astro`**

```astro
---
interface Props {
  items: string[];
}
const { items } = Astro.props;
---

<ul class="my-4 list-disc space-y-1 pl-6 text-sm">
  {items.map((item) => <li>{item}</li>)}
</ul>
```

- [ ] **Step 5: Create `src/components/games/GameRow.astro`**

```astro
---
import type { GameLite } from '@/lib/gameFilter';
import { COMPETENCY_LABELS } from '@/lib/types';
import Concept from '@/components/concept/Concept.astro';
import { gameHref } from '@/lib/game-href';

interface Props {
  game: GameLite;
}
const { game } = Astro.props;
---

<article
  class="game-row grid grid-cols-1 gap-2 border-b border-ivory-200 py-3 md:grid-cols-[2fr_3fr_1fr_auto] md:items-baseline"
  data-competency={game.competency}
  data-subset={game.subset ?? ''}
  data-cohesion={game.cohesion}
  data-structure={game.structure}
>
  <h3 class="font-display text-base leading-snug">
    <a href={gameHref(game.slug)} class="text-clay-700 no-underline hover:underline">{game.name}</a>
    <span class="ml-2 text-xs text-ink-500">
      {COMPETENCY_LABELS[game.competency]}
      {game.subset ? ` · ${game.subset}` : ''}
    </span>
  </h3>
  <p class="text-sm text-ink-700">{game.intent}</p>
  <p class="text-xs uppercase tracking-widest">
    <Concept id="cohesion">{game.cohesion} cohesion</Concept>
  </p>
  <p class="text-xs uppercase tracking-widest text-ink-500">{game.structure}</p>
</article>
```

- [ ] **Step 6: Create `src/components/games/GameListForCompetency.astro`**

```astro
---
import { loadGamesLite } from '@/lib/games';
import type { Competency } from '@/lib/types';
import GameRow from './GameRow.astro';

interface Props {
  competency: Competency;
  subset?: string;
}
const { competency, subset } = Astro.props;
const all = await loadGamesLite();
const games = all.filter((g) => g.competency === competency && (subset ? g.subset === subset : true));
---

<section class="mt-10" aria-label="Games in this competency">
  <h2 class="font-display text-2xl">Games</h2>
  {games.length === 0 ? (
    <p class="mt-4 text-sm text-ink-500">
      Games for this section are being migrated in Cycle 14b. In the meantime, browse the
      <a href="/theatre-games/games/">full index</a>.
    </p>
  ) : (
    <div class="mt-4 flex flex-col">
      {games.map((game) => <GameRow game={game} />)}
    </div>
  )}
</section>
```

- [ ] **Step 7: Create `src/components/games/CompetencyPage.astro`**

```astro
---
import type { Competency } from '@/lib/types';
import { COMPETENCY_LABELS } from '@/lib/types';
import TheatreGamesLayout from '@/layouts/TheatreGamesLayout.astro';
import IconBar from './IconBar.astro';
import Epigraph from './Epigraph.astro';
import ReasonsResultsTable from './ReasonsResultsTable.astro';
import FollowupsList from './FollowupsList.astro';
import ContinuousAssessmentBlock from './ContinuousAssessmentBlock.astro';
import GameListForCompetency from './GameListForCompetency.astro';

interface Props {
  competency: Competency;
  subset?: string;
  definition: string;
  intent: string;
  reasonsResults: Array<{ reason: string; result: string }>;
  who: string;
  preparation: string;
  followups: string[];
  epigraph?: { attribution: string; body: string };
  pageDescription?: string;
}

const {
  competency,
  subset,
  definition,
  intent,
  reasonsResults,
  who,
  preparation,
  followups,
  epigraph,
  pageDescription,
} = Astro.props;

const title = subset
  ? `${COMPETENCY_LABELS[competency]} — ${subset}`
  : COMPETENCY_LABELS[competency];
---

<TheatreGamesLayout title={title} eyebrow="Competency" description={pageDescription ?? intent}>
  <IconBar />
  {epigraph && <Epigraph attribution={epigraph.attribution} body={epigraph.body} />}

  <section class="prose prose-lg max-w-none">
    <h2>Definition</h2>
    <p>{definition}</p>

    <h2>Intent</h2>
    <p>{intent}</p>
  </section>

  <ReasonsResultsTable rows={reasonsResults} />

  <section class="prose max-w-none">
    <h2>Who</h2>
    <p>{who}</p>
  </section>

  <ContinuousAssessmentBlock />

  <section class="prose max-w-none">
    <h2>Preparation</h2>
    <p>{preparation}</p>

    <h2>Follow-ups</h2>
  </section>
  <FollowupsList items={followups} />

  <GameListForCompetency competency={competency} subset={subset} />
</TheatreGamesLayout>
```

- [ ] **Step 8: Verify + commit**

Run: `pnpm check` — 0 errors.

```bash
git add src/components/games/
git commit -m "$(cat <<'EOF'
feat(cycle-14a): CompetencyPage + sub-parts (T8)

Component family: CompetencyPage.astro (top-level layout with 8 slots
+ integrated GameList), ContinuousAssessmentBlock (always-on wellbeing
checks), Epigraph, ReasonsResultsTable (responsive), FollowupsList,
GameListForCompetency (SSR filtered), GameRow (shared row markup
used by SSR list + Index SSR view). All consume tokens; no hex codes.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: `game-href` helper + 4 root competency pages populated

**Files:**
- Create: `src/lib/game-href.ts`
- Create: `tests/unit/game-href.test.ts`
- Create: `src/pages/theatre-games/competencies/index.astro` (competencies landing)
- Create: `src/pages/theatre-games/competencies/physical-expression/index.astro`
- Create: `src/pages/theatre-games/competencies/vocal-expression/index.astro`
- Create: `src/pages/theatre-games/competencies/risk-assessment/index.astro`
- Create: `src/pages/theatre-games/competencies/resilience/index.astro`

**Interfaces produced:**
- `gameHref(slug: string): string` returning `/theatre-games/games/<slug>/`.
- 5 populated routes (1 landing + 4 competency roots) live.

**Interfaces consumed:** T7 `IconBar`, T8 `CompetencyPage`, `content-source/theatre-games/*.md` (T3) for definition/intent/reasonsResults/who/preparation/followups/epigraph prose.

- [ ] **Step 1: Create `src/lib/game-href.ts` + test**

`tests/unit/game-href.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { gameHref } from '@/lib/game-href';

describe('gameHref', () => {
  it('returns canonical /theatre-games/games/<slug>/ shape', () => {
    expect(gameHref('walking-across-ice')).toBe('/theatre-games/games/walking-across-ice/');
  });
});
```

Then `src/lib/game-href.ts`:
```ts
export function gameHref(slug: string): string {
  return `/theatre-games/games/${slug}/`;
}
```

Run: `pnpm test tests/unit/game-href.test.ts` — expected PASS.

- [ ] **Step 2: Create the competencies landing at `src/pages/theatre-games/competencies/index.astro`**

Render a 5-tile grid with one link per competency to its root page. Uses `TheatreGamesLayout`. Short intro paragraph from spec §1 conviction 4 ("The competency architecture IS the pedagogy").

- [ ] **Step 3: Populate `physical-expression/index.astro`**

Read `content-source/theatre-games/physical-expression-entry.md`. Extract:
- **definition**: the "Definition:" or lead paragraph. Preserve verbatim.
- **intent**: the "Intent — this is a gift…" register — verbatim.
- **reasonsResults**: two-column Reasons/Results table rows.
- **who**: "Who" paragraph.
- **preparation**: "Preparation" list flattened to paragraph OR passed as separate follow-ups if list-shaped.
- **followups**: bullet items.
- **epigraph**: if present at top-of-doc (Roger Holzberg / Lola).

Wire into `<CompetencyPage competency="physical-expression" ... />`. Add the "Two Foundation Competencies" banner as a `<p class="text-xs uppercase tracking-widest text-clay-700">Foundation Competency</p>` above the `<IconBar />` (pass via extra prop or emit before `<CompetencyPage />` — extend the component if needed).

- [ ] **Step 4: Populate `vocal-expression/index.astro`**

Same procedure against `content-source/theatre-games/vocal-expression-1.md`. Strip the "Tab 1" artifact (spec §5, §7 stripping registry).

Add the mapping paragraph for the landing "Elocution / Memorization / Declamation / Presentation" question (spec §6 + review-bundle item #5):

```astro
<aside class="callout-box mt-6">
  <p class="text-xs uppercase tracking-widest text-clay-700">Client-review — mapping</p>
  <p class="mt-2 text-sm">
    Vocal Expression is where <strong>Elocution</strong>, <strong>Memorization</strong>,
    <strong>Declamation</strong>, and <strong>Presentation</strong> are practiced in
    DT:FC&rsquo;s vocabulary — each maps to one of the four subsets:
    Expression, Articulation, Finding a Voice, Story Making.
    <em>Client to confirm this mapping.</em>
  </p>
</aside>
```

- [ ] **Step 5: Populate `risk-assessment/index.astro`**

Same procedure against `content-source/theatre-games/risk-assessment.md`. Ensure epigraph (Roger Holzberg) renders. The Cocoon game is expected in `<GameListForCompetency />` output automatically.

- [ ] **Step 6: Populate `resilience/index.astro`**

Same procedure against `content-source/theatre-games/resilience.md`. **Correct the internal header** — the source doc mislabels itself as "Risk Assessment and Management" (spec §5 known bug); write `Resilience` in this page's `<h1>` and `<CompetencyPage title />`.

Add the resignation-vs-resilience landing-teaser sentence prominently in the Definition or Intent section:

```
"There is no failure, only learning" — DT:FC Resilience is the distinction
between resignation (giving up on the ability to change) and resilience
(returning to attention and trying again with what you now know).
```

If the source doc carries a different phrasing, use it verbatim; only fabricate if the doc doesn't answer the teaser at all.

- [ ] **Step 7: Verify + commit**

Run: `pnpm check && pnpm test && pnpm build 2>&1 | tail -6` — clean.

Spot-check in dev:
```bash
pnpm dev &
sleep 3
curl -s http://localhost:4321/theatre-games/competencies/ | head -30
curl -s http://localhost:4321/theatre-games/competencies/physical-expression/ | head -30
kill %1
```

```bash
git add src/lib/game-href.ts tests/unit/game-href.test.ts src/pages/theatre-games/competencies/
git commit -m "$(cat <<'EOF'
feat(cycle-14a): gameHref + 4 root competency pages populated (T9)

Physical Expression + ENTRY, Vocal Expression 1 (Tab 1 artifact
stripped + Elocution/Memorization/Declamation/Presentation mapping
paragraph flagged for client), Risk Assessment and Management,
Resilience (internal header corrected from source's Risk mislabel;
resignation-vs-resilience teaser resolved). All 4 pages consume
CompetencyPage + IconBar + ContinuousAssessmentBlock + GameList.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Subset placeholders + CA placeholder + subset routes

**Files:**
- Create: 8 subset `.astro` files under `src/pages/theatre-games/competencies/<competency>/<subset>.astro` (Movement, Mime, Rhythm, Articulation, Finding a Voice, Story Making, Observation, Connection)
- Create: `src/pages/theatre-games/competencies/context-awareness/index.astro`

**Interfaces produced:** 9 more routes live, each rendering the honest "corpus content pending in Cycle 14b" chip + `<GameListForCompetency />` for games already parsed to that subset (may be 0 in 14a).

**Interfaces consumed:** T8 CompetencyPage or a lighter placeholder component.

- [ ] **Step 1: Author a placeholder template pattern**

Each subset page uses this shape (parameterize competency + subset name inline):

```astro
---
import TheatreGamesLayout from '@/layouts/TheatreGamesLayout.astro';
import IconBar from '@/components/games/IconBar.astro';
import GameListForCompetency from '@/components/games/GameListForCompetency.astro';
---

<TheatreGamesLayout
  title="Physical Expression — Movement"
  eyebrow="Competency subset"
  description="Movement subset of Physical Expression — corpus content lands in Cycle 14b."
>
  <IconBar />

  <div class="callout-box mt-6">
    <p class="text-xs uppercase tracking-widest text-clay-700">Cycle 14b</p>
    <p class="mt-2 text-sm">
      Full content for this subset (definition, intent, Reasons/Results, Continuous
      Assessment, Preparation, Follow-ups) lands in Cycle 14b when the remaining
      corpus documents are parsed. In the meantime, browse the games already
      catalogued under this subset below, or the
      <a href="/theatre-games/games/">full Index</a>.
    </p>
  </div>

  <GameListForCompetency competency="physical-expression" subset="Movement" />
</TheatreGamesLayout>
```

- [ ] **Step 2: Create all 8 subset placeholders**

- `physical-expression/movement.astro` (subset "Movement")
- `physical-expression/mime.astro` (subset "Mime")
- `physical-expression/rhythm.astro` (subset "Rhythm")
- `vocal-expression/articulation.astro` (subset "Articulation")
- `vocal-expression/finding-a-voice.astro` (subset "Finding a Voice")
- `vocal-expression/story-making.astro` (subset "Story Making")
- `context-awareness/observation.astro` (subset "Observation")
- `context-awareness/connection.astro` (subset "Connection")

- [ ] **Step 3: Create `context-awareness/index.astro` as a competency-root placeholder**

Same shape as Step 1 but without a subset prop, and with a note that both CA subsets are 14b targets.

- [ ] **Step 4: Verify + commit**

Run: `pnpm check && pnpm build 2>&1 | tail -3` — clean. Verify all 9 routes emit.

```bash
git add src/pages/theatre-games/competencies/
git commit -m "$(cat <<'EOF'
feat(cycle-14a): 8 subset placeholders + Context Awareness landing (T10)

Movement / Mime / Rhythm (Physical), Articulation / Finding a Voice /
Story Making (Vocal), Observation / Connection (Context Awareness),
plus Context Awareness competency landing. Each renders IconBar +
honest Cycle-14b chip + GameListForCompetency scoped to the
competency+subset — games already parsed to that subset appear now.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Landing refactor to verbatim doc

**Files:**
- Modify: `src/pages/theatre-games/index.astro` — replace bespoke Cycle-1 landing with verbatim content from `content-source/theatre-games/landing-verbatim.md`

**Interfaces produced:** landing page renders the DT:FC-authored copy; three landing-question resolution links live (see Track G contract closures).

**Interfaces consumed:** T1 layout, existing `ReflectivePrompt` component, existing `Concept`.

- [ ] **Step 1: Migrate the landing content**

Open `content-source/theatre-games/landing-verbatim.md`. Preserve the doc's structure:
- Definition of Theatre Games (single-source via `<Concept id="theatre-games">`).
- Player encouragements.
- Use-cases (For Facilitation Warm-up / For Teaching / For Theatre / For Counselors).
- Five competencies with subsets — **include CA I: Observation + II: Connection** (spec §7.3; silent-added per review bundle item #6).
- Cohesion explainer.
- Index intro (link to `/theatre-games/games/`).
- Honoring teaser (link to `/theatre-games/honoring-our-guides/`).

Rewrite `src/pages/theatre-games/index.astro` to render this content using `TheatreGamesLayout`. Keep `ReflectivePrompt` at bottom (Cycle 2 pattern). Add link tiles → Index, Competencies, Honoring, Facilitation.

- [ ] **Step 2: Mend the "For Teaching" orphan bullet fragment**

The source doc has an orphan fragment: `understanding of the material, and manage class dynamics.` Merge it into a complete sentence contextually, and add a comment in the .astro file:
```astro
{/* Cycle 14a T11 — original source ended with an orphan fragment;
    lightly mended for shipping legibility. Ticketed for client sign-off
    in the review bundle. */}
```

- [ ] **Step 3: Verify + commit**

Run: `pnpm check:prohibited && pnpm check && pnpm build 2>&1 | tail -3` — clean; no prohibited strings.

Spot-check in dev:
```bash
pnpm dev &
sleep 3
curl -s http://localhost:4321/theatre-games/ | grep -E 'Overview|Cohesion|Honoring' | head -10
kill %1
```

```bash
git add src/pages/theatre-games/index.astro
git commit -m "$(cat <<'EOF'
feat(cycle-14a): landing refactor to verbatim doc content (T11)

Replaces Cycle-1 bespoke landing with the DT:FC THEATRE GAMES LANDING
PAGE doc verbatim, plus:
- CA I: Observation + II: Connection added to subset list (spec §7.3)
- "For Teaching" orphan bullet fragment lightly mended (ticket #11)
- Link tiles to Index, Competencies, Honoring, Facilitation
- ReflectivePrompt retained
- Definition text single-sources via <Concept id="theatre-games">

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Index UI — `GameIndex.tsx` island + SSR shell + game detail

**Files:**
- Create: `src/pages/theatre-games/games/index.astro`
- Create: `src/pages/theatre-games/games/[slug].astro`
- Create: `src/components/games/GameIndex.tsx`
- Modify: `src/lib/gameFilter.ts` — extend `GameLite` if needed
- Delete (end of task): `src/components/games/GameFinder.tsx` (retire after `GameIndex` passes smoke)

**Interfaces produced:**
- `/theatre-games/games/` — SSR-first three-column game list with hydrated `<GameIndex client:load>` filter island.
- `/theatre-games/games/[slug]/` — game detail with `<IconBar />`, full record, print CSS.

**Interfaces consumed:** T7 IconBar, T8 GameRow, T9 gameHref, existing `loadGamesLite()`, existing `<Concept>` popovers, `COMPETENCY_SUBSETS`.

- [ ] **Step 1: SSR shell at `src/pages/theatre-games/games/index.astro`**

```astro
---
import TheatreGamesLayout from '@/layouts/TheatreGamesLayout.astro';
import GameIndex from '@/components/games/GameIndex';
import GameRow from '@/components/games/GameRow.astro';
import { loadGamesLite } from '@/lib/games';

const games = await loadGamesLite();
---

<TheatreGamesLayout
  title="Theatre Games Index"
  eyebrow="Find the Game of the Day"
  description="Filter by competency, subset, intent, cohesion, structure, or name."
>
  <GameIndex client:load games={games} />

  {/* SSR fallback — Pagefind + no-JS see every game */}
  <noscript>
    <div class="mt-6">
      {games.map((game) => <GameRow game={game} />)}
    </div>
  </noscript>
</TheatreGamesLayout>
```

- [ ] **Step 2: Preact island at `src/components/games/GameIndex.tsx`**

Model on `src/components/scripts/SoliloquyFilters.tsx` (Cycle 12) for URL persistence pattern. Full component:

```tsx
import { useMemo, useState, useEffect } from 'preact/hooks';
import type { GameLite } from '@/lib/gameFilter';
import { COMPETENCY_LABELS, COMPETENCY_SUBSETS } from '@/lib/types';

interface Props {
  games: GameLite[];
}

const COHESIONS = ['low', 'medium', 'high'] as const;
const STRUCTURES = ['individual', 'group'] as const;

export default function GameIndex({ games }: Props) {
  const initial = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
  const [competency, setCompetency] = useState(initial.get('competency') ?? '');
  const [subset, setSubset] = useState(initial.get('subset') ?? '');
  const [cohesion, setCohesion] = useState(initial.get('cohesion') ?? '');
  const [structure, setStructure] = useState(initial.get('structure') ?? '');
  const [q, setQ] = useState(initial.get('q') ?? '');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (competency) params.set('competency', competency);
    if (subset) params.set('subset', subset);
    if (cohesion) params.set('cohesion', cohesion);
    if (structure) params.set('structure', structure);
    if (q) params.set('q', q);
    const qs = params.toString();
    const url = qs ? `?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [competency, subset, cohesion, structure, q]);

  const availableSubsets = competency
    ? (COMPETENCY_SUBSETS[competency as keyof typeof COMPETENCY_SUBSETS] ?? [])
    : [];

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return games.filter((g) => {
      if (competency && g.competency !== competency) return false;
      if (subset && g.subset !== subset) return false;
      if (cohesion && g.cohesion !== cohesion) return false;
      if (structure && g.structure !== structure) return false;
      if (query) {
        const haystack = `${g.name} ${g.intent}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [games, competency, subset, cohesion, structure, q]);

  const clearAll = () => {
    setCompetency(''); setSubset(''); setCohesion(''); setStructure(''); setQ('');
  };

  return (
    <div>
      <fieldset class="mb-4">
        <legend class="text-xs uppercase tracking-widest text-clay-700">Competency</legend>
        <div class="mt-2 flex flex-wrap gap-2">
          <button type="button" class={chipCls(!competency)} onClick={() => { setCompetency(''); setSubset(''); }}>All</button>
          {Object.keys(COMPETENCY_LABELS).map((c) => (
            <button type="button" class={chipCls(competency === c)} onClick={() => { setCompetency(c); setSubset(''); }}>
              {COMPETENCY_LABELS[c as keyof typeof COMPETENCY_LABELS]}
            </button>
          ))}
        </div>
      </fieldset>

      {availableSubsets.length > 0 && (
        <fieldset class="mb-4">
          <legend class="text-xs uppercase tracking-widest text-clay-700">Subset</legend>
          <div class="mt-2 flex flex-wrap gap-2">
            <button type="button" class={chipCls(!subset)} onClick={() => setSubset('')}>All</button>
            {availableSubsets.map((s) => (
              <button type="button" class={chipCls(subset === s)} onClick={() => setSubset(s)}>{s}</button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset class="mb-4">
        <legend class="text-xs uppercase tracking-widest text-clay-700">Cohesion</legend>
        <div class="mt-2 flex flex-wrap gap-2">
          <button type="button" class={chipCls(!cohesion)} onClick={() => setCohesion('')}>All</button>
          {COHESIONS.map((c) => (
            <button type="button" class={chipCls(cohesion === c)} onClick={() => setCohesion(c)}>{c}</button>
          ))}
        </div>
      </fieldset>

      <fieldset class="mb-4">
        <legend class="text-xs uppercase tracking-widest text-clay-700">Structure</legend>
        <div class="mt-2 flex flex-wrap gap-2">
          <button type="button" class={chipCls(!structure)} onClick={() => setStructure('')}>Both</button>
          {STRUCTURES.map((s) => (
            <button type="button" class={chipCls(structure === s)} onClick={() => setStructure(s)}>{s}</button>
          ))}
        </div>
      </fieldset>

      <label class="block mb-6">
        <span class="text-xs uppercase tracking-widest text-clay-700">Search name or intent</span>
        <input
          type="search"
          value={q}
          onInput={(e) => setQ((e.target as HTMLInputElement).value)}
          class="mt-1 block w-full rounded border border-ivory-200 px-3 py-2 text-sm"
          placeholder="e.g. rhythm, cohesion, warm-up"
        />
      </label>

      <p class="mb-4 text-sm text-ink-500">
        Showing <strong>{filtered.length}</strong> of {games.length} games.
        {filtered.length === 0 && (
          <button type="button" class="ml-3 underline" onClick={clearAll}>Clear all filters</button>
        )}
      </p>

      <div class="grid grid-cols-1 gap-x-6 md:grid-cols-[2fr_3fr_1fr_auto] md:gap-y-1">
        <div class="hidden pb-2 text-xs uppercase tracking-widest text-clay-700 md:block">Competency · Subset</div>
        <div class="hidden pb-2 text-xs uppercase tracking-widest text-clay-700 md:block">Intent</div>
        <div class="hidden pb-2 text-xs uppercase tracking-widest text-clay-700 md:block">Cohesion</div>
        <div class="hidden pb-2 text-xs uppercase tracking-widest text-clay-700 md:block">Structure</div>
        {filtered.map((game) => (
          <>
            <div class="md:col-span-1">
              <a href={`/theatre-games/games/${game.slug}/`} class="font-display text-base text-clay-700 no-underline hover:underline">{game.name}</a>
              <div class="text-xs text-ink-500">
                {COMPETENCY_LABELS[game.competency]}
                {game.subset ? ` · ${game.subset}` : ''}
              </div>
            </div>
            <div class="text-sm text-ink-700">{game.intent}</div>
            <div class="text-xs uppercase tracking-widest">{game.cohesion} cohesion</div>
            <div class="text-xs uppercase tracking-widest text-ink-500">{game.structure}</div>
          </>
        ))}
      </div>

      {filtered.length === 0 && (
        <p class="mt-8 text-sm">No games match. Try clearing one filter.</p>
      )}
    </div>
  );
}

function chipCls(active: boolean) {
  return `rounded border px-2 py-1 text-xs ${active ? 'border-clay-500 bg-clay-500/10 text-clay-700 font-semibold' : 'border-ivory-200 text-ink-700 hover:border-clay-500/60'}`;
}
```

- [ ] **Step 3: Game detail at `src/pages/theatre-games/games/[slug].astro`**

Model on the existing top-level `src/pages/theatre-games/[slug].astro` (which will be replaced with a redirect stub in T13). Extend to mount `<IconBar />` and include print CSS. Full file:

```astro
---
import { getCollection, getEntry, render } from 'astro:content';
import TheatreGamesLayout from '@/layouts/TheatreGamesLayout.astro';
import IconBar from '@/components/games/IconBar.astro';
import Concept from '@/components/concept/Concept.astro';
import { COMPETENCY_LABELS } from '@/lib/types';

export async function getStaticPaths() {
  const games = await getCollection('games');
  return games.map((entry) => ({ params: { slug: entry.id.replace(/\.mdx?$/, '') } }));
}

const { slug } = Astro.params;
const entry = await getEntry('games', slug!);
if (!entry) throw new Error(`Missing game: ${slug}`);
const { Content } = await render(entry);
const d = entry.data;
---

<TheatreGamesLayout title={d.name} eyebrow="Theatre Game" description={d.intent}>
  <IconBar />

  <div class="game-detail">
    <div class="mb-4 flex flex-wrap gap-2 text-xs uppercase tracking-widest">
      <span class="rounded border border-ivory-200 bg-ivory-50 px-2 py-1">
        {COMPETENCY_LABELS[d.competency]}{d.subset ? ` · ${d.subset}` : ''}
      </span>
      <span class="rounded border border-ivory-200 bg-ivory-50 px-2 py-1">
        <Concept id="cohesion">{d.cohesion} cohesion</Concept>
      </span>
      <span class="rounded border border-ivory-200 bg-ivory-50 px-2 py-1">{d.structure}</span>
    </div>

    <p class="text-lg text-ink-700"><strong>Intent:</strong> {d.intent}</p>

    <article class="prose prose-lg mt-6 max-w-none">
      <Content />
    </article>

    {d.source && (
      <p class="mt-6 text-sm text-ink-500"><em>Source:</em> {d.source}</p>
    )}
  </div>
</TheatreGamesLayout>

<style is:inline>
  @media print {
    header, nav, footer, .theatre-games-icon-bar { display: none !important; }
    .game-detail { max-width: none; }
    body { background: white; color: black; }
    a { color: black; text-decoration: none; }
  }
</style>
```

- [ ] **Step 4: Verify + retire GameFinder**

Run: `pnpm check && pnpm build 2>&1 | tail -3` — clean.

Manual sanity in dev:
```bash
pnpm dev &
sleep 3
curl -s "http://localhost:4321/theatre-games/games/" | head -20
curl -s "http://localhost:4321/theatre-games/games/?competency=physical-expression" | head -20
kill %1
```

If both look right, delete the retired finder:
```bash
git rm src/components/games/GameFinder.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/theatre-games/games/ src/components/games/GameIndex.tsx
git add -u src/components/games/GameFinder.tsx  # captures deletion
git commit -m "$(cat <<'EOF'
feat(cycle-14a): Index UI — GameIndex island + SSR shell + game detail (T12)

- /theatre-games/games/ — SSR shell + Preact GameIndex island
  (5 filter axes + structure, URL-persistent, empty-state guidance)
- /theatre-games/games/[slug]/ — game detail with IconBar, chips,
  MDX body, print CSS
- Retires GameFinder.tsx (replaced by GameIndex.tsx)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Redirect stubs — finder, top-level slug, rock-solid

**Files:**
- Modify: `src/pages/theatre-games/finder.astro` — replace with redirect stub to `/theatre-games/games/`
- Modify: `src/pages/theatre-games/[slug].astro` — replace with redirect stub to `/theatre-games/games/[slug]/`
- Modify: `src/pages/theatre-games/how-to/rock-solid-recommendations.astro` — replace with redirect stub to `/theatre-games/facilitation/rock-solid/`

**Interfaces produced:** old URLs no longer 404; browsers auto-redirect + canonical points at new URL; noindex prevents SEO duplication.

**Interfaces consumed:** none.

- [ ] **Step 1: Author redirect-stub for `finder.astro`**

```astro
---
const target = '/theatre-games/games/';
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content={`0; url=${target}`} />
    <link rel="canonical" href={new URL(target, Astro.site).href} />
    <meta name="robots" content="noindex" />
    <title>Moved — Theatre Games Index</title>
  </head>
  <body>
    <p>This page has moved to <a href={target}>{target}</a>.</p>
  </body>
</html>
```

- [ ] **Step 2: Author redirect-stub for `[slug].astro`**

```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const games = await getCollection('games');
  return games.map((entry) => ({ params: { slug: entry.id.replace(/\.mdx?$/, '') } }));
}

const { slug } = Astro.params;
const target = `/theatre-games/games/${slug}/`;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content={`0; url=${target}`} />
    <link rel="canonical" href={new URL(target, Astro.site).href} />
    <meta name="robots" content="noindex" />
    <title>Moved</title>
  </head>
  <body>
    <p>This page has moved to <a href={target}>{target}</a>.</p>
  </body>
</html>
```

- [ ] **Step 3: Author redirect-stub for `how-to/rock-solid-recommendations.astro`**

Same pattern, target `/theatre-games/facilitation/rock-solid/`.

- [ ] **Step 4: Verify + commit**

Run: `pnpm build 2>&1 | tail -3` — clean.

Manual redirect check in dev:
```bash
pnpm dev &
sleep 3
curl -s http://localhost:4321/theatre-games/finder/ | grep -oE 'refresh[^"]*"[^"]+"' | head -1
curl -s http://localhost:4321/theatre-games/mirrors/ | grep -oE 'refresh[^"]*"[^"]+"' | head -1
curl -s http://localhost:4321/theatre-games/how-to/rock-solid-recommendations/ | grep -oE 'refresh[^"]*"[^"]+"' | head -1
kill %1
```

Expected: three lines each showing the meta-refresh target.

```bash
git add src/pages/theatre-games/finder.astro src/pages/theatre-games/\[slug\].astro src/pages/theatre-games/how-to/rock-solid-recommendations.astro
git commit -m "$(cat <<'EOF'
feat(cycle-14a): redirect stubs — finder, top-level slug, rock-solid (T13)

Meta-refresh + canonical + noindex on 3 legacy URLs so external inbound
links keep resolving after the Cycle 14a IA restructure. Follows the
Cycle 13 redirect-stub pattern.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Facilitation landing + Orientation + VideoSlot component

**Files:**
- Create: `src/components/games/VideoSlot.astro`
- Create: `src/pages/theatre-games/facilitation/index.astro`
- Create: `src/pages/theatre-games/facilitation/orientation.astro`

**Interfaces produced:**
- `<VideoSlot placeholder="…" videoUrl?="…" caption?="…" />` — aspect-ratio placeholder or embed.
- `/theatre-games/facilitation/` landing lists all 6 guides as tiles.
- `/theatre-games/facilitation/orientation/` renders the DT:FC #1 orientation infographic + wired video slot, print-styled + phone-scaled.

**Interfaces consumed:** T1 layout; T3's `orientation.md` for content; existing `<Concept>` for the DT:FC definition single-source rule.

- [ ] **Step 1: Create `src/components/games/VideoSlot.astro`**

```astro
---
interface Props {
  placeholder: string;
  videoUrl?: string;
  caption?: string;
}
const { placeholder, videoUrl, caption } = Astro.props;
---

<figure class="video-slot my-6">
  {videoUrl ? (
    <div class="aspect-video w-full">
      <iframe
        src={videoUrl}
        title={placeholder}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="h-full w-full rounded"
      ></iframe>
    </div>
  ) : (
    <div class="aspect-video w-full rounded border border-dashed border-ivory-200 bg-ivory-50 p-6 flex items-center justify-center">
      <p class="text-center text-sm text-ink-500">{placeholder}</p>
    </div>
  )}
  {caption && <figcaption class="mt-2 text-xs text-ink-500">{caption}</figcaption>}
</figure>
```

- [ ] **Step 2: Facilitation landing**

`src/pages/theatre-games/facilitation/index.astro` — 6-tile grid: Orientation, How to Use the Index, Warmup, Rock Solid, Honoring Our Guides (cross-link — logically a facilitation resource even if lives at `/theatre-games/honoring-our-guides/`), Submit (cross-link — same reasoning). Or 4 tiles + cross-link section. Use TheatreGamesLayout.

- [ ] **Step 3: Orientation content**

Read `content-source/theatre-games/orientation.md`. Author `src/pages/theatre-games/facilitation/orientation.astro` with:
- Verbatim DT:FC definition via `<Concept id="theatre-games">`.
- Organizational logic section.
- "How to Find the Game of the Day" step-by-step.
- Worked example — Puppets/Marionettes with all five record fields; use `<GameLink slug="puppets-marionettes">` (existing Cycle 13 helper) so it hot-links.
- Facilitator role + goals.
- Closing → `/theatre-games/facilitation/rock-solid/` link.
- `<VideoSlot placeholder="Narrated orientation video coming soon — pending Cycle 8 client asset delivery" caption="Chuck Wilcox voice-over per client discussion (spec §7 item 5)" />`

Add print + phone media queries to a `<style is:inline>` block:

```astro
<style is:inline>
  @media print {
    nav, header, footer, .video-slot { display: none !important; }
    body { background: white; color: black; }
    .orientation-body { max-width: none; column-count: 2; column-gap: 2rem; }
  }
  @media (max-width: 600px) {
    .orientation-body { font-size: 0.95rem; }
  }
</style>
```

Wrap body in `<article class="orientation-body">`.

- [ ] **Step 4: Verify + commit**

Run: `pnpm check:prohibited && pnpm check && pnpm build 2>&1 | tail -3` — clean.

```bash
git add src/components/games/VideoSlot.astro src/pages/theatre-games/facilitation/index.astro src/pages/theatre-games/facilitation/orientation.astro
git commit -m "$(cat <<'EOF'
feat(cycle-14a): facilitation landing + Orientation with VideoSlot (T14)

- VideoSlot: aspect-ratio placeholder | embed component
- /facilitation/ landing with 6-guide tile grid
- /facilitation/orientation/ — DT:FC #1 orientation content, verbatim
  definition via <Concept> single-source, worked Puppets/Marionettes
  example via <GameLink>, print CSS (2-column) + phone-scale CSS,
  wired VideoSlot pending Chuck Wilcox asset.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: How-to-Use-the-Index guide (authored AFTER Index UI stable)

**Files:**
- Create: `src/pages/theatre-games/facilitation/how-to-use-the-index.astro`
- Create: `public/images/theatre-games/how-to/*.png` (2–3 real screenshots)
- Delete (end of task): `src/components/games/HowToModal.astro` (retire after this route ships)

**Interfaces produced:** `/theatre-games/facilitation/how-to-use-the-index/` explains the Index UI with real screenshots.

**Interfaces consumed:** T12's live Index UI at `/theatre-games/games/`.

- [ ] **Step 1: Capture screenshots**

Boot dev server and screenshot 3 states using Playwright MCP or manual capture:

```bash
pnpm dev &
sleep 3
```

Using Playwright MCP tools (or manually via browser DevTools) capture:
- **default.png** — `/theatre-games/games/` unfiltered (default 3-column view).
- **filtered.png** — `/theatre-games/games/?competency=physical-expression` (competency chip active, subset chips visible).
- **empty.png** — `/theatre-games/games/?competency=resilience&cohesion=high&q=impossible` (empty state with "Clear all filters" button).

Save to `public/images/theatre-games/how-to/`.

```bash
kill %1
```

- [ ] **Step 2: Author `how-to-use-the-index.astro`**

```astro
---
import TheatreGamesLayout from '@/layouts/TheatreGamesLayout.astro';
---

<TheatreGamesLayout
  title="How to Use the Index"
  eyebrow="Facilitation guide #3"
  description="A short walkthrough of the DT:FC Theatre Games Index — filters, search, and shareable URLs."
>
  <section class="prose prose-lg max-w-none">
    <h2>The three-column view</h2>
    <p>
      The Index defaults to a three-column layout: <strong>Competency + Subset</strong>,
      <strong>Intent</strong>, <strong>Cohesion</strong>. Structure (Individual or Group)
      appears as a chip on the row. Every row is a link into the full game record.
    </p>
    <figure>
      <img src="/images/theatre-games/how-to/default.png" alt="Screenshot of the Theatre Games Index with no filters applied, showing the three-column layout." width="1200" />
      <figcaption>The Index in its default state.</figcaption>
    </figure>

    <h2>Filtering</h2>
    <p>
      Select any Competency chip to narrow the list. When you pick a Competency, its
      Subset chips appear — clicking one narrows further. The Cohesion strip
      (Low / Medium / High) and Structure toggle work the same way. The search box
      matches both the game name and the intent.
    </p>
    <figure>
      <img src="/images/theatre-games/how-to/filtered.png" alt="Screenshot showing Physical Expression selected with subset chips visible below." width="1200" />
      <figcaption>Filtering by Competency reveals the relevant Subsets.</figcaption>
    </figure>

    <h2>Empty results</h2>
    <p>
      If a combination has no matches, the Index says so and offers a
      <strong>Clear all filters</strong> button to reset in one click.
    </p>
    <figure>
      <img src="/images/theatre-games/how-to/empty.png" alt="Screenshot of the Index with no matching games and a Clear all filters button." width="1200" />
      <figcaption>Empty state — one click to reset.</figcaption>
    </figure>

    <h2>Shareable URLs</h2>
    <p>
      Your filter selection is stored in the URL, so <em>this exact view</em>
      is shareable and back-button-safe. Paste the URL into a lesson plan
      or a colleague&rsquo;s email; they land where you left off.
    </p>

    <h2>Printing a game</h2>
    <p>
      Open a game page and use your browser&rsquo;s <strong>Print</strong> command
      (⌘P / Ctrl-P). The navigation, header, and footer are stripped automatically;
      what prints is the facilitation instructions you actually need in the room.
    </p>
  </section>
</TheatreGamesLayout>
```

- [ ] **Step 3: Retire `HowToModal.astro`**

Check for any remaining references:
```bash
grep -r "HowToModal" src/ 2>/dev/null
```
If none, delete:
```bash
git rm src/components/games/HowToModal.astro
```
If any references remain, migrate them to inline links to the new guide first.

- [ ] **Step 4: Verify + commit**

Run: `pnpm check && pnpm build 2>&1 | tail -3` — clean.

```bash
git add src/pages/theatre-games/facilitation/how-to-use-the-index.astro public/images/theatre-games/how-to/
git add -u src/components/games/HowToModal.astro 2>/dev/null
git commit -m "$(cat <<'EOF'
feat(cycle-14a): How to Use the Index guide with real screenshots (T15)

Authored per spec §3 build-order requirement: Index UI built first
(T12), then this help page with real screenshots (default / filtered /
empty). Prose walks through filters, empty state, shareable URLs,
and printing a game. Retires HowToModal.astro (replaced by this
standalone page).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: Warmup guide with Cool-down surfaced

**Files:**
- Create: `src/pages/theatre-games/facilitation/warmup.astro`

**Interfaces produced:** `/theatre-games/facilitation/warmup/` — canonical Warmup guide with Cool-down as its own H2.

**Interfaces consumed:** T3's `warmup-guide.md`; existing `<GameLink>` helper for Outrageous Roll Call + Jabberwocky cross-links.

- [ ] **Step 1: Migrate content from `content-source/theatre-games/warmup-guide.md`**

Author the .astro file. Include:
- Physical readiness prose.
- Psychological readiness prose.
- Warmup components list.
- World-event example — **strip Cherie's editorial note** ("leaving it only to world/weather events?") and add HTML comment:
  ```astro
  {/* Cycle 14a T16 — Cherie's editorial note stripped; harvest ticketed
      in review bundle item #7. */}
  ```
- **`## Cool-down` as a full H2**, not buried in a footnote. Body from source doc; if the source only mentions cool-down in passing, expand to a paragraph naming what a cool-down is (transition out; return the group to individual selves; brief).
- Cross-links: `<GameLink slug="outrageous-roll-call">Outrageous Roll Call</GameLink>` and `<GameLink slug="jabberwocky">Jabberwocky</GameLink>` in context.
- OLD-guide harvest note as a small callout:
  ```astro
  <aside class="callout-box mt-8">
    <p class="text-xs uppercase tracking-widest text-clay-700">Editorial harvest — pending client decision</p>
    <p class="mt-2 text-sm">
      Additional warmup favorites (Getting into Shared Space, Who&rsquo;s Here?,
      circle walking / rhythm clapping, slower-day / higher-energy-day
      programming) live in a superseded draft. Client decision on whether
      to merge is ticketed (review bundle #7).
    </p>
  </aside>
  ```

- [ ] **Step 2: Verify + commit**

Run: `pnpm check:prohibited && pnpm build 2>&1 | tail -3` — clean; no Silverstein references.

```bash
git add src/pages/theatre-games/facilitation/warmup.astro
git commit -m "$(cat <<'EOF'
feat(cycle-14a): Warmup guide (#5 canonical) with Cool-down surfaced (T16)

Migrates the canonical Warmup guide from Drive. Cool-down promoted
to its own H2 (spec §3 item 3). Cherie's world-event editorial note
stripped (ticket #7). Cross-links Outrageous Roll Call + Jabberwocky
via <GameLink>. OLD-guide favorites harvest ticketed inline.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: Rock Solid — data file + page + interactive checklist

**Files:**
- Create: `src/data/rock-solid-recommendations.ts`
- Create: `src/pages/theatre-games/facilitation/rock-solid.astro`
- Create: `tests/unit/rock-solid-recommendations.test.ts`

**Interfaces produced:**
- `ROCK_SOLID_RECOMMENDATIONS: RockSolidRecord[]` where `RockSolidRecord = { slug: string; title: string; body: string; tags?: string[] }`.
- `/theatre-games/facilitation/rock-solid/` reads the array; renders as read-through with interactive self-assessment checklist (no storage) + PRC-wired vocabulary + Workshops CTA.

**Interfaces consumed:** T3's `rock-solid.md`; existing `<Concept>` for vocabulary; existing `/community/workshops/` route.

- [ ] **Step 1: Write the failing test at `tests/unit/rock-solid-recommendations.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { z } from 'astro/zod';
import { ROCK_SOLID_RECOMMENDATIONS } from '@/data/rock-solid-recommendations';

const recordSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(3),
  body: z.string().min(20),
  tags: z.array(z.string()).optional(),
});

describe('ROCK_SOLID_RECOMMENDATIONS', () => {
  it('every entry validates against the record schema', () => {
    for (const rec of ROCK_SOLID_RECOMMENDATIONS) {
      expect(() => recordSchema.parse(rec)).not.toThrow();
    }
  });

  it('slugs are unique', () => {
    const slugs = ROCK_SOLID_RECOMMENDATIONS.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
```

Run: `pnpm test tests/unit/rock-solid-recommendations.test.ts` — expected FAIL.

- [ ] **Step 2: Create `src/data/rock-solid-recommendations.ts`**

Extract each Recommendation from `content-source/theatre-games/rock-solid.md`. Structure:

```ts
export interface RockSolidRecord {
  slug: string;
  title: string;
  body: string;
  tags?: string[];
}

export const ROCK_SOLID_RECOMMENDATIONS: readonly RockSolidRecord[] = [
  {
    slug: 'begin-on-time',
    title: 'Begin on time',
    body: 'The workshop starts when it starts. Late arrivals join the game in progress — no re-briefing. Beginning on time honors the Players who arrived on time and models the discipline the work asks for.',
    tags: ['facilitation', 'discipline'],
  },
  // ... one entry per Recommendation in the source doc
] as const;
```

Run: `pnpm test tests/unit/rock-solid-recommendations.test.ts` — expected PASS.

- [ ] **Step 3: Create `src/pages/theatre-games/facilitation/rock-solid.astro`**

```astro
---
import TheatreGamesLayout from '@/layouts/TheatreGamesLayout.astro';
import Concept from '@/components/concept/Concept.astro';
import { ROCK_SOLID_RECOMMENDATIONS } from '@/data/rock-solid-recommendations';

// Split body into paragraphs on double-newline
function paragraphs(body: string): string[] {
  return body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
}
---

<TheatreGamesLayout
  title="Rock Solid Recommendations"
  eyebrow="Facilitation guide #6"
  description="Read-through-able foundational practices; reusable in workshops, newsletters, and popup guidance."
>
  <section class="prose prose-lg max-w-none">
    <p>
      A working DT:FC facilitator carries these practices as reflex. Each
      Recommendation is a standalone block — the site reuses them across
      workshops, newsletter posts, and popup guidance.
    </p>

    <h2>Vocabulary you&rsquo;ll want handy</h2>
    <p>
      <Concept id="facilitation">Facilitation</Concept>,
      <Concept id="cohesion">Cohesion</Concept>,
      <Concept id="continuous-assessment">Continuous Assessment</Concept>,
      <Concept id="feedback-no-critique">Feedback / No Critique</Concept>,
      <Concept id="encompassing-diversity">Encompassing Diversity</Concept>.
    </p>
  </section>

  <ol class="mt-8 grid gap-6 md:grid-cols-2">
    {ROCK_SOLID_RECOMMENDATIONS.map((rec, i) => (
      <li id={rec.slug} class="callout-box list-none">
        <p class="text-xs uppercase tracking-widest text-clay-700">Recommendation {i + 1}</p>
        <h3 class="mt-1 font-display text-xl">{rec.title}</h3>
        {paragraphs(rec.body).map((p) => <p class="mt-2 text-sm">{p}</p>)}
      </li>
    ))}
  </ol>

  <section class="mt-12">
    <h2 class="font-display text-2xl">Self-assessment</h2>
    <p class="mt-2 text-sm text-ink-700">
      Check each Recommendation as you feel it&rsquo;s part of your facilitator practice.
      No data is stored — this is a mirror, not a report.
    </p>
    <form class="mt-4 space-y-2" data-rock-solid-checklist>
      {ROCK_SOLID_RECOMMENDATIONS.map((rec) => (
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" value={rec.slug} />
          <span>{rec.title}</span>
        </label>
      ))}
      <p class="mt-4 text-sm"><span data-rock-solid-count>0</span> of {ROCK_SOLID_RECOMMENDATIONS.length}</p>
    </form>
  </section>

  <aside class="callout-box mt-12">
    <p class="text-xs uppercase tracking-widest text-clay-700">Workshops</p>
    <p class="mt-2 text-sm">
      Want to work with a DT:FC facilitator?
      <a href="/community/workshops/">Register interest in upcoming workshops.</a>
    </p>
  </aside>
</TheatreGamesLayout>

<script is:inline>
  (function() {
    if (window.__dtfcRockSolidInit) return;
    window.__dtfcRockSolidInit = true;
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.querySelector('[data-rock-solid-checklist]');
      if (!form) return;
      const counter = form.querySelector('[data-rock-solid-count]');
      form.addEventListener('change', () => {
        const checked = form.querySelectorAll('input[type="checkbox"]:checked').length;
        if (counter) counter.textContent = String(checked);
      });
    });
  })();
</script>
```

- [ ] **Step 4: Verify + commit**

Run: `pnpm check:prohibited && pnpm test && pnpm check && pnpm build 2>&1 | tail -3` — clean; the "Building a Firm Foundation" rejected alt name doesn't appear.

```bash
git add src/data/rock-solid-recommendations.ts src/pages/theatre-games/facilitation/rock-solid.astro tests/unit/rock-solid-recommendations.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-14a): Rock Solid — data file + reusable blocks page (T17)

Restructures Cycle 1's how-to/rock-solid-recommendations.astro into
data-driven reusable blocks (ROCK_SOLID_RECOMMENDATIONS in
src/data/). Each block is title + body + optional tags, sufficient
for newsletter/popup reuse. Page renders 2-col grid + PRC-wired
vocabulary + interactive no-storage self-assessment checklist +
Workshops CTA → /community/workshops/. Naming preserved as-is
(review bundle #10).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 18: Honoring Our Guides + Spolin attribution table

**Files:**
- Create: `src/pages/theatre-games/honoring-our-guides.astro`
- Create: `tests/unit/spolin-attribution.test.ts`
- Modify: ~17 game MDXs — ensure each carries `source: 'Adapted from Viola Spolin...'` + `spolinPage:` matching the Honoring table

**Interfaces produced:**
- `/theatre-games/honoring-our-guides/` renders lineage prose + intact 17-row Spolin table + `/legacy/founders/` link.
- Every Spolin-adapted game's frontmatter carries the source line and page number.

**Interfaces consumed:** T3's `honoring-our-guides.md`.

- [ ] **Step 1: Migrate the Honoring page**

Read `content-source/theatre-games/honoring-our-guides.md`. Author `src/pages/theatre-games/honoring-our-guides.astro`:
- Lineage prose ("You are now part of this lineage of practitioners" — verbatim).
- Moreno / Brian Way / Viola Spolin / Norma J. Livo named with book titles.
- Caravan origin paragraph.
- **Spolin attribution table** — 17 rows minimum, semantic `<table>`:

```astro
<h2 id="spolin-attributions">Viola Spolin — Adapted games</h2>
<p class="text-sm text-ink-700">
  The following DT:FC games are adapted from Viola Spolin,
  <em>Improvisation for the Theater</em> (Northwestern University Press, 1963;
  ISBN 0-8101-4008-X). Each in-repo game carries this attribution in its
  facilitator page.
</p>
<table class="mt-4 w-full border-collapse text-sm">
  <thead>
    <tr class="border-b border-ivory-200">
      <th scope="col" class="pb-2 text-left">DT:FC game</th>
      <th scope="col" class="pb-2 text-left">Spolin page</th>
    </tr>
  </thead>
  <tbody>
    {/* Rows here — pull from source doc; each row must match a game
        MDX whose frontmatter source line ships in Step 2. */}
  </tbody>
</table>
```

Add "Please go to Legacy Acknowledgements" → `<a href="/legacy/founders/">…</a>` link.

- [ ] **Step 2: Ensure each Spolin-adapted game MDX carries `source` + `spolinPage`**

For each row in the Spolin table, open the corresponding MDX in `src/content/games/` and confirm frontmatter has:
```yaml
source: 'Adapted from Viola Spolin, Improvisation for the Theater, p. N.'
spolinPage: N
```

If missing, hand-add. This is the same page number the table displays.

- [ ] **Step 3: Write the failing test at `tests/unit/spolin-attribution.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('Spolin attribution enforcement', () => {
  it('every game with a Spolin source line also has spolinPage', async () => {
    const games = await getCollection('games');
    const spolinGames = games.filter((g) => (g.data.source ?? '').startsWith('Adapted from Viola Spolin'));
    expect(spolinGames.length).toBeGreaterThanOrEqual(1);
    for (const g of spolinGames) {
      expect(g.data.spolinPage).toBeGreaterThan(0);
      expect(g.data.source).toContain(`p. ${g.data.spolinPage}`);
    }
  });
});
```

Run: `pnpm test tests/unit/spolin-attribution.test.ts` — expected PASS (all Step 2 hand-fixes applied).

- [ ] **Step 4: Verify + commit**

Run: `pnpm check:prohibited && pnpm test && pnpm build 2>&1 | tail -3` — clean.

```bash
git add src/pages/theatre-games/honoring-our-guides.astro src/content/games/ tests/unit/spolin-attribution.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-14a): Honoring Our Guides + Spolin attribution enforcement (T18)

/theatre-games/honoring-our-guides/ ships with lineage prose (Moreno,
Brian Way, Spolin, Livo, Caravan origin) + intact Spolin attribution
table (17 games, 1963 copyright, ISBN) + link to /legacy/founders/.
Every game whose source starts with "Adapted from Viola Spolin"
carries spolinPage in frontmatter; Vitest test asserts the invariant.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 19: Submit page + template rendered as reference

**Files:**
- Create: `src/pages/theatre-games/submit.astro`

**Interfaces produced:** `/theatre-games/submit/` renders the Web 2.0 template as reference with honest "not yet accepting" chip + Contact CTA.

**Interfaces consumed:** T3's `submit-template.md`; existing `/community/contact/` route.

- [ ] **Step 1: Author `src/pages/theatre-games/submit.astro`**

Read `content-source/theatre-games/submit-template.md`. Extract the template's field list and how-to-submit instructions. **Strip Lola's TEAM QUESTION block** and any "WEB 2.0?" title prefix per spec §7.

```astro
---
import TheatreGamesLayout from '@/layouts/TheatreGamesLayout.astro';
---

<TheatreGamesLayout
  title="Submit a Theatre Game"
  eyebrow="Web 2.0 template"
  description="The DT:FC template for contributing a new Theatre Game — reference now, live submission after client sign-off."
>
  <div class="callout-box mb-6">
    <p class="text-xs uppercase tracking-widest text-clay-700">Not yet accepting submissions</p>
    <p class="mt-2 text-sm">
      Live game submissions open once the DT:FC team&rsquo;s reviewer workflow is in place.
      In the meantime, share via the <a href="/community/contact/">Contact form</a>
      and we&rsquo;ll route it in.
    </p>
  </div>

  <section class="prose prose-lg max-w-none">
    <h2>The template</h2>
    <p>
      When submission opens, contributors fill in the following fields.
      This is a reference — please read through before drafting.
    </p>

    <h3>Header fields</h3>
    <ul>
      <li><strong>Name</strong> — the game&rsquo;s name.</li>
      <li><strong>Competency</strong> — one of the five: Physical Expression, Vocal Expression, Context Awareness, Risk Assessment and Management, Resilience.</li>
      <li><strong>Subset</strong> — where relevant (e.g. Movement, Articulation, Observation).</li>
      <li><strong>Structure</strong> — Individual or Group.</li>
      <li><strong>Cohesion level</strong> — Low, Medium, or High. <em>Choose carefully — mismatches can cause harm.</em></li>
    </ul>

    <h3>Body sections</h3>
    <ul>
      <li><strong>Intent</strong> — a one-sentence "why you&rsquo;d play it."</li>
      <li><strong>Technique</strong> — step-by-step facilitator directions.</li>
      <li><strong>Evaluation</strong> — the questions to ask after. Not static; tune to the group.</li>
      <li><strong>Variations / Adaptations</strong> — optional; pre-K to seniors, accessibility, remote play.</li>
      <li><strong>Source</strong> — if adapted from published work, cite it (Spolin p. N, Livo, etc.).</li>
    </ul>

    <h2>Why we don&rsquo;t take submissions live yet</h2>
    <p>
      DT:FC content is safety-doctrine informed. We want a reviewer read on every
      new game before publishing. This decision is being worked on by the team.
    </p>
  </section>

  <p class="mt-8">
    <a href="/community/contact/" class="rounded bg-clay-500 px-4 py-2 text-sm font-medium text-ivory-50 no-underline">Contact us to contribute</a>
  </p>
</TheatreGamesLayout>
```

- [ ] **Step 2: Verify + commit**

Run: `pnpm check:prohibited && pnpm build 2>&1 | tail -3` — clean; TEAM QUESTION absent.

```bash
git add src/pages/theatre-games/submit.astro
git commit -m "$(cat <<'EOF'
feat(cycle-14a): Submit page — Web 2.0 template rendered as reference (T19)

Template fields + instructions from Drive source, with:
- Lola's TEAM QUESTION block stripped (§7 registry)
- Honest "Not yet accepting" chip pending Lola's reviewer decision
  (review bundle #1)
- Contact form CTA → /community/contact/ as interim route

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 20: Cross-section contract closures + `<GameLink>` resolver refresh

**Files:**
- Modify: `src/pages/theatre-games/competencies/resilience/index.astro` — verify resignation-vs-resilience sentence prominent (from T9)
- Modify: `src/pages/theatre-games/competencies/vocal-expression/index.astro` — verify Elocution/Memorization/Declamation/Presentation mapping paragraph (from T9)
- Verify (no edits): `src/pages/theatre-games/index.astro` — playful/empowering landing question resolved by verbatim landing content (T11)

**Interfaces produced:** all three landing-question teasers land on real answering content.

**Interfaces consumed:** T9 competency pages, T11 landing, `<GameLink>` from Cycle 13.

- [ ] **Step 1: Verify the three landing-question resolutions**

Grep evidence:

```bash
grep -r "resignation" src/pages/theatre-games/competencies/resilience/ | head -3
grep -r "Elocution\|Declamation\|Memorization\|Presentation" src/pages/theatre-games/competencies/vocal-expression/ | head -5
grep -r "playful\|empower" src/pages/theatre-games/index.astro | head -3
```

Each command must return at least one match. If any is missing, patch the relevant page.

- [ ] **Step 2: Run the games advisory report to refresh unresolved-slug list**

Run: `pnpm build 2>&1 | grep -A 3 "Unresolved theatre-game" | head -30`

Review the report. Any Children's-Theatre `<GameLink>` slugs now resolved by newly parsed corpus games? Confirm the count dropped from Cycle 13 baseline.

Any remaining unresolved slugs get noted in the client-review bundle (T24) as 14b targets.

- [ ] **Step 3: Verify + commit (or note no-changes-needed if all pass)**

If the grep + report already pass with T9/T11 content, no new commit for T20 — mark task complete on the plan.

If patches were needed:
```bash
git add src/pages/theatre-games/
git commit -m "$(cat <<'EOF'
fix(cycle-14a): explicit landing-question resolutions on Resilience + Vocal (T20)

Confirms the three landing-teaser questions land on real answering
content: playful/empowering (Overview verbatim doc), resignation-vs-
resilience (Resilience page explicit sentence), Elocution/Memorization/
Declamation/Presentation mapping (Vocal Expression page paragraph
with client-sign-off callout).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 21: Guardrail extensions — check-prohibited + check-silverstein

**Files:**
- Modify: `scripts/check-prohibited-text.mjs` — 10 new PATTERNS
- Create: `scripts/check-silverstein.mjs`
- Modify: `package.json` — add `check:silverstein` script

**Interfaces produced:**
- `pnpm build` fails if any of 10 new prohibited strings appears in tracked content.
- `pnpm check:silverstein` — advisory grep across `dist/` for `silverstein` (case-insensitive); exit 0 with a report.

**Interfaces consumed:** existing `scripts/check-prohibited-text.mjs` PATTERNS array.

- [ ] **Step 1: Add PATTERNS to `scripts/check-prohibited-text.mjs`**

Locate the `PATTERNS` array (or equivalent). Append these entries (adjust to existing syntax — string vs. regex):

```js
// Cycle 14a §7 stripping registry
'(Desirae: Your input next)',
'DESIRAE –',
'TEAM QUESTION',
'Tab 1',
'ANY OTHERS?',
'WEB 2.0?',
'(Link to Folder)',
'***NOTE: THIS IS NOT APPROPRIATE',
'Building a Firm Foundation',
/^#\d+\s/,  // line-anchored #N title prefix; add `g` flag if required by script convention
```

If existing PATTERNS use a `{ pattern, description }` shape, wrap each accordingly.

- [ ] **Step 2: Run the guardrail to confirm no regressions**

Run: `pnpm check:prohibited`

If any new PATTERN matches unexpectedly (e.g. `TEAM QUESTION` matches a comment somewhere), fix the source content — do NOT weaken the pattern.

- [ ] **Step 3: Create `scripts/check-silverstein.mjs`**

```js
#!/usr/bin/env node
import { existsSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const ROOT = 'dist';
const NEEDLE = /silverstein/i;

if (!existsSync(ROOT)) {
  console.log('⚠ dist/ not present; run `pnpm build` first.');
  process.exit(0);
}

const hits = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (name.endsWith('.html')) {
      const text = readFileSync(p, 'utf8');
      if (NEEDLE.test(text)) hits.push(p);
    }
  }
}
walk(ROOT);

if (hits.length === 0) {
  console.log('✓ No `silverstein` references in built output.');
} else {
  console.log(`⚠ ${hits.length} file(s) contain \`silverstein\` (advisory in 14a; will block in 14b):`);
  for (const h of hits) console.log(`  ${h}`);
}
process.exit(0);
```

- [ ] **Step 4: Add npm script**

```json
"check:silverstein": "node scripts/check-silverstein.mjs",
```

- [ ] **Step 5: Verify + commit**

Run: `pnpm build && pnpm check:silverstein`

Expected: build passes; silverstein check reports 0 hits (14a content should have no Silverstein references since Vocal 2 Articulation is 14b scope).

```bash
git add scripts/check-prohibited-text.mjs scripts/check-silverstein.mjs package.json
git commit -m "$(cat <<'EOF'
feat(cycle-14a): guardrail extensions — §7 PATTERNS + silverstein advisory (T21)

- 10 new PATTERNS in check-prohibited-text.mjs cover the vision-spec
  §7 stripping registry (Desirae input notes, DESIRAE prefix, TEAM
  QUESTION, Tab 1, ANY OTHERS?, WEB 2.0?, Link to Folder, appropriate-
  section rhythm-doc marker, Building a Firm Foundation, #N title
  prefix regex).
- New check-silverstein.mjs is advisory-only in 14a (14b promotes to
  build gate once Vocal Articulation corpus lands and Silverstein
  replacements complete).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 22: Playwright smoke checkpoints + axe scans + concept-refs test

**Files:**
- Modify: `tests/e2e/smoke.spec.ts` — add ~10 Theatre Games checkpoints + 3 axe scans
- Create: `tests/unit/theatre-games-concept-refs.test.ts`

**Interfaces produced:** e2e smoke suite covers the new Index UI, redirect stubs, sub-nav traversal; axe covers Index + one competency + Honoring; unit test asserts every `<Concept id>` used on Theatre Games pages resolves.

**Interfaces consumed:** all prior tasks.

- [ ] **Step 1: Write `tests/unit/theatre-games-concept-refs.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection } from 'astro:content';

const ROOTS = ['src/pages/theatre-games', 'src/components/games'];
const CONCEPT_RE = /<Concept\s+id="([^"]+)"/g;

function collectFiles(dir: string, out: string[] = []): string[] {
  if (!statSync(dir, { throwIfNoEntry: false })) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) collectFiles(p, out);
    else if (p.endsWith('.astro') || p.endsWith('.tsx') || p.endsWith('.ts')) out.push(p);
  }
  return out;
}

describe('Theatre Games <Concept id="…"> references', () => {
  it('every referenced slug exists in the concepts collection', async () => {
    const files = ROOTS.flatMap((r) => collectFiles(r));
    const refs = new Set<string>();
    for (const f of files) {
      const text = readFileSync(f, 'utf8');
      for (const m of text.matchAll(CONCEPT_RE)) refs.add(m[1]);
    }
    const concepts = await getCollection('concepts');
    const slugs = new Set(concepts.map((c) => c.data.slug));
    for (const ref of refs) {
      expect(slugs.has(ref)).toBe(true);
    }
  });
});
```

Run: `pnpm test tests/unit/theatre-games-concept-refs.test.ts` — expected PASS.

- [ ] **Step 2: Extend `tests/e2e/smoke.spec.ts`**

Add these checkpoints (find the section grouping — likely a `test.describe('theatre games', …)` block; add there):

```ts
test('Index page loads + filter selection updates rows + URL persists', async ({ page }) => {
  await page.goto('/theatre-games/games/');
  await expect(page.getByRole('heading', { name: /Theatre Games Index/i })).toBeVisible();
  const initialRows = await page.locator('.game-row, [data-competency]').count();
  await page.getByRole('button', { name: 'Physical Expression' }).first().click();
  await expect.poll(() => page.url()).toContain('competency=physical-expression');
  const filteredRows = await page.locator('[data-competency="physical-expression"]').count();
  expect(filteredRows).toBeLessThan(initialRows);
});

test('game detail print CSS strips sub-nav', async ({ page }) => {
  await page.goto('/theatre-games/games/mirrors/');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('nav[aria-label="Theatre Games sub-navigation"]')).toBeHidden();
});

test('sub-nav traversal — Overview → Index → Competencies → Facilitation → Honoring → Submit', async ({ page }) => {
  for (const path of ['/theatre-games/', '/theatre-games/games/', '/theatre-games/competencies/', '/theatre-games/facilitation/', '/theatre-games/honoring-our-guides/', '/theatre-games/submit/']) {
    await page.goto(path);
    await expect(page).toHaveURL(new RegExp(path.replace(/[/]/g, '\\/') + '$'));
  }
});

test('redirect stub — /theatre-games/finder/ meta-refreshes to /games/', async ({ page }) => {
  await page.goto('/theatre-games/finder/');
  await page.waitForURL(/\/theatre-games\/games\//, { timeout: 3000 });
});

test('redirect stub — old slug URL meta-refreshes to /games/<slug>/', async ({ page }) => {
  await page.goto('/theatre-games/mirrors/');
  await page.waitForURL(/\/theatre-games\/games\/mirrors\//, { timeout: 3000 });
});

test('facilitation/rock-solid renders reusable blocks + interactive checklist', async ({ page }) => {
  await page.goto('/theatre-games/facilitation/rock-solid/');
  await expect(page.getByText(/Recommendation 1/)).toBeVisible();
  const checkbox = page.locator('[data-rock-solid-checklist] input[type="checkbox"]').first();
  await checkbox.check();
  await expect(page.locator('[data-rock-solid-count]')).toHaveText(/1/);
});

test('IconBar mounts 7 icons on a competency page', async ({ page }) => {
  await page.goto('/theatre-games/competencies/physical-expression/');
  await expect(page.locator('.theatre-games-icon-bar > span')).toHaveCount(7);
});

test('Honoring page renders Spolin table', async ({ page }) => {
  await page.goto('/theatre-games/honoring-our-guides/');
  await expect(page.getByText(/Viola Spolin/)).toBeVisible();
  await expect(page.locator('#spolin-attributions')).toBeVisible();
});
```

And 3 axe scans (find the axe helper and add):

```ts
test('axe: Theatre Games Index page', async ({ page }) => {
  await page.goto('/theatre-games/games/');
  await checkA11y(page);
});
test('axe: Physical Expression competency page', async ({ page }) => {
  await page.goto('/theatre-games/competencies/physical-expression/');
  await checkA11y(page);
});
test('axe: Honoring Our Guides', async ({ page }) => {
  await page.goto('/theatre-games/honoring-our-guides/');
  await checkA11y(page);
});
```

- [ ] **Step 3: Run + verify + commit**

Run: `pnpm test:e2e 2>&1 | tail -20` — expected: all new checkpoints PASS; existing checkpoints unbroken.

If a checkpoint fails: fix the underlying code (do NOT weaken the assertion).

```bash
git add tests/e2e/smoke.spec.ts tests/unit/theatre-games-concept-refs.test.ts
git commit -m "$(cat <<'EOF'
test(cycle-14a): Playwright smoke + axe scans + concept-refs (T22)

- 8 new Playwright smoke checkpoints: Index filter behavior, game
  detail print CSS, sub-nav traversal, 2 redirect stubs, Rock Solid
  interactive checklist, IconBar 7-icon presence, Honoring Spolin
  table.
- 3 new axe scans: Index, Physical Expression competency, Honoring.
- Unit test asserts every <Concept id="…"> ref on Theatre Games
  pages resolves against the concepts collection.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 23: CLAUDE.md conventions block

**Files:**
- Modify: `CLAUDE.md` — append Cycle 14a conventions

**Interfaces produced:** future contributors + Claude sessions have the Cycle 14a conventions documented in-repo.

**Interfaces consumed:** all prior tasks.

- [ ] **Step 1: Append Cycle 14a conventions**

Add to CLAUDE.md, patterned on the Cycle 12 / 13 blocks already present:

```markdown
**Theatre Games sub-nav** (`src/lib/theatre-games-nav.ts`) drives the persistent
sub-nav rendered by `src/layouts/TheatreGamesLayout.astro` on every
`/theatre-games/*` page. 6 items in spec §2 order: Overview / Index /
Competencies / Facilitation / Honoring Our Guides / Submit.

**Adding a Theatre Game (manual).** Drop `src/content/games/<slug>.mdx` with
the schema in `src/lib/content-schemas.ts`. Body H2s: `## Intent` /
`## Technique` / `## Evaluation` (optional `## Variations` / `## Notes`).
Set `sample: true` for placeholders; `false` for real client content.
Populate `sourceDoc` when the game came from Drive corpus (for parse-report
traceability); `spolinPage` (integer) when `source` starts with "Adapted
from Viola Spolin, …" — a Vitest guardrail asserts the invariant.

**Adding a Theatre Game (via extractor).** Export a Drive corpus doc as
`.md` → drop under `content-source/theatre-games/` (git-ignored) →
`pnpm extract:theatre-games` → hand-clean `.mdx.new` files → review the
parse report at `docs/build-reports/theatre-games-parse-<date>.md` →
commit. `--force` flag overwrites existing MDXs.

**7-icon bar rule.** `src/components/games/IconBar.astro` renders the 7
DT:FC icons at the top of every competency page + every game detail page.
Icon-to-PRC-concept resolution lives in `src/components/games/icon-bar-map.ts`
as `ICON_BAR` — never hardcode concept slugs in the component. Adding
a new icon: append to `ICON_BAR`; a Vitest test asserts every
`conceptSlug` resolves against the concepts collection.

**Competency pages.** Live under `/theatre-games/competencies/[competency]/[subset?]`.
Component: `src/components/games/CompetencyPage.astro` — takes props for
definition / intent / reasonsResults / who / preparation / followups /
optional epigraph. Definition + prose come from the corpus doc for that
competency (per spec §5 last paragraph); inline `<Concept id="…" />` refs
pull short-def from PRC — no forked text. Continuous Assessment block
is always on via `<ContinuousAssessmentBlock />`.

**gameHref helper** (`src/lib/game-href.ts`) is the canonical source of
truth for a game entry's detail URL — returns `/theatre-games/games/<slug>/`.
Always import; never hardcode.

**Route restructure — redirect stubs (Cycle 14a).** Old URLs
`/theatre-games/finder/`, `/theatre-games/<slug>/` (top-level),
`/theatre-games/how-to/rock-solid-recommendations/` are meta-refresh
redirect stubs pointing to their Cycle 14a homes. Same pattern as
Cycle 13 script/module renames.

**Rock Solid Recommendations data model.** `src/data/rock-solid-recommendations.ts`
exports `ROCK_SOLID_RECOMMENDATIONS: RockSolidRecord[]` where
`RockSolidRecord = { slug, title, body, tags? }`. `body` is plain text
split on double-newline into paragraphs on render. Reusable in
newsletter/popup surfaces later. If a recommendation grows structured
sub-parts (numbered list, headed sub-blocks) beyond what plain
paragraphs carry, escalate that entry to a per-recommendation MDX
file under `src/content/rock-solid/` (new sub-collection, added only
when required).

**Silverstein rule.** No `silverstein` references (case-insensitive) in
built output. Advisory in Cycle 14a via `pnpm check:silverstein`;
promoted to a `pnpm build` gate in Cycle 14b once Vocal Articulation
corpus (which references Silverstein rhymes in the Drive source) is
migrated and every occurrence has been replaced with a pointer to
`/childrens-theatre/warm-up-poems/`.

**Cycle 14a stripping registry additions** (10 patterns) in
`scripts/check-prohibited-text.mjs`: `(Desirae: Your input next)`,
`DESIRAE –` (en-dash + space), `TEAM QUESTION`, `Tab 1`, `ANY OTHERS?`,
`WEB 2.0?` (title prefix with trailing `?`), `(Link to Folder)`,
`***NOTE: THIS IS NOT APPROPRIATE`, `Building a Firm Foundation`
(rejected Rock Solid alt name), and line-anchored regex `/^#\d+\s/`
for `#N` title prefixes.

**Parse extractor advisory.** `pnpm extract:theatre-games` runs the
Drive-corpus → MDX pipeline. Manual invocation only — NEVER wired into
`pnpm build`. Regeneration writes `<slug>.mdx.new` beside existing
files unless `--force` is passed. Validation report at
`docs/build-reports/theatre-games-parse-<date>.md` — commit it for
client review.
```

- [ ] **Step 2: Verify + commit**

```bash
pnpm check:prohibited
```

Expected: clean.

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs(cycle-14a): CLAUDE.md conventions for Theatre Games flagship (T23)

Sub-nav order, adding a game (manual + extractor), 7-icon bar rule,
competency-page architecture, gameHref helper, redirect stubs,
Rock Solid data model, Silverstein rule, §7 stripping-registry
additions, parse extractor advisory.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 24: Client-review bundle

**Files:**
- Create: `docs/client-reviews/2026-08-14-cycle14a-theatre-games-review.md`

**Interfaces produced:** 14-item review bundle documenting every deferred client decision + soft-shipped default.

**Interfaces consumed:** review-bundle table in the spec §5.

- [ ] **Step 1: Author the bundle**

Follow the Cycle 13 review-bundle format (`docs/client-reviews/2026-08-14-cycle13-childrens-theatre-review.md`). Structure: intro paragraph, per-item block with heading + context + what shipped + what we need from client + link to relevant page.

Cover all 14 items from spec §5:

1. Submission governance (Lola's TEAM QUESTION) — link `/theatre-games/submit/`
2. Story Making vs. Storytelling naming — link `/theatre-games/competencies/vocal-expression/`
3. Resilience internal header fix — link `/theatre-games/competencies/resilience/`
4. Rhythm duplicate resolution (14b) — no live page
5. Vocal landing-question mapping — link `/theatre-games/competencies/vocal-expression/`
6. CA subsets in landing copy — link `/theatre-games/`
7. OLD-guide favorites harvest — link `/theatre-games/facilitation/warmup/`
8. Chuck Jabberwocky video/audio — link `/theatre-games/games/jabberwocky/`
9. Workshop Manual text (standing blocker) — link `/legacy/essays/workshop-manual/`
10. Rock Solid Recommendations naming — link `/theatre-games/facilitation/rock-solid/`
11. Landing "For Teaching" orphan bullet mend — link `/theatre-games/`
12. Missing PRC entries as draft:true stubs — link both entry pages
13. Warmup PRC entry status — link if new
14. Corpus honest game count — link `/theatre-games/games/`

- [ ] **Step 2: Verify + commit**

```bash
git add docs/client-reviews/2026-08-14-cycle14a-theatre-games-review.md
git commit -m "$(cat <<'EOF'
docs(cycle-14a): 14-item client-review bundle (T24)

Every soft-shipped default + deferred client decision from the
Cycle 14a design + implementation captured in one review doc,
patterned on the Cycle 13 bundle. Ready to send to Lola / Desirae /
Cherie / Steve for the open decisions.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 25: Add-a-game README

**Files:**
- Create: `docs/adding-a-theatre-game.md`

**Interfaces produced:** contributor-facing README explains both manual + extractor game-adding flows (satisfies spec §4 item 5).

- [ ] **Step 1: Author the README**

```markdown
# Adding a Theatre Game

Two paths, depending on whether the game comes from a Drive corpus doc
or you&rsquo;re authoring it fresh.

## Path A — Author manually

1. Pick a **slug** — kebab-case, lowercase, no punctuation. E.g. `walking-across-ice`.
2. Create `src/content/games/<slug>.mdx` with this frontmatter:

   ```yaml
   ---
   name: 'Walking Across Ice'
   competency: 'physical-expression'   # one of the 5
   subset: 'Movement'                  # optional; must match COMPETENCY_SUBSETS
   structure: 'group'                  # 'individual' | 'group'
   cohesion: 'low'                     # 'low' | 'medium' | 'high'
   intent: 'Loosen habitual gaits; wake the ankles and hips to intention.'
   source: 'Adapted from Viola Spolin, Improvisation for the Theater, p. 132.'  # optional
   spolinPage: 132                     # optional; REQUIRED if source starts with "Adapted from Viola Spolin"
   sourceDoc: 'Website TG #1 Physical Expression - MOVEMENT'   # optional; corpus doc name for parse-report traceability
   variations: false                   # optional; set true when body has a ## Variations section
   sample: false                       # true if placeholder content
   ---
   ```
3. Write the body with three H2s (optional fourth for Variations):

   ```md
   ## Intent

   <expanded prose if the frontmatter intent is a headline; else short lead>

   ## Technique

   1. Players stand at one end of the room.
   2. Facilitator narrates a walk across ice; Players cross without slipping.
   3. Vary surface: mud, sand, gravel.

   ## Evaluation

   - What did your body notice?
   - Where did the weight go?

   ## Variations

   - For seniors: seated version, hands on knees.
   - For blind Players: partner with a sound source at the destination.
   ```
4. Run `pnpm check` and `pnpm test` to confirm schema + guardrails pass.
5. Commit.

## Path B — Bulk-import from a Drive corpus doc

1. Export the Drive doc as `.md` (Google Docs → File → Download → Markdown, OR use the Drive MCP `read_file_content` and hand-write to disk).
2. Drop the `.md` under `content-source/theatre-games/<filename>.md`. The folder is git-ignored.
3. Run `pnpm extract:theatre-games`.
4. The extractor writes `src/content/games/<slug>.mdx` for new games, or `<slug>.mdx.new` beside existing files. **Never** clobbers unless `--force` is passed.
5. Open `docs/build-reports/theatre-games-parse-<date>.md`. Fix any `⚠` warnings by hand-editing the affected MDX. Reconcile duplicate slugs by renaming or merging.
6. `mv` each `.mdx.new` file into place after review.
7. Run `pnpm check && pnpm test && pnpm build`.
8. Commit MDXs + the parse report.

## Frontmatter reference

See `src/lib/content-schemas.ts` `gameSchema` for the authoritative schema.
The Vitest suite (`tests/unit/spolin-attribution.test.ts`, `tests/unit/competency-subsets.test.ts`) enforces cross-cutting invariants.

## Where games appear

- Auto-listed in `/theatre-games/games/` (the Index) filtered by frontmatter facets.
- Auto-listed on `/theatre-games/competencies/<competency>/[subset?]/` via `<GameListForCompetency />`.
- Detail page at `/theatre-games/games/<slug>/`.
- Legacy URL `/theatre-games/<slug>/` redirects (meta-refresh) to the new detail URL for inbound-link continuity.
```

- [ ] **Step 2: Verify + commit**

```bash
git add docs/adding-a-theatre-game.md
git commit -m "$(cat <<'EOF'
docs(cycle-14a): add-a-theatre-game README (T25)

Contributor-facing walkthrough for both manual MDX authoring and
Drive-corpus bulk-import via pnpm extract:theatre-games. Satisfies
spec §4 item 5 (admin-path documentation requirement).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 26: Final-review pass — self-audit, memory update, merge readiness

**Files:**
- Modify: memory files (`~/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md`, `project_dtfc_followups.md`)

**Interfaces produced:** cycle audit complete; branch ready to merge to `main` via `git merge --no-ff`.

**Interfaces consumed:** all prior tasks.

- [ ] **Step 1: Full-suite verification**

Run in sequence:
```bash
pnpm check              # 0 errors, 0 warnings, pre-existing hints acceptable
pnpm test               # all PASS
pnpm check:prohibited   # clean
pnpm build              # clean; parse report + Spolin table + IconBar all resolve
pnpm check:silverstein  # 0 hits (advisory)
pnpm test:e2e           # all Playwright PASS including new checkpoints; axe scans pass
```

Any failure → fix in a new commit before proceeding.

- [ ] **Step 2: Route audit**

```bash
find dist -name 'index.html' | grep theatre-games | sort
```

Expected: at least these paths present:
- `/theatre-games/index.html`
- `/theatre-games/games/index.html`
- `/theatre-games/games/<N slugs>/index.html`
- `/theatre-games/competencies/index.html` + 4 populated + 8 subset placeholders + CA landing
- `/theatre-games/facilitation/index.html` + orientation + how-to + warmup + rock-solid
- `/theatre-games/honoring-our-guides/index.html`
- `/theatre-games/submit/index.html`
- `/theatre-games/finder/index.html` (redirect stub — page emits with meta-refresh)
- Legacy `/theatre-games/<slug>/index.html` (redirect stubs)
- `/theatre-games/how-to/rock-solid-recommendations/index.html` (redirect stub)

- [ ] **Step 3: Grep audits**

```bash
grep -r "Silverstein" src/ 2>/dev/null                    # expected: 0 hits
grep -r "Building a Firm Foundation" src/ 2>/dev/null     # expected: 0 hits (guardrail catches this too)
grep -r "TEAM QUESTION" src/ 2>/dev/null                  # expected: 0 hits
grep -r "Storytelling" src/lib/types.ts                   # expected: 0 hits (Story Making now canonical)
grep -rE "^#\d+\s" src/content/games/ src/pages/theatre-games/ | head  # expected: 0 hits
```

Any hit → fix.

- [ ] **Step 4: Spec coverage self-check**

Open `/Users/cnote/projects/dtfc/docs/superpowers/specs/2026-08-14-dtfc-cycle14a-theatre-games-flagship-design.md`. Walk each §8 acceptance-criteria row. Confirm every 14a-column entry maps to a completed task above.

Any gap → new commit before merge.

- [ ] **Step 5: Update memory**

Edit `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md`:
- Append Cycle 14a summary paragraph matching the Cycle 12/13 shape.
- Update "How to apply" — Cycle 14a shipped; Cycle 14b (corpus completion + Silverstein blocking + game-count reconciliation) is next.

Edit `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_followups.md`:
- Add the 14 review-bundle items as deferrals (already tracked in the bundle doc; memory adds a pointer).
- Note the deferred parse-extractor tuning (any warnings shipped in the parse report that weren't hand-cleaned).

- [ ] **Step 6: Prepare merge**

Do NOT merge yourself. Report to the human collaborator:

- Branch `cycle-14a-theatre-games-flagship` ready; N commits ahead of `main`.
- Tests + build all green.
- Client-review bundle at `docs/client-reviews/2026-08-14-cycle14a-theatre-games-review.md`.
- Parse report at `docs/build-reports/theatre-games-parse-2026-08-14.md`.
- Merge command when authorized:
  ```bash
  git checkout main
  git merge --no-ff cycle-14a-theatre-games-flagship -m "Cycle 14a: Theatre Games Flagship Buildout"
  ```
- Push instruction:
  ```bash
  git push origin main
  ```

Do NOT commit or push without explicit approval.

---
