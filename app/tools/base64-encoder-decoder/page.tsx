// app/tools/base64-encoder-decoder/page.tsx
import dynamic from "next/dynamic";
import Script from "next/script";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  // Rich metadata for SEO & social sharing
  metadataBase: new URL("https://gearizen.com"),
  title: "Base64 Encoder & Decoder | Gearizen",
  description:
    "Convert text and files to/from Base64 instantly—drag & drop, presets, live preview, shareable links, privacy-first, zero signup.",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "Base64 converter",
    "online Base64 tool",
    "drag and drop Base64",
    "shareable Base64 link",
    "privacy-first",
    "Gearizen",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://gearizen.com/tools/base64-encoder-decoder",
  },
  openGraph: {
    title: "Base64 Encoder & Decoder | Gearizen",
    description:
      "Convert text and files to/from Base64 instantly—drag & drop, presets, live preview, shareable links, privacy-first, zero signup.",
    url: "https://gearizen.com/tools/base64-encoder-decoder",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gearizen.com/og/base64-encoder-decoder.png",
        width: 1200,
        height: 630,
        alt: "Gearizen Base64 Encoder & Decoder Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encoder & Decoder | Gearizen",
    description:
      "Convert text and files to/from Base64 instantly—drag & drop, presets, live preview, shareable links, privacy-first, zero signup.",
    creator: "@gearizen",
    images: ["https://gearizen.com/og/base64-encoder-decoder.png"],
    imageAlt: "Preview of Gearizen Base64 Encoder & Decoder",
  },
  // Theme color for mobile browsers
  themeColor: "#7c3aed",
};

const Base64EncoderDecoderClient = dynamic(
  // Code-split client component; SSR disabled for pure client-side behavior
  () => import("./base64-encoder-decoder-client"),
  {
    ssr: false,
    loading: () => (
      <p className="text-center py-8 text-gray-600">
        Loading Base64 Encoder &amp; Decoder…
      </p>
    ),
  }
);

export default function Base64EncoderDecoderPage() {
  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Base64 Encoder & Decoder | Gearizen",
        url: "https://gearizen.com/tools/base64-encoder-decoder",
        description:
          "Convert text and files to/from Base64 instantly—drag & drop, presets, live preview, shareable links, privacy-first, zero signup.",
        publisher: {
          "@type": "Organization",
          name: "Gearizen",
          url: "https://gearizen.com",
          logo: {
            "@type": "ImageObject",
            url: "https://gearizen.com/logo.png",
          },
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://gearizen.com" },
            { "@type": "ListItem", position: 2, name: "Tools", item: "https://gearizen.com/tools" },
            {
              "@type": "ListItem",
              position: 3,
              name: "Base64 Encoder & Decoder",
              item: "https://gearizen.com/tools/base64-encoder-decoder",
            },
          ],
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Base64 Encoder & Decoder",
        url: "https://gearizen.com/tools/base64-encoder-decoder",
        applicationCategory: "Utilities",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "Gearizen", url: "https://gearizen.com" },
      },
    ],
  };

  return (
    <>
      {/* JSON-LD for search engines */}
      <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      {/* Breadcrumb structured data */}
      <BreadcrumbJsonLd
        pageTitle="Base64 Encoder & Decoder"
        pageUrl="https://gearizen.com/tools/base64-encoder-decoder"
      />

      <main
        aria-label="Base64 Encoder & Decoder Tool"
        className="container mx-auto px-4 py-8"
      >
        {/* Fallback for users without JavaScript */}
        <noscript>
          <div className="p-4 mb-6 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md">
            JavaScript is required for this tool. Please enable it in your browser.
          </div>
        </noscript>

        {/* Lazy-loaded client component with enhanced UX */}
        <Base64EncoderDecoderClient
          defaultMode="encode"
          showPresets
          showShare
          debounceMs={400}
        />
      </main>
    </>
  );
}