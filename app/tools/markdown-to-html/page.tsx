// app/tools/markdown-to-html/page.tsx

import MarkdownToHtmlClient from "./markdown-to-html-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Markdown → HTML Converter",
  description:
    "Write Markdown and see the HTML instantly. Gearizen’s client-side converter lets you copy or download sanitized markup with no signup.",
  keywords: [
    "markdown to html",
    "markdown converter",
    "client-side markdown",
    "free markdown html",
    "Gearizen markdown",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/markdown-to-html" },
  openGraph: {
    title: "Markdown → HTML Converter | Gearizen",
    description:
      "Instantly preview and convert Markdown into clean HTML with Gearizen’s client-side tool. No signup required.",
    url: "https://gearizen.com/tools/markdown-to-html",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Markdown to HTML Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown → HTML Converter | Gearizen",
    description:
      "Use Gearizen’s Markdown converter to preview and export sanitized HTML. 100% client-side.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function MarkdownToHtmlPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Markdown → HTML Converter"
        pageUrl="https://gearizen.com/tools/markdown-to-html"
      />
      <MarkdownToHtmlClient />
    </>
  );
}
