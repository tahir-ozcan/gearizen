import type { NextConfig } from "next";

// Content Security Policy allowing Google Analytics and AdSense assets
const ContentSecurityPolicy =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com; " +
  "img-src 'self' data: https://www.google-analytics.com https://pagead2.googlesyndication.com; " +
  "style-src 'self' 'unsafe-inline'; " +
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com; " +
  "frame-src https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com;";

const nextConfig: NextConfig = {
  async headers() {
    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: ContentSecurityPolicy.replace(/\n/g, ' '),
      },
    ];
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: '/:path*/',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-lowercase',
            value: '(?<lower>.*)',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
