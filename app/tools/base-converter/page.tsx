import type { Metadata } from "next";
import BaseConverterClient from "./base-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Number Base Converter",
  description:
    "Convert numbers between different bases like binary, decimal and hexadecimal directly in your browser.",
  keywords: [
    "base converter",
    "number base converter",
    "binary converter",
    "hex converter",
    "radix converter",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/base-converter" },
  openGraph: {
    title: "Number Base Converter | Gearizen",
    description:
      "Convert numbers across binary, decimal, hexadecimal and more with Gearizen's client-side Base Converter.",
    url: "https://gearizen.com/tools/base-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Number Base Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Number Base Converter | Gearizen",
    description:
      "Convert numbers between any bases 2-36 entirely on your device with Gearizen.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function BaseConverterPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Number Base Converter"
        pageUrl="https://gearizen.com/tools/base-converter"
      />
      <BaseConverterClient />
    </>
  );
}
