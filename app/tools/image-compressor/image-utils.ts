import sharp from "sharp";

/** Compress an image Buffer using the sharp library. */
export async function compressBuffer(
  buf: Buffer,
  mime: string,
  quality: number,
): Promise<Buffer> {
  const img = sharp(buf);
  if (mime === "image/png") {
    return img.png({ quality: Math.round(quality * 100) }).toBuffer();
  }
  return img.jpeg({ quality: Math.round(quality * 100) }).toBuffer();
}
