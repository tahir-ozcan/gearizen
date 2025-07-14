// app/tools/code-formatter-minifier/page.tsx

import CodeFormatterMinifierClient from "./code-formatter-minifier-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Code Formatter & Minifier | Gearizen",
  description:
    "Beautify or compress your HTML, CSS and JavaScript code for readability or performance—100% client-side, no uploads. Instant results in your browser with Gearizen’s Code Formatter & Minifier.",
  keywords: [
    "code formatter",
    "code minifier",
    "js-beautify",
    "html beautify",
    "css beautify",
    "javascript compression",
    "online code formatter",
    "free code minifier",
    "client-side code formatter",
    "Gearizen code tools",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/code-formatter-minifier" },
  openGraph: {
    title: "Code Formatter & Minifier | Gearizen",
    description:
      "Use Gearizen’s free, client-side Code Formatter & Minifier to instantly beautify or compress your HTML, CSS and JavaScript code—no server, no uploads.",
    url: "https://gearizen.com/tools/code-formatter-minifier",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Code Formatter & Minifier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Formatter & Minifier | Gearizen",
    description:
      "Beautify or minify your HTML, CSS & JavaScript code instantly in the browser with Gearizen’s client-side tool—no uploads, instant results.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function CodeFormatterMinifierPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Code Formatter & Minifier"
        pageUrl="https://gearizen.com/tools/code-formatter-minifier"
      />
      <CodeFormatterMinifierClient />
    </>
  );
}