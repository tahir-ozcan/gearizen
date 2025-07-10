"use client";

import { useState, ChangeEvent } from "react";

export default function UrlEncoderDecoderClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"standard" | "component" | "base64">(
    "standard"
  );

  const encode = () => {
    if (mode === "base64") {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } else if (mode === "component") {
      setOutput(encodeURIComponent(input).replace(/%2F/g, "/"));
    } else {
      setOutput(encodeURIComponent(input));
    }
  };
  const decode = () => {
    try {
      if (mode === "base64") {
        setOutput(decodeURIComponent(escape(atob(input))));
      } else {
        setOutput(decodeURIComponent(input));
      }
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

  return (
    <section className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-6">URL Encoder / Decoder</h1>
      <div>
        <label className="block mb-1 font-medium" htmlFor="mode-select">
          Mode
        </label>
        <select
          id="mode-select"
          value={mode}
          onChange={(e) =>
            setMode(e.target.value as "standard" | "component" | "base64")
          }
          className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="standard">Standard</option>
          <option value="component">Component Safe</option>
          <option value="base64">Base64</option>
        </select>
      </div>
      <textarea
        value={input}
        onChange={handleInput}
        placeholder="Enter text or URL..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex flex-wrap gap-4">
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
