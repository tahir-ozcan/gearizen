// app/tools/json-formatter/json-formatter-client.tsx
"use client";

import React, {
  FC,
  useState,
  useRef,
  useEffect,
  useCallback,
  ChangeEvent,
} from "react";
import { Trash2, ClipboardCopy, Check } from "lucide-react";

export interface JsonFormatterClientProps {
  /** Main heading text */
  heading?: string;
  /** Subtitle/description text */
  description?: string;
  /** Gradient classes for headings */
  gradientClasses?: string;
  /** Focus-ring Tailwind class */
  focusRingClass?: string;
  /** Override CSS class for input textarea */
  inputClassName?: string;
  /** Override CSS class for output textarea */
  outputClassName?: string;
  /** Override CSS class for primary buttons (copy) */
  primaryButtonClassName?: string;
  /** Override CSS class for secondary buttons (toggle/clear) */
  secondaryButtonClassName?: string;
  /** Extra classes for the root container */
  rootClassName?: string;
}

const JsonFormatterClient: FC<JsonFormatterClientProps> = ({
  heading = "JSON Formatter & Validator",
  description =
    "Validate, beautify, minify and lint JSON instantly—100% client-side with real-time error reporting, no signup required.",
  gradientClasses = "from-purple-500 via-pink-500 to-yellow-400",
  focusRingClass = "focus:ring-purple-500",
  inputClassName,
  outputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  rootClassName = "",
}) => {
  const [mode, setMode] = useState<"beautify" | "minify">("beautify");
  const [indent, setIndent] = useState<number>(2);
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Classes
  const baseInputClasses =
    inputClassName ??
    `w-full min-h-[14rem] p-4 border border-gray-300 rounded-md bg-white font-mono resize-y placeholder-gray-400 focus:outline-none ${focusRingClass}`;
  const baseOutputClasses =
    outputClassName ??
    `w-full min-h-[14rem] p-4 border border-gray-300 rounded-md bg-gray-50 font-mono resize-none placeholder-gray-400 focus:outline-none ${focusRingClass}`;
  const primaryBtnClasses =
    primaryButtonClassName ??
    `inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed`;
  const secondaryBtnClasses =
    secondaryButtonClassName ??
    `inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300`;

  // Real-time conversion
  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const result =
        mode === "beautify"
          ? JSON.stringify(parsed, null, indent)
          : JSON.stringify(parsed);
      setOutput(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }, [input, mode, indent]);

  useEffect(() => {
    convert();
  }, [input, mode, indent, convert]);

  // Handlers
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const toggleMode = useCallback(() => {
    setMode((m) => (m === "beautify" ? "minify" : "beautify"));
    setError(null);
  }, []);

  const handleIndentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(0, Math.min(8, Number(e.target.value) || 0));
    setIndent(v);
  };

  const copyOutput = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const clearAll = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
    inputRef.current?.focus();
  }, []);

  return (
    <section
      id="json-formatter"
      aria-labelledby="json-formatter-heading"
      className={`text-gray-900 antialiased ${rootClassName}`}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1
            id="json-formatter-heading"
            className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses} text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight`}
          >
            {heading}
          </h1>
          <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="text-lg sm:text-xl text-gray-600">{description}</p>
        </header>

        <div className="space-y-6">
          {/* Input */}
          <div>
            <label
              htmlFor="json-input"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              JSON Input
            </label>
            <textarea
              id="json-input"
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Paste your JSON here…"
              className={baseInputClasses}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={toggleMode}
              className={secondaryBtnClasses}
            >
              {mode === "beautify"
                ? "Switch to Minify"
                : "Switch to Beautify"}
            </button>
            <div className="flex items-center gap-2">
              <label
                htmlFor="indent-input"
                className="text-sm text-gray-800"
              >
                Indent:
              </label>
              <input
                id="indent-input"
                type="number"
                min={0}
                max={8}
                disabled={mode === "minify"}
                value={indent}
                onChange={handleIndentChange}
                className={`${inputClassName ??
                  "w-16 p-1 border border-gray-300 rounded-md"} focus:outline-none ${focusRingClass}`}
              />
            </div>
            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              className={primaryBtnClasses}
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <ClipboardCopy className="w-5 h-5" />
              )}
              Copy
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
              htmlFor="json-output"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {mode === "beautify"
                ? "Beautified JSON"
                : "Minified JSON"}
            </label>
            <textarea
              id="json-output"
              value={output}
              readOnly
              placeholder="Result appears here…"
              className={baseOutputClasses}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JsonFormatterClient;