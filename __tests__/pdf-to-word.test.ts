import { textsToDocx } from "../lib/pdf-to-word";
import JSZip from "jszip";

it('generates DOCX from texts', async () => {
  const result = await textsToDocx(['Hello PDF', 'Second Page'], { pageBreaks: true });
  const buffer =
    result instanceof Buffer
      ? result
      : Buffer.from(await (result as Blob).arrayBuffer());
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file('word/document.xml')!.async('string');
  expect(xml).toContain('Hello PDF');
  expect(xml).toContain('Second Page');
});

it('handles single page', async () => {
  const result = await textsToDocx(['Only'], { pageBreaks: true });
  const buffer =
    result instanceof Buffer
      ? result
      : Buffer.from(await (result as Blob).arrayBuffer());
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file('word/document.xml')!.async('string');
  expect(xml).toContain('Only');
});
