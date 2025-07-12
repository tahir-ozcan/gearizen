import { test, expect } from "@playwright/test";

test("contrast checker fail then pass", async ({ page }) => {
  await page.goto("/tools/color-contrast-checker");
  await page.getByLabel("Text color value").fill("#777777");
  await page.getByLabel("Background color value").fill("#ffffff");
  await expect(page.getByText("WCAG AA Normal")).toContainText("Fail");
  await page.getByLabel("Text color value").fill("#000000");
  await expect(page.getByText("WCAG AA Normal")).toContainText("Pass");
});
