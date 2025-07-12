import type { Metadata } from 'next';
import ColorPaletteGeneratorClient from './color-palette-generator-client';
import BreadcrumbJsonLd from '@/app/components/BreadcrumbJsonLd';

export const metadata: Metadata = {
  metadataBase: new URL('https://gearizen.com'),
  title: 'Color Palette Generator',
  description: 'Create harmonious color palettes from any base color directly in your browser.',
  keywords: ['color palette', 'palette generator', 'color scheme', 'design tool', 'Gearizen tools'],
  authors: [{ name: 'Gearizen Team', url: 'https://gearizen.com/about' }],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://gearizen.com/tools/color-palette-generator' },
  openGraph: {
    title: 'Color Palette Generator | Gearizen',
    description: 'Build complementary or triadic color schemes offline with Gearizen.',
    url: 'https://gearizen.com/tools/color-palette-generator',
    siteName: 'Gearizen',
    locale: 'en_US',
    type: 'website',
    images: [
      { url: '/og-placeholder.svg', width: 1200, height: 630, alt: 'Gearizen Color Palette Generator' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Palette Generator | Gearizen',
    description: 'Generate beautiful color palettes with no server needed.',
    creator: '@gearizen',
    images: ['/og-placeholder.svg'],
  },
};

export default function ColorPaletteGeneratorPage() {
  return (
    <>
      <BreadcrumbJsonLd
        pageTitle="Color Palette Generator"
        pageUrl="https://gearizen.com/tools/color-palette-generator"
      />
      <ColorPaletteGeneratorClient />
    </>
  );
}
