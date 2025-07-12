// app/about/about-client.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import type { AboutBlock } from "@/lib/aboutData";

export default function AboutClient({ blocks }: { blocks: AboutBlock[] }) {
  return (
    <section
      id="about-gearizen"
      aria-labelledby="about-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      {blocks.map((block) => {
        switch (block.type) {
          case "hero":
            return (
              <article key="hero" className="max-w-3xl mx-auto text-lg leading-relaxed">
                <h1
                  id="about-heading"
                  className="gradient-text text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-center"
                >
                  {block.heading}
                </h1>
                <div className="md:grid md:grid-cols-2 md:gap-8 space-y-6 md:space-y-0">
                  {block.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </article>
            );
          case "bullets":
            return (
              <section key="bullets" className="mt-12">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight text-gray-900 text-center">
                  {block.heading}
                </h2>
                <ul className="max-w-3xl mx-auto space-y-3 text-lg leading-relaxed">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-brand-600 mt-1 mr-2 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          case "team":
            return (
              <section key="team" className="mt-16" aria-labelledby="team-heading">
                <h2
                  id="team-heading"
                  className="text-2xl sm:text-3xl font-semibold mb-6 tracking-tight text-center"
                >
                  {block.heading}
                </h2>
                <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto" role="list">
                  {block.members.map((m) => (
                    <li key={m.name} className="text-center">
                      <Image
                        loader={({ src }) => src}
                        src={m.avatar}
                        alt={`${m.name} avatar`}
                        width={96}
                        height={96}
                        className="mx-auto rounded-full mb-4"
                        loading="lazy"
                        unoptimized
                      />
                      <h3 className="text-xl font-semibold">{m.name}</h3>
                      <p className="text-sm text-gray-600">{m.role}</p>
                      <p className="mt-2 text-sm text-gray-700">{m.bio}</p>
                    </li>
                  ))}
                </ul>
              </section>
            );
          case "cta":
            return (
              <p key="cta" className="text-lg leading-relaxed text-center mt-12">
                {block.text}{" "}
                <Link
                  href={block.href}
                  className="text-indigo-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded transition-colors"
                  aria-label={`Go to ${block.linkText}`}
                >
                  {block.linkText}
                </Link>
                .
              </p>
            );
          default:
            return null;
        }
      })}
    </section>
  );
}
