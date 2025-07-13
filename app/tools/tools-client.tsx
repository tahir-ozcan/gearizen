// app/tools/tools-client.tsx
"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Input from "@/components/Input";
import ToolCard from "@/components/ToolCard";
import { getToolsData, Tool } from "@/lib/tools-data";

export default function ToolsClient() {
  const { tools } = getToolsData();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filtered = query
    ? tools.filter(
        ({ title, description }) =>
          title.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query)
      )
    : tools;

  return (
    <div className="space-y-20 text-gray-900 antialiased">
      {/* Hero + Search */}
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

        {/* Decorative underline */}
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />

        <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-700 leading-relaxed">
          Explore our full suite of client-side utilities—generators, converters,
          compressors, formatters, validators, and more. 100% free, no signup
          required.
        </p>

        {/* Search Input */}
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
          <h2
            className="text-2xl sm:text-3xl font-semibold text-gray-800"
          >
            {query ? `Results for “${search}”` : "Available Tools"}
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-600">
            No tools found{query ? ` for “${search}”` : ""}.
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