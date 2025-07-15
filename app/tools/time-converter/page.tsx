// app/tools/time-converter/page.tsx

import type { Metadata } from "next";
import Script from "next/script";
import TimeConverterClient from "./time-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Time Converter & Timezone Tool | Gearizen",
  description:
    "Instantly convert dates and times between any time zones—paste or pick a date/time, choose source and target zones, and get accurate results in your browser. 100% client-side, privacy-first, zero signup, lightning-fast.",
  keywords: [
    "time converter",
    "timezone converter",
    "convert time zones",
    "local time to UTC",
    "UTC to local time",
    "world clock",
    "time zone tool",
    "date time converter",
    "UNIX timestamp converter",
    "client-side time converter",
    "online time converter",
    "free time zone tool",
    "privacy-first time tool",
    "Gearizen time converter"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/time-converter" },
  openGraph: {
    title: "Time Converter & Timezone Tool | Gearizen",
    description:
      "Convert dates and times between any time zones with Gearizen’s free, client-side Time Converter—paste or pick a date/time, select zones, and get instant, accurate results. No signup required.",
    url: "https://gearizen.com/tools/time-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/time-converter.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Time Converter & Timezone Tool Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Converter & Timezone Tool | Gearizen",
    description:
      "Use Gearizen’s client-side Time Converter to switch dates and times across any time zones—fast, private, and free, with no signup required.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/time-converter.png"]
  }
};

export default function TimeConverterPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Time Converter & Timezone Tool | Gearizen",
        url: "https://gearizen.com/tools/time-converter",
        description:
          "Instantly convert dates and times between any time zones—paste or pick a date/time, choose source and target zones, and get accurate results in your browser. 100% client-side, privacy-first, zero signup, lightning-fast.",
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
              name: "Time Converter",
              item: "https://gearizen.com/tools/time-converter"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "Time Converter & Timezone Tool",
        url: "https://gearizen.com/tools/time-converter",
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

      {/* Breadcrumb for navigation */}
      <BreadcrumbJsonLd
        pageTitle="Time Converter"
        pageUrl="https://gearizen.com/tools/time-converter"
      />

      {/* Main conversion tool */}
      <main>
        <TimeConverterClient />
      </main>
    </>
  );
}