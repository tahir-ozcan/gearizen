// app/about/about-client.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import type { AboutBlock } from "@/lib/about-data";

export default function AboutClient({ blocks }: { blocks: AboutBlock[] }) {
  return (
    <div className="space-y-20 text-gray-900 antialiased">
      {/* Hero Section */}
      {blocks
        .filter((b) => b.type === "hero")
        .map((block) => (
          <section
            key="hero"
            aria-labelledby="about-hero-heading"
            className="text-center space-y-6 sm:px-0"
          >
            <h1
              id="about-hero-heading"
              className="
                bg-clip-text text-transparent
                bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
                text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
              "
            >
              {block.heading}
            </h1>
            <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
            <div className="mx-auto max-w-2xl space-y-4 text-base sm:text-lg leading-relaxed text-gray-700">
              {block.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}

      {/* Bullets Section */}
      {blocks
        .filter((b) => b.type === "bullets")
        .map((block) => (
          <section
            key="bullets"
            aria-labelledby="about-bullets-heading"
            className="space-y-6 sm:px-0"
          >
            <div className="max-w-2xl mx-auto">
              <h2
                id="about-bullets-heading"
                className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight"
              >
                {block.heading}
              </h2>
              <div className="mt-1 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
            </div>
            <ul className="max-w-2xl mx-auto mt-4 space-y-4 text-base sm:text-lg leading-relaxed text-gray-700">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start">
                  <Check className="mt-1 mr-3 h-5 w-5 text-indigo-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

      {/* Team Section */}
      {blocks
        .filter((b) => b.type === "team")
        .map((block) => (
          <section
            key="team"
            aria-labelledby="about-team-heading"
            className="space-y-6 sm:px-0"
          >
            <div className="max-w-2xl mx-auto">
              <h2
                id="about-team-heading"
                className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight"
              >
                {block.heading}
              </h2>
              <div className="mt-1 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
            </div>
            <ul
              role="list"
              className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {block.members.map((m) => (
                <li
                  key={m.name}
                  className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg"
                >
                  <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-indigo-50">
                    <Image
                      src={m.avatar}
                      alt={`${m.name} avatar`}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{m.name}</h3>
                  <p className="mt-1 text-sm text-indigo-600">{m.role}</p>
                  <p className="mt-2 text-center text-gray-700 text-sm">{m.bio}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}

      {/* CTA Section */}
      {blocks
        .filter((b) => b.type === "cta")
        .map((block) => (
          <section
            key="cta"
            aria-labelledby="about-cta-heading"
            className="text-center px-4 sm:px-0"
          >
            <h2 id="about-cta-heading" className="sr-only">
              Call to Action
            </h2>
            <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-gray-700">
              {block.text}{" "}
              <Link
                href={block.href}
                className="text-[#7c3aed] hover:text-[#8b5cf6] underline transition-colors"
                aria-label={`Go to ${block.linkText}`}
              >
                {block.linkText}
              </Link>
              .
            </p>
          </section>
        ))}
    </div>
  );
}