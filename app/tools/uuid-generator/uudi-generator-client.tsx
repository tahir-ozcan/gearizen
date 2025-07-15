// app/tools/uuid-generator/uuid-generator-client.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";

/**
 * v4: Generate a RFC4122 v4 UUID using the browser crypto API.
 */
function uuidV4(): string {
  return crypto.randomUUID();
}

/**
 * v1: Simple timestamp-based UUID v1.
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

/**
 * v5: Generate a name-based UUID v5 (SHA-1) for a given namespace UUID + name.
 */
async function uuidV5(namespace: string, name: string): Promise<string> {
  // Strip dashes and convert namespace to bytes
  const nsHex = namespace.replace(/-/g, "");
  const nsBytes = new Uint8Array(nsHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));
  const nameBytes = new TextEncoder().encode(name);

  // Concatenate namespace + name
  const toHash = new Uint8Array(nsBytes.length + nameBytes.length);
  toHash.set(nsBytes, 0);
  toHash.set(nameBytes, nsBytes.length);

  // SHA-1 hash
  const hashBuffer = await crypto.subtle.digest("SHA-1", toHash);
  const hash = new Uint8Array(hashBuffer);

  // Set version (0101) and variant (10xx)
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;

  // Take first 16 bytes
  const hex = Array.from(hash.subarray(0, 16))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Format into UUID segments
  return (
    hex.slice(0, 8) +
    "-" +
    hex.slice(8, 12) +
    "-" +
    hex.slice(12, 16) +
    "-" +
    hex.slice(16, 20) +
    "-" +
    hex.slice(20, 32)
  );
}

type Version = "v1" | "v4" | "v5";
type Separator = "-" | "_" | "none";

export default function UuidGeneratorClient() {
  const [version, setVersion] = useState<Version>("v4");
  const [uppercase, setUppercase] = useState(false);
  const [separator, setSeparator] = useState<Separator>("-");
  const [count, setCount] = useState(1);
  const [namespace, setNamespace] = useState("");
  const [name, setName] = useState("");
  const [uuids, setUuids] = useState<string[]>([]);

  const generateSync = (): string =>
    version === "v1" ? uuidV1() : uuidV4();

  const generateBatch = async () => {
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      let id: string;
      if (version === "v5") {
        id = await uuidV5(namespace, name);
      } else {
        id = generateSync();
      }
      if (separator !== "-") {
        id =
          separator === "none" ? id.replace(/-/g, "") : id.replace(/-/g, "_");
      }
      id = uppercase ? id.toUpperCase() : id.toLowerCase();
      out.push(id);
    }
    setUuids(out);
  };

  const copyAll = async () => {
    if (!uuids.length) return;
    await navigator.clipboard.writeText(uuids.join("\n"));
    alert("✅ UUIDs copied!");
  };
  const clearAll = () => setUuids([]);

  return (
    <section className="space-y-16 text-gray-900 antialiased">
      <div className="text-center space-y-6 sm:px-0">
        <h1 className="bg-clip-text text-transparent
                       bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
                       text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          UUID Generator
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-3xl text-lg sm:text-xl text-gray-700">
          Create RFC4122-compliant UUIDs (v1, v4, v5) instantly, with optional
          namespace support.
        </p>
      </div>

      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          generateBatch();
        }}
        className="max-w-3xl mx-auto space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="flex flex-col text-sm">
            Version
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value as Version)}
              className="mt-1 input-base"
            >
              <option value="v1">v1</option>
              <option value="v4">v4</option>
              <option value="v5">v5</option>
            </select>
          </label>

          {version === "v5" && (
            <>
              <label className="flex flex-col text-sm">
                Namespace UUID
                <input
                  type="text"
                  value={namespace}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNamespace(e.target.value)
                  }
                  placeholder="e.g. 6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                  className="mt-1 input-base"
                />
              </label>
              <label className="flex flex-col text-sm">
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter name"
                  className="mt-1 input-base"
                />
              </label>
            </>
          )}

          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={() => setUppercase((v) => !v)}
              className="h-4 w-4 text-indigo-600"
            />
            <span>Uppercase</span>
          </label>

          <label className="flex flex-col text-sm">
            Separator
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value as Separator)}
              className="mt-1 input-base"
            >
              <option value="-">Dash (–)</option>
              <option value="_">Underscore (_)</option>
              <option value="none">None</option>
            </select>
          </label>

          <label className="flex flex-col text-sm">
            Batch Size
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCount(Math.min(100, Math.max(1, +e.target.value)))
              }
              className="mt-1 input-base"
            />
          </label>
        </div>

        <div className="flex justify-center gap-4">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-md">
            Generate
          </button>
          <button
            type="button"
            disabled={!uuids.length}
            onClick={copyAll}
            className="px-6 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
          >
            Copy All
          </button>
          <button
            type="button"
            disabled={!uuids.length}
            onClick={clearAll}
            className="px-6 py-2 bg-red-600 text-white rounded-md disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </form>

      {uuids.length > 0 && (
        <textarea
          readOnly
          rows={6}
          value={uuids.join("\n")}
          className="w-full max-w-3xl mx-auto p-4 border bg-gray-50 font-mono resize-y focus:ring-2 focus:ring-[#7c3aed]"
        />
      )}
    </section>
  );
}