// app/page.tsx

import JsonLd from "./components/JsonLd";
import BreadcrumbJsonLd from "./components/BreadcrumbJsonLd";
import Script from "next/script";
import HomeClient from "./home-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: {
    default: "Gearizen – Free Client-Side Digital Tools",
    template: "%s | Gearizen",
  },
  description:
    "Discover Gearizen’s most popular, privacy-first web tools – password & UUID generators, JSON formatter & validator, QR code creator, unit converter, image compressor & resizer, color contrast checker, Base64 encoder, code/HTML/CSS formatter & minifier, regex tester, text diff checker, time & timestamp converters, PDF & CSV utilities, SEO meta & Open Graph tag generators, JWT utilities and more – all 100% client-side, no signup required.",
  keywords: [
    "Gearizen",
    "free online tools",
    "client-side utilities",
    "password generator",
    "uuid generator",
    "JSON formatter",
    "QR code generator",
    "unit converter",
    "image compressor",
    "image resizer",
    "contrast checker",
    "Base64 encoder",
    "code formatter",
    "regex tester",
    "text diff",
    "time converter",
    "PDF converter",
    "CSV converter",
    "SEO meta tags",
    "Open Graph generator",
    "JWT tools",
    "privacy-first",
    "no signup",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com" },
  openGraph: {
    title: "Home | Gearizen – Free Client-Side Digital Tools",
    description:
      "Explore Gearizen’s top-tier privacy-first web tools—password & UUID generators, JSON validator, QR code creator, unit conversion, image optimization, code formatters, regex & diff testers, converters and more—100% in-browser, no signup.",
    url: "https://gearizen.com",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/home.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Home – Free Client-Side Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | Gearizen – Free Client-Side Digital Tools",
    description:
      "Access Gearizen’s all-in-one privacy-first toolbox: generators, converters, compressors, formatters, validators, and more—100% free, no signup.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/home.png"],
    imageAlt: "Gearizen Home – Free Client-Side Tools",
  },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Gearizen",
  url: "https://gearizen.com/",
  publisher: {
    "@type": "Organization",
    name: "Gearizen",
    url: "https://gearizen.com",
    logo: {
      "@type": "ImageObject",
      url: "https://gearizen.com/logo.png",
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://gearizen.com/tools?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const pageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Home",
  description:
    "Gearizen – your privacy-first suite of client-side web tools. No signup, no tracking, just powerful browser-based utilities.",
  url: "https://gearizen.com",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://gearizen.com",
      },
    ],
  },
  isPartOf: {
    "@type": "WebSite",
    name: "Gearizen",
    url: "https://gearizen.com",
  },
};

export default function HomePage() {
  return (
    <>
      {/* Breadcrumb JSON-LD */}
      <BreadcrumbJsonLd pageTitle="Home" pageUrl="https://gearizen.com" />

      {/* WebSite JSON-LD */}
      <JsonLd data={websiteLd} />

      {/* Page-level JSON-LD */}
      <Script id="home-page-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(pageLd)}
      </Script>

      {/* Main client-side home component */}
      <HomeClient />
    </>
  );
}