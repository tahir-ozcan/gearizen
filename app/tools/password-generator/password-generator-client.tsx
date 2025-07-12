// app/tools/password-generator/password-generator-client.tsx

"use client";

import { useState, useEffect, useCallback, ChangeEvent } from "react";
// Correct relative path to the shared password utility
import { generatePassword } from "../../../lib/generate-password";



export default function PasswordGeneratorClient() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const pwd = generatePassword({
      length,
      upper: useUpper,
      lower: useLower,
      digits: useDigits,
      symbols: useSymbols,
      excludeSimilar,
    });
    setPassword(pwd);
    setCopied(false);
  }, [length, useUpper, useLower, useDigits, useSymbols, excludeSimilar]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyPassword = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("❌ Failed to copy password.");
    }
  };

  const handleLength = (e: ChangeEvent<HTMLInputElement>) => {
    setLength(Number(e.target.value));
  };

  const cliCommand = [
    "gearizen-password-generator",
    `--length ${length}`,
    useUpper ? "--upper" : "",
    useLower ? "--lower" : "",
    useDigits ? "--digits" : "",
    useSymbols ? "--symbols" : "",
    excludeSimilar ? "--exclude-similar" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id="password-generator"
      aria-labelledby="password-generator-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="password-generator-heading"
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-6 tracking-tight"
      >
        Strong Password Generator
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Generate secure, customizable passwords instantly. 100% client-side, no
        signup required.
      </p>

      {/* Generated Password */}
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm mb-10">
        <label
          htmlFor="generated-password"
          className="block mb-2 font-medium text-gray-800"
        >
          Your Password
        </label>
        <div className="flex items-center space-x-3">
          <input
            id="generated-password"
            type="text"
            readOnly
            value={password}
            aria-label="Generated password"
            className="flex-grow bg-white border border-gray-300 rounded-lg px-4 py-2 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            type="button"
            onClick={copyPassword}
            aria-label="Copy password to clipboard"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Options Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generate();
        }}
        className="space-y-8 max-w-2xl mx-auto"
        aria-label="Password options"
      >
        {/* Length Slider */}
        <div>
          <label
            htmlFor="length"
            className="block mb-2 font-medium text-gray-800"
          >
            Length: <span className="font-semibold">{length}</span>
          </label>
          <input
            id="length"
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={handleLength}
            aria-valuemin={8}
            aria-valuemax={64}
            aria-valuenow={length}
            className="w-full"
          />
        </div>

        {/* Character Sets */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-800 mb-2">
            Include Characters
          </legend>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useUpper}
                onChange={() => setUseUpper((u) => !u)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700 select-none">Uppercase (A–Z)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useLower}
                onChange={() => setUseLower((u) => !u)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700 select-none">Lowercase (a–z)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useDigits}
                onChange={() => setUseDigits((d) => !d)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700 select-none">Numbers (0–9)</span>

            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={() => setUseSymbols((s) => !s)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700 select-none">Symbols (!@#$%)</span>
            </label>
            <label className="flex items-center space-x-2 col-span-2">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={() => setExcludeSimilar((v) => !v)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700 select-none">Exclude similar characters</span>
            </label>
          </div>

          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(cliCommand)}
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
          >
            Copy CLI Command
          </button>
        </fieldset>
      </form>
    </section>
  );
}
