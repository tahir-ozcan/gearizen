import UrlParserClient from "./url-parser-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "URL Parser",
  description:
    "Analyze any URL to view protocol, host, pathname, query parameters and more. All client-side with no tracking.",
  keywords: [
    "url parser",
    "link analyzer",
    "query parameters",
    "client-side url tools",
    "Gearizen url parser",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/url-parser" },
  openGraph: {
    title: "URL Parser | Gearizen",
    description:
      "Break down URLs into components with Gearizen's client-side URL Parser. Inspect protocol, host and query params easily.",
    url: "https://gearizen.com/tools/url-parser",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen URL Parser",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Parser | Gearizen",
    description:
      "Use Gearizen's URL Parser to decompose links into protocol, path and parameters—all in your browser.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function UrlParserPage() {
  return (
    <>
      <BreadcrumbJsonLd pageTitle="URL Parser" pageUrl="https://gearizen.com/tools/url-parser" />
      <UrlParserClient />
    </>
  );
}
