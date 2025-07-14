// app/tools/tools-client.tsx
"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Input from "@/components/Input";
import ToolCard from "@/components/ToolCard";
import { getToolsData, Tool } from "@/lib/tools-data";

export default function ToolsClient() {
  const { tools } = getToolsData();

  // Build a sorted, de-duped category list, with an "All" option up front
  const categories = ["All", ...Array.from(new Set(tools.map((t) => t.category))).sort()];

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const query = search.trim().toLowerCase();

  // Filter by BOTH category and search text
  const filtered = tools.filter((tool) => {
    const inCategory =
      selectedCategory === "All" || tool.category === selectedCategory;
    const inText =
      !query ||
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query);
    return inCategory && inText;
  });

  return (
    <div className="space-y-20 text-gray-900 antialiased">
      {/* Hero + Category Chips + Search */}
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

        <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-700 leading-relaxed">
          Explore our suite of {tools.length} privacy-first, client-side utilities—everything from generators to converters, formatters and optimizers.
        </p>

        {/* Category Chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-1 rounded-full text-sm font-medium transition
                ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Box */}
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
                focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]
                transition ease-in-out duration-200
              "
            />
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="space-y-6 sm:px-0">
        <div className="flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            {query || selectedCategory !== "All"
              ? `Showing ${filtered.length} ${filtered.length === 1 ? "tool" : "tools"}`
              : "Browse All Tools"}
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-600">
            No tools found
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
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