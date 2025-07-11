// app/tools/color-converter/color-converter-client.tsx
"use client";

import { useState, ChangeEvent } from "react";
import { convertColor } from "@/lib/color-conversion";
import Input from "@/components/Input";

export default function ColorConverterClient() {
  const [input, setInput] = useState("#ff0000");
  const [hex, setHex] = useState("#ff0000");
  const [rgb, setRgb] = useState("rgb(255, 0, 0)");
  const [hsl, setHsl] = useState("hsl(0, 100%, 50%)");
  const [error, setError] = useState<string | null>(null);

  const update = (value: string) => {
    const res = convertColor(value);
    if (res) {
      setHex(res.hex);
      setRgb(res.rgb);
      setHsl(res.hsl);
      setError(null);
    } else {
      setError("Invalid color format");
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    update(val);
  };

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
        Enter a color in HEX, RGB, or HSL format to convert between representations.
      </p>
      <div className="max-w-md mx-auto space-y-6">
        <Input
          value={input}
          onChange={handleInput}
          aria-label="Color input"
          placeholder="#ff0000 or rgb(255,0,0) or hsl(0,100%,50%)"
        />
        {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
        {!error && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-4 font-medium">HEX</span>
              <Input value={hex} readOnly className="flex-grow" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 font-medium">RGB</span>
              <Input value={rgb} readOnly className="flex-grow" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 font-medium">HSL</span>
              <Input value={hsl} readOnly className="flex-grow" />
            </div>
            <div
              className="h-12 rounded" 
              style={{ backgroundColor: hex }}
              aria-label="Color preview"
            />
          </div>
        )}
      </div>
    </section>
  );
}
