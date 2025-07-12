import { test, expect } from '@playwright/test';
import { contactConfig, decodeEmail } from '../lib/contactConfig';

test('contact page form submission', async ({ page }) => {
  await page.goto('/contact');
  const firstField = page.getByLabelText('Name');
  await firstField.focus();
  await page.keyboard.type('A');
  await page.keyboard.press('Tab');
  await page.keyboard.type('a@example.com');
  await page.keyboard.press('Tab');
  await page.keyboard.type('hello');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toBeVisible();
});

test('social links from config are rendered', async ({ page }) => {
  await page.goto('/contact');
  for (const c of contactConfig.channels) {
    await expect(page.locator(`a[href="${c.href}"]`)).toBeVisible();
  }
});
