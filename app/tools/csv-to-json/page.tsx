// app/tools/csv-to-json/page.tsx

import CsvToJsonClient from "./csv-to-json-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "CSV to JSON Converter",
  description:
    "Convert CSV data into JSON instantly with Gearizen’s free client-side CSV to JSON Converter. Paste, convert, copy or download—no signup required.",
  keywords: [
    "csv to json",
    "csv parser",
    "json converter",
    "client-side csv tool",
    "free csv to json",
    "Gearizen csv json",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/csv-to-json" },
  openGraph: {
    title: "CSV to JSON Converter | Gearizen",
    description:
      "Use Gearizen’s client-side CSV to JSON Converter to quickly parse CSV with headers into JSON arrays. Copy or download your data instantly.",
    url: "https://gearizen.com/tools/csv-to-json",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen CSV to JSON Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV to JSON Converter | Gearizen",
    description:
      "Instantly convert CSV to JSON in your browser with Gearizen’s client-side CSV to JSON Converter. Fast, private, and free—no login needed.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function CsvToJsonPage() {  return (
    <>
      <BreadcrumbJsonLd pageTitle="CSV to JSON Converter" pageUrl="https://gearizen.com/tools/csv-to-json" />
      <CsvToJsonClient />
    </>
  );
}