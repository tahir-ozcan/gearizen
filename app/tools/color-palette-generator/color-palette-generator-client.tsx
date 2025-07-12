"use client";
// On any user interaction (base color or scheme change), generate exactly N colors.
// N is determined by the current value of the "Colors" control and must persist
// across interactions without resetting.
import { useState, ChangeEvent, useEffect } from "react";
import Input from "@/components/Input";
import {
  generatePalette,
  PaletteScheme,
  paletteToJson,
  paletteToAse,
} from "@/lib/color-palette";
import {
  hexToRgb,
  rgbToHsl,
  formatRgb,
  formatHsl,
} from "@/lib/color-conversion";

export default function ColorPaletteGeneratorClient() {
  const [color, setColor] = useState("#ff0000");
  const [scheme, setScheme] = useState<PaletteScheme>("analogous");
  const [count, setCount] = useState(5);
  const [palette, setPalette] = useState<string[]>(generatePalette("#ff0000"));
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      setPalette(generatePalette(color, scheme, count));
    } catch {
      setPalette([]);
    }
  }, [color, scheme, count]);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const handleColor = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const downloadJson = () => {
    const blob = new Blob([paletteToJson(palette)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette.json";
    a.click();
  };

  const downloadAse = () => {
    const data = paletteToAse(palette);
    const blob = new Blob([data], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette.ase";
    a.click();
  };

  return (
    <section
      id="color-palette-generator"
      aria-labelledby="color-palette-generator-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="color-palette-generator-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Color Palette Generator
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Choose a base color and scheme to instantly generate a matching palette.
        On any user interaction (base color or scheme change), generate exactly
        N colors.
      </p>
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <label
            htmlFor="base-color"
            className="block mb-1 font-medium text-gray-800"
          >
            Base Color
          </label>
          <Input
            id="base-color"
            type="color"
            value={color}
            onChange={handleColor}
            className="h-10 p-0"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="scheme"
              value="analogous"
              checked={scheme === "analogous"}
              onChange={() => setScheme("analogous")}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Analogous</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="scheme"
              value="complementary"
              checked={scheme === "complementary"}
              onChange={() => setScheme("complementary")}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Complementary</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="scheme"
              value="triadic"
              checked={scheme === "triadic"}
              onChange={() => setScheme("triadic")}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Triadic</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="scheme"
              value="tetradic"
              checked={scheme === "tetradic"}
              onChange={() => setScheme("tetradic")}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Tetradic</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="scheme"
              value="monochromatic"
              checked={scheme === "monochromatic"}
              onChange={() => setScheme("monochromatic")}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Monochromatic</span>
          </label>
        </div>
        <div>
          <label
            htmlFor="count"
            className="block mb-1 font-medium text-gray-800"
          >
            Colors: <span className="font-semibold">{count}</span>
          </label>
          <input
            id="count"
            type="range"
            min={2}
            max={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      {palette.length > 0 && (
        <ul className="mt-12 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {palette.map((hex) => {
            const rgb = hexToRgb(hex)!;
            const hsl = rgbToHsl(rgb);
            return (
              <li key={hex} className="group text-center">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(hex)}
                  className="swatch relative w-full h-20 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ backgroundColor: hex }}
                >
                  <span className="sr-only">Copy {hex}</span>
                  <div className="absolute inset-0 hidden flex-col items-center justify-center bg-white/80 text-xs font-mono group-hover:flex group-focus:flex">
                    <span>{hex}</span>
                    <span>{formatRgb(rgb)}</span>
                    <span>{formatHsl(hsl)}</span>
                    <span className="mt-1 px-1.5 py-0.5 bg-indigo-600 text-white rounded">
                      Copy
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button type="button" onClick={downloadJson} className="btn-secondary">
          Download JSON
        </button>
        <button type="button" onClick={downloadAse} className="btn-secondary">
          Download ASE
        </button>
      </div>
    </section>
  );
}
