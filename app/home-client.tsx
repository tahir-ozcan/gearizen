"use client";

import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { HelpCircle } from "lucide-react";
import CardLink from "../components/CardLink";
import { getHomeData } from "../lib/home-data";

const ToolCard = dynamic(() => import("../components/ToolCard"), {
  ssr: false,
  loading: () => (
    <div className="h-48 rounded-2xl bg-gray-100 animate-pulse" aria-hidden="true" />
  ),
});

export default function HomeClient() {
  const { hero, features } = getHomeData();
  return (
    <div className="text-gray-900 selection:bg-indigo-200 selection:text-indigo-900">
      {/* Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className="pt-20 pb-16 text-center"
      >
        <h1
          id="hero-heading"
          className="gradient-text text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          {hero.title}
        </h1>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          {hero.subHeadline}
        </p>
        <Link
          href={hero.ctaHref}
          aria-label={hero.ctaLabel}
          className="mt-8 inline-block bg-indigo-600 text-white font-semibold rounded-full px-8 py-3 shadow-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors"
        >
          {hero.ctaLabel}
        </Link>
      </section>

      {/* Popular Tools */}
      <section aria-labelledby="tools-heading" className="pb-20">
        <h2
          id="tools-heading"
          className="text-3xl sm:text-4xl font-semibold text-gray-800 text-center"
        >
          Popular & Essential Tools
        </h2>
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {features.map((tool) => (
            <li key={tool.href} className="list-none">
              <Suspense fallback={<div className="h-48 rounded-2xl bg-gray-100 animate-pulse" aria-hidden="true" />}> 
                <ToolCard {...tool} />
              </Suspense>
            </li>
          ))}
          <li className="list-none">
            <CardLink
              href="/contact"
              aria-label="Suggest a tool to the Gearizen team"
              className="group flex flex-col items-center justify-center border-dashed border-gray-300 text-center"
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
            </CardLink>
          </li>
        </ul>
      </section>
    </div>
  );
}
