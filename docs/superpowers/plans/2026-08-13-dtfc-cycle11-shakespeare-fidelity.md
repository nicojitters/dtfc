# DT:FC Cycle 11 — Shakespeare Vision Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the shipped `/shakespeare` section into full alignment with the 12-criterion vision-fidelity spec: merge the full Drive-doc content into the Alternatives essay + Honoring Our Guides page, land the "Leave the Language" doctrine block with the "What translation did you use?" proof point + two live Concept popovers, distribute the TMAI essay as four assets (no parallel page), host the Pidgin *One Uddah Midʻsummah* audio locally with correct ʻokina typography, add the new `/shakespeare/new-plays/` route via a `new-plays` library-enum extension with two placeholder scripts, reorder the sub-nav to spec §2's client-numbered order, unify Chuck/Charles Wilcox site-wide, extend the prohibited-text guardrail with seven new patterns, and close cross-section contracts to Legacy + PRC + Children's Theatre.

**Architecture:** The Shakespeare content model is already largely in place from Cycle 3 — `scripts`/`colloquial`/`ask-shakespeare` collections, `ShakespeareLayout` with sub-nav, per-library index pages, script-detail template. This cycle extends `library` enum with `new-plays`, adds one `AudioEmbed.astro` component, and adds one `.callout-tradeoffs` class to `src/styles/callouts.css` (Cycle 10 shipped the other callout classes). Content authoring pulls from the Drive folder `4-Shakespeare` — 4 top-level source docs — via the Google Drive MCP; the two placeholder script MDXs are hand-authored from anecdotes already quoted in Drive doc 1b. The existing shipped Alternatives essay + Honoring Our Guides page bodies get wholesale rewrites; the landing gets one aside enrichment (proof point + TIP with Concept popovers).

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@theme` tokens), TypeScript strict, MDX content collections with Zod schemas, Vitest, Playwright, `@axe-core/playwright`, Pagefind (build-time indexer), native Popover API (via the existing Concept popover), Google Drive MCP for content sourcing.

**Spec:** `/Users/cnote/projects/dtfc/docs/superpowers/specs/2026-08-13-dtfc-cycle11-shakespeare-fidelity-design.md`

## Global Constraints

- **Branch:** all work on `cycle-11-shakespeare-fidelity` (already created). Merge to `main` at cycle end uses `git merge --no-ff`.
- **Package manager:** `pnpm` only. Commands: `pnpm dev`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm check:prohibited`.
- **Node module type:** `"type": "module"` — ESM everywhere.
- **No hex codes in components** — colors come from tokens in `src/styles/tokens.css`. `.callout-tradeoffs` MAY use an existing warm-accent token (`--color-clay-500` or `--color-amber-500` if present); no new tokens added this cycle.
- **Vocabulary:** "Players" (never "actors"), "Facilitator" (never "leader"), "Players Resource Center" (full), "Children's Theatre" (curly apostrophe).
- **Curly apostrophes in all prose** — enforced by `scripts/check-prohibited-text.mjs` running in `pnpm build`. Use `&rsquo;` or the literal U+2019 (’). Cycle 11 does not add files to the allowlist. **Exception: Hawaiian ʻokina (U+02BB, `ʻ`) is a distinct character from U+2019 and must be preserved in Colloquial Pidgin content** (`Midʻsummah`, `iaʻu`, `ʻao`, etc.) — the guardrail doesn't distinguish, so keep ʻokina occurrences on their own lines or use HTML entities as needed. See Task 7.
- **Zod imports use `astro/zod`**, not bare `zod`.
- **Editorial stripping rules** (vision spec §6 — enforced by guardrail additions in Task 4): the following MUST NOT appear in built output — `(Desirae: use part of text for description of script sections ?)`, `Shakspeare` (title typo), the orphan footnote `Act V, scene ii, the murder scene, lines 1–117`, `TMAI` as visible label (moves to frontmatter `sourceDoc`), `Berstein` (Bernstein typo), `WIthin` (Within typo), raw Drive mp4 URLs.
- **Source-faithfulness policies** (vision spec §1 + §3): keep quoted pedigree and specific credibility-layer facts verbatim — Amanda Giguere's *Shakespeare and Violence Prevention* + June 2025 date; Joe Craft's 50-year DPS career + Folger third-stewardship; Yang's Chinese translation work; Chuck Wilcox's Benedetti-Lear + stroke + Shakespeare-on-the-Green invention with Richard Devin. Normalize only mechanical typos (`Berstein`→`Bernstein`, `WIthin`→`Within`). Never invent script content; placeholder cards use "Full script pending — contact us" language. Preserve TMAI's trade-offs candor ("narrator function," "not truly Shakespeare") as "Trade-offs to consider" callouts.
- **Popover source of truth:** every `<Concept id="…" />` reads `shortDefinition` from a PRC entry via `getConcept()`. Landing TIP references `vocal-expression` and `warmup` — `warmup` exists; `vocal-expression` does not (Cycle 10 shipped 20 concepts; Vocal Expression is missing). Task 10 resolves via decision gate: author placeholder inline vs. render `(pending)` chip.
- **Chuck vs Charles Wilcox:** site-wide canonical is "Chuck Wilcox" per vision spec §1.4 and Legacy convention. Preserve any formal program credits legitimately quoting "Charles Wilcox" — enumerate exceptions in the client-review bundle.
- **Commit granularity:** one commit per task deliverable. Content batches (T11, T12) commit per section when convenient. Commit messages authored `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` via HEREDOC.

---

## File Map

**Create:**
- `src/components/shakespeare/AudioEmbed.astro`
- `src/content/scripts/three-finger-dick.mdx`
- `src/content/scripts/shakespeares-sister.mdx`
- `src/pages/shakespeare/new-plays/index.astro`
- `public/audio/midsummah-pidgin-paka.mp4` (fetched from Drive)
- `docs/client-reviews/2026-08-13-cycle11-shakespeare-review.md`
- `tests/unit/scripts-new-plays.test.ts`
- `tests/unit/shakespeare-nav.test.ts`
- `tests/unit/colloquial-audio.test.ts`
- `tests/unit/honoring-cross-links.test.ts`

**Modify:**
- `src/content.config.ts` — extend `library` enum with `new-plays`
- `src/lib/shakespeare-nav.ts` — reorder to 10 items in spec §2 order
- `src/styles/callouts.css` — add `.callout-tradeoffs`
- `src/pages/shakespeare/index.astro` — enrich Leave the Language aside: add "What translation did you use?" proof point + TIP with two Concept popovers
- `src/pages/shakespeare/alternatives.astro` — full body rewrite from Drive doc 1b + TMAI trade-offs callouts + Contact CTA
- `src/pages/shakespeare/honoring-our-guides.astro` — full body rewrite from Drive doc 3 + Legacy cross-links
- `src/pages/shakespeare/scenes.astro` — Alternative One blurb
- `src/pages/shakespeare/themes.astro` — Alternative Two blurb + TMAI scene-selection callout
- `src/pages/shakespeare/cuttings.astro` — Alternative Three blurb + TMAI 40-min credentials + Chuck's in-progress note
- `src/pages/shakespeare/soliloquies.astro` — drafted blurb + CLIENT REVIEW marker
- `src/pages/shakespeare/childrens-shakespeare.astro` — cross-link block to Children's Theatre
- `src/pages/shakespeare/colloquial/[slug].astro` — render `<AudioEmbed>` above `<SideBySideText>` when `entry.data.audio` set + transcript statement
- `src/pages/childrens-theatre/index.astro` — reverse cross-link block to Shakespeare/Children's
- `src/content/colloquial/one-uddah-midsummah.mdx` — frontmatter audio fields + ʻokina fix + full-body import from Drive
- `src/data/timeline.json` — Charles → Chuck Wilcox per-hit review
- `src/content/scripts/*.mdx` (any with Charles Wilcox) — Charles → Chuck per-hit
- `scripts/check-prohibited-text.mjs` — append 7 new PATTERNS
- `tests/e2e/smoke.spec.ts` — extend with 5 new checkpoints + 2 new axe scans
- `tests/unit/prohibited-text.test.ts` (if exists) — coverage for the 7 new patterns
- `CLAUDE.md` — Cycle 11 conventions

**Auto-memory updates (end of cycle):** `project_dtfc_cycles.md`, `project_dtfc_followups.md`.

---

## Task 1: Extend `scripts` library enum with `new-plays`

**Files:**
- Modify: `src/content.config.ts`
- Create: `tests/unit/scripts-new-plays.test.ts`

**Interfaces produced:**
- `scripts` collection `library` field accepts `'new-plays'` as a valid value.
- `scriptHref()` in `src/lib/script-href.ts` continues to work unchanged — `new-plays` falls through the `CHILDRENS_LIBRARIES` Set check and routes to `/shakespeare/scripts/<slug>/` (verified by the test in this task; no code change needed to `script-href.ts`).

- [ ] **Step 1: Write the failing test at `tests/unit/scripts-new-plays.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import { scriptHref } from '@/lib/script-href';

describe('scripts library enum — new-plays (Cycle 11)', () => {
  it('accepts library: new-plays entries', async () => {
    // Loads all scripts entries; if a `new-plays` file exists (added in T9),
    // it must validate. This test proves the enum change works even before
    // the placeholder entries land.
    const entries = await getCollection('scripts');
    // Filter to entries whose frontmatter library is new-plays.
    const newPlays = entries.filter((e) => e.data.library === 'new-plays');
    // At schema-time this list may be empty until T9 authors the placeholders;
    // the assertion is that filtering does not throw due to enum mismatch.
    expect(Array.isArray(newPlays)).toBe(true);
  });

  it('scriptHref routes new-plays to /shakespeare/scripts/<slug>/', () => {
    const fakeEntry = {
      id: 'test-new-play.mdx',
      data: { library: 'new-plays' as const },
    } as never;
    expect(scriptHref(fakeEntry)).toBe('/shakespeare/scripts/test-new-play/');
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test tests/unit/scripts-new-plays.test.ts
```

Expected: FAIL — either the enum rejects `'new-plays'` at collection load, or the `scriptHref` type narrows too strictly.

- [ ] **Step 3: Extend the enum in `src/content.config.ts`**

Find the `scripts` collection's `library` enum. Add `'new-plays'` as a new value at the end of the enum literal list. Full enum after edit:

```typescript
library: z.enum([
  'soliloquies',
  'scenes',
  'themes',
  'cuttings',
  'childrens-shakespeare',
  'childrens-plays',
  'teaching-modules',
  'new-plays', // Cycle 11 addition — /shakespeare/new-plays/ library
]),
```

Do NOT modify `src/lib/script-href.ts` — `CHILDRENS_LIBRARIES` set doesn't include `new-plays`, so the default branch already routes it to `/shakespeare/scripts/<slug>/`.

- [ ] **Step 4: Run test — expect PASS**

```bash
pnpm test tests/unit/scripts-new-plays.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 5: Verify full test + typecheck still green**

```bash
pnpm check && pnpm test
```

Expected: 0 errors; full suite passes (existing 13 script MDXs are unaffected by the additive enum change).

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts tests/unit/scripts-new-plays.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-11): extend scripts library enum with 'new-plays'

Adds the Alternative Four library slot per vision spec §2. scriptHref
routing works unchanged — new-plays falls to the default /shakespeare/
branch since it isn't in the CHILDRENS_LIBRARIES set.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Reorder Shakespeare sub-nav to spec §2 order

**Files:**
- Modify: `src/lib/shakespeare-nav.ts`
- Create: `tests/unit/shakespeare-nav.test.ts`

**Interfaces produced:**
- `SHAKESPEARE_NAV: ShakespeareNavItem[]` becomes 10 items in vision-spec-§2 order: Alternatives → Honoring Our Guides → Soliloquies → Scenes → Themes → Cuttings → Children's Shakespeare → Colloquial → New Plays → Ask Shakespeare.

**Interfaces consumed:**
- None — this is a self-contained reorder.

- [ ] **Step 1: Write the failing test at `tests/unit/shakespeare-nav.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { SHAKESPEARE_NAV } from '@/lib/shakespeare-nav';

describe('SHAKESPEARE_NAV — Cycle 11 reorder to vision spec §2', () => {
  it('has exactly 10 items', () => {
    expect(SHAKESPEARE_NAV).toHaveLength(10);
  });

  it('items appear in spec §2 client-numbered order', () => {
    const keys = SHAKESPEARE_NAV.map((n) => n.key);
    expect(keys).toEqual([
      'alternatives',
      'honoring-our-guides',
      'soliloquies',
      'scenes',
      'themes',
      'cuttings',
      'childrens-shakespeare',
      'colloquial',
      'new-plays',
      'ask-shakespeare',
    ]);
  });

  it('every href starts with /shakespeare/ and ends with /', () => {
    for (const item of SHAKESPEARE_NAV) {
      expect(item.href, item.label).toMatch(/^\/shakespeare\/.+\/$/);
    }
  });

  it('every key matches the tail segment of its href', () => {
    for (const item of SHAKESPEARE_NAV) {
      // strip /shakespeare/ prefix and trailing slash
      const tail = item.href.replace(/^\/shakespeare\//, '').replace(/\/$/, '');
      expect(tail, `${item.key} → ${item.href}`).toBe(item.key);
    }
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test tests/unit/shakespeare-nav.test.ts
```

Expected: FAIL — current nav has 9 items in a different order; `new-plays` not present.

- [ ] **Step 3: Rewrite `src/lib/shakespeare-nav.ts`**

Replace the `SHAKESPEARE_NAV` array with the 10-item spec §2 order:

```typescript
export interface ShakespeareNavItem {
  key: string;
  label: string;
  href: string;
}

export const SHAKESPEARE_NAV: ShakespeareNavItem[] = [
  { key: 'alternatives', label: 'Alternatives', href: '/shakespeare/alternatives/' },
  {
    key: 'honoring-our-guides',
    label: 'Honoring Our Guides',
    href: '/shakespeare/honoring-our-guides/',
  },
  { key: 'soliloquies', label: 'Soliloquies', href: '/shakespeare/soliloquies/' },
  { key: 'scenes', label: 'Scenes', href: '/shakespeare/scenes/' },
  { key: 'themes', label: 'Themes', href: '/shakespeare/themes/' },
  { key: 'cuttings', label: 'Cuttings', href: '/shakespeare/cuttings/' },
  {
    key: 'childrens-shakespeare',
    label: "Children's Shakespeare",
    href: '/shakespeare/childrens-shakespeare/',
  },
  { key: 'colloquial', label: 'Colloquial', href: '/shakespeare/colloquial/' },
  { key: 'new-plays', label: 'New Plays', href: '/shakespeare/new-plays/' },
  { key: 'ask-shakespeare', label: 'Ask Shakespeare', href: '/shakespeare/ask-shakespeare/' },
];
```

Note the label change: `"Children's"` (previous) → `"Children's Shakespeare"` (new, matches spec §2 wording and full label per CLAUDE.md vocabulary rule).

- [ ] **Step 4: Run test — expect PASS**

```bash
pnpm test tests/unit/shakespeare-nav.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 5: Verify no broken links to existing pages**

The `new-plays` href points to a route that doesn't exist yet (T9 creates it). Run the build to confirm this doesn't fail — Astro doesn't validate nav-href-to-route at build time; the 404 surfaces at runtime and Task 9 will resolve it.

```bash
pnpm build
```

Expected: build succeeds; check that no page's `subPage` prop breaks (the layout compares `subPage` to `key` strings, unaffected by array order).

- [ ] **Step 6: Commit**

```bash
git add src/lib/shakespeare-nav.ts tests/unit/shakespeare-nav.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-11): reorder Shakespeare sub-nav to vision spec §2 order

Nine → ten items. New order: Alternatives, Honoring Our Guides,
Soliloquies, Scenes, Themes, Cuttings, Children's Shakespeare,
Colloquial, New Plays, Ask Shakespeare — matches the client's numbered-
folder intent. New Plays href points to a route created in T9.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Prohibited-text guardrail — 7 new patterns from vision spec §6

**Files:**
- Modify: `scripts/check-prohibited-text.mjs`

**Interfaces produced:**
- `PATTERNS` array in `scripts/check-prohibited-text.mjs` grows by 7 entries.

- [ ] **Step 1: Read `scripts/check-prohibited-text.mjs` to understand PATTERNS shape**

Each entry is `{ phrase: string, regex: RegExp, reason: string }`. Regexes MUST have the `g` flag; MAY have `i`.

- [ ] **Step 2: Append the 7 new patterns to the `PATTERNS` array**

Add at the end of the array (before the closing `];`), preceded by a section comment:

```javascript
  // Shakespeare vision spec §6 — must-not-ship editorial artifacts.
  // See /Users/cnote/Downloads/dtfc-shakespeare-vision-spec.md §6 for source.
  {
    phrase: '(Desirae: use part of text for description of script sections ?)',
    regex: /\(Desirae:\s*use part of text for description of script sections\s*\?\s*\)/g,
    reason: 'Shakespeare §6: title parenthetical instruction from doc 1b',
  },
  {
    phrase: 'Shakspeare',
    regex: /\bShakspeare\b/g,
    reason: 'Shakespeare §6: title typo — canonical spelling is Shakespeare',
  },
  {
    phrase: 'Act V, scene ii, the murder scene, lines 1–117',
    regex: /Act V, scene ii, the murder scene, lines 1[–-]117/g,
    reason: 'Shakespeare §6: orphan footnote fragment from doc 2 (no referent)',
  },
  {
    phrase: 'TMAI (as visible provenance label)',
    regex: /\bTMAI\b/g,
    reason: 'Shakespeare §6: provenance label — move to frontmatter sourceDoc',
  },
  {
    phrase: 'Berstein',
    regex: /\bBerstein\b/g,
    reason: 'Shakespeare §6: composer name typo — canonical is Bernstein',
  },
  {
    phrase: 'WIthin',
    regex: /\bWIthin\b/g,
    reason: 'Shakespeare §6: source typo — canonical is Within',
  },
  {
    phrase: 'raw Drive mp4 URL',
    regex: /https?:\/\/drive\.google\.com\/[^\s)]*\.mp4/g,
    reason: 'Shakespeare §6: raw Drive mp4 URL — audio must be locally hosted',
  },
```

- [ ] **Step 3: Run the guardrail against shipped content to catch false positives**

```bash
pnpm check:prohibited
```

Expected: PASS with 0 violations. If a violation surfaces on shipped content:

- If it's a legitimate false positive (e.g., `TMAI` appears in an unrelated commit-log comment that happens to be scanned), narrow the regex.
- If it's a real violation (e.g., current Honoring page has `WIthin`), do NOT fix here — that fix belongs to Task 12 (Honoring rewrite). Note the violation for T12 and use `SKIP=WIthin pnpm check:prohibited` if the script supports env-based skips (check the script; if not, keep the pattern and let T12 fix the content). The Cycle 3 landing may need a similar hand-off.

Rationale: guardrail lands early to protect subsequent content-merge tasks, but never as a workaround for existing content — content tasks own the cleanup.

If a real violation blocks commit, add a temporary comment `// FIXME(cycle-11): pattern lands ahead of content fix in Task N` next to the offending pattern, then Task N removes the FIXME comment.

- [ ] **Step 4: Verify existing `pnpm test` still passes**

```bash
pnpm test
```

Expected: full suite green (the guardrail is a script, not a Vitest test).

- [ ] **Step 5: Commit**

```bash
git add scripts/check-prohibited-text.mjs
git commit -m "$(cat <<'EOF'
feat(cycle-11): extend prohibited-text guardrail with 7 patterns from Shakespeare vision spec §6

Adds detection for the title parenthetical instruction, 'Shakspeare' typo,
orphan footnote fragment, visible 'TMAI' provenance label, 'Berstein'/
'WIthin' typos, and raw Drive mp4 URLs. All source: vision spec §6
'Editorial Stripping Registry'.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Chuck / Charles Wilcox unification

**Files:**
- Modify: `src/data/timeline.json` (per-hit)
- Modify: any `src/content/scripts/*.mdx` with `Charles Wilcox` (per-hit)
- Modify: any other files surfaced by grep

**Interfaces produced:**
- Site-wide canonical name is "Chuck Wilcox" per vision spec §1.4 + Legacy convention.

- [ ] **Step 1: Grep for `Charles Wilcox` across the repo**

```bash
grep -rn "Charles Wilcox" --include="*.astro" --include="*.mdx" --include="*.md" --include="*.ts" --include="*.tsx" --include="*.json" src/ docs/ scripts/ tests/ public/
```

Expected: ~6 hits from the earlier survey — 4 in `src/data/timeline.json`, 2 in `src/content/scripts/*.mdx`, possibly others.

- [ ] **Step 2: Per-hit review — decide replace vs. preserve**

For each hit, read a line or two of context and classify:

- **Prose reference** (e.g., "Charles Wilcox joined the Caravan in 1972") → replace with "Chuck Wilcox".
- **Formal program credit** (e.g., "Adapted by Charles Wilcox, © 1985" or a copyright line quoting the byline as originally credited) → preserve. Note in a per-hit list for the client-review bundle (Task 16, bundle item #8).
- **Timeline entry participant name** → replace unless it appears in a `credits`/`copyright` field where the original byline convention matters.

If in doubt, replace to "Chuck Wilcox" and note the location in the bundle for client confirmation.

- [ ] **Step 3: Apply replacements**

For each prose hit, use `Edit` with the exact line context. Keep formal credits as-is; note them.

- [ ] **Step 4: Verify no `Charles Wilcox` hits remain (except intentional preservations)**

```bash
grep -rn "Charles Wilcox" --include="*.astro" --include="*.mdx" --include="*.md" --include="*.ts" --include="*.tsx" --include="*.json" src/ docs/ scripts/ tests/ public/
```

Any remaining hits should match the enumerated preservation list.

- [ ] **Step 5: Run tests + build to catch collateral breakage**

```bash
pnpm test && pnpm build
```

Expected: green. No test asserts on "Charles Wilcox" text.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore(cycle-11): unify Chuck / Charles Wilcox to "Chuck Wilcox" site-wide

Matches vision spec §1.4 and Legacy convention (14+ existing "Chuck" hits).
Formal program credits legitimately quoting "Charles Wilcox" preserved
and enumerated for client-review bundle (Task 16, bundle item #8).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

If bundle-item #8 has preserved hits, keep a running note in a scratch file (e.g., `/tmp/cycle-11-charles-preserved.md`) to feed Task 16.

---

## Task 5: `.callout-tradeoffs` styling in `src/styles/callouts.css`

**Files:**
- Modify: `src/styles/callouts.css`

**Interfaces produced:**
- `.callout-tradeoffs` CSS class — a warm-accent callout used to render TMAI's "Trade-offs to consider" blocks on Alternatives essay sections.

- [ ] **Step 1: Read `src/styles/callouts.css` to see existing callout patterns**

Cycle 10 shipped `.callout-tip`, `.callout-why`, `.callout-box`, `.callout-practical`. Match their visual family (border-left accent + tinted background + label pseudo-element).

- [ ] **Step 2: Append `.callout-tradeoffs` to `src/styles/callouts.css`**

```css
/* Trade-offs to consider — Shakespeare Alternatives essay (Cycle 11) */
.callout-tradeoffs {
  border-left: 4px solid var(--color-clay-500);
  background: color-mix(in srgb, var(--color-clay-500) 6%, transparent);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-card);
  margin-block: 1.25rem;
}

.callout-tradeoffs::before {
  content: 'Trade-offs to consider';
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-clay-700, var(--color-clay-500));
  margin-bottom: 0.5rem;
}

.callout-tradeoffs > p:last-child {
  margin-bottom: 0;
}
```

If `--color-clay-700` isn't in `src/styles/tokens.css`, the fallback to `--color-clay-500` keeps the label readable. Verify by scanning `src/styles/tokens.css` for `--color-clay-`.

- [ ] **Step 3: Verify build compiles CSS cleanly**

```bash
pnpm build
```

Expected: 0 errors. If Tailwind v4 or `@theme` layer complains about `color-mix()`, drop to a solid rgba fallback (`background: rgba(var(--color-clay-500-rgb), 0.06);` if tokens define the RGB variant; otherwise a hardcoded near-white with a color note).

- [ ] **Step 4: Visual smoke check (manual, one-time)**

Add a temporary test-use in `src/pages/shakespeare/alternatives.astro` inside a placeholder section:

```html
<div class="callout-tradeoffs">
  <p>Test callout content — remove before commit.</p>
</div>
```

Run `pnpm dev`, open `http://localhost:4321/shakespeare/alternatives/`, verify the callout renders with the label + accent. Remove the test div.

- [ ] **Step 5: Commit**

```bash
git add src/styles/callouts.css
git commit -m "$(cat <<'EOF'
feat(cycle-11): add .callout-tradeoffs class for TMAI trade-offs callouts

Warm-accent callout family matching Cycle 10's .callout-tip / .callout-why
patterns. Rendered on Themes and Cuttings sections of Alternatives essay
to preserve TMAI's trade-offs candor per vision spec §5.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: `AudioEmbed.astro` component

**Files:**
- Create: `src/components/shakespeare/AudioEmbed.astro`

**Interfaces produced:**
- `<AudioEmbed src={string} caption?={string} />` — renders a native `<audio controls preload="metadata">` inside a `<figure>` with an optional `<figcaption>`. `src` is the bare filename (e.g., `midsummah-pidgin-paka.mp4`); the component prepends `/audio/`.

- [ ] **Step 1: Create `src/components/shakespeare/AudioEmbed.astro`**

```astro
---
interface Props {
  /** Bare filename under public/audio/, e.g. "midsummah-pidgin-paka.mp4". */
  src: string;
  /** Optional caption rendered as <figcaption>. */
  caption?: string;
}

const { src, caption } = Astro.props;
const audioUrl = `/audio/${src}`;
---

<figure class="my-6">
  <audio
    controls
    preload="metadata"
    src={audioUrl}
    class="w-full max-w-2xl"
  >
    Your browser does not support the audio element.
    <a href={audioUrl}>Download the recording</a>.
  </audio>
  {caption && (
    <figcaption class="text-ink-700 mt-2 text-sm">{caption}</figcaption>
  )}
</figure>
```

Uses Tailwind utility classes for width + spacing; no custom CSS needed. `preload="metadata"` avoids downloading the file until playback starts.

- [ ] **Step 2: Verify build with a temporary use**

Add to `src/pages/shakespeare/colloquial/index.astro` temporarily:

```astro
---
import AudioEmbed from '@/components/shakespeare/AudioEmbed.astro';
---
<AudioEmbed src="test.mp4" caption="Test caption" />
```

Run `pnpm build`. Expected: 0 errors. The `<audio>` element won't play (file doesn't exist yet) but the render is correct. Remove the temporary use.

- [ ] **Step 3: Commit**

```bash
git add src/components/shakespeare/AudioEmbed.astro
git commit -m "$(cat <<'EOF'
feat(cycle-11): add AudioEmbed component for Colloquial audio recordings

Native <audio> inside <figure> + optional <figcaption>. Bare-filename src
prop; component prepends /audio/. Used by /shakespeare/colloquial/[slug]/
when entry.data.audio is set (T8).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Colloquial content — audio host, ʻokina fix, full-body import

**Files:**
- Create: `public/audio/midsummah-pidgin-paka.mp4` (fetched from Drive)
- Modify: `src/content/colloquial/one-uddah-midsummah.mdx` (frontmatter + body)
- Create: `tests/unit/colloquial-audio.test.ts`

**Interfaces produced:**
- `/audio/midsummah-pidgin-paka.mp4` — hosted MP3/MP4 audio file at the public URL `/audio/midsummah-pidgin-paka.mp4`.
- `one-uddah-midsummah.mdx` frontmatter gains `audio: 'midsummah-pidgin-paka.mp4'` and `audioCaption: '<caption>'`.
- Frontmatter title + subtitle + sourcePlay use ʻokina (U+02BB) in Hawaiian words, curly apostrophes (U+2019) in English.

**Interfaces consumed:**
- None — the frontmatter fields `audio` + `audioCaption` are already in the `colloquial` collection schema from Cycle 3.

- [ ] **Step 1: Locate Drive folder `4-Shakespeare` and get its ID**

Use the Google Drive MCP:

```
mcp__claude_ai_Google_Drive__search_files(query: "4-Shakespeare", folderOnly: true)
```

Note the folder's `id`. Then list its top-level docs:

```
mcp__claude_ai_Google_Drive__list_recent_files(folderId: <id>)
```

Locate the `Shakespeare Into Current Colloquial Language` doc (probable name; alternatives: "4 Shakespeare Into Colloquial Language" or similar) and any subfolder for audio.

- [ ] **Step 2: Locate the audio file in Drive**

The vision spec §3-doc-4 names the source file `Midʻsummah-Pidgin-Paka.mp4`. Search:

```
mcp__claude_ai_Google_Drive__search_files(query: "Midsummah Pidgin Paka")
```

Note the file's `id` and its exact filename in Drive.

- [ ] **Step 3: Download the audio to `public/audio/midsummah-pidgin-paka.mp4`**

The Google Drive MCP `download_file_content` may return base64 or a stream. Cameron will need to confirm the exact MCP call shape; a reasonable attempt:

```
mcp__claude_ai_Google_Drive__download_file_content(fileId: <id>)
```

Then write the returned binary to `public/audio/midsummah-pidgin-paka.mp4`. If the MCP returns base64, decode and write via `Bash`:

```bash
mkdir -p public/audio
# If MCP returned base64 to stdout, pipe through base64 -d:
# echo '<base64>' | base64 -d > public/audio/midsummah-pidgin-paka.mp4
```

If the MCP path doesn't work in this session, fall back to Cameron manually placing the file (ask via user prompt) — the ASCII-kebab-case filename `midsummah-pidgin-paka.mp4` is authoritative regardless of source filename casing.

- [ ] **Step 4: Verify the file exists and is a real MP4**

```bash
ls -lh public/audio/midsummah-pidgin-paka.mp4
file public/audio/midsummah-pidgin-paka.mp4
```

Expected: file size >100 KB (real audio, not empty); `file` reports `ISO Media, MP4 v2` or similar.

- [ ] **Step 5: Read the Drive doc 4 body text**

```
mcp__claude_ai_Google_Drive__read_file_content(fileId: <doc4-id>)
```

Extract the Paka/Puck epilogue passages — both the Hawaiian Pidgin version and the Shakespeare original (already present in the current MDX as a sample). If Drive doc 4 has additional passages beyond the epilogue, capture them all.

- [ ] **Step 6: Rewrite `src/content/colloquial/one-uddah-midsummah.mdx` frontmatter**

Current frontmatter uses curly apostrophes `’` in Hawaiian words — replace with ʻokina `ʻ` (U+02BB) in Hawaiian text; keep `’` in English:

```yaml
---
title: "One Uddah Midʻsummah"
subtitle: "Hawaiian Pidgin (Hawaiian Creole English) adaptation of A Midsummer Night’s Dream"
translator: 'Jackie Pualani Johnson'
sourcePlay: "A Midsummer Night’s Dream"
audio: 'midsummah-pidgin-paka.mp4'
audioCaption: 'Jackie Pualani Johnson performs the Paka (Puck) epilogue in Hawaiian Pidgin English.'
sample: false
---
```

Note: `Midʻsummah` uses U+02BB after `Mid`; `Midsummer Night’s Dream` uses U+2019 (curly apostrophe) for the possessive. These are semantically different characters and both must be preserved.

- [ ] **Step 7: Import the full body text from Drive**

Replace the current partial body with the full text from Drive doc 4. Preserve the `<SideBySide>` / `<Original>` / `<Colloquial>` structure that Cycle 3 established. If the Drive doc has multiple passages, add each as its own `<SideBySide>` block under a section H2 (e.g., `## Act V, Scene i — Epilogue`, `## Act III, Scene ii — Bottom's Transformation`).

Every Hawaiian ʻokina in the body text must be U+02BB (`ʻ`), not U+2019 (`’`) — pay particular attention to words like `iaʻu`, `ʻao`, `ʻokole`, etc. If the copy-paste from Drive corrupts these to plain ASCII apostrophes, fix character-by-character.

- [ ] **Step 8: Write the failing audio-existence test at `tests/unit/colloquial-audio.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { getCollection } from 'astro:content';

describe('colloquial collection — audio file existence (Cycle 11)', () => {
  it('every entry with audio: field points to a real file in public/audio/', async () => {
    const entries = await getCollection('colloquial');
    const withAudio = entries.filter((e) => Boolean(e.data.audio));
    expect(withAudio.length, 'at least one colloquial entry should have audio').toBeGreaterThan(0);
    for (const entry of withAudio) {
      const path = resolve(process.cwd(), 'public/audio', entry.data.audio!);
      expect(existsSync(path), `${entry.id} references audio ${entry.data.audio} which does not exist at ${path}`).toBe(true);
    }
  });

  it('one-uddah-midsummah entry sets audio to midsummah-pidgin-paka.mp4', async () => {
    const entries = await getCollection('colloquial');
    const uddah = entries.find((e) => e.id.startsWith('one-uddah-midsummah'));
    expect(uddah, 'one-uddah-midsummah entry present').toBeDefined();
    expect(uddah!.data.audio).toBe('midsummah-pidgin-paka.mp4');
  });
});
```

- [ ] **Step 9: Run test — expect PASS**

```bash
pnpm test tests/unit/colloquial-audio.test.ts
```

Expected: both tests pass (audio file present + frontmatter references it).

- [ ] **Step 10: Verify prohibited-text guardrail still passes**

```bash
pnpm check:prohibited
```

Expected: no violations from the imported body text. If the Drive doc contained any of the §6 forbidden phrases, strip them before commit.

- [ ] **Step 11: Verify full build + typecheck**

```bash
pnpm check && pnpm build && pnpm test
```

Expected: all green.

- [ ] **Step 12: Commit**

```bash
git add public/audio/midsummah-pidgin-paka.mp4 src/content/colloquial/one-uddah-midsummah.mdx tests/unit/colloquial-audio.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-11): host Pidgin Midʻsummah audio locally + full-body import + ʻokina typography

Downloads the Paka/Puck epilogue recording (Jackie Pualani Johnson) to
public/audio/ per vision spec §3-doc-4 requirement of local hosting.
Imports the full Drive-doc body text (no more sample stub). Corrects
Hawaiian ʻokina (U+02BB) in Pidgin words that Cycle 3 had rendered as
curly apostrophe (U+2019). Adds audio-existence test guardrail.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Colloquial detail page — AudioEmbed + transcript statement

**Files:**
- Modify: `src/pages/shakespeare/colloquial/[slug].astro`

**Interfaces consumed:**
- `<AudioEmbed src caption? />` from Task 6.
- `entry.data.audio` + `entry.data.audioCaption` from Task 7's frontmatter update.

- [ ] **Step 1: Read the current `src/pages/shakespeare/colloquial/[slug].astro`**

Identify where the `<SideBySideText>` (or equivalent body render) sits in the template.

- [ ] **Step 2: Add `AudioEmbed` import at the top of the frontmatter block**

```astro
import AudioEmbed from '@/components/shakespeare/AudioEmbed.astro';
```

- [ ] **Step 3: Add the conditional audio + transcript block above the body content**

```astro
{entry.data.audio && (
  <>
    <AudioEmbed src={entry.data.audio} caption={entry.data.audioCaption} />
    <p class="text-ink-700 text-sm max-w-prose">
      The side-by-side text below serves as an accessible transcript of the recording.
    </p>
  </>
)}
```

Position: between the page header (title + translator + source-play metadata) and the MDX body content. Above the first `<SideBySideText>`.

- [ ] **Step 4: Run `pnpm dev` and eyeball the page**

```bash
pnpm dev
```

Open `http://localhost:4321/shakespeare/colloquial/one-uddah-midsummah/`.

Verify:
- Audio player renders with controls
- Caption text visible below player
- Transcript statement paragraph visible
- Original/Colloquial side-by-side pair renders below
- ʻokina characters (`ʻ`) render correctly in the shipped fonts (visual eyeball — screenshot later in T15 assertion)

Take a screenshot of the ʻokina rendering; if the glyph shows as a "tofu" (missing-glyph rectangle), add a Hawaiian-orthography-safe fallback to the display + body font stacks in `src/styles/tokens.css` (e.g., append `"Charis SIL"` or another Unicode-complete Latin fallback to the font-family list). Document any font-stack change in the commit message.

- [ ] **Step 5: Verify SideBySideText mobile stacking behavior**

Resize the browser to 375px width (mobile viewport). Verify the two-column grid collapses so Original/Colloquial pairs stack **per-passage** (not interleaved line-by-line).

If interleaved: open `src/components/shakespeare/SideBySideText.astro` and inspect its grid CSS. Add a `@media (max-width: <breakpoint>)` rule to switch `grid-auto-flow` to `row` per `<dl>` item, or to render the pair as a stacked block on narrow viewports. Test the fix.

If the fix requires SideBySideText edits, include them in this commit — the concern is Colloquial page rendering, so the file is in-scope.

- [ ] **Step 6: Run `pnpm build && pnpm test`**

```bash
pnpm build && pnpm test
```

Expected: all green.

- [ ] **Step 7: Commit**

```bash
git add src/pages/shakespeare/colloquial/\[slug\].astro
# Include SideBySideText.astro if you edited it for mobile stacking
# Include tokens.css if you added an ʻokina-safe font fallback
git commit -m "$(cat <<'EOF'
feat(cycle-11): render Colloquial audio + transcript statement above side-by-side text

Adds <AudioEmbed> conditional render for colloquial entries with
`audio` frontmatter set, plus a transcript-statement paragraph
identifying the SideBySideText below as the accessible transcript.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: `/shakespeare/new-plays/` route + 2 placeholder scripts

**Files:**
- Create: `src/pages/shakespeare/new-plays/index.astro`
- Create: `src/content/scripts/three-finger-dick.mdx`
- Create: `src/content/scripts/shakespeares-sister.mdx`

**Interfaces consumed:**
- `library: 'new-plays'` from Task 1's enum extension.
- Existing `ScriptCard` component from `src/components/scripts/` and any existing library-index pattern.

**Interfaces produced:**
- Route `/shakespeare/new-plays/` exists and lists all `library: new-plays` script entries.
- Two placeholder scripts render at `/shakespeare/scripts/three-finger-dick/` and `/shakespeare/scripts/shakespeares-sister/` (via existing `[slug].astro` detail template).

- [ ] **Step 1: Read an existing library-index page for the pattern**

```bash
cat src/pages/shakespeare/scenes.astro
```

Note the imports, `getCollection('scripts')` filter shape, ScriptCard component usage, `subPage` prop passed to ShakespeareLayout.

- [ ] **Step 2: Create `src/content/scripts/three-finger-dick.mdx`**

```mdx
---
title: 'The Ballad of Three Finger Dick'
library: 'new-plays'
authors: ['Chuck Wilcox']
copyright: '© Chuck Wilcox'
minutes: 40
characters: []
sample: true
sourceDoc: 'Doc 1b — Alternative Four'
---

## About this script

Chuck Wilcox&rsquo;s Wild-West adaptation of a Shakespeare foundation &mdash; one of the two example scripts named in Alternative Four of [Creating Fearless Shakespeare Scripts](/shakespeare/alternatives/#alternative-four). Wilcox transposes setting, dialect, and stakes into a frontier idiom while keeping the underlying dramatic architecture Shakespeare&rsquo;s.

Chuck Wilcox is one of the guides honored in our Shakespeare section &mdash; see [his story on Honoring Our Guides](/shakespeare/honoring-our-guides/#chuck-wilcox) (Kent in Benedetti&rsquo;s *Lear*; co-inventor of Shakespeare on the Green with Richard Devin).

## Production Notes

Full production notes pending. Contact us via [Ask Shakespeare](/shakespeare/ask-shakespeare/#form) if you&rsquo;d like to see a copy of the script.

## Script

Full script pending &mdash; this is one of Chuck&rsquo;s in-progress New Plays contributions. Reach out through [Ask Shakespeare](/shakespeare/ask-shakespeare/#form) to request the current draft.
```

- [ ] **Step 3: Create `src/content/scripts/shakespeares-sister.mdx`**

```mdx
---
title: "Shakespeare's Sister"
library: 'new-plays'
authors: ['Marta Barnard']
copyright: '© Marta Barnard'
minutes: 40
characters: []
sample: true
sourceDoc: 'Doc 1b — Alternative Four'
---

## About this script

*Shakespeare&rsquo;s Sister* was written by Marta Barnard as a two-woman play &mdash; and then, when a Player fell out at the last minute, performed as a one-woman show. That improvised solo staging is pure Fearless Creativity: the choice to go on with what you have, and to let the constraint reshape the piece rather than cancel it.

Marta Barnard is one of the guides honored in our Shakespeare section &mdash; see [her story on Honoring Our Guides](/shakespeare/honoring-our-guides/#marta-barnard).

## Production Notes

Full production notes pending. The play works as either a two-woman staging or a one-woman solo. Contact us via [Ask Shakespeare](/shakespeare/ask-shakespeare/#form) for the current script.

## Script

Full script pending. Reach out through [Ask Shakespeare](/shakespeare/ask-shakespeare/#form) to request the draft.
```

- [ ] **Step 4: Create `src/pages/shakespeare/new-plays/index.astro`**

Model after `src/pages/shakespeare/scenes.astro` (or the closest library-index sibling). Structure:

```astro
---
import ShakespeareLayout from '@/layouts/ShakespeareLayout.astro';
import { getCollection } from 'astro:content';
import ScriptCard from '@/components/scripts/ScriptCard.astro';

const entries = (await getCollection('scripts')).filter(
  (e) => e.data.library === 'new-plays',
);
entries.sort((a, b) => a.data.title.localeCompare(b.data.title));
---

<ShakespeareLayout
  subPage="new-plays"
  eyebrow="Alternative Four"
  title="New Plays with a Shakespeare Foundation"
  description="Original scripts built on Shakespeare&rsquo;s dramatic architecture — new settings, new dialects, new stakes, faithful bones."
>
  <div class="max-w-prose">
    <p>
      The best-known example is <em>West Side Story</em> (Bernstein &amp; Sondheim), which
      transplants <em>Romeo and Juliet</em>&rsquo;s scaffolding into 1950s New York. Our
      section includes two DT:FC-family New Plays: Chuck Wilcox&rsquo;s Wild-West
      <em>The Ballad of Three Finger Dick</em>, and Marta Barnard&rsquo;s <em>Shakespeare&rsquo;s Sister</em>
      &mdash; a two-woman piece that was, one evening, performed by one.
    </p>
    <p>
      See <a href="/shakespeare/alternatives/#alternative-four">Alternative Four</a>
      of Creating Fearless Shakespeare Scripts for the full framing.
    </p>
  </div>

  {entries.length > 0 ? (
    <div class="mt-8 grid gap-6 sm:grid-cols-2">
      {entries.map((entry) => <ScriptCard entry={entry} />)}
    </div>
  ) : (
    <p class="mt-8 italic">No scripts yet.</p>
  )}
</ShakespeareLayout>
```

If `ScriptCard.astro` doesn't exist at that path, grep for the actual card component used by `scenes.astro` and use it. If library-index pages use a shared helper like `<LibraryIndex library="scenes" />`, reuse that pattern with `library="new-plays"`.

- [ ] **Step 5: Verify `pnpm build` succeeds**

```bash
pnpm build
```

Expected: build generates 3 new pages — `/shakespeare/new-plays/`, `/shakespeare/scripts/three-finger-dick/`, `/shakespeare/scripts/shakespeares-sister/`.

- [ ] **Step 6: Manual smoke — `pnpm dev`, open the new routes**

```bash
pnpm dev
```

Open in browser:
- `http://localhost:4321/shakespeare/new-plays/` — grid shows 2 cards
- `http://localhost:4321/shakespeare/scripts/three-finger-dick/` — detail renders with cross-link to Honoring/Chuck
- `http://localhost:4321/shakespeare/scripts/shakespeares-sister/` — detail renders with cross-link to Honoring/Marta

Verify sub-nav (from Task 2) shows "New Plays" 9th of 10 items and the active state highlights when on the new-plays route.

- [ ] **Step 7: Run full test suite**

```bash
pnpm test && pnpm build
```

Expected: green.

- [ ] **Step 8: Commit**

```bash
git add src/pages/shakespeare/new-plays/index.astro src/content/scripts/three-finger-dick.mdx src/content/scripts/shakespeares-sister.mdx
git commit -m "$(cat <<'EOF'
feat(cycle-11): add /shakespeare/new-plays/ route + 2 placeholder scripts

Alternative Four gets its library slot per vision spec §2. Two placeholders
ship: The Ballad of Three Finger Dick (Chuck Wilcox, Wild-West) and
Shakespeare's Sister (Marta Barnard, two-women → one-woman). Both cross-
link to Honoring Our Guides. Real scripts arrive from Drive when client
shares them (bundle item #4).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Landing page — proof point + TIP with Concept popovers

**Files:**
- Modify: `src/pages/shakespeare/index.astro`
- Possibly Create: `src/content/concepts/vocal-expression.mdx` (decision gate)

**Interfaces consumed:**
- Existing `<Concept id="…" />` component from `@/components/concept/Concept.astro` — reads shortDefinition from `src/content/concepts/<id>.mdx`.

**Decision gate:** `<Concept id="vocal-expression" />` requires `src/content/concepts/vocal-expression.mdx` to exist. Cycle 10 shipped 20 concepts; `vocal-expression` is NOT among them. Options:

- **Option A: Author a placeholder `vocal-expression.mdx` inline in this task.** Ships the TIP working immediately. Bundle item #10 asks client to review/edit the placeholder (matches Cycle 10 precedent for `icons.mdx` — `draft: true`).
- **Option B: Render the TIP with a `(pending)` chip instead of a live `<Concept>` popover for `vocal-expression`.** Cheaper but the doctrine block is partially unwired.

**Default:** Option A — author placeholder with `draft: true` and add to client-review bundle. This step's expanded checklist below assumes A.

- [ ] **Step 1: Create `src/content/concepts/vocal-expression.mdx` (placeholder)**

```mdx
---
name: 'Vocal Expression'
slug: 'vocal-expression'
shortDefinition: 'The Theatre-Games category that trains ear, breath, and diction &mdash; the warmup foundation for taking on Shakespeare&rsquo;s language.'
icon: 'placeholder'
related: ['warmup', 'theatre-games']
draft: true
---

## Overview

_Placeholder entry &mdash; awaits source-doc content or client draft. Referenced from the Shakespeare landing&rsquo;s &ldquo;Leave the Language&rdquo; doctrine block as the recommended Warmup category for approaching Shakespeare._

Vocal Expression Theatre Games are the practice ground for the diction, intonation, and breath support that let novice Players &mdash; including grade schoolers &mdash; carry Shakespeare&rsquo;s rhythm and content by voice alone. Use them as [Warmup](/resource-center/warmup/) before Shakespeare rehearsal.

## Related resources

See [Theatre Games](/resource-center/theatre-games/) and [Warmup](/resource-center/warmup/).
```

- [ ] **Step 2: Verify the concept validates**

```bash
pnpm check
```

Expected: 0 errors; the collection loads the new entry.

- [ ] **Step 3: Edit `src/pages/shakespeare/index.astro` — enrich the Leave the Language aside**

Current aside (~lines 40-50):

```astro
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
```

Replace with (removing the `CLIENT REVIEW` comment now that this cycle owns the enrichment):

```astro
<aside class="border-clay-500/25 bg-clay-500/5 mt-8 rounded-[var(--radius-card)] border-l-4 p-5">
  <h2 class="font-display text-ink-900 text-xl">Leave the Language as Shakespeare&rsquo;s Own.</h2>
  <p class="text-ink-700 mt-2 max-w-prose text-base leading-relaxed">
    When Players of any age step into Shakespeare&rsquo;s words as written, they train ear, breath, and
    imagination together. DT:FC does not paraphrase or &ldquo;translate&rdquo; the original in performance
    &mdash; the language itself does the teaching. Roughly 37 plays survive; every one of them is
    still being staged somewhere, more than four centuries later.
  </p>
  <blockquote class="border-clay-500 mt-4 border-l-2 pl-4 italic text-ink-800">
    &ldquo;What translation did you use?&rdquo;
    <footer class="text-ink-600 mt-1 text-sm not-italic">
      &mdash; a repeated question from teachers after watching Players do the real thing. Answer: none.
    </footer>
  </blockquote>
  <div class="callout-tip mt-4">
    <strong>TIP:</strong>{' '}
    Use <Concept id="vocal-expression" /> Theatre Games as <Concept id="warmup" /> before Shakespeare rehearsal.
  </div>
  <p class="text-ink-700 mt-4 max-w-prose text-sm">
    (For readers who want a bridge into the words, see our{' '}
    <a href="/shakespeare/colloquial/" class="hover:text-clay-500">Colloquial pairings</a>{' '}
    alongside the originals.)
  </p>
</aside>
```

Import `Concept` at the top of the frontmatter block if not already imported:

```astro
import Concept from '@/components/concept/Concept.astro';
```

- [ ] **Step 4: Verify `pnpm build` and manual eyeball**

```bash
pnpm build && pnpm dev
```

Open `http://localhost:4321/shakespeare/`. Verify:
- Aside renders with the doctrine heading
- The 37-plays / four-centuries sentence is present
- The proof-point blockquote renders in italic with the attribution footer
- The `.callout-tip` div renders with both `<Concept>` refs styled as popovers
- Clicking a Concept ref opens the native popover with the shortDefinition

- [ ] **Step 5: Run tests**

```bash
pnpm test
```

Expected: green.

- [ ] **Step 6: Commit**

```bash
git add src/content/concepts/vocal-expression.mdx src/pages/shakespeare/index.astro
git commit -m "$(cat <<'EOF'
feat(cycle-11): landing doctrine block gets "What translation did you use?" proof point + Concept-icon TIP

Enriches the Leave the Language aside with vision spec §1.2 requirements:
the 37-plays survival note, the teachers' astonished-question proof point,
and a TIP callout referencing <Concept id="vocal-expression" /> and
<Concept id="warmup" /> as live popovers.

Adds a placeholder vocal-expression.mdx (draft:true) since the entry
wasn't shipped in Cycle 10. Awaits client edit or replacement — see
client-review bundle item #10.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Alternatives essay — full content merge from Drive doc 1b

**Files:**
- Modify: `src/pages/shakespeare/alternatives.astro`

**Interfaces consumed:**
- `.callout-tradeoffs` from Task 5
- `<Concept>` component (already imported per T10)
- New Plays cross-links from Task 9

**Interfaces produced:**
- Full essay body faithful to Drive doc 1b: intro promise, Leave the Language doctrine block (mirrors landing), 4 Alternatives with deep-links to library routes, two "Trade-offs to consider" callouts (Themes, Cuttings), Contact CTA at end.

- [ ] **Step 1: Read Drive doc 1b via MCP**

```
mcp__claude_ai_Google_Drive__search_files(query: "1b Shakespeare Script Alternatives")
mcp__claude_ai_Google_Drive__read_file_content(fileId: <id>)
```

Capture the full text. Note passages for each Alternative + the doctrine block + the Will Power / string-of-beads / theme-list / cuttings-method / new-plays paragraphs.

- [ ] **Step 2: Read the current `src/pages/shakespeare/alternatives.astro`**

Understand the current structure (hero, subPage prop, existing content stubs). Preserve the frontmatter and hero; rewrite the body.

- [ ] **Step 3: Rewrite the body per this outline**

Structure (each section is an `<section>` with `id={anchor}` for deep-linking from cards + Alternative-Four anchors):

```
<section id="promise">
  Intro promise from doc 1b: entertains and educates; alternatives for
  when a whole play is too long or excludes players; "Example scripts
  are provided."
</section>

<section id="doctrine">
  <h2>Leave the Language as Shakespeare&rsquo;s Own</h2>
  Full doctrine block (mirrors landing so this page stands alone).
  Include the 37-plays survival note. Include the "What translation
  did you use?" blockquote with attribution.
  <div class="callout-tip">
    TIP: Use <Concept id="vocal-expression" /> Theatre Games as
    <Concept id="warmup" />.
  </div>
</section>

<section id="alternative-one">
  <h2>Alternative One — Scenes</h2>
  Body prose from doc 1b Alternative One passage.

  Include: Colorado elementary-schools Will Power story with
  <a href={willPowerArticleUrl}>the Will Power article</a> link
  (locally hosted per Cycle 9 T7; if not yet hosted, use `(pending)` chip
  pattern matching PRC Casting entry).

  Include the "string of beads" variant with 3 worked examples:
  Falstaff; R&J with the Nurse as narrator; Midsummer via Lovers/Mechanicals.

  <a href="/shakespeare/scenes/">Browse Scenes →</a>
</section>

<section id="alternative-two">
  <h2>Alternative Two — Scenes Around a Theme</h2>
  Body prose. Include the 8-theme list (Battle of the Sexes;
  Magic and the Supernatural; Fools and Fooling; Ruler and the Ruled;
  Rogues and Villains; The Generation Gap; Bullies (CU); Falstaff).

  Include no-narration performance practice: hat/headscarf character
  signals, optional easel signboards, "Consider the audience."

  Pull-quote: "Experiment. Shakespeare did."

  <div class="callout-tradeoffs">
    From the TMAI essay: cast in this pattern, you are stuck with a
    narrator function — a "play" that doesn't really exist in
    Shakespeare's lexicon.
  </div>

  <a href="/shakespeare/themes/">Browse Themes →</a>
</section>

<section id="alternative-three">
  <h2>Alternative Three — Cuttings</h2>
  Body prose: the method (tell the play in three minutes; read a summary;
  list scenes; mercilessly cut).

  Chuck Wilcox is providing plays he cut from his St. Mary's Academy
  teaching — more scripts are being prepared over time.

  <div class="callout-tradeoffs">
    From the TMAI essay: a cutting creates yet another reality that is
    not truly Shakespeare — the trade-off you accept for a 40-minute
    playable version.
  </div>

  <a href="/shakespeare/cuttings/">Browse Cuttings →</a>
</section>

<section id="alternative-four">
  <h2>Alternative Four — New Plays with a Shakespeare Foundation</h2>
  Body prose: the best-known example is <em>West Side Story</em>
  (Bernstein & Sondheim), which transplants <em>Romeo and Juliet</em>'s
  scaffolding into 1950s New York.

  Two DT:FC-family New Plays:
  - <em>The Ballad of Three Finger Dick</em> by Chuck Wilcox — a
    Wild-West setting-and-dialect adaptation (cross-link:
    <a href="/shakespeare/honoring-our-guides/#chuck-wilcox">
    Chuck's story on Honoring Our Guides</a>).
  - <em>Shakespeare's Sister</em> by Marta Barnard — written for two
    women, performed at the last minute as a one-woman show (cross-link:
    <a href="/shakespeare/honoring-our-guides/#marta-barnard">
    Marta's story on Honoring Our Guides</a>).

  <a href="/shakespeare/new-plays/">Browse New Plays →</a>
</section>

<section id="contact">
  <div class="callout-tip">
    <strong>Want to see a script?</strong> Reach out through
    <a href="/shakespeare/ask-shakespeare/#form">Ask Shakespeare</a> —
    we're glad to share cuts, scenes, and works-in-progress.
  </div>
</section>
```

Write in DT:FC voice (warm, playful, encouraging, exclamation-friendly per CLAUDE.md). Use `&rsquo;` for possessives in prose. Preserve source's specific phrasings when they land well ("mercilessly cut"; "Experiment. Shakespeare did."; "Consider the audience"); paraphrase where source doc phrasing is awkward on screen.

**Bernstein spelling:** the source doc has "Berstein"; write "Bernstein". Guardrail from T3 catches drift.

**Will Power article link:** use the locally-hosted asset path from Legacy/PRC's usage. Grep `will-power` in existing pages to find the canonical URL. If unhosted per Cycle 9 T7, render as `(pending)` chip.

- [ ] **Step 4: Verify no forbidden patterns in the new body**

```bash
pnpm check:prohibited
```

Expected: 0 violations.

- [ ] **Step 5: Verify build + typecheck**

```bash
pnpm check && pnpm build
```

Expected: 0 errors. The page renders at `/shakespeare/alternatives/`.

- [ ] **Step 6: Manual smoke — `pnpm dev`**

Open `http://localhost:4321/shakespeare/alternatives/`. Verify:
- All 5 `<section>` anchors work (test each deep-link)
- Doctrine block renders with Concept popovers
- Two `.callout-tradeoffs` blocks visible on Themes + Cuttings
- All 4 "Browse [X] →" links go to library pages
- Contact CTA links to `/shakespeare/ask-shakespeare/#form`

- [ ] **Step 7: Run full test suite**

```bash
pnpm test && pnpm build
```

Expected: green.

- [ ] **Step 8: Commit**

```bash
git add src/pages/shakespeare/alternatives.astro
git commit -m "$(cat <<'EOF'
feat(cycle-11): full Alternatives essay body from Drive doc 1b

Wholesale rewrite per vision spec §3 doc 1b:
- Intro promise + Leave the Language doctrine block (mirrors landing)
- Alternative One (Scenes) with Will Power story + string-of-beads
- Alternative Two (Themes) with 8-theme list + no-narration practice
  + TMAI trade-offs callout (narrator function)
- Alternative Three (Cuttings) with method + Chuck's in-progress note
  + TMAI trade-offs callout ("not truly Shakespeare")
- Alternative Four (New Plays) with Bernstein spelling fix + both
  DT:FC-family scripts cross-linked to Honoring Our Guides
- Contact CTA → Ask Shakespeare form

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Honoring Our Guides — full content merge from Drive doc 3 + Legacy cross-links

**Files:**
- Modify: `src/pages/shakespeare/honoring-our-guides.astro`
- Create: `tests/unit/honoring-cross-links.test.ts`

**Interfaces produced:**
- Full guide-by-guide honoring page faithful to Drive doc 3, with inline cross-links to Legacy (`/legacy/founders`, `/legacy/founders/#chuck-wilcox`, `/legacy/essays/theatre-influences/#asian-theatre`).

- [ ] **Step 1: Read Drive doc 3 via MCP**

```
mcp__claude_ai_Google_Drive__search_files(query: "2 Honoring our Guides")
mcp__claude_ai_Google_Drive__read_file_content(fileId: <id>)
```

- [ ] **Step 2: Locate the shared Honoring opening sentence**

Grep other Honoring pages for the shared opening sentence pattern (site-wide identical wording per CLAUDE.md):

```bash
grep -A 3 "Honoring" src/pages/legacy/honoring*.astro src/pages/community/honoring*.astro 2>/dev/null | head -30
grep -A 3 "gratitude" src/pages/**/honoring*.astro 2>/dev/null | head -30
```

Copy the exact sentence verbatim for use in the new page's opening.

- [ ] **Step 3: Read the current `src/pages/shakespeare/honoring-our-guides.astro`**

Preserve the frontmatter, hero, and layout wrapper. Rewrite the body.

- [ ] **Step 4: Rewrite the body per this outline**

```astro
<article class="prose">
  <p>{sharedHonoringOpeningSentence}</p>

  <section id="shakespeare">
    <h2>William Shakespeare</h2>
    Body prose from doc 3 — Shakespeare himself, framed as first among guides.
  </section>

  <section id="colorado-shakespeare-festival">
    <h2>The Colorado Shakespeare Festival</h2>
    Body from doc 3.
  </section>

  <section id="the-caravan">
    <h2>The Caravan</h2>
    Body from doc 3.
  </section>

  <section id="daniel-yang">
    <h2>Daniel S.P. Yang</h2>
    Body from doc 3 — Asian Theatre influence, now translating Shakespeare
    into Chinese.
    <p>
      Yang's Asian Theatre influence shaped DT:FC's approach to staging —
      see <a href="/legacy/essays/theatre-influences/#asian-theatre">
      the Asian Theatre column in Legacy's Theatre Influences chart</a>.
    </p>
  </section>

  <section id="chuck-wilcox">
    <h2>Chuck Wilcox</h2>
    Body from doc 3 — Kent in Benedetti's *Lear*; the stroke; co-inventing
    Shakespeare on the Green with Richard Devin, visiting patrons as
    Will Shakespeare.
    <p>
      See <a href="/legacy/founders/#chuck-wilcox">Chuck's fuller story on
      the Founders page</a>.
    </p>
  </section>

  <section id="melinda-scott">
    <h2>Melinda Scott</h2>
    Body from doc 3.
  </section>

  <section id="marta-barnard">
    <h2>Marta Barnard</h2>
    Body from doc 3 — including reference to <em>Shakespeare's Sister</em>
    (linked to the New Plays entry from T9).
  </section>

  <section id="amanda-giguere">
    <h2>Amanda Giguere</h2>
    Current CSF education leader; published <em>Shakespeare and Violence
    Prevention: A Practical Handbook for Educators</em>, June 2025.
    Body from doc 3.
  </section>

  <section id="joe-craft">
    <h2>Joe Craft</h2>
    Fifty years in Denver Public Schools; founded the DPS Shakespeare
    Festival; third steward of the Folger Shakespeare Library.
    Body from doc 3.
  </section>

  <footer>
    <p>
      Many of these guides also appear in the fuller DT:FC lineage —
      see <a href="/legacy/founders">Legacy → Founders</a> for the wider
      story.
    </p>
  </footer>
</article>
```

**Rules for the body writing:**
- Every credibility-layer fact (dates, titles, book titles) verbatim from source.
- Chuck's stroke paragraph verbatim from source where possible — client-review-flagged for sensitivity re-read per bundle item #1.
- Typo fix: any `WIthin` from source → `Within`.
- Every H2 heading gets a slug-matching `id` for deep-links.
- Use `&rsquo;` for possessives; use "Chuck Wilcox" not "Charles Wilcox" per Task 4 canonicalization.

- [ ] **Step 5: Write the failing cross-link test at `tests/unit/honoring-cross-links.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const HONORING_PATH = resolve(
  process.cwd(),
  'src/pages/shakespeare/honoring-our-guides.astro',
);

describe('Shakespeare Honoring Our Guides — cross-links (Cycle 11)', () => {
  const source = readFileSync(HONORING_PATH, 'utf-8');

  it('links to /legacy/founders', () => {
    expect(source).toMatch(/href=["']\/legacy\/founders["']/);
  });

  it('links to /legacy/founders/#chuck-wilcox (Chuck section)', () => {
    expect(source).toMatch(/href=["']\/legacy\/founders\/#chuck-wilcox["']/);
  });

  it('links to /legacy/essays/theatre-influences/#asian-theatre (Yang section)', () => {
    expect(source).toMatch(
      /href=["']\/legacy\/essays\/theatre-influences\/#asian-theatre["']/,
    );
  });

  it('has an anchor for #chuck-wilcox on this page', () => {
    expect(source).toMatch(/id=["']chuck-wilcox["']/);
  });

  it('has an anchor for #marta-barnard on this page', () => {
    expect(source).toMatch(/id=["']marta-barnard["']/);
  });
});
```

- [ ] **Step 6: Run test — expect PASS (once step 4 body includes the anchors + links)**

```bash
pnpm test tests/unit/honoring-cross-links.test.ts
```

Expected: 5 tests pass.

- [ ] **Step 7: Verify no forbidden patterns**

```bash
pnpm check:prohibited
```

Expected: 0 violations. If `WIthin` shows up (source drift), fix it in the body.

- [ ] **Step 8: Verify links resolve (build + manual click-through)**

```bash
pnpm build && pnpm dev
```

Open `http://localhost:4321/shakespeare/honoring-our-guides/` and click each cross-link. Verify:
- `/legacy/founders` → renders Legacy Founders page
- `/legacy/founders/#chuck-wilcox` → scrolls to Chuck's section
- `/legacy/essays/theatre-influences/#asian-theatre` → scrolls to Asian Theatre column

If the Asian Theatre anchor doesn't exist on the Legacy essay, either (a) add an `id` there (small edit, in-scope), or (b) drop to `/legacy/essays/theatre-influences/` sans anchor and note in the client-review bundle.

- [ ] **Step 9: Run full test suite**

```bash
pnpm test && pnpm build
```

Expected: green.

- [ ] **Step 10: Commit**

```bash
git add src/pages/shakespeare/honoring-our-guides.astro tests/unit/honoring-cross-links.test.ts
git commit -m "$(cat <<'EOF'
feat(cycle-11): full Honoring Our Guides body from Drive doc 3 + Legacy cross-links

Wholesale rewrite per vision spec §3 doc 3:
- Shared opening gratitude sentence (site-wide identical)
- 9 guides in doc-3 order with specific credibility-layer facts:
  CSF, Caravan, Yang (Asian Theatre → Chinese translation),
  Chuck (Benedetti's Lear, stroke, Shakespeare on the Green with
  Richard Devin), Melinda Scott, Marta Barnard, Amanda Giguere
  (Shakespeare and Violence Prevention, June 2025), Joe Craft
  (50 yrs DPS + Folger third stewardship)
- Cross-links: /legacy/founders, /legacy/founders/#chuck-wilcox,
  /legacy/essays/theatre-influences/#asian-theatre
- Chuck stroke paragraph flagged in client-review bundle item #1
  for sensitivity re-read
- WIthin → Within typo fix

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Library-page blurbs (Scenes, Themes, Cuttings, Soliloquies) + TMAI merges

**Files:**
- Modify: `src/pages/shakespeare/scenes.astro`
- Modify: `src/pages/shakespeare/themes.astro`
- Modify: `src/pages/shakespeare/cuttings.astro`
- Modify: `src/pages/shakespeare/soliloquies.astro`

**Interfaces consumed:**
- `.callout-tradeoffs` from T5 (already used in Alternatives; here we reuse for TMAI merges on themes/cuttings)

- [ ] **Step 1: Read each library page's current structure**

```bash
cat src/pages/shakespeare/scenes.astro
cat src/pages/shakespeare/themes.astro
cat src/pages/shakespeare/cuttings.astro
cat src/pages/shakespeare/soliloquies.astro
```

Locate where the library grid renders and where a blurb block would naturally sit (above the grid).

- [ ] **Step 2: Add Alternative One blurb to `scenes.astro`**

Source: Drive doc 1b Alternative One passage, condensed to 2-3 sentences. Insert above the grid:

```astro
<div class="max-w-prose">
  <p>
    A single Shakespeare scene &mdash; done well, in the original language &mdash; is a
    complete DT:FC experience. Scenes carry the dramatic architecture that novice Players
    need to feel the play breathe; they are short enough to rehearse deeply and structured
    enough that the ensemble stays fully cast throughout.
  </p>
  <p>
    See <a href="/shakespeare/alternatives/#alternative-one">Alternative One</a> of the
    Alternatives essay for the full framing, including the &ldquo;string of beads&rdquo;
    variant and the Colorado Will Power story.
  </p>
</div>
```

- [ ] **Step 3: Add Alternative Two blurb + TMAI scene-selection callout to `themes.astro`**

Blurb (above grid):

```astro
<div class="max-w-prose">
  <p>
    A themed montage &mdash; scenes from several plays around one idea &mdash; lets Players
    of many ages perform Shakespeare together while keeping every part vivid. Themes we
    have used: Battle of the Sexes; Magic and the Supernatural; Fools and Fooling; Ruler
    and the Ruled; Rogues and Villains; The Generation Gap; Bullies (CU); Falstaff.
  </p>
  <p>
    See <a href="/shakespeare/alternatives/#alternative-two">Alternative Two</a> of the
    Alternatives essay for the no-narration performance practice (hat/headscarf character
    signals, optional easel signboards) and the &ldquo;Consider the audience&rdquo;
    caution.
  </p>
</div>
```

TMAI scene-selection method callout (below grid):

```astro
<div class="callout-tip max-w-prose mt-8">
  <strong>Choosing scenes:</strong> Start from what your Players already have memorized
  from other work; shave scenes internally; eliminate extraneous characters. That way you
  arrive at a themed montage that feels rehearsed, not assembled.
</div>
```

- [ ] **Step 4: Add Alternative Three blurb + TMAI credentials + Chuck's in-progress note to `cuttings.astro`**

Blurb (above grid):

```astro
<div class="max-w-prose">
  <p>
    A cutting &mdash; a 40-minute playable version of a full Shakespeare play &mdash; is
    what a Facilitator makes when the whole thing is too long for a Players&rsquo; season
    but the arc of the play matters. The method is straightforward and honest: tell the
    play in three minutes; read the summary; list the scenes; then mercilessly cut.
  </p>
  <p>
    See <a href="/shakespeare/alternatives/#alternative-three">Alternative Three</a> of
    the Alternatives essay for the method in full.
  </p>
</div>
```

TMAI 40-minute credentials callout (below grid):

```astro
<div class="callout-tip max-w-prose mt-8">
  <strong>We have successfully performed 40-minute versions of:</strong> Romeo and Juliet;
  Lear; A Midsummer Night&rsquo;s Dream (primarily focused on the Mechanicals).
</div>
```

Chuck's in-progress note (below the TMAI callout):

```astro
<p class="max-w-prose text-ink-700 mt-4 italic">
  Chuck Wilcox is providing plays he cut from his St. Mary&rsquo;s Academy teaching &mdash;
  more cuttings are being prepared over time. If you&rsquo;d like a look at what&rsquo;s
  currently available, reach out through <a href="/shakespeare/ask-shakespeare/#form">Ask
  Shakespeare</a>.
</p>
```

- [ ] **Step 5: Add drafted blurb + CLIENT REVIEW marker to `soliloquies.astro`**

No Alternative passage exists for Soliloquies. Draft:

```astro
{/* CLIENT REVIEW: Soliloquies blurb drafted (Cycle 11) — no Alternative passage
    exists in Drive doc 1b for this library. Awaits client edit or approval.
    See docs/client-reviews/2026-08-13-cycle11-shakespeare-review.md item #2. */}
<div class="max-w-prose">
  <p>
    A soliloquy is a Player&rsquo;s solo pass through a moment of decision or discovery.
    It is one of the most compact ways into Shakespeare&rsquo;s language: no scene
    partners to coordinate, no cast to schedule, just breath and text. This library
    collects individual solo speeches suitable for K-through-adult Players.
  </p>
</div>
```

- [ ] **Step 6: Verify no forbidden patterns**

```bash
pnpm check:prohibited
```

Expected: 0 violations.

- [ ] **Step 7: Build + manual eyeball**

```bash
pnpm build && pnpm dev
```

Open each library page and verify blurb + callouts + Chuck note render correctly.

- [ ] **Step 8: Run tests**

```bash
pnpm test
```

Expected: green.

- [ ] **Step 9: Commit**

```bash
git add src/pages/shakespeare/scenes.astro src/pages/shakespeare/themes.astro src/pages/shakespeare/cuttings.astro src/pages/shakespeare/soliloquies.astro
git commit -m "$(cat <<'EOF'
feat(cycle-11): library-page blurbs sourced from Alternative passages + TMAI merges

Per vision spec §4:
- Scenes: Alternative One passage
- Themes: Alternative Two passage + TMAI scene-selection-method callout
- Cuttings: Alternative Three passage + TMAI 40-min credentials + Chuck's
  in-progress note (honest, no fabricated inventory)
- Soliloquies: drafted blurb with CLIENT REVIEW marker (no Alt passage
  exists; bundle item #2 asks for client approval)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Children's Shakespeare — bidirectional cross-links with Children's Theatre

**Files:**
- Modify: `src/pages/shakespeare/childrens-shakespeare.astro`
- Modify: `src/pages/childrens-theatre/index.astro`

- [ ] **Step 1: Read both pages to find natural insertion points**

```bash
cat src/pages/shakespeare/childrens-shakespeare.astro
cat src/pages/childrens-theatre/index.astro
```

Identify where a "See also" or "Related" block would sit naturally — typically near the bottom of the main content, above the footer.

- [ ] **Step 2: Add cross-link block to `childrens-shakespeare.astro`**

Insert near the bottom of the main content:

```astro
<aside class="border-clay-500/25 bg-clay-500/5 mt-10 rounded-[var(--radius-card)] border-l-4 p-5 max-w-prose">
  <h2 class="font-display text-ink-900 text-lg">Related: Children&rsquo;s Theatre</h2>
  <p class="text-ink-700 mt-2 text-base">
    Our <a href="/childrens-theatre/" class="hover:text-clay-500">Children&rsquo;s Theatre section</a>
    houses the DT:FC-family plays written for young Players &mdash; including AI-cowritten
    pieces, teaching modules, and the Wayfarer&rsquo;s Journey wheel that structures how
    Players find their way into character.
  </p>
</aside>
```

- [ ] **Step 3: Add reverse cross-link block to `childrens-theatre/index.astro`**

Insert in a symmetric position on the Children's Theatre landing:

```astro
<aside class="border-clay-500/25 bg-clay-500/5 mt-10 rounded-[var(--radius-card)] border-l-4 p-5 max-w-prose">
  <h2 class="font-display text-ink-900 text-lg">Related: Children&rsquo;s Shakespeare</h2>
  <p class="text-ink-700 mt-2 text-base">
    Bringing Shakespeare to young Players? See our
    <a href="/shakespeare/childrens-shakespeare/" class="hover:text-clay-500">
    Children&rsquo;s Shakespeare library</a> for age-appropriate scripts drawn from
    Shakespeare&rsquo;s plays &mdash; scenes, cuttings, and full short adaptations.
  </p>
</aside>
```

- [ ] **Step 4: Verify build + manual click-through**

```bash
pnpm build && pnpm dev
```

Open each page and click the cross-links; verify round-trip navigation works.

- [ ] **Step 5: Run tests**

```bash
pnpm test
```

Expected: green.

- [ ] **Step 6: Commit**

```bash
git add src/pages/shakespeare/childrens-shakespeare.astro src/pages/childrens-theatre/index.astro
git commit -m "$(cat <<'EOF'
feat(cycle-11): bidirectional cross-links between Children's Shakespeare and Children's Theatre

Vision spec §5 cross-section contract: both landings gain a "Related"
aside pointing to the other. Closes the round-trip navigation loop for
Facilitators working with young Players on Shakespeare vs. DT:FC-family
plays.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Playwright smoke test extensions + axe scans

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`

**Interfaces consumed:**
- Existing test infrastructure (Playwright test runner, `@axe-core/playwright`, checkpoint pattern)

- [ ] **Step 1: Read `tests/e2e/smoke.spec.ts` to see current pattern**

```bash
cat tests/e2e/smoke.spec.ts
```

Identify the existing checkpoint pattern — how checkpoints are structured, how axe is invoked, how navigation is done. Match that pattern.

- [ ] **Step 2: Add 5 new checkpoints inside the existing suite**

Insert as new `test.step()` calls (or equivalent per the file's existing pattern):

```typescript
test.step('shakespeare landing — doctrine block + Concept popovers', async () => {
  await page.goto('/shakespeare/');
  await expect(
    page.getByRole('heading', { name: /Leave the Language as Shakespeare/ }),
  ).toBeVisible();
  await expect(page.getByText(/What translation did you use\?/)).toBeVisible();
  // Concept popover markers — the popover uses [popovertarget] on the trigger button
  const conceptButtons = page.locator('[popovertarget]');
  expect(await conceptButtons.count()).toBeGreaterThanOrEqual(2);
  await runAxe(page); // or the axe checkpoint helper used elsewhere in this file
});

test.step('shakespeare new-plays landing — 2 cards + a11y', async () => {
  await page.goto('/shakespeare/new-plays/');
  await expect(page.getByRole('heading', { name: /Three Finger Dick/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Shakespeare's Sister/ })).toBeVisible();
  await runAxe(page);
});

test.step('shakespeare colloquial — audio player + transcript statement', async () => {
  await page.goto('/shakespeare/colloquial/one-uddah-midsummah/');
  const audio = page.locator('audio[src="/audio/midsummah-pidgin-paka.mp4"]');
  await expect(audio).toBeVisible();
  await expect(page.getByText(/accessible transcript/)).toBeVisible();
  // ʻokina character (U+02BB) render check — the title should contain the character
  await expect(page.locator('h1, h2, title').first()).toContainText('Midʻsummah');
  await runAxe(page);
});

test.step('shakespeare honoring — Legacy cross-links resolvable', async () => {
  await page.goto('/shakespeare/honoring-our-guides/');
  const legacyLink = page.locator('a[href="/legacy/founders"]').first();
  await expect(legacyLink).toBeVisible();
  const yangLink = page.locator(
    'a[href="/legacy/essays/theatre-influences/#asian-theatre"]',
  );
  await expect(yangLink).toBeVisible();
});

test.step('shakespeare alternatives — TMAI callouts + Contact CTA', async () => {
  await page.goto('/shakespeare/alternatives/');
  const tradeoffs = page.locator('.callout-tradeoffs');
  expect(await tradeoffs.count()).toBeGreaterThanOrEqual(2);
  const contactCta = page.locator(
    'a[href="/shakespeare/ask-shakespeare/#form"]',
  ).first();
  await expect(contactCta).toBeVisible();
});
```

Adjust `runAxe` / `test.step` / `expect` idioms to match the file's existing conventions (Playwright may or may not use `test.step`; may use `describe`/`it` shape via `@playwright/test`). If checkpoints in the current file use plain `await page.goto()` + `await expect()` inside a single `test()`, follow that shape.

- [ ] **Step 3: Run the smoke suite locally**

```bash
pnpm test:e2e
```

Expected: all checkpoints pass. If ʻokina check fails (`Midʻsummah` not found in title), verify Task 7 correctly set the frontmatter title character.

If axe surfaces critical/serious violations on new pages, fix them in the appropriate page's Astro file (semantic HTML issue, missing alt text, contrast, etc.) — those fixes are in-scope for this task since it's discovering them.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "$(cat <<'EOF'
test(cycle-11): extend smoke suite with 5 Shakespeare checkpoints + a11y

Covers vision spec §7 acceptance criteria surface:
- AC2: doctrine block + "What translation did you use?" + Concept popovers
- AC6: Colloquial audio player + transcript statement + ʻokina render
- AC8: New Plays landing renders 2 cards
- AC5+AC4: 2 TMAI trade-offs callouts + Contact CTA on Alternatives
- Cross-section: Honoring → Legacy links resolvable

Axe scans added on new pages (New Plays, landing, Colloquial detail).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: Client-review bundle document

**Files:**
- Create: `docs/client-reviews/2026-08-13-cycle11-shakespeare-review.md`

- [ ] **Step 1: Verify `docs/client-reviews/` directory exists**

```bash
ls docs/client-reviews/
```

If absent, `mkdir -p docs/client-reviews/`. Cycle 10 established the directory.

- [ ] **Step 2: Create `docs/client-reviews/2026-08-13-cycle11-shakespeare-review.md`**

Structure the document for Lola / Laurie consumption (not code review). Use plain English, no jargon, one section per bundled decision. Each section: brief context → what shipped → what we're asking.

```markdown
# Shakespeare Section — Cycle 11 Review Bundle

**Date:** 2026-08-13
**Cycle:** 11 (Shakespeare Vision Fidelity)
**Prepared for:** Lola, Laurie

Below are the decisions Cycle 11 landed that we&rsquo;d like your review on before we consider the Shakespeare section fully signed off. Nothing here is a code question &mdash; these are content, tone, and permission asks.

---

## 1. Chuck Wilcox &mdash; stroke paragraph

**What shipped:** The Honoring Our Guides page tells Chuck&rsquo;s story including the stroke that led to his co-inventing Shakespeare on the Green with Richard Devin, visiting patrons as Will Shakespeare. Language is drawn verbatim from Drive doc 3 wherever possible.

**Asking:** Sensitivity re-read. The stroke is part of Chuck&rsquo;s story as you chose to tell it, and the Shakespeare-on-the-Green invention it led to is the point &mdash; we didn&rsquo;t soften either. Please read the paragraph and let us know if any phrasing needs adjustment.

**Location:** `/shakespeare/honoring-our-guides/#chuck-wilcox`

---

## 2. Soliloquies library blurb

**What shipped:** A 2-3 sentence blurb we drafted for the Soliloquies library page. There was no Alternative-passage source for Soliloquies in Drive doc 1b, so this is our best guess at the framing.

**Asking:** Approve, edit, or replace with your own copy.

**Draft text:**
> A soliloquy is a Player&rsquo;s solo pass through a moment of decision or discovery. It is one of the most compact ways into Shakespeare&rsquo;s language: no scene partners to coordinate, no cast to schedule, just breath and text. This library collects individual solo speeches suitable for K-through-adult Players.

**Location:** `/shakespeare/soliloquies/`

---

## 3. Romeo and Juliet Rap &mdash; withheld

**What shipped:** Nothing &mdash; the R&J Rap is not published on the Colloquial page yet.

**Reason:** The source doc includes the Rap passages but does not attribute authorship in the visible text. Publishing without confirmed author + permission would be a rights issue.

**Asking:** Who wrote the Rap? Do we have permission to publish? When resolved, we&rsquo;ll drop it in immediately (with audio if you have one).

---

## 4. New Plays &mdash; real scripts needed

**What shipped:** Two placeholder cards on `/shakespeare/new-plays/`:
- *The Ballad of Three Finger Dick* (Chuck Wilcox)
- *Shakespeare&rsquo;s Sister* (Marta Barnard)

Each has an "About this script" section drawn from Drive doc 1b&rsquo;s anecdotes, plus "Production Notes" and "Script" placeholders that direct readers to Ask Shakespeare for the current draft.

**Asking:** Which Drive folder holds these scripts? When you share the location, we&rsquo;ll import the full texts and remove the placeholder language.

---

## 5. Chuck Wilcox&rsquo;s St. Mary&rsquo;s cuttings

**What shipped:** The Cuttings library page carries an honest note that Chuck is providing plays he cut from his St. Mary&rsquo;s Academy teaching, and that more cuttings are being prepared over time.

**Asking:** As cuttings become ready, share the Drive location and we&rsquo;ll add them one by one.

---

## 6. Colloquial page &mdash; nav placement

**What shipped:** In the Shakespeare sub-nav, Colloquial sits 8th (after Children&rsquo;s Shakespeare, before New Plays), matching the &ldquo;flag placement to client&rdquo; note in the vision spec.

**Asking:** Does this placement work for you? If you&rsquo;d rather Colloquial land elsewhere (e.g., right after Alternatives to feature it as a differentiator), we&rsquo;ll move it.

---

## 7. 500+ vs. 440+ years &mdash; conflict resolution

**What shipped:** The site consistently uses "440+ years" (closer to accurate) across the landing deck and the Shakespeare landing essay. Zero "500+ years" references anywhere.

**Asking:** Confirm 440+ is the number you want going forward. We&rsquo;ll keep the site aligned.

---

## 8. Chuck vs. Charles Wilcox &mdash; unification

**What shipped:** All "Charles Wilcox" references site-wide are now "Chuck Wilcox," matching the vision spec and Legacy convention.

**Preserved as "Charles Wilcox":** [Enumerate any hits from Task 4 Step 2 that were preserved as formal program credits. Example: "src/data/timeline.json entry for 1985 Lear production credits — the original program billed him as Charles Wilcox." If no preserved hits, write: "No formal program credits required preservation."]

**Asking:** Confirm "Chuck" is the site-wide canonical, and let us know if any of the preserved formal credits should also flip to "Chuck."

---

## 9. TMAI merge dispositions

**What shipped:** The TMAI essay does not exist as a standalone page. Its four unique assets landed as follows:

| TMAI asset | Where it landed |
|---|---|
| Trade-offs candor (narrator function; "not truly Shakespeare") | Two "Trade-offs to consider" callouts on Themes + Cuttings sections of the Alternatives essay |
| Proven 40-minute performance list (R&J, Lear, Midsummer/Mechanicals) | Cuttings library page as credentials callout |
| Scene-selection method (start from memorized; shave internally; eliminate extraneous) | Themes library page as a "Choosing scenes" callout below the grid |
| Contact CTA ("contact us... to see a script") | Contact CTA card on the Alternatives essay, wired to Ask Shakespeare form |

The orphan footnote fragment ("1. Act V, scene ii, the murder scene, lines 1–117") was stripped &mdash; it has no referent in either essay. Note in case it belongs to a lost passage.

**Asking:** Confirm this distribution reflects your intent. Nothing was silently dropped.

---

## 10. Vocal Expression PRC entry

**What shipped:** The Shakespeare landing&rsquo;s "Leave the Language" doctrine block includes a TIP: "Use Vocal Expression Theatre Games as Warmup before Shakespeare rehearsal." Both are live Concept popovers.

**The issue:** Cycle 10 (PRC) shipped 20 concept entries, but Vocal Expression wasn&rsquo;t among them. To make the TIP work, we authored a placeholder Vocal Expression entry marked `draft: true`. It cross-references Warmup and Theatre Games.

**Asking:** Same options as `icons.mdx` in the Cycle 10 bundle:
- (a) Approve the placeholder as-is
- (b) Edit the shortDefinition + body text
- (c) Replace with a full source-doc-based entry when one exists

**Location:** `src/content/concepts/vocal-expression.mdx` (rendered at `/resource-center/vocal-expression/` once approved).

---

**Sign-off:** Once you&rsquo;ve worked through these 10 items, we&rsquo;ll fold the resolutions into a small follow-up (numbers 1, 2, 8, 10 are content edits; 3, 4, 5 unblock as content arrives; 6, 7, 9 are approval-only).
```

- [ ] **Step 3: Verify no forbidden patterns in the bundle**

```bash
pnpm check:prohibited
```

Expected: 0 violations. (The bundle references `TMAI` — the guardrail may flag this. Since the bundle is not part of the built site, decide: (a) `docs/client-reviews/` is outside the guardrail's scan directory, or (b) narrow the TMAI regex to exclude `docs/` paths, or (c) accept the false positive in review docs and note it. Check the guardrail's fast-glob scan pattern; if it scans `src/` only, the bundle is fine.)

- [ ] **Step 4: Commit**

```bash
git add docs/client-reviews/2026-08-13-cycle11-shakespeare-review.md
git commit -m "$(cat <<'EOF'
docs(cycle-11): client-review bundle for Shakespeare fidelity cycle

10 items for Lola / Laurie: Chuck stroke paragraph sensitivity re-read,
Soliloquies blurb approval, R&J Rap authorship, New Plays scripts,
Chuck's St. Mary's cuttings, Colloquial nav placement, 500+/440+ lock,
Chuck/Charles preserved-formal-credits, TMAI merge dispositions, Vocal
Expression PRC entry.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: `CLAUDE.md` — Cycle 11 conventions

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Read the current `CLAUDE.md` "Key conventions" section**

Identify where new-cycle conventions have historically been added (Cycles 9 + 10 each added a block).

- [ ] **Step 2: Add Cycle 11 conventions**

Insert additions to the appropriate sections:

Under **Key conventions**, after the PRC block:

```markdown
**Shakespeare content additions (Cycle 11).** `scripts` collection library enum now includes `new-plays` for Alternative Four scripts. Two placeholder entries ship at `three-finger-dick.mdx` + `shakespeares-sister.mdx`; real scripts arrive from client Drive shares. `/shakespeare/new-plays/` renders via the standard library-index pattern.

**Colloquial audio.** Hosted at `/public/audio/<filename>.mp4` with ASCII kebab-case filenames (e.g. `midsummah-pidgin-paka.mp4`). Frontmatter `audio: '<filename>.mp4'` (bare) + optional `audioCaption: '<caption>'`. `<AudioEmbed>` component in `src/components/shakespeare/` prepends `/audio/`. Detail template renders audio + a transcript-statement paragraph above the side-by-side text.

**Hawaiian ʻokina (U+02BB) vs. curly apostrophe (U+2019).** In Colloquial Pidgin content (`Midʻsummah`, `iaʻu`, `ʻao`), preserve the ʻokina U+02BB — it is a distinct character from U+2019. English possessives in the same file (`Shakespeare&rsquo;s`) still use U+2019. The prohibited-text guardrail does not distinguish; be intentional per character.

**Sub-nav order (Cycle 11 reorder).** Shakespeare sub-nav order matches vision spec §2 client-numbered order: Alternatives, Honoring Our Guides, Soliloquies, Scenes, Themes, Cuttings, Children's Shakespeare, Colloquial, New Plays, Ask Shakespeare (10 items).

**500+/440+ Shakespeare year-count.** Canonical is `440+ years` site-wide. `500+ years` never ships.

**Chuck Wilcox site-wide canonical.** Prose uses "Chuck Wilcox" everywhere; formal program credits legitimately quoting "Charles Wilcox" are the only preserved exceptions (see `docs/client-reviews/2026-08-13-cycle11-shakespeare-review.md` bundle item #8).

**TMAI provenance.** The TMAI essay does not exist as a standalone page. Its four assets are distributed: trade-offs callouts on Alternatives/Themes and Alternatives/Cuttings sections, 40-minute credentials on Cuttings library page, scene-selection method on Themes library page, contact CTA on Alternatives essay. Provenance moves to script frontmatter `sourceDoc: 'TMAI essay (Drive)'` where appropriate. Never publish the word "TMAI" in body copy.
```

Under **Deferred / TODO markers**, append Cycle 11 items:

```markdown
- **R&J Rap** (Cycle 11) — withheld pending authorship attribution. When client confirms, add MDX under `src/content/colloquial/` + audio if any.
- **New Plays real scripts** (Cycle 11) — placeholder cards for *Three Finger Dick* and *Shakespeare&rsquo;s Sister* ship; real scripts pending client Drive share (bundle item #4).
- **Chuck Wilcox St. Mary&rsquo;s cuts** (Cycle 11) — Cuttings library ships honest "more being prepared" note; scripts arrive over time (bundle item #5).
- **Soliloquies blurb** (Cycle 11) — drafted; awaits client approval (bundle item #2).
- **Vocal Expression PRC entry** (Cycle 11) — placeholder `draft:true` shipped so the Shakespeare landing TIP works; awaits client edit / replacement (bundle item #10).
- **Chuck Wilcox stroke paragraph** (Cycle 11) — flagged for client sensitivity re-read (bundle item #1).
- **Colloquial nav placement** (Cycle 11) — placed 8th per Cycle 11; bundle item #6 asks for client confirmation.
```

- [ ] **Step 3: Verify no forbidden patterns triggered by the CLAUDE.md edit**

```bash
pnpm check:prohibited
```

Expected: 0 violations. If `TMAI` in the conventions note trips the guardrail, either scope the guardrail's fast-glob to exclude `CLAUDE.md` (check current include set) or reword the note to avoid the bare token.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs(cycle-11): CLAUDE.md conventions for Shakespeare fidelity cycle

Adds: new-plays library value; Colloquial audio conventions; ʻokina vs
curly apostrophe rule; sub-nav order lock; 440+ year canonical; Chuck
Wilcox canonical name; TMAI provenance rule. Appends 7 deferred/TODO
markers pointing to the client-review bundle.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 18: Memory updates (end-of-cycle)

**Files:**
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_followups.md`

**Interfaces consumed:**
- Auto-memory system convention: memory files have frontmatter + body; update in place using Edit.

- [ ] **Step 1: Read the current cycle-tracking memory**

```bash
cat /Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md
```

Note the format used by Cycles 1-10 entries.

- [ ] **Step 2: Update `project_dtfc_cycles.md`**

Append (or update the "in-progress" pointer to) an entry for Cycle 11 matching the format:

```markdown
- Cycle 11 (Shakespeare Vision Fidelity) shipped 2026-08-13 on branch `cycle-11-shakespeare-fidelity`. Drive-doc content merges for Alternatives essay + Honoring Our Guides; TMAI 4-asset distribution; Colloquial audio host; New Plays route with 2 placeholders; nav reorder; Chuck/Charles unification; 7 new prohibited-text patterns; cross-section wiring Legacy/PRC/Children's Theatre.
```

- [ ] **Step 3: Read the follow-ups memory**

```bash
cat /Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_followups.md
```

- [ ] **Step 4: Update `project_dtfc_followups.md`**

Add the Cycle 11 open follow-ups (mirrors CLAUDE.md deferred markers but for future-cycle context):

- R&J Rap authorship (bundle #3)
- New Plays real scripts from Drive (bundle #4)
- Chuck's St. Mary's cuttings as they arrive (bundle #5)
- Soliloquies blurb client approval (bundle #2)
- Vocal Expression PRC entry client review (bundle #10)
- Chuck stroke paragraph sensitivity re-read (bundle #1)
- Colloquial nav placement confirmation (bundle #6)
- Chuck/Charles preserved-credit exceptions (bundle #8)
- 500+/440+ year-count confirmation (bundle #7)
- TMAI merge disposition sign-off (bundle #9)

- [ ] **Step 5: No commit — memory lives outside the repo**

Memory files are under `~/.claude/projects/…/memory/`, not under the repo. They persist across sessions without a git commit.

---

## Task 19: Cycle merge to `main`

**Files:** none (git operation only)

**Interfaces consumed:** all prior tasks committed cleanly on `cycle-11-shakespeare-fidelity`.

- [ ] **Step 1: Verify branch state is clean**

```bash
git status
git log --oneline main..HEAD
```

Expected: clean working tree; log shows all cycle commits.

- [ ] **Step 2: Run full pre-merge verification**

```bash
pnpm check && pnpm build && pnpm test && pnpm test:e2e
```

Expected: everything green. If anything fails, fix on the branch before merging.

- [ ] **Step 3: Merge with `--no-ff`**

```bash
git checkout main
git merge --no-ff cycle-11-shakespeare-fidelity -m "$(cat <<'EOF'
Merge branch 'cycle-11-shakespeare-fidelity'

Cycle 11 — Shakespeare Vision Fidelity. Full Drive-doc content merges
(Alternatives essay + Honoring Our Guides), TMAI 4-asset distribution
(no parallel page), Colloquial audio hosting + ʻokina typography,
/shakespeare/new-plays/ route with 2 placeholder scripts, sub-nav
reorder to spec §2, Chuck/Charles Wilcox unification, 7 new prohibited-
text patterns, cross-section wiring to Legacy + PRC + Children's
Theatre. Client-review bundle at docs/client-reviews/.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Do NOT run `git push` unless Cameron explicitly asks — per memory, cycle merges commit locally; push happens on Cameron's terms.

- [ ] **Step 4: Report cycle status back to Cameron**

Brief summary: 18 tasks done; branch merged with --no-ff; test/build all green; client-review bundle ready for Lola/Laurie; 10 follow-up items in bundle waiting on client input.

---

## Self-Review Notes

The self-review pass on this plan checked:

1. **Spec coverage.** Each of the 12 vision-spec acceptance criteria maps to at least one task:
   - AC1 (landing renders full essay + router) → T11
   - AC2 (doctrine block + proof point + Concept icons) → T10, T11
   - AC3 (four convictions demonstrable) → T10, T11, T12, T7/T8 (Colloquial), T6/T9 (routes)
   - AC4 (TMAI merge, no parallel page) → T11 (Alternatives), T13 (Themes/Cuttings), guardrail T3
   - AC5 (trade-offs candor) → T5 (styling), T11 + T13 (placement)
   - AC6 (Colloquial audio + ʻokina + transcript + JPJ credit) → T6, T7, T8, T15 (verification)
   - AC7 (R&J Rap withheld) → T16 bundle item #3, T7 explicit non-creation
   - AC8 (library blurbs sourced per §4) → T13, T9 (New Plays)
   - AC9 (500+/440+ resolved) → global constraint + T17 CLAUDE.md
   - AC10 (zero §6 strings in build) → T3
   - AC11 (name-spelling reconciliation) → T4 (Chuck/Charles) + global constraint
   - AC12 (Chuck's in-progress cuttings note) → T13

2. **No placeholders.** All test code, all Astro/CSS, all frontmatter, all commit messages, and the client-review bundle text are inline. No "TBD"/"implement later"/"similar to Task N" — every task carries its own executable content.

3. **Type consistency.** `ShakespeareNavItem.key` is used in both `SHAKESPEARE_NAV` and the test in T2. `AudioEmbed` prop names `src` + `caption` match between T6 (component) and T8 (consumer). `<Concept id="vocal-expression" />` slug matches between T10 (placeholder MDX slug field) and the landing usage. `library: 'new-plays'` matches between T1 (enum), T9 (MDX frontmatter), and the T9 test in T1's file.

4. **Ambiguity check.** Two decision-gate spots were made explicit: Task 10 Vocal Expression (default Option A: author placeholder), Task 7 audio-download MCP call shape (fallback: ask Cameron to place file manually). Both have clear default paths so an executor with no session context can proceed without guessing.
