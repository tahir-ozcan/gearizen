// app/tools/sitemap-generator/sitemap-generator-client.tsx
"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { ClipboardCopy, Download } from "lucide-react";

/**
 * Sitemap Generator Tool
 *
 * Paste a list of URLs (one per line) and instantly generate
 * a standards-compliant XML sitemap. Copy or download the result—
 * 100% client-side, no signup required.
 */
export default function SitemapGeneratorClient() {
  // State
  const [input, setInput] = useState<string>(
    `https://example.com/\nhttps://example.com/about\nhttps://example.com/contact`
  );
  const [output, setOutput] = useState<string>("");

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Utility: build sitemap XML from array of URLs
  function buildSitemap(urls: string[]): string {
    const now = new Date().toISOString().split("T")[0];
    const entries = urls
      .filter((u) => u.trim().length > 0)
      .map((u) => `
  <url>
    <loc>${u.trim()}</loc>
    <lastmod>${now}</lastmod>
  </url>`)
      .join("");
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}
</urlset>`;
  }

  // Regenerate output whenever input changes
  useEffect(() => {
    const lines = input.split(/\r?\n/);
    setOutput(buildSitemap(lines));
  }, [input]);

  // Handlers
  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Sitemap XML copied to clipboard!");
    } catch {
      alert("❌ Copy failed.");
    }
  }

  function downloadSitemap() {
    if (!output) return;
    const blob = new Blob([output], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section
      id="sitemap-generator"
      aria-labelledby="sitemap-generator-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-4">
        <h1
          id="sitemap-generator-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Sitemap Generator
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-700 leading-relaxed">
          Paste one URL per line to generate a valid XML sitemap. Copy or download the XML—
          100% in your browser, no backend needed.
        </p>
      </div>

      {/* Input */}
      <div className="max-w-3xl mx-auto space-y-4 sm:px-0">
        <label htmlFor="sitemap-input" className="block text-sm font-medium text-gray-800 mb-1">
          URLs (one per line)
        </label>
        <textarea
          id="sitemap-input"
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          placeholder="https://example.com/page1"
          rows={6}
          className="
            w-full p-4 border border-gray-300 rounded-md bg-white
            focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
          "
        />
      </div>

      {/* Output & Actions */}
      <div className="max-w-3xl mx-auto space-y-4 sm:px-0">
        <label htmlFor="sitemap-output" className="block text-sm font-medium text-gray-800 mb-1">
          Generated XML Sitemap
        </label>
        <div className="relative">
          <textarea
            id="sitemap-output"
            value={output}
            readOnly
            rows={8}
            className="
              w-full p-4 border border-gray-300 rounded-md bg-gray-50
              focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
            "
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={copyOutput}
              aria-label="Copy XML"
              className="p-2 text-gray-500 hover:text-[#7c3aed] transition"
            >
              <ClipboardCopy className="w-5 h-5" />
            </button>
            <button
              onClick={downloadSitemap}
              aria-label="Download XML"
              className="p-2 text-gray-500 hover:text-[#7c3aed] transition"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}