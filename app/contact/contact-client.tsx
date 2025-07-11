"use client";
import { useSearchParams } from "next/navigation";

export default function ContactClient() {
  const success = useSearchParams().get("success") === "1";
  return (
    <section
      id="contact-gearizen"
      aria-labelledby="contact-heading"
      className="hero-section"
    >
      <h1
        id="contact-heading"
        className="gradient-text text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-center"
      >
        Contact Us
      </h1>
      <p className="text-lg text-gray-700 mb-12 max-w-xl mx-auto text-center">
        Have questions or feedback? Please email us at
        <a href="mailto:gearizen.tahir.ozcan@gmail.com" className="text-indigo-600 underline ml-1">
          gearizen.tahir.ozcan@gmail.com
        </a>
        .
      </p>
      {success && (
        <div
          role="status"
          className="max-w-md mx-auto bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center"
        >
          <p className="font-medium text-lg">Thank you! Your message has been sent.</p>
        </div>
      )}
    </section>
  );
}
