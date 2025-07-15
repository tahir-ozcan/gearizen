// app/tools/unit-converter/page.tsx

import type { Metadata } from "next";
import Script from "next/script";
import UnitConverterClient from "./unit-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Unit Converter | Gearizen",
  description:
    "Instantly convert length, weight, volume, temperature, time, data and more between metric & imperial units—fully client-side, privacy-first, zero signup, lightning-fast.",
  keywords: [
    "unit converter",
    "convert units",
    "length converter",
    "weight converter",
    "volume converter",
    "temperature converter",
    "time converter",
    "data converter",
    "metric to imperial",
    "imperial to metric",
    "client-side converter",
    "free online converter",
    "privacy-first tool",
    "Gearizen unit converter"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/unit-converter" },
  openGraph: {
    title: "Unit Converter | Gearizen",
    description:
      "Convert between meters, miles, kilograms, pounds, liters, gallons, Celsius, Fahrenheit, seconds, hours, bytes and more in your browser—no signup required.",
    url: "https://gearizen.com/tools/unit-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/unit-converter.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Unit Converter Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Unit Converter | Gearizen",
    description:
      "Use Gearizen’s client-side Unit Converter to instantly switch between metric & imperial units for length, weight, volume, temperature, time, data and more—fast, private, and free.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/unit-converter.png"]
  }
};

export default function UnitConverterPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Unit Converter | Gearizen",
        url: "https://gearizen.com/tools/unit-converter",
        description:
          "Instantly convert length, weight, volume, temperature, time, data and more between metric & imperial units—fully client-side, privacy-first, zero signup, lightning-fast.",
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
              name: "Unit Converter",
              item: "https://gearizen.com/tools/unit-converter"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "Unit Converter",
        url: "https://gearizen.com/tools/unit-converter",
        applicationCategory: "UtilitiesApplication",
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
        pageTitle="Unit Converter"
        pageUrl="https://gearizen.com/tools/unit-converter"
      />

      {/* Main client component */}
      <main>
        <UnitConverterClient />
      </main>
    </>
  );
}