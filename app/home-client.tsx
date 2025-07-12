// app/(home)/HomeClient.tsx
"use client";

import { useState, useEffect } from "react";
import Input from "@/components/Input";
import ToolCard from "@/components/ToolCard";
import { getHomeData } from "@/lib/home-data";

export default function HomeClient() {
  const { hero, features } = getHomeData();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(features);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      features.filter(
        ({ title, description }) =>
          title.toLowerCase().includes(q) ||
          description.toLowerCase().includes(q)
      )
    );
  }, [search, features]);

  return (
    <main
      id="main-content"
      aria-labelledby="home-hero-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900 space-y-16"
    >
      {/* Hero */}
      <section
        aria-labelledby="home-hero-heading"
        className="text-center max-w-3xl mx-auto space-y-6"
      >
        <h1
          id="home-hero-heading"
          className="gradient-text text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight"
        >
          {hero.title}
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-700 leading-relaxed">
          {hero.subHeadline}
        </p>
        <Input
          id="home-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search featured tools..."
          aria-label="Search featured tools"
          className="mt-8 mx-auto max-w-md"
        />
      </section>

      {/* Featured Tools Grid */}
      <section aria-labelledby="home-tools-heading">
        <h2 id="home-tools-heading" className="sr-only">
          Featured Tools
        </h2>
        {filtered.length === 0 ? (
          <p className="text-center text-gray-600">No tools found.</p>
        ) : (
          <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((tool) => (
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
