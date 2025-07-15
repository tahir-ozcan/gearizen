// next.config.ts
import type { NextConfig } from "next";

const ContentSecurityPolicy = [
  "default-src 'self';",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com;",
  "img-src 'self' data: https://www.google-analytics.com https://pagead2.googlesyndication.com;",
  "style-src 'self' 'unsafe-inline';",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com;",
  "frame-src https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com;"
].join(" ");

const nextConfig: NextConfig = {
  // PDF.js worker'ı public klasöründen sunuyoruz:
  // - node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js dosyasını
  //   projenizin kökünde `public/pdf.worker.min.js` olarak kopyalamayı unutmayın.

  // Tüm sayfalara Content-Security-Policy başlığı ekleniyor
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy
          }
        ]
      }
    ];
  },

  // Diğer isterseniz ek ayarlarınızı da buraya ekleyebilirsiniz
};

export default nextConfig;