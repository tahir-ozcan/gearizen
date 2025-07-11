export type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "snake"
  | "kebab";

function words(text: string): string[] {
  return text
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/);
}

/** Convert text to the specified case */
export function convertCase(text: string, type: CaseType): string {
  switch (type) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text
        .toLowerCase()
        .replace(/\b(\p{L})/gu, (m) => m.toUpperCase());
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*\p{L}|[.!?]\s*\p{L})/gu, (m) => m.toUpperCase());
    case "camel": {
      const w = words(text);
      return w
        .map((word, i) =>
          i === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join("");
    }
    case "snake":
      return words(text)
        .map((w) => w.toLowerCase())
        .join("_");
    case "kebab":
      return words(text)
        .map((w) => w.toLowerCase())
        .join("-");
    default:
      return text;
  }
}
