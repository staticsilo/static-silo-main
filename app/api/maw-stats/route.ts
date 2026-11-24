import { activityValues, installsFirstSeen, parseActivity, statsDay, summarize } from "../../maw-stats-model";
import { appendActivity, checkCode, readActivity, removeInstallations, statsConfigured, upstreamLimited } from "../../maw-stats-storage";

const privateHeaders = { "Cache-Control": "private, no-store" };

// Uploads are anonymous, so anyone can post. An honest game sends about one request every 5 minutes, and at most 24 in a row when
// it catches up after being offline; 60 per 10 minutes per address leaves room for a household or a phone carrier sharing one.
// This lives in the function instance (Vercel reuses instances, but not across regions or cold starts): it stops a script from one
// address filling the sheet; a spread-out attack needs a rate-limit rule in the Vercel firewall on /api/maw-stats.
const limitWindowMs = 10 * 60_000;
const limitPerAddress = 60;
const recent = new Map<string, { start: number; count: number }>();

function overLimit(request: Request, now = Date.now()) {
  const address = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (recent.size > 20_000) {
    for (const [key, entry] of recent) if (now - entry.start >= limitWindowMs) recent.delete(key);
    if (recent.size > 20_000) recent.clear();
  }
  const entry = recent.get(address);
  if (!entry || now - entry.start >= limitWindowMs) {
    recent.set(address, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > limitPerAddress;
}

export async function GET(request: Request) {
  const code = process.env.MAW_STATS_DASHBOARD_CODE ?? "";
  if (!statsConfigured() || code.length < 32) {
    return Response.json({ message: "The private dashboard is awaiting setup." }, { status: 503, headers: privateHeaders });
  }
  if (!checkCode(request, code)) {
    return Response.json({ message: "That access code didn’t match." }, { status: 401, headers: privateHeaders });
  }

  try {
    const historyDays = new URL(request.url).searchParams.get("history") === "90" ? 90 : 14;
    const { totals } = summarize(await readActivity(true), statsDay(), historyDays);
    return Response.json(totals, { headers: privateHeaders });
  } catch {
    return Response.json({ message: "The archive is temporarily unavailable." }, { status: 503, headers: privateHeaders });
  }
}

/**
 * Owner only (the dashboard code): deletes fake installations, by id ({"ids": [...]}) or every one first seen on a day
 * ({"firstDay": "YYYY-MM-DD"}, for a flood). The rows are deleted from the sheet; there is no undo but the sheet's version history.
 */
export async function DELETE(request: Request) {
  const code = process.env.MAW_STATS_DASHBOARD_CODE ?? "";
  if (!statsConfigured() || code.length < 32) return Response.json({ message: "The private dashboard is awaiting setup." }, { status: 503, headers: privateHeaders });
  if (!checkCode(request, code)) return Response.json({ message: "That access code didn’t match." }, { status: 401, headers: privateHeaders });

  let body: { ids?: unknown; firstDay?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Send ids or firstDay." }, { status: 400, headers: privateHeaders });
  }
  const ids = new Set<string>();
  if (Array.isArray(body.ids)) {
    if (body.ids.length > 1000 || !body.ids.every((id) => typeof id === "string" && /^[0-9a-f]{32}$/i.test(id))) {
      return Response.json({ message: "Installation ids are 32 hexadecimal characters (at most 1000 at once)." }, { status: 400, headers: privateHeaders });
    }
    for (const id of body.ids as string[]) ids.add(id.toLowerCase());
  }
  try {
    if (typeof body.firstDay === "string") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(body.firstDay)) return Response.json({ message: "firstDay is YYYY-MM-DD." }, { status: 400, headers: privateHeaders });
      for (const id of installsFirstSeen(await readActivity(), body.firstDay, statsDay())) ids.add(id);
    }
    if (!ids.size) return Response.json({ removedInstallations: 0, removedRows: 0 }, { headers: privateHeaders });
    const removedRows = await removeInstallations(ids);
    return Response.json({ removedInstallations: ids.size, removedRows }, { headers: privateHeaders });
  } catch {
    return Response.json({ message: "The archive is temporarily unavailable." }, { status: 503, headers: privateHeaders });
  }
}

export async function POST(request: Request) {
  if (!statsConfigured()) return new Response(null, { status: 503 });
  if (overLimit(request)) return new Response(null, { status: 429, headers: { "Retry-After": "600" } });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return new Response(null, { status: 415 });
  }

  const maxBytes = 32_768;
  if (Number(request.headers.get("content-length")) > maxBytes) return new Response(null, { status: 413 });
  const reader = request.body?.getReader();
  if (!reader) return new Response(null, { status: 400 });

  let bytes = 0;
  let content = "";
  const decoder = new TextDecoder();
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        return new Response(null, { status: 413 });
      }
      content += decoder.decode(chunk.value, { stream: true });
    }
    content += decoder.decode();
  } catch {
    return new Response(null, { status: 400 });
  }

  let rows: ReturnType<typeof parseActivity>;
  try {
    rows = parseActivity(JSON.parse(content), statsDay());
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!rows) return new Response(null, { status: 400 });

  try {
    await appendActivity(activityValues(rows));
    return new Response(null, { status: 204 });
  } catch (error) {
    if (upstreamLimited(error)) return new Response(null, { status: 429, headers: { "Retry-After": "60" } });
    return new Response(null, { status: 503 });
  }
}
