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
import esprima, { Program } from "esprima";
import type { Comment } from "estree";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserHtml from "prettier/parser-html";
import parserPostcss from "prettier/parser-postcss";

type Language = "javascript" | "css" | "html";

interface Preset {
  name: string;
  stripComments: boolean;
  collapseWhitespace: boolean;
  language: Language;
}

export default function CodeMinifierClient() {
  // ─── State ──────────────────────────────────────────────────────────────────
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
      { name, stripComments, collapseWhitespace, language },
    ]);
    setNewPresetName("");
  }

  // ─── Minification ───────────────────────────────────────────────────────────
  async function minifyCode() {
    setError(null);
    let code = input;

    try {
      // 1) Strip comments
      if (stripComments && language === "javascript") {
        const ast = esprima.parseScript(code, {
          comment: true,
          range: true,
        }) as Program & { comments: Comment[] };
        const ranges = ast.comments
          .map((c) => c.range!)
          .sort((a, b) => b[0] - a[0]);
        for (const [start, end] of ranges) {
          code = code.slice(0, start) + code.slice(end);
        }
      } else if (stripComments) {
        code = code
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/<!--[\s\S]*?-->/g, "");
      }

      // 2) Collapse whitespace
      if (collapseWhitespace) {
        if (language === "html") {
          code = code.replace(/\s+/g, " ");
        } else {
          code = code
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0)
            .join(" ");
        }
      }

      // 3) Prettier pass
      const parserName =
        language === "css" ? "css" : language === "html" ? "html" : "babel";
      const formatted = await prettier.format(code, {
        parser: parserName,
        plugins: [parserBabel, parserHtml, parserPostcss],
        printWidth: Infinity,
        bracketSpacing: false,
        singleQuote: false,
      });
      setOutput(formatted.trim());
    } catch (e: unknown) {
      console.error(e);
      setError("Minification failed: " + ((e as Error).message || "unknown"));
      setOutput("");
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
    a.download = "minified.txt";
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
        {/* Heading & Description */}
        <div className="text-center space-y-4">
          <h1
            id="code-minifier-heading"
            className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
          >
            Code Minifier
          </h1>
          <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
            Strip comments, collapse whitespace, and run Prettier—all client-side.
          </p>
        </div>

        {/* Controls Panel */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setShowPresets((v) => !v)}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition"
            >
              Presets{" "}
              {showPresets ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setShowAdvanced((v) => !v)}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition"
            >
              Advanced{" "}
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 transition"
            >
              <RefreshCcw className="w-5 h-5" /> Reset
            </button>
          </div>

          {showPresets && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">Presets</h2>
              {presets.length === 0 ? (
                <p className="text-gray-500">No presets yet.</p>
              ) : (
                presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(p)}
                    className="block w-full text-left px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition"
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 transition"
                />
                <button
                  onClick={savePreset}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {showAdvanced && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">Language</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 transition"
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
                  className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700">Strip Comments</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={collapseWhitespace}
                  onChange={(e) => setCollapseWhitespace(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
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
            className="w-full h-48 p-4 border border-gray-300 rounded-lg font-mono resize-y focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            onClick={minifyCode}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Minify
          </button>
        </div>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="max-w-3xl mx-auto text-red-600 text-sm"
          >
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
              className="w-full p-4 border border-gray-300 rounded-lg font-mono bg-gray-50 resize-y focus:ring-2 focus:ring-indigo-500 transition text-sm"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={copyOutput}
                className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <ClipboardCopy className="w-5 h-5" /> Copy
              </button>
              <button
                onClick={downloadOutput}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
              >
                <Download className="w-5 h-5" /> Download
              </button>
            </div>
          </div>
        )}
      </section>
    </Fragment>
  );
}