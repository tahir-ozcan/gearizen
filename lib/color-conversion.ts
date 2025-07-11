export interface RGB { r: number; g: number; b: number; }
export interface HSL { h: number; s: number; l: number; }

export function hexToRgb(hex: string): RGB | null {
  const cleaned = hex.trim().replace(/^#/, '');
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(cleaned)) return null;
  const full = cleaned.length === 3
    ? cleaned.split('').map((c) => c + c).join('')
    : cleaned;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return (
    '#' +
    [r, g, b]
      .map((n) => {
        const clamped = Math.max(0, Math.min(255, Math.round(n)));
        return clamped.toString(16).padStart(2, '0');
      })
      .join('')
  );
}

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

export function parseRgbString(str: string): RGB | null {
  const match = str.trim().match(/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (!match) return null;
  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  if ([r, g, b].some((n) => n < 0 || n > 255)) return null;
  return { r, g, b };
}

export function parseHslString(str: string): HSL | null {
  const match = str.trim().match(/^hsl\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i);
  if (!match) return null;
  const h = Number(match[1]);
  const s = Number(match[2]);
  const l = Number(match[3]);
  if ([s, l].some((n) => n < 0 || n > 100)) return null;
  return { h, s, l };
}

export function formatRgb({ r, g, b }: RGB): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function formatHsl({ h, s, l }: HSL): string {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

export function convertColor(input: string): { hex: string; rgb: string; hsl: string } | null {
  let rgb: RGB | null = null;
  if (input.trim().startsWith('#')) {
    rgb = hexToRgb(input);
  } else if (input.toLowerCase().startsWith('rgb')) {
    rgb = parseRgbString(input);
  } else if (input.toLowerCase().startsWith('hsl')) {
    const hsl = parseHslString(input);
    if (hsl) {
      rgb = hslToRgb(hsl);
    }
  }
  if (!rgb) return null;
  const hex = rgbToHex(rgb);
  const hsl = rgbToHsl(rgb);
  return { hex, rgb: formatRgb(rgb), hsl: formatHsl(hsl) };
}
