import { test, expect } from '@playwright/test';

test.skip('password generator generates', async ({ page }) => {
  await page.goto('/tools/password-generator');
  const input = page.locator('#generated-password');
  await page.getByRole('button', { name: 'Generate Password' }).click();
  await expect.poll(() => input.inputValue()).not.toBe('');
});
