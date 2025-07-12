import { compressBuffer, compressBufferStream, loadFile } from './compress-utils';

const samplePath = 'public/favicon.png';

// Ensure compression reduces file size
// Uses sharp to compress a PNG to JPEG and checks output is smaller.
test('compressBuffer reduces size', async () => {
  const orig = await loadFile(samplePath);
  const compressed = await compressBuffer(orig, 0.5);
  expect(compressed.length).toBeLessThan(orig.length);
});

// stream compression emits chunks
test('compressBufferStream emits chunks', async () => {
  const orig = await loadFile(samplePath);
  const chunks: Buffer[] = [];
  const buf = await compressBufferStream(orig, 0.5, (c) => chunks.push(c));
  expect(chunks.length).toBeGreaterThan(0);
  expect(buf.length).toBeLessThan(orig.length);
});
