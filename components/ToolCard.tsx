import dynamic from "next/dynamic";
import Link from "next/link";
import { LucideProps } from "lucide-react";
import { useMemo } from "react";

export interface ToolCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  className?: string;
}

const iconCache: Record<string, React.ComponentType<LucideProps>> = {};

function getIcon(name: string) {
  if (!iconCache[name]) {
    iconCache[name] = dynamic<LucideProps>(
      () =>
        import("lucide-react").then((m) => ({
          default: (
            m as unknown as Record<string, React.ComponentType<LucideProps>>
          )[name],
        })),
      { ssr: false },
    );
  }
  return iconCache[name];
}

export default function ToolCard({
  href,
  icon,
  title,
  description,
  className = "",
}: ToolCardProps) {
  const Icon = useMemo(() => getIcon(icon), [icon]);

  return (
    <Link
      href={href}
      aria-label={`Navigate to ${title}`}
      className={`card flex flex-col h-full items-center text-center focus-visible:ring-2 focus-visible:ring-indigo-500 ${className}`}
    >
      <Icon className="w-10 h-10 text-indigo-600 mb-4" aria-hidden="true" />
      <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 break-words flex-grow">{description}</p>
    </Link>
  );
}
