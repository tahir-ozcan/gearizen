// app/tools/code-formatter-minifier/code-formatter-minifier-client.tsx
"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Code2,
  Minimize2,
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
  languageLabel?: string;
  inputLabel?: string;
  outputLabelFormat?: string;
  outputLabelMinify?: string;
  placeholderInput?: string;
  placeholderOutput?: string;
  formatButtonLabel?: string;
  minifyButtonLabel?: string;
  clearButtonLabel?: string;
  copyButtonLabel?: string;
  /** Language options */
  languages?: { value: "html" | "css" | "js"; label: string }[];
  initialLanguage?: "html" | "css" | "js";
  /** Extra classes for overrides */
  rootClassName?: string;
  inputClassName?: string;
  outputClassName?: string;
  selectClassName?: string;
  primaryButtonClassName?: string;
  secondaryButtonClassName?: string;
}

export default function CodeFormatterMinifierClient({
  heading = "Code Formatter & Minifier",
  description =
    "Instantly beautify and compress your HTML, CSS, and JavaScript code client-side—no uploads, privacy-first, zero signup, lightning-fast.",
  gradientClasses = "from-purple-500 via-pink-500 to-yellow-400",
  focusRingClass = "focus:ring-purple-500",
  languageLabel = "Language",
  inputLabel = "Your Code",
  outputLabelFormat = "Beautified Code",
  outputLabelMinify = "Minified Code",
  placeholderInput = "Paste your code here…",
  placeholderOutput = "Result appears here…",
  formatButtonLabel = "Beautify",
  minifyButtonLabel = "Minify",
  clearButtonLabel = "Clear All",
  copyButtonLabel = "Copy",
  languages = [
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "js", label: "JavaScript" },
  ],
  initialLanguage = "html",
  rootClassName = "",
  inputClassName,
  outputClassName,
  selectClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
}: CodeFormatterMinifierProps) {
  const [language, setLanguage] = useState(initialLanguage);
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const baseInputClasses =
    inputClassName ??
    `w-full min-h-[14rem] p-4 bg-gray-50 border border-gray-300 rounded-md font-mono resize-y placeholder-gray-400 focus:outline-none ${focusRingClass}`;
  const baseOutputClasses =
    outputClassName ??
    `w-full min-h-[14rem] p-4 bg-gray-50 border border-gray-300 rounded-md font-mono resize-none placeholder-gray-400 focus:outline-none ${focusRingClass}`;
  const selectClasses =
    selectClassName ??
    `block w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none ${focusRingClass}`;
  const primaryBtnClasses =
    primaryButtonClassName ??
    `inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed`;
  const secondaryBtnClasses =
    secondaryButtonClassName ??
    `inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300`;

  const handleBeautify = useCallback(() => {
    setMode("format");
    if (!inputCode.trim()) {
      setOutputCode("");
      setError(null);
      return;
    }
    try {
      let result: string;
      switch (language) {
        case "css":
          result = beautifyCSS(inputCode, { indent_size: 2 });
          break;
        case "js":
          result = beautifyJS(inputCode, { indent_size: 2 });
          break;
        default:
          result = beautifyHTML(inputCode, {
            indent_size: 2,
            wrap_line_length: 0,
          });
      }
      setOutputCode(result);
      setError(null);
    } catch {
      setError("❌ Formatting failed");
      setOutputCode("");
    }
  }, [inputCode, language]);

  const handleMinify = useCallback(() => {
    setMode("minify");
    if (!inputCode.trim()) {
      setOutputCode("");
      setError(null);
      return;
    }
    try {
      let result: string;
      const minifyOpts = {
        indent_size: 0,
        max_preserve_newlines: 0,
        wrap_line_length: 0,
      };
      switch (language) {
        case "css":
          result = beautifyCSS(inputCode, minifyOpts);
          break;
        case "js":
          result = beautifyJS(inputCode, minifyOpts);
          break;
        default:
          result = beautifyHTML(inputCode, minifyOpts);
      }
      setOutputCode(result);
      setError(null);
    } catch {
      setError("❌ Minifying failed");
      setOutputCode("");
    }
  }, [inputCode, language]);

  const handleCopy = useCallback(async () => {
    if (!outputCode) return;
    try {
      await navigator.clipboard.writeText(outputCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent
    }
  }, [outputCode]);

  const clearAll = useCallback(() => {
    setInputCode("");
    setOutputCode("");
    setError(null);
    inputRef.current?.focus();
  }, []);

  const outputLabel =
    mode === "format" ? outputLabelFormat : outputLabelMinify;

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
          {/* Language Selector */}
          <div className="w-40">
            <label
              htmlFor="language-select"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {languageLabel}
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as "html" | "css" | "js")
              }
              className={selectClasses}
            >
              {languages.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

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

          {/* Output */}
          <div>
            <label
              htmlFor="code-output"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {outputLabel}
            </label>
            <textarea
              id="code-output"
              value={outputCode}
              readOnly
              placeholder={placeholderOutput}
              className={baseOutputClasses}
              aria-readonly
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

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleBeautify}
              aria-label={formatButtonLabel}
              className={primaryBtnClasses}
            >
              <Code2 className="w-5 h-5" aria-hidden="true" />
              {formatButtonLabel}
            </button>
            <button
              type="button"
              onClick={handleMinify}
              aria-label={minifyButtonLabel}
              className={primaryBtnClasses}
            >
              <Minimize2 className="w-5 h-5" aria-hidden="true" />
              {minifyButtonLabel}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!outputCode}
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