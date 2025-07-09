import type { Metadata } from "next";
import IsoDateConverterClient from "./iso-date-converter-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "ISO Date Converter",
  description:
    "Convert between ISO 8601 date strings and UNIX timestamps directly in your browser—no signup, no tracking.",
  keywords: [
    "ISO date converter",
    "timestamp converter",
    "UNIX milliseconds",
    "date utilities",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/iso-date-converter" },
  openGraph: {
    title: "ISO Date Converter | Gearizen",
    description:
      "Quickly convert dates to ISO 8601 or UNIX timestamps with Gearizen's client-side ISO Date Converter.",
    url: "https://gearizen.com/tools/iso-date-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      { url: "/og-placeholder.svg", width: 1200, height: 630, alt: "Gearizen ISO Date Converter" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ISO Date Converter | Gearizen",
    description:
      "Convert ISO dates and UNIX timestamps in your browser. 100% client-side.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function IsoDateConverterPage() {
  return <IsoDateConverterClient />;
}
