"use client";

import { useState } from "react";
import { convertBase } from "../../../lib/convert-base";

export default function BaseConverterClient() {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    setError(null);
    try {
      const result = convertBase(input.trim(), fromBase, toBase);
      setOutput(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Conversion failed";
      setError(msg);
      setOutput("");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Copied to clipboard!");
    } catch {
      alert("❌ Copy failed.");
    }
  };

  const baseOptions = Array.from({ length: 35 }, (_, i) => i + 2);

  return (
    <section
      id="base-converter"
      aria-labelledby="base-converter-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="base-converter-heading"
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-6 tracking-tight"
      >
        Base Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Convert numbers between binary, decimal, hexadecimal and other bases entirely in your browser.
      </p>

      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <label htmlFor="input-value" className="block mb-1 font-medium text-gray-800">
            Input Value
          </label>
          <input
            id="input-value"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. FF"
            className="input-base font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center space-x-2">
            <span className="font-medium text-gray-800">From</span>
            <select
              value={fromBase}
              onChange={(e) => setFromBase(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {baseOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center space-x-2">
            <span className="font-medium text-gray-800">To</span>
            <select
              value={toBase}
              onChange={(e) => setToBase(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {baseOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={handleConvert}
            className="btn-primary"
          >
            Convert
          </button>
        </div>

        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}

        {output !== "" && (
          <div>
            <label htmlFor="output-value" className="block mb-1 font-medium text-gray-800">
              Output Value
            </label>
            <input
              id="output-value"
              readOnly
              value={output}
              className="input-base font-mono bg-gray-50"
            />
            <button
              onClick={copyOutput}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium"
            >
              Copy Result
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
