"use client";

import { type FormEvent, useState } from "react";
import type { StatsSummary } from "./maw-stats-model";

const number = new Intl.NumberFormat("en-MY");
const shortDate = new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", timeZone: "UTC" });

function rate(value: StatsSummary["day1"]) {
  return value.eligible ? Math.round(value.returned / value.eligible * 100) + "%" : "—";
}

export default function MawStats({ configured }: { configured: boolean }) {
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function viewStats(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const code = String(new FormData(form).get("code") ?? "").trim();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/maw-stats", {
        headers: { Authorization: "Bearer " + code },
        cache: "no-store",
      });
      if (!response.ok) {
        setMessage(response.status === 401 ? "That access code didn’t match." : "The private archive is temporarily unavailable.");
        return;
      }
      setStats(await response.json());
    } catch {
      setMessage("Couldn’t load the stats. Try again.");
    } finally {
      setBusy(false);
      form.reset();
    }
  }

  const cards = stats ? [
    { name: "Total installations", value: number.format(stats.installs) },
    { name: "Active today", value: number.format(stats.activeToday) },
    { name: "Active in the last 7 days", value: number.format(stats.activeSevenDays) },
    { name: "Day 1 retention", value: rate(stats.day1), detail: number.format(stats.day1.returned) + " of " + number.format(stats.day1.eligible) + " eligible" },
    { name: "Day 7 retention", value: rate(stats.day7), detail: number.format(stats.day7.returned) + " of " + number.format(stats.day7.eligible) + " eligible" },
  ] : [];
  const maxActive = Math.max(1, ...(stats?.daily.map((day) => day.active) ?? []));

  return (
    <section id="stats" aria-labelledby="maw-stats-title" className="mx-auto mt-16 hidden max-w-7xl scroll-mt-24 border-t border-parchment/15 pt-10 target:block sm:mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3 id="maw-stats-title" className="font-display text-2xl font-semibold tracking-wide text-parchment sm:text-3xl">
          Fathomless Maw Stats
        </h3>
        {stats && <button type="button" onClick={() => setStats(null)} className="min-h-11 px-3 text-sm text-sepia underline underline-offset-4 hover:text-parchment">Close private view</button>}
      </div>
      {!stats ? (
        <div className="plate mt-5 max-w-xl px-5 py-5 sm:px-6">
          <p className="font-display text-lg text-parchment">Private dashboard</p>
          <p className="mt-2 text-sm leading-6 text-sepia">
            {configured ? "Enter the owner access code to view playtest stats." : "Awaiting the private Google Sheets connection."}
          </p>
          {configured && (
            <form onSubmit={viewStats} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex-1 text-sm text-parchment">
                Access code
                <input name="code" type="password" autoComplete="current-password" required disabled={busy}
                  className="mt-2 block min-h-11 w-full border border-parchment/20 bg-ink px-3 text-parchment focus-visible:outline-2 focus-visible:outline-eye" />
              </label>
              <button type="submit" disabled={busy}
                className="min-h-11 border border-parchment/20 bg-ink-2 px-4 font-display text-sm text-parchment hover:border-eye disabled:opacity-50">
                {busy ? "Loading…" : "View stats"}
              </button>
            </form>
          )}
          {message && <p role="alert" className="mt-3 text-sm text-ember">{message}</p>}
        </div>
      ) : (
        <>
          <p className="mt-3 text-sm text-sepia">Opted-in installations · Malaysia time</p>
          <dl className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {cards.map((card) => (
              <div key={card.name} className="plate px-4 py-4">
                <dt className="text-sm text-sepia">{card.name}</dt>
                <dd className="mt-1 font-display text-2xl text-parchment">{card.value}</dd>
                {card.detail && <dd className="mt-1 text-xs text-muted">{card.detail}</dd>}
              </div>
            ))}
          </dl>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
            <div className="plate p-5">
              <h4 className="font-display text-lg text-parchment">Daily activity</h4>
              {stats.installs === 0 ? (
                <p className="mt-3 text-sm text-sepia">Activity will appear after the first opted-in play session.</p>
              ) : (
                <ol className="mt-3 grid gap-1.5">
                  {stats.daily.map((day) => (
                    <li key={day.date} className="grid grid-cols-[4rem_1fr_2.5rem] items-center gap-2 text-sm text-sepia">
                      <time dateTime={day.date}>{shortDate.format(new Date(day.date + "T00:00:00Z"))}</time>
                      <span aria-hidden="true" className="h-1.5 bg-parchment/10">
                        <span className="block h-full bg-ember" style={{ width: day.active / maxActive * 100 + "%" }} />
                      </span>
                      <span className="text-right tabular-nums">{number.format(day.active)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <div className="plate p-5">
              <h4 className="font-display text-lg text-parchment">Progression and platforms</h4>
              <dl className="mt-3 divide-y divide-parchment/10 text-sm text-sepia">
                {[
                  ["Intro completed", stats.intro], ["First level-up", stats.levelUp],
                  ["First boss defeated", stats.boss], ["Picked first card", stats.pick],
                  ["Sacrificed first hand", stats.sacrifice], ["Windows installations", stats.windows],
                  ["Android installations", stats.android],
                ].map(([label, count]) => (
                  <div key={label} className="flex justify-between gap-4 py-2">
                    <dt>{label}</dt><dd className="tabular-nums text-parchment">{number.format(Number(count))}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
