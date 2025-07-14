// app/tools/sitemap-generator/sitemap-generator-client.tsx
"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { ClipboardCopy, Download } from "lucide-react";

/**
 * Sitemap Generator Tool
 *
 * Create XML sitemaps with unlimited URLs, customizable changefreq and priority—improve SEO indexing fast.
 */
export default function SitemapGeneratorClient() {
  // State
  const [input, setInput] = useState<string>(
    `https://example.com/\nhttps://example.com/about\nhttps://example.com/contact`
  );
  const [changeFreq, setChangeFreq] = useState<
    "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  >("daily");
  const [priority, setPriority] = useState<number>(0.5);
  const [output, setOutput] = useState<string>("");

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Re-generate whenever input, changeFreq, or priority change
  useEffect(() => {
    const lines = input.split(/\r?\n/).filter(u => u.trim());
    const today = new Date().toISOString().split("T")[0];
    const entries = lines
      .map(u => `
  <url>
    <loc>${u.trim()}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`)
      .join("");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}
</urlset>`;
    setOutput(xml);
  }, [input, changeFreq, priority]);

  // Handlers
  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  function handleChangeFreq(e: ChangeEvent<HTMLSelectElement>) {
    setChangeFreq(
      e.target.value as
        | "always"
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly"
        | "yearly"
        | "never"
    );
  }

  function handlePriority(e: ChangeEvent<HTMLInputElement>) {
    setPriority(parseFloat(e.target.value));
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Sitemap XML copied!");
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
      <div className="text-center space-y-4 sm:px-0">
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
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Paste one URL per line to generate a standards-compliant XML sitemap with custom change frequency and priority—copy or download instantly, all client-side.
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:px-0">
        <div>
          <label
            htmlFor="changefreq"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Change Frequency
          </label>
          <select
            id="changefreq"
            value={changeFreq}
            onChange={handleChangeFreq}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition"
          >
            <option value="always">always</option>
            <option value="hourly">hourly</option>
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
            <option value="monthly">monthly</option>
            <option value="yearly">yearly</option>
            <option value="never">never</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Priority: <span className="font-semibold">{priority.toFixed(1)}</span>
          </label>
          <input
            id="priority"
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={priority}
            onChange={handlePriority}
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="sitemap-input"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            URLs (one per line)
          </label>
          <textarea
            id="sitemap-input"
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            rows={6}
            placeholder="https://example.com/page1"
            className="
              w-full p-4 border border-gray-300 rounded-md bg-white
              focus:ring-2 focus:ring-[#7c3aed] focus:border-indigo-300
              font-mono resize-y transition
            "
          />
        </div>
      </div>

      {/* Generated Sitemap & Actions */}
      <div className="max-w-3xl mx-auto space-y-4 sm:px-0">
        <label
          htmlFor="sitemap-output"
          className="block text-sm font-medium text-gray-800"
        >
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
              focus:ring-2 focus:ring-[#7c3aed] focus:border-indigo-300
              font-mono resize-y transition
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