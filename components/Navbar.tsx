// components/Navbar.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/tools", label: "Tools" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const toggleMenu = useCallback(() => {
    setIsOpen((v) => !v);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
      role="banner"
    >
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
      >
        Skip to main content
      </a>

      <div className="container-responsive flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Go to Gearizen homepage"
          aria-current={pathname === "/" ? "page" : undefined}
          className="flex items-center"
        >
          <Image
            src="/favicon.png"
            alt="Gearizen logo"
            width={32}
            height={32}
            priority
          />
          <span className="sr-only">Gearizen</span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center space-x-6"
        >
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`
                  relative text-sm font-medium transition-colors
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                  ${
                    active
                      ? "text-indigo-600 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600"
                      : "text-gray-700 hover:text-gray-900"
                  }
                `}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="md:hidden p-2 rounded-md text-gray-800 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition"
        >
          {isOpen ? (
            <X className="w-6 h-6" aria-hidden="true" />
          ) : (
            <Menu className="w-6 h-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile navigation panel (overlay under header) */}
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        className={`
          absolute inset-x-0 top-full bg-white shadow-lg transform origin-top transition-transform duration-200 ease-out
          ${isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}
        `}
      >
        <div className="container-responsive py-4">
          <ul className="flex flex-col space-y-2">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`
                      block w-full px-4 py-2 text-base font-medium rounded-md transition-colors
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                      ${
                        active
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
