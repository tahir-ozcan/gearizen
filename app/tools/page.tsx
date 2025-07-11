// app/tools/page.tsx

import ToolsClient from "./tools-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Free Online Tools",
  description:
    "Explore Gearizen’s 100% client-side toolbox: password & bcrypt generators, JSON tools, QR code creator, unit converter, image compressor & resizer, contrast checker, Base64 encoding, code & HTML formatters, regex tester, diff checker, timestamp converter, PDF and CSV utilities, SEO & OG tag generators, JWT decoder, and more—all free, no signup.",
  keywords: [
    "free online tools",
    "client-side tools",
    "password generator",
    "bcrypt generator",
    "JSON formatter",
    "JSON tools",
    "QR code generator",
    "unit converter",
    "image compressor",
    "image resizer",
    "contrast checker",
    "base64 encoder",
    "code minifier",
    "markdown to html",
    "regex tester",
    "text diff checker",
    "timestamp converter",
    "PDF compressor",
    "PDF to Word",
    "CSV to JSON",
    "HTML formatter",
    "HTML to PDF",
    "URL parser",
    "SEO meta tag generator",
    "JWT decoder",
    "word counter",
    "character counter",
    "slug generator",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools" },
  openGraph: {
    title: "Free Online Tools | Gearizen",
    description:
      "Access Gearizen’s extended suite of privacy-focused, client-side web tools—security, formatting, conversion, compression, validation, and more without signup.",
    url: "https://gearizen.com/tools",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen – Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools | Gearizen",
    description:
      "Discover Gearizen’s all-in-one client-side toolbox: generators, converters, compressors, formatters, validators, and more—100% free with no signup.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function ToolsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Free Online Tools"
        pageUrl="https://gearizen.com/tools"
      />
      <ToolsClient />
    </>
  );
}
