import ShaHashGeneratorClient from "./sha-hash-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Hash Generator | Gearizen",
  description:
    "Create SHA-256, SHA-1, or MD5 hashes instantly with Gearizen's client-side Hash Generator. Private, fast, and free.",
  keywords: [
    "hash generator",
    "sha256",
    "sha1",
    "md5",
    "online hash tool",
    "client-side hash",
    "Gearizen hash",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/sha-hash-generator" },
  openGraph: {
    title: "Hash Generator | Gearizen",
    description:
      "Generate SHA and MD5 hashes in your browser with Gearizen's Hash Generator. 100% client-side, no signup.",
    url: "https://gearizen.com/tools/sha-hash-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Hash Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hash Generator | Gearizen",
    description:
      "Use Gearizen's client-side Hash Generator to create SHA or MD5 hashes instantly—privacy guaranteed.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function ShaHashGeneratorPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Hash Generator"
        pageUrl="https://gearizen.com/tools/sha-hash-generator"
      />
      <ShaHashGeneratorClient />
    </>
  );
}
