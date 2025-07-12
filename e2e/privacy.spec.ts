import { test, expect } from '@playwright/test';

const firstId = 'data-we-dont-collect';

test.skip('toc navigation works', async ({ page }) => {
  await page.goto('/privacy');
  await page.getByRole('link', { name: /Data We Don/i }).click();
  await expect(page).toHaveURL(/#data-we-dont-collect$/);
});

test.skip('mobile toc overlay toggles', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto('/privacy');
  await page.getByRole('button', { name: 'Open contents' }).click();
  await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 3000 });
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('[role="dialog"]')).toBeHidden({ timeout: 3000 });
});
