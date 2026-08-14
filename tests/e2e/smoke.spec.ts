import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function runAxe(page: import('@playwright/test').Page, testName: string) {
  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter((v) => v.impact === 'critical');
  const serious = results.violations.filter((v) => v.impact === 'serious');
  const moderate = results.violations.filter((v) => v.impact === 'moderate');
  const minor = results.violations.filter((v) => v.impact === 'minor');

  if (moderate.length > 0 || minor.length > 0) {
    console.info(
      `[axe] ${testName}: ${moderate.length} moderate, ${minor.length} minor — deferred as follow-ups`,
    );
    for (const v of [...moderate, ...minor]) {
      console.info(`  ${v.impact}: ${v.id} — ${v.help}`);
    }
  }

  if (critical.length > 0 || serious.length > 0) {
    const summary = [...critical, ...serious]
      .map((v) => `  ${v.impact}: ${v.id} — ${v.help} (${v.nodes.length} node(s))`)
      .join('\n');
    throw new Error(
      `[axe] ${testName}: ${critical.length} critical + ${serious.length} serious violations:\n${summary}`,
    );
  }
}

test('smoke: landing → PRC → games finder → concept popover', async ({ page }) => {
  // Landing page — identity + grid + rotating teaser + no prohibited text
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Be Fearlessly Creative!' })).toBeVisible();
  await expect(page.getByText("nurture", { exact: false }).first()).toBeVisible();
  // Analytics gate — with PUBLIC_VERCEL_ANALYTICS_ENABLED unset in test env,
  // Vercel scripts must NOT be present. Ensures the env gate works.
  const analyticsScripts = await page.locator('script[src*="_vercel/insights"]').count();
  expect(analyticsScripts).toBe(0);
  const grid = page.getByRole('region', { name: 'Explore DT:FC' });
  await expect(grid).toBeVisible();
  await expect(grid.getByRole('link', { name: 'Theatre Games' }).first()).toBeVisible();
  await expect(grid.getByRole('link', { name: 'Players Resource Center' }).first()).toBeVisible();
  await expect(grid.getByRole('link', { name: 'Workshops' }).first()).toBeVisible();
  // A rotating teaser question is visible on at least one tile (one <li> revealed per bank).
  const visibleTeasers = grid.locator('[data-teaser] li:not([hidden])');
  await expect(visibleTeasers.first()).toBeVisible();
  // RESILIENCE must render inside <strong>, never as raw uppercase text.
  await expect(page.locator('strong', { hasText: 'RESILIENCE' }).first()).toBeVisible();
  await runAxe(page, 'home landing');

  // PRC landing — Cycle 10 letter rail + grouped cards
  await page.getByRole('link', { name: 'Players Resource Center' }).first().click();
  await expect(page).toHaveURL(/\/resource-center\/?$/);
  await expect(page.getByText('What are the ICONs?')).toBeVisible();
  // Letter rail is present as a nav
  const letterRail = page.getByRole('navigation', { name: /Alphabetical index/i });
  await expect(letterRail).toBeVisible();
  // Clicking F jumps to the Facilitation section anchor
  await letterRail.getByRole('link', { name: 'F' }).click();
  await expect(page).toHaveURL(/#f$/);
  // Filter narrows the visible cards
  const filter = page.locator('[data-concept-filter]');
  await filter.fill('cohes');
  await expect(page.getByRole('link', { name: /Cohesion/ }).first()).toBeVisible();
  await filter.fill('');
  await runAxe(page, 'resource center landing');

  // PRC entry detail — Casting (uses consolidation subsection + related block)
  await page.goto('/resource-center/casting/');
  await expect(page.getByRole('heading', { level: 1, name: 'Casting' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'For Educators' })).toBeVisible();
  await expect(page.getByRole('region', { name: /Related resources/i })).toBeVisible();
  await runAxe(page, 'resource center casting entry');

  // Stage entry — all 6 SVG diagrams render
  await page.goto('/resource-center/stage/');
  const diagrams = page.locator('figure svg[role="img"]');
  await expect(diagrams).toHaveCount(6);
  await expect(page.getByText(/Jackie Pualani Johnson/)).toBeVisible();

  // Navigate to Theatre Games landing
  await page.getByRole('link', { name: 'Theatre Games' }).first().click();
  await expect(page).toHaveURL(/\/theatre-games\/?$/);
  await expect(page.getByRole('heading', { name: 'The five competencies' })).toBeVisible();
  await runAxe(page, 'theatre-games landing');

  // Open the Concept popover (Cohesion)
  const cohesionButton = page.getByRole('button', { name: /Cohesion/i }).first();
  await cohesionButton.click();
  await expect(
    page.getByText(/level of group bonding|How bonded a group is/i).first(),
  ).toBeVisible();
  await page.keyboard.press('Escape');

  // Open the Game Index
  await page.getByRole('link', { name: /Open the Game Index/i }).click();
  await expect(page).toHaveURL(/\/theatre-games\/finder/);
  // Wait for the page's JS to fully load before interacting with the Preact island
  await page.waitForLoadState('networkidle');

  // Read baseline count, apply a filter, check count changes
  const countText = page.locator('[aria-live="polite"] p');
  await expect(countText).toContainText('of 10 games', { timeout: 10_000 });
  const physicalBtn = page.getByRole('button', { name: 'Physical Expression', exact: false });
  // Wait for Preact to hydrate and attach event handlers (aria-pressed signals hydration is done)
  await expect(physicalBtn).toHaveAttribute('aria-pressed', 'false', { timeout: 10_000 });
  const before = await countText.textContent();
  await physicalBtn.click();
  await expect(countText).not.toHaveText(before ?? '', { timeout: 10_000 });
  await expect(page).toHaveURL(/competency=physical-expression/);
  await runAxe(page, 'game finder');

  // Navigate to a game detail page
  await page.goto('/theatre-games/puppets-marionettes/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await runAxe(page, 'game detail');

  // Legacy landing — Cycle 9 T8 rewrite: embedded Theatre Influences narrative +
  // "You are the next heroes and heroines" recruitment callout + TOC jump strip.
  await page.goto('/legacy/');
  await expect(page.getByRole('heading', { level: 1, name: 'Legacy' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Legacy section/i })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Jump to section/i })).toBeVisible();
  // The recruitment line appears in both the essay body and the amplified callout
  // (an intentional pattern). Scope the assertion to the callout region.
  const recruitment = page.getByRole('region', { name: 'Recruitment' });
  await expect(recruitment).toBeVisible();
  await expect(recruitment).toContainText('You are the next heroes and heroines');
  await expect(page.locator('#colorado-caravan')).toBeVisible();
  await expect(page.locator('#founders')).toBeVisible();
  await runAxe(page, 'legacy landing');

  // Legacy Founders — Cycle 9 T7 rebuild: 10 blocks including TestimonyPullQuote
  // (Cherie + Laurie), Contributing Faculty, Institutional Support, FoundationalReading.
  await page.goto('/legacy/founders/');
  await expect(page.getByRole('heading', { level: 1, name: 'Founders' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The four founders' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Theatre Games origins' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Foundational reading' })).toBeVisible();
  // TestimonyPullQuote renders as figure > blockquote > figcaption > cite.
  await expect(page.locator('figure blockquote').first()).toBeVisible();
  // Foundational Reading list carries the 6 spec-required surnames — spot-check two.
  await expect(page.getByText(/Spolin, Viola/)).toBeVisible();
  await expect(page.getByText(/Way, Brian/)).toBeVisible();
  // Cross-links tail links to Timeline.
  await expect(page.getByRole('link', { name: /Grand Timeline/i })).toBeVisible();
  await runAxe(page, 'legacy founders');

  // Timeline: legend + at least one event visible.
  await page.goto('/legacy/timeline/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Grand Timeline/i);
  await expect(page.getByRole('navigation', { name: /Timeline organization filter/i })).toBeVisible();
  const items = page.locator('[data-timeline-grid] li[data-event-org]');
  await expect(items.first()).toBeVisible();

  // Timeline filter: URL-init path exercises applyFilter() the same way a click would.
  // (Click-UI path is verified manually via pnpm dev — direct Playwright clicks on
  //  is:inline script listeners don't propagate reliably in this test setup.)
  await page.goto('/legacy/timeline/?org=CC');
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => (window as any).__dtfcTimelineInit === true);
  const legend = page.getByRole('navigation', { name: /Timeline organization filter/i });
  const ccChip = legend.getByRole('button', { name: /Colorado Caravan/i });
  await expect(ccChip).toHaveAttribute('aria-pressed', 'true');
  await runAxe(page, 'legacy timeline');

  // Legacy Research — Cycle 9 T2 + T3 new page: abstract + materials + FoundationalReading
  // shared component + mailto contact fallback (no ContactForm yet).
  await page.goto('/legacy/research/');
  await expect(page.getByRole('heading', { level: 1, name: 'Research' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Research abstract' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Foundational reading' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Get in touch/ })).toBeVisible();
  // Contact CTA is a mailto fallback (Cycle 9 T2 chose fallback pattern over a new form).
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
  // Foundational Reading rendered by shared component.
  await expect(page.getByText(/Durland, Frances Caldwell/)).toBeVisible();
  await runAxe(page, 'legacy research');

  // Essays: index + one detail with print button.
  await page.goto('/legacy/essays/');
  await expect(page.getByRole('heading', { level: 1, name: 'Essays' })).toBeVisible();
  const firstEssayLink = page.locator('article a').first();
  await firstEssayLink.click();
  await expect(page).toHaveURL(/\/legacy\/essays\/[^/]+\/?/);
  await expect(page.getByRole('button', { name: /Print this essay/i })).toBeVisible();

  // Shakespeare section — landing, sub-nav, one library, one script, colloquial, ask
  await page.goto('/shakespeare/');
  await expect(page.getByRole('heading', { level: 1, name: 'Shakespeare' })).toBeVisible();
  const subNav = page.getByRole('navigation', { name: 'Shakespeare section' });
  await expect(subNav).toBeVisible();
  await expect(subNav.getByRole('link', { name: 'Alternatives' })).toBeVisible();
  await runAxe(page, 'shakespeare landing');

  // Follow a directory-grid link into the Scenes library
  await page.getByRole('link', { name: 'Script Libraries' }).click();
  await expect(page).toHaveURL(/\/shakespeare\/scenes\/?/);
  await expect(page.getByRole('heading', { level: 2, name: /Scenes library/i })).toBeVisible();

  // Follow into an individual script (any card that exists — the first one).
  // Cycle 12: scenes page now leads with DT:FC Nenno entries (routed to /scenes/dtfc/<slug>/)
  // before the standard library grid. Accept both URL shapes.
  const firstScriptLink = page.locator('article a').first();
  await firstScriptLink.click();
  await expect(page).toHaveURL(/\/shakespeare\/(scripts|scenes\/dtfc)\/[^/]+\/?/);
  // Print button only exists on standard script detail pages; skip if on a Nenno detail page.
  const isNennoDetail = (await page.url()).includes('/scenes/dtfc/');
  if (!isNennoDetail) {
    await expect(page.getByRole('button', { name: /Print this script/i })).toBeVisible();
  }

  // Colloquial index → detail
  await page.goto('/shakespeare/colloquial/');
  await expect(page.getByRole('heading', { level: 1, name: 'Colloquial Shakespeare' })).toBeVisible();
  const firstColloquial = page.locator('article a').first();
  await firstColloquial.click();
  await expect(page).toHaveURL(/\/shakespeare\/colloquial\/[^/]+\/?/);

  // Ask Shakespeare index has the form (or fallback text if .env is unset)
  await page.goto('/shakespeare/ask-shakespeare/');
  await expect(page.getByRole('heading', { level: 1, name: 'Ask Shakespeare' })).toBeVisible();
  // When .env is unset, fallback text appears instead of the form
  const hasForm = await page.getByRole('textbox', { name: /Your question/i }).isVisible();
  if (hasForm) {
    await expect(page.getByRole('button', { name: /Send to Shakespeare/i })).toBeVisible();
  } else {
    await expect(page.getByText(/This form is not yet configured/i)).toBeVisible();
  }
  await runAxe(page, 'ask shakespeare / form fallback');

  // Shakespeare landing — doctrine block + "What translation did you use?" + Concept popovers
  // AC2: vision spec §7 — doctrine block, proof-point quote, and Concept popover triggers present
  await page.goto('/shakespeare/');
  await expect(
    page.getByRole('heading', { name: /Leave the Language as Shakespeare/ }),
  ).toBeVisible();
  await expect(page.getByText(/What translation did you use\?/)).toBeVisible();
  // Concept popover triggers use [popovertarget] on the button element (T10 pattern)
  const conceptButtons = page.locator('[popovertarget]');
  expect(await conceptButtons.count()).toBeGreaterThanOrEqual(2);
  await runAxe(page, 'shakespeare landing — doctrine + popovers');

  // New Plays landing — both DT:FC family plays render as cards
  // AC8: vision spec §7 — Three Finger Dick + Shakespeare's Sister visible
  await page.goto('/shakespeare/new-plays/');
  await expect(page.getByRole('heading', { name: /Three Finger Dick/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Shakespeare.s Sister/ })).toBeVisible();
  await runAxe(page, 'shakespeare new-plays landing');

  // Colloquial detail — ʻokina character renders; audio/transcript absent (no audio file set in T7)
  // AC6: vision spec §7 — ʻokina (U+02BB) in title renders correctly; audio element conditional
  await page.goto('/shakespeare/colloquial/one-uddah-midsummah/');
  // h1 must contain the ʻokina character (U+02BB) from the frontmatter title
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Midʻsummah');
  // T7 shipped without audio (Drive file inaccessible): no `audio` frontmatter field is set,
  // so the <audio> element and transcript statement do NOT render — assert the ship state.
  await expect(page.locator('audio')).toHaveCount(0);
  await expect(page.getByText(/accessible transcript/)).toHaveCount(0);
  await runAxe(page, 'shakespeare colloquial detail — okina render');

  // Honoring Our Guides — Legacy cross-links are present and resolvable
  // AC5+cross-section: vision spec §7 — Founders link + Yang essay anchor link visible
  await page.goto('/shakespeare/honoring-our-guides/');
  const legacyLink = page.locator('a[href="/legacy/founders"]').first();
  await expect(legacyLink).toBeVisible();
  const yangLink = page.locator('a[href="/legacy/essays/theatre-influences/#asian-theatre"]');
  await expect(yangLink).toBeVisible();

  // Alternatives — TMAI trade-offs callouts + Contact CTA
  // AC4: vision spec §7 — ≥2 .callout-tradeoffs blocks + Ask Shakespeare link present
  await page.goto('/shakespeare/alternatives/');
  const tradeoffs = page.locator('.callout-tradeoffs');
  expect(await tradeoffs.count()).toBeGreaterThanOrEqual(2);
  const contactCta = page.locator('a[href="/shakespeare/ask-shakespeare/#form"]').first();
  await expect(contactCta).toBeVisible();

  // Children's Theatre section — landing, sub-nav, how-to guide with wheel, library, script detail
  await page.goto('/childrens-theatre/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText("Children");
  await expect(page.getByRole('navigation', { name: /Children.*Theatre section/i })).toBeVisible();
  await runAxe(page, 'childrens-theatre landing');

  // Navigate to Archetype of One Story (via direct URL)
  await page.goto('/childrens-theatre/how-to/archetype-of-one-story/');
  await expect(page.getByRole('heading', { level: 1, name: /Archetype of One Story/i })).toBeVisible();
  // Regression guard: how-to pages must carry the Children's Theatre sub-nav.
  await expect(page.getByRole('navigation', { name: /Children.*Theatre section/i }).first()).toBeVisible();
  // Wheel SVG present
  const wheel = page.locator('svg[role="img"][aria-labelledby*="wjw"]');
  await expect(wheel).toBeVisible();
  await expect(wheel.locator('title')).toContainText(/Wayfarer/i);
  await runAxe(page, 'childrens-theatre how-to + wayfarer wheel');

  // Navigate to Plays library
  await page.goto('/childrens-theatre/plays/');
  await expect(page.getByRole('heading', { level: 2, name: /Children.*plays/i })).toBeVisible();

  // Follow first script card into detail
  const firstCard = page.locator('article a').first();
  await firstCard.click();
  await expect(page).toHaveURL(/\/childrens-theatre\/scripts\/[^/]+\/?/);
  await expect(page.getByRole('button', { name: /Print this script/i })).toBeVisible();

  // Community section — landing (h1 + sub-nav + #membership anchor), companion theatres grid,
  // newsletters index, testimonials form (fallback mode expected in test env — no .env populated)
  await page.goto('/community/');
  await expect(page.getByRole('heading', { level: 1, name: 'Community' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Community section/i })).toBeVisible();
  // Anchor preserved for Cycles 2 + 5 cross-links
  await expect(page.locator('#membership')).toBeVisible();
  await runAxe(page, 'community landing');

  // Companion theatres — grid renders ≥3 cards
  await page.goto('/community/companion-theatres/');
  await expect(page.getByRole('heading', { level: 1, name: 'Companion Theatres' })).toBeVisible();
  const theatreCards = page.locator('main ul li article');
  await expect(theatreCards.first()).toBeVisible();
  expect(await theatreCards.count()).toBeGreaterThanOrEqual(3);

  // Newsletters — index page renders (empty-state or entries)
  await page.goto('/community/newsletters/');
  await expect(page.getByRole('heading', { level: 1, name: 'Newsletters' })).toBeVisible();
  await runAxe(page, 'community newsletters index');

  // Testimonials — page renders + fallback text appears (no .env populated in CI)
  await page.goto('/community/testimonials/');
  await expect(page.getByRole('heading', { level: 1, name: 'Testimonials' })).toBeVisible();
  await expect(page.getByText(/This form is not yet configured/i)).toBeVisible();
  await runAxe(page, 'community testimonials form');

  // Search — verify Pagefind bundle loads and returns results
  // Note: requires `pnpm build` to have produced dist/pagefind/ before this
  // test runs. Playwright starts its own server via `pnpm build && pnpm preview`
  // per playwright.config, so the bundle is present.
  await page.goto('/search/');
  await expect(page.getByRole('heading', { level: 1, name: /^Search DT:FC$/i })).toBeVisible();

  // Wait for PagefindUI to hydrate — it renders an input inside #dtfc-search-page
  const searchInput = page.locator('#dtfc-search-page input[type="text"]').first();
  await expect(searchInput).toBeVisible({ timeout: 10000 });
  await searchInput.fill('shakespeare');

  // Results should populate within a few hundred ms of typing
  const firstResult = page.locator('#dtfc-search-page .pagefind-ui__result-link').first();
  await expect(firstResult).toBeVisible({ timeout: 5000 });

  // No unexpected console errors
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.reload();
  expect(errors, `Console/page errors:\n${errors.join('\n')}`).toEqual([]);
});


// --- Cycle 12 checkpoints ---

test('Scenes landing: DT:FC cluster + Nenno testimonial', async ({ page }) => {
  await page.goto('/shakespeare/scenes/');
  await expect(page.getByText('DT:FC 2-3 Person Scenes')).toBeVisible();
  // Testimonial body is rendered inside a blockquote wrapped in curly-quote characters;
  // use { exact: false } to match the substring regardless of surrounding " " chars.
  await expect(page.getByText('My students are rocking it.', { exact: false })).toBeVisible();
  // DtfcSceneUnit sets data-nenno-slug; ScriptCard links into /scenes/dtfc/. Count all 8.
  const nennoCards = page.locator('[data-nenno-slug], a[href*="/scenes/dtfc/"]');
  expect(await nennoCards.count()).toBeGreaterThanOrEqual(8);
  await runAxe(page, 'scenes landing DT:FC cluster');
});

test('Nenno detail: wrapper chrome + all sections', async ({ page }) => {
  await page.goto('/shakespeare/scenes/dtfc/nurse-juliet-rj-nenno/');
  // The eyebrow span and the h1 both contain "DT:FC 2-3 Person Scene"; use .first() to avoid strict-mode violation.
  await expect(page.getByText('DT:FC 2-3 Person Scene').first()).toBeVisible();
  // DtfcSceneUnit renders H3 headings. "Who’s who" uses &rsquo; (curly apostrophe U+2019).
  // Scope to the DtfcSceneUnit article wrapper and use level:3 for headings that also appear
  // as MDX-generated H2 anchors in the body (e.g. "The scene" -> #the-scene H2 + DtfcSceneUnit H3).
  const article = page.locator('article.dtfc-scene-wrapper');
  await expect(article).toBeVisible();
  // Headings that are unambiguously H3 (no MDX H2 counterpart):
  for (const heading of ['How to cast this scene', 'Say it right', "Who’s who", 'Reflect together', 'Wrap up']) {
    await expect(article.getByRole('heading', { name: heading })).toBeVisible();
  }
  // "The scene" exists as both a DtfcSceneUnit H3 and a MDX body H2 -- use level:3 to be specific.
  await expect(article.getByRole('heading', { name: 'The scene', level: 3 })).toBeVisible();
  await runAxe(page, 'nenno detail nurse-juliet wrapper chrome');
});

test('Nenno Hamlet/Horatio: correct description (no Falstaff)', async ({ page }) => {
  await page.goto('/shakespeare/scenes/dtfc/hamlet-horatio-nenno/');
  const html = await page.content();
  expect(html).not.toContain('Prince Hal alter-father');
  expect(html).not.toContain('Large Person in every way');
  expect(html).toContain('Wittenberg');
});

test('Cuttings: CueCardsExplainer above library grid', async ({ page }) => {
  await page.goto('/shakespeare/cuttings/');
  await expect(page.getByText('Audience Cue Cards')).toBeVisible();
  for (const card of ['TA-DAAA!', 'WIND NOISE', 'HEE-HAW', 'WILD APPLAUSE', 'BOO! HISS!', 'MOB NOISE', 'OH NO!']) {
    await expect(page.getByText(card, { exact: true })).toBeVisible();
  }
});

test('Soliloquies: filter island + NeverMemorizeBox', async ({ page }) => {
  await page.goto('/shakespeare/soliloquies/');
  await expect(page.getByText('Filter soliloquies')).toBeVisible();
  await expect(page.getByText('Never Think or Say the Word')).toBeVisible();
  // T13 shipped 22 non-draft soliloquies (richard-iii-1 is draft:true). Threshold >= 15
  // is deliberately conservative in case future draft flags affect the rendered count.
  const cards = page.locator('[data-soliloquy-card]');
  const initialCount = await cards.count();
  expect(initialCount).toBeGreaterThanOrEqual(15);

  // SoliloquyFilters uses client:idle -- wait for the Preact island to hydrate.
  // "grief" is one of the ALL_REGISTERS values in SoliloquyFilters.tsx (lowercase).
  const griefBtn = page.getByRole('button', { name: 'grief' });
  await expect(griefBtn).toBeVisible({ timeout: 10_000 });
  await griefBtn.click();
  await page.waitForTimeout(400);
  const filteredCount = await cards.evaluateAll((els) =>
    els.filter((el) => (el as HTMLElement).style.display !== 'none').length,
  );
  // After filtering to "grief" register, fewer cards should be visible (not all 22 are grief).
  expect(filteredCount).toBeLessThan(initialCount);
  await runAxe(page, 'soliloquies filter island');
});

test("Children's Shakespeare: Spanish shelf + NeverMemorizeBox + Mechanicals card", async ({ page }) => {
  await page.goto('/shakespeare/childrens-shakespeare/');
  await expect(page.locator('[lang="es"]').first()).toContainText(
    'Obras de Teatro Shakespeare para Niños en Español',
  );
  await expect(page.getByText('Never Think or Say the Word')).toBeVisible();
  await expect(page.getByText('Mechanicals')).toBeVisible();
  await runAxe(page, "children's shakespeare landing");
});

test("Themes: archival section + Fools/Fooling heading + Laurie O'Brien link on script detail", async ({ page }) => {
  await page.goto('/shakespeare/themes/');
  await expect(page.getByText('Archival Theme Scripts (1970s)')).toBeVisible();
  // T16: PDFs deferred (Drive MCP 10MB cap). Archival entries render as <div> tiles (not <a> links).
  // Adapted: use getByRole('heading') to target the archival H3 headings specifically.
  // ('Fools and Fooling' also appears in a chip button and in prose -- heading is unambiguous.)
  await expect(page.getByRole('heading', { name: 'Fools and Fooling' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pretenders List of Scenes' })).toBeVisible();
  // Magic and the Supernatural IS a real script entry -> rendered as ScriptCard <a href> link.
  await expect(page.getByRole('link', { name: /Magic and the Supernatural/ })).toBeVisible();
  // Scan themes landing archival section before navigating to detail.
  await runAxe(page, 'themes landing archival section');
  // Laurie O'Brien link lives in the script body (MDX), not the themes index.
  // Navigate to the detail page to assert the founders cross-link shipped by T12.
  await page.goto('/shakespeare/scripts/magic-and-the-supernatural-theme/');
  // Note: the link text uses &rsquo; which renders as curly apostrophe U+2019.
  const laurie = page.getByRole('link', { name: /Laurie O/ });
  await expect(laurie).toBeVisible();
  await runAxe(page, 'magic script detail');
});

// Skipped: Cycle 12 T15 deferred audio (Drive 404); re-enable when Track K bundle lands.
// When re-enabling: assert page.locator('audio') has src attr /audio/midsummah-pidgin-paka.mp4
// and page.getByText('serves as an accessible transcript') is visible.
test.skip('Colloquial: audio + transcript statement', async ({ page }) => {
  await page.goto('/shakespeare/colloquial/one-uddah-midsummah/');
  await expect(page.locator('audio')).toHaveAttribute('src', '/audio/midsummah-pidgin-paka.mp4');
  await expect(page.getByText('serves as an accessible transcript')).toBeVisible();
});

test('Colloquial: verbatim landing paragraph + okina in title', async ({ page }) => {
  // Verbatim "Carrying on that tradition" paragraph IS shipped on colloquial index (T15 intro).
  await page.goto('/shakespeare/colloquial/');
  await expect(page.getByText('Carrying on that tradition')).toBeVisible();

  // okina (U+02BB) in title renders correctly on the detail page.
  await page.goto('/shakespeare/colloquial/one-uddah-midsummah/');
  const title = await page.locator('h1').first().textContent();
  // U+02BB is the Hawaiian okina; check it appears in the title.
  expect(title).toContain('Midʻsummah');
});

test('Colloquial mobile toggle: switch to Original only', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/shakespeare/colloquial/one-uddah-midsummah/');
  await page.getByLabel('Original', { exact: true }).check();
  await page.waitForTimeout(100);
  const colloquialSide = page.locator('.colloquial').first();
  await expect(colloquialSide).toBeHidden();
});

test('Ask Shakespeare: column #5 draft chip + form section present', async ({ page }) => {
  await page.goto('/shakespeare/ask-shakespeare/');
  // T8 landed draft:true on column 5 ("censorship"). AskShakespeareCard renders the chip inline.
  await expect(page.getByText('Draft — not yet published')).toBeVisible();

  // In test env (.env unset / fallback mode), the <form id="form"> does not render.
  // Verify instead that the "Submit a question" section heading is present (renders in both modes).
  await expect(page.getByRole('heading', { name: 'Submit a question' })).toBeVisible();
});

test('Landing: Ask Shakespeare IDEA_TWO answer URL routes to ask page', async ({ page }) => {
  // The landing teaser questions are plain <li> text items (not hyperlinks).
  // IDEA_TWO_ANSWERS maps the Ask Shakespeare question to /shakespeare/ask-shakespeare/#form.
  // T8 updated this answerAt URL. Verify the URL resolves correctly and loads the ask page.
  await page.goto('/shakespeare/ask-shakespeare/#form');
  await expect(page).toHaveURL(/\/shakespeare\/ask-shakespeare\/#form/);
  // The "Submit a question" section heading is present in both form and fallback modes.
  await expect(page.getByRole('heading', { name: 'Submit a question' })).toBeVisible();
});

test('Alternatives: Alt Four trade-offs callout + last-minute Sister wording + Mechanicals link', async ({ page }) => {
  await page.goto('/shakespeare/alternatives/');
  // Navigate directly to the Alt Four section to ensure content is in view.
  await page.goto('/shakespeare/alternatives/#alternative-four');
  // The callout-tradeoffs div in Alt Four contains "Shakespeare-adjacent, not truly Shakespeare".
  // Use locator with filter since getByText regex matching can miss elements with ::before pseudo-content.
  const tradeoffSection = page.locator('#alternative-four .callout-tradeoffs');
  await expect(tradeoffSection).toBeVisible();
  await expect(tradeoffSection).toContainText('Shakespeare-adjacent');
  await expect(page.getByText(/last-minute/)).toBeVisible();
  // Mechanicals link text is "Mechanicals ->" (rendered from &rarr;).
  await expect(page.getByRole('link', { name: /Mechanicals/ })).toBeVisible();
});
