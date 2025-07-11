import YamlJsonConverterClient from "./yaml-json-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "YAML ⇄ JSON Converter | Gearizen",
  description:
    "Easily convert YAML to JSON or JSON to YAML with Gearizen's client-side converter. Private and fast.",
  keywords: [
    "yaml to json",
    "json to yaml",
    "yaml converter",
    "json converter",
    "client-side yaml tool",
    "Gearizen yaml json",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/yaml-json-converter" },
  openGraph: {
    title: "YAML ⇄ JSON Converter | Gearizen",
    description:
      "Convert YAML and JSON files right in your browser using Gearizen's privacy-focused converter—no uploads required.",
    url: "https://gearizen.com/tools/yaml-json-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen YAML JSON Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YAML ⇄ JSON Converter | Gearizen",
    description:
      "Use Gearizen's client-side converter to turn YAML into JSON or JSON into YAML effortlessly.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function YamlJsonConverterPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="YAML ⇄ JSON Converter"
        pageUrl="https://gearizen.com/tools/yaml-json-converter"
      />
      <YamlJsonConverterClient />
    </>
  );
}
