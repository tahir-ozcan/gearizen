import data from '../docs/privacy-policy.json';

export interface PolicySection {
  id: string;
  title: string;
  content: string;
}

/**
 * Validates and returns privacy policy sections from JSON.
 */
export function parsePolicy(json: unknown): PolicySection[] {
  if (!Array.isArray(json)) {
    throw new Error('Invalid policy data');
  }
  return json.map((item) => {
    if (
      !item ||
      typeof item.id !== 'string' ||
      typeof item.title !== 'string' ||
      typeof item.content !== 'string'
    ) {
      throw new Error('Invalid policy section');
    }
    return { id: item.id, title: item.title, content: item.content };
  });
}

/**
 * Returns parsed policy sections from the bundled JSON file.
 */
export function getPolicySections(): PolicySection[] {
  return parsePolicy(data as unknown);
}
