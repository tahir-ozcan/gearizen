// app/tools/jwt-hash-generator/page.tsx

import JwtHashGeneratorClient from "./jwt-hash-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "JWT Hash Generator | Gearizen",
  description:
    "Generate JSON Web Tokens (JWT) signed with HS256, HS384, or HS512 entirely in your browser. Enter a JSON payload and secret key, choose your algorithm, then generate and copy your token—no backend, no signup required.",
  keywords: [
    "JWT generator",
    "jwt hash",
    "HS256",
    "HS384",
    "HS512",
    "HMAC-SHA256",
    "HMAC-SHA384",
    "HMAC-SHA512",
    "online JWT tool",
    "client-side JWT",
    "Gearizen JWT",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/jwt-hash-generator" },
  openGraph: {
    title: "JWT Hash Generator | Gearizen",
    description:
      "Use Gearizen’s JWT Hash Generator to create HMAC-signed JSON Web Tokens (HS256/HS384/HS512) in your browser. Enter payload and secret, choose algorithm, then copy your token instantly.",
    url: "https://gearizen.com/tools/jwt-hash-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen JWT Hash Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Hash Generator | Gearizen",
    description:
      "Generate HS256, HS384, or HS512 JSON Web Tokens (JWT) client-side with Gearizen’s free JWT Hash Generator. No server, no signup—copy your token in one click.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function JwtHashGeneratorPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="JWT Hash Generator"
        pageUrl="https://gearizen.com/tools/jwt-hash-generator"
      />
      <JwtHashGeneratorClient />
    </>
  );
}