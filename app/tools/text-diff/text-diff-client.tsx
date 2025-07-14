// app/tools/text-diff/text-diff-client.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { diffWords } from "diff";

/**
 * Text Diff Checker Tool
 *
 * Compare two blocks of text side-by-side with inline highlights:
 * additions in green, deletions in red—100% client-side.
 */
export default function TextDiffClient() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diffHtml, setDiffHtml] = useState("");

  const handleOriginalChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setOriginal(e.target.value);
  };

  const handleModifiedChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setModified(e.target.value);
  };

  const runDiff = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parts = diffWords(original, modified);
    const html = parts
      .map(part => {
        if (part.added) {
          return `<span class="bg-green-100 text-green-800">${part.value}</span>`;
        }
        if (part.removed) {
          return `<span class="bg-red-100 text-red-800 line-through">${part.value}</span>`;
        }
        return `<span class="text-gray-900">${part.value}</span>`;
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
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center sm:px-0 space-y-4">
        <h1
          id="text-diff-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Text Diff Checker
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-3xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Compare two blocks of text side-by-side. Additions are highlighted in green,
          deletions in red, with instant inline diff—entirely client-side.
        </p>
      </div>

      {/* Input Form */}
      <form
        onSubmit={runDiff}
        className="max-w-4xl mx-auto space-y-6 sm:px-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="original-text"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Original Text
            </label>
            <textarea
              id="original-text"
              value={original}
              onChange={handleOriginalChange}
              placeholder="Paste or type the original text…"
              className="
                w-full h-48 p-4 border border-gray-300 rounded-md bg-white
                font-mono text-sm resize-y focus:ring-2 focus:ring-[#7c3aed]
                transition
              "
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="modified-text"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Modified Text
            </label>
            <textarea
              id="modified-text"
              value={modified}
              onChange={handleModifiedChange}
              placeholder="Paste or type the modified text…"
              className="
                w-full h-48 p-4 border border-gray-300 rounded-md bg-white
                font-mono text-sm resize-y focus:ring-2 focus:ring-[#7c3aed]
                transition
              "
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="
              inline-block px-8 py-3 bg-indigo-600 text-white rounded-full
              hover:bg-indigo-700 focus:outline-none focus-visible:ring-2
              focus-visible:ring-indigo-500 transition font-medium
            "
          >
            Compare Text
          </button>
        </div>
      </form>

      {/* Diff Output */}
      {diffHtml && (
        <div className="mt-12 max-w-4xl mx-auto sm:px-0 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Differences</h2>
          <div
            className="prose prose-sm max-w-none whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: diffHtml }}
          />
          <div className="text-center">
            <button
              onClick={copyDiff}
              className="
                inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white
                rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2
                focus-visible:ring-green-500 transition text-sm font-medium
              "
            >
              Copy Diff HTML
            </button>
          </div>
        </div>
      )}
    </section>
  );
}