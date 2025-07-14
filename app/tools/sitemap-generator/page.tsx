// app/tools/sitemap-generator/page.tsx

import SitemapGeneratorClient from "./sitemap-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Sitemap Generator | Gearizen",
  description:
    "Create a standards-compliant XML sitemap by pasting one URL per line. Instantly preview, copy, or download your sitemap—100% client-side, no signup required.",
  keywords: [
    "sitemap generator",
    "XML sitemap",
    "SEO tools",
    "online sitemap",
    "free sitemap generator",
    "Gearizen sitemap",
    "client-side sitemap",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/sitemap-generator" },
  openGraph: {
    title: "Sitemap Generator | Gearizen",
    description:
      "Generate a valid XML sitemap by pasting your URLs—copy or download instantly. Gearizen’s client-side Sitemap Generator makes SEO easy.",
    url: "https://gearizen.com/tools/sitemap-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Sitemap Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitemap Generator | Gearizen",
    description:
      "Paste URLs to generate your XML sitemap instantly—copy or download, all in your browser with Gearizen’s free Sitemap Generator.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function SitemapGeneratorPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Sitemap Generator"
        pageUrl="https://gearizen.com/tools/sitemap-generator"
      />
      <SitemapGeneratorClient />
    </>
  );
}