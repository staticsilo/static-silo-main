import Image from "next/image";
import FeedbackDialog from "./feedback-form";
import GameDetails from "./game-details";
import { KOFI_URL } from "./site-config";
import StartProjectCard from "./start-project-card";

const navLinks = [
  { label: "Fathomless Maw", href: "#game" },
  { label: "Studio", href: "#studio" },
  { label: "Contact", href: "#contact" },
];

const pillars = [
  {
    title: "Etched visual style",
    description:
      "Ink lines, sepia stains, and narrow pools of light give the world the look of an old engraving.",
  },
  {
    title: "Atmosphere first",
    description:
      "We build worlds you feel before you understand. Quiet horizons, uneasy silence, and something always watching.",
  },
  {
    title: "Small & independent",
    description:
      "An independent studio in Malaysia, building a horror universe one game at a time.",
  },
];

const roman = ["I", "II", "III"];

const gameFacts = [
  { k: "Genre", v: "Isometric action RPG" },
  { k: "Releasing on", v: "PC" },
  { k: "In development", v: "Android & iOS" },
];

function SiloMark({ className = "h-10 w-10" }: Readonly<{ className?: string }>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path d="M24 2.5l1.6 6h-3.2z" fill="#b9a684" />
      <path
        d="M15 18c0-6 4-9.5 9-9.5s9 3.5 9 9.5v26H15z"
        fill="#2a231b"
        stroke="#b9a684"
        strokeWidth="1.4"
      />
      <path d="M15 17.5h18M15 30h18M15 38h18" stroke="#b9a684" strokeWidth="1" opacity="0.6" />
      <circle cx="24" cy="22.5" r="5" fill="#13110d" stroke="#b9a684" strokeWidth="1.2" />
      <circle cx="24" cy="22.5" r="3.6" fill="#e2ee6c" className="eye-glow" />
      <rect x="21.2" y="22" width="5.6" height="1.1" rx="0.5" fill="#13110d" />
      <path
        d="M6 44c2-9 5-14 8-15M42 44c-1.5-7-4-12-7.5-13"
        fill="none"
        stroke="#b9a684"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoLockup() {
  return (
    <a href="#top" className="group flex items-center gap-3" aria-label="Static Silo home">
      <SiloMark />
      <div className="leading-none">
        <span className="block font-display text-base font-semibold uppercase tracking-[0.32em] text-parchment">
          Static Silo
        </span>
        <span className="mt-1.5 hidden whitespace-nowrap font-type text-[10px] uppercase tracking-[0.3em] text-muted sm:block">
          Independent Games
        </span>
      </div>
    </a>
  );
}

function InkButton({
  href,
  children,
  variant = "primary",
}: Readonly<{
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}>) {
  if (variant === "secondary") {
    return (
      <a
        href={href}
        className="inline-flex min-h-12 items-center justify-center whitespace-nowrap border border-sepia/50 bg-ink/40 px-7 font-display text-xs font-semibold uppercase tracking-[0.28em] text-parchment backdrop-blur transition duration-300 hover:border-eye/70 hover:text-eye"
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center justify-center whitespace-nowrap border border-parchment bg-parchment px-7 font-display text-xs font-bold uppercase tracking-[0.28em] text-ink shadow-[0_0_0_4px_#0b0a08,0_0_0_5px_rgba(232,220,192,0.5)] transition duration-300 hover:bg-eye hover:shadow-[0_0_0_4px_#0b0a08,0_0_0_5px_rgba(226,238,108,0.7),0_0_40px_rgba(226,238,108,0.35)]"
    >
      {children}
    </a>
  );
}

function StaticBars() {
  return (
    <div aria-hidden="true" className="static-bars">
      <span style={{ top: "18%" }} />
      <span style={{ top: "41%", animationDelay: "1.3s" }} />
      <span style={{ top: "57%", animationDelay: "2.6s" }} />
      <span style={{ top: "73%", animationDelay: "0.7s" }} />
    </div>
  );
}

export default function Home() {
  return (
    <div id="top" className="min-h-screen overflow-hidden bg-ink text-parchment">
      <header className="sticky top-0 z-50 border-b border-parchment/10 bg-ink/85 backdrop-blur-md">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 sm:px-6 lg:px-8"
          aria-label="Primary navigation"
        >
          <LogoLockup />
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap font-display text-xs font-semibold uppercase tracking-[0.24em] text-sepia transition hover:text-eye"
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap border border-ember/50 px-4 font-display text-xs font-semibold uppercase tracking-[0.18em] text-ember transition hover:border-eye/70 hover:text-eye"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 9h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
              <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
              <path d="M8 5.5c0 .8-.8.8-.8 1.6M11 5.5c0 .8-.8.8-.8 1.6" />
            </svg>
            <span className="sm:hidden">Donate</span>
            <span className="hidden sm:inline">Support on Ko-fi</span>
          </a>
        </nav>
      </header>

      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative isolate overflow-hidden border-b border-parchment/10">
          <Image
            src="/brand/silo-engraved.webp"
            alt=""
            fill
            sizes="100vw"
            className="-z-30 scale-110 object-cover opacity-30 blur-2xl"
          />
          <div className="vignette absolute inset-0 -z-20" />
          <StaticBars />

          <div className="mx-auto flex max-w-7xl flex-col items-center px-5 pb-16 pt-6 text-center sm:px-6 lg:px-8 lg:pb-20">
            <div className="relative -mb-10 aspect-[1024/760] w-full max-w-[720px] overflow-hidden sm:-mb-14">
              <Image
                src="/brand/silo-engraved.webp"
                alt="An etched rusted silo with a glowing eye, wrapped by tentacles rising from a dark sea"
                fill
                sizes="(min-width: 768px) 720px, 100vw"
                className="object-cover object-top"
                preload
              />
              <div className="absolute inset-0 bg-[radial-gradient(closest-side,transparent_55%,#0b0a08_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
            </div>
            <p className="relative font-type text-xs uppercase tracking-[0.36em] text-sepia">
              Independent game studio · Malaysia
            </p>
            <h1 className="relative mt-6 font-display text-5xl font-semibold tracking-[0.18em] text-parchment drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] sm:text-7xl lg:text-8xl">
              <span className="glitch" data-text="STATIC">STATIC</span>{" "}
              <span className="glitch" data-text="SILO">SILO</span>
            </h1>
            <div className="mt-4 flex w-full max-w-xl items-center gap-8 sm:gap-14">
              <span className="logo-rule flex-1" />
              <span className="logo-rule flex-1" />
            </div>
            <p className="mt-7 max-w-2xl text-xl italic leading-8 text-parchment/90 sm:text-2xl sm:leading-9">
              Dark games with an etched look, about what waits beneath the surface. Our first is Fathomless Maw.
            </p>
            <div className="mt-10 flex w-full flex-col justify-center gap-5 sm:w-auto sm:flex-row">
              <InkButton href="#game">Discover Fathomless Maw</InkButton>
              <InkButton href="#contact" variant="secondary">
                Get in Touch
              </InkButton>
            </div>
          </div>
        </section>

        {/* ---------- The game ---------- */}
        <section id="game" className="relative px-5 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_50%,rgba(163,48,31,0.16),transparent_60%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="plate relative overflow-hidden p-3">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src="/brand/seal-game.webp"
                  alt="Fathomless Maw seal: a black-iron ring of spikes and tentacles around a maw of fangs falling into fire"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="ember-glow object-cover"
                />
                <StaticBars />
              </div>
              <span className="absolute left-6 top-6 border border-blood/70 bg-ink/80 px-3 py-1.5 font-type text-[10px] uppercase tracking-[0.3em] text-ember">
                Fathomless Maw · In development
              </span>
            </div>

            <div>
              <p className="font-type text-xs uppercase tracking-[0.34em] text-ember">
                Our first game
              </p>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-[0.08em] text-parchment sm:text-5xl lg:text-6xl">
                Fathomless Maw
              </h2>
              <div className="mt-6 flex max-w-xs items-center gap-3">
                <span className="h-1.5 w-1.5 rotate-45 bg-blood" />
                <span className="logo-rule flex-1" />
              </div>
              <p className="mt-6 text-xl italic leading-8 text-parchment/90 sm:text-2xl sm:leading-9">
                Light the bonfire. Cross the causeway. Go down.
              </p>
              <p className="mt-5 text-lg leading-8 text-sepia sm:text-xl">
                Fathomless Maw is a dark isometric action RPG. You set out from a lone
                bonfire at Ashwater Camp into lands that rot, drown and burn. Carve through
                hordes, kill the bosses that rule each country, and drag their loot back
                to the fire.
              </p>
              <p className="mt-4 text-lg leading-8 text-sepia sm:text-xl">
                Each trial you survive sinks you deeper, from the Shallows to the Depths
                and on to the Abyss.
              </p>

              <dl className="mt-10 grid grid-cols-3 border-y border-parchment/10">
                {gameFacts.map((item, i) => (
                  <div
                    key={item.k}
                    className={`py-5 ${i > 0 ? "border-l border-parchment/10 pl-4 sm:pl-5" : ""}`}
                  >
                    <dt className="font-type text-[10px] uppercase tracking-[0.28em] text-muted">
                      {item.k}
                    </dt>
                    <dd className="mt-2 font-display text-xs font-semibold tracking-wide text-parchment sm:text-base">
                      {item.v}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex flex-col flex-wrap gap-5 sm:flex-row">
                <GameDetails />
                <InkButton href="#contact" variant="secondary">
                  Get Updates
                </InkButton>
                <FeedbackDialog />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Studio ---------- */}
        <section
          id="studio"
          className="hatch border-y border-parchment/10 bg-ink-2 px-5 py-24 sm:px-6 lg:px-8 lg:py-32"
        >
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="grid grid-cols-3 gap-3">
              {[
                { src: "/brand/silo-render.webp", alt: "The silo, rendered", label: "Render" },
                { src: "/brand/silo-engraved.webp", alt: "The silo, engraved", label: "Etching" },
                { src: "/brand/silo-comic.jpg", alt: "The silo, inked on parchment", label: "Ink" },
              ].map((plate, i) => (
                <figure
                  key={plate.src}
                  className={`plate p-1.5 ${i === 1 ? "float-slow -translate-y-4" : "mt-8"}`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={plate.src}
                      alt={plate.alt}
                      fill
                      sizes="(min-width: 1024px) 18vw, 33vw"
                      className="origin-[50%_30%] scale-[1.35] object-cover object-center"
                    />
                  </div>
                  <figcaption className="py-2 text-center font-type text-[10px] uppercase tracking-[0.28em] text-muted">
                    {plate.label}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div>
              <p className="font-type text-xs uppercase tracking-[0.34em] text-eye/80">
                The studio
              </p>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-wide text-parchment sm:text-4xl lg:text-5xl">
                An engineer building a horror universe.
              </h2>
              <p className="mt-6 text-lg leading-8 text-sepia">
                I&apos;m an engineer from Malaysia and the founder of Static Silo. I had no experience
                making art when I started. I was working a job I&apos;d grown to hate, and the low pay
                made it hard to see a future there. I&apos;d dreamed of making a horror game for years.
                Starting the studio gave me a reason to finally try.
              </p>
              <p className="mt-4 text-lg leading-8 text-sepia">
                I brought my engineering habits with me. I break a problem down, build something
                I can test, and keep refining it. That&apos;s how I found the game&apos;s visual style
                and got the combat and character builds to feel the way I wanted.
              </p>
              <p className="mt-4 text-lg leading-8 text-sepia">
                Fathomless Maw is the first game in the horror universe I want to build. It brings
                together the dread and mystery of a horror story and the freedom of an action RPG.
                What you find changes how you fight, and every descent reveals a little more about
                what happened down there.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-20 grid max-w-7xl gap-px border border-parchment/10 bg-parchment/10 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className="group bg-ink p-8 transition duration-300 hover:bg-panel"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl text-bronze transition group-hover:text-eye">
                    {roman[index]}
                  </span>
                  <span className="h-px w-10 bg-sepia/30 transition-all duration-300 group-hover:w-16 group-hover:bg-eye/60" />
                </div>
                <h3 className="mt-8 font-display text-lg font-semibold tracking-wide text-parchment">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-sepia">{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section id="contact" className="px-5 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-5xl">
            <StartProjectCard />
          </div>
        </section>
      </main>

      <footer className="hatch-h border-t border-parchment/10 bg-ink-2 px-5 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <LogoLockup />
            <p className="mt-5 max-w-md text-base leading-7 text-sepia">
              An independent game studio from Malaysia.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-parchment">
              Studio
            </h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  className="text-base text-sepia transition hover:text-eye"
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-parchment/10 pt-6 font-type text-[11px] uppercase tracking-[0.2em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2020 Static Silo. All rights reserved.</p>
          <p>Independent Games</p>
        </div>
      </footer>
    </div>
  );
}
