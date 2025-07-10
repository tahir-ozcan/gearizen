import { test, expect } from '@playwright/test';

// verify Google Analytics and AdSense load without CSP/CORS errors
test('analytics and ads load', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const gtagDefined = await page.evaluate(() => typeof window.gtag === 'function');
  expect(gtagDefined).toBeTruthy();

  const gaLoaded = await page.$("script[src*='googletagmanager']");
  const adsLoaded = await page.$("script[src*='adsbygoogle']");
  expect(gaLoaded).not.toBeNull();
  expect(adsLoaded).not.toBeNull();

  expect(errors).toEqual([]);
});
