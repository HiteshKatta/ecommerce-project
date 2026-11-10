import { consumePaste } from "@/lib/pastes";
import { getNow } from "@/lib/time";

// Turns <, >, &, quotes into harmless text so pasted code can never run in the browser
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlPage(body: string, status: number): Response {
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pastebin</title>
</head>
<body style="max-width:800px;margin:40px auto;padding:0 16px;font-family:sans-serif">
${body}
</body>
</html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const paste = await consumePaste(id, getNow(req.headers));

  if (!paste) {
    return htmlPage(
      `<h1>404</h1>
<p>Paste not found, expired, or view limit reached.</p>
<a href="/">Create a new paste</a>`,
      404
    );
  }

  const info = [
    paste.remaining_views !== null ? `Remaining views: ${paste.remaining_views}.` : "",
    paste.expires_at ? `Expires at: ${paste.expires_at}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return htmlPage(
    `<h1>Paste</h1>
<pre style="white-space:pre-wrap;word-break:break-word;background:#f4f4f4;color:#111;padding:16px;border-radius:8px">${escapeHtml(paste.content)}</pre>
<p style="color:#666">${escapeHtml(info)}</p>
<a href="/">Create a new paste</a>`,
    200
  );
}