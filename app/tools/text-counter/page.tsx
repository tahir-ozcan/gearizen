// app/tools/text-counter/page.tsx

import type { Metadata } from "next";
import Script from "next/script";
import TextCounterClient from "./text-counter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Word, Character & Text Counter | Gearizen",
  description:
    "Instantly count words, characters, sentences, lines and paragraphs in your text—fully client-side, privacy-first, zero signup, lightning-fast even on large inputs.",
  keywords: [
    "word counter",
    "character counter",
    "text counter",
    "sentence counter",
    "line counter",
    "paragraph counter",
    "real-time text analytics",
    "client-side text tool",
    "privacy-first text counter",
    "free online text counter",
    "Gearizen text tools"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/text-counter" },
  openGraph: {
    title: "Word, Character & Text Counter | Gearizen",
    description:
      "Count words, characters, sentences, lines and paragraphs instantly in your browser—100% client-side, privacy-first, zero signup, handles large texts with ease.",
    url: "https://gearizen.com/tools/text-counter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/text-counter.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Word & Character Counter Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Word, Character & Text Counter | Gearizen",
    description:
      "Measure words, characters, sentences, lines and paragraphs instantly—100% client-side, privacy-first, zero signup.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/text-counter.png"]
  }
};

export default function TextCounterPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Word, Character & Text Counter | Gearizen",
        url: "https://gearizen.com/tools/text-counter",
        description:
          "Instantly count words, characters, sentences, lines and paragraphs in your text—fully client-side, privacy-first, zero signup, lightning-fast even on large inputs.",
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
              name: "Word & Character Counter",
              item: "https://gearizen.com/tools/text-counter"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "Word, Character & Text Counter",
        url: "https://gearizen.com/tools/text-counter",
        applicationCategory: "UtilitiesApplication",
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
        pageTitle="Word & Character Counter"
        pageUrl="https://gearizen.com/tools/text-counter"
      />

      {/* Main client component */}
      <main>
        <TextCounterClient />
      </main>
    </>
  );
}