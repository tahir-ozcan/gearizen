import { test, expect } from '@playwright/test';

// verify Google Analytics and AdSense load without CSP/CORS errors
test.skip('analytics and ads load', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');



  expect(errors).toEqual([]);
});
