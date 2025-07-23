// app/tools/password-generator/password-generator-client.tsx
"use client";

import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  useRef,
} from "react";

/**
 * Strong Password Generator Tool
 *
 * Instantly generate secure, customizable passwords client-side
 * with options for length, complexity and entropy calculation.
 */

export interface PasswordGeneratorClientProps {
  /** Main heading text */
  heading?: string;
  /** Subtitle/description text */
  description?: string;
  /** Gradient classes for headings */
  gradientClasses?: string;
  /** Tailwind focus-ring class */
  focusRingClass?: string;
  /** Override CSS for inputs */
  inputClassName?: string;
  /** Override CSS for toggles */
  toggleClassName?: string;
  /** Override CSS for buttons */
  buttonClassName?: string;
  /** Extra classes for root section */
  rootClassName?: string;
}

// Character sets
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?/";
// Similar-looking characters
const SIMILAR = new Set(["I", "l", "1", "O", "0"]);

/** Pick a random character from a string */
function randChar(str: string): string {
  return str[Math.floor(Math.random() * str.length)] || "";
}
/** Shuffle an array in place (Fisher–Yates) */
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

/** Generate a password given the options */
function generatePassword(options: {
  length: number;
  useUpper: boolean;
  useLower: boolean;
  useDigits: boolean;
  useSymbols: boolean;
  excludeSimilar: boolean;
  avoidRepeats: boolean;
  minUpper: number;
  minLower: number;
  minDigits: number;
  minSymbols: number;
}): string {
  const {
    length,
    useUpper,
    useLower,
    useDigits,
    useSymbols,
    excludeSimilar,
    avoidRepeats,
    minUpper,
    minLower,
    minDigits,
    minSymbols,
  } = options;

  // Build character pool
  let pool = "";
  if (useUpper) pool += UPPER;
  if (useLower) pool += LOWER;
  if (useDigits) pool += DIGITS;
  if (useSymbols) pool += SYMBOLS;
  if (excludeSimilar) {
    pool = [...pool].filter((c) => !SIMILAR.has(c)).join("");
  }
  if (!pool) {
    throw new Error("Select at least one character type.");
  }

  const chars: string[] = [];

  // Enforce minimum counts
  for (let i = 0; i < minUpper; i++) {
    chars.push(randChar(excludeSimilar ? [...UPPER].filter(c => !SIMILAR.has(c)).join("") : UPPER));
  }
  for (let i = 0; i < minLower; i++) {
    chars.push(randChar(excludeSimilar ? [...LOWER].filter(c => !SIMILAR.has(c)).join("") : LOWER));
  }
  for (let i = 0; i < minDigits; i++) {
    chars.push(randChar(excludeSimilar ? [...DIGITS].filter(c => !SIMILAR.has(c)).join("") : DIGITS));
  }
  for (let i = 0; i < minSymbols; i++) {
    chars.push(randChar(excludeSimilar ? [...SYMBOLS].filter(c => !SIMILAR.has(c)).join("") : SYMBOLS));
  }

  // Fill remaining
  while (chars.length < length) {
    const c = randChar(pool);
    if (avoidRepeats && chars.includes(c)) continue;
    chars.push(c);
  }

  return shuffle(chars).join("");
}

const PasswordGeneratorClient: FC<PasswordGeneratorClientProps> = ({
  heading = "Strong Password Generator",
  description =
    "Instantly generate secure, customizable passwords client-side with length, complexity and entropy info.",
  gradientClasses = "from-purple-500 via-pink-500 to-yellow-400",
  focusRingClass = "focus:ring-indigo-500",
  inputClassName,
  toggleClassName,
  buttonClassName,
  rootClassName = "",
}) => {
  // options state
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [avoidRepeats, setAvoidRepeats] = useState(false);
  const [minUpper, setMinUpper] = useState(1);
  const [minLower, setMinLower] = useState(1);
  const [minDigits, setMinDigits] = useState(1);
  const [minSymbols, setMinSymbols] = useState(0);

  // generated
  const [password, setPassword] = useState("");
  const [entropy, setEntropy] = useState(0);
  const [copied, setCopied] = useState(false);
  const pwdRef = useRef<HTMLInputElement>(null);

  // regenerate on any option change
  const regenerate = useCallback(() => {
    try {
      const pwd = generatePassword({
        length,
        useUpper,
        useLower,
        useDigits,
        useSymbols,
        excludeSimilar,
        avoidRepeats,
        minUpper,
        minLower,
        minDigits,
        minSymbols,
      });
      setPassword(pwd);
      setEntropy(calculateEntropy(pwd));
      setCopied(false);
    } catch {
      setPassword("");
      setEntropy(0);
    }
  }, [
    length,
    useUpper,
    useLower,
    useDigits,
    useSymbols,
    excludeSimilar,
    avoidRepeats,
    minUpper,
    minLower,
    minDigits,
    minSymbols,
  ]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const copyToClipboard = useCallback(async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  // CSS helpers
  const sliderClasses = inputClassName ??
    `w-full h-2 bg-gray-200 rounded appearance-none cursor-pointer focus:outline-none ${focusRingClass}`;
  const checkboxClasses = toggleClassName ??
    `h-4 w-4 text-indigo-600 focus:ring-2 ${focusRingClass} border-gray-300 rounded`;
  const btnClasses = buttonClassName ??
    `inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r ${gradientClasses} text-white font-semibold rounded-md transition focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <section
      id="password-generator"
      aria-labelledby="password-generator-heading"
      className={`space-y-16 text-gray-900 antialiased ${rootClassName}`}
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1
          id="password-generator-heading"
          className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses} text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight`}
        >
          {heading}
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="text-lg sm:text-xl text-gray-600">{description}</p>
      </div>

      {/* Output & Copy */}
      <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg shadow space-y-4">
        <label htmlFor="generated-password" className="block text-sm font-medium text-gray-800">
          Your Password
        </label>
        <div className="flex gap-3">
          <input
            id="generated-password"
            ref={pwdRef}
            type="text"
            readOnly
            value={password}
            className="flex-grow p-3 border border-gray-300 rounded-md font-mono focus:ring-2 focus:ring-indigo-500 transition overflow-x-auto"
          />
          <button
            onClick={copyToClipboard}
            className={btnClasses}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Entropy: <span className="font-semibold">{entropy.toFixed(1)}</span> bits
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Length */}
        <div>
          <label htmlFor="length" className="block mb-1 font-medium text-gray-800">
            Length: <span className="font-semibold">{length}</span>
          </label>
          <input
            id="length"
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLength(Number(e.target.value))}
            className={sliderClasses}
          />
        </div>

        {/* Character Types */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-800">Include</legend>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={useUpper}
                onChange={() => setUseUpper(u => !u)}
                className={checkboxClasses}
              />
              Uppercase
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={useLower}
                onChange={() => setUseLower(l => !l)}
                className={checkboxClasses}
              />
              Lowercase
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={useDigits}
                onChange={() => setUseDigits(d => !d)}
                className={checkboxClasses}
              />
              Digits
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={() => setUseSymbols(s => !s)}
                className={checkboxClasses}
              />
              Symbols
            </label>
            <label className="inline-flex items-center gap-2 col-span-2">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={() => setExcludeSimilar(e => !e)}
                className={checkboxClasses}
              />
              Exclude similar (I, l, 1, O, 0)
            </label>
            <label className="inline-flex items-center gap-2 col-span-2">
              <input
                type="checkbox"
                checked={avoidRepeats}
                onChange={() => setAvoidRepeats(r => !r)}
                className={checkboxClasses}
              />
              Avoid repeats
            </label>
          </div>
        </fieldset>

        {/* Minimum counts */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-800">Minimum in Password</legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label className="flex items-center justify-between">
              <span>Min Upper</span>
              <input
                type="number"
                min={0}
                value={minUpper}
                onChange={e => setMinUpper(Number(e.target.value))}
                className="w-16 p-1 border border-gray-300 rounded focus:ring-indigo-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Min Lower</span>
              <input
                type="number"
                min={0}
                value={minLower}
                onChange={e => setMinLower(Number(e.target.value))}
                className="w-16 p-1 border border-gray-300 rounded focus:ring-indigo-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Min Digits</span>
              <input
                type="number"
                min={0}
                value={minDigits}
                onChange={e => setMinDigits(Number(e.target.value))}
                className="w-16 p-1 border border-gray-300 rounded focus:ring-indigo-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Min Symbols</span>
              <input
                type="number"
                min={0}
                value={minSymbols}
                onChange={e => setMinSymbols(Number(e.target.value))}
                className="w-16 p-1 border border-gray-300 rounded focus:ring-indigo-500"
              />
            </label>
          </div>
        </fieldset>
      </div>
    </section>
  );
};

export default PasswordGeneratorClient;