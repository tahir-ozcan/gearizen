// app/tools/lorem-ipsum-generator/lorem-ipsum-generator-client.tsx
"use client";

import React, { FC, useState, useEffect, ChangeEvent, useCallback } from "react";
import { ClipboardCopy, Trash2, Check } from "lucide-react";

export interface LoremIpsumGeneratorClientProps {
  /** Main heading text */
  heading?: string;
  /** Subtitle/description text */
  description?: string;
  /** Gradient classes for headings */
  gradientClasses?: string;
  /** Focus‑ring Tailwind class */
  focusRingClass?: string;
  /** Override CSS for inputs */
  inputClassName?: string;
  /** Override CSS for output textarea */
  outputClassName?: string;
  /** Override CSS for primary buttons (copy) */
  primaryButtonClassName?: string;
  /** Override CSS for secondary buttons (reset) */
  secondaryButtonClassName?: string;
  /** Extra classes for root section */
  rootClassName?: string;
}

type LoremMode = "paragraphs" | "sentences" | "words";

const SENTENCES: string[] = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident."
];

/** Generate placeholder text based on mode and count */
function generateLorem(count: number, mode: LoremMode): string {
  const words = SENTENCES.join(" ")
    .replace(/[.]/g, "")
    .split(/\s+/);
  if (mode === "words") {
    const slice = words.slice(0, count);
    return slice.join(" ") + (slice.length >= count ? "…" : "");
  }
  if (mode === "sentences") {
    return SENTENCES.slice(0, count).join(" ");
  }
  // paragraphs
  return Array.from({ length: count }, () => SENTENCES.join(" ")).join("\n\n");
}

const LoremIpsumGeneratorClient: FC<LoremIpsumGeneratorClientProps> = ({
  heading = "Lorem Ipsum Generator",
  description =
    "Produce realistic placeholder text of any length—control paragraphs, sentences or words, all client‑side, no signup required.",
  gradientClasses = "from-purple-500 via-pink-500 to-yellow-400",
  focusRingClass = "focus:ring-purple-500",
  inputClassName,
  outputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  rootClassName = "",
}) => {
  const [count, setCount] = useState<number>(3);
  const [mode, setMode] = useState<LoremMode>("paragraphs");
  const [output, setOutput] = useState<string>(() =>
    generateLorem(3, "paragraphs")
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Re-generate output when count or mode changes
  useEffect(() => {
    setOutput(generateLorem(count, mode));
  }, [count, mode]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleReset = useCallback(() => {
    setCount(3);
    setMode("paragraphs");
  }, []);

  // CSS classes
  const sliderClasses =
    inputClassName ??
    `w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none ${focusRingClass}`;
  const selectClasses =
    inputClassName ??
    `w-full p-2 border border-gray-300 rounded-md focus:outline-none ${focusRingClass}`;
  const textareaClasses =
    outputClassName ??
    `w-full p-4 border border-gray-300 rounded-md bg-gray-50 font-mono resize-y focus:outline-none ${focusRingClass}`;
  const primaryBtnClasses =
    primaryButtonClassName ??
    `inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r ${gradientClasses} text-white font-semibold rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed`;
  const secondaryBtnClasses =
    secondaryButtonClassName ??
    `inline-flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 font-medium rounded-md transition hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <section
      id="lorem-ipsum-generator"
      aria-labelledby="lorem-heading"
      className={`text-gray-900 antialiased space-y-16 ${rootClassName}`}
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1
          id="lorem-heading"
          className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses} text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight`}
        >
          {heading}
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="text-lg sm:text-xl text-gray-600">{description}</p>
      </div>

      {/* Controls */}
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Amount */}
          <div className="flex flex-col">
            <label htmlFor="lorem-count" className="block mb-1 font-medium text-gray-800">
              Amount: <span className="font-semibold">{count}</span>
            </label>
            <input
              id="lorem-count"
              type="range"
              min={1}
              max={10}
              value={count}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCount(Number(e.target.value))
              }
              className={sliderClasses}
            />
          </div>

          {/* Mode */}
          <div className="flex flex-col">
            <label htmlFor="lorem-mode" className="block mb-1 font-medium text-gray-800">
              Mode
            </label>
            <select
              id="lorem-mode"
              value={mode}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setMode(e.target.value as LoremMode)
              }
              className={selectClasses}
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <textarea
            id="lorem-output"
            readOnly
            rows={8}
            value={output}
            className={textareaClasses}
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleReset}
              className={secondaryBtnClasses}
            >
              <Trash2 className="w-5 h-5" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
              aria-label="Copy generated text"
              className={primaryBtnClasses}
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-300" />
              ) : (
                <ClipboardCopy className="w-5 h-5" />
              )}
              Copy Text
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoremIpsumGeneratorClient;