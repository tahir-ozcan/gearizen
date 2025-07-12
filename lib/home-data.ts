import homeData from '../data/home.json';

export interface HeroConfig {
  title: string;
  subHeadline: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface FeatureCard {
  href: string;
  icon: string;
  title: string;
  description: string;
}

export interface HomeData {
  hero: HeroConfig;
  features: FeatureCard[];
}

export function getHomeData(): HomeData {
  return homeData as HomeData;
}
