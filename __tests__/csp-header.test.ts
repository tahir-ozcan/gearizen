import nextConfig from '../next.config';

test('CSP header includes Google domains', async () => {
  const headers = await (nextConfig as any).headers();
  const cspHeader = headers[0].headers.find((h: any) => h.key === 'Content-Security-Policy');
  expect(cspHeader.value).toContain("https://pagead2.googlesyndication.com");
  expect(cspHeader.value).toContain("https://www.googletagmanager.com");
});
