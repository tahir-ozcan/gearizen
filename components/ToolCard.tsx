// components/ToolCard.tsx
"use client";

import Link from "next/link";
import type { LucideProps } from "lucide-react";

export interface ToolCardProps {
  href: string;
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
  className?: string;
}

export default function ToolCard({
  href,
  icon: Icon,
  title,
  description,
  className = "",
}: ToolCardProps) {
  return (
    <Link href={href} aria-label={`Open ${title}`} className="block">
      <article
        className={`
          group relative flex flex-col items-center
          bg-white rounded-2xl p-6
          shadow-sm hover:shadow-lg
          transform transition-all duration-300
          hover:-translate-y-1 hover:bg-gradient-to-br hover:from-indigo-50 hover:via-pink-50 hover:to-yellow-50
          focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500
          ${className}
        `}
      >
        {/* Icon */}
        <div
          className="
            flex items-center justify-center
            w-12 h-12 sm:w-14 sm:h-14
            bg-gradient-to-br from-indigo-100 to-indigo-50
            rounded-full mb-4
            transition-colors duration-300
            group-hover:from-indigo-200 group-hover:to-indigo-100
          "
        >
          <Icon
            className="
              w-6 h-6 sm:w-7 sm:h-7
              text-indigo-600
              group-hover:text-indigo-700
              transition-colors duration-300
            "
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <h3
          className="
            text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center
            transition-colors duration-300
            group-hover:text-indigo-600
          "
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-center line-clamp-3 flex-grow">
          {description}
        </p>

        {/* Hover Arrow */}
        <span
          className="
            absolute bottom-4 right-4
            text-indigo-500 text-xl
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
          "
        >
          &rarr;
        </span>
      </article>
    </Link>
  );
}