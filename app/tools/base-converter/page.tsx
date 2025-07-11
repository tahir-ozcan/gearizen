import type { Metadata } from 'next';
import BaseConverterClient from './base-converter-client';
import BreadcrumbJsonLd from '@/app/components/BreadcrumbJsonLd';

export const metadata: Metadata = {
  metadataBase: new URL('https://gearizen.com'),
  title: 'Number Base Converter',
  description:
    'Convert numbers between binary, octal, decimal and hexadecimal entirely in your browser with Gearizen\u2019s free Base Converter.',
  keywords: [
    'base converter',
    'binary converter',
    'hex converter',
    'decimal converter',
    'octal converter',
    'Gearizen tools',
  ],
  authors: [{ name: 'Gearizen Team', url: 'https://gearizen.com/about' }],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://gearizen.com/tools/base-converter' },
  openGraph: {
    title: 'Number Base Converter | Gearizen',
    description:
      'Easily switch between binary, octal, decimal and hex values with Gearizen\u2019s privacy-focused Base Converter.',
    url: 'https://gearizen.com/tools/base-converter',
    siteName: 'Gearizen',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-placeholder.svg',
        width: 1200,
        height: 630,
        alt: 'Gearizen Number Base Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Number Base Converter | Gearizen',
    description:
      'Convert numbers between binary, decimal, octal and hexadecimal right in your browser. No signup required.',
    creator: '@gearizen',
    images: ['/og-placeholder.svg'],
  },
};

export default function BaseConverterPage() {
  return (
    <>
      <BreadcrumbJsonLd pageTitle="Number Base Converter" pageUrl="https://gearizen.com/tools/base-converter" />
      <BaseConverterClient />
    </>
  );
}
