// app/tools/markdown-converter/markdown-converter-client.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { renderMarkdown } from "@/lib/render-markdown";
import Textarea from "@/components/Textarea";

export default function MarkdownConverterClient() {
  // ─── State ─────────────────────────────────────────────────────────────────
  const [markdown, setMarkdown] = useState<string>("# Hello World\n");
  const [html, setHtml] = useState<string>("");

  // Whenever `markdown` changes, re-render to sanitized HTML
  useEffect(() => {
    let cancelled = false;

    renderMarkdown(markdown)
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch((err) => {
        console.error("Markdown render failed:", err);
        if (!cancelled) setHtml("");
      });

    return () => {
      cancelled = true;
    };
  }, [markdown]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const copyHtml = async () => {
    if (!html) return;
    try {
      await navigator.clipboard.writeText(html);
      alert("✅ HTML copied to clipboard!");
    } catch {
      alert("❌ Failed to copy HTML.");
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

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      id="markdown-converter"
      aria-labelledby="markdown-converter-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      {/* Heading & Description */}
      <h1
        id="markdown-converter-heading"
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]"
      >
        Markdown Converter &amp; Previewer
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Edit Markdown on the left, copy sanitized HTML on the right, and preview below.
      </p>

      {/* Editor & HTML Output */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Markdown Input */}
        <Textarea
          value={markdown}
          onChange={handleChange}
          className="h-64 font-mono text-sm resize-y border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
          aria-label="Markdown input"
        />

        {/* Sanitized HTML output */}
        <textarea
          value={html}
          readOnly
          aria-label="Converted HTML"
          className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Copy / Download Buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={copyHtml}
          disabled={!html}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition disabled:opacity-50"
        >
          Copy HTML
        </button>
        <button
          type="button"
          onClick={downloadHtml}
          disabled={!html}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition disabled:opacity-50"
        >
          Download HTML
        </button>
      </div>

      {/* Live HTML Preview */}
      <div
        className="mt-10 prose max-w-none p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-auto"
        aria-live="polite"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}