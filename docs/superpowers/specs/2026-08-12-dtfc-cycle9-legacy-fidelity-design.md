# DT:FC Cycle 9 — Legacy Vision Fidelity Design

**Date:** 2026-08-12
**Branch:** `cycle-9-legacy-fidelity`
**Predecessor:** Cycle 7 (Launch-Prep) shipped 2026-08-12. Cycle 8 (post-launch chip-flips) remains a separate small cycle triggered by real client credentials.
**Source specs:**
- `/Users/cnote/Downloads/dtfc-legacy-vision-spec.md` — the 12-criterion fidelity spec (primary)
- `/Users/cnote/Downloads/dtfc-website-spec.md` §4.5 — superseded/expanded by the vision spec
- Audit findings (conversation 2026-08-12) — gap report against shipped Cycle 5 Legacy build

## 1. Goal

Bring the shipped `/legacy/*` section into fidelity with the 11-document Drive folder ("2-Legacy") that the vision spec distills. Cycle 5 shipped structural skeletons — routes, cards, timeline, essays index — but the audit shows the section fails 8 of the 12 acceptance criteria on content, voice, and cross-linking. This cycle rebuilds the Founders page, surfaces Lola's fairy-tale narrative on the landing, ships archival-register components (era badge, testimony pull-quote), adds the missing `/legacy/research` page, closes cross-section contracts, and extends the CI prohibited-string guardrail to enforce §6 of the vision spec.

Not in scope: unblocking client-side items (Workshop Manual body text, timeline canonical from Steve Smith, Judith Bock confirmation, founder headshots, Will Power PDF hosting permission) — those remain the same soft-ships they were.

## 2. Scope

### In scope

**Track A — Structure & content architecture**
- Reorder `LEGACY_NAV` to match vision spec §2 (Honoring Our Guides → History → Founders → Timeline → Essays).
- Add `/legacy/research/` route with the researcher-facing content Doc #10 requires.
- Reserve an architectural slot in `LEGACY_NAV` for the future "All That Came After: Theatres and Careers" page (Doc #11 — content deferred).
- Rewrite `/legacy/` landing so Lola's Theatre Influences story doubles as the opening narrative — with the "You are the next heroes and heroines" recruitment turn rendered as a prominent callout.

**Track B — Founders page rebuild**
- New sections on `/legacy/founders/`:
  1. Theatre Games origins block — Cherie Karo Schwartz + Laurie O'Brien in first-person, rendered via new `TestimonyPullQuote` primitive.
  2. Contributing Faculty subsection — Yang and Petersen split out from the founders grid.
  3. Institutional Support narrative — grants and specific numbers (30,000+/year; 100,000+ with All-Town; "exemplary program"; Dissemination & Diffusion Grant; M.A. in three years), CU contributions (van, gas, rehearsal space, Lola's desk), Chautauqua Park housing passage.
  4. Foundational Reading bibliography — 6 works (Durland, McCaslin, Siks, Spolin, Tyas, Way).
  5. Critical Early Contributors — Melinda Scott, Marta Barnard.
  6. CSF outreach continuity — Richard Devin, Chuck-as-Will-Shakespeare, Amanda Giguere with Facebook video link + Will Power article link.
  7. Decline-and-rebirth arc-ending sentence.

**Track C — Archival treatment, cross-links, CI**
- `EssayArchivalBadge` component — "From the Archive, 1971" affordance with era typography cue. Applied to `towards-a-poor-caravan.mdx` and `developmental-drama.mdx`.
- Poor Caravan preface: restore verbatim source text; add footnote markers `(1)`, `(2)` with a single archival note explaining absent footnote text; pick a page-marker treatment (marginal annotation OR global removal) and apply consistently with a code comment documenting the choice.
- Developmental Drama: restore tmai.net citation; check for link rot at build time; if dead, cite without hyperlink or use archive.org.
- Extract Influences Chart from MDX pipe-table into `InfluencesChart.astro` — responsive (mobile: column-per-card or horizontal scroll with sticky row labels); reachable from the landing narrative via anchor.
- Cross-section link additions:
  - Cherie's compilation phrase in `theatre-influences.mdx:32` → link to `/theatre-games/`.
  - Workshop Manual placeholder link surfaced on `/theatre-games/` (Legacy side already exists).
  - Bidirectional cross-link between Legacy "Why These Plays Are Successful" and Children's Theatre "Why These Plays Work."
  - Founders → Timeline direct link + Timeline → Founders back-link (participant anchors or a "See Founders" tail on each entry).
- Extend `scripts/check-prohibited-text.mjs` `PATTERNS` array with the 12 vision-spec §6 strings.
- Fix `workshop-manual.mdx:4` frontmatter excerpt — strip the leaked "TEXT MISSING" phrase (rephrase to "Text pending").
- Copy fix: "Berthold" → "Bertolt" in `theatre-influences.mdx:26`.
- `timeline.ts` `parseYear` — add fallback bucket for fuzzy dates without a 4-digit year (Undated / Approximate group) OR fail-loud with a build-time warning, so a future `197?`-style entry doesn't silently disappear.

### Out of scope (deferred — client-blocked or later cycle)

- Workshop Manual body text (Doc #8) — placeholder remains sample:true; both sections now link to it.
- Timeline canonical version confirmation (Steve Smith) — pre-release chip remains.
- Judith Bock founder card — unconfirmed chip remains until client decision.
- Founder headshots — placeholder initials remain until Desirae/client delivers.
- Doc #11 "All That Came After" content — only the nav slot ships this cycle.
- Will Power PDF hosting — needs client permission before local hosting. Cycle 9 leaves the CSF continuity block as a text reference with a TODO(client) comment; when permission arrives, drop the PDF into `public/legacy/` and swap the link.
- CSF Facebook video embed — link only (video hosted on Facebook is stable); no self-hosted mirror.
- Real research-CTA email destination — routes through the existing Formspree "contact" endpoint (already configured in Cycle 6).

## 3. Architecture

### 3.1 Nav data model

`src/lib/legacy-nav.ts` today exports a `LEGACY_NAV` array of 5 items. Change:

```ts
export const LEGACY_NAV = [
  { label: 'Honoring Our Guides', href: '/legacy/honoring-our-guides/' },
  { label: 'History', href: '/legacy/history/' },
  { label: 'Founders',           href: '/legacy/founders/' },
  { label: 'Timeline',           href: '/legacy/timeline/' },
  { label: 'Research',           href: '/legacy/research/' },
  { label: 'Essays',             href: '/legacy/essays/' },
  // Future: 'All That Came After' — Doc #11, deferred to Cycle N+.
] as const;
```

The commented `// Future:` line IS the architectural slot Criterion 12 requires. When Doc #11 content ships, uncomment and add the route.

### 3.2 New page — `/legacy/research/`

Standalone Astro page under `src/pages/legacy/research.astro`. Content sections (verbatim per Doc #10 minus working header "For Bud Coleman / VERSION #2 – JPJ notes"):

1. Research Abstract — the abstract essentially verbatim.
2. Research materials — participant contacts, physical evidence, Facebook Group, master timeline with replication branches (Wyoming, Maine, Montana, Hawaii, Denmark, Australia), bios, script/workshop/competency synopsis.
3. Foundational Reading — the 6-work bibliography (shared component with Founders page, see §3.6).
4. Contact CTA — "Interested in researching this history? Contact us." → routes to the existing Formspree "contact" endpoint via the same `ContactForm` component used elsewhere.

`history.astro` retains its concise one-page history + provisional prospectus paragraph, but the research materials list, bibliography, and CTA move to `research.astro`. A one-line "For the full research prospectus, see [Research](/legacy/research/)" callout on `history.astro` binds them.

### 3.3 Landing rewrite — `/legacy/`

`src/pages/legacy/index.astro` currently opens with encyclopedia prose + directory cards. Spec Doc #4 says the Theatre Influences essay IS the landing narrative. Approach:

- Move the essay body content into a rendered narrative block on the landing itself (via `getEntry('essays', 'theatre-influences')` and `<Content />`).
- Keep the essay as a standalone `/legacy/essays/theatre-influences/` URL for direct linkability, but the source of truth for prose lives at that route; landing imports it.
- Render the "You are the next heroes and heroines to continue this legacy." line as a large-type callout element (new component `RecruitmentCallout.astro` or inline block; recommend inline — this line is a one-off, not a reusable primitive).
- Anchor the Influences Chart from the landing narrative (`#influences-chart`) so "For further information please see: the summary chart…" resolves to a scroll target on the landing itself (or opens the essay page which contains it — pick one; recommend landing to keep the chart discoverable without a click).
- Section directory cards stay below the narrative — orient visitor to the sub-pages after the story lands emotionally.
- The forward hand-off to Community/membership stays as the closing block, per §4.4.

### 3.4 Founders page rebuild

`src/pages/legacy/founders.astro` today renders `FOUNDERS.map(f => <FounderCard {...} />)` — a bare 9-card grid. Rebuild adds narrative sections around the grid. Structural order:

1. Section intro (2-3 sentences: "The organization cohered around four founders and the institution — the University of Colorado — that resourced them.")
2. **The Four Founders** — 4-card grid (Knaub, Chuck, Lola, Cobin only — the true founders per Doc #3).
3. **Theatre Games origins** — new block with `TestimonyPullQuote` for Cherie and Laurie (see §3.5). Text preserved verbatim in first person.
4. **Contributing Faculty** — subsection with cards or inline entries for Yang and Petersen. Deemphasized visually (smaller cards or two-column list).
5. **Institutional support** — long-form prose (the "keep this passage" text from spec Doc #3): grants+numbers, CU's contributions (van/gas/rehearsal/desk), Chautauqua Park housing.
6. **Foundational Reading** — 6-work bibliography (shared component with `/legacy/research/`).
7. **Critical Early Contributors** — Melinda Scott + Marta Barnard, prose or small-card treatment.
8. **CSF outreach continuity** — Devin era → Chuck-as-Will → Giguere with FB video link + Will Power article link.
9. **Arc ending** — "The Caravan and M.A. ceased when sponsors moved on. However, decades of exploration … have produced Developmental Theatre: Fearless Creativity." Set apart typographically.
10. Cross-links tail: link to Timeline; link to Honoring Our Guides.

Judith Bock stays as-is (unconfirmed chip) — she's not on the four-founder grid, so she gets a small "Unconfirmed contributor" block within Critical Early Contributors OR is deferred to the Cycle-10 client decision.

### 3.5 New components

**`src/components/legacy/TestimonyPullQuote.astro`** — pull-quote primitive for first-person voice. Props: `speaker`, `role`, `year?`, quote via `<slot />`. Visually distinct (indented, italic body, attribution styled per §4 gratitude register). Reuse anywhere first-person survivor testimony appears (Cherie, Laurie, and future testimonies).

**`src/components/legacy/EssayArchivalBadge.astro`** — small chip/banner: "From the Archive, 1971" (year passed as prop). Applied at top of `EssayDetail.astro` when the essay frontmatter has `archival: true` (new optional field on the essays schema). Cycle 9 sets `archival: true` on `towards-a-poor-caravan.mdx` and `developmental-drama.mdx`.

**`src/components/legacy/InfluencesChart.astro`** — responsive table. Rows and columns come from a `src/data/influences-chart.ts` data file (11 rows × 5 columns). Desktop: standard table with sticky first column. Mobile: `overflow-x-auto` wrapper with `min-width` to force horizontal scroll AND sticky row labels via `position: sticky; left: 0` on `<th>` scope=row cells. Alternative mobile presentation (per-tradition card stack) considered and rejected — the chart's value IS the side-by-side comparison; card stack loses that.

**`src/components/legacy/FoundationalReading.astro`** — 6-work bibliography list. Rendered on both `/legacy/founders/` and `/legacy/research/`. Data comes from a `src/data/foundational-reading.ts` array of `{ author, title, year?, note? }`.

### 3.6 Schema evolution

`src/content.config.ts` `essays` schema gains an optional `archival: z.boolean().optional().default(false)` field. Backward compatible — existing essays default to non-archival.

### 3.7 CI guardrail expansion

`scripts/check-prohibited-text.mjs` `PATTERNS` array gains 12 entries from vision-spec §6:

```js
{ pattern: /Lola: I think the customers/, label: 'Legacy §6: Lola editorial note' },
{ pattern: /Desirae is considering/,       label: 'Legacy §6: Desirae working note' },
{ pattern: /record them here/,             label: 'Legacy §6: working-note phrase' },
{ pattern: /Steve Smith needs to confirm/, label: 'Legacy §6: Steve Smith blocker note' },
{ pattern: /\(pic\?\)/,                    label: 'Legacy §6: photo request marker' },
{ pattern: /For Bud Coleman/,              label: 'Legacy §6: research abstract working header' },
{ pattern: /VERSION #2/,                   label: 'Legacy §6: draft version marker' },
{ pattern: /JPJ notes/,                    label: 'Legacy §6: draft version marker' },
{ pattern: /I WASN'T THERE/,               label: 'Legacy §6: Doc #11 collaborator question' },
{ pattern: /TEXT MISSING/,                 label: 'Legacy §6: missing-content marker' },
{ pattern: /LOLA CC ARTICLE/,              label: 'Legacy §6: content-list working note' },
{ pattern: /google\.com\/search\?/,        label: 'Legacy §6: raw google search URL' },
```

Path filter same as existing patterns (`.astro`, `.mdx`, `.md`). Runs in `pnpm build` — build fails if any leak.

## 4. Task list

Tasks are ordered for shipability. Each is independently mergeable and small enough for a 30-90-min implementation session.

**T1 — Nav reorder + Research slot.** Update `LEGACY_NAV` order + insert Research entry + add `Future:` comment for "All That Came After." Update `src/pages/legacy/index.astro` directory-card order to match. No content changes. Ships a nav + landing directory match to spec §2 without touching Research page yet (broken link is temporarily OK; T2 lands within the same cycle).

**T2 — Build `/legacy/research/`.** New page, all four sections (Abstract, Materials, Foundational Reading via shared component, Contact CTA). Uses `ContactForm` (Cycle 6) with a `topic="research"` prop to differentiate. Emit T1's broken link. Trim `history.astro` prospectus paragraph and add the "For the full research prospectus, see Research" callout.

**T3 — `FoundationalReading` component + data file.** `src/data/foundational-reading.ts` + `src/components/legacy/FoundationalReading.astro`. Render on `/legacy/research/` and reserve for T7 use on Founders.

**T4 — Prohibited-string guardrail expansion.** Update `scripts/check-prohibited-text.mjs` PATTERNS array. Rewrite `workshop-manual.mdx:4` excerpt to strip "TEXT MISSING." Run `pnpm check:prohibited` to confirm CI passes with the new patterns.

**T5 — `TestimonyPullQuote` component.** New primitive. Unit test in `tests/unit/testimony-pull-quote.test.ts` (render + a11y attributes + speaker/role composition).

**T6 — `EssayArchivalBadge` component + schema field.** Add `archival: z.boolean().optional().default(false)` to essays schema in `src/content.config.ts`. New component. Applied to `EssayDetail.astro` conditionally.

**T7 — Founders page rebuild.** All 10 structural blocks per §3.4. Adds `role: z.enum(['founder', 'faculty', 'contributor']).default('founder')` to `founders.ts` schema (per §11 decision #5). Migrates 9 existing entries: Knaub/Chuck/Lola/Cobin → `founder`; Yang/Petersen → `faculty`; Cherie/Laurie/Judith Bock → `contributor`. Page structure: 4-card founders grid (`role === 'founder'`); Theatre Games origins uses T5 pull-quote for Cherie + Laurie; Faculty subsection filters `role === 'faculty'`; institutional narrative (numbers-are-sacred verbatim from spec §4.2); FoundationalReading component (T3); Critical Early Contributors filters `role === 'contributor'` (includes Judith Bock with unconfirmed chip); CSF outreach continuity with FB video + Will Power article link (TODO(client) comment on Will Power PDF); arc-ending sentence; cross-links tail.

**T8 — Landing rewrite.** Import Theatre Influences essay body into `/legacy/index.astro`. Render "heroes and heroines" callout inline. Anchor the Influences Chart. Retain closing membership hand-off. Keep essay URL live for direct links.

**T9 — `InfluencesChart` component.** Extract from `theatre-influences.mdx:40-52` into `src/components/legacy/InfluencesChart.astro` + `src/data/influences-chart.ts`. Responsive per §3.5. Replace the MDX table with `<InfluencesChart />` component call in the essay body (MDX components pattern per CLAUDE.md). Also rendered on `/legacy/` landing (T8).

**T10 — Poor Caravan preface + footnote + page-marker restoration.** Edit `src/content/essays/towards-a-poor-caravan.mdx`: restore preface verbatim per spec §3 Doc #5; add `(1)` and `(2)` markers back into the body where they belong; add one archival note ("Footnote text was not present in the surviving typescript.") once; pick page-marker treatment (recommend: remove globally with a single code comment documenting the choice; the marker breadcrumbs harm readability more than they add archival flavor at this length). Set `archival: true` in frontmatter.

**T11 — Developmental Drama link handling.** Restore tmai.net citation. Add build-time link-rot check (`scripts/check-external-links.mjs` — new; scoped to `src/content/essays/*.mdx` external URLs; fail-warn on non-2xx). Set `archival: true` on frontmatter.

**T12 — Cross-links pass.**
- `theatre-influences.mdx:32` — hyperlink Cherie's compilation phrase to `/theatre-games/`.
- `/theatre-games/` (likely `src/pages/theatre-games/index.astro` or a companion component) — add a "From the Archive" callout block linking to `/legacy/essays/workshop-manual/` (matches the Legacy-side placeholder body copy).
- `why-these-plays-are-successful.mdx` — add companion callout linking to `/childrens-theatre/why-these-plays-work/`.
- `/childrens-theatre/why-these-plays-work.astro` — reciprocal link.
- `founders.astro` — add "Explore the Grand Timeline →" link (T7 covers this within the cross-links tail; explicit here for completeness).
- `Timeline.astro` — each timeline event participant list gains a subtle "See Founders" or per-participant anchor. Recommend a single per-page "About the people in this timeline → Founders" tail rather than per-entry anchors to avoid participant-name parsing (spec §5 item 3 forbids it for v1).

**T13 — Typo + parseYear hardening.**
- `theatre-influences.mdx:26` — "Berthold" → "Bertolt" (also flagged in vision spec Doc #4 as safe fix).
- `timeline.ts` `parseYear` — return `null` still, but modify `groupByDecade` to bucket null-year events into an "Undated / Approximate" trailing group, OR emit a `console.warn` at build time listing offending entries. Recommend the trailing-bucket approach: silent-drop is the actual defect.

**T14 — CLAUDE.md + memory updates.** Document Cycle 9 conventions: `TestimonyPullQuote`, `EssayArchivalBadge`, `InfluencesChart`, `FoundationalReading`, the archival essay pattern, the expanded prohibited-string guardrail, the `/legacy/research/` route. Update project_dtfc_followups memory with Cycle 9 deferrals.

**T15 — Final whole-branch review.** Run the same review pass the prior cycles used. Confirm all 12 acceptance criteria per §6 of this doc pass or have explicit soft-ship justification.

## 5. Component + file plan

**Create:**
- `src/pages/legacy/research.astro`
- `src/components/legacy/TestimonyPullQuote.astro`
- `src/components/legacy/EssayArchivalBadge.astro`
- `src/components/legacy/InfluencesChart.astro`
- `src/components/legacy/FoundationalReading.astro`
- `src/data/foundational-reading.ts`
- `src/data/influences-chart.ts`
- `scripts/check-external-links.mjs` (build-time link rot check for archival essays)
- `tests/unit/testimony-pull-quote.test.ts`
- `tests/unit/foundational-reading.test.ts`
- `tests/unit/influences-chart.test.ts`

**Modify:**
- `src/lib/legacy-nav.ts` — reorder + insert Research + comment "All That Came After" slot
- `src/content.config.ts` — `essays` schema gains optional `archival` field
- `src/pages/legacy/index.astro` — landing rewrite around Theatre Influences narrative
- `src/pages/legacy/founders.astro` — 10-block rebuild per §3.4
- `src/pages/legacy/history.astro` — trim prospectus content moved to Research; add "For the full prospectus, see Research" callout
- `src/components/legacy/EssayDetail.astro` — conditional archival badge render
- `src/content/essays/towards-a-poor-caravan.mdx` — preface verbatim + footnote markers + archival note + page-marker treatment + `archival: true`
- `src/content/essays/developmental-drama.mdx` — tmai.net link + `archival: true`
- `src/content/essays/theatre-influences.mdx` — typo fix, Cherie hyperlink, replace MDX pipe-table with `<InfluencesChart />`
- `src/content/essays/workshop-manual.mdx` — strip "TEXT MISSING" from excerpt
- `src/content/essays/why-these-plays-are-successful.mdx` — companion callout to Children's Theatre practitioner version
- `src/pages/childrens-theatre/why-these-plays-work.astro` — reciprocal callout to Legacy version
- `src/pages/theatre-games/index.astro` (or the closest sub-nav-landing surface for Theatre Games) — "From the Archive" Workshop Manual callout
- `src/lib/timeline.ts` — `groupByDecade` handles null-year via trailing "Undated" bucket
- `src/components/legacy/Timeline.astro` — render "About the people → Founders" tail
- `scripts/check-prohibited-text.mjs` — extend PATTERNS with 12 §6 entries
- `package.json` `build` script — run `check-external-links.mjs` alongside existing prebuild checks
- `CLAUDE.md` — Cycle 9 conventions

**Consider (may or may not need):**
- `src/data/founders.ts` — schema may gain `role: 'founder' | 'faculty' | 'contributor'` to drive T7 grid split. Alternative: keep the flat array and split at the page level via slug allowlist. Recommend the role field.

## 6. Testing

- **Unit (Vitest):**
  - `testimony-pull-quote.test.ts` — renders speaker/role/year and slot; a11y roles present.
  - `foundational-reading.test.ts` — 6 works render; each has author + title; sort stability.
  - `influences-chart.test.ts` — 11 rows × 5 cols present in data; component renders sticky-header attributes.
  - Extend existing prohibited-text unit test (if present) or add one covering the 12 new §6 patterns.
- **E2E (Playwright, existing single test):**
  - Extend the smoke test with a `/legacy/research/` visit that asserts the contact form renders + Foundational Reading list is present.
  - Axe scan checkpoint added for `/legacy/research/` and rebuilt `/legacy/founders/`.
  - Verify the "You are the next heroes and heroines" callout is present on `/legacy/`.
- **Verify per task:** `pnpm check` + `pnpm build` (guardrails including new §6 patterns + external link check) + `pnpm test` + `pnpm test:e2e` — controller-verified between tasks per prior-cycle discipline.

## 7. Soft-ship items this cycle

Cycle 9 adds few new soft-ships — most content gaps close. Remaining and new:

1. **Will Power article link** on Founders page CSF continuity block — TODO(client) comment; link points to Drive/external until permission arrives for local PDF hosting.
2. **CSF Facebook video** — external Facebook link, no self-hosted mirror.
3. **Poor Caravan page markers** — decision documented in-code (recommend: removed globally with archival note explaining choice). If controller/client prefers the marginal-annotation treatment, T10 is a one-file swap.
4. **Judith Bock** — unchanged from Cycle 5; unconfirmed chip. Moved into Critical Early Contributors block; still awaits client confirmation.
5. **`archival` essays schema field** — only two essays flip to `true` this cycle. Future archival essays set it themselves.

Carried-over soft-ships (unchanged this cycle):
- Workshop Manual body text — placeholder + now cross-linked from both sections.
- Timeline canonical version pending Steve Smith.
- Founder headshots — placeholder initials remain.

## 8. Cross-file consistency preserved

- All prior-cycle sub-nav patterns, ReflectivePrompt, chip vocabulary, Formspree fallback pattern, `data-print-hide` convention unchanged.
- Curly-apostrophe guardrail remains active. New MDX content authored with `&rsquo;` per CLAUDE.md convention.
- FOUNDERS-pattern `z.infer` explicit-defaults rule extended to the (possible) `role` field on `founders.ts`.
- `is:inline` script DOMContentLoaded-wait pattern unchanged.
- MDX-with-components pattern (`<Content components={{ InfluencesChart }} />`) matches the existing SideBySide / Concept precedent.
- `EssayDetail.astro`'s conditional archival badge is opt-in — non-archival essays render unchanged.
- Landing rewrite preserves `LANDING_MODE` and the Idea-Two answer map (`src/data/landing.ts`) — Legacy anchors from Idea Two continue to resolve.

## 9. Success criteria

Cycle 9 is complete when:

- `pnpm build` clean; both existing guardrails and the extended §6 prohibited-string guardrail pass; external link check passes.
- `pnpm check` — 0 errors.
- `pnpm test` — all Vitest suites green (Cycle 7's suites + 3 new component tests).
- `pnpm test:e2e` — Playwright green; axe reports 0 critical/serious across audited pages including `/legacy/research/` and rebuilt `/legacy/founders/`.
- All 12 vision-spec acceptance criteria pass or have explicit soft-ship justification in §7:
  1. Pages exist in client's order (nav reordered, `/legacy/research/` present, Doc #1 not rendered).
  2. All three vision goals demonstrable — evidence layer (numbers on `/legacy/history/` + `/legacy/founders/`), gratitude register (testimony pull-quotes), heroes-and-heroines hand-off (landing callout).
  3. Founders page carries all Doc #3 elements per §3.4.
  4. Influences Chart is a responsive component reachable from landing.
  5. Poor Caravan + Developmental Drama have archival framing.
  6. Timeline unchanged mechanically; Founders↔Timeline links present; `parseYear` fuzzy-date fallback bucket in place.
  7. Workshop Manual placeholder exists and is linked from Theatre Games.
  8. `/legacy/research/` carries abstract + materials + replication branches + Foundational Reading + contact CTA.
  9. Zero occurrences of §6 strings in built output (CI enforced).
  10. Every §7 cross-section contract resolves; unresolvable references removed or point to real destinations.
  11. Name-spelling conflicts already resolved in Cycle 5; adds one-line comment in `src/data/timeline.json` header or a `docs/naming.md` recording client-confirmed spellings (Giguere, Barnard) — small polish.
  12. Doc #11 content absent; `LEGACY_NAV` has commented "Future: All That Came After" slot.
- CLAUDE.md updated with Cycle 9 conventions.
- Memory `project_dtfc_followups.md` updated with any Cycle 9 deferrals.

## 10. Blockers for future cycles

- **Will Power article hosting permission** (Cycle 10 or ad-hoc content commit).
- **Judith Bock role confirmation** — Cycle 10 or client-triggered.
- **Workshop Manual body text** (Cycle 10 or client-triggered content commit).
- **Timeline canonical version confirmation** (Steve Smith).
- **Doc #11 "All That Came After" content** — architectural slot ready; content authoring is a future cycle when the client provides material.
- **Client review markers** on any new Legacy prose written this cycle (institutional narrative, arc-ending, CSF continuity) — bundle for Lola/Laurie review post-merge.

## 11. Decisions (locked pre-implementation)

Controller confirmed these calls 2026-08-12; T7 / T8 / T10 build against them.

1. **Poor Caravan preface — VERBATIM per vision spec.** Restore source text exactly ("This was Chuck Wilcox' report at the end of the first year of the Colorado Caravan. It is taken from typed carbon copy which had footnotes indicated but no text of them."). Restore (1)/(2) footnote markers with one archival note explaining absent footnote text. Vision spec §3 Doc #5 supersedes any prior editorial cleanup. Applies to T10.
2. **Founders page grid — SPLIT (4 founders + testimony + faculty + contributors).** 4-card "The Four Founders" grid: Knaub, Chuck, Lola, Cobin. Cherie + Laurie move into a Theatre Games origins block rendered via `TestimonyPullQuote` (first-person voice preserved). Yang + Petersen form a "Contributing Faculty" subsection. Judith Bock joins "Critical Early Contributors" (unconfirmed chip retained). Applies to T7.
3. **Landing page — FULL Theatre Influences essay inline.** Embed the entire narrative on `/legacy/` so the fairy-tale opening, heroes-and-heroines callout, and Influences Chart are all present without a click. Essay URL at `/legacy/essays/theatre-influences/` stays live for direct linking. Landing gets long; mitigated by section anchors and (recommend) a small in-page table-of-contents strip near the top. Applies to T8.
4. **Poor Caravan page markers — REMOVE GLOBALLY.** Strip all `(End Chuck P.1)`-style breadcrumbs from the essay body. Add a code comment in `towards-a-poor-caravan.mdx` documenting the choice + link back to the source doc. Archival flavor is carried by the era badge + verbatim preface + footnote note. Applies to T10.
5. **`role` field on `founders.ts` — YES, ADD IT.** Decision retained by author (not raised with controller). Rationale: the split in decision #2 becomes a one-line filter (`FOUNDERS.filter(f => f.role === 'founder')`) rather than a fragile slug allowlist. Schema evolution: add `role: z.enum(['founder', 'faculty', 'contributor']).default('founder')` to `founders.ts`. Migration: annotate the 9 existing entries — Knaub/Chuck/Lola/Cobin → `founder`; Yang/Petersen → `faculty`; Cherie/Laurie/Judith Bock → `contributor`. Applies to T7.
