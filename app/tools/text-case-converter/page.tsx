// app/tools/text-case-converter/page.tsx

import type { Metadata } from "next";
import TextCaseConverterClient from "./text-case-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Text Case Converter | Gearizen",
  description:
    "Transform text instantly between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more—100% client-side, privacy-first, zero signup, lightning-fast.",
  keywords: [
    "text case converter",
    "uppercase",
    "lowercase",
    "title case",
    "sentence case",
    "camelCase",
    "snake_case",
    "kebab-case",
    "text transformation tool",
    "client-side text tool",
    "instant text case",
    "privacy-first converter",
    "Gearizen text tools"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/text-case-converter" },
  openGraph: {
    title: "Text Case Converter | Gearizen",
    description:
      "Transform text instantly between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more—100% client-side, privacy-first, zero signup.",
    url: "https://gearizen.com/tools/text-case-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/text-case-converter.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Text Case Converter Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Case Converter | Gearizen",
    description:
      "Switch text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more—fast, private, and free.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/text-case-converter.png"]
  }
};

export default function TextCaseConverterPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Text Case Converter | Gearizen",
        url: "https://gearizen.com/tools/text-case-converter",
        description:
          "Transform text instantly between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more—100% client-side, privacy-first, zero signup, lightning-fast.",
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
              name: "Text Case Converter",
              item: "https://gearizen.com/tools/text-case-converter"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "Text Case Converter",
        url: "https://gearizen.com/tools/text-case-converter",
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
        pageTitle="Text Case Converter"
        pageUrl="https://gearizen.com/tools/text-case-converter"
      />

      {/* Main client component */}
      <main>
        <TextCaseConverterClient />
      </main>
    </>
  );
}