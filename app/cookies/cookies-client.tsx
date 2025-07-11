// app/cookies/cookies-client.tsx

"use client";

import Link from "next/link";

export default function CookiesClient() {
  return (
    <section
      id="cookie-policy"
      aria-labelledby="cookie-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      {/* Başlık */}
      <h1
        id="cookie-heading"
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-center text-gray-900"
      >
        Cookie Policy
      </h1>

      {/* Giriş */}
      <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed">
        <p>
          Gearizen does not use any first-party cookies. However, we display ads via third-party networks which may set cookies to deliver relevant content and measure performance.
        </p>

        {/* What Are Cookies */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mt-12 mb-4 tracking-tight text-gray-900">
            What Are Cookies?
          </h2>
          <p>
            Cookies are small text files stored on your device by websites you visit. They can be used for functionality, analytics, or advertising purposes.
          </p>
        </div>

        {/* Cookies We Use */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mt-12 mb-4 tracking-tight text-gray-900">
            Cookies We Use
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Advertising Cookies:</strong> Third-party ad networks (e.g., Google Ads) may set cookies to personalize ads and track effectiveness.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Third-party analytics providers may set cookies to help us understand site usage and improve our tools.
            </li>
            <li>
              <strong>No First-Party Cookies:</strong> Gearizen itself does not store any data in cookies&mdash;all functionality runs entirely client-side.
            </li>
          </ul>
        </div>

        {/* Managing Cookies */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mt-12 mb-4 tracking-tight text-gray-900">
            Managing Cookies
          </h2>
          <p>
            You can control or delete cookies through your browser settings. Consult your browser’s Help documentation for instructions. To opt out of Google Ads cookies, visit{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded transition-colors"
            >
              Google Ads Settings
            </a>
            .
          </p>
        </div>

        {/* Your Choices */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mt-12 mb-4 tracking-tight text-gray-900">
            Your Choices
          </h2>
          <p>
            You may opt out of advertising and analytics cookies at any time via your browser or the links above. Disabling cookies may affect your experience on some parts of the site.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mt-12 mb-4 tracking-tight text-gray-900">
            Contact Us
          </h2>
          <p>
            If you have any questions about our cookie policy, please{" "}
            <Link
              href="/contact"
              className="text-indigo-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded transition-colors"
            >
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}