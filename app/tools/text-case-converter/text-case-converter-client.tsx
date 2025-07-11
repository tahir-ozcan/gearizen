"use client";

import { useState } from "react";
import { convertCase, CaseType } from "@/lib/convert-case";

const cases: { label: string; value: CaseType }[] = [
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
  const output = convertCase(input, target);

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Output copied to clipboard!");
    } catch {
      alert("❌ Failed to copy output.");
    }
  };

  return (
    <section
      id="text-case-converter"
      aria-labelledby="text-case-converter-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="text-case-converter-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Text Case Converter
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Type or paste text and choose a case style to convert instantly.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        placeholder="Enter your text..."
        className="w-full max-w-3xl mx-auto block border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-y"
      />

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {cases.map(({ label, value }) => (
          <label key={value} className="flex items-center space-x-2">
            <input
              type="radio"
              name="case"
              value={value}
              checked={target === value}
              onChange={() => setTarget(value)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm select-none">{label}</span>
          </label>
        ))}
      </div>

      {output && (
        <div className="mt-6 max-w-3xl mx-auto">
          <label htmlFor="case-output" className="sr-only">
            Converted text
          </label>
          <textarea
            id="case-output"
            aria-label="Converted text output"
            value={output}
            readOnly
            rows={6}
            className="w-full border border-gray-300 rounded-lg p-4 font-mono bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            type="button"
            onClick={copyOutput}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm font-medium"
          >
            Copy Output
          </button>
        </div>
      )}
    </section>
  );
}
