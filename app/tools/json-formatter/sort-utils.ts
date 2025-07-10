export function sortKeysDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => sortKeysDeep(v)) as unknown as T;
  }
  if (value && typeof value === "object" && value.constructor === Object) {
    const result: Record<string, unknown> = {};
    Object.keys(value as Record<string, unknown>)
      .sort()
      .forEach((key) => {
        result[key] = sortKeysDeep(
          (value as Record<string, unknown>)[key]
        );
      });
    return result as T;
  }
  return value;
}
