// app/tools/color-toolkit/page.tsx
import { Metadata } from "next";
import { ColorToolkitClient } from "./color-toolkit-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Color Toolkit | Gearizen",
  description:
    "Convert, manipulate, and analyze colors in HEX, RGB, HSL & CMYK. Generate complementary, tints & shades, and verify WCAG-compliant contrast ratios—100% client-side, privacy-first, zero signup, instant results.",
  keywords: [
    "color converter",
    "hex to rgb",
    "rgb to hex",
    "hsl to rgb",
    "rgb to hsl",
    "cmyk converter",
    "complementary colors",
    "color tints",
    "color shades",
    "contrast checker",
    "WCAG compliance",
    "online color tool",
    "client-side color toolkit",
    "privacy-first color tool",
    "Gearizen color tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: "index, follow",
  alternates: { canonical: "/tools/color-toolkit" },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  openGraph: {
    title: "Color Toolkit | Gearizen",
    description:
      "Convert, manipulate, and analyze colors in HEX, RGB, HSL & CMYK. Generate complementary, tints & shades, and verify WCAG-compliant contrast ratios—100% client-side, privacy-first.",
    url: "https://gearizen.com/tools/color-toolkit",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/color-toolkit.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Color Toolkit Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Toolkit | Gearizen",
    description:
      "Convert, manipulate, and analyze colors in HEX, RGB, HSL & CMYK. Privacy-first, zero signup, instant results.",
    creator: "@gearizen",
    images: [
      {
        url: "https://gearizen.com/og/color-toolkit.png",
        alt: "Gearizen Color Toolkit Preview",
      },
    ],
  },
};

export default function ColorToolkitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center text-indigo-600">
        Color Toolkit: Converter & Contrast Checker
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
        Translate colors between HEX, RGB, HSL & CMYK and verify WCAG-compliant
        contrast ratios—copy any code or ratio with one click.
      </p>
      <ColorToolkitClient />
    </div>
  );
}