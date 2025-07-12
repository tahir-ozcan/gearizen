// app/tools/morse-code-converter/page.tsx
import type { Metadata } from "next";
import MorseCodeConverterClient from "./morse-code-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Morse Code Converter",
  description:
    "Translate text to Morse code or decode Morse to text quickly with Gearizen's client-side tool—no signup, no tracking.",
  keywords: [
    "morse code converter",
    "text to morse",
    "morse translator",
    "decode morse",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/morse-code-converter" },
  openGraph: {
    title: "Morse Code Converter | Gearizen",
    description:
      "Instantly convert text to Morse or decode Morse back to text in your browser with Gearizen.",
    url: "https://gearizen.com/tools/morse-code-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Morse Code Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Morse Code Converter | Gearizen",
    description:
      "Use Gearizen's client-side Morse Code Converter to encode or decode messages instantly. No account needed.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function MorseCodeConverterPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Morse Code Converter"
        pageUrl="https://gearizen.com/tools/morse-code-converter"
      />
      <MorseCodeConverterClient />
    </>
  );
}
