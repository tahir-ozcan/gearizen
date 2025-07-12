// app/privacy/privacy-client.tsx

"use client";

import { useEffect, useState } from "react";
import { renderMarkdown } from "@/lib/render-markdown";
import { getPrivacyPolicySections } from "@/lib/privacyPolicy";

export default function PrivacyClient() {
  const sections = getPrivacyPolicySections();
  const [active, setActive] = useState<string>(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <section
      id="privacy-policy"
      aria-labelledby="privacy-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <a
        href={`#${sections[0]?.id}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 px-4 py-2 bg-indigo-600 text-white rounded-md z-40"
      >
        Skip to policy
      </a>
      <h1
        id="privacy-heading"
        className="gradient-text text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-center"
      >
        Privacy Policy
      </h1>

      <p className="mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
        At <strong>Gearizen</strong>, your privacy is our top priority. All of
        our tools run <strong>100% client-side</strong>, meaning your data never
        leaves your device—nothing is transmitted, stored, or tracked on our
        servers.
      </p>

      <p className="mb-12 text-lg leading-relaxed max-w-3xl mx-auto">
        You are never required to create an account or provide any personal
        information. Feel free to use our password generators, JSON formatters,
        text converters, QR code tools, and more—completely anonymously.
      </p>

      <div className="md:grid md:grid-cols-[200px_1fr] md:gap-12">
        {/* Table of contents */}
        <nav
          aria-label="On this page"
          className="hidden md:block sticky top-24 self-start"
        >
          <ul className="space-y-2 border-l border-gray-200 pl-4 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`transition-colors hover:text-gray-900 ${
                    active === s.id
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <article className="space-y-12 max-w-3xl mx-auto md:mx-0">
          {sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight text-gray-900">
                {section.title}
              </h2>
              <div
                className="prose prose-indigo text-lg leading-relaxed policy-text"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(section.content),
                }}
              />
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
