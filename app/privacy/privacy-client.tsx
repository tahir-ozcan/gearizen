// app/privacy/privacy-client.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { getPrivacySections } from "@/lib/privacy";
import { renderMarkdown } from "@/lib/render-markdown";

const sections = getPrivacySections();

export default function PrivacyClient() {
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const [tocOpen, setTocOpen] = useState(false);

  const handleScroll = useCallback(() => {
    let current = sections[0].id;
    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 100) {
        current = id;
      }
    }
    setActiveId(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = tocOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [tocOpen]);

  return (
    <section
      id="privacy-policy"
      aria-labelledby="privacy-heading"
      className="container-responsive py-20 text-gray-900 selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="privacy-heading"
        className="gradient-text text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-center"
      >
        Privacy Policy
      </h1>

      <div className="lg:grid lg:grid-cols-[1fr_minmax(0,240px)] lg:gap-12">
        <div className="prose prose-gray max-w-none text-lg leading-relaxed">
          {sections.map((sec) => (
            <section id={sec.id} key={sec.id} className="mb-12 scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                {sec.title}
              </h2>
              <div
                className="mt-4"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(sec.markdown) }}
              />
            </section>
          ))}
        </div>

        <aside className="hidden lg:block">
          <nav aria-label="Table of contents" className="sticky top-20">
            <ul className="space-y-2 text-sm">
              {sections.map((sec) => (
                <li key={sec.id} className="list-none">
                  <a
                    href={`#${sec.id}`}
                    className={`block px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors ${activeId === sec.id ? "text-indigo-600 font-semibold" : "text-gray-700 hover:text-gray-900"}`}
                  >
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      <button
        type="button"
        className="fixed bottom-4 right-4 lg:hidden btn-primary"
        onClick={() => setTocOpen(true)}
        aria-label="Open contents"
      >
        Contents
      </button>
      {tocOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" role="dialog" aria-modal="true">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[75vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setTocOpen(false)}
              className="float-right mb-4 text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Close
            </button>
            <nav aria-label="Mobile table of contents">
              <ul className="space-y-3">
                {sections.map((sec) => (
                  <li key={sec.id} className="list-none">
                    <a
                      href={`#${sec.id}`}
                      onClick={() => setTocOpen(false)}
                      className={`block px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${activeId === sec.id ? "text-indigo-600 font-semibold" : "text-gray-700 hover:text-gray-900"}`}
                    >
                      {sec.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </section>
  );
}
