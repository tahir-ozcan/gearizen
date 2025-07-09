import React from "react";
import Script from "next/script";

export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      // use Next.js Script to satisfy CSP
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
