// app/tools/unit-converter/page.tsx

import UnitConverterClient from "./unit-converter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Unit Converter",
  description:
    "Convert units of length, weight, temperature, and volume instantly with Gearizen’s free client-side Unit Converter. No signup required.",
  keywords: [
    "unit converter",
    "convert units",
    "length converter",
    "weight converter",
    "temperature converter",
    "volume converter",
    "client-side unit converter",
    "free online converter",
    "Gearizen unit converter",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/unit-converter" },
  openGraph: {
    title: "Unit Converter | Gearizen",
    description:
      "Use Gearizen’s client-side Unit Converter to convert between meters, miles, kilograms, pounds, Celsius, Fahrenheit, liters, gallons and more—instantly and free.",
    url: "https://gearizen.com/tools/unit-converter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Unit Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unit Converter | Gearizen",
    description:
      "Instantly convert length, weight, temperature & volume units with Gearizen’s client-side Unit Converter. Fast, private, and no login.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function UnitConverterPage() {  return (
    <>
      <BreadcrumbJsonLd pageTitle="Unit Converter" pageUrl="https://gearizen.com/tools/unit-converter" />
      <UnitConverterClient />
    </>
  );
}