"use client";
import { useState, ChangeEvent, useEffect } from 'react';
import Input from '@/components/Input';
import { generatePalette, PaletteScheme } from '@/lib/color-palette';

export default function ColorPaletteGeneratorClient() {
  const [color, setColor] = useState('#ff0000');
  const [scheme, setScheme] = useState<PaletteScheme>('analogous');
  const [count, setCount] = useState(5);
  const [palette, setPalette] = useState<string[]>(generatePalette('#ff0000'));

  useEffect(() => {
    try {
      setPalette(generatePalette(color, scheme, count));
    } catch {
      setPalette([]);
    }
  }, [color, scheme, count]);

  const handleColor = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
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
      </p>
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <label htmlFor="base-color" className="block mb-1 font-medium text-gray-800">
            Base Color
          </label>
          <Input id="base-color" type="color" value={color} onChange={handleColor} className="h-10 p-0" />
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="scheme"
              value="analogous"
              checked={scheme === 'analogous'}
              onChange={() => setScheme('analogous')}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Analogous</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="scheme"
              value="complementary"
              checked={scheme === 'complementary'}
              onChange={() => setScheme('complementary')}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Complementary</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="scheme"
              value="triadic"
              checked={scheme === 'triadic'}
              onChange={() => setScheme('triadic')}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Triadic</span>
          </label>
        </div>
        {scheme === 'analogous' && (
          <div>
            <label htmlFor="count" className="block mb-1 font-medium text-gray-800">
              Colors
            </label>
            <Input
              id="count"
              type="number"
              min={3}
              max={9}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-24"
            />
          </div>
        )}
      </div>
      {palette.length > 0 && (
        <ul className="mt-12 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {palette.map((hex) => (
            <li key={hex} className="text-center space-y-2">
              <div className="h-16 rounded" style={{ backgroundColor: hex }} />
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(hex)}
                className="text-sm font-mono px-2 py-1 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                {hex}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
