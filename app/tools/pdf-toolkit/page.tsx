// app/tools/pdf-toolkit/page.tsx

import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import PdfToolkitClient from "./pdf-toolkit-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "PDF Toolkit | Gearizen",
  description:
    "Shrink PDF file sizes without quality loss and extract text to Word documents—all in-browser and offline—100% client-side, no signup required.",
  keywords: [
    "PDF compress",
    "PDF shrink",
    "extract text from PDF",
    "pdf-lib",
    "pdfjs",
    "client-side PDF tool",
    "free online PDF tool",
    "Gearizen PDF Toolkit",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/pdf-toolkit" },
  openGraph: {
    title: "PDF Toolkit | Gearizen",
    description:
      "Use Gearizen’s PDF Toolkit to compress PDFs without quality loss and extract their text into Word documents—all running entirely in your browser.",
    url: "https://gearizen.com/tools/pdf-toolkit",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen PDF Toolkit: Compress & Convert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Toolkit | Gearizen",
    description:
      "Compress PDFs and extract text to Word instantly in your browser with Gearizen’s PDF Toolkit—no backend, no signup.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function PdfToolkitPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="PDF Toolkit"
        pageUrl="https://gearizen.com/tools/pdf-toolkit"
      />
      <PdfToolkitClient />
    </>
  );
}