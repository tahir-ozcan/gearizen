// app/tools/tools-client.tsx

"use client";

import { useState } from "react";
import ToolCard from "@/components/ToolCard";

interface Tool {
  href: string;
  icon: string;
  title: string;
  description: string;
}

const tools: Tool[] = [
  {
    href: "/tools/password-generator",
    icon: "Key",
    title: "Password Generator",
    description:
      "Generate strong, secure passwords with customizable length and character sets.",
  },
  {
    href: "/tools/json-formatter",
    icon: "Code",
    title: "JSON Formatter",
    description: "Validate, beautify, or minify JSON entirely in your browser.",
  },
  {
    href: "/tools/qr-code-generator",
    icon: "QrCode",
    title: "QR Code Generator",
    description: "Produce QR codes for URLs, text, contacts, and more.",
  },
  {
    href: "/tools/unit-converter",
    icon: "ArrowRightLeft",
    title: "Unit Converter",
    description:
      "Convert between metric and imperial units: length, weight, volume, and more.",
  },
  {
    href: "/tools/image-compressor",
    icon: "ImageIcon",
    title: "Image Compressor",
    description:
      "Reduce JPEG or PNG file sizes while preserving visual quality.",
  },
  {
    href: "/tools/color-contrast-checker",
    icon: "Eye",
    title: "Contrast Checker",
    description: "Ensure your text meets WCAG accessibility contrast ratios.",
  },
  {
    href: "/tools/color-converter",
    icon: "Palette",
    title: "Color Converter",
    description: "Convert colors between HEX, RGB and HSL with preview.",
  },
  {
    href: "/tools/color-palette-generator",
    icon: "Palette",
    title: "Color Palette Generator",
    description: "Create harmonious color schemes from any base color.",
  },
  {
    href: "/tools/base64-encoder-decoder",
    icon: "Paperclip",
    title: "Base64 Encoder/Decoder",
    description: "Encode or decode text and files to Base64 format rapidly.",
  },
  {
    href: "/tools/code-minifier",
    icon: "Cpu",
    title: "Code Minifier",
    description: "Minify HTML, CSS, and JavaScript to boost page load speeds.",
  },
  {
    href: "/tools/regex-tester",
    icon: "Scissors",
    title: "Regex Tester",
    description:
      "Build and debug regular expressions with real-time match highlighting.",
  },
  {
    href: "/tools/text-diff",
    icon: "FileText",
    title: "Text Diff Checker",
    description:
      "Compare two blocks of text and highlight additions, deletions, and changes.",
  },
  {
    href: "/tools/unix-timestamp-converter",
    icon: "CalendarCheck2",
    title: "Timestamp Converter",
    description: "Convert UNIX timestamps to human-readable dates and back.",
  },
  {
    href: "/tools/pdf-compressor",
    icon: "FileArchive",
    title: "PDF Compressor",
    description:
      "Compress PDFs client-side to reduce file size without losing clarity.",
  },
  {
    href: "/tools/pdf-to-word",
    icon: "FilePlus",
    title: "PDF → Word Converter",
    description:
      "Extract text from PDFs and download as Word-compatible DOC files.",
  },
  {
    href: "/tools/image-resizer",
    icon: "FileDown",
    title: "Image Resizer",
    description:
      "Resize images, maintain or override aspect ratio, then download.",
  },
  {
    href: "/tools/csv-to-json",
    icon: "File",
    title: "CSV → JSON Converter",
    description:
      "Transform CSV data into JSON arrays quickly, entirely in-browser.",
  },
  {
    href: "/tools/html-to-pdf",
    icon: "Globe",
    title: "HTML → PDF Converter",
    description:
      "Render HTML pages as PDFs completely client-side, no server needed.",
  },
  {
    href: "/tools/html-formatter",
    icon: "MessageSquare",
    title: "HTML Formatter",
    description: "Beautify or minify HTML code for readability or compactness.",
  },
  {
    href: "/tools/css-formatter",
    icon: "Paintbrush",
    title: "CSS Formatter",
    description:
      "Beautify or minify CSS stylesheets instantly in your browser.",
  },
  {
    href: "/tools/seo-meta-tag-generator",
    icon: "Tag",
    title: "SEO Meta Tag Generator",
    description:
      "Generate optimized `<title>`, `<meta>` and social tags for any page.",
  },
  {
    href: "/tools/jwt-decoder",
    icon: "Shield",
    title: "JWT Decoder",
    description:
      "Decode and inspect JWT header, payload & signature client-side.",
  },
  {
    href: "/tools/bcrypt-generator",
    icon: "FileKey",
    title: "bcrypt Hash Generator",
    description:
      "Generate bcrypt hashes for passwords with adjustable salt rounds.",
  },
  {
    href: "/tools/image-to-base64",
    icon: "ImagePlus",
    title: "Image → Base64",
    description: "Turn images into Base64 data URIs in-browser.",
  },
  {
    href: "/tools/markdown-converter",
    icon: "BookOpen",
    title: "Markdown Converter",
    description: "Edit Markdown, preview live, and copy clean HTML.",
  },
  {
    href: "/tools/uuid-generator",
    icon: "Fingerprint",
    title: "UUID Generator",
    description: "Create RFC4122 UUIDs instantly.",
  },
  {
    href: "/tools/lorem-ipsum-generator",
    icon: "AlignLeft",
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text paragraphs.",
  },
  {
    href: "/tools/text-counter",
    icon: "Type",
    title: "Word & Character Counter",
    description: "Count words and characters in any text.",
  },
  {
    href: "/tools/text-sorter",
    icon: "ListOrdered",
    title: "Text Sorter",
    description: "Sort lines alphabetically and remove duplicates.",
  },
  {
    href: "/tools/url-encoder-decoder",
    icon: "Link",
    title: "URL Encoder/Decoder",
    description: "Encode or decode URLs and query strings.",
  },
  {
    href: "/tools/html-entity-encoder-decoder",
    icon: "Ampersand",
    title: "HTML Entity Encoder/Decoder",
    description: "Convert characters to HTML entities or decode them back.",
  },
  {
    href: "/tools/slug-generator",
    icon: "Link2",
    title: "URL Slug Generator",
    description: "Slugify text into SEO-friendly URLs quickly.",
  },
  {
    href: "/tools/url-parser",
    icon: "Search",
    title: "URL Parser",
    description:
      "Break down URLs to view protocol, host, path and query parameters.",
  },
  {
    href: "/tools/base-converter",
    icon: "Calculator",
    title: "Number Base Converter",
    description: "Convert numbers between binary, decimal, hex and more.",
  },
  {
    href: "/tools/sha-hash-generator",
    icon: "Hash",
    title: "Hash Generator",
    description: "Create SHA-256, SHA-1 or MD5 hashes for any text.",
  },
  {
    href: "/tools/yaml-json-converter",
    icon: "Braces",
    title: "YAML ⇄ JSON Converter",
    description: "Convert YAML to JSON or JSON to YAML in-browser.",
  },
  {
    href: "/tools/text-case-converter",
    icon: "Type",
    title: "Text Case Converter",
    description: "Convert text between upper, lower, camel, snake and more.",
  },
  {
    href: "/tools/caesar-cipher",
    icon: "RotateCcw",
    title: "Caesar Cipher",
    description: "Encrypt or decrypt text with a custom shift value.",
  },
  {
    href: "/tools/morse-code-converter",
    icon: "Radio",
    title: "Morse Code Converter",
    description: "Translate text to and from Morse code instantly.",
  },
  {
    href: "/tools/xml-formatter",
    icon: "FileCode",
    title: "XML Formatter",
    description: "Beautify or minify XML documents instantly.",
  },
];

export default function ToolsClient() {
  const [search, setSearch] = useState("");
  const filteredTools = tools.filter(
    ({ title, description }) =>
      title.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section
      id="all-tools"
      aria-labelledby="all-tools-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900 space-y-12"
    >
      {/* Hero */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Free Online Tools
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
          Gearizen offers 100% client-side utilities—generators, converters,
          compressors, formatters, validators, and more—all free and no signup
          required.
        </p>
      </header>

      {/* Search */}
      <form
        role="search"
        className="max-w-md mx-auto"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="tool-search" className="sr-only">
          Search tools
        </label>
        <input
          id="tool-search"
          type="search"
          aria-label="Search tools"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools..."
          className="input-base"
        />
      </form>

      {/* Grid */}
      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="sr-only">
          All Tools
        </h2>
        <ul className="grid auto-rows-fr gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTools.map(({ href, icon, title, description }) => (
            <ToolCard
              key={href}
              href={href}
              icon={icon}
              title={title}
              description={description}
              className="group"
            />
          ))}
        </ul>
      </section>
    </section>
  );
}
