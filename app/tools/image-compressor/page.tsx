// app/tools/image-compressor/page.tsx

import ImageCompressorClient from "./image-compressor-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Image Compressor",
  description:
    "Reduce image file size while preserving quality with Gearizen’s free client-side Image Compressor. Upload, adjust quality, and download instantly—no signup required.",
  keywords: [
    "image compressor",
    "compress image online",
    "client-side image compression",
    "free image compressor",
    "reduce image size",
    "Gearizen image compressor",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/image-compressor" },
  openGraph: {
    title: "Image Compressor | Gearizen",
    description:
      "Compress images in your browser with Gearizen’s client-side Image Compressor. Adjust quality and download smaller files instantly.",
    url: "https://gearizen.com/tools/image-compressor",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Image Compressor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Compressor | Gearizen",
    description:
      "Use Gearizen’s client-side Image Compressor to reduce file sizes while retaining quality. No account needed, 100% in your browser.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function ImageCompressorPage() {
  return <ImageCompressorClient />;}