# DT:FC Cycle 10 — Players Resource Center Design

**Date:** 2026-08-12
**Branch:** `cycle-10-players-resource-center`
**Predecessor:** Cycle 9 (Legacy Fidelity) shipped 2026-08-12. Cycle 8 (post-launch chip-flips) remains a separate small cycle triggered by real client credentials.
**Source specs:**
- `/Users/cnote/Downloads/dtfc-players-resource-center-vision-spec.md` — the 12-criterion fidelity spec (primary)
- `/Users/cnote/Downloads/dtfc-website-spec.md` §4.6 — superseded/expanded by the vision spec
- Google Drive folder `3-Players Resource Center` (id `18ySpPJ_In9spXBAbuL9igsEpPaT8_HHe`) — 19 source docs, accessed via the Google Drive MCP during entry authoring

## 1. Goal

Turn the placeholder `/resource-center/` route into the site's conceptual backbone: an A–Z glossary of 18 source-faithful entries backed by a formal ICON registry that other sections' `<Concept id="…" />` popovers already read from. The current section ships 11 Cycle-1-drafted concept MDXs whose bodies were written without the 19 Drive source docs and whose landing page renders a flat filterable list. This cycle rebuilds the landing (letter-rail + grouped cards), rebuilds the entry detail template (Related Resources block, chips, callout classes, editorial-note footer), authors 9 new entries source-faithful from Drive, wholesale-rewrites the 8 existing entries from their source docs, ships the Stage entry with 6 in-repo SVG diagrams, wires cross-section links into Legacy / Theatre Games / Children's Theatre, extends the prohibited-text guardrail with 9 new patterns from vision spec §7, and delivers one client-review bundle document that collects every non-shippable-without-approval decision for Lola and Laurie.

Not in scope: unblocking the three source-doc gaps (Audience entry, Constraints entry, ICONs explainer). Icons.mdx exists as a Cycle 1 internal draft — this cycle marks it `draft:true` and adds it to the bundle for client approval rather than replacing it. Audience and Constraints do not render as pages; they surface as `(pending)` inline references and a Plot §Constraints anchor respectively, with a client ticket for the standalone-vs-anchor decision on Constraints.

## 2. Scope

### In scope

**Track A — Schema, data model, registry**
- Extend `conceptSchema` in `src/lib/content-schemas.ts` with additive optional fields: `credits`, `provenance`, `assets`, `draft`, `beyondSource`, `desiraeReplaceable`, `aiAttribution`. Keep collection name `concepts` (rename to `prc-entries` deferred — ripple cost outweighs vocabulary gain).
- New icon registry data file `src/data/icon-registry.ts` — exports `ICON_REGISTRY: Record<iconId, {file: string, prcSlug: string, iconFlagged: boolean}>`. Formalizes what `iconPath()` in `src/lib/icons.ts` does implicitly; `iconFlagged: true` for the six site-wide ICON-marked entries (Warmup, Continuous Assessment, Magic Toolbox, Theatre Games, Cohesion, Competency).
- Slug rename `archetype` → `archetypes` (match spec title's plural). Update every `<Concept id="archetype">` usage across `.astro` and `.mdx` files.

**Track B — Content entries (18 rendered, 3 ticketed)**
- Rewrite the 8 existing entries wholesale from their source docs (source wins per brainstorm decision): `archetypes` (renamed from `archetype`), `cohesion`, `competency`, `facilitation`, `fearless-creativity`, `magic-toolbox`, `theatre-games`, `warmup`. Preserve current `shortDefinition` where it still reads well; mark `draft:true` on every non-Facilitation entry (Facilitation is the only source doc with an explicit `Short Definition:` — use verbatim, `draft:false`).
- Author 9 new entries source-faithful from Drive: `casting`, `continuous-assessment`, `creativity`, `developmental-theatre`, `language-oral-tradition`, `language-sparse-resonant`, `plot`, `repetition`, `stage`.
- Casting consolidation: primary `casting.mdx` entry carries the shared concepts from doc #3 (Casting: Choosing Players for Roles); doc #4 (Casting for Educators using DT:FC Methods) content lives inside the same entry under a `## For Educators` H2 subsection. Consolidation decision surfaces in the client-review bundle for sign-off per vision spec §2 #4.
- Retain the two existing non-source entries `players` and `resilience` with `beyondSource: true` frontmatter flag. Both surface in the client bundle for keep-or-remove approval.
- The existing `icons.mdx` (a Cycle 1 internal draft of what the vision spec §2 calls the missing ICONs Explainer entry): keep, mark `draft:true`, add to client bundle for approval.
- Two missing entries do not render as pages this cycle:
  - **Audience** — referenced with `(ICON)` from Warmup. Warmup entry renders the reference as `Audience (pending)` styled as a `(pending)` chip that links nowhere; ticket in client bundle.
  - **Constraints** — one of Fearless Creativity's four key concepts. Fearless Creativity's Constraints pointer links to `#constraints` anchor inside the Plot entry (which contains a dedicated Constraints section per vision spec §2 row 19). Ticket in client bundle for the standalone-extraction decision.

**Track C — Components, layout, landing**
- New components under `src/components/prc/`:
  - `LetterRail.astro` — sticky top A–Z jump nav with `aria-label="Alphabetical index"`; letters with no entries render as inactive.
  - `EntryCard.astro` — icon + name + shortDefinition + related-count for landing grouping; ICON badge when `icon-registry` marks the entry `iconFlagged`.
  - `RelatedResources.astro` — renders `entry.data.related[]` as icon + name + shortDefinition mini-cards; used at the tail of every entry detail page; skipped when `related` is empty.
  - `StageDiagram.astro` — accepts `variant: 'proscenium' | 'arena' | 'in-the-round' | 'thrust' | 'unusual' | 'sightlines'` and renders an inline SVG matching the source deck's labeled-shape aesthetic (rectangles for stage, arcs for audience, arrows for sight lines). No external assets; `desiraeReplaceable: true` frontmatter flag on the Stage entry.
  - `EditorialNoteAI.astro` — small `Editorial note: Research notes compiled with AI assistance, 2025.` footer, rendered when the entry frontmatter has `aiAttribution: true`.
  - `EntryChips.astro` — renders `draft:true` and `beyondSource:true` chips beside the entry title when set.
- Rebuild `src/pages/resource-center/index.astro`:
  - Retain the existing "What are the ICONs?" callout (already answers landing Idea Two #4).
  - Retain the existing on-page text filter above the letter rail (fast in-section keyword lookup).
  - Insert `<LetterRail />` beneath the filter.
  - Replace the flat `<ul>` with letter-grouped grids of `<EntryCard />` (one section per letter with at least one entry; letter serves as `<h2>` heading with `id={letter}` for the rail to jump to).
- Rebuild `src/layouts/ConceptLayout.astro` (entry detail):
  - Header: icon (from `ICON_REGISTRY`) + title + `<EntryChips />`.
  - `shortDefinition` rendered as the entry lede in `.font-display text-xl` register.
  - Body content with new callout classes: `.callout-tip` (TIP), `.callout-why` (Why Do I Care?), `.callout-box` (boxed teacher note), `.callout-practical` (Practical Suggestion). Defined in `src/styles/callouts.css` (imported by `tokens.css`).
  - `<EditorialNoteAI />` rendered when `entry.data.aiAttribution` is true.
  - `<RelatedResources related={entry.data.related} />`.
  - Root `<article>` receives `data-pagefind-filter="section:resource-center"` so ⌘K search can scope results.

**Track D — Cross-section wiring**
- Legacy: `fearless-creativity.mdx` links "Roger Holzberg (2021)" pedigree phrase to `/legacy/timeline/` (Holzberg appears in the CU-era block).
- Theatre Games: audit `src/pages/theatre-games/index.astro` for inline mentions of "cohesion", "competency", "warmup", "resilience" — where each first appears in prose, wrap in `<Concept id="…" />`. PRC is the single source of truth for these definitions; no forked strings.
- Children's Theatre:
  - `src/pages/childrens-theatre/index.astro` sidebar gets a "Casting Players for these plays → Casting (PRC)" callout.
  - Every play detail in `src/content/scripts/*.mdx` with `library: childrens-plays` or `library: teaching-modules` receives an inline `See Casting → for role-selection methods` link within its `## Facilitator Notes` section (edit at render time in `src/pages/childrens-theatre/scripts/[slug].astro`, not per-MDX, so future plays inherit).
- Warmup entry: cross-links to Theseus, Ariadne and the Minotaur module (`src/content/scripts/theseus-ariadne-minotaur.mdx` — verify slug at implementation time) and to "How To Facilitate Warmup Theatre Games". If the how-to page doesn't exist yet, ticket in client bundle and render the reference as `(pending)`.
- Cohesion entry: cross-links to the game-selection warning block on `/theatre-games/` (verify anchor target at implementation time).
- Casting entry: links Will Power article reference to a locally-hosted PDF at `/public/legacy/will-power-article.pdf`. If the PDF isn't uploaded yet (Cycle 9 T7 left it TODO(client)), render as `(pending)` chip until Cycle 8 or client permission unblocks.

**Track E — Guardrails, renames, cleanup**
- Extend `scripts/check-prohibited-text.mjs` `PATTERNS` array with 9 new entries from vision spec §7:
  - `DESIRAE:` (any casing)
  - `Desirae you will need`
  - `check this doc info is included`
  - `OTHERS\?`
  - `\(image of water molecule\)`
  - `\(LOGO\)` trailing
  - `\(ICON\)` suffix on titles
  - `Note: Published in ` (drafting note; the September 2024 newsletter provenance lives in frontmatter, not body)
  - Raw `docs\.google\.com` and `drive\.google\.com` URLs
- Rename slug `archetype` → `archetypes` and update every reference site-wide. Grep for `id="archetype"` and `id='archetype'` in `.astro` + `.mdx`.
- Cross-check: the current `<Concept id="…" />` component reads from `getConcept(slug)` and throws on unknown slug at build time — so the rename is fail-loud, not silent.

**Track F — Testing**
- Unit (Vitest):
  - Schema validates all new frontmatter fields on a fixture entry.
  - `ICON_REGISTRY` loads; every slug it references resolves to a concept entry.
  - Every entry's `related[]` slug resolves to another entry in the collection.
  - No duplicate slugs in `ICON_REGISTRY`.
  - Stage entry declares all 6 diagram variants in its body (grep body content).
  - `beyondSource: true` set on `players` + `resilience`; unset on the 18 in-spec entries.
- Smoke (Playwright): extend `tests/e2e/smoke.spec.ts` with PRC checkpoints — landing renders LetterRail with at least the A / C / F / M / P / R / S / T / W letters marked active; clicking `C` jumps to a heading with `id="c"`; opening an entry page renders lede + Related Resources block; opening a game page (existing checkpoint) still opens the Concept popover; ⌘K search modal has a section filter chip that restricts to PRC.
- A11y: extend the 11 existing axe-core checkpoints with PRC landing + one detail page. Fails on critical/serious.
- `pnpm check:prohibited` runs the new patterns; verify green on the built site.

**Track G — Client review bundle**
- New directory `docs/client-reviews/` (first entry — `docs/client-reviews/2026-08-12-cycle10-prc-review.md`).
- Bundle contents (single document, structured for Lola / Laurie consumption, not code review):
  1. **Water-molecule science error** — Cohesion source doc reads "cohesion of oxygen and nitrogen atoms"; water is hydrogen + oxygen. Do not ship the error; do not silently fix. Bundle proposes the corrected phrasing for approval.
  2. **Peterson / Petersen spelling** — Language: Oral Tradition source uses "Nils Peterson"; Legacy Founders data uses "Nils Petersen". Bundle asks for the canonical spelling to apply site-wide.
  3. **2005 → 2025 AI typo** — Repetition source doc reads "Notes from ClaudeAI in 2005"; obvious typo. Bundle proposes the standardized AI-attribution line as the replacement.
  4. **Standardized AI-attribution line** — proposed text `Research notes compiled with AI assistance, 2025.` rendered as an entry footer via `EditorialNoteAI` on the entries whose source docs disclose AI use. Bundle enumerates affected entries.
  5. **Short-definition approvals (17 entries)** — every entry except Facilitation carries `draft:true` on its `shortDefinition`; Facilitation is verbatim. Bundle lists all 17 for client edit or approval.
  6. **Missing entries** — Audience (referenced from Warmup, no source doc); Constraints (referenced from Fearless Creativity, only lives as a subsection of Plot — bundle asks whether to extract as standalone or leave the Fearless Creativity pointer landing on Plot's anchor); ICONs explainer (Cycle 1 internal draft at `icons.mdx` — bundle asks for approval, edit, or replacement).
  7. **Casting consolidation sign-off** — the two casting docs (~60% overlap) were merged into one entry with a `## For Educators` subsection. Bundle documents the merge and asks for confirmation.
  8. **Plot overlap audit** — the source doc's own title carries the client audit note "check this doc info is included" flagging suspected overlap with Children's Theatre "How to Create a DT:FC Children's Script". Bundle reports the overlap analysis (Plot as PRC theory entry, the Children's Theatre doc as procedural how-to; cross-linked both directions) and asks whether the split is correct.
  9. **`players` and `resilience` retention** — both existing entries kept with `beyondSource: true` flag. Bundle asks whether they should stay, be deleted, or be folded into other entries (e.g. Resilience → Competency subsection).
  10. **Asset requests** — Wayfarer's Journey line drawing (existing `WayfarersJourneyWheel.astro` reused for the Archetypes entry — check with Desirae if this shared usage works or if Archetypes wants a different treatment); water-molecule diagram (Cohesion — currently rendered as descriptive text with placeholder note); Stage 6 diagrams (in-repo SVG drafts pending Desirae refinement — component accepts drop-in replacement).
  11. **How To Facilitate Warmup Games** — Warmup entry references this page; if not yet built, bundle asks whether to schedule for a future cycle or absorb the content into the Warmup entry itself.

### Out of scope (deferred — client-blocked or later cycle)

- Audience entry authoring — needs client-supplied source text before it can render.
- Constraints as standalone entry — client decision needed before extraction from Plot.
- ICONs explainer verbatim (source-approved) — currently ships as Cycle 1 draft with `draft:true`; upgrade path is a client edit-or-replace.
- Wayfarer / water-molecule / Stage SVGs as Desirae-final artwork — this cycle ships the Wayfarer wheel already in-repo (reused), a placeholder-note treatment for water-molecule, and 6 in-repo Stage drafts that mirror the source deck's aesthetic. All swappable.
- Will Power article local hosting — Cycle 9 T7 left this TODO(client); Casting entry surfaces the reference as `(pending)` chip until permission arrives.
- CSF Facebook video, Formspree endpoint destinations — unchanged from Cycles 6/7; no PRC dependencies.
- `players` / `resilience` deletion — deferred pending client approval; retained with `beyondSource: true`.

## 3. Architecture

### 3.1 Schema extension

`src/lib/content-schemas.ts` — extend `conceptSchema` additively:

```ts
export const conceptSchema = z.object({
  name: z.string(),
  slug: z.string(),
  shortDefinition: z.string().max(240),
  icon: z.string().default('placeholder'),
  related: z.array(z.string()).default([]),
  // Cycle 10 additions — all optional / defaulted so existing entries pass
  credits: z.string().optional(),
  provenance: z.string().optional(),
  assets: z
    .array(
      z.object({
        slug: z.string(),
        description: z.string(),
        status: z.enum(['placeholder', 'delivered']).default('placeholder'),
      }),
    )
    .default([]),
  draft: z.boolean().default(false),
  beyondSource: z.boolean().default(false),
  desiraeReplaceable: z.boolean().default(false),
  aiAttribution: z.boolean().default(false),
});
```

### 3.2 Icon registry

New file `src/data/icon-registry.ts`:

```ts
export const ICON_REGISTRY = {
  warmup:                { file: 'warmup.svg',              prcSlug: 'warmup',              iconFlagged: true },
  'continuous-assessment': { file: 'continuous-assessment.svg', prcSlug: 'continuous-assessment', iconFlagged: true },
  'magic-toolbox':       { file: 'magic-toolbox.svg',       prcSlug: 'magic-toolbox',       iconFlagged: true },
  'theatre-games':       { file: 'theatre-games.svg',       prcSlug: 'theatre-games',       iconFlagged: true },
  cohesion:              { file: 'cohesion.svg',             prcSlug: 'cohesion',             iconFlagged: true },
  competency:            { file: 'competency.svg',           prcSlug: 'competency',           iconFlagged: true },
  // Non-ICON-flagged but still get inline icons via popover
  facilitation:          { file: 'facilitation.svg',         prcSlug: 'facilitation',         iconFlagged: false },
  'fearless-creativity': { file: 'fearless-creativity.svg',  prcSlug: 'fearless-creativity',  iconFlagged: false },
  archetypes:            { file: 'archetypes.svg',           prcSlug: 'archetypes',           iconFlagged: false },
  // ... one entry per rendered PRC concept — 20 total (18 in-spec + icons draft + players + resilience)
} as const satisfies Record<string, { file: string; prcSlug: string; iconFlagged: boolean }>;
```

Registry has one entry per rendered concept — 20 total. `beyondSource: true` entries (`players`, `resilience`) receive registry entries too, since their detail pages still render icons; only their PRC-status differs. Existing `src/lib/icons.ts` `iconPath()` helper refactors to look up via `ICON_REGISTRY` first, falling back to `placeholder.svg`. Every asset lives at `/public/icons/<file>`; all currently ship as `placeholder.svg` clone until Desirae delivers.

### 3.3 Component tree

```
src/components/prc/
├─ LetterRail.astro           # sticky A–Z jump nav
├─ EntryCard.astro            # landing card, uses ICON_REGISTRY + iconFlagged for badge
├─ RelatedResources.astro     # tail block on entry detail
├─ StageDiagram.astro         # variant switch → inline SVG
├─ EditorialNoteAI.astro      # small aiAttribution footer
└─ EntryChips.astro           # draft: / beyondSource: chips beside title
```

Existing `src/components/concept/Concept.astro` + `ConceptPopover.astro` are unchanged — they already read from the `concepts` collection and thus inherit the schema extensions for free.

### 3.4 Landing shape

```
/resource-center/index.astro
├─ SectionLayout eyebrow="Glossary" title="Players Resource Center"
├─ ReflectivePrompt sectionKey="resource-center"
├─ Callout: "What are the ICONs?" (retained from Cycle 1)
├─ Filter input (retained; instant client-side)
├─ <LetterRail />                                  # sticky
├─ for each letter [A..W] with entries:
│    <h2 id={letter}>{letter}</h2>
│    <div class="grid ..."> for each entry: <EntryCard entry={e} /> </div>
```

### 3.5 Entry detail shape

```
/resource-center/[slug].astro → ConceptLayout.astro
├─ <article data-pagefind-filter="section:resource-center">
│  ├─ Breadcrumbs (Home › Players Resource Center › {name})
│  ├─ Header: <img icon /> <h1>{name}</h1> <EntryChips />
│  ├─ <p class="font-display text-xl">{shortDefinition}</p>   # lede
│  ├─ <div class="prose">{body content via Content components={{ Concept }}}</div>
│  ├─ if entry.data.aiAttribution: <EditorialNoteAI />
│  └─ if entry.data.related.length: <RelatedResources related={related} />
```

### 3.6 Callout classes

New `src/styles/callouts.css` (imported by `tokens.css`):

```css
.callout-tip       { /* TIP callout — clay-500 border-left, ivory-50 bg, "TIP" label */ }
.callout-why       { /* Why Do I Care? — teal-600 border-left */ }
.callout-box       { /* Boxed teacher note — dashed border, ivory-100 bg */ }
.callout-practical { /* Practical Suggestion — moss-500 border-left */ }
```

MDX bodies invoke via standard markdown syntax with class attributes on the opening block (Astro remarks pass through).

### 3.7 Cross-section wiring points

| Change site | File | Change |
|---|---|---|
| Legacy | `src/content/concepts/fearless-creativity.mdx` (PRC side, but names Legacy) | Inline link on "Roger Holzberg (2021)" → `/legacy/timeline/#culepere-era` (or best available anchor) |
| Theatre Games | `src/pages/theatre-games/index.astro` | Wrap first occurrence of each of: cohesion, competency, warmup, resilience in `<Concept id="…" />` |
| Children's Theatre | `src/pages/childrens-theatre/index.astro` | Sidebar callout `Casting Players for these plays → /resource-center/casting/` |
| Children's Theatre | `src/pages/childrens-theatre/scripts/[slug].astro` | For libraries `childrens-plays` + `teaching-modules`: append `See <a href="/resource-center/casting/">Casting →</a>` to `## Facilitator Notes` render |
| PRC entry | `src/content/concepts/warmup.mdx` | Body links to Theseus module + "How To Facilitate Warmup Games" (latter as `(pending)` chip if route absent) |
| PRC entry | `src/content/concepts/cohesion.mdx` | Body links to game-selection anchor on `/theatre-games/` |
| PRC entry | `src/content/concepts/casting.mdx` | Body references Will Power article as `(pending)` chip until PDF hosting resolves (Cycle 9 T7 carryover) |
| PRC entry | `src/content/concepts/archetypes.mdx` | Body embeds `<WayfarersJourneyWheel />` (existing shared component from `src/components/childrens/`) |

## 4. Data model summary

The `concepts` collection ends the cycle with 20 MDX files (18 in-spec + `icons` draft + 2 `beyondSource`):

| Slug | Source doc | Category | Notes |
|---|---|---|---|
| archetypes | doc #2 | in-spec (renamed from archetype) | Wayfarer wheel embedded |
| casting | docs #3 + #4 consolidated | in-spec | `## For Educators` subsection |
| cohesion | doc #5 | in-spec | Water-molecule error → placeholder note |
| competency | doc #6 | in-spec | Canonical 5-competency definition |
| continuous-assessment | doc #7 | in-spec | ICON |
| creativity | doc #8 | in-spec | Rubin pedigree |
| developmental-theatre | doc #10 | in-spec | Also used as site-wide meta description |
| facilitation | doc #11 | in-spec | Verbatim shortDefinition |
| fearless-creativity | doc #9 | in-spec | 4 concepts linked (Constraints → Plot anchor) |
| icons | (missing entry, Cycle 1 draft) | draft awaiting client | `draft:true` |
| language-oral-tradition | doc #12 | in-spec | AI-attribution footer |
| language-sparse-resonant | doc #13 | in-spec | Title typo normalized |
| magic-toolbox | doc #16 | in-spec | ICON; broken-sentence repair flagged |
| players | (no source doc) | `beyondSource:true` | Client keep/remove |
| plot | doc #19 | in-spec | Constraints subsection with anchor |
| repetition | doc #14 | in-spec | AI-attribution footer; 2005→2025 typo fix |
| resilience | (competency subset) | `beyondSource:true` | Client keep/remove |
| stage | doc #15 | in-spec | 6 SVG diagrams; credits Jackie Pualani Johnson |
| theatre-games | doc #17 | in-spec | ICON |
| warmup | doc #18 | in-spec | ICON; Cool-down surfaced; Audience `(pending)` |

## 5. File touch list

**New files (~11)**
- `src/data/icon-registry.ts`
- `src/components/prc/LetterRail.astro`
- `src/components/prc/EntryCard.astro`
- `src/components/prc/RelatedResources.astro`
- `src/components/prc/StageDiagram.astro`
- `src/components/prc/EditorialNoteAI.astro`
- `src/components/prc/EntryChips.astro`
- `src/styles/callouts.css`
- `src/content/concepts/casting.mdx`
- `src/content/concepts/continuous-assessment.mdx`
- `src/content/concepts/creativity.mdx`
- `src/content/concepts/developmental-theatre.mdx`
- `src/content/concepts/language-oral-tradition.mdx`
- `src/content/concepts/language-sparse-resonant.mdx`
- `src/content/concepts/plot.mdx`
- `src/content/concepts/repetition.mdx`
- `src/content/concepts/stage.mdx`
- `docs/client-reviews/2026-08-12-cycle10-prc-review.md`

**Modified files (~14)**
- `src/lib/content-schemas.ts` — schema extension
- `src/lib/icons.ts` — refactor to read `ICON_REGISTRY`
- `src/styles/tokens.css` — import callouts.css
- `src/layouts/ConceptLayout.astro` — new template (chips, lede, callouts, AI footer, Related block, pagefind filter)
- `src/pages/resource-center/index.astro` — landing rebuild
- `src/pages/theatre-games/index.astro` — inline `<Concept>` wrapping
- `src/pages/childrens-theatre/index.astro` — sidebar Casting callout
- `src/pages/childrens-theatre/scripts/[slug].astro` — inline Casting link injection in `## Facilitator Notes` render path
- `src/content/concepts/archetype.mdx` → `archetypes.mdx` — rename + wholesale rewrite + Wayfarer embed
- `src/content/concepts/cohesion.mdx` — rewrite from source; water-molecule placeholder
- `src/content/concepts/competency.mdx` — rewrite from source
- `src/content/concepts/facilitation.mdx` — rewrite from source; keep shortDefinition verbatim
- `src/content/concepts/fearless-creativity.mdx` — rewrite; 4-concept links; Constraints → Plot anchor; Holzberg → Legacy timeline
- `src/content/concepts/icons.mdx` — set `draft:true`
- `src/content/concepts/magic-toolbox.mdx` — rewrite from source
- `src/content/concepts/players.mdx` — set `beyondSource:true`
- `src/content/concepts/resilience.mdx` — set `beyondSource:true`
- `src/content/concepts/theatre-games.mdx` — rewrite from source
- `src/content/concepts/warmup.mdx` — rewrite from source; Audience `(pending)`
- `scripts/check-prohibited-text.mjs` — 9 new PATTERNS
- `tests/e2e/smoke.spec.ts` — PRC checkpoints + axe passes
- `tests/unit/*.test.ts` — schema + registry + related-slug resolution tests
- `CLAUDE.md` — Cycle 10 conventions
- Grep-and-replace across `.astro` + `.mdx` for `<Concept id="archetype"` → `<Concept id="archetypes"`

## 6. Testing strategy

**Unit (Vitest)** — new + extended files under `tests/unit/`:
- `concepts-schema.test.ts` — fixture entries validate; new optional fields default correctly; `draft`, `beyondSource`, `aiAttribution`, `desiraeReplaceable` all round-trip; `assets[]` shape validates.
- `icon-registry.test.ts` — no duplicate slugs; every registry entry's `prcSlug` resolves to a concept entry; every ICON-flagged concept has a matching registry entry.
- `concepts-related.test.ts` — for every concept, every string in `related[]` resolves to a real concept slug (fail-loud on typos).
- `concepts-stage.test.ts` — Stage entry body contains all 6 diagram variants and none extra; credits field set to Jackie Pualani Johnson.
- `concepts-flags.test.ts` — exactly `players` and `resilience` carry `beyondSource:true`; every non-Facilitation entry carries `draft:true`; `aiAttribution:true` on Repetition + Language: Oral Tradition (or wherever source discloses AI — verify at implementation).

**Smoke (Playwright)** — extend `tests/e2e/smoke.spec.ts`:
- Navigate `/resource-center/`; assert LetterRail renders; assert clicking a letter chip jumps to `#letter` anchor; assert filter input hides entries whose names miss the query.
- Navigate `/resource-center/casting/`; assert lede + `## For Educators` subsection + RelatedResources block render.
- Navigate `/resource-center/stage/`; assert all 6 SVG variants render; assert credits line renders.
- Existing game-page checkpoint: assert `<Concept id="cohesion">` popover opens.
- Open header ⌘K search modal; type "cohesion"; assert results include the PRC entry; assert section filter chip narrows to PRC only.

**A11y** — extend axe-core checkpoints with `/resource-center/` landing + one entry detail page; fail on critical/serious.

**Prohibited-text guardrail** — `pnpm build` includes `pnpm check:prohibited`; the 9 new patterns run against every `.astro` / `.mdx` / `.md` in `src/`. Verify no false positives on Shakespeare / Legacy content.

## 7. Sequencing (rough — full plan lives in `docs/superpowers/plans/`)

1. Schema extension + icon-registry data file + `iconPath()` refactor + tests
2. Callout CSS + shared PRC components (`LetterRail`, `EntryCard`, `RelatedResources`, `EditorialNoteAI`, `EntryChips`)
3. Rebuild `ConceptLayout` (entry detail template)
4. Rebuild landing (letter rail + grouped cards)
5. 8 existing entries: source-faithful rewrite from Drive (batch — I read each doc then draft each MDX; short definitions preserved where good, all get `draft:true` except Facilitation)
6. 9 new entries: author from Drive (batch)
7. Stage entry + `StageDiagram` component + 6 inline SVGs
8. Slug rename `archetype` → `archetypes` (grep-and-replace pass)
9. Cross-section wiring (Theatre Games / Legacy link / Children's Theatre callouts + inline Casting)
10. Prohibited-text guardrail additions
11. Client-review bundle document
12. Unit tests, smoke test extension, a11y checkpoints
13. Update `CLAUDE.md` (PRC conventions), update memory (`project_dtfc_cycles`, `project_dtfc_followups`)

Full task decomposition + verification steps land in `docs/superpowers/plans/2026-08-12-dtfc-cycle10-prc.md` via the writing-plans skill.

## 8. Acceptance criteria (mirrors vision spec §8)

1. A–Z PRC landing renders with letter rail, entry cards showing short definitions, on-page filter, and Pagefind section-scope wiring.
2. All 18 in-spec entries render with the template: icon slot, `shortDefinition` lede, body with callout styling, RelatedResources block, print stylesheet.
3. Facilitation's popover uses source `Short Definition` verbatim (`draft:false`); every other `shortDefinition` carries `draft:true`. Popovers pull from PRC data only (grep confirms no duplicated definition strings in components).
4. Icon registry file exists; ICON-flagged entries wired; placeholder artwork swappable via `src/data/icon-registry.ts` file edits alone; popover links land on PRC entries.
5. Stage page renders 6 configuration blocks (Proscenium / Arena / Theatre in the Round with "DT:FC Favorite" flag / Thrust / Unusual / Sight Lines) + Jackie Pualani Johnson credit.
6. Every §5-vision-spec contract resolves to a working internal route, a hosted asset, or a `(pending)` chip with a ticketed follow-up.
7. Audience, Constraints, ICONs explainer surfaced in client bundle; no invented entries ship. `icons.mdx` marked `draft:true`.
8. Casting entry consolidates both source docs into one entry with `## For Educators` subsection; consolidation flagged in client bundle; cross-listed from Children's Theatre (landing sidebar + inline in every play's Facilitator Notes).
9. Plot entry ships; overlap-audit vs. Children's Theatre `How to Create a DT:FC Children's Script` reported in client bundle.
10. Zero occurrences of §7 prohibited strings in built output (`pnpm check:prohibited` in CI).
11. Client-review bundle document delivered at `docs/client-reviews/2026-08-12-cycle10-prc-review.md`.
12. Voice check: entries preserve source's warm second-person register (TIPs, Why Do I Care?, Practical Suggestions rendered as callouts, not flattened prose).

## 9. Risks + mitigations

- **Content-authoring bandwidth** — 9 new entries + 8 rewrites is substantive writing. Mitigation: work source-doc-by-source-doc; a single-doc read + draft cycle is ~10–15 min; batch by category (all Language entries together, all ICON entries together) to hold voice.
- **Cross-section wiring breaks unrelated pages** — adding `<Concept>` popovers to Theatre Games landing could disrupt existing layout; the Casting link injection touches every children's play detail render. Mitigation: smoke test extended before wiring; the `[slug].astro` render helper is one file, so blast radius is contained.
- **Stage SVGs not matching source deck aesthetic** — subjective. Mitigation: keep them intentionally basic (labeled rectangles + arcs), `desiraeReplaceable:true`, bundle asks Desirae for refinement rather than approval.
- **Slug rename `archetype`→`archetypes` misses a reference** — Astro build fails loud on unknown Concept id, so this is self-correcting. Grep pass in the rename task catches most; build catches the rest.
- **Prohibited-text pattern false positives** — the raw-google-URL pattern in particular could match legitimate archival citations in Legacy essays. Mitigation: patterns tested against current site content before commit; allowlist file paths (like the curly-apostrophe allowlist) if needed.
- **Cohesion water-molecule error** — the source doc's science mistake ships nowhere. Mitigation: render as descriptive placeholder note (`Illustration pending: water-molecule diagram will appear here — see client bundle for the source's science-error flag`), never as the erroneous text.
- **Missing routes for cross-links** — Warmup's "How To Facilitate Warmup Games", Cohesion's game-selection anchor, Casting's Will Power PDF may all be non-existent. Mitigation: render `(pending)` chip that visibly does not link; ticket in bundle; unblocks in future cycles or Cycle 8.

---

**Next step:** `superpowers:writing-plans` to produce `docs/superpowers/plans/2026-08-12-dtfc-cycle10-prc.md`.
