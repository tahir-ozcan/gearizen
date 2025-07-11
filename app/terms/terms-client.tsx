// app/terms/terms-client.tsx

"use client";

import Link from "next/link";

export default function TermsClient() {
  return (
    <section
      id="terms-of-use"
      aria-labelledby="terms-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="terms-heading"
        className="gradient-text text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-8 tracking-tight"
      >
        Terms of Use
      </h1>

      <p className="mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
        Welcome to Gearizen. By accessing or using our website and tools (the
        “Service”), you agree to these Terms of Use and our{" "}
        <Link
          href="/privacy"
          className="text-indigo-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded transition-colors"
        >
          Privacy Policy
        </Link>
        . If you do not agree, please discontinue use immediately.
      </p>

      <div className="space-y-12 max-w-3xl mx-auto">
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            1. Use of Service
          </h2>
          <p className="text-lg leading-relaxed">
            Gearizen provides free, client-side tools for generating passwords,
            formatting JSON, converting text, and more. You may use these tools
            for personal or commercial purposes, provided you comply with all
            applicable laws and these terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            2. User Conduct
          </h2>
          <p className="text-lg leading-relaxed">
            You agree not to use the Service for any unlawful, harmful, or
            abusive purpose. You will not attempt to interfere with the tools,
            reverse-engineer our code, or distribute malware through our
            platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            3. Intellectual Property
          </h2>
          <p className="text-lg leading-relaxed">
            All content, design, and code of Gearizen are owned by or licensed
            to Gearizen. You may not reproduce, modify, or distribute any part
            of the Service without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            4. Disclaimer of Warranties
          </h2>
          <p className="text-lg leading-relaxed">
            THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTY
            OF ANY KIND. GEARIZEN DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED,
            INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            5. Limitation of Liability
          </h2>
          <p className="text-lg leading-relaxed">
            IN NO EVENT SHALL GEARIZEN BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE
            SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            6. Changes to These Terms
          </h2>
          <p className="text-lg leading-relaxed">
            We may update these Terms from time to time. Changes will be posted
            here with a revised effective date. Continued use constitutes
            acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            7. Governing Law
          </h2>
          <p className="text-lg leading-relaxed">
            These terms are governed by the laws of the jurisdiction where
            Gearizen is operated, without regard to conflict of law principles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            8. Contact Us
          </h2>
          <p className="text-lg leading-relaxed">
            If you have any questions about these terms, please{" "}
            <Link
              href="/contact"
              className="text-indigo-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded transition-colors"
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
