import { test, expect } from '@playwright/test';

// Basic E2E coverage for the contact page

test.describe('contact page', () => {
  test('form submits and shows success message', async ({ page }) => {
    await page.goto('/contact');
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'Hi');
    await page.click('button[type="submit"]');
    await expect(page.getByRole('status')).toBeVisible();
  });

  test('discord link is driven by config', async ({ page }) => {
    await page.goto('/contact');
    const link = page.getByRole('link', { name: 'Discord' });
    await expect(link).toHaveAttribute('href', /discord/);
  });
});
