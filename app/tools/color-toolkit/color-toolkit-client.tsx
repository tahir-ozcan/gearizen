// app/tools/color-toolkit/color-toolkit-client.tsx
"use client";

import React, {
  FC,
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  useCallback,
} from "react";
import {
  ClipboardCopy,
  Trash2,
} from "lucide-react";

export interface ColorToolkitClientProps {
  /** Main heading text */
  heading?: string;
  /** Subtitle/description text */
  description?: string;
  /** Gradient classes for headings and accents */
  gradientClasses?: string;
  /** Focus‑ring Tailwind class */
  focusRingClass?: string;
  /** Label for the color input */
  inputLabel?: string;
  /** Placeholder for the text input */
  placeholder?: string;
  /** Text for copy buttons */
  copyButtonLabel?: string;
  /** Text for clear button */
  clearButtonLabel?: string;
  /** Extra classes for the root container */
  rootClassName?: string;
  /** Override CSS class for the color picker input */
  colorPickerClassName?: string;
  /** Override CSS class for the text input */
  textInputClassName?: string;
  /** Override CSS class for primary action buttons (copy) */
  primaryButtonClassName?: string;
  /** Override CSS class for secondary action buttons (clear) */
  secondaryButtonClassName?: string;
}

//
// ─── Utility Functions ─────────────────────────────────────────────────────────
//

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
    (Math.min(L1, L2) + 0.05)).toFixed(2);
}

//
// ─── Subcomponents ────────────────────────────────────────────────────────────
//

type CardProps = {
  label: string;
  value: string;
  onCopy: () => void;
  copyButtonLabel: string;
  buttonClassName: string;
};

const FormatCard: FC<CardProps> = ({
  label,
  value,
  onCopy,
  copyButtonLabel,
  buttonClassName,
}) => (
  <div className="p-4 bg-gray-50 rounded-lg text-center">
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="font-mono text-indigo-600 break-all">{value}</p>
    <button
      type="button"
      onClick={onCopy}
      aria-label={`Copy ${label}`}
      className={`${buttonClassName} mt-2`}
    >
      <ClipboardCopy className="w-5 h-5" />
      {copyButtonLabel}
    </button>
  </div>
);

const PaletteCard: FC<CardProps> = ({
  label,
  value,
  onCopy,
  copyButtonLabel,
  buttonClassName,
}) => (
  <div
    className="p-4 rounded-lg text-center"
    style={{ backgroundColor: value }}
  >
    <p className="text-sm text-white mb-1">{label}</p>
    <p className="font-mono text-white break-all">{value}</p>
    <button
      type="button"
      onClick={onCopy}
      aria-label={`Copy ${label}`}
      className={`${buttonClassName} mt-2 focus:ring-white`}
    >
      <ClipboardCopy className="w-5 h-5" />
      {copyButtonLabel}
    </button>
  </div>
);

//
// ─── Main Component ────────────────────────────────────────────────────────────
//

export const ColorToolkitClient: FC<ColorToolkitClientProps> = ({
  heading = "Color Toolkit: Converter & Contrast Checker",
  description =
    "Translate colors between HEX, RGB, HSL & CMYK and verify WCAG‑compliant contrast ratios—copy any code or ratio with one click.",
  gradientClasses = "from-purple-500 via-pink-500 to-yellow-400",
  focusRingClass = "focus:ring-purple-500",
  inputLabel = "Color",
  placeholder = "#rrggbb or rgb(...) or hsl(...)",
  copyButtonLabel = "Copy",
  clearButtonLabel = "Clear All",
  rootClassName = "",
  colorPickerClassName = "",
  textInputClassName = "",
  primaryButtonClassName,
  secondaryButtonClassName,
}) => {
  const [inputValue, setInputValue] = useState("#4f46e5");
  const [hex, setHex] = useState("");
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number } | null>(
    null
  );
  const [hsl, setHsl] = useState<{ h: number; s: number; l: number } | null>(
    null
  );
  const [
    cmyk,
    setCmyk,
  ] = useState<{ c: number; m: number; y: number; k: number } | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse inputValue into all formats
  useEffect(() => {
    const v = inputValue.trim();
    let resolvedHex: string | null = null;

    if (/^#?[0-9A-Fa-f]{6}$/.test(v)) {
      resolvedHex = v.startsWith("#") ? v : `#${v}`;
    } else {
      const mRgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(
        v
      );
      if (mRgb) {
        const [, R, G, B] = mRgb.map(Number);
        resolvedHex = rgbToHex(R, G, B);
      } else {
        const mHsl = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i.exec(
          v
        );
        if (mHsl) {
          const [, H, S, L] = mHsl.map(Number);
          const { r, g, b } = hslToRgb(H, S, L);
          resolvedHex = rgbToHex(r, g, b);
        }
      }
    }

    if (resolvedHex) {
      const cRgb = hexToRgb(resolvedHex)!;
      setHex(resolvedHex);
      setRgb(cRgb);
      setHsl(rgbToHsl(cRgb.r, cRgb.g, cRgb.b));
      setCmyk(rgbToCmyk(cRgb.r, cRgb.g, cRgb.b));
    } else {
      setHex("");
      setRgb(null);
      setHsl(null);
      setCmyk(null);
    }
  }, [inputValue]);

  // Clipboard helper
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      /* silent */
    });
  }, []);

  // Button classes
  const primaryBtnClasses =
    primaryButtonClassName ??
    "inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed";
  const secondaryBtnClasses =
    secondaryButtonClassName ??
    "inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:bg-gray-200 transition";

  return (
    <section
      id="color-toolkit"
      aria-labelledby="color-toolkit-heading"
      className={`text-gray-900 antialiased ${rootClassName}`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center space-y-6 mb-10">
          <h1
            id="color-toolkit-heading"
            className={`
              bg-clip-text text-transparent
              bg-gradient-to-r ${gradientClasses}
              text-4xl sm:text-5xl md:text-6xl
              font-extrabold tracking-tight
            `}
          >
            {heading}
          </h1>
          <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="text-lg sm:text-xl text-gray-600">
            {description}
          </p>
        </header>

        {/* Input */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={hex || "#000000"}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              className={`p-0 border-0 h-10 w-10 rounded ${colorPickerClassName}`}
            />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className={`
                flex-1 p-3 bg-gray-50 border border-gray-300
                rounded-md focus:outline-none ${focusRingClass}
                ${textInputClassName}
              `}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setInputValue("");
              inputRef.current?.focus();
            }}
            className={secondaryBtnClasses}
          >
            <Trash2 className="w-5 h-5" />
            {clearButtonLabel}
          </button>
        </div>

        {/* Format Cards */}
        {hex && rgb && hsl && cmyk && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
              <FormatCard
                label="HEX"
                value={hex}
                onCopy={() => copyToClipboard(hex)}
                copyButtonLabel={copyButtonLabel}
                buttonClassName={primaryBtnClasses}
              />
              <FormatCard
                label="RGB"
                value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                onCopy={() =>
                  copyToClipboard(
                    `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
                  )
                }
                copyButtonLabel={copyButtonLabel}
                buttonClassName={primaryBtnClasses}
              />
              <FormatCard
                label="HSL"
                value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                onCopy={() =>
                  copyToClipboard(
                    `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
                  )
                }
                copyButtonLabel={copyButtonLabel}
                buttonClassName={primaryBtnClasses}
              />
              <FormatCard
                label="CMYK"
                value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`}
                onCopy={() =>
                  copyToClipboard(
                    `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
                  )
                }
                copyButtonLabel={copyButtonLabel}
                buttonClassName={primaryBtnClasses}
              />
            </div>

            {/* Palette Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
              {/* Complement */}
              {(() => {
                const compH = complementary(hsl.h);
                const { r, g, b } = hslToRgb(compH, hsl.s, hsl.l);
                const compHex = rgbToHex(r, g, b);
                return (
                  <PaletteCard
                    label="Complement"
                    value={compHex}
                    onCopy={() => copyToClipboard(compHex)}
                    copyButtonLabel={copyButtonLabel}
                    buttonClassName={primaryBtnClasses}
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
                const { r, g, b } = hslToRgb(
                  tintHsl.h,
                  tintHsl.s,
                  tintHsl.l
                );
                const tintHex = rgbToHex(r, g, b);
                return (
                  <PaletteCard
                    key={`tint-${d}`}
                    label={`Tint +${d}%`}
                    value={tintHex}
                    onCopy={() => copyToClipboard(tintHex)}
                    copyButtonLabel={copyButtonLabel}
                    buttonClassName={primaryBtnClasses}
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
                const { r, g, b } = hslToRgb(
                  shadeHsl.h,
                  shadeHsl.s,
                  shadeHsl.l
                );
                const shadeHex = rgbToHex(r, g, b);
                return (
                  <PaletteCard
                    label="Shade −20%"
                    value={shadeHex}
                    onCopy={() => copyToClipboard(shadeHex)}
                    copyButtonLabel={copyButtonLabel}
                    buttonClassName={primaryBtnClasses}
                  />
                );
              })()}
            </div>

            {/* Contrast Ratio */}
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
          </>
        )}
      </div>
    </section>
  );
};