"use client";

import { useState, ChangeEvent } from "react";

export default function UrlEncoderDecoderClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("standard");

  const encode = () => {
    if (mode === "base64") {
      setOutput(btoa(input));
    } else if (mode === "component") {
      setOutput(encodeURI(input));
    } else {
      setOutput(encodeURIComponent(input));
    }
  };
  const decode = () => {
    if (mode === "base64") {
      try { setOutput(atob(input)); } catch { setOutput("Invalid base64") }
    } else {
      setOutput(decodeURIComponent(input));
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

  return (
    <section className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-6">URL Encoder / Decoder</h1>
      <textarea
        value={input}
        onChange={handleInput}
        placeholder="Enter text or URL..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex flex-wrap gap-4 items-end">
        <label className="text-sm font-medium">
          Mode:
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="standard">Standard</option>
            <option value="component">Component Safe</option>
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
