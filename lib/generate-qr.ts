import type { QRCodeToDataURLOptions } from 'qrcode';
import extract from 'png-chunks-extract';
import encode from 'png-chunks-encode';
import textChunk from 'png-chunk-text';

let QR: typeof import('qrcode') | null = null;

export interface QrSettings {
  text: string;
  size: number;
  margin: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  foreground: string;
  background: string;
}

async function loadQr() {
  if (!QR) {
    QR = await import('qrcode');
  }
  return QR;
}

export async function generateQrCanvas(
  settings: QrSettings,
  logoUrl?: string
): Promise<HTMLCanvasElement> {
  const QRLib = await loadQr();
  let canvas: HTMLCanvasElement;
  if (typeof document === 'undefined') {
    const { createCanvas } = await import('canvas');
    canvas = createCanvas(settings.size, settings.size) as unknown as HTMLCanvasElement;
  } else {
    canvas = document.createElement('canvas');
  }
  const opts: QRCodeToDataURLOptions = {
    width: settings.size,
    margin: settings.margin,
    errorCorrectionLevel: settings.errorCorrectionLevel,
    color: { dark: settings.foreground, light: settings.background },
  };
  await QRLib.toCanvas(canvas, settings.text, opts);
  if (logoUrl) {
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve();
        const logoSize = settings.size * 0.2;
        const x = (canvas.width - logoSize) / 2;
        const y = x;
        ctx.drawImage(img, x, y, logoSize, logoSize);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = logoUrl;
    });
  }
  return canvas;
}

export async function generateQrDataUrl(
  settings: QrSettings,
  logoUrl?: string
): Promise<string> {
  const canvas = await generateQrCanvas(settings, logoUrl);
  return canvas.toDataURL('image/png');
}

export async function generateQrWithMetadata(
  settings: QrSettings,
  logoUrl?: string
): Promise<string> {
  const canvas = await generateQrCanvas(settings, logoUrl);
  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob((b) => res(b), 'image/png')
  );
  if (!blob) throw new Error('Failed to generate image');
  let buf = new Uint8Array(await blob.arrayBuffer());
  const meta = JSON.stringify(settings);
  const chunks = extract(buf);
  chunks.splice(-1, 0, textChunk.encode('Gearizen', meta));
  buf = new Uint8Array(encode(chunks));
  let base64: string;
  if (typeof Buffer !== 'undefined') {
    base64 = Buffer.from(buf).toString('base64');
  } else {
    base64 = btoa(String.fromCharCode(...buf));
  }
  return `data:image/png;base64,${base64}`;
}
