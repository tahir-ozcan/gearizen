// components/Footer.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import JsonLd from "@/app/components/JsonLd";

const FaGithub = dynamic(() => import("react-icons/fa").then(m => m.FaGithub), {
  ssr: false,
});
const FaTwitter = dynamic(() => import("react-icons/fa").then(m => m.FaTwitter), {
  ssr: false,
});
const FaLinkedin = dynamic(
  () => import("react-icons/fa").then(m => m.FaLinkedin),
  { ssr: false }
);

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
    { label: "PDF → Word Converter", href: "/tools/pdf-to-word" },
    { label: "QR Code Generator", href: "/tools/qr-code-generator" },
    { label: "Unit Converter", href: "/tools/unit-converter" },
    { label: "Image Compressor", href: "/tools/image-compressor" },
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
      label: "GitHub",
      icon: <FaGithub className="w-6 h-6" aria-hidden="true" />,
    },
    {
      href: "https://twitter.com/gearizen",
      label: "Twitter",
      icon: <FaTwitter className="w-6 h-6" aria-hidden="true" />,
    },
    {
      href: "https://linkedin.com/company/gearizen",
      label: "LinkedIn",
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

  return (
    <footer role="contentinfo" className="bg-white border-t border-gray-200">
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand + Tagline */}
          <section aria-labelledby="footer-brand">
            <h2 id="footer-brand" className="sr-only">
              Gearizen
            </h2>
            <Link
              href="/"
              aria-label="Go to Gearizen homepage"
              className="flex items-center mb-4"
            >
              <Image
                src="/favicon.png"
                alt="Gearizen logo"
                width={32}
                height={32}
                loading="lazy"
              />
              <span className="ml-2 text-xl font-extrabold text-gray-900">
                Gearizen
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Fast, free, privacy-first web tools for developers, creators, and
              beyond. No signup. No tracking. 100% client-side.
            </p>
            <nav aria-label="Social links" className="mt-4">
              <ul className="flex space-x-4">
                {socialLinks.map(({ href, label, icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded transition-colors"
                    >
                      <span className="sr-only">{label}</span>
                      {icon}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          {/* Site Pages */}
          <nav aria-labelledby="footer-site-pages">
            <h3
              id="footer-site-pages"
              className="text-lg font-semibold text-gray-900"
            >
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
            <h3
              id="footer-popular-tools"
              className="text-lg font-semibold text-gray-900"
            >
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
          <nav aria-labelledby="footer-built-with">
            <h3
              id="footer-built-with"
              className="text-lg font-semibold text-gray-900"
            >
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
          </nav>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {currentYear} Gearizen. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Crafted with ❤️ in the browser — 100% client-side, no backend.
          </p>
        </div>
        <JsonLd data={organizationJsonLd} />
      </div>
    </footer>
  );
}
