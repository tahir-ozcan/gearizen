import colorName from "color-name";
import {
  hexToRgb,
  parseRgbString,
  parseHslString,
  hslToRgb,
  rgbToHex,
} from "./color-conversion";

export type RGBTuple = [number, number, number];

function parseColor(
  input: string,
  vars: Record<string, string> = {},
): RGBTuple | null {
  let value = input.trim();
  const varMatch = value.match(/^var\((--[^)]+)\)$/);
  if (varMatch) {
    const name = varMatch[1];
    if (vars[name]) {
      value = vars[name].trim();
    } else if (typeof window !== "undefined") {
      const val = getComputedStyle(document.documentElement).getPropertyValue(
        name,
      );
      if (val) value = val.trim();
    }
  }
  const lower = value.toLowerCase();
  if (lower in colorName) {
    const [r, g, b] = (colorName as Record<string, RGBTuple>)[lower];
    return [r, g, b];
  }
  if (value.startsWith("#")) {
    const rgb = hexToRgb(value);
    return rgb ? [rgb.r, rgb.g, rgb.b] : null;
  }
  if (lower.startsWith("rgb")) {
    const rgb = parseRgbString(value);
    return rgb ? [rgb.r, rgb.g, rgb.b] : null;
  }
  if (lower.startsWith("hsl")) {
    const hsl = parseHslString(value);
    if (hsl) {
      const rgb = hslToRgb(hsl);
      return [rgb.r, rgb.g, rgb.b];
    }
  }
  return null;
}

function luminance([r, g, b]: RGBTuple): number {
  const [R, G, B] = [r, g, b].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function calculateContrast(
  fg: string,
  bg: string,
  vars: Record<string, string> = {},
): { ratio: number; fgHex: string; bgHex: string } {
  const fgRgb = parseColor(fg, vars);
  const bgRgb = parseColor(bg, vars);
  if (!fgRgb || !bgRgb) {
    return { ratio: NaN, fgHex: "#000000", bgHex: "#ffffff" };
  }
  const ratioVal = (() => {
    const L1 = luminance(fgRgb);
    const L2 = luminance(bgRgb);
    const [lighter, darker] = L1 > L2 ? [L1, L2] : [L2, L1];
    return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
  })();
  return {
    ratio: ratioVal,
    fgHex: rgbToHex({ r: fgRgb[0], g: fgRgb[1], b: fgRgb[2] }),
    bgHex: rgbToHex({ r: bgRgb[0], g: bgRgb[1], b: bgRgb[2] }),
  };
}

export { parseColor };
