import { statsDay, summarize } from "../../../maw-stats-model";
import { checkCode, readActivity, statsConfigured, writeDailyArchive } from "../../../maw-stats-storage";

export async function GET(request: Request) {
  if (!statsConfigured()) return new Response(null, { status: 204 });
  const secret = process.env.CRON_SECRET;
  if (!secret || !checkCode(request, secret)) return new Response(null, { status: 401 });

  try {
    const today = statsDay();
    const { completedDays } = summarize(await readActivity(), today);
    await writeDailyArchive(completedDays, today);
    return Response.json({ archivedDays: completedDays.length });
  } catch {
    return new Response(null, { status: 503 });
  }
}
