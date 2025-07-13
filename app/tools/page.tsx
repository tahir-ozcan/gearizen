// app/tools/page.tsx

import ToolsClient from "./tools-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import JsonLd from "@/app/components/JsonLd";
// artık "tools" değil, getToolsData fonksiyonunu import ediyoruz
import { getToolsData } from "@/lib/tools-data";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Free Online Tools | Gearizen",
  description:
    "Explore Gearizen’s 100% client-side toolbox: password & bcrypt generators, JSON formatter, QR code generator, unit converter, image compressor & resizer, contrast checker, Base64 encoder, code and HTML/CSS formatters, regex tester, diff checker, timestamp converter, PDF & CSV utilities, SEO & OG tag generators, JWT decoder and more—all free, no signup.",
  keywords: [
    "free online tools",
    "client-side tools",
    "password generator",
    "bcrypt generator",
    "JSON formatter",
    "QR code generator",
    "unit converter",
    "image compressor",
    "image resizer",
    "contrast checker",
    "Base64 encoder",
    "code formatter",
    "HTML formatter",
    "CSS formatter",
    "regex tester",
    "text diff checker",
    "timestamp converter",
    "PDF compressor",
    "CSV converter",
    "SEO meta tag generator",
    "JWT decoder",
    "no signup",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools" },
  openGraph: {
    title: "Free Online Tools | Gearizen",
    description:
      "Access Gearizen’s full suite of privacy-first, client-side tools—security, conversion, compression, formatting, validation and more without signup.",
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

// Burada getToolsData ile araçları alıyoruz
const { tools } = getToolsData();

const toolsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: tools.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `https://gearizen.com${t.href}`,
    name: t.title,
  })),
};

export default function ToolsPage() {
  return (
    <>
      {/* Breadcrumb yapısı */}
      <BreadcrumbJsonLd
        pageTitle="Free Online Tools"
        pageUrl="https://gearizen.com/tools"
      />

      {/* Sayfa seviyesinde JSON-LD */}
      <JsonLd data={toolsJsonLd} />

      {/* Devamında client-side component */}
      <ToolsClient />
    </>
  );
}