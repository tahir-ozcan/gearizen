"use client";

import { useState, ChangeEvent, useMemo } from "react";
import { renderMarkdown } from "./render-markdown";
import Textarea from "@/components/Textarea";

export default function MarkdownPreviewerClient() {
  const [markdown, setMarkdown] = useState("# Hello World\n");

  // Memoize the rendered HTML so the preview updates efficiently as the user
  // types. This prevents unnecessary DOMPurify executions on every render.
  const html = useMemo(() => renderMarkdown(markdown), [markdown]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  return (
    <section className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-extrabold text-center mb-6">Markdown Previewer</h1>
      <p className="text-center text-gray-600 mb-4">Live-preview your Markdown as you type.</p>
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
    </section>
  );
}
