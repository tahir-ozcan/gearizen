// app/tools/json-to-csv/page.tsx
import JsonToCsvClient from "./json-to-csv-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "JSON to CSV Converter",
  description:
    "Convert JSON arrays into CSV instantly with Gearizen’s free client-side JSON to CSV Converter. Paste, convert, copy or download—no signup required.",
  keywords: [
    "json to csv",
    "csv converter",
    "client-side json tool",
    "free json to csv",
    "Gearizen json csv",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/json-to-csv" },
  openGraph: {
    title: "JSON to CSV Converter | Gearizen",
    description:
      "Use Gearizen’s client-side JSON to CSV Converter to quickly transform JSON arrays into CSV data. Copy or download instantly.",
    url: "https://gearizen.com/tools/json-to-csv",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen JSON to CSV Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to CSV Converter | Gearizen",
    description:
      "Instantly convert JSON arrays to CSV in your browser with Gearizen’s client-side converter. Fast, private, and free—no login needed.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function JsonToCsvPage() {
  return (
    <>
      <BreadcrumbJsonLd pageTitle="JSON to CSV Converter" pageUrl="https://gearizen.com/tools/json-to-csv" />
      <JsonToCsvClient />
    </>
  );
}
