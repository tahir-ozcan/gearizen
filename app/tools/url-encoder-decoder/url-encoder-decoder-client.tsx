"use client";

import { useState, ChangeEvent } from "react";

type Mode = "standard" | "component" | "base64";

export default function UrlEncoderDecoderClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("standard");

  const encode = () => {
    let result = "";
    switch (mode) {
      case "standard":
        result = encodeURI(input);
        break;
      case "component":
        result = encodeURIComponent(input);
        break;
      case "base64":
        result = btoa(input);
        break;
    }
    setOutput(result);
  };
  const decode = () => {
    let result = "";
    try {
      switch (mode) {
        case "standard":
          result = decodeURI(input);
          break;
        case "component":
          result = decodeURIComponent(input);
          break;
        case "base64":
          result = atob(input);
          break;
      }
      setOutput(result);
    } catch {
      setOutput("Invalid input");
    }
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Copied!");
    } catch {
      alert("❌ Failed to copy");
    }
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value);
  const handleMode = (e: ChangeEvent<HTMLSelectElement>) => setMode(e.target.value as Mode);

  return (
    <section
      id="url-encoder-decoder"
      aria-labelledby="url-encoder-decoder-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1 id="url-encoder-decoder-heading" className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight">
        URL Encoder / Decoder
      </h1>
      <textarea
        value={input}
        onChange={handleInput}
        placeholder="Enter text or URL..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2">
          <span className="font-medium">Mode:</span>
          <select
            value={mode}
            onChange={handleMode}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="standard">Standard</option>
            <option value="component">Component</option>
            <option value="base64">Base64</option>
          </select>
        </label>
        <button onClick={encode} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Encode
        </button>
        <button onClick={decode} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Decode
        </button>
        <button onClick={copy} disabled={!output} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 disabled:opacity-60">
          Copy
        </button>
      </div>
      <textarea
        readOnly
        value={output}
        placeholder="Result will appear here..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </section>
  );
}
