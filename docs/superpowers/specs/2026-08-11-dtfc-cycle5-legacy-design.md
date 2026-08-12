# DT:FC Website — Cycle 5 Design: Legacy Section

**Date:** 2026-08-11
**Source specs:**
- `/Users/cnote/Downloads/dtfc-website-spec.md` §4.5 (Legacy section brief)
- `/Users/cnote/Downloads/dtfc-website-spec.md` §7 (Drive-doc → destination map, incl. `10 Research Abstract for CU Theatre Department` and `6 Grand Timeline.xlsx`)
- `/Users/cnote/Downloads/dtfc-website-spec.md` §8 items 2, 3 (Workshop Manual TEXT MISSING; timeline canonical version pending Steve Smith)
- `docs/superpowers/specs/2026-08-11-dtfc-cycle4-childrens-theatre-design.md` (predecessor cycle — established the section-layout + sub-nav pattern reused here)
- `docs/superpowers/specs/2026-08-10-dtfc-cycle2-landing-design.md` (Cycle 2 landing seeded the current `#colorado-caravan` and `#founders` anchors on the Legacy stub; both preserved)

**Cycle scope:** Deep-build the Legacy section per spec §4.5 — landing rebuild, Honoring Our Guides, one-page history / research abstract, Founders profile grid, interactive Timeline (chip-filtered, decade-grouped, org color-coded from client's xlsx), Essays library (5 essays including a Workshop Manual TEXT MISSING placeholder). Introduces one shared data file (`founders.ts`), one JSON dataset (`timeline.json`), and one content collection (`essays`). Folds in a cross-cycle infrastructure investment: **extend `scripts/check-prohibited-text.mjs` to detect straight apostrophes in prose** across `.astro` / `.mdx` files — Cycle 4 hit 5 apostrophe fix-rounds and the guardrail pays for itself immediately in Cycle 5.

**Branch:** `cycle-5-legacy`

---

## 1. Position in the Multi-Cycle Plan

Per the cycle memory (`project_dtfc_cycles.md`), Cycle 5 is Legacy. Subsequent cycles unchanged: Cycle 6 (Community + forms + ESP + Ask Shakespeare form wiring), Cycle 7 (Cross-site search / analytics / launch checklist), Cycle N (Web 2.0 careers / successor-theatres — deferred per source spec §5).

Cycle 5 completes the last section deep-build before Community and search/launch cycles. It also folds in the curly-apostrophe automation deferred from Cycle 4.

---

## 2. Cycle 5 Scope

### 2.1 Ships in Cycle 5

- **Landing rebuild** (`src/pages/legacy/index.astro`): wraps in `LegacyLayout`, keeps the `<ReflectivePrompt sectionKey="legacy" />`, **preserves the Cycle 2 anchors** (`<section id="colorado-caravan">`, `<section id="founders">`), rewrites both teaser paragraphs shorter with outbound cross-links to `/legacy/history/` and `/legacy/founders/`, keeps the "Become part of this Legacy" cross-link to `/community/#membership`, removes the Cycle 2 "Full history — coming next" section (fulfilled by this cycle), adds a directory grid of 5 sub-section cards.
- **10 new pages** across 7 route files:
  - `/legacy/history/` — one-page history + research abstract, doubles as prospectus
  - `/legacy/founders/` — profile grid rendering `FOUNDERS` data
  - `/legacy/timeline/` — interactive timeline (chip filter + decade groups + org color codes + URL serialization)
  - `/legacy/honoring-our-guides/` — Legacy-scoped acknowledgements
  - `/legacy/essays/` — library index for 5 essays
  - `/legacy/essays/towards-a-poor-caravan/`, `/legacy/essays/theatre-influences/`, `/legacy/essays/developmental-drama/`, `/legacy/essays/why-these-plays-are-successful/`, `/legacy/essays/workshop-manual/` — 5 individual essay detail pages generated from one `/legacy/essays/[slug].astro` dynamic route (Workshop Manual ships as TEXT MISSING placeholder with `sample: true`).
- **New data files:**
  - `src/data/founders.ts` — 9 founders as structured objects; Zod-validated at import.
  - `src/data/timeline.json` — array of timeline events; populated from Drive xlsx via MCP.
  - `src/lib/timeline.ts` — validation loader + `groupByDecade()` helper.
- **New content collection:** `essays` (`src/content/essays/*.mdx`).
- **New components** under `src/components/legacy/`:
  - `Timeline.astro` — vertical layout, decade groupings, org color badges per event.
  - `TimelineLegend.astro` — 6 org chips + inline filter script (URL-serialized).
  - `FounderCard.astro` — grid card with photo (or placeholder), name, role, years, short bio.
  - `EssayCard.astro` — library-index tile.
  - `EssayDetail.astro` — simpler than `ScriptDetail`; header + print button + MDX slot.
- **New layout:** `src/layouts/LegacyLayout.astro` wraps `SectionLayout` with 5-item persistent sub-nav.
- **New sub-nav data:** `src/lib/legacy-nav.ts`.
- **Static imagery:** `/public/images/legacy/founders/<slug>.<ext>` — headshots pulled from Drive if available.
- **Seed content** pulled from client's Drive folder at implementation time via Google Drive MCP (same pattern as Cycles 1/3/4). Fallback: placeholder stubs flagged `sample: true`.
- **Timeline import**: pulls `6 Grand Timeline.xlsx` via MCP → converts to `src/data/timeline.json`. Timeline page renders a "pre-release: canonical version pending" chip until Steve Smith confirms (spec §8 item 3).
- **Curly-apostrophe guardrail** extended into `scripts/check-prohibited-text.mjs` — detects straight U+0027 apostrophes in prose contexts across `.astro`, `.mdx`, `.md`. Whitelists Cycle 3 Shakespeare verse files by name.
- **Cross-link maintenance:** `/community/#membership` link from Legacy landing's Cycle 2 "Become part of this Legacy" section — no code change; verify still works.
- **Testing:** Vitest suite extended for `essays` schema, `founders` data validation, `timeline.json` schema + `parseYear` + `groupByDecade`, apostrophe guardrail detection. Playwright smoke test extended: landing, timeline (legend + at least one event visible + one chip togglable), one essay detail with print button.
- **CLAUDE.md + memory** updates at cycle end.

### 2.2 Explicitly deferred

- **Web 2.0 "All that came after"** (successor theatres, careers) — spec §4.5 item 7 explicitly out-of-scope for v1. Cycle N or later.
- **Workshop Manual full text** — spec §8 item 2 flags as missing. Cycle 5 ships as an essay entry with `sample: true` and a "text pending" note. When Laurie O'Brien delivers, flip `sample: false` and paste the body.
- **Timeline canonical-version lock** — spec §8 item 3 flags Steve Smith's confirmation as pending. Cycle 5 imports whichever xlsx is on Drive; re-run the import task if a different canonical arrives.
- **Photos for founders not present in Drive** — cards render placeholder circles with initials if `photoSrc` is unset.
- **Cross-site search** — Cycle 7.
- **Community Workshop Manual link** — Theatre Games section (Cycle 1) mentions the Workshop Manual as shared content. A future small task can add a link from Theatre Games facilitation to the Legacy essay entry once the text arrives.

### 2.3 Deployment

Still local-dev only, matching prior cycles.

---

## 3. Landing Page Rewrite

Cycle 2 shipped a stub landing with `<ReflectivePrompt>` + 4 sections. Cycle 5 keeps the reflective prompt and the two anchored sections, rewrites their bodies for outbound cross-links, keeps the Community-membership cross-link section, removes the "coming next" placeholder, and adds the directory grid.

**Structure:**

- Wrap in `LegacyLayout` (no `subPage` — this IS the landing).
- Eyebrow: `"History &mdash; Foundational Concepts &mdash; Who / When / Why &mdash; Next Steps"` (spec §4.5 section identity).
- Description: `"Where DT:FC came from, the people who built it, and the 50+ year timeline that&rsquo;s still unfolding."`
- `<ReflectivePrompt sectionKey="legacy" />`
- `<section id="colorado-caravan">` — 1 short paragraph on the Caravan's origin, ending with `<a href="/legacy/history/">Read the full one-page history &rarr;</a>`.
- `<section id="founders">` — 1 short paragraph on Knaub / Wilcoxes / Cobin, ending with `<a href="/legacy/founders/">Meet the founders &rarr;</a>`.
- `<section>` "Become part of this Legacy" — kept verbatim from Cycle 2 (links to `/community/#membership`). No CLIENT REVIEW comment change; original comment stands.
- Directory grid: 5 cards (History / Founders / Timeline / Essays / Honoring Our Guides). Each: label + one-line description + link.

Reading order on mobile: eyebrow → h1 → ReflectivePrompt → `#colorado-caravan` → `#founders` → become-part-of-this-Legacy → directory grid.

---

## 4. Content Model

### 4.1 `founders` — structured data

`src/data/founders.ts`:

```typescript
import { z } from 'astro/zod';

const FounderSchema = z.object({
  slug: z.string(),                          // stable kebab-case id
  name: z.string(),                          // e.g. "Richard Knaub"
  role: z.string(),                          // e.g. "Co-founder, Colorado Caravan"
  years: z.string().optional(),              // e.g. "1928&ndash;2007" or "faculty"
  photoSrc: z.string().optional(),           // "/images/legacy/founders/<slug>.<ext>"; omit -> placeholder circle
  shortBio: z.string(),                      // 2-4 sentences per spec
  unconfirmed: z.boolean().default(false),   // Judith Bock per spec §4.5 item 4
  sample: z.boolean().default(false),        // stub before Drive import lands real bio
});
export type Founder = z.infer<typeof FounderSchema>;

export const FOUNDERS: Founder[] = [
  // 9 entries: Richard Knaub, Chuck Wilcox, Lola Wilcox, Martin Cobin,
  //           Laurie O&rsquo;Brien, Cherie Karo Schwartz, Judith Bock (unconfirmed),
  //           Daniel S.P. Yang, Nils Petersen
];

(function verifyAtImport() {
  for (const f of FOUNDERS) FounderSchema.parse(f);
  const slugs = FOUNDERS.map((f) => f.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error('FOUNDERS slugs must be unique');
  }
})();
```

`shortBio` prose uses `&rsquo;` HTML entities for possessives (curly-apostrophe discipline). `unconfirmed: true` for Judith Bock; card renders an "unconfirmed" chip.

### 4.2 `timeline.json` — structured data

`src/data/timeline.json`: flat array of event objects. Populated from `6 Grand Timeline.xlsx` via MCP at implementation time. Placeholder stub if the import isn't run.

Schema added to `src/lib/content-schemas.ts`:

```typescript
export const TIMELINE_ORGS = [
  'ALL',       // Organizational — white/neutral
  'CC',        // Colorado Caravan — blue
  'C&C',       // Crown & Clown — violet
  'CSF',       // Colorado Shakespeare Festival — orange
  'TEF',       // Theatre of Enchanted Forest / Toadstone — green
  'OSC',       // Overland Stage Company — brown
] as const;

export const timelineEventSchema = z.object({
  date: z.string(),                                     // "1971" / "March 1975" / "1980-05-12"
  event: z.string(),
  participants: z.string().optional(),
  presentation: z.string().optional(),
  additionalInfo: z.string().optional(),
  organization: z.enum(TIMELINE_ORGS),
});
export type TimelineEvent = z.infer<typeof timelineEventSchema>;

export const timelineSchema = z.array(timelineEventSchema);
```

**Loader:** `src/lib/timeline.ts`:

```typescript
import raw from '../data/timeline.json';
import { timelineSchema, type TimelineEvent } from '@/lib/content-schemas';

export const TIMELINE_EVENTS: TimelineEvent[] = timelineSchema.parse(raw);

/**
 * Parse a leading 4-digit year from a date string ("1971" / "March 1975" /
 * "1980-05-12"). Returns null if none found — the caller decides how to
 * handle unparseable dates.
 */
export function parseYear(date: string): number | null {
  const m = date.match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : null;
}

/**
 * Group events by decade (1971 -> 1970, 1985 -> 1980, ...). Returns an
 * array of `{ decade, events }` sorted by decade ascending. Events with
 * unparseable dates are silently skipped.
 */
export function groupByDecade(events: TimelineEvent[]): Array<{ decade: number; events: TimelineEvent[] }> {
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

Vitest covers:
- `parseYear` with 3 date formats + one unparseable input.
- `groupByDecade` with mixed-decade fixture (1971, 1975, 1985, 1990, 2020) → correct 4 buckets in ascending order.
- `timelineSchema` parses the real `timeline.json` on-disk (validates the imported data).

### 4.3 `essays` — new content collection

Schema in `src/lib/content-schemas.ts`:

```typescript
export const essaysSchema = z.object({
  title: z.string(),
  author: z.string(),
  year: z.number().int().positive().optional(),
  publishedIn: z.string().optional(),
  excerpt: z.string().max(200),
  sample: z.boolean().default(false),
});
```

Body MDX conventions:
```mdx
## About this essay
&hellip;archival framing, context&hellip;

## Full text
&hellip;essay body&hellip;
```

Registration in `src/content.config.ts` alongside existing collections.

Vitest asserts:
- `essays` collection has at least one entry.
- Every entry parses against `essaysSchema` (Astro handles this at build; the test guards against schema drift).
- `sample: true` entries render the sample chip (verified via detail-page smoke or explicit test).

---

## 5. Component Architecture

### 5.1 New components

All Astro; no Preact islands. Chip filter uses inline JS mirroring the Cycle 3 themes-page + Cycle 4 series-page pattern.

| Component | Path | Responsibility | Consumes |
|---|---|---|---|
| `LegacyLayout.astro` | `src/layouts/LegacyLayout.astro` | Wraps `SectionLayout` with 5-item persistent sub-nav (analog of `ChildrensLayout` / `ShakespeareLayout`). Same `aria-current="page"` pattern. Props: `title`, `description?`, `eyebrow?`, `subPage?`, slot. | `LEGACY_NAV` |
| `Timeline.astro` | `src/components/legacy/Timeline.astro` | Vertical layout: renders `<section>` per decade (from `groupByDecade`) with `<h2>{decade}s</h2>` and a `<ul>` of events. Each `<li>` carries `data-event-org="CC"` for the chip filter to match against. Inline `<script is:inline>` for filter + URL serialization (guard against double-init via `window.__dtfcTimelineInit`). | `TIMELINE_EVENTS`, `groupByDecade`, `TimelineLegend` |
| `TimelineLegend.astro` | `src/components/legacy/TimelineLegend.astro` | 6 org chips at the top of the timeline: color swatch + full org name. Each chip is a `<button data-org="CC">` acting as filter toggle. Also renders an "All" chip. `data-org-chips` container. Inline JS toggles `hidden` on non-matching `<li>` items and writes `?org=<slug>` via `history.replaceState`. | `TIMELINE_ORGS` (from schemas) |
| `FounderCard.astro` | `src/components/legacy/FounderCard.astro` | Grid card. Renders: photo (circular, 128px) OR placeholder circle with initials if `photoSrc` unset; h3 name; role; years (small text); short bio; "unconfirmed" chip if `founder.unconfirmed`. | one `Founder` |
| `EssayCard.astro` | `src/components/legacy/EssayCard.astro` | Library-index tile: title (linked), author + year, excerpt, sample chip if `sample: true`. | one essays entry |
| `EssayDetail.astro` | `src/components/legacy/EssayDetail.astro` | Detail-page template: header (title, author, year, publishedIn), sample chip if `sample: true`, print button (uses existing `data-print-hide`), MDX slot. Sample-content warning paragraph if `sample: true`. | one essays entry + slot |

### 5.2 Sub-nav data

`src/lib/legacy-nav.ts`:

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

5 items. Landing has no `subPage`. Individual essay detail pages set `subPage="essays"`.

### 5.3 Timeline chip filter — inline JS

Same pattern as Cycle 3 themes + Cycle 4 series:

```html
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

"All" chip has `data-org=""` (empty). No-JS fallback: all events visible, chips inert. Deep-linkable via `?org=CSF`. Colors on chips + event badges come from tokens (added to `src/styles/tokens.css` if not present: `--color-timeline-cc`, `--color-timeline-csf`, etc. — 5 new tokens matching spec's blue/violet/orange/green/brown).

### 5.4 Curly-apostrophe guardrail extension

Modify `scripts/check-prohibited-text.mjs` to add a new pattern class after the existing forbidden-phrase patterns. Structure:

```javascript
const CURLY_APOSTROPHE_ALLOWLIST = [
  // Cycle 3 Shakespeare verse — Elizabethan contractions ('tis, 'twere,
  // Environ'd, perfect'st) are standard modernized editorial practice.
  'src/content/scripts/juliet-romeo-and-juliet-act-iv-scene-iii.mdx',
  'src/content/scripts/lady-macbeth-macbeth-act-i-scene-v.mdx',
  'src/content/scripts/mechanicals-scenes-a-midsummer-nights-dream.mdx',
];

function findStraightApostropheInProse(text, file) {
  if (CURLY_APOSTROPHE_ALLOWLIST.includes(file)) return [];
  // Match: word char, straight U+0027, word char — that's a prose apostrophe.
  // Deliberately misses `'foo'` (JS strings) and file paths.
  const pattern = /(?<=\w)'(?=\w)/g;
  const hits = [];
  let m;
  while ((m = pattern.exec(text)) !== null) {
    // Exclude if inside an obvious JS import string or getCollection() call
    // on the same line.
    const lineStart = text.lastIndexOf('\n', m.index) + 1;
    const lineEnd = text.indexOf('\n', m.index);
    const line = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
    if (/^\s*import\s/.test(line)) continue;
    if (/getCollection\(/.test(line)) continue;
    // Compute line + col
    const before = text.slice(0, m.index);
    const lineNumber = before.split('\n').length;
    const col = m.index - lineStart + 1;
    hits.push({ line: lineNumber, col, snippet: line.trim() });
  }
  return hits;
}
```

Extend the script's file glob to include `.astro`, `.mdx`, `.md` under `src/`. Add a Vitest test at `tests/unit/apostrophe-guardrail.test.ts` with three fixtures:
- **Positive:** `"Aesop's Fables in a card"` in an `.astro`-like context → detected.
- **Negative:** `import x from 'y'` → not detected.
- **Whitelist:** `perfect'st in the Cycle 3 Shakespeare file` at a whitelisted path → not detected.

**Error output on match:**
```
<file>:<line>:<col> straight apostrophe in prose — use U+2019 (') or &rsquo;
    <trimmed line snippet>
```

Wired into `pnpm build` via the existing `check:prohibited` chain (no separate npm script needed; extends the existing prebuild check).

---

## 6. Route Layout

```
src/pages/legacy/
├── index.astro                    # landing rebuild
├── history.astro                  # one-page history + research abstract
├── founders.astro                 # profile grid rendering FOUNDERS
├── timeline.astro                 # interactive timeline
├── honoring-our-guides.astro      # Legacy-scoped acknowledgements
└── essays/
    ├── index.astro                # library index for 5 essays
    └── [slug].astro               # essay detail dynamic route
```

---

## 7. File Additions and Modifications

```
docs/superpowers/specs/
  2026-08-11-dtfc-cycle5-legacy-design.md              # this file

src/lib/
  legacy-nav.ts                                        # new
  timeline.ts                                          # new (loader + parseYear + groupByDecade)
  content-schemas.ts                                   # modified: add TIMELINE_ORGS, timelineEventSchema, timelineSchema, essaysSchema

src/data/
  founders.ts                                          # new
  timeline.json                                        # new (populated by Drive import)

src/layouts/
  LegacyLayout.astro                                   # new

src/components/legacy/                                 # new directory
  Timeline.astro
  TimelineLegend.astro
  FounderCard.astro
  EssayCard.astro
  EssayDetail.astro

src/content.config.ts                                  # modified: register essays

src/content/essays/                                    # new directory
  towards-a-poor-caravan.mdx
  theatre-influences.mdx
  developmental-drama.mdx
  why-these-plays-are-successful.mdx
  workshop-manual.mdx                                  # sample: true, TEXT MISSING placeholder

public/images/legacy/founders/                         # new directory (populated by Drive import)

src/pages/legacy/                                      # existing dir; landing rewritten, others new
  index.astro                                          # rewritten
  history.astro                                        # new
  founders.astro                                       # new
  timeline.astro                                       # new
  honoring-our-guides.astro                            # new
  essays/
    index.astro                                        # new
    [slug].astro                                       # new

src/styles/tokens.css                                  # modified: 5 timeline org color tokens

scripts/
  check-prohibited-text.mjs                            # extended: curly-apostrophe guardrail

tests/unit/
  timeline.test.ts                                     # new (parseYear + groupByDecade + timelineSchema)
  founders.test.ts                                     # new (FOUNDERS data validation)
  legacy.test.ts                                       # new (essays collection assertions)
  apostrophe-guardrail.test.ts                         # new (guardrail detection fixture)

tests/e2e/
  smoke.spec.ts                                        # extended for Legacy routes

CLAUDE.md                                              # modified
```

---

## 8. Landing-Page Idea Two Answer Consistency

`src/data/landing.ts` currently maps three Legacy Idea Two questions to Legacy destinations:
- Question #11 → `/legacy/#colorado-caravan` (Cycle 5 preserves)
- Question #12 → `/legacy/#founders` (Cycle 5 preserves)
- Question #13 → `/community/#membership` (unchanged; Community landing has that section from Cycle 2)

No `landing.ts` changes needed.

---

## 9. Timeline Canonical-Version Caveat

Spec §8 item 3 flags: "Steve Smith to confirm which spreadsheet version is authoritative." Cycle 5 imports whichever `6 Grand Timeline.xlsx` is on Drive at implementation time and ships with a pre-release chip and CLIENT REVIEW comment on the timeline page:

```astro
{/* CLIENT REVIEW: pending Steve Smith's confirmation of canonical xlsx version per spec §8 item 3.
    If a different canonical arrives later, re-run the Drive import task with the correct file. */}
<span class="text-mustard-600 text-xs uppercase tracking-widest">Pre-release: canonical version pending</span>
```

The chip appears next to the h1 on `/legacy/timeline/`. Removes cleanly once Steve confirms — flip a boolean in the page frontmatter or delete the chip block.

---

## 10. Print Stylesheet

Existing print rules from Cycle 1 (`src/styles/print.css`) already cover:
- `data-print-hide` on nav / sub-nav / print buttons
- Serif body 11pt
- Ivory-on-white color stripping
- Cycle 4 addition: `imagery-grid { grid-template-columns: 1fr; }`

Cycle 5 print considerations:
- **Essay detail pages** print naturally via `EssayDetail`'s existing print button + `data-print-hide` on the sub-nav.
- **Timeline** — the chip filter (`data-print-hide` on the TimelineLegend `<nav>`), decade groupings and events print as a vertical list. Considered adding a print rule to force all events visible regardless of filter state; deferred (users can un-toggle before printing).
- **Founders grid** — cards print fine; no changes needed.

No new print CSS rules required for Cycle 5.

---

## 11. Testing

**Vitest — new suites:**

- `tests/unit/timeline.test.ts`:
  - `parseYear`: `"1971"` → 1971, `"March 1975"` → 1975, `"1980-05-12"` → 1980, `"undated event"` → null.
  - `groupByDecade`: fixture with events across 1971, 1975, 1985, 1990, 2020 → 4 groups sorted ascending.
  - `timelineSchema` parses the real `src/data/timeline.json` (validates schema conformance of the imported data).
- `tests/unit/founders.test.ts`:
  - `FOUNDERS` array parses (import-time IIFE would throw at build; test guards regression).
  - `FOUNDERS` slugs are unique.
  - Every entry with `photoSrc` set has the referenced file present under `public/`.
- `tests/unit/legacy.test.ts`:
  - `essays` collection has at least one entry.
  - Every entry's `excerpt` is ≤ 200 chars.
  - `sample: true` entries carry the sample flag (schema shape check).
- `tests/unit/apostrophe-guardrail.test.ts`:
  - Positive: fixture with `"Aesop's Fables"` in prose returns 1 hit.
  - Negative: fixture with `import x from 'y'` returns 0 hits.
  - Whitelist: input from a whitelisted Cycle 3 Shakespeare file with `perfect'st` returns 0 hits.

**Playwright — `tests/e2e/smoke.spec.ts` extended:**

- Navigate to `/legacy/` — h1 "Legacy" visible; ReflectivePrompt visible; directory grid renders 5 cards.
- Navigate to `/legacy/timeline/` — h1 "Timeline"; `TimelineLegend` visible; at least one decade section renders; at least one `<li[data-event-org]>` visible.
- Toggle one org chip — assert `aria-pressed="true"` on that chip, and that at least some `<li>` items become hidden. URL changes to include `?org=<slug>`.
- Navigate to `/legacy/essays/<any-slug>/` (first card) — print button visible.

Regression: existing Cycle 1-4 assertions continue to pass.

---

## 12. Open Client Questions (bundled with prior open items)

1. **Timeline canonical xlsx** (spec §8 item 3) — Steve Smith to confirm before final content lock. Cycle 5 ships with the pre-release chip; flip when confirmed.
2. **Judith Bock founder confirmation** (spec §4.5 item 4) — card renders with an "unconfirmed" chip. Confirm or omit.
3. **Workshop Manual text** (spec §8 item 2) — TEXT MISSING; essay ships as placeholder with `sample: true`. Flip `sample: false` and add body when Laurie O'Brien's text arrives.
4. **Honoring Our Guides (Legacy) content** — if separate from Shakespeare's + Children's Theatre's versions, drafted-with-review. If the client wants a single shared page, cross-link from all three sections and consolidate.
5. **Founder headshots** — cards render placeholder circles with initials if `photoSrc` is unset. Any headshots the client can share for Richard Knaub, Chuck Wilcox, Lola Wilcox, Martin Cobin, Laurie O'Brien, Cherie Karo Schwartz, Judith Bock, Daniel S.P. Yang, Nils Petersen?

Bundles with the still-open Cycle 2/3/4 items (Community wording, Ask Shakespeare destination email, Cycle 3 Drive gaps, Cycle 4 Drive gaps, PRC question count, etc.).

---

## 13. Memory + CLAUDE.md Updates (End of Cycle)

**Auto-memory:**

- `project_dtfc_cycles.md`: Cycle 5 ship date; roadmap remains Cycle 6 (Community + forms + ESP + Ask Shakespeare form wiring) → Cycle 7 (search + analytics + launch checklist).
- `project_dtfc_followups.md`: append Cycle 5 follow-up block:
  - Timeline canonical version pending Steve Smith
  - Judith Bock unconfirmed founder
  - Workshop Manual TEXT MISSING placeholder shipped
  - Any missing founder headshots
  - Any drafted (non-imported) prose flagged CLIENT REVIEW
  - Timeline section may want a "collapse-all-decades" toggle for very-long timelines — consider if the imported xlsx has >100 events

**CLAUDE.md:**

- Under Stack, add: `essays` collection; `FOUNDERS` data file; `timeline.json` structured data with typed loader in `src/lib/timeline.ts`.
- Under Key conventions:
  - `LEGACY_NAV` drives the persistent sub-nav rendered by `LegacyLayout` on every `/legacy/*` page.
  - Timeline data lives at `src/data/timeline.json`; validated by `timelineSchema` at import; grouped by decade via `groupByDecade()` in `src/lib/timeline.ts`. Organization enum is `TIMELINE_ORGS`.
  - Founder photos live at `/public/images/legacy/founders/<slug>.<ext>` (ASCII kebab-case).
  - **Curly-apostrophe guardrail extended:** `check-prohibited-text.mjs` now detects straight `\w'\w` in prose across `.astro`, `.mdx`, `.md` files. Whitelist: Cycle 3 Shakespeare verse files (juliet, lady-macbeth, mechanicals). To add a legitimate straight-apostrophe file to the whitelist, edit `CURLY_APOSTROPHE_ALLOWLIST` in the script.
- Under "Adding a game", add:
  - **Adding an essay:** drop `src/content/essays/<slug>.mdx` with `title`, `author`, `year?`, `publishedIn?`, `excerpt` (≤ 200 chars), `sample: false`. Body sections `## About this essay` / `## Full text`. `sample: true` for placeholders.
  - **Adding a founder:** append to `FOUNDERS` in `src/data/founders.ts` with a unique `slug` and `shortBio` (curly apostrophes / `&rsquo;`). Photo optional at `/public/images/legacy/founders/<slug>.<ext>`.
  - **Adding a timeline event:** append to `src/data/timeline.json` with `date`, `event`, `organization` (one of `TIMELINE_ORGS`). Optional: `participants`, `presentation`, `additionalInfo`.
- Under Deferred / TODO markers: `Web 2.0 careers/successor-theatres slot in Legacy — Cycle N per spec §5`.

---

## 14. Success Criteria (verifiable)

Cycle 5 is complete when:

1. `pnpm build` succeeds; `check:concepts` + `check:prohibited` (now including curly-apostrophe detection) both print `✓`. ~85 pages built (Cycle 4 shipped 75; Cycle 5 adds ~10 new — 5 top-level + 5 essay detail pages).
2. All 5 top-level sub-routes render (history / founders / timeline / honoring-our-guides / essays index); `/legacy/essays/[slug]/` renders one page per essay entry (5 essays including Workshop Manual placeholder).
3. Landing page displays: h1, ReflectivePrompt, both preserved anchors, rewritten teasers with cross-links, Community-membership section unchanged, directory grid.
4. Sub-nav appears on every `/legacy/*` page marking current sub-page.
5. Founders grid renders 9 (or however many seeded) cards; Judith Bock's card has "unconfirmed" chip; cards missing `photoSrc` show placeholder circles.
6. Timeline renders decade groupings; TimelineLegend visible with 6 org chips; chip toggle hides non-matching events; URL param `?org=CC` deep-links; "pre-release canonical pending" chip visible next to h1.
7. Essay library index lists all seeded essays sorted by year ascending; Workshop Manual placeholder card carries sample chip.
8. Essay detail pages render cleanly; print button works; sample-content warning renders on placeholder pages.
9. Curly-apostrophe guardrail detects a positive fixture, ignores JS import strings, and honors the Shakespeare verse whitelist (verified by Vitest test).
10. Full Vitest suite passes (existing + `timeline.test.ts` + `founders.test.ts` + `legacy.test.ts` + `apostrophe-guardrail.test.ts`).
11. Playwright smoke test extended and passing.
12. Basic AA audit clean on landing, timeline, and one essay detail.
13. Memory index and CLAUDE.md updated as specified in §13.

---

## 15. Handoff

After the user approves this design, the next step is to invoke `superpowers:writing-plans` to produce a step-by-step implementation plan. Implementation happens on `cycle-5-legacy`; merge to `main` uses `--no-ff` per convention. The plan will include:

- **Early task** for the curly-apostrophe guardrail extension — lands before any prose-writing task so its safety net applies from Task 3 onward.
- **Drive MCP import task** — same conditional pattern as Cycles 3 + 4. Controller asks user for Drive folder link before dispatching. Pulls essay source docs, history/prospectus doc, honoring-our-guides doc, timeline xlsx (converted to JSON), and founder headshots.
- **Content-heavy tasks** each end with a `check:prohibited` run — the guardrail catches apostrophe drift automatically.
