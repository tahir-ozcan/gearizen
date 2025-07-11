// app/tools/slug-generator/page.tsx
import SlugGeneratorClient from "./slug-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "URL Slug Generator",
  description:
    "Create clean, SEO-friendly slugs from any text completely in your browser.",
  keywords: [
    "slug generator",
    "url slug",
    "seo slug",
    "slugify",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/slug-generator" },
  openGraph: {
    title: "URL Slug Generator | Gearizen",
    description:
      "Instantly slugify text for SEO-friendly URLs with Gearizen’s client-side tool.",
    url: "https://gearizen.com/tools/slug-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      { url: "/og-placeholder.svg", width: 1200, height: 630, alt: "Gearizen Slug Generator" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Slug Generator | Gearizen",
    description:
      "Generate SEO slugs entirely offline with Gearizen—no signup, no tracking.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function SlugGeneratorPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="URL Slug Generator"
        pageUrl="https://gearizen.com/tools/slug-generator"
      />
      <SlugGeneratorClient />
    </>
  );
}
