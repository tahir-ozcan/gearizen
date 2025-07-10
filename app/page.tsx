// app/page.tsx

import Link from "next/link";
import {
  Key,
  FilePlus,
  QrCode,
  ArrowRightLeft,
  ImageIcon,
  HelpCircle,
} from "lucide-react";
import JsonLd from "./components/JsonLd";

export const metadata = {
  title: "Home | Gearizen – Free Client-Side Digital Tools",
  description:
    "Discover Gearizen’s most in-demand, privacy-first web tools: password generator, PDF to Word converter, QR code generator, unit converter and image compressor—100% client-side, no signup required.",
  openGraph: {
    title: "Home | Gearizen – Free Client-Side Digital Tools",
    description:
      "Explore Gearizen’s top tools—passwords, PDF to Word, QR codes, unit conversion and image compression—all privacy-first and signup-free.",
    url: "https://gearizen.com",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Home",
      },
    ],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: "https://gearizen.com/",
  name: "Gearizen",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://gearizen.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const popularTools = [
  {
    href: "/tools/password-generator",
    icon: <Key aria-hidden="true" className="w-10 h-10 text-indigo-600" />,
    title: "Password Generator",
    description: "Generate strong, customizable passwords instantly.",
  },
  {
    href: "/tools/pdf-to-word",
    icon: <FilePlus aria-hidden="true" className="w-10 h-10 text-indigo-600" />,
    title: "PDF → Word Converter",
    description: "Convert PDFs to editable Word documents quickly.",
  },
  {
    href: "/tools/qr-code-generator",
    icon: <QrCode aria-hidden="true" className="w-10 h-10 text-indigo-600" />,
    title: "QR Code Generator",
    description: "Create QR codes for URLs, text, contacts, and more.",
  },
  {
    href: "/tools/unit-converter",
    icon: (
      <ArrowRightLeft
        aria-hidden="true"
        className="w-10 h-10 text-indigo-600"
      />
    ),
    title: "Unit Converter",
    description: "Convert between metric and imperial units easily.",
  },
  {
    href: "/tools/image-compressor",
    icon: (
      <ImageIcon aria-hidden="true" className="w-10 h-10 text-indigo-600" />
    ),
    title: "Image Compressor",
    description: "Reduce image file sizes while preserving quality.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900">
      <JsonLd data={websiteJsonLd} />
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-16 pb-12 text-center"
      >
        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900"
        >
          Gearizen
        </h1>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Free, fast, privacy-first web tools for developers, creators, and
          everyone. No signup, no tracking, 100% client-side.
        </p>
        <Link
          href="/tools"
          className="mt-8 inline-block bg-indigo-600 text-white font-semibold rounded-full px-8 py-3 shadow-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors"
        >
          Discover All Tools
        </Link>
      </section>

      {/* Popular Tools */}
      <section
        aria-labelledby="tools-heading"
        className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-16"
      >
        <h2
          id="tools-heading"
          className="text-3xl sm:text-4xl font-semibold text-gray-800 text-center"
        >
          Popular & Essential Tools
        </h2>

        <ul className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {popularTools.map(({ href, icon, title, description }) => (
            <li key={href} className="list-none">
              <Link
                href={href}
                aria-label={`Navigate to ${title}`}
                className="group flex flex-col h-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
              >
                <div className="mb-6 flex items-center justify-center">
                  {icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center group-hover:text-indigo-600 transition-colors">
                  {title}
                </h3>
                <p className="text-gray-600 flex-grow text-center">
                  {description}
                </p>
              </Link>
            </li>
          ))}

          {/* Suggest a Tool */}
          <li className="list-none">
            <Link
              href="/contact"
              aria-label="Suggest a tool to the Gearizen team"
              className="group flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-2xl p-6 shadow-sm hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors text-center"
            >
              <HelpCircle
                aria-hidden="true"
                className="w-10 h-10 text-gray-400 mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-gray-700">
                Suggest a Tool
              </h3>
              <p className="text-gray-500 max-w-xs">
                Have an idea? Let us know what tool you’d like to see next.
              </p>
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
