# DT:FC Cycle 11 — Shakespeare Vision Fidelity Design

**Date:** 2026-08-13
**Branch:** `cycle-11-shakespeare-fidelity`
**Predecessor:** Cycle 10 (Players Resource Center) shipped 2026-08-12. Cycle 8 (post-launch chip-flips) remains a separate small cycle triggered by real client credentials.
**Source specs:**
- `/Users/cnote/Downloads/dtfc-shakespeare-vision-spec.md` — the 12-criterion fidelity spec (primary)
- `/Users/cnote/Downloads/dtfc-website-spec.md` §4.3 — Ask Shakespeare architecture, superseded/expanded by the vision spec
- Google Drive folder `4-Shakespeare` — 4 top-level source docs (`1b Shakespeare Script Alternatives`, `Using Shakespeare in the Schools TMAI`, `2 Honoring our Guides`, `Shakespeare Into Current Colloquial Language`) and 7 script-library subfolders (out-of-scope for this cycle beyond the two New Plays anecdote placeholders)

## 1. Goal

Bring the shipped `/shakespeare` section — a Cycle 3 skeleton with routes, sub-nav, `scripts`/`ask-shakespeare`/`colloquial` collections, and stub landing/honoring pages — into full alignment with the four convictions and 12 acceptance criteria of the Shakespeare vision-fidelity spec. Concretely: (1) merge the full "Creating Fearless Shakespeare Scripts" essay from Drive doc 1b into `/shakespeare/alternatives/` with a working four-alternatives router; (2) merge the full Honoring Our Guides content from Drive doc 3, including Chuck Wilcox's stroke → Shakespeare on the Green invention and Amanda Giguere's June 2025 book credit; (3) feature the "Leave the Language as Shakespeare's Own" doctrine block with the "What translation did you use?" proof point and two live Concept popovers (Vocal Expression, Warmup) on the landing; (4) merge TMAI (doc 2) as four distributed assets (trade-offs callout, 40-minute credentials, scene-selection method, contact CTA) without publishing a parallel page; (5) host the Hawaiian Pidgin *One Uddah Midʻsummah* audio locally and wire it into the Colloquial page with a transcript statement, ʻokina rendering verified; (6) withhold the R&J Rap pending authorship confirmation; (7) add the new `/shakespeare/new-plays/` route via a `new-plays` library-enum extension with two `sample:true` placeholder MDX entries (*The Ballad of Three Finger Dick*, *Shakespeare's Sister*); (8) source per-library blurbs from Alternative passages; (9) reorder the sub-nav to spec §2's client-numbered order; (10) unify remaining Chuck / Charles Wilcox drift; (11) extend the prohibited-text guardrail with seven new patterns from §6; (12) close cross-section contracts to Legacy (`/legacy/founders`, Yang Asian-Theatre column), PRC (Concept icons), Children's Theatre (bidirectional), and Ask Shakespeare (contact CTA target).

Not in scope: importing scripts into the six existing script libraries (Soliloquies, Scenes, Themes, Cuttings, Children's Shakespeare, Ask Shakespeare beyond what already ships) — the vision spec's scope note is explicit that library content import is a separate pass. This cycle wires the framing pages, doctrine, cross-section contracts, and the two anecdote placeholders for New Plays; real scripts arrive over time as the client shares them.

## 2. Scope

### In scope

**Track A — Sub-nav reorder and route addition**
- Reorder `src/lib/shakespeare-nav.ts` from the shipped 9-item order to the vision-spec-§2 client-numbered order: Alternatives → Honoring Our Guides → Soliloquies → Scenes → Themes → Cuttings → Children's Shakespeare → Colloquial → New Plays → Ask Shakespeare (10 items).
- New route `/shakespeare/new-plays/` renders via the existing script-library index pattern (parallels `scenes.astro` / `themes.astro`). Detail pages for the two placeholder scripts served via existing `/shakespeare/scripts/[slug]/` route.
- No changes to `src/layouts/ShakespeareLayout.astro` structure; nav item count grows 9 → 10.

**Track B — Content model additions**
- Extend `scripts` collection `library` enum in `src/content.config.ts` with one new value: `new-plays`. Full enum becomes: `soliloquies | scenes | themes | cuttings | childrens-shakespeare | childrens-plays | teaching-modules | new-plays`.
- Extend `src/lib/script-href.ts` to route `library: 'new-plays'` through `/shakespeare/scripts/<slug>/` (same detail template as existing Shakespeare libraries).
- No new frontmatter fields required. New Plays entries use the existing shape (title, library, play?, authors, copyright, minutes, characters[], stagingNotes, sourceDoc, sample). The optional `play` field is left unset for New Plays since they are Shakespeare-*inspired*, not derived from a specific play.

**Track C — Landing + Alternatives essay content merge (Drive doc 1b)**
- Landing `src/pages/shakespeare/index.astro`: retain shipped structure; add the astonished-teacher proof point (`> "What translation did you use?" — a repeated question from teachers; answer: none.`) as a styled blockquote inside the existing "Leave the Language as Shakespeare's Own" block. Add a TIP callout below the doctrine block: "Use `<Concept id="vocal-expression" />` Theatre Games for `<Concept id="warmup" />`". Both are live Concept popovers from the PRC collection (Vocal Expression is a new PRC entry surfaced in the Cycle 10 client-review bundle — see §7 client-review bundle carryover below).
- Alternatives page `src/pages/shakespeare/alternatives.astro`: full rewrite of body from Drive doc 1b. Structure:
  1. Intro promise ("entertains and educates; alternatives for when a whole play is too long or excludes players; example scripts are provided")
  2. **Leave the Language** doctrine block (mirrors landing so this page stands alone) with the "37 plays survival" note and both Concept-icon TIP
  3. **Alternative One — Scenes**: Colorado elementary-schools story (Will Power) with locally-hosted article link (same asset as Legacy/PRC); "string of beads" variant with three worked examples (Falstaff / R&J with Nurse-as-narrator / Midsummer via Lovers-and-Mechanicals)
  4. **Alternative Two — Scenes Around a Theme**: 8-theme list (Battle of the Sexes; Magic and the Supernatural; Fools and Fooling; Ruler and the Ruled; Rogues and Villains; The Generation Gap; Bullies (CU); Falstaff (merged from TMAI)); no-narration performance practice (hat/headscarf character signals; optional easel signboards); "Consider the audience"; "Experiment. Shakespeare did." pull-quote
  5. **Alternative Three — Cuttings**: method (three-minute play summary; scene list; "mercilessly cut"); honest "more being prepared" note re: Chuck Wilcox's St. Mary's Academy cuts
  6. **Alternative Four — New plays with Shakespeare foundation**: West Side Story with Bernstein spelling (source typo "Berstein" fixed); *The Ballad of Three Finger Dick* (Chuck Wilcox, Wild-West setting and language) with cross-link to Honoring / Chuck section; *Shakespeare's Sister* (Marta Barnard — written for two women, performed at the last minute as a one-woman show) with cross-link to Honoring / Marta section
- Each Alternative section ends with a "Browse the library →" deep-link to its route (`/shakespeare/scenes/`, `/themes/`, `/cuttings/`, `/new-plays/`).
- TMAI merge assets integrated into the same page/pages:
  - "Trade-offs to consider" callout after Themes' Alternative section (narrator-function drawback from TMAI)
  - "Trade-offs to consider" callout after Cuttings' Alternative section ("not truly Shakespeare" honesty from TMAI)
  - Contact CTA card at page end, wired to `/shakespeare/ask-shakespeare/#form` (satisfies TMAI's "contact us… to see a script" asset)
- Strip the source's title parenthetical `(Desirae: use part of text for description of script sections ?)` — never renders (also enforced by the Track K prohibited-text guardrail).

**Track D — Honoring Our Guides content merge (Drive doc 3)**
- Full rewrite of `src/pages/shakespeare/honoring-our-guides.astro` body from Drive doc 3.
- Opening sentence is the standard Honoring pattern (identical wording site-wide — grep Legacy/PRC/Community Honoring pages for the shared sentence and reuse verbatim).
- Section order matches doc 3: Shakespeare → Colorado Shakespeare Festival → the Caravan → Daniel S.P. Yang (with `[Asian Theatre influence — see Legacy Theatre Influences →](/legacy/essays/theatre-influences/#asian-theatre)` deep-link) → Chuck Wilcox (Kent in Benedetti's *Lear*; the stroke; co-inventing Shakespeare on the Green with Richard Devin) → Melinda Scott → Marta Barnard → Amanda Giguere (*Shakespeare and Violence Prevention: A Practical Handbook for Educators*, June 2025) → Joe Craft (fifty years in Denver Public Schools; founded DPS Shakespeare Festival; third steward of the Folger Shakespeare Library).
- "(Link Legacy section)" placeholder → real internal link `/legacy/founders`.
- Typo fixes: "WIthin" → "Within" (also caught by the Track K guardrail).
- Every name preserves the credibility-layer specifics (dates, titles, book titles) verbatim.
- Chuck Wilcox stroke paragraph flagged in client-review bundle for tone verification — not a fabricated claim, but the one paragraph most likely to warrant a client sensitivity re-read.

**Track E — Colloquial page + audio (Drive doc 4)**
- Update `src/content/colloquial/one-uddah-midsummah.mdx` frontmatter: add `audio: 'midsummah-pidgin-paka.mp4'` and `audioCaption: 'Jackie Pualani Johnson performs the Paka (Puck) epilogue in Hawaiian Pidgin English.'`
- Host `/public/audio/midsummah-pidgin-paka.mp4` (fetched from Drive; ASCII kebab-case per CLAUDE.md audio convention; no ʻokina in filename even though the doc uses one).
- New component `src/components/shakespeare/AudioEmbed.astro`: native `<audio controls preload="metadata">` with `src={`/audio/${src}`}` and caption as `<figcaption>`. No fancy chrome; respects motion-safe.
- Update `src/pages/shakespeare/colloquial/[slug].astro` to render `<AudioEmbed>` above `<SideBySideText>` when `entry.data.audio` is set. Insert a transcript-statement paragraph beneath the audio: *"The side-by-side text below serves as an accessible transcript of the recording."*
- Verify ʻokina renders in the shipped tokens.css font stack — the character U+02BB (`ʻ`) must display correctly in the current display + body fonts. If the shipped stack drops to a fallback that lacks the glyph, add an explicit Hawaiian-orthography-safe fallback (e.g., appending `system-ui` isn't enough; may need `"Charis SIL"` or another Unicode-complete Latin fallback). Verified via the Track L Playwright screenshot.
- Verify the SideBySideText responsive stack: on mobile, the two-column grid should collapse to stacked passages with the Original / Colloquial pair kept adjacent (never interleaved line-by-line). If the current CSS grid interleaves, add a `@media (max-width: ...)` rule to switch to `grid-auto-flow: row` per definition-list item.
- Do NOT create MDX for the R&J Rap — authorship attribution is missing in the source doc's visible text (spec §3 doc 4 requirement). Client-review bundle carries the ticket; MDX ships when authorship is confirmed.
- Do NOT truncate the *One Uddah Midʻsummah* passage — the existing content is a sample stub; import the full text from Drive at implementation time per spec §3 doc 4 ("do not truncate passages to 'sample size' without client approval").

**Track F — Library-page blurbs (Alternative-passage sourcing)**
- `src/pages/shakespeare/scenes.astro`: blurb block above library grid, sourced from Alternative One passage (condensed to 2-3 sentences).
- `src/pages/shakespeare/themes.astro`: blurb from Alternative Two passage; below the grid, TMAI scene-selection-method callout ("Start from what actors have memorized; shave scenes internally; eliminate extraneous characters").
- `src/pages/shakespeare/cuttings.astro`: blurb from Alternative Three passage; TMAI credentials callout ("We have successfully performed 40-minute versions of: Romeo and Juliet; Lear; Midsummer Night's Dream (primarily focused on the Mechanicals)"); honest "more being prepared" note re: Chuck Wilcox's St. Mary's cuts.
- `src/pages/shakespeare/new-plays/index.astro` (new): blurb from Alternative Four passage.
- `src/pages/shakespeare/soliloquies.astro`: no Alternative-Four-equivalent passage exists — draft a 2-3 sentence blurb, wrap in an HTML comment `<!-- CLIENT REVIEW: soliloquies blurb drafted, awaits client approval -->` inline at the block, and add to the client-review bundle.

**Track G — New Plays placeholder MDX entries**
- `src/content/scripts/three-finger-dick.mdx` — library: `new-plays`, authors: `['Chuck Wilcox']`, sample: `true`. Body sections `## About this script` (Wild-West setting anecdote from doc 1b) / `## Production Notes` (placeholder text: "Full production notes pending — contact us via [Ask Shakespeare](/shakespeare/ask-shakespeare/#form) for the script.") / `## Script` (placeholder: "Full script pending. Chuck Wilcox's Wild-West-setting adaptation is one of the Alternative Four examples in the [section landing essay](/shakespeare/alternatives/#alternative-four)."). Cross-link tail to Honoring → Chuck Wilcox section.
- `src/content/scripts/shakespeares-sister.mdx` — library: `new-plays`, authors: `['Marta Barnard']`, sample: `true`. Body sections `## About this script` (the "written for two women, performed at the last minute as a one-woman show" anecdote — pure Fearless Creativity story) / `## Production Notes` (placeholder) / `## Script` (placeholder). Cross-link tail to Honoring → Marta Barnard section.

**Track H — Cross-section wiring**
- `src/pages/shakespeare/honoring-our-guides.astro`:
  - Chuck Wilcox section: link to `/legacy/founders/#chuck-wilcox`
  - Yang section: link to `/legacy/essays/theatre-influences/#asian-theatre`
  - Bottom of page: `(Link Legacy section)` placeholder → `/legacy/founders`
- `src/pages/shakespeare/alternatives.astro`:
  - Contact CTA card → `/shakespeare/ask-shakespeare/#form`
  - Alternative One / Will Power inline link → the same locally-hosted Will Power article asset used by Legacy/PRC (verify asset path at implementation; if not yet hosted per Cycle 9 T7 blocker, render as `(pending)` chip)
- `src/pages/shakespeare/childrens-shakespeare.astro`: add a cross-link block to `/childrens-theatre/`
- `src/pages/childrens-theatre/index.astro`: add reverse cross-link block to `/shakespeare/childrens-shakespeare/`
- `src/pages/shakespeare/index.astro`: doctrine block's TIP wires two Concept popovers (`vocal-expression`, `warmup`) — the popovers already read from the PRC collection; verify entries exist and short definitions render correctly

**Track I — Name spelling reconciliation**
- Unify Chuck / Charles Wilcox site-wide → all become "Chuck Wilcox" (matches vision spec §1.4, Legacy convention, and 14+ existing "Chuck" hits). Survey found 6 "Charles Wilcox" hits in `src/data/timeline.json` and 2 script MDX files. Verify each hit isn't quoting a formal program credit that should stay "Charles"; if any are, leave them and document the exception. Grep-and-replace pass with per-hit review.
- Barnard / Giguere: survey confirmed zero drift; both already consistent site-wide. No code change; documented as verified in §7 decision log.

**Track J — 500+ / 440+ conflict resolution**
- No code change required. Survey confirmed shipped state is `440+` in all four hits (`src/data/landing.ts` ×2, `src/pages/shakespeare/index.astro` × 2 including the "37 plays" phrasing), zero `500+` occurrences. Documented as resolved in §7 decision log. CLAUDE.md "Key conventions" gets one line ensuring future writers don't drift back to `500+`.

**Track K — Prohibited-text guardrail additions (spec §6)**
- Extend `PATTERNS` array in `scripts/check-prohibited-text.mjs` with seven new entries, each with a short comment naming its vision-spec-§6 origin:
  - `"(Desirae: use part of text for description of script sections ?)"` — title instruction
  - `"Shakspeare"` — title typo (missing 'e')
  - `"Act V, scene ii, the murder scene, lines 1–117"` — orphan footnote fragment
  - `/\bTMAI\b/` — provenance label (word-boundary regex; TMAI content merges to page bodies, provenance moves to frontmatter `sourceDoc`)
  - `"Berstein"` — mechanical typo fix
  - `"WIthin"` — mechanical typo fix
  - `/https?:\/\/drive\.google\.com\/[^\s]*\.mp4/` — raw Drive mp4 URL (belt-and-suspenders on top of the existing Cycle 10 generic `drive.google.com` pattern)
- Verify no false positives on shipped Shakespeare / Legacy / PRC / Community content before commit.

**Track L — Testing**
- Unit (Vitest) additions in `tests/unit/`:
  - `scripts-schema.test.ts` — extend to assert `new-plays` accepted by the library enum; assert both new-plays MDX entries have `sample: true` and `library: 'new-plays'`.
  - `colloquial-audio.test.ts` — new: for every entry in `src/content/colloquial/` where `data.audio` is set, assert `/public/audio/${data.audio}` exists on disk (Node `fs.existsSync`).
  - `shakespeare-nav.test.ts` — new: assert 10 items in vision-spec §2 order with correct hrefs.
  - `script-href.test.ts` — extend to cover `new-plays` routing.
  - `honoring-cross-links.test.ts` — new: parse `honoring-our-guides.astro` source and assert internal links exist to `/legacy/founders` and `/legacy/essays/theatre-influences/`.
- Smoke (Playwright) additions in `tests/e2e/smoke.spec.ts` with axe checkpoints:
  - Navigate `/shakespeare/new-plays/`; assert 2 sample cards render; axe passes.
  - Navigate `/shakespeare/`; assert doctrine block present ("What translation did you use?" text visible); assert `[popover]` attribute on rendered Concept refs (Vocal Expression + Warmup).
  - Navigate `/shakespeare/colloquial/one-uddah-midsummah/`; assert `<audio>` element renders with `src="/audio/midsummah-pidgin-paka.mp4"`; assert transcript-statement paragraph text present; screenshot the ʻokina glyph and eyeball render (or Playwright text-content assertion on the ʻokina character to verify Unicode round-trip).
  - Navigate `/shakespeare/honoring-our-guides/`; assert `<a href="/legacy/founders">` link exists.
  - Navigate `/shakespeare/alternatives/`; assert "Trade-offs to consider" callouts present on Themes + Cuttings sections; assert Contact CTA links to `/shakespeare/ask-shakespeare/#form`.
- A11y: extend axe-core checkpoints with New Plays landing + Colloquial detail page. Fail on critical/serious.
- `pnpm check:prohibited` runs the seven new patterns; verify green on the built site.

**Track M — Client-review bundle**
- New file `docs/client-reviews/2026-08-13-cycle11-shakespeare-review.md`.
- Bundle contents (single document, structured for Lola / Laurie consumption):
  1. **Chuck Wilcox stroke paragraph** — sensitivity re-read requested; the story is theirs to tell and this cycle preserves the Shakespeare-on-the-Green invention that followed. Not a fabricated claim, but the one paragraph most warranting confirmation.
  2. **Soliloquies library blurb** — drafted (no Alternative passage exists in source docs). Bundle presents the drafted text for approval or edit.
  3. **R&J Rap** — withheld from ship until authorship / permission confirmed. Bundle asks for author name + permission status; MDX drops in immediately when confirmed.
  4. **New Plays actual scripts** — placeholder cards ship for *Three Finger Dick* and *Shakespeare's Sister*; real scripts pending client Drive share. Bundle asks for the Drive folder / script files.
  5. **Chuck Wilcox St. Mary's cuts** — Cuttings library page carries the honest "more being prepared" note. Bundle asks for the Drive location as scripts land.
  6. **Colloquial page nav placement** — Cycle 11 places Colloquial 8th (after Children's Shakespeare, before New Plays). Vision spec §2 said "flag placement to client" — bundle confirms and asks for approval.
  7. **500+ / 440+ conflict** — resolved to 440+ (shipped state). Bundle documents the resolution and asks for confirmation.
  8. **Chuck / Charles Wilcox unification** — resolved to "Chuck Wilcox" site-wide (matches Legacy convention). Any hits that quoted formal program credits were left as "Charles" and are enumerated in the bundle for review.
  9. **TMAI merge dispositions** — the four TMAI assets and where each landed (trade-offs callouts on Themes/Cuttings; 40-minute credentials on Cuttings; scene-selection method on Themes; contact CTA on Alternatives). Bundle documents so client sees no parallel TMAI page shipped and each asset preserved.
  10. **Vocal Expression PRC entry status** — the doctrine block's TIP references `<Concept id="vocal-expression" />`. This entry may not yet exist in the PRC collection (Cycle 10 shipped 18 in-spec + 2 beyondSource + `icons` draft; Vocal Expression is not in that list). If missing, bundle asks whether to (a) author a placeholder Vocal Expression entry inside this cycle, or (b) render the TIP with a `(pending)` chip until a later PRC cycle adds it. Recommendation: option (a) — author a source-faithful placeholder if Drive has content; otherwise draft a short definition with `draft:true` and add to next PRC-review bundle.

### Out of scope (deferred — client-blocked or later cycle)

- **Six existing script libraries — content import** (Soliloquies, Scenes, Themes, Cuttings, Children's Shakespeare beyond current samples): vision spec §Scope-note is explicit that library content import is a separate pass. This cycle wires framing pages and the two New Plays anecdote placeholders; real scripts arrive over time.
- **R&J Rap** — authorship attribution missing in source; ships when client confirms.
- **New Plays actual scripts** — placeholders ship; real scripts pending.
- **Chuck's St. Mary's cuts** — arrive over time; Cuttings page ships honest note.
- **Will Power article local hosting** — Cycle 9 T7 blocker; if not yet resolved, Alternatives essay references it as `(pending)` chip (same pattern as PRC Casting entry).
- **Vocal Expression PRC entry** — either authored inside this cycle (see bundle #10) or deferred with `(pending)` chip on the TIP.

## 3. Architecture

### 3.1 Content model extension

`src/content.config.ts` — extend `scripts` library enum:

```ts
export const scriptsCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/scripts' }),
  schema: z.object({
    title: z.string(),
    library: z.enum([
      'soliloquies',
      'scenes',
      'themes',
      'cuttings',
      'childrens-shakespeare',
      'childrens-plays',
      'teaching-modules',
      'new-plays', // Cycle 11 addition
    ]),
    // ... rest unchanged
  }),
});
```

`src/lib/script-href.ts` — extend the routing table:

```ts
export function scriptHref(entry: CollectionEntry<'scripts'>): string {
  switch (entry.data.library) {
    case 'childrens-plays':
    case 'teaching-modules':
      return `/childrens-theatre/scripts/${entry.slug}/`;
    default:
      // soliloquies, scenes, themes, cuttings, childrens-shakespeare, new-plays
      return `/shakespeare/scripts/${entry.slug}/`;
  }
}
```

### 3.2 Sub-nav shape

`src/lib/shakespeare-nav.ts` — reordered array (10 items, spec §2 order):

```ts
export const SHAKESPEARE_NAV = [
  { label: 'Alternatives',          href: '/shakespeare/alternatives/' },
  { label: 'Honoring Our Guides',   href: '/shakespeare/honoring-our-guides/' },
  { label: 'Soliloquies',           href: '/shakespeare/soliloquies/' },
  { label: 'Scenes',                href: '/shakespeare/scenes/' },
  { label: 'Themes',                href: '/shakespeare/themes/' },
  { label: 'Cuttings',              href: '/shakespeare/cuttings/' },
  { label: "Children's Shakespeare", href: '/shakespeare/childrens-shakespeare/' },
  { label: 'Colloquial',            href: '/shakespeare/colloquial/' },
  { label: 'New Plays',             href: '/shakespeare/new-plays/' },
  { label: 'Ask Shakespeare',       href: '/shakespeare/ask-shakespeare/' },
] as const;
```

### 3.3 Component tree

New file:

```
src/components/shakespeare/
├─ AskShakespeareCard.astro   (existing)
├─ AskShakespeareForm.astro   (existing)
├─ AudioEmbed.astro           (NEW — native <audio> + <figcaption>)
├─ Colloquial.astro           (existing)
├─ Original.astro             (existing)
└─ SideBySideText.astro       (existing)
```

`AudioEmbed.astro` shape:

```astro
---
interface Props { src: string; caption?: string }
const { src, caption } = Astro.props;
---
<figure class="my-6">
  <audio controls preload="metadata" src={`/audio/${src}`}>
    Your browser does not support the audio element.
  </audio>
  {caption && <figcaption class="text-sm text-ivory-700 mt-2">{caption}</figcaption>}
</figure>
```

### 3.4 Alternatives page structure

```
/shakespeare/alternatives/  (ShakespeareLayout, subPage: 'alternatives')
├─ Hero: eyebrow "Section framing" · title "Creating Fearless Shakespeare Scripts"
├─ Intro promise paragraph
├─ Doctrine block ("Leave the Language as Shakespeare's Own")
│  ├─ 37-plays survival note
│  ├─ Proof point: "What translation did you use?"
│  └─ TIP callout: <Concept id="vocal-expression" /> + <Concept id="warmup" />
├─ Alternative One — Scenes
│  ├─ Body prose (Will Power story with locally-hosted article link)
│  ├─ String-of-beads examples (3 worked)
│  └─ "Browse Scenes →" deep-link
├─ Alternative Two — Themes
│  ├─ Body prose (8-theme list; no-narration practice)
│  ├─ "Trade-offs to consider" TMAI callout (narrator function)
│  ├─ Pull-quote: "Experiment. Shakespeare did."
│  └─ "Browse Themes →" deep-link
├─ Alternative Three — Cuttings
│  ├─ Body prose (method; Chuck's in-progress note)
│  ├─ "Trade-offs to consider" TMAI callout ("not truly Shakespeare")
│  └─ "Browse Cuttings →" deep-link
├─ Alternative Four — New plays with Shakespeare foundation
│  ├─ West Side Story mention (Bernstein spelling)
│  ├─ Three Finger Dick anecdote → cross-link to Honoring/Chuck
│  ├─ Shakespeare's Sister anecdote → cross-link to Honoring/Marta
│  └─ "Browse New Plays →" deep-link
└─ Contact CTA card → /shakespeare/ask-shakespeare/#form
```

### 3.5 Cross-section wiring points

| Change site | File | Change |
|---|---|---|
| Shakespeare landing | `src/pages/shakespeare/index.astro` | Add "What translation did you use?" proof point inside doctrine block; add TIP callout with 2 Concept popovers |
| Shakespeare alternatives | `src/pages/shakespeare/alternatives.astro` | Full body rewrite from Drive doc 1b; TMAI callouts on Themes+Cuttings sections; Contact CTA link |
| Shakespeare honoring | `src/pages/shakespeare/honoring-our-guides.astro` | Full body rewrite from Drive doc 3; `/legacy/founders` link; `/legacy/essays/theatre-influences/#asian-theatre` link on Yang section; `/legacy/founders/#chuck-wilcox` link on Chuck section |
| Shakespeare Children's | `src/pages/shakespeare/childrens-shakespeare.astro` | Add cross-link block to `/childrens-theatre/` |
| Children's Theatre landing | `src/pages/childrens-theatre/index.astro` | Add reverse cross-link block to `/shakespeare/childrens-shakespeare/` |
| Shakespeare Cuttings | `src/pages/shakespeare/cuttings.astro` | Add Alternative Three blurb; TMAI 40-minute credentials callout; Chuck's in-progress note |
| Shakespeare Themes | `src/pages/shakespeare/themes.astro` | Add Alternative Two blurb; TMAI scene-selection-method callout |
| Shakespeare Scenes | `src/pages/shakespeare/scenes.astro` | Add Alternative One blurb |
| Shakespeare Soliloquies | `src/pages/shakespeare/soliloquies.astro` | Add drafted blurb with `<!-- CLIENT REVIEW -->` marker |
| Shakespeare New Plays | `src/pages/shakespeare/new-plays/index.astro` | New file: Alternative Four blurb + `ScriptCard` grid |
| Shakespeare Colloquial detail | `src/pages/shakespeare/colloquial/[slug].astro` | Render `<AudioEmbed>` above `<SideBySideText>` when `entry.data.audio` set; transcript statement below audio |
| Colloquial content | `src/content/colloquial/one-uddah-midsummah.mdx` | Add `audio` + `audioCaption` frontmatter; import full text from Drive |
| Content model | `src/content.config.ts` | Extend `library` enum with `new-plays` |
| Content model | `src/lib/script-href.ts` | Extend routing table for `new-plays` |
| Sub-nav | `src/lib/shakespeare-nav.ts` | Reorder to 10 items in spec §2 order |
| Timeline | `src/data/timeline.json` | Charles → Chuck Wilcox where drift exists (per-hit review) |
| Scripts | `src/content/scripts/*.mdx` | Charles → Chuck Wilcox where drift exists (per-hit review) |
| Guardrail | `scripts/check-prohibited-text.mjs` | 7 new PATTERNS from vision spec §6 |
| Data | `src/data/landing.ts` | Verify 440+ answer anchor still resolves after Honoring rewrite (Yang h3 slug shouldn't change; re-verify) |

### 3.6 Callout styling reuse

Cycle 10 shipped `.callout-tip`, `.callout-why`, `.callout-box`, `.callout-practical` in `src/styles/callouts.css` (imported by `tokens.css`). This cycle reuses:
- `.callout-tip` for the doctrine block's Vocal Expression + Warmup TIP
- A new `.callout-tradeoffs` class for the TMAI "Trade-offs to consider" pattern — same visual family (border-left accent, tinted background), amber/rust border to signal the honesty tone. Added to `src/styles/callouts.css`.

## 4. Data model summary

`scripts` collection after Cycle 11:
- 13 existing entries unchanged
- 2 new entries: `three-finger-dick.mdx`, `shakespeares-sister.mdx` (both `library: new-plays`, `sample: true`)
- library enum expanded from 7 → 8 values

`colloquial` collection after Cycle 11:
- 1 existing entry (`one-uddah-midsummah.mdx`) — frontmatter gets `audio` + `audioCaption`; body imports full Drive doc text
- No schema change

`ask-shakespeare` collection: unchanged

`concepts` collection: unchanged unless bundle #10 unblocks Vocal Expression PRC entry (in which case one new file `vocal-expression.mdx`; see the Track M client-review bundle for the decision hook).

## 5. File touch list

**New files (~8)**
- `src/components/shakespeare/AudioEmbed.astro`
- `src/content/scripts/three-finger-dick.mdx`
- `src/content/scripts/shakespeares-sister.mdx`
- `src/pages/shakespeare/new-plays/index.astro`
- `docs/client-reviews/2026-08-13-cycle11-shakespeare-review.md`
- `public/audio/midsummah-pidgin-paka.mp4` (fetched from Drive)
- `tests/unit/colloquial-audio.test.ts`
- `tests/unit/shakespeare-nav.test.ts`
- `tests/unit/honoring-cross-links.test.ts`

**Modified files (~22)**
- `src/content.config.ts` — extend `library` enum with `new-plays`
- `src/lib/script-href.ts` — extend routing table
- `src/lib/shakespeare-nav.ts` — reorder to 10 items in spec §2 order
- `src/pages/shakespeare/index.astro` — proof point + TIP callout
- `src/pages/shakespeare/alternatives.astro` — full body rewrite from Drive doc 1b + TMAI callouts + Contact CTA
- `src/pages/shakespeare/honoring-our-guides.astro` — full body rewrite from Drive doc 3 + Legacy cross-links
- `src/pages/shakespeare/scenes.astro` — Alternative One blurb
- `src/pages/shakespeare/themes.astro` — Alternative Two blurb + TMAI scene-selection callout
- `src/pages/shakespeare/cuttings.astro` — Alternative Three blurb + TMAI 40-minute credentials + Chuck's note
- `src/pages/shakespeare/soliloquies.astro` — drafted blurb + CLIENT REVIEW marker
- `src/pages/shakespeare/childrens-shakespeare.astro` — cross-link block to Children's Theatre
- `src/pages/shakespeare/colloquial/[slug].astro` — `<AudioEmbed>` + transcript statement
- `src/pages/childrens-theatre/index.astro` — reverse cross-link block to Shakespeare/Children's
- `src/content/colloquial/one-uddah-midsummah.mdx` — frontmatter audio fields + full body import from Drive
- `src/styles/callouts.css` — add `.callout-tradeoffs`
- `src/data/timeline.json` — Charles → Chuck Wilcox per-hit
- `src/content/scripts/*.mdx` (2 files with Charles Wilcox) — Charles → Chuck per-hit
- `scripts/check-prohibited-text.mjs` — 7 new PATTERNS
- `tests/e2e/smoke.spec.ts` — 5 new checkpoints + 2 new axe scans
- `tests/unit/scripts-schema.test.ts` — extend for new-plays value
- `tests/unit/script-href.test.ts` — extend for new-plays routing
- `CLAUDE.md` — Cycle 11 conventions (new-plays library value, TMAI-provenance frontmatter guidance, R&J Rap ship-gate, Cuttings in-progress note, 440+ convention lock)

## 6. Testing strategy

**Unit (Vitest)** — new + extended files under `tests/unit/`:
- `scripts-schema.test.ts` — `new-plays` accepted by the library enum; both new-plays MDX entries have `sample: true` and `library: 'new-plays'`.
- `script-href.test.ts` — `library: 'new-plays'` routes to `/shakespeare/scripts/<slug>/`.
- `shakespeare-nav.test.ts` — assert 10 items in spec §2 order with correct hrefs; assert every href resolves to a real page (glob against `src/pages/shakespeare/**`).
- `colloquial-audio.test.ts` — for every entry in `src/content/colloquial/` where `data.audio` is set, assert `/public/audio/${data.audio}` exists on disk.
- `honoring-cross-links.test.ts` — parse `honoring-our-guides.astro` source (fs.readFileSync + string checks) and assert links exist to `/legacy/founders`, `/legacy/founders/#chuck-wilcox`, and `/legacy/essays/theatre-influences/#asian-theatre`.

**Smoke (Playwright)** — extend `tests/e2e/smoke.spec.ts`:
- `/shakespeare/new-plays/`: 2 sample cards render (Three Finger Dick, Shakespeare's Sister); axe passes.
- `/shakespeare/`: doctrine block heading present; "What translation did you use?" text visible; both Concept popovers render (assert `[popover]` attribute); axe passes.
- `/shakespeare/colloquial/one-uddah-midsummah/`: `<audio src="/audio/midsummah-pidgin-paka.mp4">` renders; transcript-statement paragraph present; screenshot the page to eyeball ʻokina glyph render; axe passes.
- `/shakespeare/honoring-our-guides/`: `<a href="/legacy/founders">` exists; `<a href="/legacy/essays/theatre-influences/#asian-theatre">` exists.
- `/shakespeare/alternatives/`: two "Trade-offs to consider" callouts render (Themes + Cuttings sections); Contact CTA links to `/shakespeare/ask-shakespeare/#form`.

**A11y** — extend axe-core checkpoints with `/shakespeare/new-plays/` landing + `/shakespeare/colloquial/one-uddah-midsummah/` detail page. Fail on critical/serious.

**Prohibited-text guardrail** — `pnpm build` includes `pnpm check:prohibited`; the 7 new patterns run against every `.astro` / `.mdx` / `.md` in `src/`. Verify no false positives on shipped Shakespeare / Legacy / PRC / Community content before commit.

## 7. Decision log

Cycle 11 decisions recorded here so future cycles + client review have a single reference:

- **Cycle scope** — Full Drive-doc content merge included (same shape as Cycles 9/10). Alternative would have been architecture-only, deferring content to a Cycle 12; rejected because vision spec ACs (AC1, AC3) explicitly require full essay + full guide content.
- **Sub-nav ordering** — Reordered to vision spec §2's client-numbered order (10 items). Alternative would have been to keep the shipped 9-item order; rejected because the client's folder numbering signals intent that ship-order didn't reflect.
- **New Plays approach** — Library-enum extension with placeholder MDX entries (parallels Children's Theatre plays). Alternatives were standalone essay page (contradicts spec §2 "give it a library slot") or fold-under-Cuttings (contradicts spec §2 explicit call for separate slot); both rejected.
- **500+ / 440+ conflict** — Resolved to `440+` (shipped state). No code change; documented for future writers.
- **Chuck / Charles Wilcox** — Unified to "Chuck" site-wide (matches vision spec §1.4 + 14+ existing "Chuck" hits + Legacy convention). Per-hit review preserves any formal program credits that legitimately quote "Charles Wilcox."
- **TMAI merge** — Four assets distributed to Alternatives (2 trade-offs callouts + Contact CTA) and Cuttings (40-min credentials) + Themes (scene-selection method). No parallel TMAI page ships; provenance moves to frontmatter `sourceDoc`. Merge dispositions enumerated in client-review bundle for client sign-off.
- **R&J Rap** — Withheld from ship pending authorship confirmation. MDX not created this cycle.
- **Vocal Expression PRC entry** — Client-review bundle asks whether to author a placeholder inside this cycle or defer with `(pending)` chip on the TIP. Recommendation: author placeholder if source content exists; otherwise defer.

## 8. Sequencing (rough — full plan lives in `docs/superpowers/plans/`)

1. Content model additions: `library` enum extension + `script-href.ts` routing + unit tests
2. Sub-nav reorder + `shakespeare-nav.test.ts`
3. New Plays route + 2 placeholder MDX entries
4. `AudioEmbed.astro` component + `one-uddah-midsummah.mdx` frontmatter + audio file fetch (via Google Drive MCP) + `colloquial/[slug].astro` render update + `colloquial-audio.test.ts`
5. Full Drive-doc content merge — Alternatives essay with TMAI trade-offs callouts and Contact CTA
6. Full Drive-doc content merge — Honoring Our Guides with Legacy cross-links + `honoring-cross-links.test.ts`
7. Landing page proof point + TIP callout with Concept popovers
8. Library-page blurbs — Scenes / Themes / Cuttings / New Plays / Soliloquies
9. Cuttings in-progress note re: Chuck's St. Mary's cuts
10. Cross-section wiring — Children's Shakespeare ↔ Children's Theatre reverse link
11. Chuck / Charles Wilcox unification — grep-and-replace pass with per-hit review
12. Prohibited-text guardrail additions + verify no false positives on shipped content
13. `.callout-tradeoffs` styling in `src/styles/callouts.css`
14. Client-review bundle document
15. Smoke test extension + a11y checkpoints
16. `CLAUDE.md` updates
17. Memory updates (`project_dtfc_cycles`, `project_dtfc_followups`) at end of cycle

Full task decomposition + verification steps land in `docs/superpowers/plans/2026-08-13-dtfc-cycle11-shakespeare-fidelity.md` via the writing-plans skill.

## 9. Acceptance criteria (mirrors vision spec §7)

1. Section landing (`/shakespeare/alternatives/`) renders the full doc-1b essay with the four-alternatives router; each Alternative deep-links to its library page.
2. "Leave the Language as Shakespeare's Own" appears as a styled doctrine block on both landing + alternatives pages, with the "What translation did you use?" proof point and both Concept popovers (`vocal-expression`, `warmup`) live.
3. All four vision convictions (§1) demonstrable: constraint-based routing works (four Alternatives → four libraries); doctrine block present with proof point; Colloquial page framed as tradition-continuation with side-by-side equals; every named guide from §1.4 present with their specific deed.
4. TMAI merge implemented per §3-doc-2 (four assets placed; no duplicate parallel essay page ships); merge dispositions recorded in client-review bundle.
5. Trade-offs candor present as "Trade-offs to consider" callouts on Themes + Cuttings sections of Alternatives page — not sanitized away.
6. Colloquial page: side-by-side component stanza-aligned, mobile stacking correct (Original/Colloquial pairs adjacent, never interleaved), ʻokina rendering verified in shipped fonts, audio player renders with locally hosted file (`/public/audio/midsummah-pidgin-paka.mp4`), Jackie Pualani Johnson credited, transcript statement present.
7. R&J Rap withheld until authorship/permission confirmed; ticket in client-review bundle either way.
8. Library pages exist for all six vision-spec-listed alternatives/collections with blurbs sourced per §4 (Scenes / Themes / Cuttings / New Plays / Soliloquies / Children's Shakespeare); Soliloquies blurb marked `<!-- CLIENT REVIEW -->` pending client approval.
9. 500+ / 440+ conflict: shipped state confirmed as `440+` site-wide; documented in decision log + CLAUDE.md conventions; grep in CI catches any drift.
10. Zero occurrences of §6 strings in built output (`pnpm check:prohibited` in CI).
11. Name-spelling reconciliation: Barnard + Giguere verified consistent (no code change); Chuck / Charles Wilcox unified to "Chuck" (with formal-credit exceptions enumerated in bundle).
12. Chuck's in-progress cuttings: Cuttings page ships with existing sample scripts + an honest "more being prepared" note — no fabricated inventory.

## 10. Risks + mitigations

- **Vocal Expression PRC entry may not exist** — the doctrine block TIP references `<Concept id="vocal-expression" />`. If the concept slug isn't in `src/content/concepts/`, Astro build will fail-loud (per Cycle 10 §3.6 the `<Concept>` component throws on unknown slug). Mitigation: verify at start of implementation; if absent, either author a placeholder inline (client bundle #10 approves) or defer with `(pending)` chip pattern (matches Cycle 10 PRC precedent for Audience / Constraints).
- **Drive audio file fetch** — `Midʻsummah-Pidgin-Paka.mp4` is in Drive folder `4-Shakespeare`; the ʻokina in the source filename doesn't cleanly transport through ASCII-only URLs. Mitigation: rename to `midsummah-pidgin-paka.mp4` at fetch time (source retains apostrophe; hosted filename is ASCII kebab-case per CLAUDE.md audio convention).
- **ʻokina font-rendering** — U+02BB may drop to a generic fallback in the shipped tokens.css font stack. Mitigation: Track L Playwright screenshot catches missing-glyph render; if seen, add a Unicode-complete Latin fallback to the display + body font stacks.
- **SideBySideText mobile interleave** — the shipped CSS grid may line-interleave on narrow viewports rather than stacking per-passage. Mitigation: Playwright viewport-narrow render check; add `@media` rule to force `grid-auto-flow: row` per definition-list item if broken.
- **TMAI merge dilutes voice** — merging TMAI assets into different pages risks losing the essay's overall voice. Mitigation: TMAI's characteristic voice is the trade-offs candor, which lands as two dedicated callouts on Alternatives (preserving voice at the merge points); other assets are informational (theme count, credentials, method) and don't carry voice load.
- **Chuck stroke paragraph tone** — the client's own story; risk of tonal mismatch. Mitigation: verbatim from Drive doc 3 where possible; client-review bundle flags as sensitivity re-read priority.
- **Prohibited-text pattern false positives** — `\bTMAI\b` could match legitimate references in future changelogs / commit messages, but the guardrail only scans `.astro` / `.mdx` / `.md` files in `src/` so PATTERNS additions are safe. Verify green on shipped content before commit.
- **`three-finger-dick.mdx` slug** — the phrase reads bawdy in isolation but is the actual title of Chuck Wilcox's play (Wild-West setting). Not a bug; slug matches source. If client bundle prefers a euphemism the slug can rename.
- **Nav order breakage** — reordering the sub-nav updates every subPage-prop consumer (each `/shakespeare/*` page passes `subPage: 'scenes' | 'themes' | ...`). Mitigation: this is a label-string prop, unaffected by array order; the active-state highlighting reads from `href` match not array index. Verify at implementation.
- **New route New Plays without existing detail template** — `/shakespeare/scripts/[slug]/` currently handles the six existing Shakespeare libraries; extending to `new-plays` is one enum row in `script-href.ts`. Mitigation: `scripts` collection is already unified; the detail template reads whatever the collection returns.

---

**Next step:** `superpowers:writing-plans` to produce `docs/superpowers/plans/2026-08-13-dtfc-cycle11-shakespeare-fidelity.md`.
