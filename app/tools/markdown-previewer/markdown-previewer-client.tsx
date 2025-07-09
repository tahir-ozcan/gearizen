"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { markdownToHtml } from "./markdown-utils";

export default function MarkdownPreviewerClient() {
  const [markdown, setMarkdown] = useState("# Hello World\n");
  const [html, setHtml] = useState(markdownToHtml(markdown));

  // Re-render HTML preview whenever the Markdown input changes
  useEffect(() => {
    setHtml(markdownToHtml(markdown));
  }, [markdown]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  return (
    <section className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-extrabold text-center mb-6">Markdown Previewer</h1>
      <p className="text-center text-gray-600 mb-4">Live-preview your Markdown as you type.</p>
      <div className="grid gap-6 md:grid-cols-2">
        <textarea
          value={markdown}
          onChange={handleChange}
          className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div
          className="prose max-w-none p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-auto"
          // html preview is pre-sanitized in state
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}
