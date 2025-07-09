// app/tools/unix-timestamp-converter/page.tsx

import UnixTimestampConverterClient from "./unix-timestamp-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Timestamp Converter | Gearizen",
  description:
    "Convert UNIX timestamps to human-readable dates and vice versa with Gearizen’s free client-side Timestamp Converter. Instant, no signup required.",
  keywords: [
    "unix timestamp",
    "timestamp converter",
    "epoch converter",
    "convert timestamp",
    "date to timestamp",
    "client-side timestamp tool",
    "free online converter",
    "Gearizen timestamp",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/unix-timestamp-converter" },
  openGraph: {
    title: "Timestamp Converter | Gearizen",
    description:
      "Use Gearizen’s client-side Timestamp Converter to switch between UNIX epoch seconds/milliseconds and formatted dates instantly. No login needed.",
    url: "https://gearizen.com/tools/unix-timestamp-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Timestamp Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Timestamp Converter | Gearizen",
    description:
      "Instantly convert between UNIX timestamps and human-readable dates with Gearizen’s client-side Timestamp Converter. Fast, private, and free.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function TimestampConverterPage() {  return (
    <>
      <BreadcrumbJsonLd pageTitle="Timestamp Converter" pageUrl="https://gearizen.com/tools/unix-timestamp-converter" />
      <UnixTimestampConverterClient />
    </>
  );
}