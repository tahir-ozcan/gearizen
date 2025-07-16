// app/tools/color-toolkit/color-toolkit-client.tsx
"use client";

import React, {
  FC,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

// ─── Color Utility Functions ─────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function hexToRgb(hex: string) {
  const h = hex.replace(/^#/, "").trim();
  if (!/^[0-9A-Fa-f]{6}$/.test(h)) return null;
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
}

function rgbToHex(r: number, g: number, b: number): string {
  const to2 = (n: number) =>
    clamp(n, 0, 255).toString(16).padStart(2, "0");
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r1, g1, b1] = [0, 0, 0];
  if (h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h < 180) [r1, g1, b1] = [0, c, x];
  else if (h < 240) [r1, g1, b1] = [0, x, c];
  else if (h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, 0];
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function rgbToCmyk(r: number, g: number, b: number) {
  const rr = r / 255,
    gg = g / 255,
    bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  const c = k === 1 ? 0 : (1 - rr - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - gg - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - bb - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

function shiftLightness(
  h: number,
  s: number,
  l: number,
  delta: number
) {
  return { h, s, l: clamp(l + delta, 0, 100) };
}

function complementary(h: number) {
  return (h + 180) % 360;
}

function luminance(r: number, g: number, b: number) {
  const toLin = (v: number) => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return (
    0.2126 * toLin(r) +
    0.7152 * toLin(g) +
    0.0722 * toLin(b)
  );
}

function contrastRatio(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number }
) {
  const L1 = luminance(c1.r, c1.g, c1.b);
  const L2 = luminance(c2.r, c2.g, c2.b);
  return ((Math.max(L1, L2) + 0.05) /
    (Math.min(L1, L2) + 0.05)
  ).toFixed(2);
}

// ─── Reusable UI Subcomponents ────────────────────────────────────────────────

const defaultButtonClasses =
  "inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

type FormatCardProps = {
  label: string;
  value: string;
  onCopy: () => void;
};
const FormatCard: FC<FormatCardProps> = React.memo(
  ({ label, value, onCopy }) => (
    <div className="p-4 bg-gray-50 rounded-lg text-center">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="font-mono text-indigo-600 break-all">{value}</p>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className={`${defaultButtonClasses} mt-2 text-sm`}
      >
        Copy
      </button>
    </div>
  )
);
FormatCard.displayName = "FormatCard";

type PaletteCardProps = {
  label: string;
  color: string;
  onCopy: () => void;
};
const PaletteCard: FC<PaletteCardProps> = React.memo(
  ({ label, color, onCopy }) => (
    <div
      className="p-4 rounded-lg text-center"
      style={{ backgroundColor: color }}
    >
      <p className="text-sm text-white mb-1">{label}</p>
      <p className="font-mono text-white break-all">{color}</p>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label} color`}
        className={`${defaultButtonClasses} mt-2 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 focus:ring-white`}
      >
        Copy
      </button>
    </div>
  )
);
PaletteCard.displayName = "PaletteCard";

// ─── Main Client Component ───────────────────────────────────────────────────

export const ColorToolkitClient: FC = () => {
  const [inputValue, setInputValue] = useState<string>("#4f46e5");
  const [hex, setHex] = useState<string>("");
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number } | null>(
    null
  );
  const [
    hsl,
    setHsl,
  ] = useState<{ h: number; s: number; l: number } | null>(null);
  const [
    cmyk,
    setCmyk,
  ] = useState<{ c: number; m: number; y: number; k: number } | null>(
    null
  );
  const [copyStatus, setCopyStatus] = useState<string>("");
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse color on input changes
  useEffect(() => {
    const v = inputValue.trim();
    let newHex: string | null = null;

    if (/^#?[0-9A-Fa-f]{6}$/.test(v)) {
      newHex = v.startsWith("#") ? v : `#${v}`;
    } else {
      const mRgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(
        v
      );
      if (mRgb) {
        const [, R, G, B] = mRgb.map(Number);
        newHex = rgbToHex(R, G, B);
      } else {
        const mHsl = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i.exec(
          v
        );
        if (mHsl) {
          const [, H, S, L] = mHsl.map(Number);
          const { r, g, b } = hslToRgb(H, S, L);
          newHex = rgbToHex(r, g, b);
        }
      }
    }

    if (newHex) {
      const rgbObj = hexToRgb(newHex)!;
      setHex(newHex);
      setRgb(rgbObj);
      setHsl(rgbToHsl(rgbObj.r, rgbObj.g, rgbObj.b));
      setCmyk(rgbToCmyk(rgbObj.r, rgbObj.g, rgbObj.b));
    } else {
      setHex("");
      setRgb(null);
      setHsl(null);
      setCmyk(null);
    }
  }, [inputValue]);

  // Copy helper
  const copyToClipboard = useCallback(async (text: string) => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied!");
    } catch {
      setCopyStatus("Copy failed");
    } finally {
      setIsCopying(false);
      setTimeout(() => setCopyStatus(""), 2000);
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setInputValue(e.target.value),
    []
  );

  const handleColorPicker = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setInputValue(e.target.value),
    []
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    inputRef.current?.focus();
  }, []);

  return (
    <section
      id="color-toolkit"
      aria-labelledby="color-toolkit-heading"
      className="space-y-8"
    >
      {/* Live region for copy feedback */}
      <div aria-live="polite" className="sr-only">
        {isCopying ? "Copying..." : copyStatus}
      </div>

      {/* Input controls */}
      <div className="max-w-md mx-auto space-y-4">
        <label
          htmlFor="color-input"
          className="block text-sm font-medium text-gray-800"
        >
          Color
        </label>
        <div className="flex items-center gap-3">
          <input
            id="color-input"
            type="color"
            value={hex || "#000000"}
            onChange={handleColorPicker}
            className="h-10 w-10 p-0 border-none rounded focus:outline-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="#rrggbb or rgb(...) or hsl(...)"
            className="flex-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-invalid={!!inputValue && !hex}
          />
        </div>
      </div>

      {/* Validation/Error */}
      {!!inputValue && !hex && (
        <p className="text-center text-red-600">
          Invalid format. Use #rrggbb, rgb(...), or hsl(...).
        </p>
      )}

      {/* Results */}
      {rgb && hsl && cmyk && (
        <div className="space-y-8">
          {/* Format outputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormatCard
              label="HEX"
              value={hex}
              onCopy={() => copyToClipboard(hex)}
            />
            <FormatCard
              label="RGB"
              value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
              onCopy={() =>
                copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
              }
            />
            <FormatCard
              label="HSL"
              value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
              onCopy={() =>
                copyToClipboard(
                  `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
                )
              }
            />
            <FormatCard
              label="CMYK"
              value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`}
              onCopy={() =>
                copyToClipboard(
                  `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
                )
              }
            />
          </div>

          {/* Palette: complement, tints, shade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Complement */}
            {(() => {
              const compH = complementary(hsl.h);
              const compRgb = hslToRgb(compH, hsl.s, hsl.l);
              const compHex = rgbToHex(
                compRgb.r,
                compRgb.g,
                compRgb.b
              );
              return (
                <PaletteCard
                  key="complement"
                  label="Complement"
                  color={compHex}
                  onCopy={() => copyToClipboard(compHex)}
                />
              );
            })()}

            {/* Tints */}
            {[20, 40].map((d) => {
              const tintHsl = shiftLightness(
                hsl.h,
                hsl.s,
                hsl.l,
                d
              );
              const tintRgb = hslToRgb(
                tintHsl.h,
                tintHsl.s,
                tintHsl.l
              );
              const tintHex = rgbToHex(
                tintRgb.r,
                tintRgb.g,
                tintRgb.b
              );
              return (
                <PaletteCard
                  key={`tint-${d}`}
                  label={`Tint +${d}%`}
                  color={tintHex}
                  onCopy={() => copyToClipboard(tintHex)}
                />
              );
            })}

            {/* Shade */}
            {(() => {
              const shadeHsl = shiftLightness(
                hsl.h,
                hsl.s,
                hsl.l,
                -20
              );
              const shadeRgb = hslToRgb(
                shadeHsl.h,
                shadeHsl.s,
                shadeHsl.l
              );
              const shadeHex = rgbToHex(
                shadeRgb.r,
                shadeRgb.g,
                shadeRgb.b
              );
              return (
                <PaletteCard
                  key="shade-20"
                  label="Shade -20%"
                  color={shadeHex}
                  onCopy={() => copyToClipboard(shadeHex)}
                />
              );
            })()}
          </div>

          {/* Contrast ratio */}
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">
              Contrast vs White
            </p>
            <p className="font-mono text-indigo-600">
              {contrastRatio(rgb, { r: 255, g: 255, b: 255 })}:1
            </p>
            <p className="mt-1 text-xs text-gray-500">
              WCAG AA requires ≥4.5:1
            </p>
          </div>
        </div>
      )}

      {/* Copy status visible */}
      {copyStatus && (
        <p
          className={`text-center mt-2 text-sm ${
            copyStatus.toLowerCase().includes("fail")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {copyStatus}
        </p>
      )}

      {/* Clear button */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleClear}
          disabled={!inputValue}
          className={`${defaultButtonClasses} disabled:opacity-50`}
        >
          Clear All
        </button>
      </div>
    </section>
  );
};