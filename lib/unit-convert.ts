import categories from '../data/unit-converter.json';

export type UnitCategories = typeof categories;
export type CategoryKey = keyof UnitCategories;

/**
 * Get unit categories loaded from JSON configuration.
 */
export function getUnitCategories(): UnitCategories {
  return categories as UnitCategories;
}

const factors: Record<string, Record<string, number>> = {
  length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mi: 1609.34,
    ft: 0.3048,
    in: 0.0254,
  },
  weight: {
    g: 1,
    kg: 1000,
    lb: 453.592,
    oz: 28.3495,
  },
  volume: {
    L: 1,
    mL: 0.001,
    gal: 3.78541,
  },
  time: {
    s: 1,
    min: 60,
    h: 3600,
    day: 86400,
  },
  data: {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
  },
};

/**
 * Convert between units across supported categories.
 */
export function convert(
  category: CategoryKey,
  from: string,
  to: string,
  value: number,
): number {
  if (category === 'temperature') {
    if (from === to) return value;
    let celsius: number;
    switch (from) {
      case 'C':
        celsius = value;
        break;
      case 'F':
        celsius = (value - 32) * (5 / 9);
        break;
      case 'K':
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }
    switch (to) {
      case 'C':
        return celsius;
      case 'F':
        return celsius * (9 / 5) + 32;
      case 'K':
        return celsius + 273.15;
      default:
        return celsius;
    }
  }
  const cat = factors[category];
  if (!cat) return value;
  const baseValue = value * (cat[from] ?? 1);
  return baseValue / (cat[to] ?? 1);
}
