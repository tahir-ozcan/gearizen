"use client";
import Link from "next/link";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen flex flex-col items-center justify-center text-center bg-white text-gray-900 p-8">
        <h1 className="gradient-text text-4xl font-bold mb-4">
          Something went wrong
        </h1>
        <p className="mb-6">
          An unexpected error occurred. Please try again or return home.
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="px-4 py-2 rounded bg-indigo-600 text-white"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded bg-gray-200 text-gray-900"
          >
            Home
          </Link>
        </div>
      </body>
    </html>
  );
}
