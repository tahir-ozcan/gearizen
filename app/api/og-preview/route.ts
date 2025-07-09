import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    );
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const res = await fetch(target.toString());
    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch target (${res.status})` },
        { status: 502 }
      );
    }

    const html = await res.text();

    const extract = (regex: RegExp) => {
      const match = regex.exec(html);
      return match ? match[1] : undefined;
    };

    const metadata = {
      title:
        extract(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
        extract(/<title>([^<]+)<\/title>/i) ||
        target.toString(),
      description:
        extract(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
        extract(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
        "",
      image: extract(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i),
      siteName: extract(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i),
      url: target.toString(),
    };

    return NextResponse.json(metadata);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Fetch failed" },
      { status: 500 }
    );
  }
}
