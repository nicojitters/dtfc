# DT:FC Website — Claude Code Notes

**What this is:** the marketing + content site for Developmental Theatre: Fearless Creativity, built as multiple implementation cycles. Cycle 1 (current) ships the skeleton + Theatre Games flagship section. See `docs/superpowers/specs/2026-08-10-dtfc-website-cycle1-design.md`.

**Client product spec:** `/Users/cnote/Downloads/dtfc-website-spec.md` — the full 9-section brief; more sections land in subsequent cycles.

## Stack

- Astro 5, Tailwind CSS v4 (`@theme` in `src/styles/tokens.css`, no `tailwind.config.js`)
- TypeScript strict; path alias `@/*` → `src/*`
- MDX for game / concept bodies via content collections + Zod schemas (`src/content.config.ts`)
- Preact for the single interactive island (Game Finder)
- Native Popover API for the Concept popovers (no framework)
- pnpm; Vitest for unit tests; Playwright for one smoke test

## Key conventions

**Vocabulary.** Use "Players" (never "actors"), "Facilitator" (never "leader"), and the full name "Players Resource Center" in UI copy. Voice: warm, playful, encouraging, exclamation-friendly.

**Nav order.** Community, Theatre Games, Shakespeare, Children's Theatre, Legacy, Players Resource Center, Workshops — defined in `src/lib/nav.ts`.

**Concept references.** Inline concept mentions use `<Concept id="slug" />`. In .astro files, import `Concept` from `@/components/concept/Concept.astro`. In MDX bodies, pass it via `<Content components={{ Concept }} />` in the layout that renders the MDX (see `src/pages/theatre-games/[slug].astro`).

**Adding a concept.** Drop `src/content/concepts/<slug>.mdx` with the schema in `src/content.config.ts`. Icon defaults to `placeholder`; when Desirae's artwork lands, drop `<slug>.svg` in `public/icons/` and update the frontmatter `icon` field. The prebuild script `scripts/check-concept-refs.mjs` fails the build on any typo'd `<Concept id="…">`.

**Adding a game.** Drop `src/content/games/<slug>.mdx` with the frontmatter in `src/content.config.ts`. Body has H2s for `## Preparation`, `## Facilitation`, `## Evaluation`. Set `sample: true` for placeholders; `false` for real client content.

**Design tokens.** All colors, fonts, and spacing come from `src/styles/tokens.css`. Do not hardcode hex codes in components. The unlisted `/styles-preview` page is the design-system reference (share the URL with Desirae).

## Commands

- `pnpm dev` — dev server at http://localhost:4321
- `pnpm build` — runs the Concept ref check then builds
- `pnpm check` — Astro type check
- `pnpm test` — Vitest unit tests
- `pnpm test:e2e` — Playwright smoke test (starts its own dev server)
- `pnpm format` — Prettier

## Deferred / TODO markers

- `TODO(esp)` in `src/components/ui/NewsletterSignup.astro` — the form submits to console; wire to the client's chosen ESP when picked.
- Donate link in `src/components/layout/Footer.astro` — currently points to `/community/`; replace with Zeffy URL when client provides.
- Placeholder icons in `public/icons/` — replace when Desirae delivers.
- `public/DTFC-logo.png` — placeholder; replace with client asset.

## Blockers for future cycles

See `docs/superpowers/specs/2026-08-10-dtfc-website-cycle1-design.md` §2.2 for what each subsequent cycle covers, and source spec §8 for open questions (membership tiers, timeline canonical version, Workshop Manual text, etc.).
