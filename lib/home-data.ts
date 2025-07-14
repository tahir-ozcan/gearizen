// lib/home-data.ts
import raw from "../data/home.json";
import type { LucideProps } from "lucide-react";
import {
  Code,
  Key,
  Braces,
  Cpu,
  FileArchive,
  Tag,
  QrCode,
  Mail,
} from "lucide-react";

/**
 * Hero
 * - Anasayfadaki kahraman bölümü için tip
 */
export interface Hero {
  title: string;
  subHeadline: string;
  ctaLabel: string;
  ctaHref: string;
}

/**
 * Feature
 * - Anasayfadaki popüler araç listesi için tip
 */
export interface Feature {
  href: string;
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
}

/** Raw tipleri: JSON içeriğinin orijinal yapısı */
interface RawHero {
  title: string;
  subHeadline: string;
  ctaLabel: string;
  ctaHref: string;
}
interface RawFeature {
  href: string;
  icon: string;
  title: string;
  description: string;
}
interface RawHome {
  hero: RawHero;
  features: RawFeature[];
}

// JSON'dan gelen veriyi uygun tipe dönüştür
const data = raw as RawHome;

/**
 * ICON_MAP
 * - JSON'daki `icon` string'lerini gerçek Lucide bileşenlerine eşler
 * - Geçersiz bir anahtar gelirse `Key` kullanılır
 */
const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Code,
  Key,
  Braces,
  Cpu,
  FileArchive,
  Tag,
  QrCode,
  Mail, // "Suggest a Tool" ikonu
};

/**
 * getHomeData
 *
 * - Ham JSON verisini okuyup `Hero` ve `Feature[]` tipine dönüştürür
 * - `icon` string'lerini ICON_MAP üzerinden gerçek bileşenlere çevirir
 */
export function getHomeData(): { hero: Hero; features: Feature[] } {
  const hero: Hero = {
    title: data.hero.title,
    subHeadline: data.hero.subHeadline,
    ctaLabel: data.hero.ctaLabel,
    ctaHref: data.hero.ctaHref,
  };

  const features: Feature[] = data.features.map((f) => ({
    href: f.href,
    icon: ICON_MAP[f.icon] ?? Key,
    title: f.title,
    description: f.description,
  }));

  return { hero, features };
}