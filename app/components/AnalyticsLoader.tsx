// components/AnalyticsLoader.tsx
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function AnalyticsLoader() {
  // show a tiny top-loader pill while analytics scripts are still injecting
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // once all scripts are in the DOM, hide the loader
    setLoading(false);
  }, []);

  return (
    <>
      {/* Gradient top-loader pill */}
      {loading && (
        <div className="fixed inset-x-0 top-0 h-1 overflow-hidden z-[999]">
          <div className="gradient-bg h-full w-full animate-gradient-quick" />
        </div>
      )}

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-V74SWZ9H8B"
        strategy="afterInteractive"
        onLoad={() => {
          // initialize dataLayer
          window.dataLayer = window.dataLayer || [];

          // gtag function pushes to dataLayer
          function gtag(...args: unknown[]) {
            window.dataLayer.push(args);
          }

          gtag("js", new Date());
          gtag("config", "G-V74SWZ9H8B");
        }}
        crossOrigin="anonymous"
      />

      {/* Google AdSense */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2108375251131552"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
    </>
  );
}