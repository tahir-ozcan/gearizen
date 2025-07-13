// app/(home)/HomeClient.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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

  // İlk 4 aracı "popüler" olarak alıyoruz
  const popularTools = features.slice(0, 4);
  // Arama varsa filtreleneni yoksa popüleri göster
  const displayTools = search.trim() ? filtered : popularTools;

  return (
    <main
      id="main-content"
      aria-labelledby="home-hero-heading"
      className="container-responsive py-20 space-y-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      {/* Hero */}
      <section
        aria-labelledby="home-hero-heading"
        className="mx-auto max-w-3xl text-center space-y-8"
      >
        <h1
          id="home-hero-heading"
          className="gradient-text text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
        >
          {hero.title}
        </h1>
        <p className="mx-auto mt-2 text-lg leading-relaxed text-gray-700 sm:text-xl">
          {hero.subHeadline}
        </p>

        {/* Search + Discover All Tools */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="relative w-full max-w-md">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              id="home-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools..."
              aria-label="Search tools"
              className="pl-12 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
            />
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 transition"
          >
            Discover All Tools
          </Link>
        </div>
      </section>

      {/* Popular & Essential Tools */}
      <section aria-labelledby="home-tools-heading" className="space-y-8">
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
          <p className="mt-4 text-center text-gray-600">No tools found.</p>
        ) : (
          <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayTools.map((tool) => (
              <li key={tool.href} className="list-none">
                <ToolCard {...tool} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}