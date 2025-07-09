// app/tools/open-graph-preview/page.tsx
import OpenGraphPreviewClient from "./open-graph-preview-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Open Graph Preview",
  description:
    "Preview Open Graph metadata for any URL—title, description, image, and site name—in a clean preview card. 100% client-side, no signup required.",
  keywords: [
    "open graph preview",
    "og metadata",
    "social card preview",
    "client-side og tool",
    "seo preview",
    "Gearizen OG preview",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/open-graph-preview" },
  openGraph: {
    title: "Open Graph Preview | Gearizen",
    description:
      "Enter any URL to instantly see its Open Graph metadata—title, description, image and site name—in a preview card. No signup needed.",
    url: "https://gearizen.com/tools/open-graph-preview",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-open-graph-preview.png",
        width: 1200,
        height: 630,
        alt: "Open Graph Preview | Gearizen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Graph Preview | Gearizen",
    description:
      "Client-side Open Graph metadata preview for any URL—see title, description, image and site name in a card. Free, no signup.",
    creator: "@gearizen",
    images: ["/og-open-graph-preview.png"],
  },
};

export default function OpenGraphPreviewPage() {
  return <OpenGraphPreviewClient />;
}