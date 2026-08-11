# DT:FC Website — Cycle 2 Design: Landing Page (Vision Fidelity)

**Date:** 2026-08-10
**Source specs:**
- `/Users/cnote/Downloads/dtfc-landing-page-vision-spec.md` (vision-fidelity spec — primary)
- `/Users/cnote/Downloads/dtfc-website-spec.md` §4.1 (superseded for the landing page by the above)
- `docs/superpowers/specs/2026-08-10-dtfc-website-cycle1-design.md` (predecessor cycle)

**Cycle scope:** Rebuild the landing page to fulfill the vision-fidelity spec, plus light seeding of the six section landing pages so the "Idea Two" promise (§6 of the vision spec) can be honored in-section and reflective prompts can render.

**Branch:** `cycle-2-landing`

---

## 1. Re-Sequencing Note

The Cycle 1 design doc pencilled Cycle 2 as **Shakespeare** and pushed the landing-page rebuild (with rotating teaser questions) to **Cycle 5**. The vision-fidelity spec re-scopes: the landing page becomes the Cycle 2 deliverable because it embodies the identity and navigation promise the whole site rests on. Consequences:

- Shakespeare shifts to Cycle 3 (was Cycle 2).
- Children's Theatre → Cycle 4 (was Cycle 3).
- Legacy → Cycle 5 (was Cycle 4).
- Community + forms → Cycle 6 (was Cycle 5).
- Cross-site search + launch checklist → Cycle 7 (was Cycle 6).

The memory index (`project_dtfc_cycles.md`) will be updated at end of cycle to reflect the new sequence.

---

## 2. Cycle 2 Scope

### 2.1 Ships in Cycle 2

- **Landing page rebuild** (`src/pages/index.astro`):
  - 3×3 grid with Community centered/dominant. Five surrounding section tiles: Theatre Games, Shakespeare, Children's Theatre, Legacy, Players Resource Center. Workshops takes a sixth cell as a smaller, dashed-border "Coming Next Year" tile. The remaining two cells hold a compact newsletter signup and one ornament/whitespace cell (see §7). Total: 9 cells, 8 with content.
  - Mobile: single-column stack with Community first, then the five sections in nav order, then Workshops, then the compact newsletter signup.
  - Community center renders the canonical Third Revision text from vision spec §3.1, with `RESILIENCE` styled emphasis and "Be Fearlessly Creative!" as headline-weight identity line.
- **Data-driven box content** (`src/data/landing.ts`): one file, Zod-validated at import. Global `LANDING_MODE` switch (`list | questions | hybrid`, default `hybrid`) with per-box overrides. Both Idea One lists (§4.1) and Idea Two questions (§4.2) present verbatim.
- **Reflective prompts on each section landing page**: a rotating "Take a moment…" prompt in the section header, seeded from the section's 5-prompt bank (vision spec §5). Randomly picked on load, skippable by scrolling, never gating. Falls back to a full 5-item list if JS is disabled.
- **Idea Two answer seeding** on section landing pages: short teaser paragraphs that resolve each of the 13 §6 questions in-section. Existing content on Theatre Games and PRC covers most; new copy written where gaps exist.
- **Two flagged content gaps** written this cycle:
  - PRC: `ICONs` explainer concept entry (`src/content/concepts/icons.mdx`) + landing-page callout.
  - Theatre Games: explicit resignation-vs-resilience sentence within the Resilience competency section.
- **Prohibited-text guardrail** (`scripts/check-prohibited-text.mjs`): fails the build on any occurrence of the vision spec's prohibited phrases or source typos.
- **One-time era-bound-copy audit**: grep sweep across content directories for era-bound framing (`crisis`, `unprecedented`, `these times`, etc.); fixes bundled or ticketed per instance.
- **Testing**: new Vitest suite for the landing data model and prohibited-text guardrail; Playwright smoke test extended to verify landing identity + one section reflective prompt.
- **CLAUDE.md + memory updates** at end of cycle.

### 2.2 Explicitly deferred

- Real section-page rebuilds (Shakespeare's Ask Shakespeare archive, Legacy's interactive timeline, Children's Theatre script pages, Community's membership tiers, PRC's remaining concept entries). Those stay on their re-sequenced cycles.
- Full answer pages beyond what §6 requires. Idea Two answers in Cycle 2 are teaser paragraphs with "Read more →" links; the destinations may still be stubs.
- Server-side or build-time randomization of prompts (would need SSR). Cycle 2 uses client-side random selection.
- Video interstitial variants suggested by the vision spec's optional-expander wording.
- Zeffy donate URL, ESP wiring — still deferred per Cycle 1 TODOs.

---

## 3. Data Model

### 3.1 `src/data/landing.ts` (rewritten)

Single source of truth for the landing page and reflective prompts. Zod-validated at import time so any drift from the vision-spec §§4–5 fails the build.

```typescript
import { z } from 'astro:content';

const BoxMode = z.enum(['list', 'questions', 'hybrid']);
export type BoxMode = z.infer<typeof BoxMode>;

const BoxVariant = z.enum(['standard', 'center', 'secondary']);
export type BoxVariant = z.infer<typeof BoxVariant>;

const BoxSchema = z.object({
  key: z.string(),                    // stable id; matches nav key from src/lib/nav.ts
  label: z.string(),                  // display name (canonical, post-normalization)
  href: z.string(),                   // section route
  summary: z.string(),                // Idea One one-line summary for hybrid mode
  listItems: z.array(z.string()),     // Idea One content list (§4.1) — empty for center/secondary
  questions: z.array(z.string()),     // Idea Two curiosity questions (§4.2) — empty for center/secondary
  mode: BoxMode.optional(),           // per-box override; defaults to LANDING_MODE
  variant: BoxVariant.default('standard'),
});
export type Box = z.infer<typeof BoxSchema>;

// The client-flippable switch. Change this one line to change every standard box's rendering.
export const LANDING_MODE: BoxMode = 'hybrid';

export const COMMUNITY_CENTER = {
  headline: 'Be Fearlessly Creative!',
  keepExploring: 'Keep exploring!',
  body: 'We train physical and vocal readiness, how to recognize new contexts, and ways to nurture RESILIENCE that will keep you learning in unexpected and challenging situations.',
  extended: [
    'This community explores how to courageously use one’s voice and physical presence, recognize new contexts, manage risk, and nurture RESILIENCE.',
    'We provide fast access to entertaining Developmental Theatre techniques and tools for expected or challenging situations.',
  ],
} as const;

export const SECTION_BOXES: Box[] = [
  // Five standard boxes here, verbatim from vision spec §4:
  //   theatre-games, shakespeare, childrens-theatre, legacy, resource-center.
  // Ordered to match nav.ts order for a11y reading order on mobile.
  // Community is not in this array — it renders via COMMUNITY_CENTER as the
  // grid's center tile with a different component (CommunityCenter.astro).
];

export const WORKSHOPS_BOX: Box = {
  key: 'workshops',
  label: 'Workshops',
  href: '/workshops/',
  summary: 'Coming Next Year',
  listItems: [],
  questions: [],
  variant: 'secondary',
};

const ReflectiveBankSchema = z.object({
  sectionKey: z.string(),
  prompts: z.array(z.string()).length(5),  // vision spec §5: exactly 5 per section
});
export type ReflectiveBank = z.infer<typeof ReflectiveBankSchema>;

export const REFLECTIVE_BANKS: ReflectiveBank[] = [
  // Six banks × 5 prompts each, verbatim from vision spec §5:
  // shakespeare, childrens-theatre, theatre-games, community, legacy, resource-center.
];

// Runtime safety: verify every non-secondary box has questions covering §6's 13 mappings.
// Executed as a top-of-module IIFE; throws (fails the build) on drift.
```

### 3.2 Superseded content — never included

Per vision spec §2.4 last paragraph:

- The docx's *first* question set (Acting/Performance, Playwriting, Directing, Technical Theater, Theater History, Community Engagement) — replaced by the real section names.
- The docx's *first* Legacy reflective question set — Lola explicitly asked for revision.

The Vitest suite includes a smoke test that greps `REFLECTIVE_BANKS` and `SECTION_BOXES` for phrases from these superseded sets and fails if present.

---

## 4. Component Architecture

All new landing-page components live under `src/components/landing/`. The reflective-prompt component lives under `src/components/section/` (it belongs to `SectionLayout`, not the landing page).

| Component | Purpose | Consumes |
|---|---|---|
| `landing/LandingGrid.astro` | Renders the 3×3 desktop grid / single-column mobile stack. Slots Community into center, six section boxes surrounding, Workshops in the remaining cell. | `SECTION_BOXES`, `WORKSHOPS_BOX`, `COMMUNITY_CENTER`, `LANDING_MODE` |
| `landing/CommunityCenter.astro` | Renders the center tile — identity h1, "Keep exploring!" opener, primary body with inline `<Resilience>`, `extended` paragraphs at secondary weight. | `COMMUNITY_CENTER` |
| `landing/SectionBox.astro` | Renders one section box shell (border, hover, focus ring, link semantics). Delegates body to `BoxContent`. | `Box`, resolved mode |
| `landing/BoxContent.astro` | Given a box + resolved mode, renders the mode-specific body: `list` → `<ul>` of `listItems`; `questions` → `<ul>` of `questions`; `hybrid` → `summary` paragraph + one rotating question. | `Box`, `BoxMode` |
| `landing/WorkshopsTile.astro` | Smaller, dashed-border variant of a section tile. "Coming Next Year" label prominent; links to `/workshops/` for interest capture. Always renders. | `WORKSHOPS_BOX` |
| `landing/NewsletterTile.astro` | Compact grid-cell variant of the existing footer `NewsletterSignup`. Single email input + submit button; no supporting copy. Reuses the same submission handler (currently the `TODO(esp)` placeholder). | (none — shape-only) |
| `landing/Resilience.astro` | One-purpose wrapper that renders "RESILIENCE" with small-caps + `font-semibold` styling from tokens. Used in Community body and anywhere else the source emphasis appears. | none |
| `section/ReflectivePrompt.astro` | Renders a section's 5-prompt bank as a `<ul data-reflective>`; inline script picks one at random on `DOMContentLoaded` and hides the rest via the `hidden` attribute. No-JS fallback shows all 5 as a list. Rendered inside each section's page below its main heading; `sectionKey` passed as a prop by each `*/index.astro` (a `SectionLayout` slot would also work; per-page prop is simpler and matches the existing Cycle 1 pattern where section pages own their content). | `sectionKey`, `REFLECTIVE_BANKS` |

**Rotation strategy** — no JS islands, no build-time randomness:

- Hybrid teaser question in `BoxContent`: same pattern as `ReflectivePrompt`. `<ul data-teaser>` with all questions, inline script reveals one on load. Falls back to all questions visible if JS is off.
- If a box has 0 questions (e.g., Workshops), the hybrid path renders only the summary. No script needed.
- Total inline script footprint: ~20 lines, single small IIFE, no framework.

**Trade-off:** brief pre-JS flash of the full list before hydration. Acceptable for a nonprofit content site; can be minimized with `hidden` attributes and CSS `:has()` fallback.

---

## 5. File Additions and Modifications

```
docs/superpowers/specs/
  2026-08-10-dtfc-cycle2-landing-design.md    # this file

src/components/landing/                       # new directory
  LandingGrid.astro
  CommunityCenter.astro
  SectionBox.astro
  BoxContent.astro
  WorkshopsTile.astro
  NewsletterTile.astro
  Resilience.astro

src/components/section/                       # new directory
  ReflectivePrompt.astro

src/data/
  landing.ts                                  # rewritten (schema + verbatim §4 + §5 content)

src/content/concepts/
  icons.mdx                                   # new: ICONs explainer entry

src/pages/
  index.astro                                 # rewritten to use LandingGrid
  community/index.astro                       # add ReflectivePrompt + membership teaser paragraph
  shakespeare/index.astro                     # add ReflectivePrompt + three teaser paragraphs (§6)
  childrens-theatre/index.astro               # add ReflectivePrompt + two teaser paragraphs (§6)
  legacy/index.astro                          # add ReflectivePrompt + Colorado Caravan + Founders teaser
  theatre-games/index.astro                   # add ReflectivePrompt + resignation-vs-resilience sentence
  resource-center/index.astro                 # add ReflectivePrompt + ICONs callout

scripts/
  check-prohibited-text.mjs                   # new prebuild guard

tests/unit/
  landing.test.ts                             # data schema + prompt selection + mode resolution
  prohibited-text.test.ts                     # fixture-driven guardrail smoke test

tests/e2e/
  smoke.spec.ts                               # extended: landing identity + one section reflective prompt

package.json                                  # prebuild chain adds check-prohibited-text
CLAUDE.md                                     # landing data model, guardrail command, new dirs
```

---

## 6. Copy Written This Cycle

All new prose that isn't sourced verbatim from the vision spec gets a `<!-- CLIENT REVIEW: reason -->` HTML comment above it so the seams are visible to you and to Lola/Laurie during review.

| Section | New copy | Word count est. |
|---|---|---|
| Children's Theatre | Two paragraphs: bare-stage imagination principle; versatile casting cross-link to PRC. | ~120 |
| PRC | ICONs explainer concept (`icons.mdx`) — short definition + full body. Landing-page callout answering "What are the ICONS?" | ~180 |
| Theatre Games | One sentence + one paragraph resolving resignation-vs-resilience, placed in Resilience competency block. | ~80 |
| Shakespeare | Three teaser paragraphs: 440+ years / ~37 plays; Daniel S.P. Yang Chinese translation; Ask Shakespeare concept intro. | ~200 |
| Legacy | Two paragraphs: Colorado Caravan origin; Founders teaser; join-the-legacy cross-link to Community. | ~150 |
| Community | One short paragraph on membership as the on-ramp; cross-linked from Legacy. | ~60 |

Total new draft copy: ~790 words. Every paragraph flagged for client review.

---

## 7. Grid Composition — What Goes in Each Cell?

The 3×3 grid has 9 cells. Community occupies the center. The six section boxes need to fill six of the eight surrounding cells; Workshops takes one. That leaves one cell that must be handled deliberately.

**Options considered:**

1. Leave the ninth cell empty (whitespace as a design element).
2. Put a duplicate small "About / What is DT:FC?" tile there.
3. Put a small "Newsletter signup" tile there.

**Recommendation: Option 3.** A compact newsletter tile in the corner mirrors the footer signup, gives the grid visual balance, and honors the source spec's emphasis on newsletter capture. Uses the existing `NewsletterSignup` component (perhaps a `compact` variant). Flagged in the design as a decision for review.

**Grid cell assignment (desktop):**

```
+-------------+-------------+-------------+
| Theatre     | Shakespeare | Children's  |
| Games       |             | Theatre     |
+-------------+-------------+-------------+
| Legacy      | COMMUNITY   | Players     |
|             | (center)    | Resource    |
+-------------+-------------+-------------+
| Newsletter  | Workshops   | (spare/     |
| (compact)   | (secondary) |  identity   |
|             |             |  ornament)  |
+-------------+-------------+-------------+
```

The ornament cell is deliberate whitespace — a plain ivory panel with a subtle DT:FC monogram or the tagline, no interactive content. If the client rejects the newsletter tile (client question #4 in §12), the newsletter cell also becomes ornament space and the grid becomes "5 sections + Community + Workshops + 2 ornament cells."

Mobile reading order (single column): Community → Theatre Games → Shakespeare → Children's Theatre → Legacy → Players Resource Center → Workshops → Newsletter. Ornament cells are skipped in the mobile stack (they add nothing without the grid geometry).

---

## 8. Prohibited-Text Guardrail

New script `scripts/check-prohibited-text.mjs`, patterned after `scripts/check-concept-refs.mjs`. Runs in the prebuild chain before Astro build.

**Files scanned:** `src/**/*.{astro,mdx,md,ts,tsx,js,jsx}`, `src/content/**/*.mdx`, `src/data/**/*.ts`, `public/**/*.svg`.

**Patterns (case-insensitive except where noted):**

| Pattern | Reason |
|---|---|
| `/great change/i` | Rejected slide-3 phrasing |
| `/traditional work and ways/i` | Rejected slide-3 phrasing |
| `/RESILIENCEl/` (case-sensitive) | Source typo — never reproduce |
| `/Childrens'\s+Theatre/` | Wrong-apostrophe form from slides |
| `/\bTHIS\s+\(crazy\)\s+time\b/i` | Explicitly rejected by Pua |

**Behavior:** on match, print each occurrence with `file:line:col`, exit with code 1. On clean, exit 0 silently.

**Escape hatch:** the vision spec itself contains all these strings for reference. The script ignores the design-docs directory (`docs/**`) and this file's own directory by default.

---

## 9. Idea Two Verification Map (from vision spec §6)

Cycle 2 must ensure each of these 13 questions has a resolving answer in-section. Column 3 is the Cycle 2 disposition.

| # | Question | Answer lives at | Cycle 2 disposition |
|---|---|---|---|
| 1 | Imagination provides all sets/props? | Children's Theatre landing | Write teaser paragraph |
| 2 | Play fun for every person involved? | Children's Theatre / cross-link PRC casting | Write teaser paragraph |
| 3 | Where do I find vocabulary/concepts? | PRC landing | Already exists — verify |
| 4 | What are the ICONS? | PRC landing callout + `icons.mdx` | Write both this cycle |
| 5 | What makes learning playful/empowering? | Theatre Games landing definition | Verify current copy answers; write short sentence if missing (audited: not currently explicit) |
| 6 | Resignation vs. resilience? | Theatre Games → Resilience competency | Write this cycle |
| 7 | Which competency trains Elocution etc.? | Theatre Games → Vocal Expression card | Verify current copy answers; write mapping line if missing (audited: not currently explicit) |
| 8 | 440+ years, how many plays? | Shakespeare landing | Write teaser paragraph |
| 9 | Who translates into Chinese? | Shakespeare landing | Write teaser paragraph |
| 10 | Ask Shakespeare form? | Shakespeare landing concept intro | Write teaser paragraph (form ships in Cycle 3) |
| 11 | CU 1970s Colorado Caravan? | Legacy landing | Write teaser paragraph |
| 12 | Who founded Developmental Theatre? | Legacy → Founders teaser | Write teaser paragraph |
| 13 | Become part of this Legacy? | Community landing membership paragraph | Write teaser paragraph |

**Note on question count:** the vision spec's §4.2 lists 14 curiosity questions total across the five section boxes; §6 lists 13 answer mappings. The 14th question — Children's Theatre's "As a child did you create plays with friends?" — is a reflective invitation that doesn't need an in-site answer; the vision spec deliberately omits it from §6. `SECTION_BOXES` stores all 14 verbatim; the verification test iterates only the 13-row §6 table.

**Testing:** a Vitest test in `landing.test.ts` iterates this table and asserts each answer's URL fragment (or landing section anchor) is reachable at build time via a content-collection lookup or a page-slug check.

---

## 10. Testing

**Vitest — `tests/unit/landing.test.ts`:**

- `SECTION_BOXES` parses against `BoxSchema`; every non-secondary box has at least 1 question and 1 list item.
- `REFLECTIVE_BANKS` has exactly 6 banks and each has exactly 5 prompts; sectionKeys match a subset of nav keys.
- All 14 vision-spec §4.2 questions appear across `SECTION_BOXES[*].questions` (verbatim); of those, the 13 that appear in vision-spec §6 have a corresponding in-section resolver per the §9 table below.
- Prompt-selection helper: given a seed, returns a deterministic index in `[0, prompts.length)`.
- Superseded-set smoke test: assert `REFLECTIVE_BANKS` contains no phrases from the first-generic-set or first-Legacy-set (grep against 6 known distinctive fragments).

**Vitest — `tests/unit/prohibited-text.test.ts`:**

- Feeds fixture strings to the guardrail module (extracted from the script for testability); asserts detection of each prohibited pattern; asserts clean inputs pass.

**Playwright — `tests/e2e/smoke.spec.ts` (extended):**

- Landing: canonical `Be Fearlessly Creative!` visible; canonical body text visible; grid renders 5 section tiles + Community + Workshops + Newsletter (8 content cells); Community cell visually dominant (a11y snapshot has an h1 with the identity line); RESILIENCE is rendered inside a `<strong>` element.
- Section (`/legacy/`): a reflective prompt is visible in the header; scrolling past it hides nothing that gates content.
- Regression: existing Cycle 1 golden path (theatre-games finder, concept popover) still passes.

**No new content-collection tests** — the schema in `content.config.ts` already validates game/concept frontmatter; the landing schema is standalone.

---

## 11. Accessibility

- Grid is a `<section aria-label="Explore DT:FC">` using CSS grid, with children of varying semantics: Community center as `<article>` (identity h1 + body); five section tiles as an inner `<ul>` of `<li>` items containing anchor links (screen readers get a real list of destinations); Workshops as an `<aside>` with a link; Newsletter as a `<form>`; ornament cells are `aria-hidden` decorative `<div>`s.
- Community center is an `<article>` with an `h1` (the identity line); other section tiles have `h2`s.
- Mobile stack: reading order matches DOM order (Community first, then nav order, then Workshops).
- `RESILIENCE` emphasis rendered via `<Resilience>` uses `<strong>` semantics + `.font-semibold` + `text-transform: uppercase` so screen readers announce emphasis, not just visual styling.
- `ReflectivePrompt`: hidden items use `hidden` attribute (not `display: none` alone) so they're skipped by AT. The revealed prompt is a normal `<p>` inside the section header.
- `prefers-reduced-motion` honored: hover elevations and any transitions capped at 120ms; no keyframe animation added by this cycle.
- Contrast: all new colors sourced from tokens; existing pairings already validated AA. The dashed border on Workshops uses the same clay tone at 60% opacity — validated separately.

---

## 12. Open Client Questions (bundled into a single email at cycle end)

Draft language, ready to send once implementation is far enough along that the questions have visible context:

> "A few small landing-page decisions before we lock it in — happy to share a preview URL when you'd like to see them in place:
>
> **1. Section naming — Children's Theatre vs Children's Plays.** The section is called 'Children's Theatre' in the deeper documents but the landing-page docx uses 'Children's Plays.' The site currently uses 'Children's Theatre' everywhere; we'd like to confirm that's your preference.
>
> **2. Community center wording.** The site uses the Pua/Pualani Third Revision text approved by Laurie and Lola. Just double-checking that's still the canonical version.
>
> **3. Reflective questions — softened.** Your docx says visitors should 'answer the questions before they can enter' the sections. We softened that to a rotating 'Take a moment…' prompt that visitors can read or skip — forcing an answer would fight the site's other promise of instant access. Let us know if you want us to lean stronger (e.g., an expander they have to open before the link becomes active).
>
> **4. Ninth grid cell.** The 3×3 grid has one extra cell after Community, the six sections, and Workshops. We put a compact newsletter signup there. Alternatives: leave it empty, or use it for a small 'About DT:FC' tile.
>
> **5. PRC question count.** The docx has three curiosity questions per box for most sections, but only two for the Players Resource Center. We kept it at two, verbatim from your document. Want us to add a third?"

Cycle 2 does not block on client responses for #1, #4, and #5 — reasonable defaults ship and can be swapped from data with a one-line change. #2 and #3 are conservative confirmations, not blockers.

---

## 13. Memory + CLAUDE.md Updates (End of Cycle)

**Auto-memory updates:**

- `project_dtfc_cycles.md`: note the re-sequencing (Cycle 2 = landing, Shakespeare → 3, etc.), Cycle 2 ship date, remaining cycles.
- `project_dtfc_followups.md`: add any items deferred during Cycle 2 that don't already appear (likely: the compact-newsletter component, whichever client questions remain open).

**CLAUDE.md updates:**

- Under **Key conventions**, add a paragraph on the landing data model: single `src/data/landing.ts` file, Zod-validated, `LANDING_MODE` switch, per-box overrides.
- Under **Commands** or **Key conventions**, add the prohibited-text guardrail: `scripts/check-prohibited-text.mjs` runs in prebuild; the list of forbidden phrases lives in that file.
- Under repo structure notes, mention `src/components/landing/` and `src/components/section/` as new directories.
- Update the **Deferred / TODO markers** section: newsletter tile in landing grid (if kept) inherits the ESP TODO from the footer signup.

---

## 14. Success Criteria (verifiable)

Cycle 2 is complete when all of the following are true:

1. `pnpm build` succeeds; prohibited-text guardrail passes; concept-refs guardrail passes.
2. Landing page renders 8 content tiles on desktop (Community center + 5 section tiles + Workshops + compact Newsletter, plus 1 decorative ornament cell) in the layout described in §7, and collapses to a single-column mobile stack in the reading order specified.
3. Community center displays the canonical Third Revision text verbatim, with `RESILIENCE` visually emphasized (small-caps + weight) and "Be Fearlessly Creative!" as the h1.
4. Every section landing page shows a rotating reflective prompt in its header, sourced from the correct §5 bank, skippable, non-gating.
5. Every one of the 13 Idea Two questions from §6 has a resolving answer paragraph in-section (verified by the landing.test.ts table iteration).
6. Switching `LANDING_MODE` from `hybrid` to `list` or `questions` in `src/data/landing.ts` changes every standard box's rendering with no other code changes.
7. Vitest suite passes (existing tests + new `landing.test.ts` + `prohibited-text.test.ts`).
8. Playwright smoke test passes end-to-end.
9. Basic AA audit clean on the landing page and at least three section landing pages.
10. Naming decision (Children's Theatre vs Children's Plays) is either confirmed or explicitly deferred with a follow-up ticket.
11. Memory index and CLAUDE.md updated as specified in §13.

---

## 15. Handoff

After the user approves this design, the next step is to invoke the `superpowers:writing-plans` skill to produce a step-by-step implementation plan against this spec. Implementation happens on the `cycle-2-landing` branch; merge to `main` uses `--no-ff` per the branching convention.
