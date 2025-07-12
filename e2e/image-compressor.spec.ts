import { test, expect } from '@playwright/test';

test('upload compress and download image', async ({ page }) => {
  await page.goto('/tools/image-compressor');
  const input = page.locator('input[type="file"]');
  await input.setInputFiles('public/favicon.png');
  await page.getByRole('button', { name: /compress images/i }).click();
  await expect(page.getByRole('button', { name: /download/i })).toBeVisible();
});
