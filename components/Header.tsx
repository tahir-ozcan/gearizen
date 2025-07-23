// components/Header.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Info,
  Settings,
  Mail,
  Lock,
  Cookie,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const CORE_NAV: NavItem[] = [
  { href: "/",        label: "Home",          Icon: Home     },
  { href: "/about",   label: "About Us",      Icon: Info     },
  { href: "/tools",   label: "All Tools",     Icon: Settings },
  { href: "/contact", label: "Contact Us",    Icon: Mail     },
];

const LEGAL_NAV: NavItem[] = [
  { href: "/privacy", label: "Privacy Policy",   Icon: Lock   },
  { href: "/cookies", label: "Cookie Policy",    Icon: Cookie },
  { href: "/terms",   label: "Terms of Service", Icon: Info   },
];

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [menuTop, setMenuTop] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const desktopMoreRef = useRef<HTMLDivElement>(null);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close desktop “More” on outside click
  useEffect(() => {
    if (!desktopMoreOpen) return;
    const handler = (e: MouseEvent) => {
      if (desktopMoreRef.current && !desktopMoreRef.current.contains(e.target as Node)) {
        setDesktopMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [desktopMoreOpen]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Compute header bottom for mobile panel
  const updateMenuTop = useCallback(() => {
    if (headerRef.current) {
      setMenuTop(headerRef.current.getBoundingClientRect().bottom);
    }
  }, []);

  useEffect(() => {
    updateMenuTop();
    window.addEventListener("resize", updateMenuTop);
    return () => window.removeEventListener("resize", updateMenuTop);
  }, [updateMenuTop]);

  useEffect(() => {
    if (mobileOpen) updateMenuTop();
    else setMobileMoreOpen(false);
  }, [mobileOpen, updateMenuTop]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileMoreOpen(false);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`
        sticky top-0 inset-x-0 z-50
        gradient-bg text-white
        ${scrolled ? "shadow-2xl" : ""}
        transition-shadow duration-300
      `}
      role="banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/favicon.png"
            alt="Gearizen"
            width={40}
            height={40}
            className="rounded-full"
            unoptimized
            priority
          />
          <span className="text-2xl font-bold">Gearizen</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-6">
          {CORE_NAV.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`
                  flex items-center gap-1 font-medium
                  ${active
                    ? "underline underline-offset-4"
                    : "hover:underline hover:underline-offset-4"}
                  transition-colors
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}

          {/* Desktop “More” */}
          <div ref={desktopMoreRef} className="relative">
            <button
              onClick={() => setDesktopMoreOpen(o => !o)}
              aria-expanded={desktopMoreOpen}
              className="flex items-center gap-1 font-medium focus:outline-none"
            >
              More
              {desktopMoreOpen
                ? <ChevronUp className="w-4 h-4" />
                : <ChevronDown className="w-4 h-4" />}
            </button>
            {desktopMoreOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                {LEGAL_NAV.map(({ href, label, Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={pathname === href ? "page" : undefined}
                      onClick={() => setDesktopMoreOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-gray-500" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="lg:hidden p-2 rounded-md hover:bg-white/20 focus:outline-none transition"
        >
          {mobileOpen
            ? <X className="w-6 h-6" />
            : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Panel (CORE + More submenu) */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-x-0 z-40 bg-white text-gray-800 shadow-lg overflow-auto"
          style={{ top: menuTop }}
        >
          <ul className="space-y-1 p-4">
            {CORE_NAV.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMobile}
                    aria-current={active ? "page" : undefined}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg font-medium
                      ${active ? "bg-gray-100" : "hover:bg-gray-50"}
                      transition-colors
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                </li>
              );
            })}

            {/* Mobile “More” Toggle */}
            <li className="border-t border-gray-200 mt-2 pt-2">
              <button
                onClick={() => setMobileMoreOpen(o => !o)}
                aria-expanded={mobileMoreOpen}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none"
              >
                <span>More</span>
                {mobileMoreOpen
                  ? <ChevronUp className="w-5 h-5" />
                  : <ChevronDown className="w-5 h-5" />}
              </button>
            </li>

            {/* Inline More submenu */}
            {mobileMoreOpen && LEGAL_NAV.map(({ href, label, Icon }) => (
              <li key={href} className="pl-6">
                <Link
                  href={href}
                  onClick={closeMobile}
                  aria-current={pathname === href ? "page" : undefined}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}