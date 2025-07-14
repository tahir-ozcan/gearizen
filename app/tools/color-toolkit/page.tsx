// app/tools/color-toolkit/page.tsx

import ColorToolkitClient from "./color-toolkit-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Color Toolkit | Gearizen",
  description:
    "Enter any HEX, RGB, or HSL color to convert between formats, generate complementary colors, tints and shades—all client-side with Gearizen’s Color Toolkit.",
  keywords: [
    "color converter",
    "hex to rgb",
    "rgb to hex",
    "hsl converter",
    "complementary color",
    "color tints",
    "color shades",
    "online color tool",
    "client-side color toolkit",
    "Gearizen color tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/color-toolkit" },
  openGraph: {
    title: "Color Toolkit | Gearizen",
    description:
      "Use Gearizen’s free, client-side Color Toolkit to convert HEX, RGB & HSL formats, and generate complementary colors, tints & shades—no signup required.",
    url: "https://gearizen.com/tools/color-toolkit",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Color Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Toolkit | Gearizen",
    description:
      "Instantly convert and explore colors in HEX, RGB & HSL with Gearizen’s client-side Color Toolkit—copy codes or generate tints & shades in your browser.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function ColorToolkitPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Color Toolkit"
        pageUrl="https://gearizen.com/tools/color-toolkit"
      />
      <ColorToolkitClient />
    </>
  );
}