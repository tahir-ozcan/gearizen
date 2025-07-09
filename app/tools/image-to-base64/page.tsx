import type { Metadata } from "next";
import ImageToBase64Client from "./image-to-base64-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Image to Base64 Encoder",
  description:
    "Convert images to Base64-encoded data URIs instantly with Gearizen's client-side tool.",
  keywords: [
    "image to base64",
    "data URI converter",
    "online image encoder",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/image-to-base64" },
  openGraph: {
    title: "Image to Base64 Encoder | Gearizen",
    description:
      "Upload an image and instantly get its Base64 data URI—100% client-side.",
    url: "https://gearizen.com/tools/image-to-base64",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      { url: "/og-placeholder.svg", width: 1200, height: 630, alt: "Gearizen Image to Base64" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to Base64 Encoder | Gearizen",
    description:
      "Simple image to Base64 converter running entirely in your browser.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function ImageToBase64Page() {
  return (
    <>
      <BreadcrumbJsonLd pageTitle="Image to Base64 Encoder" pageUrl="https://gearizen.com/tools/image-to-base64" />
      <ImageToBase64Client />
    </>
  );
}
