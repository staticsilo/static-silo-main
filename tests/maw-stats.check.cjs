// Checks the Fathomless Maw statistics model (app/maw-stats-model.ts, app/maw-choices.ts) against the cases that matter:
// the retention arithmetic, what an upload may contain, the choice keys the game really sends, and the nightly compaction.
// Run with `npm run test:stats` (compiles the two files to .stats-test/ first).
/* eslint-disable @typescript-eslint/no-require-imports -- a plain CommonJS script, run by node without a bundler */
const m = require("../.stats-test/maw-stats-model.js");
const c = require("../.stats-test/maw-choices.js");
const catalog = require("../app/maw-playtest-catalog.json");

let pass = 0;
let fail = 0;
function check(name, ok, detail = "") {
  if (ok) pass++;
  else fail++;
  console.log((ok ? "ok   " : "FAIL ") + name + (ok || !detail ? "" : "  -> " + detail));
}

const id = (n) => n.toString(16).padStart(32, "0");
const row = (day, install, first, flags = "", choices = "") => [day, install, first, "windows", "0.1-playtest", flags, choices];
const today = "2026-11-20";

// --- Retention
{
  const [A, B, C, D, E] = [1, 2, 3, 4, 5].map(id);
  const rows = [
    row("2026-11-01", A, "2026-11-01"), row("2026-11-02", A, "2026-11-01"), row("2026-11-08", A, "2026-11-01"),
    row("2026-11-01", B, "2026-11-01"), row("2026-11-03", B, "2026-11-01"),
    row("2026-11-19", C, "2026-11-19"),
    row("2026-11-18", D, "2026-11-18"), row("2026-11-19", D, "2026-11-18"),
    row("2026-11-01", A, "2026-11-01"), row("2026-11-01", A, "2026-11-01"),
    row("2026-11-20", E, "2026-11-20"),
  ];
  const { totals, completedDays } = m.summarize(rows, today);
  const nov1 = completedDays.find((d) => d.date === "2026-11-01");
  check("installs counted once each", totals.installs === 5, String(totals.installs));
  check("D1: returned 2 of 3 eligible (yesterday's cohort not yet eligible)", totals.day1.returned === 2 && totals.day1.eligible === 3, JSON.stringify(totals.day1));
  check("D7: returned 1 of 2 eligible (exactly the 7th day)", totals.day7.returned === 1 && totals.day7.eligible === 2, JSON.stringify(totals.day7));
  check("repeated rows of one day are one active installation", nov1.newInstalls === 2 && nov1.active === 2, JSON.stringify(nov1));
  check("active today / in 7 days", totals.activeToday === 1 && totals.activeSevenDays === 3);
  check("today is never archived", !completedDays.some((d) => d.date === today));
}

// --- Uploads
const body = (over = {}, day = {}) => ({
  installationId: id(7), firstDay: "2026-11-10", platform: "windows", build: "0.1-playtest",
  days: [{ date: "2026-11-15", milestones: [], choices: { revision: 1, counts: {} }, ...day }], ...over,
});
check("a normal upload is accepted", m.parseActivity(body(), today) !== null);
check("a day after today is refused", m.parseActivity(body({}, { date: "2026-11-21" }), today) === null);
{
  const rows = m.parseActivity(body({ firstDay: "2026-12-01" }, { date: "2026-11-15" }), today);
  check("a first day later than the play day (clock was ahead) is corrected, not refused", rows && rows[0].firstDay === "2026-11-15");
}
{
  const rows = m.parseActivity(body({}, { milestones: ["intro_completed", "a_milestone_from_a_newer_game"] }), today);
  check("an unknown milestone is ignored, not a refusal", rows && rows[0].milestones.join() === "intro_completed");
}
check("an unknown platform is refused", m.parseActivity(body({ platform: "macos" }), today) === null);
check("more than 24 days is refused", m.parseActivity(body({ days: Array(25).fill({ date: "2026-11-15" }) }), today) === null);

// --- Choice keys the game sends
const kept = {
  "skill:orbs0@1": true, "skill:junction-death@0": true, "skill:mastery:arcane:0@1": true,
  "school:orbs+plague+volley": true, "school:orbs+orbs": false,
  "hand:cinder_flask+grave_tithe+stolen_omen": true,
  "hand:grave_tithe+grave_tithe+stolen_omen": true, "hand:grave_tithe+grave_tithe+grave_tithe": true,
  "hand:stolen_omen+grave_tithe": false,
  "pick:grave_tithe": true, "sacrifice:25": true, "level:100": true, "level:101": false,
  "boss-attempt:warden": true, "boss-clear:warden-sub": true, "intro:skipped": true, "nonsense:1": false,
};
for (const [key, want] of Object.entries(kept)) {
  const parsed = c.parseChoices({ revision: 1, counts: { [key]: 1 } });
  check((want ? "kept:    " : "dropped: ") + key, Boolean(parsed && parsed.counts[key]) === want);
}
check("catalog has the mastery nodes the game sends", Object.keys(catalog.skills).some((k) => k.startsWith("mastery:")));
{
  const s = c.summarizeChoices([{ revision: 1, counts: { "hand:grave_tithe+grave_tithe+stolen_omen": 2 } }]);
  const tithe = s.cards.find((x) => x.id === "grave_tithe");
  check("a repeated card counts as offered once per copy", tithe && tithe.offered === 4, JSON.stringify(tithe));
}

// --- Choices: newest revision per installation-day, summed over days
{
  const A = id(11);
  const snap = (rev, n) => JSON.stringify({ revision: rev, counts: { "pick:grave_tithe": n } });
  const rows = [
    row("2026-11-15", A, "2026-11-15", "", snap(1, 1)), row("2026-11-15", A, "2026-11-15", "", snap(3, 4)),
    row("2026-11-15", A, "2026-11-15", "", snap(2, 2)), row("2026-11-16", A, "2026-11-15", "", snap(1, 2)),
  ];
  const card = m.summarize(rows, today).totals.choices.cards.find((x) => x.id === "grave_tithe");
  check("picks = newest of each day, summed (4 + 2)", card && card.picked === 6, JSON.stringify(card));
}

// --- Compaction: one row per installation-day, and the summary reads the same before and after
{
  const [A, B] = [21, 22].map(id);
  const snap = (rev, n) => JSON.stringify({ revision: rev, counts: { "pick:grave_tithe": n, "hand:grave_tithe+grave_tithe+stolen_omen": rev } });
  const rows = [
    row("2026-11-01", A, "2026-11-01", "intro_completed", snap(1, 1)),
    ["", "", "", "", "", "", ""],
    row("2026-11-01", A, "2026-11-01", "intro_completed,first_card_sacrifice", snap(5, 3)),
    row("2026-11-01", A, "2026-11-01", "intro_completed", snap(2, 2)),
    row("2026-11-02", A, "2026-11-01", "first_level_up,a_future_milestone"),
    row("2026-11-02", A, "2026-11-01", "first_level_up,first_card_pick", snap(1, 1)),
    ["a note typed into the sheet"],
    row("2026-11-08", A, "2026-11-01"),
    row("2026-11-05", B, "2026-11-06"),  // first day after the play day: corrected
    row("2026-11-05", B, "2026-11-05", "", snap(1, 1)),
  ];
  const compacted = m.compactRows(rows, today);
  const before = m.summarize(rows, today).totals;
  const after = m.summarize(compacted, today).totals;
  check("compaction leaves one row per installation-day, keeps the note, drops the empty row", compacted.length === 5, compacted.length + " rows");
  check("compaction keeps the note untouched", compacted.some((r) => r[0] === "a note typed into the sheet" && r.length === 1));
  check("compaction changes nothing the dashboard shows", JSON.stringify(before) === JSON.stringify(after));
  const nov1 = compacted.find((r) => r[0] === "2026-11-01");
  check("milestones are merged in the order reached", nov1[5] === "intro_completed,first_card_sacrifice", nov1[5]);
  check("the newest choice snapshot is kept", JSON.parse(nov1[6]).revision === 5);
  const nov2 = compacted.find((r) => r[0] === "2026-11-02");
  check("unknown milestones survive compaction", nov2[5] === "first_level_up,a_future_milestone,first_card_pick", nov2[5]);
  check("a day without a snapshot gets the one sent later", nov2[6] !== "");
  check("compaction is stable (a second pass changes nothing)", JSON.stringify(m.compactRows(compacted, today)) === JSON.stringify(compacted));
  check("the sacrifice-first reward order survives", after.sacrifice === 1 && after.pick === 0, JSON.stringify({ pick: after.pick, sacrifice: after.sacrifice }));
}

// --- Size: the largest day the game can send fits the 32 KB limit
{
  const len = ("skill:" + Object.keys(catalog.skills).sort((a, b) => b.length - a.length)[0] + "@5").length;
  const counts = {};
  for (let i = 0; i < 512; i++) counts["k".repeat(len - String(i).length) + i] = 10000;
  const size = JSON.stringify({ installationId: id(1), firstDay: today, platform: "android", build: "0.1-playtest",
    days: [{ date: today, milestones: ["intro_completed", "first_level_up", "first_boss_defeated", "first_card_pick", "first_card_sacrifice"], choices: { revision: 9999999, counts } }] }).length;
  check("the largest day fits in 32 KB (" + size + " bytes)", size <= 32768);
}

console.log("\nmaw-stats: passed=" + pass + " failed=" + fail);
process.exit(fail ? 1 : 0);
