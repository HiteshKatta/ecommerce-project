import { NextResponse, connection } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  await connection();
  try {
    await sql`SELECT 1`;
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}