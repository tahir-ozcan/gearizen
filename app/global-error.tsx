// app/global-error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ reset }: { reset: () => void }) {
  // Move focus to heading for screen readers, but suppress the default focus outline
  useEffect(() => {
    const title = document.getElementById("error-title");
    if (title) {
      title.setAttribute("tabIndex", "-1");
      title.focus();
    }
  }, []);

  return (
    <section
      id="error-section"
      role="alert"
      aria-labelledby="error-title"
      className="flex flex-col items-center justify-center text-center text-gray-900 antialiased space-y-6 px-4 py-16"
    >
      <h1
        id="error-title"
        className="
          text-7xl sm:text-8xl font-extrabold
          bg-clip-text text-transparent
          bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
          mb-2 tracking-tight focus:outline-none
        "
      >
        500
      </h1>
      {/* Colored underline matching other pages */}
      <div className="h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24] mb-4" />
      <h2
        className="
          text-3xl sm:text-4xl font-semibold mb-6
          bg-clip-text text-transparent
          bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
        "
      >
        Something Went Wrong
      </h2>
      <p className="text-base sm:text-lg text-gray-700 max-w-xl leading-relaxed">
        An unexpected error occurred. You can try again, or return home to continue exploring Gearizen’s free, privacy-first tools.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={reset}
          className="
            inline-block px-6 py-3 rounded-full
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-white font-semibold
            transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed]/50
          "
        >
          Try Again
        </button>
        <Link
          href="/"
          className="
            inline-block px-6 py-3 rounded-full
            bg-gray-200 text-gray-900 font-medium
            hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300
            transition-colors
          "
          aria-label="Return to Gearizen homepage"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}