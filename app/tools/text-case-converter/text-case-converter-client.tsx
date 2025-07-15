// app/tools/text-case-converter/text-case-converter-client.tsx
"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Trash2, ClipboardCopy } from "lucide-react";

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "snake"
  | "kebab";

/**
 * Convert a string to various case styles.
 */
function convertCase(input: string, type: CaseType): string {
  if (!input) return "";
  // Split into words (letters, digits, apostrophes)
  const words = input.match(/\w+('\w+)?/g) || [];
  switch (type) {
    case "upper":
      return input.toUpperCase();
    case "lower":
      return input.toLowerCase();
    case "title":
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    case "sentence": {
      const lower = input.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    case "camel":
      return words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join("");
    case "snake":
      return words.map((w) => w.toLowerCase()).join("_");
    case "kebab":
      return words.map((w) => w.toLowerCase()).join("-");
  }
}

const CASE_OPTIONS: { label: string; value: CaseType }[] = [
  { label: "UPPERCASE", value: "upper" },
  { label: "lowercase", value: "lower" },
  { label: "Title Case", value: "title" },
  { label: "Sentence case", value: "sentence" },
  { label: "camelCase", value: "camel" },
  { label: "snake_case", value: "snake" },
  { label: "kebab-case", value: "kebab" },
];

export default function TextCaseConverterClient() {
  const [input, setInput] = useState("");
  const [target, setTarget] = useState<CaseType>("upper");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const output = convertCase(input, target);
  const inputCount = input.length.toLocaleString();
  const outputCount = output.length.toLocaleString();

  function clearAll() {
    setInput("");
    inputRef.current?.focus();
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Copied to clipboard!");
    } catch {
      alert("❌ Copy failed.");
    }
  }

  return (
    <section
      id="text-case-converter"
      aria-labelledby="text-case-converter-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          id="text-case-converter-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Text Case Converter
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-3xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Switch between UPPERCASE, lowercase, Title Case, snake_case, camelCase and more with one click. Paste or type any text, convert instantly, then copy or clear—all client-side.
        </p>
      </div>

      {/* Input & Options */}
      <div className="max-w-3xl mx-auto space-y-8 sm:px-0">
        {/* Text Input */}
        <div className="flex flex-col">
          <label
            htmlFor="case-input"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Text Input
          </label>
          <textarea
            id="case-input"
            ref={inputRef}
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            placeholder="Enter text to convert…"
            rows={6}
            className="
              w-full p-4 border border-gray-300 rounded-md bg-white
              focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
            "
          />
          <p className="mt-1 text-xs text-gray-500">{inputCount} characters</p>
        </div>

        {/* Case Style Radios */}
        <div className="flex flex-wrap justify-center gap-4">
          {CASE_OPTIONS.map(({ label, value }) => (
            <label key={value} className="inline-flex items-center space-x-2">
              <input
                type="radio"
                name="case-option"
                value={value}
                checked={target === value}
                onChange={() => setTarget(value)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm select-none">{label}</span>
            </label>
          ))}
        </div>

        {/* Output & Actions */}
        {output && (
          <div className="space-y-4">
            <label htmlFor="case-output" className="sr-only">
              Converted text
            </label>
            <textarea
              id="case-output"
              readOnly
              value={output}
              rows={6}
              className="
                w-full p-4 border border-gray-300 rounded-md bg-gray-50
                focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
              "
            />
            <p className="text-xs text-gray-500">{outputCount} characters</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={copyOutput}
                className="
                  inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md
                  hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                  transition text-sm font-medium
                "
              >
                <ClipboardCopy className="w-5 h-5" />
                Copy Output
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="
                  inline-flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-md
                  hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300
                  transition text-sm font-medium
                "
              >
                <Trash2 className="w-5 h-5" />
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}