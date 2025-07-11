export interface ParsedUrl {
  href: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  params: Record<string, string>;
}

/**
 * Parse a URL string and return its components.
 * Adds https:// if scheme is missing.
 */
export function parseUrl(input: string): ParsedUrl {
  let url: URL;
  if (!input) throw new Error("Invalid URL");
  try {
    url = new URL(input);
  } catch {
    try {
      url = new URL("https://" + input);
    } catch {
      throw new Error("Invalid URL");
    }
  }
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return {
    href: url.href,
    protocol: url.protocol,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    params,
  };
}
