"use client";

import { type FormEvent, useRef, useState } from "react";
import type { DailyStats, StatsSummary } from "./maw-stats-model";
import TrendChart, { chartDate } from "./stats/trend-chart";
import PlaytestChoices from "./maw-playtest-choices";
import MawInstallations from "./maw-installations";

const number = new Intl.NumberFormat("en-MY");
const compact = new Intl.NumberFormat("en-MY", { notation: "compact", maximumFractionDigits: 1 });
const percent = new Intl.NumberFormat("en-MY", { style: "percent", maximumFractionDigits: 1 });
const windows = [14, 30, 90] as const;
const button = "inline-flex min-h-11 items-center justify-center border border-parchment/20 bg-ink-2 px-3 text-sm font-semibold text-parchment transition hover:border-ember/70 focus-visible:outline-2 focus-visible:outline-eye disabled:cursor-default disabled:opacity-50";
const orange = "#f2a531";
const mint = "#82c8b7";

function ratio({ returned, eligible }: DailyStats["day1"]) {
  return eligible ? returned / eligible : null;
}

function exportRate(value: DailyStats["day1"]) {
  const fraction = ratio(value);
  return fraction === null ? null : Math.round(fraction * 1000) / 10;
}

function rate(value: DailyStats["day1"]) {
  const fraction = ratio(value);
  return fraction === null ? "—" : percent.format(fraction);
}

function describeRetention(value: DailyStats["day1"]) {
  if (!value.eligible) return "Awaiting eligible cohort";
  return rate(value) + " · " + number.format(value.returned) + " of " + number.format(value.eligible);
}

function downloadCsv(name: string, rows: (string | number | null)[][]) {
  const csv = rows.map((row) => row.map((value) => '"' + String(value ?? "").replaceAll('"', '""') + '"').join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv, "\r\n"], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Bars({ title, description, items, total }: {
  title: string;
  description: string;
  items: { label: string; count: number; color: string }[];
  total: number;
}) {
  return (
    <section className="min-w-0 border border-parchment/15 bg-ink-2/85 p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold text-parchment">{title}</h2>
      <p className="mt-1 text-sm leading-snug text-sepia">{description}</p>
      <dl className="mt-4 space-y-3">
        {items.map(({ label, count, color }) => {
          const share = total ? count / total : 0;
          return (
            <div key={label}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <dt className="text-sepia">{label}</dt>
                <dd className="shrink-0 tabular-nums text-parchment">
                  {number.format(count)}{total > 0 && <span className="ml-2 text-xs text-sepia">{percent.format(share)}</span>}
                </dd>
              </div>
              <div aria-hidden="true" className="mt-1.5 h-1.5 bg-parchment/10">
                <div className="h-full" style={{ width: Math.min(share * 100, 100) + "%", backgroundColor: color }} />
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

export default function MawStats({ configured }: { configured: boolean }) {
  const codeField = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [windowSize, setWindowSize] = useState<(typeof windows)[number]>(30);

  async function loadStats(accessCode: string) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/maw-stats?history=90", {
        headers: { Authorization: "Bearer " + accessCode },
        cache: "no-store",
      });
      if (!response.ok) {
        if (response.status === 401) {
          setStats(null);
          setCode("");
        }
        setMessage(response.status === 401 ? "That access code didn’t match." : "The private archive is temporarily unavailable.");
        return;
      }
      setStats(await response.json());
      setCode(accessCode);
    } catch {
      setMessage("Couldn’t load the stats. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const accessCode = codeField.current?.value.trim() ?? "";
    if (!accessCode) return;
    await loadStats(accessCode);
    form.reset();
  }

  if (!stats) {
    return (
      <section aria-labelledby="dashboard-access" className="plate max-w-lg px-5 py-6 sm:px-7 sm:py-8">
        <h2 id="dashboard-access" className="font-display text-xl font-semibold text-parchment">Owner access</h2>
        <p className="mt-2 text-sm leading-6 text-sepia">
          {configured ? "Enter the owner access code to see charts and export statistics." : "The owner access code and Google Sheets connection are required to open this dashboard."}
        </p>
        {configured && (
          <form method="post" onSubmit={unlock} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1 text-sm text-parchment">
              Access code
              <input ref={codeField} type="password" autoComplete="current-password" required disabled={busy}
                className="mt-2 block min-h-11 w-full border border-parchment/20 bg-ink px-3 text-parchment focus-visible:outline-2 focus-visible:outline-eye" />
            </label>
            <button type="submit" disabled={busy} className={button + " bg-ember/15 px-5"}>
              {busy ? "Opening…" : "Open dashboard"}
            </button>
          </form>
        )}
        {message && <p role="alert" className="mt-3 text-sm text-ember">{message}</p>}
      </section>
    );
  }

  const daily = stats.daily.slice(-windowSize);
  const dates = daily.map((day) => day.date);
  const rangeStart = dates[0];
  const rangeEnd = stats.date;
  const high = Math.max(2, ...daily.flatMap((day) => [day.active, day.newInstalls]));
  const magnitude = 10 ** Math.floor(Math.log10(high));
  const axisStep = Math.max(2, magnitude * 2);
  const activityMax = Math.ceil(high / axisStep) * axisStep;
  const cards = [
    { label: "Total installations", value: number.format(stats.installs), note: "All time" },
    { label: "Active today", value: number.format(stats.activeToday), note: chartDate(stats.date) + " MYT" },
    { label: "Active in 7 days", value: number.format(stats.activeSevenDays), note: "Unique installations" },
    { label: "Day 1 retention", value: rate(stats.day1), note: number.format(stats.day1.returned) + " of " + number.format(stats.day1.eligible) + " eligible · all time" },
    { label: "Day 7 retention", value: rate(stats.day7), note: number.format(stats.day7.returned) + " of " + number.format(stats.day7.eligible) + " eligible · all time" },
  ];
  const platformCount = (p: keyof StatsSummary["platforms"]) => stats.platforms?.[p] ?? 0;
  const platforms = [
    { label: "Windows", count: platformCount("windows"), color: orange },
    { label: "Android app", count: platformCount("android"), color: mint },
    { label: "Browser on Android", count: platformCount("web-android"), color: mint },
    { label: "Browser on iPhone/iPad", count: platformCount("web-ios"), color: mint },
    { label: "Browser on a computer", count: platformCount("web-desktop"), color: orange },
  ];
  const milestones = [
    { label: "Completed the intro", count: stats.intro, color: orange },
    { label: "Reached first level-up", count: stats.levelUp, color: orange },
    { label: "Defeated first boss", count: stats.boss, color: orange },
    { label: "Picked a card as first reward", count: stats.pick, color: mint },
    { label: "Sacrificed the first hand", count: stats.sacrifice, color: mint },
  ];

  function exportDaily() {
    downloadCsv("maw-daily-" + rangeStart + "-to-" + rangeEnd + ".csv", [
      ["Date / first-play cohort (MYT)", "Active installations", "New installations", "D1 returned", "D1 eligible", "D1 retention (%)", "D7 returned", "D7 eligible", "D7 retention (%)"],
      ...daily.map((day) => [
        day.date, day.active, day.newInstalls, day.day1.returned, day.day1.eligible, exportRate(day.day1),
        day.day7.returned, day.day7.eligible, exportRate(day.day7),
      ]),
    ]);
  }

  function exportSummary(summary: StatsSummary) {
    downloadCsv("maw-summary-" + summary.date + ".csv", [
      ["Snapshot date (MYT)", summary.date],
      ["Metric", "Value"],
      ["Total installations", summary.installs],
      ["Active today", summary.activeToday],
      ["Active in 7 days", summary.activeSevenDays],
      ["D1 returned", summary.day1.returned], ["D1 eligible", summary.day1.eligible],
      ["D1 retention (%)", exportRate(summary.day1)],
      ["D7 returned", summary.day7.returned], ["D7 eligible", summary.day7.eligible],
      ["D7 retention (%)", exportRate(summary.day7)],
      ...[...platforms, ...milestones].map(({ label, count }) => [label, count]),
    ]);
  }

  function exportChoices(summary: StatsSummary) {
    const choices = summary.choices;
    downloadCsv("maw-choices-" + summary.date + ".csv", [
      ["Category", "Gameplay ID", "Label", "Measure", "Count"],
      ...([
        ["Talent purchase", choices.skills], ["School order", choices.schools], ["Card hand", choices.hands],
        ["Sacrifice", choices.sacrifices], ["Progression", choices.progression],
      ] as const).flatMap(([category, rows]) => rows.map(({ id, label, count }) => [category, id, label, "Occurrences", count])),
      ...choices.cards.flatMap(({ id, label, offered, picked }) => [["Card", id, label, "Offered", offered], ["Card", id, label, "Picked", picked]]),
      ...choices.bosses.flatMap(({ id, label, attempts, clears }) => [["Boss", id, label, "Attempts", attempts], ["Boss", id, label, "Clears", clears]]),
    ]);
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-sepia">Opted-in installations · {chartDate(stats.date)} MYT</p>
        <div className="flex gap-2">
          <button type="button" disabled={busy} onClick={() => void loadStats(code)} className={button}>{busy ? "Refreshing…" : "Refresh"}</button>
          <button type="button" disabled={busy} className={button} onClick={() => { setStats(null); setCode(""); setMessage(""); }}>Lock</button>
        </div>
      </div>
      {message && <p role="alert" className="mt-2 text-sm text-ember">{message}</p>}
      <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="min-w-0 border border-parchment/15 bg-ink-2/85 px-3 py-3 sm:px-4 sm:py-4">
            <dt className="text-sm leading-tight text-sepia">{card.label}</dt>
            <dd className="mt-1.5 font-display text-2xl text-parchment sm:text-3xl">{card.value}</dd>
            <dd className="mt-1 text-xs leading-snug text-sepia">{card.note}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-sm text-sepia">Chart range</p>
          <div role="group" aria-label="Chart date range" className="inline-flex">
            {windows.map((days) => (
              <button key={days} type="button" aria-pressed={days === windowSize} onClick={() => setWindowSize(days)}
                className={button + " -mr-px min-w-16 aria-pressed:z-10 aria-pressed:border-ember/75 aria-pressed:bg-ember/15 aria-pressed:text-ember"}>
                {days} days
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={button} onClick={exportDaily}>Download daily CSV</button>
          <button type="button" className={button} onClick={() => exportSummary(stats)}>Download summary CSV</button>
        </div>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <TrendChart key={"activity-" + windowSize} id="activity" title="Player activity" subtitle="Daily unique active and first-time installations"
          dates={dates} max={activityMax} format={(value) => compact.format(value)}
          empty={daily.some((day) => day.active || day.newInstalls) ? undefined : "Activity appears after opted-in installations play within this date range."}
          series={[
            { name: "Active", color: orange, values: daily.map((day) => day.active), describe: (index) => number.format(daily[index].active) },
            { name: "New", color: mint, dashed: true, values: daily.map((day) => day.newInstalls), describe: (index) => number.format(daily[index].newInstalls) },
          ]} />
        <TrendChart key={"retention-" + windowSize} id="retention" title="Retention by first-play date" subtitle="Share of each cohort returning on day 1 or day 7"
          dates={dates} max={100} format={(value) => percent.format(value / 100)}
          empty={daily.some((day) => day.day1.eligible || day.day7.eligible) ? undefined : "Retention appears once a cohort reaches the end of its day 1 or day 7 window."}
          series={[
            { name: "Day 1", color: orange, values: daily.map((day) => day.day1.eligible ? day.day1.returned / day.day1.eligible * 100 : null),
              describe: (index) => describeRetention(daily[index].day1) },
            { name: "Day 7", color: mint, dashed: true, values: daily.map((day) => day.day7.eligible ? day.day7.returned / day.day7.eligible * 100 : null),
              describe: (index) => describeRetention(daily[index].day7) },
          ]} />
        <Bars title="Progression" description="Share of all opted-in installations reaching each milestone" items={milestones} total={stats.installs} />
        <Bars title="Platforms" description="All-time installations by platform" items={platforms} total={stats.installs} />
      </div>
      <PlaytestChoices choices={stats.choices} exportChoices={() => exportChoices(stats)} />
      <MawInstallations installations={stats.installations ?? []} code={code} onChanged={() => loadStats(code)} />
    </>
  );
}
