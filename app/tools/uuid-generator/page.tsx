// app/tools/uuid-generator/page.tsx

import type { Metadata } from "next";
import Script from "next/script";
import UuidGeneratorClient from "./uuid-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "UUID Generator (v1 & v4) | Gearizen",
  description:
    "Generate RFC4122-compliant UUID v1 and v4 identifiers in bulk directly in your browser. Customize separators, letter case, and batch size—copy or download instantly. 100% client-side, privacy-first, no signup required.",
  keywords: [
    "uuid generator",
    "RFC4122 uuid",
    "uuid v4",
    "uuid v1",
    "bulk uuid generator",
    "random identifier",
    "client-side uuid tool",
    "free uuid generator",
    "privacy-first uuid",
    "Gearizen uuid"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/uuid-generator" },
  openGraph: {
    title: "UUID Generator (v1 & v4) | Gearizen",
    description:
      "Create RFC4122 v1 or v4 UUIDs in your browser. Configure separators, casing, and quantity, then copy or download instantly—no signup needed.",
    url: "https://gearizen.com/tools/uuid-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/uuid-generator.png",
        width: 1200,
        height: 630,
        alt: "Gearizen UUID Generator Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID Generator (v1 & v4) | Gearizen",
    description:
      "Generate bulk RFC4122 v1 & v4 UUIDs with customizable options in your browser. Fast, private, and free—no signup required.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/uuid-generator.png"]
  }
};

export default function UuidGeneratorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "UUID Generator (v1 & v4) | Gearizen",
        url: "https://gearizen.com/tools/uuid-generator",
        description:
          "Generate RFC4122-compliant UUID v1 and v4 identifiers in bulk directly in your browser. Customize separators, letter case, and batch size—copy or download instantly. 100% client-side, privacy-first, no signup required.",
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
              name: "UUID Generator",
              item: "https://gearizen.com/tools/uuid-generator"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "UUID Generator (v1 & v4)",
        url: "https://gearizen.com/tools/uuid-generator",
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

      {/* Breadcrumb navigation */}
      <BreadcrumbJsonLd
        pageTitle="UUID Generator (v1 & v4)"
        pageUrl="https://gearizen.com/tools/uuid-generator"
      />

      {/* Main tool */}
      <main>
        <UuidGeneratorClient />
      </main>
    </>
  );
}