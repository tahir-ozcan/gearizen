// app/cookies/cookies-client.tsx
"use client";

import Link from "next/link";

export default function CookiesClient() {
  return (
    <section
      id="cookie-policy"
      aria-labelledby="cookie-heading"
      className="space-y-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      {/* Hero / Title */}
      <div className="text-center mx-auto max-w-3xl space-y-6 px-4 sm:px-0">
        <h1
          id="cookie-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl
            font-extrabold tracking-tight
          "
        >
          Cookie Policy
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="text-lg leading-relaxed text-gray-700">
          Gearizen itself does not set any first-party cookies, but third-party ad and analytics
          networks may. Below is how those operate and how you can manage them.
        </p>
      </div>

      {/* What Are Cookies */}
      <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-0">
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            What Are Cookies?
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            Cookies are small text files stored on your device by websites you visit. Third-party
            advertising or analytics services may use them to measure site usage or deliver relevant
            ads.
          </p>
        </section>

        {/* Third-Party Cookies */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            Third-Party Cookies We Use
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <ul className="mt-4 list-disc list-inside space-y-2 text-lg leading-relaxed text-gray-700">
            <li>
              <strong>Advertising Cookies:</strong> Served by ad networks (e.g., Google Ads) to
              personalize and measure ad performance.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Used by third-party analytics (e.g., Google
              Analytics) to understand usage trends and improve our tools.
            </li>
          </ul>
        </section>

        {/* Managing Cookies */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            Managing or Opting-Out
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            You have control over cookies in your browser settings. To specifically manage Google Ads
            cookies, visit{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7c3aed] hover:text-[#8b5cf6] underline transition-colors"
            >
              adssettings.google.com
            </a>
            . Disabling certain cookies may affect ad personalization or analytics accuracy.
          </p>
        </section>

        {/* No First-Party Cookies */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            No First-Party Cookies
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            Gearizen does not itself set any cookies or store any personal data on our servers. All of
            our tools run fully in your browser and all settings remain local to your device.
          </p>
        </section>

        {/* Your Choices & Contact */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            Questions?
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            If you have any questions about our Cookie Policy, feel free to{" "}
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