// app/tools/lorem-ipsum-generator/page.tsx

import type { Metadata } from "next";
import LoremIpsumGeneratorClient from "./lorem-ipsum-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Lorem Ipsum Generator | Gearizen",
  description:
    "Generate customizable Lorem Ipsum placeholder text for design mockups, prototypes, wireframes and content testing—choose number of paragraphs, sentences or words, fully client-side, privacy-first, zero signup, instant results.",
  keywords: [
    "Lorem Ipsum generator",
    "placeholder text generator",
    "filler text",
    "dummy text generator",
    "blind text generator",
    "Lorem Ipsum paragraphs",
    "custom placeholder text",
    "UX content testing",
    "design mockup text",
    "prototype placeholder",
    "wireframe text",
    "client-side Lorem Ipsum",
    "free Lorem Ipsum generator",
    "privacy-first Lorem Ipsum",
    "Gearizen tools"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/lorem-ipsum-generator" },
  openGraph: {
    title: "Lorem Ipsum Generator | Gearizen",
    description:
      "Generate customizable Lorem Ipsum placeholder text for design mockups, prototypes, wireframes and content testing—fully client-side, privacy-first, zero signup, instant results.",
    url: "https://gearizen.com/tools/lorem-ipsum-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/lorem-ipsum-generator.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Lorem Ipsum Generator Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Lorem Ipsum Generator | Gearizen",
    description:
      "Generate customizable Lorem Ipsum placeholder text for design mockups, prototypes, wireframes and content testing—fully client-side, privacy-first, zero signup, instant results.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/lorem-ipsum-generator.png"]
  }
};

export default function LoremIpsumGeneratorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Lorem Ipsum Generator | Gearizen",
        url: "https://gearizen.com/tools/lorem-ipsum-generator",
        description:
          "Generate customizable Lorem Ipsum placeholder text for design mockups, prototypes, wireframes and content testing—fully client-side, privacy-first, zero signup, instant results.",
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
              name: "Lorem Ipsum Generator",
              item: "https://gearizen.com/tools/lorem-ipsum-generator"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "Lorem Ipsum Generator",
        url: "https://gearizen.com/tools/lorem-ipsum-generator",
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
        pageTitle="Lorem Ipsum Generator"
        pageUrl="https://gearizen.com/tools/lorem-ipsum-generator"
      />

      {/* Main client component */}
      <main>
        <LoremIpsumGeneratorClient />
      </main>
    </>
  );
}