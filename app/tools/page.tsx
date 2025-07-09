// app/tools/page.tsx

import ToolsClient from "./tools-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Free Online Tools",
  description:
    "Explore Gearizen’s 100% client-side toolbox: password & bcrypt generators, JSON tools, QR code creator, unit & currency converters, image compressor & resizer, contrast checker, Base64 encoding, code & HTML formatters, regex tester, diff checker, timestamp converter, PDF and CSV utilities, SEO & OG tag generators, JWT decoder, and more—all free, no signup.",
  keywords: [
    "free online tools",
    "client-side tools",
    "password generator",
    "bcrypt generator",
    "JSON formatter",
    "JSON validator",
    "QR code generator",
    "unit converter",
    "currency converter",
    "image compressor",
    "image resizer",
    "contrast checker",
    "base64 encoder",
    "code minifier",
    "markdown to html",
    "regex tester",
    "text diff checker",
    "timestamp converter",
    "PDF compressor",
    "PDF to Word",
    "CSV to JSON",
    "HTML formatter",
    "HTML to PDF",
    "SEO meta tag generator",
    "Open Graph preview",
    "JWT decoder",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools" },
  openGraph: {
    title: "Free Online Tools | Gearizen",
    description:
      "Access Gearizen’s extended suite of privacy-focused, client-side web tools—security, formatting, conversion, compression, validation, and more without signup.",
    url: "https://gearizen.com/tools",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-tools.png", width: 1200, height: 630, alt: "Gearizen – Free Online Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools | Gearizen",
    description:
      "Discover Gearizen’s all-in-one client-side toolbox: generators, converters, compressors, formatters, validators, and more—100% free with no signup.",
    creator: "@gearizen",
    images: ["/og-tools.png"],
  },
};

export default function ToolsPage() {
  return <ToolsClient />;
}