import Base64EncoderDecoderClient from "./base64-encoder-decoder-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import Script from "next/script";
import { Metadata } from "next";

/**
 * Page metadata for SEO, Open Graph, and Twitter cards.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Base64 Encoder & Decoder | Gearizen",
  description:
    "Convert text and files to and from Base64 with drag-and-drop support—fully client-side, privacy-first, zero signup, instant results.",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "online Base64 converter",
    "drag-and-drop Base64",
    "privacy-first tool",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://gearizen.com/tools/base64-encoder-decoder",
  },
  openGraph: {
    title: "Base64 Encoder & Decoder | Gearizen",
    description:
      "Convert text and files to and from Base64 with drag-and-drop support—fully client-side, privacy-first, zero signup, instant results.",
    url: "https://gearizen.com/tools/base64-encoder-decoder",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/base64-encoder-decoder.png",
        width: 1200,
        height: 630,
        alt: "Preview of the Base64 Encoder & Decoder tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encoder & Decoder | Gearizen",
    description:
      "Convert text and files to and from Base64 with drag-and-drop support—fully client-side, privacy-first, zero signup, instant results.",
    creator: "@gearizen",
    images: [
      {
        url: "https://gearizen.com/og/base64-encoder-decoder.png",
        alt: "Base64 Encoder & Decoder Preview",
      },
    ],
  },
};

/**
 * Base64 Encoder & Decoder Page
 *
 * Embeds the client-side tool and injects JSON-LD for structured data.
 */
export default function Base64EncoderDecoderPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: metadata.title,
        url: metadata.alternates?.canonical,
        description: metadata.description,
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
              name: "Tools",
              item: "https://gearizen.com/tools",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Base64 Encoder & Decoder",
              item:
                "https://gearizen.com/tools/base64-encoder-decoder",
            },
          ],
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Base64 Encoder & Decoder",
        url: "https://gearizen.com/tools/base64-encoder-decoder",
        applicationCategory: "Utilities",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: {
          "@type": "Organization",
          name: "Gearizen",
          url: "https://gearizen.com",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>

      <BreadcrumbJsonLd
        pageTitle="Base64 Encoder & Decoder"
        pageUrl="https://gearizen.com/tools/base64-encoder-decoder"
      />

      <main className="container mx-auto px-4 py-8">
        <Base64EncoderDecoderClient
          initialMode="encode"
          // Pass custom translations, theme, or layout props here if needed
        />
      </main>
    </>
  );
}