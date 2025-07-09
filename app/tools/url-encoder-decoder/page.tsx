import type { Metadata } from "next";
import UrlEncoderDecoderClient from "./url-encoder-decoder-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "URL Encoder/Decoder",
  description:
    "Encode or decode URLs and query strings quickly using Gearizen's client-side tool.",
  keywords: ["url encoder", "url decoder", "percent encoding", "Gearizen tools"],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/url-encoder-decoder" },
  openGraph: {
    title: "URL Encoder/Decoder | Gearizen",
    description: "Easily encode or decode URLs right in your browser—no signup required.",
    url: "https://gearizen.com/tools/url-encoder-decoder",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      { url: "/og-placeholder.svg", width: 1200, height: 630, alt: "Gearizen URL Encoder/Decoder" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Encoder/Decoder | Gearizen",
    description: "Fast URL encoding and decoding in your browser.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function UrlEncoderDecoderPage() {
  return <UrlEncoderDecoderClient />;
}
