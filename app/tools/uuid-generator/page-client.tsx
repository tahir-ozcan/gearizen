"use client";

import { useState } from "react";

type Version = "v1" | "v4";
type Separator = "-" | "_" | "none";

function uuidV4() {
  return crypto.randomUUID();
}

// Lightweight v1 generator (timestamp based)
function uuidV1() {
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

export default function UuidGeneratorClient() {
  const [version, setVersion] = useState<Version>("v4");
  const [uppercase, setUppercase] = useState(false);
  const [separator, setSeparator] = useState<Separator>("-");
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUuid = () => (version === "v1" ? uuidV1() : uuidV4());

  const generateBatch = () => {
    const items: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = generateUuid();
      if (separator !== "-") {
        id = id.replace(/-/g, separator === "none" ? "" : "_");
      }
      id = uppercase ? id.toUpperCase() : id.toLowerCase();
      items.push(id);
    }
    setUuids(items);
  };

  const copyAll = async () => {
    if (!uuids.length) return;
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
      alert("✅ UUIDs copied to clipboard!");
    } catch {
      alert("❌ Failed to copy UUIDs.");
    }
  };

  const clearAll = () => setUuids([]);

  return (
    <section
      id="uuid-generator"
      aria-labelledby="uuid-generator-heading"
      className="container-responsive py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="uuid-generator-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Free UUID Generator
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Generate RFC4122 v1 or v4 UUIDs entirely in your browser. Customize case
        and separators, generate batches, and copy with one click.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          generateBatch();
        }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
          <label htmlFor="version" className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Version:</span>
            <select
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value as Version)}
              className="input-base w-auto px-2 py-1 text-sm"
            >
              <option value="v1">v1</option>
              <option value="v4">v4</option>
            </select>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={() => setUppercase((v) => !v)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Uppercase</span>
          </label>

          <label htmlFor="separator" className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              Separator:
            </span>
            <select
              id="separator"
              value={separator}
              onChange={(e) => setSeparator(e.target.value as Separator)}
              className="input-base w-auto px-2 py-1 text-sm"
            >
              <option value="-">Dash (-)</option>
              <option value="_">Underscore (_)</option>
              <option value="none">None</option>
            </select>
          </label>

          <label htmlFor="count" className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Batch:</span>
            <input
              id="count"
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) =>
                setCount(Math.min(50, Math.max(1, Number(e.target.value))))
              }
              className="input-base w-20 px-2 py-1 text-sm"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm font-medium"
          >
            Generate
          </button>
          <button
            type="button"
            onClick={copyAll}
            disabled={!uuids.length}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium disabled:opacity-60"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={!uuids.length}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm font-medium disabled:opacity-60"
          >
            Clear
          </button>
        </div>
      </form>

      {uuids.length > 0 && (
        <textarea
          readOnly
          aria-label="Generated UUIDs"
          value={uuids.join("\n")}
          className="input-base mt-8 w-full max-w-2xl mx-auto h-48 font-mono text-sm bg-gray-50 resize-y"
        />
      )}
    </section>
  );
}
