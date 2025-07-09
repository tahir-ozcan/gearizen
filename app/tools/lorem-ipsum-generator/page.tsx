import type { Metadata } from "next";
import LoremIpsumGeneratorClient from "./lorem-ipsum-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Lorem Ipsum Generator",
  description:
    "Quickly generate filler text paragraphs for mockups and design drafts.",
  keywords: ["lorem ipsum generator", "placeholder text", "Gearizen tools"],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/lorem-ipsum-generator" },
  openGraph: {
    title: "Lorem Ipsum Generator | Gearizen",
    description: "Create custom-length Lorem Ipsum text instantly in your browser.",
    url: "https://gearizen.com/tools/lorem-ipsum-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      { url: "/og-placeholder.svg", width: 1200, height: 630, alt: "Gearizen Lorem Ipsum Generator" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lorem Ipsum Generator | Gearizen",
    description: "Generate Lorem Ipsum paragraphs with a click.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function LoremIpsumGeneratorPage() {
  return (
    <>
      <BreadcrumbJsonLd pageTitle="Lorem Ipsum Generator" pageUrl="https://gearizen.com/tools/lorem-ipsum-generator" />
      <LoremIpsumGeneratorClient />
    </>
  );
}
