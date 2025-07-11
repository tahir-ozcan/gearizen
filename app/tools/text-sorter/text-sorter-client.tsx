"use client";

import { useState } from "react";
import { sortLines } from "@/lib/sort-lines";

export default function TextSorterClient() {
  const [input, setInput] = useState("");
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [unique, setUnique] = useState(false);

  const output = sortLines(input, { order, ignoreCase, unique });

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Output copied to clipboard!");
    } catch {
      alert("❌ Failed to copy output.");
    }
  };

  return (
    <section
      id="text-sorter"
      aria-labelledby="text-sorter-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="text-sorter-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Text Sorter
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Paste lines of text to sort them alphabetically right in your browser.
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        placeholder="Enter lines of text..."
        className="w-full max-w-3xl mx-auto block border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-y"
      />
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="order"
            value="asc"
            checked={order === 'asc'}
            onChange={() => setOrder('asc')}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-sm select-none">Ascending</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="order"
            value="desc"
            checked={order === 'desc'}
            onChange={() => setOrder('desc')}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-sm select-none">Descending</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={() => setIgnoreCase(!ignoreCase)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-sm select-none">Ignore case</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={unique}
            onChange={() => setUnique(!unique)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-sm select-none">Unique lines</span>
        </label>
      </div>
      {input && (
        <div className="mt-6 max-w-3xl mx-auto">
          <label htmlFor="sorted-output" className="sr-only">
            Sorted text output
          </label>
          <textarea
            id="sorted-output"
            readOnly
            value={output}
            rows={8}
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
