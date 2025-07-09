// app/tools/open-graph-preview/open-graph-preview-client.tsx
"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";

interface OgMetadata {
  title: string;
  description: string;
  image?: string;
  siteName?: string;
  url: string;
}

export default function OpenGraphPreviewClient() {
  const [inputUrl, setInputUrl] = useState("");
  const [metadata, setMetadata] = useState<OgMetadata | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setInputUrl(e.target.value);
    setError("");
    setMetadata(null);
  }

  async function fetchPreview() {
    if (!inputUrl.trim()) {
      setError("Please enter a valid URL.");
      return;
    }
    setStatus("loading");
    setError("");
    setMetadata(null);

    try {
      const res = await fetch(
        `/api/og-preview?url=${encodeURIComponent(inputUrl.trim())}`
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch metadata (${res.status})`);
      }
      const data = (await res.json()) as OgMetadata;
      setMetadata(data);
      setStatus("idle");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  return (
    <section
      id="open-graph-preview"
      aria-labelledby="og-preview-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="og-preview-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Open Graph Preview
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Enter any URL to see its Open Graph metadata—title, description, image,
        and site name—rendered in a preview card. 100% client-side, no signup
        required.
      </p>

      <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 mb-6">
        <label htmlFor="og-url-input" className="sr-only">
          URL to preview
        </label>
        <input
          id="og-url-input"
          type="url"
          value={inputUrl}
          onChange={handleChange}
          placeholder="https://example.com/page"
          className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button
          onClick={fetchPreview}
          disabled={status === "loading"}
          className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium disabled:opacity-60"
        >
          {status === "loading" ? "Loading…" : "Preview"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="max-w-xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
        >
          <p className="text-sm">{error}</p>
        </div>
      )}

      {metadata && (
        <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {metadata.image && (
            <div className="relative w-full h-48">
              <Image
                src={metadata.image}
                alt={metadata.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {metadata.title}
            </h2>
            <p className="text-gray-600 mb-4">{metadata.description}</p>
            <div className="text-sm text-gray-500 flex items-center justify-between">
              {metadata.siteName && <span>{metadata.siteName}</span>}
              <a
                href={metadata.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {new URL(metadata.url).hostname}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}