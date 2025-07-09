import type { Metadata } from "next";
import TextCounterClient from "./text-counter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Word & Character Counter",
  description:
    "Quickly count words and characters in your text with Gearizen's free, client-side counter.",
  keywords: [
    "word counter",
    "character counter",
    "text counter",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/text-counter" },
  openGraph: {
    title: "Word & Character Counter | Gearizen",
    description:
      "Count words and characters instantly in your browser with Gearizen's text counter.",
    url: "https://gearizen.com/tools/text-counter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Word & Character Counter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Word & Character Counter | Gearizen",
    description:
      "Use Gearizen's free tool to measure word and character counts with no signup.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function TextCounterPage() {
  return (
    <>
      <BreadcrumbJsonLd pageTitle="Word & Character Counter" pageUrl="https://gearizen.com/tools/text-counter" />
      <TextCounterClient />
    </>
  );
}
