import { test } from "uvu";
import * as assert from "uvu/assert";
import { compressBuffer } from "./image-utils";
import sharp from "sharp";

async function createSample() {
  return sharp({
    create: {
      width: 10,
      height: 10,
      channels: 3,
      background: { r: 255, g: 0, b: 0 },
    },
  })
    .jpeg()
    .toBuffer();
}

test("compressBuffer reduces size", async () => {
  const buf = await createSample();
  const compressed = await compressBuffer(buf, "image/jpeg", 0.5);
  assert.ok(compressed.length < buf.length);
});

test.run();
