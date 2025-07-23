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

  // sticky shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // desktop "More" outside click
  useEffect(() => {
    if (!desktopMoreOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (
        desktopMoreRef.current &&
        !desktopMoreRef.current.contains(e.target as Node)
      ) {
        setDesktopMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [desktopMoreOpen]);

  // lock body scroll when mobile open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // calculate header bottom
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
    if (mobileOpen) {
      updateMenuTop();
    } else {
      setMobileMoreOpen(false);
    }
  }, [mobileOpen, updateMenuTop]);

  // handlers
  const toggleMobile = useCallback(() => setMobileOpen(o => !o), []);
  const toggleMobileMore = useCallback(() => setMobileMoreOpen(o => !o), []);
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileMoreOpen(false);
  }, []);
  const toggleDesktopMore = useCallback(() => setDesktopMoreOpen(o => !o), []);

  return (
    <header
      ref={headerRef}
      className={`
        sticky top-0 inset-x-0 z-50
        bg-gradient-to-r from-indigo-600 to-purple-600 text-white
        ${scrolled ? "shadow-xl" : ""}
        transition-shadow duration-300
      `}
      role="banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/favicon.png"
            alt="Gearizen logo"
            width={40}
            height={40}
            priority
            unoptimized
            className="rounded-full"
          />
          <span className="text-2xl font-bold tracking-tight">Gearizen</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden lg:flex items-center space-x-6">
          {CORE_NAV.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
                aria-current={active ? "page" : undefined}
                className={`
                  flex items-center gap-1 text-base font-medium
                  ${active
                    ? "underline underline-offset-4"
                    : "hover:underline hover:underline-offset-4"}
                  transition-colors
                `}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}

          <div ref={desktopMoreRef} className="relative">
            <button
              onClick={toggleDesktopMore}
              aria-expanded={desktopMoreOpen}
              className="flex items-center gap-1 text-base font-medium focus:outline-none"
            >
              More
              {desktopMoreOpen
                ? <ChevronUp className="w-4 h-4" />
                : <ChevronDown className="w-4 h-4" />}
            </button>
            {desktopMoreOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-xl overflow-hidden z-50">
                {LEGAL_NAV.map(({ href, label, Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setDesktopMoreOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* Mobile button */}
        <button
          onClick={toggleMobile}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="lg:hidden p-2 rounded hover:bg-white/20 focus:outline-none transition"
        >
          {mobileOpen
            ? <X className="w-6 h-6" />
            : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-x-0 z-40 bg-white text-gray-800 shadow-lg overflow-y-auto"
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
                      flex items-center gap-3 px-3 py-2 rounded font-medium
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

            {/* More toggle */}
            <li className="mt-2 border-t border-gray-200 pt-2">
              <button
                onClick={toggleMobileMore}
                aria-expanded={mobileMoreOpen}
                className="w-full flex items-center justify-between px-3 py-2 rounded font-medium hover:bg-gray-50 transition-colors focus:outline-none"
              >
                <span>More</span>
                {mobileMoreOpen
                  ? <ChevronUp className="w-5 h-5" />
                  : <ChevronDown className="w-5 h-5" />}
              </button>

              {/* Inline Legal links */}
              {mobileMoreOpen && (
                <ul className="mt-1 space-y-1 pl-6">
                  {LEGAL_NAV.map(({ href, label, Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={closeMobile}
                        className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-50 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-gray-600" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}