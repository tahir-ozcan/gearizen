/** @jest-environment jsdom */
import { generateQrDataUrl } from '../lib/generate-qr';

describe('generateQrDataUrl', () => {
  test('returns PNG data URL', async () => {
    const url = await generateQrDataUrl({
      text: 'https://example.com',
      width: 128,
      margin: 1,
      darkColor: '#000000',
      lightColor: '#ffffff',
      errorCorrectionLevel: 'M',
    });
    expect(url.startsWith('data:image/png;base64,')).toBe(true);
  });
});
