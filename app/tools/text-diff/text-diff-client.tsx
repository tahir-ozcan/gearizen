// app/tools/text-diff/text-diff-client.tsx

"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { diffWords } from "diff";

export default function TextDiffClient() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diffHtml, setDiffHtml] = useState<string | null>(null);

  const handleOriginalChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setOriginal(e.target.value);
  };
  const handleModifiedChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setModified(e.target.value);
  };

  const runDiff = (e: FormEvent) => {
    e.preventDefault();
    const parts = diffWords(original, modified);
    const html = parts
      .map((part, idx) => {
        if (part.added) {
          return `<span key=${idx} class="bg-green-100 text-green-800">${part.value}</span>`;
        } else if (part.removed) {
          return `<span key=${idx} class="bg-red-100 text-red-800 line-through">${part.value}</span>`;
        } else {
          return `<span key=${idx} class="text-gray-900">${part.value}</span>`;
        }
      })
      .join("");
    setDiffHtml(html);
  };

  const copyDiff = async () => {
    if (!diffHtml) return;
    try {
      await navigator.clipboard.writeText(diffHtml);
      alert("✅ Diff HTML copied to clipboard!");
    } catch {
      alert("❌ Copy failed.");
    }
  };

  return (
    <section
      id="text-diff"
      aria-labelledby="text-diff-heading"
      className="container-responsive py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="text-diff-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Text Diff Checker
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Compare two blocks of text and instantly see the differences highlighted.
        Additions in green, deletions in red—100% client-side, no signup required.
      </p>

      <form onSubmit={runDiff} className="max-w-4xl mx-auto space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="original-text" className="block mb-1 font-medium text-gray-800">
              Original Text
            </label>
            <textarea
              id="original-text"
              value={original}
              onChange={handleOriginalChange}
              placeholder="Enter original text..."
              className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <div>
            <label htmlFor="modified-text" className="block mb-1 font-medium text-gray-800">
              Modified Text
            </label>
            <textarea
              id="modified-text"
              value={modified}
              onChange={handleModifiedChange}
              placeholder="Enter modified text..."
              className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
          >
            Compare
          </button>
        </div>
      </form>

      {diffHtml && (
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Differences</h2>
          <div
            className="prose prose-sm max-w-none whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: diffHtml }}
          />
          <div className="mt-6 text-center">
            <button
              onClick={copyDiff}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium"
            >
              Copy Diff HTML
            </button>
          </div>
        </div>
      )}
    </section>
  );
}