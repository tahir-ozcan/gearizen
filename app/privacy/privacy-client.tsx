// app/privacy/privacy-client.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getPolicySections } from "@/lib/privacy-policy";
import { renderMarkdown } from "@/lib/render-markdown";

const sections = getPolicySections();

export default function PrivacyClient() {
  const [active, setActive] = useState<string>(sections[0]?.id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900 flex flex-col lg:flex-row">
      {/* Skip link */}
      <a
        href={`#${sections[0].id}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
      >
        Skip to policy content
      </a>

      {/* TOC */}
      <aside className="lg:w-1/4 lg:pr-8 mb-8 lg:mb-0" aria-label="Table of contents">
        <nav className="lg:sticky lg:top-24">
          <ul className="space-y-2 border-l border-gray-200 pl-4">
            {sections.map(({ id, title }) => (
              <li key={id} className="list-none">
                <a
                  href={`#${id}`}
                  className={`block text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded ${active === id ? "text-indigo-600" : "text-gray-700 hover:text-gray-900"}`}
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Content */}
      <div className="lg:flex-1 space-y-12" id="policy-start">
        <h1 className="gradient-text text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center mb-8">
          Privacy Policy
        </h1>
        {sections.map(({ id, title, content }) => (
          <section
            key={id}
            id={id}
            ref={(el) => (sectionRefs.current[id] = el)}
            aria-labelledby={`${id}-heading`}
            className="max-w-3xl mx-auto"
          >
            <h2
              id={`${id}-heading`}
              className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight"
            >
              {title}
            </h2>
            <div
              className="prose prose-indigo max-w-none text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
