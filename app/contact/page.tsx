// app/contact/page.tsx

import ContactClient from "./contact-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Contact Us | Gearizen",
  description:
    "Get in touch with Gearizen—your source for free, client-side web tools. Share feedback, questions, or feature requests to help us improve.",
  keywords: [
    "Gearizen contact",
    "free online tools support",
    "client-side tools help",
    "developer tools feedback",
    "privacy-focused web tools",
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
        url: "/og-placeholder.svg",
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
    images: ["/og-placeholder.svg"],
  },
};

import { Suspense } from "react";
import Spinner from "../../components/Spinner";

export default function ContactPage() {
  return (
    <Suspense fallback={<Spinner className="mx-auto mt-10" />}>
      <ContactClient />
    </Suspense>
  );
}
