// app/tools/jwt-hash-generator/jwt-hash-generator-client.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { ClipboardCopy } from "lucide-react";
// @ts-expect-error crypto-js has no bundled type declarations
import MD5 from "crypto-js/md5";
// @ts-expect-error crypto-js has no bundled type declarations
import SHA1 from "crypto-js/sha1";
// @ts-expect-error crypto-js has no bundled type declarations
import SHA256 from "crypto-js/sha256";
import bcrypt from "bcryptjs";

/**
 * JWT & Hash Generator Tool
 *
 * Decode JWTs and generate cryptographic hashes (MD5, SHA-1, SHA-256, bcrypt)
 * with adjustable parameters—100% client-side, no signup required.
 */
export default function JwtHashGeneratorClient() {
  const [mode, setMode] = useState<"decode" | "hash">("decode");

  // JWT decode state
  const [jwtInput, setJwtInput] = useState("");
  const [decodedHeader, setDecodedHeader] = useState<object | null>(null);
  const [decodedPayload, setDecodedPayload] = useState<object | null>(null);

  // Hash generation state
  const [hashInput, setHashInput] = useState("");
  const [hashAlg, setHashAlg] = useState<"MD5" | "SHA-1" | "SHA-256" | "bcrypt">("MD5");
  const [bcryptRounds, setBcryptRounds] = useState(10);
  const [hashOutput, setHashOutput] = useState("");

  // Shared error state
  const [error, setError] = useState<string | null>(null);

  /** Decode a Base64URL-encoded JSON segment */
  function decodeSegment(seg: string): object {
    const padded =
      seg.replace(/-/g, "+").replace(/_/g, "/") +
      "==".slice(0, (4 - (seg.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  }

  /** Handle JWT decoding */
  function handleDecode(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setDecodedHeader(null);
    setDecodedPayload(null);

    try {
      const parts = jwtInput.trim().split(".");
      if (parts.length !== 3) throw new Error("JWT must have three parts");
      setDecodedHeader(decodeSegment(parts[0]));
      setDecodedPayload(decodeSegment(parts[1]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decode JWT");
    }
  }

  /** Handle hash generation */
  async function handleHash(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setHashOutput("");

    try {
      let result: string;
      switch (hashAlg) {
        case "MD5":
          result = MD5(hashInput).toString();
          break;
        case "SHA-1":
          result = SHA1(hashInput).toString();
          break;
        case "SHA-256":
          result = SHA256(hashInput).toString();
          break;
        case "bcrypt":
          if (bcryptRounds < 4 || bcryptRounds > 31) {
            throw new Error("Rounds must be between 4 and 31");
          }
          result = await bcrypt.hash(hashInput, bcryptRounds);
          break;
        default:
          throw new Error("Unsupported algorithm");
      }
      setHashOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate hash");
    }
  }

  /** Copy text to clipboard */
  async function copyToClipboard(text: string) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      alert("✅ Copied to clipboard!");
    } catch {
      alert("❌ Copy failed.");
    }
  }

  return (
    <section
      id="jwt-hash-generator"
      aria-labelledby="jwt-hash-generator-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-4 sm:px-0">
        <h1
          id="jwt-hash-generator-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          JWT & Hash Generator
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Decode JWTs and generate cryptographic hashes (MD5, SHA-1, SHA-256, bcrypt) with adjustable parameters.
        </p>
      </div>

      {/* Mode Switch */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            setMode("decode");
            setError(null);
            setHashOutput("");
          }}
          className={`px-4 py-2 rounded-md font-medium transition ${
            mode === "decode"
              ? "bg-indigo-600 text-white"
              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Decode JWT
        </button>
        <button
          onClick={() => {
            setMode("hash");
            setError(null);
            setDecodedHeader(null);
            setDecodedPayload(null);
          }}
          className={`px-4 py-2 rounded-md font-medium transition ${
            mode === "hash"
              ? "bg-indigo-600 text-white"
              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
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

      {/* Decode JWT Form */}
      {mode === "decode" && (
        <form onSubmit={handleDecode} className="max-w-3xl mx-auto space-y-6 sm:px-0">
          <div>
            <label htmlFor="jwt-input" className="block text-sm font-medium text-gray-800 mb-1">
              JWT Token
            </label>
            <textarea
              id="jwt-input"
              rows={4}
              value={jwtInput}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setJwtInput(e.target.value)}
              placeholder="Paste your JWT here…"
              className="w-full p-4 border border-gray-300 rounded-md bg-white font-mono resize-y focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
            >
              Decode →
            </button>
          </div>

          {decodedHeader && decodedPayload && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Header</h2>
                <pre className="p-4 mt-2 bg-gray-50 border border-gray-200 rounded-md overflow-auto font-mono">
                  {JSON.stringify(decodedHeader, null, 2)}
                </pre>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(decodedHeader))}
                  className="mt-2 inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                >
                  <ClipboardCopy className="w-4 h-4" />
                  Copy Header
                </button>
              </div>

              {/* Payload */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Payload</h2>
                <pre className="p-4 mt-2 bg-gray-50 border border-gray-200 rounded-md overflow-auto font-mono">
                  {JSON.stringify(decodedPayload, null, 2)}
                </pre>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(decodedPayload))}
                  className="mt-2 inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                >
                  <ClipboardCopy className="w-4 h-4" />
                  Copy Payload
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Generate Hash Form */}
      {mode === "hash" && (
        <form onSubmit={handleHash} className="max-w-3xl mx-auto space-y-6 sm:px-0">
          <div>
            <label htmlFor="hash-input" className="block text-sm font-medium text-gray-800 mb-1">
              Input Text
            </label>
            <textarea
              id="hash-input"
              rows={4}
              value={hashInput}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setHashInput(e.target.value)}
              placeholder="Enter text to hash…"
              className="w-full p-4 border border-gray-300 rounded-md bg-white font-mono resize-y focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Algorithm Selector */}
            <div className="flex-1">
              <label htmlFor="alg-select" className="block text-sm font-medium text-gray-800 mb-1">
                Algorithm
              </label>
              <select
                id="alg-select"
                value={hashAlg}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setHashAlg(e.target.value as typeof hashAlg)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="MD5">MD5</option>
                <option value="SHA-1">SHA-1</option>
                <option value="SHA-256">SHA-256</option>
                <option value="bcrypt">bcrypt</option>
              </select>
            </div>

            {/* bcrypt Rounds */}
            {hashAlg === "bcrypt" && (
              <div className="flex-1">
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
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
            >
              Generate →
            </button>
          </div>

          {hashOutput && (
            <div className="mt-6">
              <label htmlFor="hash-output" className="block text-sm font-medium text-gray-800 mb-1">
                Hash Output
              </label>
              <div className="relative">
                <textarea
                  id="hash-output"
                  readOnly
                  value={hashOutput}
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-mono resize-y transition"
                />
                <button
                  onClick={() => copyToClipboard(hashOutput)}
                  aria-label="Copy hash"
                  className="absolute top-2 right-2 p-2 text-gray-500 hover:text-indigo-600 focus:outline-none transition"
                >
                  <ClipboardCopy className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </section>
  );
}