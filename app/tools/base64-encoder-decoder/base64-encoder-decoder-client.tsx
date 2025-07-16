// app/tools/base64-encoder-decoder/base64-encoder-decoder-client.tsx
"use client";

import React, {
  useState,
  useRef,
  useCallback,
  ChangeEvent,
  DragEvent,
} from "react";
import { Trash2, ClipboardCopy } from "lucide-react";

export default function Base64EncoderDecoderClient() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Text ↔ Base64 helpers
  const encodeText = useCallback((text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    let binary = "";
    data.forEach((byte) => (binary += String.fromCharCode(byte)));
    return btoa(binary);
  }, []);

  const decodeText = useCallback((text: string) => {
    const binary = atob(text);
    const bytes = Uint8Array.from([...binary].map((c) => c.charCodeAt(0)));
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }, []);

  // Live-region announcements for accessibility
  const announce = (msg: string) => {
    setLiveMessage(msg);
    setTimeout(() => setLiveMessage(""), 3000);
  };

  // Process text input or decoded base64 immediately
  const processInput = useCallback(
    (text: string) => {
      if (!text) {
        setOutputText("");
        setError(null);
        return;
      }
      try {
        const result = mode === "encode" ? encodeText(text) : decodeText(text);
        setOutputText(result);
        setError(null);
        announce(mode === "encode" ? "Text encoded" : "Text decoded");
      } catch {
        const msg =
          mode === "encode" ? "❌ Encoding failed" : "❌ Decoding failed";
        setError(msg);
        setOutputText("");
        announce(msg);
      }
    },
    [mode, encodeText, decodeText]
  );

  // Handlers
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    processInput(text);
  };

  // File → Base64
  const handleFile = (file: File) => {
    setInputText(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(result);
        let binary = "";
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        try {
          const base64 = btoa(binary);
          setOutputText(base64);
          setError(null);
          announce("File converted to Base64");
        } catch {
          const msg = "❌ File conversion failed";
          setError(msg);
          setOutputText("");
          announce(msg);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      announce("Copied to clipboard");
    } catch {
      announce("❌ Copy failed");
    }
  };

  const clearAll = () => {
    setInputText("");
    setOutputText("");
    setError(null);
    setLiveMessage("");
    inputRef.current?.focus();
  };

  // Character counts
  const inputCount = inputText.length.toLocaleString();
  const outputCount = outputText.length.toLocaleString();

  return (
    <section
      id="base64-encoder-decoder"
      aria-labelledby="base64-heading"
      className="space-y-8 text-gray-900 antialiased"
    >
      {/* Screen-reader live region */}
      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>

      {/* Heading & Description */}
      <div className="text-center space-y-4">
        <h1
          id="base64-heading"
          className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24] text-4xl font-extrabold tracking-tight"
        >
          Base64 Encoder/Decoder
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Convert text and files to and from Base64 with drag‑and‑drop support—no server
          required.
        </p>
      </div>

      {/* Input & Output */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Input Area (also drop zone) */}
        <div>
          <label
            htmlFor="base64-input"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
          </label>
          <textarea
            id="base64-input"
            ref={inputRef}
            value={inputText}
            onChange={handleInputChange}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            placeholder={
              mode === "encode"
                ? "Enter text or drop a file…"
                : "Enter Base64 string…"
            }
            className={`w-full h-40 p-4 border-2 border-dashed rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-mono ${
              isDragActive ? "border-blue-500" : "border-gray-300"
            }`}
            aria-describedby="base64-input-info"
          />
          <p
            id="base64-input-info"
            className="mt-1 text-xs text-gray-500"
          >
            {inputCount} characters
          </p>
        </div>

        {/* Output Area */}
        <div>
          <label
            htmlFor="base64-output"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            {mode === "encode" ? "Base64 Output" : "Decoded Text"}
          </label>
          <textarea
            id="base64-output"
            value={outputText}
            readOnly
            placeholder="Result appears here…"
            className="w-full h-40 p-4 border border-gray-300 rounded-md resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-mono"
            aria-live="polite"
          />
          <p className="mt-1 text-xs text-gray-500">
            {outputCount} characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md"
          >
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition text-sm"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Clear All
          </button>
          <button
            type="button"
            onClick={() => setMode((m) => (m === "encode" ? "decode" : "encode"))}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition text-sm"
          >
            {mode === "encode" ? "Switch to Decode" : "Switch to Encode"}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!outputText}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            aria-label="Copy output"
          >
            <ClipboardCopy className="w-5 h-5 mr-2" />
            Copy
          </button>
        </div>
      </div>
    </section>
  );
}