// app/tools/color-toolkit/page.tsx
import { Metadata } from "next";
import Script from "next/script";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import { ColorToolkitClient } from "./color-toolkit-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Color Toolkit | Gearizen",
  description:
    "Convert, manipulate, and analyze colors in HEX, RGB, HSL & CMYK. Generate complementary, tints & shades, and verify WCAG-compliant contrast ratios—100% client-side, privacy-first, zero signup, instant results.",
  keywords: [
    "color converter",
    "hex to rgb",
    "rgb to hex",
    "hsl to rgb",
    "rgb to hsl",
    "cmyk converter",
    "complementary colors",
    "color tints",
    "color shades",
    "contrast checker",
    "WCAG compliance",
    "online color tool",
    "client-side color toolkit",
    "privacy-first color tool",
    "Gearizen color tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: "index, follow",
  alternates: { canonical: "/tools/color-toolkit" },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  openGraph: {
    title: "Color Toolkit | Gearizen",
    description:
      "Convert, manipulate, and analyze colors in HEX, RGB, HSL & CMYK. Generate complementary, tints & shades, and verify WCAG-compliant contrast ratios—100% client-side, privacy-first.",
    url: "https://gearizen.com/tools/color-toolkit",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/color-toolkit.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Color Toolkit Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Toolkit | Gearizen",
    description:
      "Convert, manipulate, and analyze colors in HEX, RGB, HSL & CMYK. Privacy-first, zero signup, instant results.",
    creator: "@gearizen",
    images: [
      {
        url: "https://gearizen.com/og/color-toolkit.png",
        alt: "Gearizen Color Toolkit Preview",
      },
    ],
  },
};

export default function ColorToolkitPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Color Toolkit | Gearizen",
        url: "https://gearizen.com/tools/color-toolkit",
        description:
          "Convert, manipulate, and analyze colors in HEX, RGB, HSL & CMYK. Generate complementary, tints & shades, and verify WCAG-compliant contrast ratios—100% client-side, privacy-first, zero signup, instant results.",
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
              name: "Color Toolkit",
              item: "https://gearizen.com/tools/color-toolkit",
            },
          ],
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Color Toolkit",
        url: "https://gearizen.com/tools/color-toolkit",
        applicationCategory: "DesignTool",
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
        id="ld-json"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>

      <BreadcrumbJsonLd
        pageTitle="Color Toolkit"
        pageUrl="https://gearizen.com/tools/color-toolkit"
      />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]">
          Color Toolkit: Converter & Contrast Checker
        </h1>

        <p className="mx-auto max-w-2xl text-center text-lg sm:text-xl text-gray-700 leading-relaxed">
          Translate colors between HEX, RGB, HSL & CMYK and verify WCAG-compliant contrast ratios—copy any code or ratio with one click.
        </p>

        <ColorToolkitClient />
      </div>
    </>
  );
}