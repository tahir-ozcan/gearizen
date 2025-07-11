// app/not-found/not-found-client.tsx

"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function NotFoundClient() {
  // Move focus to the heading for screen readers
  useEffect(() => {
    const heading = document.getElementById("notfound-title");
    heading?.focus();
  }, []);

  return (
    <section
      id="notfound-section"
      aria-labelledby="notfound-title"
      className="container-responsive py-20 flex flex-col items-center justify-center min-h-screen text-center text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="notfound-title"
        tabIndex={-1}
        aria-label="404 - Page Not Found"
        className="text-7xl sm:text-8xl font-extrabold text-indigo-600 mb-4 tracking-tight"
      >
        404
      </h1>
      <h2 className="gradient-text text-2xl sm:text-3xl font-semibold mb-6">
        Oops! Page Not Found
      </h2>
      <p className="max-w-xl text-base sm:text-lg text-gray-700 mb-8 leading-relaxed">
        The page you’re looking for doesn’t exist or has been moved. Please check
        the URL or return to the homepage to explore Gearizen’s free, client-side
        digital tools.
      </p>
      <Link
        href="/"
        aria-label="Return to Gearizen homepage"
        className="inline-block bg-indigo-600 text-white font-semibold rounded-md px-6 py-3 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition"
      >
        Go to Homepage
      </Link>
    </section>
  );
}