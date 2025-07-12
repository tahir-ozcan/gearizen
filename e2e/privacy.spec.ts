import { test, expect } from '@playwright/test';

test('toc links scroll correctly', async ({ page }) => {
  await page.goto('/privacy');
  await page.getByRole('link', { name: 'Data We Don\u2019t Collect' }).click();
  await expect(page).toHaveURL(/#data-we-dont-collect/);
  await expect(page.locator('#data-we-dont-collect')).toBeVisible();
});

test('mobile menu overlay toggles', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/privacy');
  const toggle = page.getByLabel('Open menu');
  await toggle.click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await toggle.click();
  await expect(page.locator('#mobile-menu')).not.toBeVisible();
});
