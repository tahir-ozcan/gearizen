// app/tools/tools-client.tsx
"use client";

import { useState, type FC, type SVGProps } from "react";
// Arama ve reset ikonları için Heroicons
import {
  MagnifyingGlassIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
// Kategori ikonları için lucide-react
import {
  Key,
  ArrowRightLeft,
  Code,
  Tag,
  Braces,
  Paperclip,
  Shield,
  Palette,
  Calculator,
  FileText,
  Scissors,
  Droplet,
} from "lucide-react";

import Input from "@/components/Input";
import ToolCard from "@/components/ToolCard";
import { getToolsData, type Tool } from "@/lib/tools-data";

export default function ToolsClient() {
  const { tools } = getToolsData();

  // İkon eşleştirmesi yapılan kategoriler
  const iconMap: Record<string, FC<SVGProps<SVGSVGElement>>> = {
    Generators: Key,
    Converters: ArrowRightLeft,
    Formatters: Code,
    SEO: Tag,
    Transformers: Braces,
    Encoders: Paperclip,
    Security: Shield,
    Design: Palette,
    Analytics: Calculator,
    Compare: FileText,
    Testers: Scissors,
    Optimizers: Droplet,
  };

  // Tüm benzersiz kategorileri al, alfabetik sırala
  const rawCategories = Array.from(new Set(tools.map((t) => t.category))).sort();

  // "All Tools" ögesi ve sonrasında gerçek kategoriler
  const categories = ["All Tools", ...rawCategories];

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Tools");

  const query = search.trim().toLowerCase();

  // Hem kategori hem arama terimine göre filtrele
  const filtered = tools.filter((tool) => {
    const inCategory =
      selectedCategory === "All Tools" || tool.category === selectedCategory;
    const inText =
      !query ||
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query);
    return inCategory && inText;
  });

  return (
    <div className="space-y-20 text-gray-900 antialiased">
      {/* Hero + Kategori Seçimi + Arama */}
      <section
        aria-labelledby="all-tools-heading"
        className="text-center space-y-6 sm:px-0"
      >
        <h1
          id="all-tools-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          All Gearizen Tools
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Explore our suite of {tools.length} privacy-first, client-side utilities—everything from generators to converters, formatters and optimizers.
        </p>

        {/* Kategori Butonları */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => {
            const Icon = iconMap[cat] ?? ArrowsRightLeftIcon;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  flex items-center px-5 py-2 rounded-full text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24] text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-[#7c3aed] hover:via-[#ec4899] hover:to-[#fbbf24] hover:text-white"
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-2" />
                {cat}
              </button>
            );
          })}

          {/* Filtreyi Sıfırla */}
          {selectedCategory !== "All Tools" && (
            <button
              onClick={() => setSelectedCategory("All Tools")}
              aria-label="Reset category filter"
              className="flex items-center px-4 py-2 rounded-full text-sm text-gray-500 bg-gray-50 hover:bg-gray-200 transition"
            >
              <ArrowsRightLeftIcon className="h-4 w-4 mr-1" />
              Reset
            </button>
          )}
        </div>

        {/* Arama Kutusu */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-lg">
            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <Input
              id="tool-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools…"
              aria-label="Search tools"
              className="
                pl-12 pr-4 py-3 w-full bg-white rounded-full
                border border-gray-300 shadow-sm
                focus:ring-2 focus:border-[#7c3aed]/50 focus:border-[#7c3aed]
                transition ease-in-out duration-200
              "
            />
          </div>
        </div>
      </section>

      {/* Sonuçlar */}
      <section className="space-y-6 sm:px-0">
        <div className="flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            {query || selectedCategory !== "All Tools"
              ? `Showing ${filtered.length} ${filtered.length === 1 ? "tool" : "tools"}`
              : "Browse All Tools"}
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-600">
            No tools found
            {selectedCategory !== "All Tools" && ` in ${selectedCategory}`}
            {query && ` for “${search}”`}.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((tool: Tool) => (
              <li key={tool.href} className="list-none">
                <ToolCard {...tool} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}