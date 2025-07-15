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
    <Link
      href={href}
      aria-label={`Open ${title}`}
      className="block group"
    >
      <article
        className={`
          relative flex flex-col items-center text-center
          bg-white rounded-2xl p-8
          border-2 border-gray-100
          shadow-md hover:shadow-xl
          transform transition-all duration-300
          hover:-translate-y-2
          focus-within:outline-none focus-within:ring-4 focus-within:ring-indigo-300
          ${className}
        `}
      >
        {/* Icon */}
        <div
          className="
            flex items-center justify-center
            w-16 h-16
            rounded-full mb-5
            bg-gradient-to-tr from-indigo-500 to-pink-400
            transition-transform duration-300
            group-hover:scale-110
            ring-4 ring-transparent group-hover:ring-white/30
          "
        >
          <Icon
            className="
              w-8 h-8
              text-white
              transition-colors duration-300
              group-hover:text-white/80
            "
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <h3
          className="
            text-xl sm:text-2xl font-semibold mb-3
            bg-clip-text text-transparent
            bg-gradient-to-r from-gray-900 to-gray-900
            transition-colors duration-300
            group-hover:from-indigo-600 group-hover:to-pink-500
          "
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm flex-grow mb-6 leading-relaxed">
          {description}
        </p>

        {/* CTA Arrow */}
        <span
          className="
            inline-flex items-center
            text-indigo-600 font-medium
            opacity-0 translate-y-2
            group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-300
          "
        >
          Try&nbsp;&rarr;
        </span>
      </article>
    </Link>
  );
}