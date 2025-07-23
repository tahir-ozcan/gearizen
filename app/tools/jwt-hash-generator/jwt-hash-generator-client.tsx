// app/tools/jwt-hash-generator/jwt-hash-generator-client.tsx
"use client";

import React, {
  FC,
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  useCallback,
} from "react";
import { ClipboardCopy, Check } from "lucide-react";
// @ts-expect-error crypto-js has no bundled types
import MD5 from "crypto-js/md5";
// @ts-expect-error crypto-js has no bundled types
import SHA1 from "crypto-js/sha1";
// @ts-expect-error crypto-js has no bundled types
import SHA256 from "crypto-js/sha256";
import bcrypt from "bcryptjs";

export interface JwtHashGeneratorClientProps {
  /** Main heading text */
  heading?: string;
  /** Subtitle/description text */
  description?: string;
  /** Gradient classes for headings */
  gradientClasses?: string;
  /** Focus‑ring Tailwind class */
  focusRingClass?: string;
  /** Override CSS for action buttons */
  primaryButtonClassName?: string;
  /** Override CSS for toggle/clear buttons */
  secondaryButtonClassName?: string;
  /** Override CSS for textareas */
  textareaClassName?: string;
  /** Extra classes for root section */
  rootClassName?: string;
}

const JwtHashGeneratorClient: FC<JwtHashGeneratorClientProps> = ({
  heading = "JWT & Hash Generator",
  description =
    "Decode JWTs or generate cryptographic hashes (MD5, SHA‑1, SHA‑256, bcrypt) entirely client‑side.",
  gradientClasses = "from-purple-500 via-pink-500 to-yellow-400",
  focusRingClass = "focus:ring-purple-500",
  primaryButtonClassName,
  secondaryButtonClassName,
  textareaClassName,
  rootClassName = "",
}) => {
  // Mode
  const [mode, setMode] = useState<"decode" | "hash">("decode");

  // JWT state
  const [jwtInput, setJwtInput] = useState("");
  const [decodedHeader, setDecodedHeader] = useState<object | null>(null);
  const [decodedPayload, setDecodedPayload] = useState<object | null>(null);
  const [headerCopied, setHeaderCopied] = useState(false);
  const [payloadCopied, setPayloadCopied] = useState(false);

  // Hash state
  const [hashInput, setHashInput] = useState("");
  const [hashAlg, setHashAlg] = useState<"MD5" | "SHA‑1" | "SHA‑256" | "bcrypt">("MD5");
  const [bcryptRounds, setBcryptRounds] = useState(10);
  const [hashOutput, setHashOutput] = useState("");
  const [hashCopied, setHashCopied] = useState(false);

  // Error
  const [error, setError] = useState<string | null>(null);

  // Refs
  const jwtRef = useRef<HTMLTextAreaElement>(null);
  const hashRef = useRef<HTMLTextAreaElement>(null);

  // CSS classes
  const textareaBase =
    textareaClassName ??
    `w-full p-4 border border-gray-300 rounded-md font-mono focus:outline-none ${focusRingClass} transition`;

  const baseInputClasses = `${textareaBase} resize-y bg-white placeholder-gray-400`;
  const baseOutputClasses = `${textareaBase} resize-none bg-gray-50 placeholder-gray-400`;

  const secondaryBtnClasses = (active = false) =>
    `${secondaryButtonClassName ??
      "px-4 py-2 rounded-md font-medium transition"} ${
      active
        ? "bg-indigo-600 text-white"
        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
    }`;

  // Decode helper
  const decodeSegment = useCallback((seg: string) => {
    const padded = seg
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(seg.length / 4) * 4, "=");
    const str = atob(padded);
    return JSON.parse(str);
  }, []);

  // Handle decode
  const handleDecode = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      setDecodedHeader(null);
      setDecodedPayload(null);
      try {
        const parts = jwtInput.trim().split(".");
        if (parts.length !== 3) throw new Error("JWT must have exactly 3 parts");
        setDecodedHeader(decodeSegment(parts[0]));
        setDecodedPayload(decodeSegment(parts[1]));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to decode JWT");
      }
    },
    [jwtInput, decodeSegment]
  );

  // Handle hash
  const handleHash = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      setHashOutput("");
      try {
        let result: string;
        switch (hashAlg) {
          case "MD5":
            result = MD5(hashInput).toString();
            break;
          case "SHA‑1":
            result = SHA1(hashInput).toString();
            break;
          case "SHA‑256":
            result = SHA256(hashInput).toString();
            break;
          case "bcrypt":
            if (bcryptRounds < 4 || bcryptRounds > 31) {
              throw new Error("bcrypt rounds must be between 4 and 31");
            }
            result = await bcrypt.hash(hashInput, bcryptRounds);
            break;
          default:
            throw new Error("Unsupported algorithm");
        }
        setHashOutput(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Hash generation failed");
      }
    },
    [hashInput, hashAlg, bcryptRounds]
  );

  // Copy helper
  const copyText = useCallback(
    async (text: string, setter: (v: boolean) => void) => {
      if (!text) return;
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    },
    []
  );

  return (
    <section
      id="jwt-hash-generator"
      aria-labelledby="jwt-hash-generator-heading"
      className={`space-y-16 text-gray-900 antialiased ${rootClassName}`}
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1
          id="jwt-hash-generator-heading"
          className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses} text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight`}
        >
          {heading}
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="text-lg sm:text-xl text-gray-600">{description}</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={() => { setMode("decode"); setError(null); }}
          className={secondaryBtnClasses(mode === "decode")}
        >
          Decode JWT
        </button>
        <button
          type="button"
          onClick={() => { setMode("hash"); setError(null); }}
          className={secondaryBtnClasses(mode === "hash")}
        >
          Generate Hash
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-3xl mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Decode Form */}
      {mode === "decode" && (
        <form onSubmit={handleDecode} className="max-w-3xl mx-auto space-y-6">
          <div>
            <label htmlFor="jwt-input" className="block text-sm font-medium text-gray-800 mb-1">
              JWT Token
            </label>
            <textarea
              id="jwt-input"
              ref={jwtRef}
              rows={4}
              value={jwtInput}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setJwtInput(e.target.value)}
              placeholder="Paste your JWT here…"
              className={baseInputClasses}
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium"
            >
              Decode →
            </button>
          </div>

          {decodedHeader && decodedPayload && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Header</h2>
                <pre className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-md overflow-auto font-mono">
                  {JSON.stringify(decodedHeader, null, 2)}
                </pre>
                <button
                  type="button"
                  onClick={() =>
                    copyText(JSON.stringify(decodedHeader, null, 2), setHeaderCopied)
                  }
                  className="mt-2 inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                >
                  {headerCopied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
                  Copy Header
                </button>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Payload</h2>
                <pre className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-md overflow-auto font-mono">
                  {JSON.stringify(decodedPayload, null, 2)}
                </pre>
                <button
                  type="button"
                  onClick={() =>
                    copyText(JSON.stringify(decodedPayload, null, 2), setPayloadCopied)
                  }
                  className="mt-2 inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                >
                  {payloadCopied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
                  Copy Payload
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Hash Form */}
      {mode === "hash" && (
        <form onSubmit={handleHash} className="max-w-3xl mx-auto space-y-6">
          <div>
            <label htmlFor="hash-input" className="block text-sm font-medium text-gray-800 mb-1">
              Input Text
            </label>
            <textarea
              id="hash-input"
              ref={hashRef}
              rows={4}
              value={hashInput}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setHashInput(e.target.value)}
              placeholder="Enter text to hash…"
              className={baseInputClasses}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[140px]">
              <label htmlFor="alg-select" className="block text-sm font-medium text-gray-800 mb-1">
                Algorithm
              </label>
              <select
                id="alg-select"
                value={hashAlg}
                onChange={(e) => setHashAlg(e.target.value as any)}
                className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none ${focusRingClass}`}
              >
                <option value="MD5">MD5</option>
                <option value="SHA‑1">SHA‑1</option>
                <option value="SHA‑256">SHA‑256</option>
                <option value="bcrypt">bcrypt</option>
              </select>
            </div>

            {hashAlg === "bcrypt" && (
              <div className="flex-1 min-w-[140px]">
                <label htmlFor="rounds-input" className="block text-sm font-medium text-gray-800 mb-1">
                  Salt Rounds
                </label>
                <input
                  id="rounds-input"
                  type="number"
                  min={4}
                  max={31}
                  value={bcryptRounds}
                  onChange={(e) => setBcryptRounds(Number(e.target.value))}
                  className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none ${focusRingClass}`}
                />
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium"
            >
              Generate →
            </button>
          </div>

          {hashOutput && (
            <div className="space-y-2">
              <label htmlFor="hash-output" className="block text-sm font-medium text-gray-800 mb-1">
                Hash Output
              </label>
              <div className="relative">
                <textarea
                  id="hash-output"
                  rows={4}
                  readOnly
                  value={hashOutput}
                  className={baseOutputClasses}
                />
                <button
                  type="button"
                  onClick={() => copyText(hashOutput, setHashCopied)}
                  disabled={!hashOutput}
                  className="absolute top-2 right-2 p-2 text-gray-500 hover:text-indigo-600 focus:outline-none transition"
                >
                  {hashCopied ? <Check className="w-6 h-6 text-green-500" /> : <ClipboardCopy className="w-6 h-6" />}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </section>
  );
};

export default JwtHashGeneratorClient;