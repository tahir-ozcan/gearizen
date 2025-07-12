import { test, expect } from '@playwright/test';

test('contact page submission flow', async ({ page }) => {
  await page.goto('http://localhost:3000/contact');
  await page.getByLabel('Name').fill('Jane');
  await page.getByLabel('Email').fill('jane@example.com');
  await page.getByLabel('Message').fill('Hello');
  await page.getByRole('button', { name: /send message/i }).click();
  await expect(page.getByRole('status')).toHaveText(/thank you/i);
});

// Ensure social links come from config
test('contact page displays GitHub link', async ({ page }) => {
  await page.goto('http://localhost:3000/contact');
  await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', /github/);
});
