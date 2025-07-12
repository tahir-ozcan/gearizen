// app/tools/color-converter/color-converter-client.tsx
"use client";

import { useState, ChangeEvent, useMemo } from "react";
import { convertColor } from "@/lib/color-conversion";
import { generatePalette } from "@/lib/color-palette";
import Input from "@/components/Input";

export default function ColorConverterClient() {
  const [input, setInput] = useState("#ff0000");
  const [hex, setHex] = useState("#ff0000");
  const [rgb, setRgb] = useState("rgb(255, 0, 0)");
  const [hsl, setHsl] = useState("hsl(0, 100%, 50%)");
  const [cmyk, setCmyk] = useState("cmyk(0%, 100%, 100%, 0%)");
  const [error, setError] = useState<string | null>(null);

  const updateAll = (value: string) => {
    const res = convertColor(value);
    if (res) {
      setHex(res.hex);
      setRgb(res.rgb);
      setHsl(res.hsl);
      setCmyk(res.cmyk);
      setError(null);
      return true;
    }
    setError("Invalid color format");
    return false;
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    updateAll(val);
  };

  const handleHex = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHex(val);
    if (updateAll(val)) setInput(val);
  };

  const handleRgb = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRgb(val);
    if (updateAll(val)) setInput(val);
  };

  const handleHsl = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHsl(val);
    if (updateAll(val)) setInput(val);
  };

  const handleCmyk = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCmyk(val);
    if (updateAll(val)) setInput(val);
  };

  const swatchColors = useMemo(() => {
    const comp = generatePalette(hex, "complementary")[1];
    const tri = generatePalette(hex, "triadic").slice(1);
    const ana = generatePalette(hex, "analogous", 3).slice(1);
    return [hex, comp, ...tri, ...ana];
  }, [hex]);

  return (
    <section
      id="color-converter"
      aria-labelledby="color-converter-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="color-converter-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Color Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Enter any HEX, RGB(A), HSL(A), or CMYK value to convert between color spaces.
      </p>
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <label htmlFor="color-input" className="block mb-1 font-medium text-gray-800">
            Color Input
          </label>
          <Input
            id="color-input"
            value={input}
            onChange={handleInput}
            aria-label="Color input"
            placeholder="#ff0000 or rgb(255,0,0)"
          />
        </div>

        {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}

        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label htmlFor="hex" className="block mb-1 font-medium text-gray-800">
              HEX
            </label>
            <Input id="hex" value={hex} onChange={handleHex} aria-label="HEX" />
          </div>
          <div className="flex-1">
            <label htmlFor="rgb" className="block mb-1 font-medium text-gray-800">
              RGB(A)
            </label>
            <Input id="rgb" value={rgb} onChange={handleRgb} aria-label="RGB(A)" />
          </div>
          <div className="flex-1">
            <label htmlFor="hsl" className="block mb-1 font-medium text-gray-800">
              HSL(A)
            </label>
            <Input id="hsl" value={hsl} onChange={handleHsl} aria-label="HSL(A)" />
          </div>
          <div className="flex-1">
            <label htmlFor="cmyk" className="block mb-1 font-medium text-gray-800">
              CMYK
            </label>
            <Input id="cmyk" value={cmyk} onChange={handleCmyk} aria-label="CMYK" />
          </div>
        </div>

        <div
          className="relative group h-12 rounded"
          style={{ backgroundColor: hex }}
          aria-label="Color preview"
        >
          <div className="absolute inset-0 hidden group-hover:flex items-center justify-center gap-1 bg-white/80 rounded p-1">
            {swatchColors.map((c) => (
              <span key={c} className="w-5 h-5 rounded" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
