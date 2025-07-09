import { test, expect } from '@playwright/test';

// smoke test for Google Analytics and AdSense loading

test('analytics and ads load', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  const gtagDefined = await page.evaluate(() => typeof window.gtag === 'function');
  expect(gtagDefined).toBeTruthy();
  const adsResponse = await page.request.get('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
  expect(adsResponse.status()).toBe(200);
});
