// app/tools/color-toolkit/page.tsx
import { Metadata } from "next";
import Script from "next/script";
import { ColorToolkitClient } from "./color-toolkit-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

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
  robots: { index: true, follow: true },
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
    images: [{
      url: "https://gearizen.com/og/color-toolkit.png",
      alt: "Gearizen Color Toolkit Preview",
    }],
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

      <ColorToolkitClient />
    </>
  );
}