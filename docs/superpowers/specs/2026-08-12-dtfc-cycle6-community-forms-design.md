# DT:FC Cycle 6 — Community Section + Forms Wiring Design

**Date:** 2026-08-12
**Branch:** `cycle-6-community-forms`
**Predecessor:** Cycle 5 (Legacy) shipped 2026-08-12 at commit `00d7344`.
**Source spec:** `/Users/cnote/Downloads/dtfc-website-spec.md` §5 (Community)

## 1. Goal

Deep-build the Community section per source spec §5 (all 7 subsections) and wire the three TODO(esp)-stubbed forms shipped in earlier cycles (`NewsletterSignup` footer, `NewsletterTile` landing tile, `AskShakespeareForm`) to a Formspree gateway. Cycle 6 also introduces the site's first `.env`-based configuration surface and a build-time fallback pattern so forms remain visibly functional even when the gateway envs are unset.

## 2. Scope

### In scope

- New `CommunityLayout` + `COMMUNITY_NAV` (7-item sub-nav), mirror of Legacy/Shakespeare/Children's layout pattern.
- 7 new/rewritten Community routes:
  - `/community/` (landing rewrite; preserves `#membership` anchor)
  - `/community/about/`
  - `/community/how-were-organized/`
  - `/community/membership/` (soft-shipped)
  - `/community/donate/` (soft-shipped)
  - `/community/newsletters/` (index + `[slug]` dynamic route for archived issues)
  - `/community/companion-theatres/`
  - `/community/testimonials/`
- Three new content sources:
  - `newsletters` MDX content collection
  - `src/data/companion-theatres.ts` structured data file (Zod-validated at import; FOUNDERS pattern)
  - `src/data/testimonials.ts` structured data file (same pattern)
- Formspree gateway integration:
  - `.env` + `.env.example` land this cycle (site's first envelope config)
  - Three `PUBLIC_FORMSPREE_*` variables
  - Build-time fallback to `mailto:` when envs are empty (no build failure, no runtime crash)
  - Rewrite of the three TODO(esp) form components to use the Formspree gateway with fallback
  - New `TestimonialForm` component (fourth form on the site)
- Drive MCP conditional import task (Companion Theatres directory, newsletter archive, About/How We're Organized source text, any drafted Membership/Donate/Testimonial copy)
- Test coverage: 5 new Vitest suites + Playwright smoke-test extension
- `Footer.astro` Donate link swap (currently stubs to `/community/`; swaps to new `/community/donate/` page)
- CLAUDE.md + auto-memory updates

### Out of scope (Cycle 7+)

- Real ESP wiring beyond Formspree (Mailchimp/Brevo/ConvertKit — swap `action=` URL only)
- Real Zeffy donation URL (`/community/donate/` ships as soft-shipped placeholder)
- Ask Shakespeare destination email routing (submissions collect to Formspree dashboard until client provides)
- Membership tier language + pricing (page ships as interest-form-only + pre-release chip)
- Testimonials moderation backend (data file is the single source; new testimonials arrive via dev commit until CMS strategy is decided)
- Cross-site search (Pagefind), analytics, WCAG AA audit — all Cycle 7 deliverables
- Cleanup of the 60 straight-apostrophe defects across 28 whitelisted Cycle 1-4 files — parked follow-up

## 3. Architecture

### 3.1 Section layout pattern (established)

Reuses the section-layout convention from Cycles 3-5:

- `src/layouts/CommunityLayout.astro` wraps `SectionLayout` with `section="community"` and injects a persistent sub-nav below the `<h1>`.
- `src/lib/community-nav.ts` exports `COMMUNITY_NAV: CommunityNavItem[]` — a 7-item array driving both the sub-nav render and the landing directory grid.
- Sub-nav items use `aria-current="page"` on match; `subPage` prop identifies the current route.

### 3.2 Content routing (Astro static generation)

- Landing rewrite at `src/pages/community/index.astro` — SectionLayout wrapper + `<ReflectivePrompt sectionKey="community" />` + intro grid mirroring Cycle 5's Legacy landing directory pattern.
- Six primary section pages at `src/pages/community/<subpage>.astro`.
- Newsletters uses a dynamic route: `src/pages/community/newsletters/[slug].astro` renders one page per collection entry via `getStaticPaths`.
- All pages set `subPage="<key>"` matching the `COMMUNITY_NAV` entry key.

### 3.3 Data flow

Three sources feed the Community section:

- `newsletters` MDX collection → `getCollection('newsletters')` + `<NewsletterCard entry={entry} />` cards on index + `<NewsletterDetail entry={entry}><Content /></NewsletterDetail>` on the dynamic route (mirror of Cycle 5's `EssayCard`/`EssayDetail`).
- `COMPANION_THEATRES` from `src/data/companion-theatres.ts` → `<CompanionTheatreCard theatre={t} />` grid on `/community/companion-theatres/`.
- `TESTIMONIALS` from `src/data/testimonials.ts` → `<TestimonialCard testimonial={t} />` grid on `/community/testimonials/` above the share-your-story form.

Form submissions flow client-side via `fetch` to Formspree endpoints (see §5).

## 4. Content model

### 4.1 Newsletters content collection

- Directory: `src/content/newsletters/` (MDX files, one per issue)
- Schema (in `src/lib/content-schemas.ts`, exported as `newslettersSchema`):
  ```ts
  export const newslettersSchema = z.object({
    title: z.string(),
    issueNumber: z.number().int().positive(),
    publishDate: z.string(),           // ISO YYYY-MM-DD
    excerpt: z.string().max(200),
    sample: z.boolean().default(false),
  });
  ```
- Registered in `src/content.config.ts` alongside `essays`, `scripts`, `askShakespeare`, `colloquial`.
- Body sections: `## In this issue`, `## Highlights`, `## Announcements` (H2s — matches the `essays` H2 convention).
- Index page sorts entries by `publishDate` descending (most recent first).
- Empty-state copy on the index if 0 entries: "Signup form only — our archive begins with the next issue."

### 4.2 Companion Theatres data file

- Location: `src/data/companion-theatres.ts`
- Inline Zod validation on import + slug-uniqueness IIFE (FOUNDERS pattern):
  ```ts
  const CompanionTheatreSchema = z.object({
    slug: z.string(),
    name: z.string(),
    city: z.string(),
    state: z.string(),                 // 2-letter abbreviation or full name
    website: z.string().url().optional(),
    contactName: z.string().optional(),
    contactEmail: z.string().email().optional(),
    blurb: z.string().max(300),
    sample: z.boolean().default(false),
    unconfirmed: z.boolean().default(false),
  });
  ```
- Seed content: at least 3 entries (from Drive import if available; otherwise `sample: true` placeholders).
- Renders as a responsive card grid (mobile 1-col, sm 2-col, lg 3-col — mirror Founders grid).

### 4.3 Testimonials data file

- Location: `src/data/testimonials.ts`
- Inline Zod validation on import + slug-uniqueness IIFE:
  ```ts
  const TestimonialSchema = z.object({
    slug: z.string(),
    attribution: z.string(),           // e.g. "Jane Doe, Facilitator"
    role: z.string().optional(),       // e.g. "Facilitator" — separate for card styling
    location: z.string().optional(),
    body: z.string().max(600),
    sample: z.boolean().default(false),
  });
  ```
- Seed content: 0 real testimonials at ship time (empty state below the share-your-story form). Client-provided testimonials arrive via dev commits.

## 5. Form gateway architecture

### 5.1 Provider: Formspree

- Free tier: 50 submissions/month per form.
- Dashboard-based submission viewing (no destination email required at gateway-config time).
- Migration path: when client picks their permanent ESP (Mailchimp/Brevo/etc.) or provides a destination email, swap the `action=` URL — one line per form. No architectural change.

### 5.2 Environment variables

Three `PUBLIC_FORMSPREE_*` variables (`PUBLIC_` prefix per Astro convention — safe to expose in built HTML; Formspree IDs are meant to be public):

- `PUBLIC_FORMSPREE_NEWSLETTER_ID` — used by both `NewsletterSignup` (footer) and `NewsletterTile` (landing).
- `PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID` — used by `AskShakespeareForm`.
- `PUBLIC_FORMSPREE_TESTIMONIAL_ID` — used by `TestimonialForm` (new this cycle).

`.env.example` (committed) documents each var + points at `https://formspree.io` for signup. `.env` (git-ignored — already covered by Cycle 1's `.gitignore`) holds real values.

### 5.3 Form-fallback helper

New `src/lib/form-action.ts`:

```ts
type FormKey = 'newsletter' | 'askShakespeare' | 'testimonial';

export function formActionFor(key: FormKey): { action: string; fallbackMode: boolean } {
  const envVar: Record<FormKey, string | undefined> = {
    newsletter: import.meta.env.PUBLIC_FORMSPREE_NEWSLETTER_ID,
    askShakespeare: import.meta.env.PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID,
    testimonial: import.meta.env.PUBLIC_FORMSPREE_TESTIMONIAL_ID,
  };
  const id = envVar[key];
  if (id && id !== 'xxxxxxxx' && id.length > 0) {
    return { action: `https://formspree.io/f/${id}`, fallbackMode: false };
  }
  return { action: '#', fallbackMode: true };
}
```

Each form component reads this helper at render time. When `fallbackMode` is true, the component renders a small "Form not yet configured — please email us at [placeholder]" note + disables the submit button (or replaces the submit with a `mailto:` link).

### 5.4 Submit UX

Client-side JavaScript intercepts the form submit, does:

```js
fetch(action, {
  method: 'POST',
  body: new FormData(form),
  headers: { Accept: 'application/json' },
})
```

Success → renders the inline success message already present in each form (per Cycle 2 pattern with `role="status"`).
Error → renders inline error "Something went wrong — please email us at [placeholder]".
Fallback mode (envs unset) → JS is not attached; form's `action="#"` doesn't submit; user sees the fallback note.

### 5.5 Four forms shipped

1. `NewsletterSignup.astro` (footer, existing) — rewritten to use `formActionFor('newsletter')`.
2. `NewsletterTile.astro` (landing box, existing) — same.
3. `AskShakespeareForm.astro` (Shakespeare section, existing) — rewritten to use `formActionFor('askShakespeare')`.
4. `TestimonialForm.astro` (Community/testimonials, NEW) — uses `formActionFor('testimonial')`. Fields: attribution (name + role), optional location, body (min 40 chars, max 600), optional email if we want to follow up.

## 6. Soft-ship chips

Six visible soft-ship elements this cycle:

1. **`/community/membership/`** — pre-release chip "Membership details — coming with our next content release". Page renders the Cycle 2 CLIENT REVIEW paragraph + a stubbed interest form that dual-purposes as a newsletter opt-in (uses `formActionFor('newsletter')` with a hidden `interest=membership` field so submissions can be filtered in the ESP later).
2. **`/community/donate/`** — "coming soon" chip "Zeffy donation form arriving with our next content release". Renders drafted "why donate" copy + a placeholder CTA button that opens a `mailto:` to the We Tell Stories fiscal-sponsor email (or a stub placeholder email if the fiscal-sponsor email isn't known — CLIENT REVIEW).
3. **`/community/testimonials/`** display — empty-state placeholder "Testimonials arriving soon; share your story below" if `TESTIMONIALS.length === 0`. Grid renders any that exist.
4. **`AskShakespeareForm`** — no visible chip; CLIENT REVIEW comment above the form referencing "responses currently route to the Formspree dashboard; email destination pending client decision".
5. **`NewsletterSignup` + `NewsletterTile`** — no visible chip. Forms are fully functional when `.env` is populated; only the "Form not yet configured" note surfaces when it isn't.
6. **Companion Theatres** — "Sample directory — pending full import" chip on any `sample: true` card (mirrors FounderCard sample chip).

## 7. Navigation, cross-links, anchors

### 7.1 New sub-nav

`src/lib/community-nav.ts` defines `COMMUNITY_NAV`:

```ts
export interface CommunityNavItem {
  key: string;
  label: string;
  href: string;
}

export const COMMUNITY_NAV: CommunityNavItem[] = [
  { key: 'about',             label: 'About',              href: '/community/about/' },
  { key: 'how-were-organized', label: 'How We’re Organized', href: '/community/how-were-organized/' },
  { key: 'membership',        label: 'Membership',         href: '/community/membership/' },
  { key: 'donate',            label: 'Donate',             href: '/community/donate/' },
  { key: 'newsletters',       label: 'Newsletters',        href: '/community/newsletters/' },
  { key: 'companion-theatres', label: 'Companion Theatres', href: '/community/companion-theatres/' },
  { key: 'testimonials',      label: 'Testimonials',       href: '/community/testimonials/' },
];
```

### 7.2 Preserved anchors

- `/community/#membership` (referenced by Cycle 2 IDEA_TWO_ANSWERS in `src/data/landing.ts` and by Cycle 5's `/legacy/` landing) — kept on the Community landing with a short "Become a member" section that cross-links to `/community/membership/`. Same preservation pattern as Cycle 5's `#colorado-caravan` / `#founders`.

### 7.3 Cross-link swaps

- `src/components/layout/Footer.astro` line ~35: Donate link currently stubs to `/community/` — swap to `/community/donate/`.
- No other cross-links change; landing anchors preserved.

## 8. Drive MCP import task (conditional)

Analogous to Cycle 5's T4:

- Requires human partner to provide Google Drive folder link. Same conditional pattern as Cycles 3/4/5.
- If provided, implementer enumerates Legacy-relevant subfolders:
  - Companion Theatres directory (any format — likely a doc or spreadsheet listing partner theatres) → converts to `src/data/companion-theatres.ts` entries
  - Newsletter archive subfolder → converts each past issue to `src/content/newsletters/<slug>.mdx` (with `sample: false`)
  - About DT:FC source doc → staged to `.superpowers/sdd/*/imports/about.txt` for the About page task
  - How We're Organized source doc → staged to `imports/how-were-organized.txt`
  - Any Membership / Donate / Testimonial drafted copy → staged to `imports/membership.txt` / `imports/donate.txt` / `imports/testimonials.txt`
- Editorial-marker cleanup per Cycle 3/4 discipline (`DESIRAE:`, `LOLA:`, `PUA:`, `CHERIE NOTE:`, `TO DO`, `for reference only`).
- **Content-filter guidance:** report file + final reply describe paths, byte counts, and outcomes only — no imported content quoted (Cycle 3 lesson).
- If skipped, all Community subsections ship with drafted CLIENT REVIEW placeholder copy; page-content tasks pull from their staged `imports/*.txt` when available.

## 9. Testing

### 9.1 Unit tests (Vitest, new)

- `tests/unit/community.test.ts` — asserts all 7 sub-routes render (via file-existence check on the static-generation output), landing preserves `#membership` anchor.
- `tests/unit/newsletters.test.ts` — collection registration; every entry's `excerpt` ≤200 chars; sort behavior on index.
- `tests/unit/companion-theatres.test.ts` — data shape; unique slugs; at least 3 entries.
- `tests/unit/testimonials.test.ts` — data shape; unique slugs; empty array allowed.
- `tests/unit/forms.test.ts` — `formActionFor()` returns `{ action: 'https://formspree.io/f/<id>', fallbackMode: false }` when env is set, and `{ action: '#', fallbackMode: true }` when env is empty/undefined/`xxxxxxxx` placeholder. Tests each of the 3 form keys.

### 9.2 E2E extension (Playwright, extends existing single test)

Extend `tests/e2e/smoke.spec.ts` with Community block (inserted before the console-error listener):

- `/community/` — h1 + sub-nav visible
- `/community/companion-theatres/` — grid renders ≥3 cards
- `/community/newsletters/` — index page renders (empty state or entries)
- `/community/testimonials/` — form renders + fallback text appears when envs are unset (test runs without `.env` populated so this is the default state)

Testimonial form actual submit not asserted (avoids network calls in CI); the form-fallback assertion validates the wiring path structurally.

### 9.3 Verification per task

Same discipline as Cycle 5: `pnpm check` (0 errors) + `pnpm build` (clean, both guardrails green) + `pnpm test` (all suites pass), controller-verified between tasks (not trusted from implementer report alone — Cycle 5 lesson).

## 10. Guardrail behavior

The Cycle 5 curly-apostrophe guardrail (`scripts/check-prohibited-text.mjs`) remains active. All new Cycle 6 files (`.astro`, `.mdx`) must use U+2019 in prose apostrophes. New files are NOT added to `CURLY_APOSTROPHE_ALLOWLIST` — the whitelist is only for pre-existing shipped debt. Build fails on any straight U+0027 in prose.

## 11. Success criteria

Cycle 6 is complete when:

- All 7 Community subsections render at their canonical URLs.
- Landing page preserves `#membership` anchor; Cycle 2 IDEA_TWO cross-links + Cycle 5 Legacy cross-link both resolve.
- Sub-nav marks `aria-current="page"` correctly on each subpage.
- Three existing forms + one new form render with correct `action=` URLs when envs are populated, or with fallback text when envs are empty.
- `.env.example` documents the three Formspree variables.
- `Footer.astro` Donate link points at `/community/donate/`.
- Vitest 92/92 (adds ~5 to Cycle 5's 87); Playwright 1/1; `pnpm build` 92 pages (adds ~7 to Cycle 5's 85); `pnpm check` 0 errors; both prebuild guardrails green.
- CLAUDE.md documents Community section conventions.
- All 6 soft-ship chips visibly present where the spec §5 lists client-blocked content.

## 12. Blockers for future cycles

Explicitly deferred to Cycle 7+ (recorded in `project_dtfc_followups.md`):

- Real ESP wiring (Mailchimp/Brevo/ConvertKit/etc.) — one-line `action=` URL swap when client picks
- Real Zeffy donation URL — swap the `/community/donate/` placeholder CTA
- Ask Shakespeare destination email — swap Formspree to route to real inbox
- Membership tiers + pricing content — flip `sample: true` chip on Membership page when copy arrives
- Testimonials moderation policy — decide dev-committed data file vs. CMS backend
- Cross-site search (Pagefind) — Cycle 7 primary
- Analytics — Cycle 7
- WCAG AA audit — Cycle 7 launch checklist
- Deferred straight-apostrophe cleanup from Cycle 5 — could fold into Cycle 7 polish pass
