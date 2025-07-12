import { test, expect } from '@playwright/test';

test('contact page form submits', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
  await page.getByLabel('Name').fill('Playwright');
  await page.getByLabel(/^Email/).fill('play@example.com');
  await page.getByLabel('Message').fill('Hello');
  await page.getByRole('button', { name: /send message/i }).click();
  await expect(page.getByText(/thank you/i)).toBeVisible();
});
