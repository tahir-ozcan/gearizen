// app/privacy/privacy-client.tsx
"use client";

import Link from "next/link";

export default function PrivacyClient() {
  return (
    <section
      id="privacy-policy"
      className="space-y-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      {/* Intro */}
      <div className="text-center mx-auto max-w-3xl space-y-6 px-4 sm:px-0 text-gray-700">
        <h1
          id="privacy-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl
            font-extrabold tracking-tight
          "
        >
          Privacy Policy
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
      
        <p className="text-lg leading-relaxed">
          At <strong>Gearizen</strong>, your privacy is our utmost concern. All our tools operate entirely in your browser—no data is ever sent to our servers or third parties.
        </p>
        <p className="text-lg leading-relaxed">
          No signup, no personal information, no tracking. Use our password generators, formatters, converters, and more with full confidence in your privacy.
        </p>
      </div>

      {/* Policy Sections */}
      <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-0">
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            Data We Don’t Collect
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <ul className="mt-4 list-disc list-inside space-y-2 text-lg leading-relaxed text-gray-700">
            <li>Names, emails, or any personal identifiers</li>
            <li>File uploads or storage on our infrastructure</li>
            <li>IP addresses or geolocation data</li>
            <li>Usage analytics or behavioral tracking</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            Advertising & Third-Party Services
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            We display ads via reputable networks (e.g., Google Ads). These networks may set cookies or trackers under their own policies—you can manage them through your browser. Gearizen itself never shares personal data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            Cookies
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            Gearizen does not set cookies. Only third-party ad networks may use cookies; please review their privacy notices and manage your settings accordingly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            Your Rights
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            Since we don’t collect any personal data, there is nothing to access, modify, or delete. Your interactions remain private and local to your device.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            Policy Updates
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            We may update this policy to reflect changes in our services or legal requirements. Check back periodically for the latest version.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            Contact Us
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            For questions about this policy, please{" "}
            <Link
              href="/contact"
              className="text-[#7c3aed] hover:text-[#8b5cf6] underline transition-colors"
            >
              get in touch
            </Link>
            .
          </p>
        </section>
      </div>
    </section>
  );
}