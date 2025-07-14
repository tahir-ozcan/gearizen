// app/tools/data-converter/page.tsx

import DataConverterClient from "./data-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Data Converter | Gearizen",
  description:
    "Transform data between CSV, JSON, YAML and XML formats instantly in your browser with Gearizen’s free, client-side Data Converter. No signup, no tracking, 100% client-side.",
  keywords: [
    "data converter",
    "csv to json",
    "json to csv",
    "yaml to json",
    "json to yaml",
    "xml to json",
    "json to xml",
    "csv to xml",
    "xml to csv",
    "client-side converter",
    "online data converter",
    "Gearizen data tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/data-converter" },
  openGraph: {
    title: "Data Converter | Gearizen",
    description:
      "Use Gearizen’s powerful, client-side Data Converter to convert CSV, JSON, YAML & XML back and forth—no servers, no signup, instant results in your browser.",
    url: "https://gearizen.com/tools/data-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Data Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Converter | Gearizen",
    description:
      "Convert CSV, JSON, YAML & XML seamlessly in your browser with Gearizen’s client-side Data Converter—no signup required.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function DataConverterPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Data Converter"
        pageUrl="https://gearizen.com/tools/data-converter"
      />
      <DataConverterClient />
    </>
  );
}