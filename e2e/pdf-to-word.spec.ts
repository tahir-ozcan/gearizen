import { test, expect } from "@playwright/test";
import { PDFDocument } from "pdf-lib";

async function createPdf() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([200, 200]);
  page.drawText("hi", { x: 50, y: 150 });
  const bytes = await doc.save();
  return { name: "sample.pdf", mimeType: "application/pdf", buffer: bytes };
}

test("pdf to word conversion", async ({ page }) => {
  await page.goto("/tools/pdf-to-word");
  const file = await createPdf();
  await page.setInputFiles("#pdf-upload", file);
  await page.click('button:has-text("Convert")');
  await expect(
    page.getByRole("button", { name: "Download Word File" }),
  ).toBeVisible({ timeout: 15000 });
});
