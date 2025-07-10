// app/terms/page.tsx

import TermsClient from "./terms-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Terms of Use | Gearizen",
  description:
    "Read Gearizen’s Terms of Use: guidelines for accessing and using our free, client-side digital tools. No signup required.",
  keywords: [
    "Gearizen terms of use",
    "terms of service",
    "client-side tools policy",
    "privacy-focused tools terms",
    "web tools legal",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/terms" },
  openGraph: {
    title: "Terms of Use | Gearizen",
    description:
      "Review the Terms of Use for Gearizen’s free, client-side web tools—password generators, JSON formatters, QR code creators, and more. No signup needed.",
    url: "https://gearizen.com/terms",
    siteName: "Gearizen",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Terms of Use | Gearizen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use | Gearizen",
    description:
      "Review Gearizen’s Terms of Use: guidelines for using our free, client-side digital tools. No signup required.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
