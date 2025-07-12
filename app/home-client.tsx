"use client";

import { useState } from "react";
import Link from "next/link";
import CardLink from "@/components/CardLink";
import Input from "@/components/Input";
import {
  Key,
  FilePlus,
  QrCode,
  ArrowRightLeft,
  ImageIcon,
  HelpCircle,
} from "lucide-react";

interface ToolCard {
  href: string;
  icon: JSX.Element;
  title: string;
  description: string;
}

const popularTools: ToolCard[] = [
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
    icon: <ArrowRightLeft aria-hidden="true" className="w-10 h-10 text-indigo-600" />,
    title: "Unit Converter",
    description: "Convert between metric and imperial units easily.",
  },
  {
    href: "/tools/image-compressor",
    icon: <ImageIcon aria-hidden="true" className="w-10 h-10 text-indigo-600" />,
    title: "Image Compressor",
    description: "Reduce image file sizes while preserving quality.",
  },
];

export default function HomeClient() {
  const [search, setSearch] = useState("");

  const filteredTools = popularTools.filter(({ title, description }) =>
    title.toLowerCase().includes(search.toLowerCase()) ||
    description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-20">
      {/* Hero */}
      <header aria-labelledby="hero-heading" className="text-center space-y-6 pt-12">
        <h1 id="hero-heading" className="gradient-text text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
          Gearizen
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-700 max-w-2xl mx-auto font-medium">
          Free, privacy-first web tools for developers and creators.
        </h2>
        <Link
          href="/tools"
          className="btn-primary inline-block mt-6 px-8 py-3 text-lg"
        >
          Get Started
        </Link>
      </header>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <label htmlFor="home-tool-search" className="sr-only">
          Search popular tools
        </label>
        <Input
          id="home-tool-search"
          type="search"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="placeholder-gray-500"
        />
      </div>

      {/* Popular Tools */}
      <section aria-labelledby="tools-heading" className="space-y-8">
        <h2 id="tools-heading" className="text-2xl font-semibold text-center">
          Popular &amp; Essential Tools
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTools.map(({ href, icon, title, description }) => (
            <li key={href} className="list-none h-full">
              <CardLink
                href={href}
                aria-label={`Navigate to ${title}`}
                className="group flex flex-col h-full"
              >
                <div className="mb-6 flex items-center justify-center">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center group-hover:text-indigo-600 transition-colors">
                  {title}
                </h3>
                <p className="text-gray-600 text-center flex-grow">
                  {description}
                </p>
              </CardLink>
            </li>
          ))}
          {/* Suggest a Tool */}
          <li className="list-none h-full">
            <CardLink
              href="/contact"
              aria-label="Suggest a tool to the Gearizen team"
              className="group flex flex-col items-center justify-center border-dashed border-gray-300 text-center"
            >
              <HelpCircle aria-hidden="true" className="w-10 h-10 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Suggest a Tool</h3>
              <p className="text-gray-500 max-w-xs">Have an idea? Let us know what tool you’d like to see next.</p>
            </CardLink>
          </li>
        </ul>
      </section>
    </div>
  );
}

