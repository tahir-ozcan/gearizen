// app/tools/qr-code-generator/page.tsx

import type { Metadata } from "next";
import QrCodeGeneratorClient from "./qr-code-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "QR Code Generator | Gearizen",
  description:
    "Generate high-resolution QR codes for URLs, text, vCards, Wi-Fi credentials, and more with customizable size, error correction level, and color options—100% client-side, privacy-first, zero signup, instant download or copy.",
  keywords: [
    "qr code generator",
    "custom QR codes",
    "vCard QR code",
    "Wi-Fi QR code",
    "URL QR code",
    "text to QR code",
    "download QR code PNG",
    "error correction QR",
    "colored QR code",
    "client-side qr tool",
    "online qr code maker",
    "privacy-first qr generator",
    "Gearizen QR code"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/qr-code-generator" },
  openGraph: {
    title: "QR Code Generator | Gearizen",
    description:
      "Generate high-resolution QR codes for URLs, text, vCards, Wi-Fi credentials, and more with customizable size, error correction level, and color options—100% client-side, privacy-first, zero signup, instant download or copy.",
    url: "https://gearizen.com/tools/qr-code-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/qr-code-generator.png",
        width: 1200,
        height: 630,
        alt: "Gearizen QR Code Generator Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator | Gearizen",
    description:
      "Create custom QR codes for URLs, text, vCards, and Wi-Fi credentials in your browser—100% client-side, privacy-first, zero signup, instant download or copy.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/qr-code-generator.png"]
  }
};

export default function QrCodeGeneratorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "QR Code Generator | Gearizen",
        url: "https://gearizen.com/tools/qr-code-generator",
        description:
          "Generate high-resolution QR codes for URLs, text, vCards, Wi-Fi credentials, and more with customizable size, error correction level, and color options—100% client-side, privacy-first, zero signup, instant download or copy.",
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
              name: "QR Code Generator",
              item: "https://gearizen.com/tools/qr-code-generator"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "QR Code Generator",
        url: "https://gearizen.com/tools/qr-code-generator",
        applicationCategory: "Utilities",
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
        pageTitle="QR Code Generator"
        pageUrl="https://gearizen.com/tools/qr-code-generator"
      />

      {/* Main client component */}
      <main>
        <QrCodeGeneratorClient />
      </main>
    </>
  );
}