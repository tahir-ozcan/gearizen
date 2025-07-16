// app/tools/base64-encoder-decoder/page.tsx
import { Metadata } from "next";
import Script from "next/script";
import Base64EncoderDecoderClient from "./base64-encoder-decoder-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Base64 Encoder & Decoder | Gearizen",
  description:
    "Convert text and files to and from Base64 with drag-and-drop support—fully client-side, privacy-first, zero signup, instant results.",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "Base64 converter",
    "online Base64 encoder decoder",
    "drag and drop Base64",
    "file to Base64",
    "text to Base64",
    "offline Base64 tool",
    "privacy-first Base64",
    "Gearizen Base64 tool",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/base64-encoder-decoder" },
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
        alt: "Gearizen Base64 Encoder & Decoder Preview",
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
        alt: "Preview of Gearizen Base64 Encoder & Decoder",
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Base64 Encoder & Decoder | Gearizen",
      url: "https://gearizen.com/tools/base64-encoder-decoder",
      description:
        "Convert text and files to and from Base64 with drag-and-drop support—fully client-side, privacy-first, zero signup, instant results.",
      publisher: {
        "@type": "Organization",
        name: "Gearizen",
        url: "https://gearizen.com",
        logo: {
          "@type": "ImageObject",
          url: "https://gearizen.com/logo.png",
        },
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

export default function Base64EncoderDecoderPage() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>
      <Base64EncoderDecoderClient />
    </>
  );
}