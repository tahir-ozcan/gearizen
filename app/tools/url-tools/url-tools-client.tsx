// app/tools/url-tools/url-tools-client.tsx
"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { ClipboardCopy, PlusCircle, Trash2 } from "lucide-react";

type Mode = "encode" | "decode" | "parse" | "slug";

export default function UrlToolsClient() {
  const [mode, setMode] = useState<Mode>("parse");
  const [input, setInput] = useState("");
  const [parsedUrl, setParsedUrl] = useState<URL | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [slugSource, setSlugSource] = useState("");
  const [slug, setSlug] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Parse URL on input change in parse mode
  useEffect(() => {
    if (mode === "parse" && input.trim()) {
      try {
        const u = new URL(input.trim());
        setParsedUrl(u);
        setError(null);
      } catch {
        setParsedUrl(null);
        setError("Invalid URL");
      }
    }
  }, [input, mode]);

  // Generate slug on slugSource change
  useEffect(() => {
    if (mode === "slug") {
      const s = slugSource
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(s);
    }
  }, [slugSource, mode]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("✅ Copied!");
    } catch {
      alert("❌ Copy failed");
    }
  };

  const handleEncode = () => setInput(encodeURI(input));
  const handleDecode = () => setInput(decodeURI(input));

  const addParam = () => {
    if (!parsedUrl) return;
    const key = prompt("Parameter name:");
    if (!key) return;
    const val = prompt("Parameter value:") ?? "";
    parsedUrl.searchParams.set(key.trim(), val);
    setInput(parsedUrl.toString());
  };

  const removeParam = (key: string) => {
    if (!parsedUrl) return;
    parsedUrl.searchParams.delete(key);
    setInput(parsedUrl.toString());
  };

  const modes: [string, Mode][] = [
    ["Parse URL", "parse"],
    ["Encode URI", "encode"],
    ["Decode URI", "decode"],
    ["Slugify", "slug"],
  ];

  const components: [string, string][] = parsedUrl
    ? [
        ["Protocol", parsedUrl.protocol],
        ["Host", parsedUrl.host],
        ["Pathname", parsedUrl.pathname || "/"],
        ["Hash", parsedUrl.hash || "(none)"],
      ]
    : [];

  return (
    <section
      id="url-tools"
      aria-labelledby="url-tools-heading"
      className="space-y-12 text-gray-900 antialiased px-4 lg:px-0"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <h1
          id="url-tools-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl font-extrabold tracking-tight
          "
        >
          URL Tools: Encode, Decode, Parse &amp; Slugify
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-700">
          Choose a mode below to work with your URL or text—fully client-side,
          no signup required.
        </p>
      </div>

      {/* Mode Switch */}
      <div className="flex justify-center gap-4 flex-wrap">
        {modes.map(([label, m]) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setInput("");
              setParsedUrl(null);
              setError(null);
              setSlugSource("");
              setSlug("");
              inputRef.current?.focus();
            }}
            className={`
              px-5 py-2 rounded-md font-medium transition
              ${
                mode === m
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input Field */}
      {mode !== "slug" && (
        <div className="max-w-3xl mx-auto space-y-4">
          <label
            htmlFor="ut-input"
            className="block text-sm font-medium text-gray-800"
          >
            {mode === "parse"
              ? "Enter URL to parse"
              : mode === "encode"
              ? "Enter URI to encode"
              : "Enter URI to decode"}
          </label>
          <div className="relative flex items-center">
            <input
              id="ut-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              placeholder={
                mode === "parse"
                  ? "https://example.com/path?foo=bar"
                  : mode === "encode"
                  ? "Enter URI…"
                  : "Enter encoded URI…"
              }
              className="flex-1 p-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              onClick={() => copy(input)}
              aria-label="Copy input"
              className="absolute right-2 text-gray-500 hover:text-indigo-600 transition"
            >
              <ClipboardCopy className="w-5 h-5" />
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      )}

      {/* Mode Outputs */}
      <div className="max-w-3xl mx-auto space-y-8">
        {mode === "parse" && parsedUrl && (
          <>
            {/* Parsed Components */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {components.map(([label, value]) => (
                <div
                  key={label}
                  className="p-4 bg-gray-50 rounded-lg text-center"
                >
                  <p className="text-sm text-gray-600 mb-1">{label}</p>
                  <p className="font-mono text-indigo-600 break-all">
                    {value}
                  </p>
                  <button
                    onClick={() => copy(value)}
                    className="mt-2 text-gray-500 hover:text-indigo-600 transition"
                  >
                    <ClipboardCopy className="w-5 h-5 inline-block" />
                  </button>
                </div>
              ))}
            </div>

            {/* Query Parameters */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800">
                Query Parameters
              </p>
              {parsedUrl.searchParams.toString() ? (
                Array.from(parsedUrl.searchParams.entries()).map(
                  ([key, val]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <span className="font-mono text-gray-700 break-all">
                        {key} = {val}
                      </span>
                      <button
                        onClick={() => removeParam(key)}
                        className="text-red-500 hover:underline text-sm inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  )
                )
              ) : (
                <p className="text-sm text-gray-500">No parameters</p>
              )}
              <button
                onClick={addParam}
                className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
              >
                <PlusCircle className="w-5 h-5" /> Add Parameter
              </button>
            </div>
          </>
        )}

        {mode === "encode" && (
          <button
            onClick={handleEncode}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
          >
            Encode URI →
          </button>
        )}

        {mode === "decode" && (
          <button
            onClick={handleDecode}
            className="w-full px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition font-medium"
          >
            Decode URI →
          </button>
        )}

        {mode === "slug" && (
          <>
            <label
              htmlFor="slug-input"
              className="block text-sm font-medium text-gray-800"
            >
              Enter text to slugify
            </label>
            <textarea
              id="slug-input"
              rows={2}
              value={slugSource}
              onChange={(e) => setSlugSource(e.target.value)}
              placeholder="My Awesome Blog Post Title!"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition font-mono resize-y"
            />
            {slug && (
              <div className="relative">
                <input
                  readOnly
                  value={slug}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-500 transition font-mono"
                />
                <button
                  onClick={() => copy(slug)}
                  aria-label="Copy slug"
                  className="absolute right-2 top-2 text-gray-500 hover:text-indigo-600 transition"
                >
                  <ClipboardCopy className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}