import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { GoogleAuth } from "google-auth-library";
import { activityHead, archiveHead, type DailyStats } from "./maw-stats-model";

const activityTab = "Activity";
const archiveTab = "Daily archive";
const sheetEndpoint = "https://sheets.googleapis.com/v4/spreadsheets/";

let auth: GoogleAuth | undefined;
let initialized: Promise<void> | undefined;

export function statsConfigured() {
  return Boolean(process.env.MAW_STATS_SHEET_ID && process.env.MAW_STATS_GOOGLE_CREDENTIALS);
}

export function checkCode(request: Request, expected: string) {
  const header = request.headers.get("authorization") ?? "";
  const supplied = createHash("sha256").update(header).digest();
  const wanted = createHash("sha256").update("Bearer " + expected).digest();
  return timingSafeEqual(supplied, wanted);
}

async function sheets<T>(path: string, method: "GET" | "POST" | "PUT" = "GET", data?: unknown): Promise<T> {
  if (!auth) {
    auth = new GoogleAuth({
      credentials: JSON.parse(process.env.MAW_STATS_GOOGLE_CREDENTIALS ?? "{}"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }
  const client = await auth.getClient();
  const id = encodeURIComponent(process.env.MAW_STATS_SHEET_ID ?? "");
  const response = await client.request<T>({ url: sheetEndpoint + id + path, method, data, timeout: 10_000 });
  return response.data;
}

async function sheetTitles() {
  const spreadsheet = await sheets<{ sheets?: { properties?: { title?: string } }[] }>("?fields=sheets(properties(title))");
  return new Set(spreadsheet.sheets?.map((sheet) => sheet.properties?.title));
}

async function createMissingTabs() {
  const existing = await sheetTitles();
  const definitions = [
    { title: activityTab, header: activityHead },
    { title: archiveTab, header: archiveHead },
  ].filter((tab) => !existing.has(tab.title));
  if (!definitions.length) return;

  const requests = definitions.flatMap(({ title, header }) => {
    const sheetId = randomInt(1, 900_000_000);
    return [
      { addSheet: { properties: { title, sheetId, gridProperties: { columnCount: header.length, rowCount: 1000, frozenRowCount: 1 } } } },
      { updateCells: {
        start: { sheetId, rowIndex: 0, columnIndex: 0 },
        rows: [{ values: header.map((value) => ({ userEnteredValue: { stringValue: value } })) }],
        fields: "userEnteredValue",
      } },
    ];
  });
  try {
    await sheets(":batchUpdate", "POST", { requests });
  } catch (error) {
    const current = await sheetTitles();
    if (definitions.some(({ title }) => !current.has(title))) throw error;
  }
}

function ensureTabs() {
  initialized ??= createMissingTabs().catch((error) => {
    initialized = undefined;
    throw error;
  });
  return initialized;
}

export async function appendActivity(values: string[][]) {
  await ensureTabs();
  const range = encodeURIComponent(activityTab + "!A:F");
  await sheets("/values/" + range + ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS", "POST", { values });
}

export async function readActivity() {
  await ensureTabs();
  const range = encodeURIComponent(activityTab + "!A2:F");
  const data = await sheets<{ values?: unknown[][] }>("/values/" + range + "?valueRenderOption=UNFORMATTED_VALUE");
  return data.values ?? [];
}

export async function writeDailyArchive(days: DailyStats[], today: string) {
  await ensureTabs();
  const values = [archiveHead, ...days.map((day) => [
    day.date, day.active, day.newInstalls, day.day1.eligible, day.day1.returned,
    day.day7.eligible, day.day7.returned, today,
  ])];
  const range = encodeURIComponent("'" + archiveTab + "'!A1:H" + values.length);
  await sheets("/values/" + range + "?valueInputOption=RAW", "PUT", { values });
}

export function upstreamLimited(error: unknown) {
  return typeof error === "object" && error !== null &&
    (error as { response?: { status?: number } }).response?.status === 429;
}
