import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './color-conversion';

export type PaletteScheme =
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'tetradic'
  | 'monochromatic';

/**
 * Generate a simple color palette from a base HEX color.
 * Always returns exactly `count` colors regardless of the scheme.
 * @param base - Hex color string like `#ff0000`.
 * @param scheme - Palette type to create.
 * @param count - Desired number of colors.
 */
export function generatePalette(
  base: string,
  scheme: PaletteScheme = 'analogous',
  count = 5,
): string[] {
  const n = Math.max(1, Math.round(count));
  const rgb = hexToRgb(base);
  if (!rgb) throw new Error('Invalid hex color');
  const { h, s, l } = rgbToHsl(rgb);
  const wrap = (val: number) => ((val % 360) + 360) % 360;
  const toHex = (hue: number, sat = s, light = l) =>
    rgbToHex(hslToRgb({ h: wrap(hue), s: sat, l: light }));

  const buildOffsets = (offsets: number[]): number[] => {
    const out = [...offsets];
    let delta = 30;
    while (out.length < n) {
      for (const baseOff of offsets) {
        if (out.length >= n) break;
        out.push(baseOff + delta);
        if (out.length >= n) break;
        out.push(baseOff - delta);
      }
      delta += 30;
    }
    return out.slice(0, n);
  };

  switch (scheme) {
    case 'complementary':
      return buildOffsets([0, 180]).map((o) => toHex(h + o));
    case 'triadic':
      return buildOffsets([0, 120, 240]).map((o) => toHex(h + o));
    case 'tetradic':
      return buildOffsets([0, 90, 180, 270]).map((o) => toHex(h + o));
    case 'monochromatic': {
      const start = Math.max(0, l - 40);
      const end = Math.min(100, l + 40);
      return Array.from({ length: n }, (_, i) => {
        const t = n === 1 ? 0 : i / (n - 1);
        const light = start + (end - start) * t;
        return toHex(h, s, light);
      });
    }
    case 'analogous':
    default: {
      const half = Math.floor(n / 2);
      const step = 30;
      return Array.from({ length: n }, (_, i) => toHex(h + (i - half) * step));
    }
  }
}

export function paletteToJson(palette: string[]): string {
  return JSON.stringify(palette, null, 2);
}

export function paletteToAse(palette: string[]): Uint8Array {
  const blocks: Uint8Array[] = [];
  const te = new TextEncoder();

  palette.forEach((hex, idx) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    const name = `Color ${idx + 1}`;
    const nameBuf = new Uint8Array(2 + (name.length + 1) * 2);
    const nameView = new DataView(nameBuf.buffer);
    nameView.setUint16(0, name.length + 1, false);
    for (let i = 0; i < name.length; i++) {
      nameView.setUint16(2 + i * 2, name.charCodeAt(i), false);
    }
    nameView.setUint16(2 + name.length * 2, 0, false);

    const colorBuf = new Uint8Array(4 + 12 + 2);
    colorBuf.set(te.encode('RGB '), 0);
    const colorView = new DataView(colorBuf.buffer);
    colorView.setFloat32(4, rgb.r / 255, false);
    colorView.setFloat32(8, rgb.g / 255, false);
    colorView.setFloat32(12, rgb.b / 255, false);
    colorView.setUint16(16, 0, false);

    const blockLen = nameBuf.length + colorBuf.length;
    const block = new Uint8Array(2 + 4 + blockLen);
    const blockView = new DataView(block.buffer);
    blockView.setUint16(0, 0x0001, false);
    blockView.setUint32(2, blockLen, false);
    block.set(nameBuf, 6);
    block.set(colorBuf, 6 + nameBuf.length);
    blocks.push(block);
  });

  const header = new Uint8Array(12);
  header[0] = 0x41;
  header[1] = 0x53;
  header[2] = 0x45;
  header[3] = 0x46;
  const hv = new DataView(header.buffer);
  hv.setUint16(4, 1, false);
  hv.setUint16(6, 0, false);
  hv.setUint32(8, blocks.length, false);

  const total = header.length + blocks.reduce((t, b) => t + b.length, 0);
  const out = new Uint8Array(total);
  out.set(header, 0);
  let offset = header.length;
  for (const b of blocks) {
    out.set(b, offset);
    offset += b.length;
  }
  return out;
}
