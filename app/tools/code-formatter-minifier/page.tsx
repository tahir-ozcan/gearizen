// app/tools/code-formatter-minifier/page.tsx
import { Metadata } from "next";
import Script from "next/script";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import CodeFormatterMinifierClient from "./code-formatter-minifier-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Code Formatter & Minifier | Gearizen",
  description:
    "Instantly beautify and compress your HTML, CSS, and JavaScript code client-side—no uploads, privacy-first, zero signup, lightning-fast.",
  keywords: [
    "code formatter",
    "code minifier",
    "HTML formatter",
    "CSS formatter",
    "JavaScript beautifier",
    "JavaScript compressor",
    "client-side code tool",
    "online code beautifier",
    "online code compressor",
    "free code formatter",
    "free code minifier",
    "zero signup code tool",
    "privacy-first code formatter",
    "Gearizen code tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: {
    canonical:
      "https://gearizen.com/tools/code-formatter-minifier",
  },
  openGraph: {
    title: "Code Formatter & Minifier | Gearizen",
    description:
      "Instantly beautify and compress your HTML, CSS, and JavaScript code client-side—no uploads, privacy-first, zero signup, lightning-fast.",
    url: "https://gearizen.com/tools/code-formatter-minifier",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url:
          "https://gearizen.com/og/code-formatter-minifier.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Code Formatter & Minifier Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Formatter & Minifier | Gearizen",
    description:
      "Instantly beautify and compress your HTML, CSS, and JavaScript code client-side—no uploads, privacy-first, zero signup, lightning-fast.",
    creator: "@gearizen",
    images: [
      {
        url:
          "https://gearizen.com/og/code-formatter-minifier.png",
        alt: "Gearizen Code Formatter & Minifier Preview",
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Code Formatter & Minifier | Gearizen",
      url: "https://gearizen.com/tools/code-formatter-minifier",
      description:
        "Instantly beautify and compress your HTML, CSS, and JavaScript code client-side—no uploads, privacy-first, zero signup, lightning-fast.",
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
            name: "Code Formatter & Minifier",
            item:
              "https://gearizen.com/tools/code-formatter-minifier",
          },
        ],
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Code Formatter & Minifier",
      url: "https://gearizen.com/tools/code-formatter-minifier",
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

export default function Page() {
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
        pageTitle="Code Formatter & Minifier"
        pageUrl="https://gearizen.com/tools/code-formatter-minifier"
      />
      <CodeFormatterMinifierClient />
    </>
  );
}