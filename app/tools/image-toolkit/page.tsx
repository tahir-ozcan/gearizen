// app/tools/image-toolkit/page.tsx

import type { Metadata } from "next";
import Script from "next/script";
import ImageToolkitClient from "./image-toolkit-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Image Toolkit: Compress, Resize & Base64 Converter | Gearizen",
  description:
    "Upload, preview, compress, resize and convert images to Base64 entirely in your browser—preserve aspect ratio, optimize JPEG & PNG, then copy or download results instantly. 100% client-side, privacy-first, no signup required.",
  keywords: [
    "image toolkit",
    "image compressor",
    "image resize",
    "base64 converter",
    "image to base64",
    "jpeg optimizer",
    "png optimizer",
    "compress images online",
    "resize images client-side",
    "aspect ratio lock",
    "copy base64",
    "download image",
    "privacy-first image tool",
    "Gearizen image toolkit"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/image-toolkit" },
  openGraph: {
    title: "Image Toolkit: Compress, Resize & Base64 Converter | Gearizen",
    description:
      "Use Gearizen’s Image Toolkit to upload, preview, compress, resize and convert images to Base64—all in your browser, no signup, privacy-first.",
    url: "https://gearizen.com/tools/image-toolkit",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/image-toolkit.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Image Toolkit Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Toolkit: Compress, Resize & Base64 Converter | Gearizen",
    description:
      "Upload, preview, compress, resize and convert images to Base64 entirely in your browser—fast, private, and free, no signup needed.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/image-toolkit.png"]
    // note: 'imageAlt' removed because Next.js TwitterMetadata only accepts 'images'
  }
};

export default function ImageToolkitPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Image Toolkit: Compress, Resize & Base64 Converter | Gearizen",
        url: "https://gearizen.com/tools/image-toolkit",
        description:
          "Upload, preview, compress, resize and convert images to Base64 entirely in your browser—preserve aspect ratio, optimize JPEG & PNG, then copy or download results instantly. 100% client-side, privacy-first, no signup required.",
        publisher: {
          "@type": "Organization",
          name: "Gearizen",
          url: "https://gearizen.com",
          logo: {
            "@type": "ImageObject",
            url: "https://gearizen.com/logo.png"
          }
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://gearizen.com"
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Tools",
              item: "https://gearizen.com/tools"
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Image Toolkit",
              item: "https://gearizen.com/tools/image-toolkit"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "Image Toolkit",
        url: "https://gearizen.com/tools/image-toolkit",
        applicationCategory: "ImageProcessing",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        publisher: {
          "@type": "Organization",
          name: "Gearizen",
          url: "https://gearizen.com"
        }
      }
    ]
  };

  return (
    <>
      {/* JSON-LD for structured data */}
      <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      {/* Breadcrumb structured data */}
      <BreadcrumbJsonLd
        pageTitle="Image Toolkit"
        pageUrl="https://gearizen.com/tools/image-toolkit"
      />

      {/* Main client component */}
      <main>
        <ImageToolkitClient />
      </main>
    </>
  );
}