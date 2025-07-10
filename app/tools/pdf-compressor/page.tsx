// app/tools/pdf-compressor/page.tsx
import PdfCompressorClient from "./pdf-compressor-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "PDF Compressor",
  description:
    "Compress and optimize your PDF files directly in the browser with Gearizen’s free, client-side PDF Compressor. No signup or upload to server.",
  keywords: [
    "pdf compressor",
    "compress pdf",
    "optimize pdf",
    "client-side pdf tool",
    "free online pdf compressor",
    "Gearizen pdf compressor",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/pdf-compressor" },
  openGraph: {
    title: "PDF Compressor | Gearizen",
    description:
      "Reduce the file size of your PDF documents 100% client-side with Gearizen’s free PDF Compressor—fast, private, and no signup required.",
    url: "https://gearizen.com/tools/pdf-compressor",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "PDF Compressor | Gearizen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Compressor | Gearizen",
    description:
      "Compress and optimize your PDF files in your browser with Gearizen’s client-side PDF Compressor. Fast, private, no signup.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function PdfCompressorPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="PDF Compressor"
        pageUrl="https://gearizen.com/tools/pdf-compressor"
      />
      <PdfCompressorClient />
    </>
  );
}