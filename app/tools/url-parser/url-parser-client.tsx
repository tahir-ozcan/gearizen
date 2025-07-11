"use client";

import { useState } from "react";
import { parseUrl, ParsedUrl } from "../../../lib/parse-url";

export default function UrlParserClient() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ParsedUrl | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = () => {
    try {
      const parsed = parseUrl(input.trim());
      setResult(parsed);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid URL");
      setResult(null);
    }
  };

  const copyJson = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      alert("✅ Copied!");
    } catch {
      alert("❌ Failed to copy");
    }
  };

  return (
    <section
      id="url-parser"
      aria-labelledby="url-parser-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="url-parser-heading"
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-6 tracking-tight"
      >
        URL Parser
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Decompose any URL into its individual components directly in your browser.
      </p>

      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <label htmlFor="url-input" className="block mb-1 font-medium text-gray-800">
            URL
          </label>
          <input
            id="url-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com/path?foo=1#section"
            className="input-base"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <button type="button" onClick={handleParse} className="btn-primary">
            Parse
          </button>
          <button
            type="button"
            onClick={copyJson}
            disabled={!result}
            className="btn-secondary disabled:opacity-60"
          >
            Copy JSON
          </button>
        </div>

        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}

        {result && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-300 rounded-lg">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <th className="text-left p-2 font-medium">Protocol</th>
                  <td className="p-2 font-mono break-all">{result.protocol}</td>
                </tr>
                <tr>
                  <th className="text-left p-2 font-medium">Host</th>
                  <td className="p-2 font-mono break-all">{result.host}</td>
                </tr>
                <tr>
                  <th className="text-left p-2 font-medium">Pathname</th>
                  <td className="p-2 font-mono break-all">{result.pathname}</td>
                </tr>
                <tr>
                  <th className="text-left p-2 font-medium">Search</th>
                  <td className="p-2 font-mono break-all">{result.search}</td>
                </tr>
                <tr>
                  <th className="text-left p-2 font-medium">Hash</th>
                  <td className="p-2 font-mono break-all">{result.hash}</td>
                </tr>
                {Object.keys(result.params).length > 0 && (
                  <tr>
                    <th className="text-left p-2 font-medium">Params</th>
                    <td className="p-2 font-mono break-all whitespace-pre">
                      {JSON.stringify(result.params, null, 2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
