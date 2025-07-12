// app/tools/tools-client.tsx

"use client";

import { useState } from "react";
import Input from "@/components/Input";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/lib/tools";

export default function ToolsClient() {
  const [search, setSearch] = useState("");
  const filteredTools = tools.filter(
    ({ title, description }) =>
      title.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main
      id="main-content"
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
      <div className="max-w-md mx-auto" role="search">
        <label htmlFor="tool-search" className="sr-only">
          Search tools
        </label>
        <Input
          id="tool-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools..."
          aria-label="Search tools"
        />
      </div>

      {/* Grid */}
      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="sr-only">
          All Tools
        </h2>
        <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTools.map((tool) => (
            <li key={tool.href} className="list-none">
              <ToolCard {...tool} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
