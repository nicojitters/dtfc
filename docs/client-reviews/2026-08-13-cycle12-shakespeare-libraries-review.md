# Shakespeare Libraries &mdash; Cycle 12 Review Bundle

**Date:** 2026-08-13
**Cycle:** 12 (Shakespeare Libraries &amp; Wrapper)
**Prepared for:** Lola, Laurie
**Predecessor bundle:** `2026-08-13-cycle11-shakespeare-review.md` &mdash; 13 items; #3 (R&amp;J Rap) and #10 (Vocal Expression PRC) carry forward.

Cycle 12 shipped the full library-inventory pass: content entries for Soliloquies, Scenes (including the DT:FC 2&ndash;3 Person Scene wrapper), Themes, Cuttings, Ask Shakespeare, Children&rsquo;s Shakespeare, and Colloquial, plus audience cue cards as a named DT:FC feature. Below are 13 primary review items followed by 8 implementation-reality items that surfaced during this cycle.

---

## Primary Review Items

### 1. Nenno testimonial permission

**What shipped:** The pull-quote &ldquo;My students are rocking it.&rdquo; from Linda Nenno&rsquo;s feedback letter is live on the Scenes landing page, marked `sample: true` (rendered with a subtle &ldquo;Pending permission&rdquo; chip so it is not presented to readers as a confirmed testimonial).

**Asking:** Can you confirm Linda gave permission for this phrase to be quoted publicly on the site? Once confirmed, we&rsquo;ll flip the sample flag off.

**Location:** `/shakespeare/scenes/`

---

### 2. Evaluation-ritual canonical phrasing

**What shipped:** The DT:FC 2&ndash;3 Person Scene wrapper ends with a &ldquo;Wrap up&rdquo; ritual. Two source documents use slightly different wording:

- **Nenno doc:** &ldquo;Two things I liked&hellip; One thing I wonder&hellip;&rdquo;
- **Pairs doc:** &ldquo;Two things I liked&hellip; One thing I wish&hellip;&rdquo;

All 8 Nenno units currently ship with `evaluationRitual: 'liked-wonder'`.

**Asking:** Which phrasing is canonical? Our recommendation is &ldquo;One thing I wonder&hellip;&rdquo; &mdash; it is more forward-looking and matches Nenno&rsquo;s more recent usage. But if &ldquo;One thing I wish&hellip;&rdquo; is the phrase your community recognizes, say the word and we&rsquo;ll update all 8 units.

---

### 3. Shakespeare&rsquo;s Sister anecdote wording

**What shipped:** The Alternatives essay now surfaces the following sentence about the tour of *Shakespeare&rsquo;s Sister*: &ldquo;When a Player fell out the day before opening, Marta performed both roles solo &mdash; the two-woman script became a last-minute one-woman show, and stayed that way for the tour.&rdquo;

**Asking:** Can Marta or Laurie confirm this phrasing is accurate? We drew it from the Drive doc anecdote; if any detail is off, share the corrected version and we&rsquo;ll update it immediately.

---

### 4. Column #5 (Censorship) publication timing

**What shipped:** The Ask Shakespeare column #5 (on censorship) ships with `draft: true` and a visible &ldquo;Draft &mdash; not yet published&rdquo; chip. The archive card is visible to anyone browsing `/shakespeare/ask-shakespeare/`; the detail page renders but carries the chip so readers know it is not yet formally published.

**Asking:** Should we (a) leave as-is until the newsletter publishes it first, (b) hide column #5 from the archive entirely until then, or (c) flip it to published on the site now?

---

### 5. Ask Shakespeare column graphic &mdash; rights confirmation

**What shipped:** The Shakespeare column graphic (`public/images/ask-shakespeare/shakespeare-column-graphic.jpg`, 271 KB) is now the visual identity on all Ask Shakespeare archive cards. It shipped during this cycle (T18).

**Asking:** Can you confirm the rights status for this image? If it is original artwork or a licensed asset you hold rights to, we&rsquo;ll note it as cleared. If it came from a third-party source, please let us know the origin so we can verify whether the site&rsquo;s non-commercial educational use is covered.

---

### 6. Battle of the Sexes script text

**What shipped:** The Themes library has a Battle of the Sexes entry with the provenance intro and scene list (drawn from the Colorado Caravan Title III grant source). The assembled script body is withheld pending your &ldquo;Needs Internal Edits&rdquo; resolution.

**Asking:** When the internal edits are complete, share the revised Drive doc and we&rsquo;ll publish the body. The page currently shows the intro and scene list only.

**Location:** `/shakespeare/themes/scripts/battle-of-the-sexes-theme/`

---

### 7. Chuck Wilcox&rsquo;s St. Mary&rsquo;s cuttings

**What shipped:** The Cuttings library page continues Cycle 11&rsquo;s honest note that Chuck is providing cuts from his St. Mary&rsquo;s Academy teaching, and that more are being prepared over time.

**Asking:** As individual cuttings become ready, share the Drive location and we&rsquo;ll add them. No rush &mdash; the honest note holds the space until they arrive.

---

### 8. R&amp;J Rap authorship &mdash; carried from Cycle 11 bundle #3

**Status:** Still unresolved. The R&amp;J Rap is withheld from the Colloquial page because the source doc does not attribute authorship in the visible text.

**Asking:** Who wrote the Rap? Once author and permission are confirmed, we&rsquo;ll publish it immediately (with audio if you have one).

---

### 9. Peterson / Petersen canonical spelling &mdash; carried from CLAUDE.md TODO

**What shipped:** Two places in the site use different spellings of the same name: `language-oral-tradition.mdx` uses &ldquo;Peterson&rdquo;; `src/data/founders.ts` uses &ldquo;Petersen.&rdquo;

**Asking:** Please pick the canonical spelling. Once confirmed, we&rsquo;ll run a site-wide find-and-replace to ensure consistency everywhere.

---

### 10. Spanish shelf scope

**What shipped:** The Children&rsquo;s Shakespeare page includes an &ldquo;Obras de Teatro Shakespeare para Ni&ntilde;os en Espa&ntilde;ol&rdquo; shelf with `lang="es"` tagging and an honest coming-soon paragraph. No Spanish scripts are published yet.

**Asking:** What is the intended scope for this shelf going forward?

- (a) Stay coming-soon indefinitely &mdash; value is in signaling the differentiator
- (b) Populate with a small set of publishable Spanish scripts when you share source docs
- (c) Full parity with the English Children&rsquo;s Shakespeare library over time

---

### 11. Folger link verification results

**What shipped:** The `pnpm check:folger` advisory script (T19) ran during Cycle 12 and verified all Folger links that landed in the Mechanicals cue-card script. Results: 3 URLs checked, 3 returned HTTP 200 &mdash; no 404s.

**Asking:** Please spot-check the Folger attribution links at `/shakespeare/childrens-shakespeare/scripts/mechanicals-scenes-a-midsummer-nights-dream/` to confirm they land where you expect. No action needed if they look right.

---

### 12. 15-minute vs. 20-minute R&amp;J

**What shipped:** The 20-minute R&amp;J is in the Cuttings library (with a &ldquo;final scenes in progress&rdquo; note). The 15-minute R&amp;J referenced in the Scenes section is not authored.

**Asking:** Do you want a 15-minute version as a separate entry, or is the 20-minute version the canonical R&amp;J cutting for the site?

---

### 13. Vocal Expression PRC entry &mdash; carried from Cycle 11 bundle #10

**Status:** `src/content/concepts/vocal-expression.mdx` continues to ship as `draft: true`. The Shakespeare landing&rsquo;s Concept popover for Vocal Expression draws from this draft.

**Asking:** Same three options as the Cycle 11 bundle:

- (a) Approve the placeholder as-is and we&rsquo;ll flip the draft flag off
- (b) Edit the short definition and body text directly
- (c) Provide source-doc content and we&rsquo;ll replace the placeholder

---

## Implementation Realities

These eight items surfaced during Cycle 12 implementation. Most are content or asset gaps we need your help to resolve; a few are editorial calls we want to flag before any future edits.

### K. Colloquial Pidgin audio &mdash; Drive 404

**What shipped:** The *One Uddah Mid&lsquo;summah* Colloquial page shipped in Cycle 11 with the audio player wired but no audio file hosted. Cycle 12 attempted to fetch `Mid&lsquo;summah-Pidgin-Paka.mp4` from Drive and received a 404 &mdash; the file is not accessible via the authenticated account.

**Asking:** Same options as Cycle 11 bundle #11:

- (a) Share the mp4 with cameronhoehn@gmail.com (the Google account tied to our tooling), or
- (b) Manually drop the file at `public/audio/midsummah-pidgin-paka.mp4` in the project folder.

Once the file is in place, one frontmatter line activates the audio player and transcript statement &mdash; no further code changes needed.

---

### L. Archival PDF hosting permission

**What shipped:** The Themes archival section (Fools and Fooling; Pretenders) shows placeholder tiles in place of the PDF documents.

**Why:** Our tooling has a 10 MB download cap on Drive files. The Fools and Fooling PDF is 16.7 MB; the Pretenders PDF is 21.1 MB &mdash; both exceed the cap. The placeholder tiles describe the documents but cannot link to them yet.

**Asking:** Two paths forward:

- (a) Grant hosting permission to place these PDFs under `public/legacy/` in the repo and link directly, or
- (b) Compress or split the PDFs to under 10 MB each so our tooling can fetch them.

Once the files are in place, we swap the placeholder `<div>` tiles to `<a href>` download links with a single edit.

---

### M. Richard III soliloquy (Now is the winter) &mdash; draft

**What shipped:** The soliloquy entry for *Now is the winter of our discontent* (Act I, Scene i) ships with `draft: true` (hidden from the public-facing library index). There is no individual Drive doc for this speech.

**Asking:** Please do one of the following:

- (a) Share the Drive doc (or the passage text directly) and we&rsquo;ll author the entry and flip the draft flag off, or
- (b) Approve importing the public-domain First Folio text for this well-known soliloquy.

---

### N. Henry VI Children&rsquo;s Shakespeare &mdash; draft

**What shipped:** `henry-vi-childrens-shakespeare.mdx` ships with `draft: true` and a placeholder body. The Children&rsquo;s shortened version of the Henry VI material was not accessible in Drive during implementation.

**Asking:** Please share the Drive location for the Children&rsquo;s shortened Henry VI text. When the file arrives, we&rsquo;ll replace the placeholder and flip the draft flag off.

---

### O. Barnard MSND cue-card numbering

**What shipped:** The thirty-minute Midsummer cue-card script (T11) imports cue-card numbers as they appear in the Drive source. The source document appears to carry a duplicate `[Cue Card 14]` &mdash; the sequence reads &hellip;13, 14, 14, 15, 16, 17 rather than &hellip;13, 14, 15, 16, 17.

**Asking:** Should we correct the numbering to a clean sequence (so Facilitators preparing physical cards get unambiguous numbers), or preserve the source verbatim? The card labels themselves are correct regardless.

---

### P. Magic and the Supernatural title inconsistency

**What shipped:** The Magic and the Supernatural theme entry carries the title &ldquo;The Magic and the Supernatural &mdash; Theme Cutting&rdquo; (matching the Drive source title), while the theme chip filter key on the Themes library page reads &ldquo;Magic and the Supernatural&rdquo; (no leading &ldquo;The&rdquo;). The filter works correctly; the difference is cosmetic.

**Asking:** Should we normalize the detail page title to drop &ldquo;The&rdquo; (matching the chip), or keep the Drive-source title as-is? We have no strong preference; this is a one-word edit if you want it changed.

---

### Q. Colloquial verbatim paragraph &mdash; grammatical note

**What shipped:** The Colloquial landing page reproduces a paragraph verbatim from the Drive source, including the phrase &ldquo;varied based being from different parts of England&rdquo; &mdash; the word &ldquo;on&rdquo; appears to be missing between &ldquo;based&rdquo; and &ldquo;being.&rdquo;

**Asking:** Should we correct this to &ldquo;varied based on being from different parts of England&rdquo; (standard English), or leave it as the source reads? If the phrasing is intentional (e.g., a stylistic choice in the original), we&rsquo;ll leave it verbatim.

**Location:** `/shakespeare/colloquial/`

---

**Sign-off:** Once you have worked through these items, reply per number (or letter for the implementation-reality items); anything not addressed we&rsquo;ll carry into the Cycle 13 bundle. Items 1, 3, 6, M, N, O, P, Q are content or editorial calls; items 2, 4, 10, 12 are scope decisions; items 5, 8, 9 are permission or vocabulary confirmations; items K, L are asset-sharing requests.
