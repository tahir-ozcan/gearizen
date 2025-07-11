"use client";

import { useState, ChangeEvent, useMemo } from "react";
import { renderMarkdown } from "./render-markdown";
import Textarea from "@/components/Textarea";

export default function MarkdownPreviewerClient() {
  const [markdown, setMarkdown] = useState("# Hello World\n");

  const copyHtml = async () => {
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

  // Memoize the rendered HTML so the preview updates efficiently as the user
  // types. This prevents unnecessary DOMPurify executions on every render.
  const html = useMemo(() => renderMarkdown(markdown), [markdown]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  return (
    <section className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-extrabold text-center mb-6">Markdown Preview & Converter</h1>
      <p className="text-center text-gray-600 mb-4">Preview Markdown live and grab the sanitized HTML when ready.</p>
      <div className="grid gap-6 md:grid-cols-2">
        <Textarea
          value={markdown}
          onChange={handleChange}
          className="h-64 font-mono text-sm resize-y"
        />
        <div
          className="prose max-w-none p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-auto"
          // aria-live ensures screen readers announce changes when the user
          // edits the markdown input.
          aria-live="polite"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          type="button"
          onClick={copyHtml}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium"
        >
          Copy HTML
        </button>
        <button
          type="button"
          onClick={downloadHtml}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition text-sm font-medium"
        >
          Download HTML
        </button>
      </div>

      <div>
        <label htmlFor="html-output" className="sr-only">
          HTML Output
        </label>
        <textarea
          id="html-output"
          value={html}
          readOnly
          className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>
    </section>
  );
}

