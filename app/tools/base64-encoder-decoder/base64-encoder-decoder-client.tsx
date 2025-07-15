// app/tools/base64-encoder-decoder/base64-encoder-decoder-client.tsx
"use client";

import {
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  DragEvent,
} from "react";
import { Trash2, ClipboardCopy, Paperclip } from "lucide-react";

/**
 * Base64 Encoder/Decoder
 *
 * Convert text and files to and from Base64 with drag-and-drop support—no server, fully client-side.
 */
export default function Base64EncoderDecoderClient() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  function clearAll() {
    setInput("");
    setOutput("");
    setError(null);
    inputRef.current?.focus();
  }

  /** UTF-8 → Base64 */
  function encodeText(text: string) {
    const utf8 = unescape(encodeURIComponent(text));
    return btoa(utf8);
  }

  /** Base64 → UTF-8 */
  function decodeText(text: string) {
    const binary = atob(text);
    return decodeURIComponent(escape(binary));
  }

  // ─── Drag & Drop Handlers ───────────────────────────────────────────────────
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(reader.result);
        let str = "";
        for (const b of bytes) {
          str += String.fromCharCode(b);
        }
        const b64 = btoa(str);
        setMode("encode");
        setInput("");
        setOutput(b64);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  // ─── Form Handlers ──────────────────────────────────────────────────────────
  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    setError(null);
    setOutput("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOutput("");

    try {
      if (mode === "encode") {
        setOutput(encodeText(input));
      } else {
        setOutput(decodeText(input));
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

  // ─── Character Counts ───────────────────────────────────────────────────────
  const inputCount = input.length.toLocaleString();
  const outputCount = output.length.toLocaleString();

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      id="base64-encoder-decoder"
      aria-labelledby="base64-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          id="base64-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Base64 Encoder/Decoder
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Convert text and files to and from Base64 with drag-and-drop support—no server, fully client-side.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto space-y-8 sm:px-0"
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
                  ? "Enter text or drop a file below…"
                  : "Enter Base64 string to decode…"
              }
              className="
                w-full h-48 p-4 border border-gray-300 rounded-md bg-white
                focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
              "
            />
            <p className="mt-1 text-xs text-gray-500">
              {inputCount} characters
            </p>
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
                placeholder="Result appears here…"
                className="
                  w-full h-48 pl-4 pr-12 py-4 border border-gray-300 rounded-md bg-gray-50
                  focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
                "
              />
              <button
                type="button"
                onClick={copyOutput}
                disabled={!output}
                className="
                  absolute top-2 right-2 p-2 text-gray-500 hover:text-[#7c3aed]
                  disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition
                "
                aria-label="Copy output"
              >
                <ClipboardCopy className="w-6 h-6" />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {outputCount} characters
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium"
          >
            {mode === "encode" ? "Encode →" : "Decode →"}
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition text-sm"
          >
            <Trash2 className="w-5 h-5" />
            Clear All
          </button>
          <button
            type="button"
            onClick={() => setMode((m) => (m === "encode" ? "decode" : "encode"))}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition text-sm font-medium text-gray-700"
          >
            <Paperclip className="w-5 h-5" />
            {mode === "encode" ? "Switch to Decode" : "Switch to Encode"}
          </button>
        </div>
      </form>
    </section>
  );
}