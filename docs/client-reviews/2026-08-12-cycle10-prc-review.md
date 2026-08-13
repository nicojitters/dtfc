# Cycle 10 — Players Resource Center: Client Review Bundle

**Date:** 2026-08-12
**Section:** Players Resource Center — `/resource-center/`

This document collects every Cycle 10 decision that requires client sign-off before launch. Each item includes the shipped behavior, the question, and where the code lives.

---

## 1. Science error — Cohesion water-molecule reference

The source doc "Cohesion in Groups: What Is It?" reads: *"cohesion of oxygen and nitrogen atoms"*. Water is hydrogen + oxygen — nitrogen is not part of a water molecule.

**Shipped:** the erroneous phrase does not appear on the site. The entry renders a placeholder note where the water-molecule illustration will go.

**Ask:** confirm the corrected phrasing (proposed: *"cohesion of hydrogen and oxygen atoms in a water molecule"*).

**Where:** `src/content/concepts/cohesion.mdx`

---

## 2. Name spelling — Peterson vs. Petersen

Language: Oral Tradition source doc uses **Nils Peterson**. Legacy Founders data uses **Nils Petersen**.

**Shipped:** the PRC entry uses `Peterson` per the source doc.

**Ask:** confirm the canonical spelling to apply site-wide. Once decided, the fix is a one-line edit in `src/data/founders.ts` (or the concept file, depending on which direction is correct).

**Where:** `src/content/concepts/language-oral-tradition.mdx`, `src/data/founders.ts`

---

## 3. AI-attribution standardized line

Two source docs (Repetition, Language: Oral Tradition) disclose AI-assisted research. The Repetition source includes a `2005` typo that is clearly intended to read `2025`.

**Shipped:** both entries render the standardized footer line:

> *"Editorial note: Research notes compiled with AI assistance, 2025."*

The typo is silently corrected in the rendered text. The footer appears automatically when `aiAttribution: true` is set in frontmatter.

**Ask:** approve the standard line as-is, or supply an edited version. Once approved, no additional changes are needed — both entries already use it.

---

## 4. Short-definition approvals

Facilitation's short definition is verbatim from the source doc's explicit `Short Definition:` field. The other 17 entries carry short definitions drafted from each source's opening paragraph — every drafted entry renders a **Draft** chip beside its title so visitors can see it is not final.

**Ask:** review each drafted short definition; approve or edit. Removing the Draft chip is a one-line frontmatter change per entry (`draft: false`).

**Entries awaiting approval (17):**

- archetypes
- casting
- cohesion
- competency
- continuous-assessment
- creativity
- developmental-theatre
- fearless-creativity
- icons
- language-oral-tradition
- language-sparse-resonant
- magic-toolbox
- plot
- repetition
- stage
- theatre-games
- warmup

**Additional note — developmental-theatre short definition:** The vision spec (§2 row 10) calls for the canonical DT:FC description to be reused as the site-wide meta description via `SITE_CONFIG`. The current site config has a placeholder. Once the `developmental-theatre` short definition is approved, that text can become the site meta description — a 1-line swap in `src/lib/site-config.ts`. Confirm this intent when approving the entry.

---

## 5. Missing entries — three items with no source doc

The vision spec references three concepts that do not have a Drive source document. Each is handled differently:

### 5a. Audience

Warmup references "Audience" with an `(ICON)` marker in the source. On the site, it renders as a `(pending)` chip that does not link to an entry.

**Ask:** should we author a short Audience entry (~1-2 paragraphs)? Or leave the pending chip as-is until a later cycle?

### 5b. Constraints

Fearless Creativity lists Constraints as one of its four key concepts. On the site, the Constraints link currently points to `/resource-center/plot/#constraints` — the relevant section inside the Plot entry.

**Ask:** should Constraints become its own standalone entry, or is the Plot anchor link the right long-term home?

### 5c. ICONs explainer

An ICONs explainer entry exists at `/resource-center/icons/`. It was drafted from Cycle 1 internal notes and is flagged `draft: true`.

**Ask:** approve the current draft, supply an edited version, or author a replacement? The entry renders with a **Draft** chip until this decision is made.

---

## 6. Casting consolidation

Two source docs overlapped substantially:

- *Casting: Choosing Players for Roles*
- *Casting for Educators using DT:FC Methods*

Overlap was approximately 60%. Cycle 10 merged them into a single Casting entry with a `## For Educators` subsection rather than two near-duplicate pages.

**Ask:** confirm the merge is the right call, and that the `## For Educators` treatment correctly separates the practitioner-level content.

**Where:** `src/content/concepts/casting.mdx`

### Additional note — "customers" word choice in plot.mdx

The Plot source doc contains the phrase: *"important to the culture, to our customers, and to us."* In a DT:FC context, "customers" may refer to the schools and communities served rather than a ticket-buying audience.

**Ask:** keep "customers" as-is (source-faithful), change to "audience," or choose another word (e.g., "community," "schools," "participants")?

**Where:** `src/content/concepts/plot.mdx`

---

## 7. Plot ↔ Children's Theatre overlap audit

The Plot source doc carried a note flagging suspected overlap with Children's Theatre's "How to Create a DT:FC Children's Script."

**Analysis:** Plot is the PRC theory entry — it covers myth-fidelity rules, story elongation, the four-sentence method, and how Constraints shape character roles. The Children's Theatre how-to is procedural — it walks step-by-step through script authoring. The two pieces are complementary rather than duplicative. Both entries now cross-link to each other.

**Ask:** confirm the split is correct and no content needs to move between the two pages.

---

## 8. `players` and `resilience` retention

Two existing PRC entries do not map to any source doc from the Drive folder:

- **players** — DT:FC vocabulary entry defining the role of Players in the practice.
- **resilience** — one of the five competencies, mentioned inside the Competency entry.

Both are retained with a `beyondSource: true` flag that renders a **Beyond source** chip, signaling to readers that these reflect site editorial judgment rather than a discrete source document.

**Ask:** keep both as-is, delete one or both, or fold one/both into other entries (e.g., Resilience as a subsection of Competency)?

---

## 9. Asset requests

Four visual assets are currently in placeholder state:

### 9a. Wayfarer's Journey Wheel (Archetypes)

The Archetypes entry embeds the existing `WayfarersJourneyWheel` component from Children's Theatre — same component, shared usage.

**Ask:** confirm this shared usage is correct. If Archetypes warrants a different visual treatment, the entry MDX can be updated independently.

### 9b. Water-molecule diagram (Cohesion)

The Cohesion entry renders a placeholder note: *"[Illustration: water-molecule diagram — pending artwork]"*

**Ask:** supply the illustration when ready. Drop it under `public/images/prc/cohesion/` and update the `imagery` frontmatter in `src/content/concepts/cohesion.mdx`.

### 9c. Stage diagrams (Stage entry)

Six SVG diagrams ship with the Stage entry, matching the labeled-shape aesthetic from the source deck:

- Proscenium · Arena · In-the-round · Thrust · Unusual · Sightlines

Each is marked `desiraeReplaceable: true` — Desirae can swap the SVG source without touching the entry MDX.

**Ask:** no action needed now. When Desirae delivers refined artwork, drop replacement SVGs and the site updates automatically.

### 9d. Concept icons (all entries)

Every PRC entry uses the placeholder icon until Desirae's artwork lands. The icon registry at `src/data/icon-registry.ts` maps each concept slug to a filename — swapping an icon is a filename edit plus dropping the new SVG under `public/icons/`.

**Ask:** no action needed now. When Desirae delivers icons, forward them and we will wire each in.

### Additional note — EntryChips tooltip accessibility

The **Draft** and **Beyond source** chips currently lack hover-tooltip context (the underlying `Chip.astro` component does not support a `title` prop). A future accessibility pass could add tooltip context to disambiguate chip meanings for screen-reader and keyboard users. This is cosmetic and non-blocking for launch.

---

## 10. "How to Facilitate Warmup Games" page

The Warmup entry refers readers to a dedicated "How to Facilitate Warmup Games" page. If that page does not yet exist as a site route, the reference renders as `(pending)`.

**Ask:** schedule this how-to page for a future cycle, or should the content be absorbed directly into the Warmup entry body?

---

## 11. Magic Toolbox source repair

The Magic Toolbox source doc contains a broken sentence: *"the space needs to be It's a space where…"* — the original text appears to have been partially overwritten or duplicated.

Cycle 10 applied a minimal repair (best-guess reconstruction based on surrounding context).

**Ask:** review the repaired sentence and confirm it captures the intended meaning, or supply the correct phrasing.

**Where:** `src/content/concepts/magic-toolbox.mdx`

---

## Additional minor items — archetypes and warmup wording

### archetypes.mdx — Creativity bullet

The Fearless Creativity four-concepts list includes a Creativity bullet that reads: *"we all have it; how to be Fearless."* This may be a truncated version of a longer source passage.

**Ask:** confirm this is the full intended description, or supply the complete text.

**Where:** `src/content/concepts/archetypes.mdx` (also carries `draft: true` pending approval)

### warmup.mdx — capitalization of "Warmup" as verb

The Warmup entry uses "Warmup" capitalized mid-sentence in verb position (e.g., "Warmup the body," "Warmup the mind"). This matches the source document style.

**Ask:** confirm this capitalization is intentional site style, or standardize to lowercase ("warm up" as a verb phrase)?

**Where:** `src/content/concepts/warmup.mdx` (also carries `draft: true` pending approval)
