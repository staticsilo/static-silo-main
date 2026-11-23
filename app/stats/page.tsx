import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import MawStats from "../maw-stats";

export const metadata: Metadata = {
  title: "Player Statistics | Fathomless Maw",
  robots: { index: false, follow: false },
};

export default function StatsPage() {
  const configured = Boolean(
    process.env.MAW_STATS_SHEET_ID &&
    process.env.MAW_STATS_GOOGLE_CREDENTIALS &&
    (process.env.MAW_STATS_DASHBOARD_CODE?.length ?? 0) >= 32
  );

  return (
    <div className="min-h-dvh bg-[radial-gradient(ellipse_at_top,rgba(142,75,43,0.2),transparent_45%)]">
      <header className="border-b border-parchment/10 bg-ink/80">
        <nav aria-label="Dashboard navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <Link href="/" className="flex min-h-11 items-center gap-3 text-parchment transition hover:text-eye">
            <Image src="/brand/silo-icon-192.png" width={32} height={32} alt="" />
            <span className="font-display text-xs font-semibold tracking-[0.16em] sm:text-sm">Static Silo</span>
          </Link>
          <Link href="/#game" className="inline-flex min-h-11 items-center gap-2 text-sm text-sepia hover:text-parchment">
            <span aria-hidden="true">←</span> Back to the game
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-8 sm:pt-10">
        <div className="relative isolate mb-6 overflow-hidden border border-parchment/15 bg-ink-2 px-5 py-7 sm:px-8 sm:py-10">
          <Image src="/brand/seal-game.webp" alt="" fill sizes="(min-width: 1280px) 1216px, 100vw"
            className="-z-20 object-cover object-[center_55%] opacity-55" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/95 to-ink/20" />
          <p className="font-display text-xs font-semibold tracking-[0.16em] text-ember sm:text-sm">Fathomless Maw</p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-parchment sm:text-5xl">Player statistics</h1>
          <p className="mt-3 text-base text-sepia">Private playtest dashboard · Malaysia time</p>
        </div>
        <MawStats configured={configured} />
      </main>
    </div>
  );
}
