"use client";
import Script from "next/script";

export default function AnalyticsLoader() {
  return (
    <>
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />

      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2108375251131552"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-V74SWZ9H8B"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-V74SWZ9H8B', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
