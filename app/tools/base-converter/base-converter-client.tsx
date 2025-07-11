"use client";

import { useState } from 'react';
import { convertBase } from '@/lib/baseConverter';

const bases = [
  { value: 2, label: 'Binary (base 2)' },
  { value: 8, label: 'Octal (base 8)' },
  { value: 10, label: 'Decimal (base 10)' },
  { value: 16, label: 'Hex (base 16)' },
];

export default function BaseConverterClient() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const convert = () => {
    try {
      const result = convertBase(input, fromBase, toBase);
      setOutput(result);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Conversion failed';
      setError(msg);
      setOutput('');
    }
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert('✅ Copied!');
    } catch {
      alert('❌ Failed to copy');
    }
  };

  return (
    <section
      id="base-converter"
      aria-labelledby="base-converter-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="base-converter-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Number Base Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Convert numbers between binary, octal, decimal and hexadecimal instantly. 100% client-side.
      </p>

      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <label htmlFor="input" className="block mb-1 font-medium text-gray-800">
            Input
          </label>
          <input
            id="input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-mono"
            placeholder="Enter number"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fromBase" className="block mb-1 font-medium text-gray-800">
              From Base
            </label>
            <select
              id="fromBase"
              value={fromBase}
              onChange={(e) => setFromBase(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              {bases.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="toBase" className="block mb-1 font-medium text-gray-800">
              To Base
            </label>
            <select
              id="toBase"
              value={toBase}
              onChange={(e) => setToBase(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              {bases.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            type="button"
            onClick={convert}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Convert
          </button>
          <button
            type="button"
            onClick={copy}
            disabled={!output}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 disabled:opacity-60"
          >
            Copy Result
          </button>
        </div>

        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}

        {output && !error && (
          <div>
            <label htmlFor="output" className="block mb-1 font-medium text-gray-800">
              Result
            </label>
            <input
              id="output"
              type="text"
              readOnly
              value={output}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-mono"
            />
          </div>
        )}
      </div>
    </section>
  );
}
