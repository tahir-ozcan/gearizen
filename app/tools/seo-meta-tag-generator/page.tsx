// app/tools/seo-meta-tag-generator/page.tsx
import SeoMetaTagGeneratorClient from "./seo-meta-tag-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "SEO Meta Tag Generator",
  description:
    "Generate HTML meta tags for title, description, Open Graph and Twitter Cards with Gearizen’s free, client-side SEO Meta Tag Generator. Copy in one click.",
  keywords: [
    "SEO meta tag generator",
    "Open Graph tags",
    "Twitter Cards",
    "meta tags",
    "gearizen seo tool",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/seo-meta-tag-generator" },
  openGraph: {
    title: "SEO Meta Tag Generator | Gearizen",
    description:
      "Easily create SEO-optimized HTML meta tags for your website with Gearizen’s client-side Meta Tag Generator. No signup required.",
    url: "https://gearizen.com/tools/seo-meta-tag-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "SEO Meta Tag Generator | Gearizen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Meta Tag Generator | Gearizen",
    description:
      "Generate SEO-friendly meta tags for title, description, Open Graph, and Twitter Cards—all client-side and free.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function SeoMetaTagGeneratorPage() {  return (
    <>
      <BreadcrumbJsonLd pageTitle="SEO Meta Tag Generator" pageUrl="https://gearizen.com/tools/seo-meta-tag-generator" />
      <SeoMetaTagGeneratorClient />
    </>
  );
}