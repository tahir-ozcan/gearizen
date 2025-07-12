import { test, expect } from '@playwright/test';
import path from 'path';

test('upload compress and download', async ({ page }) => {
  await page.goto('/tools/image-compressor');
  const filePath = path.join(__dirname, '../public/favicon.png');
  await page.getByLabel('Upload images').setInputFiles(filePath);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  const download = await downloadPromise;
  const dlPath = await download.path();
  expect(dlPath).not.toBeNull();
});
