import { parseChoices, readChoices, summarizeChoices, type ChoiceSnapshot, type ChoiceSummary } from "./maw-choices";

const milestones = [
  "intro_completed",
  "first_level_up",
  "first_boss_defeated",
  "first_card_pick",
  "first_card_sacrifice",
] as const;

type Milestone = (typeof milestones)[number];
type Platform = "windows" | "android";
type Activity = {
  day: string;
  install: string;
  firstDay: string;
  platform: Platform;
  build: string;
  milestones: Milestone[];
  choices?: ChoiceSnapshot | null;
};

type Retention = { returned: number; eligible: number };
export type DailyStats = {
  date: string;
  active: number;
  newInstalls: number;
  day1: Retention;
  day7: Retention;
};

export type StatsSummary = {
  date: string;
  installs: number;
  activeToday: number;
  activeSevenDays: number;
  day1: Retention;
  day7: Retention;
  windows: number;
  android: number;
  intro: number;
  levelUp: number;
  boss: number;
  pick: number;
  sacrifice: number;
  daily: DailyStats[];
  choices: ChoiceSummary;
};

const dayMilliseconds = 86_400_000;
const malaysiaDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kuala_Lumpur",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function statsDay(now = new Date()) {
  return malaysiaDate.format(now);
}

function dayAt(day: string, offset: number) {
  return new Date(Date.parse(day + "T00:00:00Z") + offset * dayMilliseconds).toISOString().slice(0, 10);
}

function dateString(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) && dayAt(value, 0) === value;
}

function milestoneList(value: unknown): value is Milestone[] {
  return Array.isArray(value) && value.length <= milestones.length &&
    value.every((item) => milestones.includes(item));
}

function asActivity(
  install: unknown, firstDay: unknown, platform: unknown, build: unknown,
  day: unknown, flags: unknown, today: string,
): Activity | null {
  if (typeof install !== "string" || !/^[0-9a-f]{32}$/i.test(install) ||
    (platform !== "windows" && platform !== "android") ||
    typeof build !== "string" || !/^[0-9A-Za-z._-]{1,24}$/.test(build) ||
    !dateString(firstDay) || !dateString(day) || day < firstDay || day > today ||
    !milestoneList(flags)) {
    return null;
  }

  return { install: install.toLowerCase(), firstDay, platform, build, day, milestones: [...new Set(flags)] };
}

export const activityHead = ["Played on (MYT)", "Install ID", "First played (MYT)", "Platform", "Build", "Milestones", "Choice counters"];
export const archiveHead = [
  "Play date (MYT)", "Active installations", "New installations",
  "D1 eligible", "D1 returned", "D7 eligible", "D7 returned", "Archived on (MYT)",
];

export function parseActivity(body: unknown, today: string): Activity[] | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const data = body as Record<string, unknown>;
  if (!Array.isArray(data.days) || !data.days.length || data.days.length > 24) return null;

  const rows: Activity[] = [];
  for (const item of data.days) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const row = asActivity(
      data.installationId, data.firstDay, data.platform, data.build, item.date, item.milestones ?? [], today,
    );
    if (!row) return null;
    row.choices = parseChoices(item.choices);
    rows.push(row);
  }
  return rows;
}

export function activityValues(activity: Activity[]) {
  return activity.map((row) => [
    row.day, row.install, row.firstDay, row.platform, row.build, row.milestones.join(","),
    row.choices ? JSON.stringify(row.choices) : "",
  ]);
}

export function summarize(values: unknown[][], today: string, historyDays: 14 | 90 = 14) {
  const people = new Map<string, {
    first: string;
    platform: Platform;
    days: Set<string>;
    milestones: Set<Milestone>;
    firstReward?: { day: string; kind: Milestone };
  }>();

  const latestChoices = new Map<string, ChoiceSnapshot>();
  for (const [day, install, first, platform, build, flags, choices] of values) {
    const row = asActivity(
      install, first, platform, build, day, typeof flags === "string" && flags ? flags.split(",") : [], today,
    );
    if (!row) continue;
    const snapshot = readChoices(choices);
    if (snapshot) {
      const key = row.install + ":" + row.day;
      if (snapshot.revision > (latestChoices.get(key)?.revision ?? 0)) latestChoices.set(key, snapshot);
    }

    let history = people.get(row.install);
    if (!history) {
      history = { first: row.firstDay, platform: row.platform, days: new Set(), milestones: new Set() };
      people.set(row.install, history);
    }
    history.first = row.firstDay < history.first ? row.firstDay : history.first;
    history.days.add(row.day);
    for (const flag of row.milestones) {
      history.milestones.add(flag);
      if ((flag === "first_card_pick" || flag === "first_card_sacrifice") &&
        (!history.firstReward || row.day < history.firstReward.day)) {
        history.firstReward = { day: row.day, kind: flag };
      }
    }
  }

  const totals: StatsSummary = {
    date: today, installs: people.size, activeToday: 0, activeSevenDays: 0,
    day1: { returned: 0, eligible: 0 }, day7: { returned: 0, eligible: 0 },
    windows: 0, android: 0, intro: 0, levelUp: 0, boss: 0, pick: 0, sacrifice: 0, daily: [],
    choices: summarizeChoices(latestChoices.values()),
  };
  const byDay = new Map<string, DailyStats>();
  const daily = (date: string) => {
    let stats = byDay.get(date);
    if (!stats) {
      stats = { date, active: 0, newInstalls: 0, day1: { eligible: 0, returned: 0 }, day7: { eligible: 0, returned: 0 } };
      byDay.set(date, stats);
    }
    return stats;
  };

  const weekStart = dayAt(today, -6);
  for (const history of people.values()) {
    totals[history.platform] += 1;
    if (history.days.has(today)) totals.activeToday += 1;
    if ([...history.days].some((day) => day >= weekStart)) totals.activeSevenDays += 1;
    if (history.milestones.has("intro_completed")) totals.intro += 1;
    if (history.milestones.has("first_level_up")) totals.levelUp += 1;
    if (history.milestones.has("first_boss_defeated")) totals.boss += 1;
    if (history.firstReward?.kind === "first_card_pick") totals.pick += 1;
    if (history.firstReward?.kind === "first_card_sacrifice") totals.sacrifice += 1;

    const cohort = daily(history.first);
    cohort.newInstalls += 1;
    for (const day of history.days) daily(day).active += 1;
    const nextDay = dayAt(history.first, 1);
    const seventhDay = dayAt(history.first, 7);
    if (nextDay < today) {
      cohort.day1.eligible += 1;
      cohort.day1.returned += Number(history.days.has(nextDay));
    }
    if (seventhDay < today) {
      cohort.day7.eligible += 1;
      cohort.day7.returned += Number(history.days.has(seventhDay));
    }
  }

  for (const day of byDay.values()) {
    totals.day1.eligible += day.day1.eligible;
    totals.day1.returned += day.day1.returned;
    totals.day7.eligible += day.day7.eligible;
    totals.day7.returned += day.day7.returned;
  }
  totals.daily = Array.from({ length: historyDays }, (_, index) => daily(dayAt(today, index - historyDays + 1)));
  return {
    totals,
    completedDays: Array.from(byDay.values()).filter((day) => day.date < today)
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}
