// app/tools/seo-meta-tag-generator/seo-meta-tag-generator-client.tsx
"use client";

import { useState, ChangeEvent } from "react";

export default function SeoMetaTagGeneratorClient() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [keywords, setKeywords] = useState("");
  const [twitterCard, setTwitterCard] = useState<"summary" | "summary_large_image">("summary_large_image");

  function generateMetaTags(): string {
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
    lines.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    lines.push(`<meta property="og:locale" content="en_US" />`);
    lines.push(`<meta name="twitter:site" content="@gearizen" />`);
    lines.push(`<meta property="og:site_name" content="Gearizen" />`);
    return lines.join("\n");
  }

  async function handleCopy() {
    const meta = generateMetaTags();
    try {
      await navigator.clipboard.writeText(meta);
      alert("✅ Meta tags copied to clipboard!");
    } catch {
      alert("❌ Failed to copy meta tags.");
    }
  }

  return (
    <section
      id="seo-meta-tag-generator"
      aria-labelledby="seo-meta-tag-generator-heading"
      className="container-responsive py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="seo-meta-tag-generator-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        SEO Meta Tag Generator
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Create optimized HTML meta tags for title, description, Open Graph and Twitter Cards. Copy the code with one click.
      </p>

      <div className="max-w-lg mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <label htmlFor="meta-title" className="block mb-1 font-medium text-gray-800">
            Page Title
          </label>
          <input
            id="meta-title"
            type="text"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Enter your page title"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="meta-description" className="block mb-1 font-medium text-gray-800">
            Description
          </label>
          <textarea
            id="meta-description"
            rows={3}
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Enter a concise page description"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-y"
          />
        </div>

        {/* Keywords */}
        <div>
          <label htmlFor="meta-keywords" className="block mb-1 font-medium text-gray-800">
            Keywords
          </label>
          <input
            id="meta-keywords"
            type="text"
            value={keywords}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setKeywords(e.target.value)}
            placeholder="keyword1, keyword2"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Canonical URL */}
        <div>
          <label htmlFor="meta-url" className="block mb-1 font-medium text-gray-800">
            Canonical URL
          </label>
          <input
            id="meta-url"
            type="url"
            value={url}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
            placeholder="https://gearizen.com/your-page"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Social Preview Image */}
        <div>
          <label htmlFor="meta-image" className="block mb-1 font-medium text-gray-800">
            Social Preview Image URL
          </label>
          <input
            id="meta-image"
            type="url"
            value={image}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setImage(e.target.value)}
            placeholder="https://gearizen.com/og-placeholder.svg"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Twitter Card Type */}
        <div>
          <span className="block mb-1 font-medium text-gray-800">Twitter Card Type</span>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="twitterCard"
                value="summary_large_image"
                checked={twitterCard === "summary_large_image"}
                onChange={() => setTwitterCard("summary_large_image")}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-700">Large Image</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="twitterCard"
                value="summary"
                checked={twitterCard === "summary"}
                onChange={() => setTwitterCard("summary")}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-700">Text Only</span>
            </label>
          </div>
        </div>

        {/* Copy Button */}
        <div className="text-center">
          <button
            onClick={handleCopy}
            disabled={!title && !description && !url && !image && !keywords}
            className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium disabled:opacity-60"
          >
            Copy Meta Tags
          </button>
        </div>
      </div>

      {/* Generated Output */}
      <div className="mt-12 max-w-3xl mx-auto">
        <label htmlFor="meta-output" className="sr-only">Generated meta tags</label>
        <textarea
          id="meta-output"
          readOnly
          value={generateMetaTags()}
          rows={10}
          className="w-full font-mono text-sm p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>
    </section>
  );
}