import { createCanvas, loadImage } from 'canvas';

/**
 * Compress an image Buffer using the canvas library. Used only in tests.
 */
export async function compressImageBuffer(
  buffer: Buffer,
  mime: 'image/jpeg' | 'image/png',
  quality: number
): Promise<Buffer> {
  const img = await loadImage(buffer);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const q = Math.min(Math.max(quality, 0), 1);
  if (mime === 'image/png') {
    return canvas.toBuffer('image/png');
  }
  return canvas.toBuffer('image/jpeg', { quality: q });
}
