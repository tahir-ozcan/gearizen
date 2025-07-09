// app/tools/code-minifier/page.tsx

import CodeMinifierClient from "./code-minifier-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Code Minifier | Gearizen",
  description:
    "Minify JavaScript, CSS, or HTML code instantly with Gearizen’s free client-side Code Minifier tool. Copy or download your minified code without signup!",
  keywords: [
    "code minifier",
    "JavaScript minify",
    "CSS minify",
    "HTML minify",
    "client-side minifier",
    "free online code minifier",
    "Gearizen code minifier",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/code-minifier" },
  openGraph: {
    title: "Code Minifier | Gearizen",
    description:
      "Use Gearizen’s client-side Code Minifier to compress JavaScript, CSS, or HTML code instantly. No tracking, no signup—copy or download in your browser.",
    url: "https://gearizen.com/tools/code-minifier",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Code Minifier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Minifier | Gearizen",
    description:
      "Compress your JavaScript, CSS, or HTML code in the browser with Gearizen’s client-side Code Minifier. No account needed.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function CodeMinifierPage() {
  return <CodeMinifierClient />;}