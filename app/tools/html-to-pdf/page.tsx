// app/tools/html-to-pdf/page.tsx

import type { Metadata } from "next";
import Script from "next/script";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import HtmlToPdfClient from "./html-to-pdf-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "HTML to PDF Converter | Gearizen",
  description:
    "Convert any HTML markup or full webpages into high-fidelity PDF documents instantly in your browser—fully client-side, privacy-first, zero signup, custom page sizes, orientations, margins, and seamless handling of large files.",
  keywords: [
    "html to pdf converter",
    "client-side pdf generator",
    "webpage to pdf",
    "download pdf",
    "offline pdf tool",
    "html converter",
    "gearizen pdf converter",
    "zero signup pdf",
    "privacy-first pdf",
    "pdf export tool",
    "html to pdf offline",
    "web to pdf",
    "custom page size pdf",
    "pdf margins",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/html-to-pdf" },
  openGraph: {
    title: "HTML to PDF Converter | Gearizen",
    description:
      "Convert any HTML markup or full webpages into high-fidelity PDF documents instantly in your browser—fully client-side, privacy-first, zero signup, custom page sizes, orientations, margins, and seamless handling of large files.",
    url: "https://gearizen.com/tools/html-to-pdf",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/html-to-pdf.png",
        width: 1200,
        height: 630,
        alt: "Gearizen HTML to PDF Converter Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HTML to PDF Converter | Gearizen",
    description:
      "Convert any HTML markup or full webpages into high-fidelity PDF documents instantly in your browser—fully client-side, privacy-first, zero signup, custom page sizes, orientations, margins, and seamless handling of large files.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/html-to-pdf.png"],
  },
};

export default function HtmlToPdfPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "HTML to PDF Converter | Gearizen",
        url: "https://gearizen.com/tools/html-to-pdf",
        description:
          "Convert any HTML markup or full webpages into high-fidelity PDF documents instantly in your browser—fully client-side, privacy-first, zero signup, custom page sizes, orientations, margins, and seamless handling of large files.",
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
              name: "HTML to PDF Converter",
              item: "https://gearizen.com/tools/html-to-pdf",
            },
          ],
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "HTML to PDF Converter",
        url: "https://gearizen.com/tools/html-to-pdf",
        applicationCategory: "DeveloperTools",
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
      {/* JSON-LD structured data */}
      <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      {/* Breadcrumb structured data */}
      <BreadcrumbJsonLd
        pageTitle="HTML to PDF Converter"
        pageUrl="https://gearizen.com/tools/html-to-pdf"
      />

      {/* Main client component */}
      <main>
        <HtmlToPdfClient />
      </main>
    </>
  );
}