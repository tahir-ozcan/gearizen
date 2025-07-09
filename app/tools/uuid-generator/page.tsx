import type { Metadata } from "next";
import UuidGeneratorClient from "./uuid-generator-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "UUID Generator",
  description:
    "Generate RFC4122 v4 UUIDs instantly in your browser and copy to clipboard.",
  keywords: ["uuid generator", "uuid v4", "random id", "Gearizen tools"],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/uuid-generator" },
  openGraph: {
    title: "UUID Generator | Gearizen",
    description: "Create UUIDs client-side—no tracking, no signup.",
    url: "https://gearizen.com/tools/uuid-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      { url: "/og-placeholder.svg", width: 1200, height: 630, alt: "Gearizen UUID Generator" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID Generator | Gearizen",
    description: "Generate random UUIDs with a single click.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function UuidGeneratorPage() {
  return <UuidGeneratorClient />;
}
