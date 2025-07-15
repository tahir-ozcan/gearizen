// app/contact/page.tsx

import type { Metadata } from "next";
import Script from "next/script";
import dynamic from "next/dynamic";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import JsonLd from "@/app/components/JsonLd";

// Load form as a pure client module (no SSR)
const ContactClient = dynamic(() => import("./contact-client"), {
  ssr: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Contact Us | Gearizen — Free, Privacy-First Web Tools",
  description:
    "Have questions, feedback, or feature requests? Reach out to Gearizen—your source for free, client-side web tools. Fast, private, zero signup.",
  keywords: [
    "Gearizen contact",
    "free online tools support",
    "client-side tools help",
    "developer tools feedback",
    "privacy-focused web tools",
    "feature requests",
    "tool support",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/contact" },
  openGraph: {
    title: "Contact Us | Gearizen",
    description:
      "Have questions or feedback? Contact Gearizen—the platform offering free, privacy-first, client-side web tools with no signup required.",
    url: "https://gearizen.com/contact",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/contact.png",
        width: 1200,
        height: 630,
        alt: "Contact Gearizen – Free Client-Side Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Gearizen",
    description:
      "Reach out to Gearizen for support, feedback, or feature requests. 100% client-side, privacy-focused web tools.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/contact.png"],
  },
};

export default function ContactPage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Gearizen",
    url: "https://gearizen.com",
    logo: {
      "@type": "ImageObject",
      url: "https://gearizen.com/logo.png",
    },
    sameAs: [
      "https://twitter.com/gearizen",
      "https://github.com/gearizen",
      "https://linkedin.com/company/gearizen",
    ],
  };

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Contact Us",
    url: "https://gearizen.com/contact",
    description:
      "Have questions, feedback, or feature requests? Reach out to Gearizen—your source for free, client-side web tools. Fast, private, zero signup.",
    publisher: {
      "@type": "Organization",
      name: "Gearizen",
      url: "https://gearizen.com",
      logo: {
        "@type": "ImageObject",
        url: "https://gearizen.com/logo.png",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://gearizen.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: "https://gearizen.com/contact",
        },
      ],
    },
  };

  return (
    <>
      {/* Organization structured data */}
      <JsonLd data={orgJsonLd} />

      {/* WebPage structured data */}
      <Script id="contact-page-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(pageJsonLd)}
      </Script>

      {/* Breadcrumb */}
      <BreadcrumbJsonLd pageTitle="Contact" pageUrl="https://gearizen.com/contact" />

      {/* Pure client component */}
      <ContactClient />
    </>
  );
}