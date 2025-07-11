import type { Metadata } from "next";
import XmlFormatterClient from "./xml-formatter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "XML Formatter & Minifier",
  description:
    "Beautify or minify XML documents directly in your browser with Gearizen's free tool.",
  keywords: [
    "xml formatter",
    "xml beautifier",
    "xml minifier",
    "format xml",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/xml-formatter" },
  openGraph: {
    title: "XML Formatter & Minifier | Gearizen",
    description:
      "Format or compress XML data instantly—privacy-first and client-side.",
    url: "https://gearizen.com/tools/xml-formatter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen XML Formatter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XML Formatter & Minifier | Gearizen",
    description:
      "Easily prettify or minify XML online with no server interaction.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function XmlFormatterPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="XML Formatter & Minifier"
        pageUrl="https://gearizen.com/tools/xml-formatter"
      />
      <XmlFormatterClient />
    </>
  );
}
