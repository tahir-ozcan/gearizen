// app/terms/page.tsx

import type { Metadata } from "next";
import TermsClient from "./terms-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import JsonLd from "@/app/components/JsonLd";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Terms of Use | Gearizen — Client-Side Tools, No Signup Required",
  description:
    "Review Gearizen’s Terms of Use: the legal agreement governing access to our free, privacy-first client-side web tools. No signup, no data collection, just powerful utilities in your browser.",
  keywords: [
    "Gearizen terms of use",
    "terms of service",
    "terms and conditions",
    "client-side tools legal",
    "privacy-first tools policy",
    "web tools user agreement",
    "no signup TOS",
    "free online utilities legal",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/terms" },
  openGraph: {
    title: "Terms of Use | Gearizen",
    description:
      "Read the Terms of Use for Gearizen’s suite of free, client-side web tools—password generators, JSON formatters, QR code creators, and more. No login required.",
    url: "https://gearizen.com/terms",
    siteName: "Gearizen",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://gearizen.com/og/terms.png",
        width: 1200,
        height: 630,
        alt: "Terms of Use | Gearizen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use | Gearizen",
    description:
      "Explore Gearizen’s Terms of Use for our free, privacy-focused client-side web tools—no signup or data tracking required.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/terms.png"],
  },
};

export default function TermsPage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Gearizen",
    url: "https://gearizen.com",
    logo: "https://gearizen.com/logo.png",
    sameAs: [
      "https://twitter.com/gearizen",
      "https://github.com/gearizen",
      "https://linkedin.com/company/gearizen"
    ]
  };

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Use",
    description:
      "Gearizen’s Terms of Use: legal guidelines for using our free, client-side web tools without signup or data collection.",
    url: "https://gearizen.com/terms",
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
          name: "Terms of Use",
          item: "https://gearizen.com/terms"
        }
      ]
    }
  };

  return (
    <>
      {/* Organization structured data */}
      <JsonLd data={orgJsonLd} />

      {/* WebPage JSON-LD */}
      <Script id="terms-page-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(pageJsonLd)}
      </Script>

      {/* Breadcrumb */}
      <BreadcrumbJsonLd pageTitle="Terms of Use" pageUrl="https://gearizen.com/terms" />

      {/* Main content */}
      <TermsClient />
    </>
  );
}