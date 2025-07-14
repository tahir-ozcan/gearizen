// app/tools/jwt-hash-generator/jwt-hash-generator-client.tsx
"use client";

import { useState, ChangeEvent } from "react";
import { ClipboardCopy } from "lucide-react";

/**
 * JWT Hash Generator
 *
 * Generate signed JSON Web Tokens (JWT) in your browser using HMAC-SHA algorithms.
 * Enter a payload and secret, choose HS256/HS384/HS512, then generate and copy your token—100% client-side.
 */
export default function JwtHashGeneratorClient() {
  const [payload, setPayload] = useState<string>(
    `{"sub":"1234567890","name":"John Doe","iat":${Math.floor(Date.now() / 1000)}}`
  );
  const [secret, setSecret] = useState<string>("your-256-bit-secret");
  const [alg, setAlg] = useState<"HS256" | "HS384" | "HS512">("HS256");
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Map our alg codes to the Web Crypto hash names
  const hashMap: Record<"HS256" | "HS384" | "HS512", "SHA-256" | "SHA-384" | "SHA-512"> = {
    HS256: "SHA-256",
    HS384: "SHA-384",
    HS512: "SHA-512",
  };

  // Base64-URL encode an ArrayBuffer (HMAC signature)
  async function signHmac(
    data: Uint8Array,
    secretKey: string
  ): Promise<ArrayBuffer> {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secretKey),
      { name: "HMAC", hash: { name: hashMap[alg] } },
      false,
      ["sign"]
    );
    return crypto.subtle.sign("HMAC", key, data);
  }

  // Encode JSON → Base64URL
  function encodeSegment(obj: object): string {
    const json = JSON.stringify(obj);
    const utf8 = new TextEncoder().encode(json);
    let binary = "";
    utf8.forEach((b) => (binary += String.fromCharCode(b)));
    const b64 = btoa(binary);
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  const handleGenerate = async () => {
    setError(null);
    try {
      // 1) Header & payload
      const header = { alg, typ: "JWT" };
      const b64Header = encodeSegment(header);

      let payloadObj: Record<string, unknown>;
      try {
        payloadObj = JSON.parse(payload);
        if (typeof payloadObj !== "object" || payloadObj === null) {
          throw new Error();
        }
      } catch {
        throw new Error("Payload is not valid JSON object");
      }
      const b64Payload = encodeSegment(payloadObj);

      // 2) Sign
      const data = new TextEncoder().encode(`${b64Header}.${b64Payload}`);
      const signatureBuffer = await signHmac(data, secret);
      const sigBytes = new Uint8Array(signatureBuffer);
      let sigBinary = "";
      sigBytes.forEach((b) => (sigBinary += String.fromCharCode(b)));
      const b64Sig = btoa(sigBinary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");

      // 3) Assemble JWT
      setToken(`${b64Header}.${b64Payload}.${b64Sig}`);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to generate JWT";
      setToken("");
      setError(msg);
    }
  };

  const copyToken = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      alert("✅ Token copied!");
    } catch {
      alert("❌ Copy failed");
    }
  };

  return (
    <section
      id="jwt-hash-generator"
      aria-labelledby="jwt-generator-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-4">
        <h1
          id="jwt-generator-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          JWT Hash Generator
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-700 leading-relaxed">
          Generate signed JSON Web Tokens (JWT) using HS256, HS384, or HS512—entirely in your
          browser. Enter a JSON payload and secret, choose an algorithm, then generate and copy
          your token.
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-3xl mx-auto space-y-8 sm:px-0">
        {/* Algorithm */}
        <div>
          <label htmlFor="alg-select" className="block mb-1 font-medium text-gray-800">
            Algorithm
          </label>
          <select
            id="alg-select"
            value={alg}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setAlg(e.target.value as "HS256" | "HS384" | "HS512")
            }
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="HS256">HS256</option>
            <option value="HS384">HS384</option>
            <option value="HS512">HS512</option>
          </select>
        </div>

        {/* Payload */}
        <div>
          <label htmlFor="payload-input" className="block mb-1 font-medium text-gray-800">
            Payload (JSON)
          </label>
          <textarea
            id="payload-input"
            rows={6}
            value={payload}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setPayload(e.target.value)
            }
            className="
              w-full p-4 border border-gray-300 rounded-md bg-white
              focus:ring-2 focus:ring-indigo-500 font-mono resize-y transition
            "
            placeholder='{"sub":"1234567890","name":"John Doe"}'
          />
        </div>

        {/* Secret */}
        <div>
          <label htmlFor="secret-input" className="block mb-1 font-medium text-gray-800">
            Secret Key
          </label>
          <input
            id="secret-input"
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="your-256-bit-secret"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition font-mono"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
          >
            Generate JWT
          </button>
        </div>
      </div>

      {/* Output */}
      {token && (
        <div className="mt-12 max-w-3xl mx-auto space-y-4">
          <label htmlFor="jwt-output" className="block mb-1 font-medium text-gray-800">
            Your JWT
          </label>
          <textarea
            id="jwt-output"
            readOnly
            value={token}
            rows={4}
            className="
              w-full p-4 border border-gray-300 rounded-md bg-gray-50
              focus:ring-2 focus:ring-indigo-500 font-mono resize-y transition
            "
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={copyToken}
              className="
                inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md
                hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                transition font-medium
              "
            >
              <ClipboardCopy className="w-5 h-5" />
              Copy Token
            </button>
          </div>
        </div>
      )}
    </section>
  );
}