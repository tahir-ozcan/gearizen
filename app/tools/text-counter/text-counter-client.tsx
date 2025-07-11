"use client";

import { useState } from "react";
import { countWords, countCharacters } from "./count-utils";

export default function TextCounterClient() {
  const [text, setText] = useState("");
  const [ignoreSpaces, setIgnoreSpaces] = useState(false);

  const words = countWords(text);
  const chars = countCharacters(text, { ignoreSpaces });

  return (
    <section
      id="text-counter"
      aria-labelledby="text-counter-heading"
      className="container-responsive py-20 text-gray-900 antialiased"
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
        className="w-full max-w-3xl mx-auto block border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-y"
      />
      <label className="mt-4 flex items-center justify-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={ignoreSpaces}
          onChange={() => setIgnoreSpaces(!ignoreSpaces)}
          className="h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
        />
        Ignore spaces in character count
      </label>
      <div className="mt-6 flex justify-center gap-8 text-lg font-medium">
        <span>{words} words</span>
        <span>{chars} characters</span>
      </div>
    </section>
  );
}
