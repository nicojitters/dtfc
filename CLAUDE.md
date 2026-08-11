# DT:FC Website — Claude Code Notes

**What this is:** the marketing + content site for Developmental Theatre: Fearless Creativity, built as multiple implementation cycles. Cycle 1 (current) ships the skeleton + Theatre Games flagship section. See `docs/superpowers/specs/2026-08-10-dtfc-website-cycle1-design.md`.

**Client product spec:** `/Users/cnote/Downloads/dtfc-website-spec.md` — the full 9-section brief; more sections land in subsequent cycles.

## Stack

- Astro 5, Tailwind CSS v4 (`@theme` in `src/styles/tokens.css`, no `tailwind.config.js`)
- TypeScript strict; path alias `@/*` → `src/*`
- MDX for game / concept bodies via content collections + Zod schemas (`src/content.config.ts`)
- MDX-with-components pattern is used for Colloquial pairings — `<SideBySide>` / `<Original>` / `<Colloquial>` (see `src/components/shakespeare/`).
- Preact for the single interactive island (Game Finder)
- Native Popover API for the Concept popovers (no framework)
- pnpm; Vitest for unit tests; Playwright for one smoke test

## Key conventions

**Vocabulary.** Use "Players" (never "actors"), "Facilitator" (never "leader"), and the full name "Players Resource Center" in UI copy. Voice: warm, playful, encouraging, exclamation-friendly.

**Nav order.** Community, Theatre Games, Shakespeare, Children's Theatre, Legacy, Players Resource Center, Workshops — defined in `src/lib/nav.ts`.

**Concept references.** Inline concept mentions use `<Concept id="slug" />`. In .astro files, import `Concept` from `@/components/concept/Concept.astro`. In MDX bodies, pass it via `<Content components={{ Concept }} />` in the layout that renders the MDX (see `src/pages/theatre-games/[slug].astro`).

**Adding a concept.** Drop `src/content/concepts/<slug>.mdx` with the schema in `src/content.config.ts`. Icon defaults to `placeholder`; when Desirae's artwork lands, drop `<slug>.svg` in `public/icons/` and update the frontmatter `icon` field. The prebuild script `scripts/check-concept-refs.mjs` fails the build on any typo'd `<Concept id="…">`.

**Shakespeare content collections.** Three collections live under `src/content/`:
- `scripts/` — one file per script, `library` frontmatter is one of
  `soliloquies | scenes | themes | cuttings | childrens-shakespeare`. `theme` is
  required when `library === 'themes'`. Body H2s: `## Production Notes`,
  `## Script`, `## Facilitator Notes`.
- `ask-shakespeare/` — one file per Q&A column, unique `columnNumber`, body
  H2s: `## The Question`, `## Shakespeare Answers`.
- `colloquial/` — one file per side-by-side pairing, body uses
  `<SideBySide><Original>…</Original><Colloquial>…</Colloquial></SideBySide>`.

**Audio files** live at `/public/audio/` with ASCII-only kebab-case filenames
(e.g. `midsummah-pidgin-paka.mp4`).

**Shakespeare sub-nav** (`src/lib/shakespeare-nav.ts`) drives the persistent
sub-nav rendered by `src/layouts/ShakespeareLayout.astro` on every
`/shakespeare/*` page. Add a new sub-page → append to `SHAKESPEARE_NAV` and
create the route.

**Adding a Shakespeare script.** Drop `src/content/scripts/<slug>.mdx` with
`library` set to one of the five values. Themes entries must also set `theme`.
Body sections `## Production Notes` / `## Script` / `## Facilitator Notes`.

**Adding a game.** Drop `src/content/games/<slug>.mdx` with the frontmatter in `src/content.config.ts`. Body has H2s for `## Preparation`, `## Facilitation`, `## Evaluation`. Set `sample: true` for placeholders; `false` for real client content.

**Adding an Ask Shakespeare column.** Drop `src/content/ask-shakespeare/<slug>.mdx`
with a unique `columnNumber` and an `excerpt` ≤ 200 chars. Body sections
`## The Question` / `## Shakespeare Answers`.

**Adding a Colloquial pairing.** Drop `src/content/colloquial/<slug>.mdx`. If
audio is provided, place the file at `/public/audio/<filename>.mp4` and set
`audio: <filename>.mp4` in frontmatter (bare filename — the AudioEmbed
component and the Vitest existence test both prepend `/audio/`). Body uses
`<SideBySide>` blocks with alternating `<Original>` / `<Colloquial>` children.

**Design tokens.** All colors, fonts, and spacing come from `src/styles/tokens.css`. Do not hardcode hex codes in components. The unlisted `/styles-preview` page is the design-system reference (share the URL with Desirae).

**Landing page data.** All landing-page copy — Community center text, section tiles, reflective banks, and the Idea Two answer map — lives in `src/data/landing.ts`, Zod-validated at import. The single line `export const LANDING_MODE: BoxMode = 'hybrid'` toggles every section tile's render mode (`list` | `questions` | `hybrid`). Per-box overrides go on the tile's `mode` field.

**Component directories.** Landing components live under `src/components/landing/`; the shared reflective prompt component lives under `src/components/section/`.

## Commands

- `pnpm dev` — dev server at http://localhost:4321
- `pnpm build` — runs the Concept ref check and prohibited-text guardrail then builds
- `pnpm check` — Astro type check
- `pnpm test` — Vitest unit tests
- `pnpm test:e2e` — Playwright smoke test (starts its own dev server)
- `pnpm check:prohibited` — runs the prohibited-text guardrail (fails build on any occurrence of the vision-spec-rejected phrases; runs automatically in `pnpm build`)
- `pnpm format` — Prettier

## Deferred / TODO markers

- `TODO(esp)` in `src/components/ui/NewsletterSignup.astro` — the form submits to console; wire to the client's chosen ESP when picked.
- `TODO(esp)` in `src/components/landing/NewsletterTile.astro` — inherits the same ESP integration TODO as the footer signup.
- `TODO(esp)` in `src/components/shakespeare/AskShakespeareForm.astro` — inherits the same ESP TODO as `NewsletterTile` and the footer signup.
- Donate link in `src/components/layout/Footer.astro` — currently points to `/community/`; replace with Zeffy URL when client provides.
- Placeholder icons in `public/icons/` — replace when Desirae delivers.
- `public/DTFC-logo.png` — placeholder; replace with client asset.

## Blockers for future cycles

See `docs/superpowers/specs/2026-08-10-dtfc-website-cycle1-design.md` §2.2 for what each subsequent cycle covers, and source spec §8 for open questions (membership tiers, timeline canonical version, Workshop Manual text, etc.).
