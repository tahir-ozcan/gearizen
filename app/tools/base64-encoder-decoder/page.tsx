// app/tools/base64-encoder-decoder/page.tsx

import Base64EncoderDecoderClient from "./base64-encoder-decoder-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Base64 Encoder / Decoder | Gearizen",
  description:
    "Encode text to Base64 or decode Base64 back to text instantly with Gearizen’s free client-side Base64 tool. No signup, no tracking.",
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
  alternates: { canonical: "https://gearizen.com/tools/base64-encoder-decoder" },
  openGraph: {
    title: "Base64 Encoder / Decoder | Gearizen",
    description:
      "Instantly encode or decode Base64 strings in your browser with Gearizen’s privacy-focused Base64 tool. 100% client-side, no signup required.",
    url: "https://gearizen.com/tools/base64-encoder-decoder",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-base64.png",
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
      "Use Gearizen’s client-side Base64 tool to encode text to Base64 or decode Base64 strings instantly. No login required.",
    creator: "@gearizen",
    images: ["/og-base64.png"],
  },
};

export default function Base64EncoderDecoderPage() {
  return <Base64EncoderDecoderClient />;
}