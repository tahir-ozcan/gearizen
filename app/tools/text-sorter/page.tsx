import type { Metadata } from "next";
import TextSorterClient from "./text-sorter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Text Sorter",
  description:
    "Sort lines of text alphabetically with optional case-insensitivity and deduplication. 100% client-side.",
  keywords: [
    "text sorter",
    "sort lines",
    "alphabetical sorter",
    "gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/text-sorter" },
  openGraph: {
    title: "Text Sorter | Gearizen",
    description:
      "Quickly sort lines of text in your browser with Gearizen's client-side Text Sorter.",
    url: "https://gearizen.com/tools/text-sorter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      { url: "/og-placeholder.svg", width: 1200, height: 630, alt: "Gearizen Text Sorter" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Sorter | Gearizen",
    description:
      "Arrange lines alphabetically and remove duplicates with Gearizen's Text Sorter—no signup required.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function TextSorterPage() {
  return (
    <>
      <BreadcrumbJsonLd pageTitle="Text Sorter" pageUrl="https://gearizen.com/tools/text-sorter" />
      <TextSorterClient />
    </>
  );
}
