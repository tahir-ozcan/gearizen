import type { Metadata } from "next";
import CaesarCipherClient from "./caesar-cipher-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Caesar Cipher",
  description:
    "Encrypt or decrypt text with a custom shift using Gearizen's Caesar Cipher tool—fully client-side and privacy-friendly.",
  keywords: [
    "caesar cipher",
    "text encryption",
    "text decryption",
    "client-side cipher",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/caesar-cipher" },
  openGraph: {
    title: "Caesar Cipher | Gearizen",
    description:
      "Quickly encode or decode messages with the Caesar Cipher directly in your browser—no data leaves your device.",
    url: "https://gearizen.com/tools/caesar-cipher",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Caesar Cipher",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caesar Cipher | Gearizen",
    description:
      "Encrypt and decrypt text with a customizable shift—works entirely offline in your browser.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function CaesarCipherPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Caesar Cipher"
        pageUrl="https://gearizen.com/tools/caesar-cipher"
      />
      <CaesarCipherClient />
    </>
  );
}
