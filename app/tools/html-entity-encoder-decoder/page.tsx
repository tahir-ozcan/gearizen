// app/tools/html-entity-encoder-decoder/page.tsx

import HtmlEntityEncoderDecoderClient from "./html-entity-encoder-decoder-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "HTML Entity Encoder / Decoder | Gearizen",
  description:
    "Convert text to HTML entities or decode entities back to plain text instantly with Gearizen's client-side tool.",
  keywords: [
    "HTML entity encoder",
    "HTML entity decoder",
    "convert to HTML entities",
    "decode HTML entities",
    "client-side HTML entities tool",
    "Gearizen HTML entities",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://gearizen.com/tools/html-entity-encoder-decoder",
  },
  openGraph: {
    title: "HTML Entity Encoder / Decoder | Gearizen",
    description:
      "Encode special characters or decode HTML entities in your browser with Gearizen's privacy-focused tool.",
    url: "https://gearizen.com/tools/html-entity-encoder-decoder",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen HTML Entity Encoder / Decoder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HTML Entity Encoder / Decoder | Gearizen",
    description:
      "Use Gearizen's client-side tool to encode or decode HTML entities instantly. No login required.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function HtmlEntityEncoderDecoderPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="HTML Entity Encoder / Decoder"
        pageUrl="https://gearizen.com/tools/html-entity-encoder-decoder"
      />
      <HtmlEntityEncoderDecoderClient />
    </>
  );
}
