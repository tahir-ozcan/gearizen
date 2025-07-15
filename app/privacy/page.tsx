// app/privacy/page.tsx

import type { Metadata } from "next";
import PrivacyClient from "./privacy-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import JsonLd from "@/app/components/JsonLd";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Privacy Policy | Gearizen — Client-Side, No Data Collection",
  description:
    "Gearizen’s privacy policy explains that every tool runs entirely in your browser: we collect no personal data, track no users, and store nothing—ensuring 100% privacy-first utilities for developers, designers, and creators.",
  keywords: [
    "Gearizen privacy policy",
    "client-side privacy",
    "no data collection",
    "no tracking",
    "privacy-first web tools",
    "GDPR compliance",
    "CCPA compliance",
    "data protection",
    "web tool privacy",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/privacy" },
  openGraph: {
    title: "Privacy Policy | Gearizen",
    description:
      "Discover how Gearizen safeguards your privacy: all our tools run fully client-side without collecting or storing any personal data. No tracking, no leaks—just privacy-first utilities.",
    url: "https://gearizen.com/privacy",
    siteName: "Gearizen",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://gearizen.com/og/privacy.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Privacy Policy Overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Gearizen",
    description:
      "Learn why Gearizen requires no data collection or tracking: our tools run fully client-side to safeguard your privacy with zero compromise.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/privacy.png"],
  },
};

export default function PrivacyPage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: "https://gearizen.com",
    name: "Gearizen",
    logo: "https://gearizen.com/logo.png",
    sameAs: [
      "https://twitter.com/gearizen",
      "https://github.com/gearizen",
      "https://linkedin.com/company/gearizen",
    ],
  };

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: "https://gearizen.com/privacy",
    name: "Privacy Policy",
    description:
      "Gearizen’s privacy policy: all tools run fully client-side with no data collection, tracking, or storage—100% privacy-first.",
    publisher: {
      "@type": "Organization",
      name: "Gearizen",
      url: "https://gearizen.com",
      logo: {
        "@type": "ImageObject",
        url: "https://gearizen.com/logo.png",
      },
    },
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
          name: "Privacy Policy",
          item: "https://gearizen.com/privacy",
        },
      ],
    },
  };

  return (
    <>
      {/* Organization structured data */}
      <JsonLd data={orgJsonLd} />

      {/* WebPage structured data */}
      <Script id="privacy-page-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(pageJsonLd)}
      </Script>

      {/* Breadcrumb navigation */}
      <BreadcrumbJsonLd pageTitle="Privacy Policy" pageUrl="https://gearizen.com/privacy" />

      {/* Main content */}
      <PrivacyClient />
    </>
  );
}