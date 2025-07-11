// app/tools/markup-formatter/page.tsx

import MarkupFormatterClient from "./markup-formatter-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Markup Formatter & Minifier",
  description:
    "Beautify or minify your HTML or XML markup instantly with Gearizen’s free client-side tool. Adjust indentation or strip whitespace—no signup required.",
  keywords: [
    "html formatter",
    "html minifier",
    "beautify html",
    "minify html",
    "client-side html tool",
    "free online html formatter",
    "Gearizen html formatter",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/markup-formatter" },
  openGraph: {
    title: "Markup Formatter & Minifier | Gearizen",
    description:
      "Use Gearizen’s client-side Markup Formatter to quickly prettify or compress HTML and XML. Copy or download your result—100% free.",
    url: "https://gearizen.com/tools/markup-formatter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Markup Formatter & Minifier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markup Formatter & Minifier | Gearizen",
    description:
      "Transform your markup with Gearizen’s free client-side formatter—beautify or minify HTML or XML instantly, no backend needed.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function MarkupFormatterPage() {
  return (
    <>
      <BreadcrumbJsonLd pageTitle="Markup Formatter & Minifier" pageUrl="https://gearizen.com/tools/markup-formatter" />
      <MarkupFormatterClient />
    </>
  );
}
