import { test, expect } from '@playwright/test';

const GA_URL = 'https://www.googletagmanager.com/gtag/js?id=G-V74SWZ9H8B';
const ADS_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

test('no console errors on load', async ({ page }) => {
  const errors: string[] = [];
  await page.route(GA_URL, route => route.fulfill({ status: 200, body: '' }));
  await page.route(ADS_URL, route => route.fulfill({ status: 200, body: '' }));
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
});
