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
  languageLabel = "Language",
  outputLabel = "Output",
  placeholderInput = "Enter code here…",
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
  const [minify, setMinify] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<"html" | "css" | "js">("html");

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

  const validateAndProcess = useCallback(
    (code: string) => {
      if (!code.trim()) {
        setFormattedCode("");
        setMinifiedCode("");
        setError(null);
        return;
      }

      // Syntax validation
      try {
        if (language === "js") {
          new Function(code);
        } else if (language === "html") {
          const parser = new DOMParser();
          const doc = parser.parseFromString(code, "text/html");
          if (doc.querySelector("parsererror")) {
            throw new Error("HTML syntax error");
          }
        } else {
          const opens = (code.match(/{/g) || []).length;
          const closes = (code.match(/}/g) || []).length;
          if (opens !== closes) {
            throw new Error("CSS syntax error: unmatched braces");
          }
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        setFormattedCode("");
        setMinifiedCode("");
        return;
      }

      // Format & minify
      try {
        let fmt: string, min: string;
        if (language === "css") {
          fmt = beautifyCSS(code, { indent_size: 2 });
          min = beautifyCSS(code, {
            indent_size: 0,
            max_preserve_newlines: 0,
            wrap_line_length: 0,
          });
        } else if (language === "js") {
          fmt = beautifyJS(code, { indent_size: 2 });
          min = beautifyJS(code, {
            indent_size: 0,
            max_preserve_newlines: 0,
            wrap_line_length: 0,
          });
        } else {
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
    [language]
  );

  useEffect(() => {
    validateAndProcess(inputCode);
  }, [inputCode, language, validateAndProcess]);

  const clearAll = useCallback(() => {
    setInputCode("");
    setFormattedCode("");
    setMinifiedCode("");
    setError(null);
    inputRef.current?.focus();
  }, []);

  const handleCopy = useCallback(async () => {
    const output = error
      ? ""
      : minify
      ? minifiedCode
      : formattedCode;
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  }, [error, formattedCode, minifiedCode, minify]);

  const handleLangChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setLanguage(e.target.value as "html" | "css" | "js");
    },
    []
  );

  const outputValue = error
    ? error
    : minify
    ? minifiedCode
    : formattedCode;

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
          {/* Code Input */}
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

          {/* Language Select */}
          <div>
            <label
              htmlFor="language-select"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {languageLabel}
            </label>
            <select
              id="language-select"
              value={language}
              onChange={handleLangChange}
              className={`w-full max-w-xs p-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none ${focusRingClass}`}
            >
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="js">JavaScript</option>
            </select>
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
              value={outputValue}
              readOnly
              placeholder={placeholderOutput}
              className={
                baseOutputClasses + (error ? " text-red-700" : "")
              }
              aria-readonly
            />
          </div>

          {/* Controls (below output) */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={minify}
                onChange={(e) => setMinify(e.target.checked)}
                className="h-4 w-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-800 select-none">
                Minify
              </span>
            </label>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!outputValue || !!error}
              aria-label={copyButtonLabel}
              className={secondaryBtnClasses}
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