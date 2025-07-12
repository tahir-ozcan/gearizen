/** @jest-environment jsdom */
import { compressBuffer, loadFile } from "./compress-utils";

const samplePath = "public/favicon.png";

// Ensure compression reduces file size
// Uses sharp to compress a PNG to JPEG and checks output is smaller.
test("compressBuffer reduces size", async () => {
  const orig = await loadFile(samplePath);
  const compressed = await compressBuffer(orig, 0.5);
  expect(compressed.length).toBeLessThan(orig.length);
});

test("compressBuffer clamps quality", async () => {
  const orig = await loadFile(samplePath);
  const compressedHigh = await compressBuffer(orig, 2);
  const compressedLow = await compressBuffer(orig, -1);
  expect(compressedHigh.length).toBeLessThan(orig.length);
  expect(compressedLow.length).toBeLessThan(orig.length);
});

test("compressImage blob reduces size at 80% quality", async () => {
  const orig = await loadFile(samplePath);
  const origBlob = new Blob([orig], { type: "image/png" });
  const compressedBuf = await compressBuffer(orig, 0.8);
  const compressedBlob = new Blob([compressedBuf], { type: "image/jpeg" });
  expect(compressedBlob.size).toBeLessThan(origBlob.size);
});
