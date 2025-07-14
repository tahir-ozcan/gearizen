// app/tools/pdf-toolkit/page.tsx

import PdfToolkitClient from "./pdf-toolkit-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "PDF Toolkit | Gearizen",
  description:
    "Convert any HTML snippet into a high-quality PDF in your browser. Adjust page size, orientation, preview live, and download instantly—100% client-side, no signup required.",
  keywords: [
    "PDF converter",
    "HTML to PDF",
    "jsPDF",
    "html2canvas",
    "client-side PDF",
    "free online PDF tool",
    "Gearizen PDF Toolkit",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/pdf-toolkit" },
  openGraph: {
    title: "PDF Toolkit | Gearizen",
    description:
      "Use Gearizen’s PDF Toolkit to turn any HTML into a downloadable PDF. Live preview, page size and orientation options, all running entirely in your browser.",
    url: "https://gearizen.com/tools/pdf-toolkit",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen PDF Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Toolkit | Gearizen",
    description:
      "Instantly convert HTML to PDF in your browser with Gearizen’s PDF Toolkit—no backend, no signup, just live preview and download.",
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