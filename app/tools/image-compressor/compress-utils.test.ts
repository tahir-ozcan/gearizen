import { compressBuffer, loadFile } from './compress-utils';

const samplePath = 'public/favicon.png';

// Ensure compression reduces file size
// Uses sharp to compress a PNG to JPEG and checks output is smaller.
test('compressBuffer reduces size', async () => {
  const orig = await loadFile(samplePath);
  const compressed = await compressBuffer(orig, 0.5);
  expect(compressed.length).toBeLessThan(orig.length);
});
