// app/tools/url-tools/url-tools-client.tsx
"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { ClipboardCopy, ExternalLink } from "lucide-react";

/**
 * URL Tools
 *
 * Parse, validate, and transform URLs. Instantly extract components
 * (protocol, domain, path, query), add or remove query params, and
 * encode/decode. Copy any result with one click—all client-side.
 */
export default function UrlToolsClient() {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [urlObj, setUrlObj] = useState<URL | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newParamKey, setNewParamKey] = useState<string>("");
  const [newParamValue, setNewParamValue] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Parse URL whenever input changes
  useEffect(() => {
    if (!inputUrl.trim()) {
      setUrlObj(null);
      setError(null);
      return;
    }
    try {
      const parsed = new URL(inputUrl.trim());
      setUrlObj(parsed);
      setError(null);
    } catch {
      setUrlObj(null);
      setError("Invalid URL");
    }
  }, [inputUrl]);

  // Handlers
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInputUrl(e.target.value);

  const handleAddParam = () => {
    if (!urlObj || !newParamKey.trim()) return;
    urlObj.searchParams.set(newParamKey.trim(), newParamValue);
    setInputUrl(urlObj.toString());
    setNewParamKey("");
    setNewParamValue("");
  };

  const handleRemoveParam = (key: string) => {
    if (!urlObj) return;
    urlObj.searchParams.delete(key);
    setInputUrl(urlObj.toString());
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("✅ Copied!");
    } catch {
      alert("❌ Copy failed");
    }
  };

  return (
    <section
      id="url-tools"
      aria-labelledby="url-tools-heading"
      className="space-y-16 text-gray-900 antialiased px-4 sm:px-6 lg:px-8"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-4">
        <h1
          id="url-tools-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          URL Tools
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-2xl text-lg text-gray-700 leading-relaxed">
          Paste a URL to parse its components, manage query parameters, encode/decode, and copy
          results instantly—100% client-side.
        </p>
      </div>

      {/* URL Input */}
      <div className="max-w-3xl mx-auto space-y-4">
        <label htmlFor="url-input" className="block text-sm font-medium text-gray-800 mb-1">
          URL
        </label>
        <div className="relative">
          <input
            id="url-input"
            ref={inputRef}
            type="text"
            value={inputUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/path?foo=bar"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            onClick={() => copyToClipboard(inputUrl)}
            aria-label="Copy URL"
            className="absolute right-2 top-2 text-gray-500 hover:text-indigo-500 transition"
          >
            <ClipboardCopy className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-3xl mx-auto text-center text-red-600">{error}</div>
      )}

      {/* Parsed Components & Tools */}
      {urlObj && (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Components */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ComponentCard label="Protocol" value={urlObj.protocol} />
            <ComponentCard label="Host" value={urlObj.host} />
            <ComponentCard label="Pathname" value={urlObj.pathname || "/"} />
            <ComponentCard label="Hash" value={urlObj.hash || "(none)"} />
          </div>

          {/* Query Parameters */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Query Parameters</h2>
            {Array.from(urlObj.searchParams.entries()).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <span className="font-mono text-gray-700">
                  {key} = {val}
                </span>
                <button
                  onClick={() => handleRemoveParam(key)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            {urlObj.searchParams.toString() === "" && (
              <p className="text-sm text-gray-500">No query parameters</p>
            )}
          </div>

          {/* Add / Update Parameter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Param key"
              value={newParamKey}
              onChange={(e) => setNewParamKey(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
            />
            <input
              type="text"
              placeholder="Param value"
              value={newParamValue}
              onChange={(e) => setNewParamValue(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              onClick={handleAddParam}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
            >
              Add / Update Param
            </button>
          </div>

          {/* Encode / Decode */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Encode / Decode</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setInputUrl((u) => encodeURI(u))}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition font-medium"
              >
                Encode URI
              </button>
              <button
                onClick={() => setInputUrl((u) => decodeURI(u))}
                className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition font-medium"
              >
                Decode URI
              </button>
            </div>
          </div>

          {/* Final URL */}
          <div className="space-y-1">
            <label
              htmlFor="final-url"
              className="block text-sm font-medium text-gray-800"
            >
              Resulting URL
            </label>
            <div className="relative">
              <input
                id="final-url"
                readOnly
                value={urlObj.toString()}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-500 transition font-mono"
              />
              <button
                onClick={() => copyToClipboard(urlObj.toString())}
                aria-label="Copy Result URL"
                className="absolute right-2 top-2 text-gray-500 hover:text-indigo-500 transition"
              >
                <ClipboardCopy className="w-5 h-5" />
              </button>
              <a
                href={urlObj.toString()}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-10 top-2 text-gray-500 hover:text-indigo-500 transition"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/** Reusable card for displaying a URL component + copy button */
function ComponentCard({ label, value }: { label: string; value: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      alert("✅ Copied!");
    } catch {
      alert("❌ Copy failed");
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg text-center">
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <p className="font-mono text-indigo-600 break-all">{value}</p>
      <button
        onClick={copy}
        className="mt-3 text-gray-500 hover:text-indigo-600 transition"
        aria-label={`Copy ${label}`}
      >
        <ClipboardCopy className="inline-block w-5 h-5" />
      </button>
    </div>
  );
}