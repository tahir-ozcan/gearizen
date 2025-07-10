// app/privacy/page.tsx

import PrivacyClient from "./privacy-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Privacy Policy | Gearizen",
  description:
    "Read Gearizen’s privacy policy: all tools run entirely client-side. No data is collected, stored, or tracked—100% privacy-focused.",
  keywords: [
    "Gearizen privacy policy",
    "client-side privacy",
    "no data collection",
    "no tracking",
    "web tools privacy",
    "privacy-focused tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/privacy" },
  openGraph: {
    title: "Privacy Policy | Gearizen",
    description:
      "Learn how Gearizen safeguards your privacy: all tools run 100% client-side with no data collection, storage, or tracking.",
    url: "https://gearizen.com/privacy",
    siteName: "Gearizen",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Gearizen",
    description:
      "Gearizen’s privacy policy: 100% client-side tools, no data collection or tracking. Your privacy, our priority.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
