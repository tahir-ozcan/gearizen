// app/tools/password-generator/page.tsx

import PasswordGeneratorClient from "./password-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import JsonLd from "@/app/components/JsonLd";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Strong Password Generator | Gearizen",
  description:
    "Generate robust, customizable passwords with options for length, complexity, character sets and entropy visualization—100% client-side, privacy-first, zero signup, instant results in your browser.",
  keywords: [
    "password generator",
    "strong password",
    "secure password",
    "password entropy",
    "password complexity",
    "customizable passwords",
    "client-side password tool",
    "free online password generator",
    "privacy-first password generator",
    "Gearizen password tools"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/password-generator" },
  openGraph: {
    title: "Strong Password Generator | Gearizen",
    description:
      "Generate robust, customizable passwords with options for length, complexity, character sets and entropy visualization—100% client-side, privacy-first, zero signup, instant results in your browser.",
    url: "https://gearizen.com/tools/password-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/password-generator.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Strong Password Generator Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Strong Password Generator | Gearizen",
    description:
      "Generate robust, customizable passwords with options for length, complexity, character sets and entropy visualization—100% client-side, privacy-first, zero signup, instant results.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/password-generator.png"]
  }
};

export default function PasswordGeneratorPage() {
  const webpageStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Strong Password Generator | Gearizen",
        url: "https://gearizen.com/tools/password-generator",
        description:
          "Generate robust, customizable passwords with options for length, complexity, character sets and entropy visualization—100% client-side, privacy-first, zero signup, instant results in your browser.",
        publisher: {
          "@type": "Organization",
          name: "Gearizen",
          url: "https://gearizen.com",
          logo: {
            "@type": "ImageObject",
            url: "https://gearizen.com/logo.png"
          }
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://gearizen.com"
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Tools",
              item: "https://gearizen.com/tools"
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Strong Password Generator",
              item: "https://gearizen.com/tools/password-generator"
            }
          ]
        }
      }
    ]
  };

  return (
    <>
      {/* JSON-LD for the WebPage */}
      <Script
        id="ld-webpage"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(webpageStructuredData)}
      </Script>

      {/* Breadcrumb structured data */}
      <BreadcrumbJsonLd
        pageTitle="Strong Password Generator"
        pageUrl="https://gearizen.com/tools/password-generator"
      />

      {/* SoftwareApplication structured data */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Strong Password Generator",
          url: "https://gearizen.com/tools/password-generator",
          applicationCategory: "SecurityTool",
          operatingSystem: "All",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
          },
          publisher: {
            "@type": "Organization",
            name: "Gearizen",
            url: "https://gearizen.com"
          }
        }}
      />

      {/* Main client component */}
      <main>
        <PasswordGeneratorClient />
      </main>
    </>
  );
}