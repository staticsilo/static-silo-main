import { statsDay, summarize } from "../../../maw-stats-model";
import { archiveErrorDetails, checkCode, readActivity, statsConfigured, writeDailyArchive } from "../../../maw-stats-storage";

export async function GET(request: Request) {
  if (!statsConfigured()) return new Response(null, { status: 204 });
  const secret = process.env.CRON_SECRET;
  if (!secret || !checkCode(request, secret)) return new Response(null, { status: 401 });

  let stage: "read-activity" | "summarize" | "write-archive" = "read-activity";
  try {
    const activity = await readActivity();
    stage = "summarize";
    const today = statsDay();
    const { completedDays } = summarize(activity, today);
    stage = "write-archive";
    await writeDailyArchive(completedDays, today);
    return Response.json({ archivedDays: completedDays.length });
  } catch (error) {
    console.error("Fathomless Maw archive failed", archiveErrorDetails(error, stage));
    return new Response(null, { status: 503 });
  }
}
