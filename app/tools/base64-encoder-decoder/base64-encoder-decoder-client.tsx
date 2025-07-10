// app/tools/base64-encoder-decoder/base64-encoder-decoder-client.tsx

"use client";

import { useState, ChangeEvent } from "react";

export default function Base64EncoderDecoderClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setOutput("");
    setError(null);
  };

  const encode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError(null);
    } catch {
      setError("📛 Unable to encode input.");
      setOutput("");
    }
  };

  const decode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError(null);
    } catch {
      setError("📛 Invalid Base64 string.");
      setOutput("");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Copied to clipboard!");
    } catch {
      alert("❌ Copy failed.");
    }
  };

  return (
    <section
      id="base64-encoder-decoder"
      aria-labelledby="base64-heading"
      className="container-responsive py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="base64-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Base64 Encoder / Decoder
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Encode text to Base64 or decode Base64 back to text instantly. 100% client-side, no signup required.
      </p>

      {/* Input */}
      <label htmlFor="base64-input" className="sr-only">
        Input text or Base64 string
      </label>
      <textarea
        id="base64-input"
        value={input}
        onChange={handleInput}
        placeholder="Enter text or Base64..."
        className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      {/* Controls */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
        <button
          type="button"
          onClick={encode}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm font-medium"
        >
          Encode
        </button>
        <button
          type="button"
          onClick={decode}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm font-medium"
        >
          Decode
        </button>
        <button
          type="button"
          onClick={copyOutput}
          disabled={!output}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium disabled:opacity-60"
        >
          Copy Result
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
        >
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Output */}
      {output && !error && (
        <textarea
          id="base64-output"
          readOnly
          value={output}
          aria-label="Base64 result"
          className="mt-6 w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      )}
    </section>
  );
}