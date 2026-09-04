# DT:FC Website — v1 → v2 Client Ask

**Date:** 2026-08-15
**Prepared for:** Lola, Laurie, Desirae, and anyone else on the client side
**What this is:** A plain-English list of everything I need from you to move the site from **v1 (its current state, live at the preview URL)** to **v2 (the version that goes to the real domain, gets real email, and reflects your final editorial calls).**

The site is fully built. Most of the "asks" below are decisions, files, permissions, or text — not code. Each item names what's on the site right now so you can visit and see it, and what will change once you hand back an answer.

---

## 1. Launch essentials (domain, email, brand chrome)

These are the "flip the switch" items. Nothing here needs writing — just information.

### 1.1 Real production domain
- **Now:** The site lives at the preview URL. Internal links that need an absolute web address (search engine metadata, social share cards, `robots.txt`) point at a placeholder host.
- **I need:** The real domain we're launching on (e.g. `developmentaltheater.com`, `dtfc.org`, whatever you've settled).
- **After:** I swap the placeholder in three places and re-deploy. Social previews and search-engine URLs immediately point at the real site.

### 1.2 Real support / contact email
- **Now:** Every "email us" link on the site (Donate page fallback, Newsletter fallback, contact page, Ask Shakespeare fallback, etc.) points at `hello@dtfc.example` — obviously a placeholder.
- **I need:** The real inbox you want general public messages routed to. It can be one address for everything, or several — if you'd like Ask Shakespeare submissions, membership interest, and donations to go to different people, tell me the mapping.
- **After:** Search-and-replace across the codebase; every "email us" link goes to your real inbox.

### 1.3 Form service — either Formspree or your own email service provider
- **Now:** All forms on the site (newsletter signup, testimonial submission, Ask Shakespeare, contact) are wired but not connected to a live inbox. Anyone who submits sees a friendly "form not yet configured" note with a `mailto:` fallback.
- **I need one of these two things:**
  - **Option A (fastest):** Sign up for a Formspree account (free tier is fine). Create three separate forms on their dashboard — Newsletter, Testimonials, Ask Shakespeare — and send me the three endpoint IDs (they look like `xxxxxxxx`, one per form). Configure destination emails inside Formspree.
  - **Option B (more polish):** Tell me which email service provider you want (Mailchimp, ConvertKit, Brevo, etc.) and I'll wire the newsletter form directly to it. The other two forms would still use Formspree or the mailto fallback.
- **After:** Forms actually submit. No more "not yet configured" notice.

### 1.4 Zeffy donation URL
- **Now:** The Donate page shows a "Coming soon" chip and a mailto: link telling people how to give in the meantime.
- **I need:** Either the Zeffy embed code, or a direct URL to the Zeffy donation form you want people to land on.
- **After:** I swap the placeholder for the real embed/link and remove the "coming soon" chip.

### 1.5 Site logo (final artwork)
- **Now:** The header uses `DTFC-logo.png` — a stand-in circular pink avatar next to the "DT:FC" wordmark.
- **I need:** Desirae's final logo file (SVG preferred; a PNG at 2× the display size works too). If the site should also carry a favicon (the tiny icon in the browser tab), send that as well — an SVG or a 32×32 PNG.
- **After:** I drop the file into `public/`, and the site's identity is Desirae's final mark instead of the placeholder.

### 1.6 Social-share preview image
- **Now:** When anyone posts a link to any page of the site (Facebook, Slack, iMessage, etc.), the preview card shows a generic placeholder background where the artwork should be.
- **I need:** A 1200×630 pixel image (Desirae territory) that represents DT:FC — think of it like the cover of a program. This is what people see when they share the site socially.
- **After:** Every page automatically gets a proper "Open Graph" preview.

---

## 2. Artwork awaiting Desirae

These are all art-side deliverables. Every one has a working placeholder that ships fine — this list is Desirae's checklist for when she's ready.

### 2.1 Concept icons
- **Now:** Every concept in the Players Resource Center (Warmup, Cohesion, Magic Toolbox, Constraints, etc.) shows a placeholder icon — an unfilled circle with the concept's initial. There are roughly 20 concepts.
- **I need:** SVG icons per concept as Desirae finishes them. They can arrive one at a time.
- **After:** Each new SVG lands in `public/icons/` under the concept slug, and it automatically renders everywhere the concept is referenced across the site.

### 2.2 Wayfarer's Journey Wheel
- **Now:** The Children's Theatre section uses a procedural, code-drawn wheel — geometrically correct but visually generic.
- **I need:** Desirae's polished version (SVG).
- **After:** Drop-in replacement — one file swap.

### 2.3 Stage diagrams
- **Now:** Six placeholder SVGs are inline in the Players Resource Center Stage entry. They're clear but not designed.
- **I need:** Desirae's refined versions.
- **After:** File swap.

### 2.4 Water-molecule illustration
- **Now:** The Cohesion PRC entry references a water-molecule image, but shows a note that the asset is pending.
- **I need:** Desirae's illustration.

### 2.5 Children's-play drawings
- **Now:** Only Ian's dragon (from *One Seed Child*) is in the site.
- **I need:** Any additional scans of children's artwork tied to the plays (Water of Life, Aesop's Fables, Theseus, etc.). Please also confirm you have permission from the parents to publish each drawing.
- **After:** Each drawing lands under `public/images/childrens-theatre/<play>/` and appears in the relevant play's page.

### 2.6 Founder headshots
- **Now:** Founders without photos show a colored circle with their initials.
- **I need:** Portraits (jpg or png) as they become available.

---

## 3. Missing text and content

Places on the site where a stand-in is holding space for real writing.

### 3.1 Timeline canonical version (Steve Smith)
- **Now:** The Legacy Timeline shows all the events I could import, marked with a "Pre-release" chip. Some entries fall into an "Undated / Approximate" bucket at the bottom because their dates are fuzzy in the source ("197?", season-only).
- **I need:** Steve Smith's canonical version of the timeline whenever he finishes it.
- **After:** I re-import and remove the chip.

### 3.2 Workshop Manual body text (Laurie O'Brien)
- **Now:** The Workshop Manual essay in Legacy ships as a placeholder card labeled "sample." It links from `/theatre-games/` as promised, but the body is blank.
- **I need:** Laurie's manual text (any format — Word, Google Doc, plaintext).
- **After:** Paste, flip the sample flag off, ship.

### 3.3 Membership tiers and pricing
- **Now:** The Community → Membership page is a pre-release interest form only — visitors can sign up to be notified.
- **I need:** Finalized tier structure: names, price points, benefits, and any application copy.
- **After:** I expand the page with the real content and remove the "pre-release" chip.

### 3.4 New Plays (Alternative Four scripts)
- **Now:** *Three Finger Dick* and *Shakespeare's Sister* ship as placeholder cards on the Shakespeare New Plays page, so the section exists and the nav works.
- **I need:** The real script docs from Drive when you're ready to share them.
- **After:** Import, replace placeholders.

### 3.5 Chuck Wilcox's St. Mary's cuttings
- **Now:** The Cuttings library page carries an honest note that Chuck is preparing cuts from his St. Mary's Academy teaching, and more are on the way.
- **I need:** Each cutting as it becomes ready — no rush, they can arrive one at a time.

### 3.6 Battle of the Sexes script text
- **Now:** The Themes library entry has the provenance intro and the scene list from the Colorado Caravan Title III grant source, but the assembled body is withheld pending your internal edits.
- **I need:** The revised Drive doc when internal editing is complete.

### 3.7 R&J Rap
- **Now:** Withheld pending authorship attribution.
- **I need:** Who wrote it, and confirmation we have permission to publish.
- **After:** Import as a Colloquial entry, with audio if any exists.

### 3.8 Aesop's Fables full-length photo assets
- **Now:** Text content shipped; historical Aesop production photos are pending.
- **I need:** Photo access, plus confirmation that identifiable-children permissions were secured.

### 3.9 Conquering the Sun YouTube video authorization
- **Now:** Referenced with a "Pending authorization" chip.
- **I need:** Confirmation the video can be embedded publicly, plus the YouTube URL.

### 3.10 Hoe Ana song and Hole Waimea chant republishing rights
- **Now:** *Conquering the Sun* references these; text ships, but rights are noted as pending.
- **I need:** Confirmation of republishing permissions (© 1962-63, 67 Michael Goldsen, Inc. for Hoe Ana specifically).

### 3.11 Will Power article PDF
- **Now:** Referenced in the Legacy Founders → CSF continuity section. Currently no hyperlink because we haven't been cleared to host the file locally.
- **I need:** Permission to host the PDF at `public/legacy/will-power-article.pdf`, or the article's public URL if it lives somewhere else.

### 3.12 CSF Facebook video URL
- **Now:** Same section references a Facebook video; text is in place, no link yet.
- **I need:** The video's public URL.

### 3.13 Poor Caravan essay footnote-marker positions
- **Now:** The archival essay has a note explaining that footnote markers `(1)` and `(2)` are missing from our source; the essay is otherwise intact.
- **I need:** If you can find the Drive-source typescript showing where the markers belong, share it and I'll restore them.

### 3.14 Developmental Drama essay's tmai.net citation
- **Now:** The essay carries a comment where the tmai.net link should be.
- **I need:** A working URL (or confirmation to cite without hyperlink, or to use an archive.org copy).

---

## 4. Rights and permissions to confirm

Where the site is publishing something and I need your explicit OK.

### 4.1 Linda Nenno testimonial
- **Now:** The pull-quote "My students are rocking it." from Linda's letter is live on the Scenes landing page with a "Pending permission" chip.
- **I need:** Confirmation Linda gave permission for that phrase to appear publicly. Once confirmed, the chip comes off.

### 4.2 Ask Shakespeare column graphic — rights status
- **Now:** The `shakespeare-column-graphic.jpg` file is the visual identity across the Ask Shakespeare archive.
- **I need:** Confirmation this is original artwork you hold rights to, or the source and license if it came from elsewhere.

### 4.3 Cherie's poem
- **Now:** Shipped, but flagged for Cherie's personal review before it's public.
- **I need:** Cherie's approval, or her edits.

### 4.4 Aesop full-length attribution
- **Now:** Text imported; attribution to the UH Hilo student cast is noted collectively.
- **I need:** JPJ to confirm the collective attribution reads correctly, and that the students consented (or that consent isn't required per the source's terms).

### 4.5 Judith Bock as founder
- **Now:** Card renders under "Critical Early Contributors" with an "unconfirmed" chip.
- **I need:** Confirmation to keep her, remove her, or reclassify.

### 4.6 Gates staging diagram (Campbell's Wheel Figure 1)
- **Now:** Referenced in staging notes but not reproduced as an asset — awaiting permission.
- **I need:** Permission (and source file) or confirmation to omit.

---

## 5. Editorial decisions you owe me

Small yes/no or A/B choices. Each is trivial once you decide.

### 5.1 Wilcox spelling — Peterson vs Petersen
- **Site currently uses:** Both are present in different places (source drift).
- **I need:** The canonical spelling. I'll do a site-wide find/replace to that one.

### 5.2 Evaluation-ritual phrasing — "wonder" vs "wish"
- **Site currently uses:** "Two things I liked… One thing I wonder…" (Nenno phrasing) on all 8 DT:FC Scene units.
- **I need:** Confirm "wonder" is canonical, or switch all 8 to "wish."

### 5.3 Chuck Wilcox stroke paragraph
- **Now:** A paragraph on the site references Chuck's stroke. Flagged for your sensitivity re-read.
- **I need:** Approve as-is, edit, or remove.

### 5.4 Ask Shakespeare Column #5 (Censorship) publication timing
- **Now:** Column #5 ships with a "Draft — not yet published" chip; the archive card is visible but the piece is clearly marked draft.
- **I need one of:** (a) leave as-is until the newsletter publishes it first, (b) hide it entirely until then, or (c) flip it to published now.

### 5.5 Colloquial nav placement
- **Now:** "Colloquial" appears 8th out of 10 in the Shakespeare sub-nav.
- **I need:** Confirm that placement, or tell me where you'd like it.

### 5.6 Barnard MSND cue-card numbering
- **Now:** The Drive source appears to carry a duplicate `[Cue Card 14]` — we preserved it as-is.
- **I need:** Renumber for uniqueness, or keep the source-verbatim duplicate.

### 5.7 Naming — "Children's Theatre" vs "Children's Plays"
- **Site currently uses:** "Children's Theatre" everywhere.
- **I need:** Confirmation, or tell me which term to standardize on.

### 5.8 Vocal Expression PRC entry
- **Now:** A draft placeholder is in place at `/resource-center/vocal-expression/` so the Shakespeare landing TIP works. Marked draft.
- **I need:** Your real entry text, or approval of the placeholder.

### 5.9 PRC Audience entry
- **Now:** Referenced from Warmup as "(pending)"; no source doc exists yet.
- **I need:** Should this entry exist? If yes, source text; if no, we'll remove the reference.

### 5.10 PRC Constraints extraction
- **Now:** The Fearless Creativity page's "Constraints" link lands on `/resource-center/plot/#constraints`.
- **I need:** Confirm that's the right home, or spin Constraints out as its own PRC entry.

### 5.11 PRC "players" and "resilience" entries
- **Now:** Both exist as "beyondSource" entries (not in the original PRC source doc but drafted for coverage).
- **I need:** Keep, remove, or fold into another entry.

### 5.12 Soliloquies library blurb
- **Now:** Drafted intro copy shipped.
- **I need:** Approve, edit, or replace.

### 5.13 15/20-min R&J duplicate
- **Now:** Two cuttings of similar length exist and could be consolidated or kept as distinct offerings.
- **I need:** Your call.

### 5.14 Spanish shelf on Children's Shakespeare
- **Now:** "Obras de Teatro Shakespeare para Niños en Español" section ships as an honest coming-soon block. No machine-translated content.
- **I need:** Real Spanish scripts when you have them (and translator credit).

### 5.15 Testimonials moderation policy
- **Now:** Testimonials are dev-committed — meaning they get reviewed by me and added by hand.
- **I need:** Confirm that's fine long-term, or tell me if you'd rather have a CMS backend so you can add/edit them yourself.

### 5.16 JPJ contributor page
- **Now:** JPJ's contributor page has not yet been created — awaiting your decision on whether it should exist.
- **I need:** Yes or no.

### 5.17 Gates In and Out placement
- **Now:** "Placement" chip visible on the page.
- **I need:** Confirm whether it belongs on the Children's shelf or an all-ages shelf.

### 5.18 Warmup how-to page
- **Now:** No dedicated Warmup how-to page ships; the concept has a PRC entry.
- **I need:** Should there be a companion how-to?

### 5.19 Marta anecdote in Shakespeare's Sister
- **Now:** The Alternatives essay reads: "When a Player fell out the day before opening, Marta performed both roles solo — the two-woman script became a last-minute one-woman show, and stayed that way for the tour."
- **I need:** Marta or Laurie to confirm the phrasing is accurate.

---

## 6. Prior client-review bundles (still awaiting responses)

These were sent earlier and are still open. Each is already documented in `docs/client-reviews/`:

- **Cycle 10 (PRC) — 11 items:** water-molecule error, 17 short-definition approvals, Casting consolidation sign-off, Plot overlap audit, Warmup how-to decision, Magic Toolbox repair, and asset requests to Desirae. `2026-08-12-cycle10-prc-review.md`
- **Cycle 11 (Shakespeare fidelity) — 13 items:** Chuck stroke paragraph, Soliloquies blurb, R&J Rap authorship, New Plays scripts, Chuck's St. Mary's cuts, Colloquial nav placement, 440+ years lock, Chuck/Charles unification, TMAI merge dispositions, Vocal Expression PRC replacement, Midsummah audio blocker, source-fidelity phrasings, West Side Story attribution. `2026-08-13-cycle11-shakespeare-review.md`
- **Cycle 12 (Shakespeare libraries) — 21 items:** Nenno permission, wish/wonder decision, Sister anecdote wording, Column #5 timing, column graphic rights, Battle of the Sexes text, Chuck's cuts, R&J Rap, Peterson/Petersen, Spanish shelf, Folger link results, 15/20-min R&J duplicate, Vocal Expression PRC, plus 8 implementation items around audio, PDFs, drafts, and cue-card numbering. `2026-08-13-cycle12-shakespeare-libraries-review.md`
- **Cycle 13 (Children's Theatre) — 14 items:** OCEAN reconciliation, Wayfarer wheel confirmation, Golden Goose content gap, Aesop photos + permissions, Conquering the Sun video authorization, Gates In and Out placement, JPJ contributor page, Shakespeare-for-Children bridge, Key Elements / Plot overlap, Rock Solid Recommendations location, Warm-Up Poems naming, Cherie's poem, UH Hilo student consent, Ian's dragon placement. `2026-08-14-cycle13-childrens-theatre-review.md`

Many items in Sections 3, 4, and 5 above are consolidations of the still-open questions from those bundles. If you'd rather answer them in-context inside each bundle doc, that works too — I'll cross-reference either way.

---

## 7. What "v2" looks like

Once the items in Section 1 come back, the site can move to the real domain and start collecting real form submissions and real donations. That's the operational cutover — the technical launch.

As the artwork (Section 2) and content (Sections 3-5) arrive, they get folded in as small content-only updates. No structural code changes needed for any of them.

The editorial decisions (Section 5) mostly become one-liner search-and-replace commits.

**Priority order I'd suggest, if you're wondering where to start:**

1. Section 1.1-1.4 (domain, email, forms, donations) — unblocks the actual launch.
2. Section 1.5-1.6 (logo, social image) — the site's first-impression polish.
3. Section 5 (editorial decisions) — quick calls that keep the code from drifting.
4. Sections 2, 3, 4 — flow in over time as Desirae, Steve, Laurie, and the writing side deliver.

Nothing here is time-critical from a technical standpoint — the site works today. This is about turning "working" into "yours."
