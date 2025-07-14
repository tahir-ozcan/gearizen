// app/tools/image-toolkit/page.tsx

import ImageToolkitClient from "./image-toolkit-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Image Toolkit | Gearizen",
  description:
    "Upload, preview, convert to Base64, and resize images in your browser with Gearizen’s free Image Toolkit. Preserve aspect ratio and copy or download your results instantly—100% client-side, no signup required.",
  keywords: [
    "image toolkit",
    "base64 converter",
    "image resize",
    "client-side image tools",
    "image preview",
    "download image",
    "copy base64",
    "Gearizen image toolkit",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/image-toolkit" },
  openGraph: {
    title: "Image Toolkit | Gearizen",
    description:
      "Use Gearizen’s Image Toolkit to upload, preview, convert and resize images entirely in your browser. Generate Base64, preserve aspect ratio, then copy or download—no backend, no signup.",
    url: "https://gearizen.com/tools/image-toolkit",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Image Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Toolkit | Gearizen",
    description:
      "Upload, preview, convert to Base64 and resize images with Gearizen’s client-side Image Toolkit—copy or download your results with one click.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function ImageToolkitPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Image Toolkit"
        pageUrl="https://gearizen.com/tools/image-toolkit"
      />
      <ImageToolkitClient />
    </>
  );
}