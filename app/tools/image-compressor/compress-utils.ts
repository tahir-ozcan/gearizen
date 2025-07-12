import sharp from "sharp";
import fs from "fs/promises";

// Compresses an image buffer using sharp and returns the compressed buffer.
// This helper is used only in unit tests.
export async function compressBuffer(
  buffer: Buffer,
  quality: number,
): Promise<Buffer> {
  const q = Math.min(Math.max(quality, 0.01), 1);
  return sharp(buffer)
    .jpeg({ quality: Math.round(q * 100) })
    .toBuffer();
}

// Helper to load a file for tests.
export async function loadFile(path: string): Promise<Buffer> {
  return fs.readFile(path);
}
