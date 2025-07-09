"use client";

import { useState } from "react";
import { countWords, countCharacters } from "./count-utils";

export default function TextCounterClient() {
  const [text, setText] = useState("");

  const words = countWords(text);
  const chars = countCharacters(text);

  return (
    <section
      id="text-counter"
      aria-labelledby="text-counter-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="text-counter-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Word & Character Counter
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Type or paste text below to instantly see word and character counts.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Enter your text..."
        className="w-full max-w-3xl mx-auto block border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-y"
      />
      <div className="mt-6 flex justify-center gap-8 text-lg font-medium">
        <span>{words} words</span>
        <span>{chars} characters</span>
      </div>
    </section>
  );
}
