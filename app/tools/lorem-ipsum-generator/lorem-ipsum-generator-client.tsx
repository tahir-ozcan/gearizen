"use client";

import { useState, ChangeEvent } from "react";
import { generateLorem, LoremMode } from "./lorem-utils";

export default function LoremIpsumGeneratorClient() {
  const [count, setCount] = useState(3);
  const [mode, setMode] = useState<LoremMode>("paragraphs");
  const [output, setOutput] = useState(generateLorem(3, "paragraphs"));

  const handleGenerate = () => setOutput(generateLorem(count, mode));

  const handleCount = (e: ChangeEvent<HTMLInputElement>) =>
    setCount(Number(e.target.value));

  const handleMode = (e: ChangeEvent<HTMLSelectElement>) =>
    setMode(e.target.value as LoremMode);

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
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <label className="flex-1 block">
          <span className="mr-2 font-medium">Amount: {count}</span>
          <input
            type="range"
            min={1}
            max={10}
            value={count}
            onChange={handleCount}
            className="w-full"
          />
        </label>
        <label className="flex-1 block">
          <span className="mr-2 font-medium">Mode:</span>
          <select
            value={mode}
            onChange={handleMode}
            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </label>
        <button
          type="button"
          onClick={handleGenerate}
          className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          Generate
        </button>
      </div>
      <textarea
        readOnly
        value={output}
        className="w-full h-40 p-3 border border-gray-300 rounded-lg bg-gray-50 resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <button
        type="button"
        onClick={copy}
        className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        Copy
      </button>
    </section>
  );
}
