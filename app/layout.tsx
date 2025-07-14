// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalyticsLoader from "./components/AnalyticsLoader";
import { Inter } from "next/font/google";
import { Info } from "lucide-react";

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
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicon preload */}
        <link rel="preload" href="/favicon.ico" as="image" type="image/png" />

        {/* Preconnects */}
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-2108375251131552"
        />

        {/* Analytics Loader */}
        <AnalyticsLoader />
      </head>
      <body className="flex min-h-screen flex-col">
        {/* Launch notice */}
        <div className="bg-indigo-50 border-b border-indigo-200 text-indigo-700 px-4 py-3 flex items-center justify-center">
          <Info className="w-5 h-5 mr-2 flex-shrink-0" aria-hidden="true" />
          <div className="text-sm font-medium text-center">
            We just launched our website; some tools may be buggy or missing but we’ll fix them shortly! 🙂
            <br />
            <span className="font-normal block mt-1">
              Last updated: July 14, 2025 at 22:00 (GMT+3). For feedback, please <a href="/contact" className="underline">visit our Contact page</a>.
            </span>
          </div>
        </div>

        {/* Header */}
        <Header />

        {/* Main content area */}
        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          aria-label="Main content"
          className="flex-grow"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}