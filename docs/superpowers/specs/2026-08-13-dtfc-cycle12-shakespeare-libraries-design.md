# DT:FC Cycle 12 — Shakespeare Libraries & Wrapper Design

**Date:** 2026-08-13
**Branch:** `cycle-12-shakespeare-libraries`
**Predecessor:** Cycle 11 (Shakespeare vision fidelity) shipped 2026-08-13. Cycle 8 (post-launch chip-flips) remains a separate small cycle triggered by real client credentials.
**Source specs:**
- `/Users/cnote/Downloads/dtfc-shakespeare-vision-spec (1).md` — v2 of the Shakespeare fidelity spec (primary). v2 supersedes the v1 spec that Cycle 11 implemented, adding two convictions (§1.5 Nenno wrapper as flagship product; §1.6 audience cue cards as named DT:FC feature) and a full library-inventory pass (§5.1–5.7).
- `/Users/cnote/projects/dtfc/docs/client-reviews/2026-08-13-cycle11-shakespeare-review.md` — Cycle 11 bundle whose deferred items feed Cycle 12
- Google Drive folder `4-Shakespeare` — 7 script-library subfolders (Cycle 11 imported only the 4 top-level docs + 2 New Plays placeholders; Cycle 12 imports as much of the subfolders as source-doc availability permits)
- `/Users/cnote/projects/dtfc/docs/superpowers/specs/2026-08-13-dtfc-cycle11-shakespeare-fidelity-design.md` — the framing this cycle builds on

## 1. Goal

Bring the six under-populated Shakespeare script libraries — Scenes, Soliloquies, Themes, Cuttings, Children's Shakespeare, and Colloquial audio — from Cycle 11's framing-only state into working libraries with real launch inventory, AND ship the two v2-only-conviction lifts: (1) the **DT:FC 2-3 Person Scene wrapper** as a distinct visual component that renders the pedagogical "chrome" (chance casting, five-competency reflection, pronunciation guides, character one-liners, per-scene notes, evaluation ritual, ellipsis cut-marks) around Shakespeare's text on every wrapped unit — "the wrapper IS the product" per v2 §1.5 — with 8 authored Nenno units; and (2) **audience cue cards as a named DT:FC feature** on the Cuttings page with a dedicated explainer component (MOB NOISE / BOO! HISS! / OH NO! / TA-DAAA! / Wild Applause) that treats cue cards as Poor-Theatre participation doctrine, not incidental stage directions. Concurrently: extend the Soliloquies library to ~19 speeches with a play/character/register filter UI + register + gender chips on cards; ship Marta Barnard's 30-Minute MSND cutting (flagship) with Laurie O'Brien's Magic and the Supernatural theme cutting (byline) and Battle of the Sexes provenance intro (script text held); build the "Never memorize" method-box shared component and mount it on Soliloquies + Children's Shakespeare; author Short Speeches for children (with placeholder fragments stripped); re-file the Mechanicals script from `library: scenes` to `library: childrens-shakespeare` and add proper Folger citations; add the Spanish "Obras de Teatro Shakespeare para Niños en Español" shelf with `lang="es"` tagging (even at "coming soon" scope); host `/public/audio/midsummah-pidgin-paka.mp4` and wire the transcript-statement paragraph + mobile toggle on SideBySideText; present the two 1970s archival scans (fools-and-fooling; Pretenders 1977) with Legacy-Poor-Caravan-style framing and cross-link Pretenders → Legacy timeline; extend the prohibited-text guardrail with the 10 §7 items Cycle 11 missed; fix the small ship bugs the Cycle 11 audit surfaced (Ask Shakespeare form `id="form"` anchor; column #5 `draft` flag + visible chip; Giguere prose stutter; Joe Craft Folger phrasing; Alt Four trade-offs candor callout; Shakespeare's Sister "last-minute" wording surfaced in essay; landing-box Ask link two-hop resolved to direct); seed the Nenno testimonial into `TESTIMONIALS` and mount on Scenes landing.

Not in scope: Battle of the Sexes script body text (client edits still pending); Chuck Wilcox's St. Mary's Academy cuttings (arrive over time; Cuttings page continues honest "more being prepared" note); the R&J Rap (authorship still unattributed); Peterson/Petersen site-wide reconciliation (client decision pending); the Will Power article PDF (Cycle 9 T7 blocker unresolved); Vocal Expression PRC entry replacement (Cycle 11 shipped a `draft:true` placeholder awaiting client edit); 15-min vs 20-min R&J duplicate resolution (client decision pending — Cuttings ships only the 20-min with honest "final scenes in preparation" note); actual publishable Spanish scripts beyond the shelf shell.

## 2. Scope

### In scope

**Track A — Content model & schema extensions**

- Extend `scriptsSchema` in `src/lib/content-schemas.ts` with Nenno-unit fields (all optional so existing entries pass unchanged):
  - `nennoUnit: z.boolean().optional()` — flag to route into DtfcSceneUnit
  - `chanceCasting: z.string().optional()` — a paragraph or bulleted block; the "No male/female/physical shape/or other type casting" language, per-scene voiced
  - `pronunciations: z.record(z.string(), z.string()).optional()` — map, e.g. `{ 'Juliet': 'Ju-lee-et', 'Helena': 'Hell-an-Ah' }`
  - `characterOneLiners: z.record(z.string(), z.string()).optional()` — map from character name → one-line key
  - `competencyReflection: z.array(z.string()).min(1).max(5).optional()` — the five-competency reflection questions per scene (up to 5, sometimes fewer)
  - `evaluationRitual: z.enum(['liked-wonder', 'liked-wish']).optional()` — canonical Nenno-doc phrasing vs Pairs-doc variant (see Track P client-review bundle for the site-wide resolution; default rendered phrasing follows the resolved value, see §3.7)
  - `sceneNotes: z.string().optional()` — per-scene notes (e.g., R3 scene's split-into-two-halves suggestion)
  - `difficultyTag: z.enum(['beginner', 'intermediate', 'advanced']).optional()` — derived from Linda Nenno's scene-by-scene notes
- Extend `scriptsSchema` with Soliloquy-filter fields (all optional):
  - `register: z.enum(['comic', 'dramatic', 'villain', 'grief']).optional()`
  - `speakerGender: z.enum(['female', 'male', 'nonbinary', 'unspecified']).optional()` — "unspecified" is intentional for entries where the doc doesn't call it out; UI groups these as "Any"
  - `actScene: z.object({ act: z.string(), scene: z.string() }).optional()` — structured version of the free-text act/scene currently smuggled into `title`; existing entries keep working, new entries prefer this
- Add `draft: z.boolean().optional().default(false)` to `scriptsSchema` — used to gate stub authoring (Beatrice/Benedick, Mistresses Page/Ford, future incomplete scenes). Existing entries default to `false`. `LibraryIndex` and script-detail routes skip entries with `draft === true` in production; a `?draft=1` query param reveals them in dev.
- Extend `askShakespeareSchema` in the same file with `draft: z.boolean().optional().default(false)`. Column #5 gets `draft: true` and renders a visible "Draft — not yet published" chip on the archive card; detail route requires the `?draft=1` query in production, redirects to `/shakespeare/ask-shakespeare/` otherwise. See Track M for the small-fixes list.

**Track B — DtfcSceneUnit component + wrapped-scene route**

- New component `src/components/shakespeare/DtfcSceneUnit.astro`. Renders when `entry.data.nennoUnit === true`. Shape (Astro + tokens.css):
  - Outer `<article>` with dedicated wrapper "chrome" — a subtle border-left accent + tinted background using existing PRC callout tokens (`--color-tip-bg` / `--color-tip-border` from `src/styles/callouts.css`), plus a corner "DT:FC 2-3 Person Scene" eyebrow badge so the wrapper is visually distinct from Shakespeare text at a glance
  - Header: title + play + `<CharacterList>` chip strip
  - Section: **Chance casting** — renders `chanceCasting` prose verbatim; H3 "How to cast this scene"
  - Section: **Pronunciation guide** — `<dl>` from `pronunciations` map; H3 "Say it right"
  - Section: **Character keys** — `<dl>` from `characterOneLiners` map; H3 "Who's who"
  - Section: **The scene** — renders MDX body slot with an `.dtfc-scene-text` wrapper class; ellipsis cut-marks (`….` in source) styled via CSS to render as a subtle inline `⟨…⟩` glyph in the accent color (see §3.7 for the marker convention; source authors write literal `….` and CSS transforms via `::before` — no MDX preprocessing)
  - Section: **Per-scene notes** — renders `sceneNotes` verbatim; H3 "Facilitator notes"
  - Section: **Reflection questions** — numbered list from `competencyReflection`; H3 "Reflect together" (labeling matches DT:FC five-competency framing; wording per §3.7)
  - Section: **Evaluation ritual** — fixed prompt "Now let's share:" then the two-line ritual, rendered from `evaluationRitual` value ("Two things I liked… One thing I wonder…" or "Two things I liked… One thing I wish…"), H3 "Wrap up"
- New route `src/pages/shakespeare/scenes/dtfc/[slug].astro`:
  - `getStaticPaths()` filters `getCollection('scripts')` on `data.nennoUnit === true`
  - Renders `ShakespeareLayout` + `DtfcSceneUnit` + MDX body slot
  - Canonical URL: `/shakespeare/scenes/dtfc/<slug>/` (kebab-case slug)
- Update `src/lib/script-href.ts` to route `nennoUnit === true` entries to `/shakespeare/scenes/dtfc/<slug>/` instead of the shared `/shakespeare/scripts/<slug>/` template. Ordering: check `nennoUnit` first (returns the DT:FC route); fall through to library-based routing.
- Update `src/pages/shakespeare/scenes.astro`:
  - Add a distinct "**DT:FC 2-3 Person Scenes**" section above the raw-scenes grid, populated by filtering the collection on `nennoUnit === true`. Ships as a labeled cluster with the eyebrow "The wrapper is the product" per v2 §1.5 framing.
  - Add optional `difficultyTag` chip on `ScriptCard` when set.

**Track C — Audience Cue Cards named feature**

- New component `src/components/shakespeare/CueCardsExplainer.astro`. Static explainer:
  - Eyebrow: "A DT:FC signature"
  - H2: "Audience Cue Cards"
  - Intro paragraph: "In a DT:FC cutting, the audience is a co-performer. Cue cards flash to prompt reactions — the room becomes the crowd of Verona, the mob in Rome, the forest in Athens. Practice the cues aloud together before the show starts."
  - Card grid: 5 named cards, each with a short usage note pulled verbatim from Barnard's MSND intro:
    - `TA-DAAA!` — triumphant flourish
    - `WIND NOISE` — mood-setting; hush → whoosh
    - `HEE-HAW` — comic donkey; peak Bottom
    - `WILD APPLAUSE` — closing beat
    - `BOO! HISS!` — villains enter
    - (v2 §1.6 also names `MOB NOISE`, `OH NO!` — include as sixth + seventh cards; sourced from R&J cutting)
  - Closing paragraph: quotes Poor-Theatre framing from CLAUDE.md project voice — audience participation as inheritance from Grotowski/Caravan tradition
- Mount on `src/pages/shakespeare/cuttings.astro` — insert `<CueCardsExplainer />` between the TMAI 40-minute credentials callout and the library grid.
- Move the incidental cue-card sentence out of `mechanicals-scenes-a-midsummer-nights-dream.mdx:26` Production Notes (currently a one-off aside) and rewrite as: "See the audience cue-card explainer on the Cuttings page for the DT:FC pattern." Body edit only; frontmatter unchanged.

**Track D — Soliloquies filter UI + card fields**

- New component `src/components/scripts/SoliloquyFilters.astro`. Client-side (Preact island):
  - Three chip strips: **Play** (auto-generated from `data.play` values across all `library: 'soliloquies'` entries; alphabetized), **Character gender** (Female / Male / Any), **Register** (Comic / Dramatic / Villain / Grief / Any)
  - Filter is combinative (AND across strips, OR within a strip via toggle multi-select)
  - Filter state URL-persisted via `?play=…&gender=…&register=…` for shareable views
- Extend `src/components/scripts/ScriptCard.astro`:
  - When `data.register` set: render a register chip in accent color (comic=gold, dramatic=rust, villain=charcoal, grief=indigo — token names per `tokens.css`)
  - When `data.speakerGender` set: render a gender chip (subtle, secondary)
  - When `data.actScene` set: render "Act I, Scene ii" from structured field; fall back to parsing from title
- Update `src/pages/shakespeare/soliloquies.astro` to mount `<SoliloquyFilters client:idle />` above the `<LibraryIndex library="soliloquies">` grid. `LibraryIndex` renders unchanged; filter operates on rendered cards via CSS `[data-play][data-gender][data-register]` selectors set on each card.
- Extend `ScriptCard` to emit those `data-*` attributes when the fields are present.

**Track E — "Never memorize" method-box shared component**

- New component `src/components/shakespeare/NeverMemorizeBox.astro`. Static content-heavy explainer:
  - Eyebrow: "DT:FC Method"
  - H2: "Never Think or Say the Word 'Memorize'"
  - Intro: "Shakespeare wrote inside an oral tradition. His actors learned parts by ear, like learning a song."
  - Numbered list: (1) Read aloud, together, many times. (2) Choose favorite lines first. (3) Speak the rhythm before the words. (4) Try different voices and stances. (5) Perform for a friend before the mirror.
  - Pull quote (from v2 §1.2): "Read the plays aloud, even if by yourself. **Be fearless.** Experiment. Shakespeare did."
  - Attribution: sourced from the Children's "Short Speeches from the Plays and Sonnets" doc; extends the same doctrine to Soliloquies per v2 §1.2 + §4 table
- Mount on:
  - `src/pages/shakespeare/soliloquies.astro` — below the library grid, above the CLIENT REVIEW blurb
  - `src/pages/shakespeare/childrens-shakespeare.astro` — above the library grid, as the section-defining explainer

**Track F — Scenes library: raw pairs + Mechanicals cross-link**

- Author 5 raw-scene MDX files under `src/content/scripts/`, all `library: 'scenes'`, `sample: false`:
  - `fairy-robin-msnd.mdx` (MSND II.i.1–58)
  - `petruchio-kate-taming.mdx` (Taming II.i.174–283 with "possible cuts" styling — new CSS class `.possible-cut` renders yellow-highlighted spans via `<span class="possible-cut">…</span>` inline, styled subtle amber background; the MDX author writes those spans explicitly per Drive-source yellow-highlight markers)
  - `jaques-orlando-ayli.mdx` (As You Like It III.ii.256–332)
  - `celia-rosalind-ayli.mdx` (AYLI I.iii)
  - `quickly-falstaff-merry-wives.mdx` (Merry Wives II.ii; note: cross-references the Nenno unit; both ship — the raw scene is unwrapped, the Nenno version is wrapped)
- Add CSS class `.possible-cut` in `src/styles/callouts.css` (or a new `src/styles/scenes.css` imported by `tokens.css`). Sample rule:
  ```css
  .possible-cut {
    background: color-mix(in oklab, var(--color-tip-bg) 60%, transparent);
    border-bottom: 1px dashed var(--color-tip-border);
    padding: 0 0.15em;
  }
  ```
  Include a `<p class="scenes-possible-cut-legend">Highlighted spans mark optional cuts.</p>` legend at the top of `petruchio-kate-taming.mdx`.
- Do NOT ship stub Beatrice/Benedick or Mistresses Page/Ford — they are content-gap tickets per v2 §5.2. If a future author drops a file, `draft: true` (Track A) prevents empty-page shipping.
- Update `src/pages/shakespeare/alternatives.astro` string-of-beads bullet list — add explicit inline link to the Mechanicals master: "…the Mechanicals arc across acts I.ii → III.i → V.i (see the [Mechanicals scenes →](/shakespeare/scripts/mechanicals-scenes-a-midsummer-nights-dream/))." Currently the bullet names Mechanicals without a link.

**Track G — 8 Nenno wrapped scene units**

Author under `src/content/scripts/` with `library: 'scenes'`, `nennoUnit: true`, `sample: false`:

1. `nurse-juliet-rj-nenno.mdx` — R&J III.v (Nurse tries to persuade Juliet to accept Paris)
2. `hermia-helena-lysander-msnd-nenno.mdx` — MSND III.ii
3. `olivia-viola-twelfth-night-nenno.mdx` — Twelfth Night I.v
4. `richard-lady-anne-r3-nenno.mdx` — R3 I.ii (with `sceneNotes: 'This scene splits well into two halves — Richard's initial approach and the ring-giving reversal. Consider casting each half separately if you have time.'`)
5. `quickly-falstaff-page-ford-merry-wives-nenno.mdx` — Merry Wives II.ii (companion to the raw Quickly/Falstaff scene from Track F)
6. `angelo-isabella-lucio-measure-nenno.mdx` — Measure for Measure II.ii
7. `brutus-cassius-jc-nenno.mdx` — JC I.ii
8. `hamlet-horatio-nenno.mdx` — Hamlet I.ii (**explicitly do NOT paste Falstaff's description onto Horatio** — the source doc has a copy-paste bug per v2 §5.3. Correct description for Horatio: "Prince Hamlet's closest friend and confidant from Wittenberg. Scholar, loyal, level-headed. Serves as witness and moral anchor throughout.")

Each MDX populates the full Track A schema fields (`chanceCasting`, `pronunciations`, `characterOneLiners`, `competencyReflection` × up to 5, `evaluationRitual`, `sceneNotes` if applicable, `difficultyTag` from Nenno's scene-by-scene notes). MDX body is the scene text with `….` cut-marks preserved literally.

**Track H — Themes content authoring**

- `src/content/scripts/battle-of-the-sexes-theme.mdx` — `library: 'themes'`, `theme: 'Battle of the Sexes'`, `sample: false`. Body sections:
  - `## About this theme cutting` — provenance intro: Colorado Caravan origins; Title III grant scene list; later through-line rebuilt from three Shrew scenes (per v2 §5.4)
  - `## Scenes in this collection` — the assembled scene list (title + play + act/scene only, no body text)
  - `## Script` — placeholder: "Script text pending client review — see [Ask Shakespeare](/shakespeare/ask-shakespeare/#form) for a preview copy." Body text held per v2 §5.4 requirement ("script text ships only after the client's own 'Needs Internal Edits' flag is resolved"). Frontmatter `draft: false` because the page ships with provenance + scene list; only the script section is deferred, not the whole entry.
- Replace the placeholder `sample-theme-battle-of-the-sexes.mdx` with the real file (or rename + rewrite in place; delete the sample suffix). Update `themes.astro` chip filter — no change; the theme string matches canonical "Battle of the Sexes".
- `src/content/scripts/magic-and-the-supernatural-theme.mdx` — `library: 'themes'`, `theme: 'Magic and the Supernatural'`, `authors: ["Laurie O'Brien"]`, `sample: false`. Body: full script from Drive (Laurie's assembled theme cutting). Inline byline line near top: "*Assembled by [Laurie O'Brien](/legacy/founders/#laurie-obrien) — see her Workshop Manual (draft) in Legacy.*" — satisfies §6 cross-section contract row 8.
- Update `src/pages/shakespeare/themes.astro`:
  - Add prose paragraph acknowledging the Colorado Caravan / 1970s theme-based repertoire lineage, with inline link to `/legacy/timeline/` for the 1977 Pretenders artifact (foreshadows Track K)
  - Verify chip filter renders all 8 canonical themes; entries populate their theme chips automatically

**Track I — Cuttings content authoring**

- `src/content/scripts/thirty-minute-msnd-barnard.mdx` — `library: 'cuttings'`, `minutes: 30`, `authors: ['Marta Barnard']`, `sample: false`. Body sections:
  - `## About this cutting` — provenance: written by Marta Barnard for University Hill Elementary; 20 characters; no set/props; audience cue-card–driven (link to `/shakespeare/cuttings/#cue-cards` anchor into the Track C explainer)
  - `## Cast` — 20-character list
  - `## Script` — full text from Drive with cue-card cues inline (e.g., `[Cue Card: TA-DAAA!]`)
  - `## Facilitator Notes` — Barnard's introduction instructions on practicing cue cards with the audience before the show
- Update `src/content/scripts/sample-cutting-romeo-juliet.mdx`:
  - Fix `minutes: 40` → `minutes: 20` (per v2 §5.5, the incomplete R&J is the 20-min version)
  - Rename file `sample-cutting-romeo-juliet.mdx` → `twenty-minute-rj-in-progress.mdx`
  - `sample: false`; add body-level chip: "**Final scenes in preparation.** This cutting ships with acts I–III complete; the final beats are being cut for a future update."
  - Preserve `library: 'cuttings'`
- Add `<CueCardsExplainer />` (Track C) mount on `cuttings.astro` above the library grid.

**Track J — Children's Shakespeare content + re-file**

- Re-file `src/content/scripts/mechanicals-scenes-a-midsummer-nights-dream.mdx`:
  - Change `library: 'scenes'` → `library: 'childrens-shakespeare'`
  - Add Folger citation URLs inline in the body — one per scene marker (I.ii, III.i, V.i), each URL verified at build time (see Track O `folger-links.test.ts`)
  - Note: re-file breaks the "Scenes library flagship string-of-beads" narrative slightly — mitigate by explicit cross-link from `/shakespeare/scenes/` intro to the Mechanicals script (Track F already adds the reciprocal link from `alternatives.astro`; add here too)
- Author `src/content/scripts/short-speeches-childrens.mdx` — `library: 'childrens-shakespeare'`, `sample: false`. Body:
  - Intro paragraph inheriting the "never memorize" framing (bridges to Track E component below the entry)
  - Complete short-speech entries only — strip source-doc placeholder fragments per v2 §5.6 ("Act x, l y", "Helena 0r the other one", "Maybe from of one or more of the Fools'"). Include 6–10 fully authored short speeches, mostly Puck / Prince Hamlet's soliloquy fragments / Titania / Bottom.
  - AI-photo suggestion TIP retained per v2 §5.6 ("If you don't know what a flower named in a speech looks like, ask your AI for a photo — Shakespeare wrote for people who could picture cowslips and eglantine without being told; the picture is half the meaning."), rendered via `<div class="callout-tip">`
- Author `src/content/scripts/henry-vi-childrens-shakespeare.mdx` — `library: 'childrens-shakespeare'`, `sample: false`. Body: shorter version of the Henry VI soliloquy per v2 §5.1 cross-link contract. Include cross-link back to `/shakespeare/scripts/henry-vi-longer/` (see Track L: Henry VI full-length soliloquy is authored under Soliloquies too, closing the loop).
- Add Spanish shelf (v2 §5.6 + §1.3):
  - Update `src/pages/shakespeare/childrens-shakespeare.astro` — add a distinct "**Obras de Teatro Shakespeare para Niños en Español**" section above the English library grid with `lang="es"` on the section root
  - Section renders bilingual heading: `<h2 lang="es">Obras de Teatro Shakespeare para Niños en Español</h2>` with subtitle `<p class="subtitle">Shakespeare plays for young Spanish speakers</p>`
  - Body ships as honest coming-soon: "Estos guiones están en desarrollo. / These scripts are in development. Contact us via [Ask Shakespeare](/shakespeare/ask-shakespeare/#form) to be notified when they're ready."
  - No machine-translated filler per v2 §5.6 explicit rule
  - Real Spanish content deferred to a later cycle when client provides source docs

**Track K — Colloquial audio + landing paragraph + mobile toggle**

- Add `/public/audio/midsummah-pidgin-paka.mp4` (fetch from Drive via Google Drive MCP; ASCII kebab-case per CLAUDE.md audio convention).
- Update `src/content/colloquial/one-uddah-midsummah.mdx`:
  - Add frontmatter: `audio: 'midsummah-pidgin-paka.mp4'`, `audioCaption: 'Jackie Pualani Johnson performs the Paka (Puck) epilogue in Hawaiian Pidgin English (2002).'`
  - Add 2002 attribution somewhere in the body if not already surfaced
- Verify `src/pages/shakespeare/colloquial/[slug].astro` renders the transcript-statement paragraph when `audio` is set (Cycle 11 wired this conditionally; audio field being unset was silently suppressing it — now it renders).
- Update `src/pages/shakespeare/colloquial/index.astro`:
  - Landing paragraph: replace the current paraphrased blurb with the verbatim "Carrying on that tradition" paragraph from Drive doc 4. Per v2 §3 doc 4, this intro renders verbatim on the Colloquial page.
- Add mobile toggle to `src/components/shakespeare/SideBySideText.astro`:
  - Under `md` breakpoint, add a `<fieldset>` at the top: three radio buttons — Both / Original / Colloquial (default: Both). Toggling hides the non-selected side via CSS `[data-view=original] .colloquial { display: none }` selectors.
  - Above `md`, the toggle is hidden and both columns render as today.
  - No JS framework needed — vanilla `<script is:inline>` reads radio state and sets `data-view` attr on the outer `<dl>`.

**Track L — Soliloquies library expansion (23 speeches)**

Author under `src/content/scripts/` with `library: 'soliloquies'`, `sample: false`. Existing entries (Juliet, Lady Macbeth) stay; extend with the following. Import from the individual Drive docs, NOT the OCR-corrupted Combined doc (v2 §5.1). File-naming pattern: `<character>-<play-slug>-<act-scene>.mdx`.

1. `julia-two-gentlemen.mdx` (Two Gentlemen of Verona IV.iv) — female / dramatic
2. `mistress-page-merry-wives.mdx` (Merry Wives II.i) — female / comic
3. `titania-msnd.mdx` (MSND II.i) — female / dramatic; prefer standalone over Combined-doc corrupted "To danceJ" copy
4. `petruchio-taming.mdx` (Taming II.i or IV.i) — male / comic
5. `macbeth-macbeth.mdx` (Macbeth I.vii or V.v) — male / dramatic
6. `edgar-poor-tom-lear.mdx` (Lear III.iv) — male / grief
7. `edmund-lear.mdx` (Lear I.ii) — male / villain
8. `clarence-r3.mdx` (R3 I.iv) — male / grief
9. `richard-iii-1.mdx` (R3 I.i) — male / villain
10. `richard-iii-2.mdx` (R3 V.iii) — male / villain
11. `richard-gloucester-h6p3.mdx` (3H6 III.ii) — male / villain
12. `henry-vi-longer.mdx` (3H6 II.v — "O God! methinks it were a happy life…") — male / grief. Add `notes` field: "A shorter version of this soliloquy appears in Children's Shakespeare." Cross-link inline body: "See the [shorter version for young players →](/shakespeare/scripts/henry-vi-childrens-shakespeare/)."
13. `joan-la-pucelle-h6p1.mdx` (1H6 V.iii) — female / dramatic
14. `katherine-h8.mdx` (H8 III.i) — female / grief
15. `romeo-rj.mdx` (R&J II.ii or V.iii) — male / dramatic
16. `brutus-jc.mdx` (JC II.i) — male / dramatic
17. `marullus-jc.mdx` (JC I.i) — male / dramatic
18. `ophelia-hamlet.mdx` (Hamlet III.i or IV.v) — female / grief
19. `claudius-hamlet.mdx` (Hamlet III.iii) — male / villain
20. `ulysses-troilus.mdx` (Troilus I.iii) — male / dramatic
21. `thersites-troilus.mdx` (Troilus V.i or V.iv) — male / comic
22. `hostess-falstaff-death-h5.mdx` (H5 II.iii) — female / grief
23. `sonnet-116.mdx` — no play, `sourceDoc: 'Poetry Foundation → verified against 1609 Quarto'`. Body ships as plain poetry with the 1609 source-line credit. Explicitly strip any "Play Audio" label or Poetry Foundation page furniture per v2 §5.1 + AC #6.

Each entry sets `speakerGender` + `register` + structured `actScene` per Track A schema. Sonnet 116 leaves `actScene` unset.

**Track M — Small ship fixes surfaced by the Cycle 11 audit**

- `src/components/shakespeare/AskShakespeareForm.astro` — add `id="form"` to the `<form>` element (three inbound `#form` anchors currently don't resolve).
- `src/content/ask-shakespeare/ask-shakespeare-5-censorship.mdx` — add `draft: true` frontmatter; update `publishedIn` to `'unpublished'` (from vague `'2024–25 newsletter'` string).
- `src/pages/shakespeare/ask-shakespeare/index.astro` — render "Draft — not yet published" chip on the AskShakespeareCard when `data.draft === true`; keep the entry visible on the archive but disabled-styled.
- `src/pages/shakespeare/ask-shakespeare/[slug].astro` — for draft entries in production build, redirect to `/shakespeare/ask-shakespeare/`. Astro's `getStaticPaths` continues emitting the page; a client-side check + redirect on load handles the gate. `?draft=1` in the URL reveals it.
- `src/pages/shakespeare/honoring-our-guides.astro`:
  - Line 106: fix Amanda Giguere prose stutter — "In recent years Amanda Giguere has for many years been…" → "Amanda Giguere has for many years been…"
  - Line 118: fix Joe Craft phrasing — "third steward of the Shakespeare Library of the Folger Library" → "third steward of the Folger Shakespeare Library"
- `src/pages/shakespeare/alternatives.astro`:
  - Add `.callout-tradeoffs` block to Alternative Four (New Plays): "Trade-offs to consider — a Shakespeare-inspired new play is Shakespeare-adjacent, not truly Shakespeare. When purists ask, we answer: yes, it walks in his footsteps, and it invites Players who a whole play might exclude." Content sourced from v2 §1 closing "candor about trade-offs" pattern.
  - Alt Four Shakespeare's Sister anecdote — surface the "**last-minute**" wording in the essay body (currently only in the script MDX): "…when a Player fell out the day before opening, Marta performed both roles solo — the two-woman script became a **last-minute** one-woman show, and stayed that way for the tour."
- `src/data/landing.ts:235` — update the IDEA_TWO answer map "Do you have a question to Ask Shakespeare?" target from `/shakespeare/#ask-shakespeare` to `/shakespeare/ask-shakespeare/#form` (direct-to-form, no more two-hop through the hub anchor).
- Author + place the column JPG image asset per v2 §5.7. Save to `/public/images/ask-shakespeare/shakespeare-column-graphic.jpg` (ASCII kebab-case). Reference from `src/components/shakespeare/AskShakespeareCard.astro` as a subtle branded thumbnail. Add `CLIENT REVIEW` HTML comment above the `<img>` recording that image rights are pending client confirmation. If Drive source doesn't provide, ship the card without the image and defer the asset to a later cycle (add to Track P bundle).
- `src/data/testimonials.ts` — append the Nenno testimonial:
  ```ts
  {
    slug: 'linda-nenno',
    attribution: 'Linda Nenno',
    role: 'Texas State University',
    body: 'My students are rocking it.',
    sample: false,
  }
  ```
  Add `CLIENT REVIEW` comment noting the quote is drawn from her feedback letter and awaits explicit permission per v2 §5.3 ("with her permission"). Meanwhile the entry ships with `sample: true` if permission is not yet confirmed — see Track P bundle.
- `src/pages/shakespeare/scenes.astro` — add a testimonial slot above the DT:FC-scenes cluster that pulls the Nenno entry from `TESTIMONIALS` if present.

**Track N — Archival scans (fools-and-fooling, Pretenders 1977) + Legacy cross-link**

- Add `/public/legacy/shakespeare-archive/fools-and-fooling-1970s.pdf` and `/public/legacy/shakespeare-archive/pretenders-1977.pdf` (fetched from Drive; retain original scan quality; ASCII kebab-case filenames).
- Update `src/pages/shakespeare/themes.astro` — add an "**Archival theme scripts (1970s)**" section below the current-inventory grid:
  - Two card-like tiles, each linking to the PDF, with archival framing prose sourced from the Legacy Poor Caravan pattern (see `src/content/essays/towards-a-poor-caravan.mdx` for the tone template)
  - Include the explicit note per v2 §5.4: "These are scanned typescripts from the Developmental Theatre archive; OCR text is unreliable. Clean transcriptions are a future project."
  - Pretenders tile carries an inline cross-link: "See also [Legacy Timeline — Summer 1977 →](/legacy/timeline/#1977)"
- Update `src/pages/legacy/timeline.astro` (or wherever timeline entries render) — verify the 1977 timeline entry exists in `src/data/timeline.json` and carries a link back to the Pretenders archival scan on `/shakespeare/themes/#archival`. Cross-link the reverse direction.
- Add `archival: z.boolean().optional().default(false)` if not already on `scriptsSchema` — actually, archival scans are not scripts entries, they're static assets rendered by the themes page directly, so no schema change. Skip.

**Track O — Prohibited-text guardrail extensions**

Extend `PATTERNS` in `scripts/check-prohibited-text.mjs` with the 10 §7 items Cycle 11 missed. Each with a short comment naming its v2-§7 origin:

1. `/\(Missy - edit\)/` — title working note
2. `/\(Needs Internal Edits\)/` — title working note
3. `/\(Check EDIT\)/` — title working note (separate from PRC's `(ICON)` regex)
4. `/\(Lola to Do\)/` — title working note (Shakespeare-specific, separate from Legacy `Lola:` matches)
5. `/needs last scenes/i` — cutting incompleteness signal
6. `/^# Newsletter #/m` — Ask Shakespeare column header (matched only at H1 line start to avoid false positives on legit newsletter titles in the `newsletters` collection)
7. `/Act x, l y/` — Short Speeches placeholder fragment
8. `/Helena 0r the other one/i` — Short Speeches placeholder fragment
9. `/Maybe from of one or more of the Fools'/` — Short Speeches placeholder fragment (note apostrophe direction)
10. `/Speechs/` — typo (should be "Speeches")
11. `/Theseua/i` — typo (should be "Theseus")
12. `/Ardiane/i` — typo (should be "Ariadne")
13. `/Minoatuar/i` — typo (should be "Minotaur")
14. `/Prince Hal alter-father/` — Falstaff-description-on-Horatio copy-paste guard (see v2 §5.3; catches even if a future editor accidentally re-imports the corrupted source)
15. `/Large Person in every way/` — same copy-paste bug, second sentence

**Track P — Client review bundle**

- New file `docs/client-reviews/2026-08-13-cycle12-shakespeare-libraries-review.md`.
- Bundle contents:
  1. **Nenno testimonial permission** — quote "My students are rocking it." currently in `TESTIMONIALS` awaiting explicit permission. Bundle asks Lola/Laurie to confirm Linda Nenno gave permission for her feedback-letter phrase to be quoted publicly. Meanwhile ships `sample: true` on the entry.
  2. **Evaluation ritual canonical phrasing** — Pairs-doc says "One thing I wish…"; Nenno-doc says "One thing I wonder…". Bundle asks for site-wide resolution. Recommendation: "One thing I wonder…" (matches the more-recent Nenno usage + educational framing).
  3. **Shakespeare's Sister** — the "last-minute" wording surfaced in Alt Four essay is drawn from the script MDX. Bundle asks Marta / Laurie for confirmation of the anecdote's phrasing.
  4. **Column #5 (Censorship) unpublished status** — currently ships as visible draft with disclaimer chip. Bundle asks whether site-first publication is acceptable or whether the newsletter should publish first (per v2 §5.7 flag).
  5. **Ask Shakespeare column JPG image asset** — image rights pending confirmation. Bundle asks whether the archive can display the graphic.
  6. **Battle of the Sexes script text** — ships with provenance + scene list; script body held pending client edits. Bundle asks for the resolved script.
  7. **Chuck Wilcox's St. Mary's cuts** — Cuttings page continues honest "more being prepared" note. Bundle asks for Drive location as scripts land.
  8. **R&J Rap authorship** — still unattributed (Cycle 11 bundle item carried forward). Bundle re-asks.
  9. **Peterson / Petersen spelling** — site-wide inconsistency (existing CLAUDE.md TODO). Bundle asks for canonical.
  10. **Spanish shelf scope** — ships as coming-soon per v2 §5.6. Bundle asks the scope question: is this v1 (empty), coming-soon (with intended scripts named), or fully populated later?
  11. **Folger link verification** — build-time check verifies URLs resolve to correct act/scene per v2 §5.6. Bundle documents the check and asks Lola / Laurie to spot-check the Mechanicals links.
  12. **15/20-min R&J duplicate** — Cuttings ships the 20-min with "final scenes in preparation" note; the 15-min filed-in-Scenes version is not authored this cycle. Bundle asks the client to decide canonical version + folder before Cycle 13.
  13. **Vocal Expression PRC entry** — Cycle 11 shipped a `draft:true` placeholder. If bundle 11 comes back with real content, Cycle 12 can drop the draft flag; otherwise the placeholder ships as-is.

### Out of scope (deferred — client-blocked or later cycle)

- **Battle of the Sexes script body text** — ships with provenance intro + scene list only; script body held pending client edits (v2 §5.4 explicit)
- **Chuck Wilcox's St. Mary's Academy cuts** — arrive over time; Cuttings ships honest note
- **R&J Rap** — authorship attribution still missing; ships when confirmed
- **Peterson / Petersen** — client decision pending; existing CLAUDE.md TODO
- **Will Power article PDF hosting** — Cycle 9 T7 blocker unresolved; three files continue to render `(pending)` chip (`alternatives.astro`, `casting.mdx`, `founders.astro`)
- **Vocal Expression PRC entry replacement** — Cycle 11 shipped a `draft:true` placeholder; replacement waits for client edit
- **15-min vs 20-min R&J duplicate resolution** — client decision pending; Cuttings ships only the 20-min
- **Real Spanish scripts** — shelf shell ships with lang="es" + coming-soon; scripts arrive later
- **All the World's a Stage reconstruction** — architectural slot only per v2 §5.4; consolidation ticket documented in Track P bundle #14 (add if needed) — the reconstruction is a project file, not publishable content
- **Nenno letter-in-full publication** — the letter itself is correspondence per v2 §5.3 ("never published in full"); only the "My students are rocking it" testimonial ships
- **Alternative Two `Falstaff` theme deduplication** — theme string appears both in the 8-theme canonical list and as a separate Alternative-Four-adjacent character focus; Cycle 12 preserves the current mapping (Falstaff is a legitimate 8th theme, not a duplication)

## 3. Architecture

### 3.1 Schema shape after Cycle 12

`scriptsSchema` in `src/lib/content-schemas.ts` — additions (all optional, existing entries unaffected):

```ts
export const scriptsSchema = z.object({
  title: z.string(),
  library: z.enum([
    'soliloquies', 'scenes', 'themes', 'cuttings',
    'childrens-shakespeare', 'childrens-plays', 'teaching-modules', 'new-plays',
  ]),
  // ... existing fields unchanged ...
  draft: z.boolean().optional().default(false),
  nennoUnit: z.boolean().optional(),
  chanceCasting: z.string().optional(),
  pronunciations: z.record(z.string(), z.string()).optional(),
  characterOneLiners: z.record(z.string(), z.string()).optional(),
  competencyReflection: z.array(z.string()).min(1).max(5).optional(),
  evaluationRitual: z.enum(['liked-wonder', 'liked-wish']).optional(),
  sceneNotes: z.string().optional(),
  difficultyTag: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  register: z.enum(['comic', 'dramatic', 'villain', 'grief']).optional(),
  speakerGender: z.enum(['female', 'male', 'nonbinary', 'unspecified']).optional(),
  actScene: z.object({ act: z.string(), scene: z.string() }).optional(),
});
```

`askShakespeareSchema` gets `draft: z.boolean().optional().default(false)`.

### 3.2 Routing extension

`src/lib/script-href.ts`:

```ts
export function scriptHref(entry: CollectionEntry<'scripts'>): string {
  if (entry.data.nennoUnit) {
    return `/shakespeare/scenes/dtfc/${entry.slug}/`;
  }
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

Order: `nennoUnit` first, library second, default last. Existing routing unaffected for non-Nenno entries.

### 3.3 Component tree

New files under `src/components/shakespeare/`:

```
src/components/shakespeare/
├─ AskShakespeareCard.astro       (existing — draft chip added Track M)
├─ AskShakespeareForm.astro       (existing — id="form" added Track M)
├─ AudioEmbed.astro               (existing from Cycle 11)
├─ Colloquial.astro               (existing)
├─ CueCardsExplainer.astro        (NEW — Track C)
├─ DtfcSceneUnit.astro            (NEW — Track B)
├─ NeverMemorizeBox.astro         (NEW — Track E)
├─ Original.astro                 (existing)
└─ SideBySideText.astro           (existing — mobile toggle added Track K)
```

New files under `src/components/scripts/`:

```
src/components/scripts/
├─ LibraryIndex.astro             (existing)
├─ ScriptCard.astro               (existing — register/gender chips added Track D)
├─ ScriptDetail.astro             (existing)
└─ SoliloquyFilters.astro         (NEW — Track D; Preact island)
```

`SoliloquyFilters` is the only Preact island added this cycle. Uses `client:idle` hydration to keep initial payload small. State lives in URLSearchParams; the component mounts, reads current URL params, sets card visibility via `data-*` attribute selectors, and re-writes URL on chip toggle. Zero framework dependency for card rendering — cards remain static Astro.

### 3.4 DtfcSceneUnit visual identity

The wrapper is intentionally distinctive per v2 §1.5 "the wrapper IS the product":

```
┌─ [DT:FC 2-3 Person Scene]  eyebrow ─────────────────────┐
│                                                          │
│  Scene Title · Play · Act.scene                          │
│  [character chips]                                       │
│                                                          │
│  ── How to cast this scene ──────────────────────        │
│  Chance-casting prose                                    │
│                                                          │
│  ── Say it right ───────────────────────────────         │
│  Juliet → Ju-lee-et                                      │
│  Helena → Hell-an-Ah                                     │
│                                                          │
│  ── Who's who ──────────────────────────────────         │
│  Juliet: Young, quick, determined.                       │
│  Nurse: Older, warm, worried.                            │
│                                                          │
│  ── The scene ──────────────────────────────────         │
│  ┌──────────────────────────────────────┐               │
│  │  [Shakespeare text — MDX body slot,  │               │
│  │   subtly nested inside the wrapper]  │               │
│  │  cut-marks rendered as ⟨…⟩          │               │
│  └──────────────────────────────────────┘               │
│                                                          │
│  ── Facilitator notes ──────────────────────────         │
│  Optional per-scene notes                                │
│                                                          │
│  ── Reflect together ───────────────────────────         │
│  1. …                                                    │
│  2. …                                                    │
│                                                          │
│  ── Wrap up ────────────────────────────────────         │
│  Now let's share:                                        │
│  Two things I liked…                                     │
│  One thing I wonder…                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

The nested "The scene" box has its own subtle inner border — signals "this is Shakespeare's text, distinct from our wrapper." Wrapper uses `--color-tip-*` tokens (same family as PRC callouts) so it feels of-a-piece with the site.

### 3.5 Cut-mark styling

Source authors write literal `….` (four dots — U+2026 ellipsis + U+002E period, matching Drive-source convention). CSS in `src/styles/scenes.css`:

```css
.dtfc-scene-text {
  /* … */
}
.dtfc-scene-text::before,
.dtfc-scene-text * {
  /* preserve ellipsis rendering; no transform needed */
}
```

Actually — since the ellipsis is literal text in the MDX body, no CSS transform is needed. The `.dtfc-scene-text` wrapper class provides typographic isolation only. If the visual "⟨…⟩" glyph treatment is desired for authored cuts, a `<Cut />` MDX component would be a follow-up (out of scope this cycle — literal ellipsis is spec-compliant per v2 §5.3 "cut marks (…​.) preserved as ellipsis styling").

### 3.6 Filter UI mechanics (Track D)

Preact island; hydration `client:idle`:

```tsx
// src/components/scripts/SoliloquyFilters.tsx (approximate shape)
import { useState, useEffect } from 'preact/hooks';

interface Filters { plays: string[]; genders: string[]; registers: string[] }

export default function SoliloquyFilters({ plays }: { plays: string[] }) {
  const [f, setF] = useState<Filters>(() => readFromUrl());

  useEffect(() => {
    // Apply filters via CSS attribute selectors on cards
    document.querySelectorAll('[data-soliloquy-card]').forEach(card => {
      const p = card.getAttribute('data-play');
      const g = card.getAttribute('data-gender');
      const r = card.getAttribute('data-register');
      const show =
        (f.plays.length === 0 || f.plays.includes(p ?? '')) &&
        (f.genders.length === 0 || f.genders.includes(g ?? '')) &&
        (f.registers.length === 0 || f.registers.includes(r ?? ''));
      (card as HTMLElement).style.display = show ? '' : 'none';
    });
    writeToUrl(f);
  }, [f]);

  // Render 3 chip strips ...
}
```

`readFromUrl` / `writeToUrl` normalize URLSearchParams. `ScriptCard` emits `data-soliloquy-card data-play="…" data-gender="…" data-register="…"` when the entry is in the soliloquies library and the fields are set.

### 3.7 Evaluation-ritual phrasing default

Until Track P bundle #2 resolves the canonical, `DtfcSceneUnit` renders `evaluationRitual: 'liked-wonder'` by default (Nenno-doc phrasing) when the field is unset. Once client resolves, either (a) leave the default as `'liked-wonder'` and update the ~2 legacy Pairs entries, or (b) flip the default. The unresolved state doesn't block Cycle 12 ship because Nenno units are the flagship — Nenno phrasing IS the primary UX.

### 3.8 Cross-section wiring points

| Change site | File | Change |
|---|---|---|
| Shakespeare Scenes | `src/pages/shakespeare/scenes.astro` | Add DT:FC-scenes cluster above raw grid; add Nenno testimonial slot; add cross-link to re-filed Mechanicals |
| Shakespeare Alternatives | `src/pages/shakespeare/alternatives.astro` | Alt Four trade-offs callout; "last-minute" surfaced in Shakespeare's Sister anecdote; Mechanicals cross-link on string-of-beads bullet |
| Shakespeare Cuttings | `src/pages/shakespeare/cuttings.astro` | Mount `<CueCardsExplainer />` above library grid |
| Shakespeare Themes | `src/pages/shakespeare/themes.astro` | Add archival-scans section; cross-link to `/legacy/timeline/#1977` |
| Shakespeare Soliloquies | `src/pages/shakespeare/soliloquies.astro` | Mount `<SoliloquyFilters />` island above grid; mount `<NeverMemorizeBox />` below grid |
| Shakespeare Children's | `src/pages/shakespeare/childrens-shakespeare.astro` | Mount `<NeverMemorizeBox />` above grid; add Spanish shelf section with `lang="es"`; add cross-link to Mechanicals |
| Shakespeare Colloquial | `src/pages/shakespeare/colloquial/index.astro` | "Carrying on that tradition" paragraph verbatim; landing intro rewrite |
| Shakespeare Colloquial detail | `src/pages/shakespeare/colloquial/[slug].astro` | Ensure transcript-statement renders when `audio` set (Cycle 11 wired conditional; now the field is set) |
| Colloquial content | `src/content/colloquial/one-uddah-midsummah.mdx` | Add `audio` + `audioCaption` frontmatter; 2002 attribution in body |
| Colloquial component | `src/components/shakespeare/SideBySideText.astro` | Mobile toggle |
| Content model | `src/lib/content-schemas.ts` | Nenno + Soliloquy + draft field extensions |
| Content model | `src/lib/script-href.ts` | Nenno routing precedence |
| Legacy timeline | `src/data/timeline.json` | Add/update 1977 entry with reverse cross-link |
| Ask Shakespeare form | `src/components/shakespeare/AskShakespeareForm.astro` | `id="form"` on `<form>` |
| Ask Shakespeare card | `src/components/shakespeare/AskShakespeareCard.astro` | Draft chip when `data.draft`; optional JPG thumbnail |
| Ask Shakespeare detail | `src/pages/shakespeare/ask-shakespeare/[slug].astro` | Draft-gate redirect |
| Ask Shakespeare col 5 | `src/content/ask-shakespeare/ask-shakespeare-5-censorship.mdx` | `draft: true` |
| Landing | `src/data/landing.ts` | IDEA_TWO answer for "Do you have a question…" → `/shakespeare/ask-shakespeare/#form` (direct) |
| Honoring | `src/pages/shakespeare/honoring-our-guides.astro` | Prose fixes lines 106 + 118 |
| Testimonials | `src/data/testimonials.ts` | Append Nenno entry |
| Testimonials render | `src/pages/shakespeare/scenes.astro` | Add testimonial slot pulling Nenno entry |
| Guardrail | `scripts/check-prohibited-text.mjs` | 15 new PATTERNS |
| Styles | `src/styles/callouts.css` + new `src/styles/scenes.css` | `.callout-tradeoffs` variant (if Cycle 11 didn't add), `.possible-cut`, `.dtfc-scene-text` isolation |
| Archival assets | `public/legacy/shakespeare-archive/*.pdf` | 2 PDFs |
| Audio asset | `public/audio/midsummah-pidgin-paka.mp4` | Fetch from Drive |
| Image asset | `public/images/ask-shakespeare/shakespeare-column-graphic.jpg` | Fetch from Drive (rights-pending; ship without if unresolved) |
| CLAUDE.md | | Cycle 12 conventions (Nenno wrapper, cue cards, method box, filter UI, Spanish shelf pattern, evaluation-ritual default, draft-flag semantics) |

## 4. Data model summary

`scripts` collection after Cycle 12:
- Cycle 11 shipped 14 entries (13 pre-existing + `three-finger-dick`, `shakespeares-sister`)
- Cycle 12 adds: 8 Nenno units + 5 raw Pairs + 1 Barnard MSND cutting + 1 Battle theme + 1 Magic theme + 1 Short Speeches + 1 Henry VI Children's + 23 Soliloquies = **41 new entries**
- Cycle 12 modifies: `mechanicals-scenes-a-midsummer-nights-dream.mdx` (library re-file + Folger links); `sample-cutting-romeo-juliet.mdx` → `twenty-minute-rj-in-progress.mdx` (rename + rewrite); `sample-theme-battle-of-the-sexes.mdx` → replaced by `battle-of-the-sexes-theme.mdx` (rewrite)
- **Total after Cycle 12: ~52 entries in `scripts` collection.**

`colloquial` collection: 1 existing entry updated (frontmatter + body); still 1 entry total.

`ask-shakespeare` collection: 5 existing entries; column 5 gets `draft: true`.

`concepts` collection: unchanged unless Cycle 11 bundle #10 Vocal Expression PRC entry replacement lands as part of Cycle 12 concurrently.

## 5. File touch list

**New files (~50)**
- `src/components/shakespeare/DtfcSceneUnit.astro`
- `src/components/shakespeare/CueCardsExplainer.astro`
- `src/components/shakespeare/NeverMemorizeBox.astro`
- `src/components/scripts/SoliloquyFilters.tsx`
- `src/pages/shakespeare/scenes/dtfc/[slug].astro`
- `src/styles/scenes.css`
- `src/content/scripts/nurse-juliet-rj-nenno.mdx`
- `src/content/scripts/hermia-helena-lysander-msnd-nenno.mdx`
- `src/content/scripts/olivia-viola-twelfth-night-nenno.mdx`
- `src/content/scripts/richard-lady-anne-r3-nenno.mdx`
- `src/content/scripts/quickly-falstaff-page-ford-merry-wives-nenno.mdx`
- `src/content/scripts/angelo-isabella-lucio-measure-nenno.mdx`
- `src/content/scripts/brutus-cassius-jc-nenno.mdx`
- `src/content/scripts/hamlet-horatio-nenno.mdx`
- `src/content/scripts/fairy-robin-msnd.mdx`
- `src/content/scripts/petruchio-kate-taming.mdx`
- `src/content/scripts/jaques-orlando-ayli.mdx`
- `src/content/scripts/celia-rosalind-ayli.mdx`
- `src/content/scripts/quickly-falstaff-merry-wives.mdx`
- `src/content/scripts/battle-of-the-sexes-theme.mdx` (replaces sample)
- `src/content/scripts/magic-and-the-supernatural-theme.mdx`
- `src/content/scripts/thirty-minute-msnd-barnard.mdx`
- `src/content/scripts/twenty-minute-rj-in-progress.mdx` (rename from sample)
- `src/content/scripts/short-speeches-childrens.mdx`
- `src/content/scripts/henry-vi-childrens-shakespeare.mdx`
- `src/content/scripts/julia-two-gentlemen.mdx`
- `src/content/scripts/mistress-page-merry-wives.mdx`
- `src/content/scripts/titania-msnd.mdx`
- `src/content/scripts/petruchio-taming.mdx`
- `src/content/scripts/macbeth-macbeth.mdx`
- `src/content/scripts/edgar-poor-tom-lear.mdx`
- `src/content/scripts/edmund-lear.mdx`
- `src/content/scripts/clarence-r3.mdx`
- `src/content/scripts/richard-iii-1.mdx`
- `src/content/scripts/richard-iii-2.mdx`
- `src/content/scripts/richard-gloucester-h6p3.mdx`
- `src/content/scripts/henry-vi-longer.mdx`
- `src/content/scripts/joan-la-pucelle-h6p1.mdx`
- `src/content/scripts/katherine-h8.mdx`
- `src/content/scripts/romeo-rj.mdx`
- `src/content/scripts/brutus-jc.mdx`
- `src/content/scripts/marullus-jc.mdx`
- `src/content/scripts/ophelia-hamlet.mdx`
- `src/content/scripts/claudius-hamlet.mdx`
- `src/content/scripts/ulysses-troilus.mdx`
- `src/content/scripts/thersites-troilus.mdx`
- `src/content/scripts/hostess-falstaff-death-h5.mdx`
- `src/content/scripts/sonnet-116.mdx`
- `public/audio/midsummah-pidgin-paka.mp4` (fetched from Drive)
- `public/legacy/shakespeare-archive/fools-and-fooling-1970s.pdf` (fetched from Drive)
- `public/legacy/shakespeare-archive/pretenders-1977.pdf` (fetched from Drive)
- `public/images/ask-shakespeare/shakespeare-column-graphic.jpg` (fetched from Drive; conditional)
- `docs/client-reviews/2026-08-13-cycle12-shakespeare-libraries-review.md`
- `tests/unit/dtfc-scene-unit.test.ts`
- `tests/unit/nenno-units-coverage.test.ts`
- `tests/unit/soliloquy-schema.test.ts`
- `tests/unit/soliloquy-filter-fields.test.ts`
- `tests/unit/folger-links.test.ts`
- `tests/unit/spanish-shelf.test.ts`
- `tests/unit/ask-shakespeare-draft.test.ts`

**Modified files (~20)**
- `src/lib/content-schemas.ts` — Nenno + Soliloquy + draft extensions
- `src/lib/script-href.ts` — Nenno routing precedence
- `src/components/shakespeare/AskShakespeareForm.astro` — `id="form"`
- `src/components/shakespeare/AskShakespeareCard.astro` — draft chip + optional thumbnail
- `src/components/shakespeare/SideBySideText.astro` — mobile toggle
- `src/components/scripts/ScriptCard.astro` — register + gender chips + `data-*` attrs
- `src/pages/shakespeare/scenes.astro` — DT:FC-scenes cluster + testimonial slot
- `src/pages/shakespeare/scenes/dtfc/[slug].astro` — (new, listed above)
- `src/pages/shakespeare/alternatives.astro` — Alt Four trade-offs + Sister "last-minute" + Mechanicals link
- `src/pages/shakespeare/cuttings.astro` — `<CueCardsExplainer />` mount
- `src/pages/shakespeare/themes.astro` — archival section + Legacy timeline cross-link
- `src/pages/shakespeare/soliloquies.astro` — `<SoliloquyFilters />` + `<NeverMemorizeBox />`
- `src/pages/shakespeare/childrens-shakespeare.astro` — `<NeverMemorizeBox />` + Spanish shelf + Mechanicals cross-link
- `src/pages/shakespeare/colloquial/index.astro` — verbatim "Carrying on that tradition"
- `src/pages/shakespeare/colloquial/[slug].astro` — transcript-statement gating unchanged, now triggered by audio field
- `src/pages/shakespeare/honoring-our-guides.astro` — prose fixes L106 + L118
- `src/pages/shakespeare/ask-shakespeare/index.astro` — draft chip render
- `src/pages/shakespeare/ask-shakespeare/[slug].astro` — draft gate
- `src/content/ask-shakespeare/ask-shakespeare-5-censorship.mdx` — `draft: true`
- `src/content/scripts/mechanicals-scenes-a-midsummer-nights-dream.mdx` — library re-file + Folger URLs
- `src/content/colloquial/one-uddah-midsummah.mdx` — audio frontmatter + 2002 attribution
- `src/data/landing.ts` — IDEA_TWO answer direct-to-form
- `src/data/testimonials.ts` — append Nenno entry
- `src/data/timeline.json` — 1977 entry cross-link
- `src/styles/callouts.css` — ensure `.callout-tradeoffs` exists (Cycle 11 added; verify)
- `scripts/check-prohibited-text.mjs` — 15 new PATTERNS
- `tests/e2e/smoke.spec.ts` — new checkpoints (see §6)
- `CLAUDE.md` — Cycle 12 conventions

## 6. Testing strategy

**Unit (Vitest) — new + extended files under `tests/unit/`:**

- `dtfc-scene-unit.test.ts` — for every entry with `nennoUnit === true`: assert required Nenno fields present (`chanceCasting`, `characterOneLiners`, `competencyReflection`); assert `evaluationRitual` is one of the two enum values or unset; assert Hamlet/Horatio entry body does NOT contain the strings "Prince Hal alter-father" or "Large Person in every way" (defense-in-depth on top of the guardrail patterns).
- `nenno-units-coverage.test.ts` — assert exactly the 8 required Nenno slugs exist per v2 §5.3 (all 8 file paths listed as new files above).
- `soliloquy-schema.test.ts` — for every entry with `library === 'soliloquies'`: assert `speakerGender` and `register` set (except Sonnet 116 which may omit both); assert `actScene` set OR falls back to title parse; assert 23 new soliloquies exist plus the 2 pre-existing.
- `soliloquy-filter-fields.test.ts` — snapshot the unique values of `play`, `speakerGender`, `register` across all soliloquy entries to verify the filter UI has meaningful groupings (at least 5+ plays, both genders, all 4 registers).
- `folger-links.test.ts` — parse the Children's Shakespeare Mechanicals MDX; for every `https://folger.edu/...` URL, fetch (mocked in Vitest via `fetch` polyfill against a `.test-fixtures/folger.json` snapshot) and assert the target page's `<h1>` matches the claimed act/scene. Real-world verification runs in the smoke test (see below).
- `spanish-shelf.test.ts` — parse `src/pages/shakespeare/childrens-shakespeare.astro` source; assert `<h2 lang="es">Obras de Teatro Shakespeare para Niños en Español</h2>` present.
- `ask-shakespeare-draft.test.ts` — assert `ask-shakespeare-5-censorship.mdx` has `draft: true`; assert the `AskShakespeareCard` renders "Draft" chip when the fixture has `draft: true`.
- Extend `scripts-schema.test.ts` — assert all Track A new fields are optional (existing entries pass without them).
- Extend `shakespeare-nav.test.ts` — no change (10 items unchanged).
- Extend `script-href.test.ts` — assert Nenno routing precedence; entry with `nennoUnit: true` returns `/shakespeare/scenes/dtfc/<slug>/`; entry with `nennoUnit: true` AND `library: 'childrens-shakespeare'` still routes to Nenno (Nenno takes priority — document in test).

**Smoke (Playwright) — extend `tests/e2e/smoke.spec.ts`:**

- Navigate `/shakespeare/scenes/`: assert "DT:FC 2-3 Person Scenes" cluster renders with 8 cards; assert each card links to `/shakespeare/scenes/dtfc/<slug>/`; assert Nenno testimonial quote visible on landing; axe passes.
- Navigate `/shakespeare/scenes/dtfc/nurse-juliet-rj-nenno/`: assert wrapper eyebrow "DT:FC 2-3 Person Scene" visible; assert all 6 named sections render (Cast / Say it right / Who's who / The scene / Facilitator notes / Reflect together / Wrap up); assert Shakespeare text renders inside `.dtfc-scene-text` box; axe passes.
- Navigate `/shakespeare/scenes/dtfc/hamlet-horatio-nenno/`: assert body does NOT contain "Prince Hal alter-father" or "Large Person in every way" (belt-and-suspenders on top of Vitest + guardrail).
- Navigate `/shakespeare/cuttings/`: assert `<CueCardsExplainer />` renders with all 5+ named cards (TA-DAAA!, WIND NOISE, HEE-HAW, WILD APPLAUSE, BOO! HISS!, MOB NOISE, OH NO!); assert cue-card explainer sits above the library grid; axe passes.
- Navigate `/shakespeare/soliloquies/`: assert `<SoliloquyFilters>` island hydrates (visible chip strips); assert card count > 20; toggle a filter chip and assert card count decreases; assert `<NeverMemorizeBox />` renders below grid; axe passes.
- Navigate `/shakespeare/childrens-shakespeare/`: assert `<NeverMemorizeBox />` renders above grid; assert `<h2 lang="es">Obras de Teatro Shakespeare para Niños en Español</h2>` renders; assert Mechanicals card visible in the English library grid.
- Navigate `/shakespeare/themes/`: assert archival-scans section renders with both PDF links; assert Laurie O'Brien byline visible on Magic and the Supernatural card; assert Battle of the Sexes card visible with provenance-intro excerpt.
- Navigate `/shakespeare/colloquial/one-uddah-midsummah/`: assert `<audio>` element renders with `src="/audio/midsummah-pidgin-paka.mp4"`; assert transcript-statement paragraph present; assert ʻokina glyph renders correctly (screenshot + text-content assertion on U+02BB round-trip); resize viewport to mobile and assert SideBySideText mobile toggle appears; toggle to "Original only" and assert Colloquial column hidden; axe passes.
- Navigate `/shakespeare/colloquial/`: assert "Carrying on that tradition" paragraph renders verbatim.
- Navigate `/shakespeare/alternatives/`: assert Alt Four trade-offs callout present; assert "last-minute" phrase visible in Shakespeare's Sister anecdote; assert Mechanicals link in Alt One string-of-beads bullet resolves.
- Navigate `/shakespeare/ask-shakespeare/`: assert column 5 renders with "Draft" chip; navigate to `/shakespeare/ask-shakespeare/ask-shakespeare-5-censorship/` and assert redirect to `/shakespeare/ask-shakespeare/` (production build only; dev with `?draft=1` bypasses).
- Navigate landing `/`: click "Do you have a question to Ask Shakespeare?" tile and assert URL lands at `/shakespeare/ask-shakespeare/#form` and form is scrolled into view.

**A11y** — extend axe-core checkpoints with 5 new pages: `/shakespeare/scenes/dtfc/nurse-juliet-rj-nenno/`, `/shakespeare/scenes/` (with island hydrated), `/shakespeare/soliloquies/` (with island hydrated + filter toggled), `/shakespeare/themes/` (with archival section), `/shakespeare/childrens-shakespeare/` (with `lang="es"` section). Fail on critical/serious.

**Folger link verification (real network)** — new script `scripts/check-folger-links.mjs`, invoked by `pnpm check:folger`. Reads all `https://folger.edu/...` URLs across `src/content/scripts/*.mdx`, fetches each, asserts response 200 + `<h1>` text matches the claimed act/scene. Advisory-only (exit 0 with warnings if any fail — Folger occasionally reorganizes URLs). Not wired into `pnpm build`; run manually before merging.

**Prohibited-text guardrail** — `pnpm build` includes `pnpm check:prohibited`; the 15 new patterns run against every `.astro` / `.mdx` / `.md` in `src/`. Verify no false positives on shipped content before commit — particularly the `/Newsletter #/` H1 pattern must not trip legitimate newsletter titles in the `newsletters` collection.

## 7. Decision log

- **Cycle scope split** — Cycle 12 = "framework + first-wave content imports"; Cycle 13+ = "late-arriving Drive content waves (real Battle of Sexes script, St. Mary's cuts, R&J Rap, real Spanish content, Peterson/Petersen)". Rationale: v2 spec's library-inventory pass is large enough to eat two cycles cleanly; the split gives Cycle 12 a shippable coherent scope and lets Cycle 13 batch content as it arrives.
- **Nenno wrapper as separate route** (`/shakespeare/scenes/dtfc/[slug]`) — vs mounting inside the shared `/shakespeare/scripts/[slug]` route with a conditional. Chose separate route because v2 §1.5 calls the wrapper a "flagship product" that must be "visually distinct" — a dedicated URL space + template signals that distinction structurally. Also cleaner for the DT:FC-scenes cluster on `scenes.astro` landing.
- **Nenno-route precedence over library routing** — an entry with `nennoUnit: true` routes to `/shakespeare/scenes/dtfc/<slug>/` regardless of `library` value. Reasoning: `nennoUnit` is a stronger signal (opt-in per entry) than library membership. Also makes the flagship route stable even if authors misfile.
- **Evaluation-ritual default** — `'liked-wonder'` (Nenno phrasing) as the unset default. Nenno units are the flagship + majority; picking Nenno's phrase as the site default reduces per-entry frontmatter noise. Track P bundle #2 asks client to confirm; flip is a 1-line default swap if wrong.
- **Soliloquy filter as Preact island** vs full page reload with URL params — chose island for interactivity (immediate feedback) with URL-persistence for shareability. Single new client-JS dependency (Preact was already in the site for Game Finder).
- **`.possible-cut` styling in MDX bodies via explicit spans** vs a `<PossibleCut>` MDX component. Chose explicit spans because: (1) authors already write yellow-highlighted markers in Word/Drive that translate cleanly to spans on import; (2) no new MDX component to teach; (3) styling change is one CSS rule, no schema/schema/plumbing.
- **Spanish shelf structural now, content later** — v2 §1.3 conviction is that the shelf earns visibility even at thin scope; the differentiator for Colorado schools is meaningful even before scripts populate. Ship the shell with lang="es" tagging and honest coming-soon; defer real content to a later cycle when client provides source docs. No machine translation per v2 explicit rule.
- **Column #5 (Censorship) draft handling** — visible with disclaimer chip vs fully hidden. Chose visible because the archive-integrity value (readers see the shape of "there are 5 columns, one pending") outweighs the risk of accidentally-early publication (the chip + redirect defend against that). Track P bundle #4 asks client to confirm.
- **Mechanicals library re-file** — v2 §5.6 files it under Children's Shakespeare. Chose to re-file with cross-links both directions (from `scenes.astro` intro + `alternatives.astro` string-of-beads) rather than duplicate the MDX. Single source of truth.
- **Draft flag on scriptsSchema** — added as a general mechanism per Track A. Blocks empty/stub pages per v2 AC #8 without hardcoding stub slugs. Future authors can safely drop incomplete MDX with `draft: true` and iterate.
- **Folger link check as advisory + separate command** vs wired into `pnpm build`. Real-world 200-check via network is flaky in CI; wiring into build would create false-positive noise. Manual `pnpm check:folger` before merging is honest.
- **`.callout-tradeoffs` variant** — Cycle 11 added the class; Cycle 12 verifies and reuses (no new callout class). If Cycle 11 didn't add it, Cycle 12 adds it as a small styling addition.
- **Vocal Expression PRC entry** — Cycle 12 does NOT attempt to author replacement content. If Cycle 11 bundle #10 returns with real content, a separate small PR flips the `draft:true` flag off. Keeps Cycle 12 focused.

## 8. Sequencing (rough — full plan lives in `docs/superpowers/plans/`)

Order chosen to minimize thrash (schema before consumers; framework before content; content before test).

1. **Schema & routing** — `content-schemas.ts` extensions + `script-href.ts` precedence update + unit tests
2. **DtfcSceneUnit component + route** — `DtfcSceneUnit.astro` + `/scenes/dtfc/[slug].astro` + `scenes.css` + unit tests
3. **Guardrail extensions** — `check-prohibited-text.mjs` 15 new PATTERNS before content imports (per Cycle 11 audit lesson: guardrail-before-import prevents regressions)
4. **CueCardsExplainer component** + `cuttings.astro` mount
5. **NeverMemorizeBox component** + Soliloquies + Children's mounts
6. **SoliloquyFilters island** + `ScriptCard` register/gender chip additions + `data-*` attrs
7. **Small fixes bundle** — Ask form `id="form"`, column #5 draft, landing IDEA_TWO direct link, Honoring prose fixes, Alt Four trade-offs, Sister "last-minute" — all quick edits, group into one commit
8. **8 Nenno units** — author MDX (one commit per 2 units; hand-verify Hamlet/Horatio for copy-paste bug)
9. **5 raw Pairs scenes** + Mechanicals cross-link update in `alternatives.astro`
10. **Cuttings content** — Barnard MSND + R&J rename/rewrite
11. **Themes content** — Battle of the Sexes + Magic and the Supernatural
12. **Soliloquies content** — 23 new speeches (one commit per 4-5 speeches; hand-verify Sonnet 116 furniture strip)
13. **Children's Shakespeare content** — Mechanicals re-file + Short Speeches + Henry VI Children's + Spanish shelf
14. **Colloquial** — audio file fetch (Google Drive MCP) + frontmatter + landing paragraph verbatim + mobile toggle
15. **Archival scans** — PDF fetch + `themes.astro` archival section + `timeline.json` 1977 cross-link
16. **Nenno testimonial** + Scenes landing testimonial slot
17. **Column JPG asset** (conditional — ship if Drive-accessible, otherwise defer to bundle)
18. **Client-review bundle** document
19. **Smoke test extension** + a11y checkpoints
20. **`pnpm check:folger`** manual run + document result
21. **CLAUDE.md updates**
22. **Memory updates** (`project_dtfc_cycles`, `project_dtfc_followups`) at end of cycle

Full task decomposition + verification steps land in `docs/superpowers/plans/2026-08-13-dtfc-cycle12-shakespeare-libraries.md` via the writing-plans skill.

## 9. Acceptance criteria (mirrors v2 §8 with Cycle 12 scope-narrowed)

1. **DtfcSceneUnit is visually distinct** — the wrapper chrome is recognizable on every one of the 8 Nenno units; the Shakespeare text sits inside a nested inner box; the eyebrow "DT:FC 2-3 Person Scene" identifies the wrapper on every unit.
2. **All 8 Nenno units author-complete** — 8 MDX files present, each with `chanceCasting`, `pronunciations`, `characterOneLiners`, `competencyReflection` populated; Hamlet/Horatio has correct description (no Falstaff copy-paste).
3. **Audience cue cards presented as named DT:FC feature** — `<CueCardsExplainer />` renders on `/shakespeare/cuttings/` above the library grid with 5–7 named cards and Poor-Theatre framing; incidental cue-card language in individual scripts refers back to the explainer, not the other way around.
4. **Marta Barnard 30-Minute MSND ships as flagship cutting** — MDX authored, byline credited, cue-card cues inline in script text, University Hill Elementary provenance surfaced.
5. **20-min R&J shipped honestly** — renamed from sample, minutes: 20 corrected, "final scenes in preparation" chip present, no unlabeled duplicate.
6. **Soliloquies library ~25 entries** — 23 new + 2 existing = 25; Sonnet 116 free of Poetry Foundation furniture; Henry VI cross-links to Children's Shakespeare shorter version and back.
7. **Soliloquy filter UI works** — play/gender/register chip strips hydrate as Preact island; filter combinations reduce visible card count; state persists in URL.
8. **`<NeverMemorizeBox />` renders on Soliloquies + Children's Shakespeare** with the "Read aloud. Be fearless. Experiment. Shakespeare did." pull-quote.
9. **Themes: Magic and the Supernatural by Laurie O'Brien byline visible** + cross-link to `/legacy/founders/#laurie-obrien`; Battle of the Sexes ships with provenance intro + scene list (script text held); 8-theme chip filter unchanged and accurate.
10. **Children's Shakespeare: Mechanicals re-filed** to `library: 'childrens-shakespeare'` with verified Folger links inline; Short Speeches ships with source-doc placeholder fragments stripped; Henry VI Children's version present.
11. **Spanish shelf renders on Children's Shakespeare page** with `lang="es"` tagging, bilingual heading, honest coming-soon; no machine-translated filler.
12. **Colloquial `/public/audio/midsummah-pidgin-paka.mp4` hosted** + `<audio>` element renders on `/shakespeare/colloquial/one-uddah-midsummah/`; transcript-statement paragraph renders (Cycle 11 wired conditional, now triggered); "Carrying on that tradition" intro renders verbatim on Colloquial landing; mobile toggle appears under md breakpoint and switches SideBySideText view.
13. **Archival scans (fools-and-fooling; Pretenders 1977) hosted** + `/shakespeare/themes/` archival section renders with framing + Pretenders cross-links `/legacy/timeline/#1977` and vice versa.
14. **Small ship fixes applied** — Ask form has `id="form"`; column #5 has `draft: true` + visible chip + production redirect; landing IDEA_TWO answer resolves direct to `/shakespeare/ask-shakespeare/#form`; Giguere + Craft prose fixed; Alt Four trade-offs callout present; Shakespeare's Sister "last-minute" surfaced in essay.
15. **Nenno testimonial in `TESTIMONIALS`** + mounted on `/shakespeare/scenes/` landing (with `sample: true` chip until Track P bundle #1 confirms permission).
16. **15 new §7 patterns in `check-prohibited-text.mjs`** and `pnpm check:prohibited` passes on all shipped content.
17. **Folger link check advisory runs cleanly** — manual `pnpm check:folger` shows 200 responses + correct-act/scene matches for all Mechanicals Folger URLs (or documented deviations in the client-review bundle).
18. **Draft-flag mechanism blocks stub authoring** — an intentionally-authored draft MDX (test fixture) is skipped in the production build and hidden from the archive card grid.
19. **Zero occurrences of §7 strings in built output** (`pnpm check:prohibited` in CI passes on the built site).
20. **No regression on Cycle 11 acceptance criteria** — smoke tests for Cycle 11 all pass alongside new Cycle 12 tests.

## 10. Risks + mitigations

- **Drive-source content availability** — 8 Nenno units + 23 soliloquies + Barnard MSND + Magic theme + Battle of Sexes provenance depend on Drive-doc accessibility. Mitigation: use Google Drive MCP to fetch at implementation time; if any source doc is inaccessible, ship its entry with `draft: true` + add to Track P bundle for client to re-share. Don't hallucinate scene text — verify against Drive source.
- **Nenno wrapper visual identity might feel over-designed** — the wrapper is intentionally distinctive, but "distinctive" can slide into "gimmicky." Mitigation: use PRC callout tokens for tinting/borders so it feels of-a-piece with the rest of the site; test with real Nenno-unit content early to sanity-check the visual weight; iterate before shipping all 8.
- **Soliloquy filter island bloat** — Preact adds ~10KB gzipped; adding a filter UI shouldn't double that. Mitigation: keep the island lean (single file, no dependencies beyond Preact hooks); use `client:idle` hydration; verify Lighthouse score doesn't drop on `/shakespeare/soliloquies/` vs pre-Cycle-12 baseline.
- **Folger link real-world verification is flaky** — Folger.edu occasionally reorganizes URLs; the check might fail on transient issues. Mitigation: advisory-only, not wired into `pnpm build`; manual run before merging; document any failures in bundle.
- **Spanish shelf structural-only ship might disappoint** — v2 §1.3 conviction is strong. Mitigation: the honest coming-soon frame is per v2 explicit rule ("Do not machine-translate to fill it"); pair with a note on Track P bundle #10 asking for real scope so a follow-up cycle can populate.
- **15/20-min R&J unresolved duplicate** — could confuse readers if both eventually publish. Mitigation: Cycle 12 ships only the 20-min with honest "final scenes in preparation"; Track P bundle #12 asks client to resolve before Cycle 13; if 15-min filed in Scenes ever ships, it will do so with explicit labeling per v2 §5.2 rule.
- **Ellipsis cut-mark styling — `….` vs `…`** — Drive source uses `….` (ellipsis+period, 4 dots visually); risk of authors typing plain `…` and losing the distinction. Mitigation: document in CLAUDE.md; add a prohibited-text pattern flagging `…` (single ellipsis) inside `.mdx` files in the `scripts` collection where `nennoUnit: true`, as a "did you mean `….`?" nudge (optional — evaluate at implementation).
- **Nenno testimonial permission gate** — quote ships with `sample: true` chip until confirmed. Risk: chip is subtle and could be misread. Mitigation: chip is clearly labeled "Pending permission — from Linda Nenno's field-test feedback"; if permission comes back "no", entry is removed cleanly (no cascading breakage).
- **Guardrail false positives on shipped content** — 15 new patterns is a lot; risk of a legitimate string tripping the check (particularly `/Newsletter #/` matching a real newsletter title). Mitigation: dry-run `pnpm check:prohibited` locally on the built site BEFORE committing the guardrail changes; adjust patterns (word boundaries, H1-only matching, case-insensitivity) as needed.
- **Cycle 12 scope size** — ~50 new files, ~20 modified, ~2 new components + 1 island + 1 route. Larger than Cycles 6/7 but comparable to Cycles 9/10/11. Mitigation: sequenced with schema-before-consumers ordering; content imports parallelize cleanly across 5 batches (Nenno / Pairs / Cuttings / Themes / Soliloquies / Children's / Colloquial / Archival); frequent commits per §8.
