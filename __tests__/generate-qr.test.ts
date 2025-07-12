/** @jest-environment node */
import { generateQrDataUrl, QrSettings } from '../lib/generate-qr';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';

function decode(dataUrl: string): string | null {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');
  const img = PNG.sync.read(buffer);
  const code = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
  return code?.data ?? null;
}

describe('generateQrDataUrl', () => {
  test('encodes provided text', async () => {
    const settings: QrSettings = {
      text: 'https://example.com',
      size: 128,
      margin: 1,
      errorCorrectionLevel: 'M',
      foreground: '#000000',
      background: '#FFFFFF',
    };
    const url = await generateQrDataUrl(settings);
    const decoded = decode(url);
    expect(decoded).toBe(settings.text);
  });
});
