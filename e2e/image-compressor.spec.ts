import { test, expect } from "@playwright/test";
import path from "path";

test("upload compress and download image", async ({ page }) => {
  await page.goto("/tools/image-compressor");
  const filePath = path.resolve("public/favicon.png");
  await page.setInputFiles('input[type="file"]', filePath);
  await page.getByRole("button", { name: /compress images/i }).click();
  await expect(page.getByRole("button", { name: "Download" })).toBeVisible();
});
