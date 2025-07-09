// app/tools/pdf-to-word/page.tsx
import PdfToWordClient from "./pdf-to-word-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "PDF to Word Converter",
  description:
    "Convert your PDFs into Word-compatible documents instantly in the browser with Gearizen’s free client-side PDF to Word Converter. No signup required.",
  keywords: [
    "pdf to word",
    "pdf converter",
    "browser pdf converter",
    "client-side tools",
    "free online converter",
    "Gearizen PDF tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/pdf-to-word" },
  openGraph: {
    title: "PDF to Word Converter | Gearizen",
    description:
      "Effortlessly extract text from PDFs and download as Word documents—100% client-side, no signup required.",
    url: "https://gearizen.com/tools/pdf-to-word",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen PDF to Word Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Word Converter | Gearizen",
    description:
      "Use Gearizen’s free client-side PDF to Word Converter to turn your PDFs into editable Word documents instantly—no signup needed.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function PdfToWordPage() {  return (
    <>
      <BreadcrumbJsonLd pageTitle="PDF to Word Converter" pageUrl="https://gearizen.com/tools/pdf-to-word" />
      <PdfToWordClient />
    </>
  );
}