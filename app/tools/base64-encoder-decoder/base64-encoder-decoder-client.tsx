// app/tools/base64-encoder-decoder/base64-encoder-decoder-client.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Trash2,
  ClipboardCopy,
  Paperclip,
  Share2,
} from "lucide-react";

interface Base64EncoderDecoderClientProps {
  defaultMode?: "encode" | "decode";       // Allow overriding the initial mode
  showPresets?: boolean;                   // Toggle visibility of preset samples
  showShare?: boolean;                     // Toggle shareable-link feature
  debounceMs?: number;                     // Debounce interval for live processing
}

type Toast = {
  id: string;
  message: string;
  type: "success" | "error";
};

export default function Base64EncoderDecoderClient({
  defaultMode = "encode",
  showPresets = true,
  showShare = true,
  debounceMs = 300,
}: Base64EncoderDecoderClientProps) {
  // ─── State & Refs ───────────────────────────────────────────────────────────
  const [mode, setMode] = useState<"encode" | "decode">(defaultMode);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [autoProcess, setAutoProcess] = useState(false);         // Live-process toggle
  const [toasts, setToasts] = useState<Toast[]>([]);              // Toast notifications

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  /** Perform encoding or decoding, with error handling */
  const processBase64 = useCallback(() => {
    try {
      setError(null);
      if (input.trim() === "") {
        setOutput("");
        return;
      }
      if (mode === "encode") {
        // UTF-8 → Base64
        const utf8 = unescape(encodeURIComponent(input));
        setOutput(btoa(utf8));
      } else {
        // Base64 → UTF-8
        const binary = atob(input);
        setOutput(decodeURIComponent(escape(binary)));
      }
    } catch {
      setError(
        mode === "encode"
          ? "❌ Encoding failed. Please check your input."
          : "❌ Decoding failed. Ensure the Base64 string is valid."
      );
      setOutput("");
    }
  }, [input, mode]);

  // Debounced live processing when autoProcess is enabled
  useEffect(() => {
    if (!autoProcess) return;
    const handler = setTimeout(processBase64, debounceMs);
    return () => clearTimeout(handler);
  }, [input, mode, autoProcess, processBase64, debounceMs]);

  function clearAll() {
    setInput("");
    setOutput("");
    setError(null);
    inputRef.current?.focus();
  }

  // ─── Drag & Drop Handlers ───────────────────────────────────────────────────
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(reader.result);
        let str = "";
        for (const b of bytes) str += String.fromCharCode(b);
        const b64 = btoa(str);
        setMode("encode");
        setInput("");
        setOutput(b64);
      }
    };
    reader.readAsArrayBuffer(file);
  }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  // ─── Event Handlers ─────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
    if (!autoProcess) setOutput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processBase64();
    addToast(
      mode === "encode"
        ? "✅ Text encoded successfully!"
        : "✅ Text decoded successfully!"
    );
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      addToast("✅ Copied to clipboard!", "success");
    } catch {
      addToast("❌ Copy failed.", "error");
    }
  };

  const handleShare = async () => {
    if (!output) return;
    const shareUrl = `${window.location.origin}${
      window.location.pathname
    }?data=${encodeURIComponent(output)}&mode=${mode}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Gearizen Base64 Tool",
          text: "Check out my Base64 conversion!",
          url: shareUrl,
        });
        addToast("✅ Shared successfully!", "success");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        addToast("✅ Share link copied!", "success");
      }
    } catch {
      addToast("❌ Share failed.", "error");
    }
  };

  // ─── Preset Samples ──────────────────────────────────────────────────────────
  const presets = [
    { label: "Hello World", value: "Hello World", mode: "encode" as const },
    {
      label: "SGVsbG8gd29ybGQh",
      value: "SGVsbG8gd29ybGQh",
      mode: "decode" as const,
    },
    {
      label: "Sample JSON",
      value: JSON.stringify({ hello: "world", count: 123 }, null, 2),
      mode: "encode" as const,
    },
  ];

  // ─── Character Counts ───────────────────────────────────────────────────────
  const inputCount = input.length.toLocaleString();
  const outputCount = output.length.toLocaleString();

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <section
        id="base64-encoder-decoder"
        aria-labelledby="base64-heading"
        className="container mx-auto px-4 py-8 space-y-12 text-gray-900 antialiased"
      >
        {/* Heading & Description */}
        <div className="text-center space-y-4">
          <h1
            id="base64-heading"
            className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-400 text-3xl sm:text-4xl md:text-5xl font-extrabold"
          >
            Base64 Encoder &amp; Decoder
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Convert text and files to/from Base64 instantly. Drag &amp; drop
            files, live preview, presets, shareable links—no server required.
          </p>
        </div>

        {/* Presets & Mode Toggle */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {showPresets &&
            presets.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setMode(p.mode);
                  setInput(p.value);
                  setError(null);
                  inputRef.current?.focus();
                }}
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
              >
                {p.label}
              </button>
            ))}
          <button
            type="button"
            onClick={() => setMode((m) => (m === "encode" ? "decode" : "encode"))}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
            aria-label="Switch between encode and decode modes"
          >
            <Paperclip className="w-4 h-4" />
            {mode === "encode" ? "Decode Mode" : "Encode Mode"}
          </button>
          <label className="inline-flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={autoProcess}
              onChange={() => setAutoProcess((v) => !v)}
            />
            Auto-Process
          </label>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <div className="flex flex-col">
              <label
                htmlFor="base64-input"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
              </label>
              <textarea
                id="base64-input"
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder={
                  mode === "encode"
                    ? "Type or drop file…"
                    : "Paste Base64 string…"
                }
                aria-invalid={Boolean(error)}
                aria-required="true"
                className="w-full h-40 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 font-mono resize-y transition"
              />
              <p className="mt-1 text-xs text-gray-500">
                {inputCount} chars
              </p>
              {error && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>

            {/* Output */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="relative flex flex-col border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-indigo-500 transition"
            >
              <label
                htmlFor="base64-output"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                {mode === "encode" ? "Base64 Output" : "Decoded Text"}
              </label>
              <textarea
                id="base64-output"
                value={output}
                readOnly
                placeholder="Result appears here…"
                className="w-full h-40 p-4 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-mono resize-y transition"
              />
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!output}
                  aria-label="Copy output"
                  className="p-1 hover:text-indigo-600 disabled:opacity-50"
                >
                  <ClipboardCopy className="w-5 h-5" />
                </button>
                {showShare && (
                  <button
                    type="button"
                    onClick={handleShare}
                    disabled={!output}
                    aria-label="Share result"
                    className="p-1 hover:text-indigo-600 disabled:opacity-50"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {outputCount} chars
              </p>
            </div>
          </div>

          {/* Actions */}
          {!autoProcess && (
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition font-medium"
              >
                {mode === "encode" ? "Encode →" : "Decode →"}
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition text-sm"
              >
                <Trash2 className="w-5 h-5" />
                Clear All
              </button>
            </div>
          )}
        </form>
      </section>

      {/* Toast notifications (aria-live) */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 space-y-2 z-50"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-md shadow-md font-medium ${
              t.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}