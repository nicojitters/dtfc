# Primary Teal / Secondary Black — Visual System Reset

**Date:** 2026-09-05
**Status:** Approved design, pending implementation plan
**Author:** Design conversation with Claude (Opus 4.7)
**Session context:** Fourth teal-alignment escalation this session. See prior PRs #4 (ramp shift), #5 (Clay↔Teal role swap), #6 (footer/header borders + global link color).

---

## 1. Intent

Move the DT:FC website to match the primary DT:FC logo's aesthetic: **black + white + teal accent.** The user shipped the logo mid-session as concrete grounding: black-ink spiral + arrows on white, "DEVELOPMENTAL THEATRE / FEARLESS CREATIVITY" arced around it in bold geometric sans. Matching the *brand mark's* palette is the design justification — not "match the legacy WordPress splash" (which was declined at session start).

The visual system built across 14 cycles used a warm editorial palette (Clay/Mustard/Ivory on ivory background, Fraunces + Inter typography). This reset retires the warm palette from active use while preserving the editorial *typographic* character (Fraunces stays — it does work the logo's geometric sans doesn't try to).

## 2. Constraints inherited from prior findings

These are load-bearing decisions from earlier session work; the design must respect them.

- **Legacy site's own bad calls (from `docs/references/legacy-site-design-profile.md`) do NOT get inherited:**
  - Body text must NOT be teal (fails WCAG contrast; legacy failure)
  - Every heading level in the same teal flattens hierarchy (legacy failure — headings get *staggered* teal here)
  - Palette must not collapse to single color (legacy had primary=secondary=teal — this design keeps teal + black + white as three distinct roles)
- **teal-600 = `#14707b` and teal-800 = `#0e5762`** are already tuned to pass WCAG 4.5:1 on light backgrounds (from PR #4). Do not shift these values without re-verifying contrast.
- **Legacy exact hex `#209eaf`** cannot work as text on ivory OR white at accessible contrast — do not chase it as a color anywhere text sits on it.
- **`global.css`'s `h1-h4 { color: var(--color-ink-900) }` rule** applies at layer base and overrides utility classes without explicit color. Any component setting a colored background under a heading must pass `text-<color>` explicitly on the heading (learned in PR #5 verification pass — CommunityCenter h1 needed explicit `text-ivory-50` to pass axe).
- **Focus rings** stay Clay-500 (`ring-clay-500`) for a11y contrast against teal-primary UI. Do NOT flip.
- **Timeline org colors** (`--color-timeline-*`) are semantic timeline data, not brand palette. Do NOT touch.

## 3. Palette & tokens (`src/styles/tokens.css`)

**Keep the tokens defined; retire their active use.** Rollback stays cheap and no deep dependency I forgot silently breaks.

| Token family | Action |
| --- | --- |
| `--color-clay-*` (100/300/500/700) | Keep defined; active use restricted to `ring-clay-500` (focus rings) |
| `--color-mustard-*` (200/400/600/800) | Keep defined; retire all active use |
| `--color-ivory-*` (50/100/200) | Keep defined; retire all `bg-ivory-*` usage. `border-ivory-200` (used as neutral card border across ~10 components) is a survival candidate — audit in §6 to decide per-component whether it stays warm or shifts to cool-neutral `border-ink-500/10`. |
| `--color-teal-*` (100/400/600/800) | Unchanged — ramp already tuned |
| `--color-ink-*` (300/500/700/900) | Unchanged |
| `--color-timeline-*` | Unchanged — semantic |
| `--font-display`, `--font-body` | Unchanged (Fraunces + Inter kept) |
| `--text-*`, `--leading-*`, `--radius-*`, `--shadow-*`, `--ease-*` | Unchanged |

No new tokens added. Direct `bg-white` / `text-white` Tailwind utilities used where needed (no `--color-white` token — reserved word conflict risk not worth avoiding).

## 4. Background & headings (`src/styles/global.css`)

### Body background

```
html { background: var(--color-ivory-50); }  →  html { background: white; }
```

Value literal `white` (equivalent to `#ffffff`). No new token added.

### Heading colors — staggered teal

Replaces the current single `h1, h2, h3, h4 { color: var(--color-ink-900) }` block.

| Level | Color | Rationale |
| --- | --- | --- |
| `h1` | `var(--color-teal-600)` | Hero pop; matches logo's brand accent |
| `h2` | `var(--color-teal-800)` | Dark-teal accent; hierarchy stays distinct from H1 |
| `h3` | `var(--color-teal-800)` | Same as H2 (they're visually close in the design anyway) |
| `h4` | `var(--color-ink-900)` | Back to ink — restores hierarchy break, prevents "all teal" mush |
| `h5, h6` | (unstyled; inherits body) | Rarely used; ink by inheritance |

`text-display` / `text-3xl` / `text-2xl` / `text-xl` sizes unchanged. Font family and line-height unchanged.

**Contrast check** (must verify in smoke test):
- teal-600 `#14707b` on white `#ffffff` → 5.44:1 → passes 4.5:1 body, 3:1 large
- teal-800 `#0e5762` on white `#ffffff` → 7.9:1 → passes both comfortably
- ink-900 `#1b1b1b` on white → ~17:1 → passes trivially

### Body links

Already teal from PR #6. Unchanged.

### Focus outline

Already teal from earlier work. Unchanged.

## 5. Callouts (`src/styles/callouts.css`)

Current mapping loses coherence when Clay retires (tip + tradeoffs both go warm). New mapping uses teal-shade differentiation to preserve tip↔why semantic separation.

| Callout | Current | New |
| --- | --- | --- |
| `.callout-tip` | Clay-500 border+label, Clay-500/6% bg | **teal-800** border+label, **teal-800/6% bg** wash (quieter than "why") |
| `.callout-why` | Teal-600 border+label, Teal-600/6% bg | **Unchanged** (teal-600 stays brighter than tip) |
| `.callout-box` | Ink-500 dashed border, ivory-100 bg | Ink-500 dashed border, **white bg** |
| `.callout-practical` | Moss-500 border+label | **Unchanged.** Flags pre-existing bug: `--color-moss-500` is not defined in `tokens.css`; CSS silently uses invalid color. Fix separately from this reset. |
| `.callout-tradeoffs` | Clay-500 border, Clay-500/6% bg, Clay-700 label | **ink-700** border, **near-white** bg (color-mix 6% ink-700 into white), **ink-800** label. Neutral advisory tone replaces warm advisory. |

Rationale for tip using teal-800 vs. why using teal-600: shade differentiation gives tip a "quieter, secondary" feel and why a "louder, primary" feel. Semantic distinction survives.

## 6. Component sweep (~30 files)

Grouped by change type. See §11 for full file list. Every change below is at the utility-class layer in Astro components; no logic or content changes.

### Layout chrome

- **`components/layout/Header.astro:15`** — Logo circle bg `bg-clay-100` → `bg-white`. Matches the logo file which is delivered on white.
- **`components/layout/Footer.astro:8`** — Footer bg `bg-ivory-100` → `bg-white`. Top border stays teal-600/2px (from PR #6).

### Warm callout asides (3 pages)

- **`pages/childrens-theatre/index.astro:99`**, **`pages/shakespeare/index.astro:42`**, **`pages/shakespeare/childrens-shakespeare.astro:41`** — All have `border-clay-500/25 bg-clay-500/5` warm-callout aside pattern. Flip all three to `border-teal-600/25 bg-teal-600/5`.
- **`pages/legacy/history.astro:73`** — Same pattern with `/30` opacity. Flip to `border-teal-600/30 bg-teal-600/5`.

### Pull-quote borders (5 blockquotes)

- **`components/legacy/TestimonyPullQuote.astro:10`** — `border-clay-500/60` → `border-teal-600/60`
- **`pages/legacy/index.astro:87`** — `border-clay-500/60` → `border-teal-600/60`
- **`pages/shakespeare/alternatives.astro:36,106`** — `border-clay-500` (2 blockquotes) → `border-teal-600`
- **`pages/shakespeare/index.astro:50`** — `border-clay-500` → `border-teal-600`
- **`pages/shakespeare/scenes.astro:46`** — `border-clay-500` (Nenno testimonial) → `border-teal-600`

### Warm decorative accents

- **`components/community/TestimonialCard.astro:16,18`** — Quote-mark accents `text-clay-500` → `text-teal-800`
- **`components/legacy/FounderCard.astro:30`** — Placeholder initials `bg-clay-500/15 text-clay-700` → `bg-teal-100 text-teal-800`
- **`components/childrens/WayfarersJourneyWheel.astro:59-60`** — SVG color `text-clay-500` + inline `--color-clay-500` → `text-teal-600` + `--color-teal-600`

### Mustard retirement

- **`components/layout/Nav.astro:23`** — "Coming Next Year" chip `text-mustard-800` → `text-teal-800`
- **`components/landing/WorkshopsTile.astro:12`** — Same eyebrow chip `text-mustard-800` → `text-teal-800`
- **`components/shakespeare/AskShakespeareCard.astro:26`** — Column number chip `text-mustard-800` → `text-teal-800`
- **`components/community/CompanionTheatreCard.astro:35`** — "Unconfirmed" chip `bg-mustard-200 text-ink-700` → `bg-ink-500/15 text-ink-700` (muted neutral, matches semantic "provisional" without warm color)
- **`components/legacy/FounderCard.astro:44`** — "Unconfirmed" chip, same treatment as above
- **`components/shakespeare/AskShakespeareForm.astro:12`** — Fallback-mode form container `border-mustard-400/40 bg-mustard-200/20` → `border-ink-500/25 bg-ink-500/5` (neutral "not-yet-configured" tone)
- **`components/community/TestimonialForm.astro:10`** — Same treatment
- **`components/ui/NewsletterSignup.astro:18`** — Same treatment

### Ivory retirement in components using it as bg

**All `bg-ivory-*` usage retires.** Replace each with `bg-white`. Cards will be white-on-white with visible border defining the card edge (border already present in all card components). Files to walk:
- `EssayCard`, `NewsletterCard`, `CompanionTheatreCard`, `TestimonialCard`, `FounderCard`, `AskShakespeareCard`, `ScriptCard`, `GameCard`, `EntryCard`, `RelatedResources`, `SectionBox`
- Page cards that hardcode ivory bg (search grid, PRC index, etc.)

**Border decision:** `border-ivory-200` (current neutral card border) shifts to `border-ink-500/15` site-wide. Warm border on white card = subtly warm; cool border on white card = subtly cool. Cool matches intent. One global find-replace: `border-ivory-200 → border-ink-500/15`. Exception: Header + Footer already have `border-teal-600` chrome borders from PR #6 — those don't use `border-ivory-200` and stay untouched.

### Chip semantic recolor (`components/ui/Chip.astro` + `components/scripts/ScriptCard.astro`)

Currently `Chip.astro` defines tones `clay | teal | mustard | neutral`. Recolor to keep 4 visually distinct tones on the new palette (avoids clay↔teal collision if both used the same teal shade):

| Tone | Current | New | Semantic reading |
| --- | --- | --- | --- |
| `teal` | `bg-teal-100 text-teal-800` | Unchanged | "light/playful/informational" |
| `clay` | `bg-clay-100 text-clay-700` | **`bg-teal-800 text-white`** | "bold/heavy/emphasized" (was warm; now dark teal) |
| `mustard` | `bg-mustard-200 text-ink-700` | **`bg-ink-500/15 text-ink-700`** | "muted/somber" (was warm; now cool neutral) |
| `neutral` | Whatever it is now | `bg-white text-ink-500 border border-ink-500/20` | "quiet/undifferentiated" |

Tone names kept for API stability (no callsite changes needed). Any callsite using `tone="clay"` (grep shows GameCard competency + ScriptCard theme) will render as bold dark teal, remaining visually distinct from the light `tone="teal"` shade. Reconsider tone naming in a future rename PR if the semantic ↔ visual mapping feels off after live use.

`ScriptCard.astro` register color mapping (lines 18–23):
- `comic` → `bg-teal-100 text-teal-800` (unchanged)
- `dramatic` → was `bg-clay-100 text-clay-700` → **`bg-teal-800 text-white`** (bold/heavy semantic)
- `villain` → was `bg-ivory-200 text-ink-900` → **`bg-ink-900 text-white`** (shadowed semantic)
- `grief` → was `bg-mustard-200 text-ink-700` → **`bg-ink-500/15 text-ink-700`** (muted somber semantic)

Register mapping still communicates four distinct tones (playful teal, bold dark teal, shadow black, muted gray) without warm color.

## 7. Left intentionally alone

- **Fraunces + Inter typography** — The logo is bold geometric sans; the SITE's serif face is doing distinct editorial work (essay body, script text, pull-quotes). Retiring Fraunces would flatten the site's voice to match the logo's compressed one. Keeping both means logo and site each have their own voice while sharing color language.
- **Ink text tokens** — Body copy stays ink-900 for legibility (not black, which reads too harsh under Fraunces).
- **Focus rings** — Clay-500 rings kept for keyboard-nav a11y contrast against teal-primary UI. This is the sole surviving Clay use.
- **Timeline org colors** — Semantic timeline data, not brand palette.
- **Callout-practical (Moss)** — Separate concern + pre-existing tokens.css bug. Fix separately.
- **Prohibited-text guardrail patterns, curly-apostrophe checker, prebuild scripts** — Zero touch. Content unaffected.

## 8. Verification & rollout

### Automated checks

- `pnpm build` — 157 pages, `check:concepts` + `check:prohibited` clean
- `pnpm test` — 234/234 Vitest unit tests (no logic changes; should pass unchanged)
- `pnpm test:e2e` — 13 smoke checkpoints + axe scans at 11 waypoints. **Critical:** teal-800 headings on white bg must pass 4.5:1 for body and 3:1 for large text. Math says 7.9:1; must be confirmed by axe.

### Manual visual pass

Walk each in `pnpm dev` before committing:
1. `/` (landing) — tile fills on white, hero contrast
2. `/community/` — sub-nav, CTA, testimonials with new quote-mark color
3. `/theatre-games/` — Find-a-game aside, game cards
4. `/legacy/timeline/` — verify org colors untouched (Clay CSF, etc.)
5. `/legacy/founders/` — placeholder-initials treatment on the two founders with no photo
6. `/shakespeare/` — the warm-callout aside now teal
7. `/shakespeare/alternatives/` — blockquote pull-quote borders now teal
8. `/childrens-theatre/` — Wayfarer's Journey Wheel, warm-callout aside
9. `/resource-center/` — letter rail, entry cards on new white bg
10. `/404` — CTA button, ivory tile grid
11. `/styles-preview` — the design-system reference page (this needs review + likely update)

### Fallback plan

If teal-800 H2/H3 fails axe (unlikely by math, possible for large-font subpixel rendering):
- Fall back to `h2, h3 { color: var(--color-ink-900) }` and keep only `h1` teal
- This shrinks the "teal presence" on headings but preserves the visual direction (H1 is still branded, body still teal-linked)

### Rollout

- Feature branch off `main` (per `feedback_dtfc_branching`: `--no-ff` merge, no direct-to-main commits)
- Single logical PR (may split into 3 commits by concern for review clarity: tokens/global/callouts, then components, then chip recolor)
- Vercel preview visual review before merging
- The feature branch `fix/vercel-build-invalid-url` may be renamed for this cycle or a fresh branch cut (user preference)

## 9. Out of scope

- **Font swap to Raleway** — declined at brainstorm; would retire Fraunces
- **All-headings-teal** — inherited legacy anti-pattern; explicitly avoided
- **Teal body text** — inherited legacy anti-pattern; body stays ink-900
- **`--color-moss-500` fix** — pre-existing bug in callouts.css; separate PR
- **`/styles-preview` full rebuild** — page audit + update is part of scope, but rebuilding the visual design-system doc from scratch is out
- **Content changes** — zero
- **Test rewrites** — zero

## 10. Success criteria

- Every page reads as "primary teal / secondary black" — teal is the visible accent color, black is text/imagery, white is the surface
- No warm-color surface visible outside the four preserved uses (focus rings, timeline org colors, callout-practical, brand-mark aesthetic)
- All existing WCAG contrast wins preserved; new heading-color contrast verified by axe
- Fraunces + Inter typography still doing editorial work
- Site + logo read as visually coherent when placed side-by-side

## 11. File list (audit-based estimate)

Impacted files (concrete):

**Global styles (3):**
- `src/styles/global.css`
- `src/styles/callouts.css`
- `src/styles/tokens.css` (no changes, but audit)

**Layout chrome (2):**
- `src/components/layout/Header.astro`
- `src/components/layout/Footer.astro`

**Legacy components (3):**
- `src/components/legacy/TestimonyPullQuote.astro`
- `src/components/legacy/FounderCard.astro`
- `src/components/legacy/Timeline.astro` (audit — may not need changes)

**Community components (3):**
- `src/components/community/TestimonialCard.astro`
- `src/components/community/CompanionTheatreCard.astro`
- `src/components/community/TestimonialForm.astro`

**Shakespeare components (2):**
- `src/components/shakespeare/AskShakespeareCard.astro`
- `src/components/shakespeare/AskShakespeareForm.astro`

**Children's + landing components (3):**
- `src/components/childrens/WayfarersJourneyWheel.astro`
- `src/components/landing/WorkshopsTile.astro`
- `src/components/landing/CommunityCenter.astro` (audit — bg tile is teal already, verify)

**Nav + UI (3):**
- `src/components/layout/Nav.astro`
- `src/components/ui/Chip.astro`
- `src/components/ui/NewsletterSignup.astro`

**Card components using ivory bg (~10 — audit):**
- `EssayCard`, `NewsletterCard`, `ScriptCard`, `GameCard`, `EntryCard`, `RelatedResources`, `SectionBox`, `SectionLayout` sub-navs

**Pages (~7):**
- `src/pages/childrens-theatre/index.astro`
- `src/pages/shakespeare/index.astro`
- `src/pages/shakespeare/childrens-shakespeare.astro`
- `src/pages/shakespeare/alternatives.astro`
- `src/pages/shakespeare/scenes.astro`
- `src/pages/legacy/index.astro`
- `src/pages/legacy/history.astro`
- `src/pages/styles-preview.astro` (audit; probably needs re-tune to reflect new system)

**Estimated total:** ~30 files touched, ~80–120 line changes. Smaller than PR #5 (54 files, 114 lines) because most active surfaces already got Clay-retired there. **Larger blast contingent on `border-ivory-200 → border-ink-500/15` sweep** — that's an additional global find-replace across every card component (~15 additional files), most of which are already in the list above; count adjusts if a surprise emerges.

## 12. Open questions for implementation plan

Deferred to the writing-plans skill:
- Optimal commit split (single commit vs. tokens/components/chip split)
- Order of file changes for safest rollout (probably: tokens+global first → verify build → callouts → components → chip semantic → pages)
- Whether to add a `--color-cool-neutral: color-mix(in oklab, var(--color-ink-900) 10%, white)` shorthand token for the `bg-ink-500/15` pattern that repeats 4+ times, or leave inline for simplicity

---

**Ready for implementation-plan phase** (writing-plans skill) upon user approval of this spec.
