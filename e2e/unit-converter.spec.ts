import { test, expect } from '@playwright/test';

test.describe('unit converter', () => {
  test('performs conversion and swap', async ({ page }) => {
    await page.goto('/tools/unit-converter');
    await page.getByLabel('Value').fill('1000');
    await page.getByLabel('From').selectOption('m');
    await page.getByLabel('To').selectOption('km');
    await page.locator('#input-value').blur();
    await expect(page.getByText('Result')).toBeVisible();
    await expect(page.getByText(/Result/)).toContainText('1');
    await page.getByRole('button', { name: 'Swap units' }).click();
    await expect(page.getByText(/Result/)).toContainText('1000');
  });
});
