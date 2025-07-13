// app/contact/contact-client.tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function ContactClient() {
  const success = useSearchParams().get("success") === "1";

  return (
    <section
      id="contact-gearizen"
      aria-labelledby="contact-heading"
      className="space-y-12 text-gray-900 antialiased"
    >
      {/* Hero / Heading */}
      <div className="text-center space-y-6 px-4 sm:px-0">
        <h1
          id="contact-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl
            font-extrabold tracking-tight
          "
        >
          Contact Us
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-xl text-base sm:text-lg text-gray-700 leading-relaxed">
          Have questions or feedback? Please email us at{" "}
          <a
            href="mailto:gearizen.tahir.ozcan@gmail.com"
            className="text-[#7c3aed] hover:text-[#8b5cf6] underline transition-colors"
          >
            gearizen.tahir.ozcan@gmail.com
          </a>
          .
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div
          role="status"
          className="
            mx-auto max-w-md
            bg-green-50 border border-green-200
            text-green-800 p-6 rounded-lg text-center
            shadow-sm
          "
        >
          <p className="font-semibold text-lg">
            Thank you! Your message has been sent.
          </p>
        </div>
      )}
    </section>
  );
}