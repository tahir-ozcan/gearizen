// app/tools/url-tools/page.tsx

import UrlToolsClient from "./url-tools-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "URL Tools | Gearizen",
  description:
    "Parse, validate, encode/decode and modify URLs instantly in your browser. Add or remove query parameters, extract components, and copy results—100% client-side, no signup required.",
  keywords: [
    "url tools",
    "url parser",
    "validate url",
    "encode url",
    "decode url",
    "query parameters",
    "add query param",
    "remove query param",
    "client-side url tools",
    "free online url tools",
    "Gearizen url tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/url-tools" },
  openGraph: {
    title: "URL Tools | Gearizen",
    description:
      "Paste a URL to parse its components, manage query parameters, encode or decode, and copy the final result—entirely client-side.",
    url: "https://gearizen.com/tools/url-tools",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen URL Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Tools | Gearizen",
    description:
      "Instantly parse, validate and transform URLs in your browser. Manage query parameters, encode/decode and copy the result with one click.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function UrlToolsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="URL Tools"
        pageUrl="https://gearizen.com/tools/url-tools"
      />
      <UrlToolsClient />
    </>
  );
}