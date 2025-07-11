// app/about/about-client.tsx

"use client";

import Link from "next/link";

export default function AboutClient() {
  return (
    <section
      id="about-gearizen"
      aria-labelledby="about-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-brand-200 selection:text-brand-900"
    >
      {/* Heading */}
      <h1
        id="about-heading"
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-center text-gray-900"
      >
        About Gearizen
      </h1>

      {/* Intro Paragraphs */}
      <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed">
        <p>
          Gearizen is a free, client-side digital tools platform built for web developers, content creators, and everyday users. We deliver essential utilities&mdash;password generators, JSON formatters, text converters, QR code generators, and more&mdash;without requiring signup or collecting any personal data.
        </p>
        <p>
          Powered entirely by client-side technologies, Gearizen guarantees privacy and security while providing fast, reliable tools accessible from anywhere in the world.
        </p>
        <p>
          Our mission is to foster a growing ecosystem through SEO-optimized content and intuitive tools, turning organic traffic into sustainable ad revenue that fuels continuous improvement and expansion.
        </p>
      </div>

      {/* Why Choose */}
      <h2 className="mt-12 text-2xl sm:text-3xl font-semibold mb-4 tracking-tight text-gray-900 text-center">
        Why Choose Gearizen?
      </h2>
      <ul className="max-w-3xl mx-auto list-disc list-inside space-y-3 text-lg leading-relaxed mb-12">
        <li>No signup or login required</li>
        <li>100% client-side & privacy-focused</li>
        <li>Fast, reliable & completely free</li>
        <li>SEO-optimized for maximum discoverability</li>
        <li>Wide range of essential developer & creator tools</li>
      </ul>

      {/* Call to Action */}
      <p className="text-lg leading-relaxed text-center">
        We value your feedback and suggestions. To get in touch, please visit our{" "}
        <Link
          href="/contact"
          className="text-brand-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded transition-colors"
          aria-label="Go to Contact page"
        >
          Contact page
        </Link>
        .
      </p>
    </section>
  );
}