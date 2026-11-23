import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { GoogleAuth } from "google-auth-library";
import { activityHead, archiveHead, type DailyStats } from "./maw-stats-model";

const activityTab = "Activity";
const archiveTab = "Daily archive";
const sheetEndpoint = "https://sheets.googleapis.com/v4/spreadsheets/";

type SheetsOperation = "list-tabs" | "create-tabs" | "append-activity" | "read-activity" | "write-archive";
type SheetsStage = "credentials" | "auth-client" | SheetsOperation;

class SheetsRequestError extends Error {
  constructor(readonly stage: SheetsStage, cause: unknown) {
    super("Google Sheets request failed", { cause });
  }
}

type UpstreamError = {
  code?: unknown;
  response?: {
    status?: unknown;
    data?: {
      error?: string | {
        status?: unknown;
        details?: { reason?: unknown }[];
        errors?: { reason?: unknown }[];
      };
    };
  };
};

const safeErrorCodes = new Set([
  "DEADLINE_EXCEEDED", "INVALID_ARGUMENT", "NOT_FOUND", "PERMISSION_DENIED",
  "RESOURCE_EXHAUSTED", "UNAUTHENTICATED", "UNAVAILABLE",
  "ACCESS_TOKEN_SCOPE_INSUFFICIENT", "SERVICE_DISABLED", "RATE_LIMIT_EXCEEDED",
  "accessNotConfigured", "forbidden", "invalid_client", "invalid_grant",
  "invalid_scope", "rateLimitExceeded", "unauthorized_client",
  "EAI_AGAIN", "ECONNREFUSED", "ECONNRESET", "ENOTFOUND", "ETIMEDOUT", "ERR_OSSL_UNSUPPORTED",
]);

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

async function sheets<T>(operation: SheetsOperation, path: string, method: "GET" | "POST" | "PUT" = "GET", data?: unknown): Promise<T> {
  let stage: SheetsStage = "credentials";
  try {
    if (!auth) {
      auth = new GoogleAuth({
        credentials: JSON.parse(process.env.MAW_STATS_GOOGLE_CREDENTIALS ?? "{}"),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    }

    stage = "auth-client";
    const client = await auth.getClient();
    stage = operation;
    const id = encodeURIComponent(process.env.MAW_STATS_SHEET_ID ?? "");
    const response = await client.request<T>({ url: sheetEndpoint + id + path, method, data, timeout: 10_000 });
    return response.data;
  } catch (error) {
    throw new SheetsRequestError(stage, error);
  }
}

async function sheetTitles() {
  const spreadsheet = await sheets<{ sheets?: { properties?: { title?: string } }[] }>("list-tabs", "?fields=sheets(properties(title))");
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
    await sheets("create-tabs", ":batchUpdate", "POST", { requests });
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
  await sheets("append-activity", "/values/" + range + ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS", "POST", { values });
}

export async function readActivity() {
  await ensureTabs();
  const range = encodeURIComponent(activityTab + "!A2:F");
  const data = await sheets<{ values?: unknown[][] }>("read-activity", "/values/" + range + "?valueRenderOption=UNFORMATTED_VALUE");
  return data.values ?? [];
}

export async function writeDailyArchive(days: DailyStats[], today: string) {
  await ensureTabs();
  const values = [archiveHead, ...days.map((day) => [
    day.date, day.active, day.newInstalls, day.day1.eligible, day.day1.returned,
    day.day7.eligible, day.day7.returned, today,
  ])];
  const range = encodeURIComponent("'" + archiveTab + "'!A1:H" + values.length);
  await sheets("write-archive", "/values/" + range + "?valueInputOption=RAW", "PUT", { values });
}

function errorCause(error: unknown) {
  return error instanceof SheetsRequestError ? error.cause : error;
}

function asUpstreamError(error: unknown): UpstreamError | undefined {
  return typeof error === "object" && error !== null ? error as UpstreamError : undefined;
}

export function upstreamLimited(error: unknown) {
  return asUpstreamError(errorCause(error))?.response?.status === 429;
}

export function archiveErrorDetails(error: unknown, archiveStage: "read-activity" | "summarize" | "write-archive") {
  const cause = errorCause(error);
  const upstream = asUpstreamError(cause);
  const status = upstream?.response?.status;
  const googleError = upstream?.response?.data?.error;
  const reasons: unknown[] = [upstream?.code];

  if (typeof googleError === "string") {
    reasons.push(googleError);
  } else if (googleError) {
    reasons.push(googleError.status);
    for (const items of [googleError.details, googleError.errors]) {
      if (Array.isArray(items)) reasons.push(...items.map((item) => item?.reason));
    }
  }

  return {
    stage: error instanceof SheetsRequestError ? error.stage : archiveStage,
    httpStatus: typeof status === "number" && Number.isInteger(status) && status >= 400 && status <= 599 ? status : undefined,
    codes: [...new Set(reasons.filter((code): code is string => typeof code === "string" && safeErrorCodes.has(code)))],
    failure: cause instanceof SyntaxError ? "invalid-json" : cause instanceof RangeError ? "invalid-range" : undefined,
  };
}
