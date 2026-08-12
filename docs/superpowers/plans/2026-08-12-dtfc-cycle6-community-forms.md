# DT:FC Cycle 6 — Community Section + Forms Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deep-build the DT:FC Community section per source spec §5 (all 7 subsections) and wire the three TODO(esp)-stubbed forms shipped in earlier cycles to a Formspree gateway with a build-time `mailto:` fallback for when envs are unset.

**Architecture:** Three new data sources — `newsletters` MDX collection, `COMPANION_THEATRES` structured data file, `TESTIMONIALS` structured data file (both follow the Cycle 5 FOUNDERS pattern with inline Zod validation + slug-uniqueness IIFE). New `CommunityLayout.astro` wraps `SectionLayout` with a 7-item persistent sub-nav. A new `formActionFor()` helper in `src/lib/form-action.ts` is the critical wire — every form component reads it at render time and either produces a real Formspree action URL or the fallback state. Site's first `.env` config surface lands this cycle; `.env.example` is committed with placeholder values.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@theme` tokens), TypeScript strict, Zod (via `astro/zod`), MDX for newsletter bodies, Formspree gateway (external), Vitest, Playwright.

## Global Constraints

- **Branch:** all work on `cycle-6-community-forms`. Merge to `main` at cycle end uses `git merge --no-ff`.
- **Package manager:** `pnpm` only. Commands: `pnpm dev`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm check:concepts`, `pnpm check:prohibited`.
- **Node module type:** `"type": "module"` — ESM everywhere.
- **No hex codes in components** — colors come from tokens in `src/styles/tokens.css`. No new tokens are added this cycle.
- **Vocabulary:** "Players" (never "actors"), "Facilitator" (never "leader"), "Players Resource Center" (full), "Children's Theatre" (curly apostrophe).
- **CURLY APOSTROPHES IN ALL PROSE — enforced automatically.** Cycle 5's guardrail (`scripts/check-prohibited-text.mjs`) runs in `pnpm build` and fails on any straight U+0027 in prose contexts inside new `.astro` / `.mdx` / `.md` files. Per-task prompts do NOT need per-task apostrophe grep reminders — the build failure is the check. New Cycle 6 files must NOT be added to `CURLY_APOSTROPHE_ALLOWLIST` (the whitelist is only for pre-existing shipped debt).
- **Prohibited landing/site copy** (unchanged): `Great Change`, `traditional work and ways`, `THIS (crazy) time`, `RESILIENCEl`, `Childrens' Theatre` (wrong-apostrophe variant).
- **CLIENT REVIEW markers:** any drafted prose not verbatim from Drive source docs gets `{/* CLIENT REVIEW: reason */}` in `.astro` or `<!-- CLIENT REVIEW: reason -->` in `.mdx` above the drafted block.
- **Sample-content flag:** any content not real client-authored gets `sample: true` in its frontmatter/data. Templates render a "Sample — pending final import" chip.
- **Commit granularity:** one commit per task. Commit messages authored `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` via HEREDOC.
- **Landing anchor preservation:** `/community/#membership` (Cycles 2 + 5 reference it via `IDEA_TWO_ANSWERS` in `src/data/landing.ts` and via `/legacy/#become-part-of-this-legacy` cross-link) MUST be preserved.
- **Section identity:** every `/community/*` page uses `<CommunityLayout>` (T3) which passes `section="community"` to the base primary nav so the "Community" nav item marks current.
- **Env variables:** all three `PUBLIC_FORMSPREE_*` env vars use the `PUBLIC_` prefix (Astro convention — safe to expose in client HTML; Formspree IDs are meant to be public). `.env` is git-ignored (already handled by `.gitignore` from Cycle 1). `.env.example` is committed.
- **pnpm check verification:** the reviewer MUST run `pnpm check` independently after every task, not trust the implementer's report. Cycle 5 T5+T6 both slipped 9 TypeScript errors past the reviewer because both trusted the implementer's "0 errors" claim without running the command.
- **Six client-blocker soft-ships shipped visibly this cycle** (all wired via the fallback pattern or a visible chip; not defects):
  1. `/community/membership/` — pre-release chip + dual-purpose interest form
  2. `/community/donate/` — "coming soon" chip + `mailto:` fallback CTA
  3. `/community/testimonials/` display — empty-state placeholder when `TESTIMONIALS.length === 0`
  4. `AskShakespeareForm` — CLIENT REVIEW comment above (no visible chip; wired to Formspree dashboard)
  5. Four Formspree-wired forms — "Form not yet configured" note + `mailto:` fallback when env is empty
  6. `CompanionTheatreCard` — "Sample directory — pending full import" chip on any `sample: true` card

---

## File Map

**Create:**
- `.env.example`
- `src/lib/form-action.ts` (formActionFor helper)
- `src/lib/community-nav.ts`
- `src/layouts/CommunityLayout.astro`
- `src/data/companion-theatres.ts`
- `src/data/testimonials.ts`
- `src/content/newsletters/` (directory; may be populated by Drive import or ship empty)
- `src/components/community/CompanionTheatreCard.astro`
- `src/components/community/TestimonialCard.astro`
- `src/components/community/TestimonialForm.astro`
- `src/components/community/NewsletterCard.astro`
- `src/components/community/NewsletterDetail.astro`
- `src/pages/community/about.astro`
- `src/pages/community/how-were-organized.astro`
- `src/pages/community/membership.astro`
- `src/pages/community/donate.astro`
- `src/pages/community/newsletters/index.astro`
- `src/pages/community/newsletters/[slug].astro`
- `src/pages/community/companion-theatres.astro`
- `src/pages/community/testimonials.astro`
- `tests/unit/form-action.test.ts`
- `tests/unit/community.test.ts`
- `tests/unit/companion-theatres.test.ts`
- `tests/unit/testimonials.test.ts`
- `tests/unit/newsletters.test.ts`
- `docs/superpowers/plans/2026-08-12-dtfc-cycle6-community-forms.md` (this file)

**Modify:**
- `src/lib/content-schemas.ts` — add `newslettersSchema`, `NewsletterEntry` type export.
- `src/content.config.ts` — register `newsletters` collection.
- `src/components/ui/NewsletterSignup.astro` — rewrite to use `formActionFor('newsletter')` + fallback.
- `src/components/landing/NewsletterTile.astro` — rewrite to use `formActionFor('newsletter')` + fallback.
- `src/components/shakespeare/AskShakespeareForm.astro` — rewrite to use `formActionFor('askShakespeare')` + fallback.
- `src/components/layout/Footer.astro` line ~35 — swap Donate link from `/community/` to `/community/donate/`.
- `src/pages/community/index.astro` — rewrite (preserve `#membership` anchor + add directory grid).
- `tests/unit/_astro-content.ts` — add `newslettersSchema` to imports + `case 'newsletters'` in the switch.
- `tests/e2e/smoke.spec.ts` — extend with Community block.
- `CLAUDE.md` — Community/forms conventions, "Adding a newsletter/companion theatre/testimonial", `.env` config section, form-fallback behavior.

**Auto-memory updates (end of cycle):** `project_dtfc_cycles.md`, `project_dtfc_followups.md`.

---

## Special Task: Drive Import Coordination

**Task 4 (Drive MCP import) requires the client's Google Drive folder link.** Before dispatching Task 4's implementer, the controller must ask the human partner:

> "Do you have the Google Drive folder link for the Community source content (Companion Theatres directory, past newsletter archive, About DT:FC copy, How We're Organized copy, any drafted Membership/Donate/Testimonials copy)? Same folder as Cycles 3-5 works. If not, I'll skip the import and Cycle 6 ships with placeholder stubs (3 sample companion theatres, empty newsletter archive, CLIENT REVIEW copy on About/How We're Organized)."

If the user provides the link, Task 4 proceeds. If not, Task 4 is skipped (mark deferred; proceed to Task 5 with placeholders in place). All downstream tasks work with either real or placeholder content.

---

## Task 1: `.env.example` + `formActionFor()` helper + tests

**Files:**
- Create: `.env.example`
- Create: `src/lib/form-action.ts`
- Create: `tests/unit/form-action.test.ts`

**Interfaces produced:**
- Named export: `type FormKey = 'newsletter' | 'askShakespeare' | 'testimonial'`
- Named export: `function formActionFor(key: FormKey): { action: string; fallbackMode: boolean }`
- Three env vars documented in `.env.example`: `PUBLIC_FORMSPREE_NEWSLETTER_ID`, `PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID`, `PUBLIC_FORMSPREE_TESTIMONIAL_ID`.
- Behavior contract: when env is set to a non-empty, non-`xxxxxxxx` value, returns `{ action: 'https://formspree.io/f/<id>', fallbackMode: false }`. Otherwise returns `{ action: '#', fallbackMode: true }`.

- [ ] **Step 1: Write the failing test at `tests/unit/form-action.test.ts`**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('formActionFor', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('returns real Formspree URL when env is set to a valid id', async () => {
    vi.stubEnv('PUBLIC_FORMSPREE_NEWSLETTER_ID', 'abc12345');
    vi.stubEnv('PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID', 'def67890');
    vi.stubEnv('PUBLIC_FORMSPREE_TESTIMONIAL_ID', 'ghi54321');
    const { formActionFor } = await import('@/lib/form-action');
    expect(formActionFor('newsletter')).toEqual({
      action: 'https://formspree.io/f/abc12345',
      fallbackMode: false,
    });
    expect(formActionFor('askShakespeare')).toEqual({
      action: 'https://formspree.io/f/def67890',
      fallbackMode: false,
    });
    expect(formActionFor('testimonial')).toEqual({
      action: 'https://formspree.io/f/ghi54321',
      fallbackMode: false,
    });
  });

  it('returns fallback when env is the xxxxxxxx placeholder', async () => {
    vi.stubEnv('PUBLIC_FORMSPREE_NEWSLETTER_ID', 'xxxxxxxx');
    const { formActionFor } = await import('@/lib/form-action');
    expect(formActionFor('newsletter')).toEqual({
      action: '#',
      fallbackMode: true,
    });
  });

  it('returns fallback when env is unset (undefined)', async () => {
    vi.stubEnv('PUBLIC_FORMSPREE_TESTIMONIAL_ID', '');
    const { formActionFor } = await import('@/lib/form-action');
    expect(formActionFor('testimonial')).toEqual({
      action: '#',
      fallbackMode: true,
    });
  });

  it('returns fallback when env is an empty string', async () => {
    vi.stubEnv('PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID', '');
    const { formActionFor } = await import('@/lib/form-action');
    expect(formActionFor('askShakespeare')).toEqual({
      action: '#',
      fallbackMode: true,
    });
  });

  it('each FormKey has an independent env — one set does not affect the others', async () => {
    vi.stubEnv('PUBLIC_FORMSPREE_NEWSLETTER_ID', 'realvalue');
    vi.stubEnv('PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID', '');
    vi.stubEnv('PUBLIC_FORMSPREE_TESTIMONIAL_ID', 'xxxxxxxx');
    const { formActionFor } = await import('@/lib/form-action');
    expect(formActionFor('newsletter').fallbackMode).toBe(false);
    expect(formActionFor('askShakespeare').fallbackMode).toBe(true);
    expect(formActionFor('testimonial').fallbackMode).toBe(true);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL (module not found)**

```bash
pnpm test tests/unit/form-action.test.ts
```

Expected: FAIL — `@/lib/form-action` module missing.

- [ ] **Step 3: Create `src/lib/form-action.ts`**

```typescript
/**
 * Form-gateway action-URL helper. Every form component reads this at render
 * time and either produces a real Formspree action URL or a fallback state.
 *
 * When the corresponding PUBLIC_FORMSPREE_* env var is set to a non-empty,
 * non-`xxxxxxxx` (placeholder) value, returns the real action URL and
 * fallbackMode: false. Otherwise returns action: '#' and fallbackMode: true.
 *
 * Fallback UI: components render a "Form not yet configured" note + a
 * mailto: link and (optionally) disable the submit button. This lets the
 * site ship + merge before the client provides real Formspree IDs; forms
 * activate the moment `.env` is populated and the site rebuilds.
 */
export type FormKey = 'newsletter' | 'askShakespeare' | 'testimonial';

const PLACEHOLDER = 'xxxxxxxx';

export function formActionFor(key: FormKey): { action: string; fallbackMode: boolean } {
  const envVar: Record<FormKey, string | undefined> = {
    newsletter: import.meta.env.PUBLIC_FORMSPREE_NEWSLETTER_ID,
    askShakespeare: import.meta.env.PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID,
    testimonial: import.meta.env.PUBLIC_FORMSPREE_TESTIMONIAL_ID,
  };
  const id = envVar[key];
  if (id && id !== PLACEHOLDER && id.length > 0) {
    return { action: `https://formspree.io/f/${id}`, fallbackMode: false };
  }
  return { action: '#', fallbackMode: true };
}
```

- [ ] **Step 4: Create `.env.example`**

```
# DT:FC form-gateway configuration.
#
# The three PUBLIC_FORMSPREE_* variables below wire the site's four
# forms (footer newsletter signup, landing newsletter tile, Ask
# Shakespeare, and community testimonial) to Formspree. Copy this
# file to .env and replace each `xxxxxxxx` with the corresponding
# Formspree endpoint ID from https://formspree.io.
#
# The PUBLIC_ prefix is Astro convention — safe to expose in
# built client HTML. Formspree IDs are meant to be public.
#
# If a variable is left as `xxxxxxxx` (or blank), that form renders
# a "Form not yet configured" note + a mailto: fallback link at
# build time. No build failure, no runtime crash. Forms activate
# the moment `.env` is populated and the site rebuilds.

# Both the footer NewsletterSignup and the landing NewsletterTile
# use this same ID.
PUBLIC_FORMSPREE_NEWSLETTER_ID=xxxxxxxx

# Ask Shakespeare submission form (Shakespeare section).
# Submissions currently route to the Formspree dashboard; email
# destination pending client decision.
PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID=xxxxxxxx

# Community testimonial submission form (Community section).
PUBLIC_FORMSPREE_TESTIMONIAL_ID=xxxxxxxx
```

- [ ] **Step 5: Verify `.gitignore` already excludes `.env`**

```bash
grep -E '^\.env' .gitignore
```

Expected output:
```
.env
.env.*
!.env.example
```

If the pattern is not present, STOP and report BLOCKED — someone deleted the Cycle 1 gitignore rules. The intended behavior: `.env` and any `.env.*` variant are git-ignored, EXCEPT `.env.example` which is committed.

- [ ] **Step 6: Run tests to verify they pass**

```bash
pnpm test tests/unit/form-action.test.ts
```

Expected: all 5 tests pass.

- [ ] **Step 7: Verify with `pnpm check`**

```bash
pnpm check
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 8: Verify `.env.example` is tracked and `.env` is NOT**

```bash
git status --ignored -- .env .env.example
```

Expected: `.env.example` appears under "Untracked" (before `git add`) or nothing (after add), and `.env` (if it exists on your machine at all) appears under "Ignored". If `.env` does not exist locally, `git status --ignored` will not mention it — that's fine.

- [ ] **Step 9: Commit**

```bash
git add .env.example src/lib/form-action.ts tests/unit/form-action.test.ts
git commit -m "$(cat <<'EOF'
feat(forms): add formActionFor helper + .env.example scaffold

New src/lib/form-action.ts exports FormKey type + formActionFor(key)
returning { action, fallbackMode }. When PUBLIC_FORMSPREE_<KEY>_ID is
set to a real value, produces a Formspree action URL. When unset, empty,
or still the `xxxxxxxx` placeholder, returns fallback state so form
components can render a "Form not yet configured" note + mailto link.

.env.example documents the three form endpoints. .env is git-ignored
per the Cycle 1 rules (already in place; verified).

Vitest covers 5 cases: real values for all three keys, xxxxxxxx
placeholder, empty string, unset, and independence between keys.

This is the foundation for T7 (rewriting the 3 existing form
components) and T8 (new TestimonialForm).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Extend content schemas + register newsletters collection

**Files:**
- Modify: `src/lib/content-schemas.ts` — add `newslettersSchema` + `type NewsletterEntry`.
- Modify: `src/content.config.ts` — register `newsletters`.
- Modify: `tests/unit/_astro-content.ts` — add `newslettersSchema` to imports + `case 'newsletters'` in switch.
- Create: `src/content/newsletters/` (empty directory — populated by Task 4 Drive import or stays empty; the collection loader handles empty directories cleanly).
- Create: `tests/unit/newsletters.test.ts`

**Interfaces produced:**
- `newslettersSchema` — Zod object with `title, issueNumber (int positive), publishDate (string), excerpt (max 200), sample (bool, default false)`.
- `NewsletterEntry` type export via `z.infer<>`.
- `newsletters` collection registered.

- [ ] **Step 1: Write failing test `tests/unit/newsletters.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('newsletters collection', () => {
  it('is registered and returns an array (may be empty)', async () => {
    const entries = await getCollection('newsletters');
    expect(Array.isArray(entries)).toBe(true);
  });

  it('every newsletter excerpt is at most 200 chars', async () => {
    const entries = await getCollection('newsletters');
    for (const e of entries) {
      expect(e.data.excerpt.length, `${e.id} excerpt too long`).toBeLessThanOrEqual(200);
    }
  });

  it('every newsletter has a positive integer issueNumber', async () => {
    const entries = await getCollection('newsletters');
    for (const e of entries) {
      expect(Number.isInteger(e.data.issueNumber), `${e.id} issueNumber not int`).toBe(true);
      expect(e.data.issueNumber, `${e.id} issueNumber not positive`).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run test — expect FAIL (collection unknown)**

```bash
pnpm test tests/unit/newsletters.test.ts
```

Expected: FAIL — `Unknown collection: newsletters` from the Vitest shim's switch.

- [ ] **Step 3: Extend `src/lib/content-schemas.ts`**

Add these exports at the end of the file:

```typescript
export const newslettersSchema = z.object({
  title: z.string(),
  issueNumber: z.number().int().positive(),
  publishDate: z.string(),
  excerpt: z.string().max(200),
  sample: z.boolean().default(false),
});
export type NewsletterEntry = z.infer<typeof newslettersSchema>;
```

- [ ] **Step 4: Register `newsletters` in `src/content.config.ts`**

Locate the existing `defineCollection` calls (essays, scripts, etc.). Add:

```typescript
import { newslettersSchema } from '@/lib/content-schemas';

const newsletters = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/newsletters' }),
  schema: newslettersSchema,
});
```

Add `newsletters` to the final `export const collections = { ... }` map.

- [ ] **Step 5: Extend Vitest shim `tests/unit/_astro-content.ts`**

Add `newslettersSchema` to the import block:

```typescript
import {
  gameSchema,
  conceptSchema,
  scriptsSchema,
  askShakespeareSchema,
  colloquialSchema,
  essaysSchema,
  newslettersSchema,
} from '@/lib/content-schemas';
```

Add case in the switch statement (mirror the existing pattern):

```typescript
    case 'newsletters':
      schema = newslettersSchema;
      break;
```

- [ ] **Step 6: Create the (empty) newsletters directory**

```bash
mkdir -p src/content/newsletters
```

Leave empty for now. If the directory is empty at build time, Astro's `getCollection('newsletters')` returns `[]` cleanly. Task 4 (Drive import) may populate it.

**Note:** git does not track empty directories. Add a placeholder file to force it under version control:

```bash
touch src/content/newsletters/.gitkeep
```

- [ ] **Step 7: Run tests to verify they pass**

```bash
pnpm test tests/unit/newsletters.test.ts
```

Expected: all 3 tests pass (with 0 entries in the collection — the length-and-integer assertions loop over nothing, so they trivially pass; the array-check confirms the collection is registered).

- [ ] **Step 8: Verify `pnpm check` + `pnpm build`**

```bash
pnpm check
pnpm build
```

Expected: `pnpm check` — 0 errors, 0 warnings. `pnpm build` — succeeds; both prebuild guardrails print `✓`.

- [ ] **Step 9: Commit**

```bash
git add src/lib/content-schemas.ts src/content.config.ts tests/unit/_astro-content.ts src/content/newsletters/.gitkeep tests/unit/newsletters.test.ts
git commit -m "$(cat <<'EOF'
feat(community): register newsletters MDX collection

Adds newslettersSchema (title, issueNumber, publishDate, excerpt≤200,
sample) and NewsletterEntry type to src/lib/content-schemas.ts.
Registers newsletters collection in content.config.ts + Vitest shim.

src/content/newsletters/ ships empty this cycle (Task 4 Drive import
may populate it). Empty collection returns [] cleanly.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: `COMMUNITY_NAV` data + `CommunityLayout` wrapper

**Files:**
- Create: `src/lib/community-nav.ts`
- Create: `src/layouts/CommunityLayout.astro`

**Interfaces produced:**
- `COMMUNITY_NAV: CommunityNavItem[]` — 7 items.
- `<CommunityLayout title description? eyebrow? subPage?>` — wraps `SectionLayout` with a persistent sub-nav row. Mirror of Cycle 5's `LegacyLayout`.

- [ ] **Step 1: Create `src/lib/community-nav.ts`**

```typescript
export interface CommunityNavItem {
  key: string;
  label: string;
  href: string;
}

export const COMMUNITY_NAV: CommunityNavItem[] = [
  { key: 'about', label: 'About', href: '/community/about/' },
  { key: 'how-were-organized', label: 'How We&rsquo;re Organized', href: '/community/how-were-organized/' },
  { key: 'membership', label: 'Membership', href: '/community/membership/' },
  { key: 'donate', label: 'Donate', href: '/community/donate/' },
  { key: 'newsletters', label: 'Newsletters', href: '/community/newsletters/' },
  { key: 'companion-theatres', label: 'Companion Theatres', href: '/community/companion-theatres/' },
  { key: 'testimonials', label: 'Testimonials', href: '/community/testimonials/' },
];
```

**Note on the `&rsquo;` in the label:** the label renders via `set:html` in the layout so the HTML entity resolves to U+2019. This is consistent with how LegacyLayout renders labels containing apostrophes.

- [ ] **Step 2: Create `src/layouts/CommunityLayout.astro`**

```astro
---
import SectionLayout from './SectionLayout.astro';
import { COMMUNITY_NAV } from '@/lib/community-nav';

interface Props {
  title: string;
  description?: string;
  eyebrow?: string;
  subPage?: string;
}
const { title, description, eyebrow, subPage } = Astro.props;
---

<SectionLayout title={title} description={description} section="community" eyebrow={eyebrow}>
  <nav aria-label="Community section" class="border-ivory-200 mb-8 border-b pb-3">
    <ul class="flex flex-wrap gap-x-5 gap-y-2">
      {
        COMMUNITY_NAV.map((item) => (
          <li>
            <a
              href={item.href}
              class={`text-ink-700 hover:text-clay-500 inline-block py-1 text-sm no-underline ${
                subPage === item.key ? 'border-clay-500 text-ink-900 border-b-2 font-medium' : ''
              }`}
              aria-current={subPage === item.key ? 'page' : undefined}
              set:html={item.label}
            />
          </li>
        ))
      }
    </ul>
  </nav>

  <slot />
</SectionLayout>
```

- [ ] **Step 3: `pnpm check`**

```bash
pnpm check
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Commit**

```bash
git add src/lib/community-nav.ts src/layouts/CommunityLayout.astro
git commit -m "$(cat <<'EOF'
feat(community): add COMMUNITY_NAV + CommunityLayout wrapper

Seven sub-nav items drive the persistent nav bar on every /community/*
page. Layout wraps SectionLayout, injecting the sub-nav below the
section h1. Mirror of Cycle 5 LegacyLayout structure. Labels render
via set:html so HTML entities (&rsquo; in "How We're Organized")
resolve to U+2019.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Drive MCP seed content import (conditional)

**Prerequisite:** the controller must ask the human partner for the Google Drive folder link before dispatching this task. If no link, skip this task (mark deferred; proceed to Task 5 with placeholders in place).

**Files:**
- Populate: `src/content/newsletters/*.mdx` (one per past issue found, or 0 if none exist)
- Stage: `.superpowers/sdd/<workspace>/imports/` — `about.txt`, `how-were-organized.txt`, and optionally `membership.txt` / `donate.txt` / `testimonials.txt` if drafted copy exists in Drive.
- Stage: `.superpowers/sdd/<workspace>/imports/companion-theatres.json` — a JSON array of `{ slug, name, city, state, website?, contactName?, contactEmail?, blurb }` records extracted from the Drive Companion Theatres directory (Task 5 consumes this to populate `src/data/companion-theatres.ts`).

**Interfaces produced:** same collection interfaces as Task 2 populated with real content when available; staged plain-text source for downstream page-content tasks.

- [ ] **Step 1: Confirm the Drive folder link is available**

The controller provided the Drive folder URL. If not, reply `BLOCKED — no Drive folder link provided; controller should skip Task 4 per its dispatch contract`.

- [ ] **Step 2: Enumerate the folder via Google Drive MCP**

Google Drive MCP tools live under `mcp__claude_ai_Google_Drive__*`. Discover schemas via ToolSearch (query: `select:mcp__claude_ai_Google_Drive__search_files,mcp__claude_ai_Google_Drive__read_file_content,mcp__claude_ai_Google_Drive__download_file_content,mcp__claude_ai_Google_Drive__list_recent_files`).

Enumerate the Community-relevant subfolders / docs. Report the tree structure in your report (paths only, no content quoting per Cycle 3 lesson).

Expected content:
- Companion Theatres directory (any format — likely a doc or spreadsheet listing partner theatres)
- Newsletter archive subfolder (past issues, likely markdown or Google Docs)
- About DT:FC source doc
- How We're Organized source doc (may mention Distributed Leadership model, Coordinating Council, standing committees, fiscal sponsorship via We Tell Stories)
- Any drafted Membership / Donate / Testimonials copy

- [ ] **Step 3: Convert Companion Theatres source to staged JSON**

For each theatre listed in the Drive Companion Theatres directory (doc or spreadsheet):
- Extract `name`, `city`, `state`, and any of the optional fields (`website`, `contactName`, `contactEmail`, `blurb`).
- Generate a `slug` from the name (ASCII kebab-case; e.g., "Bay Area Children's Theatre" → `bay-area-childrens-theatre`).
- Write the array to `.superpowers/sdd/<workspace>/imports/companion-theatres.json` as JSON.

Example shape:

```json
[
  {
    "slug": "example-theatre",
    "name": "Example Theatre",
    "city": "Anytown",
    "state": "CA",
    "website": "https://example.com",
    "blurb": "One or two sentences on the partnership."
  }
]
```

- [ ] **Step 4: Convert newsletter archive docs to MDX**

For each past newsletter found:
- Read via `mcp__claude_ai_Google_Drive__read_file_content`.
- Write to `src/content/newsletters/<slug>.mdx` where `<slug>` is derived from the issue (e.g., `2025-01-issue-1.mdx` or `january-2025.mdx` — kebab-case; must be unique).
- Frontmatter: `title, issueNumber, publishDate (ISO YYYY-MM-DD), excerpt (≤ 200 chars), sample: false`.
- Body H2 sections: `## In this issue`, `## Highlights`, `## Announcements` (or adapt to source structure).
- **Strip editorial markers** per Cycle 3/4/5 discipline: `DESIRAE:`, `LOLA:`, `CHERIE NOTE:`, `PUA THOUGHTS`, `burgundy edits`, `for reference only`, `TO DO`.
- All prose apostrophes MUST be curly (U+2019) — Task 1's guardrail will fail `pnpm build` on any straight ones.

If NO past newsletters exist in Drive, leave `src/content/newsletters/` empty (just the `.gitkeep` from Task 2). The newsletters index page renders an empty-state message.

- [ ] **Step 5: Stage source text for Tasks 13-16**

```bash
mkdir -p /Users/cnote/projects/dtfc/.superpowers/sdd/2026-08-12-dtfc-cycle6-community-forms/imports/
```

For each source doc found:
- `About DT:FC` source → `imports/about.txt`
- `How We're Organized` source → `imports/how-were-organized.txt`
- Any drafted Membership copy → `imports/membership.txt` (optional)
- Any drafted Donate copy → `imports/donate.txt` (optional)
- Any drafted Testimonials copy → `imports/testimonials.txt` (optional)

These files are consumed by Tasks 13, 14, 15, 16, 19. They live outside git (`.superpowers/sdd/**` is git-ignored).

- [ ] **Step 6: Verify build**

```bash
pnpm test tests/unit/newsletters.test.ts
pnpm build
```

Expected: newsletter suite passes (empty or populated); build succeeds; guardrails clean.

- [ ] **Step 7: Commit**

Only committed files: any new/modified `src/content/newsletters/*.mdx`.

```bash
git add src/content/newsletters/
git commit -m "$(cat <<'EOF'
feat(community): import seed content from client Drive folder

- Newsletters: <N> past issues imported to src/content/newsletters/
  (or 0 if archive is empty).
- Companion theatres: <N> entries staged to imports/companion-theatres.json
  for Task 5 to consume.
- Source text for Tasks 13 (About), 14 (How We're Organized), and
  optionally Tasks 15/16/19 staged to .superpowers/sdd/*/imports/.

Editorial markers stripped per Cycle 3/4/5 discipline. Curly-apostrophe
guardrail (from Cycle 5) verifies at build time.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

If NO new files are added (no newsletters found), skip the commit and mark this task complete with just the staged `imports/` files.

**Output rule** (Cycle 3/4/5 lesson): do NOT quote imported content in your final reply or report. File paths, counts, and outcomes only.

---

## Task 5: `COMPANION_THEATRES` data file + tests

**Files:**
- Create: `src/data/companion-theatres.ts`
- Create: `tests/unit/companion-theatres.test.ts`

**Interfaces produced:**
- `COMPANION_THEATRES: CompanionTheatre[]` — 3+ structured objects. Validated by inline Zod at import.
- `CompanionTheatre` type export.
- Per-import IIFE that throws on schema drift or duplicate slugs.

- [ ] **Step 1: Write failing test `tests/unit/companion-theatres.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { COMPANION_THEATRES } from '@/data/companion-theatres';

describe('COMPANION_THEATRES data', () => {
  it('has at least 3 entries', () => {
    expect(COMPANION_THEATRES.length).toBeGreaterThanOrEqual(3);
  });

  it('every theatre slug is unique', () => {
    const slugs = COMPANION_THEATRES.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every theatre has required fields (slug, name, city, state, blurb)', () => {
    for (const t of COMPANION_THEATRES) {
      expect(t.slug, `${t.name} missing slug`).toBeTruthy();
      expect(t.name, `${t.slug} missing name`).toBeTruthy();
      expect(t.city, `${t.slug} missing city`).toBeTruthy();
      expect(t.state, `${t.slug} missing state`).toBeTruthy();
      expect(t.blurb, `${t.slug} missing blurb`).toBeTruthy();
    }
  });

  it('every blurb is at most 300 chars', () => {
    for (const t of COMPANION_THEATRES) {
      expect(t.blurb.length, `${t.slug} blurb too long`).toBeLessThanOrEqual(300);
    }
  });

  it('slugs are ASCII kebab-case', () => {
    for (const t of COMPANION_THEATRES) {
      expect(t.slug, `${t.slug} not kebab-case`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});
```

- [ ] **Step 2: Run test — FAIL (module not found)**

```bash
pnpm test tests/unit/companion-theatres.test.ts
```

- [ ] **Step 3: Create `src/data/companion-theatres.ts`**

If Task 4 staged real data at `.superpowers/sdd/<workspace>/imports/companion-theatres.json`, read it and populate the array. Otherwise use 3 placeholder entries flagged `sample: true`.

```typescript
import { z } from 'astro/zod';

const CompanionTheatreSchema = z.object({
  slug: z.string(),
  name: z.string(),
  city: z.string(),
  state: z.string(),
  website: z.string().url().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  blurb: z.string().max(300),
  sample: z.boolean().default(false),
  unconfirmed: z.boolean().default(false),
});
export type CompanionTheatre = z.infer<typeof CompanionTheatreSchema>;

export const COMPANION_THEATRES: CompanionTheatre[] = [
  {
    slug: 'placeholder-theatre-one',
    name: 'Placeholder Theatre One',
    city: 'Anytown',
    state: 'CA',
    blurb:
      'A companion theatre in the DT:FC network. Placeholder entry &mdash; real directory arrives with the Drive import.',
    sample: true,
    unconfirmed: false,
  },
  {
    slug: 'placeholder-theatre-two',
    name: 'Placeholder Theatre Two',
    city: 'Somewhere',
    state: 'CO',
    blurb:
      'A companion theatre in the DT:FC network. Placeholder entry &mdash; real directory arrives with the Drive import.',
    sample: true,
    unconfirmed: false,
  },
  {
    slug: 'placeholder-theatre-three',
    name: 'Placeholder Theatre Three',
    city: 'Elsewhere',
    state: 'OR',
    blurb:
      'A companion theatre in the DT:FC network. Placeholder entry &mdash; real directory arrives with the Drive import.',
    sample: true,
    unconfirmed: false,
  },
];

// Build-time verification: schema + slug uniqueness.
(function verifyAtImport() {
  for (const t of COMPANION_THEATRES) CompanionTheatreSchema.parse(t);
  const slugs = COMPANION_THEATRES.map((t) => t.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error('COMPANION_THEATRES slugs must be unique');
  }
})();
```

**Note on `.default()` fields:** the FOUNDERS lesson from Cycle 5 T7 — `z.infer<>` returns the OUTPUT type where defaults are required at literal-check time. Include `sample: false/true` and `unconfirmed: false/true` explicitly on every entry (as shown above). TypeScript strict will otherwise reject the object literals.

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test tests/unit/companion-theatres.test.ts
```

Expected: all 5 tests pass.

- [ ] **Step 5: Verify `pnpm check`**

```bash
pnpm check
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 6: Verify `pnpm build`**

```bash
pnpm build
```

Expected: succeeds; both guardrails clean.

- [ ] **Step 7: Commit**

```bash
git add src/data/companion-theatres.ts tests/unit/companion-theatres.test.ts
git commit -m "$(cat <<'EOF'
feat(community): add COMPANION_THEATRES structured data

Ships with <N> entries (3 placeholder if Drive import found nothing;
otherwise real theatres flagged sample: false). Inline Zod schema
validates on import; slug uniqueness enforced. Every founder-schema
lesson from Cycle 5 T7 applied: explicit sample/unconfirmed fields
on every entry so z.infer literal-check passes under strict mode.

Vitest asserts: ≥3 entries, unique slugs, required fields, blurb
≤300 chars, kebab-case slugs.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: `TESTIMONIALS` data file + tests

**Files:**
- Create: `src/data/testimonials.ts`
- Create: `tests/unit/testimonials.test.ts`

**Interfaces produced:**
- `TESTIMONIALS: Testimonial[]` — starts at 0 entries. Validated by inline Zod at import.
- `Testimonial` type export.

- [ ] **Step 1: Write failing test `tests/unit/testimonials.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { TESTIMONIALS } from '@/data/testimonials';

describe('TESTIMONIALS data', () => {
  it('is an array (may be empty)', () => {
    expect(Array.isArray(TESTIMONIALS)).toBe(true);
  });

  it('every testimonial slug is unique (or array is empty)', () => {
    const slugs = TESTIMONIALS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every testimonial body is at most 600 chars', () => {
    for (const t of TESTIMONIALS) {
      expect(t.body.length, `${t.slug} body too long`).toBeLessThanOrEqual(600);
    }
  });

  it('every testimonial has slug, attribution, and body', () => {
    for (const t of TESTIMONIALS) {
      expect(t.slug, `entry missing slug`).toBeTruthy();
      expect(t.attribution, `${t.slug} missing attribution`).toBeTruthy();
      expect(t.body, `${t.slug} missing body`).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run test — FAIL (module not found)**

```bash
pnpm test tests/unit/testimonials.test.ts
```

- [ ] **Step 3: Create `src/data/testimonials.ts`**

```typescript
import { z } from 'astro/zod';

const TestimonialSchema = z.object({
  slug: z.string(),
  attribution: z.string(),
  role: z.string().optional(),
  location: z.string().optional(),
  body: z.string().max(600),
  sample: z.boolean().default(false),
});
export type Testimonial = z.infer<typeof TestimonialSchema>;

/**
 * Testimonials collection ships EMPTY at Cycle 6 launch. New testimonials
 * arrive via dev commits (approve → append here) until a CMS-style
 * backend is decided in a future cycle. Client-provided testimonials
 * from Drive would be inserted here as a manual seed.
 *
 * When TESTIMONIALS.length === 0, /community/testimonials/ renders an
 * empty-state message above the share-your-story form.
 */
export const TESTIMONIALS: Testimonial[] = [];

// Build-time verification: schema + slug uniqueness (both are no-ops on
// an empty array but activate the moment entries are added).
(function verifyAtImport() {
  for (const t of TESTIMONIALS) TestimonialSchema.parse(t);
  const slugs = TESTIMONIALS.map((t) => t.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error('TESTIMONIALS slugs must be unique');
  }
})();
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test tests/unit/testimonials.test.ts
```

Expected: all 4 tests pass (trivially on empty array).

- [ ] **Step 5: Verify `pnpm check` + `pnpm build`**

```bash
pnpm check
pnpm build
```

Expected: 0 errors; build clean.

- [ ] **Step 6: Commit**

```bash
git add src/data/testimonials.ts tests/unit/testimonials.test.ts
git commit -m "$(cat <<'EOF'
feat(community): add TESTIMONIALS structured data (empty at launch)

TESTIMONIALS ships as an empty array. Inline Zod schema validates on
import; slug uniqueness enforced (both trivially pass on []). New
testimonials arrive via dev commits until a CMS-style backend is
decided. /community/testimonials/ (Task 19) renders an empty-state
message above the share-your-story form when TESTIMONIALS.length === 0.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Rewrite the three TODO(esp) form components to use `formActionFor`

**Files:**
- Modify: `src/components/ui/NewsletterSignup.astro`
- Modify: `src/components/landing/NewsletterTile.astro`
- Modify: `src/components/shakespeare/AskShakespeareForm.astro`

**Interfaces produced:**
- Each form now reads `formActionFor(<key>)` at render time. When `fallbackMode: false`, form posts to Formspree via fetch. When `fallbackMode: true`, form renders a "Form not yet configured" note and does not submit.

- [ ] **Step 1: Rewrite `src/components/ui/NewsletterSignup.astro`**

```astro
---
import { formActionFor } from '@/lib/form-action';

interface Props {
  source?: string;
  heading?: string;
}
const { source = 'footer', heading = 'Get monthly DT:FC news, new games, and new plays.' } =
  Astro.props;

const { action, fallbackMode } = formActionFor('newsletter');
const formId = `newsletter-${source}`;
---

{
  fallbackMode ? (
    <div class="border-mustard-400/40 bg-mustard-200/20 rounded-[var(--radius-card)] border p-4">
      <p class="text-ink-700 text-sm">
        <strong>{heading}</strong>
      </p>
      <p class="text-ink-500 mt-2 text-xs">
        Newsletter signup is not yet configured. Please email us at{' '}
        <a href="mailto:hello@dtfc.example" class="hover:text-clay-500 underline">
          hello@dtfc.example
        </a>{' '}
        to be added to the list.
      </p>
    </div>
  ) : (
    <>
      <form
        id={formId}
        class="flex flex-col gap-2 sm:flex-row sm:items-end"
        action={action}
        method="POST"
        data-newsletter-form
        data-source={source}
      >
        <label class="flex-1">
          <span class="text-ink-700 block text-sm font-medium">{heading}</span>
          <input
            type="email"
            required
            name="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="border-ivory-200 mt-1 w-full rounded border bg-white px-3 py-2 text-base"
          />
        </label>
        <input type="hidden" name="_subject" value={`Newsletter signup (${source})`} />
        <button
          type="submit"
          class="bg-clay-500 text-ivory-50 hover:bg-clay-700 rounded px-4 py-2 font-medium"
        >
          Notify me
        </button>
      </form>
      <p class="text-ink-500 mt-2 text-xs">We won&rsquo;t share your email.</p>
    </>
  )
}

<script is:inline>
  (function initNewsletterForms() {
    if (window.__dtfcNewsletterInit) return;
    window.__dtfcNewsletterInit = true;
    const attach = () => {
      const forms = document.querySelectorAll('form[data-newsletter-form]');
      forms.forEach((form) => {
        form.addEventListener('submit', async (ev) => {
          ev.preventDefault();
          try {
            const res = await fetch(form.action, {
              method: 'POST',
              body: new FormData(form),
              headers: { Accept: 'application/json' },
            });
            if (res.ok) {
              form.reset();
              form.insertAdjacentHTML(
                'afterend',
                '<p role="status" class="mt-2 text-sm text-teal-600">Thanks &mdash; we&rsquo;ll be in touch.</p>',
              );
            } else {
              form.insertAdjacentHTML(
                'afterend',
                '<p role="alert" class="mt-2 text-sm text-clay-700">Something went wrong. Please email us at <a href="mailto:hello@dtfc.example" class="underline">hello@dtfc.example</a>.</p>',
              );
            }
          } catch {
            form.insertAdjacentHTML(
              'afterend',
              '<p role="alert" class="mt-2 text-sm text-clay-700">Network error. Please email us at <a href="mailto:hello@dtfc.example" class="underline">hello@dtfc.example</a>.</p>',
            );
          }
        });
      });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attach);
    } else {
      attach();
    }
  })();
</script>
```

**Note on the `hello@dtfc.example` placeholder:** this is the mailto: fallback address for when Formspree is unconfigured. It's a real-looking but definitely-fake address (`.example` is an RFC-reserved TLD that never resolves). The client will provide a real address in a follow-up; the placeholder is a visible flag that this needs updating. Do NOT use a real personal email.

**Note on the DOMContentLoaded wrap:** applied from the Cycle 5 T18 lesson — the `is:inline` script runs as parsed, before form elements are guaranteed to exist in the DOM. Wait for DOMContentLoaded or immediate execution if the DOM is already ready.

- [ ] **Step 2: Rewrite `src/components/landing/NewsletterTile.astro`**

```astro
---
import { formActionFor } from '@/lib/form-action';

const { action, fallbackMode } = formActionFor('newsletter');
---

{
  fallbackMode ? (
    <div class="border-teal-600/30 bg-teal-600/5 flex h-full flex-col justify-between rounded-[var(--radius-card)] border p-6">
      <div>
        <h2 class="font-display text-ink-900 text-lg">Stay in touch</h2>
        <p class="text-ink-500 mt-1 text-xs">
          Signup is not yet configured. Please email us at{' '}
          <a href="mailto:hello@dtfc.example" class="hover:text-clay-500 underline">
            hello@dtfc.example
          </a>{' '}
          to be added to the list.
        </p>
      </div>
    </div>
  ) : (
    <form
      class="border-teal-600/30 bg-teal-600/5 focus-within:border-teal-600 flex h-full flex-col justify-between rounded-[var(--radius-card)] border p-6"
      action={action}
      method="POST"
      data-newsletter-form
      data-source="landing-tile"
    >
      <div>
        <h2 class="font-display text-ink-900 text-lg">Stay in touch</h2>
        <p class="text-ink-500 mt-1 text-xs">
          Monthly DT:FC news, new games, new plays. We won&rsquo;t share your email.
        </p>
      </div>
      <label class="mt-3 flex flex-col gap-2">
        <span class="sr-only">Email address</span>
        <input
          type="email"
          name="email"
          required
          autocomplete="email"
          placeholder="you@example.com"
          class="border-ink-500/30 focus:border-teal-600 focus:ring-teal-600 rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
        <input type="hidden" name="_subject" value="Newsletter signup (landing-tile)" />
        <button
          type="submit"
          class="bg-teal-600 hover:bg-teal-800 text-ivory-50 focus-visible:ring-teal-600 rounded px-3 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Notify me
        </button>
      </label>
    </form>
  )
}
```

**Note on the missing script:** NewsletterTile relies on the shared `data-newsletter-form` selector and the shared init script defined in `NewsletterSignup.astro`. Because both components render in the same page tree and the init uses `window.__dtfcNewsletterInit`, one script attaches to all forms. Do NOT duplicate the script in this component.

- [ ] **Step 3: Rewrite `src/components/shakespeare/AskShakespeareForm.astro`**

```astro
---
import { formActionFor } from '@/lib/form-action';

const { action, fallbackMode } = formActionFor('askShakespeare');
---

{/* CLIENT REVIEW: responses currently route to the Formspree dashboard; email destination pending client decision. */}

{
  fallbackMode ? (
    <div class="border-mustard-400/40 bg-mustard-200/20 rounded-[var(--radius-card)] border p-6">
      <h2 class="font-display text-ink-900 text-xl">Submit a question</h2>
      <p class="text-ink-700 mt-2 text-sm">
        This form is not yet configured. In the meantime, please email your question to{' '}
        <a href="mailto:hello@dtfc.example" class="hover:text-clay-500 underline">
          hello@dtfc.example
        </a>{' '}
        and we&rsquo;ll get back to you.
      </p>
    </div>
  ) : (
    <form
      class="border-teal-600/25 bg-teal-600/5 rounded-[var(--radius-card)] border p-6"
      action={action}
      method="POST"
      data-ask-shakespeare-form
    >
      <h2 class="font-display text-ink-900 text-xl">Submit a question</h2>
      <p class="text-ink-500 mt-1 text-sm">
        Ask &ldquo;Shakespeare&rdquo; a question about a line, a character, a choice, or your own
        moment of stage fright.
      </p>

      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <label class="flex flex-col gap-1">
          <span class="text-ink-700 text-sm font-medium">Your name (optional)</span>
          <input
            type="text"
            name="name"
            autocomplete="name"
            class="border-ink-500/30 focus:border-teal-600 focus:ring-teal-600 rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-ink-700 text-sm font-medium">Email (optional)</span>
          <input
            type="email"
            name="email"
            autocomplete="email"
            class="border-ink-500/30 focus:border-teal-600 focus:ring-teal-600 rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </label>
      </div>

      <label class="mt-4 flex flex-col gap-1">
        <span class="text-ink-700 text-sm font-medium">Your question</span>
        <textarea
          name="question"
          required
          rows="4"
          class="border-ink-500/30 focus:border-teal-600 focus:ring-teal-600 rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
      </label>

      <input type="hidden" name="_subject" value="Ask Shakespeare submission" />

      <button
        type="submit"
        class="bg-clay-500 hover:bg-clay-700 text-ivory-50 focus-visible:ring-clay-500 mt-4 rounded px-4 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        Send to Shakespeare
      </button>
    </form>
  )
}

<script is:inline>
  (function initAskShakespeare() {
    if (window.__dtfcAskShakespeareInit) return;
    window.__dtfcAskShakespeareInit = true;
    const attach = () => {
      const forms = document.querySelectorAll('form[data-ask-shakespeare-form]');
      forms.forEach((form) => {
        form.addEventListener('submit', async (ev) => {
          ev.preventDefault();
          try {
            const res = await fetch(form.action, {
              method: 'POST',
              body: new FormData(form),
              headers: { Accept: 'application/json' },
            });
            if (res.ok) {
              form.reset();
              form.insertAdjacentHTML(
                'afterend',
                '<p role="status" class="mt-2 text-sm text-teal-600">Thanks &mdash; Shakespeare will consider your question.</p>',
              );
            } else {
              form.insertAdjacentHTML(
                'afterend',
                '<p role="alert" class="mt-2 text-sm text-clay-700">Something went wrong. Please email us at <a href="mailto:hello@dtfc.example" class="underline">hello@dtfc.example</a>.</p>',
              );
            }
          } catch {
            form.insertAdjacentHTML(
              'afterend',
              '<p role="alert" class="mt-2 text-sm text-clay-700">Network error. Please email us at <a href="mailto:hello@dtfc.example" class="underline">hello@dtfc.example</a>.</p>',
            );
          }
        });
      });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attach);
    } else {
      attach();
    }
  })();
</script>
```

- [ ] **Step 4: Run `pnpm check` + `pnpm build` + `pnpm test`**

```bash
pnpm check
pnpm build
pnpm test
```

Expected: `pnpm check` 0 errors; `pnpm build` clean; Vitest suites still pass (form-action.test.ts + all other suites unchanged).

Since `.env` is not populated in the test environment, the built pages should show the fallback UI. Manually verify with `pnpm dev` before commit: visit `/` (footer + landing tile fallback) and `/shakespeare/ask-shakespeare/` (form fallback). Optional but recommended pre-commit sanity check.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/NewsletterSignup.astro src/components/landing/NewsletterTile.astro src/components/shakespeare/AskShakespeareForm.astro
git commit -m "$(cat <<'EOF'
feat(forms): wire NewsletterSignup, NewsletterTile, AskShakespeareForm to Formspree

All three previously-stubbed TODO(esp) forms now read formActionFor()
at render time. When PUBLIC_FORMSPREE_<KEY>_ID is set, they render a
real <form action> that POSTs to Formspree via fetch and shows the
success message inline. When unset, they render a "Form not yet
configured" note + mailto: fallback link.

Shared window init guard pattern (Cycle 3/4/5 chip filter pattern)
prevents double-listener attachment. DOMContentLoaded wrap prevents
the T18-race-condition class of bug.

Ask Shakespeare component carries a CLIENT REVIEW comment noting
responses route to the Formspree dashboard until the client provides
a destination email.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: New `TestimonialForm` component

**Files:**
- Create: `src/components/community/TestimonialForm.astro`

**Interfaces produced:**
- `<TestimonialForm />` — Formspree-wired share-your-story form. Fields: attribution (required), role, location, body (required, min 40 chars), optional email. Fallback UI when env unset.

- [ ] **Step 1: Create `src/components/community/TestimonialForm.astro`**

```astro
---
import { formActionFor } from '@/lib/form-action';

const { action, fallbackMode } = formActionFor('testimonial');
---

{
  fallbackMode ? (
    <div class="border-mustard-400/40 bg-mustard-200/20 rounded-[var(--radius-card)] border p-6">
      <h2 class="font-display text-ink-900 text-xl">Share your story</h2>
      <p class="text-ink-700 mt-2 text-sm">
        This form is not yet configured. In the meantime, please email your testimonial to{' '}
        <a href="mailto:hello@dtfc.example" class="hover:text-clay-500 underline">
          hello@dtfc.example
        </a>{' '}
        and we&rsquo;ll add it to the site.
      </p>
    </div>
  ) : (
    <form
      class="border-teal-600/25 bg-teal-600/5 rounded-[var(--radius-card)] border p-6"
      action={action}
      method="POST"
      data-testimonial-form
    >
      <h2 class="font-display text-ink-900 text-xl">Share your story</h2>
      <p class="text-ink-500 mt-1 text-sm">
        Tell us how DT:FC has shaped your work, your Players, or your creative life. With your
        permission we may share it here.
      </p>

      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <label class="flex flex-col gap-1">
          <span class="text-ink-700 text-sm font-medium">Your name</span>
          <input
            type="text"
            name="attribution"
            required
            autocomplete="name"
            class="border-ink-500/30 focus:border-teal-600 focus:ring-teal-600 rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-ink-700 text-sm font-medium">Your role (optional)</span>
          <input
            type="text"
            name="role"
            placeholder="Facilitator, Player, parent, &hellip;"
            class="border-ink-500/30 focus:border-teal-600 focus:ring-teal-600 rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </label>
      </div>

      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <label class="flex flex-col gap-1">
          <span class="text-ink-700 text-sm font-medium">Your location (optional)</span>
          <input
            type="text"
            name="location"
            placeholder="City, State"
            class="border-ink-500/30 focus:border-teal-600 focus:ring-teal-600 rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-ink-700 text-sm font-medium">Your email (optional)</span>
          <input
            type="email"
            name="email"
            autocomplete="email"
            class="border-ink-500/30 focus:border-teal-600 focus:ring-teal-600 rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </label>
      </div>

      <label class="mt-4 flex flex-col gap-1">
        <span class="text-ink-700 text-sm font-medium">Your story</span>
        <textarea
          name="body"
          required
          minlength="40"
          rows="5"
          class="border-ink-500/30 focus:border-teal-600 focus:ring-teal-600 rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
      </label>

      <input type="hidden" name="_subject" value="DT:FC testimonial submission" />

      <button
        type="submit"
        class="bg-clay-500 hover:bg-clay-700 text-ivory-50 focus-visible:ring-clay-500 mt-4 rounded px-4 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        Share your story
      </button>
    </form>
  )
}

<script is:inline>
  (function initTestimonialForm() {
    if (window.__dtfcTestimonialInit) return;
    window.__dtfcTestimonialInit = true;
    const attach = () => {
      const forms = document.querySelectorAll('form[data-testimonial-form]');
      forms.forEach((form) => {
        form.addEventListener('submit', async (ev) => {
          ev.preventDefault();
          try {
            const res = await fetch(form.action, {
              method: 'POST',
              body: new FormData(form),
              headers: { Accept: 'application/json' },
            });
            if (res.ok) {
              form.reset();
              form.insertAdjacentHTML(
                'afterend',
                '<p role="status" class="mt-2 text-sm text-teal-600">Thanks &mdash; we&rsquo;ll be in touch before publishing.</p>',
              );
            } else {
              form.insertAdjacentHTML(
                'afterend',
                '<p role="alert" class="mt-2 text-sm text-clay-700">Something went wrong. Please email us at <a href="mailto:hello@dtfc.example" class="underline">hello@dtfc.example</a>.</p>',
              );
            }
          } catch {
            form.insertAdjacentHTML(
              'afterend',
              '<p role="alert" class="mt-2 text-sm text-clay-700">Network error. Please email us at <a href="mailto:hello@dtfc.example" class="underline">hello@dtfc.example</a>.</p>',
            );
          }
        });
      });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attach);
    } else {
      attach();
    }
  })();
</script>
```

- [ ] **Step 2: `pnpm check`**

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/community/TestimonialForm.astro
git commit -m "$(cat <<'EOF'
feat(community): add TestimonialForm component

Fourth site form. Fields: attribution (required), role, location,
email (all optional except attribution), body (required, min 40 chars).
Same Formspree-wired pattern with mailto: fallback + is:inline script
+ window init guard as the T7 rewrites.

Renders inside /community/testimonials/ (Task 19) above the display grid.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: `CompanionTheatreCard` component

**Files:**
- Create: `src/components/community/CompanionTheatreCard.astro`

**Interfaces produced:**
- `<CompanionTheatreCard theatre={t} />` — grid tile with name, city+state, optional website link, blurb, conditional sample/unconfirmed chips.

- [ ] **Step 1: Create `src/components/community/CompanionTheatreCard.astro`**

```astro
---
import type { CompanionTheatre } from '@/data/companion-theatres';

interface Props {
  theatre: CompanionTheatre;
}
const { theatre } = Astro.props;
---

<article class="border-ivory-200 bg-ivory-50 rounded-[var(--radius-card)] border p-5">
  <h3 class="font-display text-ink-900 text-xl">
    {
      theatre.website ? (
        <a href={theatre.website} class="hover:text-clay-500 no-underline" rel="noopener">
          {theatre.name}
        </a>
      ) : (
        theatre.name
      )
    }
  </h3>
  <p class="text-ink-500 mt-1 text-sm">
    {theatre.city}, {theatre.state}
  </p>

  <p class="text-ink-700 mt-3 text-sm" set:html={theatre.blurb} />

  <div class="mt-3 flex flex-wrap gap-2">
    {
      theatre.unconfirmed && (
        <span class="bg-mustard-200 text-ink-700 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium">
          Unconfirmed
        </span>
      )
    }
    {
      theatre.sample && (
        <span class="bg-ivory-200 text-ink-500 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium">
          Sample &mdash; pending full import
        </span>
      )
    }
  </div>
</article>
```

- [ ] **Step 2: `pnpm check`**

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/community/CompanionTheatreCard.astro
git commit -m "$(cat <<'EOF'
feat(community): add CompanionTheatreCard grid tile

Renders theatre name (as link when website is set), city+state,
blurb via set:html, and conditional unconfirmed + sample chips.
Design tokens only. Mirrors Cycle 5 FounderCard chip pattern.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: `TestimonialCard` component

**Files:**
- Create: `src/components/community/TestimonialCard.astro`

**Interfaces produced:**
- `<TestimonialCard testimonial={t} />` — quote card with body, attribution, optional role + location.

- [ ] **Step 1: Create `src/components/community/TestimonialCard.astro`**

```astro
---
import type { Testimonial } from '@/data/testimonials';

interface Props {
  testimonial: Testimonial;
}
const { testimonial } = Astro.props;

const attributionLine = [testimonial.attribution, testimonial.role, testimonial.location]
  .filter(Boolean)
  .join(' &middot; ');
---

<article class="border-ivory-200 bg-ivory-50 rounded-[var(--radius-card)] border p-5">
  <blockquote class="text-ink-700 text-base leading-relaxed">
    <span aria-hidden="true" class="font-display text-clay-500 text-2xl leading-none">&ldquo;</span>
    <span set:html={testimonial.body} />
    <span aria-hidden="true" class="font-display text-clay-500 text-2xl leading-none">&rdquo;</span>
  </blockquote>
  <p class="text-ink-500 mt-3 text-sm" set:html={`&mdash; ${attributionLine}`} />
  {
    testimonial.sample && (
      <div class="mt-3">
        <span class="bg-ivory-200 text-ink-500 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium">
          Sample
        </span>
      </div>
    )
  }
</article>
```

- [ ] **Step 2: `pnpm check`**

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/community/TestimonialCard.astro
git commit -m "$(cat <<'EOF'
feat(community): add TestimonialCard quote tile

Blockquote with decorative curly quotes, body via set:html,
attribution line joining name+role+location with middots. Sample
chip when testimonial.sample is true. Design tokens only.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: `NewsletterCard` + `NewsletterDetail` components

**Files:**
- Create: `src/components/community/NewsletterCard.astro`
- Create: `src/components/community/NewsletterDetail.astro`

**Interfaces produced:**
- `<NewsletterCard entry={entry} />` — index tile with issue number, publish date, title link, excerpt.
- `<NewsletterDetail entry={entry}><Content /></NewsletterDetail>` — detail template with breadcrumb, header, print button, MDX slot.

- [ ] **Step 1: Create `src/components/community/NewsletterCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'newsletters'>;
}
const { entry } = Astro.props;
const slug = entry.id.replace(/\.mdx?$/, '');
const href = `/community/newsletters/${slug}/`;
---

<article class="border-ivory-200 bg-ivory-50 hover:border-clay-500/60 rounded-[var(--radius-card)] border p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
  <p class="text-ink-500 text-xs uppercase tracking-widest">
    Issue #{entry.data.issueNumber} &middot; {entry.data.publishDate}
  </p>
  <h3 class="font-display text-ink-900 mt-2 text-xl">
    <a href={href} class="hover:text-clay-500 no-underline" set:html={entry.data.title} />
  </h3>
  <p class="text-ink-700 mt-3 text-sm" set:html={entry.data.excerpt} />
  {
    entry.data.sample && (
      <div class="mt-3">
        <span class="bg-ivory-200 text-ink-500 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium">
          Sample &mdash; pending final import
        </span>
      </div>
    )
  }
</article>
```

- [ ] **Step 2: Create `src/components/community/NewsletterDetail.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'newsletters'>;
}
const { entry } = Astro.props;
const g = entry.data;
---

<article class="mx-auto max-w-3xl">
  <p class="text-ink-500 text-sm">
    <a href="/community/">Community</a> &middot; <a href="/community/newsletters/">Newsletters</a>
  </p>

  <p class="text-ink-500 mt-3 text-xs uppercase tracking-widest">
    Issue #{g.issueNumber} &middot; {g.publishDate}
  </p>
  <h1 class="mt-2" set:html={g.title} />

  {
    g.sample && (
      <p class="border-mustard-400 bg-mustard-200/40 text-ink-700 mt-4 rounded-[var(--radius-card)] border-l-4 p-3 text-sm">
        <strong>Sample content.</strong> The final text of this newsletter issue is pending.
      </p>
    )
  }

  <div class="mt-4" data-print-hide>
    <button
      type="button"
      onclick="window.print()"
      class="border-ink-900 rounded border px-3 py-1.5 text-sm"
    >
      Print this issue
    </button>
  </div>

  <div class="prose prose-neutral mt-8 max-w-none">
    <slot />
  </div>
</article>
```

- [ ] **Step 3: `pnpm check`**

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/community/NewsletterCard.astro src/components/community/NewsletterDetail.astro
git commit -m "$(cat <<'EOF'
feat(community): add NewsletterCard + NewsletterDetail templates

NewsletterCard is an index tile with issue number + publish date,
title link, excerpt, and sample chip. NewsletterDetail is the
per-issue template with breadcrumb, h1, sample-content banner
(when sample: true), print button (respects data-print-hide),
and MDX Content slot. Mirror of Cycle 5 EssayCard/EssayDetail.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: `/community/` landing rewrite

**Files:**
- Modify: `src/pages/community/index.astro` (full rewrite)

**Interfaces consumed:**
- `CommunityLayout` (Task 3)

**Constraints:**
- Preserve `<section id="membership">` anchor.
- Keep `<ReflectivePrompt sectionKey="community" />`.
- Add directory grid of 7 sub-section cards.

- [ ] **Step 1: Rewrite `src/pages/community/index.astro`**

```astro
---
import CommunityLayout from '@/layouts/CommunityLayout.astro';
import ReflectivePrompt from '@/components/section/ReflectivePrompt.astro';

const directoryCards = [
  {
    label: 'About',
    href: '/community/about/',
    description: 'Purpose, value proposition, and the five competencies that make DT:FC what it is.',
  },
  {
    label: 'How We&rsquo;re Organized',
    href: '/community/how-were-organized/',
    description: 'Distributed leadership, Coordinating Council, and our fiscal sponsor.',
  },
  {
    label: 'Membership',
    href: '/community/membership/',
    description: 'Join the DT:FC community. Tiers and details arriving in our next content release.',
  },
  {
    label: 'Donate',
    href: '/community/donate/',
    description: 'Support DT:FC through our fiscal sponsor, We Tell Stories.',
  },
  {
    label: 'Newsletters',
    href: '/community/newsletters/',
    description: 'Monthly DT:FC news, new games, and new plays. Sign up + read past issues.',
  },
  {
    label: 'Companion Theatres',
    href: '/community/companion-theatres/',
    description: 'The theatres and educators in the DT:FC network.',
  },
  {
    label: 'Testimonials',
    href: '/community/testimonials/',
    description: 'How DT:FC has shaped work, Players, and creative lives. Share your own.',
  },
];
---

<CommunityLayout
  title="Community"
  eyebrow="Be Fearlessly Creative!"
  description="The people, principles, and practices behind DT:FC &mdash; and the ways to join in."
>
  <ReflectivePrompt sectionKey="community" />

  <div class="mt-8 max-w-2xl space-y-6">
    {/* CLIENT REVIEW: Membership anchor preserved from Cycles 2/5 IDEA_TWO cross-links; deep detail lives at /community/membership/. */}
    <section id="membership">
      <h2>Become a member</h2>
      <p>
        DT:FC membership is opening in our next content release. In the meantime, sign up for the
        newsletter (footer) to get an update the moment tiers are live.
        <a href="/community/membership/" class="hover:text-clay-500">Read the interim details &rarr;</a>
      </p>
    </section>

    <section>
      <h2>What is DT:FC?</h2>
      <p>
        DT:FC (Developmental Theatre: Fearless Creativity) is a fifty-year lineage of practices
        that use theatre to build the five competencies underneath every creative act: attention,
        composition, oral expression, physical expression, and context awareness.
        <a href="/community/about/" class="hover:text-clay-500">Read the full About &rarr;</a>
      </p>
    </section>
  </div>

  <section class="mt-14">
    <h2 class="font-display text-2xl">Explore the section</h2>
    <ul class="mt-6 grid list-none gap-4 md:grid-cols-2 lg:grid-cols-3">
      {
        directoryCards.map((card) => (
          <li>
            <a
              href={card.href}
              class="border-ivory-200 bg-ivory-50 hover:border-clay-500/60 block h-full rounded-[var(--radius-card)] border p-5 no-underline transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <h3 class="font-display text-ink-900 text-xl" set:html={card.label} />
              <p class="text-ink-700 mt-1 text-sm" set:html={card.description} />
            </a>
          </li>
        ))
      }
    </ul>
  </section>
</CommunityLayout>
```

- [ ] **Step 2: `pnpm build`**

Expected: clean; guardrail passes.

- [ ] **Step 3: Verify anchor**

```bash
grep -n 'id="membership"' src/pages/community/index.astro
```

Expected: line ~34 shows the anchor. This is what Cycle 2's `IDEA_TWO_ANSWERS` and Cycle 5's Legacy landing cross-link both target.

- [ ] **Step 4: Commit**

```bash
git add src/pages/community/index.astro
git commit -m "$(cat <<'EOF'
feat(community): rewrite landing with CommunityLayout + directory grid

Wraps in CommunityLayout (sub-nav renders). Preserves the Cycle 2
#membership anchor so IDEA_TWO_ANSWERS in landing.ts and Cycle 5's
Legacy landing cross-link continue to resolve. Adds a 7-card
directory grid pointing at each sub-section. Removes the Cycle 2
"Become part of this Legacy" section (superseded by the About and
Membership deep pages).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: `/community/about/` page

**Files:**
- Create: `src/pages/community/about.astro`

**Content strategy:** if Task 4 staged `.superpowers/sdd/<workspace>/imports/about.txt`, adapt into the page body. Otherwise use the drafted content below (all flagged CLIENT REVIEW).

- [ ] **Step 1: Check for imported source text**

```bash
ls .superpowers/sdd/*/imports/about.txt 2>/dev/null || echo "NO IMPORT — use drafted"
```

- [ ] **Step 2: Create `src/pages/community/about.astro`**

If imported content exists, adapt it into H2 sections. If not, use verbatim:

```astro
---
import CommunityLayout from '@/layouts/CommunityLayout.astro';
---

<CommunityLayout
  title="About DT:FC"
  subPage="about"
  eyebrow="Purpose, promise, and the five competencies"
  description="What DT:FC is, what it&rsquo;s for, and the life skills it builds."
>
  <div class="max-w-2xl space-y-8">
    {/* CLIENT REVIEW: drafted from source spec §5 About subsection; adapt from imported "About DT:FC" doc when Task 4 stages it. */}

    <section>
      <h2>What DT:FC is</h2>
      <p>
        Developmental Theatre: Fearless Creativity (DT:FC) is a fifty-year lineage of practices
        that uses theatre as a vehicle for developing the underlying competencies of creative
        work. Descended from the Colorado Caravan and the Colorado Shakespeare Festival&rsquo;s
        NEA Title III residency (see the <a href="/legacy/history/" class="hover:text-clay-500">Legacy history &rarr;</a>),
        the practice today reaches Players, Facilitators, and audiences in classrooms, community
        theatres, universities, and therapeutic settings.
      </p>
    </section>

    <section>
      <h2>The five competencies</h2>
      <p>
        Every DT:FC play, game, and workshop targets the same five competencies:
      </p>
      <ul>
        <li><strong>Attention</strong> &mdash; the discipline of being fully here.</li>
        <li><strong>Composition</strong> &mdash; the ability to shape a whole from parts.</li>
        <li><strong>Oral expression</strong> &mdash; language that lands.</li>
        <li><strong>Physical expression</strong> &mdash; the body as an instrument.</li>
        <li><strong>Context awareness</strong> &mdash; reading the room and responding to it.</li>
      </ul>
      <p>
        These are life skills, not stage skills. The plays and games are the vehicle; the
        competencies are the point.
      </p>
    </section>

    <section>
      <h2>Who it&rsquo;s for</h2>
      <p>
        DT:FC serves anyone who wants to grow those five competencies in themselves or in others:
        classroom teachers, community theatre facilitators, university educators, therapists,
        parents, and Players of every age. The
        <a href="/theatre-games/" class="hover:text-clay-500">Theatre Games library</a>,
        <a href="/childrens-theatre/" class="hover:text-clay-500">Children&rsquo;s Theatre plays</a>, and
        <a href="/shakespeare/" class="hover:text-clay-500">Shakespeare adaptations</a>
        are the three primary entry points.
      </p>
    </section>
  </div>
</CommunityLayout>
```

- [ ] **Step 3: `pnpm build`**

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/pages/community/about.astro
git commit -m "$(cat <<'EOF'
feat(community): add /community/about/ purpose page

Three H2 sections: What DT:FC is, the five competencies, who it's for.
Cross-links to Legacy history + Theatre Games + Children's Theatre +
Shakespeare landing pages. Drafted content flagged CLIENT REVIEW;
adapts from imported about.txt when Task 4 stages it.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: `/community/how-were-organized/` page

**Files:**
- Create: `src/pages/community/how-were-organized.astro`

**Content strategy:** same as Task 13 — use imported text if available; otherwise drafted content flagged CLIENT REVIEW.

- [ ] **Step 1: Check for imported source text**

```bash
ls .superpowers/sdd/*/imports/how-were-organized.txt 2>/dev/null || echo "NO IMPORT — use drafted"
```

- [ ] **Step 2: Create `src/pages/community/how-were-organized.astro`**

If imported: adapt. If not, use verbatim:

```astro
---
import CommunityLayout from '@/layouts/CommunityLayout.astro';
---

<CommunityLayout
  title="How We&rsquo;re Organized"
  subPage="how-were-organized"
  eyebrow="Distributed leadership + fiscal sponsorship"
  description="The people and structures that keep DT:FC running."
>
  <div class="max-w-2xl space-y-8">
    {/* CLIENT REVIEW: drafted from source spec §5 How We're Organized; adapt from imported source when Task 4 stages it. */}

    <section>
      <h2>Distributed leadership</h2>
      <p>
        DT:FC operates as a distributed-leadership organization &mdash; no single artistic director
        or executive holds central authority. Decisions are made by the people doing the work,
        coordinated through a small standing council and cross-cutting standing committees.
      </p>
    </section>

    <section>
      <h2>The Coordinating Council</h2>
      <p>
        The Coordinating Council is the group that keeps DT:FC coherent across its three
        program areas (Theatre Games, Children&rsquo;s Theatre, Shakespeare). Members rotate on
        overlapping terms so leadership is always regenerating without discontinuity.
      </p>
    </section>

    <section>
      <h2>Standing committees</h2>
      <p>
        Standing committees own the ongoing work: content stewardship (keeping the library
        current), pedagogy (facilitator training), technology (this site), and partnerships
        (companion theatres and educational institutions). Committees are open to any member
        who wants to contribute.
      </p>
    </section>

    <section>
      <h2>Fiscal sponsorship</h2>
      <p>
        DT:FC is fiscally sponsored by <strong>We Tell Stories, Inc.</strong>, a California
        501(c)(3) nonprofit. Contributions made through
        <a href="/community/donate/" class="hover:text-clay-500">the Donate page</a>
        flow through We Tell Stories and are tax-deductible to the extent allowed by law.
      </p>
    </section>
  </div>
</CommunityLayout>
```

- [ ] **Step 3: `pnpm build`**

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/pages/community/how-were-organized.astro
git commit -m "$(cat <<'EOF'
feat(community): add /community/how-were-organized/ page

Four H2 sections: distributed leadership, Coordinating Council,
standing committees, fiscal sponsorship (We Tell Stories, Inc.,
CA 501(c)(3)). Drafted content flagged CLIENT REVIEW; adapts from
imported source when Task 4 stages it.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: `/community/membership/` page (soft-shipped)

**Files:**
- Create: `src/pages/community/membership.astro`

**Soft-ship:** pre-release chip beside h1 + dual-purpose interest form that captures email into the newsletter list (uses the same `newsletter` FormKey with a hidden `interest=membership` field so submissions can be filtered downstream when a real ESP arrives).

- [ ] **Step 1: Create `src/pages/community/membership.astro`**

```astro
---
import CommunityLayout from '@/layouts/CommunityLayout.astro';
import { formActionFor } from '@/lib/form-action';

const { action, fallbackMode } = formActionFor('newsletter');
---

<CommunityLayout
  title="Membership"
  subPage="membership"
  eyebrow="Join the DT:FC community"
  description="Membership tiers and pricing are landing with our next content release. Sign up below to be notified."
>
  {/* CLIENT REVIEW: membership tiers, pricing, and tax-deductibility model pending client decision per source spec §8. */}
  <p class="mb-6">
    <span class="text-mustard-600 bg-mustard-200/40 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium uppercase tracking-widest">
      Pre-release &mdash; membership details coming with our next content release
    </span>
  </p>

  <div class="max-w-2xl space-y-6">
    <p class="text-ink-700 text-base">
      DT:FC membership tiers, pricing, and benefits are being finalized. In the meantime, you can
      express interest below &mdash; we&rsquo;ll add you to the newsletter list and reach out the
      moment tiers go live.
    </p>

    <p class="text-ink-500 text-sm">
      Contributions today can flow through our fiscal sponsor, We Tell Stories, Inc. &mdash; see
      <a href="/community/donate/" class="hover:text-clay-500">the Donate page &rarr;</a>
    </p>
  </div>

  <section class="mt-10 max-w-2xl">
    <h2>Express interest in membership</h2>
    {
      fallbackMode ? (
        <div class="border-mustard-400/40 bg-mustard-200/20 mt-4 rounded-[var(--radius-card)] border p-4">
          <p class="text-ink-700 text-sm">
            Interest form is not yet configured. Please email us at{' '}
            <a href="mailto:hello@dtfc.example" class="hover:text-clay-500 underline">
              hello@dtfc.example
            </a>{' '}
            to be added to the list.
          </p>
        </div>
      ) : (
        <form
          class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end"
          action={action}
          method="POST"
          data-newsletter-form
          data-source="membership-interest"
        >
          <label class="flex-1">
            <span class="text-ink-700 block text-sm font-medium">Your email</span>
            <input
              type="email"
              required
              name="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="border-ivory-200 mt-1 w-full rounded border bg-white px-3 py-2 text-base"
            />
          </label>
          <input type="hidden" name="interest" value="membership" />
          <input type="hidden" name="_subject" value="Membership interest (interim form)" />
          <button
            type="submit"
            class="bg-clay-500 text-ivory-50 hover:bg-clay-700 rounded px-4 py-2 font-medium"
          >
            Notify me
          </button>
        </form>
      )
    }
    <p class="text-ink-500 mt-2 text-xs">
      We&rsquo;ll only use your email to send the membership announcement and monthly DT:FC news.
    </p>
  </section>
</CommunityLayout>
```

**Note on `data-source="membership-interest"`:** the shared newsletter init script (attached by NewsletterSignup) picks up all `data-newsletter-form` elements. The `data-source` attribute is passed through as form context; downstream ESPs can segment membership-interest signups from regular newsletter signups.

- [ ] **Step 2: `pnpm build`**

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/pages/community/membership.astro
git commit -m "$(cat <<'EOF'
feat(community): add /community/membership/ page with pre-release chip

Pre-release chip beside the eyebrow signals membership tiers are still
being finalized per source spec §8. Dual-purpose interest form uses
formActionFor('newsletter') with a hidden interest=membership field
so submissions can be segmented in the ESP later. Falls back to
mailto: when Formspree env is unset.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: `/community/donate/` page (soft-shipped)

**Files:**
- Create: `src/pages/community/donate.astro`

**Soft-ship:** "coming soon" chip + placeholder CTA button that opens a `mailto:` fallback until the Zeffy URL is provided.

- [ ] **Step 1: Check for imported source text**

```bash
ls .superpowers/sdd/*/imports/donate.txt 2>/dev/null || echo "NO IMPORT — use drafted"
```

- [ ] **Step 2: Create `src/pages/community/donate.astro`**

If imported: adapt. If not, use verbatim:

```astro
---
import CommunityLayout from '@/layouts/CommunityLayout.astro';
---

<CommunityLayout
  title="Donate"
  subPage="donate"
  eyebrow="Support DT:FC through We Tell Stories"
  description="Contributions flow through our fiscal sponsor and support the work described across this site."
>
  {/* CLIENT REVIEW: Zeffy donation URL pending from client per source spec §5. Replace the mailto: CTA below with the real Zeffy link when it arrives. */}
  <p class="mb-6">
    <span class="text-mustard-600 bg-mustard-200/40 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium uppercase tracking-widest">
      Coming soon &mdash; secure donation form arriving with our next content release
    </span>
  </p>

  <div class="max-w-2xl space-y-6">
    <p class="text-ink-700 text-base">
      DT:FC is fiscally sponsored by <strong>We Tell Stories, Inc.</strong>, a California
      501(c)(3) nonprofit. Contributions are tax-deductible to the extent allowed by law and
      support content stewardship, facilitator training, and the ongoing life of the DT:FC library.
    </p>

    <p class="text-ink-700 text-base">
      A secure Zeffy donation form is being set up. In the meantime, please reach out to arrange
      a contribution directly:
    </p>

    <p>
      <a
        href="mailto:hello@dtfc.example?subject=DT%3AFC%20donation%20inquiry"
        class="bg-clay-500 text-ivory-50 hover:bg-clay-700 focus-visible:ring-clay-500 inline-block rounded px-5 py-2 text-base font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2 no-underline"
      >
        Email us about donating &rarr;
      </a>
    </p>

    <p class="text-ink-500 text-sm">
      For information about the fiscal sponsor, see
      <a href="/community/how-were-organized/" class="hover:text-clay-500">How We&rsquo;re Organized</a>.
    </p>
  </div>
</CommunityLayout>
```

- [ ] **Step 3: `pnpm build`**

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/pages/community/donate.astro
git commit -m "$(cat <<'EOF'
feat(community): add /community/donate/ page with coming-soon chip

Coming-soon chip signals the Zeffy donation form isn't wired yet
(spec §5 blocker). Renders drafted "why donate" copy + a placeholder
CTA styled like a real button that opens a mailto: fallback. When
client provides the Zeffy URL, replace the mailto: href and remove
the chip.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: `/community/newsletters/` index + `[slug].astro` dynamic route

**Files:**
- Create: `src/pages/community/newsletters/index.astro`
- Create: `src/pages/community/newsletters/[slug].astro`

**Interfaces consumed:**
- `NewsletterCard` (Task 11), `NewsletterDetail` (Task 11)
- `NewsletterSignup` (Task 7) — reused on the index page so the newsletter signup is prominently visible above the archive
- `getCollection('newsletters')` + `render()` from `astro:content`

- [ ] **Step 1: Create `src/pages/community/newsletters/index.astro`**

```astro
---
import CommunityLayout from '@/layouts/CommunityLayout.astro';
import NewsletterCard from '@/components/community/NewsletterCard.astro';
import NewsletterSignup from '@/components/ui/NewsletterSignup.astro';
import { getCollection } from 'astro:content';

const entries = (await getCollection('newsletters')).sort((a, b) => {
  return b.data.publishDate.localeCompare(a.data.publishDate); // most recent first
});
---

<CommunityLayout
  title="Newsletters"
  subPage="newsletters"
  eyebrow="Monthly DT:FC news, new games, new plays"
  description="Sign up below and browse past issues."
>
  <section class="max-w-2xl">
    <NewsletterSignup source="newsletters-page" heading="Get monthly DT:FC news in your inbox." />
  </section>

  <section class="mt-14">
    <h2 class="font-display text-2xl">Past issues</h2>
    {
      entries.length === 0 ? (
        <p class="text-ink-500 mt-4 italic">
          Signup form only &mdash; our archive begins with the next issue.
        </p>
      ) : (
        <ul class="mt-6 grid list-none gap-6 md:grid-cols-2">
          {entries.map((entry) => (
            <li>
              <NewsletterCard entry={entry} />
            </li>
          ))}
        </ul>
      )
    }
  </section>
</CommunityLayout>
```

- [ ] **Step 2: Create `src/pages/community/newsletters/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import CommunityLayout from '@/layouts/CommunityLayout.astro';
import NewsletterDetail from '@/components/community/NewsletterDetail.astro';

export async function getStaticPaths() {
  const entries = await getCollection('newsletters');
  return entries.map((entry) => ({
    params: { slug: entry.id.replace(/\.mdx?$/, '') },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<CommunityLayout
  title={entry.data.title}
  subPage="newsletters"
  eyebrow={`Issue #${entry.data.issueNumber} · ${entry.data.publishDate}`}
  description={entry.data.excerpt}
>
  <NewsletterDetail entry={entry}>
    <Content />
  </NewsletterDetail>
</CommunityLayout>
```

- [ ] **Step 3: `pnpm build`**

Expected: clean. If `src/content/newsletters/` is empty, only the index page generates (0 detail pages). If populated by Task 4, one detail page per entry.

- [ ] **Step 4: Commit**

```bash
git add src/pages/community/newsletters/
git commit -m "$(cat <<'EOF'
feat(community): add /community/newsletters/ index + dynamic detail route

Index renders NewsletterSignup at the top (prominent per source spec
§5 list-building priority) then a grid of NewsletterCards sorted by
publishDate descending (most recent first). Empty-state italic
message when 0 entries. Dynamic [slug].astro route generates one
detail page per collection entry via getStaticPaths.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 18: `/community/companion-theatres/` page

**Files:**
- Create: `src/pages/community/companion-theatres.astro`

- [ ] **Step 1: Create `src/pages/community/companion-theatres.astro`**

```astro
---
import CommunityLayout from '@/layouts/CommunityLayout.astro';
import CompanionTheatreCard from '@/components/community/CompanionTheatreCard.astro';
import { COMPANION_THEATRES } from '@/data/companion-theatres';
---

<CommunityLayout
  title="Companion Theatres"
  subPage="companion-theatres"
  eyebrow="The DT:FC network"
  description="Theatres and educators who share the DT:FC practice."
>
  <div class="max-w-2xl">
    <p class="text-ink-700 text-base">
      DT:FC is a network. These are the theatres and educators actively working with our plays,
      games, and pedagogy &mdash; every one of them a way to see the practice in action or find
      a workshop near you.
    </p>
  </div>

  <ul class="mt-10 grid list-none gap-6 md:grid-cols-2 lg:grid-cols-3">
    {COMPANION_THEATRES.map((t) => (
      <li>
        <CompanionTheatreCard theatre={t} />
      </li>
    ))}
  </ul>
</CommunityLayout>
```

- [ ] **Step 2: `pnpm build`**

Expected: clean; page renders with ≥3 companion theatre cards (from Task 5).

- [ ] **Step 3: Commit**

```bash
git add src/pages/community/companion-theatres.astro
git commit -m "$(cat <<'EOF'
feat(community): add /community/companion-theatres/ directory page

Renders COMPANION_THEATRES as a responsive grid of CompanionTheatreCards
(mobile 1-col, sm 2-col, lg 3-col). Sample-shipped placeholders carry
the "Sample — pending full import" chip until the real Drive directory
lands.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 19: `/community/testimonials/` page with form + display + empty-state

**Files:**
- Create: `src/pages/community/testimonials.astro`

- [ ] **Step 1: Check for imported source text**

```bash
ls .superpowers/sdd/*/imports/testimonials.txt 2>/dev/null || echo "NO IMPORT — use drafted"
```

If a source file exists, it may contain sample testimonials from the client. The implementer may optionally seed `TESTIMONIALS` in `src/data/testimonials.ts` with those entries as a **separate T6-follow-up mini-commit** (only if the source text is unambiguously ready to publish, not editorial drafts). Default: leave `TESTIMONIALS` empty and let the empty-state render.

- [ ] **Step 2: Create `src/pages/community/testimonials.astro`**

```astro
---
import CommunityLayout from '@/layouts/CommunityLayout.astro';
import TestimonialCard from '@/components/community/TestimonialCard.astro';
import TestimonialForm from '@/components/community/TestimonialForm.astro';
import { TESTIMONIALS } from '@/data/testimonials';
---

<CommunityLayout
  title="Testimonials"
  subPage="testimonials"
  eyebrow="How DT:FC has shaped work, Players, and creative lives"
  description="Read what others have shared &mdash; and share your own story."
>
  <section class="max-w-2xl">
    <TestimonialForm />
  </section>

  <section class="mt-14">
    <h2 class="font-display text-2xl">Stories from the DT:FC community</h2>
    {
      TESTIMONIALS.length === 0 ? (
        <p class="text-ink-500 mt-4 italic">
          Testimonials arriving soon &mdash; share your story above to be one of the first.
        </p>
      ) : (
        <ul class="mt-6 grid list-none gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li>
              <TestimonialCard testimonial={t} />
            </li>
          ))}
        </ul>
      )
    }
  </section>
</CommunityLayout>
```

- [ ] **Step 3: `pnpm build`**

Expected: clean; page renders with the form at the top + empty-state message below (since `TESTIMONIALS.length === 0` at ship time).

- [ ] **Step 4: Commit**

```bash
git add src/pages/community/testimonials.astro
git commit -m "$(cat <<'EOF'
feat(community): add /community/testimonials/ share + display page

Renders TestimonialForm at the top (share-your-story) and either a
grid of TestimonialCards or an empty-state italic message when
TESTIMONIALS is empty. Ships with empty-state today; new testimonials
arrive via dev commits until a CMS-style backend is decided.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 20: `Footer.astro` Donate link swap + `tests/unit/community.test.ts`

**Files:**
- Modify: `src/components/layout/Footer.astro` line ~35 — swap Donate link from `/community/` to `/community/donate/`.
- Create: `tests/unit/community.test.ts`

**Interfaces produced:** none (footer link change is a cross-cycle plumbing update; test file adds coverage that all 7 Community routes are registered).

- [ ] **Step 1: Modify `src/components/layout/Footer.astro`**

Locate the line ~35 that renders `<a href="/community/">Donate</a>` and change to:

```astro
<a href="/community/">About</a> · <a href="/community/donate/">Donate</a>
```

Verify only the `Donate` link's href changes; the `About` link stays pointing at `/community/` (which is the landing page's "What is DT:FC?" section).

- [ ] **Step 2: Create `tests/unit/community.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { COMMUNITY_NAV } from '@/lib/community-nav';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pagesDir = fileURLToPath(new URL('../../src/pages/', import.meta.url));
const footerPath = fileURLToPath(new URL('../../src/components/layout/Footer.astro', import.meta.url));

describe('Community section', () => {
  it('COMMUNITY_NAV has 7 items in expected order', () => {
    expect(COMMUNITY_NAV.map((n) => n.key)).toEqual([
      'about',
      'how-were-organized',
      'membership',
      'donate',
      'newsletters',
      'companion-theatres',
      'testimonials',
    ]);
  });

  it('every COMMUNITY_NAV href starts with /community/ and ends with /', () => {
    for (const item of COMMUNITY_NAV) {
      expect(item.href, `${item.key} href malformed`).toMatch(/^\/community\/[a-z-]+\/$/);
    }
  });

  it('every COMMUNITY_NAV item has a page file that exists', () => {
    for (const item of COMMUNITY_NAV) {
      // /community/newsletters/ → src/pages/community/newsletters/index.astro
      // /community/about/ → src/pages/community/about.astro
      const slug = item.href.slice('/community/'.length, -1);
      const flatPath = pagesDir + `community/${slug}.astro`;
      const indexPath = pagesDir + `community/${slug}/index.astro`;
      expect(
        existsSync(flatPath) || existsSync(indexPath),
        `${item.key}: expected either ${flatPath} or ${indexPath}`,
      ).toBe(true);
    }
  });

  it('community landing preserves #membership anchor', () => {
    const src = readFileSync(pagesDir + 'community/index.astro', 'utf-8');
    expect(src).toContain('id="membership"');
  });

  it('Footer Donate link points at /community/donate/', () => {
    const src = readFileSync(footerPath, 'utf-8');
    expect(src).toContain('href="/community/donate/"');
    expect(src).toContain('>Donate<');
  });
});
```

- [ ] **Step 3: Run test — expect PASS**

```bash
pnpm test tests/unit/community.test.ts
```

Expected: all 5 tests pass. If the Footer test fails, the Step 1 edit did not save. If a route-file test fails, one of Tasks 12-19 is missing a file.

- [ ] **Step 4: `pnpm check` + `pnpm build`**

```bash
pnpm check
pnpm build
```

Expected: `pnpm check` — 0 errors. `pnpm build` — succeeds; both guardrails clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.astro tests/unit/community.test.ts
git commit -m "$(cat <<'EOF'
feat(community): swap Footer Donate link + add community route tests

Footer.astro Donate link swaps from /community/ stub to the new
/community/donate/ page. Test suite asserts COMMUNITY_NAV order,
href shape, every route file exists, landing #membership anchor
preserved, and Footer Donate href is correct.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 21: Extend Playwright smoke test for Community

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Read current smoke test structure**

Locate the console-error listener setup at the end of the test (line ~117 per Cycle 5's structure). The Community block will be inserted immediately BEFORE that listener.

- [ ] **Step 2: Add Community block**

Insert the following inside the existing single test, immediately before the "// No unexpected console errors" comment:

```typescript
  // Community section — landing (h1 + sub-nav + #membership anchor), companion theatres grid,
  // newsletters index, testimonials form (fallback mode expected in test env — no .env populated)
  await page.goto('/community/');
  await expect(page.getByRole('heading', { level: 1, name: 'Community' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Community section/i })).toBeVisible();
  // Anchor preserved for Cycles 2 + 5 cross-links
  await expect(page.locator('#membership')).toBeVisible();

  // Companion theatres — grid renders ≥3 cards
  await page.goto('/community/companion-theatres/');
  await expect(page.getByRole('heading', { level: 1, name: 'Companion Theatres' })).toBeVisible();
  const theatreCards = page.locator('main ul li article');
  await expect(theatreCards.first()).toBeVisible();
  await expect(await theatreCards.count()).toBeGreaterThanOrEqual(3);

  // Newsletters — index page renders (empty-state or entries)
  await page.goto('/community/newsletters/');
  await expect(page.getByRole('heading', { level: 1, name: 'Newsletters' })).toBeVisible();

  // Testimonials — page renders + fallback text appears (no .env populated in CI)
  await page.goto('/community/testimonials/');
  await expect(page.getByRole('heading', { level: 1, name: 'Testimonials' })).toBeVisible();
  await expect(page.getByText(/not yet configured/i)).toBeVisible();
```

- [ ] **Step 3: Run the Playwright test**

```bash
pnpm test:e2e
```

Expected: PASS. All pre-existing assertions plus the new Community block pass.

**If the fallback-text assertion fails**, that means `.env` is populated in the test environment. That's fine — either update the assertion to look for the form instead, or run tests in a directory without `.env`. For the default CI/dev-machine case (no `.env`), the fallback text is what's expected.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "$(cat <<'EOF'
test(e2e): extend smoke test for Community section

Landing (h1 + Community sub-nav + #membership anchor), Companion
Theatres (grid ≥3 cards), Newsletters (index), Testimonials
(fallback text visible when .env is unset — the default CI case).

No pre-existing Cycle 1-5 assertions altered.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 22: Update `CLAUDE.md` + auto-memory + follow-ups

**Files:**
- Modify: `CLAUDE.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_followups.md`

- [ ] **Step 1: Update `CLAUDE.md`**

Read current file. Under **Stack**, add:

```markdown
- **Community content model:** `newsletters` MDX collection + `COMPANION_THEATRES` structured data file (`src/data/companion-theatres.ts`) + `TESTIMONIALS` structured data file (`src/data/testimonials.ts`).
- **Forms gateway:** Formspree via `src/lib/form-action.ts` `formActionFor(key)` helper. `.env.example` documents the three `PUBLIC_FORMSPREE_*` env vars; `.env` is git-ignored. Forms fall back to a "not yet configured" mailto: state when envs are unset — see the Formspree conventions block below.
```

Under **Key conventions**, add:

```markdown
**Community sub-nav** (`src/lib/community-nav.ts`) drives the persistent sub-nav rendered by `src/layouts/CommunityLayout.astro` on every `/community/*` page. 7 items: About / How We&rsquo;re Organized / Membership / Donate / Newsletters / Companion Theatres / Testimonials.

**Formspree conventions.** Every form component reads `formActionFor(key)` from `@/lib/form-action` at render time. When `PUBLIC_FORMSPREE_<KEY>_ID` is set to a real value in `.env`, forms POST to `https://formspree.io/f/<id>` via fetch. When unset/empty/still `xxxxxxxx`, they render a "Form not yet configured" note + `mailto:` fallback link. The fallback UI ensures the site ships and merges cleanly before the client provides real Formspree IDs; forms activate the moment `.env` is populated and the site rebuilds. Each form's submit handler is inline `<script is:inline>` with a `window.__dtfc<Name>Init` idempotency guard + DOMContentLoaded wait (per Cycle 5 T18 lesson).

**Companion theatres data.** `src/data/companion-theatres.ts` — inline Zod validation on import, slug uniqueness enforced. Fields: `slug, name, city, state, website?, contactName?, contactEmail?, blurb (≤300), sample, unconfirmed`. FOUNDERS pattern (add explicit `sample: false/true` + `unconfirmed: false/true` on every entry — TypeScript strict rejects otherwise per the Cycle 5 T7 lesson).

**Testimonials data.** `src/data/testimonials.ts` — ships empty at Cycle 6 launch. New testimonials arrive via dev commits (append to the array, run tests, commit). Fields: `slug, attribution, role?, location?, body (≤600), sample`. Empty state renders on `/community/testimonials/` above the share-your-story form.
```

Under **Adding a game / essay / founder / etc.**, add:

```markdown
**Adding a newsletter.** Drop `src/content/newsletters/<slug>.mdx` with `title`, `issueNumber` (int positive), `publishDate` (ISO YYYY-MM-DD), `excerpt` (≤200), `sample: false`. Body sections: `## In this issue` / `## Highlights` / `## Announcements` (or adapt to the issue). Use `&rsquo;` for prose apostrophes.

**Adding a companion theatre.** Append to `COMPANION_THEATRES` in `src/data/companion-theatres.ts` with unique kebab-case `slug`, `name`, `city`, `state`. Optional: `website`, `contactName`, `contactEmail`, `blurb` (≤300 chars), `sample: true` if placeholder, `unconfirmed: true` if pending confirmation. Explicit `sample: false, unconfirmed: false` required when unset (TypeScript strict).

**Adding a testimonial.** Append to `TESTIMONIALS` in `src/data/testimonials.ts` with unique kebab-case `slug`, `attribution` (name + role), `body` (the quote, ≤600). Optional: `role`, `location`, `sample: true` if placeholder. Runs through review before publishing.
```

Under **Deferred / TODO markers**, add:

```markdown
- `PUBLIC_FORMSPREE_*` env vars in `.env.example` — placeholders. Replace with real Formspree endpoint IDs when Formspree accounts are set up; forms activate automatically.
- Zeffy donation URL — `/community/donate/` currently shows a "coming soon" chip + mailto: fallback CTA. Replace with real Zeffy embed/link when client provides.
- Ask Shakespeare destination email — submissions currently route to the Formspree dashboard. When client provides an inbox, either configure the Formspree endpoint's destination or migrate to a service that emails directly.
- Membership tiers + pricing — `/community/membership/` currently ships as pre-release interest form. Flip the chip + expand the page with real tier content when finalized.
- Testimonials moderation policy — currently dev-committed. If a CMS-style backend is picked, migrate.
- Fallback `hello@dtfc.example` mailto: address — placeholder throughout the form components + Donate CTA. Replace with the client's real inbound email address.
```

- [ ] **Step 2: Update `project_dtfc_cycles.md`**

Read the current file. Update the current-status line for Cycle 6 (or add if missing). Then add the Cycle 6 shipped line:

```markdown
Cycle 6 shipped 2026-08-12 (Community section: 7 subsections built + Formspree-gateway wiring for 4 forms with build-time mailto: fallback. Six soft-shipped chips where client hasn't decided. `.env` config surface introduced. Companion theatres data file + testimonials data file added.).
```

Update the roadmap:
- Cycle 7 — Cross-site search (Pagefind) + analytics + launch checklist + WCAG AA audit + shipped-content apostrophe cleanup + real ESP/Zeffy/email wiring when client provides

- [ ] **Step 3: Append to `project_dtfc_followups.md`**

Add at the bottom:

```markdown
**Cycle 6 (2026-08-12) added follow-ups:**
- Real ESP wiring (Mailchimp/Brevo/ConvertKit/etc.) — one-line swap of `PUBLIC_FORMSPREE_*` action URLs. Alternatively keep Formspree and configure destination emails per endpoint.
- Zeffy donation URL — swap the mailto: CTA on `/community/donate/` and remove the "coming soon" chip.
- Ask Shakespeare destination email — configure the Formspree Ask Shakespeare endpoint to route to a real inbox (or migrate off Formspree).
- Membership tiers + pricing content — flip the pre-release chip on `/community/membership/` and expand the page with real tier content when client finalizes.
- Testimonials moderation policy — decide dev-committed data file vs. CMS backend.
- Testimonial seed content — client may provide 2-3 real testimonials; append to `TESTIMONIALS` and commit as a small content-only follow-up.
- `hello@dtfc.example` fallback address — placeholder throughout form components + Donate CTA. Replace with client's real inbound email in a small search-and-replace commit.
- If Task 4 was skipped, Cycle 6 shipped with placeholder companion theatres + empty newsletter archive + drafted About / How We're Organized copy; schedule Drive import as immediate follow-up.
- CLIENT REVIEW markers on Community subsection pages (About, How We're Organized, Membership pre-release copy, Donate copy) — bundle for Lola/Laurie review.
```

- [ ] **Step 4: Commit CLAUDE.md only**

Memory files live outside repo — not committed.

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs: update CLAUDE.md for Cycle 6 Community + forms

Documents: Community section content model (newsletters + companion
theatres + testimonials), CommunityLayout wrapper + COMMUNITY_NAV
sub-nav, Formspree gateway conventions with formActionFor() helper
+ mailto: fallback pattern, "Adding a newsletter/companion theatre/
testimonial" instruction blocks, deferred TODO markers for env
config, Zeffy URL, Ask Shakespeare destination email, membership
tiers, testimonial moderation, fallback mailto: address.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Final Verification (not a separate commit — the executing session runs these)

After Task 22, before offering to merge to `main`, run:

- `pnpm check` — 0 errors.
- `pnpm build` — succeeds; both prebuild guardrails print `✓` (including the Cycle 5 curly-apostrophe check across all new Community content). ~92 pages built (was 85 Cycle 5; +7 Community pages + any newsletter detail pages from Task 4).
- `pnpm test` — all Vitest suites green (existing 87 + `form-action.test.ts` (5) + `newsletters.test.ts` (3) + `companion-theatres.test.ts` (5) + `testimonials.test.ts` (4) + `community.test.ts` (5) ≈ 109 tests).
- `pnpm test:e2e` — Playwright smoke test green (existing + Community block).
- Manual pass in `pnpm dev`:
  - `/community/` — landing with sub-nav + directory grid + `#membership` anchor visible + reflective prompt.
  - `/community/about/`, `/community/how-were-organized/` — H2 sections + cross-links.
  - `/community/membership/` — pre-release chip + interest form (fallback UI in dev if `.env` unset).
  - `/community/donate/` — coming-soon chip + mailto: CTA.
  - `/community/newsletters/` — signup form at top + empty-state below (or grid if Drive import populated).
  - `/community/companion-theatres/` — 3+ theatre cards.
  - `/community/testimonials/` — form (fallback in dev) + empty-state below.
  - Footer — Donate link now points at `/community/donate/`.
  - `/shakespeare/ask-shakespeare/` — AskShakespeareForm renders (fallback UI when env unset).
  - Landing page — NewsletterTile renders (fallback UI when env unset).

When all clean, offer the merge:

```bash
git checkout main && git merge --no-ff cycle-6-community-forms -m "Merge cycle-6-community-forms (Community section + Formspree gateway per spec §5)"
```

---
