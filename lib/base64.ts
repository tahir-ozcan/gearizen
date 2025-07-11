export function encodeBase64(input: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(input, "utf-8").toString("base64");
  }
  return btoa(unescape(encodeURIComponent(input)));
}

export function decodeBase64(input: string): string {
  const cleaned = input.replace(/\s+/g, "");
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(cleaned) || cleaned.length % 4 === 1) {
    throw new Error("Invalid Base64 string");
  }
  try {
    if (typeof window === "undefined") {
      return Buffer.from(cleaned, "base64").toString("utf-8");
    }
    return decodeURIComponent(escape(atob(cleaned)));
  } catch {
    throw new Error("Invalid Base64 string");
  }
}
