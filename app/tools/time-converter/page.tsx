// app/tools/time-converter/page.tsx

import TimeConverterClient from "./time-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Time Converter | Gearizen",
  description:
    "Convert local date/time to any time zone instantly. Paste or pick a date/time, choose a target zone, and get the result—100% client-side, no signup required.",
  keywords: [
    "time converter",
    "timezone converter",
    "convert time zones",
    "local time to UTC",
    "time zone tool",
    "client-side time converter",
    "Gearizen time converter",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/time-converter" },
  openGraph: {
    title: "Time Converter | Gearizen",
    description:
      "Pick or paste a date/time and convert it to any time zone with Gearizen’s free, client-side Time Converter. Instant results in your browser, no signup required.",
    url: "https://gearizen.com/tools/time-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Time Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Converter | Gearizen",
    description:
      "Convert date/time between time zones instantly—paste or pick a date/time and choose your zone, all in your browser with Gearizen’s Time Converter.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function TimeConverterPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Time Converter"
        pageUrl="https://gearizen.com/tools/time-converter"
      />
      <TimeConverterClient />
    </>
  );
}