import { test, expect } from '@playwright/test';

test.describe('home page', () => {
  test('hero CTA navigates to tools', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Gearizen' })).toBeVisible();
    await page.getByRole('link', { name: 'Discover All Tools' }).click();
    await expect(page).toHaveURL(/\/tools$/);
  });

  test('mobile navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);
  });
});
