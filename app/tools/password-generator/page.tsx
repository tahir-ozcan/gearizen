// app/tools/password-generator/page.tsx

import PasswordGeneratorClient from "./password-generator-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";
import JsonLd from "@/app/components/JsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Strong Password Generator",
  description:
    "Create secure, customizable passwords instantly with Gearizen’s free client-side Password Generator. Adjust length and character sets—all without signup or tracking.",
  keywords: [
    "password generator",
    "strong password",
    "secure password tool",
    "client-side password generator",
    "free online password tool",
    "Gearizen password generator",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/password-generator" },
  openGraph: {
    title: "Strong Password Generator | Gearizen",
    description:
      "Generate robust passwords with Gearizen’s free Password Generator. Customize length and character types—100% client-side, no signup required.",
    url: "https://gearizen.com/tools/password-generator",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Strong Password Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Password Generator | Gearizen",
    description:
      "Use Gearizen’s client-side Password Generator to create strong, secure passwords instantly. No account needed, privacy-focused.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function PasswordGeneratorPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Strong Password Generator"
        pageUrl="https://gearizen.com/tools/password-generator"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Strong Password Generator",
          operatingSystem: "any",
          applicationCategory: "UtilitiesApplication",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <PasswordGeneratorClient />
    </>
  );
}
