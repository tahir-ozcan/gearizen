// app/tools/bcrypt-generator/page.tsx

import BcryptGeneratorClient from "./bcrypt-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Bcrypt Hash Generator | Gearizen",
  description:
    "Generate bcrypt hashes client-side with Gearizen’s free Bcrypt Hash Generator. Adjust salt rounds, copy your hash instantly—no signup required.",
  keywords: [
    "bcrypt generator",
    "bcrypt hash",
    "password hashing",
    "client-side bcrypt",
    "free bcrypt tool",
    "Gearizen bcrypt",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/bcrypt-generator" },
  openGraph: {
    title: "Bcrypt Hash Generator | Gearizen",
    description:
      "Use Gearizen’s client-side Bcrypt Hash Generator to quickly generate strong bcrypt hashes for any password. No login needed.",
    url: "https://gearizen.com/tools/bcrypt-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Bcrypt Hash Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bcrypt Hash Generator | Gearizen",
    description:
      "Instantly create bcrypt password hashes in your browser with Gearizen’s client-side Bcrypt Generator. Fast, private, and free.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function BcryptGeneratorPage() {  return (
    <>
      <BreadcrumbJsonLd pageTitle="Bcrypt Hash Generator" pageUrl="https://gearizen.com/tools/bcrypt-generator" />
      <BcryptGeneratorClient />
    </>
  );
}