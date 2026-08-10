# DT:FC Website — Cycle 1 Design

**Date:** 2026-08-10
**Source spec:** `/Users/cnote/Downloads/dtfc-website-spec.md` (v1.0 draft, August 2026)
**Scope:** First of multiple implementation cycles. Delivers the site skeleton, design identity, content pipeline, Players Resource Center + ICON system, and the Theatre Games flagship section. Other sections ship as routed stubs.

---

## 1. Decomposition Rationale

The source spec covers a full content platform across 9 sections with ~60 source documents, an interactive timeline, forms, search, print PDFs, and audio embeds. Its own §9 lists a 10-phase build order. That's too much for a single spec → plan → implementation cycle.

This document scopes **Cycle 1**. Subsequent cycles will each get their own spec:

- Cycle 2 — Shakespeare section (script libraries, Ask Shakespeare, side-by-side Colloquial)
- Cycle 3 — Children's Theatre (script pages, print stylesheet emphasis, Wayfarer's Journey SVG)
- Cycle 4 — Legacy (founders, essays, interactive Timeline component)
- Cycle 5 — Community, forms, newsletter integration, testimonials
- Cycle 6 — Cross-site search (Pagefind), analytics, launch checklist
- Cycle N — Web 2.0 items (deferred per source spec §5)

---

## 2. Cycle 1 Scope

### 2.1 Ships in Cycle 1

- Astro 5 + Tailwind CSS v4 project scaffold with TypeScript strict
- Warm-editorial design identity: terracotta / teal / mustard palette, Fraunces + Inter typography, design tokens in a Tailwind v4 `@theme` block
- Site chrome: header with 7-item nav (spec order), footer with newsletter signup UI, print stylesheet, skip-to-content, mobile menu
- Content pipeline: Astro content collections with Zod schemas for `games` and `concepts`
- **Players Resource Center** section: alphabetical concept list + per-concept detail pages, seeded with ~10 highest-value concepts
- **ICON system** — the `<Concept id="…" />` component with popover, keyboard-accessible via native Popover API, used inline throughout Theatre Games copy
- **Theatre Games** section:
  - Landing page with verbatim spec copy, five-competency explainer, cohesion explainer, audience-use blurbs
  - `/theatre-games/finder` — filterable Game Index (competency, subset, cohesion, structure, intent, name); URL-serialized filter state; live result count; "How to Use the Index" help modal (annotated static screenshot)
  - `/theatre-games/[slug]` — individual game detail with print styling and sample-content badge
- **Seed content:**
  - 2 real games from source spec (Puppets/Marionettes, Changing Person/Activity)
  - 8 additional games pulled from client's Google Drive folder at implementation time (via Google Drive MCP)
  - ~10 concepts: `cohesion`, `warmup`, `competency`, `magic-toolbox`, `facilitation`, `fearless-creativity`, `players`, `resilience`, `theatre-games`, `archetype` (the `theatre-games` concept covers "Theatre Games: What Are They?" from source spec §4.6 and is referenced inline on the Theatre Games landing page)
- **Routed stubs** for the other 5 nav sections (Community, Shakespeare, Children's Theatre, Legacy, Workshops), each using the same `SectionLayout` so the pattern is proven
- **Landing page** — minimal v1: center welcome (spec's Pua-approved text, verbatim) + six section boxes with one-line summaries + secondary Workshops box; teaser-question rotation exists as data but is not rendered
- **CLAUDE.md** at repo root capturing project purpose, conventions, and spec pointer

### 2.2 Explicitly deferred to later cycles

- Cross-site search (Pagefind) — Cycle 6
- Interactive Timeline component — Cycle 4
- Working form submissions (Ask Shakespeare, testimonial, membership interest, contribute, contact) — Cycle 5
- Ask Shakespeare Q&A archive — Cycle 2
- Side-by-side Colloquial Shakespeare, audio player for Pidgin Midsummer — Cycle 2
- Per-script PDF downloads — Cycle 3 (print stylesheet ships in Cycle 1; PDF generation later)
- Privacy-respecting analytics — Cycle 6
- Full landing page with rotating teaser questions from spec §4.1 "Idea Two" — Cycle 5
- Narrated video pop-ups (Orientation, Index how-to) — later
- Wayfarer's Journey Wheel SVG — Cycle 3
- All Web 2.0 items from source spec §5: accounts, gating, payments, submissions workflows, Workshops content, "All that came after" careers section

### 2.3 Deployment

Local development only (`pnpm dev`) for Cycle 1. No hosting/deployment configuration until the user is ready to share a URL with the client, at which point host selection (Netlify / Vercel / Cloudflare Pages) and CI become a small separate task.

---

## 3. Technical Stack

- **Framework:** Astro 5 with `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/preact` (for the single Game Finder island)
- **Styling:** Tailwind CSS v4 via Vite plugin, CSS-first config with `@theme` block in `src/styles/tokens.css`
- **Language:** TypeScript strict
- **Content:** Astro content collections; frontmatter validated by Zod schemas
- **Interactive islands:** Preact (~4KB) for the Game Finder only; vanilla JS + native Popover API for Concept popovers; no framework for the rest of the site
- **Package manager:** pnpm
- **Formatter:** Prettier + `prettier-plugin-astro` + `prettier-plugin-tailwindcss`
- **Testing:** Vitest (unit — filter reducer, URL serialization, concept lookup), Playwright (single smoke test), Astro build-time content validation via Zod + a small AST checker for Concept id references

---

## 4. Repository Layout

```
/Users/cnote/projects/dtfc/
├── CLAUDE.md
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .prettierrc
├── .gitignore
├── docs/
│   └── superpowers/specs/          # this file + future cycle specs
├── public/
│   ├── DTFC-logo.png               # placeholder until client delivers
│   └── icons/
│       └── placeholder.svg         # single placeholder used until Desirae ships artwork
├── src/
│   ├── content.config.ts           # Zod schemas for games + concepts
│   ├── content/
│   │   ├── games/                  # one .md / .mdx per game
│   │   └── concepts/               # one .md / .mdx per PRC entry
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Nav.astro
│   │   │   └── Container.astro
│   │   ├── concept/
│   │   │   ├── Concept.astro       # <Concept id="cohesion" />
│   │   │   └── ConceptPopover.astro
│   │   ├── games/
│   │   │   ├── GameFinder.tsx      # Preact island
│   │   │   ├── GameCard.astro
│   │   │   ├── GameDetail.astro
│   │   │   ├── IndexFilters.tsx    # Preact, child of GameFinder
│   │   │   └── HowToModal.astro
│   │   └── ui/
│   │       ├── Button.astro
│   │       ├── Chip.astro
│   │       ├── NewsletterSignup.astro
│   │       └── PrintButton.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── SectionLayout.astro     # implements spec §3.3 recurring pattern
│   │   └── ConceptLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── theatre-games/
│   │   │   ├── index.astro
│   │   │   ├── finder.astro
│   │   │   └── [slug].astro
│   │   ├── resource-center/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── community/index.astro   # stub
│   │   ├── shakespeare/index.astro # stub
│   │   ├── childrens-theatre/index.astro # stub
│   │   ├── legacy/index.astro      # stub
│   │   ├── workshops/index.astro   # "Coming Next Year" stub
│   │   └── styles-preview.astro    # unlisted internal token / contrast reference
│   ├── data/
│   │   └── landing.ts              # section box copy + teaser questions (Idea One + Idea Two)
│   ├── styles/
│   │   ├── tokens.css              # Tailwind v4 @theme
│   │   ├── global.css              # base, typography, focus rings
│   │   └── print.css               # print stylesheet
│   └── lib/
│       ├── concepts.ts             # icon registry, slug lookup
│       └── gameFilter.ts           # pure reducer + URL serialization
├── tests/
│   ├── unit/
│   │   ├── gameFilter.test.ts
│   │   └── concepts.test.ts
│   └── e2e/
│       └── smoke.spec.ts
└── playwright.config.ts
```

---

## 5. Content Model

### 5.1 `games` collection

One Markdown/MDX file per game under `src/content/games/`. Frontmatter validated by Zod:

```typescript
const games = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/games' }),
  schema: z.object({
    name: z.string(),
    competency: z.enum([
      'physical-expression',
      'vocal-expression',
      'context-awareness',
      'risk-assessment',
      'resilience',
    ]),
    subset: z.string().optional(),
    structure: z.enum(['individual', 'group']),
    cohesion: z.enum(['low', 'medium', 'high']),
    intent: z.string(),
    source: z.string().optional(),
    sample: z.boolean().default(false),
  }),
});
```

Game body is MDX with three conventional headings the detail template renders:

```mdx
## Preparation

…facilitator setup + steps…

## Facilitation

…what happens in the room…

## Evaluation

…debrief prompts, game-specific…
```

`sample: true` renders a subtle badge on the detail page and card (so the client can distinguish filler seeds from real imports).

### 5.2 `concepts` collection

One file per Players Resource Center entry under `src/content/concepts/`:

```typescript
const concepts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/concepts' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(), // matches filename, used by <Concept id="…" />
    shortDefinition: z.string().max(240), // popover text
    icon: z.string().default('placeholder'),
    related: z.array(z.string()).default([]),
  }),
});
```

Body is MDX — full definition, examples, "how facilitators use this" section.

---

## 6. The ICON / Concept System

Central cross-cutting feature. Same API works in .astro components and .mdx bodies.

### 6.1 Component API

```astro
Every game is rated <Concept id="cohesion" /> Low, Medium, or High.
```

- Renders inline `<button popovertarget="concept-cohesion">` with SVG icon + concept name
- Native Popover API (`popover=auto`) — no JS framework required
- Popover contents: icon, name, `shortDefinition`, "Read more →" link to `/resource-center/<slug>/`
- Keyboard: `Enter` / `Space` opens, `Esc` closes, `Tab` reaches the link
- Hover on desktop, tap on mobile, focus for keyboard — all open the popover
- Missing / typoed `id` → build fails loudly with the offending file path

### 6.2 Icon strategy

- `/public/icons/placeholder.svg` — labeled circle badge, used by every concept until final artwork lands
- Each concept's `icon` frontmatter field is the SVG filename (without extension)
- When Desirae delivers real icons, they drop into `/public/icons/` and each concept's frontmatter is updated — no code changes required

### 6.3 PRC landing page (`/resource-center/`)

- Alphabetical list of all concepts, each row: icon, name, `shortDefinition`
- Filter-as-you-type search box (client-side, ~30 lines of vanilla JS)
- Top callout answers the source spec's landing-page teaser: "What are the ICONS and how are they used?"

### 6.4 Concept detail page (`/resource-center/<slug>/`)

- Header: icon, name
- Body: full MDX
- "Related Resources" chips linking to other concepts (from `related` frontmatter)
- Deep-linkable target for popover "Read more" links

---

## 7. Theatre Games Section

### 7.1 Landing (`/theatre-games/`)

Rendered with `SectionLayout`. Content:

- Verbatim landing copy from the source spec's "DT:FC THEATRE GAMES LANDING PAGE" document
- Definition using `<Concept id="theatre-games" />`
- **Five Competencies** — 5 cards, each with name, one-line definition, and subset list
- **Cohesion** explainer using `<Concept id="cohesion" />`; Low/Medium/High rubric
- Audience-specific "You can use Theatre Games for…" blurbs (teaching, rehearsal, counseling, warmups)
- Prominent CTA card → "Find a Game" → `/theatre-games/finder`

### 7.2 Game Index (`/theatre-games/finder`)

Layout:

- Left rail (or top on mobile): filter panel
- Main: card grid of `<GameCard>` results
- Header: title + result count + "How to Use the Index" button + "Reset filters" link

Filters (AND across filters, OR within multi-select):

- **Competency** — 5 chip toggles
- **Subset** — dropdown; options limited to subsets of currently-selected competencies
- **Cohesion** — 3 chip toggles (Low / Medium / High)
- **Structure** — 2 chip toggles (Individual / Group)
- **Intent** — free-text substring search (case-insensitive)
- **Name** — free-text substring search (case-insensitive)

State:

- Filter state serialized to URL query string; deep-linkable and browser back/forward-safe
- All game data inlined at build time as a JSON prop to the Preact island
- No pagination in v1; virtualization considered later if list grows past ~500

Island: `<GameFinder client:load>` — single Preact component holding filter state, rendering `<IndexFilters>` + card grid. Filter logic lives in `src/lib/gameFilter.ts` as a pure reducer with unit tests.

### 7.3 How-To Use the Index modal

Icon button in the finder header opens a modal with an annotated static screenshot walking through the filter behavior. Modal uses `<dialog>`. Video pop-up variant deferred to a later cycle per source spec.

### 7.4 Game detail page (`/theatre-games/[slug]`)

- Header: name, competency chip, cohesion badge, structure icon, intent, source attribution
- Body: MDX rendered with Preparation / Facilitation / Evaluation sections
- Concept icons render inline anywhere in the body
- Sticky "Print this game" button; print stylesheet drops nav / chips / shadows and uses serif at 11pt
- `sample: true` frontmatter → "sample content — pending final import" badge in header

---

## 8. Site Chrome

### 8.1 Header

- Logo (placeholder PNG) linking to `/`
- Nav items right, in source-spec order: Community, Theatre Games, Shakespeare, Children's Theatre, Legacy, Players Resource Center, Workshops
- Workshops rendered with a small "Coming Next Year" badge (visually secondary)
- Current section gets an underline
- Mobile: hamburger button opens a full-height sheet with the same items
- Skip-to-content link is the first focusable element on every page

### 8.2 Footer

- **Left:** DT:FC name + "Fiscally sponsored by We Tell Stories, Inc., a California 501(c)(3)"
- **Middle:** two-column nav mirror
- **Right:** newsletter signup — email input + "Notify me" button
  - v1: form submits to a placeholder handler that logs to console (no network call)
  - `TODO(esp)` comment marks the integration point; documented in CLAUDE.md
  - Copy: "Get monthly DT:FC news, new games, and new plays." + "We won't share your email."
- **Bottom bar:** copyright line + About link + Donate link (donate link is a placeholder anchor until client provides Zeffy URL)

### 8.3 Stub pages

Five section landings, all live at real routes using `SectionLayout`. Each shows the section title + a "coming soon" body describing what will land there, sourced from the corresponding section in the source spec (§4.3–4.7).

| Route                 | Purpose                                                               |
| --------------------- | --------------------------------------------------------------------- |
| `/community/`         | About DT:FC teaser + email capture                                    |
| `/shakespeare/`       | List of forthcoming content from spec §4.3                            |
| `/childrens-theatre/` | List of forthcoming scripts (Water of Life, One Seed Child, etc.)     |
| `/legacy/`            | Short Colorado Caravan paragraph + "History and timeline coming soon" |
| `/workshops/`         | "Coming Next Year" + email interest capture                           |

### 8.4 Landing page (`/`)

Minimal v1:

- Center welcome box: "COMMUNITY — Be Fearlessly Creative!" + Pua's approved welcome text (source spec §2, verbatim)
- Six section boxes: Community, Theatre Games, Shakespeare, Children's Theatre, Legacy, Players Resource Center — each with icon + one-line summary (source spec §4.1 "Idea One")
- Seventh secondary box: Workshops with "Coming Next Year" badge
- Teaser questions from source spec's "Idea Two" exist as data (`src/data/landing.ts`) but are not rendered — added in a later cycle
- Footer newsletter signup prominent

---

## 9. Visual Identity

### 9.1 Design language

Not flat corporate SaaS; not cutesy elementary. Editorial + handmade — the calm confidence of a well-designed nonprofit, warmed up with the palette. Generous whitespace, high-contrast body type, larger-than-default base size for readability by older legacy members and teachers.

### 9.2 Color palette

- **Primary — Clay / terracotta** `#B85238` (stage-curtain warmth)
- **Secondary — Deep teal** `#2C6E7A` (grounding, "resilience")
- **Accent — Mustard** `#D9A94A` (sparingly, for callouts and chips)
- **Neutrals:** ivory background `#FBF7F0`, ink `#1B1B1B`, muted `#5C544A`
- All pairings validated against WCAG AA (4.5:1 body, 3:1 large)
- A `/styles-preview` internal-only page (unlisted, built but not linked) documents tokens with live contrast checks; useful when Desirae reviews

### 9.3 Typography

- **Display / headings:** Fraunces (variable, Google Fonts, self-hosted, `font-display: swap`)
- **Body:** Inter (variable, self-hosted, `font-display: swap`) at 17px / 1.6
- **Mono:** system stack

### 9.4 Tokens (Tailwind v4 `@theme` in `src/styles/tokens.css`)

```css
@theme {
  --color-clay-500: #b85238;
  --color-teal-600: #2c6e7a;
  --color-mustard-400: #d9a94a;
  --color-ivory-50: #fbf7f0;
  --color-ink-900: #1b1b1b;
  --color-ink-500: #5c544a;
  --font-display: 'Fraunces', ui-serif, Georgia, serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --text-base: 1.0625rem;
  --leading-body: 1.6;
  --radius-card: 0.75rem;
  --shadow-soft: 0 1px 2px rgb(0 0 0 / 0.06), 0 8px 24px -12px rgb(0 0 0 / 0.15);
}
```

### 9.5 Component styling patterns

- **Chips** (competency, cohesion): rounded-full, subtle tint from the color the chip represents, ink text
- **Cards** (games in finder): ivory-on-ivory with soft shadow, terracotta border on hover
- **Buttons:** primary filled terracotta; secondary outlined ink; text links use terracotta underline with `text-underline-offset`
- **Print:** strip color, shadow, nav; standard serif, 11pt body

### 9.6 Motion

- `prefers-reduced-motion` honored throughout
- Popovers fade in ~120ms
- No hero animations, no scroll-jacking

---

## 10. Testing

- **Content validation:** Astro/Zod schemas fail the build on bad frontmatter. Additional AST check: every `<Concept id="…">` in .astro + .mdx files must resolve to a real concept slug.
- **Unit (Vitest):**
  - `gameFilter.test.ts` — pure reducer: given filter state + game list, returns correct subset; covers combinations, edge cases (empty filters, no matches), URL ↔ state roundtrip
  - `concepts.test.ts` — icon fallback to placeholder when file missing; slug lookup
- **E2E (Playwright):** single smoke test that visits landing / PRC / Theatre Games / finder, verifies nav present, filter narrows results, Concept popover opens and closes on keyboard, no console errors
- **Not** in scope: visual regression, per-page snapshots, cross-browser matrix

---

## 11. Accessibility (WCAG 2.1 AA)

- Skip-to-content link on every page
- `:focus-visible` ring on every interactive element
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>` used correctly
- Concept popovers use the native Popover API (`popover=auto`) for correct semantics and keyboard behavior
- Game finder filters: labeled fieldsets; live region announces result-count changes
- Palette pairings validated AA; documented on the `/styles-preview` page
- `prefers-reduced-motion` honored
- Local `axe` checks during dev; automated `pa11y` in CI added in a later cycle

---

## 12. Open Blockers That Could Affect Cycle 1

Only three of the source spec §8 items actually gate Cycle 1 implementation:

1. **Google Drive folder link** — needed at implementation time to pull the 8 seed games and any concept source docs. User will provide the link when implementation starts; Google Drive MCP is available.
2. **DTFC logo asset** — placeholder ships until the client delivers the final PNG.
3. **Icon artwork (Desirae)** — placeholder icons ship; final SVGs drop into `/public/icons/` and each concept's `icon` frontmatter is updated. No code change required.

All other source-spec §8 items (membership, Workshop Manual, timeline canonical version, licensing, ESP choice, moderated submissions) are out of Cycle 1 scope and don't block us.

---

## 13. Success Criteria

Cycle 1 is complete when:

- `pnpm dev` starts a working local site
- All 7 nav items resolve; the 5 stub sections show intentional placeholder content
- `/theatre-games/` renders with all spec-required sections and inline Concept icons
- `/theatre-games/finder` filters by all six axes; URL round-trips filter state; result count is announced to screen readers
- `/theatre-games/[slug]` renders correctly for the 2 real seed games + the 8 imported games, prints cleanly
- `/resource-center/` and `/resource-center/[slug]/` render all seeded concepts
- Concept popovers work with mouse, touch, and keyboard
- Vitest unit tests pass; Playwright smoke test passes
- `pnpm build` produces a valid static site with no errors and no unresolved Concept ids
- Basic AA audit clean on landing, PRC, Theatre Games landing, finder, and a game detail page
