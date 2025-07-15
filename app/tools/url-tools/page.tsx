// app/tools/url-tools/page.tsx

import type { Metadata } from "next";
import Script from "next/script";
import UrlToolsClient from "./url-tools-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "URL Tools: Parse, Validate & Modify URLs | Gearizen",
  description:
    "Instantly parse, validate, encode and decode URLs in your browser. Extract hostname, path, query parameters; add, remove or update parameters; and copy or download results—100% client-side, privacy-first, zero signup, lightning-fast.",
  keywords: [
    "url tools",
    "url parser",
    "validate url",
    "encode url",
    "decode url",
    "query parameter editor",
    "add query param",
    "remove query param",
    "url components",
    "slugify url",
    "client-side url tool",
    "online url parser",
    "privacy-first url tool",
    "Gearizen url tools"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/url-tools" },
  openGraph: {
    title: "URL Tools: Parse, Validate & Modify URLs | Gearizen",
    description:
      "Parse, validate and transform URLs instantly in your browser. Manage query parameters, extract components and copy results safely—100% client-side, no signup required.",
    url: "https://gearizen.com/tools/url-tools",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/url-tools.png",
        width: 1200,
        height: 630,
        alt: "Gearizen URL Tools Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Tools: Parse, Validate & Modify URLs | Gearizen",
    description:
      "Use Gearizen’s client-side URL Tools to parse, validate and manipulate URLs—add or remove query parameters, encode/decode and copy results instantly. No signup.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/url-tools.png"]
  }
};

export default function UrlToolsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "URL Tools: Parse, Validate & Modify URLs | Gearizen",
        url: "https://gearizen.com/tools/url-tools",
        description:
          "Instantly parse, validate, encode and decode URLs in your browser. Extract hostname, path, query parameters; add, remove or update parameters; and copy or download results—100% client-side, privacy-first, zero signup, lightning-fast.",
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
              name: "URL Tools",
              item: "https://gearizen.com/tools/url-tools"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "URL Tools",
        url: "https://gearizen.com/tools/url-tools",
        applicationCategory: "DeveloperTool",
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
        pageTitle="URL Tools"
        pageUrl="https://gearizen.com/tools/url-tools"
      />

      {/* Main client component */}
      <main>
        <UrlToolsClient />
      </main>
    </>
  );
}