// app/tools/markdown-converter/markdown-converter-client.tsx
"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { Trash2, ClipboardCopy, Download } from "lucide-react";

/**
 * Markdown Converter Tool
 *
 * Live-edit Markdown and convert to clean HTML with instant preview,
 * copy or download HTML or original Markdown—100% client-side, no signup required.
 */

/**
 * Simple Markdown → HTML renderer using the "marked" library.
 * We dynamically import it and sanitize via a basic regex strip.
 */
async function renderMarkdown(md: string): Promise<string> {
  const { marked } = await import("marked");
  // marked.parse may return Promise<string>, so await it
  const raw = await marked.parse(md);
  // strip out any <script> tags for safety
  return raw.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}

export default function MarkdownConverterClient() {
  const [markdown, setMarkdown] = useState<string>(
    "# Markdown Converter\n\nStart typing your Markdown here…"
  );
  const [html, setHtml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Re-render HTML on Markdown change
  useEffect(() => {
    let canceled = false;
    setError(null);

    renderMarkdown(markdown)
      .then((result) => {
        if (!canceled) setHtml(result);
      })
      .catch((err) => {
        if (!canceled) {
          setError(err instanceof Error ? err.message : "Error rendering Markdown");
          setHtml("");
        }
      });

    return () => {
      canceled = true;
    };
  }, [markdown]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const clearAll = () => {
    setMarkdown("");
    setHtml("");
    setError(null);
    inputRef.current?.focus();
  };

  const copyHtml = async () => {
    if (!html) return;
    try {
      await navigator.clipboard.writeText(html);
      alert("✅ HTML copied to clipboard!");
    } catch {
      alert("❌ Copy failed.");
    }
  };

  const downloadHtml = () => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadMd = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "source.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputCount = markdown.length.toLocaleString();
  const outputCount = html.length.toLocaleString();

  return (
    <section
      id="markdown-converter"
      aria-labelledby="markdown-converter-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-4">
        <h1
          id="markdown-converter-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Markdown Converter
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Live-edit Markdown and convert to clean HTML with instant preview, copy or download HTML or original Markdown.
        </p>
      </div>

      {/* Editor & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Markdown Input */}
        <div className="flex flex-col">
          <label
            htmlFor="markdown-input"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Markdown Input
          </label>
          <textarea
            id="markdown-input"
            ref={inputRef}
            value={markdown}
            onChange={handleChange}
            placeholder="Type your Markdown here…"
            className="
              w-full h-64 p-4 border border-gray-300 rounded-md bg-white
              focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
            "
          />
          <p className="mt-1 text-xs text-gray-500">{inputCount} characters</p>
        </div>

        {/* HTML Output */}
        <div className="flex flex-col">
          <label
            htmlFor="html-output"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            HTML Output
          </label>
          <div className="relative">
            <textarea
              id="html-output"
              value={html}
              readOnly
              placeholder="Converted HTML appears here…"
              className="
                w-full h-64 p-4 border border-gray-300 rounded-md bg-gray-50
                focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
              "
            />
            <button
              type="button"
              onClick={copyHtml}
              disabled={!html}
              aria-label="Copy HTML"
              className="
                absolute top-2 right-2 p-2 text-gray-500 hover:text-[#7c3aed]
                disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition
              "
            >
              <ClipboardCopy className="w-6 h-6" />
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">{outputCount} characters</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-3xl mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
        <button
          type="button"
          onClick={copyHtml}
          disabled={!html}
          className="
            inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md
            hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
            transition disabled:opacity-50
          "
        >
          <ClipboardCopy className="w-5 h-5" />
          Copy HTML
        </button>
        <button
          type="button"
          onClick={downloadHtml}
          disabled={!html}
          className="
            inline-flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-md
            hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300
            transition disabled:opacity-50
          "
        >
          <Download className="w-5 h-5" />
          Download HTML
        </button>
        <button
          type="button"
          onClick={downloadMd}
          className="
            inline-flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-md
            hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300
            transition
          "
        >
          <Download className="w-5 h-5" />
          Download Markdown
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="
            inline-flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-md
            hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300
            transition
          "
        >
          <Trash2 className="w-5 h-5" />
          Clear All
        </button>
      </div>

      {/* Live Preview */}
      <div
        className="
          max-w-3xl mx-auto prose prose-indigo p-4 border border-gray-300
          rounded-lg bg-gray-50 overflow-auto markdown-preview
        "
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}