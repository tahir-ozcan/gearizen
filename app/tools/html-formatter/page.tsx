// app/tools/html-formatter/page.tsx

import HtmlFormatterClient from "./html-formatter-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "HTML Formatter & Minifier",
  description:
    "Beautify or minify your HTML code instantly with Gearizen’s free client-side HTML Formatter & Minifier. Adjust indentation or strip whitespace—no signup required.",
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
  alternates: { canonical: "https://gearizen.com/tools/html-formatter" },
  openGraph: {
    title: "HTML Formatter & Minifier | Gearizen",
    description:
      "Use Gearizen’s client-side HTML Formatter & Minifier to quickly prettify or compress your HTML code. Copy or download your result—100% free.",
    url: "https://gearizen.com/tools/html-formatter",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-html-formatter.png",
        width: 1200,
        height: 630,
        alt: "Gearizen HTML Formatter & Minifier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HTML Formatter & Minifier | Gearizen",
    description:
      "Transform your HTML with Gearizen’s free client-side HTML Formatter & Minifier—beautify or minify code instantly, no backend needed.",
    creator: "@gearizen",
    images: ["/og-html-formatter.png"],
  },
};

export default function HtmlFormatterPage() {
  return <HtmlFormatterClient />;
}