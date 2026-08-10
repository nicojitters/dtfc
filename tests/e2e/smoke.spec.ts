import { test, expect } from '@playwright/test';

test('smoke: landing → PRC → games finder → concept popover', async ({ page }) => {
  // Landing page — no h1 on the home page; verify a section box heading renders
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Theatre Games' }).first()).toBeVisible();

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
  const before = await countText.textContent();
  await physicalBtn.click();
  await expect(countText).not.toHaveText(before ?? '', { timeout: 10_000 });
  await expect(page).toHaveURL(/competency=physical-expression/);

  // No unexpected console errors
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.reload();
  expect(errors, `Console/page errors:\n${errors.join('\n')}`).toEqual([]);
});
