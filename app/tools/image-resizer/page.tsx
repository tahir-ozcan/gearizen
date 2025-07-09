// app/tools/image-resizer/page.tsx

import ImageResizerClient from "./image-resizer-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Image Resizer",
  description:
    "Resize your images instantly in the browser—upload, set dimensions, preview and download. Gearizen’s client-side Image Resizer is fast, private and free with no signup required.",
  keywords: [
    "image resizer",
    "resize image online",
    "client-side image tool",
    "browser image resize",
    "free image resizer",
    "Gearizen image tools"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/image-resizer" },
  openGraph: {
    title: "Image Resizer | Gearizen",
    description:
      "Use Gearizen’s client-side Image Resizer to quickly resize images in your browser. No backend, no tracking, no signup—just instant results.",
    url: "https://gearizen.com/tools/image-resizer",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Image Resizer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Resizer | Gearizen",
    description:
      "Quickly resize any image client-side with Gearizen’s Image Resizer. Upload, adjust dimensions, preview and download—100% free, no login.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"]
  }
};

export default function ImageResizerPage() {  return (
    <>
      <BreadcrumbJsonLd pageTitle="Image Resizer" pageUrl="https://gearizen.com/tools/image-resizer" />
      <ImageResizerClient />
    </>
  );
}