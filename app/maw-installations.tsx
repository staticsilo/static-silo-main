"use client";

import { type FormEvent, useState } from "react";
import type { Installation } from "./maw-stats-model";
import { chartDate } from "./stats/trend-chart";

const button = "inline-flex min-h-11 items-center justify-center border border-parchment/20 bg-ink-2 px-3 text-sm font-semibold text-parchment transition hover:border-ember/70 focus-visible:outline-2 focus-visible:outline-eye disabled:cursor-default disabled:opacity-50";
const small = "inline-flex min-h-9 items-center justify-center border border-parchment/20 bg-ink-2 px-2 text-xs font-semibold text-parchment transition hover:border-ember/70 focus-visible:outline-2 focus-visible:outline-eye disabled:cursor-default disabled:opacity-50";

/**
 * The most recently seen installations, and the owner's way to delete fake ones: one at a time, or every one first seen on a day
 * (a flood of invented installations usually lands on one day, which the "New" line of the activity chart shows as a spike).
 */
export default function MawInstallations({ installations, code, onChanged }: {
  installations: Installation[];
  code: string;
  onChanged: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function remove(body: { ids: string[] } | { firstDay: string }, what: string) {
    if (!window.confirm("Delete " + what + " from the statistics? This removes their rows from the Google Sheet (the sheet's version history can bring them back).")) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/maw-stats", {
        method: "DELETE",
        headers: { Authorization: "Bearer " + code, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result.message ?? "That didn’t work. Try again.");
        return;
      }
      setMessage(result.removedRows ? "Deleted " + result.removedRows + " rows." : "Nothing matched.");
      await onChanged();
    } catch {
      setMessage("Couldn’t reach the site. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function removeDay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const day = new FormData(event.currentTarget).get("day");
    if (typeof day === "string" && day) void remove({ firstDay: day }, "every installation first seen on " + chartDate(day));
  }

  return (
    <section aria-labelledby="installations" className="mt-6 border border-parchment/15 bg-ink-2/85 p-4 sm:p-5">
      <h2 id="installations" className="font-display text-lg font-semibold text-parchment">Installations</h2>
      <p className="mt-1 text-sm leading-snug text-sepia">
        The {installations.length} most recently seen. Remove fake ones here: one at a time, or every one first seen on a day.
      </p>
      <form onSubmit={removeDay} className="mt-4 flex flex-wrap items-end gap-2">
        <label className="text-sm text-parchment">
          First seen on (MYT)
          <input name="day" type="date" required disabled={busy}
            className="mt-2 block min-h-11 border border-parchment/20 bg-ink px-3 text-parchment focus-visible:outline-2 focus-visible:outline-eye" />
        </label>
        <button type="submit" disabled={busy} className={button}>Remove that day’s installations</button>
      </form>
      {message && <p role="status" className="mt-3 text-sm text-ember">{message}</p>}
      <div className="mt-4 max-h-96 overflow-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead className="sticky top-0 bg-ink-2 text-sepia">
            <tr>
              <th scope="col" className="py-2 pr-3 font-normal">Installation</th>
              <th scope="col" className="py-2 pr-3 font-normal">Platform</th>
              <th scope="col" className="py-2 pr-3 font-normal">First seen</th>
              <th scope="col" className="py-2 pr-3 font-normal">Last seen</th>
              <th scope="col" className="py-2 pr-3 text-right font-normal">Days</th>
              <th scope="col" className="py-2"><span className="sr-only">Remove</span></th>
            </tr>
          </thead>
          <tbody className="text-parchment">
            {installations.map((item) => (
              <tr key={item.id} className="border-t border-parchment/10">
                <td className="py-1.5 pr-3 font-mono text-xs" title={item.id}>{item.id.slice(0, 12)}…</td>
                <td className="py-1.5 pr-3 capitalize">{item.platform}</td>
                <td className="py-1.5 pr-3 tabular-nums">{chartDate(item.first)}</td>
                <td className="py-1.5 pr-3 tabular-nums">{chartDate(item.last)}</td>
                <td className="py-1.5 pr-3 text-right tabular-nums">{item.days}</td>
                <td className="py-1.5 text-right">
                  <button type="button" disabled={busy} className={small}
                    onClick={() => void remove({ ids: [item.id] }, "installation " + item.id.slice(0, 12) + "…")}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
