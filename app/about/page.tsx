// app/about/page.tsx

import type { Metadata } from "next";
import Script from "next/script";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import JsonLd from "@/app/components/JsonLd";
import AboutClient from "./about-client";
import { loadAboutData } from "@/lib/about-data";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "About Gearizen | Free, Privacy-First Client-Side Web Tools",
  description:
    "Learn about Gearizen’s mission to provide free, privacy-first, client-side utilities like password generators, JSON formatters, text converters, QR code generators, and more—no signup, no tracking.",
  keywords: [
    "About Gearizen",
    "free online tools platform",
    "client-side utilities",
    "privacy first web tools",
    "no signup tools",
    "password generator",
    "JSON formatter",
    "text converter",
    "QR code generator",
    "web utilities",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/about" },
  openGraph: {
    title: "About Gearizen | Free, Privacy-First Client-Side Web Tools",
    description:
      "Discover Gearizen’s mission: to empower developers and creators with free, privacy-first, client-side web tools—no signup required.",
    url: "https://gearizen.com/about",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/about.png",
        width: 1200,
        height: 630,
        alt: "About Gearizen – Free Client-Side Web Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Gearizen | Free, Privacy-First Web Tools",
    description:
      "Get to know Gearizen—your go-to platform for free, privacy-first client-side utilities. Fast, offline-capable, and signup-free.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/about.png"],
  },
};

export default async function AboutPage() {
  const data = await loadAboutData();

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
    name: "About Gearizen",
    url: "https://gearizen.com/about",
    description:
      "Learn about Gearizen’s mission to provide free, privacy-first, client-side utilities. No signup, no tracking.",
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
          name: "About",
          item: "https://gearizen.com/about"
        }
      ]
    }
  };

  return (
    <>
      {/* Organization structured data */}
      <JsonLd data={orgJsonLd} />

      {/* WebPage structured data */}
      <Script id="webpage-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(pageJsonLd)}
      </Script>

      {/* Breadcrumb navigation structured data */}
      <BreadcrumbJsonLd pageTitle="About Us" pageUrl="https://gearizen.com/about" />

      {/* Main content */}
      <AboutClient blocks={data.blocks} />
    </>
  );
}