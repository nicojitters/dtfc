# DT:FC Cycle 7 — Launch-Prep Design

**Date:** 2026-08-12
**Branch:** `cycle-7-launch-prep`
**Predecessor:** Cycle 6 (Community + Formspree) shipped 2026-08-12 at commit `0b37e77`.
**Source spec:** `/Users/cnote/Downloads/dtfc-website-spec.md` §5 (search), §13 (accessibility), marketing plan.

## 1. Goal

Prepare the DT:FC site for public launch. Cycle 7 bundles six planned threads (Pagefind cross-site search, Vercel Analytics + Speed Insights, WCAG AA audit with axe-core in CI, launch essentials — 404 page, OG meta, canonical URLs, sitemap/robots — apostrophe cleanup of Cycles 1-4 shipped-content debt, launch checklist document) at deep-build quality. Ships a launch-ready branch that waits on client-side blockers (real ESP/Zeffy/email credentials, membership tiers content, favicon/logo assets); a small Cycle 8 flips the chips once those land.

## 2. Scope

### In scope

- Pagefind cross-site search: build-step indexing, `SearchModal` header island, `/search/` fallback page, keyboard shortcut (⌘K / Ctrl+K).
- Vercel Analytics + Speed Insights: cookieless, env-gated so local dev stays quiet.
- WCAG AA audit: `@axe-core/playwright` in the smoke test, fail on Critical/Serious, log Moderate/Minor. Baseline coverage on 11+ representative pages.
- Known accessibility + UX fixes carried forward from Cycle 1-6 reviews:
  - `ConceptLayout` related chips render display names, not raw slugs
  - Duplicate `<h1>` on detail templates (Essay, Script, Newsletter, Ask Shakespeare column) resolved
  - `TimelineLegend` chip focus-visible ring + `motion-reduce:` respect
  - "1970's" vs "1970s" copy consistency
  - Verify skip-link exists site-wide; add if missing
- Launch essentials:
  - `/404.astro` friendly page
  - OG meta + canonical URL props on `BaseLayout`, default placeholder `/og-default.png`
  - `public/robots.txt` (allow-all + sitemap URL)
  - Verify `@astrojs/sitemap` output
- `hello@dtfc.example` centralization to `src/lib/site-config.ts` (one-line swap post-launch)
- Apostrophe cleanup: 25 whitelisted shipped-content files flipped from U+0027 → U+2019 and removed from `CURLY_APOSTROPHE_ALLOWLIST`. The 3 Cycle 3 Shakespeare verse files remain whitelisted per Cycle 5 T1 editorial rule.
- Launch checklist doc (`docs/launch-checklist.md`) — pass/fail pre-flight ops document.
- New Vitest suites: `site-config.test.ts`, optionally `base-layout-meta.test.ts`.
- Extended Playwright: axe scans + Pagefind smoke assertion.
- CLAUDE.md + memory updates.

### Out of scope (Cycle 8 or later)

- Real ESP wiring beyond Formspree (still one-line swap when client picks).
- Real Zeffy URL for `/community/donate/`.
- Ask Shakespeare destination email routing.
- Membership tier content + flip pre-release chip.
- Testimonials moderation backend.
- Real `hello@dtfc.example` email address (Cycle 7 lands the plumbing so Cycle 8 is a one-line swap in `SITE_CONFIG`).
- Real Desirae favicon + OG image + logo assets.
- RSS feed for newsletters (not yet specified by client).
- Content polish deferrals: 0 high-cohesion games in finder seed, `resilience.mdx` prose game references, `archetype.mdx` one-way concept-graph island.

## 3. Architecture

### 3.1 Search — Pagefind

Pagefind is a static, build-time search-indexing tool that produces a tiny client-side JS bundle. The pattern:

- `pnpm build` runs `astro build && pagefind --site dist`. Astro emits HTML; Pagefind scans the HTML in `dist/` and writes an index + client bundle into `dist/pagefind/`.
- The `SearchModal` component loads `@pagefind/default-ui` dynamically on first modal-open (deferred script — no cost until user activates search).
- `data-pagefind-ignore` attribute suppresses non-content regions (site nav, footer, chip filters) from the index so results are content-first.
- `/search/` provides a full-page search fallback (linked from the modal for "open full search"). Both surfaces render the same `PagefindUI` widget.

### 3.2 Analytics — Vercel Analytics + Speed Insights

Two Vercel-owned packages (`@vercel/analytics`, `@vercel/speed-insights`) render `<script>` tags server-side and collect anonymous, aggregate telemetry when deployed to Vercel. Cookieless by design — no consent banner required.

- `BaseLayout` renders `<Analytics />` and `<SpeedInsights />` inside `<body>`, guarded by `import.meta.env.PUBLIC_VERCEL_ANALYTICS_ENABLED === 'true'`.
- `.env.example` sets the env to `false` by default. Vercel production env sets to `true` in the dashboard.
- No custom event tracking this cycle — defaults (pageview + Core Web Vitals) suffice for the launch-week baseline.

### 3.3 Accessibility audit

- Playwright's existing single smoke test gets a helper `runAxe(page, testName)` that constructs an `AxeBuilder(page)`, runs `.analyze()`, and asserts zero `critical` or `serious` violations.
- The helper is called after each significant page-navigation block in the smoke test. `moderate` / `minor` violations are logged (console.info) but do NOT fail the test — they get triaged as follow-ups.
- The 11+ audited pages span every route pattern shipped (landing, section landing, library index, dynamic detail, form page, chip-filter island, SVG-heavy how-to guide, Preact island).

### 3.4 Base layout evolution

`BaseLayout.astro` gains two optional props: `ogImage?: string` and `canonical?: string`. Defaults: `ogImage = '/og-default.png'`, `canonical = Astro.url.href`. New head elements emit deterministically per page. Downstream layouts (`SectionLayout`, section-specific layouts) pass these through when needed; they use defaults otherwise.

### 3.5 Configuration centralization

`src/lib/site-config.ts` holds cross-cutting settings that would otherwise scatter:

```ts
export const SITE_CONFIG = {
  fallbackContactEmail: 'hello@dtfc.example',
  canonicalHost: 'https://dtfc.example',  // swapped at launch to real host
  ogDefaults: {
    image: '/og-default.png',
    imageAlt: 'Developmental Theatre: Fearless Creativity',
    imageWidth: 1200,
    imageHeight: 630,
  },
} as const;
```

Post-launch swaps become 1-3 line edits to this file rather than site-wide find/replace.

## 4. Component + file plan

**Create:**
- `src/lib/site-config.ts`
- `src/pages/404.astro`
- `src/pages/search.astro`
- `src/components/search/SearchModal.astro`
- `public/robots.txt`
- `public/og-default.png` (placeholder — 1200×630, DT:FC wordmark on ivory; swapped when Desirae delivers)
- `docs/launch-checklist.md`
- `tests/unit/site-config.test.ts`
- `tests/unit/base-layout-meta.test.ts` (optional — dropped if HTML parsing proves fragile)

**Modify:**
- `.env.example` — add `PUBLIC_VERCEL_ANALYTICS_ENABLED` + `PUBLIC_SITE_URL`
- `package.json` — add devDeps (`pagefind`, `@axe-core/playwright`, `axe-core`) + regular deps (`@pagefind/default-ui`, `@vercel/analytics`, `@vercel/speed-insights`); update `build` script
- `src/layouts/BaseLayout.astro` — OG meta, canonical, Analytics/SpeedInsights conditional render, skip-link verification
- `src/components/layout/Header.astro` — search icon trigger + `SearchModal` mount
- `src/components/concept/ConceptLayout.astro` — resolve related-chip display names via `listConcepts()` (fix Cycle 1 followup)
- `src/components/scripts/ScriptDetail.astro` — drop redundant `<h1>` (defer to layout title)
- `src/components/legacy/EssayDetail.astro` — same
- `src/components/community/NewsletterDetail.astro` — same
- `src/pages/shakespeare/ask-shakespeare/[slug].astro` (Cycle 3 column detail page) — verify + apply same fix if pattern matches
- `src/components/legacy/TimelineLegend.astro` — add `focus-visible:ring-*` classes + `motion-reduce:transition-none`
- `src/pages/legacy/honoring-our-guides.astro` — `1970&rsquo;s` → `1970s`
- 4 form components + Donate CTA — import from `SITE_CONFIG.fallbackContactEmail` instead of hardcoding `hello@dtfc.example`
- Any of the 25 whitelisted Cycle 1-4 files — flip U+0027 → U+2019 in prose, remove from `CURLY_APOSTROPHE_ALLOWLIST`
- `scripts/check-prohibited-text.mjs` — shrink `CURLY_APOSTROPHE_ALLOWLIST` from 28 entries to 3 (only Shakespeare verse files remain)
- `tests/e2e/smoke.spec.ts` — axe scans + Pagefind smoke
- `astro.config.mjs` — if any Pagefind-specific option needed (likely none)
- `CLAUDE.md` — Cycle 7 conventions (Pagefind, analytics, axe discipline, SITE_CONFIG, launch checklist location)

## 5. Testing

- **Unit (Vitest):**
  - `tests/unit/site-config.test.ts` — asserts shape + expected fields + type safety.
  - `tests/unit/base-layout-meta.test.ts` — optionally parses a couple of built HTML pages to verify OG meta emission. Skip if HTML-parsing proves brittle across Astro build changes.
- **E2E (Playwright, existing single test):**
  - `runAxe(page, name)` helper called at ~11 checkpoints.
  - Pagefind smoke: navigate `/`, click search icon, type "shakespeare", assert ≥1 result appears.
  - Fallback assertion for `PUBLIC_VERCEL_ANALYTICS_ENABLED=false` state: verify `<script>` tags for Analytics are NOT present when disabled.
- **Verify per task:** `pnpm check` (0 errors) + `pnpm build` (guardrails clean + Pagefind indexing succeeds) + `pnpm test` (all suites) + `pnpm test:e2e` — controller-verified between tasks.

## 6. Soft-ship items this cycle

Cycle 7 introduces very few new soft-ships because most launch-time blockers stay soft-shipped from Cycle 6 (Membership pre-release, Donate coming-soon, Testimonials empty state, form fallback UI). New soft-ships:

1. **`/og-default.png`** — placeholder image. All meta tags emit correctly; visual replacement is a Cycle 8 file swap.
2. **`SITE_CONFIG.canonicalHost = 'https://dtfc.example'`** — placeholder. Real host swap is one line in `site-config.ts` when domain is provisioned.
3. **`.env.example` PUBLIC_SITE_URL** — set to `https://dtfc.example` as placeholder; real value populated in Vercel env at deploy time.

No visible chips added — these are invisible plumbing until launch.

## 7. Cross-file consistency preserved

- All prior-cycle sub-nav patterns, ReflectivePrompt, chip vocabulary, Formspree fallback pattern, `data-print-hide` convention unchanged.
- Curly-apostrophe guardrail remains active. Post-Cycle-7 the allowlist shrinks from 28 → 3 entries (Shakespeare verse only).
- FOUNDERS-pattern `z.infer` explicit-defaults rule unchanged.
- `is:inline` script DOMContentLoaded-wait pattern unchanged.

## 8. Success criteria

Cycle 7 is complete when:

- `pnpm build` produces the Astro output PLUS Pagefind index in `dist/pagefind/`, both guardrails clean, ~94 pages built (adds `/404` + `/search` to Cycle 6's 93).
- `pnpm check` — 0 errors.
- `pnpm test` — all Vitest suites green (Cycle 6's 110 tests + new site-config + optional base-layout-meta).
- `pnpm test:e2e` — Playwright green; axe reports 0 critical/serious across the 11+ audited pages; Pagefind smoke passes.
- All 4 known Cycle 1-6 accessibility/UX fixes shipped (related chips, duplicate h1s, focus ring + reduced-motion, "1970's").
- Skip-link present in `BaseLayout`.
- `hello@dtfc.example` referenced only from `SITE_CONFIG` (grep in `src/` yields 1 hit).
- `CURLY_APOSTROPHE_ALLOWLIST` contains exactly 3 entries (Shakespeare verse files).
- `docs/launch-checklist.md` exists with ≥25 checklist items across the sections defined below.
- `robots.txt` present in `public/`.
- `/og-default.png` placeholder present.
- CLAUDE.md documents Cycle 7 conventions.

## 9. Launch checklist doc structure

`docs/launch-checklist.md` is not a spec — it's a working ops document a human walks through at launch time. Structured as pass/fail sections:

- **Content:** membership tier flip, Zeffy URL swap, Ask Shakespeare inbox, testimonials policy, real support email in `SITE_CONFIG`, real favicon, real OG image.
- **Envelope:** `.env` populated in Vercel (3 Formspree IDs + `PUBLIC_VERCEL_ANALYTICS_ENABLED=true` + `PUBLIC_SITE_URL=<real domain>`).
- **SEO:** sitemap builds + canonical URL emits + robots.txt sensible + OG image is real + favicon rendered.
- **Forms:** each of 4 site forms POSTs successfully in production (manual submit test).
- **Accessibility:** Playwright + axe green in CI, manual keyboard-only pass through primary flows, screen reader spot-check.
- **Analytics:** Vercel Analytics dashboard receives pageviews after first production visit, Speed Insights receives Core Web Vitals.
- **Search:** Pagefind index builds during Vercel deploy, `/search/` returns results, ⌘K opens modal.
- **Domain + TLS:** DNS pointed, HTTPS enforced, no mixed content warnings, redirects (if any) configured.

Total ≥25 individual checklist lines. No code — pure ops.

## 10. Blockers for post-launch (Cycle 8)

Explicit deferrals, all documented in `docs/launch-checklist.md` and `project_dtfc_followups.md`:

- Client provides: Formspree IDs (or ESP swap decision), Zeffy URL, Ask Shakespeare destination email, membership tier content, testimonials moderation decision, real support email, favicon asset, OG image asset, real production domain.
- Cycle 8 shape (~3-5 tasks): swap `.env`, swap `SITE_CONFIG` values, swap `public/og-default.png` + `public/favicon.*`, expand `/community/membership/` page with real tier content, remove pre-release + coming-soon chips from Membership + Donate.
- Optional post-launch polish: 0 high-cohesion games in finder seed, `resilience.mdx` game references, `archetype.mdx` concept-graph edges, RSS feed for newsletters (if client requests).
