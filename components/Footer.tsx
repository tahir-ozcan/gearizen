// components/Footer.tsx

import Link from "next/link";
import Image from "next/image";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import { ReactNode } from "react";

interface LinkItem {
  label: string;
  href: string;
}

interface SocialLink {
  href: string;
  label: string;
  icon: ReactNode;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const siteLinks: LinkItem[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "All Tools", href: "/tools" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ];

  const popularTools: LinkItem[] = [
    { label: "Password Generator", href: "/tools/password-generator" },
    { label: "JSON Formatter", href: "/tools/json-formatter" },
    { label: "QR Code Generator", href: "/tools/qr-code-generator" },
    { label: "Unit Converter", href: "/tools/unit-converter" },
    { label: "Currency Converter", href: "/tools/currency-converter" },
    { label: "Contrast Checker", href: "/tools/color-contrast-checker" },
  ];

  const builtWith: LinkItem[] = [
    { label: "Next.js", href: "https://nextjs.org" },
    { label: "Tailwind CSS", href: "https://tailwindcss.com" },
    { label: "React Icons", href: "https://react-icons.github.io/react-icons" },
    { label: "Vercel", href: "https://vercel.com" },
  ];

  const socialLinks: SocialLink[] = [
    {
      href: "https://github.com/tahir-ozcan/gearizen",
      label: "Gearizen GitHub",
      icon: <FaGithub className="w-6 h-6" aria-hidden="true" />,
    },
    {
      href: "https://twitter.com/gearizen",
      label: "Gearizen Twitter",
      icon: <FaTwitter className="w-6 h-6" aria-hidden="true" />,
    },
    {
      href: "https://linkedin.com/company/gearizen",
      label: "Gearizen LinkedIn",
      icon: <FaLinkedin className="w-6 h-6" aria-hidden="true" />,
    },
  ];

  return (
    <footer role="contentinfo" className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 sm:px-6 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand + Tagline */}
          <div>
            <Link href="/" aria-label="Go to Gearizen homepage" className="flex items-center mb-4">
              <Image
                src="/favicon.png"
                alt="Gearizen logo"
                width={32}
                height={32}
                priority
              />
              <span className="ml-2 text-xl font-extrabold text-gray-900">
                Gearizen
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Fast, free, privacy-first web tools for developers, creators, and beyond. No signup. No tracking. 100% client-side.
            </p>
            <div className="mt-4 flex space-x-4">
              {socialLinks.map(({ href, label, icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Site Pages */}
          <nav aria-labelledby="footer-site-pages">
            <h3 id="footer-site-pages" className="text-lg font-semibold text-gray-900">
              Site Pages
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {siteLinks.map(({ label, href }) => (
                <li key={href} className="list-none">
                  <Link
                    href={href}
                    className="hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Popular Tools */}
          <nav aria-labelledby="footer-popular-tools">
            <h3 id="footer-popular-tools" className="text-lg font-semibold text-gray-900">
              Popular Tools
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {popularTools.map(({ label, href }) => (
                <li key={href} className="list-none">
                  <Link
                    href={href}
                    className="hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Built With */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Built With
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              {builtWith.map(({ label, href }) => (
                <li key={href} className="list-none">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {currentYear} Gearizen. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Crafted with ❤️ in the browser — 100% client-side, no backend.
          </p>
        </div>
      </div>
    </footer>
  );
}