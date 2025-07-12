import { test, expect } from '@playwright/test';

test('color converter round trip', async ({ page }) => {
  await page.goto('/tools/color-converter');
  await page.getByLabel('Color input').fill('#ff0000');
  await expect(page.getByLabel('RGB(A)')).toHaveValue('rgb(255, 0, 0)');
  await page.getByLabel('RGB(A)').fill('rgb(0, 0, 255)');
  await expect(page.getByLabel('HEX')).toHaveValue('#0000ff');
  await page.getByLabel('HSL(A)').fill('hsl(120, 100%, 50%)');
  await expect(page.getByLabel('HEX')).toHaveValue('#00ff00');
  await page.getByLabel('CMYK').fill('cmyk(0%, 0%, 0%, 0%)');
  await expect(page.getByLabel('HEX')).toHaveValue('#ffffff');
});
