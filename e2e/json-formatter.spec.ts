import { test, expect } from '@playwright/test';

// basic e2e check for json formatter

test.skip('formats JSON and shows output', async ({ page }) => {
  await page.goto('/tools/json-formatter');
  await page.getByLabel('JSON input').fill('{"x":1}');
  await page.getByRole('button', { name: 'Format' }).click();
  await page.waitForSelector('[aria-label="Formatted JSON output"]');
  await expect(page.getByLabel('Formatted JSON output')).toBeVisible();
});
