// app/tools/csv-json-converter/page.tsx
import CsvJsonConverterClient from "./csv-json-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "CSV ⇄ JSON Converter",
  description:
    "Convert CSV data to JSON or JSON arrays to CSV with Gearizen's privacy-first converter.",
  keywords: [
    "csv to json",
    "json to csv",
    "csv json converter",
    "client-side csv json",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/csv-json-converter" },
  openGraph: {
    title: "CSV ⇄ JSON Converter | Gearizen",
    description:
      "Easily transform CSV files to JSON or JSON arrays to CSV, entirely in your browser.",
    url: "https://gearizen.com/tools/csv-json-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      { url: "/og-placeholder.svg", width: 1200, height: 630, alt: "Gearizen CSV JSON Converter" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV ⇄ JSON Converter | Gearizen",
    description:
      "Convert between CSV and JSON seamlessly with Gearizen's client-side tool—no uploads, no tracking.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function CsvJsonConverterPage() {
  return (
    <>
      <BreadcrumbJsonLd pageTitle="CSV ⇄ JSON Converter" pageUrl="https://gearizen.com/tools/csv-json-converter" />
      <CsvJsonConverterClient />
    </>
  );
}
