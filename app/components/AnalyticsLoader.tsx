// components/AnalyticsLoader.tsx
"use client";

import { useState } from "react";
import Script from "next/script";

/**
 * AnalyticsWindow
 *
 * Local alias olarak Window üzerine analytics için
 * ihtiyaç duyduğumuz özellikleri ekliyoruz.
 */
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  adsbygoogle?: unknown[];
};

/**
 * AnalyticsLoader
 *
 * - Sayfa interaktif olduğunda Google Analytics ve AdSense betiklerini yüklüyor.
 * - İkisi de yüklenene (veya hata verse) kadar üstte ince bir progress bar gösteriyor.
 * - Çevre değişkenlerinden (NEXT_PUBLIC_*) veya sabit fallback ID'lerden yararlanıyor.
 */
export default function AnalyticsLoader() {
  const [gaLoaded, setGaLoaded] = useState(false);
  const [adsenseLoaded, setAdsenseLoaded] = useState(false);

  // Ortam değişkeni ya da fallback
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-V74SWZ9H8B";
  const ADSENSE_CLIENT =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT ??
    "ca-pub-2108375251131552";

  // Henüz tamamlanmamışsa loader göster
  const loading = !gaLoaded || !adsenseLoaded;

  // Google Analytics yükleme tamamlandığında çağrılacak
  const handleGaLoad = () => {
    const win = window as AnalyticsWindow;
    win.dataLayer = win.dataLayer || [];
    win.gtag = (...args: unknown[]) => {
      win.dataLayer!.push(args);
    };
    win.gtag("js", new Date());
    win.gtag("config", GA_ID, {
      anonymize_ip: true,
      page_path: window.location.pathname,
    });
    setGaLoaded(true);
  };

  // AdSense yükleme tamamlandığında çağrılacak
  const handleAdsenseLoad = () => {
    const win = window as AnalyticsWindow;
    win.adsbygoogle = win.adsbygoogle || [];
    win.adsbygoogle.push({});
    setAdsenseLoaded(true);
  };

  return (
    <>
      {/* Üstte gradient progress bar */}
      {loading && (
        <div className="fixed inset-x-0 top-0 h-1 z-[999] overflow-hidden">
          <div className="gradient-bg h-full w-full animate-gradient-quick" />
        </div>
      )}

      {/* Google Analytics betiği */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
        onLoad={handleGaLoad}
        onError={() => {
          console.error(`[AnalyticsLoader] GA load error: ${GA_ID}`);
          setGaLoaded(true);
        }}
        crossOrigin="anonymous"
      />

      {/* Google AdSense betiği */}
      <Script
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        strategy="afterInteractive"
        onLoad={handleAdsenseLoad}
        onError={() => {
          console.error(
            `[AnalyticsLoader] AdSense load error: ${ADSENSE_CLIENT}`
          );
          setAdsenseLoaded(true);
        }}
        crossOrigin="anonymous"
      />
    </>
  );
}