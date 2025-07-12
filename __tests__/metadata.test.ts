import seo from '../seo-config.json';

describe('metadata config', () => {
  test('about page has canonical url', () => {
    expect(seo.about.canonical).toBe('https://gearizen.com/about');
  });
});
