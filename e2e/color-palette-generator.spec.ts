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
  await expect(page.locator(".swatch")).toHaveCount(4);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /download json/i }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.json$/);
});

test("swatch count persists across interactions", async ({ page }) => {
  await page.goto("/tools/color-palette-generator");
  const slider = page.getByLabel("Colors:");
  const base = page.getByLabel("Base Color");
  await slider.evaluate((el: HTMLInputElement) => {
    el.value = "5";
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await expect(page.locator(".swatch")).toHaveCount(5);
  await page.getByRole("radio", { name: "Triadic" }).click();
  await expect(slider).toHaveValue("5");
  await expect(page.locator(".swatch")).toHaveCount(5);
  await base.evaluate((el: HTMLInputElement) => {
    el.value = "#00ff00";
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await expect(slider).toHaveValue("5");
  await expect(page.locator(".swatch")).toHaveCount(5);
});

test("various counts and schemes", async ({ page }) => {
  await page.goto("/tools/color-palette-generator");
  const slider = page.getByLabel("Colors:");
  const schemes = [
    "Analogous",
    "Complementary",
    "Triadic",
    "Tetradic",
    "Monochromatic",
  ];
  for (const count of [3, 7, 10]) {
    await slider.evaluate((el: HTMLInputElement, val) => {
      el.value = String(val);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }, count);
    for (const scheme of schemes) {
      await page.getByRole("radio", { name: scheme }).click();
      await expect(page.locator(".swatch")).toHaveCount(count);
    }
  }
});
