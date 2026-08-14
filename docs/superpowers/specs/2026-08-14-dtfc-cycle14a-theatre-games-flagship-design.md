# DT:FC Cycle 14a — Theatre Games Flagship Buildout Design

**Date:** 2026-08-14
**Branch:** `cycle-14a-theatre-games-flagship`
**Predecessor:** Cycle 13 (Children&rsquo;s Theatre Vision Fidelity) shipped 2026-08-14. Cycle 8 (post-launch chip-flips) remains a separate small cycle triggered by real client credentials.
**Successor:** Cycle 14b (Theatre Games corpus completion) will parse and populate the remaining 9 of 13 corpus documents into competency + subset pages, run the Silverstein guardrail in `pnpm build`, and complete the game-count reconciliation.
**Source specs:**
- `/Users/cnote/Downloads/dtfc-theatre-games-vision-spec.md` &mdash; the 12-criterion fidelity spec (primary)
- `/Users/cnote/Downloads/dtfc-website-spec.md` &sect;4.2 &mdash; Theatre Games architecture, superseded/expanded by the vision spec
- Google Drive folder `6- Theatre Games` (id `1eHxzounMb7b-Q52W6P7yeAfxMHVwjO3y`) &mdash; 3 top-level docs (Content List; Landing Page; WEB 2.0 Submission Template) + "Theatre Games Content in Numbered Order" subfolder (#1&ndash;6) + Warm-up subfolder (`10kBNeXXLoOtx-DGu4TxRZxlJ_ehhbUpV`) + externally-linked corpus folder "REVISED FRONT PAGE COMPETENCIES" (id `1M6LZzCb-kMkdR3YpNMBPG1Jj86vd3A-d`, 13 corpus + template + OLD-warmup)

## 1. Goal

Bring the shipped `/theatre-games` section &mdash; a Cycle 1 skeleton with a landing page (`index.astro`), a Preact filter island (`finder.astro`), a per-game detail route (`[slug].astro`), one how-to page (`how-to/rock-solid-recommendations.astro`), and 10 seed game MDXs &mdash; to the flagship vision the whole site was engineered for: instant, minimal-prep access to hundreds of facilitation-ready games, safety-aware by cohesion, pedagogy-first by competency, and lineage-honest by attribution.

Cycle 14a delivers the flagship's shape end-to-end: the IA restructure with redirect stubs, the interactive Index UI (five-axis facet + structure filter, three-column default view, URL-persistent), the CompetencyPage layout component with the 7-icon bar and Continuous Assessment block, four root-competency pages fully loaded from real corpus content (Physical Expression + ENTRY, Vocal Expression 1, Risk Assessment and Management, Resilience), all six facilitation guides (Orientation with print-styled infographic + wired video slot, How-to-Use-the-Index authored after the Index UI, Warmup with Cool-down surfaced, Rock Solid restructured as reusable content blocks, plus Honoring Our Guides and Submit), the parse-extract pipeline (`scripts/extract-theatre-games.mjs`) with a validation report to `docs/build-reports/`, three cross-section contract closures (landing-question resolutions on Resilience + Vocal Expression, the `<GameLink>` resolver list refreshed), a stripping-registry guardrail (10 new PATTERNS + Silverstein advisory script), and a 14-item client-review bundle capturing every deferred client decision from spec &sect;7.

14b takes the same pipeline against the remaining 9 corpus docs (Physical: MOVEMENT / MIME / RHYTHM canonical; Vocal 2 Articulation / 3 Finding a Voice / 4 Story Making; CA I: Observation and II: Connection; and the Story-Making vs. Storytelling naming reconciliation everywhere), promotes Silverstein-check to a build-blocking guardrail, and reconciles the landing copy's "hundreds of games" phrasing against the true parsed count.

Not in scope for 14a: the Web 2.0 submission handler (spec &sect;7.1 &mdash; deferred to a later cycle pending Lola's reviewer-governance decision); the 9 non-14a corpus documents (deferred to Cycle 14b); the Cycle 8 post-launch chip-flip pass; the Chuck-Wilcox Jabberwocky media asset (spec &sect;7.5 &mdash; page ships with wired slot pending client asset); Workshop Manual real text (spec &sect;7.6 &mdash; standing shared blocker with Legacy).

## 2. Scope

### In scope

**Track A &mdash; Route restructure, sub-nav, redirect stubs**

- New sub-nav `src/lib/theatre-games-nav.ts` (6 items in spec &sect;2 order):
  1. Overview &rarr; `/theatre-games/`
  2. Index &rarr; `/theatre-games/games/`
  3. Competencies &rarr; `/theatre-games/competencies/`
  4. Facilitation &rarr; `/theatre-games/facilitation/`
  5. Honoring &rarr; `/theatre-games/honoring-our-guides/`
  6. Submit &rarr; `/theatre-games/submit/`
- New sub-nav layout `src/layouts/TheatreGamesLayout.astro` &mdash; consumes `THEATRE_GAMES_NAV` array; mirrors `ChildrensLayout` / `ShakespeareLayout` / `LegacyLayout` pattern.
- Route moves + redirect stubs (Cycle 13 meta-refresh pattern):
  - `src/pages/theatre-games/[slug].astro` &rarr; content moves to `src/pages/theatre-games/games/[slug].astro`; old URL kept as a redirect stub with `<meta http-equiv="refresh" content="0; url=/theatre-games/games/<slug>/">` + `<link rel="canonical">` + `<meta name="robots" content="noindex">`.
  - `src/pages/theatre-games/finder.astro` &rarr; content moves to `src/pages/theatre-games/games/index.astro`; old URL kept as a redirect stub.
  - `src/pages/theatre-games/how-to/rock-solid-recommendations.astro` &rarr; content moves to `src/pages/theatre-games/facilitation/rock-solid.astro`; old URL kept as a redirect stub.
- New routes (all under `src/pages/theatre-games/`):
  - `games/index.astro` &mdash; Index (SSR-first + hydrated filter island)
  - `games/[slug].astro` &mdash; game detail (renamed from `[slug].astro`)
  - `competencies/index.astro` &mdash; competencies landing (5 competency tiles)
  - `competencies/[competency]/index.astro` &mdash; competency root page
  - `competencies/[competency]/[subset].astro` &mdash; subset page
  - `facilitation/index.astro` &mdash; facilitation landing (6 guide tiles)
  - `facilitation/orientation.astro`, `.../how-to-use-the-index.astro`, `.../warmup.astro`, `.../rock-solid.astro`
  - `honoring-our-guides.astro`
  - `submit.astro`
- `scriptHref` &mdash; no change (games not part of the scripts collection). New `gameHref(slug)` helper in `src/lib/game-href.ts` returns `/theatre-games/games/<slug>/`; existing callers of the old `/theatre-games/<slug>/` shape migrate. `<GameLink slug>` from Cycle 13 already reads its target through a computed URL; update it in one line.

**Track B &mdash; Content collection + schema additions**

- `src/lib/content-schemas.ts` &mdash; extend `gameSchema` with Cycle 14 optional fields:
  - `sourceDoc: z.string().optional()` &mdash; parse-report traceability, e.g. `"Website TG #2 Vocal Expression 1"`
  - `spolinPage: z.number().int().optional()` &mdash; Spolin page number when `source` starts with "Adapted from Viola Spolin"
  - `variations: z.boolean().default(false)` &mdash; true when body has a `## Variations` / `## Adaptations` section
  - `draft: z.boolean().default(false)` &mdash; production gate (Cycle 12 pattern; dev + `?draft=1` bypass)
- `src/lib/types.ts` &mdash; correct `COMPETENCY_SUBSETS`:
  - `vocal-expression`: `['Expression', 'Articulation', 'Finding a Voice', 'Story Making']` (renames current `'Storytelling'`; ticketed in review bundle item #2)
  - `context-awareness`: `['Observation', 'Connection']` (adds the two subsets the corpus + Children's modules use; landing-copy expansion ticketed in review bundle item #6)
- Existing 10 seed game MDXs &mdash; normalized body H2s to `## Intent` / `## Technique` / `## Evaluation` (from current `## Preparation` / `## Facilitation` / `## Evaluation`). Intent frontmatter stays in frontmatter; H2s carry technique + evaluation prose.
- New concept stubs (draft:true, following Cycle 11 Vocal Expression precedent):
  - `src/content/concepts/encompassing-diversity.mdx` &mdash; from spec &sect;1.6 inclusion doctrine
  - `src/content/concepts/feedback-no-critique.mdx` &mdash; from Rock Solid Feedback content
  - `src/content/concepts/warmup.mdx` if missing (verify at implementation start; add draft:true stub if absent)

**Track C &mdash; Parse-extract pipeline**

- New script `scripts/extract-theatre-games.mjs` &mdash; ES module, Node native:
  - Input: `.md` exports of the 4 Cycle-14a corpus docs at `content-source/theatre-games/*.md` (git-ignored working folder; add `content-source/` to `.gitignore`).
  - Parse: walks headings by depth, identifies game blocks by cohesion-header pattern (H2/H3 matching `/(low|medium|high)\s*cohesion/i`) + game-name H3, extracts intent paragraph, technique block (until next game or section end), evaluation block (H3 "Evaluation" or "Evaluation Questions"), source line ("Adapted from Viola Spolin, p. N" &rarr; parsed into `source` + `spolinPage` frontmatter).
  - Output: MDX writes to `src/content/games/<slug>.mdx` where `<slug>` = kebab-case game name. If a file already exists at the target, writes to `<slug>.mdx.new` instead (no clobber) unless `--force` is passed.
  - Validation report: writes to `docs/build-reports/theatre-games-parse-2026-08-14.md` (dated) with per-doc counts, records missing required fields (structure, cohesion, intent), duplicate slugs, unresolved `<GameLink>` references from Children's modules (via `node_modules/.astro/unresolved-games.jsonl` cross-reference).
  - Manual command: `pnpm extract:theatre-games` (added to `package.json`); NOT wired into `pnpm build`.
- Corpus-fetch tooling &mdash; new script `scripts/fetch-theatre-games-corpus.mjs` uses the Drive MCP file IDs (already known in this session) to write `.md` exports to `content-source/theatre-games/`. Alternative flow: manual Drive export &rarr; drop `.md` files in that folder &rarr; run extractor.
- Add-a-game README at `docs/adding-a-theatre-game.md` &mdash; explains both flows (write MDX by hand vs. re-run extractor), the frontmatter shape, and where to look at the parse report.

**Track D &mdash; Index UI (flagship interactive)**

- SSR shell `src/pages/theatre-games/games/index.astro`:
  - Loads all games via `loadGamesLite()`.
  - Renders full row list server-side (Pagefind + no-JS see every game).
  - Mounts `<GameIndex client:load games={games} />` for filter interactivity.
- Preact island `src/components/games/GameIndex.tsx`:
  - Reads `games` prop + URL params on mount; renders filtered rows.
  - 5 filter axes (competency chip strip, subset chip strip &mdash; dynamic to competency, cohesion chip strip Low/Medium/High, intent text search, name text search combined into single search input) + Structure toggle (Individual / Group / Both).
  - URL persistence via `?competency=…&subset=…&cohesion=…&structure=…&q=…` (Cycle 12 SoliloquyFilters pattern).
  - Three-column default per spec &sect;4 item 4: *Competency + Subset* / *Intent* / *Cohesion*. Structure chip on each row. Name = row title, links to `/games/[slug]/`.
  - Cohesion cell: cohesion icon + label; icon triggers PRC Cohesion popover (uses existing `<Concept id="cohesion">` mechanism).
  - Empty state: "No games match. Try clearing one filter." with an inline "Clear all" button.
- Row component `src/components/games/GameRow.astro` (SSR default) + shared style block; the Preact island re-renders same-shape rows on hydration.
- Deprecated: `src/components/games/GameFinder.tsx` (existing Preact island) &mdash; kept during migration until `GameIndex.tsx` passes smoke; removed at end of Track D.
- Game detail template `src/pages/theatre-games/games/[slug].astro`:
  - Renders `<IconBar />` (Track E)
  - Full record: name, competency+subset chip, cohesion chip w/ popover, structure chip, intent block, `<Content />` MDX body (Technique / Evaluation / Variations), Source line when `data.source` is set.
  - `@media print` stylesheet: hides sub-nav, header, footer, filter island noise; expands body to full width; forces black text; strips background colors.
- Existing `HowToModal.astro` component (used by current `finder.astro`) &mdash; retired; replaced by the standalone `/facilitation/how-to-use-the-index/` guide.

**Track E &mdash; 7-icon bar + CompetencyPage component**

- New `src/components/games/IconBar.astro`:
  - Renders 7 icons in horizontal strip: Competency, Cohesion, Continuous Assessment, Facilitator Guide, Magic Tool Box, Warmup, Feedback / Evaluation.
  - Each icon = clickable button that triggers a native-Popover attached to the shared `<Concept>` popover markup pattern. Icon URL points to `public/icons/<slug>.svg` (placeholder icons per Cycle 10 pattern).
  - PRC concept-slug resolution table hard-coded in `src/components/games/icon-bar-map.ts`:
    ```ts
    export const ICON_BAR = [
      { id: 'competency',            iconSlug: 'competency',           conceptSlug: 'competency' },
      { id: 'cohesion',              iconSlug: 'cohesion',             conceptSlug: 'cohesion' },
      { id: 'continuous-assessment', iconSlug: 'continuous-assessment',conceptSlug: 'continuous-assessment' },
      { id: 'facilitator-guide',     iconSlug: 'facilitation',         conceptSlug: 'facilitation' },
      { id: 'magic-tool-box',        iconSlug: 'magic-toolbox',        conceptSlug: 'magic-toolbox' },
      { id: 'warmup',                iconSlug: 'warmup',               conceptSlug: 'warmup' },
      { id: 'feedback',              iconSlug: 'feedback',             conceptSlug: 'feedback-no-critique' },
    ];
    ```
- New `src/components/games/CompetencyPage.astro`:
  - Props: `{competency, subset?, definition, intent, reasonsResults, who, preparation, followups, epigraph?}`.
  - Renders top-to-bottom: `<IconBar />` &rarr; `<Epigraph />` (optional) &rarr; `<h1>` &rarr; Definition &rarr; Intent (with "this is a gift" register preserved verbatim from source) &rarr; `<ReasonsResultsTable rows={reasonsResults} />` &rarr; Who &rarr; `<ContinuousAssessmentBlock />` &rarr; Preparation &rarr; `<FollowupsList items={followups} />` &rarr; `<GameListForCompetency competency={competency} subset={subset} />`.
- New `src/components/games/ContinuousAssessmentBlock.astro`:
  - Same content on every competency page &mdash; includes wellbeing checks (sleep, food, dehydration, exhaustion, shyness vs. attention-seeking). Uses `.callout-tip` token base + a new "assessment" chip label.
- New `src/components/games/Epigraph.astro`:
  - Props `{attribution, body}`. Renders styled blockquote with cite line. Consumed by CompetencyPage epigraph slot for Holzberg (Risk / Resilience / CA I: Observation) and Lola's counterpoint on CA.
- New `src/components/games/ReasonsResultsTable.astro`:
  - 2-column responsive table (stacks on mobile). Rows array in.
- New `src/components/games/GameListForCompetency.astro`:
  - Filters `loadGamesLite()` to given competency (+ subset if provided). Renders as a compact row list matching GameRow.
- 4 competency root pages populated from parsed corpus data (Track F):
  - `physical-expression/index.astro` (from `Website TG Competency Physical Expression + Theatre Games ENTRY`)
  - `vocal-expression/index.astro` (from `Website TG #2 Vocal Expression 1`)
  - `risk-assessment/index.astro` (from `Website TG #4 Risk Assessment and Management`)
  - `resilience/index.astro` (from `Website TG #5 Resilience` &mdash; internal header corrected per spec &sect;7 item 2)
- 8 subset pages ship as honest placeholders in 14a (skeleton front-matter + `<GameListForCompetency />` + "Corpus content pending in Cycle 14b" chip):
  - `physical-expression/movement.astro`, `.../mime.astro`, `.../rhythm.astro`
  - `vocal-expression/articulation.astro`, `.../finding-a-voice.astro`, `.../story-making.astro`
  - `context-awareness/observation.astro`, `.../connection.astro`
- `context-awareness/index.astro` &mdash; 14a placeholder page (CA is not one of the 4 fully-loaded roots).

**Track F &mdash; Facilitation guides + landing + Honoring + Submit**

- `src/pages/theatre-games/index.astro` &mdash; landing refactor:
  - Replaces current bespoke content with verbatim landing-page doc content (id `1ChnVc0CmxSCFGCAmh95q9H1pLAudTIRovlHdsCZ7dCI`).
  - "For Teaching" orphan bullet fragment ("understanding of the material, and manage class dynamics.") &mdash; light editorial mend; ticketed in review bundle item #11.
  - Keeps `<ReflectivePrompt />` (Cycle 2 pattern); adds link tiles &rarr; Index, Competencies, Honoring.
- `src/pages/theatre-games/facilitation/index.astro` &mdash; facilitation landing (6 guide tiles).
- `src/pages/theatre-games/facilitation/orientation.astro`:
  - DT:FC definition verbatim from PRC `theatre-games.mdx` (single source per spec &sect;3).
  - Organizational logic, "How to Find the Game of the Day," worked example (Puppets/Marionettes cross-linked to `/games/puppets-marionettes/`), facilitator role & goals, closing &rarr; Rock Solid link.
  - Print-styled via `@media print` block + phone-scale via `@media (max-width: 600px)`.
  - Wired video slot &mdash; new `src/components/games/VideoSlot.astro` with a `placeholder` prop that renders a "Narrated intro video coming soon" chip in the aspect-ratio box. Ticketed in review bundle item #14 (Chuck Jabberwocky asset carries same wiring).
- `src/pages/theatre-games/facilitation/how-to-use-the-index.astro`:
  - Authored AFTER the Index UI is stable (build order per spec &sect;3 item 2).
  - Real screenshots at `public/images/theatre-games/how-to/*.png` &mdash; captured manually or via a helper `pnpm capture:index-screens` (Playwright script over the running dev server; commit-once).
  - Prose covers the three-column framing + how to combine filters + how URL persistence works.
  - Modal-with-annotated-captures UI (native `<dialog>` &mdash; pattern used elsewhere on site).
- `src/pages/theatre-games/facilitation/warmup.astro`:
  - Content from #5 corpus doc (fetched via Drive MCP in Track F implementation).
  - Physical + psychological readiness, warmup components, world-event example with Cherie's editorial note stripped (ticketed in review bundle item #7 for OLD-guide favorites harvest decision).
  - **Cool-down surfaced as its own H2** (spec &sect;3 item 3 &mdash; explicitly requires this).
  - Cross-links to game pages (Outrageous Roll Call, Jabberwocky) via `<GameLink>`.
- `src/pages/theatre-games/facilitation/rock-solid.astro`:
  - Backed by new `src/data/rock-solid-recommendations.ts` (Cycle 5 FOUNDERS pattern &mdash; Zod-validated array of `{title: string, body: string, tags?: string[]}` records). `body` is a plain string rendered as one or more `<p>` blocks on the page (paragraph split on double-newline); sufficient for the reuse the vision spec calls for (newsletter blurbs, popup snippets). If a recommendation's source doc requires structured sub-parts (numbered list, headed sub-blocks) that plain paragraphs can&rsquo;t carry, escalate that recommendation to an individual MDX file under `src/content/rock-solid/` (new sub-collection, added only if the source doc requires it &mdash; decision per-recommendation during Track F implementation).
  - Renders as a read-through page of structured blocks; each block styled as a callout card.
  - Vocabulary list at top wires each term to its PRC entry via inline `<Concept id="…" />`.
  - Self-assessment as light interactive checklist (no storage; live counter via `<script is:inline>` following Cycle 6 Formspree-init idempotency pattern).
  - Workshops CTA &rarr; existing `/community/workshops/` interest form (no popup &mdash; direct link).
  - Name ships as "Rock Solid Recommendations" (spec &sect;3 item 6a); client decision ticketed in review bundle item #10.
- `src/pages/theatre-games/honoring-our-guides.astro`:
  - Lineage prose ("You are now part of this lineage of practitioners") verbatim from spec &sect;1 item 7.
  - Moreno / Brian Way / Viola Spolin / Norma J. Livo named with book titles.
  - Caravan origin paragraph (cross-links to `/legacy/`).
  - **Spolin attribution list intact** &mdash; 17 adapted games with page numbers + 1963 copyright + ISBN, rendered as a semantic `<table>`. Non-negotiable legal / ethical requirement per spec &sect;1 item 7.
  - "Please go to Legacy Acknowledgements" &rarr; `/legacy/founders/` link.
- `src/pages/theatre-games/submit.astro`:
  - Content-only page rendering the Web 2.0 template as reference (from doc `WEB 2.0 Submission Template`).
  - Honest chip: "Submissions open once our reviewer workflow is in place. In the meantime, share via the [Contact](/community/contact/) form." Ticketed in review bundle item #1 (Lola's TEAM QUESTION decision).
  - Template's TEAM QUESTION block stripped per spec &sect;7.
- Retire: `src/pages/theatre-games/how-to/rock-solid-recommendations.astro` (redirect stub replaces it per Track A). The `how-to/` folder becomes empty after this move; delete it.

**Track G &mdash; Cross-section contracts + PRC additions**

- Landing-question resolutions per spec &sect;6 (all three teasers land):
  - "What makes learning playful and empowering?" &rarr; `/theatre-games/` landing (already resolved by verbatim doc content in Track F).
  - "What&rsquo;s the difference between resignation and resilience?" &rarr; `resilience/index.astro` competency page carries the explicit sentence.
  - "Which competency trains Elocution, Memorization, Declamation, Presentation?" &rarr; `vocal-expression/index.astro` competency page carries a new mapping paragraph (client-sign-off inline callout &mdash; ticketed in review bundle item #5).
- `<GameLink>` resolver refresh &mdash; existing helper reads the games collection; the parse extractor's report doubles as the unresolved-games resolver list. Advisory report continues from Cycle 13.
- PRC entries (new draft:true stubs, Cycle 11 Vocal Expression pattern):
  - `encompassing-diversity.mdx` &mdash; `shortDefinition` distilled from spec &sect;1.6 inclusion doctrine (adapts pre-K to senior citizens; impediments in the rotation; blind-player adaptation).
  - `feedback-no-critique.mdx` &mdash; `shortDefinition` from Rock Solid (no yes/no or good/bad; no pitch from facilitator; adaptive praise).
  - `warmup.mdx` &mdash; verified at implementation start; added if missing.
- Community + membership + Contact form: no changes; existing wiring covers the "you are part of this lineage" invitations.
- Workshop Manual shared placeholder &mdash; cross-link from Rock Solid + Warmup guides &rarr; Legacy essays placeholder `/legacy/essays/workshop-manual/`.

**Track H &mdash; Guardrail extensions**

- `scripts/check-prohibited-text.mjs` &mdash; add PATTERNS from spec &sect;7 stripping registry:
  ```js
  '(Desirae: Your input next)',
  'DESIRAE –',                              // en-dash + space; index-admin note prefix
  'TEAM QUESTION',                          // Lola's block
  'Tab 1',                                  // Vocal Expression 1 artifact
  'ANY OTHERS?',
  'WEB 2.0?',                               // title prefix (with trailing '?')
  '(Link to Folder)',
  '***NOTE: THIS IS NOT APPROPRIATE',
  '(pic?)',                                 // duplicate-guard from Cycle 9; explicitly re-covered
  'Building a Firm Foundation',             // rejected Rock Solid alt name
  ```
  Plus a regex for line-anchored `"#N "` title prefixes (`/^#\d+\s/`).
- New script `scripts/check-silverstein.mjs` &mdash; case-insensitive grep for `silverstein` across `dist/`. Advisory-only in 14a (exit 0 + log). Wired into `pnpm build` as blocking in 14b once corpus is fully migrated.
- Package.json: add `check:silverstein` script pointing to it. `pnpm build` continues to run `check:prohibited` (already wired); `check:silverstein` remains manual through 14a.
- Silverstein replacements &mdash; every Silverstein-reference in Vocal Articulation + OLD-warmup content is replaced with pointer to `/childrens-theatre/warm-up-poems/` (site-wide grep during Track F implementation).

**Track I &mdash; Testing coverage**

- Vitest unit tests (new files under `src/lib/__tests__/` or component test folders):
  - `extract-theatre-games.test.mjs` &mdash; feeds a fixture corpus `.md` at `test-fixtures/theatre-games-sample.md`, asserts expected records + missing-field warnings.
  - `spolin-attribution.test.ts` &mdash; loads games collection, asserts every game whose `source` starts with "Adapted from Viola Spolin" also has `spolinPage: number` set; asserts count matches Honoring page's 17-row table.
  - `competency-subsets.test.ts` &mdash; asserts `COMPETENCY_SUBSETS` shape matches file-system `src/pages/theatre-games/competencies/[competency]/[subset].astro` route slugs.
  - `theatre-games-concept-refs.test.ts` &mdash; scans all `.astro` + `.mdx` under `/theatre-games/` for `<Concept id="…">` refs; asserts each resolves against `getCollection('concepts')`.
- Playwright smoke (new checkpoints in `tests/e2e/smoke.spec.ts`):
  - Index page loads &rarr; filter selection updates row count &rarr; URL updates with query string &rarr; a row navigates to detail.
  - Game detail page loads &rarr; print-friendly render (via `page.emulateMedia({ media: 'print' })` + no-sub-nav assertion).
  - Sub-nav visit chain: Overview &rarr; Index &rarr; Competencies &rarr; Facilitation &rarr; Honoring &rarr; Submit.
  - Redirect stub: visit `/theatre-games/finder/` &rarr; browser lands on `/theatre-games/games/`.
- Axe scans (new checkpoints):
  - Index page (`/theatre-games/games/`)
  - Physical Expression competency page
  - Honoring page
- All existing 26 Playwright smoke checkpoints continue to pass; existing 5 axe scans continue.

**Track J &mdash; Documentation + review bundle + CLAUDE.md**

- Design spec (this file): `docs/superpowers/specs/2026-08-14-dtfc-cycle14a-theatre-games-flagship-design.md`
- Implementation plan (next skill): `docs/superpowers/plans/2026-08-14-dtfc-cycle14a-theatre-games-flagship.md`
- Client review bundle: `docs/client-reviews/2026-08-14-cycle14a-theatre-games-review.md` (14 items, table format matching Cycle 13 bundle).
- Add-a-game README: `docs/adding-a-theatre-game.md` (satisfies spec &sect;4 item 5).
- Parse validation report: `docs/build-reports/theatre-games-parse-2026-08-14.md` (first-run output, committed for client review).
- CLAUDE.md additions:
  - Sub-nav order: Overview / Index / Competencies / Facilitation / Honoring / Submit.
  - Adding a game: manual MDX vs. `pnpm extract:theatre-games` flow; frontmatter shape; where the parse report lives.
  - 7-icon bar rule: never hardcode concept slugs in components &mdash; use `ICON_BAR` map from `icon-bar-map.ts`.
  - Competency pages: corpus is source for definitions on-page; PRC still owns popover short-defs (no forked text; spec &sect;5).
  - Silverstein rule: replaced site-wide with `/childrens-theatre/warm-up-poems/`; grep guardrail advisory in 14a, blocking in 14b.
  - `gameHref(slug)` canonical URL helper.
  - Parse pipeline: manual run only; regeneration writes `.mdx.new` unless `--force`.

### Out of scope (14b + later cycles)

- Corpus completion for the 9 non-14a docs (Physical: MOVEMENT / MIME / RHYTHM; Vocal 2 / 3 / 4; CA I: Observation; CA II: Connection; and duplicate resolution + subset naming reconciliation).
- Silverstein guardrail promoted from advisory to blocking in `pnpm build`.
- Landing "hundreds of games" copy reconciliation against real parsed count.
- Web 2.0 submission handler (spec &sect;7 item 1 &mdash; deferred pending Lola's reviewer decision).
- Chuck Jabberwocky media asset ingestion (spec &sect;7 item 5).
- Workshop Manual real text (spec &sect;7 item 6 &mdash; shared with Legacy).
- OLD-guide favorites harvest &mdash; explicit client decision (spec &sect;7 item 4).
- Story-Making vs. Storytelling site-wide naming reconciliation applied to landing/orientation/index-facets after client picks (spec &sect;7 item 2).
- Concept-icon artwork replacements (Desirae asset pipeline).

## 3. Architecture

### 3.1 Route + content map

```
/theatre-games/                                       Landing (verbatim doc)
/theatre-games/games/                                 Index (SSR + Preact filter)
/theatre-games/games/[slug]/                          Game detail (renamed)
/theatre-games/competencies/                          Competencies landing (5 tiles)
/theatre-games/competencies/physical-expression/      Physical (from corpus, loaded 14a)
/theatre-games/competencies/physical-expression/movement/  Subset (placeholder in 14a)
/theatre-games/competencies/physical-expression/mime/      Subset (placeholder in 14a)
/theatre-games/competencies/physical-expression/rhythm/    Subset (placeholder in 14a)
/theatre-games/competencies/vocal-expression/         Vocal (from corpus, loaded 14a)
/theatre-games/competencies/vocal-expression/articulation/     Subset (placeholder)
/theatre-games/competencies/vocal-expression/finding-a-voice/  Subset (placeholder)
/theatre-games/competencies/vocal-expression/story-making/     Subset (placeholder)
/theatre-games/competencies/context-awareness/        Placeholder in 14a
/theatre-games/competencies/context-awareness/observation/     Subset (placeholder)
/theatre-games/competencies/context-awareness/connection/      Subset (placeholder)
/theatre-games/competencies/risk-assessment/          Risk (from corpus, loaded 14a)
/theatre-games/competencies/resilience/               Resilience (from corpus, loaded 14a; header fix)
/theatre-games/facilitation/                          Facilitation landing (6 tiles)
/theatre-games/facilitation/orientation/              #1 print-friendly infographic + video slot
/theatre-games/facilitation/how-to-use-the-index/     #3 authored after Index; real screenshots
/theatre-games/facilitation/warmup/                   #5 canonical guide + Cool-down surfaced
/theatre-games/facilitation/rock-solid/               #6 reusable structured blocks
/theatre-games/honoring-our-guides/                   Spolin attribution list + lineage prose
/theatre-games/submit/                                Web 2.0 template rendered as reference

Redirect stubs (meta-refresh):
/theatre-games/finder/                             ->  /theatre-games/games/
/theatre-games/[slug]/                             ->  /theatre-games/games/[slug]/
/theatre-games/how-to/rock-solid-recommendations/  ->  /theatre-games/facilitation/rock-solid/
```

### 3.2 Data flow

```
Drive corpus (13 docs)
    v  (Drive MCP fetch OR manual export)
content-source/theatre-games/*.md          (git-ignored)
    v  (scripts/extract-theatre-games.mjs)
src/content/games/*.mdx                    (committed; hand-editable)
    ^                                          + docs/build-reports/theatre-games-parse-<date>.md
    |
src/content/games/*.mdx (also: hand-authored)
    v  (loadGamesLite() at build)
GameLite[]
    v
- /theatre-games/games/ index (SSR + hydrated filter)
- /theatre-games/games/[slug] detail
- CompetencyPage <GameListForCompetency /> renders games filtered to that competency/subset
- <GameLink slug> resolves link-when-exists; advisory report of unresolved slugs
```

### 3.3 Component boundaries

- **Layout** (`TheatreGamesLayout.astro`) &mdash; owns h1 semantics + sub-nav. Section landing + all `/theatre-games/*` pages consume it.
- **Section-specific components** (`src/components/games/`):
  - `IconBar.astro` + `icon-bar-map.ts` &mdash; the 7-icon strip; hard-coded PRC concept-slug resolutions.
  - `CompetencyPage.astro` &mdash; competency page layout + slots.
  - `ContinuousAssessmentBlock.astro` &mdash; always-on wellbeing-checks block.
  - `Epigraph.astro`, `ReasonsResultsTable.astro`, `FollowupsList.astro` &mdash; small presentational sub-parts.
  - `GameListForCompetency.astro` &mdash; server-rendered list for competency pages.
  - `GameRow.astro` &mdash; server-rendered row for Index SSR view.
  - `GameIndex.tsx` &mdash; Preact filter island (replaces `GameFinder.tsx`).
  - `VideoSlot.astro` &mdash; aspect-ratio placeholder with "coming soon" chip.
- **Section-agnostic components** (existing):
  - `SectionLayout.astro` (consumed by `TheatreGamesLayout` under the hood).
  - `Concept.astro` &mdash; popover mechanism reused by `IconBar` + inline `<Concept id="…" />` refs in body text.
  - `ReflectivePrompt.astro` &mdash; landing bottom rail.
  - `Chip.astro`, `Button.astro` &mdash; presentation primitives.
  - `SearchModal.astro`, `LetterRail.astro` etc. &mdash; unchanged.

### 3.4 Isolation + testability

- The parse-extract pipeline is a pure function against `.md` input; testable via fixture doc.
- `CompetencyPage.astro` takes props for every content block; competency root pages hard-code the props from parsed corpus content.
- `GameIndex.tsx` is a leaf component &mdash; consumes `games: GameLite[]` prop + URL params; no side effects beyond `window.history.replaceState`.
- The 7-icon bar hardcode is centralized in one map file; touching it requires editing one place.

## 4. Content-authoring conventions

### Adding a game (hand-written)

Drop `src/content/games/<slug>.mdx` with:

```md
---
name: 'Puppets & Marionettes'
competency: 'physical-expression'
subset: 'Movement'
structure: 'group'
cohesion: 'low'
intent: 'Loosen physical patterns; wake the body to intentional movement.'
source: 'Adapted from Viola Spolin, Improvisation for the Theater, p. 132.'
spolinPage: 132
sample: false
sourceDoc: 'Website TG #1 Physical Expression - MOVEMENT'
variations: true
---

## Intent

<Prose block extended if needed.>

## Technique

1. Facilitator...
2. Players...

## Evaluation

- Ask...
- Notice...

## Variations

- ...
```

### Adding a game (via extractor)

1. Export the Drive corpus doc as `.md` &rarr; drop under `content-source/theatre-games/`.
2. Run `pnpm extract:theatre-games`.
3. Review `.mdx.new` files beside existing MDXs (or fresh MDXs where new).
4. Check `docs/build-reports/theatre-games-parse-<date>.md`.
5. Hand-clean; move `.mdx.new` &rarr; `.mdx`; commit.

### Adding a competency page

Populate the props on `<CompetencyPage />` (definition, intent, reasonsResults array, who, preparation, followups, optional epigraph). Body prose lives in the `.astro` file &mdash; PRC popovers pull short-def only.

## 5. Client-review bundle (14a &mdash; 14 items)

Full detail in `docs/client-reviews/2026-08-14-cycle14a-theatre-games-review.md`. Summary:

| # | Item | Spec ref | Ship-visible chip? |
|---|---|---|---|
| 1 | Submission governance decision (Lola&rsquo;s TEAM QUESTION &mdash; reviewer or open?) | &sect;7.1 | Yes on /submit |
| 2 | Story Making vs. Storytelling site-wide naming | &sect;7.2 | No (silent-defaulted to Story Making) |
| 3 | Resilience internal header ("Risk Assessment and Management") corrected on migrated page | &sect;7.2 | No (silent-corrected) |
| 4 | Rhythm duplicate resolution (canonical = later 29KB doc) &mdash; 14b applies | &sect;7.2 | No |
| 5 | Vocal landing-question mapping (Elocution / Memorization / Declamation / Presentation) &mdash; new paragraph on Vocal Expression | &sect;7.2 + &sect;6 | Yes inline |
| 6 | CA subsets added to landing copy (I: Observation + II: Connection) | &sect;7.3 | No (silent-added) |
| 7 | OLD-guide favorites harvest decision (Getting into Shared Space; Who&rsquo;s Here?; circle rhythm clapping; slower-day / higher-energy-day) | &sect;7.4 | No |
| 8 | Chuck Jabberwocky video/audio decision + asset | &sect;7.5 | Yes (media-coming-soon chip) |
| 9 | Workshop Manual text (shared blocker w/ Legacy) | &sect;7.6 | Yes (existing sample chip) |
| 10 | Rock Solid Recommendations naming (kept as-is; alt "Building a Firm Foundation" rejected) | &sect;3.6a | No |
| 11 | Landing "For Teaching" orphan bullet fragment mend | &sect;2 | No |
| 12 | Missing PRC entries added as draft:true stubs (Encompassing Diversity + Feedback: No Critique) | &sect;6 | Yes (draft:true visible in dev) |
| 13 | Warmup PRC entry status verified/added | &sect;1 &sect;6 | Yes if new |
| 14 | Corpus honest game count (14a partial &mdash; landing copy adapted if "hundreds" false) | &sect;1.1 &sect;4.3 | Yes (copy reflects real count) |

## 6. Acceptance criteria (mapped to spec &sect;8)

| Spec &sect;8 # | Cycle 14a delivery | Cycle 14b delivery |
|---|---|---|
| 1 (Index live, 5 axes + structure, three-column, cohesion icon-linked) | Index UI + game detail + print CSS | (no change) |
| 2 (Parse pipeline + validation report + reviewed count) | Pipeline + first-run report + 4-doc parse | 9-doc parse + landing-copy reconciliation |
| 3 (7 convictions demonstrable; Spolin list intact; Continuous Assessment on every competency page) | Honoring page + 4 competency pages + guardrail | Remaining 4 competency pages + subset pages populated |
| 4 (7-icon header, PRC-wired, two missing entries ticketed, no forked defs) | IconBar + 2 draft stubs + verified single-source rule | Client-review resolutions folded in |
| 5 (Build order: index built &rarr; #3 help page after; Orientation infographic w/ video slot) | Index built first, help page authored after; Orientation shipped w/ slot | Video asset ingestion when client provides |
| 6 (Rock Solid: reusable blocks, name unchanged pending, self-assessment interactive, workshops CTA honest) | Rock Solid restructured + wired | (no change) |
| 7 (Warmup canonical, Cool-down surfaced, OLD absent, harvest recorded) | Warmup ships; harvest ticketed | Harvest decision applied if client chooses |
| 8 (Resilience header corrected; Rhythm resolved; Storytelling / Story Making unified; CA subsets in landing) | Resilience header fix + Story-Making default + CA subsets added | Site-wide reconciliation after client picks |
| 9 (Jabberwocky page: attribution + gesture notation + media slot; Outrageous Roll Call w/ inclusion passage) | Jabberwocky page has attribution + media slot + gesture notation preserved from Cycle 1 seed; Outrageous Roll Call inclusion passage preserved | (no change) |
| 10 (All &sect;6 contracts resolve; three landing teasers land) | Resolutions on Resilience + Vocal Expression + landing itself | (no change) |
| 11 (Zero stripping-registry occurrences; zero Silverstein) | Guardrail added; site-wide Silverstein replacement | Silverstein guardrail promoted to blocking |
| 12 (/submit reflects governance decision; add-a-game README delivered) | /submit ships honest chip; README delivered | Live handler when Lola decides |

## 7. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Drive MCP re-auth fails mid-cycle for the 4 corpus docs | Medium | Session-verified 2026-08-14; corpus doc IDs captured; fallback = manual `.md` export. |
| Parse extractor misclassifies game blocks (headings vary by doc) | High | Fixture-driven Vitest test; hand-review of every emitted MDX; `.mdx.new` no-clobber default. |
| SSR-first + Preact hydration diverge visually (row shape) | Medium | Shared style block; smoke-test asserts row count invariant across SSR/hydration. |
| Redirect stubs break existing external inbound links | Low | Meta-refresh works for browsers + search engines; smoke test asserts redirect resolves. |
| 17 Spolin games' per-game source lines drift from Honoring table | Medium | Vitest asserts count + source-prefix match. |
| Landing "For Teaching" orphan bullet mend introduces off-voice copy | Low | Light editorial mend only; client sign-off ticketed. |
| Print CSS breaks in the Preact-hydrated Index render | Low | Print styles applied to SSR shell; hydration doesn&rsquo;t change semantic markup. |
| Corpus MDX regeneration accidentally clobbers hand-edits | Low | `.mdx.new` no-clobber default; `--force` opt-in. |
| Route restructure breaks internal cross-links in other sections | Medium | Grep pass during Track A; smoke test navigates old paths + confirms redirects. |
| PRC concept slug rename (feedback-no-critique vs. earlier proposal) | Low | Hard-coded in `icon-bar-map.ts`; touching one file to rename. |

## 8. Rollout

1. Branch `cycle-14a-theatre-games-flagship` off `main`.
2. Follow implementation plan (next skill: `writing-plans`).
3. Merge with `--no-ff` after all Vitest + Playwright + axe pass and CLAUDE.md is updated.
4. Deliver client review bundle to Lola/Desirae/Cherie/Steve for the 14 open items.
5. Cycle 14b opens after client responds on the naming decisions that unblock corpus completion (Story Making vs. Storytelling; CA subset labels).
