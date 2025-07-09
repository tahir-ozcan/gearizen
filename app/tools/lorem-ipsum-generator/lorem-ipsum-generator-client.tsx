"use client";

import { useState, ChangeEvent } from "react";

function generateParagraphs(count: number): string {
  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  return Array.from({ length: count }, () => text).join("\n\n");
}

export default function LoremIpsumGeneratorClient() {
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState(generateParagraphs(3));

  const handleGenerate = () => setOutput(generateParagraphs(count));

  const handleCount = (e: ChangeEvent<HTMLInputElement>) => setCount(Number(e.target.value));

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Copied!");
    } catch {
      alert("❌ Failed to copy");
    }
  };

  return (
    <section className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-6">Lorem Ipsum Generator</h1>
      <p className="text-center text-gray-600">Generate filler text for your designs and drafts.</p>
      <label className="block mb-4">
        <span className="mr-2 font-medium">Paragraphs: {count}</span>
        <input
          type="range"
          min={1}
          max={10}
          value={count}
          onChange={handleCount}
        />
      </label>
      <button
        type="button"
        onClick={handleGenerate}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Generate
      </button>
      <textarea
        readOnly
        value={output}
        className="w-full h-40 p-3 border border-gray-300 rounded-lg bg-gray-50 resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="button"
        onClick={copy}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Copy
      </button>
    </section>
  );
}
