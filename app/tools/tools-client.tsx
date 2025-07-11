// app/tools/tools-client.tsx

"use client";

import CardLink from "@/components/CardLink";
import { useState } from "react";
import {
  Key,
  Code,
  QrCode,
  ArrowRightLeft,
  ImageIcon,
  Eye,
  Paperclip,
  Cpu,
  FileCode,
  Scissors,
  CalendarCheck2,
  FileText,
  FileKey,
  File,
  FilePlus,
  FileDown,
  FileArchive,
  MessageSquare,
  Tag,
  Globe,
  Shield,
  ImagePlus,
  BookOpen,
  Fingerprint,
  AlignLeft,
  Type,
  Link as LinkIcon,
  Hash,
  Braces,
  Calculator,
  Palette,
  ListOrdered,
  Link2,
} from "lucide-react";

interface Tool {
  href: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const tools: Tool[] = [
  {
    href: "/tools/password-generator",
    Icon: Key,
    title: "Password Generator",
    description:
      "Generate strong, secure passwords with customizable length and character sets.",
  },
  {
    href: "/tools/json-formatter",
    Icon: Code,
    title: "JSON Formatter",
    description: "Validate, beautify, or minify JSON entirely in your browser.",
  },
  {
    href: "/tools/qr-code-generator",
    Icon: QrCode,
    title: "QR Code Generator",
    description: "Produce QR codes for URLs, text, contacts, and more.",
  },
  {
    href: "/tools/unit-converter",
    Icon: ArrowRightLeft,
    title: "Unit Converter",
    description:
      "Convert between metric and imperial units: length, weight, volume, and more.",
  },
  {
    href: "/tools/image-compressor",
    Icon: ImageIcon,
    title: "Image Compressor",
    description:
      "Reduce JPEG or PNG file sizes while preserving visual quality.",
  },
  {
    href: "/tools/color-contrast-checker",
    Icon: Eye,
    title: "Contrast Checker",
    description: "Ensure your text meets WCAG accessibility contrast ratios.",
  },
  {
    href: "/tools/color-converter",
    Icon: Palette,
    title: "Color Converter",
    description: "Convert colors between HEX, RGB and HSL with preview.",
  },
  {
    href: "/tools/base64-encoder-decoder",
    Icon: Paperclip,
    title: "Base64 Encoder/Decoder",
    description: "Encode or decode text and files to Base64 format rapidly.",
  },
  {
    href: "/tools/code-minifier",
    Icon: Cpu,
    title: "Code Minifier",
    description: "Minify HTML, CSS, and JavaScript to boost page load speeds.",
  },
  {
    href: "/tools/regex-tester",
    Icon: Scissors,
    title: "Regex Tester",
    description:
      "Build and debug regular expressions with real-time match highlighting.",
  },
  {
    href: "/tools/text-diff",
    Icon: FileText,
    title: "Text Diff Checker",
    description:
      "Compare two blocks of text and highlight additions, deletions, and changes.",
  },
  {
    href: "/tools/unix-timestamp-converter",
    Icon: CalendarCheck2,
    title: "Timestamp Converter",
    description: "Convert UNIX timestamps to human-readable dates and back.",
  },
  {
    href: "/tools/pdf-compressor",
    Icon: FileArchive,
    title: "PDF Compressor",
    description:
      "Compress PDFs client-side to reduce file size without losing clarity.",
  },
  {
    href: "/tools/pdf-to-word",
    Icon: FilePlus,
    title: "PDF → Word Converter",
    description:
      "Extract text from PDFs and download as Word-compatible DOC files.",
  },
  {
    href: "/tools/image-resizer",
    Icon: FileDown,
    title: "Image Resizer",
    description:
      "Resize images, maintain or override aspect ratio, then download.",
  },
  {
    href: "/tools/csv-to-json",
    Icon: File,
    title: "CSV → JSON Converter",
    description:
      "Transform CSV data into JSON arrays quickly, entirely in-browser.",
  },
  {
    href: "/tools/html-to-pdf",
    Icon: Globe,
    title: "HTML → PDF Converter",
    description:
      "Render HTML pages as PDFs completely client-side, no server needed.",
  },
  {
    href: "/tools/html-formatter",
    Icon: MessageSquare,
    title: "HTML Formatter",
    description: "Beautify or minify HTML code for readability or compactness.",
  },
  {
    href: "/tools/seo-meta-tag-generator",
    Icon: Tag,
    title: "SEO Meta Tag Generator",
    description:
      "Generate optimized `<title>`, `<meta>` and social tags for any page.",
  },
  {
    href: "/tools/jwt-decoder",
    Icon: Shield,
    title: "JWT Decoder",
    description:
      "Decode and inspect JWT header, payload & signature client-side.",
  },
  {
    href: "/tools/bcrypt-generator",
    Icon: FileKey,
    title: "bcrypt Hash Generator",
    description:
      "Generate bcrypt hashes for passwords with adjustable salt rounds.",
  },
  {
    href: "/tools/image-to-base64",
    Icon: ImagePlus,
    title: "Image → Base64",
    description: "Turn images into Base64 data URIs in-browser.",
  },
  {
    href: "/tools/markdown-converter",
    Icon: BookOpen,
    title: "Markdown Converter",
    description: "Edit Markdown, preview live, and copy clean HTML.",
  },
  {
    href: "/tools/uuid-generator",
    Icon: Fingerprint,
    title: "UUID Generator",
    description: "Create RFC4122 UUIDs instantly.",
  },
  {
    href: "/tools/lorem-ipsum-generator",
    Icon: AlignLeft,
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text paragraphs.",
  },
  {
    href: "/tools/text-counter",
    Icon: Type,
    title: "Word & Character Counter",
    description: "Count words and characters in any text.",
  },
  {
    href: "/tools/text-sorter",
    Icon: ListOrdered,
    title: "Text Sorter",
    description: "Sort lines alphabetically and remove duplicates.",
  },
  {
    href: "/tools/url-encoder-decoder",
    Icon: LinkIcon,
    title: "URL Encoder/Decoder",
    description: "Encode or decode URLs and query strings.",
  },
  {
    href: "/tools/slug-generator",
    Icon: Link2,
    title: "URL Slug Generator",
    description: "Slugify text into SEO-friendly URLs quickly.",
  },
  {
    href: "/tools/base-converter",
    Icon: Calculator,
    title: "Number Base Converter",
    description: "Convert numbers between binary, decimal, hex and more.",
  },
  {
    href: "/tools/sha-hash-generator",
    Icon: Hash,
    title: "Hash Generator",
    description: "Create SHA-256, SHA-1 or MD5 hashes for any text.",
  },
  {
    href: "/tools/yaml-json-converter",
    Icon: Braces,
    title: "YAML ⇄ JSON Converter",
    description: "Convert YAML to JSON or JSON to YAML in-browser.",
  },
  {
    href: "/tools/text-case-converter",
    Icon: Type,
    title: "Text Case Converter",
    description: "Convert text between upper, lower, camel, snake and more.",
  },
  {
    href: "/tools/xml-formatter",
    Icon: FileCode,
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
      <div className="max-w-md mx-auto">
        <label htmlFor="tool-search" className="sr-only">
          Search tools
        </label>
        <input
          id="tool-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Grid */}
      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="sr-only">
          All Tools
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTools.map(({ href, Icon, title, description }) => (
            <li key={href} className="list-none">
              <CardLink
                href={href}
                aria-label={`Navigate to ${title}`}
                className="group flex flex-col h-full"
              >
                <Icon
                  className="w-10 h-10 text-indigo-600 mx-auto mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-semibold mb-2 text-center group-hover:text-indigo-600 transition-colors">
                  {title}
                </h3>
                <p className="text-gray-600 text-center flex-grow">
                  {description}
                </p>
              </CardLink>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
