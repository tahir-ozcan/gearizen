// app/tools/text-diff/page.tsx

import TextDiffClient from "./text-diff-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Text Diff Checker",
  description:
    "Compare two blocks of text and highlight additions and deletions instantly with Gearizen’s free client-side Text Diff Checker. No signup required.",
  keywords: [
    "text diff",
    "compare text",
    "diff checker",
    "online diff tool",
    "client-side diff",
    "free text diff",
    "Gearizen diff",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/text-diff" },
  openGraph: {
    title: "Text Diff Checker | Gearizen",
    description:
      "Use Gearizen’s Text Diff Checker to visually spot additions in green and deletions in red between any two texts. 100% client-side and free!",
    url: "https://gearizen.com/tools/text-diff",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Text Diff Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Diff Checker | Gearizen",
    description:
      "Instantly compare two texts and highlight changes with Gearizen’s client-side Text Diff Checker. Additions green, deletions red—no login needed.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function TextDiffPage() {
  return <TextDiffClient />;}