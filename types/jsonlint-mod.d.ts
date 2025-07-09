// types/jsonlint-mod.d.ts
/**
 * Minimal type declarations for jsonlint-mod.
 * `parse` will throw a detailed Error on invalid JSON, or return the
 * parsed value as `unknown` (you can narrow it yourself).
 */
declare module "jsonlint-mod" {
  export function parse(text: string): unknown;
}