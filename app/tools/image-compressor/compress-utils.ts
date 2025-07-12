import sharp from 'sharp';
import fs from 'fs/promises';

/**
 * Compress an image buffer using sharp.
 * @param buffer Image data to compress
 * @param quality Compression quality between 0 and 1
 */
export async function compressBuffer(buffer: Buffer, quality: number): Promise<Buffer> {
  const q = Math.min(Math.max(quality, 0), 1);
  return sharp(buffer).jpeg({ quality: Math.round(q * 100) }).toBuffer();
}

/**
 * Read a file from disk (test helper).
 */
export async function loadFile(path: string): Promise<Buffer> {
  return fs.readFile(path);
}
