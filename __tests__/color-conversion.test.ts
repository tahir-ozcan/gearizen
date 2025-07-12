/** @jest-environment node */
import {
  hexToRgba,
  rgbaToHex,
  rgbaToHsla,
  hslaToRgba,
  rgbaToCmyk,
  cmykToRgba,
  convertColor,
} from '../lib/color-conversion';

describe('color conversion formulas', () => {
  test('hex to rgba and back', () => {
    const rgba = hexToRgba('#ff000080');
    expect(rgba?.r).toBe(255);
    expect(rgba?.g).toBe(0);
    expect(rgba?.b).toBe(0);
    expect(rgba?.a ?? 0).toBeCloseTo(0.5, 2);
    expect(rgba && rgbaToHex(rgba)).toBe('#ff000080');
  });

  test('rgba to hsla round trip', () => {
    const hsla = rgbaToHsla({ r: 0, g: 255, b: 0, a: 1 });
    const rgba = hslaToRgba(hsla);
    expect(rgba).toEqual({ r: 0, g: 255, b: 0, a: 1 });
  });

  test('rgba to cmyk round trip', () => {
    const cmyk = rgbaToCmyk({ r: 0, g: 0, b: 255, a: 1 });
    const rgba = cmykToRgba(cmyk);
    expect(rgba).toEqual({ r: 0, g: 0, b: 255, a: 1 });
  });
});

describe('convertColor', () => {
  test('handles multiple formats', () => {
    const res = convertColor('cmyk(0%, 100%, 100%, 0%)');
    expect(res).toEqual({
      hex: '#ff0000',
      rgb: 'rgb(255, 0, 0)',
      hsl: 'hsl(0, 100%, 50%)',
      cmyk: 'cmyk(0%, 100%, 100%, 0%)',
    });
  });

  test('returns null on invalid', () => {
    expect(convertColor('invalid')).toBeNull();
  });
});
