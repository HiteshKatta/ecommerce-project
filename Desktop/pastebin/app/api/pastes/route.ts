import { NextResponse } from "next/server";
import { createPaste } from "@/lib/pastes";
import { getNow } from "@/lib/time";



function isPositiveInt(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 1;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { content, ttl_seconds, max_views } = body as Record<string, unknown>;

  if (typeof content !== "string" || content.trim() === "") {
    return NextResponse.json(
      { error: "content must be a non-empty string" },
      { status: 400 }
    );
  }
  if (ttl_seconds != null && !isPositiveInt(ttl_seconds)) {
    return NextResponse.json(
      { error: "ttl_seconds must be an integer >= 1" },
      { status: 400 }
    );
  }
  if (max_views != null && !isPositiveInt(max_views)) {
    return NextResponse.json(
      { error: "max_views must be an integer >= 1" },
      { status: 400 }
    );
  }

  const id = await createPaste(
    {
      content,
      ttlSeconds: (ttl_seconds as number | null | undefined) ?? undefined,
      maxViews: (max_views as number | null | undefined) ?? undefined,
    },
    getNow(req.headers)
  );

  const origin = new URL(req.url).origin;
  return NextResponse.json({ id, url: `${origin}/p/${id}` }, { status: 201 });
}