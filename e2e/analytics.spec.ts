import { test, expect } from '@playwright/test';

// verify Google Analytics and AdSense load without CSP/CORS errors
test('analytics and ads load', async ({ page, context }) => {
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

  const adsResponse = await page.request.get(
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
  );
  expect(adsResponse.status()).toBe(200);

  const cookies = await context.cookies();
  const gaCookie = cookies.find((c) => c.name.startsWith('_ga'));
  expect(gaCookie).toBeTruthy();
  if (gaCookie) {
    const twoYears = 60 * 60 * 24 * 365 * 2;
    expect(gaCookie.expires - Date.now() / 1000).toBeGreaterThan(twoYears - 60);
  }

  expect(errors).toEqual([]);
});
