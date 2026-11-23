import catalog from "./maw-playtest-catalog.json";

export type ChoiceSnapshot = { revision: number; counts: Record<string, number> };
type Count = { id: string; label: string; count: number };
type Card = { id: string; label: string; offered: number; picked: number };
type Boss = { id: string; label: string; attempts: number; clears: number };

export type ChoiceSummary = {
  skills: Count[];
  schools: Count[];
  hands: Count[];
  cards: Card[];
  sacrifices: Count[];
  progression: Count[];
  bosses: Boss[];
};

const { skills, schools, cards } = catalog as Record<"skills" | "schools" | "cards", Record<string, string>>;
const bosses: Record<string, string> = {
  warden: "Warden", matron: "Matron", stag: "Stag", wraith: "Wraith",
  hermit: "Hermit", embalmer: "Embalmer", pillar: "Pillar", vizier: "Vizier",
  king: "Morvath", prophet: "Nazhir",
};
const odds = new Set(["25", "50", "75", "100"]);

function catalogName(group: Record<string, string>, id: string) {
  return Object.hasOwn(group, id) ? group[id] : undefined;
}

function splitChoice(key: string) {
  const separator = key.indexOf(":");
  return [key.slice(0, separator), key.slice(separator + 1)];
}

function knownList(ids: string, group: Record<string, string>) {
  const members = ids.split("+");
  return members.length <= 3 && new Set(members).size === members.length &&
    members.every((id) => catalogName(group, id));
}

function validKey(key: string) {
  if (key.length > 100 || !key.includes(":")) return false;
  const [kind, id] = splitChoice(key);
  switch (kind) {
    case "skill": {
      const [node, rank, extra] = id.split("@");
      const validRank = /^[1-5]$/.test(rank) || (rank === "0" && node.startsWith("junction-"));
      return Boolean(extra === undefined && validRank && catalogName(skills, node));
    }
    case "school": return knownList(id, schools);
    case "hand": return knownList(id, cards) && [...id.split("+")].sort().join("+") === id;
    case "pick": return Boolean(catalogName(cards, id));
    case "sacrifice": return odds.has(id);
    case "intro": return id === "completed" || id === "skipped";
    case "level": return /^(?:[2-9]|[1-9][0-9]|100)$/.test(id);
    case "boss-attempt":
    case "boss-clear": return Boolean(catalogName(bosses, id.replace(/-sub$/, "")));
    default: return false;
  }
}

export function parseChoices(input: unknown): ChoiceSnapshot | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const { revision, counts } = input as Partial<ChoiceSnapshot>;
  if (typeof revision !== "number" || !Number.isSafeInteger(revision) || revision < 1 || revision > 10_000_000 ||
    !counts || typeof counts !== "object" || Array.isArray(counts)) return null;
  const validCounts = Object.entries(counts).slice(0, 512).filter(([key, count]) =>
    Number.isSafeInteger(count) && count > 0 && count <= 10_000 && validKey(key));
  return { revision, counts: Object.fromEntries(validCounts) };
}

export function readChoices(cell: unknown): ChoiceSnapshot | null {
  if (typeof cell !== "string" || cell.length > 32_768) return null;
  try {
    return parseChoices(JSON.parse(cell));
  } catch {
    return null;
  }
}

export function summarizeChoices(snapshots: Iterable<ChoiceSnapshot>): ChoiceSummary {
  const totals = new Map<string, number>();
  for (const { counts } of snapshots) {
    for (const [key, count] of Object.entries(counts)) totals.set(key, (totals.get(key) ?? 0) + count);
  }

  const summary: ChoiceSummary = { skills: [], schools: [], hands: [], cards: [], sacrifices: [], progression: [], bosses: [] };
  const cardCounts = new Map<string, Card>();
  const bossCounts = new Map<string, Boss>();

  function card(id: string) {
    let entry = cardCounts.get(id);
    if (!entry) {
      entry = { id, label: cards[id], offered: 0, picked: 0 };
      cardCounts.set(id, entry);
    }
    return entry;
  }

  for (const [key, count] of totals) {
    const [kind, id] = splitChoice(key);
    const ids = id.split("+");
    if (kind === "skill") {
      const [node, rank] = id.split("@");
      summary.skills.push({ id, label: skills[node] + (rank === "0" ? " · unlocked" : " · rank " + rank), count });
    } else if (kind === "school") {
      summary.schools.push({ id, label: ids.map((member) => schools[member]).join(" → "), count });
    } else if (kind === "hand") {
      for (const member of ids) card(member).offered += count;
      summary.hands.push({ id, label: ids.map((member) => cards[member]).join(" + "), count });
    } else if (kind === "pick") {
      card(id).picked += count;
    } else if (kind === "sacrifice") {
      summary.sacrifices.push({ id, label: id + "% next reward chance", count });
    } else if (kind === "intro" || kind === "level") {
      const label = kind === "level" ? "Reached level " + id : id === "completed" ? "Read the intro" : "Skipped the intro";
      summary.progression.push({ id: key, label, count });
    } else {
      let entry = bossCounts.get(id);
      if (!entry) {
        const name = bosses[id.replace(/-sub$/, "")];
        entry = { id, label: name + (id.endsWith("-sub") ? " sub-bosses" : ""), attempts: 0, clears: 0 };
        bossCounts.set(id, entry);
      }
      if (kind === "boss-attempt") entry.attempts += count;
      else entry.clears += count;
    }
  }

  const mostCommon = (a: Count, b: Count) => b.count - a.count || a.label.localeCompare(b.label);
  summary.skills.sort(mostCommon);
  summary.schools.sort(mostCommon);
  summary.hands.sort(mostCommon);
  summary.sacrifices.sort((a, b) => Number(a.id) - Number(b.id));
  summary.progression.sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
  summary.cards = [...cardCounts.values()].sort((a, b) => b.picked - a.picked || b.offered - a.offered || a.label.localeCompare(b.label));
  summary.bosses = [...bossCounts.values()].sort((a, b) => b.attempts - a.attempts || b.clears - a.clears || a.label.localeCompare(b.label));
  return summary;
}
