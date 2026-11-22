"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { OPEN_FEEDBACK_EVENT } from "./feedback-form";

const shots = [
  {
    src: "/game/bone-fields-falling-stars.webp",
    title: "The Bone Fields",
    caption: "Falling Stars rain fire on a horde crossing the bone-strewn plain.",
  },
  {
    src: "/game/lantern-graveyard-bone-spirits.webp",
    title: "The Lantern Graveyard",
    caption: "Bone Spirits and Whirling Blades tear through the dead while the Gravekeeper waits.",
  },
  {
    src: "/game/sun-tombs-plague-vials.webp",
    title: "The Sun Tombs · Act II",
    caption: "Plague Vials poison the sand among the tombs of the Dust Sea.",
  },
  {
    src: "/game/ashwater-camp.webp",
    title: "Ashwater Camp",
    caption: "The last fire on the moor. Rest, trade, stash your loot, then cross the causeway.",
  },
  {
    src: "/game/rotwood-gorecraft.webp",
    title: "The Rotwood",
    caption: "Gorecraft and the Crimson Scythe: corpses burst and blood is reaped back as life.",
  },
  {
    src: "/game/rotwood-frost-orbs.webp",
    title: "The Rotwood",
    caption: "Frost Orbs chill a crowd until it shatters.",
  },
  {
    src: "/game/drowned-marsh-arc-lightning.webp",
    title: "The Drowned Marsh",
    caption: "Arc Lightning chains from body to body through the rain.",
  },
  {
    src: "/game/salt-pans-arrow-volley.webp",
    title: "The Salt Pans · Act II",
    caption: "An Arrow Volley sweeps the white flats.",
  },
  {
    src: "/game/glass-flats-stormspears.webp",
    title: "The Glass Flats · Act II",
    caption: "Stormspears fly across the fused glass.",
  },
];

// The camp, the loot and the trades between the fights.
const systems = [
  {
    src: "/game/item-compare.webp",
    title: "Ancient vs Legendary",
    caption: "Every find is weighed against what you wear, roll by roll, with greater affixes and build bonuses.",
  },
  {
    src: "/game/inventory.webp",
    title: "Inventory",
    caption: "Worn gear, a grid pack, charm slots and every bonus your gear adds up to.",
  },
  {
    src: "/game/gambler.webp",
    title: "Fenn the Gambler",
    caption: "Pay for an item you cannot see. You learn what it is once it is bought.",
  },
  {
    src: "/game/brinecoffer-runes.webp",
    title: "The Brinecoffer · Runes",
    caption: "Upgrade runes, set them into sockets, make runewords, or rebuild your hero for mastery.",
  },
  {
    src: "/game/brinecoffer-forge.webp",
    title: "The Brinecoffer · Forge",
    caption: "Reforge a stat on your runeword with boss materials: Heartwood, Pearl, Ankh and Ember.",
  },
  {
    src: "/game/character-sheet.webp",
    title: "Character",
    caption: "Strength, Dexterity, Vitality and Energy, with damage and resistances by element.",
  },
  {
    src: "/game/blacksmith.webp",
    title: "Hild the Blacksmith",
    caption: "Plain and enchanted gear, a sell-junk button and buyback.",
  },
  {
    src: "/game/stash.webp",
    title: "The Stash",
    caption: "Four shared tabs, kept for every hero you make.",
  },
];

type GalleryShot = {
  src: string;
  title: string;
  caption: string;
  portrait?: boolean;
  animation?: string;
};

const latestShots: GalleryShot[] = [
  {
    src: "/game/venomfrost-from-tree.webp",
    animation: "/game/venomfrost-from-tree.gif",
    title: "Build Venomfrost Barrage",
    caption: "Pick Frost, then Plague, then Volley. Watch the revealed combo send a Frost Orb into the pack, spread venom, and rain down arrows.",
  },
  {
    src: "/game/talent-tree.webp",
    animation: "/game/talent-tree-cold-wake.gif",
    title: "One connected talent tree",
    caption: "Pan and pinch to explore. Follow the lit path to Cold Wake, pick it, and see how its next rank improves the skill.",
    portrait: true,
  },
  {
    src: "/game/level-up-cards.webp",
    animation: "/game/level-up-sacrifice.gif",
    title: "Level-up cards and Sacrifice",
    caption: "Pick one of three bonuses or burn the whole hand to improve your next roll. Keep your talent point either way. At 100%, choose between Stolen Omen and Grave Tithe.",
  },
  {
    src: "/game/venomfrost-barrage.webp",
    animation: "/game/venomfrost-barrage.gif",
    title: "Venomfrost Barrage",
    caption: "Frost, Plague and Volley combine into a rain of venom-tipped arrows in the Rotwood.",
  },
  {
    src: "/game/morvath-hellrain.webp",
    animation: "/game/morvath-hellrain.gif",
    title: "Dodging Hellrain",
    caption: "Morvath marks the cathedral floor before Hellrain falls. Dash out as the impacts close in.",
  },
  {
    src: "/game/charged-javelin.webp",
    animation: "/game/charged-javelin.gif",
    title: "Charged Javelin",
    caption: "Lightning and Spears work together as the hero fights through the Drowned Marsh.",
  },
  {
    src: "/game/cold-wake.webp",
    title: "Cold Wake",
    caption: "Dash through an ice trail to shatter enemies. Each rank shows what the next point changes.",
    portrait: true,
  },
  {
    src: "/game/ordered-combo.webp",
    title: "The order shapes your combo",
    caption: "The tree tracks the order you learn schools and reveals the resulting ability.",
    portrait: true,
  },
  {
    src: "/game/pinnacle-path.webp",
    title: "The Pinnacle path",
    caption: "After Morvath falls, five choices from levels 96–100 deepen your build.",
    portrait: true,
  },
  {
    src: "/game/morvath-duel.webp",
    title: "Morvath, the Undying King",
    caption: "A scythe-wielding hero closes in as Morvath brings his throne room to life.",
  },
];

// Fights and systems interleaved, so the gallery alternates action and depth.
const gallery: GalleryShot[] = [...latestShots, ...shots.flatMap((s, i) => (systems[i] ? [s, systems[i]] : [s]))];

function Gallery() {
  const [index, setIndex] = useState(0);
  const shot = gallery[index];
  const source = shot.animation ?? shot.src;
  const step = (direction: number) => {
    setIndex((current) => (current + direction + gallery.length) % gallery.length);
  };
  const stripRef = useRef<HTMLDivElement>(null);

  // Keep the current thumbnail in the middle of the strip as the arrows move past the edge.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const target = thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2;
    strip.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [index]);

  // A mouse wheel scrolls the strip sideways (it has no visible scrollbar to drag).
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = strip.scrollWidth - strip.clientWidth;
      const atEdge =
        (e.deltaY < 0 && strip.scrollLeft <= 0) || (e.deltaY > 0 && strip.scrollLeft >= max - 1);
      if (atEdge) return; // let the popup scroll on once the strip has reached its end
      e.preventDefault();
      strip.scrollLeft += e.deltaY;
    };
    strip.addEventListener("wheel", onWheel, { passive: false });
    return () => strip.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section className="mt-12">
      <Heading>From the depths</Heading>
      <Rule />
      <div className="plate mt-6 p-2">
        <div className="relative aspect-square overflow-hidden bg-black sm:aspect-video">
          <Image
            key={source}
            src={source}
            alt={`${shot.title}: ${shot.caption}`}
            fill
            sizes="(min-width: 1024px) 960px, 100vw"
            unoptimized={Boolean(shot.animation)}
            className="gallery-fade object-contain motion-reduce:animate-none"
          />
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous screenshot"
            className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-parchment/30 bg-ink/70 font-display text-xl text-parchment transition hover:border-eye/70 hover:text-eye"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next screenshot"
            className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-parchment/30 bg-ink/70 font-display text-xl text-parchment transition hover:border-eye/70 hover:text-eye"
          >
            ›
          </button>
        </div>
        <div className="flex flex-col gap-1 px-2 pb-1 pt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          <p className="font-display text-base font-semibold tracking-wide text-parchment">
            {shot.title}
          </p>
          <p className="text-base italic text-sepia sm:text-right">{shot.caption}</p>
        </div>
      </div>
      <div
        ref={stripRef}
        className="no-scrollbar mt-3 flex snap-x gap-2 overflow-x-auto pb-1 [mask-image:linear-gradient(90deg,transparent,black_4%,black_96%,transparent)]"
      >
        {gallery.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${s.title}${s.animation ? " (animated preview)" : ""}`}
            aria-current={i === index}
            className={`relative aspect-video w-28 shrink-0 snap-center cursor-pointer overflow-hidden border transition sm:w-32 ${
              i === index
                ? "border-eye/80 opacity-100"
                : "border-parchment/15 opacity-55 hover:opacity-90"
            }`}
          >
            <Image src={s.src} alt="" fill sizes="128px" className={s.portrait ? "object-contain" : "object-cover"} />
            {s.animation && (
              <span aria-hidden="true" className="absolute bottom-1 right-1 bg-ink/90 px-1.5 text-xs leading-5 text-parchment">
                ▶
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="mt-2 font-type text-[10px] uppercase tracking-[0.24em] text-muted">
        In-game screenshots and gameplay · work in progress
      </p>
    </section>
  );
}

const roman = ["I", "II", "III", "IV"];

const acts = [
  {
    numeral: "Act I",
    title: "The Ashwater Moor",
    ready: true,
    description:
      "A night-soaked moor of rot and drowned ground. Cross the Rotwood, the Drowned Marsh, the Bone Fields and the Lantern Graveyard, then enter the hall of Morvath.",
  },
  {
    numeral: "Act II",
    title: "The Dust Sea",
    ready: true,
    description:
      "A desert over a buried country, under a sun that will not finish setting. The Glass Flats, the Natron Wells, the Salt Pans and the Sun Tombs lead to the Buried Temple and Nazhir.",
  },
  {
    numeral: "Act III",
    title: "The Frozen Deep",
    ready: false,
    description: "A frozen country waiting at the bottom of the Abyss.",
  },
];

const trials = [
  { name: "The Shallows", text: "The moor as you found it." },
  { name: "The Depths", text: "Opens Act II. Stronger monsters, richer spoils." },
  { name: "The Abyss", text: "Opens Act III. Only the rarest relics are worth it." },
];

const schools = [
  "Spiral Hammers",
  "Stormspears",
  "Shockwave Roar",
  "Frost Orbs",
  "Resonance",
  "Crimson Scythe",
  "Gorecraft",
  "Plague Vials",
  "Falling Stars",
  "Bone Spirits",
  "Arc Lightning",
  "Whirling Blades",
  "Arrow Volley",
  "Blade Dance",
  "Cleaver Axes",
  "Dagger Flurry",
  "Earthbreaker",
  "Ballista",
  "Gravity Wells",
];

const features = [
  {
    title: "Build from the Crossroads",
    description:
      "Explore 19 schools on one talent map. Your first three schools shape an ordered attack, and ranked mastery lets you deepen your choices. Level-up cards add smaller bonuses along the way.",
  },
  {
    title: "Loot worth the dark",
    description:
      "Uniques, sets, legendaries and ancients. Runes and runewords, charms, and the Brinecoffer for transmuting what you find.",
  },
  {
    title: "Iron heroes",
    description:
      "Bring as many heroes as you like to the bonfire at Ashwater Camp. Swear one to iron and its death is forever.",
  },
  {
    title: "PC, then phones",
    description:
      "Fathomless Maw is coming to PC. Android and iOS versions are in development, built for one hand with a fixed stick, a double-tap dash and touch-sized windows.",
  },
];

function Rule() {
  return (
    <div className="mt-5 flex max-w-xs items-center gap-3">
      <span className="h-1.5 w-1.5 rotate-45 bg-blood" />
      <span className="logo-rule flex-1" />
    </div>
  );
}

function Heading({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <h3 className="font-display text-lg font-semibold uppercase tracking-[0.2em] text-parchment sm:text-xl">
      {children}
    </h3>
  );
}

export default function GameDetails() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlock = () => document.documentElement.classList.remove("overflow-hidden");
    dialog.addEventListener("close", unlock);
    return () => {
      dialog.removeEventListener("close", unlock);
      unlock();
    };
  }, []);

  function open() {
    const dialog = dialogRef.current;
    if (!dialog) return;
    document.documentElement.classList.add("overflow-hidden");
    dialog.showModal();
    dialog.scrollTop = 0;
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap border border-parchment bg-parchment px-7 font-display text-xs font-bold uppercase tracking-[0.28em] text-ink shadow-[0_0_0_4px_#0b0a08,0_0_0_5px_rgba(232,220,192,0.5)] transition duration-300 hover:bg-eye hover:shadow-[0_0_0_4px_#0b0a08,0_0_0_5px_rgba(226,238,108,0.7),0_0_40px_rgba(226,238,108,0.35)]"
      >
        Into the Depths
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="game-details-title"
        onClick={(event) => {
          // a click on the backdrop (outside the panel) closes it
          if (event.target === event.currentTarget) close();
        }}
        className="game-dialog no-scrollbar m-auto max-h-[92svh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto border border-parchment/15 bg-ink p-0 text-parchment shadow-[0_30px_120px_rgba(0,0,0,0.85)] backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        <div className="hatch">
          {/* Banner */}
          <div className="relative h-44 overflow-hidden border-b border-parchment/10 sm:h-56">
            <Image
              src="/brand/seal-game.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover object-[50%_35%] opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-5 sm:px-10">
              <p className="font-type text-[11px] uppercase tracking-[0.34em] text-ember">
                The descent
              </p>
              <h2
                id="game-details-title"
                className="mt-2 font-display text-3xl font-semibold tracking-[0.08em] text-parchment sm:text-5xl"
              >
                Fathomless Maw
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close game details"
              className="absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center border border-parchment/30 bg-ink/70 font-display text-lg text-parchment transition hover:border-eye/70 hover:text-eye"
            >
              ×
            </button>
          </div>

          <div className="px-6 py-10 sm:px-10">
            <p className="max-w-3xl text-lg leading-8 text-sepia sm:text-xl">
              Every country has a king, and every king falls. Each act is its own land, with
              its own ground, air and monsters. Each has eight lesser bosses and four zone
              bosses, then one last boss who guards the way down.
            </p>

            <Gallery />

            {/* Acts */}
            <section className="mt-12">
              <Heading>The acts</Heading>
              <Rule />
              <div className="mt-6 grid gap-px border border-parchment/10 bg-parchment/10 md:grid-cols-3">
                {acts.map((act) => (
                  <article key={act.title} className={`bg-ink p-6 ${act.ready ? "" : "opacity-60"}`}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-bronze">
                        {act.numeral}
                      </span>
                      <span
                        className={`font-type text-[10px] uppercase tracking-[0.2em] ${
                          act.ready ? "text-eye/80" : "text-muted"
                        }`}
                      >
                        {act.ready ? "Playable" : "The road is not cut yet"}
                      </span>
                    </div>
                    <h4 className="mt-5 font-display text-xl font-semibold tracking-wide text-parchment">
                      {act.title}
                    </h4>
                    <p className="mt-3 text-base leading-7 text-sepia">{act.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <div className="mt-14 grid gap-12 lg:grid-cols-2">
              {/* Trials */}
              <section>
                <Heading>Three trials</Heading>
                <Rule />
                <ol className="mt-6 border-t border-parchment/10">
                  {trials.map((trial, i) => (
                    <li
                      key={trial.name}
                      className="flex items-baseline gap-5 border-b border-parchment/10 py-4"
                    >
                      <span className="w-8 font-display text-lg text-blood">{roman[i]}</span>
                      <div>
                        <p className="font-display text-base font-semibold tracking-wide text-parchment">
                          {trial.name}
                        </p>
                        <p className="mt-1 text-base leading-7 text-sepia">{trial.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Schools */}
              <section>
                <Heading>Nineteen schools of slaughter</Heading>
                <Rule />
                <ul className="mt-6 flex flex-wrap gap-2">
                  {schools.map((school) => (
                    <li
                      key={school}
                      className="border border-parchment/15 px-3 py-1.5 font-type text-[11px] uppercase tracking-[0.14em] text-sepia transition hover:border-ember/60 hover:text-ember"
                    >
                      {school}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Features */}
            <section className="mt-14">
              <Heading>What waits below</Heading>
              <Rule />
              <div className="mt-6 grid gap-px border border-parchment/10 bg-parchment/10 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <article key={feature.title} className="group bg-ink p-6 transition hover:bg-panel">
                    <span className="font-display text-xl text-bronze transition group-hover:text-ember">
                      {roman[index]}
                    </span>
                    <h4 className="mt-4 font-display text-lg font-semibold tracking-wide text-parchment">
                      {feature.title}
                    </h4>
                    <p className="mt-2 text-base leading-7 text-sepia">{feature.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
              <a
                href="#game"
                onClick={() => {
                  close();
                  window.dispatchEvent(new Event(OPEN_FEEDBACK_EVENT));
                }}
                className="inline-flex min-h-12 items-center justify-center whitespace-nowrap border border-ember/60 px-7 font-display text-xs font-semibold uppercase tracking-[0.28em] text-ember transition hover:border-eye/70 hover:text-eye"
              >
                Leave Feedback
              </a>
              <button
                type="button"
                onClick={close}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap border border-sepia/50 px-7 font-display text-xs font-semibold uppercase tracking-[0.28em] text-parchment transition hover:border-eye/70 hover:text-eye"
              >
                Return to the Surface
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
