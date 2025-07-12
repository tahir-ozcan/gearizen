import { test, expect } from '@playwright/test';
import fs from 'fs';

// automatically generate tests for each tool page
test.describe('tool pages', () => {
  const dirs = fs.readdirSync('app/tools');
  dirs.forEach(dir => {
    if (dir === 'page.tsx' || dir === 'tools-client.tsx') return;
    const pagePath = `app/tools/${dir}/page.tsx`;
    if (fs.existsSync(pagePath)) {
      test(`${dir} page renders`, async ({ page }) => {
        await page.goto(`/tools/${dir}`);
        await expect(page.locator('h1').first()).toBeVisible();
      });
    }
  });
});
