// app/tools/json-formatter/page.tsx

import type { Metadata } from "next";
import JsonFormatterClient from "./json-formatter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Free JSON Formatter & Validator | Gearizen",
  description:
    "Format, validate, beautify, minify and lint JSON data instantly in your browser—100% client-side, privacy-first, zero signup, handles large files with lightning speed. Copy or download your results effortlessly.",
  keywords: [
    "JSON formatter",
    "JSON validator",
    "beautify JSON",
    "minify JSON",
    "lint JSON",
    "JSON error checking",
    "prettify JSON",
    "parse JSON",
    "format JSON online",
    "client-side JSON tool",
    "large JSON formatter",
    "no signup JSON tool",
    "privacy-first JSON formatter",
    "Gearizen JSON tools"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/json-formatter" },
  openGraph: {
    title: "Free JSON Formatter & Validator | Gearizen",
    description:
      "Format, validate, beautify, minify and lint JSON data instantly in your browser—100% client-side, privacy-first, zero signup, handles large files with lightning speed. Copy or download your results effortlessly.",
    url: "https://gearizen.com/tools/json-formatter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/json-formatter.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Free JSON Formatter & Validator Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JSON Formatter & Validator | Gearizen",
    description:
      "Format, validate, beautify, minify and lint JSON data instantly in your browser—100% client-side, privacy-first, zero signup, handles large files with lightning speed.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/json-formatter.png"]
  }
};

export default function JsonFormatterPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Free JSON Formatter & Validator | Gearizen",
        url: "https://gearizen.com/tools/json-formatter",
        description:
          "Format, validate, beautify, minify and lint JSON data instantly in your browser—100% client-side, privacy-first, zero signup, handles large files with lightning speed. Copy or download your results effortlessly.",
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
              name: "JSON Formatter & Validator",
              item: "https://gearizen.com/tools/json-formatter"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "JSON Formatter & Validator",
        url: "https://gearizen.com/tools/json-formatter",
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
      {/* JSON-LD for structured data */}
      <Script
        id="ld-json"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>

      {/* Breadcrumb structured data */}
      <BreadcrumbJsonLd
        pageTitle="Free JSON Formatter & Validator"
        pageUrl="https://gearizen.com/tools/json-formatter"
      />

      {/* Main client component */}
      <main>
        <JsonFormatterClient />
      </main>
    </>
  );
}