// app/terms/terms-client.tsx
"use client";

import Link from "next/link";

export default function TermsClient() {
  const sections = [
    {
      title: "1. Use of Service",
      content:
        "Gearizen provides a suite of free, client-side utilities—password generators, JSON formatters, converters, and more. By accessing or using our Service, you agree to comply with all applicable laws and these Terms of Use.",
    },
    {
      title: "2. User Conduct",
      content:
        "You must not use the Service for any unlawful, harmful, or malicious activities. Interference with our tools, reverse engineering, or distribution of malware is strictly prohibited.",
    },
    {
      title: "3. Intellectual Property",
      content:
        "All content, branding, and code on Gearizen are the property of Gearizen or its licensors. You may not reproduce, distribute, or create derivative works without our express written consent.",
    },
    {
      title: "4. Disclaimer of Warranties",
      content:
        "THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND. GEARIZEN DISCLAIMS ALL IMPLIED AND EXPRESS WARRANTIES, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.",
    },
    {
      title: "5. Limitation of Liability",
      content:
        "TO THE MAXIMUM EXTENT PERMITTED BY LAW, GEARIZEN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.",
    },
    {
      title: "6. Changes to Terms",
      content:
        "We may update these Terms at our discretion. Modifications will be posted here with an updated effective date. Continued use of the Service constitutes acceptance of the revised Terms.",
    },
    {
      title: "7. Governing Law",
      content:
        "These Terms are governed by the laws of Gearizen’s operating jurisdiction, without regard to conflict-of-law principles.",
    },
  ];

  return (
    <section id="terms-of-use" className="space-y-16 text-gray-900 antialiased">
      {/* Centered Main Heading with Gradient & Underline */}
      <div className="text-center mx-auto max-w-3xl space-y-6 sm:px-0">
        <h1
          id="terms-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Terms of Use
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        {/* Introduction */}
        <p className="text-lg leading-relaxed text-gray-700">
          Welcome to Gearizen. By accessing or using our website and tools (collectively, the “Service”), you agree to abide by these Terms of Use and our{" "}
          <Link
            href="/privacy"
            className="text-[#7c3aed] hover:text-[#8b5cf6] underline transition-colors"
          >
            Privacy Policy
          </Link>
          . If you do not accept these terms, please discontinue use immediately.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-12 sm:px-0">
        {/* Numbered Sections */}
        {sections.map(({ title, content }) => (
          <section key={title}>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
              {title}
            </h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
            <p className="mt-4 text-lg leading-relaxed text-gray-700">{content}</p>
          </section>
        ))}

        {/* Contact Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            8. Contact Us
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            For questions or clarifications regarding these Terms, please{" "}
            <Link
              href="/contact"
              className="text-[#7c3aed] hover:text-[#8b5cf6] underline transition-colors"
            >
              contact us
            </Link>
            .
          </p>
        </section>
      </div>
    </section>
  );
}