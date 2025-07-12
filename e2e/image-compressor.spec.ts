import { test, expect } from '@playwright/test';

const samplePath = 'public/favicon.png';

test('image compressor compresses and shows download button', async ({ page }) => {
  await page.goto('/tools/image-compressor');
  await page.setInputFiles('input[type="file"]', samplePath);
  await page.getByRole('button', { name: 'Compress Images' }).click();
  await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
});
