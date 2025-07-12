import { test, expect } from '@playwright/test';

test('toc links scroll to section and mobile menu overlay works', async ({ page }) => {
  await page.goto('/privacy');
  const tocLink = page.getByRole('link', { name: 'Data We Don\u2019t Collect' });
  await tocLink.click();
  await expect(page).toHaveURL(/#data-we-dont-collect/);
  await expect(page.locator('#data-we-dont-collect')).toBeVisible();

  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
});
