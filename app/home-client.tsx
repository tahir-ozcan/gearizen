// app/(home)/HomeClient.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SearchIcon } from "@heroicons/react/24/outline";
import Input from "@/components/Input";
import ToolCard from "@/components/ToolCard";
import { getHomeData } from "@/lib/home-data";

export default function HomeClient() {
  const { hero, features } = getHomeData();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(features);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    setFiltered(
      features.filter(
        ({ title, description }) =>
          title.toLowerCase().includes(q) ||
          description.toLowerCase().includes(q)
      )
    );
  }, [search, features]);

  // Burada dilediğin küresel popüler araçları seçebilirsin.
  // Şimdilik ilk 4 özelliği alıyoruz:
  const popularTools = features.slice(0, 4);
  const displayTools = search.trim() ? filtered : popularTools;

  return (
    <main
      id="main-content"
      aria-labelledby="home-hero-heading"
      className="container-responsive py-20 space-y-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      {/* Hero */}
      <section
        aria-labelledby="home-hero-heading"
        className="mx-auto max-w-3xl text-center space-y-6"
      >
        <h1
          id="home-hero-heading"
          className="gradient-text text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
        >
          {hero.title}
        </h1>
        <p className="mx-auto mt-4 text-lg leading-relaxed text-gray-700 sm:text-xl">
          {hero.subHeadline}
        </p>

        {/* Search */}
        <div className="relative mt-8 w-full max-w-md mx-auto">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            id="home-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            aria-label="Search tools"
            className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
          />
        </div>

        {/* All Tools Button */}
        <Link
          href="/tools"
          className="inline-block mt-6 rounded-full bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 transition"
        >
          Discover All Tools
        </Link>
      </section>

      {/* Popular & Essential Tools */}
      <section aria-labelledby="home-tools-heading">
        <div className="flex items-center justify-between">
          <h2
            id="home-tools-heading"
            className="text-2xl font-semibold text-gray-800"
          >
            Popular &amp; Essential Tools
          </h2>
          <Link
            href="/tools"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All Tools &rarr;
          </Link>
        </div>

        {displayTools.length === 0 ? (
          <p className="mt-8 text-center text-gray-600">No tools found.</p>
        ) : (
          <ul className="mt-8 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayTools.map((tool) => (
              <li key={tool.href}>
                <ToolCard {...tool} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
