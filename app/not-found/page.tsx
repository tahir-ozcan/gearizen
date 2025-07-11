// app/not-found/page.tsx

import NotFoundClient from "./not-found-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "404 – Page Not Found | Gearizen",
  description:
    "The page you’re looking for isn’t here. Discover Gearizen’s free, privacy-first client-side tools: password generators, JSON formatters, text converters, QR code generators, and more.",
  keywords: [
    "404 page",
    "page not found",
    "Gearizen 404",
    "client-side tools",
    "privacy focused web tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: false, follow: true },
  alternates: { canonical: "https://gearizen.com/404" },
  openGraph: {
    title: "404 – Page Not Found | Gearizen",
    description:
      "Oops! That page doesn’t exist. Explore Gearizen’s suite of free, client-side digital tools for developers and creators.",
    url: "https://gearizen.com/404",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "404 – Page Not Found | Gearizen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "404 – Page Not Found | Gearizen",
    description:
      "Oops! That page isn’t here. Check out Gearizen’s free, client-side web tools with no signup required.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function NotFoundPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="404 – Page Not Found"
        pageUrl="https://gearizen.com/404"
      />
      <NotFoundClient />
    </>
  );
}
