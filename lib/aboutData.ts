import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

export type HeroBlock = {
  type: 'hero';
  heading: string;
  paragraphs: string[];
};

export type BulletsBlock = {
  type: 'bullets';
  heading: string;
  items: string[];
};

export type TeamMember = {
  name: string;
  role: string;
  avatar: string;
  bio: string;
};

export type TeamBlock = {
  type: 'team';
  heading: string;
  members: TeamMember[];
};

export type CtaBlock = {
  type: 'cta';
  text: string;
  linkText: string;
  href: string;
};

export type AboutBlock = HeroBlock | BulletsBlock | TeamBlock | CtaBlock;

export interface AboutData {
  blocks: AboutBlock[];
}

/**
 * Load About page content from a JSON or YAML file under the data directory.
 */
export async function loadAboutData(): Promise<AboutData> {
  const dataDir = path.join(process.cwd(), 'data');
  const jsonPath = path.join(dataDir, 'about.json');
  const yamlPath = path.join(dataDir, 'about.yml');

  if (fs.existsSync(jsonPath)) {
    const file = await fsPromises.readFile(jsonPath, 'utf8');
    return JSON.parse(file) as AboutData;
  }

  if (fs.existsSync(yamlPath)) {
    const file = await fsPromises.readFile(yamlPath, 'utf8');
    return yaml.load(file) as AboutData;
  }

  throw new Error('About data file not found');
}
