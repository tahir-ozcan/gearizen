// app/tools/sitemap-generator/page.tsx

import type { Metadata } from "next";
import Script from "next/script";
import SitemapGeneratorClient from "./sitemap-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Sitemap Generator | Gearizen",
  description:
    "Generate a standards-compliant XML sitemap by pasting one URL per line. Instantly preview, copy or download your sitemap—100% client-side, privacy-first, zero signup, lightning-fast, supports up to thousands of URLs.",
  keywords: [
    "sitemap generator",
    "XML sitemap generator",
    "create sitemap",
    "SEO sitemap",
    "online sitemap tool",
    "large sitemap",
    "client-side sitemap generator",
    "free sitemap generator",
    "privacy-first SEO tool",
    "Gearizen sitemap tool"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/sitemap-generator" },
  openGraph: {
    title: "Sitemap Generator | Gearizen",
    description:
      "Create a valid XML sitemap by pasting your URLs—copy or download instantly. Gearizen’s client-side Sitemap Generator makes SEO easy with no signup required.",
    url: "https://gearizen.com/tools/sitemap-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/sitemap-generator.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Sitemap Generator Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitemap Generator | Gearizen",
    description:
      "Paste URLs to generate your XML sitemap instantly—copy or download, all in your browser with Gearizen’s free Sitemap Generator. No signup needed.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/sitemap-generator.png"]
  }
};

export default function SitemapGeneratorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Sitemap Generator | Gearizen",
        url: "https://gearizen.com/tools/sitemap-generator",
        description:
          "Generate a standards-compliant XML sitemap by pasting one URL per line. Instantly preview, copy or download your sitemap—100% client-side, privacy-first, zero signup, lightning-fast.",
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
              name: "Sitemap Generator",
              item: "https://gearizen.com/tools/sitemap-generator"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "Sitemap Generator",
        url: "https://gearizen.com/tools/sitemap-generator",
        applicationCategory: "SEOApplication",
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
        pageTitle="Sitemap Generator"
        pageUrl="https://gearizen.com/tools/sitemap-generator"
      />

      {/* Main client component */}
      <main>
        <SitemapGeneratorClient />
      </main>
    </>
  );
}