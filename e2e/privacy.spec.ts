import { test, expect } from '@playwright/test';

// Verify TOC link scrolls and mobile menu overlay

test('privacy policy TOC navigation', async ({ page }) => {
  await page.goto('/privacy');
  const link = page.getByRole('link', { name: 'Data We Don\u2019t Collect' });
  await link.click();
  await expect(page).toHaveURL(/#data-we-dont-collect/);
  await expect(page.locator('#data-we-dont-collect')).toBeInViewport();
});

test('mobile menu overlay toggles on privacy page', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/privacy');
  await page.getByRole('button', { name: /open menu/i }).click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.getByRole('button', { name: /close menu/i }).click();
  await expect(page.locator('#mobile-menu')).not.toBeVisible();
});
