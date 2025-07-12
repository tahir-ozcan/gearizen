import { test, expect } from '@playwright/test';

test('sitemap and robots accessible', async ({ page }) => {
  const res1 = await page.request.get('/sitemap.xml');
  expect(res1.status()).toBe(200);
  const res2 = await page.request.get('/robots.txt');
  expect(res2.status()).toBe(200);
});
