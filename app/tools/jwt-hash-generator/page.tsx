// app/tools/jwt-hash-generator/page.tsx

import JwtHashGeneratorClient from "./jwt-hash-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "JWT & Hash Generator | Gearizen",
  description:
    "Generate JSON Web Tokens (HS256, HS384, HS512) and cryptographic hashes (MD5, SHA-1, SHA-256 & bcrypt) with adjustable parameters entirely in your browser—privacy-first, zero signup, instant results.",
  keywords: [
    "JWT generator",
    "JWT hash",
    "HMAC-SHA256",
    "HMAC-SHA384",
    "HMAC-SHA512",
    "MD5 generator",
    "SHA-1 generator",
    "SHA-256 generator",
    "bcrypt hash",
    "crypto hash tool",
    "online JWT generator",
    "client-side JWT tool",
    "client-side hash tool",
    "privacy-first hash generator",
    "Gearizen JWT",
    "Gearizen hash tool"
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://gearizen.com/tools/jwt-hash-generator"
  },
  openGraph: {
    title: "JWT & Hash Generator | Gearizen",
    description:
      "Generate JSON Web Tokens (HS256, HS384, HS512) and cryptographic hashes (MD5, SHA-1, SHA-256 & bcrypt) with adjustable parameters entirely in your browser—privacy-first, zero signup, instant results.",
    url: "https://gearizen.com/tools/jwt-hash-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/jwt-hash-generator.png",
        width: 1200,
        height: 630,
        alt: "Gearizen JWT & Hash Generator Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT & Hash Generator | Gearizen",
    description:
      "Generate JSON Web Tokens (HS256, HS384, HS512) and cryptographic hashes (MD5, SHA-1, SHA-256 & bcrypt) with adjustable parameters entirely in your browser—privacy-first, zero signup, instant results.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/jwt-hash-generator.png"]
  }
};

export default function JwtHashGeneratorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "JWT & Hash Generator | Gearizen",
        url: "https://gearizen.com/tools/jwt-hash-generator",
        description:
          "Generate JSON Web Tokens (HS256, HS384, HS512) and cryptographic hashes (MD5, SHA-1, SHA-256 & bcrypt) with adjustable parameters entirely in your browser—privacy-first, zero signup, instant results.",
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
              name: "JWT & Hash Generator",
              item: "https://gearizen.com/tools/jwt-hash-generator"
            }
          ]
        }
      },
      {
        "@type": "SoftwareApplication",
        name: "JWT & Hash Generator",
        url: "https://gearizen.com/tools/jwt-hash-generator",
        applicationCategory: "DeveloperTools",
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
      }
    ]
  };

  return (
    <>
      {/* JSON-LD for structured data */}
      <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      {/* Breadcrumb structured data */}
      <BreadcrumbJsonLd
        pageTitle="JWT & Hash Generator"
        pageUrl="https://gearizen.com/tools/jwt-hash-generator"
      />

      {/* Main client component */}
      <main>
        <JwtHashGeneratorClient />
      </main>
    </>
  );
}