// app/tools/markdown-converter/markdown-converter-client.tsx
"use client";

import React, {
  FC,
  useState,
  useEffect,
  ChangeEvent,
  useRef,
  useCallback,
} from "react";
import { Trash2, ClipboardCopy, Download } from "lucide-react";

/**
 * Markdown Converter Tool
 *
 * Live-edit Markdown and convert to clean HTML with instant preview,
 * copy or download HTML or original Markdown, complete with syntax highlighting.
 */

export interface MarkdownConverterClientProps {
  /** Main heading text */
  heading?: string;
  /** Subtitle/description text */
  description?: string;
  /** Gradient classes for headings */
  gradientClasses?: string;
  /** Tailwind focus-ring class */
  focusRingClass?: string;
  /** Override CSS for the Markdown textarea */
  inputClassName?: string;
  /** Override CSS for the HTML textarea */
  outputClassName?: string;
  /** Override CSS for primary action buttons */
  primaryButtonClassName?: string;
  /** Override CSS for secondary action buttons */
  secondaryButtonClassName?: string;
  /** Extra classes for the root section */
  rootClassName?: string;
}

/** Dynamically import and render Markdown → sanitized HTML */
async function renderMarkdown(md: string): Promise<string> {
  const [{ marked }, hljsModule] = await Promise.all([
    import("marked"),
    import("highlight.js"),
  ]);
  const hljs = hljsModule.default ?? hljsModule;
  marked.setOptions({
    // @ts-expect-error runtime highlight hook
    highlight: (code: string, lang: string) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
  });
  const raw = await marked.parse(md);
  // strip <script> for safety
  return raw.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}

const MarkdownConverterClient: FC<MarkdownConverterClientProps> = ({
  heading = "Markdown Converter",
  description =
    "Live-edit Markdown and convert to clean HTML or export as Markdown, complete with syntax highlighting.",
  gradientClasses = "from-purple-500 via-pink-500 to-yellow-400",
  focusRingClass = "focus:ring-indigo-500",
  inputClassName,
  outputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  rootClassName = "",
}) => {
  const [markdown, setMarkdown] = useState<string>(
    "# Markdown Converter\n\nStart typing your Markdown here…"
  );
  const [html, setHtml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // character counts
  const inputCount = markdown.length.toLocaleString();
  const outputCount = html.length.toLocaleString();

  // re-render HTML on Markdown change
  useEffect(() => {
    let cancelled = false;
    setError(null);
    renderMarkdown(markdown)
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error rendering Markdown");
          setHtml("");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [markdown]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const clearAll = useCallback(() => {
    setMarkdown("");
    setHtml("");
    setError(null);
    inputRef.current?.focus();
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
  }, []);

  const baseTextareaClasses = (override?: string) =>
    override ??
    `w-full p-4 border border-gray-300 rounded-md resize-y font-mono focus:outline-none ${focusRingClass} transition`;

  const primaryBtnClasses =
    primaryButtonClassName ??
    `inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r ${gradientClasses} text-white font-semibold rounded-md transition focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`;

  const secondaryBtnClasses =
    secondaryButtonClassName ??
    `inline-flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-md transition hover:bg-gray-200 focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <section
      id="markdown-converter"
      aria-labelledby="markdown-converter-heading"
      className={`text-gray-900 antialiased space-y-16 ${rootClassName}`}
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1
          id="markdown-converter-heading"
          className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses} text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight`}
        >
          {heading}
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="text-lg sm:text-xl text-gray-600">{description}</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Markdown Input */}
        <div>
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
            rows={8}
            className={baseTextareaClasses(inputClassName) + " bg-white"}
          />
          <p className="mt-1 text-xs text-gray-500">
            {inputCount} characters
          </p>
        </div>

        {/* HTML Output */}
        <div>
          <label
            htmlFor="html-output"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            HTML Output
          </label>
          <textarea
            id="html-output"
            value={html}
            readOnly
            placeholder="Converted HTML appears here…"
            rows={8}
            className={baseTextareaClasses(outputClassName) + " bg-gray-50"}
          />
          <p className="mt-1 text-xs text-gray-500">
            {outputCount} characters
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-4">
          <button
            type="button"
            onClick={() => copyToClipboard(html)}
            disabled={!html}
            className={primaryBtnClasses}
          >
            <ClipboardCopy className="w-5 h-5" />
            Copy HTML
          </button>

          <button
            type="button"
            onClick={() => {
              const blob = new Blob([html], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "converted.html";
              a.click();
              URL.revokeObjectURL(url);
            }}
            disabled={!html}
            className={secondaryBtnClasses}
          >
            <Download className="w-5 h-5" />
            Download HTML
          </button>

          <button
            type="button"
            onClick={() => {
              const blob = new Blob([markdown], { type: "text/markdown" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "source.md";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className={secondaryBtnClasses}
          >
            <Download className="w-5 h-5" />
            Download Markdown
          </button>

          <button
            type="button"
            onClick={clearAll}
            className={secondaryBtnClasses}
          >
            <Trash2 className="w-5 h-5" />
            Clear All
          </button>
        </div>

        {/* Live Preview */}
        <div
          className="prose prose-indigo max-w-none p-4 bg-gray-50 border border-gray-200 rounded-md markdown-preview overflow-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
};

export default MarkdownConverterClient;