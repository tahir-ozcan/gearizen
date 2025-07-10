"use client";

import { useState } from "react";

export default function UuidGeneratorClient() {
  const generate = () => crypto.randomUUID();
  const [uuid, setUuid] = useState(generate());
  const copy = async (u: string) => {
    try {
      await navigator.clipboard.writeText(u);
      alert("✅ Copied!");
    } catch {
      alert("❌ Failed to copy");
    }
  };

  const handleGenerate = () => setUuid(generate());

  return (
    <section className="space-y-6 max-w-xl mx-auto text-center">
      <h1 className="text-4xl font-extrabold mb-6">UUID Generator</h1>
      <p className="text-gray-600">Generate a new RFC4122 v4 UUID with one click.</p>
      <div className="flex items-center space-x-4 justify-center">
        <input
          type="text"
          readOnly
          value={uuid}
          className="flex-grow border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm"
        />
        <button
          type="button"
          onClick={() => copy(uuid)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Copy
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700"
        >
          Generate
        </button>
      </div>
    </section>
  );
}
