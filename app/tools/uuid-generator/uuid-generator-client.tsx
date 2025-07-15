// app/tools/uuid-generator/uuid-generator-client.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { ClipboardCopy } from "lucide-react";

/**
 * v4: Generate an RFC4122 v4 UUID using the browser crypto API.
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
  // remove dashes, convert to bytes
  const nsHex = namespace.replace(/-/g, "");
  const nsBytes = new Uint8Array(nsHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));
  const nameBytes = new TextEncoder().encode(name);

  // concat namespace + name
  const toHash = new Uint8Array(nsBytes.length + nameBytes.length);
  toHash.set(nsBytes, 0);
  toHash.set(nameBytes, nsBytes.length);

  // SHA-1 digest
  const hashBuffer = await crypto.subtle.digest("SHA-1", toHash);
  const hash = new Uint8Array(hashBuffer);

  // set version and variant bits
  hash[6] = (hash[6] & 0x0f) | 0x50; // version 5
  hash[8] = (hash[8] & 0x3f) | 0x80; // variant

  // take first 16 bytes and format
  const hex = Array.from(hash.subarray(0, 16))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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
  // --- State ---
  const [version, setVersion] = useState<Version>("v4");
  const [uppercase, setUppercase] = useState(false);
  const [separator, setSeparator] = useState<Separator>("-");
  const [count, setCount] = useState(1);
  const [namespace, setNamespace] = useState("");
  const [name, setName] = useState("");
  const [uuids, setUuids] = useState<string[]>([]);

  // --- Handlers ---
  const generateSync = (): string => (version === "v1" ? uuidV1() : uuidV4());

  const generateBatch = async () => {
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      let id: string;
      if (version === "v5") {
        id = await uuidV5(namespace.trim(), name.trim());
      } else {
        id = generateSync();
      }
      // apply separator preference
      if (separator !== "-") {
        id = separator === "none" ? id.replace(/-/g, "") : id.replace(/-/g, "_");
      }
      // apply casing
      id = uppercase ? id.toUpperCase() : id.toLowerCase();
      out.push(id);
    }
    setUuids(out);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (version === "v5" && (!namespace.trim() || !name.trim())) {
      alert("⚠️ v5 requires both Namespace UUID and Name.");
      return;
    }
    generateBatch();
  };

  const copyAll = async () => {
    if (!uuids.length) return;
    await navigator.clipboard.writeText(uuids.join("\n"));
    alert("✅ UUIDs copied to clipboard!");
  };

  const clearAll = () => setUuids([]);

  return (
    <section
      id="uuid-generator"
      aria-labelledby="uuid-generator-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          id="uuid-generator-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          UUID Generator
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-3xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Instantly create RFC4122-compliant UUIDs (v1, v4, v5) with namespace support,
          custom separators, casing and batch sizes—all client-side.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto space-y-8 sm:px-0"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Version */}
          <div>
            <label
              htmlFor="version-select"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Version
            </label>
            <select
              id="version-select"
              value={version}
              onChange={(e) => setVersion(e.target.value as Version)}
              className="input-base w-full"
            >
              <option value="v1">v1 (timestamp)</option>
              <option value="v4">v4 (random)</option>
              <option value="v5">v5 (namespace)</option>
            </select>
          </div>

          {/* Namespace (v5 only) */}
          {version === "v5" && (
            <div>
              <label
                htmlFor="namespace-input"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Namespace UUID
              </label>
              <input
                id="namespace-input"
                type="text"
                value={namespace}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNamespace(e.target.value)
                }
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="input-base w-full"
              />
            </div>
          )}

          {/* Name (v5 only) */}
          {version === "v5" && (
            <div>
              <label
                htmlFor="name-input"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Name
              </label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                placeholder="Enter name"
                className="input-base w-full"
              />
            </div>
          )}

          {/* Uppercase */}
          <div className="flex items-center space-x-2">
            <input
              id="uppercase-checkbox"
              type="checkbox"
              checked={uppercase}
              onChange={() => setUppercase((v) => !v)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="uppercase-checkbox"
              className="text-sm text-gray-800"
            >
              Uppercase
            </label>
          </div>

          {/* Separator */}
          <div>
            <label
              htmlFor="separator-select"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Separator
            </label>
            <select
              id="separator-select"
              value={separator}
              onChange={(e) =>
                setSeparator(e.target.value as Separator)
              }
              className="input-base w-full"
            >
              <option value="-">Dash (–)</option>
              <option value="_">Underscore (_)</option>
              <option value="none">None</option>
            </select>
          </div>

          {/* Batch Size */}
          <div>
            <label
              htmlFor="count-input"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Batch Size
            </label>
            <input
              id="count-input"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCount(Math.min(100, Math.max(1, +e.target.value)))
              }
              className="input-base w-full"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="
              px-6 py-2
              bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
              text-white rounded-md
              hover:opacity-80 transition-opacity
              focus:outline-none focus:ring-2 focus:ring-[#7c3aed]
            "
          >
            Generate
          </button>
          <button
            type="button"
            disabled={!uuids.length}
            onClick={copyAll}
            className="
              inline-flex items-center gap-2 px-6 py-2
              bg-indigo-600 text-white rounded-md
              hover:opacity-80 transition-opacity
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <ClipboardCopy className="w-5 h-5" />
            Copy All
          </button>
          <button
            type="button"
            disabled={!uuids.length}
            onClick={clearAll}
            className="
              inline-flex items-center gap-2 px-6 py-2
              bg-red-600 text-white rounded-md
              hover:opacity-80 transition-opacity
              focus:outline-none focus:ring-2 focus:ring-red-500
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <ClipboardCopy className="w-5 h-5 rotate-45" />
            Clear
          </button>
        </div>
      </form>

      {uuids.length > 0 && (
        <textarea
          readOnly
          rows={6}
          value={uuids.join("\n")}
          className="
            w-full max-w-3xl mx-auto p-4
            border border-gray-300 rounded-md
            bg-gray-50 font-mono resize-y
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition
          "
        />
      )}
    </section>
  );
}