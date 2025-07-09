import type { NextConfig } from "next";

// Content Security Policy allowing Google Analytics and AdSense assets
const ContentSecurityPolicy =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com; " +
  "img-src 'self' data: https://www.google-analytics.com https://pagead2.googlesyndication.com; " +
  "style-src 'self' 'unsafe-inline'; " +
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://api.exchangerate.host; " +
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
  images: {
    domains: ['www.google-analytics.com', 'pagead2.googlesyndication.com'],
  },
};

export default nextConfig;
