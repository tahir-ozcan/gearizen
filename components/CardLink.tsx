import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

interface CardLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

export default function CardLink({
  children,
  className = "",
  ...props
}: CardLinkProps) {
  return (
    <Link {...props} className={`card ${className}`}>
      {children}
    </Link>
  );
}
