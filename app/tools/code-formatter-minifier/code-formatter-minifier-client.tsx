// app/tools/code-formatter-minifier/code-formatter-minifier-client.tsx
"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import {
  Trash2,
  ClipboardCopy,
  Check,
} from "lucide-react";
import {
  html as beautifyHTML,
  css as beautifyCSS,
  js as beautifyJS,
} from "js-beautify";

export interface CodeFormatterMinifierProps {
  /** Main heading text */
  heading?: string;
  /** Subtitle/description text */
  description?: string;
  /** Gradient classes for headings and accents */
  gradientClasses?: string;
  /** Focus-ring Tailwind class */
  focusRingClass?: string;
  /** Labels & placeholders */
  inputLabel?: string;
  outputLabelFormat?: string;
  outputLabelMinify?: string;
  placeholderInput?: string;
  placeholderOutput?: string;
  clearButtonLabel?: string;
  copyButtonLabel?: string;
  /** Extra classes for overrides */
  rootClassName?: string;
  inputClassName?: string;
  outputClassName?: string;
  secondaryButtonClassName?: string;
}

export default function CodeFormatterMinifierClient({
  heading = "Code Formatter & Minifier",
  description =
    "Instantly beautify and compress your HTML, CSS, and JavaScript code client-side—no uploads, privacy-first, zero signup, lightning-fast.",
  gradientClasses = "from-purple-500 via-pink-500 to-yellow-400",
  focusRingClass = "focus:ring-purple-500",
  inputLabel = "Your Code",
  outputLabelFormat = "Beautified Code",
  outputLabelMinify = "Minified Code",
  placeholderInput = "Enter HTML, CSS, or JS code here…",
  placeholderOutput = "Result appears here…",
  clearButtonLabel = "Clear All",
  copyButtonLabel = "Copy",
  rootClassName = "",
  inputClassName,
  outputClassName,
  secondaryButtonClassName,
}: CodeFormatterMinifierProps) {
  const [inputCode, setInputCode] = useState("");
  const [formattedCode, setFormattedCode] = useState("");
  const [minifiedCode, setMinifiedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const baseInputClasses =
    inputClassName ??
    `w-full min-h-[14rem] p-4 bg-gray-50 border border-gray-300 rounded-md font-mono resize-y placeholder-gray-400 focus:outline-none ${focusRingClass}`;
  const baseOutputClasses =
    outputClassName ??
    `w-full min-h-[14rem] p-4 bg-gray-50 border border-gray-300 rounded-md font-mono resize-none placeholder-gray-400 focus:outline-none ${focusRingClass}`;
  const secondaryBtnClasses =
    secondaryButtonClassName ??
    `inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300`;

  const detectLanguage = useCallback(
    (code: string): "html" | "css" | "js" => {
      const trimmed = code.trim();
      if (trimmed.startsWith("<")) return "html";
      if (/^\s*[.#]?[A-Za-z0-9_-]+\s*\{/.test(code)) return "css";
      return "js";
    },
    []
  );

  const processCode = useCallback(
    (code: string) => {
      if (!code.trim()) {
        setFormattedCode("");
        setMinifiedCode("");
        setError(null);
        return;
      }
      try {
        const lang = detectLanguage(code);
        let fmt: string;
        let min: string;
        switch (lang) {
          case "css":
            fmt = beautifyCSS(code, { indent_size: 2 });
            min = beautifyCSS(code, {
              indent_size: 0,
              max_preserve_newlines: 0,
              wrap_line_length: 0,
            });
            break;
          case "js":
            fmt = beautifyJS(code, { indent_size: 2 });
            min = beautifyJS(code, {
              indent_size: 0,
              max_preserve_newlines: 0,
              wrap_line_length: 0,
            });
            break;
          default:
            fmt = beautifyHTML(code, {
              indent_size: 2,
              wrap_line_length: 0,
            });
            min = beautifyHTML(code, {
              indent_size: 0,
              max_preserve_newlines: 0,
              wrap_line_length: 0,
            });
        }
        setFormattedCode(fmt);
        setMinifiedCode(min);
        setError(null);
      } catch {
        setError("❌ Processing failed");
        setFormattedCode("");
        setMinifiedCode("");
      }
    },
    [detectLanguage]
  );

  // Run on every input change
  useEffect(() => {
    processCode(inputCode);
  }, [inputCode, processCode]);

  const clearAll = useCallback(() => {
    setInputCode("");
    setFormattedCode("");
    setMinifiedCode("");
    setError(null);
    inputRef.current?.focus();
  }, []);

  const handleCopy = useCallback(async () => {
    if (!formattedCode) return;
    try {
      await navigator.clipboard.writeText(formattedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  }, [formattedCode]);

  return (
    <section
      id="code-formatter-minifier"
      aria-labelledby="formatter-heading"
      className={`text-gray-900 antialiased ${rootClassName}`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <header className="text-center space-y-6 mb-10">
          <h1
            id="formatter-heading"
            className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses} text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight`}
          >
            {heading}
          </h1>
          <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="text-lg sm:text-xl text-gray-600">
            {description}
          </p>
        </header>

        <div className="space-y-6">
          {/* Input */}
          <div>
            <label
              htmlFor="code-input"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {inputLabel}
            </label>
            <textarea
              id="code-input"
              ref={inputRef}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder={placeholderInput}
              className={baseInputClasses}
              aria-multiline
            />
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="text-red-700 bg-red-50 border border-red-200 p-4 rounded-md"
            >
              {error}
            </div>
          )}

          {/* Beautified Output */}
          <div>
            <label
              htmlFor="formatted-output"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {outputLabelFormat}
            </label>
            <textarea
              id="formatted-output"
              value={formattedCode}
              readOnly
              placeholder={placeholderOutput}
              className={baseOutputClasses}
              aria-readonly
            />
          </div>

          {/* Minified Output */}
          <div>
            <label
              htmlFor="minified-output"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {outputLabelMinify}
            </label>
            <textarea
              id="minified-output"
              value={minifiedCode}
              readOnly
              placeholder={placeholderOutput}
              className={baseOutputClasses}
              aria-readonly
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!formattedCode}
              aria-label={copyButtonLabel}
              className={secondaryBtnClasses}
            >
              {copied ? (
                <Check className="w-5 h-5" aria-hidden="true" />
              ) : (
                <ClipboardCopy
                  className="w-5 h-5"
                  aria-hidden="true"
                />
              )}
              {copyButtonLabel}
            </button>

            <button
              type="button"
              onClick={clearAll}
              aria-label={clearButtonLabel}
              className={secondaryBtnClasses}
            >
              <Trash2 className="w-5 h-5" aria-hidden="true" />
              {clearButtonLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}