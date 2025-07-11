// app/tools/markdown-converter/markdown-converter-client.tsx
"use client";

import { useState, ChangeEvent, useMemo } from "react";
import { renderMarkdown } from "@/lib/render-markdown";
import Textarea from "@/components/Textarea";

export default function MarkdownConverterClient() {
  const [markdown, setMarkdown] = useState<string>("# Hello World\n");
  const html = useMemo(() => renderMarkdown(markdown), [markdown]);

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

  return (
    <section
      id="markdown-converter"
      aria-labelledby="markdown-converter-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="markdown-converter-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Markdown Converter & Previewer
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Edit Markdown on the left, copy sanitized HTML on the right and preview below.
      </p>
      <div className="grid gap-8 lg:grid-cols-2">
        <Textarea
          value={markdown}
          onChange={handleChange}
          className="h-64 font-mono text-sm resize-y"
        />
        <textarea
          value={html}
          readOnly
          aria-label="Converted HTML"
          className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={copyHtml}
          disabled={!html}
          className="btn-primary disabled:opacity-60"
        >
          Copy HTML
        </button>
        <button
          type="button"
          onClick={downloadHtml}
          disabled={!html}
          className="btn-secondary disabled:opacity-60"
        >
          Download HTML
        </button>
      </div>
      <div className="mt-10 prose max-w-none p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-auto" aria-live="polite" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
