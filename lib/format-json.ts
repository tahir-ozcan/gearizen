import jsonlint from 'jsonlint-mod';
let json5: typeof import('json5') | null = null;

export type JsonMode = 'beautify' | 'minify' | 'validate';

export interface FormatJsonOptions {
  mode: JsonMode;
  indent: number;
  strict: boolean;
  sortKeys: boolean;
}

function sortObject(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObject);
  if (obj && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortObject((obj as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return obj;
}

async function parse(src: string, strict: boolean) {
  if (strict) return jsonlint.parse(src);
  if (!json5) {
    json5 = await import('json5');
  }
  return json5.parse(src);
}

export async function formatJson(
  src: string,
  { mode, indent, strict, sortKeys }: FormatJsonOptions
): Promise<{ output: string; error: string | null }> {
  try {
    let obj = await parse(src, strict);
    if (sortKeys) obj = sortObject(obj);
    if (mode === 'validate') {
      return { output: 'Valid JSON', error: null };
    }
    const space = mode === 'minify' ? 0 : indent;
    return { output: JSON.stringify(obj, null, space), error: null };
  } catch (e: unknown) {
    return {
      output: '',
      error: e instanceof Error ? e.message : 'Invalid JSON',
    };
  }
}
