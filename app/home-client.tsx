// app/(home)/home-client.tsx
"use client";

import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import { getHomeData } from "@/lib/home-data";

export default function HomeClient() {
  const { hero, features } = getHomeData();

  return (
    <div className="space-y-20 text-gray-900 antialiased">
      {/* Hero Section */}
      <section aria-labelledby="home-hero-heading" className="text-center space-y-6">
        <h1
          id="home-hero-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight
          "
        >
          {hero.title}
        </h1>

        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />

        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          {hero.subHeadline}
        </p>

        <Link
          href={hero.ctaHref}
          className="
            inline-block
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-white text-base sm:text-lg font-medium
            px-6 py-3 rounded-full
            transition transform hover:scale-105
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed] focus-visible:ring-offset-2
          "
        >
          {hero.ctaLabel}
        </Link>
      </section>

      {/* Featured & Essential Tools */}
      <section aria-labelledby="home-tools-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
          <div>
            <h2 id="home-tools-heading" className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Featured &amp; Essential Tools
            </h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          </div>
          <Link
            href="/tools"
            className="
              mt-4 sm:mt-0
              text-[#7c3aed] hover:text-[#8b5cf6]
              font-medium
              transition transform hover:scale-105
            "
          >
            Browse All Tools &rarr;
          </Link>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {features.map((tool) => (
            <li key={tool.href} className="list-none">
              <ToolCard {...tool} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}