// app/tools/qr-code-generator/page.tsx

import QrCodeGeneratorClient from "./qr-code-generator-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "QR Code Generator",
  description:
    "Generate custom QR codes instantly with Gearizen’s free client-side QR Code Generator. Enter any text or URL, adjust size, copy or download PNG—no signup required.",
  keywords: [
    "qr code generator",
    "generate qr code",
    "client-side qr code",
    "free online qr code",
    "download qr code",
    "Gearizen qr code",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/qr-code-generator" },
  openGraph: {
    title: "QR Code Generator | Gearizen",
    description:
      "Create and download QR codes in your browser with Gearizen’s client-side QR Code Generator. Fast, private, and free—no login needed.",
    url: "https://gearizen.com/tools/qr-code-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-qr-code-generator.png",
        width: 1200,
        height: 630,
        alt: "Gearizen QR Code Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator | Gearizen",
    description:
      "Use Gearizen’s client-side QR Code Generator to create custom QR codes for text, URLs, and more. Download PNG or copy URL instantly.",
    creator: "@gearizen",
    images: ["/og-qr-code-generator.png"],
  },
};

export default function QrCodeGeneratorPage() {
  return <QrCodeGeneratorClient />;
}