// app/tools/caesar-cipher/caesar-cipher-client.tsx
"use client";

import { useState, useEffect, useMemo, useRef, ChangeEvent, FormEvent } from "react";
import { ChevronDown, ChevronUp, ClipboardCopy, RefreshCcw } from "lucide-react";

/**
 * Inlined Caesar cipher implementation
 */
function caesarCipher(str: string, shift: number, decode = false) {
  const actualShift = decode ? (26 - (shift % 26)) : shift % 26;
  return str.replace(/[A-Za-z]/g, (char) => {
    const base = char <= "Z" ? 65 : 97; // ASCII code for 'A' or 'a'
    const code = char.charCodeAt(0) - base;
    const shifted = (code + actualShift + 26) % 26;
    return String.fromCharCode(shifted + base);
  });
}

export default function CaesarCipherClient() {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [text, setText] = useState("");
  const [shift, setShift] = useState(13);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto‐focus on textarea
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    setError(null);
  }

  function handleShiftChange(e: ChangeEvent<HTMLInputElement>) {
    const v = parseInt(e.target.value, 10);
    setShift(isNaN(v) ? 0 : Math.max(0, Math.min(25, v)));
  }

  function handleModeToggle() {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setError(null);
  }

  function applyPreset(p: number) {
    setShift(p);
    setMode("encode");
    setError(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (shift < 0 || shift > 25) {
      setError("Shift must be between 0 and 25.");
      return;
    }

    try {
      const result = caesarCipher(text, shift, mode === "decode");
      setOutput(result);
    } catch {
      setError("An error occurred—please check your input.");
    }
  }

  function copyToClipboard() {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {
      alert("❌ Copy failed.");
    });
  }

  // ─── Live preview on change ─────────────────────────────────────────────────
  useEffect(() => {
    if (text) {
      try {
        setOutput(caesarCipher(text, shift, mode === "decode"));
      } catch {
        setOutput("");
      }
    } else {
      setOutput("");
    }
  }, [text, shift, mode]);

  // ─── Memos ───────────────────────────────────────────────────────────────────
  const charCount = useMemo(() => text.length.toLocaleString(), [text]);
  const outCount = useMemo(() => output.length.toLocaleString(), [output]);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      id="caesar-cipher"
      aria-labelledby="caesar-cipher-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading */}
      <div className="text-center space-y-4 sm:px-0">
        <h1
          id="caesar-cipher-heading"
          className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          Caesar Cipher
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Encode or decode messages with a customizable shift—completely in-browser for full privacy, live preview, and presets.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 sm:px-0">
        {/* Input */}
        <div>
          <label
            htmlFor="cipher-input"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            {mode === "encode" ? "Plain Text" : "Cipher Text"}
          </label>
          <textarea
            id="cipher-input"
            ref={inputRef}
            value={text}
            onChange={handleTextChange}
            placeholder={
              mode === "encode"
                ? "Enter text to encode…"
                : "Enter text to decode…"
            }
            className="w-full h-40 p-4 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 font-mono resize-y transition"
          />
          <p className="mt-1 text-xs text-gray-500">{charCount} characters</p>
        </div>

        {/* Shift, Presets & Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="shift" className="text-sm font-medium text-gray-800">
              Shift
            </label>
            <input
              id="shift"
              type="number"
              min={0}
              max={25}
              value={shift}
              onChange={handleShiftChange}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Presets */}
          <div className="flex gap-2">
            {[1, 3, 13, 25].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition text-sm"
              >
                ROT{p}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleModeToggle}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition text-sm font-medium"
          >
            <RefreshCcw className="w-5 h-5" aria-hidden="true" />
            Switch to {mode === "encode" ? "Decode" : "Encode"}
          </button>

          <button
            type="submit"
            className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium"
          >
            {mode === "encode" ? "Encode →" : "Decode →"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}

        {/* Output */}
        <div>
          <label
            htmlFor="cipher-output"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            {mode === "encode" ? "Cipher Text" : "Decoded Text"}
          </label>
          <div className="relative">
            <textarea
              id="cipher-output"
              readOnly
              value={output}
              placeholder="Result will appear here…"
              className="w-full h-40 p-4 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-mono resize-y transition"
            />
            <button
              type="button"
              onClick={copyToClipboard}
              disabled={!output}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition"
              aria-label="Copy output"
            >
              <ClipboardCopy className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">{outCount} characters</p>
        </div>

        {/* Advanced Settings */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition text-sm font-medium"
          >
            Advanced Settings
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
              <p className="text-gray-700 text-sm">
                • Shift wraps modulo 26<br />
                • Only A–Z / a–z characters are shifted; other characters remain unchanged.<br />
                • Live preview updates as you type.<br />
                • Quick ROT presets for common shifts.
              </p>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}