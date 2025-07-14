// app/tools/regex-tester/regex-tester-client.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";

/**
 * Regex Tester Tool
 *
 * Build, test, and debug regular expressions with real-time match highlighting
 * and a library of common patterns—100% client-side.
 */

interface CommonPattern {
  name: string;
  pattern: string;
  flags: string;
}

const COMMON_PATTERNS: CommonPattern[] = [
  { name: "Email address", pattern: `\\b[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}\\b`, flags: "gi" },
  { name: "URL", pattern: `https?://[\\w./?=&%-]+`, flags: "gi" },
  { name: "Digits", pattern: `\\d+`, flags: "g" },
  { name: "Hex color", pattern: `#[0-9A-Fa-f]{3,6}\\b`, flags: "g" },
  { name: "Whitespace", pattern: `\\s+`, flags: "g" },
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testInput, setTestInput] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [highlightHtml, setHighlightHtml] = useState<string>("");

  // Apply a common pattern from the library
  function applyCommon(cp: CommonPattern) {
    setPattern(cp.pattern);
    setFlags(cp.flags);
  }

  // Run the regex and update matches & highlighting
  useEffect(() => {
    // Show raw text if pattern is empty
    if (!pattern) {
      setMatches([]);
      setHighlightHtml(escapeHtml(testInput));
      setError(null);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const found = Array.from(testInput.matchAll(regex), m => m[0]);
      setMatches(found);
      setError(null);

      const escaped = escapeHtml(testInput);
      // Wrap each match in <mark>
      const highlighted = escaped.replace(
        regex,
        m => `<mark>${escapeHtml(m)}</mark>`
      );
      setHighlightHtml(highlighted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regex");
      setMatches([]);
      setHighlightHtml(escapeHtml(testInput));
    }
  }, [pattern, flags, testInput]);

  const hasMatches = matches.length > 0;

  return (
    <section
      id="regex-tester"
      aria-labelledby="regex-tester-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center sm:px-0 space-y-4">
        <h1
          id="regex-tester-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Regex Tester
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Build, test and debug regular expressions with real-time match highlighting and a library of common patterns.
        </p>
      </div>

      {/* Common Patterns Library */}
      <div className="max-w-2xl mx-auto space-y-6 sm:px-0">
        <label className="block mb-1 font-medium text-gray-800">
          Common Patterns
        </label>
        <div className="grid grid-cols-2 gap-2">
          {COMMON_PATTERNS.map(cp => (
            <button
              key={cp.name}
              onClick={() => applyCommon(cp)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-800 transition"
            >
              {cp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="max-w-2xl mx-auto space-y-6 sm:px-0">
        {/* Pattern & Flags */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="pattern" className="block text-sm font-medium text-gray-800 mb-1">
              Pattern
            </label>
            <input
              id="pattern"
              type="text"
              value={pattern}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPattern(e.target.value)}
              placeholder="e.g. \\b\\w+\\b"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c3aed] transition"
            />
          </div>
          <div>
            <label htmlFor="flags" className="block text-sm font-medium text-gray-800 mb-1">
              Flags
            </label>
            <input
              id="flags"
              type="text"
              value={flags}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFlags(e.target.value)}
              placeholder="e.g. gi"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c3aed] transition"
            />
          </div>
        </div>

        {/* Test Text */}
        <div>
          <label htmlFor="test-input" className="block text-sm font-medium text-gray-800 mb-1">
            Test Text
          </label>
          <textarea
            id="test-input"
            value={testInput}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTestInput(e.target.value)}
            placeholder="Paste or type text to test…"
            className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:ring-2 focus:ring-[#7c3aed] transition"
          />
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Preview
          </label>
          <pre
            className="w-full h-40 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-auto font-mono text-sm"
            dangerouslySetInnerHTML={{ __html: highlightHtml }}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {}}
            className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium"
          >
            Test
          </button>
          <button
            onClick={async () => {
              if (!hasMatches) return;
              await navigator.clipboard.writeText(matches.join("\n"));
              alert("✅ Matches copied to clipboard!");
            }}
            disabled={!hasMatches}
            className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-500 transition font-medium disabled:opacity-50"
          >
            Copy Matches
          </button>
        </div>

        {/* Error */}
        {error && (
          <p role="alert" className="text-center text-red-600 text-sm">
            {error}
          </p>
        )}

        {/* Results */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {matches.length} Match{matches.length !== 1 ? "es" : ""}
          </h2>
          {matches.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-gray-700 font-mono text-sm">
              {matches.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No matches found.</p>
          )}
        </div>
      </div>
    </section>
  );
}