// app/not-found.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function NotFoundClient() {
  // Move focus to heading for screen readers, but suppress the default focus outline
  useEffect(() => {
    const title = document.getElementById("notfound-title");
    if (title) {
      title.setAttribute("tabIndex", "-1");
      title.focus();
    }
  }, []);

  return (
    <section
      id="notfound-section"
      aria-labelledby="notfound-title"
      className="flex flex-col items-center justify-center text-center text-gray-900 antialiased min-h-screen px-4"
    >
      <h1
        id="notfound-title"
        className="text-7xl sm:text-8xl font-extrabold bg-clip-text text-transparent
                   bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
                   mb-2 tracking-tight focus:outline-none"
      >
        404
      </h1>
      {/* Colored underline matching other pages */}
      <div className="h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24] mb-4" />
      <h2
        className="
          text-3xl sm:text-4xl font-semibold mb-6 bg-clip-text text-transparent
          bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
        "
      >
        Page Not Found
      </h2>
      <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-lg leading-relaxed">
        Oops! We couldn’t find the page you’re looking for. It may have been moved, renamed, or never existed.
      </p>
      <Link
        href="/"
        className="
          inline-block px-6 py-3 rounded-full
          bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
          text-white font-semibold
          transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed]/50
        "
        aria-label="Return to Gearizen homepage"
      >
        Return Home
      </Link>
    </section>
  );
}