// app/tools/password-generator/password-generator-client.tsx
"use client";

import { useState, useEffect, useCallback, ChangeEvent } from "react";

/**
 * Strong Password Generator Tool
 *
 * Generate secure, customizable passwords client-side with options for patterns,
 * character sets, exclusions, minimum counts, no repeats, and batch CLI command output.
 */

// Characters sets
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

// Similar characters to exclude
const SIMILAR = new Set(["I","l","1","O","0"]);

// Helper: pick random character from a string
function randChar(str: string): string {
  return str.charAt(Math.floor(Math.random() * str.length));
}

// Shuffle an array in-place (Fisher–Yates)
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a password according to options.
 */
function generatePassword(options: {
  length: number;
  upper?: boolean;
  lower?: boolean;
  digits?: boolean;
  symbols?: boolean;
  excludeSimilar?: boolean;
  pattern?: string;
  avoidRepeats?: boolean;
  minUpper?: number;
  minLower?: number;
  minDigits?: number;
  minSymbols?: number;
}): string {
  const {
    length,
    upper = true,
    lower = true,
    digits = true,
    symbols = false,
    excludeSimilar = false,
    pattern,
    avoidRepeats = false,
    minUpper = 0,
    minLower = 0,
    minDigits = 0,
    minSymbols = 0,
  } = options;

  // If pattern provided, honor it strictly
  if (pattern) {
    const result: string[] = [];
    for (const p of pattern) {
      let pool = "";
      if (p === "A") pool = UPPER;
      else if (p === "a") pool = LOWER;
      else if (p === "0") pool = DIGITS;
      else if (p === "$") pool = SYMBOLS;
      else if (p === "?") pool = UPPER + LOWER + DIGITS + SYMBOLS;
      else pool = p; // literal

      if (excludeSimilar) {
        pool = [...pool].filter(c => !SIMILAR.has(c)).join("");
      }

      const c = randChar(pool || (UPPER + LOWER + DIGITS));
      result.push(c);
    }
    return result.join("");
  }

  // Build character pool
  let pool = "";
  if (upper) pool += UPPER;
  if (lower) pool += LOWER;
  if (digits) pool += DIGITS;
  if (symbols) pool += SYMBOLS;
  if (excludeSimilar) {
    pool = [...pool].filter(c => !SIMILAR.has(c)).join("");
  }
  if (!pool) throw new Error("No character sets selected.");

  const chars: string[] = [];

  // Add minimum required characters
  for (let i = 0; i < minUpper; i++) {
    const c = randChar(excludeSimilar ? [...UPPER].filter(ch => !SIMILAR.has(ch)).join("") : UPPER);
    chars.push(c);
  }
  for (let i = 0; i < minLower; i++) {
    const c = randChar(excludeSimilar ? [...LOWER].filter(ch => !SIMILAR.has(ch)).join("") : LOWER);
    chars.push(c);
  }
  for (let i = 0; i < minDigits; i++) {
    const c = randChar(excludeSimilar ? [...DIGITS].filter(ch => !SIMILAR.has(ch)).join("") : DIGITS);
    chars.push(c);
  }
  for (let i = 0; i < minSymbols; i++) {
    const c = randChar(excludeSimilar ? [...SYMBOLS].filter(ch => !SIMILAR.has(ch)).join("") : SYMBOLS);
    chars.push(c);
  }

  // Fill the rest
  while (chars.length < length) {
    const c = randChar(pool);
    if (avoidRepeats && chars.includes(c)) continue;
    chars.push(c);
  }

  // Shuffle to avoid predictable blocks
  return shuffle(chars).join("");
}

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

  const isPatternMode = pattern.trim().length > 0;

  const generate = useCallback(() => {
    const pwd = generatePassword({
      length,
      upper: isPatternMode ? undefined : useUpper,
      lower: isPatternMode ? undefined : useLower,
      digits: isPatternMode ? undefined : useDigits,
      symbols: isPatternMode ? undefined : useSymbols,
      excludeSimilar,
      pattern: pattern || undefined,
      avoidRepeats,
      minUpper: isPatternMode ? undefined : minUpper,
      minLower: isPatternMode ? undefined : minLower,
      minDigits: isPatternMode ? undefined : minDigits,
      minSymbols: isPatternMode ? undefined : minSymbols,
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
    isPatternMode,
  ]);

  // Generate initial password on mount
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

  const cliCommand = [
    "gearizen-password-generator",
    !isPatternMode ? `--length ${length}` : "",
    !isPatternMode && useUpper ? "--upper" : "",
    !isPatternMode && useLower ? "--lower" : "",
    !isPatternMode && useDigits ? "--digits" : "",
    !isPatternMode && useSymbols ? "--symbols" : "",
    excludeSimilar ? "--exclude-similar" : "",
    pattern ? `--pattern ${pattern}` : "",
    avoidRepeats ? "--avoid-repeats" : "",
    !isPatternMode && useUpper ? `--min-upper ${minUpper}` : "",
    !isPatternMode && useLower ? `--min-lower ${minLower}` : "",
    !isPatternMode && useDigits ? `--min-digits ${minDigits}` : "",
    !isPatternMode && useSymbols ? `--min-symbols ${minSymbols}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id="password-generator"
      aria-labelledby="password-generator-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center sm:px-0 space-y-4">
        <h1
          id="password-generator-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Strong Password Generator
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Generate secure, customizable passwords instantly—no server, fully client-side.
        </p>
      </div>

      {/* Password Display */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
        <label htmlFor="generated-password" className="block mb-2 font-medium text-gray-800">
          Your Password
        </label>
        <div className="flex gap-3">
          <input
            id="generated-password"
            readOnly
            value={password}
            className="flex-grow bg-white border border-gray-300 rounded-lg px-4 py-2 font-mono text-lg focus:ring-2 focus:ring-[#7c3aed] transition overflow-x-auto whitespace-nowrap"
          />
          <button
            onClick={copyPassword}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-[#7c3aed] transition"
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
        className="space-y-8 max-w-2xl mx-auto sm:px-0"
      >
        <button
          type="submit"
          className="w-full inline-flex justify-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-[#7c3aed] transition font-medium"
        >
          Generate Password
        </button>

        {/* Pattern */}
        <div>
          <label htmlFor="pattern" className="block mb-2 font-medium text-gray-800">
            Pattern (A = upper, a = lower, 0 = digit, $ = symbol, ? = any)
          </label>
          <input
            id="pattern"
            type="text"
            value={pattern}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPattern(e.target.value)}
            placeholder="e.g. Aa0$?"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c3aed] transition"
          />
          {isPatternMode && (
            <p className="mt-1 text-sm text-gray-500">
              Pattern mode: length and character toggles are ignored.
            </p>
          )}
        </div>

        {/* Length */}
        <div>
          <label htmlFor="length" className="block mb-2 font-medium text-gray-800">
            Length: <span className="font-semibold">{length}</span>
          </label>
          <input
            id="length"
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLength(Number(e.target.value))}
            disabled={isPatternMode}
            className="w-full"
          />
          {isPatternMode && (
            <p className="mt-1 text-sm text-gray-500">Length determined by pattern.</p>
          )}
        </div>

        {/* Character Sets */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-800 mb-2">
            Include Character Types
          </legend>
          {isPatternMode && (
            <p className="text-sm text-gray-500">Disabled in pattern mode.</p>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useUpper}
                onChange={() => setUseUpper(u => !u)}
                disabled={isPatternMode}
                className="h-4 w-4 text-[#7c3aed] border-gray-300 rounded focus:ring-[#7c3aed]"
              />
              <span className="text-gray-700 select-none">Uppercase (A–Z)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useLower}
                onChange={() => setUseLower(l => !l)}
                disabled={isPatternMode}
                className="h-4 w-4 text-[#7c3aed] border-gray-300 rounded focus:ring-[#7c3aed]"
              />
              <span className="text-gray-700 select-none">Lowercase (a–z)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useDigits}
                onChange={() => setUseDigits(d => !d)}
                disabled={isPatternMode}
                className="h-4 w-4 text-[#7c3aed] border-gray-300 rounded focus:ring-[#7c3aed]"
              />
              <span className="text-gray-700 select-none">Digits (0–9)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={() => setUseSymbols(s => !s)}
                disabled={isPatternMode}
                className="h-4 w-4 text-[#7c3aed] border-gray-300 rounded focus:ring-[#7c3aed]"
              />
              <span className="text-gray-700 select-none">Symbols (!@#$%)</span>
            </label>
            <label className="flex items-center space-x-2 col-span-2">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={() => setExcludeSimilar(s => !s)}
                className="h-4 w-4 text-[#7c3aed] border-gray-300 rounded focus:ring-[#7c3aed]"
              />
              <span className="text-gray-700 select-none">Exclude similar (I, l, 1, O, 0)</span>
            </label>
            <label className="flex items-center space-x-2 col-span-2">
              <input
                type="checkbox"
                checked={avoidRepeats}
                onChange={() => setAvoidRepeats(a => !a)}
                className="h-4 w-4 text-[#7c3aed] border-gray-300 rounded focus:ring-[#7c3aed]"
              />
              <span className="text-gray-700 select-none">Avoid repeated characters</span>
            </label>
          </div>
        </fieldset>

        {/* Minimum Counts and CLI */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-800 mb-2">
            Minimum Counts
          </legend>
          {isPatternMode && (
            <p className="text-sm text-gray-500">Disabled in pattern mode.</p>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-700 select-none">Min Uppercase</span>
              <input
                type="number"
                min={0}
                value={minUpper}
                onChange={(e) => setMinUpper(Number(e.target.value))}
                disabled={!useUpper || isPatternMode}
                className="w-20 p-1 border border-gray-300 rounded focus:ring-[#7c3aed]"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700 select-none">Min Lowercase</span>
              <input
                type="number"
                min={0}
                value={minLower}
                onChange={(e) => setMinLower(Number(e.target.value))}
                disabled={!useLower || isPatternMode}
                className="w-20 p-1 border border-gray-300 rounded focus:ring-[#7c3aed]"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700 select-none">Min Digits</span>
              <input
                type="number"
                min={0}
                value={minDigits}
                onChange={(e) => setMinDigits(Number(e.target.value))}
                disabled={!useDigits || isPatternMode}
                className="w-20 p-1 border border-gray-300 rounded focus:ring-[#7c3aed]"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700 select-none">Min Symbols</span>
              <input
                type="number"
                min={0}
                value={minSymbols}
                onChange={(e) => setMinSymbols(Number(e.target.value))}
                disabled={!useSymbols || isPatternMode}
                className="w-20 p-1 border border-gray-300 rounded focus:ring-[#7c3aed]"
              />
            </label>
          </div>
        </fieldset>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(cliCommand)}
            className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-[#7c3aed] transition font-medium"
          >
            Copy CLI Command
          </button>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-sm font-mono whitespace-pre-wrap break-words">
            {cliCommand}
          </pre>
        </div>
      </form>
    </section>
  );
}