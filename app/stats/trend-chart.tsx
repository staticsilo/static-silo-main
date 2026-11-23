"use client";

import { useState } from "react";

export type TrendSeries = {
  name: string;
  values: (number | null)[];
  color: string;
  dashed?: boolean;
  describe?: (index: number) => string;
};

const dayFormat = new Intl.DateTimeFormat("en-MY", { month: "short", day: "numeric", timeZone: "UTC" });

export function chartDate(date: string) {
  return dayFormat.format(new Date(date + "T00:00:00Z"));
}

function linePath(values: TrendSeries["values"], x: (index: number) => number, y: (value: number) => number) {
  let drawing = false;
  return values.map((value, index) => {
    if (value === null) {
      drawing = false;
      return "";
    }
    const command = drawing ? "L" : "M";
    drawing = true;
    return command + x(index) + "," + y(value);
  }).join(" ");
}

export default function TrendChart({ id, title, subtitle, dates, series, max, format, empty }: {
  id: string;
  title: string;
  subtitle: string;
  dates: string[];
  series: TrendSeries[];
  max: number;
  format: (value: number) => string;
  empty?: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const last = dates.length - 1;
  const lastWithData = dates.findLastIndex((_, index) => series.some((line) => line.values[index] !== null));
  const selected = picked ?? Math.max(0, lastWithData);
  const labels = [...new Set([0, Math.round(last / 3), Math.round(last * 2 / 3), last])];
  const x = (index: number) => last > 0 ? 1 + 98 * index / last : 50;
  const y = (value: number) => 98 - 96 * value / max;
  const ticks = [max, max / 2, 0];

  function selectPoint(index: number) {
    setPicked(Math.min(last, Math.max(0, index)));
  }

  return (
    <section aria-labelledby={id} className="min-w-0 border border-parchment/15 bg-ink-2/85 p-4 sm:p-5">
      <h2 id={id} className="font-display text-lg font-semibold text-parchment">{title}</h2>
      <p className="mt-1 text-sm leading-snug text-sepia">{subtitle}</p>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-sepia">
        {series.map((line) => (
          <li key={line.name} className="flex items-center gap-2">
            <span aria-hidden="true" className="block w-6 border-t-2" style={{ borderColor: line.color, borderStyle: line.dashed ? "dashed" : "solid" }} />
            {line.name}
          </li>
        ))}
      </ul>
      <div className="mt-5 grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-1">
        <div aria-hidden="true" className="flex h-36 flex-col justify-between pr-1 text-right text-xs tabular-nums text-sepia sm:h-48">
          {ticks.map((tick) => <span key={tick}>{format(tick)}</span>)}
        </div>
        <div className="relative h-36 sm:h-48">
          {ticks.map((tick, row) => <div key={tick} aria-hidden="true" className="absolute inset-x-0 border-t border-parchment/10" style={{ top: row * 50 + "%" }} />)}
          {empty ? (
            <p className="absolute inset-0 grid place-items-center px-3 text-center text-sm leading-snug text-sepia">
              <span className="max-w-xs border border-parchment/10 bg-ink/95 px-3 py-2">{empty}</span>
            </p>
          ) : (
            <div
              className="absolute inset-0 cursor-crosshair touch-pan-y focus-visible:outline-2 focus-visible:outline-eye"
              role="slider"
              tabIndex={0}
              aria-label={title + " chart date"}
              aria-valuemin={0}
              aria-valuemax={last}
              aria-valuenow={selected}
              aria-valuetext={chartDate(dates[selected]) + ", " + series.map((line) => line.name + " " + (line.describe?.(selected) ?? format(line.values[selected] ?? 0))).join(", ")}
              onPointerMove={(event) => {
                if (event.pointerType === "touch") return;
                const plot = event.currentTarget.getBoundingClientRect();
                selectPoint(Math.round((event.clientX - plot.left) / plot.width * last));
              }}
              onPointerDown={(event) => {
                const plot = event.currentTarget.getBoundingClientRect();
                selectPoint(Math.round((event.clientX - plot.left) / plot.width * last));
              }}
              onKeyDown={(event) => {
                const next = { ArrowLeft: selected - 1, ArrowDown: selected - 1, ArrowRight: selected + 1, ArrowUp: selected + 1, Home: 0, End: last }[event.key];
                if (next === undefined) return;
                event.preventDefault();
                selectPoint(next);
              }}
            >
              <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                <line x1={x(selected)} x2={x(selected)} y1={0} y2={100} stroke="#8c7f68" strokeOpacity=".55" vectorEffect="non-scaling-stroke" />
                {series.map((line) => (
                  <path key={line.name} d={linePath(line.values, x, y)} stroke={line.color} strokeWidth={2}
                    strokeDasharray={line.dashed ? "5 4" : undefined} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" fill="none" />
                ))}
              </svg>
              {series.flatMap((line) => line.values.map((value, index) => {
                const isolated = line.values[index - 1] == null && line.values[index + 1] == null;
                if (value === null || (selected !== index && !isolated)) return null;
                return <span key={line.name + index} aria-hidden="true" className="pointer-events-none absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink"
                  style={{ left: x(index) + "%", top: y(value) + "%", backgroundColor: line.color }} />;
              }))}
            </div>
          )}
        </div>
        <div aria-hidden="true" className="col-start-2 mt-2 flex justify-between gap-1 text-xs text-muted">
          {labels.map((index) => <time key={index} dateTime={dates[index]}>{chartDate(dates[index])}</time>)}
        </div>
      </div>
      {!empty && (
        <div className="mt-4 grid gap-2 border-t border-parchment/10 pt-3 text-sm sm:gap-1">
          <time className="font-semibold text-parchment" dateTime={dates[selected]}>{chartDate(dates[selected])}</time>
          {series.map((line) => (
            <div key={line.name} className="flex items-start justify-between gap-3 text-sepia">
              <span>{line.name}</span>
              <span className="text-right tabular-nums text-parchment">{line.describe?.(selected) ?? format(line.values[selected] ?? 0)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
