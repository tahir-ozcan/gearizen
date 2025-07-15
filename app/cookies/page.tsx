// app/cookies/page.tsx

import type { Metadata } from "next";
import Script from "next/script";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import JsonLd from "@/app/components/JsonLd";
import CookiesClient from "./cookies-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Cookie Policy | Gearizen — Privacy & Cookie Information",
  description:
    "Gearizen uses no first-party cookies; third-party advertising and analytics cookies may be set. Read our full cookie policy and learn how to manage your preferences.",
  keywords: [
    "cookie policy",
    "cookies",
    "third-party cookies",
    "analytics cookies",
    "advertising cookies",
    "privacy policy",
    "cookie management",
    "opt out cookies",
    "Gearizen privacy"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/cookies" },
  openGraph: {
    title: "Cookie Policy | Gearizen",
    description:
      "Gearizen does not set first-party cookies. Third-party networks may set analytics or advertising cookies—learn how to opt out or manage your settings.",
    url: "https://gearizen.com/cookies",
    siteName: "Gearizen",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://gearizen.com/og/cookies.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Cookie Policy"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy | Gearizen",
    description:
      "Learn about Gearizen’s cookie policy: no first-party cookies, with optional third-party analytics and advertising cookies. Manage your preferences anytime.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/cookies.png"],
  }
};

export default function CookiePage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Gearizen",
    url: "https://gearizen.com",
    logo: {
      "@type": "ImageObject",
      url: "https://gearizen.com/logo.png"
    },
    sameAs: [
      "https://twitter.com/gearizen",
      "https://github.com/gearizen",
      "https://linkedin.com/company/gearizen"
    ]
  };

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cookie Policy",
    url: "https://gearizen.com/cookies",
    description:
      "Gearizen uses no first-party cookies; third-party networks may set analytics or advertising cookies. Learn how to manage and opt out.",
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
          name: "Cookie Policy",
          item: "https://gearizen.com/cookies"
        }
      ]
    }
  };

  return (
    <>
      {/* Organization structured data */}
      <JsonLd data={orgJsonLd} />

      {/* WebPage structured data */}
      <Script id="cookie-page-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(pageJsonLd)}
      </Script>

      {/* Breadcrumb navigation */}
      <BreadcrumbJsonLd pageTitle="Cookie Policy" pageUrl="https://gearizen.com/cookies" />

      {/* Main client component */}
      <CookiesClient />
    </>
  );
}