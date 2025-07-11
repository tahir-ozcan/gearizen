// app/tools/jwt-decoder/jwt-decoder-client.tsx
"use client";

import { useState, ChangeEvent } from "react";

interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export default function JwtDecoderClient() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [parts, setParts] = useState<JwtParts | null>(null);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setToken(e.target.value.trim());
    setError(null);
    setParts(null);
  }

  function decodeJwt() {
    setError(null);
    setParts(null);

    const segments = token.split(".");
    if (segments.length < 2) {
      setError("Invalid JWT: expected header.payload.signature");
      return;
    }

    try {
      const [h, p, s] = segments;
      // atob is globally available in browsers
      const headerJson = JSON.parse(atob(h));
      const payloadJson = JSON.parse(atob(p));

      setParts({
        header: headerJson,
        payload: payloadJson,
        signature: s,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to decode JWT");
    }
  }

  async function copyJson(obj: Record<string, unknown>, label: string) {
    try {
      await navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
      alert(`✅ ${label} copied to clipboard!`);
    } catch {
      alert(`❌ Failed to copy ${label}.`);
    }
  }

  return (
    <section
      id="jwt-decoder"
      aria-labelledby="jwt-decoder-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-brand-200 selection:text-brand-900"
    >
      <h1
        id="jwt-decoder-heading"
        className="text-3xl md:text-4xl font-extrabold text-center mb-6 tracking-tight"
      >
        JWT Decoder
      </h1>
      <p className="text-center text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
        Paste your JSON Web Token to instantly decode its header, payload, and signature — all client-side, no signup required.
      </p>

      <label htmlFor="jwt-input" className="sr-only">
        JWT Input
      </label>
      <textarea
        id="jwt-input"
        aria-label="JWT input"
        value={token}
        onChange={handleChange}
        placeholder="Paste your JWT here..."
        className="w-full h-32 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
      />

      <div className="mt-4 text-center">
        <button
          onClick={decodeJwt}
          className="inline-block px-6 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition text-sm font-medium"
        >
          Decode Token
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md max-w-2xl mx-auto"
        >
          <p className="text-sm">{error}</p>
        </div>
      )}

      {parts && (
        <div className="mt-8 space-y-8 max-w-4xl mx-auto">
          {/* Header */}
          <section aria-labelledby="jwt-header-heading">
            <div className="flex items-center justify-between mb-2">
              <h2 id="jwt-header-heading" className="text-xl font-semibold text-gray-800">
                Header
              </h2>
              <button
                onClick={() => copyJson(parts.header, "Header JSON")}
                className="text-brand-600 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 rounded transition text-sm"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto font-mono text-sm">
              {JSON.stringify(parts.header, null, 2)}
            </pre>
          </section>

          {/* Payload */}
          <section aria-labelledby="jwt-payload-heading">
            <div className="flex items-center justify-between mb-2">
              <h2 id="jwt-payload-heading" className="text-xl font-semibold text-gray-800">
                Payload
              </h2>
              <button
                onClick={() => copyJson(parts.payload, "Payload JSON")}
                className="text-brand-600 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 rounded transition text-sm"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto font-mono text-sm">
              {JSON.stringify(parts.payload, null, 2)}
            </pre>
          </section>

          {/* Signature */}
          <section aria-labelledby="jwt-signature-heading">
            <div className="flex items-center justify-between mb-2">
              <h2 id="jwt-signature-heading" className="text-xl font-semibold text-gray-800">
                Signature
              </h2>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(parts.signature).then(
                    () => alert("✅ Signature copied!"),
                    () => alert("❌ Copy failed.")
                  )
                }
                className="text-brand-600 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 rounded transition text-sm"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto font-mono text-sm">
              {parts.signature}
            </pre>
          </section>
        </div>
      )}
    </section>
  );
}