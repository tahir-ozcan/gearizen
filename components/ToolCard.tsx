import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";

interface ToolCardProps {
  href: string;
  /** Lucide icon name to lazy load */
  icon: string;
  title: string;
  description: string;
  className?: string;
}

/**
 * Reusable card linking to a tool page with an icon, title and description.
 */
export default function ToolCard({
  href,
  icon,
  title,
  description,
  className = "",
}: ToolCardProps) {
  // Lazy load lucide icons client-side for performance
  const Icon = dynamic(() =>
    import("lucide-react").then(
      (m) =>
        (
          m as unknown as Record<
            string,
            React.ComponentType<React.SVGProps<SVGSVGElement>>
          >
        )[icon],
    ),
  );
  return (
    <li className="list-none">
      <Link
        href={href}
        aria-label={`Open ${title}`}
        className={`card flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${className}`}
      >
        <Icon
          className="w-10 h-10 text-indigo-600 mx-auto mb-4"
          aria-hidden="true"
        />
        <h3 className="text-xl font-semibold mb-2 text-center break-words group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-center flex-grow break-words">
          {description}
        </p>
      </Link>
    </li>
  );
}
