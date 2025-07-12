export type JsonMode = "beautify" | "minify" | "validate";
export interface FormatJsonOptions {
  mode: JsonMode;
  indent: number;
  strict: boolean;
  sortKeys: boolean;
}

let json5Parser: { parse: (input: string) => unknown } | null = null;

function sortObject(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObject);
  if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortObject((obj as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return obj;
}

export async function formatJson(
  src: string,
  { mode, indent, strict, sortKeys }: FormatJsonOptions
): Promise<string> {
  const parser = strict ? JSON : (json5Parser ??= await import("json5"));
  let parsed = parser.parse(src);
  if (sortKeys) parsed = sortObject(parsed);
  if (mode === "validate") return "Valid JSON";
  const space = mode === "minify" ? 0 : indent;
  return JSON.stringify(parsed, null, space);
}
