# Primary Teal / Secondary Black — Visual System Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shift the DT:FC website from its warm editorial palette (Clay/Mustard/Ivory on ivory bg) to a "primary teal / secondary black" palette (teal accents + black text on white bg) that matches the DT:FC primary logo's aesthetic. Keep Fraunces + Inter typography.

**Architecture:** Palette retirement done via `@theme` tokens (kept defined, active use removed from components), body bg + heading colors updated in `global.css`, callouts recolored in `callouts.css`, ~30 component/page files walked to swap warm classes for teal/ink/white equivalents. Focus rings keep Clay for a11y contrast; timeline org colors keep semantic values; callout-practical (Moss) untouched. Every task ends with build + relevant tests + commit.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@theme` in `src/styles/tokens.css`, no `tailwind.config.js`), Vitest for unit tests, Playwright + `@axe-core/playwright` for smoke + a11y tests.

**Spec:** `docs/superpowers/specs/2026-09-05-primary-teal-secondary-black-design.md` (commit `a0f6d8a`). The plan argues from that spec — read it for every design rationale.

## Global Constraints

Copied from spec §2. These apply to every task; violating any is a rework signal.

- Body text must NOT be teal (fails WCAG contrast on light bg; legacy failure mode). Body stays `ink-900`.
- Every heading level in the same teal flattens hierarchy. Headings are **staggered**: `h1 = teal-600`, `h2 = h3 = teal-800`, `h4 = ink-900`.
- Palette must not collapse to a single color. Teal + black + white are three distinct roles.
- `teal-600 = #14707b` and `teal-800 = #0e5762` are already tuned. Do NOT shift these values.
- Legacy exact `#209eaf` cannot be used as text. Do not chase it.
- `global.css` layer-base heading rule overrides utility classes without explicit color. On coloured surfaces, headings need explicit `text-<color>` utility class.
- Focus rings stay `ring-clay-500`. Do NOT flip to teal.
- Timeline org colors (`--color-timeline-*`) are semantic timeline data. Do NOT touch.
- Fraunces + Inter typography stays. Do NOT swap fonts.
- Callout-practical (Moss) is a separate concern with a pre-existing tokens.css bug. Do NOT fix here.
- Prohibited-text guardrail + curly-apostrophe checker + prebuild scripts get zero touches. No content changes.
- Do NOT introduce new tokens beyond what the spec calls for. `bg-white` is used directly (no `--color-white` token).
- Every task ends with a commit. Commit messages follow `type(scope): imperative description` conventional-commits style.

---

## Task 1: Baseline audit + branch setup

**Files:** none (audit + branch prep only)

**Interfaces:**
- Produces: git branch ready for the reset work; documented starting state of warm-palette class counts

- [ ] **Step 1: Confirm working tree is clean**

Run: `git status`
Expected: `nothing to commit, working tree clean` (or only untracked files unrelated to this work).

If dirty, stop and address the uncommitted changes before proceeding.

- [ ] **Step 2: Confirm currently on feature branch, ahead of main by design-spec commit only**

Run: `git log --oneline origin/main..HEAD`
Expected: exactly one commit — `a0f6d8a docs(spec): design for primary-teal / secondary-black visual system reset`.

If more commits present, verify they belong on this branch; if fewer, `git fetch origin main` and re-check.

- [ ] **Step 3: Baseline warm-palette count**

Run:
```bash
grep -rEo "(bg|text|border)-(ivory|clay|mustard)-[0-9]+" /Users/cnote/projects/dtfc/src --include="*.astro" 2>/dev/null | wc -l
```
Expected: ~145 (baseline as of 2026-09-05). Record the exact number in your notes; final count should drop to <30 (only intentionally-preserved surfaces: `text-ivory-50` on teal/dark tiles, `ring-clay-500` focus rings, timeline org styling).

- [ ] **Step 4: Verify baseline tests pass on unmodified code**

Run: `pnpm build && pnpm test && pnpm test:e2e`
Expected: build clean (157 pages), 234/234 unit tests, 13/13 smoke tests.

If any fail, stop and diagnose — the plan assumes a green starting state.

- [ ] **Step 5: Commit (no-op checkpoint, optional)**

No file changes to commit yet. Task 1 is purely verification.

---

## Task 2: Body background + heading colors (HIGH RISK)

**Files:**
- Modify: `src/styles/global.css:14` (body bg), `src/styles/global.css:19-26` (heading color block)

**Interfaces:**
- Consumes: teal-600 / teal-800 / ink-900 token values from `tokens.css` (already defined)
- Produces: white body bg, staggered teal heading colors. All downstream tasks assume these are in place.

This is the highest-risk task because teal-800 headings on white bg is a new contrast pattern for the site. Spec math says 7.9:1 (passes), but axe must confirm.

- [ ] **Step 1: Edit body background**

In `src/styles/global.css`, line 14, change:
```css
background: var(--color-ivory-50);
```
to:
```css
background: white;
```

- [ ] **Step 2: Edit heading colors**

In `src/styles/global.css`, lines 19-26, replace the whole block:
```css
  h1,
  h2,
  h3,
  h4 {
    font-family: var(--font-display);
    line-height: var(--leading-tight);
    color: var(--color-ink-900);
  }
```
with:
```css
  h1,
  h2,
  h3,
  h4 {
    font-family: var(--font-display);
    line-height: var(--leading-tight);
  }

  h1 {
    color: var(--color-teal-600);
  }
  h2,
  h3 {
    color: var(--color-teal-800);
  }
  h4 {
    color: var(--color-ink-900);
  }
```

Note: `h1` block already exists further down (lines 28-31 in original file) with `font-size` + `font-weight`. Keep that block; only the color block above is new. If the file structure has drifted, put the color rules AFTER the font-family/line-height shared block and BEFORE the individual `h1 { font-size: ... }` blocks.

- [ ] **Step 3: Run build**

Run: `pnpm build`
Expected: 157 pages built cleanly. If build fails, likely a CSS parse error — read `pnpm build` output for the exact line.

- [ ] **Step 4: Run full smoke test suite (CRITICAL — axe contrast check)**

Run: `pnpm test:e2e`
Expected: 13/13 pass, zero critical/serious axe violations. Watch specifically for `color-contrast` violations on any of the 11 checkpoint pages.

- [ ] **Step 5: If contrast fails, apply fallback (spec §8)**

If any `serious: color-contrast` violation appears, revert `h2, h3` to `ink-900` and keep only `h1` teal:
```css
  h1 {
    color: var(--color-teal-600);
  }
  h2,
  h3,
  h4 {
    color: var(--color-ink-900);
  }
```

Re-run `pnpm test:e2e`. This is the spec-approved fallback; document the fact in the commit message.

- [ ] **Step 6: Manual visual check**

Run: `pnpm dev`
Visit `/` and confirm: page bg is white (not cream), landing h1 pops teal, sub-headings across `/community/`, `/theatre-games/`, `/legacy/`, `/resource-center/` look intentional. Stop the dev server afterward.

- [ ] **Step 7: Commit**

Run:
```bash
git add src/styles/global.css
git commit -m "$(cat <<'EOF'
style(global): white body bg + staggered teal headings

Body bg switches from ivory-50 to white. h1 uses teal-600,
h2 and h3 use teal-800, h4 keeps ink-900. Staggered scheme
preserves heading hierarchy while giving H1-H3 teal presence
(matches spec section 4). Fallback (H2/H3 back to ink) documented
in spec section 8; not needed -- axe confirmed teal-800 on white
clears 4.5:1.

Spec: docs/superpowers/specs/2026-09-05-primary-teal-secondary-black-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

If the fallback was needed, adjust the commit body to say `H2/H3 fallback active per spec section 8`.

---

## Task 3: Callout recolor

**Files:**
- Modify: `src/styles/callouts.css:17-29` (callout-tip), `src/styles/callouts.css:44-47` (callout-box bg), `src/styles/callouts.css:63-86` (callout-tradeoffs)

**Interfaces:**
- Consumes: teal-600, teal-800, ink-700, ink-800 token values (all pre-existing)
- Produces: teal-shade-differentiated tip/why pair, neutral tradeoffs, box on white bg

- [ ] **Step 1: Edit callout-tip**

In `src/styles/callouts.css` lines 17-29, replace:
```css
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
```
with:
```css
.callout-tip {
  border-left: 4px solid var(--color-teal-800);
  background: color-mix(in oklab, var(--color-teal-800) 6%, white);
}
.callout-tip::before {
  content: 'TIP';
  display: block;
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: var(--color-teal-800);
  margin-bottom: 0.25rem;
}
```

- [ ] **Step 2: Edit callout-box background**

In `src/styles/callouts.css` lines 44-47, replace:
```css
.callout-box {
  border: 1px dashed var(--color-ink-500);
  background: var(--color-ivory-100);
}
```
with:
```css
.callout-box {
  border: 1px dashed var(--color-ink-500);
  background: white;
}
```

- [ ] **Step 3: Edit callout-tradeoffs**

In `src/styles/callouts.css` lines 63-86, replace the whole `.callout-tradeoffs` + `::before` blocks:
```css
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
```
with:
```css
.callout-tradeoffs {
  border-left: 4px solid var(--color-ink-700);
  background: color-mix(in oklab, var(--color-ink-700) 6%, white);
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
  color: var(--color-ink-800);
  margin-bottom: 0.5rem;
}
```

- [ ] **Step 4: Run build**

Run: `pnpm build`
Expected: 157 pages clean.

- [ ] **Step 5: Manual visual check on a page that uses each callout**

Run: `pnpm dev`. Visit:
- `/resource-center/casting/` — should have `.callout-tip` blocks (now teal-800 wash) and `.callout-why` blocks (unchanged teal-600 wash). Confirm the two look distinct — tip is quieter/darker, why is brighter.
- `/shakespeare/alternatives/` — should have `.callout-tradeoffs` (now ink-toned neutral).

Stop the dev server.

- [ ] **Step 6: Commit**

Run:
```bash
git add src/styles/callouts.css
git commit -m "$(cat <<'EOF'
style(callouts): recolor tip + tradeoffs to teal/ink palette

callout-tip flips from Clay to teal-800 (border, label, 6% bg wash).
Pairs with callout-why (teal-600) via shade differentiation --
tip reads quieter/secondary, why reads brighter/primary. Semantic
distinction preserved without warm color.

callout-tradeoffs flips from Clay to ink-700 border + ink-800 label
+ 6% ink-700 bg wash. Was warm advisory; becomes neutral advisory.

callout-box background switches from ivory-100 to white, matching
new body bg. Dashed ink-500 border unchanged.

callout-practical (Moss) untouched -- separate concern + pre-existing
tokens.css bug flagged in spec section 5.

Spec: docs/superpowers/specs/2026-09-05-primary-teal-secondary-black-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Chrome — Header + Footer bg + logo circle

**Files:**
- Modify: `src/components/layout/Header.astro:15` (logo circle bg)
- Modify: `src/components/layout/Footer.astro:8` (footer bg)

**Interfaces:**
- Consumes: none new; uses `bg-white` utility already available via Tailwind
- Produces: Header + Footer chrome on pure white matching body bg

- [ ] **Step 1: Read Header + Footer to confirm current state**

Run:
```bash
sed -n '15p' /Users/cnote/projects/dtfc/src/components/layout/Header.astro
sed -n '8p' /Users/cnote/projects/dtfc/src/components/layout/Footer.astro
```

Expected:
- Header line 15: `<img src="/DTFC-logo.png" alt="" width="40" height="40" class="bg-clay-100 rounded-full self-center" />`
- Footer line 8: `<footer class="border-teal-600 bg-ivory-100 mt-16 border-t-2">`

If either differs, stop and re-audit; likely a prior commit changed line numbers.

- [ ] **Step 2: Flip Header logo circle bg**

Edit `src/components/layout/Header.astro`, replace `bg-clay-100` with `bg-white` on the img class attribute (line 15).

Exact old string: `class="bg-clay-100 rounded-full self-center"`
Exact new string: `class="bg-white rounded-full self-center"`

- [ ] **Step 3: Flip Footer bg**

Edit `src/components/layout/Footer.astro`, replace `bg-ivory-100` with `bg-white` on the footer element (line 8).

Exact old string: `<footer class="border-teal-600 bg-ivory-100 mt-16 border-t-2">`
Exact new string: `<footer class="border-teal-600 bg-white mt-16 border-t-2">`

- [ ] **Step 4: Build + smoke**

Run: `pnpm build && pnpm test:e2e 2>&1 | tail -20`
Expected: 157 pages clean, 13/13 smoke pass. Header/Footer on the smoke checkpoints will now be pure white with teal chrome accents.

- [ ] **Step 5: Commit**

Run:
```bash
git add src/components/layout/Header.astro src/components/layout/Footer.astro
git commit -m "$(cat <<'EOF'
style(chrome): Header + Footer bg on pure white

Logo circle switches from bg-clay-100 (warm cream) to bg-white
so the site chrome bg matches the logo file's own white background.
Footer bg switches from bg-ivory-100 to bg-white for the same reason.
Teal accent stripes (border-teal-600 on Header/Footer from PR #6)
unchanged -- they now bookend a fully white page.

Spec: docs/superpowers/specs/2026-09-05-primary-teal-secondary-black-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Warm callout asides + pull-quote borders

**Files:**
- Modify `src/pages/childrens-theatre/index.astro:99`
- Modify `src/pages/shakespeare/index.astro:42`
- Modify `src/pages/shakespeare/childrens-shakespeare.astro:41`
- Modify `src/pages/legacy/history.astro:73`
- Modify `src/components/legacy/TestimonyPullQuote.astro:10`
- Modify `src/pages/legacy/index.astro:87`
- Modify `src/pages/shakespeare/alternatives.astro` (2 blockquotes: lines 36 + 106)
- Modify `src/pages/shakespeare/index.astro:50`
- Modify `src/pages/shakespeare/scenes.astro:46`

**Interfaces:**
- Consumes: teal-600 utility class (already available)
- Produces: warm callout asides + blockquote pull-quote borders all in teal

Bundled together because both change patterns are `border-clay-500* → border-teal-600*` mechanical flips on the same design intent (accent border).

- [ ] **Step 1: Flip the 3 warm callout asides on landing pages**

For each of `pages/childrens-theatre/index.astro`, `pages/shakespeare/index.astro`, `pages/shakespeare/childrens-shakespeare.astro`, find the substring `border-clay-500/25 bg-clay-500/5` and replace with `border-teal-600/25 bg-teal-600/5`.

Bash:
```bash
for f in \
  /Users/cnote/projects/dtfc/src/pages/childrens-theatre/index.astro \
  /Users/cnote/projects/dtfc/src/pages/shakespeare/index.astro \
  /Users/cnote/projects/dtfc/src/pages/shakespeare/childrens-shakespeare.astro; do
  sed -i.bak 's|border-clay-500/25 bg-clay-500/5|border-teal-600/25 bg-teal-600/5|g' "$f" && rm "${f}.bak"
done
```

- [ ] **Step 2: Flip the legacy/history callout aside**

`pages/legacy/history.astro:73` uses `/30` opacity (not `/25`). Flip separately:

```bash
sed -i.bak 's|border-clay-500/30 bg-clay-500/5|border-teal-600/30 bg-teal-600/5|g' /Users/cnote/projects/dtfc/src/pages/legacy/history.astro && rm /Users/cnote/projects/dtfc/src/pages/legacy/history.astro.bak
```

- [ ] **Step 3: Flip TestimonyPullQuote left border**

Edit `src/components/legacy/TestimonyPullQuote.astro:10`, exact old string:
```
class="border-clay-500/60 my-6 border-l-4 py-2 pl-6 pr-2"
```
Exact new string:
```
class="border-teal-600/60 my-6 border-l-4 py-2 pl-6 pr-2"
```

- [ ] **Step 4: Flip legacy/index.astro blockquote border**

Edit `src/pages/legacy/index.astro:87`, replace `border-clay-500/60` with `border-teal-600/60` (the only occurrence on that line).

- [ ] **Step 5: Flip shakespeare blockquote borders**

For `pages/shakespeare/alternatives.astro`, `pages/shakespeare/index.astro`, `pages/shakespeare/scenes.astro`, flip the standalone `border-clay-500` on blockquotes (those with `border-l-2` or `border-l-4`). These are pull-quote borders per spec §6.

```bash
for f in \
  /Users/cnote/projects/dtfc/src/pages/shakespeare/alternatives.astro \
  /Users/cnote/projects/dtfc/src/pages/shakespeare/index.astro \
  /Users/cnote/projects/dtfc/src/pages/shakespeare/scenes.astro; do
  sed -i.bak 's|border-clay-500 mt-|border-teal-600 mt-|g; s|border-clay-500 pl-|border-teal-600 pl-|g' "$f" && rm "${f}.bak"
done
```

The `mt-` / `pl-` anchors ensure we only match the `border-l-*` blockquote pattern (`border-clay-500 mt-...` in alternatives, `border-clay-500 pl-4` on scenes:46, etc.) and not any `border-clay-500` in a different context. Verify next step catches any remaining.

- [ ] **Step 6: Verify no Clay borders remain (except focus rings + semantic Chip tone)**

Run:
```bash
grep -rEno "border-clay-500" /Users/cnote/projects/dtfc/src --include="*.astro" 2>/dev/null
```

Expected output: **empty** (no matches). If matches appear, inspect each; flip if it's a card/pull-quote/aside border, keep if it's a semantic Chip tone (in Chip.astro line 8) — but Chip.astro doesn't use `border-clay-500` so any remaining is a miss.

- [ ] **Step 7: Build + smoke**

Run: `pnpm build && pnpm test:e2e 2>&1 | tail -15`
Expected: 157 pages clean, 13/13 smoke pass.

- [ ] **Step 8: Commit**

Run:
```bash
git add src/pages/childrens-theatre/index.astro src/pages/shakespeare/index.astro src/pages/shakespeare/childrens-shakespeare.astro src/pages/legacy/history.astro src/components/legacy/TestimonyPullQuote.astro src/pages/legacy/index.astro src/pages/shakespeare/alternatives.astro src/pages/shakespeare/scenes.astro
git commit -m "$(cat <<'EOF'
style(accents): flip warm callout asides + pull-quote borders to teal

Bundled two related mechanical flips (all border-clay-* -> border-teal-*):

Warm callout asides on 4 pages (childrens-theatre/index,
shakespeare/index, shakespeare/childrens-shakespeare, legacy/history)
switch their border+bg from Clay to Teal.

Pull-quote left borders on 5 blockquotes (TestimonyPullQuote,
legacy/index, shakespeare/alternatives x2, shakespeare/scenes) switch
from Clay to Teal.

Semantic warmth (Clay) retires on these accent surfaces; the surviving
Clay use in the codebase after this commit is limited to focus rings
(ring-clay-500) and the Chip tone/register mapping (both handled
separately in later tasks).

Spec: docs/superpowers/specs/2026-09-05-primary-teal-secondary-black-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Warm decorative accents (3 files)

**Files:**
- Modify: `src/components/community/TestimonialCard.astro:16,18` (quote marks)
- Modify: `src/components/legacy/FounderCard.astro:30` (placeholder initials)
- Modify: `src/components/childrens/WayfarersJourneyWheel.astro:59-60` (SVG color)

**Interfaces:**
- Consumes: teal-100, teal-600, teal-800 utilities
- Produces: all decorative warm-color moments swapped to teal shades

- [ ] **Step 1: TestimonialCard quote marks**

Edit `src/components/community/TestimonialCard.astro`, both occurrences of `text-clay-500` (lines 16 and 18) → `text-teal-800`.

```bash
sed -i.bak 's|font-display text-clay-500|font-display text-teal-800|g' /Users/cnote/projects/dtfc/src/components/community/TestimonialCard.astro && rm /Users/cnote/projects/dtfc/src/components/community/TestimonialCard.astro.bak
```

The `font-display` prefix anchors to only match the quote marks, not any other text-clay-500 use elsewhere in the file.

- [ ] **Step 2: FounderCard placeholder initials**

Edit `src/components/legacy/FounderCard.astro:30`, exact old string:
```
class="bg-clay-500/15 text-clay-700 flex h-24 w-24 shrink-0 items-center justify-center rounded-full font-medium"
```
Exact new string:
```
class="bg-teal-100 text-teal-800 flex h-24 w-24 shrink-0 items-center justify-center rounded-full font-medium"
```

- [ ] **Step 3: WayfarersJourneyWheel SVG color**

Edit `src/components/childrens/WayfarersJourneyWheel.astro`, lines 59-60. Exact old:
```
    class="text-clay-500 h-auto w-full max-w-md"
    style="color: var(--color-clay-500);"
```
Exact new:
```
    class="text-teal-600 h-auto w-full max-w-md"
    style="color: var(--color-teal-600);"
```

- [ ] **Step 4: Build + smoke**

Run: `pnpm build && pnpm test:e2e 2>&1 | tail -10`
Expected: clean.

- [ ] **Step 5: Commit**

Run:
```bash
git add src/components/community/TestimonialCard.astro src/components/legacy/FounderCard.astro src/components/childrens/WayfarersJourneyWheel.astro
git commit -m "$(cat <<'EOF'
style(accents): decorative warm moments -> teal

TestimonialCard curly quote marks: text-clay-500 -> text-teal-800
FounderCard photo-less placeholder initials: bg-clay-500/15 + text-clay-700
  -> bg-teal-100 + text-teal-800
WayfarersJourneyWheel SVG color: text-clay-500 + inline var
  -> text-teal-600 + inline var

Removes the last of the "decorative warmth" Clay uses; only focus
rings (ring-clay-500) remain Clay after this commit (Chip semantic
recolor is a later task).

Spec: docs/superpowers/specs/2026-09-05-primary-teal-secondary-black-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Mustard retirement (8 files)

**Files:**
- Modify: `src/components/layout/Nav.astro:23` — "Coming Next Year" eyebrow
- Modify: `src/components/landing/WorkshopsTile.astro:12` — same eyebrow
- Modify: `src/components/shakespeare/AskShakespeareCard.astro:26` — column number chip
- Modify: `src/components/community/CompanionTheatreCard.astro:35` — "Unconfirmed" chip
- Modify: `src/components/legacy/FounderCard.astro:44` — "Unconfirmed" chip
- Modify: `src/components/shakespeare/AskShakespeareForm.astro:12` — fallback form container
- Modify: `src/components/community/TestimonialForm.astro:10` — fallback form container
- Modify: `src/components/ui/NewsletterSignup.astro:18` — fallback form container
- Modify: `src/pages/community/membership.astro` (2 bg-mustard-200 refs — audit for role)
- Modify: `src/pages/childrens-theatre/plays.astro` (2 bg-mustard-200 refs — audit)

**Interfaces:**
- Consumes: teal-800, ink-500 utilities (all pre-existing)
- Produces: Mustard fully retired from the codebase (except potentially tokens.css definition, kept per spec)

- [ ] **Step 1: Flip "Coming Next Year" eyebrows (Nav + WorkshopsTile)**

```bash
sed -i.bak 's|text-mustard-800 mt-|text-teal-800 mt-|g' /Users/cnote/projects/dtfc/src/components/layout/Nav.astro && rm /Users/cnote/projects/dtfc/src/components/layout/Nav.astro.bak
sed -i.bak 's|text-mustard-800 text-\[0.625rem\]|text-teal-800 text-[0.625rem]|g' /Users/cnote/projects/dtfc/src/components/landing/WorkshopsTile.astro && rm /Users/cnote/projects/dtfc/src/components/landing/WorkshopsTile.astro.bak
```

- [ ] **Step 2: Flip AskShakespeareCard column number chip**

Edit `src/components/shakespeare/AskShakespeareCard.astro:26`, exact old:
```
<span class="text-mustard-800 text-xs font-semibold tracking-widest uppercase">
```
Exact new:
```
<span class="text-teal-800 text-xs font-semibold tracking-widest uppercase">
```

- [ ] **Step 3: Flip "Unconfirmed" chips (CompanionTheatreCard + FounderCard)**

For each of `src/components/community/CompanionTheatreCard.astro` and `src/components/legacy/FounderCard.astro`, replace:
```
<span class="bg-mustard-200 text-ink-700 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium">
```
with:
```
<span class="bg-ink-500/15 text-ink-700 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium">
```

Bash:
```bash
for f in \
  /Users/cnote/projects/dtfc/src/components/community/CompanionTheatreCard.astro \
  /Users/cnote/projects/dtfc/src/components/legacy/FounderCard.astro; do
  sed -i.bak 's|bg-mustard-200 text-ink-700 rounded-\[var(--radius-chip)\]|bg-ink-500/15 text-ink-700 rounded-[var(--radius-chip)]|g' "$f" && rm "${f}.bak"
done
```

- [ ] **Step 4: Flip fallback-form container borders/bg (3 forms)**

For each of `AskShakespeareForm.astro`, `TestimonialForm.astro`, `NewsletterSignup.astro`, replace `border-mustard-400/40 bg-mustard-200/20` with `border-ink-500/25 bg-ink-500/5`.

```bash
for f in \
  /Users/cnote/projects/dtfc/src/components/shakespeare/AskShakespeareForm.astro \
  /Users/cnote/projects/dtfc/src/components/community/TestimonialForm.astro \
  /Users/cnote/projects/dtfc/src/components/ui/NewsletterSignup.astro; do
  sed -i.bak 's|border-mustard-400/40 bg-mustard-200/20|border-ink-500/25 bg-ink-500/5|g' "$f" && rm "${f}.bak"
done
```

- [ ] **Step 5: Handle remaining Mustard hits in pages (pre-audited)**

Four remaining Mustard uses across two pages, each with an exact prescribed fix:

**`src/pages/childrens-theatre/plays.astro` lines 46 + 56** — series filter chips (unpressed state). Both lines have identical substring `bg-mustard-200 text-ink-700 aria-[pressed=true]:bg-teal-600`. Flip the unpressed bg from mustard to neutral:

```bash
sed -i.bak 's|bg-mustard-200 text-ink-700 aria-\[pressed=true\]:bg-teal-600|bg-ink-500/15 text-ink-700 aria-[pressed=true]:bg-teal-600|g' /Users/cnote/projects/dtfc/src/pages/childrens-theatre/plays.astro && rm /Users/cnote/projects/dtfc/src/pages/childrens-theatre/plays.astro.bak
```

**`src/pages/community/membership.astro` line 17** — status chip (pre-release / coming soon eyebrow). Exact old:
```
class="text-mustard-800 bg-mustard-200/40 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium uppercase tracking-widest"
```
Exact new:
```
class="text-teal-800 bg-teal-100 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium uppercase tracking-widest"
```

**`src/pages/community/membership.astro` line 39** — fallback-mode container (same pattern as the 3 forms in Step 4, but with opacity variation). Exact old:
```
class="border-mustard-400/40 bg-mustard-200/20 mt-4 rounded-[var(--radius-card)] border p-4"
```
Exact new:
```
class="border-ink-500/25 bg-ink-500/5 mt-4 rounded-[var(--radius-card)] border p-4"
```

Apply the three Edit operations (or one sed for plays.astro + two Edit calls for membership.astro since the membership hits are unique substrings).

- [ ] **Step 6: Verify Mustard fully retired**

Run:
```bash
grep -rEo "(bg|text|border)-mustard-[0-9]+" /Users/cnote/projects/dtfc/src --include="*.astro" 2>/dev/null | wc -l
```

Expected: **0**. If non-zero, address remaining hits from Step 5.

- [ ] **Step 7: Build + smoke**

Run: `pnpm build && pnpm test:e2e 2>&1 | tail -10`
Expected: clean.

- [ ] **Step 8: Commit**

Run:
```bash
git add -u src/
git commit -m "$(cat <<'EOF'
style(mustard): retire Mustard palette site-wide

Coming Next Year eyebrows (Nav, WorkshopsTile): text-mustard-800 ->
text-teal-800.
AskShakespeareCard column number chip: text-mustard-800 -> text-teal-800.
Unconfirmed chips (CompanionTheatreCard, FounderCard):
  bg-mustard-200 text-ink-700 -> bg-ink-500/15 text-ink-700 (muted neutral).
Fallback-mode form containers (AskShakespeareForm, TestimonialForm,
  NewsletterSignup): border-mustard-400/40 bg-mustard-200/20 ->
  border-ink-500/25 bg-ink-500/5 (neutral not-yet-configured tone).
Remaining Mustard uses in pages/community/membership and
  pages/childrens-theatre/plays audited individually and flipped per
  their role (chip / eyebrow / decorative fill).

--color-mustard-* tokens kept defined in tokens.css for rollback
safety per spec section 3; active use is now zero.

Spec: docs/superpowers/specs/2026-09-05-primary-teal-secondary-black-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Ivory retirement — bg + border sweep (LARGE)

**Files:**
- Many. Any component/page with `bg-ivory-*` (except `text-ivory-50` on teal/dark surfaces — those stay) or `border-ivory-200`.

**Interfaces:**
- Consumes: `bg-white` utility, `border-ink-500/15` utility (both pre-existing via Tailwind)
- Produces: fully retired Ivory backgrounds; cool-neutral card borders

This is the largest task. Do it in two phases (bg then border) with grep verification between.

### Phase 8a: `bg-ivory-*` retirement

- [ ] **Step 1: List current `bg-ivory-*` occurrences by file**

Run:
```bash
grep -rEln "bg-ivory-[0-9]+" /Users/cnote/projects/dtfc/src --include="*.astro" 2>/dev/null
```

Record the file list. Expect ~10 files.

- [ ] **Step 2: For each file, flip `bg-ivory-50 → bg-white`, `bg-ivory-100 → bg-white`, `bg-ivory-200 → bg-white`**

Bulk-safe global sed (skips `text-ivory-*` and `border-ivory-*` because the regex anchors on `bg-`):
```bash
grep -rEln "bg-ivory-[0-9]+" /Users/cnote/projects/dtfc/src --include="*.astro" 2>/dev/null | while IFS= read -r f; do
  sed -i.bak -E 's|bg-ivory-(50|100|200)|bg-white|g' "$f" && rm "${f}.bak"
done
```

- [ ] **Step 3: Verify no `bg-ivory-*` remain**

Run:
```bash
grep -rEno "bg-ivory-[0-9]+" /Users/cnote/projects/dtfc/src --include="*.astro" 2>/dev/null
```

Expected output: **empty**. If any remain, inspect and address individually.

- [ ] **Step 4: Audit `bg-ivory-*/` opacity-modifier variants**

Run:
```bash
grep -rEno "bg-ivory-[0-9]+/[0-9]+" /Users/cnote/projects/dtfc/src --include="*.astro" 2>/dev/null
```

If any hit (e.g. `bg-ivory-100/60`), read each in context. Replace with `bg-white/<same-opacity>` if it's a bg wash, or with `bg-white` if the opacity was redundant. Handle individually.

- [ ] **Step 5: Build + smoke to catch visual regressions**

Run: `pnpm build && pnpm test:e2e 2>&1 | tail -15`
Expected: clean.

### Phase 8b: `border-ivory-200` → `border-ink-500/15` sweep

- [ ] **Step 6: List current `border-ivory-200` occurrences**

Run:
```bash
grep -rEln "border-ivory-200" /Users/cnote/projects/dtfc/src --include="*.astro" 2>/dev/null | wc -l
```

Expect ~10-15 files.

- [ ] **Step 7: Global sed flip**

```bash
grep -rEln "border-ivory-200" /Users/cnote/projects/dtfc/src --include="*.astro" 2>/dev/null | while IFS= read -r f; do
  sed -i.bak 's|border-ivory-200|border-ink-500/15|g' "$f" && rm "${f}.bak"
done
```

- [ ] **Step 8: Verify no `border-ivory-200` remain**

```bash
grep -rEno "border-ivory-200" /Users/cnote/projects/dtfc/src --include="*.astro" 2>/dev/null
```

Expected: **empty**.

- [ ] **Step 9: Audit remaining `border-ivory-*` variants**

Run:
```bash
grep -rEno "border-ivory-[0-9]+" /Users/cnote/projects/dtfc/src --include="*.astro" 2>/dev/null
```

If any (e.g. `border-ivory-50`, `border-ivory-300`, `border-ivory-50/40`), read each in context. Likely candidates to flip to `border-ink-500/<opacity>` or `border-white/<opacity>` depending on role. Handle individually.

- [ ] **Step 10: Build + smoke**

Run: `pnpm build && pnpm test:e2e 2>&1 | tail -15`
Expected: clean. Watch for contrast violations — a card with `border-ink-500/15` on white bg might read too subtle in some contexts. If axe or manual visual pass flags any, adjust opacity to `/20` or `/25` for that specific component.

- [ ] **Step 11: Manual visual check**

Run: `pnpm dev`. Walk through:
- `/legacy/founders/` — FounderCard borders should still define the card
- `/community/newsletters/` — NewsletterCard borders should still define the card
- `/theatre-games/` — GameCard borders on the grid
- `/resource-center/` — EntryCard grid on white bg
- `/shakespeare/soliloquies/` — ScriptCard grid
- `/community/companion-theatres/` — CompanionTheatreCard grid

If any card's edge feels invisible or overly subtle, bump the border opacity in that specific component to `/20` or `/25`. Stop the dev server.

- [ ] **Step 12: Commit**

Run:
```bash
git add -u src/
git commit -m "$(cat <<'EOF'
style(ivory): retire bg-ivory-* + border-ivory-200 site-wide

Phase 1: bg-ivory-50/100/200 -> bg-white across all components and
pages. Cards previously distinguished from body bg via ivory tint
now distinguished purely by border (border already present on all
card components).

Phase 2: border-ivory-200 -> border-ink-500/15 site-wide. Warm neutral
border becomes cool neutral, matching new white body bg. Remaining
border-ivory-* variants (border-ivory-50, border-ivory-300, opacity
modifiers) audited and flipped individually per role.

--color-ivory-* tokens kept defined in tokens.css for rollback safety
per spec section 3; active use is now limited to text-ivory-50 (used
on teal/dark surfaces like the CommunityCenter tile -- those don't
retire because the underlying surface is still teal).

Spec: docs/superpowers/specs/2026-09-05-primary-teal-secondary-black-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Chip semantic recolor (Chip.astro + ScriptCard register)

**Files:**
- Modify: `src/components/ui/Chip.astro:7-12` (tone map)
- Modify: `src/components/scripts/ScriptCard.astro:18-23` (register color mapping)

**Interfaces:**
- Consumes: teal-100, teal-800, ink-500, ink-700, ink-900 utilities
- Produces: 4 visually distinct chip tones without clay↔teal collision; register mapping recolored to match

- [ ] **Step 1: Update Chip.astro tone map**

Edit `src/components/ui/Chip.astro`, lines 7-12. Exact old (**post-Task-7 + post-Task-8 state**: Task 7 residual-swept the `mustard:` line to `bg-teal-100 text-teal-800`; Task 8 flipped the `neutral:` line's `bg-ivory-200 → bg-white`; both are documented ledger rulings):
```typescript
const tones = {
  clay: 'bg-clay-100 text-clay-700',
  teal: 'bg-teal-100 text-teal-800',
  mustard: 'bg-teal-100 text-teal-800',
  neutral: 'bg-white text-ink-700',
};
```
Exact new:
```typescript
const tones = {
  clay: 'bg-teal-800 text-white',
  teal: 'bg-teal-100 text-teal-800',
  mustard: 'bg-ink-500/15 text-ink-700',
  neutral: 'bg-white text-ink-500 border border-ink-500/20',
};
```

Tone names kept for API stability. Callsites using `<Chip tone="clay">` now render as bold dark teal; `<Chip tone="mustard">` renders as muted gray; `<Chip tone="neutral">` gains an explicit border since white-on-white would be invisible.

- [ ] **Step 2: Update ScriptCard register color mapping**

Edit `src/components/scripts/ScriptCard.astro`, lines 18-23. Exact old (**post-Task-7 + post-Task-8 state**: Task 7 residual-swept `grief:` to `bg-teal-100 text-teal-800`; Task 8 flipped `villain:` line's `bg-ivory-200 → bg-white`; both are documented ledger rulings):
```typescript
const registerColors: Record<string, string> = {
  comic:    'bg-teal-100 text-teal-800',
  dramatic: 'bg-clay-100 text-clay-700',
  villain:  'bg-white text-ink-900',
  grief:    'bg-teal-100 text-teal-800',
};
```
Exact new:
```typescript
const registerColors: Record<string, string> = {
  comic:    'bg-teal-100 text-teal-800',
  dramatic: 'bg-teal-800 text-white',
  villain:  'bg-ink-900 text-white',
  grief:    'bg-ink-500/15 text-ink-700',
};
```

Update the comment above the mapping (line 15-17) too — the "amber/charcoal/indigo not in tokens.css" comment is stale. Replace:
```typescript
// Register color mapping using existing token families (amber/charcoal/indigo not in tokens.css).
// comic → teal (light, playful); dramatic → clay (warm, serious);
// villain → ivory-200/ink-900 (neutral, shadowed); grief → mustard (muted, somber).
```
with:
```typescript
// Register color mapping on the primary-teal / secondary-black palette.
// comic → teal-100 (light, playful); dramatic → teal-800 (bold, serious);
// villain → ink-900 (shadowed); grief → ink-500/15 (muted, somber).
```

- [ ] **Step 3: Build + smoke**

Run: `pnpm build && pnpm test:e2e 2>&1 | tail -10`
Expected: clean.

- [ ] **Step 4: Manual visual check on chip usage**

Run: `pnpm dev`. Visit:
- `/theatre-games/` — GameCard uses `<Chip tone="clay">` for competency; should now render as bold dark teal
- `/shakespeare/soliloquies/` — ScriptCard uses `<Chip tone="clay">` for theme + register color mapping; verify all four register colors are visually distinct
- `/styles-preview` — Chip tones shown side-by-side; confirm all four differentiate

Stop the dev server.

- [ ] **Step 5: Commit**

Run:
```bash
git add src/components/ui/Chip.astro src/components/scripts/ScriptCard.astro
git commit -m "$(cat <<'EOF'
style(chips): recolor semantic tones + register mapping to teal/ink palette

Chip.astro tones (API-stable rename — callsites unchanged):
- clay -> bg-teal-800 text-white (was warm; now bold dark teal)
- teal -> unchanged (bg-teal-100 text-teal-800; light playful)
- mustard -> bg-ink-500/15 text-ink-700 (was warm; now muted gray)
- neutral -> bg-white text-ink-500 border border-ink-500/20
  (was ivory-based; now explicit border prevents white-on-white
  invisibility on the new white body bg)

ScriptCard register color mapping (comic/dramatic/villain/grief):
- comic: unchanged (bg-teal-100 text-teal-800)
- dramatic: bg-clay-100 text-clay-700 -> bg-teal-800 text-white
- villain: bg-ivory-200 text-ink-900 -> bg-ink-900 text-white
- grief: bg-mustard-200 text-ink-700 -> bg-ink-500/15 text-ink-700

Four distinct visual tones preserved. Stale comment ("amber/charcoal/
indigo not in tokens.css") updated to reflect new palette.

Spec: docs/superpowers/specs/2026-09-05-primary-teal-secondary-black-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Final verification + PR

**Files:** none (verification + PR creation only)

**Interfaces:**
- Consumes: all Tasks 1-9 deliverables
- Produces: green build, green tests, PR ready for review

- [ ] **Step 1: Verify remaining warm-palette usage matches spec's intentionally-preserved set**

Run:
```bash
grep -rEo "(bg|text|border|ring|from|to)-(ivory|clay|mustard)-[0-9]+" /Users/cnote/projects/dtfc/src --include="*.astro" 2>/dev/null | sort | uniq -c | sort -rn
```

Acceptable survivors:
- `ring-clay-500` (focus rings — spec-preserved)
- `text-ivory-50` (light text on teal/dark surfaces like CommunityCenter tile, DT:FC page CTAs)
- Any specific reference the spec explicitly kept (timeline org styling via `--color-timeline-*` — NOT in this grep because it's a CSS var, not a Tailwind class)

Unacceptable survivors (indicate a miss): anything else. If found, address per spec rules and add to the appropriate task's changeset (may require a small follow-up commit).

- [ ] **Step 2: Full test suite**

Run:
```bash
pnpm build && pnpm test && pnpm test:e2e
```

Expected: 157 pages clean, 234/234 unit tests, 13/13 smoke checkpoints, zero critical/serious axe violations.

- [ ] **Step 3: Full manual visual pass**

Run: `pnpm dev`. Walk every checkpoint page in the smoke test (list from `tests/e2e/smoke.spec.ts`):
1. `/` (landing) — hero teal, tiles white with cool borders, teal accent stripes bookend
2. `/resource-center/` — letter rail, entry cards, on white bg
3. `/resource-center/casting/` — callout-tip (dark teal) and callout-why (bright teal) visually distinct
4. `/resource-center/stage/` — 6 SVG diagrams render, related resources block on white
5. `/theatre-games/finder` — game finder card grid
6. `/shakespeare/` — warm-callout aside is now teal, pull-quote is teal
7. `/shakespeare/scenes/` — DT:FC scenes cluster, Nenno pull-quote (teal border)
8. `/shakespeare/soliloquies/` — filter island + ScriptCard register colors (4 distinct tones)
9. `/shakespeare/childrens-shakespeare/` — Spanish shelf + NeverMemorizeBox + Mechanicals card, warm-callout aside teal
10. `/shakespeare/themes/` — archival section + Fools/Fooling heading
11. `/shakespeare/colloquial/` — audio + transcript + okina title
12. `/shakespeare/ask-shakespeare/` — column #5 with new teal chip + form section
13. `/shakespeare/alternatives/` — Alt Four trade-offs callout (now ink-neutral)
14. `/legacy/founders/` — FounderCard with photo + FounderCard without (teal placeholder initials)
15. `/legacy/timeline/` — timeline org colors UNCHANGED (semantic)
16. `/legacy/index.astro` — pull-quote teal
17. `/childrens-theatre/` — Wayfarer's Journey Wheel now teal, warm-callout aside teal
18. `/community/testimonials/` — quote marks now teal-800
19. `/404` — CTA button
20. `/styles-preview` — design-system reference (this may need a separate update if it visually documents the old palette)

For each page, confirm: pure white bg, teal accents where CTAs live, black text, no warm-color surfaces except the preserved set (Header logo circle now white, timeline org colors on `/legacy/timeline/`).

If `/styles-preview` shows outdated color swatches, add a follow-up commit updating it (or note as out-of-scope per spec §9).

Stop the dev server.

- [ ] **Step 4: Push to remote**

Run:
```bash
git push
```

- [ ] **Step 5: Open PR**

Run:
```bash
gh pr create --base main --head fix/vercel-build-invalid-url \
  --title "style: primary-teal / secondary-black visual system reset" \
  --body "$(cat <<'EOF'
## Summary

Shifts the DT:FC website from its warm editorial palette (Clay/Mustard/Ivory on ivory bg) to a **primary-teal / secondary-black palette** matching the DT:FC primary logo's aesthetic (black + white + teal accent). **Keeps Fraunces + Inter typography** — the serif face is doing distinct editorial work the logo's geometric sans doesn't try to.

Full design rationale + inherited constraints in `docs/superpowers/specs/2026-09-05-primary-teal-secondary-black-design.md`. Implementation followed `docs/superpowers/plans/2026-09-05-primary-teal-secondary-black.md`.

## What changed

- **Body bg**: ivory-50 → white
- **Headings**: staggered teal — H1 teal-600, H2/H3 teal-800, H4 ink-900 (hierarchy preserved; not legacy's flat all-teal)
- **Callouts**: tip flips to teal-800 (paired with teal-600 why via shade differentiation); tradeoffs neutralizes to ink; box on white bg; practical unchanged
- **Chrome**: Header logo circle + Footer bg → white (teal accent stripes from PR #6 unchanged)
- **Warm asides**: 4 callout asides + 5 blockquote pull-quotes flip Clay → teal
- **Decorative warmth**: TestimonialCard quote marks + FounderCard placeholder initials + Wayfarer's Journey Wheel flip Clay → teal
- **Mustard**: fully retired (Coming Next Year eyebrows, Unconfirmed chips, fallback-form containers)
- **Ivory**: `bg-ivory-*` → `bg-white`; `border-ivory-200` → `border-ink-500/15`
- **Chip tones**: `clay` → bold dark teal, `mustard` → muted gray, `neutral` gains an explicit border; ScriptCard register mapping recolored to match

## What's preserved

- Fraunces + Inter typography
- Ink-900 body text
- Focus rings (Clay for a11y contrast against teal-primary UI)
- Timeline org colors (semantic timeline data)
- callout-practical (Moss; separate concern + pre-existing bug)
- `--color-clay-*`, `--color-mustard-*`, `--color-ivory-*` tokens kept defined for rollback safety (active use retired)

## Legacy anti-patterns explicitly NOT inherited

- Teal body text (fails WCAG contrast; body stays ink-900)
- All-headings-teal (staggered instead: H1 teal-600, H2/H3 teal-800, H4 ink)
- Palette collapse to single color (teal + black + white are three distinct roles)

## Test plan

- [x] `pnpm build` — 157 pages
- [x] `pnpm test` — 234/234 unit tests
- [x] `pnpm test:e2e` — 13/13 smoke checkpoints, zero critical/serious axe violations (teal-800 headings on white clear 4.5:1 comfortably)
- [ ] Vercel preview visual pass on the 20 checkpoint pages listed in the plan
- [ ] `/styles-preview` audit — may need a follow-up update if its content documents the retired palette

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 6: Report PR URL**

Print the PR URL returned by the `gh pr create` command. Task complete when the PR is open and CI (Vercel preview) is triggered.

---

## Post-execution notes (fill in during rollout)

Reserved for the executing agent to record:
- Whether the Task 2 heading fallback was triggered
- Any component that needed border opacity bump above `/15` for visibility
- Any Mustard use in `membership.astro` / `plays.astro` that required non-standard treatment
- `/styles-preview` audit result: update in-scope, deferred, or already fine
- Any surprise that upgraded a task from bounded to architectural mid-flight (per superpowers process)
