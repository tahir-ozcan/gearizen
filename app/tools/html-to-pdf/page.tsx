// app/tools/html-to-pdf/page.tsx

import HtmlToPdfClient from "./html-to-pdf-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "HTML to PDF",
  description:
    "Convert your HTML markup into a downloadable PDF instantly with Gearizen’s free client-side HTML to PDF Converter. No backend, no signup.",
  keywords: [
    "html to pdf",
    "pdf generator",
    "client-side pdf",
    "html converter",
    "download pdf",
    "free online pdf tool",
    "Gearizen pdf",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/html-to-pdf" },
  openGraph: {
    title: "HTML to PDF Converter | Gearizen",
    description:
      "Use Gearizen’s client-side HTML to PDF Converter to turn any HTML markup into a PDF file in your browser—no server, no signup.",
    url: "https://gearizen.com/tools/html-to-pdf",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "HTML to PDF Converter – Gearizen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HTML to PDF Converter | Gearizen",
    description:
      "Instantly generate PDFs from HTML with Gearizen’s client-side HTML to PDF Converter—fast, private, and free. No login required.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function HtmlToPdfPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="HTML to PDF"
        pageUrl="https://gearizen.com/tools/html-to-pdf"
      />
      <HtmlToPdfClient />
    </>
  );
}