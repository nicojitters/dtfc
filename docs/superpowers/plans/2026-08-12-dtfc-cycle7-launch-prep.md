# DT:FC Cycle 7 — Launch-Prep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the DT:FC site to a launch-ready state — Pagefind cross-site search, Vercel Analytics + Speed Insights, WCAG AA audit automated via axe-core in the smoke test, known accessibility/UX fixes from Cycle 1-6 reviews, launch essentials (404 page, OG meta, canonical URLs, robots.txt, `hello@dtfc.example` centralization), apostrophe cleanup of Cycles 1-4 shipped-content debt, and a launch checklist document. Cycle 7 is plumbing; Cycle 8 flips the client-blocked chips once real credentials + assets land.

**Architecture:** Pagefind is a build-time static indexer — `pnpm build` runs `astro build && pagefind --site dist`, producing `dist/pagefind/` with the index + client bundle. Search UI is a native `<dialog>` `SearchModal` component triggered by a header search icon + ⌘K, plus a `/search/` fallback page. Vercel Analytics + Speed Insights render as `<Analytics />` / `<SpeedInsights />` from `@vercel/analytics` and `@vercel/speed-insights`, gated by `PUBLIC_VERCEL_ANALYTICS_ENABLED` env so local dev stays quiet. `BaseLayout.astro` gains `ogImage?` + `canonical?` props with sensible defaults, emitting OG + canonical + Twitter Card meta. Cross-cutting settings (`fallbackContactEmail`, `canonicalHost`, `ogDefaults`) centralize into `src/lib/site-config.ts`. axe-core violations at Critical/Serious severity fail the Playwright smoke test.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@theme` tokens), TypeScript strict, Pagefind (build-time indexer + client-side UI), `@vercel/analytics` + `@vercel/speed-insights` (cookieless telemetry), `@axe-core/playwright` + `axe-core` (a11y audit in CI), Vitest, Playwright, native `<dialog>` API (no framework for search modal).

## Global Constraints

- **Branch:** all work on `cycle-7-launch-prep`. Merge to `main` at cycle end uses `git merge --no-ff`.
- **Package manager:** `pnpm` only. Commands: `pnpm dev`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm check:concepts`, `pnpm check:prohibited`.
- **Node module type:** `"type": "module"` — ESM everywhere.
- **No hex codes in components** — colors come from tokens in `src/styles/tokens.css`. No new tokens are added this cycle.
- **Vocabulary:** "Players" (never "actors"), "Facilitator" (never "leader"), "Players Resource Center" (full), "Children's Theatre" (curly apostrophe).
- **CURLY APOSTROPHES IN ALL PROSE — enforced automatically.** Cycle 5's guardrail (`scripts/check-prohibited-text.mjs`) runs in `pnpm build` and fails on any straight U+0027 in prose contexts inside `.astro` / `.mdx` / `.md` files. Per-task prompts do NOT need per-task apostrophe grep reminders — the build failure is the check. Cycle 7 shrinks `CURLY_APOSTROPHE_ALLOWLIST` from 28 entries to 3 (Shakespeare verse only).
- **Prohibited landing/site copy** (unchanged): `Great Change`, `traditional work and ways`, `THIS (crazy) time`, `RESILIENCEl`, `Childrens' Theatre` (wrong-apostrophe variant).
- **`is:inline` scripts must wait for DOMContentLoaded** before querying DOM elements they depend on. Idempotency guard `window.__dtfc<Name>Init` — Cycle 5 T18 lesson.
- **Cycle 6 T5+T6 lesson:** the reviewer MUST run `pnpm check` independently after every task, not trust the implementer's report.
- **Zod imports use `astro/zod`**, not bare `zod` (Cycle 2 T2 lesson).
- **FOUNDERS pattern:** if any Zod object gets literal instantiation, include explicit `sample: false/true` + any other `.default()` fields on every entry — TypeScript strict rejects otherwise (Cycle 5 T7 lesson).
- **Commit granularity:** one commit per task. Commit messages authored `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` via HEREDOC.
- **Env variables:** `PUBLIC_*`-prefixed vars only for client-safe values (Astro convention). `.env` is git-ignored per Cycle 1 rules; `.env.example` is committed.
- **No client-blocker soft-ships added this cycle.** Cycle 7 is plumbing; Cycle 8 flips the pre-release / coming-soon / sample chips from Cycle 6.
- **axe-core assertion policy:** fail on `critical` or `serious` only. `moderate` / `minor` violations get logged (console.info) and triaged as follow-ups.
- **Vercel Analytics scope:** default `PUBLIC_VERCEL_ANALYTICS_ENABLED=false` in `.env.example` so local dev stays quiet. Vercel production env sets to `true` in the dashboard.

---

## File Map

**Create:**
- `src/lib/site-config.ts`
- `src/pages/404.astro`
- `src/pages/search.astro`
- `src/components/search/SearchModal.astro`
- `public/robots.txt`
- `public/og-default.png` (placeholder 1200×630 PNG — DT:FC wordmark on ivory background)
- `docs/launch-checklist.md`
- `tests/unit/site-config.test.ts`
- `tests/e2e/axe-helpers.ts` (optional co-located helper file for `runAxe(page, name)`)
- `docs/superpowers/plans/2026-08-12-dtfc-cycle7-launch-prep.md` (this file)

**Modify:**
- `.env.example` — add `PUBLIC_VERCEL_ANALYTICS_ENABLED`, `PUBLIC_SITE_URL`
- `package.json` — add devDeps (`pagefind`, `@axe-core/playwright`, `axe-core`) + regular deps (`@pagefind/default-ui`, `@vercel/analytics`, `@vercel/speed-insights`); update `build` script to add `&& pagefind --site dist`
- `src/layouts/BaseLayout.astro` — add `ogImage?` + `canonical?` props; emit OG / Twitter / canonical meta; conditionally render Vercel scripts
- `src/components/layout/Header.astro` — search icon + `SearchModal` mount
- `src/components/concept/ConceptLayout.astro` — resolve related-chip display names (fix known Cycle 1 followup)
- `src/components/scripts/ScriptDetail.astro` — drop redundant `<h1>` (defer to layout title)
- `src/components/legacy/EssayDetail.astro` — same
- `src/components/community/NewsletterDetail.astro` — same
- `src/pages/shakespeare/ask-shakespeare/[slug].astro` — verify pattern; drop `<h1>` if present alongside layout title
- `src/components/legacy/TimelineLegend.astro` — add `focus-visible:` ring on chip buttons; add `motion-reduce:transition-none` on any transitions
- `src/pages/legacy/honoring-our-guides.astro` — `1970&rsquo;s` → `1970s` (copy consistency)
- 4 form components + 1 Donate CTA — import `SITE_CONFIG.fallbackContactEmail` from `@/lib/site-config` instead of hardcoding `hello@dtfc.example`:
  - `src/components/ui/NewsletterSignup.astro`
  - `src/components/landing/NewsletterTile.astro`
  - `src/components/shakespeare/AskShakespeareForm.astro`
  - `src/components/community/TestimonialForm.astro`
  - `src/pages/community/donate.astro`
- Up to 25 currently-whitelisted Cycle 1-4 files — flip U+0027 → U+2019 in prose (T13 apostrophe cleanup)
- `scripts/check-prohibited-text.mjs` — shrink `CURLY_APOSTROPHE_ALLOWLIST` from 28 → 3 (Shakespeare verse only) after T13
- `tests/e2e/smoke.spec.ts` — axe scans after each page-navigation block + Pagefind smoke assertion
- `CLAUDE.md` — Cycle 7 conventions (Pagefind, analytics, axe discipline, SITE_CONFIG, launch checklist location)

**Auto-memory updates (end of cycle):** `project_dtfc_cycles.md`, `project_dtfc_followups.md`.

---

## Task 1: `SITE_CONFIG` centralization + `.env.example` extension + Vitest

**Files:**
- Create: `src/lib/site-config.ts`
- Create: `tests/unit/site-config.test.ts`
- Modify: `.env.example`

**Interfaces produced:**
- `export const SITE_CONFIG` — const object with `fallbackContactEmail`, `canonicalHost`, and `ogDefaults` shape.
- `.env.example` documents `PUBLIC_VERCEL_ANALYTICS_ENABLED` (default `false`) + `PUBLIC_SITE_URL` (default `https://dtfc.example`) alongside the existing Formspree vars.

- [ ] **Step 1: Write the failing test at `tests/unit/site-config.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { SITE_CONFIG } from '@/lib/site-config';

describe('SITE_CONFIG', () => {
  it('exports fallbackContactEmail as a string', () => {
    expect(typeof SITE_CONFIG.fallbackContactEmail).toBe('string');
    expect(SITE_CONFIG.fallbackContactEmail.length).toBeGreaterThan(0);
  });

  it('fallbackContactEmail is a plausible email (contains @)', () => {
    expect(SITE_CONFIG.fallbackContactEmail).toContain('@');
  });

  it('exports canonicalHost as an https URL', () => {
    expect(SITE_CONFIG.canonicalHost).toMatch(/^https:\/\//);
  });

  it('exports ogDefaults with image, imageAlt, imageWidth, imageHeight', () => {
    expect(SITE_CONFIG.ogDefaults.image).toMatch(/^\//);
    expect(typeof SITE_CONFIG.ogDefaults.imageAlt).toBe('string');
    expect(SITE_CONFIG.ogDefaults.imageWidth).toBe(1200);
    expect(SITE_CONFIG.ogDefaults.imageHeight).toBe(630);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL (module not found)**

```bash
pnpm test tests/unit/site-config.test.ts
```

Expected: FAIL — `@/lib/site-config` module missing.

- [ ] **Step 3: Create `src/lib/site-config.ts`**

```typescript
/**
 * Cross-cutting site settings that would otherwise scatter across form
 * components, Donate CTA, and meta layout code. Centralizing here makes
 * launch-time swaps a 1-3 line edit rather than a site-wide find/replace.
 *
 * Post-launch (Cycle 8): swap `fallbackContactEmail` to the real inbox,
 * swap `canonicalHost` to the real production domain, swap
 * `ogDefaults.image` to Desirae's real OG asset.
 */
export const SITE_CONFIG = {
  fallbackContactEmail: 'hello@dtfc.example',
  canonicalHost: 'https://dtfc.example',
  ogDefaults: {
    image: '/og-default.png',
    imageAlt: 'Developmental Theatre: Fearless Creativity',
    imageWidth: 1200,
    imageHeight: 630,
  },
} as const;
```

- [ ] **Step 4: Extend `.env.example`**

Append to the existing file (which already documents the 3 Formspree vars from Cycle 6):

```
# Vercel Analytics + Speed Insights. Cookieless, aggregate telemetry.
# Set to `true` in the Vercel production dashboard; leave `false` locally
# so `pnpm dev` sessions don't ping analytics endpoints.
PUBLIC_VERCEL_ANALYTICS_ENABLED=false

# Canonical site URL. Emits into <link rel="canonical"> and OG meta.
# `.env.example` ships with the placeholder host; Vercel production env
# sets to the real domain at deploy time.
PUBLIC_SITE_URL=https://dtfc.example
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
pnpm test tests/unit/site-config.test.ts
```

Expected: all 4 tests pass.

- [ ] **Step 6: Verify `pnpm check`**

```bash
pnpm check
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 7: Commit**

```bash
git add src/lib/site-config.ts tests/unit/site-config.test.ts .env.example
git commit -m "$(cat <<'EOF'
feat(config): add SITE_CONFIG centralization + Vercel Analytics env

New src/lib/site-config.ts exports SITE_CONFIG const with
fallbackContactEmail, canonicalHost, ogDefaults — cross-cutting values
that scattered across form components, Donate CTA, and future meta
layout code. Post-launch swaps become 1-3 line edits here.

.env.example gains PUBLIC_VERCEL_ANALYTICS_ENABLED (default false; set
true in Vercel production dashboard) + PUBLIC_SITE_URL (placeholder
host, real domain at deploy time).

Vitest asserts fallbackContactEmail plausibility, canonicalHost is
https, and ogDefaults shape (1200x630 image dims).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: `BaseLayout` OG meta + canonical + `robots.txt` + placeholder OG asset

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Create: `public/robots.txt`
- Create: `public/og-default.png` (1200×630 placeholder — see Step 3)

**Interfaces produced:**
- `BaseLayout` gains two optional props: `ogImage?: string` and `canonical?: string`. Defaults: `ogImage = SITE_CONFIG.ogDefaults.image`, `canonical = Astro.url.href` (Astro's canonical URL for the current page).
- Emits: `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`, `<meta property="og:image:alt">`, `<meta property="og:image:width">`, `<meta property="og:image:height">`, `<meta property="og:type" content="website">`, `<meta property="og:url">`, `<meta name="twitter:card" content="summary_large_image">`, `<link rel="canonical">`.

**Consumes:**
- `SITE_CONFIG` from `@/lib/site-config` (Task 1).

- [ ] **Step 1: Modify `src/layouts/BaseLayout.astro`**

Replace the file's content with the following. The `SkipLink` import stays; the `Header` and `Footer` imports stay; adds `SITE_CONFIG` import and the new meta block:

```astro
---
import '@/styles/global.css';
import Header from '@/components/layout/Header.astro';
import Footer from '@/components/layout/Footer.astro';
import SkipLink from '@/components/layout/SkipLink.astro';
import { SITE_CONFIG } from '@/lib/site-config';
import type { NavKey } from '@/lib/nav';

interface Props {
  title: string;
  description?: string;
  section?: NavKey;
  ogImage?: string;
  canonical?: string;
}
const { title, description, section, ogImage, canonical } = Astro.props;

const resolvedCanonical = canonical ?? Astro.url.href;
const resolvedOgImage = ogImage ?? SITE_CONFIG.ogDefaults.image;
const resolvedOgTitle = `${title} — DT:FC`;
const resolvedDescription = description ?? '';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{resolvedOgTitle}</title>
    {description && <meta name="description" content={description} />}

    <link rel="canonical" href={resolvedCanonical} />

    <meta property="og:type" content="website" />
    <meta property="og:title" content={resolvedOgTitle} />
    {description && <meta property="og:description" content={description} />}
    <meta property="og:url" content={resolvedCanonical} />
    <meta property="og:image" content={new URL(resolvedOgImage, SITE_CONFIG.canonicalHost).href} />
    <meta property="og:image:alt" content={SITE_CONFIG.ogDefaults.imageAlt} />
    <meta property="og:image:width" content={String(SITE_CONFIG.ogDefaults.imageWidth)} />
    <meta property="og:image:height" content={String(SITE_CONFIG.ogDefaults.imageHeight)} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={resolvedOgTitle} />
    {description && <meta name="twitter:description" content={description} />}
    <meta name="twitter:image" content={new URL(resolvedOgImage, SITE_CONFIG.canonicalHost).href} />
  </head>
  <body class="bg-ivory-50 text-ink-900 min-h-screen">
    <SkipLink />
    <Header section={section} />
    <main id="main-content" class="pt-6 md:pt-10">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Notes:**
- The `SkipLink` already exists (verified via BaseLayout import); no separate skip-link task needed.
- `new URL(resolvedOgImage, SITE_CONFIG.canonicalHost).href` produces an absolute URL for the OG image (crawlers require absolute URLs).
- Vercel Analytics + Speed Insights lands in Task 7 — deliberately deferred to a separate task for scoped review.

- [ ] **Step 2: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://dtfc.example/sitemap-index.xml
```

**Note:** the sitemap URL uses the same placeholder host as `SITE_CONFIG.canonicalHost`. Post-launch Cycle 8 swaps this file at the same time it swaps `SITE_CONFIG.canonicalHost`. Both are documented in `docs/launch-checklist.md`.

- [ ] **Step 3: Create `public/og-default.png` placeholder**

The site needs a 1200×630 PNG at `public/og-default.png` so the OG meta tag doesn't emit a 404 URL. Create a minimal placeholder:

Option A — copy the existing logo as a placeholder:

```bash
# Verify existing logo asset:
ls -la public/DTFC-logo.png
# If it exists, use it as-is (it's a placeholder anyway per Cycle 1 followups).
# Rename a copy for the OG slot; the layout expects og-default.png.
cp public/DTFC-logo.png public/og-default.png
```

Option B (if `DTFC-logo.png` doesn't exist or is unusable): create a solid ivory 1200×630 PNG using ImageMagick or an equivalent tool. If neither is available on your machine, create a minimal 1×1 placeholder:

```bash
# Verify pnpm has access to convert or magick; if not, use printf to write a minimal valid PNG:
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xff\xff?\x00\x05\xfe\x02\xfe\xdc\xccY\xe7\x00\x00\x00\x00IEND\xaeB`\x82' > public/og-default.png
```

(A 1×1 pixel is technically a valid PNG that browsers will accept for the meta tag until Desirae delivers the real 1200×630 asset. Both dimensions are declared in meta regardless.)

Prefer Option A (real placeholder-image feel). Fall back to Option B only if the logo asset doesn't exist.

Verify:

```bash
ls -la public/og-default.png
```

Expected: file exists, non-zero size.

- [ ] **Step 4: Verify `pnpm check`**

```bash
pnpm check
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 5: Verify `pnpm build` — clean + sitemap + robots**

```bash
pnpm build
```

Expected: succeeds; `dist/robots.txt` present; `dist/sitemap-index.xml` present; both guardrails green.

Sanity-check the sitemap generation:

```bash
ls dist/*.xml dist/robots.txt
```

- [ ] **Step 6: Verify OG meta emission on a built page**

```bash
grep -E 'og:image|og:title|canonical' dist/index.html | head -5
```

Expected: at least one match each for `og:image`, `og:title`, and `canonical`.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/BaseLayout.astro public/robots.txt public/og-default.png
git commit -m "$(cat <<'EOF'
feat(launch): add OG meta + canonical + robots.txt to BaseLayout

BaseLayout gains ogImage? + canonical? props with sensible defaults
(image → SITE_CONFIG.ogDefaults.image; canonical → Astro.url.href).
Emits og:title/description/url/image (absolute, resolved via
SITE_CONFIG.canonicalHost) + twitter:card=summary_large_image +
<link rel=canonical>. Every existing layout that wraps BaseLayout
picks these up automatically.

robots.txt allows all + points at sitemap-index.xml (which
@astrojs/sitemap generates). Placeholder host — Cycle 8 swaps to
real domain along with SITE_CONFIG.canonicalHost.

og-default.png ships as a placeholder (real 1200x630 asset arrives
with Desirae logo/brand delivery).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: `/404.astro` friendly page

**Files:**
- Create: `src/pages/404.astro`

**Interfaces consumed:**
- `BaseLayout` (Task 2 evolved version — the new OG/canonical props flow through automatically since 404 uses defaults).

- [ ] **Step 1: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/layout/Container.astro';
import { NAV_ITEMS } from '@/lib/nav';
---

<BaseLayout title="Page not found" description="The page you&rsquo;re looking for doesn&rsquo;t exist on the DT:FC site.">
  <Container class="mx-auto max-w-2xl py-20">
    <p class="text-ink-500 text-sm uppercase tracking-widest">404</p>
    <h1 class="mt-2">Page not found</h1>
    <p class="text-ink-700 mt-4 text-base">
      The page you&rsquo;re looking for doesn&rsquo;t exist &mdash; or it may have moved as the site
      grows. Try one of these paths, or use the search box in the header.
    </p>

    <div class="mt-8 flex flex-wrap gap-3">
      <a
        href="/"
        class="bg-clay-500 text-ivory-50 hover:bg-clay-700 focus-visible:ring-clay-500 rounded px-4 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2 no-underline"
      >
        Back to home
      </a>
      <a
        href="/search/"
        class="border-ink-500/30 text-ink-700 hover:border-clay-500 rounded border px-4 py-2 text-sm font-medium transition no-underline"
      >
        Search the site
      </a>
    </div>

    <nav aria-label="Section directory" class="mt-14">
      <h2 class="font-display text-2xl">Or jump to a section</h2>
      <ul class="mt-6 grid list-none gap-4 md:grid-cols-2 lg:grid-cols-3">
        {
          NAV_ITEMS.map((item) => (
            <li>
              <a
                href={item.href}
                class="border-ivory-200 bg-ivory-50 hover:border-clay-500/60 block rounded-[var(--radius-card)] border p-4 no-underline"
              >
                <span class="font-display text-ink-900 text-lg">{item.label}</span>
              </a>
            </li>
          ))
        }
      </ul>
    </nav>
  </Container>
</BaseLayout>
```

**Notes:**
- Wraps `BaseLayout` directly (not any `SectionLayout` — 404 doesn't belong to a section).
- Uses `NAV_ITEMS` from `@/lib/nav` for the section-directory list, so future nav changes automatically flow through.
- Links `/search/` — that page lands in Task 6. If Task 6 hasn't shipped yet at the moment 404 is deployed, the link 404s (recursive!); ordering below places /404 after Task 6 dependencies OR relies on subsequent task ordering.

**Reordering note:** T3 depends on Task 6's `/search/` page existing. If executing tasks in strict order, ship the 404 page after Task 6. In practice both tasks land before merge to main, so the ordering is safe within Cycle 7. If you're worried, Task 3 can render a plain-text "Search coming soon" fallback text instead of a link.

- [ ] **Step 2: Verify `pnpm check` + `pnpm build`**

```bash
pnpm check
pnpm build
```

Expected: 0 errors; build succeeds; `dist/404.html` present.

```bash
ls dist/404.html
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "$(cat <<'EOF'
feat(launch): add friendly /404 page

BaseLayout-wrapped 404 with h1 "Page not found", short empathetic
paragraph, back-to-home + search CTAs, and a 7-tile section directory
sourced from NAV_ITEMS. Design tokens only. No dynamic content.

Astro emits dist/404.html which most hosts (Vercel included) serve
automatically for any unmatched route.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Pagefind install + build integration

**Files:**
- Modify: `package.json` — add `pagefind` (devDep) + `@pagefind/default-ui` (regular dep); update `build` script to append `&& pagefind --site dist`.

**Interfaces produced:**
- `pnpm build` produces `dist/pagefind/pagefind.js` + `dist/pagefind/pagefind-ui.js` + a `dist/pagefind/fragment/` index directory. The client-side bundle is what Task 5's SearchModal loads.

- [ ] **Step 1: Install dependencies**

```bash
pnpm add -D pagefind
pnpm add @pagefind/default-ui
```

Verify:

```bash
grep -E '"pagefind"|"@pagefind/default-ui"' package.json
```

Expected: both entries present (`pagefind` in devDependencies, `@pagefind/default-ui` in dependencies).

- [ ] **Step 2: Update `build` script**

Modify `package.json` `scripts.build` from:

```json
"build": "pnpm check:concepts && pnpm check:prohibited && astro build",
```

to:

```json
"build": "pnpm check:concepts && pnpm check:prohibited && astro build && pagefind --site dist",
```

- [ ] **Step 3: Verify build integration**

```bash
pnpm build
```

Expected: astro build completes, then Pagefind runs and reports how many pages it indexed. Check that the output directory exists:

```bash
ls dist/pagefind/pagefind.js dist/pagefind/pagefind-ui.js
```

Both should exist. Also confirm at least 1 page was indexed (Pagefind logs this to stdout — should say "Indexed N pages").

- [ ] **Step 4: Verify Vitest suite still passes (no test changes expected)**

```bash
pnpm test
```

Expected: all suites still pass — the build change doesn't affect unit tests.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
feat(search): install Pagefind + wire into build script

pnpm build now runs astro build → pagefind --site dist. Pagefind is
a build-time static indexer that scans the built HTML and produces a
tiny client-side JS bundle at dist/pagefind/pagefind-ui.js. dist/ is
git-ignored, so no repo bloat.

@pagefind/default-ui is a regular dep (loaded by SearchModal in T5).
pagefind (the CLI) is a devDep.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: `SearchModal` component + Header integration

**Files:**
- Create: `src/components/search/SearchModal.astro`
- Modify: `src/components/layout/Header.astro` — add search icon trigger

**Interfaces produced:**
- `<SearchModal />` — renders a hidden native `<dialog>` with an id `dtfc-search-modal` that opens on `.showModal()`. Loads `@pagefind/default-ui` lazily on first open.
- Header renders a search-icon `<button>` (aria-label="Search") that opens the modal.
- Global `⌘K` / `Ctrl+K` keyboard shortcut opens the modal.

**Consumes:**
- Pagefind index (Task 4) — the client-side bundle at `/pagefind/pagefind-ui.js`.

- [ ] **Step 1: Create `src/components/search/SearchModal.astro`**

```astro
---
// SearchModal is a native <dialog> that lazily loads PagefindUI on first
// open. The Pagefind index is built at deploy time by `pagefind --site
// dist` (see package.json build script).
//
// CSS is imported statically so Astro extracts it into a stylesheet at
// build time. The JS module is dynamically imported at runtime inside a
// bundled <script> block (NOT is:inline — inline scripts can't resolve
// bare-specifier imports in the browser).
//
// Trigger: header search icon (data-search-trigger) OR keyboard shortcut
// (⌘K / Ctrl+K). Close: Escape (native <dialog> behavior) OR click
// outside the modal panel OR the close button.

import '@pagefind/default-ui/css/ui.css';
---

<dialog
  id="dtfc-search-modal"
  class="border-ivory-200 bg-ivory-50 mx-auto mt-16 w-full max-w-2xl rounded-[var(--radius-card)] border p-6 backdrop:bg-ink-900/40"
  aria-labelledby="dtfc-search-title"
  data-pagefind-ignore
>
  <div class="flex items-center justify-between">
    <h2 id="dtfc-search-title" class="font-display text-ink-900 text-xl">Search DT:FC</h2>
    <button
      type="button"
      data-search-close
      class="text-ink-500 hover:text-ink-900 rounded p-1 text-sm"
      aria-label="Close search"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
      </svg>
    </button>
  </div>

  <div id="dtfc-search-container" class="mt-4"></div>

  <p class="text-ink-500 mt-4 text-xs">
    Prefer a full-page view?{' '}
    <a href="/search/" class="hover:text-clay-500 underline" data-search-close>Open full search</a>.
  </p>
</dialog>

<script>
  // Bundled by Astro/Vite. The dynamic import() at runtime resolves to a
  // code-split chunk of @pagefind/default-ui — no cost until first open.
  if (!(window as any).__dtfcSearchModalInit) {
    (window as any).__dtfcSearchModalInit = true;

    const attach = () => {
      const modal = document.getElementById('dtfc-search-modal') as HTMLDialogElement | null;
      const container = document.getElementById('dtfc-search-container');
      const triggers = document.querySelectorAll<HTMLButtonElement>('[data-search-trigger]');
      const closes = document.querySelectorAll<HTMLElement>('[data-search-close]');
      if (!modal || !container) return;

      let uiLoaded = false;

      const loadUi = async () => {
        if (uiLoaded) return;
        uiLoaded = true;
        try {
          const { PagefindUI } = await import('@pagefind/default-ui');
          new PagefindUI({
            element: '#dtfc-search-container',
            showSubResults: true,
            pageSize: 10,
          });
        } catch {
          container.innerHTML =
            '<p class="text-ink-500 text-sm">Search index not available. Try again after the next deploy.</p>';
        }
      };

      const openModal = async () => {
        await loadUi();
        if (typeof modal.showModal === 'function') {
          modal.showModal();
        } else {
          modal.setAttribute('open', '');
        }
      };

      const closeModal = () => {
        if (typeof modal.close === 'function') {
          modal.close();
        } else {
          modal.removeAttribute('open');
        }
      };

      triggers.forEach((btn) => btn.addEventListener('click', openModal));
      closes.forEach((btn) => btn.addEventListener('click', closeModal));

      // Click backdrop to close (native <dialog> pattern)
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      // Keyboard shortcut: ⌘K on macOS, Ctrl+K elsewhere
      document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          openModal();
        }
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attach);
    } else {
      attach();
    }
  }
</script>
```

**Notes:**
- `data-pagefind-ignore` on the dialog prevents the search modal itself from appearing in search results.
- The dynamic `import('@pagefind/default-ui')` produces a code-split chunk that only loads on first open — zero cost until user activates search.
- Native `<dialog>` handles focus trap + Escape close + backdrop styling (`::backdrop` selector supported everywhere the site targets).

- [ ] **Step 2: Modify `src/components/layout/Header.astro`**

Add a search-icon button to the header. Read the current Header structure and insert a new button just before the mobile-menu toggle. Also mount `SearchModal` at the end of the header markup.

Current Header structure (from Cycle 6):
- `<header>` containing:
  - Logo (grid col 1)
  - Mobile menu toggle (grid col 3, `lg:hidden`)
  - Primary nav (grid col 2, `hidden lg:block`)
  - Placeholder div (grid col 3, `hidden lg:block`)
  - Mobile nav panel (below the header row)

Insert a new search-icon button in what's currently the empty `lg:block` placeholder div (col 3, desktop) AND add a search icon into the mobile toggle row (col 3, mobile). Simplest approach: swap the placeholder div for a search-icon button that shows on desktop AND add a second search-icon button in the mobile toggle row.

Rewrite `src/components/layout/Header.astro`:

```astro
---
import Container from './Container.astro';
import Nav from './Nav.astro';
import SearchModal from '@/components/search/SearchModal.astro';
import type { NavKey } from '@/lib/nav';
interface Props {
  section?: NavKey;
}
const { section } = Astro.props;
---

<header class="border-ivory-200 bg-ivory-50 border-b">
  <div class="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-8 px-5 py-4 md:px-8">
    <a href="/" class="text-ink-900 flex shrink-0 items-center gap-3 justify-self-start no-underline">
      <img src="/DTFC-logo.png" alt="" width="40" height="40" class="bg-clay-100 rounded-full" />
      <span class="font-display text-xl">DT:FC</span>
    </a>

    <div class="col-start-3 flex items-center gap-2 justify-self-end">
      <button
        type="button"
        data-search-trigger
        class="text-ink-700 hover:text-clay-500 rounded p-2"
        aria-label="Search"
        title="Search (⌘K)"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2" fill="none" />
          <path d="M14 14l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <button
        type="button"
        class="border-ivory-200 rounded border px-3 py-2 text-sm lg:hidden"
        aria-expanded="false"
        aria-controls="mobile-nav"
        data-mobile-toggle
      >
        Menu
      </button>
    </div>

    <nav aria-label="Primary" class="col-start-2 hidden justify-self-center lg:block">
      <Nav section={section} />
    </nav>
  </div>

  <div id="mobile-nav" hidden class="border-ivory-200 bg-ivory-50 border-t lg:hidden">
    <Container class="py-4">
      <Nav section={section} />
    </Container>
  </div>
</header>

<SearchModal />

<script>
  const toggle = document.querySelector<HTMLButtonElement>('[data-mobile-toggle]');
  const panel = document.getElementById('mobile-nav');
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    if (panel) panel.hidden = expanded;
  });
</script>
```

- [ ] **Step 3: Verify `pnpm check` + `pnpm build`**

```bash
pnpm check
pnpm build
```

Expected: 0 errors; build succeeds; Pagefind index present (from Task 4).

- [ ] **Step 4: Manual smoke test with `pnpm dev`**

```bash
pnpm dev
```

Open http://localhost:4321/, click the search icon (top right). Modal should open. Because Pagefind index only exists in `dist/` (production build), the dev-mode modal will show "Search index not available" — this is expected. To test search functionality:

```bash
# In a second terminal:
pnpm build
pnpm preview
```

Open http://localhost:4321/, click search, type "shakespeare" — expect results. Also press ⌘K (macOS) or Ctrl+K (Linux/Windows) to open the modal via keyboard.

- [ ] **Step 5: Commit**

```bash
git add src/components/search/SearchModal.astro src/components/layout/Header.astro
git commit -m "$(cat <<'EOF'
feat(search): add SearchModal + header search icon + ⌘K shortcut

SearchModal is a native <dialog> triggered by header search icon or
⌘K/Ctrl+K keyboard shortcut. Lazily loads @pagefind/default-ui on
first open (dynamic import → code-split chunk → zero cost until user
activates search). Native <dialog> handles focus trap, Escape close,
backdrop styling.

Header rewrite: adds search icon button beside the mobile toggle (col
3). Placeholder div swapped for the icon container so desktop layout
stays the same. Icon includes accessible label + title tooltip.

data-pagefind-ignore on the dialog prevents search UI itself from
being indexed. Fallback message renders if the Pagefind bundle fails
to load (e.g., dev mode where the index doesn't exist).

Uses the T18 DOMContentLoaded-wait pattern for the is:inline init
script.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: `/search/` standalone page + Pagefind smoke test

**Files:**
- Create: `src/pages/search.astro`
- Modify: `tests/e2e/smoke.spec.ts` — add Pagefind smoke assertion

**Interfaces produced:**
- `/search/` route renders a full-page search interface using PagefindUI.
- Playwright smoke test navigates to `/`, opens the search modal via ⌘K OR the search-icon button, types a term, asserts results appear.

**Consumes:**
- Pagefind index (Task 4).
- `SearchModal` selector conventions (Task 5).

- [ ] **Step 1: Create `src/pages/search.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/layout/Container.astro';
import '@pagefind/default-ui/css/ui.css';
---

<BaseLayout
  title="Search"
  description="Search across all DT:FC games, plays, essays, and timeline entries."
>
  <Container class="mx-auto max-w-3xl py-14">
    <p class="text-ink-500 text-sm uppercase tracking-widest">Search</p>
    <h1 class="mt-2">Search DT:FC</h1>
    <p class="text-ink-700 mt-4 text-base">
      Find games by name, plays by title, essays by author, timeline events, or any word from the
      site&rsquo;s prose. Use the search box in the header (or press <kbd>⌘K</kbd>) to open the
      quick search modal from any page.
    </p>

    <div id="dtfc-search-page" class="mt-10" data-pagefind-ignore></div>
  </Container>
</BaseLayout>

<script>
  // Bundled by Astro/Vite so the dynamic import() resolves cleanly to a
  // code-split chunk. SearchModal already loads PagefindUI via the same
  // chunk when the user opens the modal — visiting /search/ separately
  // hydrates its own container the same way.
  if (!(window as any).__dtfcFullSearchInit) {
    (window as any).__dtfcFullSearchInit = true;

    const attach = async () => {
      const container = document.getElementById('dtfc-search-page');
      if (!container) return;
      try {
        const { PagefindUI } = await import('@pagefind/default-ui');
        new PagefindUI({
          element: '#dtfc-search-page',
          showSubResults: true,
          pageSize: 20,
        });
      } catch {
        container.innerHTML =
          '<p class="text-ink-500 text-sm">Search index not available. Try again after the next deploy.</p>';
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attach);
    } else {
      attach();
    }
  }
</script>
```

- [ ] **Step 2: Extend `tests/e2e/smoke.spec.ts` with Pagefind smoke**

Insert the following block immediately BEFORE the console-error listener setup near the end of the single test:

```typescript
  // Search — verify Pagefind bundle loads and returns results
  // Note: requires `pnpm build` to have produced dist/pagefind/ before this
  // test runs. Playwright starts its own server via `pnpm preview` per
  // playwright.config, so the bundle is present.
  await page.goto('/search/');
  await expect(page.getByRole('heading', { level: 1, name: /^Search DT:FC$/i })).toBeVisible();

  // Wait for PagefindUI to hydrate — it renders an input inside #dtfc-search-page
  const searchInput = page.locator('#dtfc-search-page input[type="text"]').first();
  await expect(searchInput).toBeVisible({ timeout: 10000 });
  await searchInput.fill('shakespeare');

  // Results should populate within a few hundred ms of typing
  const firstResult = page.locator('#dtfc-search-page .pagefind-ui__result-link').first();
  await expect(firstResult).toBeVisible({ timeout: 5000 });
```

**Notes:**
- If the CSS selector `.pagefind-ui__result-link` proves brittle across `@pagefind/default-ui` versions, fall back to a text-based assertion (e.g., `await expect(page.locator('#dtfc-search-page').getByRole('link').first()).toBeVisible()`).
- Playwright's test harness runs `pnpm preview` per `playwright.config.ts` (verify by opening that file). If it currently runs `pnpm dev` instead, that's a defect — dev mode doesn't have the Pagefind index. If so, update the config to use `pnpm preview` for the e2e test.

- [ ] **Step 3: Verify Playwright config uses `preview` for e2e**

```bash
grep -n 'command\|webServer' playwright.config.ts
```

If the `webServer.command` is `pnpm dev`, change it to `pnpm build && pnpm preview` (build first so the Pagefind index exists, then preview serves `dist/`). This is a small config change; commit it alongside the smoke test change.

- [ ] **Step 4: Run `pnpm test:e2e`**

```bash
pnpm test:e2e
```

Expected: 1 test passes (existing assertions + the new Pagefind smoke).

**Common failures:**
- `dist/pagefind/` missing → run `pnpm build` first (Playwright config should handle this).
- `.pagefind-ui__result-link` selector missing → the default UI class names shifted. Adapt the selector (inspect the built HTML from a manual `pnpm preview` session).

- [ ] **Step 5: Commit**

```bash
git add src/pages/search.astro tests/e2e/smoke.spec.ts playwright.config.ts
git commit -m "$(cat <<'EOF'
feat(search): add /search/ page + Pagefind smoke assertion

Full-page /search/ mirrors the modal's PagefindUI but with a larger
result panel (pageSize: 20 vs modal's 10). Kbd hint reminds users
about ⌘K for the modal shortcut. data-pagefind-ignore on the search
container keeps this page out of its own index.

Playwright smoke test extends to visit /search/, type "shakespeare",
and assert at least one result renders. If playwright.config.ts was
using pnpm dev, swap to pnpm build && pnpm preview so the Pagefind
index exists at test time.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Vercel Analytics + Speed Insights

**Files:**
- Modify: `package.json` — add `@vercel/analytics` + `@vercel/speed-insights` as regular deps.
- Modify: `src/layouts/BaseLayout.astro` — conditionally render `<Analytics />` + `<SpeedInsights />` inside `<body>`, guarded by env.

**Interfaces produced:**
- When `PUBLIC_VERCEL_ANALYTICS_ENABLED === 'true'`, every page emits the Vercel Analytics + Speed Insights scripts. When unset/false (default in `.env.example`), no scripts render — local dev + CI stay quiet.

- [ ] **Step 1: Install dependencies**

```bash
pnpm add @vercel/analytics @vercel/speed-insights
```

Verify:

```bash
grep -E '"@vercel/analytics"|"@vercel/speed-insights"' package.json
```

Expected: both entries present in `dependencies`.

- [ ] **Step 2: Modify `src/layouts/BaseLayout.astro`**

Import the two Astro components and conditionally render them inside `<body>` right before `</body>`. The rest of BaseLayout stays as-is from Task 2.

Add these to the frontmatter imports (top of the file):

```astro
import Analytics from '@vercel/analytics/astro';
import SpeedInsights from '@vercel/speed-insights/astro';

const analyticsEnabled = import.meta.env.PUBLIC_VERCEL_ANALYTICS_ENABLED === 'true';
```

Add these inside `<body>` immediately before `<Footer />`:

```astro
    {analyticsEnabled && <Analytics />}
    {analyticsEnabled && <SpeedInsights />}
```

(Placement: between `<main>...</main>` and `<Footer />` is fine; between `<Footer />` and `</body>` is also fine. Either preserves head/body semantics.)

- [ ] **Step 3: Verify `pnpm check` + `pnpm build`**

```bash
pnpm check
pnpm build
```

Expected: 0 errors; build succeeds.

- [ ] **Step 4: Verify analytics scripts do NOT render with env unset**

```bash
grep -c 'vercel' dist/index.html
```

Expected: 0 (no Vercel scripts in built HTML because `PUBLIC_VERCEL_ANALYTICS_ENABLED` is unset in local `.env`).

Optionally verify the opposite by rebuilding with the env set:

```bash
PUBLIC_VERCEL_ANALYTICS_ENABLED=true pnpm build
grep -c 'vercel\|_vercel/insights' dist/index.html
```

Expected: at least 1 match. Reset by rebuilding without the env for the rest of your local session.

- [ ] **Step 5: Extend Playwright smoke test with an analytics-off assertion**

Add this to the existing e2e test, in the same block that visits `/`:

```typescript
  // Analytics gate — with PUBLIC_VERCEL_ANALYTICS_ENABLED unset in test env,
  // Vercel scripts must NOT be present. Ensures the env gate works.
  const analyticsScripts = await page.locator('script[src*="_vercel/insights"]').count();
  expect(analyticsScripts).toBe(0);
```

Run:

```bash
pnpm test:e2e
```

Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml src/layouts/BaseLayout.astro tests/e2e/smoke.spec.ts
git commit -m "$(cat <<'EOF'
feat(analytics): integrate Vercel Analytics + Speed Insights (env-gated)

Two Vercel packages render <Analytics /> + <SpeedInsights /> from
BaseLayout inside <body>, guarded by
import.meta.env.PUBLIC_VERCEL_ANALYTICS_ENABLED === 'true'. Default is
false (per .env.example from T1) so local dev + CI stay quiet.
Vercel production env sets to true in the dashboard.

Both packages are cookieless / anonymous / aggregate — no consent
banner required. Meets source spec §5 "privacy-respecting analytics"
requirement.

Smoke test asserts scripts are absent when env is unset (default CI
state); a rebuild with the env set confirms scripts DO render.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Refactor 4 form components + Donate CTA to use `SITE_CONFIG.fallbackContactEmail`

**Files:**
- Modify: `src/components/ui/NewsletterSignup.astro`
- Modify: `src/components/landing/NewsletterTile.astro`
- Modify: `src/components/shakespeare/AskShakespeareForm.astro`
- Modify: `src/components/community/TestimonialForm.astro`
- Modify: `src/pages/community/donate.astro`

**Interfaces consumed:**
- `SITE_CONFIG.fallbackContactEmail` from `@/lib/site-config` (Task 1).

**Interfaces produced:**
- After this task, the string `hello@dtfc.example` appears in `src/` only in `src/lib/site-config.ts`. All references route through the const.

- [ ] **Step 1: Audit current references**

```bash
grep -rn 'hello@dtfc.example' src/ | grep -v site-config.ts
```

Expected: 7-8 hits across the 5 files above (each of the form components has 2-3 fallback + error-message references; donate.astro has 1 CTA).

- [ ] **Step 2: Modify each of the 5 files**

For each file:

1. Add to the frontmatter imports:

```astro
import { SITE_CONFIG } from '@/lib/site-config';
```

2. Replace every literal `hello@dtfc.example` in the frontmatter, JSX attributes, and script strings with `{SITE_CONFIG.fallbackContactEmail}` (in JSX) or `${SITE_CONFIG.fallbackContactEmail}` inside template literals.

3. For `<script is:inline>` blocks that contain the literal in a string (e.g., the error-message insertAdjacentHTML): the script CANNOT reference `SITE_CONFIG` (it runs client-side after the module has been erased). Instead, pass the value into the script via a `data-` attribute on the form:

```astro
<form
  data-testimonial-form
  data-fallback-email={SITE_CONFIG.fallbackContactEmail}
  ...
>
```

Then in the inline script, read `form.dataset.fallbackEmail` when composing the error HTML.

**Concrete example for NewsletterSignup.astro** — the script's error handlers currently contain:

```javascript
'<p role="alert" ...>Something went wrong. Please email us at <a href="mailto:hello@dtfc.example" class="underline">hello@dtfc.example</a>.</p>'
```

Refactor to:

```javascript
// Inside the submit handler, after form is defined:
const email = form.dataset.fallbackEmail ?? '';
// ...
form.insertAdjacentHTML(
  'afterend',
  `<p role="alert" class="mt-2 text-sm text-clay-700">Something went wrong. Please email us at <a href="mailto:${email}" class="underline">${email}</a>.</p>`,
);
```

Add `data-fallback-email={SITE_CONFIG.fallbackContactEmail}` to the `<form>` element in the real-form branch of the conditional render.

Do the same for both the newsletter forms (they share a script — the script queries all `[data-newsletter-form]` and reads each form's dataset), the Ask Shakespeare form, and the Testimonial form.

The Donate CTA is simpler — just replace the `mailto:hello@dtfc.example` href with `mailto:{SITE_CONFIG.fallbackContactEmail}` in the JSX.

- [ ] **Step 3: Verify no literal references remain outside site-config.ts**

```bash
grep -rn 'hello@dtfc.example' src/
```

Expected: exactly 1 hit — `src/lib/site-config.ts:2` (or wherever the const literal lives).

- [ ] **Step 4: Verify `pnpm check` + `pnpm build` + `pnpm test:e2e`**

```bash
pnpm check
pnpm build
pnpm test:e2e
```

Expected: `pnpm check` 0 errors; `pnpm build` clean; e2e still 1/1 (the T21 fallback assertion from Cycle 6 still passes because the fallback text still contains "not yet configured").

Confirm the fallback UI still shows the correct email address by running `pnpm dev` and visiting `/community/testimonials/` — the "please email us at hello@dtfc.example" text should render.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/NewsletterSignup.astro src/components/landing/NewsletterTile.astro src/components/shakespeare/AskShakespeareForm.astro src/components/community/TestimonialForm.astro src/pages/community/donate.astro
git commit -m "$(cat <<'EOF'
refactor(forms): route fallback email through SITE_CONFIG

Cycle 6 landed hello@dtfc.example as a hardcoded placeholder in 5
places (4 form components + Donate CTA). This cycle centralizes the
value to SITE_CONFIG.fallbackContactEmail so Cycle 8's real-email
swap becomes a one-line edit to src/lib/site-config.ts.

Inline scripts can't reference the import (module erased at runtime),
so the value flows through data-fallback-email on the <form> element;
the script reads form.dataset.fallbackEmail when composing error
messages.

grep after: hello@dtfc.example appears in src/ only at
src/lib/site-config.ts.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Fix — `ConceptLayout` related chips render display names

**Files:**
- Modify: `src/components/concept/ConceptLayout.astro`

**Context:** Cycle 1 followup — related-concept chips currently render raw kebab-case slugs (`fearless-creativity`) instead of the concept's display name (`Fearless Creativity`). Visible on 10 concept detail pages.

**Fix approach:** the concept collection has `title` in each entry's frontmatter. `ConceptLayout` needs to look up the title for each slug in the `related` array and render that title in the chip.

- [ ] **Step 1: Read the current `ConceptLayout.astro` to understand its structure**

```bash
cat src/components/concept/ConceptLayout.astro
```

Locate the block that renders the related-concept chips (likely `related.map((slug) => ...)`). Note how it currently renders — probably `<a href="/theatre-games/concepts/{slug}/">{slug}</a>` or similar.

- [ ] **Step 2: Modify `ConceptLayout.astro`**

Frontmatter — build a slug-to-title map at render time by fetching the concepts collection:

```astro
---
import { getCollection } from 'astro:content';

// ...existing imports + Props...

// Build a slug-to-title map for related-chip labels
const allConcepts = await getCollection('concepts');
const conceptTitles = new Map(allConcepts.map((c) => [c.id.replace(/\.mdx?$/, ''), c.data.title]));
---
```

In the related chips render block, replace the raw-slug rendering with a title lookup:

```astro
{related.map((slug) => (
  <a
    href={`/theatre-games/concepts/${slug}/`}
    class="border-ivory-200 text-ink-700 hover:border-clay-500 rounded-[var(--radius-chip)] border px-3 py-1 text-xs font-medium no-underline"
  >
    {conceptTitles.get(slug) ?? slug}
  </a>
))}
```

The `?? slug` fallback prevents render breakage if a `related:` entry references a non-existent slug — the pre-existing `scripts/check-concept-refs.mjs` guardrail should catch that at build time, but the fallback is defensive.

**Note on the actual render location** — the current ConceptLayout code may render chips differently (perhaps in a `<Popover>` or inline). Adapt the pattern to whatever the file actually does: the change is always "wherever raw slug is rendered, look it up in the map and render title instead."

- [ ] **Step 3: Verify `pnpm check` + `pnpm build`**

```bash
pnpm check
pnpm build
```

Expected: 0 errors; build succeeds.

- [ ] **Step 4: Manual spot-check**

```bash
pnpm preview
```

Open http://localhost:4321/theatre-games/concepts/archetype/ (or any concept with `related:` populated). The chips at the bottom should now show "Fearless Creativity" rather than "fearless-creativity".

- [ ] **Step 5: Commit**

```bash
git add src/components/concept/ConceptLayout.astro
git commit -m "$(cat <<'EOF'
fix(concepts): render display titles for related-concept chips

Cycle 1 followup: ConceptLayout was rendering related-concept slugs
as raw kebab-case ("fearless-creativity") instead of the concept's
display title from its frontmatter ("Fearless Creativity"). Visible
on 10 concept detail pages.

Fix: fetch the concepts collection at layout render time, build a
slug→title map, look up each `related:` entry's title before
rendering the chip. Falls back to the raw slug if the map lookup
misses (defensive; check-concept-refs.mjs should catch broken refs
at build time anyway).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Fix — duplicate `<h1>` on detail templates

**Files:**
- Modify: `src/components/scripts/ScriptDetail.astro`
- Modify: `src/components/legacy/EssayDetail.astro`
- Modify: `src/components/community/NewsletterDetail.astro`
- Modify: `src/pages/shakespeare/ask-shakespeare/[slug].astro` (verify + fix if pattern matches)

**Context:** Cycle 5 opus review flagged duplicate `<h1>` on essay detail pages — the page-level `SectionLayout` (via `BaseLayout`) doesn't render its `title` prop as an `<h1>`, so where does the layout's h1 come from? Let me check the current pattern.

**Approach:** ~~drop the h1 in the Detail component and let the layout render it~~ — the layout doesn't currently render an h1 either. Instead, the fix is: **verify each Detail template renders exactly one `<h1>`**, and if the wrapping page also renders an `<h1>` (via a SectionLayout template that includes one), drop the Detail's h1.

Investigation first, then fix.

- [ ] **Step 1: Read each of the 3+ detail templates to identify h1 count**

```bash
grep -n '<h1' src/components/scripts/ScriptDetail.astro src/components/legacy/EssayDetail.astro src/components/community/NewsletterDetail.astro
grep -n '<h1' src/pages/shakespeare/ask-shakespeare/*.astro
```

For each detail template, also check the page that uses it:

```bash
grep -rn 'ScriptDetail\|EssayDetail\|NewsletterDetail' src/pages/
```

For each detail-render page, check whether the wrapping layout (SectionLayout / ShakespeareLayout / LegacyLayout / CommunityLayout / ChildrensLayout) renders its own `<h1>` for the `title` prop.

```bash
grep -n '<h1' src/layouts/*.astro
```

- [ ] **Step 2: Determine the intended fix**

Common outcomes (based on Cycle 5 finding):

- **If** the section layout renders `<h1>{title}</h1>` (SectionLayout's title behavior), **then** the Detail component's `<h1>` is the duplicate. Drop the Detail component's `<h1>`.
- **If** the section layout does NOT render an `<h1>`, **then** the Detail component's `<h1>` is the only h1, and there is no duplicate. This task becomes a no-op for that Detail — mark it verified.

Apply the appropriate fix per component:
- **Drop-the-h1 case:** remove the `<h1>` element (and any adjacent title-rendering markup) from the Detail component. The layout renders the title instead.
- **No-op case:** leave the file untouched. Document in the report.

Do NOT change any Detail's h1 unless there's a genuine duplicate. Cycle 5's opus review is specific; check each file rather than blindly editing all four.

- [ ] **Step 3: Verify with a built page**

For each modified Detail:

```bash
pnpm build
# example — pick one essay detail path
grep -c '<h1' dist/legacy/essays/towards-a-poor-caravan/index.html
```

Expected: 1 (exactly one h1 per page).

For any unchanged Detail (no-op case), verify it too still shows exactly 1 h1.

- [ ] **Step 4: Verify `pnpm check` + `pnpm build`**

```bash
pnpm check
pnpm build
```

Expected: 0 errors; build clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/scripts/ScriptDetail.astro src/components/legacy/EssayDetail.astro src/components/community/NewsletterDetail.astro src/pages/shakespeare/ask-shakespeare/
git commit -m "$(cat <<'EOF'
fix(a11y): resolve duplicate <h1> on detail templates

Cycle 5 opus review flagged duplicate h1s on essay/script detail
pages. Investigation across ScriptDetail, EssayDetail,
NewsletterDetail, and the ask-shakespeare column detail page:
<summarize which files had duplicates and which were no-ops>.

Fix: <drop-h1 from Detail components where the wrapping layout
already renders <h1>{title}; leave Detail alone where it's the sole
h1>. Verified via grep on built HTML — every detail page emits
exactly one <h1>.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

**Note:** the `<summarize which files ...>` and `<drop-h1 from...>` placeholders in the commit message are the ONLY placeholders in this plan — they represent per-file investigation outcomes. Replace with concrete findings before committing.

---

## Task 11: Fix — `TimelineLegend` focus ring + `motion-reduce` + `1970's` copy consistency

**Files:**
- Modify: `src/components/legacy/TimelineLegend.astro`
- Modify: `src/pages/legacy/honoring-our-guides.astro`

**Context:** Cycle 5 opus review + Cycle 6 followups.

**Fixes:**
1. Timeline chip buttons have `aria-pressed` state but no visible focus-visible ring — keyboard users can't see focus when tabbing through chips.
2. Timeline hover transitions don't respect `prefers-reduced-motion` — users with reduced-motion settings still see transitions.
3. `honoring-our-guides.astro` uses `1970&rsquo;s` (possessive form) while `founders.astro`, `about.astro`, etc. use `1970s` (plural). Standardize to `1970s`.

- [ ] **Step 1: Modify `src/components/legacy/TimelineLegend.astro`**

Read the current file first:

```bash
grep -n 'button\|transition\|focus\|motion-reduce' src/components/legacy/TimelineLegend.astro
```

For every chip `<button>` (both the "All" chip and each org chip), add `focus-visible:ring-2 focus-visible:ring-clay-500 focus-visible:ring-offset-2` to the className string. This matches the site-wide `focus-visible:` convention used on the primary CTA buttons in Cycle 6.

For any `transition` class on the chip button (`transition`, `transition-colors`), pair it with `motion-reduce:transition-none` so users with reduced-motion see no transition.

- [ ] **Step 2: Modify `src/pages/legacy/honoring-our-guides.astro`**

```bash
grep -n "1970" src/pages/legacy/honoring-our-guides.astro
```

Find the `1970&rsquo;s` occurrence. Change to `1970s`.

- [ ] **Step 3: Verify `pnpm check` + `pnpm build`**

```bash
pnpm check
pnpm build
```

Expected: 0 errors; build clean.

- [ ] **Step 4: Manual spot-check**

```bash
pnpm dev
```

Visit http://localhost:4321/legacy/timeline/. Tab through the chip filter — every chip should show a visible focus ring on keyboard focus. Then check `honoring-our-guides` for the copy fix:

```bash
grep -n "1970" src/pages/legacy/honoring-our-guides.astro
```

Expected: matches show `1970s` (not `1970&rsquo;s`).

- [ ] **Step 5: Commit**

```bash
git add src/components/legacy/TimelineLegend.astro src/pages/legacy/honoring-our-guides.astro
git commit -m "$(cat <<'EOF'
fix(a11y): TimelineLegend focus ring + reduced-motion + copy consistency

Cycle 5 + Cycle 6 followups:

- TimelineLegend chip buttons had aria-pressed state but no visible
  focus-visible ring. Keyboard users tabbing through the filter
  couldn't see which chip was focused. Adds focus-visible:ring-2
  focus-visible:ring-clay-500 focus-visible:ring-offset-2 matching
  the site-wide button pattern.
- Chip hover transitions get motion-reduce:transition-none so users
  with prefers-reduced-motion see no animation.
- honoring-our-guides.astro used "1970's" (possessive) while other
  Legacy pages use "1970s" (plural). Standardized to "1970s".

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Apostrophe cleanup — flip 25 whitelisted files + shrink `CURLY_APOSTROPHE_ALLOWLIST`

**Files:**
- Modify: 25 files currently in `scripts/check-prohibited-text.mjs`'s `CURLY_APOSTROPHE_ALLOWLIST` (the 28-entry list minus the 3 Cycle 3 Shakespeare verse files).
- Modify: `scripts/check-prohibited-text.mjs` — shrink allowlist to 3 entries.

**Context:** Cycle 5 T1 whitelisted 28 shipped Cycle 1-4 files carrying 60 straight-apostrophe defects (deferred cleanup). Cycle 6 removed 3 files rewritten in Cycle 6. Post-Cycle-6, the allowlist has 25 shipped-debt entries + 3 Shakespeare verse entries = 28 total. Cycle 7 flips the 25 shipped-debt files.

- [ ] **Step 1: List the current allowlist**

```bash
node -e "import('./scripts/check-prohibited-text.mjs').then(m => console.log(m.CURLY_APOSTROPHE_ALLOWLIST.join('\n')))"
```

Expected: 28 entries. Confirm the 3 Shakespeare verse files (`juliet-*`, `lady-macbeth-*`, `mechanicals-*`) are among them.

- [ ] **Step 2: For each of the 25 non-Shakespeare files, flip U+0027 → U+2019 in prose contexts**

For each file `<path>` in the allowlist (excluding the 3 Shakespeare verse):

1. Read the file.
2. Identify each straight apostrophe in prose (grep `[a-zA-Z0-9]'[a-zA-Z0-9]` — the guardrail's own regex).
3. Replace each with U+2019 (for MDX/HTML: prefer `&rsquo;` in body text and U+2019 in JS strings / astro attribute values / frontmatter).
4. Save.

**Automation script** — most of these are mechanical. A one-liner can convert them safely for files where every match is in prose (no JS string containing `it's` etc. that would need to remain straight):

```bash
node -e "
import('./scripts/check-prohibited-text.mjs').then(async (m) => {
  const { readFileSync, writeFileSync } = await import('node:fs');
  const shakespeareVerse = m.CURLY_APOSTROPHE_ALLOWLIST.filter((p) => p.includes('/scripts/'));
  const targets = m.CURLY_APOSTROPHE_ALLOWLIST.filter((p) => !shakespeareVerse.includes(p));
  for (const path of targets) {
    let src = readFileSync(path, 'utf8');
    // Flip only straight apostrophes surrounded by word chars (the guardrail's rule).
    const replaced = src.replace(/(?<=\w)'(?=\w)/g, '’');
    if (replaced !== src) {
      writeFileSync(path, replaced);
      console.log('flipped', path);
    }
  }
});
"
```

**IMPORTANT:** run the script, then MANUALLY inspect each modified file for false positives (JS string literals inside `<script>` tags where the apostrophe was intentional). Grep for any straight apostrophes that remain in JS contexts inside the modified files and confirm they belong there.

- [ ] **Step 3: Shrink `CURLY_APOSTROPHE_ALLOWLIST` in `scripts/check-prohibited-text.mjs`**

Edit the file. Replace the current 28-entry list with just the 3 Shakespeare verse files:

```javascript
export const CURLY_APOSTROPHE_ALLOWLIST = [
  // Cycle 3 Shakespeare verse files intentionally use straight apostrophes
  // for Elizabethan contractions ('tis, 'twere, Environ'd, perfect'st).
  // Do not add other files to this list without controller review.
  'src/content/scripts/juliet-romeo-and-juliet-act-iv-scene-iii.mdx',
  'src/content/scripts/lady-macbeth-macbeth-act-i-scene-v.mdx',
  'src/content/scripts/mechanicals-scenes-a-midsummer-nights-dream.mdx',
];
```

- [ ] **Step 4: Verify the guardrail is clean**

```bash
node scripts/check-prohibited-text.mjs
```

Expected: `✓ Checked N file(s) for prohibited text; all clean.`

**If any file shows straight-apostrophe hits after Step 2:** the script script missed a false-negative case or a file has a mix of prose and JS-string apostrophes that need manual handling. Inspect the offending files by hand and fix.

- [ ] **Step 5: Verify `pnpm check` + `pnpm build` + `pnpm test`**

```bash
pnpm check
pnpm build
pnpm test
```

Expected: `pnpm check` 0 errors; `pnpm build` succeeds with both guardrails green; all Vitest suites pass.

- [ ] **Step 6: Commit**

```bash
git add scripts/check-prohibited-text.mjs $(node -e "import('./scripts/check-prohibited-text.mjs').then(m => console.log(m.CURLY_APOSTROPHE_ALLOWLIST.slice(3).join(' ')))")
# ...but the above lists post-shrink entries which is empty. Instead:
git add scripts/check-prohibited-text.mjs src/
git status --short
```

Confirm only the 25 files-flipped + `scripts/check-prohibited-text.mjs` are staged. Then:

```bash
git commit -m "$(cat <<'EOF'
chore(a11y): flip 25 shipped-content files from U+0027 → U+2019

Cycle 5 T1 whitelisted 28 shipped Cycle 1-4 files with 60 straight-
apostrophe defects (deferred cleanup). Cycle 6 removed 3 files
rewritten during that cycle. This task flips the remaining 25:

<Files flipped, with per-file replacement counts if handy>

CURLY_APOSTROPHE_ALLOWLIST shrinks from 28 → 3 (Shakespeare verse
files only). Future prose apostrophes fail pnpm build unless the
file is in that 3-entry list.

Verified: `node scripts/check-prohibited-text.mjs` reports clean;
pnpm check 0 errors; pnpm build clean; all Vitest suites pass.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Replace `<Files flipped, ...>` with a concise list of the 25 file paths (or a summary like "8 concept MDX + 5 game MDX + 12 page/component .astro files").

---

## Task 13: axe-core Playwright integration + baseline scan

**Files:**
- Modify: `package.json` — add `@axe-core/playwright` + `axe-core` devDeps.
- Modify: `tests/e2e/smoke.spec.ts` — import AxeBuilder, add `runAxe` helper, invoke after each key page-navigation block.

**Interfaces produced:**
- Helper `runAxe(page, name)` runs `AxeBuilder(page).analyze()` and asserts 0 `critical` or `serious` violations. `moderate` / `minor` are logged via `console.info` and do not fail.
- Baseline coverage: 11+ pages exercised by the smoke test.

**Consumes:**
- Fixes from Tasks 9-11 that clean up the known Cycle 1-6 accessibility issues.
- Pagefind smoke setup from Task 6 (Playwright config already builds before running).

- [ ] **Step 1: Install dependencies**

```bash
pnpm add -D @axe-core/playwright axe-core
```

Verify:

```bash
grep -E '"@axe-core/playwright"|"axe-core"' package.json
```

Expected: both in devDependencies.

- [ ] **Step 2: Add the axe helper + assertions to the existing smoke test**

Import `AxeBuilder` at the top of `tests/e2e/smoke.spec.ts`:

```typescript
import AxeBuilder from '@axe-core/playwright';
```

Add this helper just below the `import`s (inside the file's module scope, before the `test(...)` block):

```typescript
async function runAxe(page: import('@playwright/test').Page, testName: string) {
  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter((v) => v.impact === 'critical');
  const serious = results.violations.filter((v) => v.impact === 'serious');
  const moderate = results.violations.filter((v) => v.impact === 'moderate');
  const minor = results.violations.filter((v) => v.impact === 'minor');

  if (moderate.length > 0 || minor.length > 0) {
    console.info(
      `[axe] ${testName}: ${moderate.length} moderate, ${minor.length} minor — deferred as follow-ups`,
    );
    for (const v of [...moderate, ...minor]) {
      console.info(`  ${v.impact}: ${v.id} — ${v.help}`);
    }
  }

  if (critical.length > 0 || serious.length > 0) {
    const summary = [...critical, ...serious]
      .map((v) => `  ${v.impact}: ${v.id} — ${v.help} (${v.nodes.length} node(s))`)
      .join('\n');
    throw new Error(
      `[axe] ${testName}: ${critical.length} critical + ${serious.length} serious violations:\n${summary}`,
    );
  }
}
```

Then, at ~11 checkpoints in the existing test flow, add `await runAxe(page, '<label>');` calls. Insert them after each page-navigation block. Target list:

```typescript
// After landing page assertions:
await runAxe(page, 'home landing');

// After /resource-center:
await runAxe(page, 'resource center');

// After /theatre-games:
await runAxe(page, 'theatre-games landing');

// After /theatre-games/finder (Preact island):
await runAxe(page, 'game finder');

// After /theatre-games/puppets-marionettes (game detail):
await runAxe(page, 'game detail');

// After /shakespeare + one script detail:
await runAxe(page, 'shakespeare landing');

// After /childrens-theatre + Wayfarer wheel:
await runAxe(page, 'childrens-theatre + wayfarer wheel');

// After /legacy/timeline (chip filter island):
await runAxe(page, 'legacy timeline');

// After /community:
await runAxe(page, 'community landing');

// After /community/testimonials (form fallback):
await runAxe(page, 'community testimonials form');

// After /community/newsletters:
await runAxe(page, 'community newsletters index');
```

Adapt the exact checkpoint list to match the current smoke test structure — the key point is ~11 checkpoints covering every route pattern + island + form + SVG-heavy how-to guide.

- [ ] **Step 3: Run `pnpm test:e2e`**

```bash
pnpm test:e2e
```

Expected outcome:
- **If the run passes:** Tasks 9-11 fixes brought the site into WCAG AA compliance for critical/serious. Any moderate/minor violations get logged.
- **If the run fails on critical/serious:** the axe report names the pages + rule IDs. Fix each. Common issues you may hit:
  - `color-contrast` — a token combination doesn't meet 4.5:1 ratio. Fix in `src/styles/tokens.css` or replace the class on the affected element.
  - `label` — an input missing a label. Fix in the form component.
  - `document-title` — verify BaseLayout title still emits.
  - `link-name` — icon-only links missing aria-label (search button?). Verify the search icon has aria-label="Search" (from Task 5).

If any critical/serious violation is FOUND, add a targeted fix commit BEFORE the axe-integration commit — the goal is a green baseline. Don't ship a red baseline.

- [ ] **Step 4: Verify `pnpm check` + `pnpm build`**

```bash
pnpm check
pnpm build
```

Expected: 0 errors; build clean.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml tests/e2e/smoke.spec.ts
git commit -m "$(cat <<'EOF'
test(a11y): integrate axe-core in Playwright smoke test

New runAxe(page, name) helper wraps @axe-core/playwright's
AxeBuilder(page).analyze(). Fails the test on any critical or serious
violation. Moderate/minor violations get logged via console.info and
triaged as follow-ups (no test failure).

Called at 11 checkpoints across the existing single smoke test:
landing, resource center, theatre-games landing, game finder island,
game detail, Shakespeare landing, Children's Theatre + Wayfarer
wheel SVG, Legacy timeline chip filter, Community landing,
testimonials form fallback, newsletters index.

Post-T9-T11 known-defect fixes, baseline is clean. Any future
regression fails the smoke test in CI.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: `docs/launch-checklist.md` — pre-flight ops document

**Files:**
- Create: `docs/launch-checklist.md`

**Context:** Not a spec, not a plan — a working ops document a human walks through at launch time. Contains no code.

- [ ] **Step 1: Create `docs/launch-checklist.md`**

```markdown
# DT:FC Launch Checklist

Pre-flight ops document. Walk through each section top-to-bottom before flipping the site to production. Every item is pass/fail — no code, just verification.

**Owner:** solo dev (Cameron).
**Assumes:** Cycle 7 (launch-prep) has shipped and merged to main. Cycle 8 (flip-the-chips) is what this checklist unblocks.

---

## Content (client-dependent)

- [ ] Real support email decided. Update `SITE_CONFIG.fallbackContactEmail` in `src/lib/site-config.ts`.
- [ ] Real production domain decided (e.g. `https://dtfc.org`). Update `SITE_CONFIG.canonicalHost` and `public/robots.txt` sitemap URL.
- [ ] Real Zeffy donation URL provided. Swap the mailto: CTA in `src/pages/community/donate.astro` to the Zeffy link. Remove the "coming soon" chip.
- [ ] Ask Shakespeare destination email configured — either populate the Formspree endpoint's dashboard destination OR (if migrating off Formspree) swap the form action URL. Remove the CLIENT REVIEW comment from `src/components/shakespeare/AskShakespeareForm.astro`.
- [ ] Membership tiers + pricing content finalized. Expand `src/pages/community/membership.astro` with real tier content. Remove the pre-release chip.
- [ ] Testimonials moderation policy decided (dev-committed data file vs CMS backend). If staying dev-committed, no action needed — new testimonials arrive via commits.
- [ ] Desirae's real favicon delivered. Replace `public/favicon.*` files. Verify `<link rel="icon">` renders correctly.
- [ ] Desirae's real OG image delivered. Replace `public/og-default.png` with a real 1200×630 PNG. Verify `<meta property="og:image">` resolves to a live URL.
- [ ] Desirae's real DT:FC logo delivered. Replace `public/DTFC-logo.png` (currently a placeholder used in the header + OG).

## Envelope (Vercel production dashboard)

- [ ] `PUBLIC_FORMSPREE_NEWSLETTER_ID` set to the real Formspree endpoint ID.
- [ ] `PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID` set.
- [ ] `PUBLIC_FORMSPREE_TESTIMONIAL_ID` set.
- [ ] `PUBLIC_VERCEL_ANALYTICS_ENABLED` set to `true`.
- [ ] `PUBLIC_SITE_URL` set to the real production domain.

## SEO + meta

- [ ] Sitemap builds and reaches `<production-url>/sitemap-index.xml` (Vercel deploy → curl the URL).
- [ ] robots.txt allows all + references the sitemap URL. `curl <production-url>/robots.txt` — verify content.
- [ ] OG image is live: `curl -I <og-image-url>` returns 200 with `image/png` content-type.
- [ ] Canonical URL emits on every page. Spot-check a few: `curl <production-url>/legacy/ | grep canonical`.
- [ ] Favicon renders in the browser tab.
- [ ] `<title>` renders correctly on every route.
- [ ] Twitter Card preview looks right: paste a page URL into https://cards-dev.twitter.com/validator.
- [ ] Facebook / OG preview looks right: paste into https://developers.facebook.com/tools/debug.

## Forms (all 4 site forms POST successfully)

- [ ] Footer newsletter signup: submit a test email from production, verify it lands in the Formspree dashboard or configured destination.
- [ ] Landing newsletter tile: same test.
- [ ] Membership interest form (`/community/membership/`): submit, verify.
- [ ] Ask Shakespeare (`/shakespeare/ask-shakespeare/`): submit, verify.
- [ ] Testimonial form (`/community/testimonials/`): submit, verify.
- [ ] Donate CTA mailto: opens the mail client with the correct address populated.

## Accessibility

- [ ] `pnpm test:e2e` passes in CI (axe reports 0 critical/serious across 11+ pages).
- [ ] Manual keyboard-only pass through primary flows:
  - [ ] Tab through the header nav; verify focus visible on every element.
  - [ ] Tab into the search icon; press Enter; type; press Escape to close.
  - [ ] Tab into the Game Finder chip filter; toggle chips with keyboard.
  - [ ] Tab through the Timeline chip filter; toggle chips.
  - [ ] Submit each form with keyboard only.
- [ ] Screen reader spot-check (VoiceOver / NVDA):
  - [ ] Landing page announces the h1 + main sections.
  - [ ] Search modal announces its role + label on open.
  - [ ] Form success/error messages announce (they have role="status"/role="alert").
- [ ] Reduced-motion setting respected: enable OS reduced-motion, verify Timeline chip hover has no transition.

## Analytics

- [ ] First production visit lands a pageview in Vercel Analytics dashboard within 60 seconds.
- [ ] Speed Insights dashboard receives Core Web Vitals (LCP, INP, CLS) after a few pageviews.
- [ ] Client-privacy audit: verify no cookies set by Analytics/SpeedInsights (open DevTools → Application → Cookies on a production page; expect none from Vercel).

## Search

- [ ] Vercel build log shows Pagefind step ran and indexed N pages.
- [ ] `<production-url>/pagefind/pagefind.js` returns 200 (the client bundle is on the CDN).
- [ ] Header search icon opens the modal.
- [ ] ⌘K opens the modal from any page.
- [ ] Typing "shakespeare" returns at least one result.
- [ ] `<production-url>/search/` renders the full-page search interface.
- [ ] Clicking a result navigates to the correct page (spot-check 2-3).

## Domain + TLS

- [ ] DNS A/AAAA/CNAME records point at Vercel's IPs / CNAME target.
- [ ] HTTPS enforced — HTTP request to the domain 301s to HTTPS.
- [ ] TLS certificate valid (browser shows padlock; not expiring soon).
- [ ] No mixed content warnings in the DevTools console on any tested page.
- [ ] `www` subdomain redirect configured (or vice versa — pick a canonical host).
- [ ] Any legacy redirect map (if the client had a previous site) configured.

## Content QA

- [ ] Zero straight apostrophes in shipped content (`node scripts/check-prohibited-text.mjs` returns clean).
- [ ] Zero prohibited phrases (`Great Change`, `traditional work and ways`, `Childrens' Theatre`, etc. — same script).
- [ ] All CLIENT REVIEW comments in `src/` have been addressed by Lola/Laurie (grep `CLIENT REVIEW` across `src/`; each match should be triaged: keep with a note or resolve).
- [ ] No `TODO(esp)` markers remaining (grep `TODO(esp)` — should be 0 hits after Cycle 6).
- [ ] Broken-link scan: run `npx broken-link-checker <production-url> -ro` or similar against production; fix any broken internal links.

## Monitoring (recommended, not required)

- [ ] Uptime monitor configured (Vercel deploy notifications; optionally UptimeRobot / BetterUptime).
- [ ] Form-submission alerts configured (Formspree dashboard notifications OR ESP list-growth notifications).

## Sign-off

- [ ] Cameron: pre-launch tests passed on `<date>`.
- [ ] Lola / Laurie: content review passed on `<date>`.
- [ ] Client: given a preview URL for final sign-off before flipping DNS.

---

**Post-launch (Cycle 8 or ongoing):**
- Optional polish: seed 1 high-cohesion game in Theatre Games to eliminate the finder "High" empty state.
- Optional polish: fix `resilience.mdx` prose game references (Fire Tenders, Tignishes — games that don't exist).
- Optional polish: RSS feed for `/community/newsletters/` if client requests.
- Ongoing: as the client adds testimonials, commit them to `src/data/testimonials.ts` and deploy.
```

- [ ] **Step 2: Verify markdown renders correctly**

```bash
cat docs/launch-checklist.md | head -60
```

Sanity check that the file structure looks right. No test failures possible for a docs-only change.

- [ ] **Step 3: Verify `pnpm build` still succeeds (guardrails may scan docs/**)**

```bash
pnpm build
```

Expected: succeeds. If the prohibited-text guardrail scans `docs/` (it should not — Cycle 5 T1 explicitly excludes `docs/**`), this could fail. If so, verify `scripts/check-prohibited-text.mjs`'s `ignore` list includes `docs/**` and re-run.

- [ ] **Step 4: Commit**

```bash
git add docs/launch-checklist.md
git commit -m "$(cat <<'EOF'
docs: add launch-checklist.md pre-flight ops document

Not a spec, not a plan — a working ops document a human walks through
at launch time. Sections: Content (client-dependent), Envelope
(Vercel dashboard), SEO+meta, Forms (all 4), Accessibility, Analytics,
Search, Domain+TLS, Content QA, Monitoring, Sign-off.

Every item is pass/fail. No code. Serves as the Cycle 8 unblock list
+ ongoing pre-deploy discipline.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: `CLAUDE.md` + auto-memory + follow-ups

**Files:**
- Modify: `CLAUDE.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_followups.md`

- [ ] **Step 1: Update `CLAUDE.md`**

Under **Stack**, add:

```markdown
- **Search:** Pagefind (build-time static index generated by `pagefind --site dist` after `astro build`). Client-side UI is `@pagefind/default-ui`, loaded lazily from the header `SearchModal` + `/search/` page. Native `<dialog>` for modal; ⌘K / Ctrl+K keyboard shortcut.
- **Analytics:** Vercel Analytics + Speed Insights, cookieless. Env-gated via `PUBLIC_VERCEL_ANALYTICS_ENABLED` (default `false` locally; set `true` in Vercel production dashboard).
- **A11y CI:** `@axe-core/playwright` runs inside the smoke test at ~11 checkpoints. Fails on critical/serious violations; logs moderate/minor as info.
- **Cross-cutting config:** `src/lib/site-config.ts` exports `SITE_CONFIG` with `fallbackContactEmail`, `canonicalHost`, `ogDefaults`. All form components, Donate CTA, and BaseLayout meta emission route through it — Cycle 8 flip is 1-3 line edits.
```

Under **Key conventions**, add:

```markdown
**Search index scope.** Pagefind indexes everything in `dist/` by default. Suppress non-content regions from search results with `data-pagefind-ignore` on the element root (already applied to `SearchModal` dialog, `/search/` container, and any other UI-chrome region that shouldn&rsquo;t appear in results).

**OG meta + canonical URL.** `BaseLayout` accepts optional `ogImage?` and `canonical?` props with sensible defaults. Every page automatically emits `og:title`, `og:description`, `og:image` (absolute URL via `SITE_CONFIG.canonicalHost`), `og:url`, Twitter Card, and `<link rel=canonical>`. Section layouts pass through the defaults.

**Curly-apostrophe allowlist** in `scripts/check-prohibited-text.mjs` shrank to 3 files in Cycle 7 (Shakespeare verse only). Adding a new file to the allowlist requires controller review; the default is to fix the file&rsquo;s apostrophes instead.
```

Under **Commands**, no changes — `pnpm build` already includes the Pagefind step.

Under **Deferred / TODO markers**, add:

```markdown
- `SITE_CONFIG.fallbackContactEmail` / `SITE_CONFIG.canonicalHost` — placeholders. Post-launch Cycle 8 swaps to real values in `src/lib/site-config.ts`.
- `public/og-default.png` — placeholder. Cycle 8 swaps to the real 1200×630 OG asset.
- `public/robots.txt` sitemap URL — uses the same placeholder host. Cycle 8 swaps alongside `SITE_CONFIG.canonicalHost`.
```

- [ ] **Step 2: Update `project_dtfc_cycles.md`**

Add a Cycle 7 line after the Cycle 6 entry:

```markdown
Cycle 7 shipped 2026-08-12 (launch-prep: Pagefind cross-site search with ⌘K modal + /search/ page, Vercel Analytics + Speed Insights env-gated, axe-core in Playwright at 11 checkpoints (fail on critical/serious), known Cycle 1-6 accessibility fixes — ConceptLayout related-chip display names + duplicate h1s on detail templates + TimelineLegend focus-visible ring + reduced-motion + "1970's" copy consistency, launch essentials — /404 page + OG meta on BaseLayout + robots.txt + og-default placeholder, `hello@dtfc.example` centralized to SITE_CONFIG, 25 shipped-content apostrophe defects flipped and allowlist shrunk from 28 → 3, docs/launch-checklist.md pre-flight ops document.).
```

Update the roadmap to reflect Cycle 8 as the flip-the-chips cycle:

```markdown
- Cycle 8 — flip client-blocker chips: swap SITE_CONFIG.fallbackContactEmail + canonicalHost + og-default.png + favicon + DTFC-logo.png; populate Vercel env with real Formspree IDs; swap Zeffy CTA on /community/donate/; configure Ask Shakespeare inbox; expand /community/membership/ with real tier content; remove pre-release + coming-soon chips. Small cycle (~3-5 tasks).
- Cycle N — Web 2.0 items (deferred per source spec §5).
- Ongoing polish: 0 high-cohesion games seed, resilience.mdx game references, RSS feed for newsletters (if client requests).
```

- [ ] **Step 3: Append to `project_dtfc_followups.md`**

Add at the bottom:

```markdown
**Cycle 7 (2026-08-12) added follow-ups (all Cycle 8 or ongoing):**
- Cycle 8 flip-the-chips: real support email → SITE_CONFIG.fallbackContactEmail; real production domain → SITE_CONFIG.canonicalHost + public/robots.txt; real 1200×630 OG image → public/og-default.png; real favicon → public/favicon.*; real DT:FC logo → public/DTFC-logo.png; real Formspree IDs (or ESP swap) in Vercel env; real Zeffy URL → src/pages/community/donate.astro (remove chip); Ask Shakespeare destination inbox configured (remove CLIENT REVIEW comment); membership tier content → src/pages/community/membership.astro (remove pre-release chip); testimonials moderation policy decision (currently dev-committed).
- Any axe moderate/minor violations surfaced by the CI baseline (logged, not failed) — triage and fix incrementally.
- 0 high-cohesion games in Theatre Games seed — finder "High" chip shows empty state. Seed one or hide the chip.
- resilience.mdx mentions games that don't exist (Fire Tenders, Tignishes) — prose references, no runtime break, but confusing.
- archetype.mdx is a one-way island in the concept related-graph — cosmetic.
- RSS feed for /community/newsletters/ — not spec'd but user-friendly. Ask client whether desired.
- Site favicon: no favicon.svg or favicon.ico currently in `public/`. Add along with Desirae's brand delivery.
```

- [ ] **Step 4: Commit CLAUDE.md only**

Memory files live outside the repo — not committed.

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs: update CLAUDE.md for Cycle 7 launch-prep

Documents: Pagefind search (build integration + SearchModal + /search/
+ ⌘K), Vercel Analytics + Speed Insights (cookieless, env-gated),
@axe-core/playwright CI (11 checkpoints, fail on critical/serious),
SITE_CONFIG cross-cutting config, search-index scope
(data-pagefind-ignore), OG meta + canonical convention, apostrophe
allowlist shrink (28 → 3 Shakespeare-only).

Adds 3 deferred TODO markers for Cycle 8 flip-the-chips
(fallbackContactEmail, canonicalHost, og-default.png).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Final Verification (not a separate commit — the executing session runs these)

After Task 15, before offering to merge to `main`, run:

- `pnpm check` — 0 errors.
- `pnpm build` — succeeds; both prebuild guardrails print `✓`; Pagefind indexes N pages; ~95 pages built (Cycle 6's 93 + `/404` + `/search`).
- `pnpm test` — all Vitest suites green (Cycle 6's 110 + new `site-config.test.ts` (~4 tests) ≈ 114 tests).
- `pnpm test:e2e` — Playwright green: pre-existing assertions + Pagefind smoke + analytics-off gate + 11 axe checkpoints all pass with 0 critical/serious.
- Manual pass in `pnpm preview` (not `pnpm dev` — Pagefind requires the built dist/):
  - `/` — search icon in header opens modal; ⌘K opens modal; type "shakespeare" → results.
  - `/search/` — full-page search UI works.
  - `/404` (or any unknown path like `/nope`) — friendly 404 renders with nav grid.
  - `/legacy/timeline/` — chip filter keyboard focus rings visible.
  - `/theatre-games/concepts/archetype/` — related chips show titles like "Fearless Creativity".
  - Any detail page (essay/script/newsletter) — exactly one `<h1>` (`view-source:` in browser or `grep '<h1' dist/…/index.html | wc -l`).
- `grep -rn 'hello@dtfc.example' src/` — exactly 1 hit at `src/lib/site-config.ts`.
- `node scripts/check-prohibited-text.mjs` — clean; `CURLY_APOSTROPHE_ALLOWLIST` has 3 entries.

When all clean, offer the merge:

```bash
git checkout main && git merge --no-ff cycle-7-launch-prep -m "Merge cycle-7-launch-prep (launch-prep: search + analytics + a11y CI + fixes + apostrophe cleanup)"
```

---
