# DT:FC Website — Cycle 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Cycle 1 slice of the DT:FC website — Astro + Tailwind v4 scaffold, warm-editorial design identity, content pipeline, Players Resource Center + ICON system, and a filterable Theatre Games section — with the other five nav sections as routed stubs.

**Architecture:** Astro 5 static site with content collections for games and concepts, one Preact island for the Game Finder, native Popover API for the Concept popovers, Tailwind v4 with `@theme` design tokens, print stylesheet for game handouts.

**Tech Stack:** Astro 5, Tailwind CSS v4, TypeScript strict, Preact (single island), MDX, Zod, Vitest, Playwright, pnpm, Prettier.

**Design spec (authoritative):** `docs/superpowers/specs/2026-08-10-dtfc-website-cycle1-design.md`
**Client product spec (context):** `/Users/cnote/Downloads/dtfc-website-spec.md`

## Global Constraints

- **Working directory:** `/Users/cnote/projects/dtfc`. All shell commands assume this cwd.
- **Framework:** Astro 5.x (do not use v3 or v4 patterns). Tailwind CSS 4.x (uses `@tailwindcss/vite`, not `@astrojs/tailwind`; config lives in CSS `@theme` blocks, not `tailwind.config.js`).
- **TypeScript:** strict mode; no `any` unless explicitly justified.
- **Package manager:** pnpm exclusively.
- **Node:** 20.x or 22.x.
- **Nav order (verbatim, always):** Community, Theatre Games, Shakespeare, Children's Theatre, Legacy, Players Resource Center, Workshops.
- **Vocabulary:** "Players" (never "actors"), "Facilitator" (never "leader"), "Players Resource Center" (not "Resource Center" alone in UI copy).
- **Voice:** warm, playful, encouraging, exclamation-friendly; never preachy.
- **Rallying line:** "Be Fearlessly Creative!" (appears on landing page).
- **Fiscal-sponsor line (footer):** "Fiscally sponsored by We Tell Stories, Inc., a California 501(c)(3)".
- **The Concept API is exactly `<Concept id="slug" />`.** No variants.
- **A11y:** WCAG 2.1 AA — skip-to-content link, `:focus-visible` rings, semantic HTML, contrast ≥4.5:1 body / ≥3:1 large, `prefers-reduced-motion` honored, all interactive elements keyboard operable.
- **Commits:** conventional prefix (`feat:`, `test:`, `chore:`, `docs:`), imperative mood, ≤72-char subject. Include `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` when created by Claude.
- **Do not use `--no-verify` or `-c commit.gpgsign=false`.** If a hook fails, fix the underlying issue.

---

## File Structure

Files created across all tasks (grouped by responsibility):

**Root config**
- `package.json` — deps + scripts (Task 1)
- `pnpm-workspace.yaml` — none needed; single-package repo
- `tsconfig.json` — Astro's strict base + path alias `@/*` → `src/*` (Task 1)
- `astro.config.mjs` — integrations: mdx, sitemap, preact; vite plugin: tailwindcss (Tasks 1–2, 11)
- `.gitignore`, `.prettierrc`, `.prettierignore`, `.editorconfig` (Task 1)
- `vitest.config.ts` (Task 10)
- `playwright.config.ts` (Task 14)
- `CLAUDE.md` (Task 15)

**Styles**
- `src/styles/tokens.css` — `@theme` design tokens (Task 2)
- `src/styles/global.css` — Tailwind import, font imports, base styles (Task 2)
- `src/styles/print.css` — print stylesheet (Task 12)

**Layouts + chrome**
- `src/layouts/BaseLayout.astro` (Task 3)
- `src/layouts/SectionLayout.astro` (Task 4)
- `src/layouts/ConceptLayout.astro` (Task 7)
- `src/components/layout/Header.astro`, `Nav.astro`, `Footer.astro`, `Container.astro`, `SkipLink.astro` (Task 3)
- `src/components/ui/NewsletterSignup.astro`, `Button.astro`, `Chip.astro` (Task 3)

**Pages**
- `src/pages/index.astro` (Task 4)
- `src/pages/community/index.astro`, `shakespeare/index.astro`, `childrens-theatre/index.astro`, `legacy/index.astro`, `workshops/index.astro` (Task 4)
- `src/pages/styles-preview.astro` (Task 2)
- `src/pages/resource-center/index.astro`, `[slug].astro` (Task 7)
- `src/pages/theatre-games/index.astro` (Task 9)
- `src/pages/theatre-games/finder.astro` (Task 11)
- `src/pages/theatre-games/[slug].astro` (Task 12)

**Content**
- `src/content.config.ts` — collections + Zod schemas (Task 5)
- `src/content/games/puppets-marionettes.mdx`, `changing-person-activity.mdx` (Task 5); 8 more (Task 13)
- `src/content/concepts/cohesion.mdx`, `theatre-games.mdx` (Task 5); 8 more (Task 13)
- `src/data/landing.ts` — landing-page section-box copy + teaser questions (Task 4)

**Concept system**
- `src/components/concept/Concept.astro` (Task 6)
- `src/components/concept/ConceptPopover.astro` (Task 6)
- `src/lib/concepts.ts` — slug lookup for concept entries (Task 6)
- `src/lib/icons.ts` — icon path resolution with disk-based fallback (Task 6, split out so Vitest doesn't need Astro's runtime)
- `tests/unit/icons.test.ts` (Task 6)
- `scripts/check-concept-refs.mjs` — prebuild AST check (Task 8)
- `public/icons/placeholder.svg` (Task 6)

**Games section**
- `src/lib/gameFilter.ts` — pure filter reducer + URL serialization (Task 10)
- `tests/unit/gameFilter.test.ts` (Task 10)
- `src/components/games/GameFinder.tsx` — Preact island (Task 11)
- `src/components/games/IndexFilters.tsx` — Preact child (Task 11)
- `src/components/games/GameCard.astro` (Task 11)
- `src/components/games/HowToModal.astro` (Task 11)

**E2E**
- `tests/e2e/smoke.spec.ts` (Task 14)

---

## Tasks

### Task 1: Project scaffold

Produce a running Astro 5 site at `localhost:4321` with a hello-world page.

**Files:**
- Create: `package.json`, `tsconfig.json`, `astro.config.mjs`, `.gitignore`, `.prettierrc`, `.prettierignore`, `.editorconfig`, `src/pages/index.astro`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: working `pnpm dev`, `pnpm build`, `pnpm check` scripts; TypeScript path alias `@/*` → `src/*`; MDX + Preact + sitemap integrations pre-registered so later tasks can drop into them.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "dtfc-website",
  "type": "module",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "pnpm check:concepts && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "check:concepts": "node scripts/check-concept-refs.mjs",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "format": "prettier --write ."
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/preact": "^4.0.0",
    "preact": "^10.24.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "prettier": "^3.3.0",
    "prettier-plugin-astro": "^0.14.0"
  },
  "packageManager": "pnpm@9.12.0"
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 3: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://dtfc.example.org',
  integrations: [mdx(), sitemap(), preact()],
});
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules
dist
.astro
.env
.env.*
!.env.example
playwright-report
test-results
.DS_Store
```

- [ ] **Step 5: Create `.prettierrc`**

```json
{
  "singleQuote": true,
  "semi": true,
  "printWidth": 100,
  "trailingComma": "all",
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    { "files": "*.astro", "options": { "parser": "astro" } }
  ]
}
```

- [ ] **Step 6: Create `.prettierignore`**

```
node_modules
dist
.astro
pnpm-lock.yaml
public/icons
```

- [ ] **Step 7: Create `.editorconfig`**

```
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
charset = utf-8
trim_trailing_whitespace = true
```

- [ ] **Step 8: Create `scripts/check-concept-refs.mjs` as a no-op stub**

```js
// Real implementation lands in Task 8. This stub keeps `pnpm build` runnable now.
process.exit(0);
```

- [ ] **Step 9: Create `src/pages/index.astro` (hello-world placeholder — replaced in Task 4)**

```astro
---
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>DT:FC — scaffold check</title>
  </head>
  <body>
    <h1>Developmental Theatre: Fearless Creativity</h1>
    <p>Scaffold works.</p>
  </body>
</html>
```

- [ ] **Step 10: Install dependencies**

Run: `pnpm install`
Expected: no errors; `pnpm-lock.yaml` created.

- [ ] **Step 11: Verify dev server starts**

Run: `pnpm dev` in one terminal, then `curl -s http://localhost:4321 | head -20` in another.
Expected: HTML with "Scaffold works." — stop the dev server after confirming.

- [ ] **Step 12: Verify build succeeds**

Run: `pnpm build`
Expected: exit 0; `dist/index.html` exists.

- [ ] **Step 13: Verify type check passes**

Run: `pnpm check`
Expected: exit 0; no type errors.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro 5 project with TypeScript strict"
```

---

### Task 2: Design tokens, global styles, typography

Install Tailwind v4, self-host Fraunces + Inter, define `@theme` tokens and base styles, add an unlisted `/styles-preview` page that renders every token so Desirae has a review surface.

**Files:**
- Modify: `astro.config.mjs` (add tailwindcss vite plugin), `package.json` (add deps)
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/pages/styles-preview.astro`

**Interfaces:**
- Produces: color / font / spacing tokens accessible via Tailwind utilities (`text-clay-500`, `font-display`, etc.); global font stack applied to `body`; `/styles-preview` renders all tokens.

- [ ] **Step 1: Install Tailwind v4 and font packages**

```bash
pnpm add tailwindcss @tailwindcss/vite
pnpm add @fontsource-variable/inter @fontsource-variable/fraunces
pnpm add -D prettier-plugin-tailwindcss
```

- [ ] **Step 2: Update `.prettierrc` to include Tailwind plugin**

Replace the `plugins` array:

```json
"plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
```

- [ ] **Step 3: Update `astro.config.mjs` to add the Tailwind Vite plugin**

Add the import and vite block:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://dtfc.example.org',
  integrations: [mdx(), sitemap(), preact()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 4: Create `src/styles/tokens.css`**

```css
@theme {
  /* Color — palette */
  --color-clay-50:  #fbeee9;
  --color-clay-100: #f3d1c5;
  --color-clay-300: #d68a72;
  --color-clay-500: #b85238;
  --color-clay-700: #8a3b28;

  --color-teal-100: #cfe1e5;
  --color-teal-400: #4d8f9b;
  --color-teal-600: #2c6e7a;
  --color-teal-800: #1c4b54;

  --color-mustard-200: #f4e0b0;
  --color-mustard-400: #d9a94a;
  --color-mustard-600: #a8801e;

  --color-ivory-50:   #fbf7f0;
  --color-ivory-100:  #f4ecdd;
  --color-ivory-200:  #e9dfc9;

  --color-ink-900: #1b1b1b;
  --color-ink-700: #3a3733;
  --color-ink-500: #5c544a;
  --color-ink-300: #948a7d;

  /* Typography */
  --font-display: 'Fraunces Variable', ui-serif, Georgia, serif;
  --font-body: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;

  --text-base: 1.0625rem;   /* 17px */
  --text-lg:   1.1875rem;
  --text-xl:   1.375rem;
  --text-2xl:  1.75rem;
  --text-3xl:  2.25rem;
  --text-display: clamp(2.5rem, 4vw + 1rem, 3.75rem);

  --leading-body: 1.6;
  --leading-tight: 1.2;

  /* Shape */
  --radius-card: 0.75rem;
  --radius-chip: 999px;

  /* Elevation */
  --shadow-soft: 0 1px 2px rgb(0 0 0 / 0.06), 0 8px 24px -12px rgb(0 0 0 / 0.15);

  /* Motion */
  --ease-out-soft: cubic-bezier(0.16, 1, 0.3, 1);
}
```

- [ ] **Step 5: Create `src/styles/global.css`**

```css
@import 'tailwindcss';
@import './tokens.css';
@import '@fontsource-variable/inter';
@import '@fontsource-variable/fraunces';

@layer base {
  html {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: var(--leading-body);
    color: var(--color-ink-900);
    background: var(--color-ivory-50);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-display);
    line-height: var(--leading-tight);
    color: var(--color-ink-900);
  }

  h1 { font-size: var(--text-display); font-weight: 500; }
  h2 { font-size: var(--text-3xl); font-weight: 500; }
  h3 { font-size: var(--text-2xl); font-weight: 500; }
  h4 { font-size: var(--text-xl); font-weight: 500; }

  a {
    color: var(--color-clay-500);
    text-decoration-line: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: 1px;
  }
  a:hover { color: var(--color-clay-700); }

  :focus-visible {
    outline: 2px solid var(--color-teal-600);
    outline-offset: 3px;
    border-radius: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important;
    }
  }
}

.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 6: Wire `global.css` into `src/pages/index.astro`**

Replace the current file with a version that imports the stylesheet so the browser renders with fonts + tokens:

```astro
---
import '@/styles/global.css';
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>DT:FC — style check</title>
  </head>
  <body class="p-8">
    <h1>Developmental Theatre: Fearless Creativity</h1>
    <p class="text-ink-500">Tokens + type loaded.</p>
  </body>
</html>
```

- [ ] **Step 7: Create `src/pages/styles-preview.astro`**

An unlisted internal page rendering every token — used by Desirae to review.

```astro
---
import '@/styles/global.css';

const clay = [50, 100, 300, 500, 700];
const teal = [100, 400, 600, 800];
const mustard = [200, 400, 600];
const ivory = [50, 100, 200];
const ink = [300, 500, 700, 900];
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Design tokens</title>
    <meta name="robots" content="noindex" />
  </head>
  <body class="mx-auto max-w-4xl p-8 space-y-10">
    <header>
      <h1>DT:FC design tokens</h1>
      <p class="text-ink-500">Unlisted reference page for the design system.</p>
    </header>

    <section>
      <h2>Colors</h2>
      {[
        ['clay', clay], ['teal', teal], ['mustard', mustard],
        ['ivory', ivory], ['ink', ink],
      ].map(([name, steps]) => (
        <div class="mt-4">
          <h3 class="text-lg">{name}</h3>
          <div class="mt-2 flex flex-wrap gap-2">
            {steps.map(step => (
              <div class="w-32 rounded-[var(--radius-card)] border border-ivory-200 p-3 text-sm">
                <div class={`h-16 rounded-md`} style={`background: var(--color-${name}-${step})`}></div>
                <div class="mt-2 font-mono text-xs">{name}-{step}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>

    <section>
      <h2>Typography</h2>
      <div class="mt-4 space-y-3">
        <div style="font-family: var(--font-display); font-size: var(--text-display);">Display serif</div>
        <div class="text-3xl">H2 — Fraunces 3xl</div>
        <div class="text-2xl">H3 — Fraunces 2xl</div>
        <div class="text-xl">H4 — Fraunces xl</div>
        <div class="text-base max-w-prose">
          Body copy at 17px / 1.6. This paragraph should feel calm, readable at arm's length,
          and pair naturally with the display serif. "Be Fearlessly Creative!"
        </div>
      </div>
    </section>

    <section>
      <h2>Shape + shadow</h2>
      <div class="mt-4 grid grid-cols-3 gap-4">
        <div class="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-soft)]">Card</div>
        <div class="rounded-[var(--radius-chip)] bg-clay-100 px-4 py-1 text-sm w-fit">Chip</div>
      </div>
    </section>
  </body>
</html>
```

- [ ] **Step 8: Verify the dev server renders both pages with tokens applied**

Run: `pnpm dev` in one terminal, then in another:
- `curl -s http://localhost:4321 | grep 'Tokens + type loaded'`
- `curl -s http://localhost:4321/styles-preview | grep 'design tokens'`

Expected: both matches present. Open a browser to eyeball fonts + colors. Stop the dev server.

- [ ] **Step 9: Verify build succeeds**

Run: `pnpm build`
Expected: exit 0; `dist/styles-preview/index.html` exists.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add design tokens, typography, styles-preview reference page"
```

---

### Task 3: Base layout + site chrome (Header, Nav, Footer, SkipLink)

Build the reusable page shell: BaseLayout, Header with 7-item nav (including Workshops badge), mobile menu, Footer with newsletter signup UI, skip-to-content link.

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/layout/Header.astro`, `Nav.astro`, `Footer.astro`, `Container.astro`, `SkipLink.astro`, `src/components/ui/NewsletterSignup.astro`, `Button.astro`, `Chip.astro`, `src/lib/nav.ts`

**Interfaces:**
- Produces: `<BaseLayout title="…" description="…" section="…">…</BaseLayout>` — wraps every page with header, main, footer, skip link. `section` prop marks the current nav item (one of the seven route keys). Also exports `NAV_ITEMS` from `@/lib/nav`.

- [ ] **Step 1: Create `src/lib/nav.ts`**

```ts
export type NavKey =
  | 'community'
  | 'theatre-games'
  | 'shakespeare'
  | 'childrens-theatre'
  | 'legacy'
  | 'resource-center'
  | 'workshops';

export interface NavItem {
  key: NavKey;
  label: string;
  href: string;
  comingSoon?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'community', label: 'Community', href: '/community/' },
  { key: 'theatre-games', label: 'Theatre Games', href: '/theatre-games/' },
  { key: 'shakespeare', label: 'Shakespeare', href: '/shakespeare/' },
  { key: 'childrens-theatre', label: "Children's Theatre", href: '/childrens-theatre/' },
  { key: 'legacy', label: 'Legacy', href: '/legacy/' },
  { key: 'resource-center', label: 'Players Resource Center', href: '/resource-center/' },
  { key: 'workshops', label: 'Workshops', href: '/workshops/', comingSoon: true },
];
```

- [ ] **Step 2: Create `src/components/layout/SkipLink.astro`**

```astro
---
---
<a href="#main-content"
   class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-ivory-50">
  Skip to main content
</a>
```

- [ ] **Step 3: Create `src/components/layout/Container.astro`**

```astro
---
interface Props { class?: string; }
const { class: className = '' } = Astro.props;
---
<div class={`mx-auto w-full max-w-6xl px-5 md:px-8 ${className}`}>
  <slot />
</div>
```

- [ ] **Step 4: Create `src/components/layout/Nav.astro`**

```astro
---
import { NAV_ITEMS, type NavKey } from '@/lib/nav';
interface Props { section?: NavKey; class?: string; }
const { section, class: className = '' } = Astro.props;
---
<ul class={`flex flex-col gap-1 md:flex-row md:items-center md:gap-6 ${className}`}>
  {NAV_ITEMS.map(item => (
    <li>
      <a
        href={item.href}
        class={`inline-flex items-center gap-2 py-1 text-ink-900 no-underline hover:text-clay-500 ${
          section === item.key ? 'border-b-2 border-clay-500' : ''
        }`}
        aria-current={section === item.key ? 'page' : undefined}
      >
        {item.label}
        {item.comingSoon && (
          <span class="rounded-[var(--radius-chip)] bg-mustard-200 px-2 py-0.5 text-xs font-medium text-ink-700">
            Coming Next Year
          </span>
        )}
      </a>
    </li>
  ))}
</ul>
```

- [ ] **Step 5: Create `src/components/layout/Header.astro`**

Includes a small vanilla-JS mobile menu toggle — no framework needed.

```astro
---
import Container from './Container.astro';
import Nav from './Nav.astro';
import type { NavKey } from '@/lib/nav';
interface Props { section?: NavKey; }
const { section } = Astro.props;
---
<header class="border-b border-ivory-200 bg-ivory-50">
  <Container class="flex items-center justify-between py-4">
    <a href="/" class="flex items-center gap-3 no-underline text-ink-900">
      <img src="/DTFC-logo.png" alt="" width="40" height="40" class="rounded-full bg-clay-100" />
      <span class="font-display text-xl">DT:FC</span>
    </a>

    <button
      type="button"
      class="md:hidden rounded border border-ivory-200 px-3 py-2 text-sm"
      aria-expanded="false"
      aria-controls="mobile-nav"
      data-mobile-toggle
    >
      Menu
    </button>

    <nav aria-label="Primary" class="hidden md:block">
      <Nav section={section} />
    </nav>
  </Container>

  <div id="mobile-nav" hidden class="md:hidden border-t border-ivory-200 bg-ivory-50">
    <Container class="py-4">
      <Nav section={section} />
    </Container>
  </div>
</header>

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

- [ ] **Step 6: Create `src/components/ui/NewsletterSignup.astro`**

```astro
---
interface Props { source?: string; heading?: string; }
const {
  source = 'footer',
  heading = 'Get monthly DT:FC news, new games, and new plays.',
} = Astro.props;
---
<form
  class="flex flex-col gap-2 sm:flex-row sm:items-end"
  data-newsletter
  data-source={source}
  novalidate
>
  <label class="flex-1">
    <span class="block text-sm font-medium text-ink-700">{heading}</span>
    <input
      type="email"
      required
      name="email"
      autocomplete="email"
      placeholder="you@example.com"
      class="mt-1 w-full rounded border border-ivory-200 bg-white px-3 py-2 text-base"
    />
  </label>
  <button
    type="submit"
    class="rounded bg-clay-500 px-4 py-2 font-medium text-ivory-50 hover:bg-clay-700"
  >
    Notify me
  </button>
</form>
<p class="mt-2 text-xs text-ink-500">We won't share your email.</p>

<script>
  // TODO(esp): wire this to the client's ESP (see CLAUDE.md § Newsletter).
  document.querySelectorAll<HTMLFormElement>('[data-newsletter]').forEach(form => {
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const data = new FormData(form);
      // eslint-disable-next-line no-console
      console.info('[newsletter/placeholder]', form.dataset.source, Object.fromEntries(data));
      form.reset();
      form.insertAdjacentHTML(
        'afterend',
        '<p role="status" class="mt-2 text-sm text-teal-600">Thanks — we\'ll be in touch.</p>',
      );
    });
  });
</script>
```

- [ ] **Step 7: Create `src/components/layout/Footer.astro`**

```astro
---
import Container from './Container.astro';
import { NAV_ITEMS } from '@/lib/nav';
import NewsletterSignup from '@/components/ui/NewsletterSignup.astro';
const year = 2026; // build-time literal; avoid new Date() to keep the plan deterministic
---
<footer class="mt-16 border-t border-ivory-200 bg-ivory-100">
  <Container class="grid gap-10 py-12 md:grid-cols-3">
    <div>
      <p class="font-display text-xl">Developmental Theatre: Fearless Creativity</p>
      <p class="mt-2 text-sm text-ink-500">
        Fiscally sponsored by We Tell Stories, Inc., a California 501(c)(3).
      </p>
    </div>

    <nav aria-label="Footer">
      <ul class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {NAV_ITEMS.map(item => (
          <li><a href={item.href}>{item.label}</a></li>
        ))}
      </ul>
    </nav>

    <NewsletterSignup source="footer" />
  </Container>
  <div class="border-t border-ivory-200">
    <Container class="flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-ink-500">
      <span>&copy; {year} Developmental Theatre: Fearless Creativity</span>
      <span>
        <a href="/community/">About</a> · <a href="/community/">Donate</a>
      </span>
    </Container>
  </div>
</footer>
```

- [ ] **Step 8: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '@/styles/global.css';
import Header from '@/components/layout/Header.astro';
import Footer from '@/components/layout/Footer.astro';
import SkipLink from '@/components/layout/SkipLink.astro';
import type { NavKey } from '@/lib/nav';

interface Props {
  title: string;
  description?: string;
  section?: NavKey;
}
const { title, description, section } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} — DT:FC</title>
    {description && <meta name="description" content={description} />}
  </head>
  <body class="min-h-screen bg-ivory-50 text-ink-900">
    <SkipLink />
    <Header section={section} />
    <main id="main-content" class="pt-6 md:pt-10">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 9: Create `src/components/ui/Button.astro` and `Chip.astro`**

`Button.astro`:

```astro
---
interface Props {
  href?: string;
  variant?: 'primary' | 'secondary';
  class?: string;
  type?: 'button' | 'submit';
}
const { href, variant = 'primary', class: className = '', type = 'button' } = Astro.props;
const base = 'inline-flex items-center justify-center rounded px-4 py-2 font-medium no-underline';
const styles = variant === 'primary'
  ? 'bg-clay-500 text-ivory-50 hover:bg-clay-700'
  : 'border border-ink-900 text-ink-900 hover:bg-ivory-100';
const cls = `${base} ${styles} ${className}`;
---
{href
  ? <a href={href} class={cls}><slot /></a>
  : <button type={type} class={cls}><slot /></button>
}
```

`Chip.astro`:

```astro
---
interface Props { tone?: 'clay' | 'teal' | 'mustard' | 'neutral'; class?: string; }
const { tone = 'neutral', class: className = '' } = Astro.props;
const tones = {
  clay: 'bg-clay-100 text-clay-700',
  teal: 'bg-teal-100 text-teal-800',
  mustard: 'bg-mustard-200 text-ink-700',
  neutral: 'bg-ivory-200 text-ink-700',
};
---
<span class={`inline-flex items-center rounded-[var(--radius-chip)] px-3 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}>
  <slot />
</span>
```

- [ ] **Step 10: Add a placeholder logo file**

Create `public/DTFC-logo.png` — until the client delivers the real asset, ship a minimal placeholder. Any 40×40 PNG works; a quick way:

```bash
mkdir -p public
# Use a tiny transparent PNG so the img element renders without a broken icon.
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00(\x00\x00\x00(\x08\x06\x00\x00\x00\x8c\xfe\xb8\x6d\x00\x00\x00\x1fIDATx\x9cc\xfc\xff\xff?\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x83\x1a\x03\x03\x03\x03\x03\x00\x00\xef\x03\x00\xa8\x9b\x82\xc5\x00\x00\x00\x00IEND\xaeB`\x82' > public/DTFC-logo.png
```

(If that fails on your shell, copy any small 40×40 PNG into `public/DTFC-logo.png`.)

- [ ] **Step 11: Rewrite `src/pages/index.astro` to use BaseLayout**

Placeholder still — real landing comes in Task 4.

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---
<BaseLayout title="Home" description="Developmental Theatre: Fearless Creativity">
  <div class="mx-auto max-w-4xl px-6 py-16">
    <h1>Welcome</h1>
    <p class="mt-4">Site chrome installed. Real landing page in the next task.</p>
  </div>
</BaseLayout>
```

- [ ] **Step 12: Verify dev server renders the shell**

Run: `pnpm dev`; open `http://localhost:4321/` in a browser. Check:
- Header with logo + 7 nav items (Workshops shows "Coming Next Year" badge)
- Skip-to-content link appears when you press Tab
- Footer with tri-column layout + newsletter form
- Resize under 768px: hamburger appears, click reveals menu
- Submit the newsletter form with a real email; a success message replaces it and console shows `[newsletter/placeholder]`

Stop the dev server.

- [ ] **Step 13: Verify build**

Run: `pnpm build && pnpm check`
Expected: both exit 0.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: add BaseLayout with Header, Footer, mobile nav, newsletter stub"
```

---

### Task 4: Landing page + five stub sections

Populate the landing page (center welcome + 6 section boxes + Workshops secondary box) and create the 5 stub section landings using a shared `SectionLayout`.

**Files:**
- Create: `src/layouts/SectionLayout.astro`, `src/data/landing.ts`, `src/pages/community/index.astro`, `src/pages/shakespeare/index.astro`, `src/pages/childrens-theatre/index.astro`, `src/pages/legacy/index.astro`, `src/pages/workshops/index.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: `<SectionLayout title description section eyebrow?>…</SectionLayout>` — renders section page shell with eyebrow-label, big title, description, and body slot.
- Produces: exported `SECTION_BOXES` from `@/data/landing` — array of `{ key, label, href, summary, teaser? }` used by the landing page.

- [ ] **Step 1: Create `src/data/landing.ts`**

```ts
import type { NavKey } from '@/lib/nav';

export interface SectionBox {
  key: NavKey;
  label: string;
  href: string;
  summary: string;
  /** Teaser question from source spec §4.1 "Idea Two" — stored for later cycles. */
  teasers: string[];
  comingSoon?: boolean;
}

export const WELCOME_HEADING = 'COMMUNITY — Be Fearlessly Creative!';

export const WELCOME_BODY = [
  'Keep exploring! We train physical and vocal readiness, how to recognize new contexts, and ways to nurture RESILIENCE that will keep you learning in unexpected and challenging situations.',
  'We provide fast access to entertaining Developmental Theatre techniques and tools for expected or challenging situations.',
];

export const SECTION_BOXES: SectionBox[] = [
  {
    key: 'community',
    label: 'Community',
    href: '/community/',
    summary: 'Who we are, how we\'re organized, newsletters, and companion theatres.',
    teasers: ['What is a "fearlessly creative" community?', 'How can I join?'],
  },
  {
    key: 'theatre-games',
    label: 'Theatre Games',
    href: '/theatre-games/',
    summary: 'Hundreds of games organized by five competencies, searchable and ready to play.',
    teasers: ['What is a Theatre Game?', 'How do I pick the right one for my group?'],
  },
  {
    key: 'shakespeare',
    label: 'Shakespeare',
    href: '/shakespeare/',
    summary: 'Scenes, monologues, themed montages, and 40-minute cuttings for K through adult.',
    teasers: [
      'How many of Shakespeare\'s plays are performed now — 440+ years later?',
      'Why leave the language as Shakespeare\'s own?',
    ],
  },
  {
    key: 'childrens-theatre',
    label: "Children's Theatre",
    href: '/childrens-theatre/',
    summary: 'Plays, teaching modules, and storytelling — myth-driven and minimalist.',
    teasers: ['Why do 600 kids sit still for these plays?', 'How can children write a play together?'],
  },
  {
    key: 'legacy',
    label: 'Legacy',
    href: '/legacy/',
    summary: 'The Colorado Caravan story, founders, essays, and the Developmental Theatre timeline.',
    teasers: ['In the 1970s what did the University of Colorado create that led to this website?'],
  },
  {
    key: 'resource-center',
    label: 'Players Resource Center',
    href: '/resource-center/',
    summary: 'Tools, vocabulary, key concepts, and definitions — the site-wide glossary.',
    teasers: ['What are the ICONS and how are they used?'],
  },
];

export const WORKSHOPS_BOX: SectionBox = {
  key: 'workshops',
  label: 'Workshops',
  href: '/workshops/',
  summary: 'In-person and online training — coming next year.',
  teasers: [],
  comingSoon: true,
};
```

- [ ] **Step 2: Create `src/layouts/SectionLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
import Container from '@/components/layout/Container.astro';
import type { NavKey } from '@/lib/nav';

interface Props {
  title: string;
  description?: string;
  section: NavKey;
  eyebrow?: string;
}
const { title, description, section, eyebrow } = Astro.props;
---
<BaseLayout title={title} description={description} section={section}>
  <Container class="py-12">
    <header class="max-w-3xl">
      {eyebrow && <p class="text-sm font-medium uppercase tracking-wide text-teal-600">{eyebrow}</p>}
      <h1 class="mt-2">{title}</h1>
      {description && <p class="mt-4 text-lg text-ink-500 max-w-prose">{description}</p>}
    </header>
    <div class="mt-10">
      <slot />
    </div>
  </Container>
</BaseLayout>
```

- [ ] **Step 3: Rewrite `src/pages/index.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/layout/Container.astro';
import { WELCOME_HEADING, WELCOME_BODY, SECTION_BOXES, WORKSHOPS_BOX } from '@/data/landing';
---
<BaseLayout
  title="Home"
  description="Developmental Theatre: Fearless Creativity — theatre games, plays, Shakespeare, and tools for teachers, players, and helping-vocation professionals."
>
  <Container class="py-12 md:py-20">
    <section class="mx-auto max-w-3xl rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-soft)] text-center">
      <p class="font-display text-2xl text-clay-500">{WELCOME_HEADING}</p>
      {WELCOME_BODY.map(p => (
        <p class="mt-4 text-lg text-ink-700">{p}</p>
      ))}
    </section>

    <ul class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {SECTION_BOXES.map(box => (
        <li>
          <a
            href={box.href}
            class="block h-full rounded-[var(--radius-card)] border border-ivory-200 bg-ivory-50 p-6 no-underline transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
          >
            <h2 class="text-xl">{box.label}</h2>
            <p class="mt-2 text-sm text-ink-500">{box.summary}</p>
          </a>
        </li>
      ))}
      <li>
        <a
          href={WORKSHOPS_BOX.href}
          class="block h-full rounded-[var(--radius-card)] border border-dashed border-ivory-200 bg-ivory-100/50 p-6 no-underline transition hover:-translate-y-0.5"
        >
          <div class="flex items-center gap-2">
            <h2 class="text-xl">{WORKSHOPS_BOX.label}</h2>
            <span class="rounded-[var(--radius-chip)] bg-mustard-200 px-2 py-0.5 text-xs text-ink-700">
              Coming Next Year
            </span>
          </div>
          <p class="mt-2 text-sm text-ink-500">{WORKSHOPS_BOX.summary}</p>
        </a>
      </li>
    </ul>
  </Container>
</BaseLayout>
```

- [ ] **Step 4: Create the 5 stub section pages**

`src/pages/community/index.astro`:

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
import NewsletterSignup from '@/components/ui/NewsletterSignup.astro';
---
<SectionLayout
  title="Community"
  eyebrow="Coming soon"
  section="community"
  description="About DT:FC, how we're organized, membership, newsletters, and companion theatres."
>
  <div class="max-w-2xl space-y-4">
    <p>The Community section is in production. It will cover our purpose and values, our distributed-leadership structure, membership, donations, newsletters, companion theatres, and testimonials.</p>
    <p>Sign up below to be notified when new material lands.</p>
  </div>
  <div class="mt-6 max-w-md">
    <NewsletterSignup source="community-stub" />
  </div>
</SectionLayout>
```

`src/pages/shakespeare/index.astro`:

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
---
<SectionLayout
  title="Shakespeare"
  eyebrow="Coming soon"
  section="shakespeare"
  description="K through Adult — Oral literacy — Monologues, Scenes, Scenes on Themes."
>
  <div class="max-w-2xl">
    <p>In production for this section:</p>
    <ul class="mt-4 list-disc space-y-1 pl-6 text-ink-700">
      <li>Creating Fearless Shakespeare Scripts — four alternatives to staging a full play</li>
      <li>Script libraries — soliloquies, scenes, scenes around a theme, cuttings, Children's Shakespeare</li>
      <li>Shakespeare Into Current Colloquial Language — side-by-side texts</li>
      <li>Ask Shakespeare — Q&amp;A archive</li>
      <li>Honoring Our Guides (Shakespeare)</li>
    </ul>
  </div>
</SectionLayout>
```

`src/pages/childrens-theatre/index.astro`:

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
---
<SectionLayout
  title="Children's Theatre"
  eyebrow="Coming soon"
  section="childrens-theatre"
  description="Plays — Theatre Teaching Units — Storytelling."
>
  <div class="max-w-2xl">
    <p>Scripts in production:</p>
    <ul class="mt-4 list-disc space-y-1 pl-6 text-ink-700">
      <li>Water of Life</li>
      <li>One Seed Child (© 1973/2022 Chuck and Lola Wilcox)</li>
      <li>The Treasure Inside</li>
      <li>Conquering the Sun (Hawai'i)</li>
      <li>Aesop's Fables</li>
      <li>Teaching Modules — Theseus, Ariadne and the Minotaur; One Seed Child module</li>
      <li>Shakespeare for Children</li>
    </ul>
  </div>
</SectionLayout>
```

`src/pages/legacy/index.astro`:

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
---
<SectionLayout
  title="Legacy"
  eyebrow="Coming soon"
  section="legacy"
  description="History, Foundational Concepts, Who — When — Why, Next Steps."
>
  <div class="max-w-2xl space-y-4">
    <p>
      DT:FC descends from the <strong>Colorado Caravan</strong>, a touring theatre created in the 1970s
      by the University of Colorado Theatre Department and the Colorado Shakespeare Festival under
      NEA Title III grants. Founders: Richard Knaub, Chuck Wilcox, Lola Wilcox, and Martin Cobin.
    </p>
    <p>
      That work produced an M.A. program in Developmental Theatre/Drama, successor companies on three
      continents, and audiences totaling over six million.
    </p>
    <p>Full history, founder profiles, essays, and an interactive 1971–present timeline are coming soon.</p>
  </div>
</SectionLayout>
```

`src/pages/workshops/index.astro`:

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
import NewsletterSignup from '@/components/ui/NewsletterSignup.astro';
---
<SectionLayout
  title="Workshops"
  eyebrow="Coming next year"
  section="workshops"
  description="In-person and online training for teachers, players, and helping-vocation professionals."
>
  <div class="max-w-2xl space-y-4">
    <p>DT:FC workshops launch next year. Drop your email and we'll notify you when registration opens.</p>
  </div>
  <div class="mt-6 max-w-md">
    <NewsletterSignup source="workshops-interest" heading="Notify me when workshops open." />
  </div>
</SectionLayout>
```

- [ ] **Step 5: Verify all 7 nav items resolve in the dev server**

Run: `pnpm dev`; open each of these in a browser:
- `/`
- `/community/`
- `/theatre-games/` — will 404, that's fine (we haven't built it yet); come back to this after Task 9
- `/shakespeare/`
- `/childrens-theatre/`
- `/legacy/`
- `/resource-center/` — will 404 too; Task 7
- `/workshops/`

Expected: 5 stubs render with SectionLayout + eyebrow + description + body. Landing page has center welcome + 6 boxes + Workshops secondary. Stop the dev server.

- [ ] **Step 6: Verify build**

Run: `pnpm build && pnpm check`
Expected: both exit 0.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add landing page and five section stubs"
```

---

### Task 5: Content collections, schemas, minimal seed

Register `games` and `concepts` content collections with Zod schemas. Seed 2 real games and 2 concepts (`cohesion`, `theatre-games`) — enough to build the Concept component + PRC + Theatre Games landing against.

**Files:**
- Create: `src/content.config.ts`, `src/content/games/puppets-marionettes.mdx`, `src/content/games/changing-person-activity.mdx`, `src/content/concepts/cohesion.mdx`, `src/content/concepts/theatre-games.mdx`

**Interfaces:**
- Produces: exported `collections` from `src/content.config.ts`; the following types available via `astro:content` — `CollectionEntry<'games'>`, `CollectionEntry<'concepts'>`.
- Produces: the string literal type `Competency = 'physical-expression' | 'vocal-expression' | 'context-awareness' | 'risk-assessment' | 'resilience'`; `Cohesion = 'low' | 'medium' | 'high'`; `Structure = 'individual' | 'group'` — re-exported from `src/lib/types.ts`.

- [ ] **Step 1: Create `src/lib/types.ts`**

```ts
export const COMPETENCIES = [
  'physical-expression',
  'vocal-expression',
  'context-awareness',
  'risk-assessment',
  'resilience',
] as const;
export type Competency = (typeof COMPETENCIES)[number];

export const COHESIONS = ['low', 'medium', 'high'] as const;
export type Cohesion = (typeof COHESIONS)[number];

export const STRUCTURES = ['individual', 'group'] as const;
export type Structure = (typeof STRUCTURES)[number];

export const COMPETENCY_LABELS: Record<Competency, string> = {
  'physical-expression': 'Physical Expression',
  'vocal-expression': 'Vocal Expression',
  'context-awareness': 'Context Awareness',
  'risk-assessment': 'Risk Assessment & Management',
  'resilience': 'Resilience',
};

export const COMPETENCY_SUBSETS: Record<Competency, string[]> = {
  'physical-expression': ['Entry', 'Movement', 'Mime', 'Rhythm'],
  'vocal-expression': ['Expression', 'Articulation', 'Finding a Voice', 'Storytelling'],
  'context-awareness': [],
  'risk-assessment': [],
  'resilience': [],
};
```

- [ ] **Step 2: Create `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { COMPETENCIES, COHESIONS, STRUCTURES } from '@/lib/types';

const games = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/games' }),
  schema: z.object({
    name: z.string(),
    competency: z.enum(COMPETENCIES),
    subset: z.string().optional(),
    structure: z.enum(STRUCTURES),
    cohesion: z.enum(COHESIONS),
    intent: z.string(),
    source: z.string().optional(),
    sample: z.boolean().default(false),
  }),
});

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/concepts' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    shortDefinition: z.string().max(240),
    icon: z.string().default('placeholder'),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { games, concepts };
```

- [ ] **Step 3: Create `src/content/concepts/cohesion.mdx`**

```mdx
---
name: Cohesion
slug: cohesion
shortDefinition: 'How bonded a group is right now. Every game is rated Low, Medium, or High — matching game to group cohesion is the facilitator''s core skill.'
icon: placeholder
related: ['theatre-games']
---

## Cohesion in groups

**Cohesion** describes how bonded a group is right now — the trust, safety, and shared attention players can draw on. DT:FC rates every game **Low**, **Medium**, or **High** cohesion, meaning the level of bonding a group needs to have before playing the game safely and well.

- **Low.** Strangers, new-year classrooms, first-day workshops. The game asks little of players and doesn't require personal risk.
- **Medium.** A group that has warmed up together but hasn't yet built trust for exposed or vulnerable play.
- **High.** An ensemble that already trusts each other; ready for risk, invention, and self-revelation.

The facilitator's core skill is reading the room and choosing a game whose cohesion rating matches — or gently stretches — the group they have in front of them.
```

- [ ] **Step 4: Create `src/content/concepts/theatre-games.mdx`**

```mdx
---
name: Theatre Games
slug: theatre-games
shortDefinition: 'Structured play with a clear objective, rules, and evaluation — a delivery vehicle for one or more of the five DT:FC competencies.'
icon: placeholder
related: ['cohesion']
---

## Theatre Games: what are they?

A **Theatre Game** is structured play with a clear objective, an agreed set of rules, and a chance to reflect afterward. Each game is a small delivery vehicle for one or more of the five DT:FC competencies — Physical Expression, Vocal Expression, Context Awareness, Risk Assessment, and Resilience.

Theatre Games serve teaching, rehearsal, counseling, coaching, and warmups. The same game, played by different groups with different intents, does different work.
```

- [ ] **Step 5: Create `src/content/games/puppets-marionettes.mdx`**

```mdx
---
name: Puppets / Marionettes
competency: physical-expression
subset: Mime
structure: group
cohesion: low
intent: Physical readiness, imagined body control
source: 'Adapted from Viola Spolin, Improvisation for the Theater, p. 60'
sample: true
---

## Preparation

- Clear a space large enough for players to stand at arm's length from each other.
- Pair players. One in each pair is the **puppeteer**, the other is the **puppet** (or **marionette**).

## Facilitation

1. Puppets stand loose-limbed, waiting. Puppeteers imagine strings running from the puppet's head, hands, elbows, knees, and hips up to their own hands.
2. Puppeteers lift and lower the imagined strings. Puppets respond as if the strings were real.
3. After a minute, prompt puppeteers to try walking their puppet across the room; then to try a small gesture — waving, bowing, picking up an imagined object.
4. Swap roles.

## Evaluation

- Puppeteers: what did you notice about the puppet's weight? When did the movement feel most alive?
- Puppets: when did you have to imagine the string on your own, ahead of the puppeteer? What did that require of your body?

> This is sample content — the real game text will be imported from the client's Drive folder.
```

- [ ] **Step 6: Create `src/content/games/changing-person-activity.mdx`**

```mdx
---
name: The Changing Person / Activity
competency: context-awareness
structure: group
cohesion: medium
intent: Reading and responding to shifting scene contexts
sample: true
---

## Preparation

- Players sit in a semicircle. Facilitator stands where everyone can see.
- Establish a simple scene — for example, two players cooking together in a kitchen.

## Facilitation

1. Two players begin the scene. Give them 30 seconds to establish who they are and what they're doing.
2. On the facilitator's clap, one variable changes. Announce one at a time, escalating:
   - The **person** has changed (new relationship, new age, new mood).
   - The **activity** has changed (still the same people, but now they are packing to leave).
   - The **location** has changed (they are in a boat, still cooking).
3. Players stay in the scene through the change; the audience notes how they adapt.
4. Rotate players every 90 seconds so everyone plays.

## Evaluation

- Players: which change was hardest to absorb without stopping the scene?
- Audience: name a moment when the scene felt truest after a change — what made it work?

> This is sample content — the real game text will be imported from the client's Drive folder.
```

- [ ] **Step 7: Verify content validation**

Run: `pnpm build`
Expected: exit 0. If any frontmatter is malformed, Astro reports the file + Zod error.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: register games and concepts collections with seed content"
```

---

### Task 6: Concept component + registry + unit test

Build the `<Concept id="…" />` component using the native Popover API and a small runtime registry that reads from the `concepts` collection.

**Files:**
- Create: `src/lib/icons.ts`, `src/lib/concepts.ts`, `src/components/concept/Concept.astro`, `src/components/concept/ConceptPopover.astro`, `public/icons/placeholder.svg`, `tests/unit/icons.test.ts`, `vitest.config.ts`

**Interfaces:**
- Consumes: `getCollection('concepts')` from `astro:content`; the concepts seeded in Task 5.
- Produces:
  - `<Concept id="cohesion" />` — Astro component; renders inline button + popover; **throws at build time** if `id` is not a known slug.
  - `getConcept(slug: string): Promise<ConceptEntry>` from `@/lib/concepts` — throws if missing.
  - `listConcepts(): Promise<ConceptEntry[]>` from `@/lib/concepts` — returns entries sorted by name.
  - `iconPath(icon: string): string` from `@/lib/icons` (separate module — no `astro:content` dependency so it stays unit-testable in Vitest). Resolves to `/icons/${icon}.svg` and falls back to `placeholder` if the file does not exist on disk (`existsSync` check at build time).

- [ ] **Step 1: Create `public/icons/placeholder.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
  <circle cx="12" cy="12" r="10" fill="#f4e0b0" stroke="#a8801e" stroke-width="1.5"/>
  <text x="12" y="15.5" text-anchor="middle" font-family="serif" font-size="10" fill="#5c544a">?</text>
</svg>
```

- [ ] **Step 2a: Create `src/lib/icons.ts` (unit-testable, no Astro runtime deps)**

```ts
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const publicIcons = join(process.cwd(), 'public', 'icons');

export function iconPath(icon: string): string {
  const filename = `${icon}.svg`;
  const absolute = join(publicIcons, filename);
  return existsSync(absolute) ? `/icons/${filename}` : '/icons/placeholder.svg';
}
```

- [ ] **Step 2b: Create `src/lib/concepts.ts`**

```ts
import { getCollection, type CollectionEntry } from 'astro:content';

export type ConceptEntry = CollectionEntry<'concepts'>;

let cache: Map<string, ConceptEntry> | null = null;

async function loadIndex(): Promise<Map<string, ConceptEntry>> {
  if (cache) return cache;
  const entries = await getCollection('concepts');
  cache = new Map(entries.map(e => [e.data.slug, e]));
  return cache;
}

export async function getConcept(slug: string): Promise<ConceptEntry> {
  const index = await loadIndex();
  const found = index.get(slug);
  if (!found) {
    const known = Array.from(index.keys()).sort().join(', ');
    throw new Error(`Concept "${slug}" not found. Known slugs: ${known}`);
  }
  return found;
}

export async function listConcepts(): Promise<ConceptEntry[]> {
  const index = await loadIndex();
  return Array.from(index.values()).sort((a, b) => a.data.name.localeCompare(b.data.name));
}
```

- [ ] **Step 3: Create `src/components/concept/ConceptPopover.astro`**

```astro
---
import { iconPath } from '@/lib/icons';
import type { ConceptEntry } from '@/lib/concepts';
interface Props { entry: ConceptEntry; popoverId: string; }
const { entry, popoverId } = Astro.props;
---
<div
  id={popoverId}
  popover
  class="max-w-xs rounded-[var(--radius-card)] border border-ivory-200 bg-white p-4 text-left shadow-[var(--shadow-soft)]"
>
  <div class="flex items-center gap-2">
    <img src={iconPath(entry.data.icon)} alt="" width="24" height="24" />
    <span class="font-display text-lg">{entry.data.name}</span>
  </div>
  <p class="mt-2 text-sm text-ink-700">{entry.data.shortDefinition}</p>
  <a class="mt-3 inline-block text-sm" href={`/resource-center/${entry.data.slug}/`}>Read more →</a>
</div>
```

- [ ] **Step 4: Create `src/components/concept/Concept.astro`**

```astro
---
import { getConcept } from '@/lib/concepts';
import { iconPath } from '@/lib/icons';
import ConceptPopover from './ConceptPopover.astro';

interface Props { id: string; }
const { id } = Astro.props;
const entry = await getConcept(id);
const popoverId = `concept-popover-${id}`;
---
<span class="inline-flex items-baseline">
  <button
    type="button"
    popovertarget={popoverId}
    class="inline-flex items-center gap-1 rounded px-1 py-0.5 text-clay-500 no-underline hover:bg-clay-50 focus-visible:bg-clay-50"
    aria-describedby={popoverId}
  >
    <img src={iconPath(entry.data.icon)} alt="" width="16" height="16" class="inline-block" />
    <span class="border-b border-dotted border-clay-500">{entry.data.name}</span>
  </button>
  <ConceptPopover entry={entry} popoverId={popoverId} />
</span>
```

- [ ] **Step 5: Wire Concept auto-injection into MDX rendering** — record in CLAUDE.md task later, but for now: MDX files that want to use `<Concept>` inline will need it available. Two paths:

  (a) When rendering MDX via a layout (see Task 12), pass `components={{ Concept }}` to `<Content>`. This is what the game detail template will do.
  (b) In `.astro` files that inline concept references (like Theatre Games landing), import Concept directly.

  No code change in this step — just the design decision, documented in the CLAUDE.md write-up in Task 15.

- [ ] **Step 6: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    globals: false,
  },
});
```

- [ ] **Step 7: Install Vitest**

```bash
pnpm add -D vitest
```

- [ ] **Step 8: Create `tests/unit/icons.test.ts`** — failing first

`iconPath` is the only piece we can unit-test without spinning up Astro (the collection loader depends on the Astro runtime). Test icon fallback logic:

```ts
import { describe, it, expect } from 'vitest';
import { iconPath } from '../../src/lib/icons';

describe('iconPath', () => {
  it('returns the placeholder when the icon file is missing', () => {
    expect(iconPath('definitely-not-a-real-icon')).toBe('/icons/placeholder.svg');
  });

  it('returns the actual icon when the file exists', () => {
    expect(iconPath('placeholder')).toBe('/icons/placeholder.svg');
  });
});
```

- [ ] **Step 9: Run the test to confirm it passes (the placeholder file already exists from Step 1)**

Run: `pnpm test`
Expected: 2 tests pass.

- [ ] **Step 10: Verify build still works and the Concept component doesn't break rendering**

Add a quick sanity page at `src/pages/_concept-test.astro` (leading underscore keeps it out of the sitemap):

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Concept from '@/components/concept/Concept.astro';
---
<BaseLayout title="Concept sanity">
  <div class="mx-auto max-w-2xl p-8">
    <p>
      Every game is rated <Concept id="cohesion" /> Low, Medium, or High.
      Learn more about <Concept id="theatre-games" />.
    </p>
  </div>
</BaseLayout>
```

Run: `pnpm dev`; open `http://localhost:4321/_concept-test`. Click the concept name — the popover appears with the shortDefinition and "Read more →". Tab to it and press Enter — same. Press Esc — closes.

Stop the dev server. Delete the test page:

```bash
rm src/pages/_concept-test.astro
```

- [ ] **Step 11: Verify build**

Run: `pnpm build && pnpm check`
Expected: both exit 0.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add Concept component + registry with native Popover API"
```

---

### Task 7: Players Resource Center pages

Build the PRC landing (alphabetical list + search-as-you-type) and per-concept detail page.

**Files:**
- Create: `src/layouts/ConceptLayout.astro`, `src/pages/resource-center/index.astro`, `src/pages/resource-center/[slug].astro`

**Interfaces:**
- Consumes: `listConcepts`, `iconPath` from `@/lib/concepts`; `getCollection('concepts')` for static path generation.
- Produces: routes `/resource-center/` and `/resource-center/<slug>/` for every concept.

- [ ] **Step 1: Create `src/pages/resource-center/index.astro`**

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
import { listConcepts } from '@/lib/concepts';
import { iconPath } from '@/lib/icons';
const concepts = await listConcepts();
---
<SectionLayout
  title="Players Resource Center"
  section="resource-center"
  eyebrow="Glossary"
  description="Tools, vocabulary, key concepts, and definitions — the site-wide glossary."
>
  <div class="max-w-3xl">
    <div class="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-soft)]">
      <label class="block">
        <span class="text-sm font-medium">Filter</span>
        <input
          type="search"
          placeholder="Type to filter…"
          class="mt-1 w-full rounded border border-ivory-200 bg-ivory-50 px-3 py-2 text-base"
          data-concept-filter
        />
      </label>
    </div>

    <div class="mt-6 rounded-[var(--radius-card)] border border-mustard-200 bg-mustard-200/40 p-4 text-sm text-ink-700">
      <strong>What are the ICONS and how are they used?</strong> Throughout the site, key concepts show a small icon next to their name. Click or tap the icon anywhere it appears to open a definition popover; then click "Read more →" to land here.
    </div>

    <ul class="mt-6 divide-y divide-ivory-200 rounded-[var(--radius-card)] border border-ivory-200 bg-white" data-concept-list>
      {concepts.map(entry => (
        <li data-concept-name={entry.data.name.toLowerCase()}>
          <a href={`/resource-center/${entry.data.slug}/`}
             class="flex items-start gap-3 p-4 no-underline hover:bg-ivory-50">
            <img src={iconPath(entry.data.icon)} alt="" width="24" height="24" class="mt-1" />
            <div>
              <p class="font-display text-lg text-ink-900">{entry.data.name}</p>
              <p class="text-sm text-ink-500">{entry.data.shortDefinition}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  </div>
</SectionLayout>

<script>
  const filter = document.querySelector<HTMLInputElement>('[data-concept-filter]');
  const list = document.querySelector<HTMLUListElement>('[data-concept-list]');
  filter?.addEventListener('input', () => {
    const q = filter.value.trim().toLowerCase();
    list?.querySelectorAll<HTMLLIElement>('li').forEach(li => {
      const name = li.dataset.conceptName ?? '';
      li.hidden = q.length > 0 && !name.includes(q);
    });
  });
</script>
```

- [ ] **Step 2: Create `src/layouts/ConceptLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
import Container from '@/components/layout/Container.astro';
import Chip from '@/components/ui/Chip.astro';
import { iconPath } from '@/lib/icons';
import type { ConceptEntry } from '@/lib/concepts';

interface Props { entry: ConceptEntry; }
const { entry } = Astro.props;
---
<BaseLayout title={entry.data.name} description={entry.data.shortDefinition} section="resource-center">
  <Container class="py-12">
    <article class="max-w-3xl">
      <p class="text-sm font-medium uppercase tracking-wide text-teal-600">Players Resource Center</p>
      <div class="mt-2 flex items-center gap-3">
        <img src={iconPath(entry.data.icon)} alt="" width="48" height="48" />
        <h1 class="mb-0">{entry.data.name}</h1>
      </div>
      <p class="mt-4 text-lg text-ink-500">{entry.data.shortDefinition}</p>

      <div class="prose prose-neutral mt-8 max-w-none">
        <slot />
      </div>

      {entry.data.related.length > 0 && (
        <div class="mt-10 border-t border-ivory-200 pt-6">
          <p class="text-sm font-medium text-ink-500">Related resources</p>
          <div class="mt-3 flex flex-wrap gap-2">
            {entry.data.related.map(slug => (
              <a href={`/resource-center/${slug}/`} class="no-underline">
                <Chip tone="teal">{slug}</Chip>
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  </Container>
</BaseLayout>
```

Note: the tailwindcss v4 setup does not include `@tailwindcss/typography`. If you want the `prose` classes to work, install the plugin and enable it:

```bash
pnpm add -D @tailwindcss/typography
```

Add to `src/styles/global.css` under the imports:

```css
@plugin '@tailwindcss/typography';
```

- [ ] **Step 3: Create `src/pages/resource-center/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import ConceptLayout from '@/layouts/ConceptLayout.astro';
import Concept from '@/components/concept/Concept.astro';

export async function getStaticPaths() {
  const entries = await getCollection('concepts');
  return entries.map(entry => ({
    params: { slug: entry.data.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<ConceptLayout entry={entry}>
  <Content components={{ Concept }} />
</ConceptLayout>
```

- [ ] **Step 4: Verify the PRC pages render**

Run: `pnpm dev`; open:
- `/resource-center/` — alphabetical list with 2 entries (Cohesion, Theatre Games); ICONS callout visible; search input filters as you type
- `/resource-center/cohesion/` — full page with icon, description, MDX body, related chip linking to Theatre Games
- `/resource-center/theatre-games/` — same shape

Stop the dev server.

- [ ] **Step 5: Verify build**

Run: `pnpm build && pnpm check`
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Players Resource Center landing and detail pages"
```

---

### Task 8: Build-time Concept id reference checker

Replace the no-op stub script from Task 1 with a real prebuild check: scan `.astro` and `.mdx` files for `<Concept id="…" />` usages and fail if any referenced slug is not a real concept.

**Files:**
- Modify: `scripts/check-concept-refs.mjs`

**Interfaces:**
- Runs before `astro build` via the `check:concepts` npm script (already wired into `build`).
- Exits non-zero with a clear error listing offending files, line numbers, and unknown slug.

- [ ] **Step 1: Install `fast-glob`**

```bash
pnpm add -D fast-glob
```

- [ ] **Step 2: Rewrite `scripts/check-concept-refs.mjs`**

```js
import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { parse as parseYaml } from 'yaml';
import fg from 'fast-glob';

const CONCEPT_REF = /<Concept\s+id=(?:"([^"]+)"|'([^']+)')/g;
const KNOWN = new Set();
const REFS = [];

// Collect known slugs from concept frontmatter.
for (const file of await fg('src/content/concepts/**/*.{md,mdx}')) {
  const src = readFileSync(file, 'utf8');
  const match = src.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    console.error(`No frontmatter in ${file}`);
    process.exit(1);
  }
  const data = parseYaml(match[1]);
  if (!data?.slug) {
    console.error(`Missing slug in ${file}`);
    process.exit(1);
  }
  KNOWN.add(data.slug);
}

// Collect all references.
for (const file of await fg(['src/**/*.astro', 'src/**/*.mdx'])) {
  const src = readFileSync(file, 'utf8');
  let match;
  const lines = src.split('\n');
  while ((match = CONCEPT_REF.exec(src)) !== null) {
    const id = match[1] ?? match[2];
    const beforeMatch = src.slice(0, match.index);
    const line = beforeMatch.split('\n').length;
    REFS.push({ file: relative(process.cwd(), file), id, line });
  }
}

// Validate.
const unknown = REFS.filter(r => !KNOWN.has(r.id));
if (unknown.length > 0) {
  console.error('\nUnknown <Concept> references:\n');
  for (const r of unknown) {
    console.error(`  ${r.file}:${r.line}  <Concept id="${r.id}" />`);
  }
  console.error(`\nKnown slugs: ${[...KNOWN].sort().join(', ')}\n`);
  process.exit(1);
}

console.log(`✓ Checked ${REFS.length} <Concept> reference(s); all resolve.`);
```

- [ ] **Step 3: Install `yaml`**

```bash
pnpm add -D yaml
```

- [ ] **Step 4: Verify the checker passes on the current tree**

Run: `pnpm check:concepts`
Expected: exit 0 with success message. If it reports refs found, that's fine — currently zero unless a page uses `<Concept>` (we removed the test page). Add a temporary reference:

Create `src/pages/_concept-check.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Concept from '@/components/concept/Concept.astro';
---
<BaseLayout title="check"><Concept id="cohesion" /></BaseLayout>
```

Run: `pnpm check:concepts`
Expected: `✓ Checked 1 <Concept> reference(s); all resolve.`

- [ ] **Step 5: Verify the checker fails on an unknown reference**

Edit the temp file to reference a fake concept:

```astro
<Concept id="not-a-real-thing" />
```

Run: `pnpm check:concepts`
Expected: exit 1; error message names `_concept-check.astro` and lists known slugs.

Delete the temp file:

```bash
rm src/pages/_concept-check.astro
```

- [ ] **Step 6: Verify the full build still passes**

Run: `pnpm build`
Expected: exit 0 (prebuild check runs and finds 0 refs, then astro builds).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: prebuild check fails build on unknown Concept ids"
```

---

### Task 9: Theatre Games landing page

Build `/theatre-games/` with the five-competency explainer, cohesion explainer, audience-use blurbs, "Find a Game" CTA. Uses `<Concept>` inline.

**Files:**
- Create: `src/pages/theatre-games/index.astro`

**Interfaces:**
- Consumes: `COMPETENCY_LABELS`, `COMPETENCY_SUBSETS` from `@/lib/types`; `Concept` component.
- Note: the client's verbatim landing-page copy lives in the Google Drive doc "DT:FC THEATRE GAMES LANDING PAGE". This task ships a well-structured page using the *structural* description from source spec §4.2; **Task 13 replaces the copy with the verbatim text from Drive.**

- [ ] **Step 1: Create `src/pages/theatre-games/index.astro`**

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
import Button from '@/components/ui/Button.astro';
import Concept from '@/components/concept/Concept.astro';
import Chip from '@/components/ui/Chip.astro';
import { COMPETENCIES, COMPETENCY_LABELS, COMPETENCY_SUBSETS } from '@/lib/types';

const audiences = [
  { title: 'Teaching', body: 'Elementary through high school, religious/supplementary schools, museums, libraries, camps, and scouting — pick a game and go.' },
  { title: 'Rehearsal', body: 'Directors and program coordinators use these games as warmups, focus-builders, and characterization tools before a run.' },
  { title: 'Counseling and helping vocations', body: 'Counselors, coaches, medical staff, HR, and consultants use games to create shared attention and rehearse hard conversations.' },
  { title: 'Warmups', body: 'Start every gathering with a game that fits your group — see Warmup Theatre Games in the how-to library.' },
];

const cohesionRungs = [
  { label: 'Low', tone: 'teal' as const, body: 'Strangers, new-year classrooms, first-day workshops. The game asks little of players and doesn\'t require personal risk.' },
  { label: 'Medium', tone: 'mustard' as const, body: 'A group that has warmed up together but hasn\'t yet built trust for exposed or vulnerable play.' },
  { label: 'High', tone: 'clay' as const, body: 'An ensemble that already trusts each other; ready for risk, invention, and self-revelation.' },
];
---
<SectionLayout
  title="Theatre Games"
  section="theatre-games"
  eyebrow="Play together"
  description="Structured play that builds physical readiness, vocal range, context awareness, thoughtful risk, and resilience. Hundreds of games, organized so you can find the right one fast."
>
  <div class="grid gap-10 lg:grid-cols-3">
    <div class="lg:col-span-2 space-y-8">
      <section>
        <h2>What is a <Concept id="theatre-games" />?</h2>
        <p class="mt-4 max-w-prose">
          Every DT:FC game has a clear objective, a small set of rules, and a chance to reflect after — a delivery vehicle for one or more of the five competencies below.
        </p>
      </section>

      <section>
        <h2>The five competencies</h2>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          {COMPETENCIES.map(c => (
            <div class="rounded-[var(--radius-card)] border border-ivory-200 bg-white p-5">
              <h3 class="text-xl">{COMPETENCY_LABELS[c]}</h3>
              {COMPETENCY_SUBSETS[c].length > 0 && (
                <ul class="mt-3 flex flex-wrap gap-2">
                  {COMPETENCY_SUBSETS[c].map(s => <li><Chip tone="teal">{s}</Chip></li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2><Concept id="cohesion" /> — matching game to group</h2>
        <p class="mt-4 max-w-prose">Every game is rated by the level of group bonding it assumes:</p>
        <div class="mt-4 grid gap-3 md:grid-cols-3">
          {cohesionRungs.map(r => (
            <div class="rounded-[var(--radius-card)] border border-ivory-200 bg-white p-4">
              <Chip tone={r.tone}>{r.label}</Chip>
              <p class="mt-3 text-sm text-ink-700">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Use Theatre Games for…</h2>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          {audiences.map(a => (
            <div>
              <h3 class="text-lg">{a.title}</h3>
              <p class="mt-2 text-sm text-ink-700">{a.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>

    <aside class="lg:sticky lg:top-8 lg:self-start">
      <div class="rounded-[var(--radius-card)] bg-clay-500 p-6 text-ivory-50">
        <p class="font-display text-2xl">Find a game</p>
        <p class="mt-2 text-sm text-clay-50/90">Filter by competency, cohesion, group size, or name.</p>
        <div class="mt-4">
          <Button href="/theatre-games/finder" variant="secondary" class="border-ivory-50 text-ivory-50 hover:bg-clay-700">
            Open the Game Index →
          </Button>
        </div>
      </div>
    </aside>
  </div>
</SectionLayout>
```

- [ ] **Step 2: Verify page renders**

Run: `pnpm dev`; open `/theatre-games/`. Check:
- Five competency cards with subset chips where applicable
- Cohesion section with 3 rungs
- Concept icons render inline (Cohesion, Theatre Games)
- Clicking a Concept icon opens the popover
- "Open the Game Index →" button links to `/theatre-games/finder` (will 404 until Task 11)

Stop the dev server.

- [ ] **Step 3: Verify build (concept check will now report references)**

Run: `pnpm build`
Expected: `✓ Checked 3 <Concept> reference(s); all resolve.` then astro builds successfully.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Theatre Games section landing page"
```

---

### Task 10: Game filter reducer + URL serialization + Vitest tests

Write the pure filter logic and URL-state serialization as a testable module. This is the brain of the Game Finder — no framework, no DOM.

**Files:**
- Create: `src/lib/gameFilter.ts`, `tests/unit/gameFilter.test.ts`

**Interfaces:**
- Produces (exported from `@/lib/gameFilter`):
  - `type GameLite = { slug: string; name: string; competency: Competency; subset?: string; structure: Structure; cohesion: Cohesion; intent: string; source?: string; sample: boolean; }`
  - `type FilterState = { competencies: Competency[]; cohesions: Cohesion[]; structures: Structure[]; subset: string | null; intent: string; name: string; }`
  - `EMPTY_STATE: FilterState`
  - `filterGames(games: GameLite[], state: FilterState): GameLite[]`
  - `stateToQuery(state: FilterState): string`  (returns e.g. `competency=physical-expression&cohesion=low`)
  - `queryToState(query: URLSearchParams): FilterState`

- [ ] **Step 1: Create `tests/unit/gameFilter.test.ts` — failing first**

```ts
import { describe, it, expect } from 'vitest';
import {
  EMPTY_STATE,
  filterGames,
  stateToQuery,
  queryToState,
  type GameLite,
} from '../../src/lib/gameFilter';

const puppets: GameLite = {
  slug: 'puppets',
  name: 'Puppets / Marionettes',
  competency: 'physical-expression',
  subset: 'Mime',
  structure: 'group',
  cohesion: 'low',
  intent: 'Physical readiness',
  sample: true,
};

const changingPerson: GameLite = {
  slug: 'changing-person',
  name: 'The Changing Person / Activity',
  competency: 'context-awareness',
  structure: 'group',
  cohesion: 'medium',
  intent: 'Reading and responding',
  sample: true,
};

const resilienceSolo: GameLite = {
  slug: 'x',
  name: 'Solo Bounceback',
  competency: 'resilience',
  structure: 'individual',
  cohesion: 'high',
  intent: 'Recover from missed cue',
  sample: true,
};

const games = [puppets, changingPerson, resilienceSolo];

describe('filterGames', () => {
  it('empty state returns all games', () => {
    expect(filterGames(games, EMPTY_STATE)).toEqual(games);
  });

  it('filters by competency (OR within the axis)', () => {
    const state = { ...EMPTY_STATE, competencies: ['resilience', 'context-awareness'] as const };
    const result = filterGames(games, state as any);
    expect(result.map(g => g.slug).sort()).toEqual(['changing-person', 'x']);
  });

  it('filters by cohesion', () => {
    const state = { ...EMPTY_STATE, cohesions: ['low' as const] };
    expect(filterGames(games, state)).toEqual([puppets]);
  });

  it('filters by structure', () => {
    const state = { ...EMPTY_STATE, structures: ['individual' as const] };
    expect(filterGames(games, state)).toEqual([resilienceSolo]);
  });

  it('filters by subset (only within selected competency)', () => {
    const state = { ...EMPTY_STATE, competencies: ['physical-expression' as const], subset: 'Mime' };
    expect(filterGames(games, state)).toEqual([puppets]);
  });

  it('substring-matches intent case-insensitively', () => {
    const state = { ...EMPTY_STATE, intent: 'RESPOND' };
    expect(filterGames(games, state)).toEqual([changingPerson]);
  });

  it('substring-matches name case-insensitively', () => {
    const state = { ...EMPTY_STATE, name: 'puppet' };
    expect(filterGames(games, state)).toEqual([puppets]);
  });

  it('combines filters with AND across axes', () => {
    const state = {
      ...EMPTY_STATE,
      competencies: ['physical-expression', 'context-awareness'] as any,
      cohesions: ['medium' as const],
    };
    expect(filterGames(games, state)).toEqual([changingPerson]);
  });

  it('returns empty when nothing matches', () => {
    const state = { ...EMPTY_STATE, name: 'nonexistent' };
    expect(filterGames(games, state)).toEqual([]);
  });
});

describe('URL serialization', () => {
  it('stateToQuery omits empty axes', () => {
    expect(stateToQuery(EMPTY_STATE)).toBe('');
  });

  it('serializes multi-select axes as repeated params', () => {
    const state = {
      ...EMPTY_STATE,
      competencies: ['physical-expression', 'resilience'] as any,
      cohesions: ['low' as const, 'high' as const],
    };
    const q = stateToQuery(state);
    // Order doesn't matter, so parse.
    const params = new URLSearchParams(q);
    expect(params.getAll('competency').sort()).toEqual(['physical-expression', 'resilience']);
    expect(params.getAll('cohesion').sort()).toEqual(['high', 'low']);
  });

  it('serializes single-value fields when set', () => {
    const state = { ...EMPTY_STATE, subset: 'Mime', intent: 'ready', name: 'puppets' };
    const q = new URLSearchParams(stateToQuery(state));
    expect(q.get('subset')).toBe('Mime');
    expect(q.get('intent')).toBe('ready');
    expect(q.get('name')).toBe('puppets');
  });

  it('round-trips through URLSearchParams', () => {
    const original = {
      competencies: ['physical-expression', 'resilience'] as any,
      cohesions: ['low' as const],
      structures: ['group' as const],
      subset: 'Mime',
      intent: 'Physical',
      name: 'pup',
    };
    const restored = queryToState(new URLSearchParams(stateToQuery(original)));
    expect(restored.competencies.sort()).toEqual([...original.competencies].sort());
    expect(restored.cohesions).toEqual(original.cohesions);
    expect(restored.structures).toEqual(original.structures);
    expect(restored.subset).toBe('Mime');
    expect(restored.intent).toBe('Physical');
    expect(restored.name).toBe('pup');
  });

  it('queryToState treats missing params as empty', () => {
    expect(queryToState(new URLSearchParams(''))).toEqual(EMPTY_STATE);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test`
Expected: FAIL with "Cannot find module '../../src/lib/gameFilter'".

- [ ] **Step 3: Create `src/lib/gameFilter.ts`**

```ts
import { COMPETENCIES, COHESIONS, STRUCTURES, type Competency, type Cohesion, type Structure } from './types';

export interface GameLite {
  slug: string;
  name: string;
  competency: Competency;
  subset?: string;
  structure: Structure;
  cohesion: Cohesion;
  intent: string;
  source?: string;
  sample: boolean;
}

export interface FilterState {
  competencies: Competency[];
  cohesions: Cohesion[];
  structures: Structure[];
  subset: string | null;
  intent: string;
  name: string;
}

export const EMPTY_STATE: FilterState = {
  competencies: [],
  cohesions: [],
  structures: [],
  subset: null,
  intent: '',
  name: '',
};

function containsCI(haystack: string, needle: string): boolean {
  if (!needle) return true;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function filterGames(games: GameLite[], s: FilterState): GameLite[] {
  return games.filter(g => {
    if (s.competencies.length && !s.competencies.includes(g.competency)) return false;
    if (s.cohesions.length && !s.cohesions.includes(g.cohesion)) return false;
    if (s.structures.length && !s.structures.includes(g.structure)) return false;
    if (s.subset && g.subset !== s.subset) return false;
    if (!containsCI(g.intent, s.intent)) return false;
    if (!containsCI(g.name, s.name)) return false;
    return true;
  });
}

export function stateToQuery(s: FilterState): string {
  const p = new URLSearchParams();
  s.competencies.forEach(c => p.append('competency', c));
  s.cohesions.forEach(c => p.append('cohesion', c));
  s.structures.forEach(c => p.append('structure', c));
  if (s.subset) p.set('subset', s.subset);
  if (s.intent) p.set('intent', s.intent);
  if (s.name) p.set('name', s.name);
  return p.toString();
}

function pickEnum<T extends readonly string[]>(values: string[], allowed: T): T[number][] {
  return values.filter((v): v is T[number] => (allowed as readonly string[]).includes(v));
}

export function queryToState(q: URLSearchParams): FilterState {
  return {
    competencies: pickEnum(q.getAll('competency'), COMPETENCIES),
    cohesions: pickEnum(q.getAll('cohesion'), COHESIONS),
    structures: pickEnum(q.getAll('structure'), STRUCTURES),
    subset: q.get('subset'),
    intent: q.get('intent') ?? '',
    name: q.get('name') ?? '',
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test`
Expected: all 13 tests pass (2 from `icons.test.ts` + 11 from `gameFilter.test.ts`).

- [ ] **Step 5: Verify build still succeeds**

Run: `pnpm build && pnpm check`
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add pure game-filter reducer with URL serialization"
```

---

### Task 11: Game Finder island + finder page + HowToModal

Build the interactive Preact island for the Game Index, the finder route, the GameCard component, and the "How to use the index" modal.

**Files:**
- Create: `src/components/games/GameFinder.tsx`, `src/components/games/IndexFilters.tsx`, `src/components/games/GameCard.astro`, `src/components/games/HowToModal.astro`, `src/pages/theatre-games/finder.astro`, `src/lib/games.ts`

**Interfaces:**
- Consumes: `filterGames`, `stateToQuery`, `queryToState`, `EMPTY_STATE`, `GameLite`, `FilterState` from `@/lib/gameFilter`; `COMPETENCIES`, `COHESIONS`, `STRUCTURES`, `COMPETENCY_LABELS`, `COMPETENCY_SUBSETS` from `@/lib/types`.
- Produces: `toGameLite(entry: CollectionEntry<'games'>): GameLite` from `@/lib/games`; `/theatre-games/finder` route.

- [ ] **Step 1: Create `src/lib/games.ts`**

```ts
import { getCollection, type CollectionEntry } from 'astro:content';
import type { GameLite } from './gameFilter';

export function toGameLite(entry: CollectionEntry<'games'>): GameLite {
  return {
    slug: entry.id.replace(/\.mdx?$/, ''),
    name: entry.data.name,
    competency: entry.data.competency,
    subset: entry.data.subset,
    structure: entry.data.structure,
    cohesion: entry.data.cohesion,
    intent: entry.data.intent,
    source: entry.data.source,
    sample: entry.data.sample,
  };
}

export async function loadGamesLite(): Promise<GameLite[]> {
  const entries = await getCollection('games');
  return entries.map(toGameLite).sort((a, b) => a.name.localeCompare(b.name));
}
```

- [ ] **Step 2: Create `src/components/games/IndexFilters.tsx`**

```tsx
import { COMPETENCIES, COHESIONS, STRUCTURES, COMPETENCY_LABELS, COMPETENCY_SUBSETS } from '@/lib/types';
import type { FilterState } from '@/lib/gameFilter';
import type { Competency, Cohesion, Structure } from '@/lib/types';

interface Props {
  state: FilterState;
  onChange(s: FilterState): void;
  onReset(): void;
}

function toggleIn<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value];
}

export function IndexFilters({ state, onChange, onReset }: Props) {
  const availableSubsets = state.competencies.length
    ? state.competencies.flatMap(c => COMPETENCY_SUBSETS[c])
    : Object.values(COMPETENCY_SUBSETS).flat();
  const uniqueSubsets = Array.from(new Set(availableSubsets));

  return (
    <div class="space-y-6">
      <fieldset>
        <legend class="text-sm font-medium text-ink-700">Competency</legend>
        <div class="mt-2 flex flex-wrap gap-2">
          {COMPETENCIES.map(c => (
            <button
              type="button"
              key={c}
              onClick={() => onChange({ ...state, competencies: toggleIn(state.competencies, c) as Competency[] })}
              class={`rounded-[var(--radius-chip)] border px-3 py-1 text-sm ${
                state.competencies.includes(c)
                  ? 'border-clay-500 bg-clay-500 text-ivory-50'
                  : 'border-ivory-200 bg-white text-ink-700 hover:border-clay-500'
              }`}
              aria-pressed={state.competencies.includes(c)}
            >
              {COMPETENCY_LABELS[c]}
            </button>
          ))}
        </div>
      </fieldset>

      {uniqueSubsets.length > 0 && (
        <label class="block">
          <span class="text-sm font-medium text-ink-700">Subset</span>
          <select
            class="mt-1 w-full rounded border border-ivory-200 bg-white px-3 py-2 text-base"
            value={state.subset ?? ''}
            onInput={ev => onChange({ ...state, subset: (ev.target as HTMLSelectElement).value || null })}
          >
            <option value="">Any subset</option>
            {uniqueSubsets.map(s => <option value={s} key={s}>{s}</option>)}
          </select>
        </label>
      )}

      <fieldset>
        <legend class="text-sm font-medium text-ink-700">Cohesion</legend>
        <div class="mt-2 flex flex-wrap gap-2">
          {COHESIONS.map(c => (
            <button
              type="button"
              key={c}
              onClick={() => onChange({ ...state, cohesions: toggleIn(state.cohesions, c) as Cohesion[] })}
              class={`rounded-[var(--radius-chip)] border px-3 py-1 text-sm capitalize ${
                state.cohesions.includes(c)
                  ? 'border-teal-600 bg-teal-600 text-ivory-50'
                  : 'border-ivory-200 bg-white text-ink-700 hover:border-teal-600'
              }`}
              aria-pressed={state.cohesions.includes(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend class="text-sm font-medium text-ink-700">Structure</legend>
        <div class="mt-2 flex flex-wrap gap-2">
          {STRUCTURES.map(s => (
            <button
              type="button"
              key={s}
              onClick={() => onChange({ ...state, structures: toggleIn(state.structures, s) as Structure[] })}
              class={`rounded-[var(--radius-chip)] border px-3 py-1 text-sm capitalize ${
                state.structures.includes(s)
                  ? 'border-mustard-600 bg-mustard-400 text-ink-900'
                  : 'border-ivory-200 bg-white text-ink-700 hover:border-mustard-400'
              }`}
              aria-pressed={state.structures.includes(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <label class="block">
        <span class="text-sm font-medium text-ink-700">Intent</span>
        <input
          type="search"
          value={state.intent}
          onInput={ev => onChange({ ...state, intent: (ev.target as HTMLInputElement).value })}
          placeholder="e.g. physical readiness"
          class="mt-1 w-full rounded border border-ivory-200 bg-white px-3 py-2 text-base"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink-700">Game name</span>
        <input
          type="search"
          value={state.name}
          onInput={ev => onChange({ ...state, name: (ev.target as HTMLInputElement).value })}
          placeholder="e.g. puppets"
          class="mt-1 w-full rounded border border-ivory-200 bg-white px-3 py-2 text-base"
        />
      </label>

      <button
        type="button"
        onClick={onReset}
        class="text-sm text-clay-500 underline"
      >
        Reset filters
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/games/GameCard.astro`**

```astro
---
import Chip from '@/components/ui/Chip.astro';
import { COMPETENCY_LABELS } from '@/lib/types';
import type { GameLite } from '@/lib/gameFilter';

interface Props { game: GameLite; }
const { game } = Astro.props;
---
<a
  href={`/theatre-games/${game.slug}/`}
  class="block h-full rounded-[var(--radius-card)] border border-ivory-200 bg-white p-5 no-underline transition hover:border-clay-500 hover:shadow-[var(--shadow-soft)]"
>
  <div class="flex flex-wrap items-center gap-2">
    <Chip tone="clay">{COMPETENCY_LABELS[game.competency]}</Chip>
    {game.subset && <Chip tone="teal">{game.subset}</Chip>}
    <Chip tone="mustard">{game.cohesion} cohesion</Chip>
    <Chip tone="neutral">{game.structure}</Chip>
  </div>
  <h3 class="mt-3 text-xl">{game.name}</h3>
  <p class="mt-1 text-sm text-ink-500">{game.intent}</p>
  {game.sample && (
    <p class="mt-2 text-xs text-ink-300">Sample content — pending final import</p>
  )}
</a>
```

- [ ] **Step 4: Create `src/components/games/GameFinder.tsx`**

The island receives all games as a prop, holds filter state, renders the filter panel + result grid. Uses raw HTML for cards (mirrors GameCard.astro) so the island stays self-contained.

```tsx
import { useEffect, useState } from 'preact/hooks';
import { EMPTY_STATE, filterGames, queryToState, stateToQuery, type FilterState, type GameLite } from '@/lib/gameFilter';
import { COMPETENCY_LABELS } from '@/lib/types';
import { IndexFilters } from './IndexFilters';

interface Props { games: GameLite[]; }

export default function GameFinder({ games }: Props) {
  const [state, setState] = useState<FilterState>(EMPTY_STATE);

  // Hydrate from URL on mount.
  useEffect(() => {
    setState(queryToState(new URLSearchParams(window.location.search)));
  }, []);

  // Reflect state back to URL without navigating.
  useEffect(() => {
    const q = stateToQuery(state);
    const url = new URL(window.location.href);
    url.search = q;
    window.history.replaceState({}, '', url.toString());
  }, [state]);

  const results = filterGames(games, state);

  return (
    <div class="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside class="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-soft)]">
        <IndexFilters
          state={state}
          onChange={setState}
          onReset={() => setState(EMPTY_STATE)}
        />
      </aside>

      <div>
        <div class="flex items-center justify-between" aria-live="polite">
          <p class="text-sm text-ink-500">
            Showing <strong>{results.length}</strong> of {games.length} games
          </p>
        </div>

        <ul class="mt-4 grid gap-4 sm:grid-cols-2">
          {results.map(game => (
            <li key={game.slug}>
              <a
                href={`/theatre-games/${game.slug}/`}
                class="block h-full rounded-[var(--radius-card)] border border-ivory-200 bg-white p-5 no-underline transition hover:border-clay-500 hover:shadow-[var(--shadow-soft)]"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-[var(--radius-chip)] bg-clay-100 px-3 py-0.5 text-xs text-clay-700">{COMPETENCY_LABELS[game.competency]}</span>
                  {game.subset && <span class="rounded-[var(--radius-chip)] bg-teal-100 px-3 py-0.5 text-xs text-teal-800">{game.subset}</span>}
                  <span class="rounded-[var(--radius-chip)] bg-mustard-200 px-3 py-0.5 text-xs text-ink-700">{game.cohesion} cohesion</span>
                  <span class="rounded-[var(--radius-chip)] bg-ivory-200 px-3 py-0.5 text-xs text-ink-700">{game.structure}</span>
                </div>
                <h3 class="mt-3 font-display text-xl">{game.name}</h3>
                <p class="mt-1 text-sm text-ink-500">{game.intent}</p>
                {game.sample && <p class="mt-2 text-xs text-ink-300">Sample — pending final import</p>}
              </a>
            </li>
          ))}
        </ul>

        {results.length === 0 && (
          <p class="mt-8 rounded-[var(--radius-card)] border border-dashed border-ivory-200 bg-ivory-50 p-6 text-center text-sm text-ink-500">
            No games match. Try loosening a filter or resetting.
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/components/games/HowToModal.astro`**

```astro
---
const dialogId = 'how-to-use-index';
---
<button
  type="button"
  class="rounded border border-ink-900 px-3 py-1.5 text-sm"
  onclick={`document.getElementById('${dialogId}').showModal()`}
>
  How to use the index
</button>

<dialog id={dialogId} class="w-full max-w-lg rounded-[var(--radius-card)] p-0 backdrop:bg-ink-900/50">
  <form method="dialog" class="p-6">
    <div class="flex items-start justify-between gap-4">
      <h2 class="text-2xl">How to use the Game Index</h2>
      <button type="submit" class="text-ink-500" aria-label="Close">✕</button>
    </div>
    <ol class="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-700">
      <li>Pick one or more <strong>competencies</strong> to narrow the list to games that build the skills you want.</li>
      <li>If your competency has <strong>subsets</strong> (Physical or Vocal Expression do), refine further.</li>
      <li>Match <strong>cohesion</strong> to your group — Low for strangers, Medium for warmed-up groups, High for tight ensembles.</li>
      <li>Choose <strong>Individual</strong> or <strong>Group</strong> depending on how you want players to work.</li>
      <li>Search <strong>intent</strong> or <strong>name</strong> if you already have a specific game or purpose in mind.</li>
      <li>Every filter change updates the URL, so you can share a filtered view with a colleague.</li>
    </ol>
    <p class="mt-4 text-xs text-ink-500">A narrated video walkthrough with screenshots is coming in a later release.</p>
  </form>
</dialog>
```

- [ ] **Step 6: Create `src/pages/theatre-games/finder.astro`**

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
import GameFinder from '@/components/games/GameFinder';
import HowToModal from '@/components/games/HowToModal.astro';
import { loadGamesLite } from '@/lib/games';

const games = await loadGamesLite();
---
<SectionLayout
  title="Game Index"
  section="theatre-games"
  eyebrow="Theatre Games"
  description="Filter by competency, cohesion, group size, or search by name or intent."
>
  <div class="mb-6 flex items-center justify-between gap-4">
    <a href="/theatre-games/" class="text-sm">← Back to Theatre Games</a>
    <HowToModal />
  </div>

  <GameFinder client:load games={games} />
</SectionLayout>
```

- [ ] **Step 7: Verify the finder works in the browser**

Run: `pnpm dev`; open `/theatre-games/finder`. Check:
- Two cards visible (Puppets, Changing Person)
- Clicking a competency chip narrows the results; URL updates (`?competency=…`)
- Cohesion, structure chips work
- Intent + name search work (case-insensitive substring)
- "Reset filters" clears everything
- "How to use the index" button opens the modal; Esc closes
- Refresh the page with `?competency=physical-expression` — filter is restored

Stop the dev server.

- [ ] **Step 8: Verify unit tests still pass and build works**

Run: `pnpm test && pnpm build && pnpm check`
Expected: all 13 tests pass; build and check exit 0.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add Game Finder island with filters, URL state, how-to modal"
```

---

### Task 12: Game detail page + print stylesheet

Render `/theatre-games/<slug>/` with the game frontmatter as a chip header + MDX body (Preparation / Facilitation / Evaluation) + print styling + sample badge.

**Files:**
- Create: `src/pages/theatre-games/[slug].astro`, `src/styles/print.css`
- Modify: `src/styles/global.css` (import print.css)

**Interfaces:**
- Consumes: `getCollection('games')`, `render` from `astro:content`; `Concept` for inline concept refs in game MDX bodies.

- [ ] **Step 1: Create `src/styles/print.css`**

```css
@media print {
  header, footer, aside, nav, [data-mobile-toggle], [data-print-hide] {
    display: none !important;
  }
  html, body {
    background: #fff !important;
    color: #000 !important;
    font-size: 11pt;
  }
  main {
    padding: 0 !important;
  }
  a {
    color: #000 !important;
    text-decoration: none !important;
  }
  h1 { font-size: 20pt; }
  h2 { font-size: 14pt; }
  h3 { font-size: 12pt; }
  .rounded-\[var\(--radius-card\)\],
  .rounded {
    border-radius: 0 !important;
  }
  .shadow-\[var\(--shadow-soft\)\] {
    box-shadow: none !important;
  }
  .prose {
    max-width: none;
  }
}
```

- [ ] **Step 2: Modify `src/styles/global.css`** — add the import at the top of the file below the existing imports:

```css
@import './print.css';
```

- [ ] **Step 3: Create `src/pages/theatre-games/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/layout/Container.astro';
import Chip from '@/components/ui/Chip.astro';
import Concept from '@/components/concept/Concept.astro';
import { COMPETENCY_LABELS } from '@/lib/types';

export async function getStaticPaths() {
  const entries = await getCollection('games');
  return entries.map(entry => ({
    params: { slug: entry.id.replace(/\.mdx?$/, '') },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const g = entry.data;
---
<BaseLayout title={g.name} description={g.intent} section="theatre-games">
  <Container class="py-12">
    <article class="mx-auto max-w-3xl">
      <p class="text-sm text-ink-500">
        <a href="/theatre-games/">Theatre Games</a> ·
        <a href="/theatre-games/finder">Game Index</a>
      </p>

      <div class="mt-4 flex flex-wrap items-center gap-2">
        <Chip tone="clay">{COMPETENCY_LABELS[g.competency]}</Chip>
        {g.subset && <Chip tone="teal">{g.subset}</Chip>}
        <Chip tone="mustard">{g.cohesion} cohesion</Chip>
        <Chip tone="neutral">{g.structure}</Chip>
        {g.sample && <Chip tone="neutral">Sample — pending final import</Chip>}
      </div>

      <h1 class="mt-3">{g.name}</h1>
      <p class="mt-2 text-lg text-ink-500">{g.intent}</p>

      {g.source && (
        <p class="mt-2 text-sm text-ink-500">Source: {g.source}</p>
      )}

      <div class="mt-4" data-print-hide>
        <button
          type="button"
          onclick="window.print()"
          class="rounded border border-ink-900 px-3 py-1.5 text-sm"
        >
          Print this game
        </button>
      </div>

      <div class="prose prose-neutral mt-8 max-w-none">
        <Content components={{ Concept }} />
      </div>
    </article>
  </Container>
</BaseLayout>
```

- [ ] **Step 4: Verify both game detail pages render**

Run: `pnpm dev`; open:
- `/theatre-games/puppets-marionettes/` — chips, name, intent, source, print button, MDX body with Preparation/Facilitation/Evaluation headings, sample badge
- `/theatre-games/changing-person-activity/` — same shape

In devtools, open the print preview (Cmd+P) — nav/footer/print button disappear, page prints black-on-white with serif type.

Stop the dev server.

- [ ] **Step 5: Verify build**

Run: `pnpm build && pnpm check`
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add game detail page and print stylesheet"
```

---

### Task 13: Bulk content import from Google Drive

Pull 8 more games from the client's Drive folder + populate 8 additional concepts. Replace the verbatim landing-page copy on `/theatre-games/` with the real text from the "DT:FC THEATRE GAMES LANDING PAGE" doc.

**Prerequisites:** the client's Google Drive folder URL. Ask the user for it before starting this task. The Google Drive MCP is available (see agent tools).

**Files:**
- Create: 8 new files under `src/content/games/` (slugs TBD from source docs)
- Create: 8 new files under `src/content/concepts/` — `warmup.mdx`, `competency.mdx`, `magic-toolbox.mdx`, `facilitation.mdx`, `fearless-creativity.mdx`, `players.mdx`, `resilience.mdx`, `archetype.mdx`
- Modify: `src/pages/theatre-games/index.astro` (if the Drive doc's verbatim copy differs from the structural placeholder)

**Interfaces:**
- Consumes: seed schemas from Task 5; nothing else new.

- [ ] **Step 1: Ask the user for the Google Drive folder link**

Say: "Task 13 needs the Drive folder link — the source spec references '1. WEBSITE #1' with 7 subfolders. What's the shareable Drive URL?"
Do not proceed until you have the URL.

- [ ] **Step 2: Authenticate the Google Drive MCP if not already**

Use `mcp__claude_ai_Google_Drive__authenticate` if `mcp__claude_ai_Google_Drive__list_recent_files` fails. Follow with `mcp__claude_ai_Google_Drive__complete_authentication`.

- [ ] **Step 3: List the folder to identify game sources**

Use `mcp__claude_ai_Google_Drive__search_files` with a query targeting the "REVISED FRONT PAGE COMPETENCIES" subfolder + the "Warm-up games" subfolder. Pull metadata for candidate game docs.

- [ ] **Step 4: Read the 8 game source docs**

For each doc, use `mcp__claude_ai_Google_Drive__read_file_content`. Aim for coverage across all five competencies and cohesion levels so the finder filters demo well. Suggested targets (adjust based on what's actually available):

- Warmup games: Outrageous Roll-Call, Jabberwocky
- Physical/Movement: Mirrors, Pass the Clap
- Physical/Rhythm: Group rhythm circle
- Vocal/Articulation: Tongue twisters relay
- Context Awareness: A second Changing-Person variant
- Resilience: a game framed around "no failure, only learning"

- [ ] **Step 5: Write each game as `src/content/games/<slug>.mdx`**

For each pulled doc, follow the template used in Task 5. Set `sample: false` since these are real content. Strip editorial comments (`DESIRAE:`, `LOLA:`, `CHERIE NOTE:`, "Pua Thoughts", "for reference only") during migration — see source spec §6 last bullet.

- [ ] **Step 6: Pull the "DT:FC THEATRE GAMES LANDING PAGE" doc from Drive**

Use it to update `src/pages/theatre-games/index.astro` — the top intro paragraph and any audience blurbs should match the verbatim client copy. Keep the five-competency + cohesion + CTA structure.

- [ ] **Step 7: Read the 8 concept source docs and write to `src/content/concepts/`**

The 8 additional concepts and their likely source docs in Drive:

| Slug | Likely Drive doc |
|---|---|
| `warmup` | "Warmup" (PRC folder) |
| `competency` | "Competency: DT:FC" |
| `magic-toolbox` | "Magic Toolbox" |
| `facilitation` | "Facilitation & Facilitator Profile" |
| `fearless-creativity` | "Fearless Creativity" (Roger Holzberg genesis) |
| `players` | "Players" or extract from source spec §2 |
| `resilience` | "Resilience" (or synthesize from Theatre Games competency doc) |
| `archetype` | "Archetypes" |

Follow the same schema as Task 5. Each frontmatter needs `name`, `slug`, `shortDefinition` (≤240 chars), `icon: placeholder`, `related`.

- [ ] **Step 8: Verify the concept id checker still passes**

Run: `pnpm check:concepts`
Expected: all references (in Theatre Games landing and any game bodies that use `<Concept>`) still resolve.

- [ ] **Step 9: Verify the finder now shows 10 games with variety**

Run: `pnpm dev`; open `/theatre-games/finder`.
Expected: 10 total games; toggling competency/cohesion/structure filters yields meaningfully different subsets (not just 1 or 2 results).

- [ ] **Step 10: Verify the PRC now shows 10 concepts**

Open `/resource-center/` — 10 entries, alphabetical, filter search works.

- [ ] **Step 11: Verify build**

Run: `pnpm build && pnpm check`
Expected: both exit 0.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: import 8 games and 8 concepts from client Drive folder"
```

---

### Task 14: Playwright smoke test

Add a single end-to-end test that covers the golden path: landing → PRC → Theatre Games → finder → filter interaction → concept popover.

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/smoke.spec.ts`

**Interfaces:**
- Test runs against a dev server that Playwright starts and stops.

- [ ] **Step 1: Install Playwright**

```bash
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

- [ ] **Step 2: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
  webServer: {
    command: 'pnpm dev',
    port: 4321,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

- [ ] **Step 3: Create `tests/e2e/smoke.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('smoke: landing → PRC → games finder → concept popover', async ({ page }) => {
  // Landing page
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Theatre Games' }).first()).toBeVisible();

  // Navigate to PRC
  await page.getByRole('link', { name: 'Players Resource Center' }).first().click();
  await expect(page).toHaveURL(/\/resource-center\/?$/);
  await expect(page.getByText('What are the ICONS')).toBeVisible();

  // Navigate to Theatre Games landing
  await page.getByRole('link', { name: 'Theatre Games' }).first().click();
  await expect(page).toHaveURL(/\/theatre-games\/?$/);
  await expect(page.getByRole('heading', { name: 'The five competencies' })).toBeVisible();

  // Open the Concept popover (Cohesion)
  const cohesionButton = page.getByRole('button', { name: /Cohesion/i }).first();
  await cohesionButton.click();
  await expect(page.getByText(/level of group bonding|How bonded a group is/i).first()).toBeVisible();
  await page.keyboard.press('Escape');

  // Open the Game Index
  await page.getByRole('link', { name: /Open the Game Index/i }).click();
  await expect(page).toHaveURL(/\/theatre-games\/finder/);

  // Read baseline count, apply a filter, check count changes
  const countText = page.locator('[aria-live="polite"] p');
  const before = await countText.textContent();
  await page.getByRole('button', { name: 'Physical Expression', exact: false }).click();
  await expect(countText).not.toHaveText(before ?? '');
  await expect(page).toHaveURL(/competency=physical-expression/);

  // No unexpected console errors
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.reload();
  expect(errors, `Console/page errors:\n${errors.join('\n')}`).toEqual([]);
});
```

- [ ] **Step 4: Run the E2E test**

Run: `pnpm test:e2e`
Expected: 1 test passes.

If the test fails, don't push through — investigate the failure. Common causes: the Concept popover text differs from the assertion, filter chip label text mismatches (case, whitespace), or the base URL isn't reachable in 60s (increase timeout).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: add Playwright smoke test covering golden path"
```

---

### Task 15: CLAUDE.md + verify success criteria + final polish

Write the project's CLAUDE.md, verify every Cycle 1 success criterion from the design doc, and mark the cycle complete.

**Files:**
- Create: `CLAUDE.md`

**Interfaces:**
- Consumes: everything built so far.

- [ ] **Step 1: Create `CLAUDE.md`**

```markdown
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
```

- [ ] **Step 2: Run every quality gate together**

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm check:concepts
pnpm test
pnpm build
pnpm test:e2e
```

Expected: every command exits 0. If any fails, fix it before continuing.

- [ ] **Step 3: Verify success criteria from design spec §13**

Walk through each item and check it manually:

- [x] `pnpm dev` starts a working local site
- [x] All 7 nav items resolve; the 5 stub sections show intentional placeholder content
- [x] `/theatre-games/` renders with all spec-required sections and inline Concept icons
- [x] `/theatre-games/finder` filters by all six axes; URL round-trips filter state; result count announced to screen readers
- [x] `/theatre-games/[slug]` renders correctly for the 2 real seed games + the 8 imported games, prints cleanly
- [x] `/resource-center/` and `/resource-center/[slug]/` render all seeded concepts
- [x] Concept popovers work with mouse, touch, and keyboard
- [x] Vitest unit tests pass; Playwright smoke test passes
- [x] `pnpm build` produces a valid static site with no errors and no unresolved Concept ids
- [ ] Basic AA audit clean on landing, PRC, Theatre Games landing, finder, and a game detail page

For the AA audit, install and run `axe` via a browser devtools extension or CLI, or run this quick script in the browser console on each page:

```js
// Requires the axe-core extension or a manual paste of axe.min.js
axe.run().then(r => console.log(r.violations));
```

Fix any critical violations (contrast, missing labels) before shipping. Log any deferred non-critical items in this file.

- [ ] **Step 4: Commit the final polish**

```bash
git add -A
git commit -m "docs: add CLAUDE.md and complete Cycle 1"
```

- [ ] **Step 5: Cycle 1 complete**

Cycle 1 is done. Next cycle picks up from `docs/superpowers/specs/2026-08-10-dtfc-website-cycle1-design.md` §2.2 (see "Cycle 2 — Shakespeare section" etc.) and starts its own spec → plan → implementation flow.
