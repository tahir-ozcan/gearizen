// app/tools/css-formatter/page.tsx

import CssFormatterClient from "./css-formatter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "CSS Formatter & Minifier",
  description:
    "Beautify or minify your CSS code instantly with Gearizen’s free client-side CSS Formatter & Minifier. Adjust indentation or strip whitespace—all without signup.",
  keywords: [
    "css formatter",
    "css beautifier",
    "css minifier",
    "format css",
    "beautify css",
    "Gearizen tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/css-formatter" },
  openGraph: {
    title: "CSS Formatter & Minifier | Gearizen",
    description:
      "Use Gearizen’s client-side CSS Formatter & Minifier to prettify or compress your stylesheets. Copy or download your result—100% free.",
    url: "https://gearizen.com/tools/css-formatter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen CSS Formatter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSS Formatter & Minifier | Gearizen",
    description:
      "Format or minify CSS completely offline with Gearizen’s free tool—no account needed, privacy-focused.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function CssFormatterPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="CSS Formatter & Minifier"
        pageUrl="https://gearizen.com/tools/css-formatter"
      />
      <CssFormatterClient />
    </>
  );
}
