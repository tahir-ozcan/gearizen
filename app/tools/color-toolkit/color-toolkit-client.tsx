// app/tools/color-toolkit/color-toolkit-client.tsx
"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { ClipboardCopy, Trash2 } from "lucide-react";

/**
 * Color Toolkit Tool
 *
 * Enter or pick a color in HEX, RGB, or HSL, and instantly convert between formats.
 * Generate complementary, tints and shades. Copy any value with one click—all client-side.
 */

// Helper: clamp number between min/max
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Convert hex (“#aabbcc” or “aabbcc”) → rgb
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace(/^#/, "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  const num = parseInt(h, 16);
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
}

// Convert rgb → hex
function rgbToHex(r: number, g: number, b: number): string {
  const to2 = (n: number) => n.toString(16).padStart(2, "0");
  return `#${to2(clamp(r, 0, 255))}${to2(clamp(g, 0, 255))}${to2(clamp(b, 0, 255))}`;
}

// Convert rgb → hsl
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5
      ? d / (2 - max - min)
      : d / (max + min);
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

// Convert hsl → rgb
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  // normalize
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r1 = 0, g1 = 0, b1 = 0;

  if (h < 60) {
    [r1, g1, b1] = [c, x, 0];
  } else if (h < 120) {
    [r1, g1, b1] = [x, c, 0];
  } else if (h < 180) {
    [r1, g1, b1] = [0, c, x];
  } else if (h < 240) {
    [r1, g1, b1] = [0, x, c];
  } else if (h < 300) {
    [r1, g1, b1] = [x, 0, c];
  } else {
    [r1, g1, b1] = [c, 0, x];
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

// Generate a tint or shade by shifting lightness
function shiftLightness(
  h: number,
  s: number,
  l: number,
  delta: number
): { h: number; s: number; l: number } {
  return { h, s, l: clamp(l + delta, 0, 100) };
}

// Complementary hue
function complementary(h: number): number {
  return (h + 180) % 360;
}

export default function ColorToolkitClient() {
  const [input, setInput] = useState<string>("#4f46e5");
  const [parsedHex, setParsedHex] = useState<string>("");
  const [parsedRgb, setParsedRgb] = useState<{ r: number; g: number; b: number } | null>(null);
  const [parsedHsl, setParsedHsl] = useState<{ h: number; s: number; l: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse user input on every change
  useEffect(() => {
    const v = input.trim();
    let hex: string | null = null;

    // #rrggbb or rrggbb
    if (/^#?[0-9a-fA-F]{6}$/.test(v)) {
      hex = v.startsWith("#") ? v : `#${v}`;
    }

    // rgb(r,g,b)
    else {
      const rgbMatch = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(v);
      if (rgbMatch) {
        const r = clamp(+rgbMatch[1], 0, 255);
        const g = clamp(+rgbMatch[2], 0, 255);
        const b = clamp(+rgbMatch[3], 0, 255);
        hex = rgbToHex(r, g, b);
      } else {
        // hsl(h,s%,l%)
        const hslMatch = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i.exec(v);
        if (hslMatch) {
          const h = clamp(+hslMatch[1], 0, 360);
          const s = clamp(+hslMatch[2], 0, 100);
          const l = clamp(+hslMatch[3], 0, 100);
          const { r, g, b } = hslToRgb(h, s, l);
          hex = rgbToHex(r, g, b);
        }
      }
    }

    if (hex) {
      const rgb = hexToRgb(hex)!;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setParsedHex(hex);
      setParsedRgb(rgb);
      setParsedHsl(hsl);
    } else {
      setParsedHex("");
      setParsedRgb(null);
      setParsedHsl(null);
    }
  }, [input]);

  // Copy helper
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
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
      {/* Heading & Description */}
      <div className="text-center space-y-4">
        <h1
          id="color-toolkit-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Color Toolkit
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-700 leading-relaxed">
          Enter any HEX, RGB, or HSL color to convert formats, generate its complementary,
          tints and shades. Copy codes with one click—100% client-side.
        </p>
      </div>

      {/* Input */}
      <div className="max-w-lg mx-auto space-y-4">
        <label htmlFor="color-input" className="block text-sm font-medium text-gray-800">
          Color
        </label>
        <div className="flex items-center gap-3">
          <input
            id="color-input"
            type="color"
            value={parsedHex || "#000000"}
            onChange={(e) => setInput(e.target.value)}
            className="h-12 w-12 p-0 border-none"
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

      {/* Conversions */}
      {parsedRgb && parsedHsl && (
        <div className="max-w-xl mx-auto space-y-8">
          {/* Format Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/** HEX */}
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">HEX</p>
              <p className="font-mono text-lg text-indigo-600">{parsedHex}</p>
              <button
                onClick={() => copyToClipboard(parsedHex)}
                className="mt-2 text-gray-500 hover:text-indigo-600 transition"
              >
                <ClipboardCopy className="inline-block w-5 h-5" />
              </button>
            </div>

            {/** RGB */}
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">RGB</p>
              <p className="font-mono text-lg text-indigo-600">
                rgb({parsedRgb.r}, {parsedRgb.g}, {parsedRgb.b})
              </p>
              <button
                onClick={() =>
                  copyToClipboard(`rgb(${parsedRgb.r}, ${parsedRgb.g}, ${parsedRgb.b})`)
                }
                className="mt-2 text-gray-500 hover:text-indigo-600 transition"
              >
                <ClipboardCopy className="inline-block w-5 h-5" />
              </button>
            </div>

            {/** HSL */}
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">HSL</p>
              <p className="font-mono text-lg text-indigo-600">
                hsl({parsedHsl.h}, {parsedHsl.s}%, {parsedHsl.l}%)
              </p>
              <button
                onClick={() =>
                  copyToClipboard(`hsl(${parsedHsl.h}, ${parsedHsl.s}%, ${parsedHsl.l}%)`)
                }
                className="mt-2 text-gray-500 hover:text-indigo-600 transition"
              >
                <ClipboardCopy className="inline-block w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Palette: Complement, Tints & Shades */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/** Complementary */}
            {(() => {
              const compH = complementary(parsedHsl.h);
              const compHsl = { ...parsedHsl, h: compH };
              const { r, g, b } = hslToRgb(compHsl.h, compHsl.s, compHsl.l);
              const hex = rgbToHex(r, g, b);
              return (
                <div
                  key="comp"
                  className="p-4 rounded-lg text-center"
                  style={{ background: hex }}
                >
                  <p className="text-sm text-white mb-1">Complement</p>
                  <p className="font-mono text-white">{hex}</p>
                  <button
                    onClick={() => copyToClipboard(hex)}
                    className="mt-2 text-white hover:underline"
                  >
                    Copy
                  </button>
                </div>
              );
            })()}

            {/** Tints */}
            {[20, 40].map((delta) => {
              const tint = shiftLightness(parsedHsl.h, parsedHsl.s, parsedHsl.l, delta);
              const { r, g, b } = hslToRgb(tint.h, tint.s, tint.l);
              const hex = rgbToHex(r, g, b);
              return (
                <div
                  key={`tint${delta}`}
                  className="p-4 rounded-lg text-center"
                  style={{ background: hex }}
                >
                  <p className="text-sm text-white mb-1">Tint +{delta}%</p>
                  <p className="font-mono text-white">{hex}</p>
                  <button
                    onClick={() => copyToClipboard(hex)}
                    className="mt-2 text-white hover:underline"
                  >
                    Copy
                  </button>
                </div>
              );
            })}

            {/** Shade */}
            {(() => {
              const shade = shiftLightness(parsedHsl.h, parsedHsl.s, parsedHsl.l, -20);
              const { r, g, b } = hslToRgb(shade.h, shade.s, shade.l);
              const hex = rgbToHex(r, g, b);
              return (
                <div
                  key="shade"
                  className="p-4 rounded-lg text-center"
                  style={{ background: hex }}
                >
                  <p className="text-sm text-white mb-1">Shade -20%</p>
                  <p className="font-mono text-white">{hex}</p>
                  <button
                    onClick={() => copyToClipboard(hex)}
                    className="mt-2 text-white hover:underline"
                  >
                    Copy
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Clear Input */}
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