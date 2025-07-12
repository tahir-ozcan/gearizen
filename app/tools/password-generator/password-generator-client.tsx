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
  const [pattern, setPattern] = useState("");
  const [avoidRepeats, setAvoidRepeats] = useState(false);
  const [minUpper, setMinUpper] = useState(1);
  const [minLower, setMinLower] = useState(1);
  const [minDigits, setMinDigits] = useState(1);
  const [minSymbols, setMinSymbols] = useState(1);
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
      pattern: pattern || undefined,
      avoidRepeats,
      minUpper: useUpper ? minUpper : undefined,
      minLower: useLower ? minLower : undefined,
      minDigits: useDigits ? minDigits : undefined,
      minSymbols: useSymbols ? minSymbols : undefined,
    });
    setPassword(pwd);
    setCopied(false);
  }, [
    length,
    useUpper,
    useLower,
    useDigits,
    useSymbols,
    excludeSimilar,
    pattern,
    avoidRepeats,
    minUpper,
    minLower,
    minDigits,
    minSymbols,
  ]);

  // Generate an initial password on mount
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    pattern ? `--pattern ${pattern}` : "",
    avoidRepeats ? "--avoid-repeats" : "",
    useUpper ? `--min-upper ${minUpper}` : "",
    useLower ? `--min-lower ${minLower}` : "",
    useDigits ? `--min-digits ${minDigits}` : "",
    useSymbols ? `--min-symbols ${minSymbols}` : "",
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            id="generated-password"
            type="text"
            readOnly
            value={password}
            aria-label="Generated password"
            className="flex-grow bg-white border border-gray-300 rounded-lg px-4 py-2 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition overflow-x-auto whitespace-nowrap"
          />
          <button
            type="button"
            onClick={copyPassword}
            aria-label="Copy password to clipboard"
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
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
        {/* Pattern */}
        <div>
          <label
            htmlFor="pattern"
            className="block mb-2 font-medium text-gray-800"
          >
            Pattern (A a 0 $ ?)
          </label>
          <input
            id="pattern"
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. Aa0$?"
            className="input-base"
          />
          <p className="text-sm text-gray-500 mt-1">
            Use A for uppercase, a for lowercase, 0 for numbers, $ for symbols,
            ? for any.
          </p>
        </div>
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
            disabled={pattern !== ""}
          />
          {pattern && (
            <p className="text-sm text-gray-500 mt-1">
              Length is determined by pattern.
            </p>
          )}
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
                onChange={() => setExcludeSimilar((s) => !s)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700 select-none">
                Exclude similar characters (1, l, I, O, 0)
              </span>
            </label>
            <label className="flex items-center space-x-2 col-span-2">
              <input
                type="checkbox"
                checked={avoidRepeats}
                onChange={() => setAvoidRepeats((s) => !s)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700 select-none">
                Avoid repeated characters
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(cliCommand)}
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
          >
            Copy CLI Command
          </button>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-sm font-mono overflow-x-auto whitespace-nowrap break-normal">
            {cliCommand}
          </pre>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-800 mb-2">
            Minimum Counts
          </legend>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <span className="text-gray-700 select-none">Uppercase</span>
              <input
                type="number"
                min={0}
                value={minUpper}
                onChange={(e) => setMinUpper(Number(e.target.value))}
                disabled={!useUpper}
                className="w-20 input-base"
              />
            </label>
            <label className="flex items-center space-x-2">
              <span className="text-gray-700 select-none">Lowercase</span>
              <input
                type="number"
                min={0}
                value={minLower}
                onChange={(e) => setMinLower(Number(e.target.value))}
                disabled={!useLower}
                className="w-20 input-base"
              />
            </label>
            <label className="flex items-center space-x-2">
              <span className="text-gray-700 select-none">Digits</span>
              <input
                type="number"
                min={0}
                value={minDigits}
                onChange={(e) => setMinDigits(Number(e.target.value))}
                disabled={!useDigits}
                className="w-20 input-base"
              />
            </label>
            <label className="flex items-center space-x-2">
              <span className="text-gray-700 select-none">Symbols</span>
              <input
                type="number"
                min={0}
                value={minSymbols}
                onChange={(e) => setMinSymbols(Number(e.target.value))}
                disabled={!useSymbols}
                className="w-20 input-base"
              />
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          aria-label="Generate password with current settings"
          className="w-full btn-primary"
        >
          Generate Password
        </button>
      </form>
    </section>
  );
}
