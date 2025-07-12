import { test, expect } from "@playwright/test";

test("generate and download palette", async ({ page, browserName }) => {
  await page.goto("/tools/color-palette-generator");
  await page.getByRole("radio", { name: "Tetradic" }).click();
  const slider = page.getByLabel("Colors:");
  await slider.evaluate((el: HTMLInputElement) => {
    el.value = "4";
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await expect(page.locator("button", { hasText: "Copy" })).toHaveCount(4);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /download json/i }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.json$/);
});
