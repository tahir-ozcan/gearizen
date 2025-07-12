export interface RGB { r: number; g: number; b: number }
export interface RGBA extends RGB { a: number }
export interface HSL { h: number; s: number; l: number }
export interface HSLA extends HSL { a: number }
export interface CMYK { c: number; m: number; y: number; k: number }

export function hexToRgba(hex: string): RGBA | null {
  const cleaned = hex.trim().replace(/^#/, '')
  if (!/^([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(cleaned)) return null
  const expanded = cleaned.length <= 4
    ? cleaned.split('').map(c => c + c).join('')
    : cleaned
  const r = parseInt(expanded.slice(0, 2), 16)
  const g = parseInt(expanded.slice(2, 4), 16)
  const b = parseInt(expanded.slice(4, 6), 16)
  const a = expanded.length === 8 ? parseInt(expanded.slice(6, 8), 16) / 255 : 1
  return { r, g, b, a }
}

export const hexToRgb = hexToRgba

export function rgbaToHex({ r, g, b, a }: RGBA): string {
  const hex = [r, g, b]
    .map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0'))
    .join('');
  const alpha = Math.round(Math.max(0, Math.min(1, a)) * 255)
    .toString(16)
    .padStart(2, '0');
  return a < 1 ? `#${hex}${alpha}` : `#${hex}`;
}

export const rgbToHex = (rgb: RGB): string => rgbaToHex({ ...rgb, a: 1 });

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      default:
        h = (rNorm - gNorm) / d + 4;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hNorm = ((h % 360) + 360) / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;
  if (s === 0) {
    const val = Math.round(lNorm * 255);
    return { r: val, g: val, b: val };
  }
  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;
  const r = hueToRgb(p, q, hNorm + 1 / 3);
  const g = hueToRgb(p, q, hNorm);
  const b = hueToRgb(p, q, hNorm - 1 / 3);
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export function parseRgbString(str: string): RGBA | null {
  const match = str
    .trim()
    .match(/^rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+)\s*)?\)$/i);
  if (!match) return null;
  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  const a = match[4] === undefined ? 1 : Number(match[4]);
  if ([r, g, b].some((n) => n < 0 || n > 255) || a < 0 || a > 1) return null;
  return { r, g, b, a };
}

export function parseHslString(str: string): HSLA | null {
  const match = str
    .trim()
    .match(/^hsla?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%(?:\s*,\s*(\d*\.?\d+)\s*)?\)$/i);
  if (!match) return null;
  const h = Number(match[1]);
  const s = Number(match[2]);
  const l = Number(match[3]);
  const a = match[4] === undefined ? 1 : Number(match[4]);
  if ([s, l].some((n) => n < 0 || n > 100) || a < 0 || a > 1) return null;
  return { h, s, l, a };
}

export function formatRgb({ r, g, b }: RGB): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function formatHsl({ h, s, l }: HSL): string {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

export function formatRgba({ r, g, b, a }: RGBA): string {
  return a < 1
    ? `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})`
    : `rgb(${r}, ${g}, ${b})`;
}

export function formatHsla({ h, s, l, a }: HSLA): string {
  const base = `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
  return a < 1 ? `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${Number(a.toFixed(2))})` : base;
}

export function formatCmyk({ c, m, y, k }: CMYK): string {
  return `cmyk(${Math.round(c)}%, ${Math.round(m)}%, ${Math.round(y)}%, ${Math.round(k)}%)`;
}

export function rgbaToHsla({ r, g, b, a }: RGBA): HSLA {
  const { h, s, l } = rgbToHsl({ r, g, b });
  return { h, s, l, a };
}

export function hslaToRgba({ h, s, l, a }: HSLA): RGBA {
  const rgb = hslToRgb({ h, s, l });
  return { ...rgb, a };
}

export function rgbaToCmyk({ r, g, b }: RGBA): CMYK {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const c = ((1 - rNorm - k) / (1 - k)) * 100;
  const m = ((1 - gNorm - k) / (1 - k)) * 100;
  const y = ((1 - bNorm - k) / (1 - k)) * 100;
  return { c, m, y, k: k * 100 };
}

export function cmykToRgba({ c, m, y, k }: CMYK): RGBA {
  const cNorm = c / 100;
  const mNorm = m / 100;
  const yNorm = y / 100;
  const kNorm = k / 100;
  const r = 255 * (1 - cNorm) * (1 - kNorm);
  const g = 255 * (1 - mNorm) * (1 - kNorm);
  const b = 255 * (1 - yNorm) * (1 - kNorm);
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a: 1 };
}

export function parseCmykString(str: string): CMYK | null {
  const match = str
    .trim()
    .match(/^cmyk\s*\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i);
  if (!match) return null;
  const c = Number(match[1]);
  const m = Number(match[2]);
  const y = Number(match[3]);
  const k = Number(match[4]);
  if ([c, m, y, k].some((n) => n < 0 || n > 100)) return null;
  return { c, m, y, k };
}

export function parseColor(input: string): RGBA | null {
  const trimmed = input.trim();
  if (trimmed.startsWith('#')) return hexToRgba(trimmed);
  if (/^rgba?/i.test(trimmed)) return parseRgbString(trimmed);
  if (/^hsla?/i.test(trimmed)) {
    const hsl = parseHslString(trimmed);
    return hsl ? hslaToRgba(hsl) : null;
  }
  if (/^cmyk/i.test(trimmed)) {
    const cmyk = parseCmykString(trimmed);
    return cmyk ? cmykToRgba(cmyk) : null;
  }
  return null;
}

export function convertColor(
  input: string,
): { hex: string; rgb: string; hsl: string; cmyk: string } | null {
  let rgba: RGBA | null = null;
  const trimmed = input.trim();
  if (trimmed.startsWith('#')) {
    rgba = hexToRgba(trimmed);
  } else if (trimmed.toLowerCase().startsWith('rgb')) {
    rgba = parseRgbString(trimmed);
  } else if (trimmed.toLowerCase().startsWith('hsl')) {
    const hsl = parseHslString(trimmed);
    if (hsl) rgba = hslaToRgba(hsl);
  } else if (trimmed.toLowerCase().startsWith('cmyk')) {
    const cmyk = parseCmykString(trimmed);
    if (cmyk) rgba = cmykToRgba(cmyk);
  }
  if (!rgba) return null;
  const hex = rgbaToHex(rgba);
  const hsl = rgbaToHsla(rgba);
  const cmyk = rgbaToCmyk(rgba);
  return {
    hex,
    rgb: formatRgba(rgba),
    hsl: formatHsla(hsl),
    cmyk: formatCmyk(cmyk),
  };
}
