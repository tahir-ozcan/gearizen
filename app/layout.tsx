// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalyticsLoader from "./components/AnalyticsLoader";
import { Inter } from "next/font/google";
import { Info } from "lucide-react";

// Optional Google Search Console verification code
const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: {
    default: "Gearizen – Free Client-Side Digital Tools",
    template: "%s",
  },
  description:
    "Gearizen provides fast, free, privacy-first web tools—password generators, JSON formatters, QR code creators, converters, compressors, validators, and more. 100% client-side, no signup required.",
  keywords: [
    "Gearizen",
    "free online tools",
    "client-side utilities",
    "password generator",
    "JSON formatter",
    "QR code generator",
    "unit converter",
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
      className={`${inter.className} bg-white text-gray-900 antialiased scroll-smooth`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={GOOGLE_SITE_VERIFICATION}
          />
        )}

        {/* Favicons */}
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="alternate icon" href="/favicon.ico" type="image/x-icon" />

        {/* Preconnect for analytics & ads */}
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
          crossOrigin="anonymous"
        />

        {/* AdSense publisher ID */}
        <meta name="google-adsense-account" content="ca-pub-2108375251131552" />

        {/* Analytics scripts */}
        <AnalyticsLoader />
      </head>
      <body className="flex min-h-screen flex-col">
        {/* Launch banner */}
        <aside className="bg-indigo-50 border-b border-indigo-200 text-indigo-700 px-4 py-3 flex justify-center">
          <Info className="flex-shrink-0 mr-2 h-5 w-5" aria-hidden="true" />
          <div className="text-sm font-medium text-center">
            We just launched our site! Some tools may be incomplete or buggy —
            we’re fixing them now.
            <p className="mt-1 font-normal">
              Last updated: July 16, 2025 at 21:00 (GMT+3). Feedback?{" "}
              <a href="/contact" className="underline hover:text-indigo-800">
                Contact us
              </a>
              .
            </p>
          </div>
        </aside>

        {/* Header */}
        <Header />

        {/* Main content */}
        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          aria-label="Main content"
          className="flex-grow"
        >
          <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
