import type { Metadata } from "next";
import MarkdownPreviewerClient from "./markdown-previewer-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Live Markdown Previewer",
  description:
    "Write Markdown and instantly preview the rendered HTML—completely offline and private.",
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
    title: "Live Markdown Previewer | Gearizen",
    description:
      "Type Markdown and see the formatted preview in real time.",
    url: "https://gearizen.com/tools/markdown-previewer",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      { url: "/og-placeholder.svg", width: 1200, height: 630, alt: "Gearizen Markdown Previewer" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Previewer | Gearizen",
    description:
      "Instantly preview your Markdown with Gearizen's in-browser tool.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function MarkdownPreviewerPage() {
  return <MarkdownPreviewerClient />;
}
