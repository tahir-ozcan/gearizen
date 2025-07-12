// app/privacy/privacy-client.tsx

"use client";

import { useEffect, useState } from "react";
import { getPrivacySections } from "@/lib/privacy";
import { renderMarkdown } from "@/lib/render-markdown";

const sections = getPrivacySections();

export default function PrivacyClient() {
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -60% 0px" }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="privacy-policy"
      aria-labelledby="privacy-heading"
      className="py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="privacy-heading"
        className="gradient-text text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-center"
      >
        Privacy Policy
      </h1>

      <a
        href="#toc"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 p-2 bg-indigo-600 text-white rounded"
      >
        Skip to policy sections
      </a>

      <div className="lg:flex lg:space-x-12 container-responsive">
        <nav
          id="toc"
          aria-label="Table of contents"
          className="hidden lg:block lg:w-64 flex-shrink-0 sticky top-24 self-start"
        >
          <ul className="space-y-2 text-sm leading-6">
            {sections
              .filter((s) => s.id !== "intro")
              .map((section) => (
                <li key={section.id} className="list-none">
                  <a
                    href={`#${section.id}`}
                    className={`block px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      activeId === section.id
                        ? "text-indigo-600 font-semibold"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        <div className="flex-1 space-y-12 max-w-3xl mx-auto">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
            >
              {section.id !== "intro" && (
                <h2
                  id={`${section.id}-heading`}
                  className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight"
                >
                  {section.title}
                </h2>
              )}
              <div
                className="prose prose-gray text-lg leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(section.body),
                }}
              />
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
