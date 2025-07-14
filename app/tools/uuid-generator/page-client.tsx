// app/tools/uuid-generator/uuid-generator-client.tsx
"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";

/**
 * Generate a RFC4122 v4 UUID using the browser crypto API.
 */
function uuidV4(): string {
  return crypto.randomUUID();
}

/**
 * Generate a simple timestamp-based UUID v1.
 */
function uuidV1(): string {
  const now = Date.now();
  const timeLow = (now & 0xffffffff).toString(16).padStart(8, "0");
  const timeMid = (((now / 0x100000000) & 0xffff) | 0)
    .toString(16)
    .padStart(4, "0");
  const timeHiAndVersion = ((((now / 0x100000000) >> 16) & 0x0fff) | 0x1000)
    .toString(16)
    .padStart(4, "0");
  const clockSeq = Math.floor(Math.random() * 0x3fff)
    .toString(16)
    .padStart(4, "0");
  const node = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeq}-${node}`;
}

type Version = "v1" | "v4";
type Separator = "-" | "_" | "none";

export default function UuidGeneratorClient() {
  const [version, setVersion] = useState<Version>("v4");
  const [uppercase, setUppercase] = useState(false);
  const [separator, setSeparator] = useState<Separator>("-");
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);

  const inputRef = useRef<HTMLButtonElement>(null);

  const generateOne = () => (version === "v1" ? uuidV1() : uuidV4());

  const generateBatch = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = generateOne();
      if (separator !== "-") {
        id = separator === "none" ? id.replace(/-/g, "") : id.replace(/-/g, "_");
      }
      id = uppercase ? id.toUpperCase() : id.toLowerCase();
      list.push(id);
    }
    setUuids(list);
    inputRef.current?.focus();
  };

  const copyAll = async () => {
    if (uuids.length === 0) return;
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
      alert("✅ UUIDs copied to clipboard!");
    } catch {
      alert("❌ Failed to copy.");
    }
  };

  const clearAll = () => setUuids([]);

  return (
    <section
      id="uuid-generator"
      aria-labelledby="uuid-generator-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center sm:px-0 space-y-4">
        <h1
          id="uuid-generator-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Free UUID Generator
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-3xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Generate RFC 4122 v1 or v4 UUIDs entirely in your browser. Customize case,
          separators, batch size, and copy instantly—100% client-side, no signup.
        </p>
      </div>

      {/* Controls Form */}
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          generateBatch();
        }}
        className="max-w-3xl mx-auto space-y-6 sm:px-0"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Version */}
          <label className="flex flex-col text-sm font-medium text-gray-800">
            Version
            <select
              value={version}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setVersion(e.target.value as Version)
              }
              className="mt-1 input-base"
            >
              <option value="v1">v1</option>
              <option value="v4">v4</option>
            </select>
          </label>

          {/* Uppercase */}
          <label className="flex items-center space-x-2 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={() => setUppercase((v) => !v)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span>Uppercase</span>
          </label>

          {/* Separator */}
          <label className="flex flex-col text-sm font-medium text-gray-800">
            Separator
            <select
              value={separator}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSeparator(e.target.value as Separator)
              }
              className="mt-1 input-base"
            >
              <option value="-">Dash (–)</option>
              <option value="_">Underscore (_)</option>
              <option value="none">None</option>
            </select>
          </label>

          {/* Batch Count */}
          <label className="flex flex-col text-sm font-medium text-gray-800">
            Batch Size
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCount(Math.min(50, Math.max(1, Number(e.target.value))))
              }
              className="mt-1 input-base"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            ref={inputRef}
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium"
          >
            Generate
          </button>
          <button
            type="button"
            onClick={copyAll}
            disabled={uuids.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition font-medium disabled:opacity-50"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={uuids.length === 0}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition font-medium disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Output List */}
      {uuids.length > 0 && (
        <textarea
          readOnly
          aria-label="Generated UUIDs"
          value={uuids.join("\n")}
          className="w-full max-w-3xl mx-auto h-48 p-4 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition"
        />
      )}
    </section>
  );
}