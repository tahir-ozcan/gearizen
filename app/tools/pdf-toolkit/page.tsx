// app/tools/pdf-toolkit/page.tsx
import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import Script from "next/script";
import PdfToolkitWrapper from "./pdf-toolkit-wrapper-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "PDF Toolkit: Compress & Extract Text | Gearizen",
  description:
    "Shrink PDF file sizes without quality loss and extract text into editable Word documents—fully in-browser and offline. 100% client-side, privacy-first, zero signup, lightning-fast.",
  keywords: [
    "PDF toolkit",
    "PDF compressor",
    "shrink PDF",
    "PDF shrinker",
    "extract text from PDF",
    "PDF to Word converter",
    "client-side PDF tool",
    "online PDF compressor",
    "offline PDF tool",
    "free PDF toolkit",
    "privacy-first PDF tool",
    "Gearizen PDF Toolkit",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/pdf-toolkit" },
  openGraph: {
    title: "PDF Toolkit: Compress & Extract Text | Gearizen",
    description:
      "Shrink PDF file sizes without quality loss and extract text into editable Word documents—fully in-browser and offline. 100% client-side, privacy-first, zero signup, lightning-fast.",
    url: "https://gearizen.com/tools/pdf-toolkit",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/pdf-toolkit.png",
        width: 1200,
        height: 630,
        alt: "Gearizen PDF Toolkit Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Toolkit: Compress & Extract Text | Gearizen",
    description:
      "Shrink PDF file sizes without quality loss and extract text into editable Word documents—fully in-browser and offline. 100% client-side, privacy-first, zero signup, lightning-fast.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/pdf-toolkit.png"],
  },
};

export default function PdfToolkitPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "PDF Toolkit: Compress & Extract Text | Gearizen",
        url: "https://gearizen.com/tools/pdf-toolkit",
        description:
          "Shrink PDF file sizes without quality loss and extract text into editable Word documents—fully in-browser and offline. 100% client-side, privacy-first, zero signup, lightning-fast.",
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
              name: "PDF Toolkit",
              item: "https://gearizen.com/tools/pdf-toolkit",
            },
          ],
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "PDF Toolkit",
        url: "https://gearizen.com/tools/pdf-toolkit",
        applicationCategory: "DeveloperTool",
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
      <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      <BreadcrumbJsonLd
        pageTitle="PDF Toolkit"
        pageUrl="https://gearizen.com/tools/pdf-toolkit"
      />

      <main>
        <PdfToolkitWrapper />
      </main>
    </>
  );
}