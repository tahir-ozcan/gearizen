// app/tools/json-formatter/page.tsx
import type { Metadata } from "next";
import JsonFormatterClient from "./json-formatter-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Free JSON Formatter & Validator",
  description:
    "Format, validate, beautify, and minify your JSON instantly with Gearizen’s free client-side JSON Formatter. Copy or download without signup!",
  keywords: [
    "JSON formatter",
    "JSON validator",
    "beautify JSON",
    "minify JSON",
    "client-side JSON tool",
    "free online JSON formatter",
    "Gearizen JSON",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/json-formatter" },
  openGraph: {
    title: "Free JSON Formatter & Validator | Gearizen",
    description:
      "Instantly format, validate, and minify JSON data in the browser with Gearizen’s privacy-focused JSON Formatter tool.",
    url: "https://gearizen.com/tools/json-formatter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-json-formatter.png",
        width: 1200,
        height: 630,
        alt: "Gearizen JSON Formatter & Validator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Formatter & Validator | Gearizen",
    description:
      "Use Gearizen’s client-side JSON Formatter to prettify or minify JSON. No login. No tracking. Copy or download instantly.",
    site: "@gearizen",
    creator: "@gearizen",
    images: ["/og-json-formatter.png"],
  },
};

export default function JsonFormatterPage() {
  return <JsonFormatterClient />;}