// app/tools/bcrypt-generator/bcrypt-generator-client.tsx
"use client";

import { useState, useCallback } from "react";
import bcrypt from "bcryptjs";
import {
  ChevronDown,
  ChevronUp,
  ClipboardCopy,
  RefreshCcw,
} from "lucide-react";

export default function BcryptGeneratorClient() {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [password, setPassword] = useState("");
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const generateHash = useCallback(async () => {
    setError(null);
    setHash("");
    if (!password) {
      setError("Please enter a password to hash.");
      return;
    }
    setLoading(true);
    try {
      const salted = await bcrypt.hash(password, rounds);
      setHash(salted);
    } catch {
      setError("Error generating hash. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [password, rounds]);

  const copyHash = async () => {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      alert("✅ Hash copied to clipboard!");
    } catch {
      alert("❌ Copy failed.");
    }
  };

  const clearAll = () => {
    setPassword("");
    setRounds(10);
    setHash("");
    setError(null);
    setShowAdvanced(false);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      id="bcrypt-generator"
      aria-labelledby="bcrypt-generator-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-4 sm:px-0">
        <h1
          id="bcrypt-generator-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Bcrypt Hash Generator
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Generate bcrypt hashes for any password with adjustable salt rounds—100% client-side, no signup required.
        </p>
      </div>

      {/* Tool UI */}
      <div className="max-w-lg mx-auto space-y-8 sm:px-0">
        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to hash"
            className="
              block w-full px-4 py-3 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-indigo-500 transition
            "
          />
        </div>

        {/* Salt Rounds */}
        <div>
          <label htmlFor="rounds" className="block text-sm font-medium text-gray-800 mb-1">
            Salt Rounds: <span className="font-semibold">{rounds}</span>
          </label>
          <input
            id="rounds"
            type="range"
            min={4}
            max={16}
            step={1}
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Generate & Clear Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={generateHash}
            disabled={loading}
            className={`
              flex-1 py-3 bg-indigo-600 text-white rounded-lg
              hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
              transition font-medium ${loading ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {loading ? "Generating…" : "Generate Hash"}
          </button>
          <button
            onClick={clearAll}
            className="
              inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md
              hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300
              transition text-sm font-medium
            "
          >
            <RefreshCcw className="w-5 h-5" aria-hidden="true" />
            Clear All
          </button>
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="
              inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition text-sm
            "
          >
            Advanced
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}

        {/* Result & Copy */}
        {hash && (
          <div className="space-y-4">
            <label htmlFor="hash-output" className="block text-sm font-medium text-gray-800 mb-1">
              Generated Hash
            </label>
            <textarea
              id="hash-output"
              readOnly
              value={hash}
              rows={4}
              className="
                w-full px-4 py-3 border border-gray-300 rounded-lg
                font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500
                transition resize-y
              "
            />
            <div className="flex justify-end">
              <button
                onClick={copyHash}
                className="
                  inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md
                  hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500
                  transition text-sm font-medium
                "
              >
                <ClipboardCopy className="w-5 h-5" aria-hidden="true" />
                Copy Hash
              </button>
            </div>
          </div>
        )}

        {/* Advanced Settings Panel */}
        {showAdvanced && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
            <p className="text-gray-600 text-sm">
              Adjust the salt rounds between 4 (fast) and 16 (slow but more secure).
            </p>
          </div>
        )}
      </div>
    </section>
  );
}