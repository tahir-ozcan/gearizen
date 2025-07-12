import { test, expect } from '@playwright/test';

// Simple check that the homepage renders and has expected heading

test('homepage loads', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.getByRole('heading', { name: 'Gearizen' }).first()).toBeVisible();
});
