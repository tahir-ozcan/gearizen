import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './color-conversion';

export type PaletteScheme = 'analogous' | 'complementary' | 'triadic';

/**
 * Generate a simple color palette from a base HEX color.
 * @param base - Hex color string like `#ff0000`.
 * @param scheme - Palette type to create.
 * @param count - Number of colors for analogous palettes.
 */
export function generatePalette(
  base: string,
  scheme: PaletteScheme = 'analogous',
  count = 5,
): string[] {
  const rgb = hexToRgb(base);
  if (!rgb) throw new Error('Invalid hex color');
  const { h, s, l } = rgbToHsl(rgb);
  const wrap = (val: number) => ((val % 360) + 360) % 360;
  const toHex = (hue: number) => rgbToHex(hslToRgb({ h: wrap(hue), s, l }));

  switch (scheme) {
    case 'complementary':
      return [base, toHex(h + 180)];
    case 'triadic':
      return [base, toHex(h + 120), toHex(h + 240)];
    default: {
      const half = Math.floor(count / 2);
      const step = 30;
      return Array.from({ length: count }, (_, i) => toHex(h + (i - half) * step));
    }
  }
}
