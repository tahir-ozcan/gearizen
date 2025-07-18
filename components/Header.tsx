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

  // Header DOM referansı
  const headerRef = useRef<HTMLElement>(null);
  // Menüleri yerleştirmek için header'ın alt boşluğu
  const [menuTop, setMenuTop] = useState(0);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const desktopMoreRef = useRef<HTMLDivElement>(null);

  // Sticky header gölgesi
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Desktop “More” dışına tıklayınca kapat
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

  // Body scroll engelleme (mobil menü açıkken)
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Header'ın o anki alt konumunu hesapla: toast vs. ne kadar yukarıda olduğuna bak
  const updateMenuTop = useCallback(() => {
    if (headerRef.current) {
      // getBoundingClientRect().bottom, viewport'un üstünden header'ın alt kenarına kadar px
      setMenuTop(headerRef.current.getBoundingClientRect().bottom);
    }
  }, []);

  // İlk render, resize ve mobil menü açıldığında güncelle
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

  // Handler’lar
  const handleMobileToggle = useCallback(() => {
    setMobileOpen(o => !o);
  }, []);

  const handleMobileMore = useCallback(() => {
    setMobileMoreOpen(o => !o);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileMoreOpen(false);
  }, []);

  const handleDesktopMore = useCallback(() => {
    setDesktopMoreOpen(o => !o);
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
            alt="Gearizen logo"
            width={40}
            height={40}
            priority
            unoptimized
            sizes="(max-width: 768px) 32px, 40px"
            quality={100}
            className="rounded-full"
          />
          <span className="text-2xl font-bold tracking-tight">Gearizen</span>
        </Link>

        {/* Desktop Menü */}
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
                  flex items-center gap-1 text-base font-medium whitespace-nowrap
                  ${active
                    ? "underline underline-offset-4 decoration-white"
                    : "hover:underline hover:underline-offset-4"}
                  transition-colors duration-200
                `}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}

          {/* Desktop “More” */}
          <div ref={desktopMoreRef} className="relative">
            <button
              onClick={handleDesktopMore}
              aria-expanded={desktopMoreOpen}
              aria-haspopup="true"
              className="flex items-center gap-1 text-base font-medium focus:outline-none"
            >
              More
              {desktopMoreOpen
                ? <ChevronUp className="w-4 h-4" aria-hidden="true" />
                : <ChevronDown className="w-4 h-4" aria-hidden="true" />
              }
            </button>
            {desktopMoreOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                {LEGAL_NAV.map(({ href, label, Icon }) => {
                  const active = pathname === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setDesktopMoreOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`
                          flex items-center gap-2 px-4 py-2 text-sm
                          ${active ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}
                          transition-colors duration-150
                        `}
                      >
                        <Icon className="w-4 h-4 text-gray-500" aria-hidden="true" />
                        <span>{label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </nav>

        {/* Mobile Menü Butonu */}
        <button
          onClick={handleMobileToggle}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="lg:hidden p-2 rounded-md hover:bg-white/20 focus:outline-none transition"
        >
          {mobileOpen
            ? <X className="w-6 h-6" aria-hidden="true" />
            : <Menu className="w-6 h-6" aria-hidden="true" />
          }
        </button>
      </div>

      {/* Mobil Ana Menü */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-x-0 z-40 bg-white text-gray-800 shadow-lg max-h-[calc(100vh)] overflow-y-auto"
          style={{ top: menuTop }}
        >
          <nav aria-label="Mobile">
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
                        transition-colors duration-200
                      `}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}

              {/* Mobil “More” Butonu */}
              <li className="border-t border-gray-200 mt-2 pt-2 px-4">
                <button
                  onClick={handleMobileMore}
                  aria-expanded={mobileMoreOpen}
                  aria-haspopup="true"
                  className="w-full flex items-center justify-between py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
                >
                  <span>More</span>
                  {mobileMoreOpen
                    ? <ChevronUp className="w-5 h-5" aria-hidden="true" />
                    : <ChevronDown className="w-5 h-5" aria-hidden="true" />
                  }
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Mobil “More” Alt-Menüsü */}
      {mobileOpen && mobileMoreOpen && (
        <div
          className="lg:hidden fixed inset-x-0 z-50 bg-white text-gray-800 shadow-lg"
          style={{ top: menuTop +  (/* ana menü yüksekliği */ 0) }}
        >
          <nav aria-label="Mobile More">
            <ul className="space-y-1 p-4">
              {LEGAL_NAV.map(({ href, label, Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-5 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Icon className="w-5 h-5 text-gray-600" aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}