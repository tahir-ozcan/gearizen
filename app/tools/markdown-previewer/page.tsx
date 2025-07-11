import type { Metadata } from "next";
import MarkdownPreviewerClient from "./markdown-previewer-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Markdown Preview & Converter",
  description:
    "Write Markdown, preview the result live and convert to sanitized HTML—all in your browser.",
  keywords: [
    "markdown previewer",
    "live markdown editor",
    "markdown tools",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/markdown-previewer" },
  openGraph: {
    title: "Markdown Preview & Converter | Gearizen",
    description:
      "Type Markdown and see the formatted preview in real time. Copy or download the HTML when ready.",
    url: "https://gearizen.com/tools/markdown-previewer",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      { url: "/og-placeholder.svg", width: 1200, height: 630, alt: "Gearizen Markdown Preview" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Preview & Converter | Gearizen",
    description:
      "Instantly preview Markdown and grab clean HTML with Gearizen's in-browser tool.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function MarkdownPreviewerPage() {
  return (
    <>
      <BreadcrumbJsonLd pageTitle="Markdown Preview & Converter" pageUrl="https://gearizen.com/tools/markdown-previewer" />
      <MarkdownPreviewerClient />
    </>
  );
}
