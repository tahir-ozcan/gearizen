let QRCodeLib: typeof import('qrcode') | null = null;

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrOptions {
  text: string;
  width: number;
  margin: number;
  darkColor: string;
  lightColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  logoDataUrl?: string;
}

async function getQrCode() {
  if (!QRCodeLib) {
    QRCodeLib = await import('qrcode');
  }
  return QRCodeLib;
}

export async function generateQrCanvas(options: QrOptions): Promise<HTMLCanvasElement> {
  const QRCode = await getQrCode();
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, options.text, {
    width: options.width,
    margin: options.margin,
    color: {
      dark: options.darkColor,
      light: options.lightColor,
    },
    errorCorrectionLevel: options.errorCorrectionLevel,
  });
  if (options.logoDataUrl) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const size = options.width * 0.2;
          ctx.drawImage(img, (options.width - size) / 2, (options.width - size) / 2, size, size);
        }
        resolve();
      };
      img.onerror = () => resolve();
      img.src = options.logoDataUrl as string;
    });
  }
  return canvas;
}

export async function generateQrDataUrl(options: QrOptions): Promise<string> {
  const QRCode = await getQrCode();
  const base = await QRCode.toDataURL(options.text, {
    width: options.width,
    margin: options.margin,
    color: { dark: options.darkColor, light: options.lightColor },
    errorCorrectionLevel: options.errorCorrectionLevel,
  });
  if (!options.logoDataUrl) return base;
  const canvas = document.createElement('canvas');
  const img = document.createElement('img');
  img.src = base;
  await new Promise((res) => (img.onload = res));
  canvas.width = options.width;
  canvas.height = options.width;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(img, 0, 0, options.width, options.width);
    const logo = new Image();
    logo.src = options.logoDataUrl;
    await new Promise((resolve) => (logo.onload = resolve));
    const s = options.width * 0.2;
    ctx.drawImage(logo, (options.width - s) / 2, (options.width - s) / 2, s, s);
  }
  return canvas.toDataURL('image/png');
}

function makeTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = makeTable();

function crc32(buf: Uint8Array): number {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function uint32ToBytes(value: number) {
  const arr = new Uint8Array(4);
  const view = new DataView(arr.buffer);
  view.setUint32(0, value);
  return arr;
}

function bytesToUint32(buf: Uint8Array, offset: number) {
  return new DataView(buf.buffer, buf.byteOffset + offset, 4).getUint32(0);
}

function createTextChunk(keyword: string, text: string): Uint8Array {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${keyword}\0${text}`);
  const chunk = new Uint8Array(12 + data.length);
  chunk.set(uint32ToBytes(data.length), 0);
  chunk.set(encoder.encode('tEXt'), 4);
  chunk.set(data, 8);
  const crc = crc32(chunk.subarray(4, 8 + data.length));
  chunk.set(uint32ToBytes(crc), 8 + data.length);
  return chunk;
}

function base64ToUint8(base64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
  const bin = atob(base64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function uint8ToBase64(buf: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(buf).toString('base64');
  }
  let bin = '';
  for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
  return btoa(bin);
}

export function embedPngMetadata(dataUrl: string, metadata: Record<string, string>): string {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  const bytes = base64ToUint8(base64);
  const parts: Uint8Array[] = [];
  parts.push(bytes.subarray(0, 8));
  let pos = 8;
  while (pos < bytes.length) {
    const len = bytesToUint32(bytes, pos);
    const type = String.fromCharCode(
      bytes[pos + 4],
      bytes[pos + 5],
      bytes[pos + 6],
      bytes[pos + 7]
    );
    const end = pos + 8 + len + 4;
    if (type === 'IEND') {
      for (const [k, v] of Object.entries(metadata)) {
        parts.push(createTextChunk(k, v));
      }
    }
    parts.push(bytes.subarray(pos, end));
    pos = end;
  }
  const totalLen = parts.reduce((sum, p) => sum + p.length, 0);
  const out = new Uint8Array(totalLen);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return `data:image/png;base64,${uint8ToBase64(out)}`;
}
