// app/tools/json-formatter/json-formatter-client.tsx
"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Trash2, ClipboardCopy } from "lucide-react";

/**
 * JSON Formatter & Validator Tool
 *
 * Validate, beautify, minify and lint JSON instantly in your browser with real-time error reporting—100% client-side, no signup required.
 */
export default function JsonFormatterClient() {
  const [mode, setMode] = useState<"beautify" | "minify">("beautify");
  const [indent, setIndent] = useState(2);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  function clearAll() {
    setInput("");
    setOutput("");
    setError(null);
    inputRef.current?.focus();
  }

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
      const parsed = JSON.parse(input);
      const result =
        mode === "beautify"
          ? JSON.stringify(parsed, null, indent)
          : JSON.stringify(parsed);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
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

  const inputCount = input.length.toLocaleString();
  const outputCount = output.length.toLocaleString();

  return (
    <section
      id="json-formatter"
      aria-labelledby="json-formatter-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center sm:px-0 space-y-4">
        <h1
          id="json-formatter-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          JSON Formatter & Validator
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Validate, beautify, minify and lint JSON instantly in your browser with real-time error reporting—100% client-side, no signup required.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 sm:px-0">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="indent-input" className="text-sm font-medium text-gray-800">
              Indent:
            </label>
            <input
              id="indent-input"
              type="number"
              min={0}
              max={8}
              disabled={mode === "minify"}
              value={indent}
              onChange={(e) =>
                setIndent(Math.min(8, Math.max(0, Number(e.target.value))))
              }
              className="
                w-16 py-1 px-2 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-[#7c3aed]
                text-sm transition
              "
            />
          </div>
          <button
            type="button"
            onClick={() =>
              setMode((m) => (m === "beautify" ? "minify" : "beautify"))
            }
            className="
              inline-flex items-center gap-2 px-4 py-2
              border border-gray-300 rounded-md
              hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed]
              transition text-sm font-medium text-gray-700
            "
          >
            {mode === "beautify" ? "Switch to Minify" : "Switch to Beautify"}
          </button>
        </div>

        {/* Input & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JSON Input */}
          <div className="flex flex-col">
            <label
              htmlFor="json-input"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              JSON Input
            </label>
            <textarea
              id="json-input"
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Paste your JSON here…"
              className="
                w-full h-64 p-4 border border-gray-300 rounded-md bg-white
                focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
              "
            />
            <p className="mt-1 text-xs text-gray-500">{inputCount} characters</p>
          </div>

          {/* JSON Output */}
          <div className="relative flex flex-col">
            <label
              htmlFor="json-output"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {mode === "beautify" ? "Beautified JSON" : "Minified JSON"}
            </label>
            <div className="relative">
              <textarea
                id="json-output"
                value={output}
                readOnly
                placeholder="Result appears here…"
                className="
                  w-full h-64 pl-4 pr-12 py-4 border border-gray-300 rounded-md bg-gray-50
                  focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
                "
              />
              <button
                type="button"
                onClick={copyOutput}
                disabled={!output}
                aria-label="Copy output"
                className="
                  absolute top-2 right-2 p-2 text-gray-500 hover:text-[#7c3aed]
                  disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition
                "
              >
                <ClipboardCopy className="w-6 h-6" />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">{outputCount} characters</p>
          </div>
        </div>

        {/* Error */}
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
            {mode === "beautify" ? "Beautify →" : "Minify →"}
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="
              inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md
              hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300
              transition text-sm
            "
          >
            <Trash2 className="w-5 h-5" />
            Clear All
          </button>
        </div>
      </form>
    </section>
  );
}