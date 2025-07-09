// app/tools/color-contrast-checker/page.tsx

import ColorContrastCheckerClient from "./color-contrast-checker-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Contrast Checker",
  description:
    "Check WCAG contrast ratio between text and background colors with Gearizen’s free client-side Color Contrast Checker. Ensure accessibility compliance instantly.",
  keywords: [
    "contrast checker",
    "color contrast",
    "WCAG contrast ratio",
    "accessibility tool",
    "client-side contrast checker",
    "free online contrast checker",
    "Gearizen contrast",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/color-contrast-checker" },
  openGraph: {
    title: "Contrast Checker | Gearizen",
    description:
      "Verify WCAG compliance easily with Gearizen’s free Color Contrast Checker. Compare text and background colors, view pass/fail results client-side.",
    url: "https://gearizen.com/tools/color-contrast-checker",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Color Contrast Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contrast Checker | Gearizen",
    description:
      "Use Gearizen’s client-side Contrast Checker to verify WCAG contrast ratios between text and background colors. No signup required.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function ColorContrastCheckerPage() {
  return <ColorContrastCheckerClient />;}