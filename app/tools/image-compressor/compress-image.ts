/**
 * Compress an image Blob in the browser using the Canvas API.
 * Quality should be between 0 and 1.
 */
export async function compressImage(
  blob: Blob,
  quality: number,
): Promise<Blob> {
  const q = Math.min(Math.max(quality, 0.01), 1);
  const img = new Image();
  const url = URL.createObjectURL(blob);
  img.src = url;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("load"));
  });
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("noctx");
  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(url);
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob"))),
      "image/jpeg",
      q,
    ),
  );
}
