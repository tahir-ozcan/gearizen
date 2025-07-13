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
          group relative flex flex-col items-center text-center
          bg-white rounded-2xl p-6
          border border-gray-100
          shadow-sm hover:shadow-md
          transform transition-all duration-300
          hover:-translate-y-1
          focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500
          ${className}
        `}
      >
        {/* Icon Circle with subtle animation */}
        <div
          className="
            flex items-center justify-center
            w-14 h-14
            rounded-full mb-4
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            transition-transform duration-300
            group-hover:scale-110
          "
        >
          <Icon
            className="
              w-7 h-7 text-white
              transition-colors duration-300
              group-hover:text-white/80
            "
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <h3
          className="
            text-lg sm:text-xl font-semibold text-gray-900 mb-2
            transition-colors duration-300
            group-hover:text-indigo-600
          "
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm flex-grow mb-4">
          {description}
        </p>

        {/* Call to action arrow */}
        <span
          className="
            inline-flex items-center
            text-indigo-600 font-medium
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
          "
        >
          Learn more &rarr;
        </span>
      </article>
    </Link>
  );
}