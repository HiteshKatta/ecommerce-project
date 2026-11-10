import { randomBytes } from "crypto";
import { sql } from "./db";

export type PasteView = {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
};

export async function createPaste(
  input: { content: string; ttlSeconds?: number; maxViews?: number },
  now: number
): Promise<string> {
  const id = randomBytes(6).toString("base64url");
  const expiresAt = input.ttlSeconds ? now + input.ttlSeconds * 1000 : null;
  const maxViews = input.maxViews ?? null;

  await sql`
    INSERT INTO pastes (id, content, created_at, expires_at, max_views)
    VALUES (${id}, ${input.content}, ${now}, ${expiresAt}, ${maxViews})
  `;
  return id;
}

/**
 * Fetches a paste AND counts one view, atomically.
 * The WHERE clause rejects expired or exhausted pastes, so concurrent
 * requests can never push view_count past max_views.
 */
export async function consumePaste(
  id: string,
  now: number
): Promise<PasteView | null> {
  const rows = await sql`
    UPDATE pastes
    SET view_count = view_count + 1
    WHERE id = ${id}
      AND (expires_at IS NULL OR expires_at > ${now})
      AND (max_views IS NULL OR view_count < max_views)
    RETURNING content, expires_at, max_views, view_count
  `;

  if (rows.length === 0) return null;
  const r = rows[0];

  return {
    content: r.content as string,
    remaining_views:
      r.max_views === null ? null : Math.max(0, r.max_views - r.view_count),
    expires_at:
      r.expires_at === null ? null : new Date(Number(r.expires_at)).toISOString(),
  };
}