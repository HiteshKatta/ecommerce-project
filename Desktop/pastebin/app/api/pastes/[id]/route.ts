import { NextResponse } from "next/server";
import { consumePaste } from "@/lib/pastes";
import { getNow } from "@/lib/time";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const paste = await consumePaste(id, getNow(req.headers));

  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found, expired, or view limit reached" },
      { status: 404 }
    );
  }
  return NextResponse.json(paste, { status: 200 });
}