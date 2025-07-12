// app/page.tsx

import JsonLd from "./components/JsonLd";
import HomeClient from "./home-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  alternates: { canonical: "https://gearizen.com" },
  title: "Home | Gearizen – Free Client-Side Digital Tools",
  description:
    "Discover Gearizen’s most in-demand, privacy-first web tools: password generator, PDF to Word converter, QR code generator, unit converter and image compressor—100% client-side, no signup required.",
  openGraph: {
    title: "Home | Gearizen – Free Client-Side Digital Tools",
    description:
      "Explore Gearizen’s top tools—passwords, PDF to Word, QR codes, unit conversion and image compression—all privacy-first and signup-free.",
    url: "https://gearizen.com",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | Gearizen – Free Client-Side Digital Tools",
    description:
      "Explore Gearizen’s top tools—passwords, PDF to Word, QR codes, unit conversion and image compression—all privacy-first and signup-free.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: "https://gearizen.com/",
  name: "Gearizen",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://gearizen.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <HomeClient />
    </>
  );
}
