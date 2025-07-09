// app/tools/regex-tester/regex-tester-client.tsx
"use client";

import { useState, ChangeEvent } from "react";

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
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
    // if user hasn't typed a pattern, don't try to match
    if (pattern.trim() === "") {
      setError("Please enter a regex pattern.");
      setMatches([]);
      return;
    }

    try {
      setError(null);
      // build the regex
      const regex = new RegExp(pattern, flags);
      // collect all full-match groups
      const allMatches = Array.from(testInput.matchAll(regex), (m) => m[0]);
      setMatches(allMatches);
    } catch (e) {
      // invalid pattern or flags
      setError(e instanceof Error ? e.message : "Invalid regex");
      setMatches([]);
    }
  }

  async function copyMatches() {
    if (!matches || matches.length === 0) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(matches, null, 2));
      alert("✅ Matches copied to clipboard!");
    } catch {
      alert("❌ Failed to copy matches.");
    }
  }

  return (
    <section
      id="regex-tester"
      aria-labelledby="regex-tester-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="regex-tester-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Regex Tester
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Enter a pattern, flags, and test text below to see all matches instantly. 100% client-side, no signup required.
      </p>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Pattern & Flags */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="pattern" className="block mb-1 font-medium text-gray-800">
              Pattern
            </label>
            <input
              id="pattern"
              type="text"
              value={pattern}
              onChange={handlePatternChange}
              placeholder="e.g. \\b\\w+\\b"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <div>
            <label htmlFor="flags" className="block mb-1 font-medium text-gray-800">
              Flags
            </label>
            <input
              id="flags"
              type="text"
              value={flags}
              onChange={handleFlagsChange}
              placeholder="e.g. gmi"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        {/* Test Input */}
        <div>
          <label htmlFor="test-input" className="block mb-1 font-medium text-gray-800">
            Test Text
          </label>
          <textarea
            id="test-input"
            value={testInput}
            onChange={handleInputChange}
            placeholder="Paste or type text to test..."
            className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Error */}
        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={runTest}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm font-medium"
          >
            Test Regex
          </button>
          <button
            type="button"
            onClick={copyMatches}
            disabled={!matches || matches.length === 0}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium disabled:opacity-60"
          >
            Copy Matches
          </button>
        </div>

        {/* Results */}
        {matches !== null && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {matches.length} Match{matches.length !== 1 ? "es" : ""}
            </h2>
            {matches.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {matches.map((m, i) => (
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