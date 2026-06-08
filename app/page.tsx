import Image from "next/image";
import BusinessCardButton from "./business-card-button";
import StartProjectCard from "./start-project-card";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
];

const capabilities = [
  "Custom software",
  "Web applications",
  "Mobile applications",
  "SaaS platforms",
  "API integrations",
  "Product development",
  "Data & reporting",
  "Automation",
];

const services = [
  {
    title: "Custom Software Development",
    description:
      "Purpose-built platforms, internal tools, APIs, and integrations designed around how your teams operate.",
    accent: "from-[#00C8FF]/80 via-[#2563FF]/60 to-[#8A2BFF]/70",
    index: "01",
  },
  {
    title: "Web Application Development",
    description:
      "Responsive portals, dashboards, admin systems, booking tools, websites, and web platforms built for daily use.",
    accent: "from-[#2563FF]/80 via-[#8A2BFF]/60 to-[#FF2BD6]/70",
    index: "02",
  },
  {
    title: "Mobile Application Development",
    description:
      "Business mobile apps, customer apps, field tools, mobile workflows, and cross-platform product experiences.",
    accent: "from-[#8A2BFF]/80 via-[#FF2BD6]/50 to-[#FF7A00]/70",
    index: "03",
  },
  {
    title: "SaaS & Product Platforms",
    description:
      "Subscription platforms, multi-user products, MVPs, internal products, and scalable digital services.",
    accent: "from-[#00C8FF]/80 via-[#2563FF]/50 to-[#FFD000]/70",
    index: "04",
  },
  {
    title: "API & System Integrations",
    description:
      "Connect CRMs, ERPs, payment gateways, messaging tools, accounting systems, and third-party services.",
    accent: "from-[#2563FF]/75 via-[#00C8FF]/50 to-[#FF7A00]/70",
    index: "05",
  },
  {
    title: "E-commerce & Customer Portals",
    description:
      "Online stores, client portals, partner platforms, self-service flows, and customer-facing digital products.",
    accent: "from-[#FF2BD6]/75 via-[#8A2BFF]/50 to-[#00C8FF]/70",
    index: "06",
  },
  {
    title: "Business Automation",
    description:
      "Workflow automation, data routing, approvals, notifications, and process visibility across teams.",
    accent: "from-[#FF7A00]/80 via-[#FF2BD6]/40 to-[#2563FF]/70",
    index: "07",
  },
  {
    title: "Database & Reporting Systems",
    description:
      "Operational databases, reporting layers, analytics views, and decision support for management teams.",
    accent: "from-[#FFD000]/80 via-[#FF7A00]/40 to-[#00C8FF]/70",
    index: "08",
  },
];

const solutions = [
  {
    title: "Business Operations Software",
    description:
      "Replace spreadsheets and manual handoffs with custom systems for sales, inventory, approvals, service, and operations.",
  },
  {
    title: "Enterprise Applications",
    description:
      "Build role-based applications, workflow tools, internal portals, and data-driven systems for growing teams.",
  },
  {
    title: "SaaS & Digital Products",
    description:
      "Turn product ideas into usable MVPs, customer platforms, subscription software, and market-ready web apps.",
  },
  {
    title: "Data, Reporting & Automation",
    description:
      "Create reporting dashboards, database systems, automated workflows, and decision tools for management teams.",
  },
];

const processSteps = [
  {
    title: "Discover",
    description:
      "Map objectives, users, workflows, existing tools, data flows, and operational constraints.",
  },
  {
    title: "Architect",
    description:
      "Define the technical plan, integration points, delivery phases, and measurable outcomes.",
  },
  {
    title: "Build",
    description:
      "Develop, integrate, test, and iterate with clear checkpoints and production-minded engineering.",
  },
  {
    title: "Operate",
    description:
      "Deploy, monitor, support, and improve the system as business requirements evolve.",
  },
];

const stats = [
  { value: "24/7", label: "operational mindset" },
  { value: "MY", label: "Malaysia-based Company" },
  { value: "B2B", label: "business-first systems" },
];

function LogoLockup() {
  return (
    <a href="#top" className="flex items-center gap-3" aria-label="Static Silo home">
      <Image
        src="/StaticSilo-1on1.png"
        alt=""
        width={1254}
        height={1254}
        className="h-10 w-10 rounded-[8px] object-cover shadow-[0_0_24px_rgba(0,200,255,0.22)]"
      />
      <div className="leading-none">
        <span className="block text-sm font-semibold uppercase tracking-[0.28em] text-[#F5F7FA] sm:text-base">
          Static Silo
        </span>
        <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.36em] text-[#9BA3AF] sm:block">
          Code - Connect - Create
        </span>
      </div>
    </a>
  );
}

function GradientButton({
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
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.03] px-6 text-sm font-semibold text-[#F5F7FA] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-300 hover:border-[#00C8FF]/60 hover:bg-white/[0.07] hover:text-white"
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(100deg,#00C8FF_0%,#2563FF_26%,#8A2BFF_48%,#FF2BD6_68%,#FF7A00_86%,#FFD000_100%)] px-6 text-sm font-semibold text-[#030405] shadow-[0_0_34px_rgba(0,200,255,0.24)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_44px_rgba(255,43,214,0.28)]"
    >
      {children}
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00C8FF]">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[#F5F7FA] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-[#9BA3AF] sm:text-lg">{description}</p>
    </div>
  );
}

function GradientCard({
  children,
  accent = "from-[#00C8FF]/40 via-[#8A2BFF]/30 to-[#FF7A00]/40",
  className = "",
}: Readonly<{
  children: React.ReactNode;
  accent?: string;
  className?: string;
}>) {
  return (
    <div
      className={`group rounded-[8px] bg-gradient-to-br ${accent} p-px transition duration-300 hover:shadow-[0_0_36px_rgba(0,200,255,0.14)] ${className}`}
    >
      <div className="h-full rounded-[7px] border border-white/[0.06] bg-[#0D1117]/85 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition duration-300 group-hover:bg-[#111822]/90">
        {children}
      </div>
    </div>
  );
}

function ServiceCard({ service }: Readonly<{ service: (typeof services)[number] }>) {
  return (
    <GradientCard accent={service.accent}>
      <div className="flex h-full flex-col gap-7">
        <div className="flex items-start justify-between gap-4">
          <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${service.accent}`} />
          <span className="text-xs font-semibold text-[#9BA3AF]">{service.index}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold tracking-normal text-[#F5F7FA]">
            {service.title}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[#9BA3AF]">{service.description}</p>
        </div>
      </div>
    </GradientCard>
  );
}

function SolutionCard({ solution }: Readonly<{ solution: (typeof solutions)[number] }>) {
  return (
    <article className="rounded-[8px] border border-white/[0.08] bg-[#080B10]/80 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#00C8FF]/40 hover:bg-[#0D1117]/90">
      <div className="mb-6 h-10 w-10 rounded-[8px] border border-white/10 bg-[linear-gradient(135deg,rgba(0,200,255,0.22),rgba(255,43,214,0.18),rgba(255,208,0,0.16))] shadow-[0_0_26px_rgba(138,43,255,0.16)]" />
      <h3 className="text-xl font-semibold text-[#F5F7FA]">{solution.title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#9BA3AF]">{solution.description}</p>
    </article>
  );
}

function ProcessStep({
  step,
  index,
}: Readonly<{
  step: (typeof processSteps)[number];
  index: number;
}>) {
  return (
    <li className="relative pl-12 md:pl-0">
      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-[#00C8FF]/40 bg-[#030405] text-xs font-semibold text-[#F5F7FA] shadow-[0_0_22px_rgba(0,200,255,0.18)] md:static md:mb-6">
        {String(index + 1).padStart(2, "0")}
      </div>
      <h3 className="text-xl font-semibold text-[#F5F7FA]">{step.title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#9BA3AF]">{step.description}</p>
    </li>
  );
}

export default function Home() {
  return (
    <div id="top" className="min-h-screen overflow-hidden bg-[#030405] text-[#F5F7FA]">
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#030405]/80 backdrop-blur-xl">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-6 lg:px-8"
          aria-label="Primary navigation"
        >
          <LogoLockup />
          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#9BA3AF] transition hover:text-[#F5F7FA]"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <BusinessCardButton />
            <a
              href="#contact"
              className="hidden min-h-10 items-center justify-center rounded-full border border-[#00C8FF]/40 bg-[#00C8FF]/10 px-5 text-sm font-semibold text-[#F5F7FA] transition hover:border-[#FFD000]/50 hover:bg-[#FFD000]/10 lg:inline-flex"
            >
              Contact
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
          <div className="absolute inset-0 -z-20 bg-[#030405]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(0,200,255,0.16)_0%,rgba(37,99,255,0.08)_22%,rgba(138,43,255,0.11)_42%,rgba(255,43,214,0.08)_58%,rgba(255,122,0,0.08)_78%,rgba(255,208,0,0.06)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
          <Image
            src="/StaticSilo.png"
            alt=""
            width={1254}
            height={1254}
            className="pointer-events-none absolute left-1/2 top-8 -z-10 w-[520px] max-w-none -translate-x-1/2 opacity-[0.14] saturate-150 sm:w-[680px] lg:top-2 lg:w-[840px]"
            preload
          />

          <div className="mx-auto max-w-7xl px-5 pb-14 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-28">
            <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9BA3AF] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur">
                Malaysia-based software development company
              </div>
              <h1 className="mt-8 max-w-5xl text-5xl font-semibold tracking-normal text-[#F5F7FA] sm:text-6xl lg:text-8xl">
                Code. Connect. Create.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-[#D8DEE8] sm:text-xl sm:leading-9">
                Custom software, web and mobile applications, SaaS platforms,
                integrations, and automation solutions for modern businesses.
              </p>
              <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
                <GradientButton href="#contact">Start a Project</GradientButton>
                <GradientButton href="#services" variant="secondary">
                  View Services
                </GradientButton>
              </div>
              <div className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[8px] border border-white/[0.08] bg-[#080B10]/70 p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur"
                  >
                    <span className="block bg-[linear-gradient(100deg,#00C8FF,#8A2BFF,#FF7A00,#FFD000)] bg-clip-text text-2xl font-semibold text-transparent">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-[#9BA3AF]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Capabilities" className="border-b border-white/[0.08] bg-[#080B10]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-5 py-5 sm:px-6 lg:px-8">
            {capabilities.map((capability) => (
              <span
                key={capability}
                className="rounded-full border border-white/[0.08] bg-[#0D1117] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#C8D0DA] transition hover:border-[#00C8FF]/40 hover:text-white"
              >
                {capability}
              </span>
            ))}
          </div>
        </section>

        <section id="services" className="px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Services"
              title="Software development across products, platforms, apps, and automation."
              description="Static Silo designs and builds custom software for business operations, customer experiences, internal teams, digital products, integrations, and data-driven workflows."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="solutions"
          className="border-y border-white/[0.08] bg-[linear-gradient(180deg,#080B10_0%,#030405_100%)] px-5 py-20 sm:px-6 lg:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Solutions"
              title="Practical software for business, operations, and digital products."
              description="From internal tools to customer-facing platforms, every engagement is shaped around business value, maintainable code, clean user experience, and real-world usage."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {solutions.map((solution) => (
                <SolutionCard key={solution.title} solution={solution} />
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Process"
              title="Structured delivery from first conversation to live operations."
              description="The workflow keeps technical decisions visible, business priorities grounded, and implementation momentum aligned with measurable outcomes."
            />
            <div className="relative">
              <div className="absolute left-4 top-1 hidden h-px w-[calc(100%-2rem)] bg-[linear-gradient(90deg,#00C8FF,#2563FF,#8A2BFF,#FF2BD6,#FF7A00,#FFD000)] opacity-[0.45] md:block" />
              <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
                {processSteps.map((step, index) => (
                  <ProcessStep key={step.title} step={step} index={index} />
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="border-y border-white/[0.08] bg-[#080B10] px-5 py-20 sm:px-6 lg:px-8 lg:py-28"
        >
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative min-h-[320px] overflow-hidden rounded-[8px] border border-white/[0.08] bg-[#0D1117] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,200,255,0.18),rgba(138,43,255,0.10),rgba(255,122,0,0.12))]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.18]" />
              <Image
                src="/StaticSilo-1on1.png"
                alt="Static Silo logo"
                width={1254}
                height={1254}
                className="absolute left-1/2 top-1/2 w-[78%] max-w-[430px] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_40px_rgba(0,200,255,0.22)]"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00C8FF]">
                About Static Silo
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[#F5F7FA] sm:text-4xl lg:text-5xl">
                A software development partner for organisations that need better digital systems.
              </h2>
              <p className="mt-6 text-base leading-8 text-[#9BA3AF] sm:text-lg">
                Static Silo supports Malaysian businesses with custom software, web
                applications, mobile applications, SaaS platforms, integrations, automation,
                databases, reporting systems, and software consulting. The emphasis is on
                dependable products, clear documentation, maintainable code, and practical
                technology choices that fit the operating environment.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-[8px] border border-white/[0.08] bg-[#030405]/70 p-4"
                  >
                    <span className="block text-2xl font-semibold text-[#F5F7FA]">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-[#9BA3AF]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-5xl">
            <StartProjectCard />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.08] bg-[#080B10] px-5 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <LogoLockup />
            <p className="mt-4 max-w-md text-sm leading-7 text-[#9BA3AF]">
              Custom software, web applications, mobile applications, SaaS platforms,
              integrations, automation, and reporting systems for modern organisations.
            </p>
          </div>
          <div className="grid gap-8 text-sm sm:grid-cols-2">
            <div>
              <h2 className="font-semibold text-[#F5F7FA]">Contact</h2>
              <address className="mt-3 not-italic leading-7 text-[#9BA3AF]">
                Kuala Terengganu, Terengganu, Malaysia
                <br />
                <a className="transition hover:text-white" href="mailto:staticsilo@gmail.com">
                  staticsilo@gmail.com
                </a>
                <br />
                <span>CT0165206-X</span>
              </address>
            </div>
            <div>
              <h2 className="font-semibold text-[#F5F7FA]">Company</h2>
              <div className="mt-3 flex flex-col gap-2 text-[#9BA3AF]">
                {navLinks.map((link) => (
                  <a key={link.href} className="transition hover:text-white" href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-white/[0.08] pt-6 text-xs text-[#9BA3AF] sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2020 Static Silo. All rights reserved.</p>
          <p>Code. Connect. Create.</p>
        </div>
      </footer>
    </div>
  );
}
