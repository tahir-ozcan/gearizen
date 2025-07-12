const { buildHtmlSitemap } = require('../lib/sitemap.js');

describe('buildHtmlSitemap', () => {
  test('generates html with links', () => {
    const html = buildHtmlSitemap([
      'https://gearizen.com/',
      'https://gearizen.com/tools/example'
    ]);
    expect(html).toContain('<a href="https://gearizen.com/"');
    expect(html).toContain('<a href="https://gearizen.com/tools/example"');
  });
});
