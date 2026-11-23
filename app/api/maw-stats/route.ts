import { activityValues, parseActivity, statsDay, summarize } from "../../maw-stats-model";
import { appendActivity, checkCode, readActivity, statsConfigured, upstreamLimited } from "../../maw-stats-storage";

const privateHeaders = { "Cache-Control": "private, no-store" };

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
    const { totals } = summarize(await readActivity(), statsDay(), historyDays);
    return Response.json(totals, { headers: privateHeaders });
  } catch {
    return Response.json({ message: "The archive is temporarily unavailable." }, { status: 503, headers: privateHeaders });
  }
}

export async function POST(request: Request) {
  if (!statsConfigured()) return new Response(null, { status: 503 });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return new Response(null, { status: 415 });
  }

  const maxBytes = 8_192;
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
