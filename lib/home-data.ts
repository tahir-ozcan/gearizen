// lib/home-data.ts
import raw from "../data/home.json";
import type { LucideProps } from "lucide-react";
import {
  FileJson,
  Link2,
  Type,
  Droplet,
  FileCode,
  Mail,
  Key as FallbackIcon,
} from "lucide-react";

export interface HeroConfig {
  title: string;
  subHeadline: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface FeatureCard {
  href: string;
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
}

export interface HomeData {
  hero: HeroConfig;
  features: FeatureCard[];
}

// Raw JSON structure
interface RawFeature {
  href: string;
  icon: string;
  title: string;
  description: string;
}
interface RawHomeData {
  hero: HeroConfig;
  features: RawFeature[];
}

const data = raw as RawHomeData;

// Map JSON `icon` names to actual Lucide React components
const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  FileJson,
  Link2,
  Type,
  Droplet,
  FileCode,
  Mail,
};

/**
 * Returns typed home data with real icon components.
 * Falls back to `FallbackIcon` if an icon name is unrecognized.
 */
export function getHomeData(): HomeData {
  const { hero, features: rawFeatures } = data;
  const features: FeatureCard[] = rawFeatures.map((f) => ({
    href: f.href,
    icon: ICON_MAP[f.icon] ?? FallbackIcon,
    title: f.title,
    description: f.description,
  }));
  return { hero, features };
}