import { test, expect } from '@playwright/test';
import jsQR from 'jsqr';
import sharp from 'sharp';

test('generated QR encodes the URL', async ({ page }) => {
  await page.goto('/tools/qr-code-generator');
  await page.getByLabel('Text or URL').fill('https://example.com');
  const dataUrl = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    return c ? (c as HTMLCanvasElement).toDataURL() : '';
  });
  const base64 = dataUrl.split(',')[1];
  const { data, info } = await sharp(Buffer.from(base64, 'base64'))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  expect(code?.data).toBe('https://example.com');
});
