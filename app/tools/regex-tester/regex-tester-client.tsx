// app/tools/regex-tester/regex-tester-client.tsx
"use client";

import { useState, ChangeEvent } from "react";

/**
 * Regex Tester Tool
 *
 * Enter a regular expression with optional flags and sample text to highlight and list all matches instantly—100% client-side.
 */
export default function RegexTesterClient() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("");
  const [testInput, setTestInput] = useState("");
  const [matches, setMatches] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handlePatternChange(e: ChangeEvent<HTMLInputElement>) {
    setPattern(e.target.value);
    setError(null);
    setMatches(null);
  }

  function handleFlagsChange(e: ChangeEvent<HTMLInputElement>) {
    setFlags(e.target.value);
    setError(null);
    setMatches(null);
  }

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setTestInput(e.target.value);
    setMatches(null);
  }

  function runTest() {
    if (!pattern.trim()) {
      setError("Please enter a regex pattern.");
      setMatches([]);
      return;
    }
    try {
      const regex = new RegExp(pattern, flags);
      const found = Array.from(testInput.matchAll(regex), (m) => m[0]);
      setMatches(found);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regex");
      setMatches([]);
    }
  }

  async function copyMatches() {
    if (!matches || matches.length === 0) return;
    try {
      await navigator.clipboard.writeText(matches.join("\n"));
      alert("✅ Matches copied to clipboard!");
    } catch {
      alert("❌ Failed to copy matches.");
    }
  }

  const hasMatches = matches !== null;
  const hasResults = hasMatches && matches.length > 0;

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
          Enter a regular expression, optional flags, and sample text to find and list all matches—no server, fully client-side.
        </p>
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
              onChange={handlePatternChange}
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
              onChange={handleFlagsChange}
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
            onChange={handleInputChange}
            placeholder="Paste or type text to test…"
            className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:ring-2 focus:ring-[#7c3aed] transition"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={runTest}
            className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium"
          >
            Run Test
          </button>
          <button
            type="button"
            onClick={copyMatches}
            disabled={!hasResults}
            className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition font-medium disabled:opacity-50"
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
        {hasMatches && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {matches!.length} Match{matches!.length !== 1 ? "es" : ""}
            </h2>
            {hasResults ? (
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {matches!.map((m, i) => (
                  <li key={i} className="font-mono text-sm">
                    {m}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">No matches found.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}