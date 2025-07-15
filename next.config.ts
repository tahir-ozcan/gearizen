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
  // 1. Webpack kuralı: `?url` ile import edilen pdf.worker.min.js’i asset/resource olarak paketle
  webpack(config) {
    config.module.rules.push({
      test: /pdf\.worker\.min\.js$/,
      resourceQuery: /url/,           // yalnızca `import '...pdf.worker.min.js?url'` için
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[name].[hash][ext]"
      }
    });
    return config;
  },

  // 2. Tüm route’lara CSP header ekle
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
  }
};

export default nextConfig;