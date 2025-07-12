import { test, expect } from '@playwright/test';

// Verify responsive layout by checking bullet section width changes with viewport

test('about page responsive layout', async ({ page }) => {
  await page.goto('/about');
  const bulletList = page.locator('#about-gearizen ul');
  await page.setViewportSize({ width: 375, height: 700 });
  const mobileWidth = (await bulletList.boundingBox())?.width || 0;
  await page.setViewportSize({ width: 1024, height: 700 });
  const desktopWidth = (await bulletList.boundingBox())?.width || 0;
  expect(desktopWidth).toBeGreaterThan(mobileWidth);
});
