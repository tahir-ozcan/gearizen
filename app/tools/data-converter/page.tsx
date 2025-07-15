// app/tools/data-converter/page.tsx

import DataConverterClient from "./data-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Data Converter | Gearizen",
  description:
    "Effortlessly transform data between CSV, JSON, YAML & XML formats in your browser—fully client-side, privacy-first, zero signup, lightning-fast, handles large datasets with ease.",
  keywords: [
    "data converter",
    "csv to json",
    "json to csv",
    "yaml to json",
    "json to yaml",
    "xml to json",
    "json to xml",
    "csv to xml",
    "xml to csv",
    "csv yaml xml json converter",
    "data transformation tool",
    "client-side data converter",
    "online data converter",
    "large dataset converter",
    "zero signup data tool",
    "privacy-first data converter",
    "Gearizen data tools"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://gearizen.com/tools/data-converter"
  },
  openGraph: {
    title: "Data Converter | Gearizen",
    description:
      "Effortlessly transform data between CSV, JSON, YAML & XML formats in your browser—fully client-side, privacy-first, zero signup, lightning-fast, handles large datasets with ease.",
    url: "https://gearizen.com/tools/data-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/data-converter.png",
        width: 1200,
        height: 630,
        alt: "Preview of Gearizen Data Converter"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Converter | Gearizen",
    description:
      "Effortlessly transform data between CSV, JSON, YAML & XML formats in your browser—fully client-side, privacy-first, zero signup, lightning-fast, handles large datasets with ease.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/data-converter.png"],
    imageAlt: "Preview of Gearizen Data Converter"
  }
};

export default function DataConverterPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Data Converter | Gearizen",
        url: "https://gearizen.com/tools/data-converter",
        description:
          "Effortlessly transform data between CSV, JSON, YAML & XML formats in your browser—fully client-side, privacy-first, zero signup, lightning-fast, handles large datasets with ease.",
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
              name: "Data Converter",
              item: "https://gearizen.com/tools/data-converter"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "Data Converter",
        url: "https://gearizen.com/tools/data-converter",
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
      {/* JSON-LD structured data for SEO */}
      <Script
        id="ld-json"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>

      {/* Breadcrumb JSON-LD */}
      <BreadcrumbJsonLd
        pageTitle="Data Converter"
        pageUrl="https://gearizen.com/tools/data-converter"
      />

      {/* Main converter UI */}
      <main>
        <DataConverterClient />
      </main>
    </>
  );
}