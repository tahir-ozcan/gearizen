import { test, expect } from "@playwright/test";

test.skip("password generator generates", async ({ page }) => {
  await page.goto("/tools/password-generator");
  const input = page.locator("#generated-password");
  const before = await input.inputValue();
  await page.getByRole("button", { name: "Generate Password" }).click();
  await expect.poll(() => input.inputValue()).not.toBe(before);
  await expect(input).toHaveValue(/.+/);
});
