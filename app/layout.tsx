// app/layout.tsx

import "./globals.css";
import { ReactNode } from "react";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: {
    default: "Gearizen – Free Client-Side Digital Tools",
    template: "%s | Gearizen",
  },
  description:
    "Gearizen offers fast, free, privacy-first web tools—password generators, JSON formatters, QR code creators, converters, compressors, validators, and more, all 100% client-side and signup-free.",
  keywords: [
    "Gearizen",
    "free online tools",
    "client-side utilities",
    "password generator",
    "JSON formatter",
    "QR code generator",
    "unit converter",
    "currency converter",
    "contrast checker",
    "developer tools",
    "privacy-focused",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Gearizen – Free Client-Side Digital Tools",
    description:
      "Use Gearizen’s privacy-first, client-side toolkit: password generators, JSON formatters, text transformers, and more—no signup, no tracking.",
    url: "https://gearizen.com",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen – Free Client-Side Digital Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gearizen – Free Client-Side Digital Tools",
    description:
      "Fast, private tools for developers and creators. 100% client-side. No account needed.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className="bg-white text-gray-900 antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2108375251131552"
          crossOrigin="anonymous"
        />
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-V74SWZ9H8B" />
        <Script
          id="ga-inline"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-V74SWZ9H8B');`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        {/* Accessible skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 px-4 py-2 bg-indigo-600 text-white rounded-md z-50"
        >
          Skip to main content
        </a>

        {/* Primary navigation */}
        <Navbar />

        {/* Main content area */}
        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          aria-label="Main content"
          className="flex-grow container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8"
        >
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );}
