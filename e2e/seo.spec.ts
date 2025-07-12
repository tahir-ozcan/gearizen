import { test, expect } from '@playwright/test';

// ensure sitemap and robots exist
test('sitemap and robots available', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
});

test('canonical and json-ld present', async ({ page }) => {
  await page.goto('/tools/password-generator');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://gearizen.com/tools/password-generator');
  await expect(page.locator('script[type="application/ld+json"]')).toBeVisible();
});
