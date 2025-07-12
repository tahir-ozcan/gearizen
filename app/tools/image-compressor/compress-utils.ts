import sharp from 'sharp';
import fs from 'fs/promises';
import { Readable } from 'stream';

// compresses an image buffer using sharp
export async function compressBuffer(buffer: Buffer, quality: number): Promise<Buffer> {
  const q = Math.min(Math.max(quality, 0), 1);
  return sharp(buffer).jpeg({ quality: Math.round(q * 100) }).toBuffer();
}

// stream-based compression that reports chunks via callback
export async function compressBufferStream(
  buffer: Buffer,
  quality: number,
  onChunk?: (chunk: Buffer) => void
): Promise<Buffer> {
  const readable = Readable.from(buffer);
  const transform = sharp().jpeg({ quality: Math.round(Math.min(Math.max(quality, 0), 1) * 100) });
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    readable.pipe(transform);
    transform.on('data', (c: Buffer) => {
      chunks.push(c);
      if (onChunk) onChunk(c);
    });
    transform.on('error', reject);
    transform.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

// Helper to load a file for tests
export async function loadFile(path: string): Promise<Buffer> {
  return fs.readFile(path);
}
