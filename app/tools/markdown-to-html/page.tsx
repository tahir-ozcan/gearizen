// app/tools/markdown-to-html/page.tsx

import MarkdownToHtmlClient from "./markdown-to-html-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Markdown → HTML Converter",
  description:
    "Convert your Markdown to clean, sanitized HTML instantly with Gearizen’s free client-side Markdown→HTML tool. Copy or download without signup!",
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
      "Instantly convert Markdown into sanitized HTML with Gearizen’s client-side Markdown→HTML Converter. No signup required.",
    url: "https://gearizen.com/tools/markdown-to-html",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-markdown-to-html.png",
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
      "Use Gearizen’s client-side Markdown→HTML tool to transform your Markdown into clean, ready-to-use HTML. Copy or download instantly.",
    creator: "@gearizen",
    images: ["/og-markdown-to-html.png"],
  },
};

export default function MarkdownToHtmlPage() {
  return <MarkdownToHtmlClient />;
}