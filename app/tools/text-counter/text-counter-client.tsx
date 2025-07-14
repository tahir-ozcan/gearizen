// app/tools/text-counter/text-counter-client.tsx
"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Trash2 } from "lucide-react";

/**
 * Utility functions for TextCounterClient
 */
function countWords(text: string): number {
  return text.trim()
    ? text.trim().split(/\s+/).filter(Boolean).length
    : 0;
}

function countCharacters(text: string, ignoreSpaces: boolean): number {
  if (ignoreSpaces) {
    return text.replace(/\s+/g, "").length;
  }
  return text.length;
}

function countSentences(text: string): number {
  // simple split on ., !, ? followed by space or EOL
  return (text.match(/[\w\)][.?!](\s|$)/g) || []).length;
}

function countLines(text: string): number {
  if (!text) return 0;
  return text.split(/\r?\n/).length;
}

function estimateReadingTime(text: string, wpm: number): number {
  const words = countWords(text);
  return words === 0 ? 0 : Math.max(1, Math.ceil(words / wpm));
}

export default function TextCounterClient() {
  const [text, setText] = useState("");
  const [ignoreSpaces, setIgnoreSpaces] = useState(false);
  const [wpm, setWpm] = useState(200);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // computed stats
  const words = countWords(text);
  const chars = countCharacters(text, ignoreSpaces);
  const sentences = countSentences(text);
  const lines = countLines(text);
  const reading = estimateReadingTime(text, wpm);

  const clearAll = () => {
    setText("");
    textareaRef.current?.focus();
  };

  return (
    <section
      id="text-counter"
      aria-labelledby="text-counter-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center sm:px-0 space-y-4">
        <h1
          id="text-counter-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Text Counter
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Get real-time counts of words, characters, sentences and lines for any text input with detailed analytics—all client-side, no signup required.
        </p>
      </div>

      {/* Input & Controls */}
      <div className="max-w-3xl mx-auto sm:px-0 space-y-6">
        <textarea
          id="text-input"
          ref={textareaRef}
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          rows={8}
          placeholder="Enter your text here…"
          className="
            w-full p-4 border border-gray-300 rounded-md bg-white
            focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
          "
        />

        <div className="flex flex-wrap justify-center gap-6">
          <label className="inline-flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={ignoreSpaces}
              onChange={() => setIgnoreSpaces((v) => !v)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span>Ignore spaces in character count</span>
          </label>

          <label className="inline-flex items-center space-x-2 text-sm">
            <span>Reading speed (WPM):</span>
            <input
              type="number"
              min={50}
              max={1000}
              step={50}
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))}
              className="
                w-20 text-center border border-gray-300 rounded-md
                px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]
                transition
              "
            />
          </label>

          <button
            type="button"
            onClick={clearAll}
            className="
              inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md
              hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed]
              transition text-sm font-medium
            "
          >
            <Trash2 className="w-5 h-5" />
            Clear All
          </button>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold">{words.toLocaleString()}</div>
            <div className="text-sm text-gray-600">words</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{chars.toLocaleString()}</div>
            <div className="text-sm text-gray-600">characters</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{sentences.toLocaleString()}</div>
            <div className="text-sm text-gray-600">sentences</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{lines.toLocaleString()}</div>
            <div className="text-sm text-gray-600">lines</div>
          </div>
          <div className="sm:col-span-4 mt-4">
            <div className="text-2xl font-medium">{reading.toLocaleString()} min read</div>
            <div className="text-sm text-gray-500">estimated reading time</div>
          </div>
        </div>
      </div>
    </section>
  );
}