import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { compressImageBuffer } from './image-utils';
import { createCanvas } from 'canvas';

test('compressImageBuffer returns a buffer', async () => {
  const canvas = createCanvas(20, 20);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 20, 20);
  const buf = canvas.toBuffer('image/png');
  const out = await compressImageBuffer(buf, 'image/jpeg', 0.7);
  assert.ok(Buffer.isBuffer(out));
  assert.ok(out.length > 0);
});

test.run();
