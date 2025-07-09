// app/tools/jwt-decoder/page.tsx
import JwtDecoderClient from "./jwt-decoder-client";
import BreadcrumbJsonLd from "@/app/components/BreadcrumbJsonLd";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "JWT Decoder",
  description:
    "Decode any JSON Web Token's header, payload, and signature instantly in your browser with Gearizen’s free client-side JWT Decoder. No signup required.",
  keywords: [
    "JWT decoder",
    "JSON Web Token decode",
    "JWT header payload",
    "client-side JWT tool",
    "free online JWT decoder",
    "Gearizen JWT",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/jwt-decoder" },
  openGraph: {
    title: "JWT Decoder | Gearizen",
    description:
      "Instantly decode and inspect your JWT’s header, payload, and signature in the browser with Gearizen’s privacy-focused JWT Decoder tool.",
    url: "https://gearizen.com/tools/jwt-decoder",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen JWT Decoder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Decoder | Gearizen",
    description:
      "Decode your JSON Web Tokens client-side with Gearizen’s free JWT Decoder. View header, payload, and signature instantly. No tracking.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function JwtDecoderPage() {  return (
    <>
      <BreadcrumbJsonLd pageTitle="JWT Decoder" pageUrl="https://gearizen.com/tools/jwt-decoder" />
      <JwtDecoderClient />
    </>
  );
}