// app/privacy/privacy-client.tsx

"use client";

import Link from "next/link";

export default function PrivacyClient() {
  return (
    <section
      id="privacy-policy"
      aria-labelledby="privacy-heading"
      className="container-responsive py-20 text-gray-900 antialiased"
    >
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

      <div className="space-y-12 max-w-3xl mx-auto">
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            Data We Don’t Collect
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed">
            <li>No personal information (name, address, email, etc.)</li>
            <li>No file uploads or storage on our servers</li>
            <li>No IP address logging</li>
            <li>No behavioral analytics or usage tracking</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            Advertising & Third-Party Services
          </h2>
          <p className="text-lg leading-relaxed">
            We display ads via third-party networks (e.g., Google Ads). Those
            providers may set their own cookies or trackers; please review their
            privacy policies. Gearizen does not share any personally
            identifiable data with advertisers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            Cookies
          </h2>
          <p className="text-lg leading-relaxed">
            Gearizen itself does not use cookies. However, third-party ad
            networks may drop cookies under their own policies. You can manage
            those through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            Your Rights
          </h2>
          <p className="text-lg leading-relaxed">
            Since we collect no personal data, there is nothing for you to
            access, modify, or delete. Your interactions remain private on your
            device.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            Policy Updates
          </h2>
          <p className="text-lg leading-relaxed">
            We may update this policy to reflect changes in our tools or
            applicable laws. Please revisit this page periodically to stay
            informed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            Contact Us
          </h2>
          <p className="text-lg leading-relaxed">
            If you have questions about this policy, please{" "}
            <Link
              href="/contact"
              className="text-brand-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded transition-colors"
              aria-label="Go to Contact page"
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
