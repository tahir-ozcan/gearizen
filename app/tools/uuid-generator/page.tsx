import type { Metadata } from "next";
import UuidGeneratorClient from "./uudi-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Free UUID Generator (v1 & v4)",
  description:
    "Create RFC4122 v1 or v4 UUIDs in bulk with Gearizen’s client-side UUID Generator. Customize separators, case and batch size—all in your browser.",
  keywords: [
    "uuid generator",
    "uuid v4",
    "uuid v1",
    "bulk uuid",
    "random id",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/uuid-generator" },
  openGraph: {
    title: "UUID Generator | Gearizen",
    description:
      "Generate RFC4122 v1 or v4 identifiers in the browser. Configure case, separators and quantity, then copy instantly—no signup.",
    url: "https://gearizen.com/tools/uuid-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen UUID Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID Generator | Gearizen",
    description:
      "Create RFC4122 v1 or v4 UUIDs in bulk with Gearizen’s privacy-first generator. Configure and copy instantly.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function UuidGeneratorPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Free UUID Generator"
        pageUrl="https://gearizen.com/tools/uuid-generator"
      />
      <UuidGeneratorClient />
    </>
  );
}
