// app/tools/password-generator/password-generator-client.tsx
"use client";

import { useState, useEffect, useCallback, ChangeEvent } from "react";

/**
 * Strong Password Generator Tool
 *
 * Instantly generate secure, customizable passwords client-side with options for length, complexity and entropy visualization.
 */

// Character sets
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?/";
const SIMILAR = new Set(["I", "l", "1", "O", "0"]);

/** Pick a random character from a string */
function randChar(str: string): string {
  return str.charAt(Math.floor(Math.random() * str.length));
}

/** Fisher–Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Calculate Shannon entropy in bits */
function calculateEntropy(pwd: string): number {
  if (!pwd) return 0;
  const freq: Record<string, number> = {};
  for (const c of pwd) freq[c] = (freq[c] || 0) + 1;
  let ent = 0;
  for (const count of Object.values(freq)) {
    const p = count / pwd.length;
    ent -= p * Math.log2(p);
  }
  return ent * pwd.length;
}

/**
 * Generate a password based on the given options.
 */
function generatePassword(options: {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
  pattern: string;
  avoidRepeats: boolean;
  minUpper: number;
  minLower: number;
  minDigits: number;
  minSymbols: number;
}): string {
  const {
    length,
    upper,
    lower,
    digits,
    symbols,
    excludeSimilar,
    pattern,
    avoidRepeats,
    minUpper,
    minLower,
    minDigits,
    minSymbols,
  } = options;

  // If a pattern is provided, obey its structure
  if (pattern.trim()) {
    const out: string[] = [];
    for (const p of pattern) {
      let pool = "";
      switch (p) {
        case "A":
          pool = UPPER;
          break;
        case "a":
          pool = LOWER;
          break;
        case "0":
          pool = DIGITS;
          break;
        case "$":
          pool = SYMBOLS;
          break;
        case "?":
          pool = UPPER + LOWER + DIGITS + SYMBOLS;
          break;
        default:
          pool = p;
      }
      if (excludeSimilar) {
        pool = [...pool].filter(c => !SIMILAR.has(c)).join("");
      }
      out.push(randChar(pool || UPPER + LOWER + DIGITS));
    }
    return out.join("");
  }

  // Build the main character pool
  let pool = "";
  if (upper) pool += UPPER;
  if (lower) pool += LOWER;
  if (digits) pool += DIGITS;
  if (symbols) pool += SYMBOLS;
  if (excludeSimilar) {
    pool = [...pool].filter(c => !SIMILAR.has(c)).join("");
  }
  if (!pool) throw new Error("Select at least one character type.");

  const chars: string[] = [];

  // Enforce minimum counts for each category
  for (let i = 0; i < minUpper; i++)   chars.push(randChar(excludeSimilar ? [...UPPER].filter(c => !SIMILAR.has(c)).join("") : UPPER));
  for (let i = 0; i < minLower; i++)   chars.push(randChar(excludeSimilar ? [...LOWER].filter(c => !SIMILAR.has(c)).join("") : LOWER));
  for (let i = 0; i < minDigits; i++)  chars.push(randChar(excludeSimilar ? [...DIGITS].filter(c => !SIMILAR.has(c)).join("") : DIGITS));
  for (let i = 0; i < minSymbols; i++) chars.push(randChar(excludeSimilar ? [...SYMBOLS].filter(c => !SIMILAR.has(c)).join("") : SYMBOLS));

  // Fill the remainder
  while (chars.length < length) {
    const c = randChar(pool);
    if (avoidRepeats && chars.includes(c)) continue;
    chars.push(c);
  }

  return shuffle(chars).join("");
}

export default function PasswordGeneratorClient() {
  // State for options
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

  // Generated result
  const [password, setPassword] = useState("");
  const [entropy, setEntropy] = useState(0);
  const [copied, setCopied] = useState(false);

  const isPatternMode = pattern.trim().length > 0;

  // Generate callback
  const generate = useCallback(() => {
    try {
      const pwd = generatePassword({
        length,
        upper: useUpper,
        lower: useLower,
        digits: useDigits,
        symbols: useSymbols,
        excludeSimilar,
        pattern,
        avoidRepeats,
        minUpper,
        minLower,
        minDigits,
        minSymbols,
      });
      setPassword(pwd);
      setEntropy(calculateEntropy(pwd));
      setCopied(false);
    } catch (e) {
      setPassword("");
      setEntropy(0);
    }
  }, [
    length, useUpper, useLower, useDigits, useSymbols,
    excludeSimilar, pattern, avoidRepeats,
    minUpper, minLower, minDigits, minSymbols
  ]);

  // Initial generation
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Copy handler
  const copyPassword = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("❌ Failed to copy.");
    }
  };

  return (
    <section id="password-generator" aria-labelledby="password-generator-heading" className="space-y-16 text-gray-900 antialiased">
      {/* Heading & Description */}
      <div className="text-center sm:px-0 space-y-4">
        <h1 id="password-generator-heading" className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Strong Password Generator
        </h1>
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Instantly generate secure, customizable passwords client-side with options for length, complexity and entropy visualization.
        </p>
      </div>

      {/* Display & Controls */}
      <div className="max-w-2xl mx-auto space-y-8 sm:px-0">
        {/* Generated password */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <label htmlFor="generated-password" className="block text-sm font-medium text-gray-800 mb-2">
            Your Password
          </label>
          <div className="flex gap-3 items-center">
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
          <p className="mt-2 text-sm text-gray-600">
            Entropy: <span className="font-semibold">{entropy.toFixed(1)}</span> bits
          </p>
        </div>

        {/* Options form */}
        <form onSubmit={e => { e.preventDefault(); generate(); }} className="space-y-6">
          <button
            type="submit"
            className="w-full inline-flex justify-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-[#7c3aed] transition font-medium"
          >
            Generate Password
          </button>

          {/* Pattern field */}
          <div>
            <label htmlFor="pattern" className="block text-sm font-medium text-gray-800 mb-1">
              Pattern (A=upper, a=lower, 0=digit, $=symbol, ?=any)
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
              <p className="mt-1 text-sm text-gray-500">Pattern mode overrides all other toggles.</p>
            )}
          </div>

          {/* Length slider */}
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-800 mb-1">
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
          </div>

          {/* Toggles for character sets */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-800">Character Sets</legend>
            {isPatternMode && <p className="text-sm text-gray-500">Disabled in pattern mode.</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useUpper}
                  onChange={() => setUseUpper(u => !u)}
                  disabled={isPatternMode}
                  className="h-4 w-4 text-[#7c3aed] border-gray-300 rounded focus:ring-[#7c3aed]"
                />
                <span>Uppercase (A–Z)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useLower}
                  onChange={() => setUseLower(l => !l)}
                  disabled={isPatternMode}
                  className="h-4 w-4 text-[#7c3aed] border-gray-300 rounded focus:ring-[#7c3aed]"
                />
                <span>Lowercase (a–z)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useDigits}
                  onChange={() => setUseDigits(d => !d)}
                  disabled={isPatternMode}
                  className="h-4 w-4 text-[#7c3aed] border-gray-300 rounded focus:ring-[#7c3aed]"
                />
                <span>Digits (0–9)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={() => setUseSymbols(s => !s)}
                  disabled={isPatternMode}
                  className="h-4 w-4 text-[#7c3aed] border-gray-300 rounded focus:ring-[#7c3aed]"
                />
                <span>Symbols (!@#$%)</span>
              </label>
              <label className="flex items-center space-x-2 col-span-2">
                <input
                  type="checkbox"
                  checked={excludeSimilar}
                  onChange={() => setExcludeSimilar(x => !x)}
                  className="h-4 w-4 text-[#7c3aed] border-gray-300 rounded focus:ring-[#7c3aed]"
                />
                <span>Exclude similar chars (I, l, 1, O, 0)</span>
              </label>
              <label className="flex items-center space-x-2 col-span-2">
                <input
                  type="checkbox"
                  checked={avoidRepeats}
                  onChange={() => setAvoidRepeats(a => !a)}
                  className="h-4 w-4 text-[#7c3aed] border-gray-300 rounded focus:ring-[#7c3aed]"
                />
                <span>Avoid repeated characters</span>
              </label>
            </div>
          </fieldset>

          {/* Minimum counts */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-800">Minimum Counts</legend>
            {isPatternMode && <p className="text-sm text-gray-500">Disabled in pattern mode.</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex justify-between items-center">
                <span>Min Uppercase</span>
                <input
                  type="number"
                  min={0}
                  value={minUpper}
                  onChange={e => setMinUpper(Number(e.target.value))}
                  disabled={!useUpper || isPatternMode}
                  className="w-20 p-1 border border-gray-300 rounded focus:ring-[#7c3aed]"
                />
              </label>
              <label className="flex justify-between items-center">
                <span>Min Lowercase</span>
                <input
                  type="number"
                  min={0}
                  value={minLower}
                  onChange={e => setMinLower(Number(e.target.value))}
                  disabled={!useLower || isPatternMode}
                  className="w-20 p-1 border border-gray-300 rounded focus:ring-[#7c3aed]"
                />
              </label>
              <label className="flex justify-between items-center">
                <span>Min Digits</span>
                <input
                  type="number"
                  min={0}
                  value={minDigits}
                  onChange={e => setMinDigits(Number(e.target.value))}
                  disabled={!useDigits || isPatternMode}
                  className="w-20 p-1 border border-gray-300 rounded focus:ring-[#7c3aed]"
                />
              </label>
              <label className="flex justify-between items-center">
                <span>Min Symbols</span>
                <input
                  type="number"
                  min={0}
                  value={minSymbols}
                  onChange={e => setMinSymbols(Number(e.target.value))}
                  disabled={!useSymbols || isPatternMode}
                  className="w-20 p-1 border border-gray-300 rounded focus:ring-[#7c3aed]"
                />
              </label>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
}