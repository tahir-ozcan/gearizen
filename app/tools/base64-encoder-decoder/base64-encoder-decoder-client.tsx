// app/tools/base64-encoder-decoder/base64-encoder-decoder-client.tsx
"use client";

import { useState, useRef, ChangeEvent, FormEvent, DragEvent } from "react";
import Image from "next/image";
import {
  Trash2,
  Settings,
  ChevronDown,
  ChevronUp,
  ClipboardCopy,
} from "lucide-react";

/**
 * Base64 Encoder / Decoder Tool
 *
 * - Encode/decode any text to/from Base64.
 * - Optional URL-safe mode (no “+” or “/”).
 * - Optional removal of “=” padding.
 * - Drag-and-drop file to auto-encode its contents.
 * - Live character count.
 * - Gradient main heading matching site theme.
 */
export default function Base64EncoderDecoderClient() {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  // Advanced toggles
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [urlSafe, setUrlSafe] = useState(false);
  const [noPadding, setNoPadding] = useState(false);

  // Ref for focusing
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  function clearAll() {
    setInput("");
    setOutput("");
    setError(null);
    setPreviewSrc(null);
    inputRef.current?.focus();
  }

  function encodeText(text: string) {
    let b64 = Buffer.from(text, "utf-8").toString("base64");
    if (urlSafe) b64 = b64.replace(/\+/g, "-").replace(/\//g, "_");
    if (noPadding) b64 = b64.replace(/=*$/, "");
    return b64;
  }

  function decodeText(text: string) {
    let b64 = text;
    if (urlSafe) b64 = b64.replace(/-/g, "+").replace(/_/g, "/");
    if (!noPadding) {
      const pad = 4 - (b64.length % 4);
      if (pad < 4) b64 += "=".repeat(pad);
    }
    return Buffer.from(b64, "base64").toString("utf-8");
  }

  // ─── Handlers ────────────────────────────────────────────────────────────────
  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    setError(null);
    setOutput("");
    setPreviewSrc(null);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        const b64 = Buffer.from(reader.result).toString("base64");
        setMode("encode");
        setInput("");
        setOutput(
          urlSafe
            ? b64.replace(/\+/g, "-").replace(/\//g, "_")
            : b64
        );
      }
    };
    reader.readAsArrayBuffer(file);
  }
  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOutput("");
    setPreviewSrc(null);

    try {
      if (mode === "encode") {
        setOutput(encodeText(input));
      } else {
        const decoded = decodeText(input);
        setOutput(decoded);
        if (decoded.startsWith("data:image/")) {
          setPreviewSrc(decoded);
        }
      }
    } catch {
      setError(
        mode === "encode"
          ? "❌ Encoding failed."
          : "❌ Decoding failed."
      );
    }
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Copied to clipboard!");
    } catch {
      alert("❌ Copy failed.");
    }
  }

  // ─── Counts ──────────────────────────────────────────────────────────────────
  const inputLength = input.length.toLocaleString();
  const outputLength = output.length.toLocaleString();

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      id="base64-encoder-decoder"
      aria-labelledby="base64-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center sm:px-0 space-y-4">
        <h1
          id="base64-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Base64 Encoder / Decoder
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Instantly encode text to Base64 or decode Base64 back to text—all in your
          browser, with optional URL-safe mode, padding control, and drag-and-drop support.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto space-y-8 sm:px-0"
      >
        {/* Input & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="flex flex-col">
            <label
              htmlFor="base64-input"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {mode === "encode" ? "Plain Text" : "Base64 String"}
            </label>
            <textarea
              id="base64-input"
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder={
                mode === "encode"
                  ? "Enter text to encode…"
                  : "Enter Base64 to decode…"
              }
              className="
                w-full h-48 p-4 border border-gray-300 rounded-md bg-white
                focus:ring-2 focus:ring-indigo-500 font-mono resize-y transition
              "
            />
            <p className="mt-1 text-xs text-gray-500">{inputLength} characters</p>
          </div>

          {/* Output */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="relative flex flex-col"
          >
            <label
              htmlFor="base64-output"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {mode === "encode" ? "Base64 Output" : "Decoded Text"}
            </label>
            <div className="relative">
              <textarea
                id="base64-output"
                value={output}
                readOnly
                placeholder="Result will appear here…"
                className="
                  w-full h-48 pl-4 pr-12 py-4 border border-gray-300 rounded-md bg-gray-50
                  focus:ring-2 focus:ring-indigo-500 font-mono resize-y transition
                "
              />
              <button
                type="button"
                onClick={copyOutput}
                disabled={!output}
                className="
                  absolute top-2 right-2 p-2 text-gray-500 hover:text-indigo-600
                  disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition
                "
                aria-label="Copy output"
              >
                <ClipboardCopy className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
            {previewSrc && (
              <Image
                src={previewSrc}
                alt="Decoded image preview"
                width={96}
                height={96}
                className="absolute bottom-4 right-4 border border-gray-200 rounded-md shadow-sm"
                unoptimized
              />
            )}
            <p className="mt-1 text-xs text-gray-500">{outputLength} characters</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium"
          >
            {mode === "encode" ? "Encode →" : "Decode →"}
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition"
          >
            <Trash2 className="w-5 h-5" aria-hidden="true" />
            Clear All
          </button>

          <button
            type="button"
            onClick={() =>
              setMode((m) => (m === "encode" ? "decode" : "encode"))
            }
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition text-sm font-medium"
          >
            <Settings className="w-5 h-5" aria-hidden="true" />
            Switch to {mode === "encode" ? "Decode" : "Encode"}
          </button>
        </div>

        {/* Advanced Settings */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition text-sm"
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
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={urlSafe}
                  onChange={(e) => setUrlSafe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700 text-sm">URL-Safe Base64</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={noPadding}
                  onChange={(e) => setNoPadding(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700 text-sm">Remove “=” Padding</span>
              </label>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}