// app/tools/markdown-to-html/markdown-to-html-client.tsx

"use client";

import { useState, ChangeEvent } from "react";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

export default function MarkdownToHtmlClient() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleMarkdownChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
    setError(null);
  };

  // convert artık async, raw'ı await ediyoruz
  const convert = async () => {
    try {
      const raw = await marked(markdown);               // string | Promise<string>
      const clean = DOMPurify.sanitize(raw as string);  // artık kesin string
      setHtml(clean);
    } catch {
      setError("Conversion failed. Please check your Markdown syntax.");
      setHtml("");
    }
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
      id="markdown-to-html"
      aria-labelledby="markdown-to-html-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-brand-200 selection:text-brand-900"
    >
      <h1
        id="markdown-to-html-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Markdown → HTML Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Paste Markdown on the left, convert to clean HTML on the right.  
        Copy or download your HTML snippet—100% client-side, no signup.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Markdown Input */}
        <div>
          <label htmlFor="markdown-input" className="sr-only">
            Markdown input
          </label>
          <textarea
            id="markdown-input"
            value={markdown}
            onChange={handleMarkdownChange}
            placeholder="Enter Markdown here..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
          />
        </div>

        {/* HTML Output */}
        <div>
          <label htmlFor="html-output" className="sr-only">
            HTML output
          </label>
          <textarea
            id="html-output"
            value={html}
            readOnly
            placeholder="Converted HTML will appear here..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={convert}
          className="px-6 py-3 bg-brand-600 text-white rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition text-sm font-medium"
        >
          Convert
        </button>
        <button
          type="button"
          onClick={copyHtml}
          disabled={!html}
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium disabled:opacity-60"
        >
          Copy HTML
        </button>
        <button
          type="button"
          onClick={downloadHtml}
          disabled={!html}
          className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition text-sm font-medium disabled:opacity-60"
        >
          Download HTML
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md max-w-2xl mx-auto"
        >
          {error}
        </div>
      )}
    </section>
  );
}