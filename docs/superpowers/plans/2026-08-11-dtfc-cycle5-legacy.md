# DT:FC Cycle 5 — Legacy Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the DT:FC Legacy section per source spec §4.5 — landing rebuild, one-page history + research abstract, Founders profile grid, interactive Timeline (chip-filtered decade grouping from `6 Grand Timeline.xlsx` → JSON), Essays library (5 essays including a Workshop Manual TEXT MISSING placeholder), and Legacy-scoped Honoring Our Guides. Cycle 5 also folds in a cross-cycle infrastructure investment: extend `scripts/check-prohibited-text.mjs` with a curly-apostrophe guardrail so Cycles 5-7 catch the class of defect that hit Cycle 4 in 5 fix rounds.

**Architecture:** Three data sources — `essays` MDX collection, `FOUNDERS` structured data file, `timeline.json` JSON driven by a validating loader (`src/lib/timeline.ts` with `parseYear` + `groupByDecade` helpers). Timeline chip-filter uses inline JS + URL serialization (mirrors Cycle 3 themes + Cycle 4 series pattern; no Preact island). New `LegacyLayout.astro` follows the ChildrensLayout/ShakespeareLayout template with a 5-item sub-nav. Five new Legacy-scoped components under `src/components/legacy/`. Seed content pulled from client's Google Drive via MCP at implementation time; placeholder-stub fallback if unavailable.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@theme` tokens), TypeScript strict, Zod (via `astro/zod` re-export), MDX for essay bodies, `xlsx` npm package for the timeline import (added as devDep in Task 4), Vitest, Playwright.

## Global Constraints

- **Branch:** all work on `cycle-5-legacy`. Merge to `main` at cycle end uses `git merge --no-ff`.
- **Package manager:** `pnpm` only. Commands: `pnpm dev`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm check:concepts`, `pnpm check:prohibited`.
- **Node module type:** `"type": "module"` — ESM everywhere.
- **No hex codes in components** — colors come from tokens in `src/styles/tokens.css`. Task 9 adds 6 new timeline organization color tokens.
- **Vocabulary:** "Players" (never "actors"), "Facilitator" (never "leader"), "Players Resource Center" (full), "Children's Theatre" (curly apostrophe).
- **CURLY APOSTROPHES IN ALL PROSE — enforced by `check:prohibited` after Task 1.** Once Task 1 ships, `pnpm build` fails on any straight U+0027 in prose contexts inside `.astro` / `.mdx` / `.md` files (JS syntax, YAML delimiters, import strings all exempt; Cycle 3 Shakespeare verse files whitelisted). This means per-task prompts do NOT need manual grep-verify steps for apostrophes from Task 2 onward — the build failure is the check.
- **Prohibited landing/site copy** (unchanged from Cycle 4): `Great Change`, `traditional work and ways`, `THIS (crazy) time`, `RESILIENCEl`, `Childrens' Theatre` (wrong-apostrophe variant).
- **CLIENT REVIEW markers:** any drafted prose not verbatim from Drive source docs gets `{/* CLIENT REVIEW: reason */}` in `.astro` or `<!-- CLIENT REVIEW: reason -->` in `.mdx` above the drafted block.
- **Sample-content flag:** any content not real client-authored gets `sample: true` in its frontmatter. Templates render a "Sample — pending final import" chip.
- **Commit granularity:** one commit per task. Commit messages authored `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` via HEREDOC.
- **Landing anchor preservation:** both Cycle 2 anchors `#colorado-caravan` and `#founders` on `/legacy/` MUST be preserved (`IDEA_TWO_ANSWERS` in `src/data/landing.ts` references them).
- **Section identity:** every `/legacy/*` page uses `<LegacyLayout>` (Task 3) which passes `section="legacy"` to the base primary nav so the "Legacy" nav item marks current.
- **Static imagery:** `/public/images/legacy/founders/<slug>.<ext>` (ASCII kebab-case; mirrors Cycle 4 imagery convention).
- **Three client-blocker soft-ships** — these ship visibly rather than deferred:
  1. Timeline canonical version (spec §8 item 3): pre-release chip on `/legacy/timeline/` + CLIENT REVIEW comment.
  2. Workshop Manual TEXT MISSING (spec §8 item 2): essay entry with `sample: true` and "text pending" body.
  3. Judith Bock unconfirmed (spec §4.5 item 4): founder card with `unconfirmed: true` renders an "unconfirmed" chip.

---

## File Map

**Create:**
- `src/lib/legacy-nav.ts`
- `src/lib/timeline.ts` (loader + `parseYear` + `groupByDecade`)
- `src/data/founders.ts`
- `src/data/timeline.json` (placeholder or Drive-imported)
- `src/layouts/LegacyLayout.astro`
- `src/components/legacy/Timeline.astro`
- `src/components/legacy/TimelineLegend.astro`
- `src/components/legacy/FounderCard.astro`
- `src/components/legacy/EssayCard.astro`
- `src/components/legacy/EssayDetail.astro`
- `src/content/essays/towards-a-poor-caravan.mdx`
- `src/content/essays/theatre-influences.mdx`
- `src/content/essays/developmental-drama.mdx`
- `src/content/essays/why-these-plays-are-successful.mdx`
- `src/content/essays/workshop-manual.mdx` (sample: true, TEXT MISSING placeholder)
- `public/images/legacy/founders/` (directory; populated by Drive import)
- `src/pages/legacy/history.astro`
- `src/pages/legacy/founders.astro`
- `src/pages/legacy/timeline.astro`
- `src/pages/legacy/honoring-our-guides.astro`
- `src/pages/legacy/essays/index.astro`
- `src/pages/legacy/essays/[slug].astro`
- `tests/unit/apostrophe-guardrail.test.ts`
- `tests/unit/timeline.test.ts`
- `tests/unit/founders.test.ts`
- `tests/unit/legacy.test.ts`
- `docs/superpowers/plans/2026-08-11-dtfc-cycle5-legacy.md` (this file)

**Modify:**
- `scripts/check-prohibited-text.mjs` — add curly-apostrophe pattern + Shakespeare verse whitelist.
- `src/lib/content-schemas.ts` — add `TIMELINE_ORGS`, `timelineEventSchema`, `timelineSchema`, `essaysSchema`.
- `src/content.config.ts` — register `essays` collection.
- `src/pages/legacy/index.astro` — rewrite landing.
- `src/styles/tokens.css` — add 6 timeline organization color tokens.
- `tests/e2e/smoke.spec.ts` — extend for Legacy routes.
- `CLAUDE.md` — collections/data, LEGACY_NAV, timeline conventions, guardrail behavior + whitelist, "Adding an essay/founder/timeline event".

**Auto-memory updates (end of cycle):** `project_dtfc_cycles.md`, `project_dtfc_followups.md`.

---

## Special Task: Drive Import Coordination

**Task 4 (Drive MCP import) requires the client's Google Drive folder link.** Before dispatching Task 4's implementer, the controller must ask the human partner:

> "Do you have the Google Drive folder link for the Legacy source content (5 essay source docs — Towards a Poor Caravan, Theatre Influences, Developmental Drama, Why These Plays Are Successful, and Workshop Manual if it exists; the '10 Research Abstract for CU Theatre Department' source doc for the history page; Legacy-scoped Honoring Our Guides source doc; '6 Grand Timeline.xlsx'; and any founder headshots)? Same folder as Cycles 3-4 works — I'll enumerate the Legacy-relevant subfolders. Otherwise I'll skip the import and Cycle 5 ships with placeholder stubs — real content lands in a follow-up cycle."

If the user provides the link, Task 4 proceeds. If not, Task 4 is skipped (mark deferred; proceed to Task 5 with placeholders in place). All downstream tasks work with either real or placeholder content.

---

## Task 1: Extend `check-prohibited-text.mjs` with curly-apostrophe guardrail

**Files:**
- Modify: `scripts/check-prohibited-text.mjs`
- Create: `tests/unit/apostrophe-guardrail.test.ts`

**Interfaces produced:**
- The script's `findViolations(text, file)` gains a new class of violation for prose-context straight apostrophes. Callers unchanged.
- New named export: `CURLY_APOSTROPHE_ALLOWLIST` (array of file paths exempt from the check — Cycle 3 Shakespeare verse files).
- New named export: `findStraightApostropheInProse(text, file)` — pure function for direct Vitest testing.

**Whitelist:** Cycle 3 Shakespeare verse files use straight apostrophes for Elizabethan contractions (`'tis`, `'twere`, `Environ'd`, `perfect'st`) — this is standard modernized-Shakespeare editorial practice per Cycle 3 T2 discipline. Do not flag them.

- [ ] **Step 1: Write the failing test at `tests/unit/apostrophe-guardrail.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { findStraightApostropheInProse, CURLY_APOSTROPHE_ALLOWLIST } from '../../scripts/check-prohibited-text.mjs';

describe('curly-apostrophe guardrail', () => {
  it('flags a straight apostrophe in prose', () => {
    const src = `<p>Aesop's Fables are wonderful.</p>\n`;
    const hits = findStraightApostropheInProse(src, 'src/pages/legacy/example.astro');
    expect(hits).toHaveLength(1);
    expect(hits[0].line).toBe(1);
    expect(hits[0].col).toBeGreaterThan(0);
  });

  it('does NOT flag a straight apostrophe in a JS import string', () => {
    const src = `import Foo from '@/components/legacy/Foo.astro';\n`;
    const hits = findStraightApostropheInProse(src, 'src/pages/legacy/example.astro');
    expect(hits).toHaveLength(0);
  });

  it('does NOT flag getCollection() calls', () => {
    const src = `const entries = await getCollection('essays');\n`;
    const hits = findStraightApostropheInProse(src, 'src/pages/legacy/example.astro');
    expect(hits).toHaveLength(0);
  });

  it('does NOT flag a whitelisted Cycle 3 Shakespeare verse file', () => {
    const src = `<p>Environ'd with a wilderness of sea.</p>\n`;
    for (const path of CURLY_APOSTROPHE_ALLOWLIST) {
      const hits = findStraightApostropheInProse(src, path);
      expect(hits, `whitelisted path ${path} should return no hits`).toHaveLength(0);
    }
    // Sanity: same string in a non-whitelisted file IS flagged.
    const hits = findStraightApostropheInProse(src, 'src/content/essays/other.mdx');
    expect(hits).toHaveLength(1);
  });

  it('reports line and column accurately for a multi-line file', () => {
    const src = `<p>line one</p>\n<p>Line two with Aesop's fable.</p>\n<p>line three</p>\n`;
    const hits = findStraightApostropheInProse(src, 'src/pages/legacy/example.astro');
    expect(hits).toHaveLength(1);
    expect(hits[0].line).toBe(2);
  });

  it('flags an apostrophe used as possessive (Shakespeare’s) in editorial prose', () => {
    const src = `<p>Shakespeare's plays are still on stage.</p>\n`;
    const hits = findStraightApostropheInProse(src, 'src/content/essays/legacy-essay.mdx');
    expect(hits).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL (function not exported yet)**

```bash
pnpm test tests/unit/apostrophe-guardrail.test.ts
```

Expected: FAIL — `findStraightApostropheInProse` not exported from the script.

- [ ] **Step 3: Modify `scripts/check-prohibited-text.mjs`**

Add these exports and integrate into the existing `findViolations` flow. Read the existing file first, then apply the additions below.

Add after the existing `PATTERNS` array (near the top of the file):

```javascript
/**
 * Cycle 3 Shakespeare verse files intentionally use straight apostrophes
 * for Elizabethan contractions ('tis, 'twere, Environ'd, perfect'st) per
 * Cycle 3 T2 discipline. Do not flag them.
 */
export const CURLY_APOSTROPHE_ALLOWLIST = [
  'src/content/scripts/juliet-romeo-and-juliet-act-iv-scene-iii.mdx',
  'src/content/scripts/lady-macbeth-macbeth-act-i-scene-v.mdx',
  'src/content/scripts/mechanicals-scenes-a-midsummer-nights-dream.mdx',
];

/**
 * Scan `text` for straight U+0027 apostrophes appearing in prose contexts
 * (surrounded by word characters). Skips imports, getCollection() calls,
 * and files in CURLY_APOSTROPHE_ALLOWLIST.
 * Returns [] when clean.
 */
export function findStraightApostropheInProse(text, file) {
  if (CURLY_APOSTROPHE_ALLOWLIST.includes(file)) return [];
  const pattern = /(?<=\w)'(?=\w)/g;
  const hits = [];
  let m;
  while ((m = pattern.exec(text)) !== null) {
    const lineStart = text.lastIndexOf('\n', m.index - 1) + 1;
    const lineEnd = text.indexOf('\n', m.index);
    const line = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
    // Skip JS-syntax lines that legitimately contain a straight apostrophe.
    if (/^\s*import\s/.test(line)) continue;
    if (/getCollection\(/.test(line)) continue;
    // Skip YAML frontmatter list bullet lines like "  - { name: O'Brien }" — treat any line
    // starting with whitespace + a hyphen or with an inline object literal as YAML.
    if (/^\s*-\s/.test(line)) continue;
    const before = text.slice(0, m.index);
    const lineNumber = before.split('\n').length;
    const col = m.index - lineStart + 1;
    hits.push({
      file,
      line: lineNumber,
      col,
      phrase: `straight apostrophe in prose (${line.slice(Math.max(0, col - 12), col + 12).trim()})`,
      reason: 'Use U+2019 (’) or &rsquo; per project vocabulary rule',
    });
  }
  return hits;
}
```

Modify `findViolations` — after the existing `for (const { phrase, regex, reason } of PATTERNS)` loop, append the apostrophe hits:

```javascript
export function findViolations(text, file) {
  const hits = [];
  for (const { phrase, regex, reason } of PATTERNS) {
    // ...existing logic unchanged...
  }
  hits.push(...findStraightApostropheInProse(text, file));
  return hits;
}
```

Modify the file-glob pattern in `main()` to include `.astro`, `.mdx`, `.md` under `src/`:

The existing patterns array (near `const patterns = [...]`) already includes `.astro`, `.mdx`, `.md` per Cycle 2's T2. Verify it does; if not, add them. The `ignore` list should include `docs/**` (already does) so this design/plan document doesn't trigger the guardrail on its own examples.

- [ ] **Step 4: Run the Vitest fixture — expect PASS**

```bash
pnpm test tests/unit/apostrophe-guardrail.test.ts
```

Expected: 6 tests pass.

- [ ] **Step 5: Run the script directly against the repo — expect clean**

```bash
node scripts/check-prohibited-text.mjs
```

Expected: `✓ Checked N file(s) for prohibited text; all clean.`

If any straight-apostrophe hits surface, they're pre-existing defects in shipped Cycle 3/4 content. Investigate — expected outcome is 0 (Cycle 4 fix-rounds cleaned all prose apostrophes; Cycle 3 Shakespeare verse is whitelisted).

If hits DO surface unexpectedly, STOP and report BLOCKED with the file list so the controller decides whether to whitelist or fix.

- [ ] **Step 6: Run `pnpm build` — expect clean**

```bash
pnpm build
```

Expected: succeeds. Both `check:concepts` and `check:prohibited` print `✓`.

- [ ] **Step 7: Commit**

```bash
git add scripts/check-prohibited-text.mjs tests/unit/apostrophe-guardrail.test.ts
git commit -m "$(cat <<'EOF'
feat(guardrail): detect straight apostrophes in prose in check:prohibited

Extends scripts/check-prohibited-text.mjs to catch U+0027 apostrophes
between word characters across .astro / .mdx / .md files. Skips JS
imports, getCollection() calls, and YAML list bullets. Whitelists the
three Cycle 3 Shakespeare verse files (juliet, lady-macbeth, mechanicals)
where straight apostrophes are standard modernized editorial practice
for Elizabethan contractions.

Cycle 4 hit 5 apostrophe fix-rounds; this guardrail catches the same
class of defect at commit time. Cycles 5-7 get it for free.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Extend content schemas + register essays collection + placeholder essays

**Files:**
- Modify: `src/lib/content-schemas.ts` — add `TIMELINE_ORGS`, `timelineEventSchema`, `timelineSchema`, `essaysSchema`.
- Modify: `src/content.config.ts` — register `essays`.
- Create: `src/content/essays/towards-a-poor-caravan.mdx`
- Create: `src/content/essays/theatre-influences.mdx`
- Create: `src/content/essays/developmental-drama.mdx`
- Create: `src/content/essays/why-these-plays-are-successful.mdx`
- Create: `src/content/essays/workshop-manual.mdx`
- Create: `tests/unit/legacy.test.ts` — essay collection assertions.

**Interfaces produced:**
- `TIMELINE_ORGS = ['ALL', 'CC', 'C&C', 'CSF', 'TEF', 'OSC'] as const`
- `timelineEventSchema` — Zod object with `date, event, participants?, presentation?, additionalInfo?, organization ∈ TIMELINE_ORGS`
- `timelineSchema` — `z.array(timelineEventSchema)`
- `essaysSchema` — Zod object with `title, author, year?, publishedIn?, excerpt (max 200), sample`
- 5 placeholder essay MDX files, all with `sample: true`.

- [ ] **Step 1: Write failing test `tests/unit/legacy.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('essays collection', () => {
  it('has all 5 spec-required essay slugs', async () => {
    const entries = await getCollection('essays');
    const slugs = new Set(entries.map((e) => e.id.replace(/\.mdx?$/, '')));
    for (const s of [
      'towards-a-poor-caravan',
      'theatre-influences',
      'developmental-drama',
      'why-these-plays-are-successful',
      'workshop-manual',
    ]) {
      expect(slugs.has(s), `essays collection missing ${s}`).toBe(true);
    }
  });

  it("workshop-manual is flagged sample: true (TEXT MISSING placeholder per spec §8 item 2)", async () => {
    const entries = await getCollection('essays');
    const wm = entries.find((e) => e.id.replace(/\.mdx?$/, '') === 'workshop-manual');
    expect(wm).toBeDefined();
    expect(wm!.data.sample).toBe(true);
  });

  it('every essay excerpt is at most 200 chars', async () => {
    const entries = await getCollection('essays');
    for (const e of entries) {
      expect(e.data.excerpt.length, `${e.id} excerpt too long`).toBeLessThanOrEqual(200);
    }
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
pnpm test tests/unit/legacy.test.ts
```

Expected: FAIL — collection `essays` unknown (not registered yet).

- [ ] **Step 3: Extend `src/lib/content-schemas.ts`**

Add these exports at the end of the file:

```typescript
export const TIMELINE_ORGS = ['ALL', 'CC', 'C&C', 'CSF', 'TEF', 'OSC'] as const;

export const timelineEventSchema = z.object({
  date: z.string(),
  event: z.string(),
  participants: z.string().optional(),
  presentation: z.string().optional(),
  additionalInfo: z.string().optional(),
  organization: z.enum(TIMELINE_ORGS),
});

export const timelineSchema = z.array(timelineEventSchema);

export const essaysSchema = z.object({
  title: z.string(),
  author: z.string(),
  year: z.number().int().positive().optional(),
  publishedIn: z.string().optional(),
  excerpt: z.string().max(200),
  sample: z.boolean().default(false),
});
```

- [ ] **Step 4: Register `essays` in `src/content.config.ts`**

Locate the `defineCollection` calls. Add:

```typescript
import { essaysSchema } from '@/lib/content-schemas';

const essays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/essays' }),
  schema: essaysSchema,
});
```

Update the final `export const collections = { ... }` to include `essays`.

Also update `tests/unit/_astro-content.ts` (the Vitest shim) to import `essaysSchema` and register it in the shim's collection loader. Follow the pattern established for `scripts` / `askShakespeare` / `colloquial`.

- [ ] **Step 5: Create the 5 placeholder essay MDX files**

Create `src/content/essays/towards-a-poor-caravan.mdx`:

```mdx
---
title: 'Towards a Poor Caravan'
author: 'Chuck Wilcox'
year: 1971
publishedIn: 'Colorado Caravan report, 1971'
excerpt: 'The founding manifesto of the Colorado Caravan. Placeholder — real essay text arrives with the Drive import.'
sample: true
---

## About this essay

Placeholder stub. Real archival framing arrives with the Drive import.

## Full text

Placeholder text. The essay body imports from Drive at Task 4.
```

Create `src/content/essays/theatre-influences.mdx`:

```mdx
---
title: 'Theatre Influences during the Invention of the Colorado Caravan'
author: 'Lola Wilcox'
excerpt: 'The theatrical currents Lola drew from while inventing the Caravan. Placeholder — real text arrives with Drive import.'
sample: true
---

## About this essay

Placeholder stub. Real archival framing arrives with the Drive import.

## Full text

Placeholder text.
```

Create `src/content/essays/developmental-drama.mdx`:

```mdx
---
title: 'Developmental Drama'
author: 'Martin Cobin'
excerpt: 'Martin Cobin’s articulation of the discipline. Placeholder — real text arrives with Drive import.'
sample: true
---

## About this essay

Placeholder stub.

## Full text

Placeholder text.
```

Create `src/content/essays/why-these-plays-are-successful.mdx`:

```mdx
---
title: 'Why These Plays Are Successful'
author: 'Chuck &amp; Lola Wilcox'
excerpt: 'The Wilcoxes on what makes DT:FC children’s plays land. Placeholder — real text arrives with Drive import.'
sample: true
---

## About this essay

Placeholder stub.

## Full text

Placeholder text.
```

Create `src/content/essays/workshop-manual.mdx`:

```mdx
---
title: 'Workshop Manual'
author: 'Laurie O’Brien'
excerpt: 'The DT:FC facilitation manual. Text pending — flagged TEXT MISSING per source spec §8 item 2.'
sample: true
---

## About this essay

The Workshop Manual is authored by Laurie O’Brien. The full text is
being finalized for publication on this site.

## Full text

_Text pending._ The Workshop Manual is a shared reference between the
Legacy section and the Theatre Games section; when the text is ready,
this essay will publish here and the corresponding link on the Theatre
Games section will activate.
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
pnpm test tests/unit/legacy.test.ts
```

Expected: all 3 tests pass.

- [ ] **Step 7: Run `pnpm build` — expect clean**

```bash
pnpm build
```

Expected: both prebuild guardrails print `✓` (curly-apostrophe check now includes the new files); build completes.

- [ ] **Step 8: Commit**

```bash
git add src/lib/content-schemas.ts src/content.config.ts tests/unit/_astro-content.ts src/content/essays/ tests/unit/legacy.test.ts
git commit -m "$(cat <<'EOF'
feat(legacy): register essays collection + timeline schema + 5 placeholders

Adds TIMELINE_ORGS enum, timelineEventSchema, timelineSchema, and
essaysSchema to src/lib/content-schemas.ts. Registers essays collection
in content.config.ts + Vitest shim.

Seeds 5 placeholder essay entries (all sample: true): Towards a Poor
Caravan, Theatre Influences, Developmental Drama, Why These Plays Are
Successful, and Workshop Manual (the last carries TEXT MISSING framing
per source spec §8 item 2). Task 4's Drive import replaces or
augments these where source docs exist.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: `LEGACY_NAV` data + `LegacyLayout` wrapper

**Files:**
- Create: `src/lib/legacy-nav.ts`
- Create: `src/layouts/LegacyLayout.astro`

**Interfaces produced:**
- `LEGACY_NAV: LegacyNavItem[]` — 5 items.
- `<LegacyLayout title description? eyebrow? subPage?>` — wraps `SectionLayout` with a persistent sub-nav row. Mirror of Cycle 4's `ChildrensLayout`.

- [ ] **Step 1: Create `src/lib/legacy-nav.ts`**

```typescript
export interface LegacyNavItem {
  key: string;
  label: string;
  href: string;
}

export const LEGACY_NAV: LegacyNavItem[] = [
  { key: 'history', label: 'History', href: '/legacy/history/' },
  { key: 'founders', label: 'Founders', href: '/legacy/founders/' },
  { key: 'timeline', label: 'Timeline', href: '/legacy/timeline/' },
  { key: 'essays', label: 'Essays', href: '/legacy/essays/' },
  { key: 'honoring-our-guides', label: 'Honoring Our Guides', href: '/legacy/honoring-our-guides/' },
];
```

- [ ] **Step 2: Create `src/layouts/LegacyLayout.astro`**

```astro
---
import SectionLayout from './SectionLayout.astro';
import { LEGACY_NAV } from '@/lib/legacy-nav';

interface Props {
  title: string;
  description?: string;
  eyebrow?: string;
  subPage?: string;
}
const { title, description, eyebrow, subPage } = Astro.props;
---

<SectionLayout title={title} description={description} section="legacy" eyebrow={eyebrow}>
  <nav aria-label="Legacy section" class="border-ivory-200 mb-8 border-b pb-3">
    <ul class="flex flex-wrap gap-x-5 gap-y-2">
      {
        LEGACY_NAV.map((item) => (
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

- [ ] **Step 3: `pnpm check`**

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/legacy-nav.ts src/layouts/LegacyLayout.astro
git commit -m "$(cat <<'EOF'
feat(legacy): add LEGACY_NAV + LegacyLayout wrapper

Five sub-nav items drive the persistent nav bar on every /legacy/*
page. Layout wraps SectionLayout, injecting the sub-nav below the
section h1. Mirror of Cycle 4 ChildrensLayout structure.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Drive MCP seed content import (conditional)

**Prerequisite:** the controller must ask the human partner for the Google Drive folder link before dispatching this task's implementer. If no link, skip this task (mark deferred; proceed to Task 5 with placeholders in place).

**If the link is provided, this task runs with the link substituted into Step 2.**

**Files:**
- Replace/augment: `src/content/essays/*.mdx` (real essay content; keep the workshop-manual placeholder as-is since spec §8 item 2 flags text missing).
- Create/populate: `src/data/timeline.json` (converted from `6 Grand Timeline.xlsx`).
- Create/populate: `public/images/legacy/founders/<slug>.<ext>` (headshots if available).
- Stage: `.superpowers/sdd/<workspace>/imports/` — `history.txt`, `honoring-our-guides.txt` for Tasks 12 and 14 to consume.

**Interfaces produced:** same collection interfaces as Task 2, populated with real content (`sample: false` for imported entries; workshop-manual stays `sample: true`).

- [ ] **Step 1: Confirm the Drive folder link is available**

The controller provided the Drive folder URL. If not, reply `BLOCKED — no Drive folder link provided; controller should skip Task 4 per its dispatch contract`.

- [ ] **Step 2: Enumerate the folder via Google Drive MCP**

Google Drive MCP tools live under `mcp__claude_ai_Google_Drive__*`. Discover schemas via ToolSearch (query: `select:mcp__claude_ai_Google_Drive__search_files,mcp__claude_ai_Google_Drive__read_file_content,mcp__claude_ai_Google_Drive__download_file_content,mcp__claude_ai_Google_Drive__list_recent_files`).

Enumerate the Legacy-relevant subfolders / docs. Report the tree structure in your report (paths only, no content quoting per Cycle 3 lesson).

Expected content per spec §4.5 and §7:
- `Towards a Poor Caravan` (Chuck Wilcox, 1971)
- `Theatre Influences during the Invention of the Colorado Caravan` (Lola Wilcox)
- `Developmental Drama` (Martin Cobin)
- `Why These Plays Are Successful` (Chuck & Lola Wilcox)
- `Workshop Manual` (Laurie O'Brien) — spec §8 flags as TEXT MISSING; if it exists in Drive, import it and remove the `sample: true` flag on that essay
- `10 Research Abstract for CU Theatre Department` (drives `/legacy/history/`)
- Legacy Honoring Our Guides source doc (may be part of a shared "Honoring Our Guides" collection or Legacy-specific)
- `6 Grand Timeline.xlsx` (drives the interactive timeline)
- Founder headshots (photos of Richard Knaub, Chuck Wilcox, Lola Wilcox, Martin Cobin, Laurie O'Brien, Cherie Karo Schwartz, Judith Bock, Daniel S.P. Yang, Nils Petersen — any that exist)

- [ ] **Step 3: Install `xlsx` for the timeline conversion**

```bash
pnpm add -D xlsx
```

Expected: `xlsx` added to `devDependencies` in package.json; pnpm-lock.yaml updates.

- [ ] **Step 4: Convert essay docs to MDX**

For each essay doc that exists in Drive:

- Read via `mcp__claude_ai_Google_Drive__read_file_content`.
- Overwrite the corresponding placeholder MDX (or create if missing).
- Frontmatter: `title, author, year?, publishedIn?, excerpt (≤ 200 chars), sample: false` (Workshop Manual stays `sample: true` if the doc is empty / just a header per spec §8).
- Body H2s: `## About this essay` + `## Full text`.
- **Strip editorial markers** per Cycle 3/4 discipline: `DESIRAE:`, `LOLA:`, `CHERIE NOTE:`, `PUA THOUGHTS`, burgundy edits, "for reference only", "TO DO".
- All possessive apostrophes in prose must be curly (`&rsquo;` or U+2019) — the guardrail in Task 1 will fail the build if any straight ones slip through.

- [ ] **Step 5: Stage source text for Tasks 12 and 14**

```bash
mkdir -p /Users/cnote/projects/dtfc/.superpowers/sdd/2026-08-11-dtfc-cycle5-legacy/imports/
```

For each source doc found:
- `10 Research Abstract for CU Theatre Department` → save cleaned text to `imports/history.txt`
- Legacy-scoped Honoring Our Guides source doc → save to `imports/honoring-our-guides.txt`

These files are consumed by Tasks 12 and 14. Live outside git in the SDD workspace.

- [ ] **Step 6: Convert `6 Grand Timeline.xlsx` to `src/data/timeline.json`**

Download the xlsx via `mcp__claude_ai_Google_Drive__download_file_content` to a temp path (e.g. `/tmp/timeline.xlsx`).

Write a small Node script (or use inline Node via `node -e`) that reads the xlsx with `xlsx` package and outputs the JSON array. Example script skeleton:

```javascript
import * as XLSX from 'xlsx';
import { readFileSync, writeFileSync } from 'node:fs';

const wb = XLSX.readFile('/tmp/timeline.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

// Map source columns to our schema.
// Source columns (per spec §4.5): Date / Event / Participants / Presentation / Additional Information
// Also color-coded by organization — the xlsx may encode organization via row fill color OR
// a separate column. Inspect the sheet to determine which.
// If organization is derivable, map it. Otherwise, default every event to 'ALL' and flag
// as a follow-up.
const events = rows.map((r) => ({
  date: String(r.Date || r.date || '').trim(),
  event: String(r.Event || r.event || '').trim(),
  participants: (r.Participants || r.participants || undefined) ? String(r.Participants || r.participants).trim() : undefined,
  presentation: (r.Presentation || r.presentation || undefined) ? String(r.Presentation || r.presentation).trim() : undefined,
  additionalInfo: (r['Additional Information'] || r.additionalInfo || undefined) ? String(r['Additional Information'] || r.additionalInfo).trim() : undefined,
  // Map to TIMELINE_ORGS enum — inspect the xlsx to find the right source signal.
  organization: mapOrganization(r) || 'ALL',
})).filter((e) => e.date && e.event);

function mapOrganization(row) {
  // If the xlsx has an explicit organization column, use it.
  const raw = row.Organization || row.organization || row.Org || '';
  const map = { CC: 'CC', 'C&C': 'C&C', CSF: 'CSF', TEF: 'TEF', OSC: 'OSC', ALL: 'ALL' };
  return map[String(raw).trim().toUpperCase()] || null;
}

writeFileSync('/Users/cnote/projects/dtfc/src/data/timeline.json', JSON.stringify(events, null, 2) + '\n');
console.log(`wrote ${events.length} events`);
```

If the xlsx encodes organization via row fill color rather than a column, the mapping is more involved — inspect the sheet metadata via `XLSX.utils` and consult the color-to-org map from spec §4.5:

| Color | Organization |
|---|---|
| White/neutral | ALL |
| Blue | CC (Colorado Caravan) |
| Violet | C&C (Crown & Clown) |
| Orange | CSF (Colorado Shakespeare Festival) |
| Green | TEF (Theatre of Enchanted Forest / Toadstone) |
| Brown | OSC (Overland Stage Company) |

If the fill color extraction proves complex, ship with all events set to `ALL` and flag as a follow-up — the timeline still renders coherently; the filter just becomes lower-value until organization tagging is added.

- [ ] **Step 7: Download any founder headshots**

For each image found (`.png`, `.jpg`, `.jpeg`, `.webp`), download to `public/images/legacy/founders/<slug>.<ext>` where `<slug>` matches the founder slug (e.g., `richard-knaub`, `chuck-wilcox`). Ensure the directory exists: `mkdir -p public/images/legacy/founders/`. Filenames ASCII kebab-case.

- [ ] **Step 8: Verify + commit**

Run:
```bash
pnpm test tests/unit/legacy.test.ts
pnpm build
```

Expected: both pass. Timeline schema validates the imported JSON on build.

Commit all imported content + the xlsx dev-dep addition:

```bash
git add package.json pnpm-lock.yaml src/content/essays/ src/data/timeline.json public/images/legacy/
git commit -m "$(cat <<'EOF'
feat(legacy): import seed content from client Drive folder

- Essays: replaces or augments the 5 placeholder MDX entries with real
  content from Drive (Workshop Manual stays sample: true per spec §8
  item 2 unless the doc had text).
- Timeline: 6 Grand Timeline.xlsx converted to src/data/timeline.json
  via xlsx (added as devDep). Organization column mapped to TIMELINE_ORGS
  enum; falls back to 'ALL' where source signal is ambiguous.
- Founder headshots: downloaded to /public/images/legacy/founders/ (ASCII
  kebab-case). Cards without a headshot render placeholder circles.
- Source text for Tasks 12 (history) and 14 (Honoring Our Guides) staged
  in .superpowers/sdd/*/imports/.

Editorial markers stripped per Cycle 3/4 discipline. Curly-apostrophe
guardrail (Task 1) verifies at build time.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

**Output rule** (from Cycle 3/4 lesson): do NOT quote imported content in your final reply or report. File paths, counts, and outcomes only.

---

## Task 5: `FOUNDERS` data file

**Files:**
- Create: `src/data/founders.ts`
- Create: `tests/unit/founders.test.ts`

**Interfaces produced:**
- `FOUNDERS: Founder[]` — 9 structured objects. Validated by inline Zod at import.
- `Founder` type export.
- Per-import IIFE that throws on schema drift or duplicate slugs.

- [ ] **Step 1: Write failing test `tests/unit/founders.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { FOUNDERS } from '@/data/founders';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));

describe('FOUNDERS data', () => {
  it('has 9 founders per spec §4.5 item 4', () => {
    expect(FOUNDERS.length).toBe(9);
  });

  it('every founder slug is unique', () => {
    const slugs = FOUNDERS.map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every founder with photoSrc set has a matching file under public/', () => {
    for (const f of FOUNDERS) {
      if (f.photoSrc) {
        const rel = f.photoSrc.startsWith('/') ? f.photoSrc.slice(1) : f.photoSrc;
        expect(
          existsSync(publicDir + rel),
          `${f.photoSrc} referenced by ${f.slug} not found under public/`,
        ).toBe(true);
      }
    }
  });

  it("Judith Bock is flagged unconfirmed per spec §4.5 item 4", () => {
    const bock = FOUNDERS.find((f) => f.slug === 'judith-bock');
    expect(bock).toBeDefined();
    expect(bock!.unconfirmed).toBe(true);
  });

  it('all 9 spec-required founders are present', () => {
    const slugs = new Set(FOUNDERS.map((f) => f.slug));
    for (const s of [
      'richard-knaub',
      'chuck-wilcox',
      'lola-wilcox',
      'martin-cobin',
      'laurie-obrien',
      'cherie-karo-schwartz',
      'judith-bock',
      'daniel-sp-yang',
      'nils-petersen',
    ]) {
      expect(slugs.has(s), `FOUNDERS missing ${s}`).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run test — FAIL (module not found)**

```bash
pnpm test tests/unit/founders.test.ts
```

- [ ] **Step 3: Create `src/data/founders.ts`**

```typescript
import { z } from 'astro/zod';

const FounderSchema = z.object({
  slug: z.string(),
  name: z.string(),
  role: z.string(),
  years: z.string().optional(),
  photoSrc: z.string().optional(),
  shortBio: z.string(),
  unconfirmed: z.boolean().default(false),
  sample: z.boolean().default(false),
});
export type Founder = z.infer<typeof FounderSchema>;

export const FOUNDERS: Founder[] = [
  {
    slug: 'richard-knaub',
    name: 'Richard Knaub',
    role: 'Co-founder, Colorado Caravan',
    shortBio:
      'One of the four founding faculty at the University of Colorado who shaped the Colorado Caravan under NEA Title III grants in the 1970s. Placeholder bio — real content arrives with the Drive import.',
    sample: true,
  },
  {
    slug: 'chuck-wilcox',
    name: 'Chuck Wilcox',
    role: 'Co-founder, playwright, and pedagogue',
    shortBio:
      'Wrote the Colorado Caravan’s founding manifesto and many of the children’s plays still in the DT:FC library. Placeholder bio — real content arrives with the Drive import.',
    sample: true,
  },
  {
    slug: 'lola-wilcox',
    name: 'Lola Wilcox',
    role: 'Co-founder, director, and educator',
    shortBio:
      'Lola shaped the Caravan’s repertoire and led generations of teachers into the discipline. Placeholder bio — real content arrives with the Drive import.',
    sample: true,
  },
  {
    slug: 'martin-cobin',
    name: 'Martin Cobin',
    role: 'Co-founder, scholar of Developmental Drama',
    shortBio:
      'Authored the field’s foundational articulation of Developmental Drama. Placeholder bio — real content arrives with the Drive import.',
    sample: true,
  },
  {
    slug: 'laurie-obrien',
    name: 'Laurie O’Brien',
    role: 'Facilitator, Workshop Manual author',
    shortBio:
      'Carries the facilitation practice forward through workshops and the Workshop Manual. Placeholder bio — real content arrives with the Drive import.',
    sample: true,
  },
  {
    slug: 'cherie-karo-schwartz',
    name: 'Cherie Karo Schwartz',
    role: 'Storyteller, editor, contributor',
    shortBio:
      'Storyteller and editor whose work shaped DT:FC’s children’s repertoire. Placeholder bio — real content arrives with the Drive import.',
    sample: true,
  },
  {
    slug: 'judith-bock',
    name: 'Judith Bock',
    role: 'Contributor',
    shortBio:
      'Contribution pending client confirmation per source spec §4.5 item 4.',
    unconfirmed: true,
    sample: true,
  },
  {
    slug: 'daniel-sp-yang',
    name: 'Daniel S.P. Yang',
    role: 'Contributing faculty; Shakespeare translator (Chinese)',
    shortBio:
      'CU faculty and translator whose decades of work opened Shakespeare to Chinese audiences and shaped DT:FC’s Shakespeare pedagogy. Placeholder bio — real content arrives with the Drive import.',
    sample: true,
  },
  {
    slug: 'nils-petersen',
    name: 'Nils Petersen',
    role: 'Contributing faculty',
    shortBio:
      'CU faculty whose contributions helped shape the Caravan’s early work. Placeholder bio — real content arrives with the Drive import.',
    sample: true,
  },
];

// Build-time verification: schema + slug uniqueness.
(function verifyAtImport() {
  for (const f of FOUNDERS) FounderSchema.parse(f);
  const slugs = FOUNDERS.map((f) => f.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error('FOUNDERS slugs must be unique');
  }
})();
```

Note: bios use `’` unicode escapes (equivalent to U+2019) so that the module parses cleanly without a curly-apostrophe-encoding roundtrip in git tooling. At runtime these render as U+2019 curly apostrophes.

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test tests/unit/founders.test.ts
```

Expected: all 5 tests pass. The `photoSrc` existence test is a no-op for placeholders (no founder has `photoSrc` set yet; Task 4's Drive import populates them).

- [ ] **Step 5: `pnpm build` — expect clean**

- [ ] **Step 6: Commit**

```bash
git add src/data/founders.ts tests/unit/founders.test.ts
git commit -m "$(cat <<'EOF'
feat(legacy): add FOUNDERS structured data (9 people, placeholder bios)

9 founders per spec §4.5 item 4 with sample: true placeholder bios.
Judith Bock flagged unconfirmed per spec. Task 4's Drive import replaces
bios (flipping sample: false) and populates photoSrc for any headshots
available. Cards without photoSrc render placeholder circles.

Inline Zod schema validates on import. Slug uniqueness enforced.
Vitest asserts: 9 entries, unique slugs, all 9 spec-required slugs
present, Judith Bock unconfirmed flag, imagery file existence when
photoSrc set.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: `timeline.json` placeholder + `src/lib/timeline.ts` loader + tests

**Files:**
- Create: `src/data/timeline.json` (placeholder if Task 4 didn't populate it; else already exists — this task just ensures it does exist).
- Create: `src/lib/timeline.ts` — validating loader + `parseYear` + `groupByDecade` helpers.
- Create: `tests/unit/timeline.test.ts`.

**Interfaces produced:**
- `TIMELINE_EVENTS: TimelineEvent[]` — parsed from `timeline.json` at import.
- `parseYear(date: string): number | null`
- `groupByDecade(events: TimelineEvent[]): Array<{ decade: number; events: TimelineEvent[] }>`

- [ ] **Step 1: Write failing test `tests/unit/timeline.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { parseYear, groupByDecade, TIMELINE_EVENTS } from '@/lib/timeline';
import { timelineSchema } from '@/lib/content-schemas';

describe('parseYear', () => {
  it('parses a bare 4-digit year', () => {
    expect(parseYear('1971')).toBe(1971);
  });

  it('parses a year inside a longer date string', () => {
    expect(parseYear('March 1975')).toBe(1975);
    expect(parseYear('1980-05-12')).toBe(1980);
  });

  it('returns null for unparseable input', () => {
    expect(parseYear('undated')).toBe(null);
    expect(parseYear('')).toBe(null);
    expect(parseYear('Colorado Caravan')).toBe(null);
  });

  it('only matches 19xx or 20xx years', () => {
    expect(parseYear('1885')).toBe(null); // 18xx not matched
    expect(parseYear('2099')).toBe(2099);
  });
});

describe('groupByDecade', () => {
  it('groups events by decade correctly', () => {
    const events = [
      { date: '1971', event: 'A', organization: 'CC' as const },
      { date: '1975', event: 'B', organization: 'CC' as const },
      { date: '1985', event: 'C', organization: 'CSF' as const },
      { date: '1990', event: 'D', organization: 'ALL' as const },
      { date: '2020', event: 'E', organization: 'TEF' as const },
    ];
    const groups = groupByDecade(events);
    expect(groups.map((g) => g.decade)).toEqual([1970, 1980, 1990, 2020]);
    expect(groups[0].events).toHaveLength(2); // 1971 + 1975
    expect(groups[1].events).toHaveLength(1); // 1985
    expect(groups[2].events).toHaveLength(1); // 1990
    expect(groups[3].events).toHaveLength(1); // 2020
  });

  it('silently skips unparseable dates', () => {
    const events = [
      { date: '1971', event: 'A', organization: 'CC' as const },
      { date: 'undated', event: 'B', organization: 'CC' as const },
    ];
    const groups = groupByDecade(events);
    expect(groups).toHaveLength(1);
    expect(groups[0].events).toHaveLength(1);
  });

  it('returns empty for empty input', () => {
    expect(groupByDecade([])).toEqual([]);
  });
});

describe('TIMELINE_EVENTS', () => {
  it('parses cleanly against timelineSchema', () => {
    // Import-time IIFE would throw at build; this test is a redundant guard.
    expect(() => timelineSchema.parse(TIMELINE_EVENTS)).not.toThrow();
  });

  it('has at least one event (placeholder or real)', () => {
    expect(TIMELINE_EVENTS.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test — FAIL (module + JSON not there yet)**

```bash
pnpm test tests/unit/timeline.test.ts
```

- [ ] **Step 3: Create `src/data/timeline.json` (placeholder if Task 4 didn't populate)**

If Task 4 ran successfully, this file already exists with real timeline data — skip to Step 4.

If Task 4 was skipped or the timeline xlsx import failed, create a small placeholder file:

```json
[
  {
    "date": "1971",
    "event": "The Colorado Caravan is founded at the University of Colorado.",
    "participants": "Richard Knaub, Chuck Wilcox, Lola Wilcox, Martin Cobin",
    "organization": "CC"
  },
  {
    "date": "1972",
    "event": "First NEA Title III grant awarded.",
    "organization": "ALL"
  },
  {
    "date": "1985",
    "event": "Placeholder event — real timeline arrives with Drive import.",
    "organization": "ALL"
  }
]
```

3 entries minimum. All flagged as coming from placeholder (via the ALL entry's text).

- [ ] **Step 4: Create `src/lib/timeline.ts`**

```typescript
import raw from '../data/timeline.json';
import { timelineSchema, type TimelineEvent } from '@/lib/content-schemas';

/**
 * Timeline events parsed and validated at import time. Any drift between
 * timeline.json and timelineSchema throws at build time.
 */
export const TIMELINE_EVENTS: TimelineEvent[] = timelineSchema.parse(raw);

/**
 * Parse a leading 4-digit year (19xx or 20xx) from a date string. Returns
 * null if none found — the caller decides how to handle unparseable dates.
 */
export function parseYear(date: string): number | null {
  const m = date.match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : null;
}

/**
 * Group events by decade (1971 -> 1970, 1985 -> 1980, ...). Returns
 * `{ decade, events }` sorted by decade ascending. Events with
 * unparseable dates are silently skipped.
 */
export function groupByDecade(
  events: TimelineEvent[],
): Array<{ decade: number; events: TimelineEvent[] }> {
  const decades = new Map<number, TimelineEvent[]>();
  for (const e of events) {
    const year = parseYear(e.date);
    if (year == null) continue;
    const decade = Math.floor(year / 10) * 10;
    if (!decades.has(decade)) decades.set(decade, []);
    decades.get(decade)!.push(e);
  }
  return [...decades.entries()]
    .sort(([a], [b]) => a - b)
    .map(([decade, events]) => ({ decade, events }));
}
```

You may need to add `"resolveJsonModule": true` to `tsconfig.json` if it isn't already set — Astro's default config usually has it. If TypeScript complains about the JSON import, add the flag; otherwise skip.

- [ ] **Step 5: Run tests to verify they pass**

```bash
pnpm test tests/unit/timeline.test.ts
```

Expected: all 10 tests pass.

- [ ] **Step 6: `pnpm build` — expect clean**

- [ ] **Step 7: Commit**

```bash
git add src/data/timeline.json src/lib/timeline.ts tests/unit/timeline.test.ts
git commit -m "$(cat <<'EOF'
feat(legacy): add timeline data + validating loader

src/data/timeline.json holds Grand Timeline events (real content from
Task 4 Drive import, or a 3-entry placeholder if the import was skipped).
src/lib/timeline.ts validates via timelineSchema at import (throws on
drift) and exposes parseYear + groupByDecade helpers.

Vitest covers parseYear (4 formats + unparseable), groupByDecade
(mixed-decade fixture + skip-unparseable + empty), and asserts
TIMELINE_EVENTS parses cleanly + has at least one entry.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: `FounderCard` component

**Files:**
- Create: `src/components/legacy/FounderCard.astro`

**Interfaces produced:**
- `<FounderCard founder={f} />` — renders one grid card: circular photo (or placeholder circle with initials if `founder.photoSrc` unset), h3 name, role, years, short bio, "unconfirmed" chip if `founder.unconfirmed`, sample chip if `founder.sample`.

- [ ] **Step 1: Create `src/components/legacy/FounderCard.astro`**

```astro
---
import type { Founder } from '@/data/founders';

interface Props {
  founder: Founder;
}
const { founder } = Astro.props;

// Placeholder initials: first letter of name + first letter of last-name-ish token.
function initials(name: string): string {
  const parts = name.split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return (first + last).toUpperCase();
}
---

<article class="border-ivory-200 bg-ivory-50 rounded-[var(--radius-card)] border p-5">
  <div class="flex items-start gap-4">
    {
      founder.photoSrc ? (
        <img
          src={founder.photoSrc}
          alt={`Portrait of ${founder.name}`}
          class="h-24 w-24 shrink-0 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          class="bg-clay-500/15 text-clay-700 flex h-24 w-24 shrink-0 items-center justify-center rounded-full font-medium"
          aria-hidden="true"
        >
          {initials(founder.name)}
        </div>
      )
    }
    <div class="flex-1">
      <h3 class="font-display text-ink-900 text-xl">{founder.name}</h3>
      <p class="text-ink-500 mt-1 text-sm">{founder.role}</p>
      {founder.years && <p class="text-ink-500 text-xs">{founder.years}</p>}
      <div class="mt-2 flex flex-wrap gap-2">
        {
          founder.unconfirmed && (
            <span class="bg-mustard-200 text-ink-700 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium">
              Unconfirmed
            </span>
          )
        }
        {
          founder.sample && (
            <span class="bg-ivory-200 text-ink-500 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium">
              Sample &mdash; pending final import
            </span>
          )
        }
      </div>
    </div>
  </div>
  <p class="text-ink-700 mt-4 text-sm leading-relaxed" set:html={founder.shortBio}></p>
</article>
```

The `set:html` on the bio paragraph lets `&rsquo;` HTML entities render correctly if the bio contains them. Since `founder.shortBio` is a trusted local constant (not user input), this is safe.

- [ ] **Step 2: `pnpm check` — expect 0 errors**

- [ ] **Step 3: Commit**

```bash
git add src/components/legacy/FounderCard.astro
git commit -m "$(cat <<'EOF'
feat(legacy): add FounderCard grid tile

Circular photo (or placeholder circle with initials when photoSrc unset),
name/role/years header, unconfirmed + sample chips conditionally, short
bio with HTML-entity rendering for curly apostrophes. Design tokens only.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: `EssayCard` + `EssayDetail` components

**Files:**
- Create: `src/components/legacy/EssayCard.astro`
- Create: `src/components/legacy/EssayDetail.astro`

**Interfaces produced:**
- `<EssayCard entry={entry} />` — library-index tile.
- `<EssayDetail entry={entry}><Content /></EssayDetail>` — detail template with header, print button, MDX slot, sample-content warning if `sample: true`.

- [ ] **Step 1: Create `src/components/legacy/EssayCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'essays'>;
}
const { entry } = Astro.props;
const slug = entry.id.replace(/\.mdx?$/, '');
const href = `/legacy/essays/${slug}/`;
---

<article class="border-ivory-200 bg-ivory-50 hover:border-clay-500/60 rounded-[var(--radius-card)] border p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
  <h3 class="font-display text-ink-900 text-xl">
    <a href={href} class="hover:text-clay-500 no-underline" set:html={entry.data.title}></a>
  </h3>
  <p class="text-ink-500 mt-1 text-sm" set:html={`${entry.data.author}${entry.data.year ? ` · ${entry.data.year}` : ''}`}></p>
  {entry.data.publishedIn && <p class="text-ink-500 text-xs" set:html={entry.data.publishedIn}></p>}
  <p class="text-ink-700 mt-3 text-sm" set:html={entry.data.excerpt}></p>
  {
    entry.data.sample && (
      <div class="mt-3">
        <span class="bg-ivory-200 text-ink-500 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium">
          Sample &mdash; pending final import
        </span>
      </div>
    )
  }
</article>
```

- [ ] **Step 2: Create `src/components/legacy/EssayDetail.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'essays'>;
}
const { entry } = Astro.props;
const g = entry.data;
---

<article class="mx-auto max-w-3xl">
  <p class="text-ink-500 text-sm">
    <a href="/legacy/">Legacy</a> &middot; <a href="/legacy/essays/">Essays</a>
  </p>

  <h1 class="mt-3" set:html={g.title}></h1>

  <p class="text-ink-500 mt-2 text-sm" set:html={`${g.author}${g.year ? ` · ${g.year}` : ''}${g.publishedIn ? ` · ${g.publishedIn}` : ''}`}></p>

  {
    g.sample && (
      <p class="border-mustard-400 bg-mustard-200/40 text-ink-700 mt-4 rounded-[var(--radius-card)] border-l-4 p-3 text-sm">
        <strong>Sample content.</strong> The final text of this essay is pending.
      </p>
    )
  }

  <div class="mt-4" data-print-hide>
    <button
      type="button"
      onclick="window.print()"
      class="border-ink-900 rounded border px-3 py-1.5 text-sm"
    >
      Print this essay
    </button>
  </div>

  <div class="prose prose-neutral mt-8 max-w-none">
    <slot />
  </div>
</article>
```

- [ ] **Step 3: `pnpm check` — expect 0 errors**

- [ ] **Step 4: Commit**

```bash
git add src/components/legacy/EssayCard.astro src/components/legacy/EssayDetail.astro
git commit -m "$(cat <<'EOF'
feat(legacy): add EssayCard + EssayDetail templates

EssayCard is a library-index tile with title link, author/year,
publishedIn, excerpt, and sample chip. Uses set:html so &rsquo;
entities in the collection frontmatter render correctly.

EssayDetail is the per-essay page template: breadcrumb, h1, author/
year/publishedIn line, sample-content warning callout (when
sample: true), print button (respects Cycle 1 data-print-hide), and
MDX Content slot.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: `TimelineLegend` component + 6 timeline color tokens

**Files:**
- Modify: `src/styles/tokens.css` — add 6 timeline organization color tokens.
- Create: `src/components/legacy/TimelineLegend.astro`

**Interfaces produced:**
- `<TimelineLegend />` — renders 6 org chips (`ALL / CC / C&C / CSF / TEF / OSC`) plus an "All" (empty) chip. Each is a `<button data-org="...">` with `aria-pressed` toggling. Container has `data-org-chips`. Includes inline `<script is:inline>` that reads `?org=` from URL on load and rewires on click.

- [ ] **Step 1: Add timeline color tokens to `src/styles/tokens.css`**

Locate the `@theme { ... }` block. Inside it, near the other `--color-*` declarations, add:

```css
  /* Timeline organization colors (Cycle 5 §4.5) */
  --color-timeline-all: #f7f3ea;   /* ivory-100 aliased */
  --color-timeline-cc: #4a6ea9;    /* blue — Colorado Caravan */
  --color-timeline-cnc: #7a4a9a;   /* violet — Crown & Clown */
  --color-timeline-csf: #d97a2d;   /* orange — Colorado Shakespeare Festival */
  --color-timeline-tef: #4a8a5a;   /* green — Theatre of Enchanted Forest */
  --color-timeline-osc: #7a5a3a;   /* brown — Overland Stage Company */
```

Chosen to approximate the spec's color guidance while staying legible on the ivory background at chip + badge sizes.

- [ ] **Step 2: Create `src/components/legacy/TimelineLegend.astro`**

```astro
---
import { TIMELINE_ORGS } from '@/lib/content-schemas';

interface OrgInfo {
  key: (typeof TIMELINE_ORGS)[number];
  label: string;
  cssVar: string;
}

const ORG_INFO: OrgInfo[] = [
  { key: 'ALL', label: 'All / Organizational', cssVar: '--color-timeline-all' },
  { key: 'CC', label: 'Colorado Caravan', cssVar: '--color-timeline-cc' },
  { key: 'C&C', label: 'Crown & Clown', cssVar: '--color-timeline-cnc' },
  { key: 'CSF', label: 'Colorado Shakespeare Festival', cssVar: '--color-timeline-csf' },
  { key: 'TEF', label: 'Theatre of Enchanted Forest / Toadstone', cssVar: '--color-timeline-tef' },
  { key: 'OSC', label: 'Overland Stage Company', cssVar: '--color-timeline-osc' },
];
---

<nav aria-label="Timeline organization filter" class="border-ivory-200 border-b pb-4" data-print-hide>
  <p class="text-ink-500 text-xs uppercase tracking-widest">Filter by organization</p>
  <div class="mt-3 flex flex-wrap gap-2" data-org-chips>
    <button
      type="button"
      data-org=""
      aria-pressed="true"
      class="border-ink-500/30 aria-[pressed=true]:border-clay-500 aria-[pressed=true]:bg-clay-500 aria-[pressed=true]:text-ivory-50 text-ink-700 rounded-[var(--radius-chip)] border px-3 py-1 text-xs font-medium"
    >
      All
    </button>
    {
      ORG_INFO.map((info) => (
        <button
          type="button"
          data-org={info.key}
          aria-pressed="false"
          class="border-ink-500/30 aria-[pressed=true]:border-clay-500 aria-[pressed=true]:bg-clay-500 aria-[pressed=true]:text-ivory-50 text-ink-700 rounded-[var(--radius-chip)] border px-3 py-1 text-xs font-medium"
          style={`--org-color: var(${info.cssVar});`}
        >
          <span class="mr-2 inline-block h-3 w-3 rounded-full align-middle" style={`background: var(${info.cssVar});`} aria-hidden="true"></span>
          {info.label}
        </button>
      ))
    }
  </div>
</nav>

<script is:inline>
  (function initTimelineFilter() {
    if (window.__dtfcTimelineInit) return;
    window.__dtfcTimelineInit = true;
    const chipContainer = document.querySelector('[data-org-chips]');
    const grid = document.querySelector('[data-timeline-grid]');
    if (!chipContainer || !grid) return;
    const chips = Array.from(chipContainer.querySelectorAll('button[data-org]'));
    const items = Array.from(grid.querySelectorAll('li[data-event-org]'));

    const applyFilter = (selected) => {
      chips.forEach((c) => {
        c.setAttribute('aria-pressed', c.getAttribute('data-org') === selected ? 'true' : 'false');
      });
      items.forEach((li) => {
        const o = li.getAttribute('data-event-org') || '';
        li.hidden = selected !== '' && o !== selected;
      });
    };

    const initial = new URLSearchParams(window.location.search).get('org') || '';
    applyFilter(initial);

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const org = chip.getAttribute('data-org') || '';
        applyFilter(org);
        const url = new URL(window.location.href);
        if (org) url.searchParams.set('org', org);
        else url.searchParams.delete('org');
        history.replaceState(null, '', url.toString());
      });
    });
  })();
</script>
```

- [ ] **Step 3: `pnpm check` — expect 0 errors**

- [ ] **Step 4: `pnpm build` — expect clean (guardrail runs)**

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/components/legacy/TimelineLegend.astro
git commit -m "$(cat <<'EOF'
feat(legacy): add TimelineLegend + 6 organization color tokens

TimelineLegend renders 6 org chips (ALL / CC / C&C / CSF / TEF / OSC)
plus an "All" (empty) chip, with color swatches. Inline is:inline
script handles URL-serialized filter state (?org=CC) and toggles
hidden on matching data-event-org list items via a shared window
init guard, same pattern as Cycle 3 themes + Cycle 4 series filters.

Six new --color-timeline-* CSS variables in tokens.css approximate
the spec's blue/violet/orange/green/brown scheme at chip and badge
sizes on the ivory background.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: `Timeline` component

**Files:**
- Create: `src/components/legacy/Timeline.astro`

**Interfaces produced:**
- `<Timeline />` — reads `TIMELINE_EVENTS` + `groupByDecade`, renders a `<section>` per decade with an `<h2>` and a `<ul>` of events. Each `<li>` carries `data-event-org` matching the org enum. Also renders `<TimelineLegend>` at the top.

- [ ] **Step 1: Create `src/components/legacy/Timeline.astro`**

```astro
---
import { TIMELINE_EVENTS, groupByDecade } from '@/lib/timeline';
import TimelineLegend from './TimelineLegend.astro';

const groups = groupByDecade(TIMELINE_EVENTS);

const ORG_TO_CSS_VAR: Record<string, string> = {
  ALL: '--color-timeline-all',
  CC: '--color-timeline-cc',
  'C&C': '--color-timeline-cnc',
  CSF: '--color-timeline-csf',
  TEF: '--color-timeline-tef',
  OSC: '--color-timeline-osc',
};
---

<TimelineLegend />

{
  groups.length === 0 ? (
    <p class="text-ink-500 mt-8 italic">
      Timeline entries are being populated &mdash; check back soon.
    </p>
  ) : (
    <ol class="mt-8 space-y-10" data-timeline-grid>
      {groups.map((group) => (
        <li>
          <h2 class="text-ink-900 font-display text-2xl">{group.decade}s</h2>
          <ul class="border-ink-500/20 mt-4 space-y-4 border-l-2 pl-6">
            {group.events.map((e) => (
              <li
                data-event-org={e.organization}
                class="relative"
              >
                <span
                  class="border-ivory-50 absolute -left-[calc(0.75rem+2px)] top-2 h-3 w-3 rounded-full border-2"
                  style={`background: var(${ORG_TO_CSS_VAR[e.organization]});`}
                  aria-hidden="true"
                ></span>
                <p class="text-ink-500 text-xs uppercase tracking-widest">{e.date}</p>
                <p class="text-ink-900 mt-1 text-base" set:html={e.event}></p>
                {e.participants && <p class="text-ink-700 mt-1 text-sm" set:html={`Participants: ${e.participants}`}></p>}
                {e.presentation && <p class="text-ink-700 mt-1 text-sm" set:html={`Presentation: ${e.presentation}`}></p>}
                {e.additionalInfo && <p class="text-ink-500 mt-1 text-xs italic" set:html={e.additionalInfo}></p>}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}
```

The outer container uses `<ol>` (decade-ordered) with an inner `<ul>` per decade. The `data-timeline-grid` attribute is what the TimelineLegend script queries.

- [ ] **Step 2: `pnpm check` — expect 0 errors**

- [ ] **Step 3: `pnpm build` — expect clean**

- [ ] **Step 4: Commit**

```bash
git add src/components/legacy/Timeline.astro
git commit -m "$(cat <<'EOF'
feat(legacy): add Timeline component with decade groups + org badges

Consumes TIMELINE_EVENTS + groupByDecade helpers. Renders decade
<section>s with color-badged events; TimelineLegend at the top drives
the filter via inline JS. data-timeline-grid + data-event-org attribute
pattern lets the legend script query and hide events without a
framework island.

Empty-state italic message when 0 events.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Landing page rewrite

**Files:**
- Modify: `src/pages/legacy/index.astro` (full rewrite)

**Interfaces consumed:**
- `LegacyLayout` (Task 3)

**Constraints:**
- Preserve `<section id="colorado-caravan">` and `<section id="founders">` anchors — `IDEA_TWO_ANSWERS` in `src/data/landing.ts` references them.
- Keep `<ReflectivePrompt sectionKey="legacy" />`.
- Keep the Cycle 2 "Become part of this Legacy" section linking to `/community/#membership`.
- Remove the Cycle 2 "Full history — coming next" section.
- Add directory grid of 5 sub-section cards.

- [ ] **Step 1: Rewrite `src/pages/legacy/index.astro`**

Replace the entire file with:

```astro
---
import LegacyLayout from '@/layouts/LegacyLayout.astro';
import ReflectivePrompt from '@/components/section/ReflectivePrompt.astro';

const directoryCards = [
  {
    label: 'History',
    href: '/legacy/history/',
    description: 'The Colorado Caravan story, NEA Title III grants, and DT:FC&rsquo;s research prospectus.',
  },
  {
    label: 'Founders',
    href: '/legacy/founders/',
    description: 'Nine people who invented Developmental Theatre and shaped its next fifty years.',
  },
  {
    label: 'Timeline',
    href: '/legacy/timeline/',
    description: 'The Grand Timeline, 1971&ndash;present, filterable by organization.',
  },
  {
    label: 'Essays',
    href: '/legacy/essays/',
    description: 'The founding manifestos and the writings that carry the practice forward.',
  },
  {
    label: 'Honoring Our Guides',
    href: '/legacy/honoring-our-guides/',
    description: 'The institutions and mentors whose work made all of this possible.',
  },
];
---

<LegacyLayout
  title="Legacy"
  eyebrow="History &mdash; Foundational Concepts &mdash; Who / When / Why &mdash; Next Steps"
  description="Where DT:FC came from, the people who built it, and the 50+ year timeline that&rsquo;s still unfolding."
>
  <ReflectivePrompt sectionKey="legacy" />

  <div class="mt-8 max-w-2xl space-y-6">
    {/* CLIENT REVIEW: rewritten in Cycle 5 to cross-link out to /legacy/history/. */}
    <section id="colorado-caravan">
      <h2>The Colorado Caravan</h2>
      <p>
        DT:FC descends from the <strong>Colorado Caravan</strong>, the touring theatre invented at
        the University of Colorado in the 1970s under NEA Title III grants.
        <a href="/legacy/history/" class="hover:text-clay-500">Read the full one-page history &rarr;</a>
      </p>
    </section>

    {/* CLIENT REVIEW: rewritten in Cycle 5 to cross-link out to /legacy/founders/. */}
    <section id="founders">
      <h2>The Founders</h2>
      <p>
        Developmental Theatre was founded by Richard Knaub, Chuck Wilcox, Lola Wilcox, and
        Martin Cobin, with contributions from Laurie O&rsquo;Brien, Cherie Karo Schwartz, Judith
        Bock, Daniel S.P. Yang, and Nils Petersen.
        <a href="/legacy/founders/" class="hover:text-clay-500">Meet the founders &rarr;</a>
      </p>
    </section>

    <section>
      <h2>Become part of this Legacy</h2>
      {/* CLIENT REVIEW: cross-link resolves Idea Two #13 to the Community membership paragraph (see /community/#membership). */}
      <p>
        The Legacy is a working one &mdash; anyone who plays, teaches, watches, or supports the
        work adds to it. Start on the <a href="/community/#membership">Community page</a> to learn
        how to join.
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
</LegacyLayout>
```

- [ ] **Step 2: `pnpm build` — expect clean (guardrail catches any straight apostrophes)**

- [ ] **Step 3: Commit**

```bash
git add src/pages/legacy/index.astro
git commit -m "$(cat <<'EOF'
feat(legacy): rewrite landing with LegacyLayout + directory grid + cross-links

Wraps in LegacyLayout (sub-nav renders). Preserves both Cycle 2 anchors
(#colorado-caravan, #founders) so IDEA_TWO_ANSWERS in
src/data/landing.ts continues to resolve. Rewrites both teaser
paragraphs shorter, each ending with an outbound cross-link to the
destination built this cycle.

Keeps the Cycle 2 "Become part of this Legacy" cross-link to
/community/#membership. Removes the "Full history — coming next"
placeholder (fulfilled by this cycle). Adds a 5-card directory grid.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: One-page history / research abstract page

**Files:**
- Create: `src/pages/legacy/history.astro`

**Content strategy:** if Task 4 imported the source Drive doc `10 Research Abstract for CU Theatre Department` and staged the cleaned text at `.superpowers/sdd/<workspace>/imports/history.txt`, adapt that content into the page body. Otherwise use the drafted content below (all flagged CLIENT REVIEW).

- [ ] **Step 1: Check for imported source text**

```bash
ls .superpowers/sdd/*/imports/history.txt 2>/dev/null || echo "NO IMPORT — use drafted content"
```

If a file exists, read it. Drafted-content path uses the template below verbatim.

- [ ] **Step 2: Create `src/pages/legacy/history.astro`**

If imported content is available, adapt it into H2/paragraph structure per the template below. If not, use verbatim:

```astro
---
import LegacyLayout from '@/layouts/LegacyLayout.astro';
---

<LegacyLayout
  title="History"
  subPage="history"
  eyebrow="One-page history &mdash; doubles as research prospectus"
  description="The Colorado Caravan story, NEA Title III grants, and the fifty-year lineage DT:FC still carries."
>
  <div class="max-w-2xl space-y-8">
    {/* CLIENT REVIEW: content drafted from spec §4.5 item 3 framing; adapt from imported "10 Research Abstract for CU Theatre Department" when Task 4 stages it. */}

    <section>
      <h2>The Colorado Caravan (1971)</h2>
      <p>
        DT:FC descends from the Colorado Caravan, a touring theatre invented at the University of
        Colorado Theatre Department and the Colorado Shakespeare Festival under NEA Title III
        grants beginning in 1971. The four founding faculty &mdash; Richard Knaub, Chuck Wilcox,
        Lola Wilcox, and Martin Cobin &mdash; built the Caravan around a bare-stage aesthetic,
        oral tradition, and versatile casting so any classroom could stage any play.
      </p>
    </section>

    <section>
      <h2>The NEA Title III grants</h2>
      <p>
        The Title III programme funded the Caravan&rsquo;s touring years and its formal residency
        with CU. It also enabled the creation of an M.A. program in Developmental Theatre / Drama,
        institutionalising the practice inside a university theatre department for the first time.
      </p>
    </section>

    <section>
      <h2>What came of it</h2>
      <p>
        Across five decades, the Caravan and its successor companies have performed for audiences
        totalling more than six million on three continents. Practitioners trained through the
        M.A. programme have carried Developmental Theatre&rsquo;s tools into schools, community
        theatres, universities, and therapeutic settings around the world.
      </p>
    </section>

    <section>
      <h2>The research prospectus</h2>
      <p>
        We are actively seeking a graduate researcher to write the definitive history of
        Developmental Theatre. Fifty years of archives, unpublished essays, oral histories, and
        institutional records exist, most of them in one place. If you are that researcher, or you
        know that researcher, start with the
        <a href="/legacy/essays/">essays</a>, the
        <a href="/legacy/timeline/">Grand Timeline</a>, and the
        <a href="/legacy/founders/">Founders</a>.
      </p>
    </section>
  </div>
</LegacyLayout>
```

- [ ] **Step 3: `pnpm build` — expect clean**

- [ ] **Step 4: Commit**

```bash
git add src/pages/legacy/history.astro
git commit -m "$(cat <<'EOF'
feat(legacy): add /legacy/history/ one-page history + prospectus

Four H2 sections: Colorado Caravan, NEA Title III grants, what came of
it, research prospectus with cross-links to essays, timeline, and
founders. Drafted from spec §4.5 item 3; if Task 4 imported the
"10 Research Abstract for CU Theatre Department" source doc, adapt that
content in place of the drafts.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: `/legacy/founders/` grid page

**Files:**
- Create: `src/pages/legacy/founders.astro`

- [ ] **Step 1: Create `src/pages/legacy/founders.astro`**

```astro
---
import LegacyLayout from '@/layouts/LegacyLayout.astro';
import FounderCard from '@/components/legacy/FounderCard.astro';
import { FOUNDERS } from '@/data/founders';
---

<LegacyLayout
  title="Founders"
  subPage="founders"
  eyebrow="The people who built the Legacy"
  description="Nine founders and contributing faculty whose work shaped Developmental Theatre."
>
  <div class="max-w-2xl">
    <p class="text-ink-700 text-base">
      Developmental Theatre was invented at the University of Colorado in the 1970s. Below are the
      four founders and the five contributing faculty whose work carried the practice into its
      next generation. For the full lineage, see
      <a href="/legacy/history/" class="hover:text-clay-500">the one-page history &rarr;</a>
    </p>
  </div>

  <ul class="mt-10 grid list-none gap-6 md:grid-cols-2 lg:grid-cols-3">
    {FOUNDERS.map((f) => (
      <li>
        <FounderCard founder={f} />
      </li>
    ))}
  </ul>
</LegacyLayout>
```

- [ ] **Step 2: `pnpm build` — expect clean**

- [ ] **Step 3: Commit**

```bash
git add src/pages/legacy/founders.astro
git commit -m "$(cat <<'EOF'
feat(legacy): add /legacy/founders/ profile grid page

Renders FOUNDERS data as a responsive grid of FounderCards (mobile
1-col, sm 2-col, lg 3-col). Intro paragraph frames the section and
cross-links to /legacy/history/.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: `/legacy/honoring-our-guides/` page

**Files:**
- Create: `src/pages/legacy/honoring-our-guides.astro`

**Content strategy:** same as Task 12 — use imported text from `.superpowers/sdd/*/imports/honoring-our-guides.txt` if available; otherwise drafted content flagged CLIENT REVIEW.

- [ ] **Step 1: Check for imported source text**

```bash
ls .superpowers/sdd/*/imports/honoring-our-guides.txt 2>/dev/null || echo "NO IMPORT — use drafted"
```

- [ ] **Step 2: Create `src/pages/legacy/honoring-our-guides.astro`**

If imported: adapt into H2 sections. If not, use verbatim:

```astro
---
import LegacyLayout from '@/layouts/LegacyLayout.astro';
---

<LegacyLayout
  title="Honoring Our Guides"
  subPage="honoring-our-guides"
  eyebrow="Legacy"
  description="The institutions and mentors whose work made Developmental Theatre possible."
>
  <div class="max-w-2xl space-y-8">
    {/* CLIENT REVIEW: drafted content below; adapt from imported source when Task 4 stages it. */}

    <section>
      <h2>The University of Colorado Theatre Department</h2>
      <p>
        CU&rsquo;s Theatre Department gave the Caravan its home &mdash; a studio, a residency, and
        an M.A. programme that formalised the discipline.
      </p>
    </section>

    <section>
      <h2>The National Endowment for the Arts</h2>
      <p>
        NEA Title III grants funded the Caravan&rsquo;s touring years and made experimentation at
        scale possible.
      </p>
    </section>

    <section>
      <h2>The Colorado Shakespeare Festival</h2>
      <p>
        CSF partnered with the Caravan through residencies and shared productions, keeping
        Shakespeare central to the Developmental Theatre curriculum.
      </p>
    </section>

    <section>
      <h2>The teachers and children</h2>
      <p>
        Fifty years of classroom teachers and their students helped the plays find their shape.
        Their edits and adaptations live inside every performance in the DT:FC library today.
      </p>
    </section>
  </div>
</LegacyLayout>
```

- [ ] **Step 3: `pnpm build` — expect clean**

- [ ] **Step 4: Commit**

```bash
git add src/pages/legacy/honoring-our-guides.astro
git commit -m "$(cat <<'EOF'
feat(legacy): add /legacy/honoring-our-guides/ page

Four H2 sections acknowledging CU Theatre Department, the NEA, CSF, and
the teachers/children. Drafted content flagged CLIENT REVIEW; if Task 4
imported a Legacy-scoped Honoring Our Guides source doc, that content
replaces the drafts.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: `/legacy/essays/` library index page

**Files:**
- Create: `src/pages/legacy/essays/index.astro`

- [ ] **Step 1: Create `src/pages/legacy/essays/index.astro`**

```astro
---
import LegacyLayout from '@/layouts/LegacyLayout.astro';
import EssayCard from '@/components/legacy/EssayCard.astro';
import { getCollection } from 'astro:content';

const entries = (await getCollection('essays')).sort((a, b) => {
  const ay = a.data.year ?? Infinity;
  const by = b.data.year ?? Infinity;
  return ay - by;
});
---

<LegacyLayout
  title="Essays"
  subPage="essays"
  eyebrow="The written record"
  description="The founding manifestos and the writings that carry the practice forward."
>
  <div class="max-w-2xl">
    <p class="text-ink-700 text-base">
      The written record of DT:FC&rsquo;s methods, from the founders and Laurie O&rsquo;Brien.
    </p>
  </div>

  {
    entries.length === 0 ? (
      <p class="text-ink-500 mt-8 italic">
        Essays are being populated &mdash; check back soon.
      </p>
    ) : (
      <ul class="mt-10 grid list-none gap-6 md:grid-cols-2">
        {entries.map((entry) => (
          <li>
            <EssayCard entry={entry} />
          </li>
        ))}
      </ul>
    )
  }
</LegacyLayout>
```

- [ ] **Step 2: `pnpm build` — expect clean**

- [ ] **Step 3: Commit**

```bash
git add src/pages/legacy/essays/index.astro
git commit -m "$(cat <<'EOF'
feat(legacy): add /legacy/essays/ library index

Renders essays collection as a grid of EssayCards sorted by year
ascending (chronological). Empty-state italic message if 0 entries.
Workshop Manual placeholder (sample: true) renders with a sample chip.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: `/legacy/essays/[slug].astro` dynamic route

**Files:**
- Create: `src/pages/legacy/essays/[slug].astro`

- [ ] **Step 1: Create the dynamic route**

```astro
---
import { getCollection, render } from 'astro:content';
import LegacyLayout from '@/layouts/LegacyLayout.astro';
import EssayDetail from '@/components/legacy/EssayDetail.astro';

export async function getStaticPaths() {
  const entries = await getCollection('essays');
  return entries.map((entry) => ({
    params: { slug: entry.id.replace(/\.mdx?$/, '') },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<LegacyLayout
  title={entry.data.title}
  subPage="essays"
  eyebrow="Essay"
  description={entry.data.excerpt}
>
  <EssayDetail entry={entry}>
    <Content />
  </EssayDetail>
</LegacyLayout>
```

- [ ] **Step 2: `pnpm build` — expect 5 essay detail pages generated**

Verify build output includes `/legacy/essays/towards-a-poor-caravan/`, `/legacy/essays/theatre-influences/`, `/legacy/essays/developmental-drama/`, `/legacy/essays/why-these-plays-are-successful/`, `/legacy/essays/workshop-manual/`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/legacy/essays/\[slug\].astro
git commit -m "$(cat <<'EOF'
feat(legacy): add /legacy/essays/[slug].astro dynamic route

getStaticPaths reads the essays collection; each entry renders as
LegacyLayout + EssayDetail + <Content /> slot. Detail page sets
subPage="essays" so the sub-nav marks Essays as current.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: `/legacy/timeline/` page (with pre-release chip)

**Files:**
- Create: `src/pages/legacy/timeline.astro`

**Constraint:** page renders a "pre-release: canonical version pending" chip beside the h1 with a CLIENT REVIEW comment referencing spec §8 item 3.

- [ ] **Step 1: Create `src/pages/legacy/timeline.astro`**

```astro
---
import LegacyLayout from '@/layouts/LegacyLayout.astro';
import Timeline from '@/components/legacy/Timeline.astro';
---

<LegacyLayout
  title="The Grand Timeline, 1971&ndash;present"
  subPage="timeline"
  eyebrow="Developmental Theatre through five decades"
  description="Fifty years of Developmental Theatre productions, personnel, and milestones — filterable by organization."
>
  {/* CLIENT REVIEW: pending Steve Smith's confirmation of canonical xlsx version per spec §8 item 3.
      If a different canonical arrives later, re-run the Drive import task with the correct file. */}
  <p class="mb-6">
    <span class="text-mustard-600 bg-mustard-200/40 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium uppercase tracking-widest">
      Pre-release &mdash; canonical version pending
    </span>
  </p>

  <div class="max-w-2xl">
    <p class="text-ink-700 text-base">
      The Grand Timeline gathers every notable Developmental Theatre production, personnel change,
      and institutional milestone from 1971 to the present. Filter by organization above to trace
      the arc of any one company &mdash; the URL updates so you can share the filtered view.
    </p>
  </div>

  <Timeline />
</LegacyLayout>
```

- [ ] **Step 2: `pnpm build` — expect clean; timeline page renders**

- [ ] **Step 3: Commit**

```bash
git add src/pages/legacy/timeline.astro
git commit -m "$(cat <<'EOF'
feat(legacy): add /legacy/timeline/ page with pre-release chip

Renders <Timeline> component. Pre-release chip beside the h1 signals
the canonical-version caveat per spec §8 item 3; CLIENT REVIEW
comment references the source. Chip removes cleanly when Steve Smith
confirms.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 18: Extend Playwright smoke test for Legacy

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Read current smoke test**

```bash
cat tests/e2e/smoke.spec.ts
```

Note the current structure and find the console-error listener setup at the end.

- [ ] **Step 2: Add Legacy block before the console-error listener**

Insert the following inside the existing single test, immediately before the console-error listener setup:

```typescript
  // Legacy section — landing, sub-nav, timeline with filter, one essay detail
  await page.goto('/legacy/');
  await expect(page.getByRole('heading', { level: 1, name: 'Legacy' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Legacy section/i })).toBeVisible();

  // Timeline: legend + at least one event visible; toggle a chip.
  await page.goto('/legacy/timeline/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Grand Timeline/i);
  const legend = page.getByRole('navigation', { name: /Timeline organization filter/i });
  await expect(legend).toBeVisible();
  const items = page.locator('[data-timeline-grid] li[data-event-org]');
  await expect(items.first()).toBeVisible();
  // Click the CC (Colorado Caravan) chip — the page should still render, and CC-marked events remain visible.
  const ccChip = legend.getByRole('button', { name: /Colorado Caravan/i });
  await ccChip.click();
  await expect(ccChip).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/\?org=CC/);

  // Essays: index + one detail with print button.
  await page.goto('/legacy/essays/');
  await expect(page.getByRole('heading', { level: 1, name: 'Essays' })).toBeVisible();
  const firstEssayLink = page.locator('article a').first();
  await firstEssayLink.click();
  await expect(page).toHaveURL(/\/legacy\/essays\/[^/]+\/?/);
  await expect(page.getByRole('button', { name: /Print this essay/i })).toBeVisible();
```

- [ ] **Step 3: Run the Playwright test**

```bash
pnpm test:e2e
```

Expected: PASS. If the CC chip click fails because no CC-tagged events exist (e.g., Task 4 fell back to all-`ALL` mapping), the assertion `aria-pressed="true"` still passes (the chip toggles regardless of match count). URL assertion also passes. If any prior-cycle assertion breaks, fix minimally and note in the report.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "$(cat <<'EOF'
test(e2e): extend smoke test for Legacy section

Landing (h1 + Legacy sub-nav), Timeline (legend + one event + CC chip
toggle + URL param), Essays (index + first detail with print button).
No pre-existing Cycle 1-4 assertions altered.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 19: Update `CLAUDE.md` + auto-memory + follow-ups

**Files:**
- Modify: `CLAUDE.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_followups.md`

- [ ] **Step 1: Update `CLAUDE.md`**

Read current file. Under **Stack**, add:

```markdown
- **Legacy content model:** `essays` MDX collection + `FOUNDERS` structured data file (`src/data/founders.ts`) + `timeline.json` (`src/data/timeline.json`) driven by a validating loader (`src/lib/timeline.ts`).
```

Under **Key conventions**, add:

```markdown
**Legacy sub-nav** (`src/lib/legacy-nav.ts`) drives the persistent sub-nav rendered by `src/layouts/LegacyLayout.astro` on every `/legacy/*` page. 5 items: History / Founders / Timeline / Essays / Honoring Our Guides.

**Timeline data model.** Events live at `src/data/timeline.json` as a flat array. Validated by `timelineSchema` at import (`src/lib/timeline.ts` throws on drift). Grouped by decade via `groupByDecade()`. Organization enum `TIMELINE_ORGS` has 6 values (ALL / CC / C&C / CSF / TEF / OSC), each with a `--color-timeline-*` CSS variable in tokens.css.

**Founder photos** live at `/public/images/legacy/founders/<slug>.<ext>` (ASCII kebab-case). FounderCard renders a placeholder circle with initials when `photoSrc` is unset.

**Curly-apostrophe guardrail.** `scripts/check-prohibited-text.mjs` detects straight U+0027 apostrophes between word characters across `.astro` / `.mdx` / `.md` files. Runs in `pnpm build`. Whitelist: Cycle 3 Shakespeare verse files (juliet, lady-macbeth, mechanicals) where straight apostrophes are standard modernized editorial practice. To add a legitimate straight-apostrophe file to the whitelist, edit `CURLY_APOSTROPHE_ALLOWLIST` in the script.
```

Under **Adding a game** or nearby, add:

```markdown
**Adding an essay.** Drop `src/content/essays/<slug>.mdx` with `title`, `author`, `year?`, `publishedIn?`, `excerpt` (≤ 200 chars), `sample: false`. Body sections `## About this essay` / `## Full text`. Use `&rsquo;` for apostrophes.

**Adding a founder.** Append to `FOUNDERS` in `src/data/founders.ts` with a unique kebab-case `slug`, `name`, `role`, `shortBio` (2–4 sentences using `’` unicode escapes for possessives). Optional: `years`, `photoSrc` (path under `/public/images/legacy/founders/`), `unconfirmed: true` for pending confirmations.

**Adding a timeline event.** Append to `src/data/timeline.json` with `date`, `event`, `organization` (one of `TIMELINE_ORGS`). Optional: `participants`, `presentation`, `additionalInfo`.
```

Under **Deferred / TODO markers**, add:

```markdown
- Web 2.0 careers/successor-theatres slot in Legacy — Cycle N per spec §5.
- Timeline canonical version pending Steve Smith (spec §8 item 3) — pre-release chip on `/legacy/timeline/`.
- Workshop Manual TEXT MISSING (spec §8 item 2) — essay ships as sample: true placeholder.
- Judith Bock unconfirmed founder (spec §4.5 item 4) — card renders with unconfirmed chip.
```

- [ ] **Step 2: Update `project_dtfc_cycles.md`**

Read the current file and add a Cycle 5 line after the Cycle 4 entry:

```markdown
Cycle 5 shipped 2026-08-11 (Legacy section: 10 new pages across 7 route files including landing rewrite, history/research abstract, Founders grid from FOUNDERS data, interactive Timeline with 6-org chip filter driven by xlsx→JSON pipeline, Essays library including Workshop Manual TEXT MISSING placeholder, Legacy-scoped Honoring Our Guides. Curly-apostrophe guardrail folded into check:prohibited so Cycles 6–7 get the check for free.).
```

Update the roadmap:
- Cycle 6 — Community + forms + newsletter ESP wiring (also wires Ask Shakespeare form)
- Cycle 7 — Cross-site search (Pagefind) + analytics + launch checklist
- Cycle N — Web 2.0 items (deferred per source spec §5)

- [ ] **Step 3: Append to `project_dtfc_followups.md`**

Add at the bottom:

```markdown
**Cycle 5 (2026-08-11) added follow-ups:**
- Timeline canonical version pending Steve Smith (spec §8 item 3). `/legacy/timeline/` renders pre-release chip; re-run Task 4's Drive import when canonical arrives.
- Workshop Manual TEXT MISSING (spec §8 item 2). Essay entry ships as `sample: true` placeholder. Flip `sample: false` and paste body when Laurie O'Brien's text arrives.
- Judith Bock unconfirmed founder (spec §4.5 item 4). Card renders with unconfirmed chip. Confirm or omit.
- Founder headshots: FounderCard renders placeholder circles for founders without `photoSrc`. Add photos as they arrive.
- If Task 4 was skipped or the xlsx organization mapping fell back to all `ALL`, the timeline chip filter is lower-value. Re-run the import task with proper org signal when available.
- CLIENT REVIEW markers on any pages where Drive import didn't stage source text — bundle for Lola/Laurie review.
- Curly-apostrophe guardrail landed in Cycle 5 Task 1. Whitelist for Cycle 3 Shakespeare verse files is encoded in the script; edit `CURLY_APOSTROPHE_ALLOWLIST` if new legitimate-straight-apostrophe files arise.
```

- [ ] **Step 4: Commit CLAUDE.md only**

Memory files live outside repo — not committed.

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs: update CLAUDE.md for Cycle 5 Legacy section

Documents: essays content collection; FOUNDERS structured data file;
timeline.json schema + src/lib/timeline.ts loader with parseYear +
groupByDecade helpers; TIMELINE_ORGS enum with 6 org color tokens;
founder-photos convention (/public/images/legacy/founders/, ASCII
kebab-case); LEGACY_NAV sub-nav library + LegacyLayout wrapper;
curly-apostrophe guardrail behavior + Shakespeare verse whitelist.

Adds "Adding an essay / founder / timeline event" instruction blocks.
Notes 4 open items in Deferred / TODO markers (Web 2.0 slot, timeline
canonical, Workshop Manual TEXT MISSING, Judith Bock unconfirmed).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Final Verification (not a separate commit — the executing session runs these)

After Task 19, before offering to merge to `main`, run:

- `pnpm check` — 0 errors.
- `pnpm build` — succeeds; `check:concepts` + `check:prohibited` (now including curly-apostrophe detection) both print `✓`. ~85 pages built (was 75 Cycle 4; +10 Legacy pages).
- `pnpm test` — all Vitest suites green (existing + `apostrophe-guardrail.test.ts` + `legacy.test.ts` + `founders.test.ts` + `timeline.test.ts`).
- `pnpm test:e2e` — Playwright smoke test green (existing + Legacy block).
- Manual pass in `pnpm dev`:
  - `/legacy/` — landing with sub-nav + directory grid + preserved anchors.
  - `/legacy/history/` — 4 H2 sections + cross-links.
  - `/legacy/founders/` — 9-card grid; Judith Bock card shows "unconfirmed" chip.
  - `/legacy/timeline/?org=CC` — chip filter works; deep-links; pre-release chip visible.
  - `/legacy/essays/` — 5 essay cards sorted by year; Workshop Manual card shows sample chip.
  - `/legacy/essays/workshop-manual/` — sample-content warning banner visible.

When all clean, offer the merge:

```bash
git checkout main && git merge --no-ff cycle-5-legacy -m "Merge cycle-5-legacy (Legacy section deep-build per spec §4.5)"
```

---
