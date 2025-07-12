import { promises as fs } from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
const exec = promisify(execFile);

describe('sitemap generator', () => {
  test('includes home page', async () => {
    await exec('node', ['scripts/generate-sitemap.mjs']);
    const xml = await fs.readFile('public/sitemap.xml', 'utf8');
    expect(xml).toMatch('<loc>https://gearizen.com/</loc>');
  });
});
