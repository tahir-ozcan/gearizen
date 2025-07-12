import { test, expect } from '@playwright/test';
import fs from 'fs';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';

test('generated QR code encodes URL', async ({ page }) => {
  await page.goto('/tools/qr-code-generator');
  await page.getByLabel('Text or URL').fill('https://playwright.dev');
  const canvas = await page.getByRole('img', { name: /qr preview/i });
  const path = 'qr-test.png';
  await canvas.screenshot({ path });
  const buffer = fs.readFileSync(path);
  const img = PNG.sync.read(buffer);
  const code = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
  expect(code?.data).toBe('https://playwright.dev');
});
