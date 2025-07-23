// next.config.ts
import type { NextConfig } from "next";

//
// Content Security Policy
// ——————————————————————————————————————————————
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://www.google-analytics.com https://pagead2.googlesyndication.com;
  connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com;
  frame-src https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com;
`.trim().replace(/\s{2,}/g, " ");

//
// Diğer Güvenlik Başlıkları
// ——————————————————————————————————————————————
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Tüm yollar için güvenlik başlıklarını ekle
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // Next 15+’ta SWC minify varsayılan, swcMinify bayrağına gerek yok
  // swcMinify: true, ← kaldırıldı
};

export default nextConfig;