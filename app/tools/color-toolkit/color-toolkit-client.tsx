// app/tools/color-toolkit/color-toolkit-client.tsx
"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { ClipboardCopy, Trash2 } from "lucide-react";

/**
 * Color Toolkit Client
 *
 * Translate colors between HEX, RGB, HSL & CMYK and verify WCAG-compliant contrast ratios easily.
 * Enter or pick a color, convert formats, generate complementary, tints, shades—and check contrast.
 * Copy any code with one click—100% client-side.
 */

// ─── Helpers ────────────────────────────────────────────────────────────────────

// Clamp a number between min and max
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// HEX → RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace(/^#/, "").trim();
  if (!/^[0-9A-Fa-f]{6}$/.test(h)) return null;
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
}

// RGB → HEX
function rgbToHex(r: number, g: number, b: number): string {
  const to2 = (n: number) => clamp(n, 0, 255).toString(16).padStart(2, "0");
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

// RGB → HSL
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
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
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// HSL → RGB
function hslToRgb(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r1 = 0,
      g1 = 0,
      b1 = 0;
  if (h < 60) {
    r1 = c; g1 = x; b1 = 0;
  } else if (h < 120) {
    r1 = x; g1 = c; b1 = 0;
  } else if (h < 180) {
    r1 = 0; g1 = c; b1 = x;
  } else if (h < 240) {
    r1 = 0; g1 = x; b1 = c;
  } else if (h < 300) {
    r1 = x; g1 = 0; b1 = c;
  } else {
    r1 = c; g1 = 0; b1 = x;
  }
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

// Convert RGB → CMYK
function rgbToCmyk(r: number, g: number, b: number) {
  const rr = r / 255, gg = g / 255, bb = b / 255;
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

// Shift lightness for tints/shades
function shiftLightness(h: number, s: number, l: number, delta: number) {
  return { h, s, l: clamp(l + delta, 0, 100) };
}

// Complementary hue
function complementary(h: number) {
  return (h + 180) % 360;
}

// Calculate relative luminance for contrast
function luminance(r: number, g: number, b: number) {
  const toLin = (v: number) => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

// Contrast ratio between two colors
function contrastRatio(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number }
) {
  const L1 = luminance(c1.r, c1.g, c1.b);
  const L2 = luminance(c2.r, c2.g, c2.b);
  return ((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ColorToolkitClient() {
  const [input, setInput] = useState<string>("#4f46e5");
  const [hex, setHex] = useState<string>("");
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number } | null>(null);
  const [hsl, setHsl] = useState<{ h: number; s: number; l: number } | null>(null);
  const [cmyk, setCmyk] = useState<{ c: number; m: number; y: number; k: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse on input change
  useEffect(() => {
    const v = input.trim();
    let newHex: string | null = null;

    if (/^#?[0-9A-Fa-f]{6}$/.test(v)) {
      newHex = v.startsWith("#") ? v : `#${v}`;
    } else {
      const mRgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(v);
      if (mRgb) {
        const [, R, G, B] = mRgb.map(Number);
        newHex = rgbToHex(R, G, B);
      } else {
        const mHsl = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i.exec(v);
        if (mHsl) {
          const [, H, S, L] = mHsl.map(Number);
          const { r, g, b } = hslToRgb(H, S, L);
          newHex = rgbToHex(r, g, b);
        }
      }
    }

    if (newHex) {
      const cRgb = hexToRgb(newHex)!;
      const cHsl = rgbToHsl(cRgb.r, cRgb.g, cRgb.b);
      const cCmyk = rgbToCmyk(cRgb.r, cRgb.g, cRgb.b);
      setHex(newHex);
      setRgb(cRgb);
      setHsl(cHsl);
      setCmyk(cCmyk);
    } else {
      setHex("");
      setRgb(null);
      setHsl(null);
      setCmyk(null);
    }
  }, [input]);

  // Copy helper
  const copyToClipboard = async (t: string) => {
    try {
      await navigator.clipboard.writeText(t);
      alert("✅ Copied!");
    } catch {
      alert("❌ Copy failed");
    }
  };

  return (
    <section
      id="color-toolkit"
      aria-labelledby="color-toolkit-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading */}
      <div className="text-center space-y-4 sm:px-0">
        <h1
          id="color-toolkit-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Color Toolkit: Converter & Contrast Checker
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Translate colors between HEX, RGB, HSL & CMYK and verify WCAG-compliant contrast ratios—copy any code or ratio with one click.
        </p>
      </div>

      {/* Input */}
      <div className="max-w-lg mx-auto space-y-4 sm:px-0">
        <label htmlFor="color-input" className="block text-sm font-medium text-gray-800">
          Color
        </label>
        <div className="flex items-center gap-3">
          <input
            id="color-input"
            type="color"
            value={hex || "#000000"}
            onChange={(e) => setInput(e.target.value)}
            className="h-12 w-12 border-none p-0"
          />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="#rrggbb or rgb(...) or hsl(...)"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 font-mono transition"
          />
        </div>
      </div>

      {/* Formats & Palette */}
      {rgb && hsl && cmyk && (
        <div className="max-w-xl mx-auto space-y-8 sm:px-0">
          {/* Format Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormatCard label="HEX" value={hex} onCopy={() => copyToClipboard(hex)} />
            <FormatCard
              label="RGB"
              value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
              onCopy={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
            />
            <FormatCard
              label="HSL"
              value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
              onCopy={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
            />
            <FormatCard
              label="CMYK"
              value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`}
              onCopy={() =>
                copyToClipboard(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`)
              }
            />
          </div>

          {/* Palette: Complement, Tints, Shades */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Complement */}
            {(() => {
              const compH = complementary(hsl.h);
              const { r, g, b } = hslToRgb(compH, hsl.s, hsl.l);
              const compHex = rgbToHex(r, g, b);
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
              const tintHsl = shiftLightness(hsl.h, hsl.s, hsl.l, d);
              const { r, g, b } = hslToRgb(tintHsl.h, tintHsl.s, tintHsl.l);
              const tintHex = rgbToHex(r, g, b);
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
              const shadeHsl = shiftLightness(hsl.h, hsl.s, hsl.l, -20);
              const { r, g, b } = hslToRgb(shadeHsl.h, shadeHsl.s, shadeHsl.l);
              const shadeHex = rgbToHex(r, g, b);
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

          {/* Contrast Ratio */}
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Contrast Ratio vs White</p>
            <p className="font-mono text-lg text-indigo-600">
              {contrastRatio(rgb, { r: 255, g: 255, b: 255 })}:1
            </p>
            <p className="mt-1 text-xs text-gray-500">WCAG AA requires ≥4.5:1</p>
          </div>
        </div>
      )}

      {/* Clear */}
      <div className="text-center">
        <button
          onClick={() => {
            setInput("");
            inputRef.current?.focus();
          }}
          className="
            inline-flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700
            rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300
            transition
          "
        >
          <Trash2 className="w-5 h-5" />
          Clear All
        </button>
      </div>
    </section>
  );
}

// ─── Subcomponents ───────────────────────────────────────────────────────────

function FormatCard({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg text-center">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="font-mono text-indigo-600 break-all">{value}</p>
      <button onClick={onCopy} className="mt-2 text-gray-500 hover:text-indigo-600 transition">
        <ClipboardCopy className="inline-block w-5 h-5" />
      </button>
    </div>
  );
}

function PaletteCard({
  label,
  color,
  onCopy,
}: {
  label: string;
  color: string;
  onCopy: () => void;
}) {
  return (
    <div className="p-4 rounded-lg text-center" style={{ background: color }}>
      <p className="text-sm text-white mb-1">{label}</p>
      <p className="font-mono text-white break-all">{color}</p>
      <button onClick={onCopy} className="mt-2 text-white hover:underline">
        Copy
      </button>
    </div>
  );
}