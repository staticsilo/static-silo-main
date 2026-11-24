import { statsDay, summarize } from "../../../maw-stats-model";
import { archiveErrorDetails, checkCode, compactActivity, readActivity, statsConfigured, writeDailyArchive } from "../../../maw-stats-storage";

// read, archive, read again, rewrite and trim: several Sheets calls of up to 10 s each
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!statsConfigured()) return new Response(null, { status: 204 });
  const secret = process.env.CRON_SECRET;
  if (!secret || !checkCode(request, secret)) return new Response(null, { status: 401 });

  let stage: "read-activity" | "summarize" | "write-archive" = "read-activity";
  let archivedDays: number;
  const today = statsDay();
  try {
    const activity = await readActivity();
    stage = "summarize";
    const { completedDays } = summarize(activity, today);
    stage = "write-archive";
    await writeDailyArchive(completedDays, today);
    archivedDays = completedDays.length;
  } catch (error) {
    console.error("Fathomless Maw archive failed", archiveErrorDetails(error, stage));
    return new Response(null, { status: 503 });
  }

  // Folding the activity rows is housekeeping: the archive above is already written, and a failure here is retried the next night.
  let compactedRows = 0;
  try {
    compactedRows = await compactActivity(today);
  } catch (error) {
    console.error("Fathomless Maw activity compaction failed", archiveErrorDetails(error, "compact-activity"));
  }
  return Response.json({ archivedDays, compactedRows });
}
