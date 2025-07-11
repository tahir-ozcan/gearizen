import type { Metadata } from "next";
import TextCaseConverterClient from "./text-case-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Text Case Converter",
  description:
    "Transform text between upper, lower, title, sentence, camel, snake and kebab cases entirely in your browser.",
  keywords: [
    "text case converter",
    "uppercase",
    "lowercase",
    "camel case",
    "snake case",
    "kebab case",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/text-case-converter" },
  openGraph: {
    title: "Text Case Converter | Gearizen",
    description:
      "Quickly switch text between different cases with this free, client-side tool.",
    url: "https://gearizen.com/tools/text-case-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Text Case Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Case Converter | Gearizen",
    description:
      "Convert text to upper, lower, camel, snake and more—100% client-side and free.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function TextCaseConverterPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Text Case Converter"
        pageUrl="https://gearizen.com/tools/text-case-converter"
      />
      <TextCaseConverterClient />
    </>
  );
}
