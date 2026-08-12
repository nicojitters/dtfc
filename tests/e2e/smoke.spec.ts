import { test, expect } from '@playwright/test';

test('smoke: landing → PRC → games finder → concept popover', async ({ page }) => {
  // Landing page — identity + grid + rotating teaser + no prohibited text
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Be Fearlessly Creative!' })).toBeVisible();
  await expect(page.getByText("nurture", { exact: false }).first()).toBeVisible();
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

  // Navigate to PRC
  await page.getByRole('link', { name: 'Players Resource Center' }).first().click();
  await expect(page).toHaveURL(/\/resource-center\/?$/);
  await expect(page.getByText('What are the ICONS')).toBeVisible();

  // Navigate to Theatre Games landing
  await page.getByRole('link', { name: 'Theatre Games' }).first().click();
  await expect(page).toHaveURL(/\/theatre-games\/?$/);
  await expect(page.getByRole('heading', { name: 'The five competencies' })).toBeVisible();

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

  // Legacy section — landing, sub-nav, timeline (URL-driven filter path), essay detail
  await page.goto('/legacy/');
  await expect(page.getByRole('heading', { level: 1, name: 'Legacy' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Legacy section/i })).toBeVisible();

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

  // Ask Shakespeare index has the form
  await page.goto('/shakespeare/ask-shakespeare/');
  await expect(page.getByRole('heading', { level: 1, name: 'Ask Shakespeare' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /Your question/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Send to Shakespeare/i })).toBeVisible();

  // Children's Theatre section — landing, sub-nav, how-to guide with wheel, library, script detail
  await page.goto('/childrens-theatre/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText("Children");
  await expect(page.getByRole('navigation', { name: /Children.*Theatre section/i })).toBeVisible();

  // Navigate to Archetype of One Story (via direct URL)
  await page.goto('/childrens-theatre/how-to/archetype-of-one-story/');
  await expect(page.getByRole('heading', { level: 1, name: /Archetype of One Story/i })).toBeVisible();
  // Regression guard: how-to pages must carry the Children's Theatre sub-nav.
  await expect(page.getByRole('navigation', { name: /Children.*Theatre section/i }).first()).toBeVisible();
  // Wheel SVG present
  const wheel = page.locator('svg[role="img"][aria-labelledby*="wjw"]');
  await expect(wheel).toBeVisible();
  await expect(wheel.locator('title')).toContainText(/Wayfarer/i);

  // Navigate to Plays library
  await page.goto('/childrens-theatre/plays/');
  await expect(page.getByRole('heading', { level: 2, name: /Children.*plays/i })).toBeVisible();

  // Follow first script card into detail
  const firstCard = page.locator('article a').first();
  await firstCard.click();
  await expect(page).toHaveURL(/\/childrens-theatre\/scripts\/[^/]+\/?/);
  await expect(page.getByRole('button', { name: /Print this script/i })).toBeVisible();

  // No unexpected console errors
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.reload();
  expect(errors, `Console/page errors:\n${errors.join('\n')}`).toEqual([]);
});
