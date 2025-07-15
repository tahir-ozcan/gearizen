// app/tools/regex-tester/page.tsx

import type { Metadata } from "next";
import RegexTesterClient from "./regex-tester-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Regex Tester & Debugger | Gearizen",
  description:
    "Test, debug and visualize your regular expressions in real time: enter pattern, flags and input text to see matches, groups and replacements instantly. Supports multiline, Unicode, lookarounds, and common flavors—100% client-side, privacy-first, zero signup.",
  keywords: [
    "regex tester",
    "regular expression tester",
    "regex debugger",
    "online regex tool",
    "test regex",
    "debug regex",
    "regex visualizer",
    "multiline regex",
    "unicode regex",
    "client-side regex",
    "free regex tester",
    "Gearizen regex"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/regex-tester" },
  openGraph: {
    title: "Regex Tester & Debugger | Gearizen",
    description:
      "Test, debug and visualize your regular expressions in real time: enter pattern, flags and input text to see matches, groups and replacements instantly. Supports multiline, Unicode, lookarounds, and common flavors—100% client-side, privacy-first, zero signup.",
    url: "https://gearizen.com/tools/regex-tester",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/regex-tester.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Regex Tester & Debugger Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Regex Tester & Debugger | Gearizen",
    description:
      "Test, debug and visualize your regular expressions in real time—100% client-side, privacy-first, zero signup.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/regex-tester.png"]
  }
};

export default function RegexTesterPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Regex Tester & Debugger | Gearizen",
        url: "https://gearizen.com/tools/regex-tester",
        description:
          "Test, debug and visualize your regular expressions in real time: enter pattern, flags and input text to see matches, groups and replacements instantly. Supports multiline, Unicode, lookarounds, and common flavors—100% client-side, privacy-first, zero signup.",
        publisher: {
          "@type": "Organization",
          name: "Gearizen",
          url: "https://gearizen.com",
          logo: {
            "@type": "ImageObject",
            url: "https://gearizen.com/logo.png"
          }
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://gearizen.com"
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Tools",
              item: "https://gearizen.com/tools"
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Regex Tester & Debugger",
              item: "https://gearizen.com/tools/regex-tester"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "Regex Tester & Debugger",
        url: "https://gearizen.com/tools/regex-tester",
        applicationCategory: "DeveloperTools",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        publisher: {
          "@type": "Organization",
          name: "Gearizen",
          url: "https://gearizen.com"
        }
      }
    ]
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      {/* Breadcrumb structured data */}
      <BreadcrumbJsonLd
        pageTitle="Regex Tester & Debugger"
        pageUrl="https://gearizen.com/tools/regex-tester"
      />

      {/* Main client component */}
      <main>
        <RegexTesterClient />
      </main>
    </>
  );
}