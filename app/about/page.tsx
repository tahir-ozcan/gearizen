// app/about/page.tsx

import AboutClient from "./about-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import JsonLd from "@/app/components/JsonLd";
import { loadAboutData } from "@/lib/aboutData";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "About Us | Gearizen",
  description:
    "Learn about Gearizen — a platform offering free, privacy-first client-side tools like password generators, JSON formatters, text converters, QR code generators, and more. No signup or personal data collection.",
  keywords: [
    "Gearizen about",
    "free online tools platform",
    "client-side utilities",
    "password generator",
    "JSON formatter",
    "text converter",
    "QR code generator",
    "privacy-focused tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/about" },
  openGraph: {
    title: "About Us | Gearizen",
    description:
      "Discover Gearizen’s mission and vision—providing free, privacy-first client-side tools for developers, creators, and everyone. No signup required.",
    url: "https://gearizen.com/about",
    siteName: "Gearizen",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "About Gearizen – Free Client-Side Digital Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Gearizen",
    description:
      "Get to know Gearizen—your go-to platform for free, client-side web tools. Fast, private, and signup-free.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default async function AboutPage() {
  const data = await loadAboutData();
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: "https://gearizen.com",
    name: "Gearizen",
    logo: "https://gearizen.com/favicon.png",
  };

  return (
    <>
      <BreadcrumbJsonLd pageTitle="About Us" pageUrl="https://gearizen.com/about" />
      <JsonLd data={orgJsonLd} />
      <AboutClient blocks={data.blocks} />
    </>
  );
}
