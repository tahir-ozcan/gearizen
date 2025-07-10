// app/tools/bcrypt-generator/bcrypt-generator-client.tsx

"use client";

import { useState, useCallback } from "react";
import bcrypt from "bcryptjs";

export default function BcryptGeneratorClient() {
  const [password, setPassword] = useState("");
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateHash = useCallback(async () => {
    setError(null);
    setHash("");

    if (!password) {
      setError("Please enter a password to hash.");
      return;
    }

    setLoading(true);
    try {
      // bcrypt.hash(data, saltRounds) returns Promise<string>
      const hashed = await bcrypt.hash(password, rounds);
      setHash(hashed);
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
      alert("❌ Failed to copy hash.");
    }
  };

  return (
    <section
      id="bcrypt-generator"
      aria-labelledby="bcrypt-generator-heading"
      className="container-responsive py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="bcrypt-generator-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Bcrypt Hash Generator
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Generate bcrypt hashes for any password with adjustable salt rounds.
        100% client-side, no signup required.
      </p>

      <div className="max-w-lg mx-auto space-y-6">
        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block mb-1 font-medium text-gray-800">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to hash"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Salt Rounds Slider */}
        <div>
          <label htmlFor="rounds" className="block mb-1 font-medium text-gray-800">
            Salt Rounds: <span className="font-semibold">{rounds}</span>
          </label>
          <input
            id="rounds"
            type="range"
            min={4}
            max={16}
            step={1}
            value={rounds}
            onChange={(e) => setRounds(parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>

        {/* Hata Mesajı */}
        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}

        {/* Generate Button */}
        <button
          onClick={generateHash}
          disabled={loading}
          className={`w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Generating…" : "Generate Hash"}
        </button>

        {/* Sonuç & Kopyalama */}
        {hash && (
          <div className="space-y-4">
            <label htmlFor="hash-output" className="block mb-1 font-medium text-gray-800">
              Generated Hash
            </label>
            <textarea
              id="hash-output"
              readOnly
              value={hash}
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-y"
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
      </div>
    </section>
  );
}