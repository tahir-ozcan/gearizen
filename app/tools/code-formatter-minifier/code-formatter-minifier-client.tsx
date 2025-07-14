// app/tools/code-formatter-minifier/code-formatter-minifier-client.tsx
"use client";

import {
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import { Trash2, ClipboardCopy } from "lucide-react";
import {
  js as beautifyJs,
  css as beautifyCss,
  html as beautifyHtml,
} from "js-beautify";

/**
 * Code Formatter & Minifier Tool
 *
 * Beautify or compress HTML, CSS and JavaScript code for readability
 * or performance gains—no uploads, no server.
 * 100% client-side, instant results.
 */
export default function CodeFormatterMinifierClient() {
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [language, setLanguage] = useState<"js" | "css" | "html">("js");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  function clearAll() {
    setInput("");
    setOutput("");
    setError(null);
    inputRef.current?.focus();
  }

  function formatText(text: string) {
    const opts = { indent_size: 2, space_in_empty_paren: true };
    if (language === "js") return beautifyJs(text, opts);
    if (language === "css") return beautifyCss(text, opts);
    return beautifyHtml(text, opts);
  }

  function minifyText(text: string) {
    const opts = { indent_size: 0, max_preserve_newlines: 0 };
    if (language === "js") return beautifyJs(text, opts);
    if (language === "css") return beautifyCss(text, opts);
    return beautifyHtml(text, opts);
  }

  // ─── Form Handlers ─────────────────────────────────────────────────────────
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
      const result =
        mode === "format" ? formatText(input) : minifyText(input);
      setOutput(result);
    } catch {
      setError(
        mode === "format" ? "❌ Formatting failed." : "❌ Minification failed."
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

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      id="code-formatter-minifier"
      aria-labelledby="code-formatter-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center sm:px-0 space-y-4">
        <h1
          id="code-formatter-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Code Formatter & Minifier
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Beautify or compress HTML, CSS and JavaScript code for readability or performance gains—no uploads, no server.
        </p>
      </div>

      {/* Controls */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto space-y-8 sm:px-0"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="language-select"
              className="text-sm font-medium text-gray-800"
            >
              Language:
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as "js" | "css" | "html")
              }
              className="
                py-1 px-2 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-[#7c3aed]
                transition text-sm
              "
            >
              <option value="js">JavaScript</option>
              <option value="css">CSS</option>
              <option value="html">HTML</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() =>
              setMode((m) => (m === "format" ? "minify" : "format"))
            }
            className="
              inline-flex items-center gap-2 px-4 py-2
              border border-gray-300 rounded-md
              hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed]
              transition text-sm font-medium text-gray-700
            "
          >
            {mode === "format" ? "Switch to Minify" : "Switch to Format"}
          </button>
        </div>

        {/* Input & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="flex flex-col">
            <label
              htmlFor="code-input"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {mode === "format" ? "Code to Format" : "Code to Minify"}
            </label>
            <textarea
              id="code-input"
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Paste your code here…"
              className="
                w-full h-64 p-4 border border-gray-300 rounded-md bg-white
                focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
              "
            />
            <p className="mt-1 text-xs text-gray-500">
              {inputCount} characters
            </p>
          </div>

          {/* Output */}
          <div className="relative flex flex-col">
            <label
              htmlFor="code-output"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {mode === "format" ? "Formatted Code" : "Minified Code"}
            </label>
            <div className="relative">
              <textarea
                id="code-output"
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
            {mode === "format" ? "Format →" : "Minify →"}
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