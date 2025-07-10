// app/tools/currency-converter/page.tsx

import CurrencyConverterClient from "./currency-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Currency Converter",
  description:
    "Convert amounts between popular currencies using offline rates. Gearizen’s Currency Converter runs entirely client-side with no signup required.",
  keywords: [
    "currency converter",
    "exchange rate converter",
    "USD to EUR converter",
    "live currency rates",
    "client-side currency converter",
    "free online currency tool",
    "Gearizen currency converter",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/currency-converter" },
  openGraph: {
    title: "Currency Converter | Gearizen",
    description:
      "Use Gearizen’s client-side Currency Converter to convert between global currencies offline—no network requests or signup needed.",
    url: "https://gearizen.com/tools/currency-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Currency Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Currency Converter | Gearizen",
    description:
      "Instantly convert currencies offline with Gearizen’s free client-side Currency Converter. No account needed, privacy-focused.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function CurrencyConverterPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Currency Converter"
        pageUrl="https://gearizen.com/tools/currency-converter"
      />
      <CurrencyConverterClient />
    </>
  );
}
