// app/tools/text-diff/text-diff-client.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { diffWords, Change } from "diff";
import { ClipboardCopy } from "lucide-react";

/**
 * Text Diff Checker Tool
 *
 * Compare two blocks of text side-by-side with inline highlights:
 * additions in green, deletions in red—100% client-side.
 */
export default function TextDiffClient() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [leftHtml, setLeftHtml] = useState("");
  const [rightHtml, setRightHtml] = useState("");

  function handleOriginalChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setOriginal(e.target.value);
  }

  function handleModifiedChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setModified(e.target.value);
  }

  function renderSideBySide() {
    // diffWords returns Change[] 
    const parts: Change[] = diffWords(original, modified);
    let left = "";
    let right = "";

    parts.forEach((p) => {
      // escape HTML
      const escaped = p.value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      if (p.added) {
        // show additions on the right
        right += `<span class="bg-green-100 text-green-800">${escaped}</span>`;
      } else if (p.removed) {
        // show deletions on the left
        left += `<span class="bg-red-100 text-red-800 line-through">${escaped}</span>`;
      } else {
        // unchanged in both
        left += `<span>${escaped}</span>`;
        right += `<span>${escaped}</span>`;
      }
    });

    setLeftHtml(left || "<em>(no content)</em>");
    setRightHtml(right || "<em>(no content)</em>");
  }

  function runDiff(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    renderSideBySide();
  }

  const copyDiff = async () => {
    if (!leftHtml && !rightHtml) return;
    const html = `
      <div style="display:flex; gap:1rem;">
        <div style="flex:1; padding:1rem; border:1px solid #ddd; overflow:auto;">
          ${leftHtml}
        </div>
        <div style="flex:1; padding:1rem; border:1px solid #ddd; overflow:auto;">
          ${rightHtml}
        </div>
      </div>`;
    try {
      await navigator.clipboard.writeText(html);
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
          Compare two text blocks side-by-side and highlight additions, deletions and changes for effortless proofreading.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={runDiff} className="max-w-4xl mx-auto space-y-6 sm:px-0">
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
      {(leftHtml || rightHtml) && (
        <div className="mt-12 max-w-4xl mx-auto sm:px-0 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Differences</h2>
          <div className="flex gap-4">
            <div
              className="prose prose-sm w-1/2 max-w-none whitespace-pre-wrap break-words p-4 border rounded bg-gray-50"
              dangerouslySetInnerHTML={{ __html: leftHtml }}
            />
            <div
              className="prose prose-sm w-1/2 max-w-none whitespace-pre-wrap break-words p-4 border rounded bg-gray-50"
              dangerouslySetInnerHTML={{ __html: rightHtml }}
            />
          </div>
          <div className="text-center">
            <button
              onClick={copyDiff}
              className="
                inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white
                rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2
                focus-visible:ring-green-500 transition text-sm font-medium
              "
            >
              <ClipboardCopy className="w-5 h-5" />
              Copy Diff HTML
            </button>
          </div>
        </div>
      )}
    </section>
  );
}