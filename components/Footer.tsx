// components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import JsonLd from "@/app/components/JsonLd";
import { Heart } from "lucide-react";

const FaGithub = dynamic(
  () => import("react-icons/fa").then((m) => m.FaGithub),
  { ssr: false }
);
const FaX = dynamic(
  () => import("react-icons/si").then((m) => m.SiX),
  { ssr: false }
);
const FaLinkedin = dynamic(
  () => import("react-icons/fa").then((m) => m.FaLinkedin),
  { ssr: false }
);

interface LinkItem {
  label: string;
  href: string;
  external?: boolean;
  icon: ReactNode;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const siteLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "All Tools", href: "/tools" },
    { label: "Contact Us", href: "/contact" },
  ];

  const popularTools = [
    { label: "JSON Formatter", href: "/tools/json-formatter" },
    { label: "URL Shortener", href: "/tools/url-shortener" },
    { label: "Lorem Ipsum Generator", href: "/tools/lorem-ipsum-generator" },
    { label: "Color Picker", href: "/tools/color-picker" },
    { label: "Markdown Editor", href: "/tools/markdown-editor" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ];

  const builtWith = [
    { label: "TypeScript", href: "https://www.typescriptlang.org", external: true },
    { label: "Next.js", href: "https://nextjs.org", external: true },
    { label: "Tailwind CSS", href: "https://tailwindcss.com", external: true },
    { label: "React", href: "https://reactjs.org", external: true },
    { label: "Vercel", href: "https://vercel.com", external: true },
  ];

  const socialLinks: LinkItem[] = [
    {
      label: "GitHub",
      href: "https://github.com/tahir-ozcan/gearizen",
      external: true,
      icon: <FaGithub className="w-6 h-6" aria-hidden="true" />,
    },
    {
      label: "X",
      href: "https://x.com/gearizen",
      external: true,
      icon: <FaX className="w-6 h-6" aria-hidden="true" />,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/gearizen",
      external: true,
      icon: <FaLinkedin className="w-6 h-6" aria-hidden="true" />,
    },
  ];

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: "https://gearizen.com",
    name: "Gearizen",
    logo: "https://gearizen.com/favicon.png",
    sameAs: socialLinks.map((l) => l.href),
  };

  const getSocialClasses = (label: string) => {
    switch (label) {
      case "GitHub":
        return "text-gray-600 hover:text-gray-800";
      case "X":
        return "text-[#1DA1F2] hover:text-[#0d8ddb]";
      case "LinkedIn":
        return "text-[#0077B5] hover:text-[#005582]";
      default:
        return "text-gray-500 hover:text-gray-700";
    }
  };

  return (
    <footer role="contentinfo" className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Social */}
          <section aria-labelledby="footer-brand">
            <h2 id="footer-brand" className="sr-only">
              Gearizen
            </h2>
            <Link
              href="/"
              aria-label="Gearizen homepage"
              className="flex items-center mb-4"
            >
              <Image
                src="/favicon.png"
                alt="Gearizen logo"
                width={32}
                height={32}
                loading="lazy"
              />
              <span
                className="ml-2 text-xl font-extrabold bg-clip-text text-transparent
                           bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]"
              >
                Gearizen
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Instant, privacy-first web tools for developers, creators, and
              beyond. No signup. No tracking. 100% client-side.
            </p>
            <nav
              aria-label="Social media links"
              className="mt-4 flex space-x-4"
            >
              {socialLinks.map(({ href, label, external, icon }) => (
                <a
                  key={href}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className={`${getSocialClasses(label)} transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`}
                >
                  {icon}
                </a>
              ))}
            </nav>
          </section>

          {/* Site Pages */}
          <nav aria-labelledby="footer-site-pages">
            <h3
              id="footer-site-pages"
              className="text-lg font-semibold text-gray-900 mb-4"
            >
              Site
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {siteLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Popular Tools */}
          <nav aria-labelledby="footer-popular-tools">
            <h3
              id="footer-popular-tools"
              className="text-lg font-semibold text-gray-900 mb-4"
            >
              Popular Tools
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {popularTools.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-labelledby="footer-legal">
            <h3
              id="footer-legal"
              className="text-lg font-semibold text-gray-900 mb-4"
            >
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {legalLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Built With */}
          <nav aria-labelledby="footer-built-with">
            <h3
              id="footer-built-with"
              className="text-lg font-semibold text-gray-900 mb-4"
            >
              Built With
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {builtWith.map(({ label, href, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {currentYear} Gearizen. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center">
            Made with
            <Heart
              className="w-4 h-4 text-red-500 mx-1"
              aria-hidden="true"
            />
            in the browser.
          </p>
        </div>

        <JsonLd data={organizationJsonLd} />
      </div>
    </footer>
  );
}