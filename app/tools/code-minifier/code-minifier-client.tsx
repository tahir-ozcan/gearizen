// app/tools/code-minifier/code-minifier-client.tsx
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  Fragment,
} from "react";
import {
  ClipboardCopy,
  Download,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
} from "lucide-react";
import { minify as terserMinify } from "terser";

type Language = "javascript" | "css" | "html";

interface Preset {
  name: string;
  language: Language;
  stripComments: boolean;
  collapseWhitespace: boolean;
}

export default function CodeMinifierClient() {
  // ─── State ────────────────────────────────────────────────────────────────
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [language, setLanguage] = useState<Language>("javascript");
  const [stripComments, setStripComments] = useState<boolean>(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState<boolean>(true);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showPresets, setShowPresets] = useState<boolean>(false);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [newPresetName, setNewPresetName] = useState<string>("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  function resetAll() {
    setInput("");
    setOutput("");
    setError(null);
    inputRef.current?.focus();
  }

  function applyPreset(p: Preset) {
    setLanguage(p.language);
    setStripComments(p.stripComments);
    setCollapseWhitespace(p.collapseWhitespace);
  }

  function savePreset() {
    const name = newPresetName.trim();
    if (!name) return;
    setPresets((ps) => [
      ...ps,
      { name, language, stripComments, collapseWhitespace },
    ]);
    setNewPresetName("");
  }

  // ─── Minification ───────────────────────────────────────────────────────────
  async function minifyCode() {
    setError(null);
    setOutput("");

    try {
      let result: string;

      if (language === "javascript") {
        // ─ JavaScript: terser ───────────────────────────────────────────────
        const terserOptions = {
          compress: true,
          mangle: true,
          format: { comments: stripComments ? false : true },
        };
        const { code: minified, error: terserError } = await terserMinify(
          input,
          terserOptions
        );
        if (terserError) throw terserError;
        result = minified ?? "";

      } else if (language === "css") {
        // ─ CSS: csso (dynamically imported) ───────────────────────────────
        const csso = (await import("csso")).default;
        const cssoOptions = {
          restructure: collapseWhitespace,
          comments: stripComments ? false : true,
        };
        result = csso.minify(input, cssoOptions).css;

      } else {
        // ─ HTML: html-minifier-terser (dynamically imported) ────────────
        const { minify: htmlMinify } = await import(
          "html-minifier-terser"
        );
        const htmlOptions = {
          collapseWhitespace,
          removeComments: stripComments,
          removeAttributeQuotes: false,
          minifyJS: true,
          minifyCSS: true,
        };
        // htmlMinify returns Promise<string>
        result = await htmlMinify(input, htmlOptions);
      }

      setOutput(result.trim());
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setError("Minification failed: " + msg);
    }
  }

  // ─── Copy & Download ────────────────────────────────────────────────────────
  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Copied!");
    } catch {
      alert("❌ Copy failed.");
    }
  };
  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `minified.${language === "javascript" ? "js" : language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Fragment>
      <section
        id="code-minifier"
        aria-labelledby="code-minifier-heading"
        className="space-y-16 text-gray-900 antialiased"
      >
        {/* Heading */}
        <div className="text-center space-y-4">
          <h1
            id="code-minifier-heading"
            className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24] text-4xl font-extrabold"
          >
            Code Minifier
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Strip comments, collapse whitespace, and minify—all client-side.
          </p>
        </div>

        {/* Controls */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setShowPresets((v) => !v)}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
            >
              Presets {showPresets ? <ChevronUp /> : <ChevronDown />}
            </button>
            <button
              onClick={() => setShowAdvanced((v) => !v)}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
            >
              Advanced {showAdvanced ? <ChevronUp /> : <ChevronDown />}
            </button>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800"
            >
              <RefreshCcw /> Reset
            </button>
          </div>

          {showPresets && (
            <div className="p-4 border rounded bg-gray-50 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">Presets</h2>
              {presets.length === 0 ? (
                <p className="text-gray-500">No presets yet.</p>
              ) : (
                presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(p)}
                    className="block w-full text-left px-3 py-2 border rounded hover:bg-gray-100"
                  >
                    {p.name}
                  </button>
                ))
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Preset name"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                />
                <button
                  onClick={savePreset}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {showAdvanced && (
            <div className="p-4 border rounded bg-gray-50 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">
                  Language
                </span>
                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as Language)
                  }
                  className="mt-1 px-3 py-2 border rounded"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                </select>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={stripComments}
                  onChange={(e) => setStripComments(e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-gray-700">Strip Comments</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={collapseWhitespace}
                  onChange={(e) =>
                    setCollapseWhitespace(e.target.checked)
                  }
                  className="h-4 w-4 rounded"
                />
                <span className="text-gray-700">Collapse Whitespace</span>
              </label>
            </div>
          )}
        </div>

        {/* Editor & Minify */}
        <div className="max-w-3xl mx-auto space-y-4">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            placeholder="Paste code here…"
            className="w-full h-48 p-4 border rounded-lg font-mono resize-y"
          />
          <button
            onClick={minifyCode}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg"
          >
            Minify
          </button>
        </div>

        {/* Error */}
        {error && (
          <p role="alert" className="max-w-3xl mx-auto text-red-600">
            {error}
          </p>
        )}

        {/* Output & Actions */}
        {output && (
          <div className="max-w-3xl mx-auto space-y-3">
            <textarea
              readOnly
              value={output}
              rows={6}
              className="w-full p-4 border rounded-lg font-mono bg-gray-50 resize-y"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={copyOutput}
                className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg"
              >
                <ClipboardCopy /> Copy
              </button>
              <button
                onClick={downloadOutput}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gray-700 text-white rounded-lg"
              >
                <Download /> Download
              </button>
            </div>
          </div>
        )}
      </section>
    </Fragment>
  );
}