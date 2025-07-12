import sharp from 'sharp';
import fs from 'fs/promises';

// Used only in tests: compresses an image buffer using sharp and returns the
// compressed buffer.
export async function compressBuffer(buffer: Buffer, quality: number): Promise<Buffer> {
  const q = Math.min(Math.max(quality, 0.01), 1);
  return sharp(buffer).jpeg({ quality: Math.round(q * 100) }).toBuffer();
}

// Helper to load a file for tests.
export async function loadFile(path: string): Promise<Buffer> {
  return fs.readFile(path);
}
