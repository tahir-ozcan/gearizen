// app/cookies/page.tsx

import CookiesClient from "./cookies-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Cookie Policy | Gearizen",
  description:
    "Learn about Gearizen’s cookie policy: no first-party cookies are used, but third-party ad and analytics cookies may be set. Discover how to manage and opt out.",
  keywords: [
    "cookie policy",
    "cookies",
    "third-party cookies",
    "analytics cookies",
    "advertising cookies",
    "privacy policy",
    "browser cookies",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/cookies" },
  openGraph: {
    title: "Cookie Policy | Gearizen",
    description:
      "Gearizen does not use first-party cookies; third-party networks may set advertising and analytics cookies. Learn how to manage your preferences.",
    url: "https://gearizen.com/cookies",
    siteName: "Gearizen",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Cookie Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy | Gearizen",
    description:
      "Understand Gearizen’s cookie policy: no first-party cookies, and third-party ad and analytics cookies may apply. Manage cookies anytime.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function CookiePage() {
  return <CookiesClient />;
}
