"use client";

import { useState } from "react";

async function computeHash(
  text: string,
  algorithm: "SHA-256" | "SHA-1" | "MD5",
) {
  if (algorithm === "MD5") {
    const { default: SparkMD5 } = await import("spark-md5");
    return SparkMD5.hash(text);
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buf = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function ShaHashGeneratorClient() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<"SHA-256" | "SHA-1" | "MD5">(
    "SHA-256",
  );
  const [hash, setHash] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setError(null);
    setHash("");
    try {
      const result = await computeHash(input, algorithm);
      setHash(result);
    } catch {
      setError("Hash generation failed.");
    }
  };

  const copyHash = async () => {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      alert("✅ Hash copied to clipboard!");
    } catch {
      alert("❌ Failed to copy hash.");
    }
  };

  return (
    <section
      id="sha-hash-generator"
      aria-labelledby="sha-hash-generator-heading"
      className="container-responsive py-16 text-gray-900 antialiased selection:bg-brand-200 selection:text-brand-900"
    >
      <h1
        id="sha-hash-generator-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Hash Generator
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Generate SHA-256, SHA-1 or MD5 hashes directly in your browser. 100%
        client-side and private.
      </p>

      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <label
            htmlFor="hash-input"
            className="block mb-1 font-medium text-gray-800"
          >
            Input Text
          </label>
          <textarea
            id="hash-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
          />
        </div>

        <div>
          <label
            htmlFor="algorithm"
            className="block mb-1 font-medium text-gray-800"
          >
            Algorithm
          </label>
          <select
            id="algorithm"
            value={algorithm}
            onChange={(e) =>
              setAlgorithm(e.target.value as "SHA-256" | "SHA-1" | "MD5")
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-1">SHA-1</option>
            <option value="MD5">MD5</option>
          </select>
        </div>

        <button
          type="button"
          onClick={generate}
          className="w-full py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition font-medium"
        >
          Generate Hash
        </button>

        {hash && (
          <div className="space-y-4">
            <label
              htmlFor="hash-output"
              className="block mb-1 font-medium text-gray-800"
            >
              Generated Hash
            </label>
            <textarea
              id="hash-output"
              readOnly
              value={hash}
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={copyHash}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium"
              >
                Copy Hash
              </button>
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
