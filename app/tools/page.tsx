// app/tools/page.tsx

import ToolsClient from "./tools-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import JsonLd from "@/app/components/JsonLd";
import Script from "next/script";
import { getToolsData } from "@/lib/tools-data";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Free Client-Side Online Tools | Gearizen",
  description:
    "Gearizen offers 30+ privacy-first, client-side utilities—from password and UUID generators to JSON formatters, QR code creators, unit converters, image compressors, code formatters, regex testers, diff checkers, time converters, PDF/CSV tools, SEO meta and Open Graph tag generators, JWT utilities, and more—all 100% free with no signup.",
  keywords: [
    "free online tools",
    "client-side utilities",
    "privacy-first tools",
    "password generator",
    "uuid generator",
    "JSON formatter",
    "QR code generator",
    "unit converter",
    "image compressor",
    "image resizer",
    "contrast checker",
    "Base64 encoder",
    "code formatter",
    "regex tester",
    "text diff checker",
    "time converter",
    "PDF toolkit",
    "CSV converter",
    "SEO meta tags",
    "Open Graph generator",
    "JWT decoder",
    "no signup",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools" },
  openGraph: {
    title: "Free Client-Side Online Tools | Gearizen",
    description:
      "Explore Gearizen’s suite of 100% client-side, privacy-first web tools—security, conversion, compression, formatting, validation and more without signup.",
    url: "https://gearizen.com/tools",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/tools.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Client-Side Online Tools | Gearizen",
    description:
      "Discover Gearizen’s all-in-one toolbox: generators, converters, compressors, formatters, validators, and more—100% free with no signup.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/tools.png"],
    imageAlt: "Gearizen Free Online Tools",
  },
};

const { tools } = getToolsData();

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Gearizen",
  url: "https://gearizen.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://gearizen.com/tools?tool={tool}",
    "query-input": "required name=tool",
  },
};

const pageStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Free Online Tools",
  description:
    "Browse Gearizen’s free, client-side utilities for developers and creators. No signup, no tracking—just powerful browser tools.",
  url: "https://gearizen.com/tools",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://gearizen.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: "https://gearizen.com/tools",
      },
    ],
  },
  publisher: {
    "@type": "Organization",
    name: "Gearizen",
    url: "https://gearizen.com",
    logo: {
      "@type": "ImageObject",
      url: "https://gearizen.com/logo.png",
    },
  },
};

const itemListStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: tools.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `https://gearizen.com${tool.href}`,
    name: tool.title,
    description: tool.description,
  })),
};

export default function ToolsPage() {
  return (
    <>
      {/* Site-level JSON-LD for WebSite with SearchAction */}
      <JsonLd data={websiteStructuredData} />

      {/* Page-level JSON-LD */}
      <Script id="tools-page-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(pageStructuredData)}
      </Script>

      {/* Breadcrumb structured data */}
      <BreadcrumbJsonLd pageTitle="Free Online Tools" pageUrl="https://gearizen.com/tools" />

      {/* List of tools JSON-LD */}
      <JsonLd data={itemListStructuredData} />

      {/* Client-side tool listing */}
      <ToolsClient />
    </>
  );
}