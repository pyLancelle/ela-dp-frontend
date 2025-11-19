
import { test, expect } from '@playwright/test';

test('Artist focus page', async ({ page }) => {
  await page.goto('/musique/artiste');

  // Check that the main title is "Focus Artiste"
  await expect(page.locator('h1')).toHaveText('Focus Artiste');

  // Check that the date range picker is present by looking for its label
  await expect(page.locator('text="Période :"')).toBeVisible();

  // Check that the artist selector is present
  const artistSelector = page.locator('[data-testid="artist-select"]');
  await expect(artistSelector).toBeVisible();

  // Select an artist and check that the content changes
  await artistSelector.click();
  await page.locator('div[role="option"]:has-text("Daft Punk")').click();

  // Check that the artist name in the header is "Daft Punk"
  await expect(page.locator('[data-testid="artist-name"]')).toHaveText('Daft Punk');

  // Check that the new "Listening by Hour" chart is visible
  await expect(page.locator('text="Écoutes par heure"')).toBeVisible();
});
