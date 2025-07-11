// app/tools/markdown-converter/page.tsx
import type { Metadata } from "next";
import MarkdownConverterClient from "./markdown-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Markdown Converter & Previewer",
  description:
    "Convert Markdown to sanitized HTML and preview the result live—completely offline and private.",
  keywords: [
    "markdown converter",
    "markdown previewer",
    "markdown to html",
    "live markdown",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/markdown-converter" },
  openGraph: {
    title: "Markdown Converter & Previewer | Gearizen",
    description:
      "Edit Markdown, get clean HTML, and preview instantly with Gearizen’s client-side converter.",
    url: "https://gearizen.com/tools/markdown-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      { url: "/og-placeholder.svg", width: 1200, height: 630, alt: "Gearizen Markdown Converter" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Converter & Previewer | Gearizen",
    description:
      "Live-preview Markdown and copy sanitized HTML with Gearizen’s lightweight tool.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function MarkdownConverterPage() {
  return (
    <>
      <BreadcrumbJsonLd pageTitle="Markdown Converter & Previewer" pageUrl="https://gearizen.com/tools/markdown-converter" />
      <MarkdownConverterClient />
    </>
  );
}
