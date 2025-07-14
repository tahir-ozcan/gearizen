// app/tools/seo-meta-tag-generator/seo-meta-tag-generator-client.tsx
"use client";

import { useState, ChangeEvent, useMemo } from "react";

/**
 * SEO Meta Tag Generator Tool
 *
 * Create optimized HTML meta tags for title, description, keywords,
 * Open Graph and Twitter Cards—copy ready to paste in your <head> section.
 */
export default function SeoMetaTagGeneratorClient() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [keywords, setKeywords] = useState("");
  const [twitterCard, setTwitterCard] = useState<"summary" | "summary_large_image">(
    "summary_large_image"
  );

  const metaTags = useMemo(() => {
    const lines: string[] = [];
    if (title) {
      lines.push(`<title>${title}</title>`);
      lines.push(`<meta name="title" content="${title}" />`);
      lines.push(`<meta property="og:title" content="${title}" />`);
      lines.push(`<meta name="twitter:title" content="${title}" />`);
    }
    if (description) {
      lines.push(`<meta name="description" content="${description}" />`);
      lines.push(`<meta property="og:description" content="${description}" />`);
      lines.push(`<meta name="twitter:description" content="${description}" />`);
    }
    if (keywords) {
      lines.push(`<meta name="keywords" content="${keywords}" />`);
    }
    if (url) {
      lines.push(`<link rel="canonical" href="${url}" />`);
      lines.push(`<meta property="og:url" content="${url}" />`);
      lines.push(`<meta name="twitter:url" content="${url}" />`);
    }
    if (image) {
      lines.push(`<meta property="og:image" content="${image}" />`);
      lines.push(`<meta name="twitter:image" content="${image}" />`);
    }
    lines.push(`<meta property="og:type" content="website" />`);
    lines.push(`<meta property="og:site_name" content="Gearizen" />`);
    lines.push(`<meta property="og:locale" content="en_US" />`);
    lines.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    lines.push(`<meta name="twitter:site" content="@gearizen" />`);
    return lines.join("\n");
  }, [title, description, keywords, url, image, twitterCard]);

  const copyMeta = async () => {
    try {
      await navigator.clipboard.writeText(metaTags);
      alert("✅ Meta tags copied to clipboard!");
    } catch {
      alert("❌ Failed to copy meta tags.");
    }
  };

  const canCopy = Boolean(title || description || keywords || url || image);

  return (
    <section
      id="seo-meta-tag-generator"
      aria-labelledby="seo-meta-tag-generator-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center sm:px-0 space-y-4">
        <h1
          id="seo-meta-tag-generator-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          SEO Meta Tag Generator
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-3xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Generate optimized HTML meta tags for your page’s title, description,
          keywords, Open Graph and Twitter Cards—copy ready to paste in your{" "}
          {"<head>"} section.
        </p>
      </div>

      {/* Form Inputs */}
      <div className="max-w-lg mx-auto space-y-6 sm:px-0">
        <div>
          <label htmlFor="meta-title" className="block text-sm font-medium text-gray-800 mb-1">
            Page Title
          </label>
          <input
            id="meta-title"
            type="text"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Enter your page title"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7c3aed] transition"
          />
        </div>

        <div>
          <label htmlFor="meta-description" className="block text-sm font-medium text-gray-800 mb-1">
            Description
          </label>
          <textarea
            id="meta-description"
            rows={3}
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Enter a concise page description"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7c3aed] resize-y transition"
          />
        </div>

        <div>
          <label htmlFor="meta-keywords" className="block text-sm font-medium text-gray-800 mb-1">
            Keywords
          </label>
          <input
            id="meta-keywords"
            type="text"
            value={keywords}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setKeywords(e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7c3aed] transition"
          />
        </div>

        <div>
          <label htmlFor="meta-url" className="block text-sm font-medium text-gray-800 mb-1">
            Canonical URL
          </label>
          <input
            id="meta-url"
            type="url"
            value={url}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
            placeholder="https://gearizen.com/your-page"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7c3aed] transition"
          />
        </div>

        <div>
          <label htmlFor="meta-image" className="block text-sm font-medium text-gray-800 mb-1">
            Social Preview Image URL
          </label>
          <input
            id="meta-image"
            type="url"
            value={image}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setImage(e.target.value)}
            placeholder="https://gearizen.com/og-image.png"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7c3aed] transition"
          />
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-800 mb-1">Twitter Card Type</span>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="twitterCard"
                value="summary_large_image"
                checked={twitterCard === "summary_large_image"}
                onChange={() => setTwitterCard("summary_large_image")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Large Image</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="twitterCard"
                value="summary"
                checked={twitterCard === "summary"}
                onChange={() => setTwitterCard("summary")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Text Only</span>
            </label>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={copyMeta}
            disabled={!canCopy}
            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium disabled:opacity-50"
          >
            Copy Meta Tags
          </button>
        </div>
      </div>

      {/* Generated Meta Tags Output */}
      <div className="mt-12 max-w-3xl mx-auto sm:px-0">
        <label htmlFor="meta-output" className="sr-only">
          Generated meta tags
        </label>
        <textarea
          id="meta-output"
          readOnly
          rows={10}
          value={metaTags}
          className="w-full font-mono text-sm p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7c3aed] transition"
        />
      </div>
    </section>
  );
}