// app/tools/markdown-converter/page.tsx

import type { Metadata } from "next";
import MarkdownConverterClient from "./markdown-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Markdown Converter & Previewer | Gearizen",
  description:
    "Convert Markdown into clean, sanitized HTML and preview live in your browser—fully client-side, privacy-first, zero signup. Customize output, copy or download instantly.",
  keywords: [
    "markdown converter",
    "markdown previewer",
    "markdown to html",
    "live markdown preview",
    "HTML sanitizer",
    "client-side markdown",
    "offline markdown tool",
    "Gearizen markdown converter",
    "sanitize markdown",
    "export markdown",
    "preview sanitized html"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/markdown-converter" },
  openGraph: {
    title: "Markdown Converter & Previewer | Gearizen",
    description:
      "Convert Markdown into clean, sanitized HTML and preview live in your browser—fully client-side, privacy-first, zero signup. Customize output, copy or download instantly.",
    url: "https://gearizen.com/tools/markdown-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/markdown-converter.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Markdown Converter & Previewer Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Converter & Previewer | Gearizen",
    description:
      "Convert Markdown to clean HTML, preview live and export instantly—100% client-side, privacy-first, zero signup.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/markdown-converter.png"]
  }
};

export default function MarkdownConverterPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Markdown Converter & Previewer | Gearizen",
        url: "https://gearizen.com/tools/markdown-converter",
        description:
          "Convert Markdown into clean, sanitized HTML and preview live in your browser—fully client-side, privacy-first, zero signup. Customize output, copy or download instantly.",
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
              name: "Markdown Converter & Previewer",
              item: "https://gearizen.com/tools/markdown-converter"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "Markdown Converter & Previewer",
        url: "https://gearizen.com/tools/markdown-converter",
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
      {/* JSON-LD structured data */}
      <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      {/* Breadcrumb structured data */}
      <BreadcrumbJsonLd
        pageTitle="Markdown Converter & Previewer"
        pageUrl="https://gearizen.com/tools/markdown-converter"
      />

      {/* Main client component */}
      <main>
        <MarkdownConverterClient />
      </main>
    </>
  );
}