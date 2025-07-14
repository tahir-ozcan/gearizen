// app/tools/lorem-ipsum-generator/lorem-ipsum-generator-client.tsx
"use client";

import { useState, ChangeEvent } from "react";

type LoremMode = "paragraphs" | "sentences" | "words";

/**
 * Lorem Ipsum Generator Tool
 *
 * Produce realistic placeholder text of any length—control paragraphs,
 * words and formatting for design mockups. 100% client-side, no signup required.
 */
function generateLorem(count: number, mode: LoremMode): string {
  const baseSentence =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const sentencePool = [
    baseSentence,
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident.",
  ];

  // Flatten into words for “words” mode
  const allWords = sentencePool
    .join(" ")
    .replace(/[.]/g, "")
    .split(/\s+/);

  if (mode === "words") {
    const slice = allWords.slice(0, count);
    return slice.join(" ") + (slice.length >= count ? "…" : "");
  }

  if (mode === "sentences") {
    return sentencePool.slice(0, count).join(" ");
  }

  // paragraphs mode: build each using the first four sentences
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    paragraphs.push(sentencePool.slice(0, 4).join(" "));
  }
  return paragraphs.join("\n\n");
}

export default function LoremIpsumGeneratorClient() {
  const [count, setCount] = useState(3);
  const [mode, setMode] = useState<LoremMode>("paragraphs");
  const [output, setOutput] = useState(() => generateLorem(3, "paragraphs"));

  const handleGenerate = () => {
    setOutput(generateLorem(count, mode));
  };

  return (
    <section
      id="lorem-ipsum-generator"
      aria-labelledby="lorem-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-4">
        <h1
          id="lorem-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Lorem Ipsum Generator
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Produce realistic placeholder text of any length—control paragraphs, words and formatting for design mockups.
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-3xl mx-auto space-y-8 sm:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Count Slider */}
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
              className="w-full"
            />
          </div>

          {/* Mode Select */}
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
              className="
                w-full border border-gray-300 rounded-md px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-[#7c3aed]
                transition text-sm
              "
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              className="
                w-full px-6 py-2 bg-indigo-600 text-white rounded-md
                hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                transition font-medium text-sm
              "
            >
              Generate
            </button>
          </div>
        </div>

        {/* Output & Copy */}
        <div className="space-y-4">
          <textarea
            readOnly
            value={output}
            rows={8}
            className="
              w-full p-4 border border-gray-300 rounded-md bg-gray-50
              font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#7c3aed]
              transition
            "
          />
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(output);
              alert("✅ Copied to clipboard!");
            }}
            className="
              px-6 py-2 bg-indigo-600 text-white rounded-md
              hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
              transition font-medium text-sm
            "
          >
            Copy Text
          </button>
        </div>
      </div>
    </section>
  );
}