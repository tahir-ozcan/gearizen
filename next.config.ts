import type { NextConfig } from "next";

const ContentSecurityPolicy =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com; " +
  "img-src 'self' data: https://www.google-analytics.com https://pagead2.googlesyndication.com; " +
  "style-src 'self' 'unsafe-inline'; " +
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com; " +
  "frame-src https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com;";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\n/g, ' '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
