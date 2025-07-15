// app/tools/text-diff/page.tsx

import type { Metadata } from "next";
import Script from "next/script";
import TextDiffClient from "./text-diff-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Text Diff Checker & Visualizer | Gearizen",
  description:
    "Visually compare two blocks of text side-by-side and highlight additions in green and deletions in red—100% client-side, privacy-first, zero signup, lightning-fast even on large documents.",
  keywords: [
    "text diff",
    "diff checker",
    "text comparison",
    "diff visualizer",
    "highlight changes",
    "additions and deletions",
    "side-by-side diff",
    "inline diff",
    "online diff tool",
    "client-side diff",
    "privacy-first diff checker",
    "free text diff",
    "Gearizen diff"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/text-diff" },
  openGraph: {
    title: "Text Diff Checker & Visualizer | Gearizen",
    description:
      "Compare two text blocks side-by-side with Gearizen’s Text Diff Checker—additions highlighted in green, deletions in red. Fully client-side, no signup, instant results.",
    url: "https://gearizen.com/tools/text-diff",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/text-diff.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Text Diff Checker Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Diff Checker & Visualizer | Gearizen",
    description:
      "Detect additions and deletions between two texts instantly—100% client-side, privacy-first, zero signup with Gearizen’s Text Diff Checker.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/text-diff.png"]
  }
};

export default function TextDiffPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Text Diff Checker & Visualizer | Gearizen",
        url: "https://gearizen.com/tools/text-diff",
        description:
          "Visually compare two blocks of text side-by-side and highlight additions in green and deletions in red—100% client-side, privacy-first, zero signup, lightning-fast even on large documents.",
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
              name: "Text Diff Checker & Visualizer",
              item: "https://gearizen.com/tools/text-diff"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "Text Diff Checker & Visualizer",
        url: "https://gearizen.com/tools/text-diff",
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
      {/* JSON-LD structured data for SEO */}
      <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      {/* Breadcrumb structured data */}
      <BreadcrumbJsonLd
        pageTitle="Text Diff Checker & Visualizer"
        pageUrl="https://gearizen.com/tools/text-diff"
      />

      {/* Main client component */}
      <main>
        <TextDiffClient />
      </main>
    </>
  );
}