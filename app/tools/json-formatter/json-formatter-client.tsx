// app/tools/json-formatter/json-formatter-client.tsx
"use client";

import { useState, ChangeEvent, useEffect, useMemo, useCallback } from "react";
import useDebounce from "@/lib/useDebounce";
import { formatJson, JsonMode } from "@/lib/format-json";
import { highlightJson } from "@/lib/highlight-json";
import { encodeHtmlEntities } from "@/lib/html-entities";

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<JsonMode>("beautify");
  const [indent, setIndent] = useState(2);
  const [strict, setStrict] = useState(true);
  const [sortKeys, setSortKeys] = useState(false);
  const [wrapLines, setWrapLines] = useState(true);
  const [highlight, setHighlight] = useState(true);
  const [fileName, setFileName] = useState('formatted.json');
  const debouncedInput = useDebounce(input);

  const highlightedOutput = useMemo(
    () =>
      highlight
        ? highlightJson(output)
        : encodeHtmlEntities(output),
    [output, highlight]
  );

  useEffect(() => {
    if (!debouncedInput.trim()) {
      setOutput('');
      return;
    }
    processJson(debouncedInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput, mode, indent, strict, sortKeys]);

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    setError(null);
  }

  async function processJson(src: string) {
    try {
      const { output, error } = await formatJson(src, {
        mode,
        indent,
        strict,
        sortKeys,
      });
      setError(error);
      setOutput(output);
    } catch (e: unknown) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  const copyOutput = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ JSON copied to clipboard!");
    } catch {
      alert("❌ Failed to copy JSON.");
    }
  }, [output]);

  const downloadJson = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [output, fileName]);

  return (
    <section
      id="json-formatter"
      aria-labelledby="json-formatter-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
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
          className="input-base h-48 font-mono text-sm resize-y"
        />

        {/* Options & Actions */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
            <label htmlFor="indent" className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Indent:</span>
              <select
                id="indent"
                disabled={mode === 'minify'}
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="input-base w-auto px-2 py-1 text-sm"
              >
                <option value={0}>0</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
              </select>
            </label>

            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="mode"
                value="beautify"
                checked={mode === 'beautify'}
                onChange={() => setMode('beautify')}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Beautify</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="mode"
                value="minify"
                checked={mode === 'minify'}
                onChange={() => setMode('minify')}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Minify</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="mode"
                value="validate"
                checked={mode === 'validate'}
                onChange={() => setMode('validate')}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Validate</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sortKeys}
                onChange={() => setSortKeys((s) => !s)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Sort keys</span>
            </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={!strict}
              onChange={() => setStrict((v) => !v)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Lenient JSON5</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={wrapLines}
              onChange={() => setWrapLines((v) => !v)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Wrap lines</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={highlight}
              onChange={() => setHighlight((v) => !v)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Syntax highlight</span>
          </label>

          <label htmlFor="filename" className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">File name:</span>
            <input
              id="filename"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="input-base w-40 px-2 py-1 text-sm"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => processJson(input)}
            className="btn-primary text-sm"
          >
            Format
          </button>
          <button
            type="button"
            onClick={copyOutput}
            disabled={!output}
            className="btn-secondary text-sm disabled:opacity-60"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={downloadJson}
            disabled={!output}
            className="btn-secondary text-sm disabled:opacity-60"
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
          <pre
            aria-label="Formatted JSON output"
            className={`w-full h-48 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition overflow-auto ${wrapLines ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}
            dangerouslySetInnerHTML={{ __html: highlightedOutput }}
          />
        )}
      </div>
    </section>
  );
}