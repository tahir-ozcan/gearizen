// app/tools/seo-meta-tag-generator/page.tsx

import SeoMetaTagGeneratorClient from "./seo-meta-tag-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "SEO Meta Tag Generator | Gearizen",
  description:
    "Create fully SEO-optimized HTML meta tags for title, description, Open Graph, Twitter Cards and structured data with Gearizen’s free, client-side SEO Meta Tag Generator—zero signup, privacy-first, instant copy.",
  keywords: [
    "SEO meta tag generator",
    "HTML meta tags",
    "Open Graph tag generator",
    "Twitter Card generator",
    "schema.org JSON-LD",
    "structured data generator",
    "meta description tool",
    "meta title generator",
    "social media meta tags",
    "client-side SEO tool",
    "zero signup SEO tool",
    "privacy-first SEO",
    "Gearizen SEO tools"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/seo-meta-tag-generator" },
  openGraph: {
    title: "SEO Meta Tag Generator | Gearizen",
    description:
      "Easily generate SEO-friendly HTML meta tags for title, description, Open Graph, Twitter Cards and JSON-LD schema—100% client-side, privacy-first, no signup required.",
    url: "https://gearizen.com/tools/seo-meta-tag-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/seo-meta-tag-generator.png",
        width: 1200,
        height: 630,
        alt: "Gearizen SEO Meta Tag Generator Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Meta Tag Generator | Gearizen",
    description:
      "Generate HTML meta tags for title, description, Open Graph, Twitter Cards and structured data with Gearizen’s client-side SEO Meta Tag Generator—fast, private, and free.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/seo-meta-tag-generator.png"]
  }
};

export default function SeoMetaTagGeneratorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "SEO Meta Tag Generator | Gearizen",
        url: "https://gearizen.com/tools/seo-meta-tag-generator",
        description:
          "Create fully SEO-optimized HTML meta tags for title, description, Open Graph, Twitter Cards and structured data with Gearizen’s free, client-side SEO Meta Tag Generator—zero signup, privacy-first, instant copy.",
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
              name: "SEO Meta Tag Generator",
              item: "https://gearizen.com/tools/seo-meta-tag-generator"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "SEO Meta Tag Generator",
        url: "https://gearizen.com/tools/seo-meta-tag-generator",
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
      <Script
        id="ld-json"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>

      {/* Breadcrumb structured data */}
      <BreadcrumbJsonLd
        pageTitle="SEO Meta Tag Generator"
        pageUrl="https://gearizen.com/tools/seo-meta-tag-generator"
      />

      {/* Main client component */}
      <main>
        <SeoMetaTagGeneratorClient />
      </main>
    </>
  );
}