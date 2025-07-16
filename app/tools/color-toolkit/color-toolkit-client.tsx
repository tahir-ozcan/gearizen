// app/tools/color-toolkit/color-toolkit-client.tsx
"use client";

import React, { FC, useState, useEffect, ChangeEvent, useRef } from "react";

/**
 * Props to override classes and labels at will.
 * Any prop you don’t set will fall back to a polished default.
 */
export interface ColorToolkitClientProps {
  // Class‐name overrides
  containerClassName?: string;
  headingWrapperClassName?: string;
  headingClassName?: string;
  dividerClassName?: string;
  descriptionClassName?: string;
  inputContainerClassName?: string;
  colorPickerClassName?: string;
  textInputClassName?: string;
  formatGridClassName?: string;
  paletteGridClassName?: string;
  formatCardClassName?: string;
  paletteCardClassName?: string;
  copyButtonClassName?: string;
  clearButtonClassName?: string;

  // Label overrides
  labels?: {
    mainHeading?: string;
    subHeading?: string;
    colorLabel?: string;
    placeholder?: string;
    clearButton?: string;
    copySuccess?: string;
    copyFailure?: string;
  };
}

// ─── Utility Functions ─────────────────────────────────────────────────────────

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
  const to2 = (n: number) => clamp(n, 0, 255).toString(16).padStart(2, "0");
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToRgb(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r1, g1, b1] = [0, 0, 0];
  if (h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h < 180) [r1, g1, b1] = [0, c, x];
  else if (h < 240) [r1, g1, b1] = [0, x, c];
  else if (h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}
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
function shiftLightness(h: number, s: number, l: number, delta: number) {
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
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}
function contrastRatio(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number }
) {
  const L1 = luminance(c1.r, c1.g, c1.b);
  const L2 = luminance(c2.r, c2.g, c2.b);
  return ((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2);
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

type FormatCardProps = {
  label: string;
  value: string;
  onCopy: () => void;
  className?: string;
  copyButtonClassName?: string;
};
const FormatCard: FC<FormatCardProps> = ({
  label,
  value,
  onCopy,
  className = "",
  copyButtonClassName = "",
}) => (
  <div className={`p-4 bg-gray-50 rounded-lg text-center ${className}`}>
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="font-mono text-indigo-600 break-all">{value}</p>
    <button
      onClick={onCopy}
      aria-label={`Copy ${label}`}
      className={`mt-2 ${copyButtonClassName} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
    >
      Copy
    </button>
  </div>
);

type PaletteCardProps = {
  label: string;
  color: string;
  onCopy: () => void;
  className?: string;
  copyButtonClassName?: string;
};
const PaletteCard: FC<PaletteCardProps> = ({
  label,
  color,
  onCopy,
  className = "",
  copyButtonClassName = "",
}) => (
  <div
    className={`p-4 rounded-lg text-center ${className}`}
    style={{ backgroundColor: color }}
  >
    <p className="text-sm text-white mb-1">{label}</p>
    <p className="font-mono text-white break-all">{color}</p>
    <button
      onClick={onCopy}
      aria-label={`Copy ${label} color`}
      className={`mt-2 ${copyButtonClassName} focus:outline-none focus:ring-2 focus:ring-white`}
    >
      Copy
    </button>
  </div>
);

const defaultClasses = {
  button: [
    "inline-flex",
    "items-center",
    "gap-2",
    "px-6",
    "py-2",
    "bg-gray-100",
    "text-gray-700",
    "rounded-md",
    "hover:bg-gray-200",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-gray-300",
    "transition",
  ].join(" "),
};

// ─── Main Component ────────────────────────────────────────────────────────────

export const ColorToolkitClient: FC<ColorToolkitClientProps> = ({
  containerClassName = "",
  headingWrapperClassName = "",
  headingClassName = "",
  dividerClassName = "",
  descriptionClassName = "",
  inputContainerClassName = "",
  colorPickerClassName = "",
  textInputClassName = "",
  formatGridClassName = "",
  paletteGridClassName = "",
  formatCardClassName = "",
  paletteCardClassName = "",
  copyButtonClassName = "",
  clearButtonClassName = "",
  labels = {},
}) => {
  // State
  const [inputValue, setInputValue] = useState<string>("#4f46e5");
  const [hex, setHex] = useState<string>("");
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number } | null>(
    null
  );
  const [hsl, setHsl] = useState<{ h: number; s: number; l: number } | null>(
    null
  );
  const [cmyk, setCmyk] = useState<{
    c: number;
    m: number;
    y: number;
    k: number;
  } | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse on input change
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
  }, [inputValue]);

  // Copy helper with ARIA‐live status
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(labels.copySuccess || "Copied!");
    } catch {
      setCopyStatus(labels.copyFailure || "Copy failed");
    }
    setTimeout(() => setCopyStatus(""), 2000);
  };

  return (
    <section
      id="color-toolkit"
      aria-labelledby="color-toolkit-heading"
      className={`space-y-16 antialiased mx-auto ${containerClassName}`}
    >
      {/* Hidden live region for copy status */}
      <div aria-live="polite" className="sr-only">
        {copyStatus}
      </div>

      {/* Heading */}
      <div
        className={`text-center space-y-6 ${headingWrapperClassName}`}
      >
        <h1
          id="color-toolkit-heading"
          className={`${
            labels.mainHeading
              ? ""
              : "bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]"
          } text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight ${
            headingClassName
          }`}
        >
          {labels.mainHeading ||
            "Color Toolkit: Converter & Contrast Checker"}
        </h1>
        <div
          className={`mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24] ${dividerClassName}`}
        />
        <p
          className={`mx-auto max-w-2xl text-lg sm:text-xl text-gray-700 leading-relaxed ${descriptionClassName}`}
        >
          {labels.subHeading ||
            "Translate colors between HEX, RGB, HSL & CMYK and verify WCAG-compliant contrast ratios—copy any code or ratio with one click."}
        </p>
      </div>

      {/* Input */}
      <div
        className={`max-w-lg mx-auto space-y-4 ${inputContainerClassName}`}
      >
        <label
          htmlFor="color-input"
          className="block text-sm font-medium text-gray-800"
        >
          {labels.colorLabel || "Color"}
        </label>
        <div className="flex items-center gap-3">
          <input
            id="color-input"
            type="color"
            value={hex || "#000000"}
            onChange={(e) => setInputValue(e.target.value)}
            className={`rounded ${colorPickerClassName}`}
          />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
            placeholder={
              labels.placeholder || "#rrggbb or rgb(...) or hsl(...)"
            }
            className={`flex-1 ${textInputClassName}`}
          />
        </div>
      </div>

      {/* Formats & Palette */}
      {rgb && hsl && cmyk && (
        <div className="space-y-8">
          {/* Format Cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-4 gap-4 ${formatGridClassName}`}>
            <FormatCard
              label="HEX"
              value={hex}
              onCopy={() => copyToClipboard(hex)}
              className={formatCardClassName}
              copyButtonClassName={copyButtonClassName}
            />
            <FormatCard
              label="RGB"
              value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
              onCopy={() =>
                copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
              }
              className={formatCardClassName}
              copyButtonClassName={copyButtonClassName}
            />
            <FormatCard
              label="HSL"
              value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
              onCopy={() =>
                copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)
              }
              className={formatCardClassName}
              copyButtonClassName={copyButtonClassName}
            />
            <FormatCard
              label="CMYK"
              value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`}
              onCopy={() =>
                copyToClipboard(
                  `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
                )
              }
              className={formatCardClassName}
              copyButtonClassName={copyButtonClassName}
            />
          </div>

          {/* Palette: Complement, Tints, Shades */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-4 gap-4 ${paletteGridClassName}`}
          >
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
                  className={paletteCardClassName}
                  copyButtonClassName={copyButtonClassName}
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
                  className={paletteCardClassName}
                  copyButtonClassName={copyButtonClassName}
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
                  className={paletteCardClassName}
                  copyButtonClassName={copyButtonClassName}
                />
              );
            })()}
          </div>

          {/* Contrast Ratio */}
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Contrast vs White</p>
            <p className="font-mono text-indigo-600">
              {contrastRatio(rgb, { r: 255, g: 255, b: 255 })}:1
            </p>
            <p className="mt-1 text-xs text-gray-500">
              WCAG AA requires ≥4.5:1
            </p>
          </div>
        </div>
      )}

      {/* Clear */}
      <div className="text-center">
        <button
          onClick={() => {
            setInputValue("");
            inputRef.current?.focus();
          }}
          className={`${defaultClasses.button} ${clearButtonClassName}`}
        >
          {labels.clearButton || "Clear All"}
        </button>
      </div>
    </section>
  );
};