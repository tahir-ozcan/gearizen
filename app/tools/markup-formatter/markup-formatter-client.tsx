// app/tools/markup-formatter/markup-formatter-client.tsx

"use client";

import { useState, ChangeEvent } from "react";
import { html as beautify } from "js-beautify";

export default function MarkupFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [minify, setMinify] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [type, setType] = useState<"html" | "xml">("html");

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
    setOutput("");
  };

  const runFormat = () => {
    setError(null);
    try {
      const opts = minify
        ? { indent_size: 0, max_preserve_newlines: 0, wrap_line_length: 0 }
        : { indent_size: indentSize };
      const result = beautify(input, opts);
      setOutput(result);
    } catch {
      setError(`Error formatting ${type.toUpperCase()}. Please check your input.`);
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Output copied to clipboard!");
    } catch {
      alert("❌ Failed to copy output.");
    }
  };

  const downloadOutput = () => {
    if (!output) return;
    const mime = type === "xml" ? "application/xml" : "text/html";
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formatted.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="markup-formatter"
      aria-labelledby="markup-formatter-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="markup-formatter-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Markup Formatter & Minifier
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Paste or type your HTML or XML below to beautify or minify it. Choose indent size or minify output—100% client-side, no signup required.
      </p>

      <label htmlFor="markup-input" className="sr-only">
        Markup Input
      </label>
      <textarea
        id="markup-input"
        aria-label="Markup input"
        value={input}
        onChange={handleInputChange}
        placeholder="<div>Hello&nbsp;World</div>"
        rows={10}
        className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <label htmlFor="markup-type" className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Type:</span>
            <select
              id="markup-type"
              value={type}
              onChange={(e) => setType(e.target.value as "html" | "xml")}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            >
              <option value="html">HTML</option>
              <option value="xml">XML</option>
            </select>
          </label>
          <label htmlFor="indent-size" className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Indent Size:</span>
            <select
              id="indent-size"
              value={indentSize}
              onChange={e => setIndentSize(Number(e.target.value))}
              disabled={minify}
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
              onChange={() => setMinify(!minify)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Minify</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={runFormat}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm font-medium"
          >
            Format / Minify
          </button>
          <button
            type="button"
            onClick={copyToClipboard}
            disabled={!output}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium disabled:opacity-60"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={downloadOutput}
            disabled={!output}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition text-sm font-medium disabled:opacity-60"
          >
            Download
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md"
        >
          <p className="text-sm">{error}</p>
        </div>
      )}

      {output && (
        <>
          <label htmlFor="markup-output" className="sr-only">
            Formatted Markup Output
          </label>
          <textarea
            id="markup-output"
            aria-label="Formatted markup output"
            value={output}
            readOnly
            rows={10}
            className="mt-6 w-full p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </>
      )}
    </section>
  );
}
