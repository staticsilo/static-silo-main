"use client";

import type { ChoiceSummary } from "./maw-choices";

const fmt = new Intl.NumberFormat("en-MY");
const percent = new Intl.NumberFormat("en-MY", { style: "percent", maximumFractionDigits: 1 });
type Row = { id: string; label: string; count: number };

function CountPanel({ title, description, rows }: { title: string; description: string; rows: Row[] }) {
  const peak = rows.reduce((highest, row) => Math.max(highest, row.count), 1);
  return (
    <section className="min-w-0 border border-parchment/15 bg-ink-2/85 p-4 sm:p-5">
      <h3 className="font-display text-lg font-semibold text-parchment">{title}</h3>
      <p className="mt-1 text-sm text-sepia">{description}</p>
      {rows.length ? (
        <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-2">
          {rows.map((row) => (
            <li key={row.id} className="border-b border-parchment/10 pb-2">
              <div className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 text-parchment">{row.label}</span>
                <span className="shrink-0 tabular-nums text-sepia">{fmt.format(row.count)}</span>
              </div>
              <div aria-hidden="true" className="mt-1.5 h-1 bg-parchment/10">
                <div className="h-full bg-ember" style={{ width: row.count / peak * 100 + "%" }} />
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="mt-4 text-sm text-sepia">No choices recorded yet.</p>}
    </section>
  );
}

const cell = "px-2 py-2 text-right tabular-nums";
const labelCell = "py-2 pr-2 text-left font-normal text-parchment";

export default function PlaytestChoices({ choices, exportChoices }: { choices: ChoiceSummary; exportChoices: () => void }) {
  return (
    <section aria-labelledby="maw-choices" className="mt-9 border-t border-parchment/15 pt-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="maw-choices" className="font-display text-2xl font-semibold text-parchment">Build and reward choices</h2>
          <p className="mt-1 text-sm text-sepia">All-time opted-in play. Counts show how often decisions occurred.</p>
        </div>
        <button type="button" onClick={exportChoices}
          className="inline-flex min-h-11 items-center border border-parchment/20 bg-ink-2 px-3 text-sm font-semibold text-parchment hover:border-ember/70 focus-visible:outline-2 focus-visible:outline-eye">
          Download choices CSV
        </button>
      </header>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <CountPanel title="Talent purchases" description="Successful picks by node and rank." rows={choices.skills} />
        <CountPanel title="School unlock order" description="Build paths recorded each time a school is unlocked." rows={choices.schools} />
        <section className="min-w-0 border border-parchment/15 bg-ink-2/85 p-4 sm:p-5">
          <h3 className="font-display text-lg font-semibold text-parchment">Cards offered and picked</h3>
          <p className="mt-1 text-sm text-sepia">Pick rate uses how often each card appeared in a hand.</p>
          {choices.cards.length ? (
            <div className="mt-3 max-h-64 overflow-auto">
              <table aria-label="Card offers and picks" className="w-full text-sm text-sepia">
                <thead className="sticky top-0 bg-ink-2">
                  <tr><th scope="col" className={labelCell}>Card</th><th scope="col" className={cell}>Offered</th><th scope="col" className={cell}>Picked</th><th scope="col" className={cell}>Rate</th></tr>
                </thead>
                <tbody>
                  {choices.cards.map(({ id, label, offered, picked }) => (
                    <tr key={id} className="border-t border-parchment/10">
                      <th scope="row" className={labelCell}>{label}</th>
                      <td className={cell}>{fmt.format(offered)}</td>
                      <td className={cell}>{fmt.format(picked)}</td>
                      <td className={cell}>{offered ? percent.format(picked / offered) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="mt-4 text-sm text-sepia">No offers or card picks recorded yet.</p>}
        </section>
        <CountPanel title="Card hands" description="Cards shown together in the same hand." rows={choices.hands} />
        <CountPanel title="Sacrifice" description="Hand sacrifices by the chance earned for the next reward." rows={choices.sacrifices} />
        <CountPanel title="Intro and levels" description="Intro completion or skip and each level reached." rows={choices.progression} />
        <section className="min-w-0 border border-parchment/15 bg-ink-2/85 p-4 sm:p-5 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-parchment">Boss encounters</h3>
          <p className="mt-1 text-sm text-sepia">Each engagement counts as an attempt. Defeats count as clears.</p>
          {choices.bosses.length ? (
            <div className="mt-3 overflow-auto">
              <table aria-label="Boss encounters" className="w-full text-sm text-sepia">
                <thead><tr><th scope="col" className={labelCell}>Boss</th><th scope="col" className={cell}>Attempts</th><th scope="col" className={cell}>Clears</th></tr></thead>
                <tbody>
                  {choices.bosses.map(({ id, label, attempts, clears }) => (
                    <tr key={id} className="border-t border-parchment/10">
                      <th scope="row" className={labelCell}>{label}</th>
                      <td className={cell}>{fmt.format(attempts)}</td>
                      <td className={cell}>{fmt.format(clears)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="mt-4 text-sm text-sepia">No boss encounters recorded yet.</p>}
        </section>
      </div>
    </section>
  );
}
