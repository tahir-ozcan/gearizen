// app/tools/color-converter/page.tsx
import type { Metadata } from "next";
import ColorConverterClient from "./color-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Color Converter",
  description:
    "Translate colors between HEX, RGB(A), HSL(A), and CMYK instantly. 100% client-side with a live preview.",
  keywords: [
    "color converter",
    "hex to rgb",
    "rgb to hsl",
    "cmyk to rgb",
    "color tools",
    "Gearizen color",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/color-converter" },
  openGraph: {
    title: "Color Converter | Gearizen",
    description:
      "Convert any color code between HEX, RGB(A), HSL(A), and CMYK with instant preview.",
    url: "https://gearizen.com/tools/color-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      { url: "/og-placeholder.svg", width: 1200, height: 630, alt: "Gearizen Color Converter" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Converter | Gearizen",
    description:
      "Quickly convert colors between HEX, RGB(A), HSL(A), and CMYK using Gearizen’s browser-based tool.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function ColorConverterPage() {
  return (
    <>
      <BreadcrumbJsonLd pageTitle="Color Converter" pageUrl="https://gearizen.com/tools/color-converter" />
      <ColorConverterClient />
    </>
  );
}
