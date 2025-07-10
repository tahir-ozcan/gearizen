// app/tools/color-contrast-checker/color-contrast-checker-client.tsx

"use client";

import { useState, useMemo, ChangeEvent } from "react";

function hexToRgb(hex: string): [number, number, number] {
  let cleaned = hex.replace(/^#/, "");
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const bigint = parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function luminance([r, g, b]: [number, number, number]): number {
  const [R, G, B] = [r, g, b].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export default function ColorContrastCheckerClient() {
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");

  const contrastRatio = useMemo(() => {
    const L1 = luminance(hexToRgb(fg));
    const L2 = luminance(hexToRgb(bg));
    const [lighter, darker] = L1 > L2 ? [L1, L2] : [L2, L1];
    return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
  }, [fg, bg]);

  const passes = useMemo(() => {
    return {
      aaNormal: contrastRatio >= 4.5,
      aaLarge: contrastRatio >= 3,
      aaaNormal: contrastRatio >= 7,
      aaaLarge: contrastRatio >= 4.5,
    };
  }, [contrastRatio]);

  const copyCss = async () => {
    const css = `color: ${fg}; background-color: ${bg};`;
    try {
      await navigator.clipboard.writeText(css);
      alert("✅ CSS copied to clipboard!");
    } catch {
      alert("❌ Failed to copy CSS.");
    }
  };

  const handleColorChange = (
    setter: (v: string) => void
  ) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  return (
    <section
      id="color-contrast-checker"
      aria-labelledby="contrast-heading"
      className="container-responsive py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="contrast-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Color Contrast Checker
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Verify WCAG compliance by checking contrast ratio between foreground
        and background colors. 100% client-side, no signup required.
      </p>

      {/* Color Pickers */}
      <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-8 space-y-4 sm:space-y-0 mb-10">
        <label className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Text Color:</span>
          <input
            type="color"
            value={fg}
            onChange={handleColorChange(setFg)}
            className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer"
            aria-label="Choose text color"
          />
          <span className="font-mono text-sm">{fg}</span>
        </label>
        <label className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            Background:
          </span>
          <input
            type="color"
            value={bg}
            onChange={handleColorChange(setBg)}
            className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer"
            aria-label="Choose background color"
          />
          <span className="font-mono text-sm">{bg}</span>
        </label>
      </div>

      {/* Preview */}
      <div
        className="p-8 rounded-lg border border-gray-200 text-center mb-10"
        style={{ color: fg, backgroundColor: bg }}
      >
        <p className="text-lg font-medium">The quick brown fox jumps over the lazy dog</p>
      </div>

      {/* Results */}
      <div className="max-w-md mx-auto space-y-4 mb-10">
        <p className="text-center text-xl font-semibold">
          Contrast Ratio:{" "}
          <span className="text-indigo-600">{contrastRatio}:1</span>
        </p>
        <ul className="space-y-1 text-gray-700">
          <li>
            WCAG AA (Normal text):{" "}
            <span
              className={
                passes.aaNormal ? "text-green-600" : "text-red-600"
              }
            >
              {passes.aaNormal ? "Pass" : "Fail"}
            </span>
          </li>
          <li>
            WCAG AA (Large text ≥18pt):{" "}
            <span
              className={
                passes.aaLarge ? "text-green-600" : "text-red-600"
              }
            >
              {passes.aaLarge ? "Pass" : "Fail"}
            </span>
          </li>
          <li>
            WCAG AAA (Normal text):{" "}
            <span
              className={
                passes.aaaNormal ? "text-green-600" : "text-red-600"
              }
            >
              {passes.aaaNormal ? "Pass" : "Fail"}
            </span>
          </li>
          <li>
            WCAG AAA (Large text):{" "}
            <span
              className={
                passes.aaaLarge ? "text-green-600" : "text-red-600"
              }
            >
              {passes.aaaLarge ? "Pass" : "Fail"}
            </span>
          </li>
        </ul>
      </div>

      {/* Copy CSS */}
      <div className="text-center">
        <button
          onClick={copyCss}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm font-medium"
        >
          Copy CSS Snippet
        </button>
      </div>
    </section>
  );
}