// next.config.ts
import type { NextConfig } from "next";

const ContentSecurityPolicy = [
  "default-src 'self';",
  // Inline scripts are needed for Next.js hydration & Google Tag Manager
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com;",
  // Allow analytics & ads images + data URIs for our canvas exports
  "img-src 'self' data: https://www.google-analytics.com https://pagead2.googlesyndication.com;",
  // Allow in-page styles for our Tailwind utility CSS
  "style-src 'self' 'unsafe-inline';",
  // Allow fetch/beacon calls to analytics & ad endpoints
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com;",
  // Allow ad frames
  "frame-src https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com;"
].join(" ");

const nextConfig: NextConfig = {
  // Eğer PDF.js worker'ı public/pdf.worker.min.js olarak kopyaladıysanız,
  // webpack tarafında ekstra ayar yapmaya gerek kalmaz. workerSrc = '/pdf.worker.min.js'
  // kodunuzda bu yolu kullanabilirsiniz.

  // Global olarak tüm yanıt başlıklarına CSP ekleyelim
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy,
          },
        ],
      },
    ];
  },

  // Geliştirme / üretim modu için ek ayarlar
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;