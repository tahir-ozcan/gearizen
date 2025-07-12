// app/tools/base64-encoder-decoder/page.tsx

import Base64EncoderDecoderClient from "./base64-encoder-decoder-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Base64 Encoder / Decoder | Gearizen",
  description:
    "Encode plain text to Base64 or decode Base64 back to text instantly—fully client-side.",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "encode to Base64",
    "decode Base64",
    "client-side Base64 tool",
    "free online Base64",
    "Gearizen Base64",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://gearizen.com/tools/base64-encoder-decoder",
  },
  openGraph: {
    title: "Base64 Encoder / Decoder | Gearizen",
    description:
      "Encode plain text to Base64 or decode Base64 back to text instantly—fully client-side.",
    url: "https://gearizen.com/tools/base64-encoder-decoder",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Base64 Encoder / Decoder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encoder / Decoder | Gearizen",
    description:
      "Encode plain text to Base64 or decode Base64 back to text instantly—fully client-side.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function Base64EncoderDecoderPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Base64 Encoder / Decoder"
        pageUrl="https://gearizen.com/tools/base64-encoder-decoder"
      />
      <Base64EncoderDecoderClient />
    </>
  );
}
