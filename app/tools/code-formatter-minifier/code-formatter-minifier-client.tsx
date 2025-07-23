// app/tools/code-formatter-minifier/code-formatter-minifier-client.tsx
"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  ChangeEvent,
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
  languageLabel?: string;
  outputLabel?: string;
  placeholderInput?: string;
  placeholderOutput?: string;
  clearButtonLabel?: string;
  copyButtonLabel?: string;
  rootClassName?: string;
  inputClassName?: string;
  outputClassName?: string;
  /** Override CSS class for primary action buttons */
  primaryButtonClassName?: string;
  /** Override CSS class for secondary action buttons */
  secondaryButtonClassName?: string;
}

export default function CodeFormatterMinifierClient({
  heading = "Code Formatter & Minifier",
  description =
    "Instantly beautify and compress your HTML, CSS, and JavaScript code client‑side—privacy‑first, zero signup, lightning‑fast.",
  gradientClasses = "from-purple-500 via-pink-500 to-yellow-400",
  focusRingClass = "focus:ring-purple-500",
  inputLabel = "Your Code",
  languageLabel = "Language",
  outputLabel = "Output",
  placeholderInput = "Enter code here…",
  placeholderOutput = "Result appears here…",
  clearButtonLabel = "Clear All",
  copyButtonLabel = "Copy",
  rootClassName = "",
  inputClassName,
  outputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
}: CodeFormatterMinifierProps) {
  const [code, setCode] = useState("");
  const [formatted, setFormatted] = useState("");
  const [minified, setMinified] = useState("");
  const [minifyMode, setMinifyMode] = useState(false);
  const [language, setLanguage] = useState<"html" | "css" | "js">("html");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Base classes
  const baseInputClasses =
    inputClassName ??
    `w-full min-h-[14rem] p-4 bg-gray-50 border border-gray-300 rounded-md font-mono resize-y placeholder-gray-400 focus:outline-none ${focusRingClass}`;
  const baseOutputClasses =
    outputClassName ??
    `w-full min-h-[14rem] p-4 bg-gray-50 border ${
      error ? "border-red-300" : "border-gray-300"
    } rounded-md font-mono resize-none placeholder-gray-400 focus:outline-none ${focusRingClass}`;
  const primaryBtnClasses =
    primaryButtonClassName ??
    "inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const secondaryBtnClasses =
    secondaryButtonClassName ??
    "inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300";

  // Validate and process input
  const validateAndProcess = useCallback(
    (src: string) => {
      if (!src.trim()) {
        setFormatted("");
        setMinified("");
        setError(null);
        return;
      }

      // Syntax check
      try {
        if (language === "js") {
          // quick JS syntax test
          new Function(src);
        } else if (language === "html") {
          const doc = new DOMParser().parseFromString(src, "text/html");
          if (doc.querySelector("parsererror")) {
            throw new Error("HTML syntax error");
          }
        } else {
          const opens = (src.match(/{/g) || []).length;
          const closes = (src.match(/}/g) || []).length;
          if (opens !== closes) {
            throw new Error("CSS syntax error: unmatched braces");
          }
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        setFormatted("");
        setMinified("");
        return;
      }

      // Beautify & minify
      try {
        let fmt: string, min: string;

        if (language === "css") {
          fmt = beautifyCSS(src, {
            indent_size: 2,
            preserve_newlines: true,
            max_preserve_newlines: 1,
            wrap_line_length: 80,
          });
          min = beautifyCSS(src, {
            indent_size: 0,
            preserve_newlines: false,
            wrap_line_length: 0,
          });
        } else if (language === "js") {
          fmt = beautifyJS(src, {
            indent_size: 2,
            preserve_newlines: true,
            max_preserve_newlines: 1,
            wrap_line_length: 80,
          });
          min = beautifyJS(src, {
            indent_size: 0,
            preserve_newlines: false,
            wrap_line_length: 0,
          });
        } else {
          fmt = beautifyHTML(src, {
            indent_size: 2,
            indent_inner_html: true,
            preserve_newlines: true,
            max_preserve_newlines: 1,
            wrap_line_length: 80,
          });
          min = beautifyHTML(src, {
            indent_size: 0,
            preserve_newlines: false,
            wrap_line_length: 0,
          });
        }

        setFormatted(fmt);
        setMinified(min);
        setError(null);
      } catch {
        setError("❌ Processing failed");
        setFormatted("");
        setMinified("");
      }
    },
    [language]
  );

  // Re-run on code or language change
  useEffect(() => {
    validateAndProcess(code);
  }, [code, language, validateAndProcess]);

  // Handlers
  const handleCodeChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setCode(e.target.value);
    },
    []
  );
  const handleLangChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setLanguage(e.target.value as "html" | "css" | "js");
    },
    []
  );
  const handleMinifyToggle = useCallback(() => {
    setMinifyMode((m) => !m);
  }, []);
  const handleClear = useCallback(() => {
    setCode("");
    setError(null);
    inputRef.current?.focus();
  }, []);
  const handleCopy = useCallback(async () => {
    const text = minifyMode ? minified : formatted;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  }, [formatted, minified, minifyMode]);

  const outputValue = minifyMode ? minified : formatted;

  return (
    <section
      id="code-formatter-minifier"
      aria-labelledby="formatter-heading"
      className={`text-gray-900 antialiased ${rootClassName}`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
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
              value={code}
              onChange={handleCodeChange}
              placeholder={placeholderInput}
              className={baseInputClasses}
              aria-multiline
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Language Select */}
            <div>
              <select
                id="language-select"
                value={language}
                onChange={handleLangChange}
                className={`w-32 p-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none ${focusRingClass}`}
              >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="js">JavaScript</option>
              </select>
            </div>

            {/* Minify Toggle */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={minifyMode}
                onChange={handleMinifyToggle}
                className="h-4 w-4 focus:outline-none"
              />
              <span className="text-sm text-gray-800 select-none">
                Minify
              </span>
            </label>

            {/* Copy & Clear */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={!outputValue}
              aria-label={copyButtonLabel}
              className={primaryBtnClasses}
            >
              {copied ? (
                <Check className="w-5 h-5" aria-hidden="true" />
              ) : (
                <ClipboardCopy className="w-5 h-5" aria-hidden="true" />
              )}
              {copyButtonLabel}
            </button>

            <button
              type="button"
              onClick={handleClear}
              aria-label={clearButtonLabel}
              className={secondaryBtnClasses}
            >
              <Trash2 className="w-5 h-5" aria-hidden="true" />
              {clearButtonLabel}
            </button>
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
              value={outputValue}
              readOnly
              placeholder={placeholderOutput}
              className={baseOutputClasses}
              aria-readonly
            />
          </div>
        </div>
      </div>
    </section>
  );
}