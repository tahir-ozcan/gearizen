// app/tools/json-formatter/json-formatter-client.tsx
"use client";

import { useState, ChangeEvent } from "react";
import jsonlint from "jsonlint-mod";
import { sortKeysDeep } from "./sort-utils";

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [minify, setMinify] = useState(false);
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [strict, setStrict] = useState(true);

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    setError(null);
  }

  function formatJson() {
    try {
      const parsed = strict ? jsonlint.parse(input) : JSON.parse(input);
      const processed = sortKeys ? sortKeysDeep(parsed) : parsed;
      const spaced = minify ? 0 : indent;
      setOutput(JSON.stringify(processed, null, spaced));
      setError(null);
    } catch (e: unknown) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ JSON copied to clipboard!");
    } catch {
      alert("❌ Failed to copy JSON.");
    }
  }

  function downloadJson() {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section
      id="json-formatter"
      aria-labelledby="json-formatter-heading"
      className="container mx-auto px-4 sm:px-6 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="json-formatter-heading"
        className="text-4xl font-extrabold text-center mb-6 tracking-tight"
      >
        Free JSON Formatter & Validator
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Paste your JSON to validate, beautify, minify, copy or download—100% client-side, no signup.
      </p>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Input */}
        <textarea
          aria-label="JSON input"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste or type your JSON here..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        {/* Options & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <label htmlFor="indent" className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Indent:</span>
              <select
                id="indent"
                disabled={minify}
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              >
                <option value={0}>0</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
              </select>
            </label>

            <label htmlFor="minify" className="flex items-center space-x-2">
              <input
                id="minify"
                type="checkbox"
                checked={minify}
                onChange={() => setMinify((m) => !m)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Minify JSON</span>
            </label>

            <label htmlFor="sort-keys" className="flex items-center space-x-2">
              <input
                id="sort-keys"
                type="checkbox"
                checked={sortKeys}
                onChange={() => setSortKeys((s) => !s)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Sort keys</span>
            </label>

            <label htmlFor="strict" className="flex items-center space-x-2">
              <input
                id="strict"
                type="checkbox"
                checked={strict}
                onChange={() => setStrict((s) => !s)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Strict mode</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={formatJson}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm font-medium"
            >
              Process JSON
            </button>
            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium disabled:opacity-60"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={downloadJson}
              disabled={!output}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition text-sm font-medium disabled:opacity-60"
            >
              Download
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
          >
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Output */}
        {output && !error && (
          <textarea
            readOnly
            aria-label="Formatted JSON output"
            value={output}
            className="w-full h-48 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        )}
      </div>
    </section>
  );
}