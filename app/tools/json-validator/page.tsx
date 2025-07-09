// app/tools/json-validator/page.tsx
import JsonValidatorClient from "./json-validator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "JSON Validator & Linter | Gearizen",
  description:
    "Validate, lint, and beautify your JSON instantly with Gearizen’s free, client-side JSON Validator & Linter. Find syntax errors and get formatted output — no signup required.",
  keywords: [
    "JSON validator",
    "JSON linter",
    "JSON syntax checker",
    "online JSON tool",
    "client-side JSON validator",
    "free JSON formatter",
    "Gearizen JSON",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/json-validator" },
  openGraph: {
    title: "JSON Validator & Linter | Gearizen",
    description:
      "Check and beautify your JSON data in the browser with Gearizen’s privacy-first JSON Validator & Linter. Instant feedback, no tracking.",
    url: "https://gearizen.com/tools/json-validator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen JSON Validator & Linter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Validator & Linter | Gearizen",
    description:
      "Instantly validate, lint, and format your JSON with Gearizen’s client-side JSON Validator & Linter. No signup, no tracking.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function JsonValidatorPage() {  return (
    <>
      <BreadcrumbJsonLd pageTitle="JSON Validator & Linter" pageUrl="https://gearizen.com/tools/json-validator" />
      <JsonValidatorClient />
    </>
  );
}