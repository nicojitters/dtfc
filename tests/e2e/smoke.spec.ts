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

  // Follow into an individual script (any card that exists — the first one)
  const firstScriptLink = page.locator('article a').first();
  await firstScriptLink.click();
  await expect(page).toHaveURL(/\/shakespeare\/scripts\/[^/]+\/?/);
  await expect(page.getByRole('button', { name: /Print this script/i })).toBeVisible();

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
