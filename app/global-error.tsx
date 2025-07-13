// app/global-error.tsx
"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <section
      role="alert"
      className="flex flex-col items-center justify-center text-center text-gray-900 antialiased"
    >
      <h1
        className="
          gradient-text text-5xl sm:text-6xl md:text-7xl
          font-extrabold tracking-tight mb-4 bg-clip-text text-transparent
          bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
        "
      >
        Something went wrong
      </h1>
      <p className="text-lg text-gray-700 mb-8 max-w-xl">
        An unexpected error occurred. You can try again or return home to continue exploring Gearizen’s free, privacy-first tools.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="
            inline-block px-5 py-3 rounded-full
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
            inline-block px-5 py-3 rounded-full
            bg-gray-200 text-gray-900 font-medium
            hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300
            transition-colors
          "
        >
          Home
        </Link>
      </div>
    </section>
  );
}